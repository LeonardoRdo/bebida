export type Grupo = "alcoolicas" | "sem-alcool" | "extras";

export const FORMATOS = {
  lata: "Lata",
  "long-neck": "Long neck",
  garrafa: "Garrafa",
  litrao: "Litrão",
  vinho: "Garrafa",
  destilado: "Garrafa",
  pet: "Garrafa PET",
  saco: "Saco",
  pacote: "Pacote",
} as const;
export type Formato = keyof typeof FORMATOS;

export const OCASIOES = {
  churrasco: { nome: "Churrasco", desc: "Cerveja trincando, gelo e carvão para o fim de semana." },
  "happy-hour": { nome: "Happy hour", desc: "Gin tônica, long necks e drinks prontos para a resenha." },
  festa: { nome: "Festa", desc: "Fardos, litrões, vodka e energético para a noite toda." },
  jantar: { nome: "Jantar", desc: "Vinhos e espumantes para acompanhar a mesa." },
} as const;
export type Ocasiao = keyof typeof OCASIOES;

export const EMBALAGENS = {
  unidade: { nome: "Unidade", unidades: 1, desconto: 0 },
  fardo6: { nome: "Fardo com 6", unidades: 6, desconto: 0.05 },
  fardo12: { nome: "Fardo com 12", unidades: 12, desconto: 0.1 },
  caixa6: { nome: "Caixa com 6", unidades: 6, desconto: 0.08 },
} as const;
export type Embalagem = keyof typeof EMBALAGENS;

export type Volume = { readonly formato: Formato; readonly ml: number; readonly preco: number };

export type Product = {
  readonly slug: string;
  readonly nome: string;
  readonly marca: string;
  readonly grupo: Grupo;
  readonly sub: string;
  readonly desc: string;
  readonly volumes: readonly Volume[];
  readonly embalagens: readonly Embalagem[];
  readonly ocasioes: readonly Ocasiao[];
  readonly teorAlcoolico?: number;
  readonly podeGelar: boolean;
};

export type Selecao = { readonly volume: Volume; readonly embalagem: Embalagem };

