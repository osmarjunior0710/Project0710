// Resolve o efeito da opção de sub-escolha `identidade_permanente`
// escolhida (ex.: cor de dragão do Draconato, ancestralidade do
// Golias) — nunca duplicado como valor fixo em algum traço, sempre
// lido daqui em tempo de exibição.

import type { Especie, TracoEspecie, OpcaoSubescolha } from '../data/rulesets/dnd2024/especies';
import type { WizardSelection } from './personagem';

export function tipoDanoSubescolha(especie: Especie, selection: WizardSelection): string | null {
  const opcao = especie.opcoesSubescolha?.find((o) => o.nome === selection.subescolhaEspecieEscolhida);
  return opcao?.tipoDano ?? null;
}

/** Opções de sub-escolha escolhidas 1x no wizard e nunca mais mudadas
 * — cobre as 2 naturezas com essa mesma experiência de criação
 * (`identidade_permanente` e `linhagem_com_progressao_magica`; a
 * 3ª natureza, `escolha_reutilizavel`, não aparece aqui — é escolhida
 * de novo a cada uso, em Combat). `null` quando a espécie não tem
 * sub-escolha estruturada desse tipo (ainda ou nunca). */
export function opcoesSubescolhaNoWizard(especie: Especie): OpcaoSubescolha[] | null {
  const natureza = especie.subescolha?.natureza;
  if (natureza !== 'identidade_permanente' && natureza !== 'linhagem_com_progressao_magica') return null;
  return especie.opcoesSubescolha ?? null;
}

/** Opções de sub-escolha `escolha_reutilizavel` (ex.: as 3 formas da
 * Revelação Celestial do Aasimar) — escolhidas de novo a cada uso, em
 * Combat, nunca no wizard. `null` quando a espécie não tem sub-escolha
 * dessa natureza. */
export function opcoesEscolhaReutilizavel(especie: Especie): OpcaoSubescolha[] | null {
  if (especie.subescolha?.natureza !== 'escolha_reutilizavel') return null;
  return especie.opcoesSubescolha ?? null;
}

/** Traço que concede proficiência numa perícia à escolha — Hábil
 * (Humano, sem restrição) ou um traço com `opcoesPericia` (ex.:
 * Sentidos Aguçados do Elfo, restrito a 3 opções). `undefined` se a
 * espécie não tiver nenhum dos dois. */
export function tracoComEscolhaDePericia(especie: Especie): TracoEspecie | undefined {
  return especie.traços.find((t) => t.id === 'habil' || t.opcoesPericia);
}

/** Texto de exibição de um traço, com a opção de sub-escolha escolhida
 * resolvida quando aplicável — o texto original do traço nunca é
 * alterado, só complementado. Cobre os 2 formatos de traço
 * `identidade_permanente` (ver `TracoEspecie`):
 * - `usaTipoDanoDaSubescolha`: traço à parte cujo efeito só faz
 *   sentido com o tipo de dano resolvido (Ataque de Sopro/Resistência
 *   a Dano do Draconato).
 * - `usaDescricaoEfeitoDaSubescolha`: o próprio traço já lista todas
 *   as opções (Ancestralidade Gigante do Golias) — mostra qual foi
 *   escolhida, sem repetir a lista inteira. */
export function descricaoTracoResolvida(traco: TracoEspecie, especie: Especie, selection: WizardSelection): string {
  const opcao = especie.opcoesSubescolha?.find((o) => o.nome === selection.subescolhaEspecieEscolhida);
  if (traco.usaTipoDanoDaSubescolha && opcao?.tipoDano) {
    return `${traco.descricao} (Tipo de dano: ${opcao.tipoDano})`;
  }
  if (traco.usaDescricaoEfeitoDaSubescolha && opcao?.descricaoEfeito) {
    return `${traco.descricao} — Benefício escolhido: ${opcao.nome}. ${opcao.descricaoEfeito}`;
  }
  return traco.descricao;
}
