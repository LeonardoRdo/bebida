import { categories, VOLUME_FILTROS } from "./categories";
import { kits } from "./kits";
import { OCASIOES, products } from "./products";

export const paths = {
  home: "/",
  entrega: "/entrega",
  categoria: (slug: string) => `/categoria/${slug}`,
  produto: (slug: string) => `/produto/${slug}`,
  kit: (slug: string) => `/kit/${slug}`,
  kitItem: (kit: string, item: string) => `/kit/${kit}/${item}`,
  ocasiao: (slug: string) => `/ocasiao/${slug}`,
  volume: (slug: string) => `/volume/${slug}`,
} as const;

/** Todas as URLs públicas: alimentam o pré-render e o sitemap. */
export function allPaths(): string[] {
  return [
    paths.home,
    paths.entrega,
    ...categories.map((c) => paths.categoria(c.slug)),
    ...products.map((p) => paths.produto(p.slug)),
    ...kits.flatMap((k) => [paths.kit(k.slug), ...k.itens.map((i) => paths.kitItem(k.slug, i.produto.slug))]),
    ...Object.keys(OCASIOES).map(paths.ocasiao),
    ...Object.keys(VOLUME_FILTROS).map(paths.volume),
    "/sitemap.xml",
  ];
}
