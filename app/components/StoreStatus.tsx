import { useEffect, useState } from "react";

import { statusLoja, type StatusLoja } from "@/lib/hours";

const UM_MINUTO = 60_000;

/** Depende do relógio de quem visita, então só aparece depois da hidratação. */
export function StoreStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<StatusLoja>();

  useEffect(() => {
    const atualizar = () => setStatus(statusLoja(new Date()));
    atualizar();
    const id = window.setInterval(atualizar, UM_MINUTO);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return <span className={`inline-block h-[1.6em] ${className}`} aria-hidden="true" />;

  return (
    <span className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status.aberta ? "bg-[#3fbf6f] shadow-[0_0_10px_#3fbf6f]" : "bg-current opacity-50"}`}
      />
      {status.aberta ? `Aberto agora, até ${status.fechaAs}` : `Fechado, abre ${status.abreAs}`}
    </span>
  );
}
