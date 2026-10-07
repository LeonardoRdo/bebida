import { Link } from "react-router";

import { ProductClient } from "@/components/product/ProductClient";
import { kitBySlug, kitSavings } from "@/lib/kits";
import { paths } from "@/lib/paths";
import { brl } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

import type { Route } from "./+types/kit-item";
import { NotFound } from "./not-found";

function findItem(kitSlug: string, itemSlug: string) {
  const kit = kitBySlug(kitSlug);
  const item = kit?.itens.find((i) => i.produto.slug === itemSlug);
  return kit && item ? { kit, produto: item.produto } : undefined;
}

export function meta({ params }: Route.MetaArgs) {
  const found = findItem(params.slug, params.item);
  if (!found) return [{ title: "Produto não encontrado | Nobre Bebidas" }, { name: "robots", content: "noindex" }];

  // O conteúdo é o mesmo da página do produto: o canonical aponta para ela.
  return pageMeta({
    title: `${found.produto.nome} do ${found.kit.nome} | Nobre Bebidas`,
    description: found.produto.desc,
    path: paths.produto(found.produto.slug),
  });
}

export default function KitItemPage({ params }: Route.ComponentProps) {
  const found = findItem(params.slug, params.item);
  if (!found) return <NotFound />;
  const { kit, produto } = found;

  const trilha = [
    { nome: "Início", path: paths.home },
    { nome: kit.nome, path: paths.kit(kit.slug) },
    { nome: produto.nome, path: paths.kitItem(kit.slug, produto.slug) },
  ];

  return (
    <ProductClient key={produto.slug} produto={produto} trilha={trilha} href={paths.kitItem(kit.slug, produto.slug)}>
      <Link
        to={paths.kit(kit.slug)}
        className="mt-34 flex items-center justify-between gap-13 rounded-[21px] border border-preto/15 bg-champanhe-50 p-21 transition-colors hover:border-preto"
      >
        <span>
          <span className="block text-sm text-ouro-texto">Leve o {kit.nome} e economize {brl(kitSavings(kit))}</span>
          <span className="text-preto">Kit completo por {brl(kit.preco)}</span>
        </span>
        <span aria-hidden="true" className="text-2xl text-ouro-texto">
          ›
        </span>
      </Link>
    </ProductClient>
  );
}
