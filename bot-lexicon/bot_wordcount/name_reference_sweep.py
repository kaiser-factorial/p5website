"""
name_reference_sweep.py
-----------------------
Scans both bots' full NOSTOP vocabularies for every word that contains
"mauk" or "abaci" as a substring, prints a ranked table, and saves a
detailed CSV for further inspection.

    python bot_wordcount/name_reference_sweep.py
"""

import csv
import os

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE    = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(BASE, "results")

FILES = {
    "MAUK":  os.path.join(RESULTS, "MAUK",  "mauk_full_NOSTOP_5_10_2026.csv"),
    "ABACI": os.path.join(RESULTS, "ABACI", "abaci_full_NOSTOP_5_10_2026.csv"),
}

TARGETS = ["mauk", "abaci"]   # substrings to search for
# ─────────────────────────────────────────────────────────────────────────────


def load_vocab(path: str) -> dict[str, int]:
    """Return {word: count} from a word,count CSV."""
    vocab = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            word = row["word"].strip().lower()
            if word:
                vocab[word] = int(row["count"])
    return vocab


def sweep(vocab: dict[str, int], targets: list[str]) -> dict[str, list[tuple[str, int]]]:
    """For each target string, collect all (word, count) pairs that contain it."""
    hits: dict[str, list[tuple[str, int]]] = {t: [] for t in targets}
    for word, count in vocab.items():
        for t in targets:
            if t in word:
                hits[t].append((word, count))
    # sort by count desc, then word asc
    for t in targets:
        hits[t].sort(key=lambda x: (-x[1], x[0]))
    return hits


def print_table(bot: str, target: str, hits: list[tuple[str, int]]) -> None:
    if not hits:
        print(f"    (none)")
        return
    total_count = sum(c for _, c in hits)
    print(f"    {'word':<30} {'n':>6}")
    print(f"    {'-'*30} {'------':>6}")
    for word, count in hits:
        marker = " ◀ exact" if word == target else ""
        print(f"    {word:<30} {count:>6,}{marker}")
    print(f"    {'─'*30} {'──────':>6}")
    print(f"    {'TOTAL matches':<30} {len(hits):>6,}  (sum of counts: {total_count:,})")


def save_csv(rows: list[dict], path: str) -> None:
    if not rows:
        return
    fieldnames = ["bot", "target", "word", "count", "is_exact"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\n  ✓ Saved full results → {path}")


def main():
    print("\n── Name-reference sweep ─────────────────────────────────────────────\n")

    all_rows: list[dict] = []

    for bot, path in FILES.items():
        print(f"  [{bot}]  loading {os.path.basename(path)} …")
        vocab = load_vocab(path)
        hits  = sweep(vocab, TARGETS)

        for target in TARGETS:
            label = f"self" if target == bot.lower() else f"other ({target})"
            print(f"\n  [{bot}] — substring '{target}'  [{label}]  "
                  f"({len(hits[target])} matching vocab entries)")
            print_table(bot, target, hits[target])

            for word, count in hits[target]:
                all_rows.append({
                    "bot":      bot,
                    "target":   target,
                    "word":     word,
                    "count":    count,
                    "is_exact": word == target,
                })

        print()

    # ── Summary: exact references only ───────────────────────────────────────
    print("\n── Exact-name reference summary ─────────────────────────────────────")
    print(f"  {'bot':<8} {'target':<8} {'exact count':>12}  {'role'}")
    print(f"  {'─'*8} {'─'*8} {'─'*12}  {'─'*12}")
    for row in all_rows:
        if row["is_exact"]:
            role = "self" if row["target"] == row["bot"].lower() else "other"
            print(f"  {row['bot']:<8} {row['target']:<8} {row['count']:>12,}  {role}")

    # ── Save ─────────────────────────────────────────────────────────────────
    out_path = os.path.join(RESULTS, "name_reference_sweep.csv")
    save_csv(all_rows, out_path)
    print("\nDone.")


if __name__ == "__main__":
    main()
