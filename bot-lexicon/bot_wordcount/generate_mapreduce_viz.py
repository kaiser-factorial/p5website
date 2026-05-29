"""
generate_mapreduce_viz.py
-------------------------
Reads both bot NOSTOP vocab CSVs, selects a 500-word sample, and writes
a self-contained mapreduce_viz.html file with the data embedded.

    python bot_wordcount/generate_mapreduce_viz.py
"""

import csv
import json
import os

BASE    = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(BASE, "results")

FILES = {
    "mauk":  os.path.join(RESULTS, "MAUK",  "mauk_full_NOSTOP_5_10_2026.csv"),
    "abaci": os.path.join(RESULTS, "ABACI", "abaci_full_NOSTOP_5_10_2026.csv"),
}


def load_vocab(path):
    vocab = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            w = row["word"].strip().lower()
            if w.isalpha() and 2 <= len(w) <= 20:
                vocab[w] = int(row["count"])
    return vocab


def build_sample(n_shared=200, n_mauk=150, n_abaci=150):
    mauk  = load_vocab(FILES["mauk"])
    abaci = load_vocab(FILES["abaci"])

    shared     = set(mauk) & set(abaci)
    mauk_only  = set(mauk) - shared
    abaci_only = set(abaci) - shared

    words = []

    for w in sorted(shared, key=lambda w: mauk[w] + abaci[w], reverse=True)[:n_shared]:
        words.append({"word": w, "mauk_count": mauk[w], "abaci_count": abaci[w], "source": "shared"})

    for w in sorted(mauk_only, key=lambda w: mauk[w], reverse=True)[:n_mauk]:
        words.append({"word": w, "mauk_count": mauk[w], "abaci_count": 0, "source": "mauk_only"})

    for w in sorted(abaci_only, key=lambda w: abaci[w], reverse=True)[:n_abaci]:
        words.append({"word": w, "mauk_count": 0, "abaci_count": abaci[w], "source": "abaci_only"})

    words.sort(key=lambda x: x["word"])
    return words


def main():
    print("Selecting word sample …")
    words = build_sample()
    print(f"  {len(words)} words selected "
          f"({sum(1 for w in words if w['source']=='shared')} shared, "
          f"{sum(1 for w in words if w['source']=='mauk_only')} MAUK-only, "
          f"{sum(1 for w in words if w['source']=='abaci_only')} ABACI-only)")

    word_data_js = json.dumps(words)

    html_template_path = os.path.join(BASE, "mapreduce_viz_template.html")
    out_path           = os.path.join(BASE, "mapreduce_viz.html")

    with open(html_template_path, "r", encoding="utf-8") as f:
        template = f.read()

    html = template.replace("__WORD_DATA__", word_data_js)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"  ✓ Saved → {out_path}")
    print("\nOpen mapreduce_viz.html in your browser.")


if __name__ == "__main__":
    main()
