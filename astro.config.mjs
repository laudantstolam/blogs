// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import remarkMermaid from 'remark-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://laudantstolam.github.io',
  base: '/blogs/',
  markdown: {
    remarkPlugins: [[remarkMermaid, {
      simple: true,           // Use simpler renderer
      wrap: null,            // Don't wrap the output
      mermaidConfig: {
        theme: 'default',
        securityLevel: 'mediums',
        startOnLoad: true
      }
    }]]
  },
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    tailwind()
  ],
  output: 'static',
});