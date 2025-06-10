import { ref, watchEffect, onMounted, nextTick } from "vue";

import "github-markdown-css";
import "vitepress/dist/client/theme-default/styles/fonts.css";
import "vitepress/dist/client/theme-default/styles/utils.css";
import "vitepress/dist/client/theme-default/styles/vars.css";
import "vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "vitepress/dist/client/theme-default/styles/components/custom-block.css";
import 'katex/dist/katex.min.css';

import anchorPlugin from "markdown-it-anchor";
import MarkdownIt from "markdown-it";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTOC from "markdown-it-toc-done-right";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItDefList from "markdown-it-deflist";
import AmIt from '@widcardw/markdown-it-asciimath';
import markdownItFontawesome from '@kazumatu981/markdown-it-fontawesome';

import { containerPlugin } from "./plugins/containers";
import { preWrapperPlugin } from "./plugins/preWrapper";
import { highlight, updateOnReady } from "./plugins/highlighter";
import markdownItMermaid from 'markdown-it-mermaid';
import "../../css/light.css";
import mermaid from 'mermaid';

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
  .use(AmIt, {
    block: ['asciimath', 'ASCIIMath', 'am', 'math'], // Be explicit with casing
    inline: { open: '``', close: '``' },
    enableOriginalKatex: true
  })
  .use(preWrapperPlugin, { hasSingleTheme: true })
  .use(containerPlugin, { hasSingleTheme: true })
  .use(MarkdownItSub)
  .use(MarkdownItDefList)
  .use(MarkdownItSup)
  .use(MarkdownItFootnote)
  .use(MarkdownItTOC)
  .use(MarkdownItEmoji)
  .use(markdownItMermaid)
  .use(markdownItFontawesome)
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
    const mdHTML = ref("Loading...");
    updateOnReady(ready);

    onMounted(async () => {
      // Dynamically load Font Awesome CSS if not already present
      const faCssId = 'font-awesome-css';
      if (!document.getElementById(faCssId)) {
        const link = document.createElement('link');
        link.id = faCssId;
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
        link.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';
        link.crossOrigin = 'anonymous';
        link.referrerPolicy = 'no-referrer';
        document.head.appendChild(link);
      }
      mermaid.initialize({
        startOnLoad: false, // We'll trigger it manually
        // theme: 'neutral' // Optional: example theme, like 'neutral', 'dark', 'forest', 'default'
      });
      // Add markdown rendering and typesetting logic, similar to watchEffect
      if (props.content && ready.value) { // Check if content and highlighter are ready
        mdHTML.value = markdown.render(props.content);
        await nextTick();
        try {
          const mermaidElements = document.querySelectorAll('pre.mermaid, div.mermaid');
          if (mermaidElements.length) {
            mermaid.run({ nodes: mermaidElements });
          }
        } catch (e) {
          console.error("Error running mermaid on mount:", e);
        }
      } else if (ready.value) { // If highlighter ready but no content
        mdHTML.value = "";
      }
    });

    watchEffect(async () => {
      ready.value; // Access to re-execute when syntax highlighter is fully loaded
      mdHTML.value = markdown.render(props.content);
      // Wait for Vue to update the DOM with the new mdHTML
      await nextTick();
      try {
        // Tell mermaid to render any diagrams it finds
        // The plugin usually wraps mermaid code in <pre class="mermaid"> or <div class="mermaid">
        const mermaidElements = document.querySelectorAll('pre.mermaid, div.mermaid'); // Adjusted selector
        if (mermaidElements.length) {
          mermaid.run({ nodes: mermaidElements });
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    });

    return { mdHTML };
  },
  template: '<div class="markdown-body vp-doc" v-html="mdHTML" />',
};
