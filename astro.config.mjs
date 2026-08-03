// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import expressiveCode from "astro-expressive-code";
import remarkMermaid from "remark-mermaid";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkCallout from "@r4ai/remark-callout";
import { flexokiLight, flexokiDark } from "./src/styles/ec-themes.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://laudantstolam.github.io",
  base: "/blogs/",
  markdown: {
    remarkPlugins: [
      [
        remarkMermaid,
        {
          simple: true, // Use simpler renderer
          wrap: null, // Don't wrap the output
          mermaidConfig: {
            theme: "default",
            securityLevel: "mediums",
            startOnLoad: true,
          },
        },
      ],
      remarkMath,
      remarkCallout,
    ],
    rehypePlugins: [rehypeKatex] 
  },
  integrations: [
    expressiveCode({
      themes: [flexokiLight, flexokiDark],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      styleOverrides: {
        borderRadius: "0",
        codeFontFamily: "var(--font-mono)",
        codeFontSize: "1em",
        codePaddingBlock: "1.25em",
        codePaddingInline: "1.5em",
        frames: { frameBoxShadowCssValue: "none" },
      },
    }),
    mdx(),
    sitemap(),
    tailwind(),
  ],
  output: "static",
});
