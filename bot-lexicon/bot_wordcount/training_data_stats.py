"""
training_data_stats.py
----------------------
Word count + stats for synthetic_convos.txt, broken down per bot and overall.
No Spark needed — pure Python.
"""

import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

INPUT_FILE  = "/Users/corinakaiser/Desktop/VAT/brain-vat-training/training/gpt2/synthetic_convos.txt"
OUTPUT_DIR  = "/Users/corinakaiser/Desktop/VAT/bot-lexicon/bot_wordcount/results"
TOP_N = 20

STOP_WORDS = {
    "a","an","the","and","but","or","nor","for","yet","so","although","because",
    "since","while","though","of","in","to","for","with","on","at","from","by",
    "about","as","into","through","during","before","after","above","below",
    "between","out","off","over","under","again","then","once","here","there",
    "up","down","i","me","my","myself","we","our","ours","ourselves","you","your",
    "yours","yourself","yourselves","he","him","his","himself","she","her","hers",
    "herself","it","its","itself","they","them","their","theirs","themselves",
    "what","which","who","whom","this","that","these","those","is","are","was",
    "were","be","been","being","have","has","had","having","do","does","did",
    "doing","will","would","shall","should","may","might","must","can","could",
    "am","get","got","let","put","say","said","not","no","never","neither","nor",
    "dont","doesnt","didnt","cant","wont","wouldnt","shouldnt","isnt","arent",
    "wasnt","werent","havent","hasnt","hadnt","im","ive","id","ill","youre",
    "youve","youd","youll","hes","shes","its","weve","wed","well","theyre",
    "theyve","thats","theres","ok","okay","yeah","yes","yep","nope","oh","ah",
    "um","uh","like","just","also","even","still","already","now","really",
    "actually","basically","literally","so","too","very","quite","rather",
    "pretty","much","more","most","some","any","all","both","each","few","many",
    "other","same","such","than","then","when","where","why","how","if","only",
    "own","new","first","last","long","great","little","right","make","look",
    "know","think","go","come","see","use","find","give","tell","feel","try",
    "ask","seem","leave","call","keep","need","want","mean","become","show",
    "take","help","start","","s","t","re","ve","ll","d",
}


def tokenize(text: str) -> list[str]:
    text = text.lower()
    text = text.replace("'", "").replace("’", "")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return [w for w in text.split() if w not in STOP_WORDS and len(w) > 1]


def stats_block(label: str, lines: list[str], out):
    """Print stats to stdout and also write to file handle `out`."""
    def p(s=""):
        print(s)
        out.write(s + "\n")

    if not lines:
        p(f"\n  {label}: no lines found.\n")
        return

    all_tokens = []
    per_line_counts = []
    for line in lines:
        tokens = tokenize(line)
        all_tokens.extend(tokens)
        per_line_counts.append(len(tokens))

    total_lines  = len(lines)
    total_words  = sum(per_line_counts)
    unique_words = len(set(all_tokens))
    avg_words    = total_words / total_lines if total_lines else 0
    min_words    = min(per_line_counts)
    max_words    = max(per_line_counts)
    top_words    = Counter(all_tokens).most_common(TOP_N)

    p(f"\n{'='*60}")
    p(f"  {label}")
    p(f"{'='*60}")
    p(f"  Lines (chunks)  : {total_lines:,}")
    p(f"  Total words     : {total_words:,}  (excl. stop words)")
    p(f"  Unique words    : {unique_words:,}")
    p(f"  Avg words/line  : {avg_words:.1f}")
    p(f"  Min words/line  : {min_words}")
    p(f"  Max words/line  : {max_words}")
    p(f"\n  Top {TOP_N} words:")
    p(f"  {'Rank':<6} {'Word':<30} {'Count':>8}")
    p(f"  {'-'*47}")
    for rank, (word, count) in enumerate(top_words, 1):
        p(f"  {rank:<6} {word:<30} {count:>8,}")


def main():
    with open(INPUT_FILE, encoding="utf-8") as f:
        raw_lines = [l.rstrip() for l in f if l.strip()]

    mauk_lines  = [l[len("[MAUK]: "):] for l in raw_lines if l.startswith("[MAUK]:")]
    abaci_lines = [l[len("[ABACI]: "):] for l in raw_lines if l.startswith("[ABACI]:")]
    all_lines   = [re.sub(r"^\[(MAUK|ABACI)\]:\s*", "", l) for l in raw_lines]

    # Set up timestamped output file
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    timestamp   = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = Path(OUTPUT_DIR) / f"stats_{timestamp}.txt"

    with open(output_path, "w", encoding="utf-8") as out:
        header = f"Training Data Stats — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\nSource: {INPUT_FILE}\n"
        print(header)
        out.write(header + "\n")

        stats_block("MAUK",               mauk_lines,  out)
        stats_block("ABACI",              abaci_lines, out)
        stats_block("OVERALL (both bots)", all_lines,  out)

        footer = f"\n{'='*60}\n  Line split: {len(mauk_lines):,} MAUK  |  {len(abaci_lines):,} ABACI  |  {len(all_lines):,} total\n{'='*60}\n"
        print(footer)
        out.write(footer)

    print(f"\n💾 Results saved to: {output_path}")


if __name__ == "__main__":
    main()
