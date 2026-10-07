import type { ReactNode } from "react";
import { Link } from "react-router";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { paths } from "@/lib/paths";
import type { Product } from "@/lib/products";

import { ProductGrid } from "./ProductGrid";

type ListingPageProps = {
  readonly trilha: readonly Crumb[];
  readonly titulo: string;
  readonly intro: string;
  readonly produtos: readonly Product[];
  /** Navegação lateral (ex.: outras categorias do mesmo grupo). */
  readonly aside?: ReactNode;
};

export function ListingPage({ trilha, titulo, intro, produtos, aside }: ListingPageProps) {
  return (
    <div className="px-page mx-auto max-w-[1680px] pt-[110px]">
      <Breadcrumbs trilha={trilha} />
      <header className="mt-13 max-w-3xl">
        <h1 className="font-serif text-fluid-h2 font-medium">{titulo}</h1>
        <p className="mt-13 text-lg text-preto">{intro}</p>
      </header>

      <div className={`mt-55 grid gap-55 ${aside ? "lg:grid-cols-[200px_1fr]" : ""}`}>
        {aside}
        <div>
          <h2 className="sr-only">Produtos</h2>
          {produtos.length === 0 ? <EmptyListing /> : <ProductGrid produtos={produtos} acimaDaDobra />}
        </div>
      </div>
    </div>
  );
}

function EmptyListing() {
  return (
    <div className="rounded-[21px] border border-dashed border-preto/15 p-55 text-center">
      <p className="font-serif text-fluid-h3 font-medium">Novidades chegando em breve.</p>
      <p className="mt-2 text-preto-suave">Enquanto isso, veja o que já está no freezer.</p>
      <Link to={`${paths.home}#catalogo`} className="mt-21 btn">
        Ver catálogo completo
      </Link>
    </div>
  );
}

type SideNavProps = { readonly titulo: string; readonly itens: readonly { nome: string; href: string; atual: boolean }[] };

export function SideNav({ titulo, itens }: SideNavProps) {
  return (
    <nav aria-label={titulo} className="lg:sticky lg:top-[96px] lg:self-start">
      <p className="text-xs uppercase tracking-[.2em] text-ouro-texto">{titulo}</p>
      <ul className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
        {itens.map((i) => (
          <li key={i.href}>
            <Link
              to={i.href}
              aria-current={i.atual ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-13 text-sm lg:rounded-none lg:border-0 lg:px-0 ${
                i.atual ? "border-preto text-ouro-texto" : "border-preto/15 text-preto hover:text-ouro-texto"
              }`}
            >
              {i.nome}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
