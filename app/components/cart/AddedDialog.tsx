import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { Img } from "@/components/Img";
import { EASE_APPLE } from "@/components/Reveal";
import { brl } from "@/lib/products";

import { useCart } from "./CartProvider";

export function AddedDialog() {
  const { lastAdded, dismissAdded, openDrawer } = useCart();
  const reduce = useReducedMotion();
  const verCarrinhoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lastAdded) return;
    verCarrinhoRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismissAdded();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lastAdded, dismissAdded]);

  return (
    <AnimatePresence>
      {lastAdded && (
        <div className="fixed inset-0 z-50 grid place-items-end p-13 sm:place-items-center">
          <motion.div
            className="absolute inset-0 bg-black/45"
            onClick={dismissAdded}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="adicionado-titulo"
            className="relative w-full max-w-md rounded-[21px] bg-champanhe-50 p-21 shadow-2xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 21 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE_APPLE }}
          >
            <p id="adicionado-titulo" className="font-serif text-[1.618rem] font-medium">
              Adicionado ao <em className="text-ouro">carrinho.</em>
            </p>
            <div className="mt-13 flex items-center gap-13">
              <div className="relative h-[89px] w-[64px] shrink-0 overflow-hidden rounded-[13px] bg-champanhe-200">
                <Img src={lastAdded.thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-medium">{lastAdded.nome}</p>
                <p className="text-sm text-preto-suave">{lastAdded.detalhe}</p>
                <p className="text-sm text-ouro-texto">{brl(lastAdded.preco)}</p>
              </div>
            </div>
            <div className="mt-21 grid grid-cols-2 gap-2">
              <button type="button" onClick={dismissAdded} className="btn-line !px-13 text-sm">
                Continuar comprando
              </button>
              <button ref={verCarrinhoRef} type="button" onClick={openDrawer} className="btn !px-13 text-sm">
                Ver carrinho
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
