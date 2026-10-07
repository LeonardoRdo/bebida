# Handoff — Site de loja de bebidas (do zero, repositório novo)

> Cole este arquivo inteiro numa sessão nova do Claude Code, aberta numa pasta vazia.
> Ele foi escrito a partir do site **Femme Beach Wear** (moda praia), que já está pronto. A ideia é repetir a mesma estrutura, trocando roupa por bebida.

---

## 1. Objetivo

Construir do zero uma loja online de bebidas, em pt-BR, com a mesma experiência do site de roupas:

1. **Carrossel de coleções/kits no hero** (tela cheia, crossfade, autoplay).
2. **"Compre por categoria"** — grade de cards com foto, agrupados por grupo maior.
3. **Catálogo completo** com filtros animados.
4. Página de categoria, página de produto, página de kit e **carrinho com checkout pelo WhatsApp** (não tem gateway de pagamento).

Repositório novo, sem copiar arquivos do projeto antigo. Os padrões estão descritos abaixo.

## 2. Antes de codar: perguntar ao usuário

Ainda não foi definido. Pergunte antes de começar (use brainstorming):

- **Nome da loja, cidade e bairro** (vão para SEO, `alt` das fotos e JSON-LD).
- **Tipo de loja:** adega/depósito com delivery, empório de vinhos, distribuidora? Isso muda o tom visual e as categorias.
- **Vende bebida alcoólica?** Se sim, o aviso de +18 é obrigatório (ver seção 7).
- **Identidade visual:** paleta, fontes, logo. Se não houver, propor 2–3 direções (ex.: adega escura com vinho/dourado; empório claro com verde-garrafa; distribuidora vibrante).
- **Fotos:** existem? Se não, usar placeholders com proporção correta e deixar TODO.
- **Número de WhatsApp** (DDI+DDD, só dígitos).
- **Lista inicial de produtos e preços** (ou usar dados fictícios marcados como TODO).
- **Entrega:** só retirada, delivery local, raio/bairros? Pedido mínimo?

## 3. Stack (a mesma do site de roupas)

