import { Link } from "react-router";

import { paths } from "@/lib/paths";

export function meta() {
  return [{ title: "Página não encontrada | Nobre Bebidas" }, { name: "robots", content: "noindex" }];
}

export default function NotFoundRoute() {
  return <NotFound />;
}

export function NotFound() {
  return (
    <div className="px-page grid min-h-[70svh] place-content-center gap-13 pt-[120px] text-center">
      <h1 className="font-serif text-fluid-h2 font-medium">Essa página não está aqui.</h1>
      <p className="text-preto-suave">O endereço pode ter mudado ou o produto saiu do catálogo.</p>
      <Link to={paths.home} className="btn mx-auto mt-13">
        Voltar para o início
      </Link>
    </div>
  );
}
