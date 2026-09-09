// Leitura genérica de magia real do personagem — zero fixture, zero
// constante de classe hardcoded. Complementa recursosClasse.ts.

import type { Atributo } from '../data/wizardFixtures';
import type { Classe, RecursoClasse } from '../data/rulesets/dnd2024/classes';
import { magias, magiasDaClasse, type Magia } from '../data/rulesets/dnd2024/magias';
import { bonusProficiencia } from './calculoPersonagem';
import { caracteristicaDesbloqueada } from './levelUp';
import { modificador, valorFinalAtributo, type WizardSelection } from './personagem';
import { valorRecursoClasse } from './recursosClasse';

/** Nome completo (como aparece em `Classe.atributoPrimario`) → código
 * de 3 letras. Só cobre os atributos que já apareceram como primário
 * de conjuração de alguma classe com dado real importado — cresce
 * conforme mais classes conjuradoras entrarem. Guerreiro
 * ("Força ou Destreza") não bate com nenhuma entrada de propósito —
 * não conjura, então não precisa de atributo de conjuração. */
const ATRIBUTO_POR_NOME: Record<string, Atributo> = {
  Carisma: 'CAR',
  Inteligência: 'INT',
};

export interface EspacoDeMagiaAtivo {
  circulo: number;
  maximo: number;
  recuperaNoDescansoCurto: boolean;
}

const REGEX_CIRCULO = /^Espaços de Magia — (\d+)º Círculo$/;

/** TODOS os círculos de Espaço de Magia ativos no nível atual (Etapa
 * 4.2) — array vazio se a classe não conjura. Bardo ganha o 2º
 * círculo no nível 3 sem perder o 1º, então a partir daí isso retorna
 * 2 entradas simultâneas; ordenado por círculo crescente.
 *
 * Bruxo (Magia de Pacto) usa um schema diferente em `classes.ts` — 1
 * pool ÚNICO ("Espaço de Magia de Pacto (quantidade)" +
 * "Círculo do Espaço de Magia de Pacto"), não 1 recurso por círculo —
 * mas sempre resolve pra um array de **1 item só**, então todo o resto
 * do app (pips, gasto por círculo, upcast em `circulosDisponiveisParaConjurar`,
 * Descanso) funciona sem mudança nenhuma: upcast "automático" do Bruxo
 * já é só a regra normal de upcast com um único círculo disponível. */
export function espacosDeMagiaAtivos(classe: Classe | null, nivel: number): EspacoDeMagiaAtivo[] {
  if (!classe) return [];
  const porCirculo = classe.recursos
    .map((r): { circulo: number; recurso: RecursoClasse } | null => {
      const m = r.nome.match(REGEX_CIRCULO);
      return m ? { circulo: Number(m[1]), recurso: r } : null;
    })
    .filter((c): c is { circulo: number; recurso: RecursoClasse } => c !== null)
    .filter((c) => (c.recurso.valorPorNivel[nivel] ?? 0) > 0)
    .sort((a, b) => a.circulo - b.circulo)
    .map((c) => ({
      circulo: c.circulo,
      maximo: c.recurso.valorPorNivel[nivel] ?? 0,
      recuperaNoDescansoCurto: (c.recurso.recuperaEm ?? '').toLowerCase().includes('curto'),
    }));
  if (porCirculo.length > 0) return porCirculo;

  const quantidade = classe.recursos.find((r) => r.nome === 'Espaço de Magia de Pacto (quantidade)');
  const circuloAtivo = classe.recursos.find((r) => r.nome === 'Círculo do Espaço de Magia de Pacto');
  const maximo = quantidade?.valorPorNivel[nivel] ?? 0;
  const circulo = circuloAtivo?.valorPorNivel[nivel] ?? 0;
  if (!quantidade || maximo <= 0 || circulo <= 0) return [];
  return [
    {
      circulo,
      maximo,
      recuperaNoDescansoCurto: (quantidade.recuperaEm ?? '').toLowerCase().includes('curto'),
    },
  ];
}

