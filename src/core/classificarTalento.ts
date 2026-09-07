// Classificador heurístico do texto de "Benefícios" de cada Talento em
// Ação/Ação Bônus/Reação/Passiva — Fase 2 do plano de Talentos (ver
// DECISOES-DESIGN.md e PENDENCIAS.md). Mesmo espírito de
// `classificarMagia.ts`: regex sobre o texto puro, não tag manual por
// talento (75 entradas) — classificação errada ocasional é aceitável,
// corrigida sob demanda quando aparecer.
//
// Um talento pode ter mais de um efeito na mesma célula de "Benefícios"
// (ex: Conjurador Bélico = Passiva + Reação + Passiva) — por isso o
// texto é quebrado em frases antes de classificar cada uma, nunca
// tratado como 1 categoria só pro talento inteiro.

import type { Talento } from '../data/rulesets/dnd2024/talentos';

export type TipoEfeitoTalento = 'Ação' | 'Ação Bônus' | 'Reação' | 'Passiva';

export interface EfeitoTalento {
  texto: string;
  tipo: TipoEfeitoTalento;
}

const REGEX_REACAO = /\bReação\b/;
const REGEX_ACAO_BONUS = /\bAção Bônus\b/;
const REGEX_ACAO = /\bAção\b/;

function classificarFrase(frase: string): TipoEfeitoTalento {
  if (REGEX_REACAO.test(frase)) return 'Reação';
  if (REGEX_ACAO_BONUS.test(frase)) return 'Ação Bônus';
  if (REGEX_ACAO.test(frase)) return 'Ação';
  return 'Passiva';
}

/** Quebra o texto bruto de "Benefícios" em frases e classifica cada
 * uma separadamente. Não quebra depois de "Salv."/"mod." (abreviações
 * de Salvaguarda/modificador usadas na planilha) — únicas abreviações
 * com ponto encontradas no texto de Talentos que colidiam com fim de
 * frase. */
export function classificarBeneficios(beneficios: string): EfeitoTalento[] {
  return beneficios
    .split(/(?<=[.!?])(?<!\b[Ss]alv\.)(?<!\bmod\.)\s+(?=[A-ZÀ-Ú])/)
    .map((frase) => frase.trim())
    .filter((frase) => frase.length > 0)
    .map((texto) => ({ texto, tipo: classificarFrase(texto) }));
}

/** Talentos cujo benefício INTEIRO já é coberto por um mecanismo
 * próprio de wizard/level-up (`concedeProficiencias`/
 * `concedeMagiaIniciada`) em vez do campo genérico `efeitoMecanico` —
 * não contam como `[PH]` mesmo sem esse campo. Músico NÃO entra aqui:
 * `concedeFerramentaGrupo` só cobre a proficiência com instrumentos,
 * a Canção Encorajadora ainda falta (ver Backlog.md) — então Músico
 * continua `[PH]` até o benefício inteiro estar coberto. */
const IDS_COBERTOS_POR_MECANISMO_PROPRIO = new Set(['habilidoso', 'iniciado-em-magia']);

/** `true` quando a Ficha ainda deve mostrar `[PH] sem efeito mecânico
 * ainda` pro talento — a Fase 4 ainda não chegou nele (ou só cobriu
 * parte do benefício). `efeitoMecanico` ausente = `[PH]`, exceto os
 * talentos em `IDS_COBERTOS_POR_MECANISMO_PROPRIO` (cobertos por outro
 * caminho, mas por inteiro). */
export function talentoTemPlaceholder(t: Talento): boolean {
  if (IDS_COBERTOS_POR_MECANISMO_PROPRIO.has(t.id)) return false;
  return t.efeitoMecanico === undefined;
}
