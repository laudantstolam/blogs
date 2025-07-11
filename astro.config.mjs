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

// https://astro.build/config
export default defineConfig({
  site: "https://laudantstolam.github.io/blogs",
  base: "/",
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
  integrations: [expressiveCode(), mdx(), sitemap(), tailwind()],
  output: "static",
});
