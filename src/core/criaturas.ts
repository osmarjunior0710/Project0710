import type { Criatura } from '../data/rulesets/dnd2024/criaturas';
import type { Atributo } from '../data/wizardFixtures';

/** CA de uma `Criatura` — o campo já vem como número puro na planilha
 * (ex: "14"), só converte pra `number` pra quem precisar rastrear de
 * verdade (motor de Pets). */
export function caCriatura(criatura: Criatura): number {
  return Number(criatura.ca);
}

/** PV máximo de uma `Criatura` — o campo vem como `"total (fórmula)"`
 * (ex: "13 (2d8 + 4)"), extrai só o total já calculado (não precisa
 * rolar a fórmula de novo, ela é só a explicação de onde veio). */
export function pvMaxCriatura(criatura: Criatura): number {
  const match = criatura.pv.match(/^(\d+)/);
  return match ? Number(match[1]) : 0;
}

/** Valor bruto (0-30) de um atributo de `Criatura` — o campo vem como
 * `"valor (mod[, salv +N])"` (ex: "16 (+3)"), extrai só o valor —
 * usado como ponto de partida ao ajustar um pet (ver
 * `AjustarPetShell.tsx`, EmDevB.md Fase P/P5). */
export function valorAtributoCriatura(criatura: Criatura, atributo: Atributo): number {
  const match = criatura.atributos[atributo].match(/^(\d+)/);
  return match ? Number(match[1]) : 10;
}
