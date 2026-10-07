import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

type RevealProps = { readonly children: ReactNode; readonly delay?: number; readonly className?: string };

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 55, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.2, ease: EASE_APPLE, delay }}
    >
      {children}
    </motion.div>
  );
}
