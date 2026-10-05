// "🧪 Char Multiclasse" — pedido do Osmar (2026-10): em vez de 3
// classes nível 1 (Bárbaro/Bardo/Bruxo, versão anterior), agora é
// nível 20 em TODA classe já implementada no app ao mesmo tempo
// (impossível pela regra — o Osmar sabe, é de propósito: ver tudo
// junto numa ficha só, pra enxergar como a organização da tela se
// comporta no caso mais carregado possível). Atributos também
// impossíveis de propósito: 24/22/20/18/16/14 (ordem FOR/DES/CON/INT/
// SAB/CAR), bem acima do teto normal de 20.
//
// `CLASSES_DO_CHAR_MULTICLASSE` é a única lista que precisa crescer
// conforme uma classe nova for implementada — escolha a subclasse NÃO
// homebrew dela (ver `caracteristicasSubclasse.ts`; `null` se a classe
// ainda não tem nenhuma subclasse implementada) e adicione uma linha.
// Todo o resto (truques, magias, invocações, maestria em arma, PV) é
// recalculado automaticamente a partir disso.
//
// Seleção de magia: nunca sorteada (`selecionarMagiasDiversificadas`
// abaixo) — pra cada círculo, prioriza 1 de cura, 1 de ataque, 1 de
// salvaguarda, 1 com Upcast, só depois enche com o resto em ordem
// alfabética. Objetivo é cobrir o máximo de SITUAÇÕES de teste
// diferentes (ataque, salvaguarda, cura, sem-rolagem, escalonamento),
// não representar uma escolha "de jogo" coerente.

import { classes, type Classe } from '../data/rulesets/dnd2024/classes';
import { magiasDaClasse, type Magia } from '../data/rulesets/dnd2024/magias';
import { invocacoesMisticas } from '../data/rulesets/dnd2024/invocacoesMisticas';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import type { MagiaConhecida } from './magiasPersonagem';
import { valorRecursoClasse } from './recursosClasse';
import { armasParaMaestria, quantidadeMaestriaEmArma } from './maestriaArma';
import { armazenamentoPersonagens, type PersonagemSalvo } from './armazenamentoPersonagens';
import type { PersonagemClasse } from './multiclasse';
import { gerarPersonagemTeste } from './geradorPersonagemTeste';
import { dadoVidaValor } from '../data/levelUpFixtures';
import { modificador } from './personagem';

export const ID_PERSONAGEM_TESTE_MULTICLASSE = 'teste-fixo-multiclasse';

const NIVEL_TESTE = 20;
const ORIGEM_TESTE = 'Sábio';
const ESPECIE_TESTE = 'Humano';

/** Atributos impossíveis de propósito (pedido do Osmar, 2026-10) —
 * acima do teto normal de 20, só pra ver os números na tela. */
const ATRIBUTOS_TESTE = { FOR: 24, DES: 22, CON: 20, INT: 18, SAB: 16, CAR: 14 };

/** Só classes já implementadas (`classes.ts`) entram aqui. Subclasse:
 * sempre uma NÃO homebrew (ver `caracteristicasSubclasse.ts`), `null`
 * se a classe ainda não tem nenhuma implementada. */
const CLASSES_DO_CHAR_MULTICLASSE: { classe: string; subclasse: string | null }[] = [
  { classe: 'Bárbaro', subclasse: 'Trilha da Árvore do Mundo' },
  { classe: 'Bardo', subclasse: 'Colégio do Conhecimento' },
  { classe: 'Bruxo', subclasse: 'Patrono Ínfero' },
  { classe: 'Guerreiro', subclasse: null },
  { classe: 'Mago', subclasse: 'Evocador' },
  { classe: 'Paladino', subclasse: 'Juramento da Devoção' },
];

function prioridadeDeSituacao(m: Magia): number {
  if (m.curaBaseDado) return 0;
  if (m.ataqueOuSalvaguarda?.startsWith('Ataque')) return 1;
  if (m.ataqueOuSalvaguarda?.startsWith('Salvaguarda')) return 2;
  if (m.upcastTipo) return 3;
  return 4;
}

/** Escolhe `quantidade` magias de 1 único círculo, priorizando cobrir
 * cura/ataque/salvaguarda/upcast antes de completar com o resto —
 * nunca sorteada, sempre o mesmo resultado pra mesma classe/círculo. */
function selecionarMagiasDiversificadas(classeNome: string, circulo: number, quantidade: number): Magia[] {
  const candidatas = [...magiasDaClasse(classeNome, circulo)].sort(
    (a, b) => prioridadeDeSituacao(a) - prioridadeDeSituacao(b) || a.nome.localeCompare(b.nome, 'pt-BR'),
  );
  return candidatas.slice(0, quantidade);
}

/** Mesma ideia acima, mas distribuindo entre VÁRIOS círculos ao mesmo
 * tempo (Livro de Magias do Mago, Magias Preparadas de quem não tem
 * livro) — roda em rodízio pelos círculos pra garantir que todo
 * círculo disponível tenha pelo menos 1 magia antes de encher o resto. */
