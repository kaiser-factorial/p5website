import os

files = [
    'about.html', 'capstone.html', 'datascience.html', 
    'p4catchfall.html', 'p5js.html', 'p5spikes.html', 'page1contact.html', 
    'page2.html', 'page3sketchpad.html', 'project1.html', 'sketchpadNoML.html',
    'photography.html'
]

# New display name: "Vat Lexicon"
new_dropdown_link = '                        <li><a href="bot-lexicon-portal.html">Vat Lexicon MapReduce Visualizer</a></li>'

for filename in files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r') as f:
        content = f.read()
    
    # Target existing "Bot Lexicon" link if it exists
    old_link = '<li><a href="bot-lexicon-portal.html">Bot Lexicon MapReduce Visualizer</a></li>'
    if old_link in content:
         content = content.replace(old_link, new_dropdown_link)
    else:
        # If it doesn't exist, use the capstone link as a reference point to add it
        target = '<li><a href="capstone.html">Rate My Professor Data Analysis & Modeling</a></li>'
        if target in content:
            if 'bot-lexicon-portal.html' not in content:
                content = content.replace(target, target + '\n' + new_dropdown_link)
            
    with open(filename, 'w') as f:
        f.write(content)

# Special case for index.html (User already manually updated, but let's be consistent)
if os.path.exists('index.html'):
    with open('index.html', 'r') as f:
        content = f.read()
    
    # Ensure it says "Vat Lexicon"
    if '<li><a href="bot-lexicon-portal.html">Bot Lexicon</a></li>' in content:
        content = content.replace('<li><a href="bot-lexicon-portal.html">Bot Lexicon</a></li>', 
                                '<li><a href="bot-lexicon-portal.html">Vat Lexicon</a></li>')
    
    with open('index.html', 'w') as f:
        f.write(content)

print("Updated navigation links to 'Vat Lexicon' in all files.")
