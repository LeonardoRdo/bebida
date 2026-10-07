import { createContext, useContext, useState, type ReactNode } from "react";

import {
  addLine,
  countOf,
  parseCart,
  removeLine,
  setLineQtd,
  subtotalOf,
  type CartLine,
  type NewCartLine,
} from "@/lib/cart";
import { entregaFromSlug, type Entrega } from "@/lib/delivery";
import { usePersistentState } from "@/lib/use-persistent-state";

type CartContextValue = {
  readonly lines: readonly CartLine[];
  readonly count: number;
  readonly subtotal: number;
  readonly entrega: Entrega | undefined;
  readonly entregaSlug: string;
  readonly setEntregaSlug: (slug: string) => void;
  readonly add: (linha: NewCartLine, qtd: number) => void;
  readonly remove: (key: string) => void;
  readonly setQty: (key: string, qtd: number) => void;
  readonly drawerOpen: boolean;
  readonly openDrawer: () => void;
  readonly closeDrawer: () => void;
  /** Último item adicionado — alimenta o diálogo de confirmação. */
  readonly lastAdded: NewCartLine | undefined;
  readonly dismissAdded: () => void;
  /** Drawer aberto logo depois de adicionar: o botão de finalizar pulsa. */
  readonly highlightCheckout: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const parseEntregaSlug = (raw: string): string | undefined => {
  const value: unknown = JSON.parse(raw);
  return typeof value === "string" ? value : undefined;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = usePersistentState<CartLine[]>("nobre:carrinho:v2", [], parseCart);
  const [entregaSlug, setEntregaSlug] = usePersistentState("nobre:entrega", "", parseEntregaSlug);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<NewCartLine>();
  const [highlightCheckout, setHighlightCheckout] = useState(false);

  const value: CartContextValue = {
    lines,
    count: countOf(lines),
    subtotal: subtotalOf(lines),
    entrega: entregaFromSlug(entregaSlug),
    entregaSlug,
    setEntregaSlug,
    add: (linha, qtd) => {
      setLines((atual) => addLine(atual, linha, qtd));
      setLastAdded(linha);
    },
    remove: (key) => setLines((atual) => removeLine(atual, key)),
    setQty: (key, qtd) => setLines((atual) => setLineQtd(atual, key, qtd)),
    drawerOpen,
    openDrawer: () => {
      setHighlightCheckout(lastAdded !== undefined);
      setLastAdded(undefined);
      setDrawerOpen(true);
    },
    closeDrawer: () => {
      setDrawerOpen(false);
      setHighlightCheckout(false);
    },
    lastAdded,
    dismissAdded: () => setLastAdded(undefined),
    highlightCheckout,
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