function selecionarMagiasDiversificadasEmCirculos(classeNome: string, circulos: number[], quantidade: number): Magia[] {
  if (circulos.length === 0) return [];
  const pools = circulos.map((c) =>
    [...magiasDaClasse(classeNome, c)].sort(
      (a, b) => prioridadeDeSituacao(a) - prioridadeDeSituacao(b) || a.nome.localeCompare(b.nome, 'pt-BR'),
    ),
  );
  const escolhidas: Magia[] = [];
  const idsEscolhidos = new Set<string>();
  const maxRodadas = (quantidade + 1) * pools.length * 3 + 20;
  for (let rodada = 0; escolhidas.length < quantidade && rodada < maxRodadas; rodada++) {
    const pool = pools[rodada % pools.length];
    const proxima = pool.find((m) => !idsEscolhidos.has(m.id));
    if (proxima) {
      escolhidas.push(proxima);
      idsEscolhidos.add(proxima.id);
    }
  }
  return escolhidas;
}

/** Círculo máximo de conjuração da classe no nível de teste — mesma
 * leitura que `aplicarLevelUpsAleatorios` usa (`geradorPersonagemTeste.ts`). */
function circuloMaximoDaClasse(classe: Classe): number {
  return Math.max(0, ...espacosDeMagiaAtivos(classe, NIVEL_TESTE).map((e) => e.circulo));
}

/** Invocações Místicas do Bruxo até o nível de teste — o gerador
 * aleatório (`geradorPersonagemTeste.ts`) só sorteia a leva do nível 1,
 * então aqui preenche de verdade até a quantidade real do nível 20,
 * respeitando nível mínimo e pré-requisito em cadeia (passo guloso,
 * várias rodadas até não sobrar nenhuma elegível pra pegar). Nunca
 * sorteado — sempre a mesma lista, na ordem do catálogo. */
function selecionarInvocacoesAteNivel(nivel: number, quantidade: number): string[] {
  const elegiveis = invocacoesMisticas.filter((i) => (i.prerequisitos.nivelMinimo ?? 1) <= nivel);
  const escolhidasIds = new Set<string>();
  let progrediu = true;
  while (escolhidasIds.size < quantidade && progrediu) {
    progrediu = false;
    for (const inv of elegiveis) {
      if (escolhidasIds.size >= quantidade) break;
      if (escolhidasIds.has(inv.id)) continue;
      const reqOk = !inv.prerequisitos.invocacaoRequeridaId || escolhidasIds.has(inv.prerequisitos.invocacaoRequeridaId);
      if (reqOk) {
        escolhidasIds.add(inv.id);
        progrediu = true;
      }
    }
  }
  return [...escolhidasIds];
}

/** PV máximo "manual" pra multiclasse impossível (nível 20 em CADA
 * classe) — 1ª rodada de cada classe no dado MÁXIMO, as outras 19 na
 * média (regra real de PV por nível), todas usando o mesmo mod. de
 * CON final (atributo é do personagem inteiro, não por classe). Não é
 * uma soma "correta" pela regra (regra real só dá 1 dado máximo no
 * personagem inteiro, não 1 por classe) — mas é consistente e
 * reproduz a mesma fórmula de PV por nível usada no resto do app. */
function pvMaximoDoCharMulticlasse(classesEnvolvidas: Classe[], modConstituicao: number): number {
  return classesEnvolvidas.reduce((soma, classe) => {
    const dado = dadoVidaValor[classe.dadoDeVida] ?? 8;
    const media = Math.floor(dado / 2) + 1;
    const nivel1 = dado + modConstituicao;
    const restante = (NIVEL_TESTE - 1) * (media + modConstituicao);
    return soma + nivel1 + restante;
  }, 0);
}

