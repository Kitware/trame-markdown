#!/usr/bin/env -S uv run --script
"""
/// pyproject
#
# === Dependencies ===
#
# trame[app]
# trame-vuetify
# trame-markdown
#
# === Description ===
#
# This example demonstrates how to use the `trame.widgets.markdown.Markdown`
# component to display Markdown content from various files. It includes a
# dropdown to select different Markdown files and showcases rendering.
#
# The application is structured using a modern Trame 3 / Vue 3 class-based
# approach, inheriting from `trame.app.TrameApp`.
#
# === Usage ===
#
# 1. Ensure you have `uv` installed (`pip install uv`).
# 2. Run the script directly:
#    `./validation3.py` or `python validation3.py`
# 3. Alternatively, install dependencies manually and run:
#    `pip install trame trame-vuetify trame-markdown`
#    `python validation3.py`
#
# The script expects Markdown files (`demo.md`, `markdown.md`, `markdown-it.md`, `sample.md`)
# to be present in the same directory as `validation3.py`.
#
"""

from pathlib import Path

from trame.app import TrameApp
from trame.decorators import change
from trame.ui.vuetify3 import SinglePageLayout
from trame.widgets import markdown, vuetify3


class MarkdownViewerApp(TrameApp):
    def __init__(self, server_name="MarkdownViewerDemo"):
        super().__init__(server_name)
        self._initialize_state()
        self._build_ui()
        self.update_markdown_view()  # Load initial markdown file

    def _initialize_state(self):
        self.state.trame__title = "Markdown Viewer"
        # Ensure these files exist in the same directory as this script
        self.state.md_files_options = [
            "demo.md",
            "markdown.md",
            "markdown-it.md",
            "sample.md",
        ]
        self.state.active_md_file = self.state.md_files_options[0]
        self.state.current_markdown_text = ""

    def _build_ui(self):
        with SinglePageLayout(self.server, theme=("theme_mode", "light")) as layout:
            layout.title.set_text(self.state.trame__title)

            with layout.toolbar:
                vuetify3.VSpacer()
                vuetify3.VSelect(
                    v_model=("active_md_file", self.state.active_md_file),
                    items=("md_files_options", self.state.md_files_options),
                    dense=True,
                    hide_details=True,
                    style="max-width: 300px; margin-right: 16px;",
                )
                vuetify3.VCheckbox(
                    v_model=("theme_mode", "light"),
                    true_icon="mdi-lightbulb-off-outline",
                    false_icon="mdi-lightbulb-outline",
                    true_value="dark",
                    false_value="light",
                    classes="mx-1",
                    hide_details=True,
                    dense=True,
                )

            with layout.content:
                with vuetify3.VContainer(fluid=True, classes="pa-4"):
                    md = markdown.Markdown(
                        classes="pa-4 mx-2",
                        theme="(self.state.theme_mode ? 'dark' : 'light')",
                    )
                    self.ctrl.md_update = md.update

    @change("active_md_file")
    def update_markdown_view(self, **kwargs):
        file_path = Path(__file__).parent / self.state.active_md_file
        if file_path.exists():
            with open(file_path, encoding="utf-8") as f:
                self.ctrl.md_update(f.read())
        else:
            self.ctrl.md_update(f"# Error\n\nFile not found: `{self.state.active_md_file}`")

    @change("theme_mode")
    def update_theme_mode(self, **kwargs):
        self.update_markdown_view()

if __name__ == "__main__":
    app = MarkdownViewerApp()
    app.server.start()