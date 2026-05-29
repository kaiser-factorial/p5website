import os
import re

files = [
    'about.html', 'capstone.html', 'datascience.html', 
    'p4catchfall.html', 'p5js.html', 'page1contact.html', 
    'page2.html', 'project1.html',
    'photography.html', 'bot-lexicon-portal.html', 'index.html'
]

# 1. Update dropdowns in subpages
dropdown_pattern = r'(<li><a href="project1\.html">.*?</a></li>\s*<li><a href="capstone\.html">.*?</a></li>\s*<li><a href="bot-lexicon-portal\.html">.*?</a></li>)'

def reorder_dropdown(match):
    # Extract the individual <li> blocks
    items = re.findall(r'<li><a href=".*?">.*?</a></li>', match.group(1))
    if len(items) == 3:
        # New order: Lexicon (2), Capstone (1), Movies (0)
        return f"{items[2]}\n                        {items[1]}\n                        {items[0]}"
    return match.group(1)

# 2. Update home page list in index.html
home_pattern = r'(<li><a href="datascience\.html">Data Science</a></li>\s*<li><a href="bot-lexicon-portal\.html">Vat Lexicon</a></li>)'

def reorder_home(match):
    items = re.findall(r'<li><a href=".*?">.*?</a></li>', match.group(1))
    if len(items) == 2:
        # New order: Lexicon (1), Data Science (0)
        return f"{items[1]}\n                    {items[0]}"
    return match.group(1)

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r') as f:
        content = f.read()
    
    if filename == 'index.html':
        new_content = re.sub(home_pattern, reorder_home, content, flags=re.DOTALL)
    else:
        new_content = re.sub(dropdown_pattern, reorder_dropdown, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")

print("Navigation reordered to reverse-chronological.")
