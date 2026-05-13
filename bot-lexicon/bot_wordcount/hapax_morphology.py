"""
hapax_morphology.py
-------------------
Tests whether MAUK's hapax legomena are more morphologically structured
than ABACI's by computing the nearest-neighbour edit distance from each
nonce word (alpha-only, count=1, not in the English dictionary) to any
word in the NLTK words corpus.

Hypothesis: MAUK (poetry-trained) generates neologisms that are close
morphological mutations of real words; ABACI (math-trained) generates
noisier, further-from-real-word forms.

    pip install rapidfuzz tqdm
    python bot_wordcount/hapax_morphology.py
"""

import csv
import os
import sys
import time
from collections import defaultdict

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

try:
    from rapidfuzz.distance import Levenshtein
    from rapidfuzz import process as rfz_process
except ImportError:
    sys.exit("Run: pip install rapidfuzz")

try:
    from tqdm import tqdm
except ImportError:
    sys.exit("Run: pip install tqdm")

import nltk
nltk.download("words", quiet=True)
from nltk.corpus import words as nltk_words

# ── Config ────────────────────────────────────────────────────────────────────
BASE    = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(BASE, "results")

FILES = {
    "MAUK":  os.path.join(RESULTS, "MAUK",  "mauk_full_NOSTOP_5_10_2026.csv"),
    "ABACI": os.path.join(RESULTS, "ABACI", "abaci_full_NOSTOP_5_10_2026.csv"),
}

BOTS = {
    "MAUK":  {"color": "#03A6A1", "accent": "#027A77"},
    "ABACI": {"color": "#FF9D23", "accent": "#CC6F00"},
}

MAX_DIST   = 5   # distances > MAX_DIST are bucketed as "5+"
# ─────────────────────────────────────────────────────────────────────────────


# ── Dictionary setup ──────────────────────────────────────────────────────────
print("\nBuilding dictionary index …")
DICT_SET = {w.lower() for w in nltk_words.words() if w.isalpha()}
DICT_LIST_BY_LEN: dict[int, list[str]] = defaultdict(list)
for w in DICT_SET:
    DICT_LIST_BY_LEN[len(w)].append(w)
print(f"  {len(DICT_SET):,} words in NLTK corpus")


def nearest_dist(word: str) -> int:
    """Return the edit distance to the closest NLTK dictionary word.
    Candidates are pre-filtered to lengths [len(word)-MAX_DIST, len(word)+MAX_DIST]
    since |len(a)-len(b)| is a lower bound on Levenshtein distance.
    Returns MAX_DIST+1 if no match found within MAX_DIST edits.
    """
    n = len(word)
    candidates: list[str] = []
    for delta in range(MAX_DIST + 1):
        candidates.extend(DICT_LIST_BY_LEN.get(n + delta, []))
        if delta > 0:
            candidates.extend(DICT_LIST_BY_LEN.get(n - delta, []))

    if not candidates:
        return MAX_DIST + 1

    result = rfz_process.extractOne(
        word,
        candidates,
        scorer=Levenshtein.distance,
        score_cutoff=MAX_DIST,
    )
    return result[1] if result is not None else MAX_DIST + 1


