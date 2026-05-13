# bot-lexicon

Interactive MapReduce visualization and linguistic analysis of the MAUK and ABACI bot vocabularies.

[**Launch Visualizer**](https://kaiser-factorial.github.io/bot-lexicon/)

## Overview

This project visualizes the MapReduce pipeline used to analyze linguistic divergence between two AI models:
- **MAUK**: Trained primarily on poetry and math.
- **ABACI**: Trained primarily on math and technical documentation.

The visualization tracks ~66,000 unique words from the models' shared and independent vocabularies as they flow from the data source through mappers and alphabetical shuffle lanes into the final reducer.

## Features

- **4-Stage Visualization**: Watch words flow from Supabase → Mappers → Shuffle → Reducer.
- **Bucket Mode**: Toggle to observe word accumulation at the shuffle stage before reduction.
- **Comparative Analysis**: Live counters for Map outputs vs. Unique keys reduced.
- **Lexicon Browser**: Explore the full vocabulary sorted by frequency, highlighting dominant usage by either bot.

## Development

The vocabulary data is pre-processed from raw CSV logs using `generate_data.py`, which produces:
- `words.json`: The full word list with counts and bot ownership.
- `stats.json`: Summary statistics and frequency distribution buckets.

To run locally:
```bash
python -m http.server
```

## Data Source
Vocabulary derived from `NOSTOP` full-vocabulary counts (filtered to alphabetic tokens only) dated May 10, 2026.