- **Vite + React 18 + TypeScript + Tailwind 3 + Framer Motion + React Router 7**.
- `createHashRouter` (rotas `#/produto/x`), `base: "./"` e `vite-plugin-singlefile`: o `dist/index.html` abre com duplo clique (file://), sem servidor. Caminhos de imagem sempre relativos (`img/...`, nunca `/img/...`).
- Alias `@` → `src`.
- Título/descrição por rota com um hook `usePageMeta(title, description)` que altera `document.title` e a `meta[name=description]`. SEO e JSON-LD fixos no `index.html` (`@type: "LiquorStore"` ou `"Store"`).
- Scripts: `dev`, `build` (`tsc && vite build`), `preview`.
- Criar um `CLAUDE.md` no projeto novo descrevendo comandos, princípios de design, estrutura e TODO (o site de roupas tem um, e ajudou muito).

## 4. Modelo de dados (fonte única em `src/lib/`)

Tudo é dado tipado. Os componentes só leem esses dados. Para adicionar um produto, basta editar um array.

### `src/lib/products.ts` — catálogo
```ts
export type Grupo = "alcoolicas" | "sem-alcool" | "extras";   // equivale a Cat ("praia" | "fitness")
export type Volume = { rotulo: string; ml: number };            // equivale a tamanho (P/M/G)
export type Product = {
  slug: string; nome: string; preco: number; grupo: Grupo; sub: string;
  img: string; hero?: string; alt: string; desc: string;
  volumes: readonly Volume[];     // ex.: lata 350ml, long neck 355ml, garrafa 600ml
  embalagens?: readonly Embalagem[]; // unidade / fardo 12 / caixa 6 — preço por embalagem
  teorAlcoolico?: number;         // % — ausente = sem álcool
};
export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const bySlug = (s: string) => products.find((p) => p.slug === s);
```
- No produto, a escolha de **volume/embalagem** fica no lugar da escolha de **cor/tamanho**.
- No site de roupas, o filtro "Encontre seu ajuste perfeito" filtrava por tamanho (`/tamanho/:tam`). Aqui ele vira **filtro por volume ou ocasião** (`/ocasiao/:slug`: churrasco, happy hour, jantar, festa). Decidir com o usuário qual dos dois.

### `src/lib/categories.ts` — "Compre por categoria"
```ts
export type Category = {
  slug: string; nome: string; grupo: Grupo;
  img?: string;          // sem foto, o card mostra só o nome sobre a cor de fundo
  imgPos?: string;       // classe object-position quando o centro corta o produto
  produtos: readonly string[]; // slugs; um produto pode estar em mais de uma categoria
};
export const GRUPOS: Record<Grupo, string> = { alcoolicas: "Alcoólicas", "sem-alcool": "Sem álcool", extras: "Para acompanhar" };
export const categoryBySlug = (slug: string) => ...;
export const categoriesOf = (grupo: Grupo) => ...;
export const categoryProducts = (c: Category) => products.filter((p) => c.produtos.includes(p.slug));
```
Sugestão de categorias: Cervejas, Cervejas especiais, Vinhos, Espumantes, Destilados, Drinks prontos · Refrigerantes, Sucos, Águas, Energéticos · Gelo, Carvão, Petiscos.

### `src/lib/collections.ts` — kits do carrossel
No site de roupas, cada coleção tinha **peças avulsas + conjunto completo com desconto**, e o card do conjunto mostrava um selo "Economize R$ X". Aqui isso vira **kits**:
```ts
export type Kit = {
  slug: string; nome: string; eyebrow: string; desc: string;
  itens: readonly Product[];   // podem ser comprados avulsos
  kit: Product;                // o kit fechado, mais barato que a soma
};
export const kitSavings = (k: Kit) => k.itens.reduce((s, p) => s + p.preco, 0) - k.kit.preco;
```
Exemplos: **Kit Churrasco** (fardo de cerveja + gelo + carvão), **Noite de Vinho** (tinto + branco + queijos), **Happy Hour** (gin + tônica + limão), **Sem Álcool** (refrigerantes + sucos + água com gás).

## 5. Componentes e páginas

| Rota | Página | Componentes principais |
|---|---|---|
| `/` | Home | `Hero` (carrossel) → `ShopByOccasion`/filtro → `ShopByCategory` → `Catalog` → `Instagram` |
| `/categoria/:slug` | CategoryPage | migalhas + título + filtro lateral + grade de `ProductCard` |
| `/produto/:slug` | ProductPage | foto, volume/embalagem, quantidade, "Adicionar ao carrinho" |
| `/kit/:slug` | KitPage | itens avulsos + card do kit em destaque com o selo "Economize" |
| `/kit/:slug/:item` | KitItemPage | reaproveita o mesmo `ProductClient` da página de produto |
| `*` | NotFound | |

O layout global envolve tudo com `CartProvider`, `Header`, `<main><Outlet/></main>`, `Footer`, `CartDrawer`, `WhatsAppFab` e `ScrollRestoration`.

### Hero (carrossel) — refazer com o mesmo comportamento
- `section` em `h-[100svh]` com `aria-roledescription="carrossel"` e `aria-label`.
- Slides definidos num array `{ img, alt, eyebrow, title, text, href }`, cada um apontando para `/kit/:slug`.
- `AnimatePresence` com crossfade: a nova imagem entra com `opacity 0→1` e `scale 1.08→1` em 1.4s, easing `[0.16, 1, 0.3, 1]`.
- Autoplay a cada 6s com `setTimeout` reiniciado a cada troca de índice. **Pausa** no `mouseenter`/`focus` e **desliga** com `useReducedMotion()`.
- `aria-live="polite"` quando o autoplay está parado e `"off"` quando está rodando.
- Setas prev/next de ≥44px, configuradas num mapa `{ prev: {label, side, path}, next: {...} }`.
- Se as fotos forem verticais (garrafas costumam ser): colocar uma cópia desfocada (`blur-2xl scale-110 object-cover`) atrás e a foto inteira (`object-contain`) por cima, com overlay `bg-black/40` para o texto continuar legível.
- CTA branco arredondado ("garantir kit").

### ShopByCategory
- Eyebrow "Categorias" + h2 serif "Compre por *categoria.*"
- Um bloco por grupo (`GRUPOS`), com uma grade `repeat(auto-fill, minmax(clamp(144px,15vw,233px),1fr))`.
- Card: `aspect-card`, `rounded-[21px]`, foto com `group-hover:scale-[1.06]` em 1400ms e nome sobre um gradiente escuro embaixo.

### Catalog (catálogo completo)
- Botões de filtro (`Todos` + um por grupo) com `aria-pressed`, dentro de `role="group"`.
- Grade com `motion.div layout` + `AnimatePresence mode="popLayout"`. Os cards entram com `whileInView`, `y: 55→0` e delay escalonado `(i % 4) * 0.089`.

### Carrinho
- Contexto com `items`, `add`, `remove`, `setQty` (limite 1..10), `count`, `total` e `checkoutUrl`.
- A chave do item junta `nome|volume|embalagem`. Adicionar um item que já existe soma a quantidade.
- Persistência em `localStorage`. O drawer lateral entra pela direita, mostra miniatura, controle de quantidade e o botão "Finalizar pelo WhatsApp", que dá um pulso quando abre logo depois de adicionar um item.
- A mensagem do WhatsApp lista `• 2x Cerveja X (lata 350ml, fardo 12) – R$ ...` e termina com o total.
- Depois de adicionar, abrir um diálogo de confirmação ("Continuar comprando" / "Ver carrinho").

## 6. Princípios de design (os mesmos do site de roupas)

- **Proporção áurea (φ = 1.618):** escala tipográfica 1 / 1.618 / 2.618 / 4.236 / 6.854rem; espaçamentos Fibonacci (8, 13, 21, 34, 55, 89, 144px) registrados no `tailwind.config` (`spacing: { 13, 21, 34, 55, 89, 144 }`); colunas `1.618fr 1fr`; cards `aspect 1 / 1.382`.
- **Layout fluido:** tipografia e margens com `clamp()`, nunca largura fixa em px. Utilitário `.px-page` = `px-[clamp(21px,5vw,89px)]`.
- **Movimento no estilo Apple:** easing `cubic-bezier(.16,1,.3,1)` (`ease-apple`), durações de 1 a 1.4s, header fixo com vidro fosco (`backdrop-blur-xl`) e componente `Reveal` para as entradas (sobe 55px, `scale .97→1`, `whileInView once`).
- **Reduced motion em todos os componentes Framer, desde o início.** No site de roupas isso ficou como TODO e só o hero e o drawer tratavam. Aqui, todo componente animado usa `useReducedMotion()`.
- **Acessibilidade:** alvos de toque ≥44px, contraste ≥4.5:1, `alt` descritivo em pt-BR (citando a cidade) e menus de categoria no header que abrem por hover **e** por `:focus-visible`.
- Fontes e paleta: **novas**, definidas com o usuário. Registrar como tokens no Tailwind (o site de roupas usava `areia`/`terra`).

## 7. O que muda por ser loja de bebidas

- **Lei 13.106/2015 + Lei 9.294/96:** venda de bebida alcoólica para menores de 18 anos é proibida.
  - **Age gate** na primeira visita ("Você tem 18 anos ou mais?"), com a resposta guardada em `localStorage`. Se a resposta for "não", mostrar uma tela de bloqueio educada, sem dar acesso ao catálogo alcoólico.
  - Aviso **"Beba com moderação. Venda proibida para menores de 18 anos."** no footer e no carrinho.
  - A mensagem do WhatsApp avisa que um documento será pedido na entrega.
- **Cards de produto:** mostrar volume e teor alcoólico. "Gelada" pode ser uma opção sem custo.
- **Embalagem** (unidade/fardo/caixa) muda o preço. Mostrar o preço por unidade quando for fardo.
- O JSON-LD usa `LiquorStore` se a loja for de bebida alcoólica.

## 8. Padrões de código (obrigatórios)

Carregar as skills `code-quality` + `typescript` + `react` + `frontend-design` antes de implementar.

- TS estrito, sem `any`, sem `as` para forçar tipo e sem `!`.
- Dados `readonly`, `as const` em vez de enum e mapas (`Record`) em vez de cadeias de if/switch (o hero usa `ARROWS[direction]`, os grupos usam `GRUPOS[grupo]`).
- Funções curtas e early return. Uma página inválida retorna `<NotFound />`.
- **Não repetir dois problemas do site de roupas:**
  1. O `CartProvider` antigo tem `catch {}` vazio ao ler o `localStorage` e cria o contexto com `null as never`. No novo: ler com um inicializador lazy do `useState`, validar o JSON (type guard), logar a falha (`console.warn`) e fazer `useCart()` lançar um erro se for usado fora do provider.
  2. O reduced motion ficou incompleto (ver seção 6).
- Imagens servidas por um componente `Img` (`fill`, `priority`, `loading="lazy"` e `decoding="async"` por padrão). Usar WebP desde o início.
- Commits convencionais (`feat: ...`, `chore: ...`, descrição em minúscula) e commit ao fim de cada tarefa.

## 9. Ordem sugerida de execução

1. Brainstorming com o usuário (seção 2) → spec curta.
2. Scaffold do Vite, Tailwind com os tokens, `vite-plugin-singlefile`, HashRouter, `CLAUDE.md` → commit.
3. Camada de dados (`products`, `categories`, `collections`/kits, `whatsapp`, `usePageMeta`) com dados de exemplo → commit.
4. Layout: Header (vidro fosco + menu de categorias + menu mobile), Footer, `Reveal`, `Img` → commit.
5. Hero com o carrossel → commit.
6. ShopByCategory + CategoryPage → commit.
7. Catálogo com filtros + ProductCard + ProductPage → commit.
8. Kits: KitPage + KitItemPage + selo "Economize" → commit.
9. Carrinho (Provider, Drawer, diálogo de adicionado, checkout pelo WhatsApp) → commit.
10. Age gate + avisos legais → commit.
11. `npm run build`, abrir `dist/index.html` com duplo clique e conferir rotas, carrossel, carrinho e reduced motion. Rodar o Lighthouse.

## 10. Critérios de pronto

- `npm run build` sem erro de TypeScript, e o `dist/index.html` funciona via file://.
- O carrossel troca sozinho, pausa no hover e no foco, e fica parado com reduced motion. As setas funcionam pelo teclado.
- Todas as categorias abrem e mostram os produtos certos. Uma categoria vazia mostra "Novidades chegando em breve" com um link para o catálogo.
- Os filtros do catálogo animam sem quebrar o layout.
- O kit mostra a economia calculada (`kitSavings`), não um valor escrito à mão.
- O carrinho persiste ao recarregar a página e a mensagem do WhatsApp sai formatada com o total.
- O age gate aparece na primeira visita e o aviso legal aparece no footer e no carrinho.
- Lighthouse: a11y ≥ 95, SEO ≥ 95.
