import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";

import { useCart } from "@/components/cart/CartProvider";
import { EASE_APPLE } from "@/components/Reveal";
import { StoreStatus } from "@/components/StoreStatus";
import { whatsappUrl } from "@/lib/cart";
import { categoriesOf, GRUPO_ORDEM, GRUPOS } from "@/lib/categories";
import { paths } from "@/lib/paths";
import { STORE } from "@/lib/site";

const LINKS = [
  { href: `${paths.home}#kits`, nome: "Kits" },
  { href: `${paths.home}#catalogo`, nome: "Catálogo" },
  { href: paths.entrega, nome: "Entrega" },
  { href: "#contato", nome: "Onde estamos" },
] as const;

const CONTATO = whatsappUrl(`Olá, ${STORE.nome}! Vim pelo site.`);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-preto/10 bg-champanhe-100/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-[72px] items-center justify-between px-[clamp(21px,5vw,55px)]">
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen((aberto) => !aberto)}
          className="grid size-11 place-items-center rounded-full hover:bg-champanhe-200 lg:hidden"
        >
          <MenuIcon open={menuOpen} />
        </button>

        <Link
          to={paths.home}
          onClick={closeMenu}
          aria-label="Nobre Bebidas – início"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-13 lg:static lg:translate-x-0"
        >
          <img src="/img/logo-nobre.png" alt="" width={46} height={46} className="size-[46px] rounded-full" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[clamp(1.618rem,2.4vw,2.2rem)] font-semibold tracking-wide">Nobre</span>
            <span className="mt-0.5 hidden text-[11px] font-medium tracking-[.34em] text-ouro-texto min-[420px]:block">BEBIDAS</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-[clamp(13px,2.2vw,34px)] text-sm">
          <CategoriesMenu />
          {LINKS.map((l) => (
            <Link key={l.href} to={l.href} className="hidden hover:text-ouro-texto lg:block">
              {l.nome}
            </Link>
          ))}
          <a href={CONTATO} target="_blank" rel="noopener noreferrer" className="btn hidden !min-h-[38px] !px-21 !py-2 lg:inline-flex">
            Pedir no WhatsApp
          </a>
          <CartButton />
        </nav>
      </div>
      <MobileMenu open={menuOpen} onNavigate={closeMenu} />
    </header>
  );
}

/** Abre por hover e por foco de teclado (focus-within). */
function CategoriesMenu() {
  return (
    <div className="group relative hidden lg:block">
      <Link to={`${paths.home}#categorias`} className="flex items-center gap-1 hover:text-ouro-texto">
        Bebidas
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 transition-transform duration-500 ease-apple group-focus-within:rotate-180 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-2 pt-13 opacity-0 transition-all duration-500 ease-apple group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex gap-2 rounded-[21px] border border-preto/10 bg-champanhe-50 p-2 shadow-xl">
          {GRUPO_ORDEM.map((grupo) => (
            <div key={grupo} className="min-w-[200px]">
              <p className="px-13 pb-1 pt-13 text-xs uppercase tracking-[.2em] text-ouro-texto">{GRUPOS[grupo]}</p>
              <ul aria-label={GRUPOS[grupo]}>
                {categoriesOf(grupo).map((c) => (
                  <li key={c.slug}>
                    <Link to={paths.categoria(c.slug)} className="flex min-h-11 items-center rounded-[13px] px-13 transition-colors hover:bg-champanhe-100 hover:text-ouro-texto">
                      {c.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CartButton() {
  const { count, openDrawer } = useCart();
  const label = count === 0 ? "Abrir carrinho, vazio" : `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`;

  return (
    <button type="button" onClick={openDrawer} aria-label={label} className="relative grid size-11 place-items-center rounded-full hover:bg-champanhe-200">
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-preto px-1 text-[11px] font-semibold text-champanhe-50">
          {count}
        </span>
      )}
    </button>
  );
}

function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="menu-mobile"
          aria-label="Menu"
          className="px-page max-h-[calc(100svh-72px)] overflow-y-auto border-t border-preto/10 bg-champanhe-50 pb-34 lg:hidden"
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE_APPLE }}
        >
          <StoreStatus className="pt-21 text-preto-suave" />
          {GRUPO_ORDEM.map((grupo) => (
            <div key={grupo} className="pt-21">
              <p className="text-xs uppercase tracking-[.2em] text-ouro-texto">{GRUPOS[grupo]}</p>
              <ul className="mt-1 grid grid-cols-2">
                {categoriesOf(grupo).map((c) => (
                  <li key={c.slug}>
                    <Link to={paths.categoria(c.slug)} onClick={onNavigate} className="flex min-h-11 items-center">
                      {c.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-21 flex flex-col border-t border-preto/10 pt-13">
            {LINKS.map((l) => (
              <Link key={l.href} to={l.href} onClick={onNavigate} className="flex min-h-11 items-center font-serif text-xl">
                {l.nome}
              </Link>
            ))}
            <a href={CONTATO} target="_blank" rel="noopener noreferrer" className="btn mt-13">
              Pedir no WhatsApp
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}
