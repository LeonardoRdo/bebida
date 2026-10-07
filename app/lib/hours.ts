/** 0 = domingo … 6 = sábado. `fecha` acima de 24 indica madrugada do dia seguinte. */
type Turno = { readonly abre: number; readonly fecha: number };

export const HORARIOS: Readonly<Record<number, Turno>> = {
  0: { abre: 9, fecha: 14 },
  1: { abre: 9, fecha: 19 },
  2: { abre: 9, fecha: 19 },
  3: { abre: 9, fecha: 19 },
  4: { abre: 9, fecha: 25 },
  5: { abre: 9, fecha: 25 },
  6: { abre: 9, fecha: 25 },
};

export const HORARIOS_RESUMO = [
  { dias: "Seg a Qua", horas: "09h às 19h" },
  { dias: "Qui a Sáb", horas: "09h à 01h" },
  { dias: "Domingo", horas: "09h às 14h" },
] as const;

export type StatusLoja =
  | { readonly aberta: true; readonly fechaAs: string }
  | { readonly aberta: false; readonly abreAs: string };

const formatHora = (h: number) => `${String(h % 24).padStart(2, "0")}h`;

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Horário de Maceió (UTC−3, sem horário de verão), independente do fuso de quem visita. */
function horaEmMaceio(agora: Date): { dia: number; hora: number } {
  const local = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  return { dia: local.getUTCDay(), hora: local.getUTCHours() + local.getUTCMinutes() / 60 };
}

function turnoDaMadrugada(dia: number, hora: number): Turno | undefined {
  const ontem = HORARIOS[(dia + 6) % 7];
  if (!ontem || ontem.fecha <= 24 || hora >= ontem.fecha - 24) return undefined;
  return ontem;
}

export function statusLoja(agora: Date): StatusLoja {
  const { dia, hora } = horaEmMaceio(agora);
  const madrugada = turnoDaMadrugada(dia, hora);
  if (madrugada) return { aberta: true, fechaAs: formatHora(madrugada.fecha) };

  const hoje = HORARIOS[dia];
  if (hoje && hora >= hoje.abre && hora < hoje.fecha) return { aberta: true, fechaAs: formatHora(hoje.fecha) };
  if (hoje && hora < hoje.abre) return { aberta: false, abreAs: `às ${formatHora(hoje.abre)}` };

  const amanha = HORARIOS[(dia + 1) % 7];
  return { aberta: false, abreAs: amanha ? `amanhã às ${formatHora(amanha.abre)}` : "em breve" };
}

export const openingHoursSchema = Object.entries(HORARIOS).map(([dia, turno]) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: DIAS_SCHEMA[Number(dia)],
  opens: `${String(turno.abre).padStart(2, "0")}:00`,
  closes: `${String(turno.fecha % 24).padStart(2, "0")}:00`,
}));
