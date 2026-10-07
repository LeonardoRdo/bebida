import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAIXAS_DE_TAXA } from "@/lib/delivery";
import { HORARIOS_RESUMO } from "@/lib/hours";
import { paths } from "@/lib/paths";
import { brl } from "@/lib/products";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { enderecoCompleto } from "@/lib/site";

const TRILHA = [
  { nome: "Início", path: paths.home },
  { nome: "Entrega e bairros", path: paths.entrega },
];

export function meta() {
  return [
    ...pageMeta({
      title: "Delivery de bebidas em Maceió: bairros e taxas | Nobre Bebidas",
      description:
        "Veja os bairros de Maceió atendidos pelo delivery da Nobre Bebidas e a taxa de cada um. Saímos do Jacintinho com a cerveja gelada.",
      path: paths.entrega,
    }),
    { "script:ld+json": breadcrumbSchema(TRILHA) },
  ];
}

export default function EntregaPage() {
  return (
    <div className="px-page mx-auto max-w-[1680px] pt-[110px]">
      <Breadcrumbs trilha={TRILHA} />
      <header className="mt-13 max-w-3xl">
        <h1 className="font-serif text-fluid-h2 font-medium">Delivery de bebidas em Maceió</h1>
        <p className="mt-13 text-lg text-preto">
          A entrega sai da loja no Jacintinho ({enderecoCompleto}). A taxa depende da distância, e você escolhe o bairro
          no carrinho antes de finalizar pelo WhatsApp.
        </p>
      </header>

      <div className="mt-55 grid gap-55 lg:grid-cols-[1.618fr_1fr]">
        <section aria-labelledby="bairros-titulo">
          <h2 id="bairros-titulo" className="font-serif text-fluid-h3 font-medium">
            Bairros atendidos
          </h2>
          <div className="mt-21 divide-y divide-preto/15 border-y border-preto/15">
            {FAIXAS_DE_TAXA.map((f) => (
              <div key={f.taxa} className="grid gap-2 py-21 sm:grid-cols-[144px_1fr]">
                <p className="font-serif text-[1.618rem] font-medium text-ouro-texto">{brl(f.taxa)}</p>
                <p className="text-preto">{f.bairros.join(", ")}</p>
              </div>
            ))}
          </div>
          <p className="mt-13 text-sm text-preto-suave">
            Não achou seu bairro? Escolha “Outro bairro” no carrinho e a gente combina a taxa pelo WhatsApp. Retirada na
            loja é grátis.
          </p>
        </section>

        <aside aria-labelledby="horario-titulo" className="self-start rounded-[21px] border border-preto/15 bg-champanhe-50 p-34">
          <h2 id="horario-titulo" className="font-serif text-[1.618rem] font-medium">
            Horário do delivery
          </h2>
          <dl className="mt-13 space-y-2">
            {HORARIOS_RESUMO.map((h) => (
              <div key={h.dias} className="flex justify-between gap-13">
                <dt className="text-preto-suave">{h.dias}</dt>
                <dd>{h.horas}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-21 text-sm text-preto-suave">
            Para pedidos com bebida alcoólica, um documento com foto é pedido na entrega.
          </p>
        </aside>
      </div>
    </div>
  );
}
