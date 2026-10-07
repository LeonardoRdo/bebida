import { allPaths } from "@/lib/paths";
import { absoluteUrl } from "@/lib/site";

/** Pré-renderizado no build como /sitemap.xml. */
export function loader() {
  const urls = allPaths()
    .filter((p) => p !== "/sitemap.xml")
    .map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
