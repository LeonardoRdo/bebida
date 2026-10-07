import { ListingPage, SideNav } from "@/components/product/ListingPage";
import { paths } from "@/lib/paths";
import { OCASIOES, productsByOcasiao, type Ocasiao } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

import type { Route } from "./+types/ocasiao";
import { NotFound } from "./not-found";

const isOcasiao = (slug: string): slug is Ocasiao => slug in OCASIOES;

export function meta({ params }: Route.MetaArgs) {
  if (!isOcasiao(params.slug)) return [{ title: "Página não encontrada | Nobre Bebidas" }, { name: "robots", content: "noindex" }];
  const ocasiao = OCASIOES[params.slug];

  return pageMeta({
    title: `Bebidas para ${ocasiao.nome.toLowerCase()} em Maceió | Nobre Bebidas`,
    description: `${ocasiao.desc} Delivery de bebida gelada em Maceió saindo do Jacintinho.`,
    path: paths.ocasiao(params.slug),
  });
}

export default function OcasiaoPage({ params }: Route.ComponentProps) {
  const slug = params.slug;
  if (!isOcasiao(slug)) return <NotFound />;
  const ocasiao = OCASIOES[slug];

  const outras = Object.entries(OCASIOES).map(([s, o]) => ({ nome: o.nome, href: paths.ocasiao(s), atual: s === slug }));

  return (
    <ListingPage
      trilha={[
        { nome: "Início", path: paths.home },
        { nome: ocasiao.nome, path: paths.ocasiao(slug) },
      ]}
      titulo={`Bebidas para ${ocasiao.nome.toLowerCase()}`}
      intro={ocasiao.desc}
      produtos={productsByOcasiao(slug)}
      aside={<SideNav titulo="Ocasiões" itens={outras} />}
    />
  );
}
