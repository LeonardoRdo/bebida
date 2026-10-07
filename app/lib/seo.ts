import { categories } from "./categories";
import { BAIRROS } from "./delivery";
import { openingHoursSchema } from "./hours";
import { brl, isAlcoolica, precoInicial, productImg, type Product } from "./products";
import { absoluteUrl, instagramUrl, SITE_URL, STORE } from "./site";

type PageMeta = { readonly title: string; readonly description: string; readonly path: string };

/** Título, descrição, canonical e Open Graph de uma página — formato aceito pelo `meta` das rotas. */
export function pageMeta({ title, description, path }: PageMeta) {
  const url = absoluteUrl(path);
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:image", content: absoluteUrl("/img/hero/kit-churrasco.webp") },
  ];
}

export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "LiquorStore",
  "@id": `${SITE_URL}/#loja`,
  name: STORE.nome,
  slogan: STORE.slogan,
  description:
    "Adega e depósito de bebidas no Jacintinho, em Maceió. Cerveja gelada, destilados, vinhos, gelo e carvão com delivery para Maceió.",
  url: SITE_URL,
  image: absoluteUrl("/img/logo-nobre.png"),
  logo: absoluteUrl("/img/logo-nobre.png"),
  telephone: `+${STORE.whatsapp}`,
  priceRange: "$",
  currenciesAccepted: "BRL",
  paymentAccepted: "Dinheiro, Pix, Cartão de crédito, Cartão de débito",
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE.endereco.rua,
    addressLocality: STORE.endereco.cidade,
    addressRegion: STORE.endereco.uf,
    postalCode: STORE.endereco.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", ...STORE.geo },
  openingHoursSpecification: openingHoursSchema,
  areaServed: [
    { "@type": "City", name: "Maceió" },
    ...BAIRROS.map((b) => ({ "@type": "Place", name: `${b.nome}, Maceió - AL` })),
  ],
  sameAs: [instagramUrl],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Bebidas",
    itemListElement: categories.map((c) => ({ "@type": "OfferCatalog", name: c.nome })),
  },
};

export function productSchema(p: Product, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nome,
    brand: { "@type": "Brand", name: p.marca },
    description: p.desc,
    category: p.sub,
    image: absoluteUrl(productImg(p.slug)),
    url: absoluteUrl(path),
    offers: {
      "@type": "Offer",
      price: precoInicial(p).toFixed(2),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#loja` },
      ...(isAlcoolica(p) && { eligibleCustomerType: "Maiores de 18 anos" }),
    },
  };
}

export type Faq = { readonly pergunta: string; readonly resposta: string };

export const faqSchema = (faqs: readonly Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
});

export const breadcrumbSchema = (trilha: readonly { nome: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trilha.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.nome,
    item: absoluteUrl(t.path),
  })),
});

export const precoLegivel = (p: Product) => `a partir de ${brl(precoInicial(p))}`;
