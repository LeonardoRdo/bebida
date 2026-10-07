import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EASE_APPLE } from "@/components/Reveal";
import type { Product } from "@/lib/products";

import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  readonly produtos: readonly Product[];
  readonly hrefOf?: (p: Product) => string;
  /** Grade logo abaixo do título da página: a primeira fileira carrega sem lazy (LCP). */
  readonly acimaDaDobra?: boolean;
};

const PRIMEIRA_FILEIRA = 4;

const GRID =
  "grid grid-cols-[repeat(auto-fill,minmax(clamp(150px,17vw,300px),1fr))] gap-x-[clamp(13px,2vw,34px)] gap-y-[clamp(21px,2.618vw,34px)]";

export function ProductGrid({ produtos, hrefOf, acimaDaDobra = false }: ProductGridProps) {
  const prioritario = (i: number) => acimaDaDobra && i < PRIMEIRA_FILEIRA;
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={GRID}>
        {produtos.map((p, i) => (
          <ProductCard key={p.slug} produto={p} href={hrefOf?.(p)} priority={prioritario(i)} />
        ))}
      </div>
    );
  }

  return (
    <motion.div layout className={GRID}>
      <AnimatePresence mode="popLayout">
        {produtos.map((p, i) => (
          <motion.div
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 1, ease: EASE_APPLE, delay: (i % 4) * 0.089 }}
          >
            <ProductCard produto={p} href={hrefOf?.(p)} priority={prioritario(i)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
