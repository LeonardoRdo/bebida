import { ListingPage, SideNav } from "@/components/product/ListingPage";
import { categoriesOf, categoryBySlug, categoryProducts, GRUPOS, type Category } from "@/lib/categories";
import { paths } from "@/lib/paths";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

import type { Route } from "./+types/categoria";
import { NotFound } from "./not-found";

const tituloDe = (c: Category) => c.seoTitulo ?? `${c.nome} com delivery em Maceió`;

const trilhaDe = (c: Category) => [
  { nome: "Início", path: paths.home },
  { nome: c.nome, path: paths.categoria(c.slug) },
];

export function meta({ params }: Route.MetaArgs) {
  const categoria = categoryBySlug(params.slug);
  if (!categoria) return [{ title: "Categoria não encontrada | Nobre Bebidas" }, { name: "robots", content: "noindex" }];

  return [
    ...pageMeta({
      title: `${tituloDe(categoria)} | Nobre Bebidas`,
      description: `${categoria.intro} Adega no Jacintinho, pedido pelo WhatsApp.`,
      path: paths.categoria(categoria.slug),
    }),
    { "script:ld+json": breadcrumbSchema(trilhaDe(categoria)) },
  ];
}

export default function CategoriaPage({ params }: Route.ComponentProps) {
  const categoria = categoryBySlug(params.slug);
  if (!categoria) return <NotFound />;

  const irmas = categoriesOf(categoria.grupo).map((c) => ({
    nome: c.nome,
    href: paths.categoria(c.slug),
    atual: c.slug === categoria.slug,
  }));

  return (
    <ListingPage
      trilha={trilhaDe(categoria)}
      titulo={tituloDe(categoria)}
      intro={categoria.intro}
      produtos={categoryProducts(categoria)}
      aside={<SideNav titulo={GRUPOS[categoria.grupo]} itens={irmas} />}
    />
  );
}
