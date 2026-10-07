import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router";

import { Reveal } from "@/components/Reveal";
import { VOLUME_FILTROS } from "@/lib/categories";
import { paths } from "@/lib/paths";
import { OCASIOES } from "@/lib/products";

type Opcao = { readonly slug: string; readonly nome: string; readonly href: string };

const ABAS = {
  ocasiao: {
    nome: "Por ocasião",
    opcoes: Object.entries(OCASIOES).map(([slug, o]) => ({ slug, nome: o.nome, href: paths.ocasiao(slug) })),
  },
  volume: {
    nome: "Por volume",
    opcoes: Object.entries(VOLUME_FILTROS).map(([slug, v]) => ({ slug, nome: v.nome, href: paths.volume(slug) })),
  },
} as const satisfies Record<string, { nome: string; opcoes: readonly Opcao[] }>;
type Aba = keyof typeof ABAS;
const ORDEM_ABAS = ["ocasiao", "volume"] as const satisfies readonly Aba[];

export function FindDrink() {
  const [aba, setAba] = useState<Aba>("ocasiao");

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const proxima = ORDEM_ABAS[(ORDEM_ABAS.indexOf(aba) + 1) % ORDEM_ABAS.length] ?? "ocasiao";
    setAba(proxima);
    document.getElementById(`aba-${proxima}`)?.focus();
  };

  return (
    <section aria-labelledby="encontre-titulo" className="px-page mx-auto max-w-[1280px] py-[clamp(55px,6vw,89px)] text-center">
      <Reveal>
        <h2 id="encontre-titulo" className="font-serif text-fluid-h2 font-medium">
          Encontre a <em className="text-ouro">bebida certa.</em>
        </h2>
        <p className="mt-13">Escolha pelo momento ou pelo tamanho da garrafa.</p>
      </Reveal>

      <div role="tablist" aria-label="Filtrar por" className="mt-21 inline-flex rounded-full border border-preto/15 bg-champanhe-50 p-1" onKeyDown={onKeyDown}>
        {ORDEM_ABAS.map((a) => (
          <button
            key={a}
            id={`aba-${a}`}
            type="button"
            role="tab"
            aria-selected={a === aba}
            aria-controls="painel-encontre"
            tabIndex={a === aba ? 0 : -1}
            onClick={() => setAba(a)}
            className={`min-h-11 rounded-full px-21 text-sm font-medium transition-colors duration-500 ease-apple ${a === aba ? "bg-preto text-champanhe-50" : ""}`}
          >
            {ABAS[a].nome}
          </button>
        ))}
      </div>

      <div
        id="painel-encontre"
        role="tabpanel"
        aria-labelledby={`aba-${aba}`}
        className="mt-34 grid grid-cols-[repeat(auto-fit,minmax(144px,1fr))] gap-13"
      >
        {ABAS[aba].opcoes.map((o) => (
          <Link
            key={o.slug}
            to={o.href}
            className="grid min-h-[55px] place-items-center rounded-[13px] border border-preto/15 bg-champanhe-50 px-13 text-lg font-medium transition-colors hover:border-preto hover:bg-preto hover:text-champanhe-50"
          >
            {o.nome}
          </Link>
        ))}
      </div>
    </section>
  );
}
