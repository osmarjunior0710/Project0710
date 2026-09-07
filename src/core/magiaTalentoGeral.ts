// Truque(s)/magia(s) concedidas por Talento Geral — 3 padrões:
// (1) FIXAS, sem escolha nenhuma do jogador (Telecinético → Mãos
// Mágicas; Telepático → Detectar Pensamentos); (2) 1 magia ESCOLHIDA
// pelo jogador dentro de uma escola restrita, mais 1 magia fixa
// (Tocado pela Sombra/Fadas); (3) N magias Rituais ESCOLHIDAS, N =
// Bônus de Proficiência no momento da escolha (Conjurador Ritualista).
// A escolha em si vive em `PersonagemSalvo.escolhaMagiaTalentoGeral`
// (chave = id do talento, valor = lista de nomes escolhidos),
// preenchida numa sub-tela do Level Up. Diferente de "Iniciado em
// Magia" (`magiaTalentoOrigem.ts`), que pede lista de CLASSE — aqui o
// pool é todas as magias da escola/círculo (ou com tag Ritual), de
// qualquer classe — não exige que o personagem já seja conjurador
// (exceto Conjurador Ritualista, que já pede isso como pré-requisito).

import { talentos, type Talento } from '../data/rulesets/dnd2024/talentos';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import type { Classe } from '../data/rulesets/dnd2024/classes';
import { bonusProficiencia } from './calculoPersonagem';

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

/** Magias já escolhidas pra `talentoId` (Tocado pela Sombra/Fadas —
 * lista com 1 item; Conjurador Ritualista — lista com N) — `[]` sem
 * escolha feita ainda (talento pego mas sub-tela não preenchida) ou
 * pra qualquer talento sem esse tipo de escolha. */
function escolhasDoTalento(talentoId: string, escolhas: Record<string, string[]> | undefined): string[] {
  return escolhas?.[talentoId] ?? [];
}

/** Nomes das magias (círculo > 0) sempre preparadas por Talentos
 * Gerais — junta os 3 tipos (fixas, escolhida-por-escola, rituais) —
 * some no cálculo de `magiasConjuraveis` do `FichaShell.tsx`, igual
 * às outras fontes "sempre preparada". */
export function magiasSempreTalentoGeral(
  talentosAtuais: string[] | undefined,
  escolhas?: Record<string, string[]>,
): string[] {
  const nomes = new Set<string>();
  if (!talentosAtuais) return [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'magia-geral-concedida') {
      t.efeitoMecanico.magias.forEach((m) => nomes.add(m.nome));
    } else if (t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola') {
      nomes.add(t.efeitoMecanico.magiaFixa);
      escolhasDoTalento(t.id, escolhas).forEach((n) => nomes.add(n));
    } else if (t?.efeitoMecanico?.tipo === 'magias-rituais-por-proficiencia') {
      escolhasDoTalento(t.id, escolhas).forEach((n) => nomes.add(n));
    }
  }
  return [...nomes];
}

/** `true` quando algum Talento Geral já concedeu (ou pode conceder)
 * truque/magia — usado por `core/conjuracao.ts` (`personagemConjura`)
 * pra não esconder a aba Magias de um personagem sem classe
 * conjuradora que só tem magia por esses talentos. Não depende de
 * `escolhas` — mesmo sem a sub-escolha feita ainda, a magia FIXA
 * (Invisibilidade/Passo Nebuloso) já conta sozinha; Conjurador
 * Ritualista exige conjurador prévio mesmo, então não muda o
 * resultado na prática, mas entra aqui por completude. */
export function temMagiaTalentoGeral(talentosAtuais: string[] | undefined): boolean {
  if (!talentosAtuais) return false;
  return talentosAtuais.some((id) => {
    const t = talentos.find((x) => x.id === id);
    return (
      t?.efeitoMecanico?.tipo === 'magia-geral-concedida' ||
      t?.efeitoMecanico?.tipo === 'magia-escolhida-por-escola' ||
      t?.efeitoMecanico?.tipo === 'magias-rituais-por-proficiencia'
    );
  });
}

