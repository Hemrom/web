import os, re

frontend = r'e:\web-aplikasi\smkn1kras.sch.id\views\frontend'

replacements = [
    ('padding: 10rem 0 6rem', 'padding: 5rem 0 2.5rem'),
    ('padding: 10rem 0 4rem', 'padding: 5rem 0 2.5rem'),
    ('padding: 9rem 0 6rem',  'padding: 5rem 0 2.5rem'),
    ('padding: 9rem 0 5rem',  'padding: 5rem 0 2.5rem'),
    ('padding: 9rem 0 4rem',  'padding: 5rem 0 2.5rem'),
    ('padding: 8rem 0 4rem',  'padding: 4.5rem 0 2rem'),
    ('padding: 8rem 0 3rem',  'padding: 4.5rem 0 2rem'),
    ('padding: 7rem 0 5rem',  'padding: 4rem 0 2rem'),
    # page-title font size dikecilkan sedikit
    ('font-size: 3.5rem',     'font-size: 2.2rem'),
]

count = 0
for fname in os.listdir(frontend):
    if not fname.endswith('.ejs'):
        continue
    fpath = os.path.join(frontend, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
    
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated: {fname}')
        count += 1

print(f'\nTotal: {count} files updated')
