import type { Magia } from '../data/rulesets/dnd2024/magias';

// Classificador heurístico (regex sobre descricaoCurta/componentes, não
// tag manual por magia — 390 entradas, não escala revisar 1 a 1). Objetivo
// é ajudar o jogador a achar magia de ataque/cura/custo mais rápido, não
// uma regra de mecânica — classificação errada ocasional é aceitável
// (corrigido sob demanda se aparecer, ver DECISOES-DESIGN.md).
const REGEX_ATAQUE = /\bataques?\b[^."]{0,30}:/i;
const REGEX_CURA = /\bcura(m)?\b/i;
const REGEX_RECUPERA_PV = /recuper\w*\s+(todo|metade|\d)/i;
const REGEX_CUSTO_COMPONENTE = /\d+[^.)]{0,20}\b(po|pp|pc)\b/i;
// "Salv." é a abreviação usada em ~155 das 390 descrições curtas
// sempre que a magia pede salvaguarda do alvo (confirmado por
// amostragem) — heurística igual às outras, erro ocasional aceitável.
const REGEX_SALVAGUARDA = /\bSalv\./;

export interface ClassificacaoMagia {
  ataque: boolean;
  cura: boolean;
  custoComponente: boolean;
  /** Pede salvaguarda do alvo — não é uma categoria mostrada como
   * ícone, só ajuda a achar magia de interesse ao ler a lista. */
  salvaguarda: boolean;
}

export function classificarMagia(magia: Magia): ClassificacaoMagia {
  const desc = magia.descricaoCurta ?? '';
  const descSemNegativaCura = desc.replace(/não recuper\w*/gi, '');
  return {
    ataque: REGEX_ATAQUE.test(desc),
    cura: REGEX_CURA.test(desc) || REGEX_RECUPERA_PV.test(descSemNegativaCura),
    custoComponente: REGEX_CUSTO_COMPONENTE.test(magia.componentes ?? ''),
    salvaguarda: REGEX_SALVAGUARDA.test(desc),
  };
}

/** Historicamente truque (círculo 0) de salvaguarda sem ataque (ex.:
 * Badalar Fúnebre) não tinha NENHUMA jogada que o Combat sabia
 * automatizar, então "Usar" ficava travado. Desde o Modal de
 * Salvaguarda (ver DECISOES-COMBATE.md) toda magia com
 * `ataqueOuSalvaguarda` preenchido tem um modal — Ataque ou
 * Salvaguarda; as sem mecânica (`null`, cura/utilidade) já
 * "funcionam" sem jogada nenhuma ("Usar" sem efeito é o comportamento
 * certo pra elas). Não sobra nenhum truque sem ação válida — função
 * mantida (não removida dos 6 call-sites em MagiasTab.tsx) caso
 * apareça um caso futuro sem cobertura. */
export function usarMagiaTemAcaoAutomatizada(_magia: Magia): boolean {
  return true;
}

export const ICONE_ATAQUE = '⚔️';
export const ICONE_CURA = '❤️‍🩹';
export const ICONE_CUSTO_COMPONENTE = '🪙';

export function iconesMagia(magia: Magia): string {
  const c = classificarMagia(magia);
  let icones = '';
  if (c.ataque) icones += ICONE_ATAQUE;
  if (c.cura) icones += ICONE_CURA;
  if (c.custoComponente) icones += ICONE_CUSTO_COMPONENTE;
  return icones;
}
