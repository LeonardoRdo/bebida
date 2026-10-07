import { Link } from "react-router";

import { categories } from "@/lib/categories";
import { HORARIOS_RESUMO } from "@/lib/hours";
import { paths } from "@/lib/paths";
import { enderecoCompleto, instagramUrl, STORE } from "@/lib/site";

export const AVISO_LEGAL = "Beba com moderação. Venda proibida para menores de 18 anos.";

const STORE_QUERY = encodeURIComponent(`${STORE.nome}, ${enderecoCompleto}`);
// Embed sem chave de API; o link abre o Google Maps para traçar a rota
const MAP_EMBED = `https://www.google.com/maps?q=${STORE_QUERY}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${STORE_QUERY}`;

const LINK = "text-champanhe-50 underline-offset-4 hover:text-ouro-claro hover:underline";

export function Footer() {
  return (
    <footer id="contato" className="scroll-mt-[72px] bg-preto px-[clamp(21px,5vw,89px)] pb-34 pt-[clamp(55px,7vw,89px)] text-champanhe-50">
      <div className="mx-auto grid max-w-[1680px] gap-[clamp(34px,3.4vw,55px)] md:grid-cols-3">
        <div className="text-[15px] leading-[1.618]">
          <address className="not-italic">
            <p className="mb-13 text-xs uppercase tracking-[.2em] text-ouro-claro">Onde estamos</p>
            {STORE.endereco.rua}
            <br />
            {STORE.endereco.bairro}, {STORE.endereco.cidade} - {STORE.endereco.uf}
            <br />
            <a href={`https://wa.me/${STORE.whatsapp}`} className={LINK}>
              WhatsApp {STORE.telefoneExibicao}
            </a>
          </address>
          <iframe
            src={MAP_EMBED}
            title={`Mapa da ${STORE.nome} no Jacintinho, Maceió`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-21 aspect-[1.618/1] w-full rounded-[13px] border-0"
          />
          <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="btn mt-13 w-full !bg-champanhe-50 !text-preto hover:!bg-ouro-claro">
            Abrir no Google Maps
          </a>
        </div>

        <div className="text-center">
          <img src="/img/logo-nobre.png" alt="" width={89} height={89} loading="lazy" className="mx-auto size-[89px] rounded-full" />
          <p className="mt-13 font-serif text-[55px] font-semibold leading-none">Nobre</p>
          <p className="mb-21 mt-2 text-[11px] tracking-[.34em] text-ouro-claro">BEBIDAS</p>
          <p className="mx-auto max-w-[30em] text-[15px] leading-[1.618] text-champanhe-50/85">
            Adega e depósito de bebidas no Jacintinho. Cerveja gelada, destilados, vinhos, gelo e carvão com delivery para
            Maceió.
          </p>
          <dl className="mx-auto mt-21 grid max-w-[260px] grid-cols-[auto_1fr] gap-x-21 gap-y-1 text-left text-[15px]">
            {HORARIOS_RESUMO.map((h) => (
              <div key={h.dias} className="contents">
                <dt className="text-champanhe-50/70">{h.dias}</dt>
                <dd>{h.horas}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="text-[15px] leading-loose md:text-right">
          <p className="mb-13 text-xs uppercase tracking-[.2em] text-ouro-claro">Categorias</p>
          <ul className="grid grid-cols-2 md:block">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={paths.categoria(c.slug)} className={LINK}>
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-13 mt-21 text-xs uppercase tracking-[.2em] text-ouro-claro">Links úteis</p>
          <Link to={paths.entrega} className={LINK}>
            Bairros e taxas de entrega
          </Link>
          <br />
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            Instagram @{STORE.instagram}
          </a>
          <br />
          <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className={LINK}>
            Como chegar
          </a>
        </div>
      </div>

      <div className="mx-auto mt-55 max-w-[1680px] border-t border-champanhe-50/20 pt-21 text-[13px]">
        <p className="font-medium">{AVISO_LEGAL}</p>
        <p className="mt-1 text-champanhe-50/70">
          © {new Date().getFullYear()} {STORE.nome}, Maceió/AL. Preços e produtos ilustrativos (mockup). Fotos: Unsplash.
        </p>
      </div>
    </footer>
  );
}
