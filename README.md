# Nobre Bebidas — site da adega

Mockup de loja online da **Nobre Bebidas**, adega/depósito com delivery no Jacintinho, Maceió/AL. Tem catálogo, kits e carrinho com **checkout pelo WhatsApp** (sem gateway de pagamento). A prioridade é **SEO local** ("cerveja gelada maceió", "bebida gelada maceió").

## Rodando o projeto

Requisitos: Node.js e npm.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # typegen + tsc + build com pré-render em build/client
npm run preview    # serve o build estático em http://localhost:4173
npm run typecheck  # só checagem de tipos
```

> Use `npm run preview` (que usa o `serve`) em vez de `vite preview`: o Vite não resolve `/rota` para `/rota/index.html`.

## Stack

- **React 19** + **React Router 8** em modo framework, com `prerender` e `ssr: false`
- **Tailwind CSS 4** (tokens em `app/app.css`)
- **Motion** (Framer) para animações
- **TypeScript** estrito e **Vite**
- Alias `@/` → `app/`

Cada URL vira um HTML estático com `<title>`, description, canonical e JSON-LD próprios, o que ajuda o Google a indexar. O handoff original pedia HashRouter e arquivo único, mas o Google ignora o `#`, então a escolha foi trocada em favor do SEO.

## Estrutura

```
app/
  app.css          tokens do Tailwind (@theme) e utilitários
  root.tsx         layout global + JSON-LD (LiquorStore)
  lib/
    products.ts    catálogo, formatos, embalagens, ocasiões
    categories.ts  categorias por grupo e filtros por volume
    kits.ts        kits (economia sempre calculada)
    delivery.ts    bairros e taxas de entrega
    hours.ts       horário e status "Aberto agora"
    site.ts        endereço, WhatsApp, domínio (SITE_URL)
    cart.ts        funções puras do carrinho e mensagem do WhatsApp
    paths.ts       lista de rotas pré-renderizadas + sitemap
    seo.ts         helper pageMeta
public/
  img/{hero,categorias,produtos,instagram}/<slug>.webp
  robots.txt
```

## Como adicionar conteúdo

- **Produto, categoria ou kit novo:** edite o array em `app/lib/`. A rota entra sozinha no pré-render e no `/sitemap.xml` (via `allPaths` em `paths.ts`).
- **Fotos:** o nome do arquivo é o slug (`productImg`, `categoryImg`, `kitImg`). Hoje são fotos do Unsplash, com créditos em `public/img/creditos.json`.

## Recursos

- Catálogo, categorias, páginas de produto e de kit
- Carrinho persistido no navegador, com mensagem pronta para o WhatsApp
- Taxa de entrega por bairro e status "Aberto agora"
- **Age gate** na primeira visita (Lei 13.106/2015) e aviso "Beba com moderação. Venda proibida para menores de 18 anos." no footer, carrinho e produto alcoólico
- A mensagem do WhatsApp avisa que haverá pedido de documento

O estado do navegador (carrinho, bairro, maioridade) é lido do `localStorage` só **depois** da hidratação, para o HTML pré-renderizado bater com o primeiro render. O conteúdo indexável fica no HTML.

## Design

- Visual baseado no site da Femme Beach Wear: fundo claro, fotos em tudo, títulos serifados com ênfase em itálico
- Fontes: Cormorant Garamond (títulos) e Jost (texto)
- Proporção áurea e espaçamentos Fibonacci (13, 21, 34, 55, 89, 144 px)
- Movimento estilo Apple (`ease-apple`); todo componente animado respeita `useReducedMotion()`
- Alvos de toque ≥ 44px, foco visível, contraste AA