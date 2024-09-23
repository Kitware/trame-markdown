import os
from pathlib import Path
from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import markdown, html

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

state, ctrl = server.state, server.controller

markdown.theme_light()


@state.change("file_name")
def update_md(file_name, **kwargs):
    txt = Path(__file__).with_name(file_name).read_text()
    ctrl.md_update(txt)


MD_FILES = ["markdown.md", "markdown-it.md", "demo.md", "sample.md"]

with DivLayout(server) as layout:
    with html.Select(v_model=("file_name", MD_FILES[0])):
        for name in MD_FILES:
            html.Option(name)
    html.Button("Refresh", click=(update_md, "[file_name]"))
    md = markdown.Markdown(style="padding: 20px;")
    ctrl.md_update = md.update

if __name__ == "__main__":
    server.start()
