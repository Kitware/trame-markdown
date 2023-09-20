from pathlib import Path

serve_path = str(Path(__file__).with_name("serve").resolve())
serve = {"__trame_markdown": serve_path}
scripts = ["__trame_markdown/trame-markdown.umd.js"]
styles = ["__trame_markdown/style.css"]
vue_use = ["trame_markdown"]
