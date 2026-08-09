# Site Info

First made by Corina Kaiser during Fall 2025 at NYU Tandon for DM-GY 6063. 

## Design credit

The desktop navigation's folder-tab treatment is inspired by the [Puxel Tabs component](https://github.com/lumpenspace/puxel/blob/main/src/components/Tabs.tsx) by lumpenspace. The portfolio uses its own static HTML, CSS, and JavaScript implementation.


# Legal

I am not liable for any misfortune that may come from your usage of this website. 


## How to Run

Run the workspace launcher from the Portfolio directory:

```sh
dev start portfolio --detach --json --yes
```

Open the URL reported when the server is ready. Direct file access may not
exercise all navigation and interactive behavior.

## Route policy

- The canonical academic report archives live at
  `reports/rate-my-professor.html` and `reports/movie-ratings.html`, with their
  exported image folders alongside them. The historic root report URLs remain
  as short redirect aliases for existing links.
- `ising_model.html` and `grid_bg.html` are intentionally retained as standalone
  experimental demos.
- Retired transition mocks are removed from deployment. The old comments route
  and duplicate `CatchFall/index.html` game entry point redirect to their
  canonical replacements.
- The linked Pixel Chase original course writeup is intentionally retained as
  a source archive alongside the adapted build journal.
