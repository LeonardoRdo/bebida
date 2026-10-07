# Nobre Bebidas — site da adega

Mockup de loja online da **Nobre Bebidas** (adega/depósito com delivery no Jacintinho, Maceió/AL). Catálogo, kits e carrinho com checkout pelo WhatsApp, sem gateway de pagamento. Prioridade número 1 é **SEO local** ("cerveja gelada maceió", "bebida gelada maceió").

## Comandos

- `npm run dev` — servidor de desenvolvimento (http://localhost:5173)
- `npm run build` — typegen + `tsc` + build com pré-render de todas as rotas em `build/client`
- `npm run preview` — serve o build estático em http://localhost:4173 (use isso, não `vite preview`: ele não resolve `/rota` para `/rota/index.html`)

## Stack e decisões

- React Router 8 em **modo framework com `prerender` e `ssr: false`**. Cada URL vira um HTML estático com `<title>`, description, canonical e JSON-LD próprios. O handoff original pedia HashRouter + arquivo único (file://), mas o Google ignora o `#`, então foi trocado em favor do SEO.
- Lista de rotas pré-renderizadas: `app/lib/paths.ts` (`allPaths`) — também gera o `/sitemap.xml`. Produto/categoria/kit novo entra sozinho.
- Meta por rota via export `meta` + helper `pageMeta` (`app/lib/seo.ts`). JSON-LD `LiquorStore` fixo no `root.tsx`.
- Visual baseado no site de referência (Femme Beach Wear, em `site referencia/`, fora do git): fundo claro, fotos em tudo, títulos serifados com ênfase em itálico.
- Tailwind 4 com tokens em `app/app.css` (`@theme`): cores `champanhe-50/100/200`, `preto`, `preto-suave`, `ouro` (só texto grande), `ouro-texto` (texto pequeno, contraste AA), `ouro-claro` (sobre preto); espaçamentos Fibonacci `13/21/34/55/89/144` (px); `text-fluid-h1/xl/h2/h3`; `ease-apple`; `aspect-card`; utilitários `px-page`, `eyebrow`, `btn`, `btn-line`.
- Fontes: Cormorant Garamond (títulos) + Jost (texto). Alias `@/` → `app/`.
- Estado do navegador (carrinho, bairro, maioridade) usa `usePersistentState`: lê o localStorage **depois** da hidratação para o HTML pré-renderizado bater com o primeiro render. Falhas de leitura/JSON inválido viram `console.warn`.
- Tudo que depende de relógio ou localStorage (status "Aberto agora", age gate) só aparece após hidratação — o conteúdo indexável fica no HTML.

## Dados (fonte única em `app/lib/`)

- `products.ts` — catálogo, formatos, embalagens (desconto de fardo), ocasiões, `precoDe`.
- `categories.ts` — categorias por grupo e filtros por volume.
- `kits.ts` — kits do carrinho; economia sempre calculada (`kitSavings`).
- `delivery.ts` — bairros e taxas; `hours.ts` — horário e status da loja; `site.ts` — endereço, WhatsApp, domínio.
- `cart.ts` — funções puras do carrinho e a mensagem do WhatsApp.

## Princípios de design

- Proporção áurea e Fibonacci em tipografia, espaçamento e colunas (`1.618fr 1fr`).
- Movimento estilo Apple (`ease-apple`, 1–1.4s); **todo componente Framer usa `useReducedMotion()`**.
- Alvos de toque ≥ 44px, foco visível, contraste AA, menus abrem por hover e por foco.
- Fotos em `public/img/{hero,categorias,produtos,instagram}/<slug>.webp`: o nome do arquivo é o slug (`productImg`, `categoryImg`, `kitImg`). Hoje são fotos do Unsplash (licença livre, origem em `public/img/creditos.json`).

## Legal

Age gate na primeira visita (Lei 13.106/2015), aviso "Beba com moderação. Venda proibida para menores de 18 anos." no footer, carrinho e produto alcoólico, e a mensagem do WhatsApp avisa que haverá pedido de documento.

## TODO (se o cliente fechar)

- Domínio real em `SITE_URL` (`site.ts`) e `public/robots.txt`; CEP e coordenadas exatas.
- Produtos, preços, kits e taxas reais (tudo marcado `TODO(cliente)`).
- Fotos reais dos produtos e da loja no lugar das do Unsplash, e logo em alta (o atual tem ~150px).
- Performance: Lighthouse 63–72 (LCP ~5s em 4G simulado); self-host das fontes e `srcset` nas fotos. A11y/SEO/best-practices em 100.
- Perfil da Empresa no Google com o mesmo nome/endereço/telefone — pesa mais que o site para busca local.
- Deploy: Vercel ou Netlify servindo `build/client` como estático.
