import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("sitemap.xml", "routes/sitemap.ts"),
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("entrega", "routes/entrega.tsx"),
    route("categoria/:slug", "routes/categoria.tsx"),
    route("produto/:slug", "routes/produto.tsx"),
    route("kit/:slug", "routes/kit.tsx"),
    route("kit/:slug/:item", "routes/kit-item.tsx"),
    route("ocasiao/:slug", "routes/ocasiao.tsx"),
    route("volume/:slug", "routes/volume.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
