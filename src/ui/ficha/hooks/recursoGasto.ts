import type { Dispatch, SetStateAction } from 'react';

/**
 * Embrulha um par `useState` de contador "gasto" já existente (ex.:
 * `conhecimentoDePedrasGasto`/`setConhecimentoDePedrasGasto`) num
 * objeto `{restantes, disponivel, usar}` — elimina a duplicação das
 * várias funções `usarX` que só faziam "se não sobrou uso, recusa;
 * senão soma 1" (G3.2 do foco de saúde do projeto, ver `EmDevB.md`).
 *
 * NÃO muda `useState`, `descansoCurto`/`descansoLongo` nem o autosave
 * — cada um continua lendo/zerando o campo original por nome, exatamente
 * como antes. Não é um hook de verdade (não chama nenhum hook do React
 * internamente) — só uma função pura por cima de um estado que já
 * existe, por isso não precisa seguir as Regras de Hooks (pode ser
 * chamada condicionalmente, dentro de outra função, etc.), mas o nome
 * do arquivo/local (`ui/ficha/hooks/`) segue a convenção de "coisa que
 * embrulha estado de React da Ficha", não de `core/` (que é motor de
 * cálculo sem depender de `useState`).
 */
export function recursoContado(maximo: number, gasto: number, setGasto: Dispatch<SetStateAction<number>>) {
  const restantes = Math.max(0, maximo - gasto);
  function usar(): boolean {
    if (restantes <= 0) return false;
    setGasto((v) => v + 1);
    return true;
  }
  return { restantes, disponivel: restantes > 0, usar };
}

/** Mesma ideia de `recursoContado`, pra recurso de 1 uso só (`boolean`
 * "gasto", sem contador) — ex.: `vooDraconicoGasto`/`setVooDraconicoGasto`. */
export function recursoFlagUnica(gasto: boolean, setGasto: Dispatch<SetStateAction<boolean>>) {
  function usar(): boolean {
    if (gasto) return false;
    setGasto(true);
    return true;
  }
  return { disponivel: !gasto, usar };
}
