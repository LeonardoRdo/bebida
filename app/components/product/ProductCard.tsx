import { Link } from "react-router";

import { Img } from "@/components/Img";
import { paths } from "@/lib/paths";
import { brl, isAlcoolica, precoInicial, productAlt, productImg, rotuloVolume, type Product } from "@/lib/products";

type ProductCardProps = { readonly produto: Product; readonly href?: string; readonly priority?: boolean };

export function ProductCard({ produto, href = paths.produto(produto.slug), priority = false }: ProductCardProps) {
  const [primeiroVolume] = produto.volumes;
  const detalhe = [
    primeiroVolume && rotuloVolume(primeiroVolume),
    isAlcoolica(produto) && `${produto.teorAlcoolico?.toLocaleString("pt-BR")}% vol.`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Link
        to={href}
        className="group relative block aspect-card overflow-hidden rounded-[21px] bg-champanhe-200"
      >
        <Img
          src={productImg(produto.slug)}
          alt={productAlt(produto)}
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-apple group-hover:scale-[1.06]"
        />
        {produto.podeGelar && (
          <span className="absolute left-13 top-13 rounded-full bg-white/85 px-13 py-1 text-xs font-medium text-preto backdrop-blur">
            sai gelada
          </span>
        )}
      </Link>
      <div className="flex items-baseline justify-between gap-13 px-1 pt-13">
        <h3 className="text-base font-medium leading-snug">
          <Link to={href}>{produto.nome}</Link>
        </h3>
        <span className="whitespace-nowrap text-ouro-texto">
          {produto.volumes.length > 1 && <span className="text-xs">a partir de </span>}
          {brl(precoInicial(produto))}
        </span>
      </div>
      <p className="px-1 text-sm text-preto-suave">{detalhe}</p>
    </>
  );
}
