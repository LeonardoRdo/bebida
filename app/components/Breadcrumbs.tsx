import { Link } from "react-router";

export type Crumb = { readonly nome: string; readonly path: string };

/** O último item é a página atual e não vira link. */
export function Breadcrumbs({ trilha }: { trilha: readonly Crumb[] }) {
  return (
    <nav aria-label="Você está em" className="text-sm text-preto-suave">
      <ol className="flex flex-wrap items-center gap-x-2">
        {trilha.map((c, i) => {
          const atual = i === trilha.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-x-2">
              {atual ? (
                <span aria-current="page" className="text-preto">
                  {c.nome}
                </span>
              ) : (
                <>
                  <Link to={c.path} className="inline-flex min-h-11 items-center hover:text-ouro-texto">
                    {c.nome}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
