import { useState } from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { GRUPO_ORDEM, GRUPOS } from "@/lib/categories";
import { products, type Grupo } from "@/lib/products";

type Filtro = "todos" | Grupo;

const FILTROS: readonly { id: Filtro; nome: string }[] = [
  { id: "todos", nome: "Todos" },
  ...GRUPO_ORDEM.map((g) => ({ id: g, nome: GRUPOS[g] })),
];

export function Catalog() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const visiveis = filtro === "todos" ? products : products.filter((p) => p.grupo === filtro);

  return (
    <section id="catalogo" className="px-page mx-auto max-w-[1680px] scroll-mt-[72px] py-[clamp(89px,10vw,144px)]">
      <Reveal className="flex flex-wrap items-end justify-between gap-34">
        <div className="min-w-[300px] flex-[1.618_1_340px]">
          <p className="eyebrow">Catálogo completo</p>
          <h2 className="font-serif text-fluid-xl font-medium tracking-tight">
            Tudo o que tem <em className="text-ouro">no freezer.</em>
          </h2>
        </div>
        <div role="group" aria-label="Filtrar catálogo" className="flex flex-[1_1_233px] flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === filtro}
              onClick={() => setFiltro(f.id)}
              className={`min-h-11 rounded-full border border-preto px-21 text-sm font-medium transition-colors duration-500 ease-apple ${
                f.id === filtro ? "bg-preto text-champanhe-50" : "hover:bg-champanhe-200"
              }`}
            >
              {f.nome}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-[clamp(34px,5vw,89px)]">
        <ProductGrid produtos={visiveis} />
      </div>
    </section>
  );
}
