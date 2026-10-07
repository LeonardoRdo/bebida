import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { storeSchema } from "./lib/seo";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/img/logo-nobre.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/img/logo-nobre.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#efe7d7" />
        <meta name="geo.region" content="BR-AL" />
        <meta name="geo.placename" content="Maceió" />
        <Meta />
        <Links />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  if (!isNotFound) console.error("route error", error);

  return (
    <main className="px-page grid min-h-svh place-content-center gap-21 text-center">
      <h1 className="font-serif text-fluid-h2 font-medium">{isNotFound ? "Página não encontrada" : "Algo deu errado"}</h1>
      <p className="text-preto-suave">
        {isNotFound ? "O endereço pode ter mudado." : "Recarregue a página ou volte para o início."}
      </p>
      <a href="/" className="btn mx-auto">
        Voltar para o início
      </a>
    </main>
  );
}
