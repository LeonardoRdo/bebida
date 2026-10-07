export type Bairro = { readonly slug: string; readonly nome: string; readonly taxa: number };

export type Entrega =
  | { readonly tipo: "bairro"; readonly bairro: Bairro }
  | { readonly tipo: "retirada" }
  | { readonly tipo: "a-combinar" };

// TODO(cliente): taxas fictícias, em faixas pela distância até o Jacintinho.
const faixa = (taxa: number, nomes: readonly string[]): Bairro[] =>
  nomes.map((nome) => ({ slug: slugify(nome), nome, taxa }));

export const BAIRROS: readonly Bairro[] = [
  ...faixa(4, ["Jacintinho", "Feitosa", "Barro Duro", "Pitanguinha", "São Jorge"]),
  ...faixa(6, ["Gruta de Lourdes", "Farol", "Serraria", "Jatiúca", "Mangabeiras", "Poço", "Canaã"]),
  ...faixa(8, ["Ponta Verde", "Pajuçara", "Cruz das Almas", "Santa Amélia", "Pinheiro", "Pitanguinha de Baixo"]),
  ...faixa(10, ["Centro", "Jaraguá", "Tabuleiro do Martins", "Antares", "Ouro Preto", "Petrópolis"]),
  ...faixa(14, ["Benedito Bentes", "Cidade Universitária", "Clima Bom", "Jacarecica", "Guaxuma"]),
].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

export const RETIRADA_SLUG = "retirada";
export const A_COMBINAR_SLUG = "outro";

function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function entregaFromSlug(slug: string): Entrega | undefined {
  if (slug === RETIRADA_SLUG) return { tipo: "retirada" };
  if (slug === A_COMBINAR_SLUG) return { tipo: "a-combinar" };
  const bairro = BAIRROS.find((b) => b.slug === slug);
  return bairro && { tipo: "bairro", bairro };
}

/** Taxa em reais, ou `undefined` quando ainda será combinada pelo WhatsApp. */
export function taxaDe(entrega: Entrega): number | undefined {
  switch (entrega.tipo) {
    case "bairro":
      return entrega.bairro.taxa;
    case "retirada":
      return 0;
    case "a-combinar":
      return undefined;
  }
}

export function rotuloEntrega(entrega: Entrega): string {
  switch (entrega.tipo) {
    case "bairro":
      return `Entrega no bairro ${entrega.bairro.nome}`;
    case "retirada":
      return "Retirada na loja (Jacintinho)";
    case "a-combinar":
      return "Entrega em outro bairro (taxa a combinar)";
  }
}

export const FAIXAS_DE_TAXA = [...new Set(BAIRROS.map((b) => b.taxa))]
  .sort((a, b) => a - b)
  .map((taxa) => ({ taxa, bairros: BAIRROS.filter((b) => b.taxa === taxa).map((b) => b.nome) }));
