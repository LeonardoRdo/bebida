import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";

import { Img } from "@/components/Img";
import { AVISO_LEGAL } from "@/components/layout/Footer";
import { EASE_APPLE } from "@/components/Reveal";
import { MAX_QTD, MIN_QTD, whatsappMessage, whatsappUrl, type CartLine } from "@/lib/cart";
import { A_COMBINAR_SLUG, BAIRROS, RETIRADA_SLUG, taxaDe } from "@/lib/delivery";
import { paths } from "@/lib/paths";
import { brl } from "@/lib/products";

import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines } = useCart();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrinho-titulo"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-champanhe-50 shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.8, ease: EASE_APPLE }}
          >
            <div className="flex items-center justify-between border-b border-preto/10 px-21 py-13">
              <h2 id="carrinho-titulo" className="font-serif text-[1.618rem] font-medium">
                Seu pedido
              </h2>
              <button ref={closeRef} type="button" onClick={closeDrawer} aria-label="Fechar carrinho" className="grid size-11 place-items-center rounded-full hover:bg-champanhe-200">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {lines.length === 0 ? <EmptyCart onNavigate={closeDrawer} /> : <FilledCart />}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function EmptyCart({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid flex-1 place-content-center gap-13 p-34 text-center">
      <p className="font-serif text-[1.618rem] font-medium">O carrinho está vazio.</p>
      <p className="text-preto-suave">Escolha uma bebida ou um kit e ele aparece aqui.</p>
      <Link to={`${paths.home}#catalogo`} onClick={onNavigate} className="btn mx-auto mt-2">
        Ver bebidas
      </Link>
    </div>
  );
}

function FilledCart() {
  const { lines, subtotal, entrega, highlightCheckout } = useCart();
  const reduce = useReducedMotion();
  const taxa = entrega && taxaDe(entrega);
  const pulse = highlightCheckout && !reduce;

  return (
    <>
      <ul className="flex-1 divide-y divide-preto/10 overflow-y-auto px-21">
        {lines.map((l) => (
          <CartLineItem key={l.key} line={l} />
        ))}
      </ul>

      <div className="space-y-13 border-t border-preto/10 bg-champanhe-100 px-21 py-21">
        <DeliverySelect />
        <dl className="space-y-1 text-sm">
          <Row label="Subtotal" value={brl(subtotal)} />
          <Row label="Entrega" value={entrega === undefined ? "escolha o bairro" : rotuloTaxa(taxa)} />
          <div className="flex items-baseline justify-between pt-2 text-base">
            <dt className="font-medium">Total</dt>
            <dd className="font-serif text-[1.618rem] font-semibold">
              {brl(subtotal + (taxa ?? 0))}
              {taxa === undefined && entrega ? " + entrega" : ""}
            </dd>
          </div>
        </dl>
        {entrega ? (
          <motion.a
            href={whatsappUrl(whatsappMessage(lines, entrega))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full !min-h-[52px]"
            animate={pulse ? { scale: [1, 1.04, 1], boxShadow: ["0 0 0 0 rgba(184,137,47,.6)", "0 0 0 14px rgba(184,137,47,0)", "0 0 0 0 rgba(184,137,47,0)"] } : undefined}
            transition={{ duration: 1.4, repeat: 2, ease: EASE_APPLE }}
          >
            Finalizar pelo WhatsApp
          </motion.a>
        ) : (
          <p className="rounded-full border border-preto/20 py-13 text-center text-sm text-preto-suave">Escolha o bairro para finalizar</p>
        )}
        <p className="text-center text-xs text-preto-suave">{AVISO_LEGAL}</p>
      </div>
    </>
  );
}

function rotuloTaxa(taxa: number | undefined): string {
  if (taxa === undefined) return "a combinar";
  return taxa === 0 ? "grátis" : brl(taxa);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-preto-suave">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function DeliverySelect() {
  const { entregaSlug, setEntregaSlug } = useCart();

  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs uppercase tracking-[.2em] text-ouro-texto">Entregar em</span>
      <select
        value={entregaSlug}
        onChange={(e) => setEntregaSlug(e.target.value)}
        className="min-h-11 w-full rounded-[13px] border border-preto/20 bg-champanhe-50 px-13"
      >
        <option value="" disabled>
          Selecione o bairro
        </option>
        <option value={RETIRADA_SLUG}>Retirar na loja (Jacintinho) — grátis</option>
        <optgroup label="Bairros de Maceió">
          {BAIRROS.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.nome} — {brl(b.taxa)}
            </option>
          ))}
        </optgroup>
        <option value={A_COMBINAR_SLUG}>Outro bairro (taxa a combinar)</option>
      </select>
    </label>
  );
}

function CartLineItem({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();

  return (
    <li className="flex gap-13 py-13">
      <div className="relative h-[89px] w-[64px] shrink-0 overflow-hidden rounded-[13px] bg-champanhe-200">
        <Img src={line.thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-tight">{line.nome}</p>
        <p className="text-xs text-preto-suave">{line.detalhe}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-preto/25" role="group" aria-label={`Quantidade de ${line.nome}`}>
            <QtyButton label="Diminuir" disabled={line.qtd <= MIN_QTD} onClick={() => setQty(line.key, line.qtd - 1)}>
              −
            </QtyButton>
            <span className="w-6 text-center text-sm" aria-live="polite">
              {line.qtd}
            </span>
            <QtyButton label="Aumentar" disabled={line.qtd >= MAX_QTD} onClick={() => setQty(line.key, line.qtd + 1)}>
              +
            </QtyButton>
          </div>
          <p className="text-sm font-medium text-ouro-texto">{brl(line.preco * line.qtd)}</p>
        </div>
        <button type="button" onClick={() => remove(line.key)} className="mt-1 min-h-9 text-xs text-preto-suave underline underline-offset-2 hover:text-preto">
          Remover
        </button>
      </div>
    </li>
  );
}

type QtyButtonProps = { label: string; disabled: boolean; onClick: () => void; children: string };

function QtyButton({ label, disabled, onClick, children }: QtyButtonProps) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="grid size-11 place-items-center text-lg disabled:opacity-35">
      {children}
    </button>
  );
}
