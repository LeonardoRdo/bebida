import { Link } from "react-router";

import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { FAQS } from "@/lib/faq";
import { paths } from "@/lib/paths";
import { instagramUrl, STORE } from "@/lib/site";

// TODO(cliente): trocar pelas fotos reais do Instagram da loja.
const POSTS = [1, 2, 3, 4, 5, 6] as const;

/** Texto local para quem busca "bebida gelada maceió" e afins, FAQ (schema FAQPage na rota) e Instagram. */
export function LocalInfo() {
  return (
    <>
      <section aria-labelledby="local-titulo" className="px-page mx-auto grid max-w-[1680px] gap-[clamp(34px,5vw,89px)] py-[clamp(55px,8vw,144px)] lg:grid-cols-[1fr_1.618fr]">
        <Reveal>
          <p className="eyebrow">Delivery em Maceió</p>
          <h2 id="local-titulo" className="font-serif text-fluid-h2 font-medium">
            Bebida gelada <em className="text-ouro">no Jacintinho</em> e em toda Maceió.
          </h2>
          <div className="mt-21 space-y-13 leading-[1.618]">
            <p>
              A {STORE.nome} é uma adega no Jacintinho que entrega bebida gelada em Maceió. Tem cerveja em lata, long neck e
              litrão, destilados, vinhos, refrigerantes, gelo e carvão. A cerveja fica no freezer até a hora de sair.
            </p>
            <p>
              Entregamos no Farol, na Ponta Verde, na Jatiúca, no Barro Duro, na Serraria, na Gruta de Lourdes e em mais
              bairros. A taxa aparece no carrinho assim que você escolhe o bairro.
            </p>
          </div>
          <Link to={paths.entrega} className="btn-line mt-34">
            Ver bairros e taxas
          </Link>
        </Reveal>

        <div>
          <h2 className="font-serif text-fluid-h3 font-medium italic">Perguntas frequentes</h2>
          <div className="mt-21 divide-y divide-preto/15 border-y border-preto/15">
            {FAQS.map((f) => (
              <details key={f.pergunta} className="group">
                <summary className="flex min-h-[55px] cursor-pointer list-none items-center justify-between gap-13 py-13 font-medium [&::-webkit-details-marker]:hidden">
                  {f.pergunta}
                  <span aria-hidden="true" className="text-2xl font-light text-ouro-texto transition-transform duration-500 ease-apple group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-21 leading-[1.618] text-preto-suave">{f.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-page mx-auto grid max-w-[1680px] items-center gap-[clamp(21px,3.4vw,55px)] pb-[clamp(89px,10vw,144px)] md:grid-cols-2">
        <Reveal>
          <h2 className="font-serif text-fluid-h2 font-medium">
            Siga a <em className="text-ouro">Nobre</em> no Instagram.
          </h2>
          <p className="mb-34 mt-21 leading-[1.618]">Promoções da semana, chegadas novas e o freezer cheio, direto do Jacintinho.</p>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn">
            Seguir @{STORE.instagram}
          </a>
        </Reveal>
        <div className="grid grid-cols-3 gap-13">
          {POSTS.map((n, i) => (
            <Reveal key={n} delay={i * 0.089}>
              <div className="relative aspect-card overflow-hidden rounded-[13px] bg-champanhe-200">
                <Img src={`/img/instagram/${n}.webp`} alt="Post do Instagram da Nobre Bebidas em Maceió" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
