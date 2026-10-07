import { Outlet } from "react-router";

import { AgeGate } from "@/components/AgeGate";
import { AddedDialog } from "@/components/cart/AddedDialog";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

export default function SiteLayout() {
  return (
    <CartProvider>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[70] focus:rounded focus:bg-preto focus:p-3 focus:text-champanhe-50">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AddedDialog />
      <WhatsAppFab />
      <AgeGate />
    </CartProvider>
  );
}
