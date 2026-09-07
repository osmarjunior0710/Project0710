// Truque(s)/magia(s) concedidas por Talento Geral — 2 padrões:
// (1) FIXAS, sem escolha nenhuma do jogador (Telecinético → Mãos
// Mágicas; Telepático → Detectar Pensamentos); (2) 1 magia ESCOLHIDA
// pelo jogador dentro de uma escola restrita, mais 1 magia fixa
// (Tocado pela Sombra/Fadas) — a escolha em si vive em
// `PersonagemSalvo.escolhaMagiaTalentoGeral` (chave = id do talento),
// preenchida numa sub-tela do Level Up. Diferente de "Iniciado em
// Magia" (`magiaTalentoOrigem.ts`), que pede lista de CLASSE — aqui o
// pool é todas as magias da escola/círculo, de qualquer classe (não
// exige que o personagem já seja conjurador).

import { talentos, type Talento } from '../data/rulesets/dnd2024/talentos';
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

/** Magia de 1º círculo restrita por escola, já escolhida pra
 * `talentoId` (Tocado pela Sombra/Fadas) — `null` sem escolha feita
 * ainda (talento pego mas sub-tela não preenchida) ou pra qualquer
 * outro talento. */
function magiaEscolhidaPorEscola(talentoId: string, escolhas: Record<string, string> | undefined): string | null {
  return escolhas?.[talentoId] ?? null;
}

/** Nomes das magias (círculo > 0) sempre preparadas por Talentos
 * Gerais — junta `magia-geral-concedida` (fixas) e
 * `magia-escolhida-por-escola` (fixa + escolhida, quando já
 * escolhida) — some no cálculo de `magiasConjuraveis` do
 * `FichaShell.tsx`, igual às outras fontes "sempre preparada". */
export function magiasSempreTalentoGeral(
  talentosAtuais: string[] | undefined,
  escolhas?: Record<string, string>,
): string[] {
  const nomes = new Set<string>();
  if (!talentosAtuais) return [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'magia-geral-concedida') {
      t.efeitoMecanico.magias.forEach((m) => nomes.add(m.nome));
    } else if (t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola') {
      nomes.add(t.efeitoMecanico.magiaFixa);
      const escolhida = magiaEscolhidaPorEscola(t.id, escolhas);
      if (escolhida) nomes.add(escolhida);
    }
  }
  return [...nomes];
}

/** `true` quando algum Talento Geral já concedeu (ou pode conceder)
 * truque/magia — usado por `core/conjuracao.ts` (`personagemConjura`)
 * pra não esconder a aba Magias de um personagem sem classe
 * conjuradora que só tem magia por esses talentos. Não depende de
 * `escolhas` — mesmo sem a sub-escolha feita ainda, a magia FIXA
 * (Invisibilidade/Passo Nebuloso) já conta sozinha. */
export function temMagiaTalentoGeral(talentosAtuais: string[] | undefined): boolean {
  if (!talentosAtuais) return false;
  return talentosAtuais.some((id) => {
    const t = talentos.find((x) => x.id === id);
    return t?.efeitoMecanico?.tipo === 'magia-geral-concedida' || t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola';
  });
}

/** Talentos Gerais atuais que pedem a sub-escolha de magia por escola
 * e AINDA não foram preenchidos em `escolhas` — usado pelo
 * `LevelUpShell` pra decidir se o passo extra de escolha aparece. */
export function talentosComEscolhaDeMagiaPendente(
  talentosAtuais: string[] | undefined,
  escolhas: Record<string, string> | undefined,
): Talento[] {
  if (!talentosAtuais) return [];
  return talentosAtuais
    .map((id) => talentos.find((x) => x.id === id))
    .filter((t): t is Talento => t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola' && !magiaEscolhidaPorEscola(t.id, escolhas));
}

/** Pool de magias de 1º círculo elegíveis pra `talentoId`
 * (`magia-escolhida-por-escola`) — todas as magias do círculo/escola
 * certos, de qualquer classe (não filtra por lista de classe, regra
 * real não restringe isso aqui). `[]` se o talento não for desse
 * tipo. */
export function opcoesMagiaEscolhidaPorEscola(talentoId: string): Magia[] {
  const t = talentos.find((x) => x.id === talentoId);
  if (t?.efeitoMecanico?.tipo !== 'magia-escolhida-por-escola') return [];
  const escolas = t.efeitoMecanico.escolas;
  return magias.filter((m) => m.circulo === 1 && escolas.includes(m.escola));
}

export interface MagiaGratisDeTalentoGeral {
  talentoId: string;
  talentoNome: string;
  magia: Magia;
  /** Mesmo significado de `MagiaGratisDeInvocacao.recarga`
   * (`invocacoesMagiaGratis.ts`) — 'ilimitado' nunca acontece aqui
   * hoje (truques não entram nesta lista, ver `truquesTalentoGeral`),
   * mas o campo existe pra qualquer talento futuro que conceda magia
   * ilimitada sem custo. */
  recarga: 'ilimitado' | 'descansoLongo';
}

/** Deriva as magias com "conjura grátis 1x/Descanso Longo" concedidas
 * por Talentos Gerais — mesmo padrão de `magiasGratisDasInvocacoes`,
 * mas pra `talentosEfetivos`. Cobre `magia-geral-concedida` (Telepático)
 * e `magia-escolhida-por-escola` (Tocado pela Sombra/Fadas — a fixa
 * SEMPRE entra; a escolhida só depois de escolhida, com tracking
 * independente da fixa — regra real trata as 2 magias como usos
 * separados, não um pool só). */
export function magiasGratisDosTalentosGerais(
  talentosAtuais: string[] | undefined,
  escolhas?: Record<string, string>,
): MagiaGratisDeTalentoGeral[] {
  const resultado: MagiaGratisDeTalentoGeral[] = [];
  if (!talentosAtuais) return resultado;
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'magia-geral-concedida') {
      for (const entrada of t.efeitoMecanico.magias) {
        const magia = magias.find((m) => m.nome === entrada.nome);
        if (!magia) continue;
        resultado.push({ talentoId: t.id, talentoNome: t.nome, magia, recarga: entrada.recarga });
      }
    } else if (t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola') {
      const nomeMagiaFixa = t.efeitoMecanico.magiaFixa;
      const magiaFixa = magias.find((m) => m.nome === nomeMagiaFixa);
      if (magiaFixa) resultado.push({ talentoId: t.id, talentoNome: t.nome, magia: magiaFixa, recarga: 'descansoLongo' });
      const nomeEscolhida = magiaEscolhidaPorEscola(t.id, escolhas);
      const magiaEscolhida = nomeEscolhida ? magias.find((m) => m.nome === nomeEscolhida) : undefined;
      if (magiaEscolhida) resultado.push({ talentoId: t.id, talentoNome: t.nome, magia: magiaEscolhida, recarga: 'descansoLongo' });
    }
  }
  return resultado;
}
