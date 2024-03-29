import { getHighlighter, setWasm, setCDN } from "shiki";

setWasm("__trame_markdown");
setCDN("__trame_markdown");

const LANG_NAMES = [
  "abap",
  "actionscript-3",
  "ada",
  "apache",
  "apex",
  "apl",
  "applescript",
  "ara",
  "asm",
  "astro",
  "awk",
  "ballerina",
  "bat",
  "batch",
  "beancount",
  "berry",
  "be",
  "bibtex",
  "bicep",
  "blade",
  "c",
  "cadence",
  "cdc",
  "clarity",
  "clojure",
  "clj",
  "cmake",
  "cobol",
  "codeql",
  "ql",
  "coffee",
  "cpp",
  "crystal",
  "csharp",
  "c#",
  "cs",
  "css",
  "cue",
  "cypher",
  "cql",
  "d",
  "dart",
  "dax",
  "diff",
  "docker",
  "dockerfile",
  "dream-maker",
  "elixir",
  "elm",
  "erb",
  "erlang",
  "erl",
  "fish",
  "fsharp",
  "f#",
  "fs",
  "gdresource",
  "gdscript",
  "gdshader",
  "gherkin",
  "git-commit",
  "git-rebase",
  "glimmer-js",
  "gjs",
  "glimmer-ts",
  "gts",
  "glsl",
  "gnuplot",
  "go",
  "graphql",
  "groovy",
  "hack",
  "haml",
  "handlebars",
  "hbs",
  "haskell",
  "hs",
  "hcl",
  "hjson",
  "hlsl",
  "html",
  "http",
  "imba",
  "ini",
  "properties",
  "java",
  "javascript",
  "js",
  "jinja-html",
  "jison",
  "json",
  "json5",
  "jsonc",
  "jsonl",
  "jsonnet",
  "jssm",
  "fsl",
  "jsx",
  "julia",
  "kotlin",
  "kusto",
  "kql",
  "latex",
  "less",
  "liquid",
  "lisp",
  "logo",
  "lua",
  "make",
  "makefile",
  "markdown",
  "md",
  "marko",
  "matlab",
  "mdc",
  "mdx",
  "mermaid",
  "mojo",
  "narrat",
  "nar",
  "nextflow",
  "nf",
  "nginx",
  "nim",
  "nix",
  "objective-c",
  "objc",
  "objective-cpp",
  "ocaml",
  "pascal",
  "perl",
  "php",
  "plsql",
  "postcss",
  "powerquery",
  "powershell",
  "ps",
  "ps1",
  "prisma",
  "prolog",
  "proto",
  "pug",
  "jade",
  "puppet",
  "purescript",
  "python",
  "py",
  "r",
  "raku",
  "perl6",
  "razor",
  "reg",
  "rel",
  "riscv",
  "rst",
  "ruby",
  "rb",
  "rust",
  "rs",
  "sas",
  "sass",
  "scala",
  "scheme",
  "scss",
  "shaderlab",
  "shader",
  "shellscript",
  "bash",
  "sh",
  "shell",
  "zsh",
  "shellsession",
  "console",
  "smalltalk",
  "solidity",
  "sparql",
  "splunk",
  "spl",
  "sql",
  "ssh-config",
  "stata",
  "stylus",
  "styl",
  "svelte",
  "swift",
  "system-verilog",
  "tasl",
  "tcl",
  "tex",
  "toml",
  "tsx",
  "turtle",
  "twig",
  "typescript",
  "ts",
  "v",
  "vb",
  "cmd",
  "verilog",
  "vhdl",
  "viml",
  "vim",
  "vimscript",
  "vue-html",
  "vue",
  "vyper",
  "vy",
  "wasm",
  "wenyan",
  "文言",
  "wgsl",
  "wolfram",
  "xml",
  "xsl",
  "yaml",
  "yml",
  "zenscript",
  "zig",
];
const PENDING_REFS = [];
let highligther = null;

getHighlighter({
  theme: "nord",
}).then((v) => {
  highligther = v;
  while (PENDING_REFS.length) {
    PENDING_REFS.pop().value = true;
  }
});

export function updateOnReady(refObj) {
  if (highligther) {
    refObj.value = true;
  } else {
    PENDING_REFS.push(refObj);
  }
}

export function highlight(code, lang) {
  if (highligther && LANG_NAMES.includes(lang)) {
    return highligther.codeToHtml(code, { lang });
  }
  return code;
}
