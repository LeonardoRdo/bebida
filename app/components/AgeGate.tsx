import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { usePersistentState } from "@/lib/use-persistent-state";

import { EASE_APPLE } from "./Reveal";

const RESPOSTAS = ["pendente", "maior", "menor"] as const;
type Resposta = (typeof RESPOSTAS)[number];

function parseResposta(raw: string): Resposta | undefined {
  const value: unknown = JSON.parse(raw);
  return RESPOSTAS.find((r) => r === value);
}

/**
 * Lei 13.106/2015: venda de bebida alcoólica a menores é proibida.
 * Só aparece depois da hidratação, então o HTML pré-renderizado continua indexável.
 */
export function AgeGate() {
  const [resposta, setResposta, hydrated] = usePersistentState<Resposta>("nobre:maioridade", "pendente", parseResposta);
  const reduce = useReducedMotion();
  const visivel = hydrated && resposta !== "maior";

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-21 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE_APPLE }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="idade-titulo"
            aria-describedby="idade-texto"
            className="w-full max-w-md rounded-[21px] bg-champanhe-50 p-[clamp(21px,4vw,55px)] text-center shadow-2xl"
          >
            <img src="/img/logo-nobre.png" alt="Nobre Bebidas" width={89} height={89} className="mx-auto size-[89px] rounded-full" />
            {resposta === "menor" ? <Bloqueio onVoltar={() => setResposta("pendente")} /> : <Pergunta onResposta={setResposta} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Pergunta({ onResposta }: { onResposta: (r: Resposta) => void }) {
  return (
    <>
      <h2 id="idade-titulo" className="mt-21 font-serif text-fluid-h3 font-medium">
        Você tem <em className="text-ouro">18 anos</em> ou mais?
      </h2>
      <p id="idade-texto" className="mt-13 text-preto-suave">
        Para entrar na loja, confirme sua idade. A venda de bebida alcoólica é proibida para menores de 18 anos.
      </p>
      <div className="mt-21 grid grid-cols-2 gap-13">
        <button type="button" autoFocus onClick={() => onResposta("maior")} className="btn !px-13">
          Sim, tenho 18+
        </button>
        <button type="button" onClick={() => onResposta("menor")} className="btn-line !px-13">
          Não tenho
        </button>
      </div>
    </>
  );
}

function Bloqueio({ onVoltar }: { onVoltar: () => void }) {
  return (
    <>
      <h2 id="idade-titulo" className="mt-21 font-serif text-fluid-h3 font-medium">
        Volte quando <em className="text-ouro">fizer 18.</em>
      </h2>
      <p id="idade-texto" className="mt-13 text-preto-suave">
        A Nobre Bebidas não vende bebida alcoólica para menores de idade, e o site fica fechado para você por enquanto.
      </p>
      <button type="button" onClick={onVoltar} className="mt-21 min-h-11 text-sm text-preto-suave underline underline-offset-4">
        Respondi errado
      </button>
    </>
  );
}