/** Talentos Gerais atuais que pedem sub-escolha de magia (por escola
 * OU rituais) e AINDA não foram preenchidos em `escolhas` — usado
 * pelo `LevelUpShell` pra decidir se o passo extra de escolha
 * aparece. */
export function talentosComEscolhaDeMagiaPendente(
  talentosAtuais: string[] | undefined,
  escolhas: Record<string, string[]> | undefined,
): Talento[] {
  if (!talentosAtuais) return [];
  return talentosAtuais
    .map((id) => talentos.find((x) => x.id === id))
    .filter((t): t is Talento => {
      const tipo = t?.efeitoMecanico?.tipo;
      if (tipo !== 'magia-escolhida-por-escola' && tipo !== 'magias-rituais-por-proficiencia') return false;
      return escolhasDoTalento(t!.id, escolhas).length === 0;
    });
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

/** Pool de magias de 1º círculo com tag Ritual — identificadas pelo
 * texto livre de `tempoConjuracao` conter "Ritual" (planilha não tem
 * coluna própria "Ritual", ver `dnd-master-referencia.xlsx` aba
 * Magias — o dado já existe embutido em "Tempo de Conjuração", ex.:
 * "1 minuto ou Ritual"). Usado por Conjurador Ritualista — `[]` se o
 * talento não for desse tipo. */
export function opcoesMagiasRituais(talentoId: string): Magia[] {
  const t = talentos.find((x) => x.id === talentoId);
  if (t?.efeitoMecanico?.tipo !== 'magias-rituais-por-proficiencia') return [];
  return magias.filter((m) => m.circulo === 1 && m.tempoConjuracao?.includes('Ritual'));
}

/** Quantas magias Rituais o Conjurador Ritualista pode escolher —
 * igual ao Bônus de Proficiência ATUAL. Cresce automaticamente com o
 * nível (o `LevelUpShell` compara este valor com quantas já foram
 * escolhidas e, se crescer, oferece o passo extra pra completar até
 * aqui — ver "crescimento" em `LevelUpShell.tsx`). */
export function quantidadeMagiasRituais(classe: Classe, nivel: number): number {
  return bonusProficiencia(classe, nivel);
}

/** `true` só quando o personagem tem Conjurador Ritualista — controla
 * se a seção "Ritual Rápido" aparece na aba Magias. */
export function temRitualRapido(talentosAtuais: string[] | undefined): boolean {
  return !!talentosAtuais?.includes('conjurador-ritualista');
}

/** Chave própria pra marcar o uso do Ritual Rápido gasto — vive na
 * MESMA lista `magiasGratisGastas` das outras magias grátis (ver
 * `chaveMagiaGratisTalento` no `FichaShell.tsx`), mas é 1 chave FIXA
 * compartilhada entre TODAS as magias Rituais conhecidas (não 1 por
 * magia) — usar o Ritual Rápido em qualquer uma delas gasta o mesmo
 * único uso, diferente do padrão "grátis por magia" de
 * `magiasGratisDosTalentosGerais`. */
export const CHAVE_RITUAL_RAPIDO = 'talento:conjurador-ritualista:ritual-rapido';

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
 * separados, não um pool só). Conjurador Ritualista NÃO entra aqui —
 * a regra dele ("Ritual Rápido") é 1 uso COMPARTILHADO entre todas as
 * magias Rituais conhecidas, formato diferente do "grátis por magia"
 * daqui — ver `temRitualRapido`/`CHAVE_RITUAL_RAPIDO` acima, usados
 * direto pelo `FichaShell`/`MagiasTab` (não precisam entrar nesta
 * lista). */
export function magiasGratisDosTalentosGerais(
  talentosAtuais: string[] | undefined,
  escolhas?: Record<string, string[]>,
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
      for (const nome of escolhasDoTalento(t.id, escolhas)) {
        const magia = magias.find((m) => m.nome === nome);
        if (magia) resultado.push({ talentoId: t.id, talentoNome: t.nome, magia, recarga: 'descansoLongo' });
      }
    }
  }
  return resultado;
}
