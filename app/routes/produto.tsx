import { Link } from "react-router";

import { ProductClient } from "@/components/product/ProductClient";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categoryProducts, primaryCategoryOf } from "@/lib/categories";
import { kits } from "@/lib/kits";
import { paths } from "@/lib/paths";
import { bySlug, rotuloVolume, type Product } from "@/lib/products";
import { breadcrumbSchema, pageMeta, precoLegivel, productSchema } from "@/lib/seo";

import type { Route } from "./+types/produto";
import { NotFound } from "./not-found";

function trilhaDe(p: Product) {
  const categoria = primaryCategoryOf(p);
  return [
    { nome: "Início", path: paths.home },
    ...(categoria ? [{ nome: categoria.nome, path: paths.categoria(categoria.slug) }] : []),
    { nome: p.nome, path: paths.produto(p.slug) },
  ];
}

export function meta({ params }: Route.MetaArgs) {
  const produto = bySlug(params.slug);
  if (!produto) return [{ title: "Produto não encontrado | Nobre Bebidas" }, { name: "robots", content: "noindex" }];
  const volumes = produto.volumes.map(rotuloVolume).join(", ");

  return [
    ...pageMeta({
      title: `${produto.nome} gelada em Maceió (${volumes}) | Nobre Bebidas`,
      description: `${produto.desc} ${precoLegivel(produto)}, com delivery no Jacintinho e bairros de Maceió.`,
      path: paths.produto(produto.slug),
    }),
    { "script:ld+json": productSchema(produto, paths.produto(produto.slug)) },
    { "script:ld+json": breadcrumbSchema(trilhaDe(produto)) },
  ];
}

export default function ProdutoPage({ params }: Route.ComponentProps) {
  const produto = bySlug(params.slug);
  if (!produto) return <NotFound />;

  const kit = kits.find((k) => k.itens.some((i) => i.produto.slug === produto.slug));
  const categoria = primaryCategoryOf(produto);
  const relacionados = categoria ? categoryProducts(categoria).filter((p) => p.slug !== produto.slug).slice(0, 4) : [];

  return (
    <>
      <ProductClient key={produto.slug} produto={produto} trilha={trilhaDe(produto)} href={paths.produto(produto.slug)}>
        {kit && (
          <Link
            to={paths.kit(kit.slug)}
            className="mt-34 flex items-center justify-between gap-13 rounded-[21px] border border-preto/15 bg-champanhe-50 p-21 transition-colors hover:border-preto"
          >
            <span>
              <span className="block text-sm text-ouro-texto">Também está no {kit.nome}</span>
              <span className="text-preto">{kit.desc}</span>
            </span>
            <span aria-hidden="true" className="text-2xl text-ouro-texto">
              ›
            </span>
          </Link>
        )}
      </ProductClient>
      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados" className="px-page mx-auto max-w-[1680px] pt-144">
          <h2 id="relacionados" className="font-serif text-fluid-h3 font-medium">
            Mais {categoria?.nome.toLowerCase()}
          </h2>
          <div className="mt-34">
            <ProductGrid produtos={relacionados} />
          </div>
        </section>
      )}
    </>
  );
}
