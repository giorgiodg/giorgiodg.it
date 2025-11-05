import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://giorgiodg.it",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        page !== "https://giorgiodg.it/cv/" &&
        page !== "https://giorgiodg.it/skills/" &&
        page !== "https://giorgiodg.it/testimonials/",
    }),
    tailwind(),
  ],
  redirects: {
    "/skills": "/work",
    "/testimonials": "/work",
  },
});