/** Círculos em que dá pra conjurar uma magia de círculo `magiaCirculo`
 * agora — regra real do livro: uma magia nunca cabe num Espaço de
 * Magia de círculo MENOR que o dela, mas cabe no dela ou em qualquer
 * um maior (upcast) contanto que sobre espaço. Array vazio = não dá
 * pra conjurar agora (nenhum espaço ≥ o círculo da magia sobrando).
 * Truque (círculo 0) não usa isso — está sempre disponível. */
export function circulosDisponiveisParaConjurar(
  magiaCirculo: number,
  espacos: EspacoDeMagiaAtivo[],
  espacosGastosPorCirculo: Record<number, number>,
): number[] {
  return espacos
    .filter((e) => e.circulo >= magiaCirculo && (espacosGastosPorCirculo[e.circulo] ?? 0) < e.maximo)
    .map((e) => e.circulo)
    .sort((a, b) => a - b);
}

function buscarMagiasPorNome(nomes: string[]): Magia[] {
  return nomes.map((nome) => magias.find((m) => m.nome === nome)).filter((m): m is Magia => m !== undefined);
}

/** Truques reais do personagem (nomes → objeto Magia completo). Recebe
 * os nomes diretamente (não `WizardSelection`) porque, a partir da
 * Etapa 4.1 (Level Up), a lista pode ter mudado depois da criação —
 * `FichaShell` guarda isso em estado próprio (`truquesAtuais`), não
 * mais direto de `selecao.truquesEscolhidos` (que é só o retrato da
 * criação, congelado). */
export function truquesDoPersonagem(nomes: string[]): Magia[] {
  return buscarMagiasPorNome(nomes);
}

/** Magias preparadas reais do personagem. Recebe os nomes diretamente
 * (mesma razão de `truquesDoPersonagem`) — a partir da Etapa 4.3 a
 * lista pode ter mudado depois da criação (`FichaShell` guarda em
 * `magiasPreparadasAtuais`, não mais direto de
 * `selecao.magiasPreparadasEscolhidas`). */
export function magiasPreparadasDoPersonagem(nomes: string[]): Magia[] {
  return buscarMagiasPorNome(nomes);
}

/** Quantos nomes da lista ORIGINAL não estão mais na lista FINAL —
 * "trocas" feitas. Usado pra validar a regra "pode substituir 1 por
 * level-up" (Truques hoje, Magias Preparadas na Etapa 4.3): o total
 * final já é travado no máximo do nível pela própria tela de seleção,
 * então só falta impedir mais de 1 removido. */
export function contarTrocas(originais: string[], finais: string[]): number {
  return originais.filter((nome) => !finais.includes(nome)).length;
}

/** "Memorizar Magia" (Mago, nível 5+) — troca EXATAMENTE 1 magia
 * preparada por outra do Livro de Magias, ao completar um Descanso
 * Curto. Diferente da redefinição livre do Descanso Longo (qualquer
 * quantidade) e do crescimento do Level Up (0 trocas, só soma) — aqui
 * é sempre exatamente 1, nem mais nem menos, e o total nunca muda. */
export function memorizarMagiaValida(atuais: string[], escolhidas: string[]): boolean {
  return escolhidas.length === atuais.length && contarTrocas(atuais, escolhidas) === 1;
}

/** `true` quando a classe tem o recurso "Livro de Magias" (grimório) —
 * Padrão C "redefinição livre por Descanso Longo" (ver
 * DECISOES-CLASSES.md "Casters"): truques e magias preparadas só
 * trocam ao completar um Descanso, NUNCA no Level Up — o Level Up é
 * só crescimento (nunca remove o que já tinha). `false` = padrão
 * restritivo/flexível de Bardo/Bruxo, onde o Level Up já permite
 * trocar 1. Hoje só o Mago tem essa característica. */
