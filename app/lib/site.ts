// TODO(cliente): trocar pelo domínio definitivo antes de publicar.
export const SITE_URL = "https://nobrebebidas.com.br";

export const STORE = {
  nome: "Nobre Bebidas",
  slogan: "Tudo em bebidas",
  whatsapp: "5582991079827",
  telefoneExibicao: "(82) 99107-9827",
  instagram: "nobre_bebidas",
  endereco: {
    rua: "Rua Comendador José Geraldo da Silva, 203A",
    bairro: "Jacintinho",
    cidade: "Maceió",
    uf: "AL",
    cep: "57040-000", // TODO(cliente): confirmar CEP
  },
  // TODO(cliente): confirmar coordenadas exatas da loja
  geo: { latitude: -9.6366, longitude: -35.7171 },
} as const;

export const instagramUrl = `https://www.instagram.com/${STORE.instagram}/`;
export const enderecoCompleto = `${STORE.endereco.rua}, ${STORE.endereco.bairro} – ${STORE.endereco.cidade}/${STORE.endereco.uf}`;
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;