// TODO(cliente): todos os preços são fictícios para o mockup.
export const products: readonly Product[] = [
  {
    slug: "heineken",
    nome: "Heineken",
    marca: "Heineken",
    grupo: "alcoolicas",
    sub: "Cerveja puro malte",
    desc: "Lager puro malte holandesa, leve e refrescante. A mais pedida para o fim de semana.",
    volumes: [
      { formato: "lata", ml: 350, preco: 5.99 },
      { formato: "long-neck", ml: 330, preco: 7.49 },
      { formato: "garrafa", ml: 600, preco: 11.9 },
    ],
    embalagens: ["unidade", "fardo12"],
    ocasioes: ["churrasco", "happy-hour", "festa"],
    teorAlcoolico: 5,
    podeGelar: true,
  },
  {
    slug: "skol",
    nome: "Skol",
    marca: "Skol",
    grupo: "alcoolicas",
    sub: "Cerveja pilsen",
    desc: "A pilsen que desce redondo. Ideal para dividir no churrasco.",
    volumes: [
      { formato: "lata", ml: 350, preco: 3.79 },
      { formato: "litrao", ml: 1000, preco: 8.99 },
    ],
    embalagens: ["unidade", "fardo12"],
    ocasioes: ["churrasco", "festa"],
    teorAlcoolico: 4.7,
    podeGelar: true,
  },
  {
    slug: "budweiser",
    nome: "Budweiser",
    marca: "Budweiser",
    grupo: "alcoolicas",
    sub: "Cerveja lager",
    desc: "Lager americana leve e equilibrada, ótima bem gelada no fim de tarde.",
    volumes: [
      { formato: "long-neck", ml: 330, preco: 6.99 },
      { formato: "lata", ml: 350, preco: 4.99 },
    ],
    embalagens: ["unidade", "fardo12"],
    ocasioes: ["churrasco", "festa"],
    teorAlcoolico: 5,
    podeGelar: true,
  },
  {
    slug: "stella-artois",
    nome: "Stella Artois",
    marca: "Stella Artois",
    grupo: "alcoolicas",
    sub: "Cerveja puro malte",
    desc: "Lager belga de sabor marcante e final seco. Clássica para o happy hour.",
    volumes: [
      { formato: "long-neck", ml: 330, preco: 7.29 },
      { formato: "lata", ml: 350, preco: 5.79 },
    ],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["happy-hour", "jantar"],
    teorAlcoolico: 5,
    podeGelar: true,
  },
  {
    slug: "corona-extra",
    nome: "Corona Extra",
    marca: "Corona",
    grupo: "alcoolicas",
    sub: "Cerveja pilsen",
    desc: "Leve, clara e perfeita com uma rodela de limão. Combina com o calor de Maceió.",
    volumes: [{ formato: "long-neck", ml: 330, preco: 7.99 }],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["happy-hour", "festa"],
    teorAlcoolico: 4.5,
    podeGelar: true,
  },
  {
    slug: "ipa-artesanal",
    nome: "IPA Artesanal",
    marca: "Cervejaria local",
    grupo: "alcoolicas",
    sub: "Cerveja especial",
    desc: "India Pale Ale com lúpulos aromáticos e amargor equilibrado. TODO(cliente): marca real.",
    volumes: [{ formato: "garrafa", ml: 500, preco: 19.9 }],
    embalagens: ["unidade"],
    ocasioes: ["happy-hour", "jantar"],
    teorAlcoolico: 6.5,
    podeGelar: true,
  },
  {
    slug: "vinho-tinto-reserva",
    nome: "Tinto Reserva",
    marca: "Vale Central",
    grupo: "alcoolicas",
    sub: "Vinho tinto",
    desc: "Tinto encorpado com notas de ameixa e baunilha. Acompanha carnes vermelhas e massas. TODO(cliente): rótulo real.",
    volumes: [
      { formato: "vinho", ml: 750, preco: 69.9 },
    ],
    embalagens: ["unidade", "caixa6"],
    ocasioes: ["jantar", "churrasco"],
    teorAlcoolico: 13.5,
    podeGelar: false,
  },
  {
    slug: "vinho-branco-sauvignon",
    nome: "Sauvignon Blanc",
    marca: "Vale Central",
    grupo: "alcoolicas",
    sub: "Vinho branco",
    desc: "Branco chileno fresco e cítrico. Pede peixe, camarão e uma tarde na Pajuçara.",
    volumes: [{ formato: "vinho", ml: 750, preco: 54.9 }],
    embalagens: ["unidade", "caixa6"],
    ocasioes: ["jantar"],
    teorAlcoolico: 12.5,
    podeGelar: true,
  },
  {
    slug: "espumante-brut",
    nome: "Espumante Brut",
    marca: "Serra Gaúcha",
    grupo: "alcoolicas",
    sub: "Espumante",
    desc: "Brut nacional de perlage fina. Para brindar qualquer coisa.",
    volumes: [{ formato: "vinho", ml: 750, preco: 59.9 }],
    embalagens: ["unidade", "caixa6"],
    ocasioes: ["festa", "jantar"],
    teorAlcoolico: 11.5,
    podeGelar: true,
  },
  {
    slug: "gin-hendricks",
    nome: "Hendrick's",
    marca: "Hendrick's",
    grupo: "alcoolicas",
    sub: "Gin",
    desc: "Gin escocês com pepino e pétalas de rosa. Faz o gin tônica mais perfumado da casa.",
    volumes: [
      { formato: "destilado", ml: 750, preco: 189.9 },
    ],
    embalagens: ["unidade"],
    ocasioes: ["happy-hour", "festa"],
    teorAlcoolico: 41.4,
    podeGelar: false,
  },
  {
    slug: "vodka-smirnoff",
    nome: "Smirnoff",
    marca: "Smirnoff",
    grupo: "alcoolicas",
    sub: "Vodka",
    desc: "Vodka tridestilada, neutra e versátil. Vai bem com energético ou na caipiroska.",
    volumes: [{ formato: "destilado", ml: 998, preco: 44.9 }],
    embalagens: ["unidade"],
    ocasioes: ["festa"],
    teorAlcoolico: 37.5,
    podeGelar: true,
  },
  {
    slug: "whisky-jack-daniels",
    nome: "Jack Daniel's Old No. 7",
    marca: "Jack Daniel's",
    grupo: "alcoolicas",
    sub: "Whiskey",
    desc: "Tennessee whiskey filtrado em carvão de bordo, macio e adocicado. Clássico da resenha.",
    volumes: [
      { formato: "destilado", ml: 1000, preco: 169.9 },
    ],
    embalagens: ["unidade"],
    ocasioes: ["festa", "happy-hour"],
    teorAlcoolico: 40,
    podeGelar: false,
  },
  {
    slug: "cachaca-envelhecida",
    nome: "Cachaça Envelhecida",
    marca: "Alambique alagoano",
    grupo: "alcoolicas",
    sub: "Cachaça",
    desc: "Cachaça envelhecida em barril de carvalho, feita em Alagoas. TODO(cliente): marca real.",
    volumes: [
      { formato: "destilado", ml: 700, preco: 49.9 },
    ],
    embalagens: ["unidade"],
    ocasioes: ["churrasco", "festa"],
    teorAlcoolico: 40,
    podeGelar: false,
  },
  {
    slug: "drink-tropical",
    nome: "Drink Tropical",
    marca: "Vacation",
    grupo: "alcoolicas",
    sub: "Drink pronto",
    desc: "Drink em lata com vodka e frutas tropicais. Abre e bebe, bem gelado.",
    volumes: [
      { formato: "lata", ml: 355, preco: 12.9 },
    ],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["festa", "happy-hour"],
    teorAlcoolico: 5,
    podeGelar: true,
  },
  {
    slug: "coca-cola",
    nome: "Coca-Cola",
    marca: "Coca-Cola",
    grupo: "sem-alcool",
    sub: "Refrigerante",
    desc: "O refrigerante de sempre, trincando de gelado.",
    volumes: [
      { formato: "lata", ml: 350, preco: 4.99 },
      { formato: "pet", ml: 2000, preco: 12.99 },
    ],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["churrasco", "festa"],
    podeGelar: true,
  },
  {
    slug: "suco-laranja",
    nome: "Suco de Laranja",
    marca: "Suco natural",
    grupo: "sem-alcool",
    sub: "Suco",
    desc: "Suco de laranja integral, sem açúcar, engarrafado no dia.",
    volumes: [
      { formato: "pet", ml: 500, preco: 9.9 },
    ],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["churrasco", "jantar"],
    podeGelar: true,
  },
  {
    slug: "tonica-schweppes",
    nome: "Água Tônica",
    marca: "Schweppes",
    grupo: "sem-alcool",
    sub: "Mixer",
    desc: "Tônica com amargor elegante. Parceira obrigatória do gin.",
    volumes: [{ formato: "lata", ml: 350, preco: 4.99 }],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["happy-hour"],
    podeGelar: true,
  },
  {
    slug: "suco-uva-integral",
    nome: "Suco de Uva Integral",
    marca: "Serra Gaúcha",
    grupo: "sem-alcool",
    sub: "Suco",
    desc: "Suco 100% uva, sem adição de açúcar. Para quem não bebe álcool no jantar.",
    volumes: [{ formato: "vinho", ml: 1000, preco: 24.9 }],
    embalagens: ["unidade"],
    ocasioes: ["jantar"],
    podeGelar: true,
  },
  {
    slug: "agua-mineral",
    nome: "Água Mineral",
    marca: "Fonte local",
    grupo: "sem-alcool",
    sub: "Água",
    desc: "Água mineral sem gás. TODO(cliente): marca vendida na loja.",
    volumes: [
      { formato: "pet", ml: 500, preco: 2.49 },
      { formato: "pet", ml: 1500, preco: 4.49 },
    ],
    embalagens: ["unidade", "fardo12"],
    ocasioes: ["churrasco", "festa"],
    podeGelar: true,
  },
  {
    slug: "agua-com-gas",
    nome: "Água com Gás",
    marca: "Fonte local",
    grupo: "sem-alcool",
    sub: "Água",
    desc: "Água mineral gaseificada. Boa com limão e gelo.",
    volumes: [{ formato: "pet", ml: 500, preco: 2.99 }],
    embalagens: ["unidade", "fardo12"],
    ocasioes: ["happy-hour", "jantar"],
    podeGelar: true,
  },
  {
    slug: "energetico-red-bull",
    nome: "Red Bull",
    marca: "Red Bull",
    grupo: "sem-alcool",
    sub: "Energético",
    desc: "O energético clássico. Puro ou misturado na vodka.",
    volumes: [{ formato: "lata", ml: 250, preco: 9.99 }],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["festa"],
    podeGelar: true,
  },
  {
    slug: "energetico-monster",
    nome: "Monster Energy Ultra",
    marca: "Monster",
    grupo: "sem-alcool",
    sub: "Energético",
    desc: "Energético zero açúcar com sabor cítrico leve.",
    volumes: [
      { formato: "lata", ml: 473, preco: 10.99 },
    ],
    embalagens: ["unidade", "fardo6"],
    ocasioes: ["festa"],
    podeGelar: true,
  },
  {
    slug: "gelo-cubo",
    nome: "Gelo em Cubos",
    marca: "Nobre",
    grupo: "extras",
    sub: "Gelo",
    desc: "Saco de gelo em cubos, filtrado. Indispensável no isopor.",
    volumes: [{ formato: "saco", ml: 5000, preco: 12.0 }],
    embalagens: ["unidade"],
    ocasioes: ["churrasco", "festa", "happy-hour"],
    podeGelar: false,
  },
  {
    slug: "carvao",
    nome: "Carvão Vegetal",
    marca: "Nobre",
    grupo: "extras",
    sub: "Carvão",
    desc: "Saco de carvão vegetal de eucalipto, acende rápido e dura a tarde toda.",
    volumes: [{ formato: "saco", ml: 4000, preco: 24.9 }],
    embalagens: ["unidade"],
    ocasioes: ["churrasco"],
    podeGelar: false,
  },
  {
    slug: "amendoim",
    nome: "Amendoim Torrado",
    marca: "Petisco",
    grupo: "extras",
    sub: "Petisco",
    desc: "Amendoim torrado e salgado. O petisco que não pode faltar na mesa.",
    volumes: [{ formato: "pacote", ml: 500, preco: 11.9 }],
    embalagens: ["unidade"],
    ocasioes: ["happy-hour", "festa"],
    podeGelar: false,
  },
  {
    slug: "batata-chips",
    nome: "Batata Chips",
    marca: "Petisco",
    grupo: "extras",
    sub: "Petisco",
    desc: "Batata ondulada crocante, sabor original.",
    volumes: [{ formato: "pacote", ml: 120, preco: 9.49 }],
    embalagens: ["unidade"],
    ocasioes: ["happy-hour", "festa"],
    podeGelar: false,
  },
  {
    slug: "limao",
    nome: "Limão Tahiti",
    marca: "Hortifruti",
    grupo: "extras",
    sub: "Para drinks",
    desc: "Pacote com 1 kg de limão para caipirinha e gin tônica.",
    volumes: [{ formato: "pacote", ml: 1000, preco: 7.9 }],
    embalagens: ["unidade"],
    ocasioes: ["happy-hour", "churrasco"],
    podeGelar: false,
  },
];

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Fotos ficam em public/img/<pasta>/<slug>.webp — o slug é a chave. */
export const productImg = (slug: string) => `/img/produtos/${slug}.webp`;