export function usaRedefinicaoPorDescanso(classe: Classe | null): boolean {
  if (!classe) return false;
  return classe.recursos.some((r) => r.nome.startsWith('Livro de Magias'));
}

/** Cresce uma lista de magias conhecidas SEM NUNCA remover o que já
 * tinha — completa até `max` sorteando (`catalogo` já deve vir
 * embaralhado, ver `embaralhar`) magias do catálogo que ainda não
 * estão em `atuais`. Se `atuais` já tiver `max` ou mais, devolve só os
 * primeiros `max` de `atuais` (nunca corta pelo catálogo). Usado pelo
 * Livro de Magias do Mago e, pra qualquer classe com
 * `usaRedefinicaoPorDescanso`, também por Truques/Magias Preparadas —
 * mesmo padrão de "coleção que só cresce" já usado no Especialista. */
export function completarListaDeMagias(atuais: string[], catalogoEmbaralhado: Magia[], max: number): string[] {
  if (atuais.length >= max) return atuais.slice(0, max);
  const faltam = max - atuais.length;
  const novas = catalogoEmbaralhado.filter((m) => !atuais.includes(m.nome)).slice(0, faltam).map((m) => m.nome);
  return [...atuais, ...novas];
}

/** Quantos Truques/Magias Preparadas estão faltando pro nível atual —
 * "deveria ter" (tabela real da classe) menos "tem de verdade". Nunca
 * negativo. Detecta personagem "atrasado" (ex: Level Up que passou
 * sem escolher Truques/Magias, por bug ou por ter subido de nível
 * antes dessa tela existir) — ver PENDENCIAS.md "Detector genérico de
 * ficha atrasada" pro contexto maior (isso aqui é só o caso de
 * Truques/Magias, não um mecanismo genérico ainda). */
export function deficitTruques(classe: Classe | null, nivel: number, truquesAtuais: string[]): number {
  if (!classe) return 0;
  return Math.max(0, valorRecursoClasse(classe, 'Truques Conhecidos', nivel) - truquesAtuais.length);
}

export function deficitMagiasPreparadas(classe: Classe | null, nivel: number, magiasPreparadasAtuais: string[]): number {
  if (!classe) return 0;
  return Math.max(0, valorRecursoClasse(classe, 'Magias Preparadas', nivel) - magiasPreparadasAtuais.length);
}

/** "Segredos Mágicos" (Bardo, nível 10, classe base): sempre que o nº
 * de Magias Preparadas sobe, a magia nova pode vir de Bardo, Clérigo,
 * Druida OU Mago. Lista de classes hand-maintained — vem do texto da
 * própria característica (`caracteristicasClasse.ts`, nível 10), não
 * é regra genérica pra qualquer classe (só Bardo tem isso hoje). Se
 * outra classe ganhar uma característica parecida no futuro, dá pra
 * generalizar essa lista por classe; não vale a pena antes disso. */
const CLASSES_SEGREDOS_MAGICOS = ['Clérigo', 'Druida', 'Mago'];

/** Pool de magias (círculo > 0, nunca truque) elegíveis pra Magias
 * Preparadas no nível dado — só a lista da própria classe, exceto se
 * "Segredos Mágicos" já estiver desbloqueada nesse nível, caso em que
 * o pool cresce com as listas de `CLASSES_SEGREDOS_MAGICOS` também
 * (sem duplicar magia que apareça em mais de uma lista). */
export function magiasDisponiveisParaPreparar(classe: Classe, nivel: number): Magia[] {
  const propria = magiasDaClasse(classe.nome).filter((m) => m.circulo > 0);
  if (caracteristicaDesbloqueada(classe, 'Segredos Mágicos', nivel) === null) return propria;
  const vistos = new Set(propria.map((m) => m.id));
  const extras: Magia[] = [];
  for (const nomeClasseExtra of CLASSES_SEGREDOS_MAGICOS) {
    for (const m of magiasDaClasse(nomeClasseExtra).filter((m) => m.circulo > 0)) {
      if (vistos.has(m.id)) continue;
      vistos.add(m.id);
      extras.push(m);
    }
  }
  return [...propria, ...extras];
}

