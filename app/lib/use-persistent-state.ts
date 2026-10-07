import { useEffect, useState } from "react";

/**
 * Estado espelhado no localStorage. A leitura acontece só depois da hidratação,
 * porque as páginas são pré-renderizadas no build e o HTML precisa bater com o
 * primeiro render no navegador.
 */
export function usePersistentState<T>(key: string, initial: T, parse: (raw: string) => T | undefined) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue((atual) => readStorage(key, parse) ?? atual);
    setHydrated(true);
  }, [key, parse]);

  useEffect(() => {
    if (hydrated) writeStorage(key, value);
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

function readStorage<T>(key: string, parse: (raw: string) => T | undefined): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return undefined;
    const parsed = parse(raw);
    if (parsed === undefined) console.warn(`localStorage "${key}": formato inválido, usando o valor padrão`);
    return parsed;
  } catch (error) {
    console.warn(`localStorage "${key}": leitura falhou`, error);
    return undefined;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`localStorage "${key}": gravação falhou`, error);
  }
}
