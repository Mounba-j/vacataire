import pathlib
import re

root = pathlib.Path('src/components/ui')
files = list(root.rglob('*.[tT][sx]'))
count = 0
for path in files:
    text = path.read_text(encoding='utf-8')
    new_text = re.sub(r'from\s+"([^"\n]+@[^"\n]+)"', lambda m: f'from "{m.group(1).split("@")[0]}"', text)
    new_text = re.sub(r'import\s+\{([^}]+)\}\s+from\s+"([^"\n]+@[^"\n]+)"', lambda m: f'import {{{m.group(1)}}} from "{m.group(2).split("@")[0]}"', new_text)
    new_text = re.sub(r'import\s+\*\s+as\s+([^\s]+)\s+from\s+"([^"\n]+@[^"\n]+)"', lambda m: f'import * as {m.group(1)} from "{m.group(2).split("@")[0]}"', new_text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print('fixed', path)
        count += 1
print('updated files:', count)
