import { ref, computed } from "vue";

import "github-markdown-css";
import "vitepress/dist/client/theme-default/styles/fonts.css";
import "vitepress/dist/client/theme-default/styles/utils.css";
import "vitepress/dist/client/theme-default/styles/vars.css";
import "vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "vitepress/dist/client/theme-default/styles/components/custom-block.css";

import mathjax3 from "markdown-it-mathjax3";

import anchorPlugin from "markdown-it-anchor";
import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTOC from "markdown-it-toc-done-right";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItDefList from "markdown-it-deflist";

import { containerPlugin } from "./plugins/containers";
import { preWrapperPlugin } from "./plugins/preWrapper";
import { highlight, updateOnReady } from "./plugins/highlighter";

// eslint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001f]/g;
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const rCombining = /[\u0300-\u036F]/g;

function slugify(str) {
  return (
    str
      .normalize("NFKD")
      // Remove accents
      .replace(rCombining, "")
      // Remove control characters
      .replace(rControl, "")
      // Replace special characters
      .replace(rSpecial, "-")
      // Remove continuous separators
      .replace(/-{2,}/g, "-")
      // Remove prefixing and trailing separators
      .replace(/^-+|-+$/g, "")
      // ensure it doesn't start with a number (#121)
      .replace(/^(\d)/, "_$1")
      // lowercase
      .toLowerCase()
  );
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight,
})
  .use(mathjax3)
  .use(preWrapperPlugin, { hasSingleTheme: true })
  .use(containerPlugin, { hasSingleTheme: true })
  .use(MarkdownItSub)
  .use(MarkdownItDefList)
  .use(MarkdownItSup)
  .use(MarkdownItFootnote)
  .use(MarkdownItTOC)
  .use(MarkdownItEmoji)
  .use(anchorPlugin, {
    slugify,
    permalink: anchorPlugin.permalink.linkInsideHeader({
      symbol: "&ZeroWidthSpace;",
      renderAttrs: (slug, state) => {
        // Find `heading_open` with the id identical to slug
        const idx = state.tokens.findIndex((token) => {
          const attrs = token.attrs;
          const id = attrs?.find((attr) => attr[0] === "id");
          return id && slug === id[1];
        });
        // Get the actual heading content
        const title = state.tokens[idx + 1].content;
        return {
          "aria-label": `Permalink to "${title}"`,
        };
      },
    }),
  });

export default {
  props: {
    content: {
      type: String,
      default: "**Hello** __World__",
    },
  },
  setup(props) {
    const ready = ref(false);
    updateOnReady(ready);
    const mdHTML = computed(
      () => ready.value && markdown.render(props.content)
    );
    return { mdHTML };
  },
  template: '<div class="markdown-body vp-doc" v-html="mdHTML" />',
};
