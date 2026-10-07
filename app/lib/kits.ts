import { bySlug, precoDe, type Embalagem, type Product, type Selecao } from "./products";

export type KitItem = { readonly produto: Product } & Selecao;

export type Kit = {
  readonly slug: string;
  readonly nome: string;
  readonly chamada: string;
  readonly desc: string;
  /** Itens que também podem ser comprados avulsos. */
  readonly itens: readonly KitItem[];
  /** Preço do kit fechado, mais barato que a soma dos itens. */
  readonly preco: number;
};

function item(slug: string, volumeIndex: number, embalagem: Embalagem): KitItem {
  const produto = bySlug(slug);
  const volume = produto?.volumes[volumeIndex];
  if (!produto || !volume) throw new Error(`kit item: produto ou volume inexistente (${slug}#${volumeIndex})`);
  return { produto, volume, embalagem };
}

// TODO(cliente): kits e preços fictícios para o mockup.
export const kits: readonly Kit[] = [
  {
    slug: "kit-churrasco",
    nome: "Kit Churrasco",
    chamada: "Para o fim de semana",
    desc: "Fardo de Heineken em lata, gelo e carvão. Chega tudo junto, a cerveja já gelada.",
    itens: [item("heineken", 0, "fardo12"), item("gelo-cubo", 0, "unidade"), item("carvao", 0, "unidade")],
    preco: 89.9,
  },
  {
    slug: "kit-happy-hour",
    nome: "Kit Gin Tônica",
    chamada: "Happy hour em casa",
    desc: "Hendrick's, seis tônicas, limão e gelo. Rende uns doze drinks bem servidos.",
    itens: [
      item("gin-hendricks", 0, "unidade"),
      item("tonica-schweppes", 0, "fardo6"),
      item("limao", 0, "unidade"),
      item("gelo-cubo", 0, "unidade"),
    ],
    preco: 219.9,
  },
  {
    slug: "kit-noite-de-vinho",
    nome: "Noite de Vinho",
    chamada: "Jantar a dois",
    desc: "Um tinto reserva, um Sauvignon Blanc e um espumante para fechar a noite.",
    itens: [
      item("vinho-tinto-reserva", 0, "unidade"),
      item("vinho-branco-sauvignon", 0, "unidade"),
      item("espumante-brut", 0, "unidade"),
    ],
    preco: 164.9,
  },
  {
    slug: "kit-sem-alcool",
    nome: "Kit Sem Álcool",
    chamada: "Para toda a família",
    desc: "Coca-Cola de 2 litros, suco de laranja, água com gás e gelo para a mesa inteira.",
    itens: [
      item("coca-cola", 1, "unidade"),
      item("suco-laranja", 0, "fardo6"),
      item("agua-com-gas", 0, "fardo12"),
      item("gelo-cubo", 0, "unidade"),
    ],
    preco: 99.9,
  },
];

export const kitImg = (slug: string) => `/img/hero/${slug}.webp`;

export const kitBySlug = (slug: string) => kits.find((k) => k.slug === slug);

export const kitSubtotal = (k: Kit) => k.itens.reduce((soma, i) => soma + precoDe(i), 0);

export const kitSavings = (k: Kit) => Math.round((kitSubtotal(k) - k.preco) * 100) / 100;

export const kitHasAlcohol = (k: Kit) => k.itens.some((i) => i.produto.teorAlcoolico !== undefined);
