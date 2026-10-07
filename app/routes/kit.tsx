import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/components/cart/CartProvider";
import { Img } from "@/components/Img";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/Reveal";
import { kitBySlug, kitHasAlcohol, kitImg, kitSavings, kitSubtotal, type Kit } from "@/lib/kits";
import { paths } from "@/lib/paths";
import { brl, EMBALAGENS, rotuloVolume } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

import type { Route } from "./+types/kit";
import { NotFound } from "./not-found";

export function meta({ params }: Route.MetaArgs) {
  const kit = kitBySlug(params.slug);
  if (!kit) return [{ title: "Kit não encontrado | Nobre Bebidas" }, { name: "robots", content: "noindex" }];

  return pageMeta({
    title: `${kit.nome} com entrega em Maceió por ${brl(kit.preco)} | Nobre Bebidas`,
    description: `${kit.desc} Economize ${brl(kitSavings(kit))} levando o kit completo.`,
    path: paths.kit(kit.slug),
  });
}

export default function KitPage({ params }: Route.ComponentProps) {
  const kit = kitBySlug(params.slug);
  if (!kit) return <NotFound />;

  return (
    <div className="px-page mx-auto max-w-[1680px] pt-[110px]">
      <Breadcrumbs
        trilha={[
          { nome: "Início", path: paths.home },
          { nome: "Kits", path: `${paths.home}#kits` },
          { nome: kit.nome, path: paths.kit(kit.slug) },
        ]}
      />
      <header className="mt-13 max-w-3xl">
        <p className="eyebrow">{kit.chamada}</p>
        <h1 className="font-serif text-fluid-xl font-medium tracking-tight">{kit.nome}</h1>
        <p className="mt-13 text-lg leading-[1.618]">{kit.desc}</p>
      </header>

      <div className="mt-[clamp(34px,5vw,89px)] grid gap-[clamp(34px,5vw,89px)] lg:grid-cols-[1fr_1.618fr] lg:items-start">
        <KitOffer kit={kit} />
        <section aria-labelledby="itens-titulo">
          <h2 id="itens-titulo" className="font-serif text-fluid-h3 font-medium">
            Ou leve os itens <em className="text-ouro">separados.</em>
          </h2>
          <ul className="mt-21 grid grid-cols-[repeat(auto-fill,minmax(clamp(150px,16vw,240px),1fr))] gap-x-[clamp(13px,2vw,34px)] gap-y-34">
            {kit.itens.map((item, i) => (
              <li key={item.produto.slug}>
                <Reveal delay={(i % 4) * 0.089}>
                  <ProductCard produto={item.produto} href={paths.kitItem(kit.slug, item.produto.slug)} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function KitOffer({ kit }: { kit: Kit }) {
  const { add } = useCart();
  const adicionar = () =>
    add(
      {
        nome: kit.nome,
        detalhe: "kit completo",
        preco: kit.preco,
        alcoolica: kitHasAlcohol(kit),
        href: paths.kit(kit.slug),
        thumb: kitImg(kit.slug),
      },
      1,
    );

  return (
    <article className="overflow-hidden rounded-[21px] bg-champanhe-50 shadow-xl lg:sticky lg:top-[96px]">
      <div className="relative aspect-[1.618/1] bg-preto">
        <Img src={kitImg(kit.slug)} alt={`${kit.nome} da Nobre Bebidas`} priority className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute right-13 top-13 rounded-full bg-preto px-13 py-1.5 text-sm font-medium text-champanhe-50">
          Economize {brl(kitSavings(kit))}
        </span>
      </div>
      <div className="p-[clamp(21px,2.6vw,34px)]">
        <h2 className="font-serif text-fluid-h3 font-medium">
          Kit <em className="text-ouro">completo.</em>
        </h2>
        <ul className="mt-13 space-y-1 text-sm">
          {kit.itens.map((item) => (
            <li key={item.produto.slug}>
              {item.produto.nome}, {rotuloVolume(item.volume).toLowerCase()} ({EMBALAGENS[item.embalagem].nome.toLowerCase()})
            </li>
          ))}
        </ul>
        <p className="mt-21 text-preto-suave">
          Separado sai <s>{brl(kitSubtotal(kit))}</s>
        </p>
        <p className="font-serif text-fluid-h2 font-medium text-ouro-texto">{brl(kit.preco)}</p>
        <button type="button" onClick={adicionar} className="btn mt-21 w-full !min-h-[52px]">
          Adicionar kit ao carrinho
        </button>
      </div>
    </article>
  );
}
