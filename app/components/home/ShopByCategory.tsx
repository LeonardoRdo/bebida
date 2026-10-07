import { Link } from "react-router";

import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { categoriesOf, categoryImg, GRUPO_ORDEM, GRUPOS, type Category } from "@/lib/categories";
import { paths } from "@/lib/paths";

export function ShopByCategory() {
  return (
    <section id="categorias" className="px-page mx-auto max-w-[1680px] scroll-mt-[72px] py-[clamp(55px,8vw,144px)]">
      <Reveal>
        <p className="eyebrow">Categorias</p>
        <h2 className="font-serif text-fluid-h2 font-medium">
          Compre por <em className="text-ouro">categoria.</em>
        </h2>
      </Reveal>
      {GRUPO_ORDEM.map((grupo) => (
        <div key={grupo} className="mt-[clamp(34px,4vw,55px)]">
          <h3 className="font-serif text-fluid-h3 font-medium italic">{GRUPOS[grupo]}</h3>
          <ul className="mt-13 grid grid-cols-[repeat(auto-fill,minmax(clamp(144px,15vw,233px),1fr))] gap-[clamp(13px,1.6vw,21px)]">
            {categoriesOf(grupo).map((c) => (
              <li key={c.slug}>
                <CategoryCard categoria={c} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function CategoryCard({ categoria }: { categoria: Category }) {
  return (
    <Link to={paths.categoria(categoria.slug)} className="group relative block aspect-card overflow-hidden rounded-[21px] bg-preto">
      <Img
        src={categoryImg(categoria.slug)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-apple group-hover:scale-[1.06]"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-13 pb-13 pt-55 font-medium text-white">
        {categoria.nome}
      </span>
    </Link>
  );
}