export const productAlt = (p: Product) =>
  `${p.nome}, ${p.sub.toLowerCase()} gelada na Nobre Bebidas, adega no Jacintinho em Maceió`;

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const isAlcoolica = (p: Product) => p.teorAlcoolico !== undefined;

const UNIDADES_DE_MEDIDA: Partial<Record<Formato, (ml: number) => string>> = {
  saco: (g) => `${g / 1000} kg`,
  pacote: (g) => (g >= 1000 ? `${g / 1000} kg` : `${g} g`),
};

export function medida(volume: Volume): string {
  const custom = UNIDADES_DE_MEDIDA[volume.formato];
  if (custom) return custom(volume.ml);
  return volume.ml >= 1000 ? `${(volume.ml / 1000).toLocaleString("pt-BR")} L` : `${volume.ml} ml`;
}

export const rotuloVolume = (v: Volume) => `${FORMATOS[v.formato]} ${medida(v)}`;

/** Preço total da seleção, já com o desconto progressivo do fardo/caixa. */
export function precoDe({ volume, embalagem }: Selecao): number {
  const { unidades, desconto } = EMBALAGENS[embalagem];
  return Math.round(volume.preco * unidades * (1 - desconto) * 100) / 100;
}

export const precoPorUnidade = (s: Selecao) => precoDe(s) / EMBALAGENS[s.embalagem].unidades;

export function precoInicial(p: Product): number {
  return Math.min(...p.volumes.map((v) => v.preco));
}

export const productsByOcasiao = (o: Ocasiao) => products.filter((p) => p.ocasioes.includes(o));
