import { rotuloEntrega, taxaDe, type Entrega } from "./delivery";
import { brl } from "./products";
import { STORE } from "./site";

export const MIN_QTD = 1;
export const MAX_QTD = 10;

export type CartLine = {
  /** `nome|volume|embalagem|gelada` — a mesma combinação soma quantidade em vez de duplicar a linha. */
  readonly key: string;
  readonly nome: string;
  readonly detalhe: string;
  readonly preco: number;
  readonly qtd: number;
  readonly alcoolica: boolean;
  readonly href: string;
  /** Foto usada como miniatura no carrinho. */
  readonly thumb: string;
};

export type NewCartLine = Omit<CartLine, "key" | "qtd">;

export const lineKey = (l: NewCartLine) => `${l.nome}|${l.detalhe}`;

const clampQtd = (qtd: number) => Math.min(MAX_QTD, Math.max(MIN_QTD, Math.round(qtd)));

export function addLine(lines: readonly CartLine[], nova: NewCartLine, qtd: number): CartLine[] {
  const key = lineKey(nova);
  const existente = lines.find((l) => l.key === key);
  if (!existente) return [...lines, { ...nova, key, qtd: clampQtd(qtd) }];
  return lines.map((l) => (l.key === key ? { ...l, qtd: clampQtd(l.qtd + qtd) } : l));
}

export const setLineQtd = (lines: readonly CartLine[], key: string, qtd: number): CartLine[] =>
  lines.map((l) => (l.key === key ? { ...l, qtd: clampQtd(qtd) } : l));

export const removeLine = (lines: readonly CartLine[], key: string): CartLine[] => lines.filter((l) => l.key !== key);

export const subtotalOf = (lines: readonly CartLine[]) => lines.reduce((s, l) => s + l.preco * l.qtd, 0);

export const countOf = (lines: readonly CartLine[]) => lines.reduce((s, l) => s + l.qtd, 0);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCartLine(value: unknown): value is CartLine {
  if (!isRecord(value)) return false;
  const textos = ["key", "nome", "detalhe", "href", "thumb"].every((k) => typeof value[k] === "string");
  return (
    textos &&
    typeof value.preco === "number" &&
    typeof value.qtd === "number" &&
    typeof value.alcoolica === "boolean"
  );
}

/** Lê o carrinho salvo; `undefined` quando o conteúdo está corrompido ou em formato antigo. */
export function parseCart(raw: string): CartLine[] | undefined {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isCartLine)) return undefined;
  return parsed;
}

export function whatsappMessage(lines: readonly CartLine[], entrega: Entrega): string {
  const subtotal = subtotalOf(lines);
  const taxa = taxaDe(entrega);
  const itens = lines.map((l) => `• ${l.qtd}x ${l.nome} (${l.detalhe}) – ${brl(l.preco * l.qtd)}`);
  const totais =
    taxa === undefined
      ? [`Subtotal: ${brl(subtotal)}`, "Taxa de entrega: a combinar", `*Total: ${brl(subtotal)} + entrega*`]
      : [`Subtotal: ${brl(subtotal)}`, `Taxa de entrega: ${brl(taxa)}`, `*Total: ${brl(subtotal + taxa)}*`];
  const avisoMaioridade = lines.some((l) => l.alcoolica)
    ? ["", "Estou ciente de que um documento com foto será pedido na entrega (venda proibida para menores de 18 anos)."]
    : [];

  return [
    `Olá, ${STORE.nome}! Quero fazer este pedido:`,
    "",
    ...itens,
    "",
    rotuloEntrega(entrega),
    ...totais,
    "",
    "Endereço: ",
    "Forma de pagamento: ",
    ...avisoMaioridade,
  ].join("\n");
}

export const whatsappUrl = (texto: string) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(texto)}`;
