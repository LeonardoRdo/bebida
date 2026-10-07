import { products, type Formato, type Grupo, type Product } from "./products";

export type Category = {
  readonly slug: string;
  readonly nome: string;
  readonly grupo: Grupo;
  readonly intro: string;
  /** Título da página quando o padrão "<nome> com delivery em Maceió" não é a busca que importa. */
  readonly seoTitulo?: string;
  /** Slugs; um produto pode estar em mais de uma categoria. */
  readonly produtos: readonly string[];
};

export const GRUPOS: Readonly<Record<Grupo, string>> = {
  alcoolicas: "Alcoólicas",
  "sem-alcool": "Sem álcool",
  extras: "Para acompanhar",
};

export const GRUPO_ORDEM = ["alcoolicas", "sem-alcool", "extras"] as const satisfies readonly Grupo[];

export const categories: readonly Category[] = [
  {
    slug: "cervejas",
    nome: "Cervejas",
    grupo: "alcoolicas",
    seoTitulo: "Cerveja gelada em Maceió",
    intro: "Cerveja gelada em Maceió, em lata, long neck, garrafa ou litrão, com entrega no seu bairro.",
    produtos: ["heineken", "skol", "budweiser", "stella-artois", "corona-extra"],
  },
  {
    slug: "cervejas-especiais",
    nome: "Cervejas especiais",
    grupo: "alcoolicas",
    intro: "Rótulos artesanais e puro malte para quem gosta de provar coisa nova.",
    produtos: ["ipa-artesanal", "stella-artois"],
  },
  {
    slug: "vinhos",
    nome: "Vinhos",
    grupo: "alcoolicas",
    intro: "Tintos e brancos selecionados para o jantar ou para levar de presente.",
    produtos: ["vinho-tinto-reserva", "vinho-branco-sauvignon"],
  },
  {
    slug: "espumantes",
    nome: "Espumantes",
    grupo: "alcoolicas",
    intro: "Espumantes para brindar aniversário, réveillon ou uma sexta-feira qualquer.",
    produtos: ["espumante-brut"],
  },
  {
    slug: "destilados",
    nome: "Destilados",
    grupo: "alcoolicas",
    intro: "Gin, vodka, whisky e cachaça alagoana, prontos para o drink.",
    produtos: ["gin-hendricks", "vodka-smirnoff", "whisky-jack-daniels", "cachaca-envelhecida"],
  },
  {
    slug: "drinks-prontos",
    nome: "Drinks prontos",
    grupo: "alcoolicas",
    intro: "Ices e drinks em lata para abrir e beber.",
    produtos: ["drink-tropical"],
  },
  {
    slug: "refrigerantes",
    nome: "Refrigerantes",
    grupo: "sem-alcool",
    intro: "Refrigerante gelado em lata ou 2 litros.",
    produtos: ["coca-cola", "tonica-schweppes"],
  },
  {
    slug: "sucos",
    nome: "Sucos",
    grupo: "sem-alcool",
    intro: "Sucos integrais para quem não bebe álcool.",
    produtos: ["suco-uva-integral", "suco-laranja"],
  },
  {
    slug: "aguas",
    nome: "Águas",
    grupo: "sem-alcool",
    intro: "Água mineral com e sem gás, avulsa ou em fardo.",
    produtos: ["agua-mineral", "agua-com-gas"],
  },
  {
    slug: "energeticos",
    nome: "Energéticos",
    grupo: "sem-alcool",
    intro: "Energético gelado para a noite render.",
    produtos: ["energetico-red-bull", "energetico-monster"],
  },
  {
    slug: "gelo",
    nome: "Gelo",
    grupo: "extras",
    intro: "Saco de gelo em cubos, entregue junto com a sua bebida.",
    produtos: ["gelo-cubo"],
  },
  {
    slug: "carvao",
    nome: "Carvão",
    grupo: "extras",
    intro: "Carvão vegetal para o churrasco.",
    produtos: ["carvao"],
  },
  {
    slug: "petiscos",
    nome: "Petiscos",
    grupo: "extras",
    intro: "Amendoim, batata e limão para completar a mesa.",
    produtos: ["amendoim", "batata-chips", "limao"],
  },
  {
    slug: "acessorios",
    nome: "Acessórios",
    grupo: "extras",
    intro: "Copos, taças, abridores e isopor.",
    produtos: [],
  },
];

export const categoryImg = (slug: string) => `/img/categorias/${slug}.webp`;

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const categoriesOf = (grupo: Grupo) => categories.filter((c) => c.grupo === grupo);

export const categoryProducts = (c: Category) => products.filter((p) => c.produtos.includes(p.slug));

export const primaryCategoryOf = (p: Product) => categories.find((c) => c.produtos.includes(p.slug));

/** Filtro "por volume": cada entrada agrupa formatos de embalagem que o cliente reconhece. */
export const VOLUME_FILTROS = {
  lata: { nome: "Lata", formatos: ["lata"] },
  "long-neck": { nome: "Long neck", formatos: ["long-neck"] },
  garrafa: { nome: "Garrafa 600 ml", formatos: ["garrafa"] },
  litrao: { nome: "Litrão", formatos: ["litrao"] },
  "dois-litros": { nome: "PET e 2 litros", formatos: ["pet"] },
} as const satisfies Record<string, { nome: string; formatos: readonly Formato[] }>;
export type VolumeFiltro = keyof typeof VOLUME_FILTROS;

export const isVolumeFiltro = (slug: string): slug is VolumeFiltro => slug in VOLUME_FILTROS;

export function productsByVolume(filtro: VolumeFiltro): readonly Product[] {
  const formatos: readonly Formato[] = VOLUME_FILTROS[filtro].formatos;
  return products.filter((p) => p.volumes.some((v) => formatos.includes(v.formato)));
}
