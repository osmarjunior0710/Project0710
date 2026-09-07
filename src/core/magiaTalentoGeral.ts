// Truque(s)/magia(s) FIXAS concedidas por Talento Geral, sem escolha
// nenhuma do jogador (Telecinético → Mãos Mágicas; Telepático →
// Detectar Pensamentos) — diferente de "Iniciado em Magia"
// (`magiaTalentoOrigem.ts`), que pede lista de classe + atributo à
// escolha. Como não há escolha, tudo é derivado direto de
// `talentosEfetivos`, sem gaveta no `WizardSelection`.

import { talentos } from '../data/rulesets/dnd2024/talentos';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';

/** Nomes dos truques concedidos por Talentos Gerais com
 * `efeitoMecanico: 'magia-geral-concedida'` — varre TODOS os talentos
 * (não só o primeiro achado), mesmo motivo de `proficienciaArmadura.ts`:
 * mais de um poderia conceder truques diferentes ao mesmo personagem. */
export function truquesTalentoGeral(talentosAtuais: string[] | undefined): string[] {
  const nomes = new Set<string>();
  if (!talentosAtuais) return [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'magia-geral-concedida') {
      t.efeitoMecanico.truques.forEach((n) => nomes.add(n));
    }
  }
  return [...nomes];
}

/** Nomes das magias (círculo > 0) sempre preparadas por Talentos
 * Gerais com `magia-geral-concedida` — some no cálculo de
 * `magiasConjuraveis` do `FichaShell.tsx`, igual às outras fontes
 * "sempre preparada" (espécie, Iniciado em Magia, etc). */
export function magiasSempreTalentoGeral(talentosAtuais: string[] | undefined): string[] {
  const nomes = new Set<string>();
  if (!talentosAtuais) return [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'magia-geral-concedida') {
      t.efeitoMecanico.magias.forEach((m) => nomes.add(m.nome));
    }
  }
  return [...nomes];
}

/** `true` quando algum Talento Geral já concedeu truque/magia
 * (Telecinético/Telepático) — usado por `core/conjuracao.ts`
 * (`personagemConjura`) pra não esconder a aba Magias de um personagem
 * sem classe conjuradora que só tem magia por esses talentos. */
export function temMagiaTalentoGeral(talentosAtuais: string[] | undefined): boolean {
  return truquesTalentoGeral(talentosAtuais).length > 0 || magiasSempreTalentoGeral(talentosAtuais).length > 0;
}

export interface MagiaGratisDeTalentoGeral {
  talentoId: string;
  talentoNome: string;
  magia: Magia;
  /** Mesmo significado de `MagiaGratisDeInvocacao.recarga`
   * (`invocacoesMagiaGratis.ts`) — 'descansoLongo' é o único caso
   * hoje (Telepático), mas o campo existe pra qualquer talento futuro
   * que conceda magia ilimitada sem custo. */
  recarga: 'ilimitado' | 'descansoLongo';
}

/** Deriva as magias com "conjura grátis 1x/Descanso Longo" concedidas
 * por Talentos Gerais — mesmo padrão de `magiasGratisDasInvocacoes`,
 * mas pra `talentosEfetivos` em vez de Invocações Místicas. Truques
 * nunca entram aqui (são sempre ilimitados por regra, sem necessidade
 * de rastrear uso — ver `truquesTalentoGeral`). */
export function magiasGratisDosTalentosGerais(talentosAtuais: string[] | undefined): MagiaGratisDeTalentoGeral[] {
  const resultado: MagiaGratisDeTalentoGeral[] = [];
  if (!talentosAtuais) return resultado;
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo !== 'magia-geral-concedida') continue;
    for (const entrada of t.efeitoMecanico.magias) {
      const magia = magias.find((m) => m.nome === entrada.nome);
      if (!magia) continue;
      resultado.push({ talentoId: t.id, talentoNome: t.nome, magia, recarga: entrada.recarga });
    }
  }
  return resultado;
}
