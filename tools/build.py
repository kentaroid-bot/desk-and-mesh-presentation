"""Build an allowlisted static directory for Cloudflare Pages."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
FILES = ('index.html', 'favicon.svg', '404.html', '_headers')

def build():
    target = ROOT / 'dist'
    if target.is_symlink():
        raise RuntimeError('dist must not be a symlink')
    if target.exists():
        shutil.rmtree(target)
    target.mkdir()
    for name in FILES:
        shutil.copyfile(ROOT / name, target / name)
    print('Built dist/: ' + ', '.join(FILES))

if __name__ == '__main__':
    build()