# ── CSV loading ───────────────────────────────────────────────────────────────
def load_hapaxes(path: str) -> list[str]:
    """Load alpha-only, count=1 words that are NOT in the English dictionary."""
    hapaxes = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            word  = row["word"].strip().lower()
            count = int(row["count"])
            if count == 1 and word.isalpha() and word not in DICT_SET:
                hapaxes.append(word)
    return hapaxes


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    all_csv_rows: list[dict] = []
    bot_distances: dict[str, list[int]] = {}

    for bot, path in FILES.items():
        print(f"\n[{bot}] Loading hapaxes from {os.path.basename(path)} …")
        hapaxes = load_hapaxes(path)
        print(f"  {len(hapaxes):,} alpha-only nonce hapaxes (not in NLTK dict)")

        distances: list[int] = []
        t0 = time.time()

        for word in tqdm(hapaxes, desc=f"  {bot} edit-dist", unit="word", ncols=80):
            d = nearest_dist(word)
            distances.append(d)
            # Find the actual nearest word for the CSV (only if close enough)
            n = len(word)
            candidates: list[str] = []
            for delta in range(min(d, MAX_DIST) + 1):
                candidates.extend(DICT_LIST_BY_LEN.get(n + delta, []))
                if delta > 0:
                    candidates.extend(DICT_LIST_BY_LEN.get(n - delta, []))
            nearest_result = rfz_process.extractOne(
                word, candidates,
                scorer=Levenshtein.distance,
                score_cutoff=d,
            ) if candidates else None
            nearest_word = nearest_result[0] if nearest_result else ""

            all_csv_rows.append({
                "bot":          bot,
                "hapax":        word,
                "nearest_word": nearest_word,
                "edit_dist":    d if d <= MAX_DIST else f"{MAX_DIST}+",
            })

        elapsed = time.time() - t0
        bot_distances[bot] = distances

        # Summary stats
        finite = [d for d in distances if d <= MAX_DIST]
        print(f"\n  ── {bot} summary ──")
        print(f"  Total nonce hapaxes:          {len(distances):>7,}")
        print(f"  Within {MAX_DIST} edits of a real word: {len(finite):>7,}  "
              f"({len(finite)/len(distances)*100:.1f}%)")
        if finite:
            print(f"  Mean dist (within {MAX_DIST}):          {np.mean(finite):>7.3f}")
            print(f"  Median dist (within {MAX_DIST}):        {np.median(finite):>7.1f}")
        print(f"  Elapsed: {elapsed:.1f}s")

    # ── Save CSV ──────────────────────────────────────────────────────────────
    csv_path = os.path.join(RESULTS, "hapax_morphology.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["bot", "hapax", "nearest_word", "edit_dist"])
        writer.writeheader()
        writer.writerows(all_csv_rows)
    print(f"\n  ✓ Saved full results → {csv_path}")

    # ── Plot ──────────────────────────────────────────────────────────────────
    print("\nGenerating histogram …")
    bucket_labels = [str(i) for i in range(1, MAX_DIST + 1)] + [f"{MAX_DIST}+"]
    n_buckets = len(bucket_labels)

    fig, ax = plt.subplots(figsize=(12, 6))
    fig.patch.set_facecolor("#0F1117")
    ax.set_facecolor("#0F1117")

    x      = np.arange(n_buckets)
    bar_w  = 0.35
    spine_color = "#2A2D3A"

    for i, (bot, distances) in enumerate(bot_distances.items()):
        style = BOTS[bot]
        counts = np.zeros(n_buckets, dtype=int)
        for d in distances:
            idx = min(d, MAX_DIST + 1) - 1   # bucket index (0-based)
            counts[idx] += 1
        pct = counts / len(distances) * 100

        offset = (i - 0.5) * bar_w
        bars = ax.bar(x + offset, pct, bar_w,
                      color=style["color"], alpha=0.88,
                      label=bot, zorder=3)
        for bar, p in zip(bars, pct):
            if p > 0.4:
                ax.text(bar.get_x() + bar.get_width() / 2,
                        bar.get_height() + 0.3,
                        f"{p:.1f}%",
                        ha="center", va="bottom",
                        color=style["color"], fontsize=7.5, fontweight="bold")

    # Styling
    for spine in ax.spines.values():
        spine.set_color(spine_color)
    ax.tick_params(colors="#C8CBD8", labelsize=10)
    ax.set_xticks(x)
    ax.set_xticklabels(bucket_labels, color="#C8CBD8", fontsize=10)
    ax.set_xlabel("Edit distance to nearest real English word", color="#C8CBD8",
                  fontsize=11, labelpad=10)
    ax.set_ylabel("% of nonce hapaxes", color="#C8CBD8", fontsize=11, labelpad=10)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"{v:.0f}%"))
    ax.grid(axis="y", color="#1E2030", linewidth=0.7, zorder=0)

    # Legend
    legend = ax.legend(
        loc="upper right",
        framealpha=0.15, edgecolor=spine_color,
        labelcolor="white", fontsize=10,
    )

    fig.text(0.5, 0.97,
             "Hapax Morphological Structure — Edit Distance to Nearest Real Word",
             ha="center", va="top",
             fontsize=14, fontweight="bold", color="white")
    fig.text(0.5, 0.925,
             f"Alpha-only nonce hapaxes (count=1, not in NLTK words corpus)  ·  "
             f"Max reported distance: {MAX_DIST}+",
             ha="center", va="top",
             fontsize=9, color="#8B90A8")

    plt.tight_layout(rect=[0, 0, 1, 0.91])

    out_path = os.path.join(RESULTS, "hapax_morphology.png")
    fig.savefig(out_path, dpi=160, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  ✓ Saved histogram → {out_path}")
    print("\nDone.")


if __name__ == "__main__":
    main()