export function montarPersonagemTesteMulticlasse(): PersonagemSalvo {
  const infoClasses = CLASSES_DO_CHAR_MULTICLASSE.map((entry) => {
    const classeObj = classes.find((c) => c.nome === entry.classe);
    if (!classeObj) throw new Error(`Classe não encontrada no catálogo: ${entry.classe}`);
    const build = gerarPersonagemTeste({
      classeNome: entry.classe,
      origemNome: ORIGEM_TESTE,
      especieNome: ESPECIE_TESTE,
      nivelAlvo: NIVEL_TESTE,
      subclasseNome: entry.subclasse,
    });
    return { entry, classeObj, build };
  });

  const base = infoClasses[0].build;
  const modConstituicao = modificador(ATRIBUTOS_TESTE.CON);

  const classesFinal: PersonagemClasse[] = infoClasses.map(({ entry }) => ({
    classe: entry.classe,
    nivel: NIVEL_TESTE,
    subclasse: entry.subclasse,
  }));

  const truquesAtual: MagiaConhecida[] = [];
  const magiasPreparadasAtual: MagiaConhecida[] = [];
  let livroDeMagiasAtual: string[] = [];
  let invocacoesMisticasAtual: string[] = [];
  let estiloDeLutaAtual: string | null = null;
  const maestriaArmaAtual = new Set<string>();
  const periciasEspecialistaAtual: string[] = [];
  const talentosGeraisAtual: string[] = [];

  for (const { entry, classeObj, build } of infoClasses) {
    const circuloMaximo = circuloMaximoDaClasse(classeObj);

    const maxTruques = valorRecursoClasse(classeObj, 'Truques Conhecidos', NIVEL_TESTE);
    if (maxTruques > 0) {
      for (const m of selecionarMagiasDiversificadas(entry.classe, 0, maxTruques)) {
        truquesAtual.push({ nome: m.nome, classe: entry.classe });
      }
    }

    const maxLivro = valorRecursoClasse(classeObj, 'Livro de Magias', NIVEL_TESTE);
    let livroDesteClasse: Magia[] = [];
    if (maxLivro > 0) {
      const circulos = Array.from({ length: circuloMaximo }, (_, i) => i + 1);
      livroDesteClasse = selecionarMagiasDiversificadasEmCirculos(entry.classe, circulos, maxLivro);
      livroDeMagiasAtual = [...livroDeMagiasAtual, ...livroDesteClasse.map((m) => m.nome)];
    }

    const maxPreparadas = valorRecursoClasse(classeObj, 'Magias Preparadas', NIVEL_TESTE);
    if (maxPreparadas > 0) {
      let escolhidasPreparadas: Magia[];
      if (maxLivro > 0) {
        // Preparadas vêm do próprio livro já escolhido (mesma regra
        // de `aplicarLevelUpsAleatorios` — só filtra, nunca soma magia
        // nova que não esteja no grimório).
        escolhidasPreparadas = [...livroDesteClasse]
          .sort((a, b) => prioridadeDeSituacao(a) - prioridadeDeSituacao(b) || a.nome.localeCompare(b.nome, 'pt-BR'))
          .slice(0, maxPreparadas);
      } else {
        const circulos = Array.from({ length: circuloMaximo }, (_, i) => i + 1);
        escolhidasPreparadas = selecionarMagiasDiversificadasEmCirculos(entry.classe, circulos, maxPreparadas);
      }
      for (const m of escolhidasPreparadas) magiasPreparadasAtual.push({ nome: m.nome, classe: entry.classe });
    }

    const maxInvocacoes = valorRecursoClasse(classeObj, 'Invocações Místicas', NIVEL_TESTE);
    if (maxInvocacoes > 0) {
      invocacoesMisticasAtual = selecionarInvocacoesAteNivel(NIVEL_TESTE, maxInvocacoes);
    }

    if (!estiloDeLutaAtual && build.estiloDeLutaAtual) {
      estiloDeLutaAtual = build.estiloDeLutaAtual;
    }

    const qtdMaestria = quantidadeMaestriaEmArma(classeObj, NIVEL_TESTE);
    if (qtdMaestria > 0) {
      const armas = armasParaMaestria(classeObj)
        .map((a) => a.nome)
        .sort((a, b) => a.localeCompare(b, 'pt-BR'))
        .slice(0, qtdMaestria);
      armas.forEach((a) => maestriaArmaAtual.add(a));
    }

    periciasEspecialistaAtual.push(...(build.periciasEspecialistaAtual ?? []));
    talentosGeraisAtual.push(...(build.talentosGeraisAtual ?? []));
  }

  const pvMax = pvMaximoDoCharMulticlasse(
    infoClasses.map((i) => i.classeObj),
    modConstituicao,
  );

  return {
    ...base,
    id: ID_PERSONAGEM_TESTE_MULTICLASSE,
    criadoEm: new Date().toISOString(),
    nivel: classesFinal.reduce((soma, c) => soma + c.nivel, 0),
    xp: 0,
    pvAtual: pvMax,
    pvMax,
    selecao: {
      ...base.selecao,
      atributos: ATRIBUTOS_TESTE,
      desbloquearAtributos: true,
      nome: 'Char Multiclasse (todas as classes, nível 20)',
    },
    classes: classesFinal,
    classeAtivaAtual: classesFinal[0].classe,
    // Entrada em Bardo — única classe (das implementadas) com
    // proficiência à escolha ao multiclassar (ver
    // `proficienciasEntradaMulticlasse.ts`): 1 perícia + 1 Instrumento
    // Musical.
    periciasMulticlasseAtual: ['Persuasão'],
    ferramentasMulticlasseAtual: ['Alaúde'],
    truquesAtual,
    magiasPreparadasAtual,
    livroDeMagiasAtual,
    invocacoesMisticasAtual,
    estiloDeLutaAtual,
    maestriaArmaAtual: [...maestriaArmaAtual],
    periciasEspecialistaAtual,
    talentosGeraisAtual,
  };
}

/** Recria o personagem do zero no armazenamento local — usado pelo botão
 * "🧪 Char Multiclasse" na Lista de Personagens. */
export function recriarPersonagemTesteMulticlasse(): PersonagemSalvo {
  const personagem = montarPersonagemTesteMulticlasse();
  armazenamentoPersonagens.salvar(personagem);
  return personagem;
}
