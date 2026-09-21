// Bolsa de Moedas (Livro do Jogador 2024, Cap. 6 — ver `DND-Regras.md`,
// "Moedas"): 5 denominações; 1 PO = 100 PC; uma moeda pesa ~10 g (100
// moedas = 1 kg). Tudo em inteiros — a unidade de conta interna é a PC
// (peça de cobre), então nunca há erro de ponto flutuante.

export type TipoMoeda = 'pc' | 'pp' | 'pe' | 'po' | 'pl';
export type Moedas = Record<TipoMoeda, number>;

export const TIPOS_MOEDA: TipoMoeda[] = ['pc', 'pp', 'pe', 'po', 'pl'];

/** Valor de cada moeda em PC (Valores das Moedas: PP 1/10 PO, PE 1/2 PO, PL 10 PO). */
export const VALOR_EM_PC: Record<TipoMoeda, number> = { pc: 1, pp: 10, pe: 50, po: 100, pl: 1000 };

export const MOEDAS_VAZIAS: Moedas = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };

/** Aceita qualquer coisa vinda do armazenamento: campo ausente, negativo,
 * fracionado ou de tipo errado vira 0/inteiro, sem quebrar. */
export function normalizarMoedas(bruto: unknown): Moedas {
  const obj = bruto && typeof bruto === 'object' ? (bruto as Record<string, unknown>) : {};
  const resultado = { ...MOEDAS_VAZIAS };
  for (const t of TIPOS_MOEDA) {
    const v = obj[t];
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) resultado[t] = Math.floor(v);
  }
  return resultado;
}

export function totalEmPC(moedas: Moedas): number {
  return TIPOS_MOEDA.reduce((acc, t) => acc + moedas[t] * VALOR_EM_PC[t], 0);
}

export function totalEmPO(moedas: Moedas): number {
  return totalEmPC(moedas) / 100;
}

export function quantidadeDeMoedas(moedas: Moedas): number {
  return TIPOS_MOEDA.reduce((acc, t) => acc + moedas[t], 0);
}

/** Peso das moedas em kg: 100 moedas = 1 kg. */
export function pesoDasMoedasKg(moedas: Moedas): number {
  return quantidadeDeMoedas(moedas) / 100;
}

export function adicionarMoedas(moedas: Moedas, tipo: TipoMoeda, quantidade: number): Moedas {
  if (!Number.isInteger(quantidade) || quantidade <= 0) return moedas;
  return { ...moedas, [tipo]: moedas[tipo] + quantidade };
}

/** Converte um valor em PO (pode ser fracionado, ex.: sobra da Loja do
 * wizard) em moedas: a parte inteira em PO, o resto em PP e PC. */
export function moedasDeOuro(po: number): Moedas {
  const totalPc = Math.max(0, Math.round(po * 100));
  const resto = totalPc % 100;
  return { ...MOEDAS_VAZIAS, po: Math.floor(totalPc / 100), pp: Math.floor(resto / 10), pc: resto % 10 };
}

export type ResultadoGasto =
  | { ok: true; moedas: Moedas; pagas: Moedas; troco: Moedas }
  | { ok: false; motivo: 'invalido' | 'insuficiente'; totalPO: number };

/** Troco em PO, PP e PC (nunca PE/PL) — exato, já que a PC é a unidade. */
function trocoEmMoedas(valorPC: number): Moedas {
  const po = Math.floor(valorPC / 100);
  const resto = valorPC % 100;
  return { ...MOEDAS_VAZIAS, po, pp: Math.floor(resto / 10), pc: resto % 10 };
}

/** Gasta `quantidade` moedas de `tipo` (ex.: 5 PO) com conversão
 * automática quando falta aquele tipo:
 * 1. usa primeiro as moedas do mesmo tipo;
 * 2. o que faltar, paga com as menores, da maior pra menor;
 * 3. ainda faltando, usa moedas maiores — pagando a mais e devolvendo
 *    troco em PO/PP/PC.
 * Se o total em mãos não cobrir, não gasta nada. */
export function gastarMoedas(moedas: Moedas, tipo: TipoMoeda, quantidade: number): ResultadoGasto {
  const totalPO = totalEmPO(moedas);
  if (!Number.isInteger(quantidade) || quantidade <= 0) return { ok: false, motivo: 'invalido', totalPO };
  const necessario = quantidade * VALOR_EM_PC[tipo];
  if (totalEmPC(moedas) < necessario) return { ok: false, motivo: 'insuficiente', totalPO };

  const restante = { ...moedas };
  const pagas = { ...MOEDAS_VAZIAS };
  let falta = necessario;
  const pagar = (t: TipoMoeda, k: number) => {
    restante[t] -= k;
    pagas[t] += k;
    falta -= k * VALOR_EM_PC[t];
  };

  // 1. mesmo tipo
  pagar(tipo, Math.min(restante[tipo], quantidade));

  // 2. menores, da maior pra menor
  const menores = TIPOS_MOEDA.filter((t) => VALOR_EM_PC[t] < VALOR_EM_PC[tipo]).sort(
    (a, b) => VALOR_EM_PC[b] - VALOR_EM_PC[a],
  );
  for (const t of menores) {
    const k = Math.min(restante[t], Math.floor(falta / VALOR_EM_PC[t]));
    if (k > 0) pagar(t, k);
  }

  // 3. maiores/sobras: 1 moeda por vez — a menor que já cobre o resto
  // (paga a mais e volta troco); senão a maior que ainda cabe.
  while (falta > 0) {
    const disponiveis = TIPOS_MOEDA.filter((t) => restante[t] > 0);
    const cobre = disponiveis.filter((t) => VALOR_EM_PC[t] >= falta).sort((a, b) => VALOR_EM_PC[a] - VALOR_EM_PC[b]);
    if (cobre.length > 0) {
      pagar(cobre[0], 1);
    } else {
      const maior = [...disponiveis].sort((a, b) => VALOR_EM_PC[b] - VALOR_EM_PC[a])[0];
      pagar(maior, 1);
    }
  }

  const troco = falta < 0 ? trocoEmMoedas(-falta) : { ...MOEDAS_VAZIAS };
  const final = { ...restante };
  for (const t of TIPOS_MOEDA) final[t] += troco[t];
  return { ok: true, moedas: final, pagas, troco };
}