/** "Descobertas Mágicas" (Bardo, Colégio do Conhecimento, nível 6):
 * pool de onde vêm as 2 magias sempre-preparadas da característica —
 * mesmas 3 classes de `CLASSES_SEGREDOS_MAGICOS` (Clérigo/Druida/Mago),
 * reaproveitado de propósito (o livro usa a mesma lista de 3 nas duas
 * características, mera coincidência de regra, não é o mesmo array
 * conceitual). Truque (círculo 0) sempre entra; magia de círculo só
 * entra até `circuloMaximo` (mesma regra "precisa ter espaço pra ela"
 * do texto da característica). Sem duplicar magia repetida em mais de
 * 1 lista. */
export function poolDescobertasMagicas(circuloMaximo: number): Magia[] {
  const vistos = new Set<string>();
  const resultado: Magia[] = [];
  for (const nomeClasse of CLASSES_SEGREDOS_MAGICOS) {
    for (const m of magiasDaClasse(nomeClasse).filter((m) => m.circulo === 0 || m.circulo <= circuloMaximo)) {
      if (vistos.has(m.id)) continue;
      vistos.add(m.id);
      resultado.push(m);
    }
  }
  return resultado;
}

export interface GrupoDeMagias {
  circulo: number;
  label: string;
  magias: Magia[];
}

/** Agrupa uma lista de magias por círculo — Truques (círculo 0) vira
 * um grupo próprio "Truques", os demais viram "Xº Círculo". Grupos do
 * círculo mais alto disponível pro mais baixo (o jogador normalmente
 * está de olho no que acabou de destravar), magias em ordem
 * alfabética dentro de cada grupo. Usado nas telas de escolha (Level
 * Up e "completar") pra não misturar círculos diferentes numa lista
 * só. */
export function agruparMagiasPorCirculo(magias: Magia[]): GrupoDeMagias[] {
  const porCirculo = new Map<number, Magia[]>();
  for (const m of magias) {
    const lista = porCirculo.get(m.circulo) ?? [];
    lista.push(m);
    porCirculo.set(m.circulo, lista);
  }
  return [...porCirculo.entries()]
    .sort(([a], [b]) => b - a)
    .map(([circulo, lista]) => ({
      circulo,
      label: circulo === 0 ? 'Truques' : `${circulo}º Círculo`,
      magias: [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    }));
}

/** Todas as magias marcadas com Tempo de Conjuração "Reação" começam
 * com esse texto na planilha (confirmado nas 4 ocorrências reais) —
 * heurística simples, mesmo padrão de `classificarMagia`. */
export function ehMagiaDeReacao(magia: Magia): boolean {
  return (magia.tempoConjuracao ?? '').startsWith('Reação');
}

/** Bônus de acerto de conjuração (mod. do atributo + bônus de
 * proficiência) — null se a classe não tiver atributo de conjuração
 * mapeado (ver `ATRIBUTO_POR_NOME`). */
export function modAcertoConjuracao(selecao: WizardSelection, classe: Classe | null, nivel: number): number | null {
  if (!classe) return null;
  const atributo = ATRIBUTO_POR_NOME[classe.atributoPrimario];
  if (!atributo) return null;
  const valor = valorFinalAtributo(selecao, atributo);
  if (valor === null) return null;
  return modificador(valor) + bonusProficiencia(classe, nivel);
}

/** CD pra evitar a magia/característica de conjuração (salvaguarda do
 * alvo) — regra fixa: 8 + bônus de acerto de conjuração
 * (`modAcertoConjuracao`, já soma mod. de atributo + Bônus de
 * Proficiência). */
export function cdConjuracao(modAcerto: number): number {
  return 8 + modAcerto;
}
