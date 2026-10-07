import { ListingPage, SideNav } from "@/components/product/ListingPage";
import { isVolumeFiltro, productsByVolume, VOLUME_FILTROS } from "@/lib/categories";
import { paths } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

import type { Route } from "./+types/volume";
import { NotFound } from "./not-found";

export function meta({ params }: Route.MetaArgs) {
  if (!isVolumeFiltro(params.slug)) return [{ title: "Página não encontrada | Nobre Bebidas" }, { name: "robots", content: "noindex" }];
  const filtro = VOLUME_FILTROS[params.slug];

  return pageMeta({
    title: `Bebidas em ${filtro.nome.toLowerCase()} gelada em Maceió | Nobre Bebidas`,
    description: `Cerveja, refrigerante e outras bebidas em ${filtro.nome.toLowerCase()}, geladas e com delivery em Maceió.`,
    path: paths.volume(params.slug),
  });
}

export default function VolumePage({ params }: Route.ComponentProps) {
  const slug = params.slug;
  if (!isVolumeFiltro(slug)) return <NotFound />;
  const filtro = VOLUME_FILTROS[slug];

  const outros = Object.entries(VOLUME_FILTROS).map(([s, v]) => ({ nome: v.nome, href: paths.volume(s), atual: s === slug }));

  return (
    <ListingPage
      trilha={[
        { nome: "Início", path: paths.home },
        { nome: filtro.nome, path: paths.volume(slug) },
      ]}
      titulo={`Bebidas em ${filtro.nome.toLowerCase()}`}
      intro="Todas as bebidas nesse tamanho. Na página de cada produto você escolhe o volume e a embalagem."
      produtos={productsByVolume(slug)}
      aside={<SideNav titulo="Volumes" itens={outros} />}
    />
  );
}
