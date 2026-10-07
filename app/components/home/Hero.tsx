import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Img } from "@/components/Img";
import { EASE_APPLE } from "@/components/Reveal";
import { StoreStatus } from "@/components/StoreStatus";
import { kitImg, kits, kitSavings, type Kit } from "@/lib/kits";
import { paths } from "@/lib/paths";
import { brl } from "@/lib/products";

const AUTOPLAY_MS = 6000;

const ARROWS = {
  prev: { label: "Kit anterior", side: "left-[clamp(13px,3vw,55px)]", path: "M15 18l-6-6 6-6", step: -1 },
  next: { label: "Próximo kit", side: "right-[clamp(13px,3vw,55px)]", path: "M9 18l6-6-6-6", step: 1 },
} as const;
type Direction = keyof typeof ARROWS;
const DIRECTIONS = ["prev", "next"] as const satisfies readonly Direction[];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // O primeiro slide aparece sem animação: é o LCP da página
  const [trocou, setTrocou] = useState(false);
  const reduce = useReducedMotion();
  const autoplay = !paused && !reduce;
  const kit = kits[index];

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => {
      setTrocou(true);
      setIndex((i) => (i + 1) % kits.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, autoplay]);

  if (!kit) return null;
  const go = (direction: Direction) => {
    setTrocou(true);
    setIndex((i) => (i + ARROWS[direction].step + kits.length) % kits.length);
  };

  return (
    <section
      id="kits"
      aria-roledescription="carrossel"
      aria-label="Kits em destaque"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-preto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={kit.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE_APPLE }}
        >
          <KitPhoto kit={kit} priority={index === 0} />
        </motion.div>
      </AnimatePresence>

      <div className="px-page relative flex h-full flex-col items-center justify-center pt-[72px] text-center text-white">
        <h1 className="text-[clamp(.95rem,1.4vw,1.2rem)] tracking-[.3em]">cerveja gelada em Maceió</h1>
        <div aria-live={autoplay ? "off" : "polite"}>
          <SlideText key={kit.slug} kit={kit} animar={trocou && reduce !== true} />
        </div>
        <StoreStatus className="mt-34 rounded-full bg-black/35 px-13 py-1.5 text-white/90 backdrop-blur" />
      </div>

      {DIRECTIONS.map((d) => (
        <ArrowButton key={d} direction={d} onClick={() => go(d)} />
      ))}
      <p className="absolute bottom-[26px] left-1/2 -translate-x-1/2 text-sm tabular-nums text-white/80">
        {index + 1} / {kits.length}
      </p>
    </section>
  );
}

function KitPhoto({ kit, priority }: { kit: Kit; priority: boolean }) {
  return (
    <>
      <Img
        src={kitImg(kit.slug)}
        alt={`${kit.nome}: ${kit.desc} Delivery da Nobre Bebidas em Maceió`}
        className="absolute inset-0 h-full w-full object-cover"
        priority={priority}
      />
      <div className="absolute inset-0 bg-black/45" />
    </>
  );
}

function SlideText({ kit, animar }: { kit: Kit; animar: boolean }) {
  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={kit.nome}
      initial={animar ? { opacity: 0, y: 34 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.2, ease: EASE_APPLE }}
    >
      <p className="mt-21 text-[clamp(.95rem,1.3vw,1.2rem)] text-ouro-claro">{kit.chamada}</p>
      <p className="mt-2 font-serif text-fluid-h1 font-medium uppercase tracking-[.04em]">{kit.nome}</p>
      <p className="mx-auto mt-21 max-w-[34em] text-[clamp(1rem,1.3vw,1.382rem)]">{kit.desc}</p>
      <div className="mt-34 flex flex-col items-center gap-13">
        <Link
          to={paths.kit(kit.slug)}
          className="inline-flex min-h-11 min-w-[clamp(220px,18vw,320px)] items-center justify-center rounded-full bg-white px-34 py-13 font-medium text-preto transition-colors hover:bg-champanhe-100"
        >
          garantir kit por {brl(kit.preco)}
        </Link>
        <span className="text-sm text-white/85">economize {brl(kitSavings(kit))} levando junto</span>
      </div>
    </motion.div>
  );
}

function ArrowButton({ direction, onClick }: { direction: Direction; onClick: () => void }) {
  const { label, side, path } = ARROWS[direction];
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute bottom-[89px] ${side} grid md:bottom-auto md:top-1/2 md:-translate-y-1/2 size-[clamp(44px,4vw,55px)] place-items-center rounded-full bg-preto text-white shadow-lg transition-colors hover:bg-ouro hover:text-preto`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-1/2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </button>
  );
}
