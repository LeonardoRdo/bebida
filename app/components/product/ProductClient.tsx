import { useState, type ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { useCart } from "@/components/cart/CartProvider";
import { Img } from "@/components/Img";
import { AVISO_LEGAL } from "@/components/layout/Footer";
import { MAX_QTD, MIN_QTD } from "@/lib/cart";
import {
  brl,
  EMBALAGENS,
  isAlcoolica,
  precoDe,
  precoPorUnidade,
  productAlt,
  productImg,
  rotuloVolume,
  type Embalagem,
  type Product,
  type Selecao,
} from "@/lib/products";

type ProductClientProps = {
  readonly produto: Product;
  readonly trilha: readonly Crumb[];
  readonly href: string;
  /** Conteúdo extra abaixo do botão (ex.: chamada para o kit). */
  readonly children?: ReactNode;
};

export function ProductClient({ produto, trilha, href, children }: ProductClientProps) {
  const { add } = useCart();
  const [volumeIndex, setVolumeIndex] = useState(0);
  const [embalagem, setEmbalagem] = useState<Embalagem>(produto.embalagens[0] ?? "unidade");
  const [gelada, setGelada] = useState(produto.podeGelar);
  const [qtd, setQtd] = useState(1);

  const volume = produto.volumes[volumeIndex] ?? produto.volumes[0];
  if (!volume) return null;
  const selecao: Selecao = { volume, embalagem };

  const adicionar = () =>
    add(
      {
        nome: produto.nome,
        detalhe: detalheDe(selecao, gelada && produto.podeGelar),
        preco: precoDe(selecao),
        alcoolica: isAlcoolica(produto),
        href,
        thumb: productImg(produto.slug),
      },
      qtd,
    );

  return (
    <div className="px-page mx-auto max-w-[1680px] pt-[110px]">
      <Breadcrumbs trilha={trilha} />
      <div className="mt-21 grid gap-[clamp(34px,5vw,89px)] md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.618fr] lg:items-start">
        <div className="relative aspect-card overflow-hidden rounded-[21px] bg-champanhe-200 md:sticky md:top-[96px]">
          <Img src={productImg(produto.slug)} alt={productAlt(produto)} priority className="absolute inset-0 h-full w-full object-cover" />
        </div>

        <div className="max-w-[640px]">
          <p className="eyebrow">
            {produto.sub} · {produto.marca}
          </p>
          <h1 className="font-serif text-fluid-h2 font-medium">{produto.nome}</h1>
          <p className="mt-13 font-serif text-[clamp(1.618rem,2.4vw,2.618rem)] text-ouro-texto">{brl(precoDe(selecao))}</p>
          {EMBALAGENS[embalagem].unidades > 1 && (
            <p className="text-sm text-preto-suave">{brl(precoPorUnidade(selecao))} por unidade</p>
          )}
          <p className="mt-21 leading-[1.618]">{produto.desc}</p>
          {isAlcoolica(produto) && (
            <p className="mt-2 text-sm text-preto-suave">Teor alcoólico: {produto.teorAlcoolico?.toLocaleString("pt-BR")}% vol.</p>
          )}

          <OptionGroup legend="Volume">
            {produto.volumes.map((v, i) => (
              <Pill key={`${v.formato}-${v.ml}`} name="volume" checked={i === volumeIndex} onChange={() => setVolumeIndex(i)}>
                {rotuloVolume(v)}
              </Pill>
            ))}
          </OptionGroup>

          {produto.embalagens.length > 1 && (
            <OptionGroup legend="Embalagem">
              {produto.embalagens.map((e) => (
                <Pill key={e} name="embalagem" checked={e === embalagem} onChange={() => setEmbalagem(e)}>
                  {EMBALAGENS[e].nome}
                  {EMBALAGENS[e].desconto > 0 && <span className="ml-1 opacity-75">−{EMBALAGENS[e].desconto * 100}%</span>}
                </Pill>
              ))}
            </OptionGroup>
          )}

          {produto.podeGelar && (
            <label className="mt-21 flex min-h-11 cursor-pointer items-center gap-13">
              <input type="checkbox" checked={gelada} onChange={(e) => setGelada(e.target.checked)} className="size-5 accent-[var(--color-preto)]" />
              <span>
                Quero gelada <span className="text-sm text-preto-suave">(sem custo, sai do freezer na hora)</span>
              </span>
            </label>
          )}

          <div className="mt-34 flex flex-wrap items-center gap-13">
            <QtyStepper qtd={qtd} onChange={setQtd} />
            <button type="button" onClick={adicionar} className="btn min-h-[52px] flex-1">
              Adicionar ao carrinho · {brl(precoDe(selecao) * qtd)}
            </button>
          </div>
          {isAlcoolica(produto) && <p className="mt-13 text-xs text-preto-suave">{AVISO_LEGAL}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

function detalheDe(selecao: Selecao, gelada: boolean): string {
  const partes = [rotuloVolume(selecao.volume), EMBALAGENS[selecao.embalagem].nome.toLowerCase()];
  return (gelada ? [...partes, "gelada"] : partes).join(", ");
}

function OptionGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="mt-21">
      <legend className="mb-2 text-xs uppercase tracking-[.2em] text-ouro-texto">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

type PillProps = { name: string; checked: boolean; onChange: () => void; children: ReactNode };

function Pill({ name, checked, onChange, children }: PillProps) {
  return (
    <label
      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border border-preto px-21 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ouro ${
        checked ? "bg-preto text-champanhe-50" : "hover:bg-champanhe-200"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function QtyStepper({ qtd, onChange }: { qtd: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-preto" role="group" aria-label="Quantidade">
      <button type="button" aria-label="Diminuir quantidade" disabled={qtd <= MIN_QTD} onClick={() => onChange(qtd - 1)} className="grid size-[52px] place-items-center text-xl disabled:opacity-35">
        −
      </button>
      <span className="w-8 text-center" aria-live="polite">
        {qtd}
      </span>
      <button type="button" aria-label="Aumentar quantidade" disabled={qtd >= MAX_QTD} onClick={() => onChange(qtd + 1)} className="grid size-[52px] place-items-center text-xl disabled:opacity-35">
        +
      </button>
    </div>
  );
}
