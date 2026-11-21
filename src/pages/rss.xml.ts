import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";
import sanitizeHtml from "sanitize-html";

import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

type Context = {
  site: string;
};

export async function GET(context: Context) {
  const blog = await getCollection("blog", ({ data }) => !data.draft);

  blog.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items: blog.map((item) => ({
      title: `${item.collection} - ${item.data.title}`,
      description: item.data.description,
      pubDate: item.data.date,
      content: sanitizeHtml(parser.render(item.body)),
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
