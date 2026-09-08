// Talentos Gerais que concedem escolha de perícia — 2 padrões:
// (1) lista RESTRITA (Analítico/Mente Aguçada) — 1 perícia entre umas
// poucas fixas, vira proficiência OU Especialização dependendo se o
// personagem já era proficiente nela; também libera 1 ação genérica
// (Cap. 1) como Ação Bônus, sem tirar da lista de Ação normal; (2)
// LIVRE + Especialização (Especialista em Perícia) — 1 perícia
// qualquer (proficiência, via `concedeProficiencias` do próprio
// talento) MAIS 1 Especialização independente numa perícia já
// proficiente (mesma vaga do "Especialista" de classe do Bardo).

import { talentos } from '../data/rulesets/dnd2024/talentos';

/** Pool de perícias elegíveis pra `talentoId` do tipo
 * `pericia-restrita-ou-especializacao` (Analítico/Mente Aguçada) —
 * `[]` se o talento não for desse tipo. */
export function opcoesPericiaRestrita(talentoId: string): string[] {
  const t = talentos.find((x) => x.id === talentoId);
  if (t?.efeitoMecanico?.tipo !== 'pericia-restrita-ou-especializacao') return [];
  return t.efeitoMecanico.pericias;
}

/** Nome da ação genérica (Cap. 1) que `talentoId` também libera como
 * Ação Bônus — `null` se o talento não for desse tipo. */
export function acaoVirouBonusDoTalento(talentoId: string): string | null {
  const t = talentos.find((x) => x.id === talentoId);
  if (t?.efeitoMecanico?.tipo !== 'pericia-restrita-ou-especializacao') return null;
  return t.efeitoMecanico.acaoVirouBonus;
}

/** Nomes de ações genéricas (Cap. 1) liberadas como Ação Bônus por
 * qualquer Talento Geral atual — varre TODOS os talentos (não só o
 * primeiro achado), mesmo motivo de `proficienciaArmadura.ts`: mais de
 * 1 talento poderia liberar ações diferentes ao mesmo personagem. */
export function acoesConvertidasEmBonus(talentosAtuais: string[] | undefined): string[] {
  const nomes = new Set<string>();
  if (!talentosAtuais) return [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'pericia-restrita-ou-especializacao') {
      nomes.add(t.efeitoMecanico.acaoVirouBonus);
    }
  }
  return [...nomes];
}
