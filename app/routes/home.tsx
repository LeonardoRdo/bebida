import { Catalog } from "@/components/home/Catalog";
import { FindDrink } from "@/components/home/FindDrink";
import { Hero } from "@/components/home/Hero";
import { LocalInfo } from "@/components/home/LocalInfo";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FAQS } from "@/lib/faq";
import { kitImg, kits } from "@/lib/kits";
import { faqSchema, pageMeta } from "@/lib/seo";

export function links() {
  return [{ rel: "preload", as: "image", href: kitImg(kits[0]?.slug ?? ""), fetchPriority: "high" }];
}

export function meta() {
  return [
    ...pageMeta({
      title: "Nobre Bebidas | Cerveja e bebida gelada em Maceió com delivery",
      description:
        "Adega no Jacintinho com delivery de bebida gelada em Maceió: cerveja, destilados, vinhos, gelo e carvão. Peça pelo site e finalize no WhatsApp.",
      path: "/",
    }),
    { "script:ld+json": faqSchema(FAQS) },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <FindDrink />
      <ShopByCategory />
      <Catalog />
      <LocalInfo />
    </>
  );
}
