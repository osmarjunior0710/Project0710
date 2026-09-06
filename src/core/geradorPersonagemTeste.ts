// Gerador de personagem de teste — botão "🎲 Personagem de Teste"
// (Home/Lista de Personagens). Pede só Classe/Origem/Espécie/Nível e
// monta uma ficha completa instantânea, sorteando tudo o resto —
// mesmo espírito do botão 🔀 "sortear tudo desta etapa" que já existe
// em cada passo do wizard (`WizardShell.tsx`), só que encadeado do
// início ao fim e, se o nível pedido for > 1, seguido de Level Ups
// automáticos (escolhas também sorteadas). Ferramenta de
// desenvolvimento/teste — não faz parte do fluxo normal de criação de
// personagem. Ver DECISOES-DESIGN.md.

import { atributosOrdem, arrayPadrao, alinhamentos, type Atributo } from '../data/wizardFixtures';
import { classes, type Classe } from '../data/rulesets/dnd2024/classes';
import { origens } from '../data/rulesets/dnd2024/origens';
import { especies } from '../data/rulesets/dnd2024/especies';
import { idiomas } from '../data/rulesets/dnd2024/idiomas';
import { subclasses } from '../data/rulesets/dnd2024/subclasses';
import { estilosDeLuta } from '../data/rulesets/dnd2024/estilosDeLuta';
import { proficienciasIniciaisClasse } from '../data/rulesets/dnd2024/classesProficienciasIniciais';
import { gruposFerramenta } from '../data/rulesets/dnd2024/ferramentas';
import { pericias } from '../data/rulesets/dnd2024/pericias';
import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';
import { invocacoesMisticas } from '../data/rulesets/dnd2024/invocacoesMisticas';
import { talentos, talentosOrigem, type Talento } from '../data/rulesets/dnd2024/talentos';
import { dadoVidaValor } from '../data/levelUpFixtures';
import {
  criarSelecaoInicial,
  aumentarAtributos,
  modificador,
  valorFinalAtributo,
  type WizardSelection,
} from './personagem';
import { bonusPvPorNivelDaEspecie, bonusPvPorNivelDoTalento, calcularPvMaximoNivel1, periciasProficientes } from './calculoPersonagem';
import { armasParaMaestria, quantidadeMaestriaEmArma } from './maestriaArma';
import { valorRecursoClasse } from './recursosClasse';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import { niveisComASI, niveisComEspecialista, temEstiloDeLutaTrocavel, subclasseImplementada } from './levelUp';
import { opcoesSubescolhaNoWizard, tracoComEscolhaDePericia } from './especieSubescolha';
import { gerarIdPersonagem, type PersonagemSalvo } from './armazenamentoPersonagens';
import { embaralhar, sorteiaUm } from './sorteio';

const nomesAleatorios = [
  'Aria Ventos-Negros',
  'Thorn Ferreiro',
  'Lyra Sombraluz',
  'Kael Pedraverde',
  'Sira Nuvem-de-Fogo',
  'Bram Duasluas',
];

/** Monta uma `WizardSelection` completa e válida pra Classe/Origem/
 * Espécie escolhidas — mesma lógica dos `randomizarX` de
 * `WizardShell.tsx` (atributos, línguas, alinhamento, escolhas de
 * classe e de origem), só que compostas de uma vez em vez de
 * acionadas passo a passo pelo botão 🔀. Nível 1 sempre — quem chama
 * aplica os Level Ups depois, se o nível pedido for maior. */
function gerarSelecaoNivel1(classe: Classe, origemNome: string, especieNome: string): WizardSelection {
  let selection = criarSelecaoInicial();
  selection.classe = classe.nome;
  selection.origem = origemNome;
  selection.especie = especieNome;
  selection.nome = sorteiaUm(nomesAleatorios) ?? 'Personagem de Teste';

  // Atributos — array padrão embaralhado nos 6 atributos + ajuste
  // +1/+1/+1 em 3 atributos sorteados (mesmo padrão de
  // `randomizarAtributos`).
  const valores = embaralhar(arrayPadrao);
  const atributos = {} as Record<Atributo, number | null>;
  atributosOrdem.forEach((a, i) => {
    atributos[a] = valores[i];
  });
  selection.atributos = atributos;
  selection.bonusEscolhas = embaralhar([...atributosOrdem]).slice(0, 3);

  // Escolhas da Classe (estilo de luta, maestria, perícias, ferramentas,
  // equipamento inicial, truques, magias preparadas).
  const proficiencias = proficienciasIniciaisClasse[classe.id];
  if (temEstiloDeLutaTrocavel(classe, 1)) {
    selection.estiloDeLutaEscolhido = sorteiaUm(estilosDeLuta)?.nome ?? null;
  }
  const qtdMaestria = quantidadeMaestriaEmArma(classe, 1);
  if (qtdMaestria > 0) {
    selection.maestriaArmaEscolhida = embaralhar(armasParaMaestria(classe))
      .slice(0, qtdMaestria)
      .map((a) => a.nome);
  }
  if (proficiencias) {
    selection.periciasClasseEscolhidas = embaralhar(proficiencias.periciasEscolha.opcoes).slice(
      0,
      proficiencias.periciasEscolha.quantidade,
    );
    if (proficiencias.ferramentasEscolha) {
      const opcoesFerramenta = gruposFerramenta[proficiencias.ferramentasEscolha.grupo] ?? [];
      selection.ferramentasClasseEscolhidas = embaralhar(opcoesFerramenta)
        .slice(0, proficiencias.ferramentasEscolha.quantidade)
        .map((f) => f.nome);
    }
    const opcoesEquip = proficiencias.equipamentoInicial;
    selection.equipamentoClasseEscolhido = (sorteiaUm(opcoesEquip)?.rotulo ?? 'A') as 'A' | 'B' | 'C';
  }
  const maxInvocacoes = valorRecursoClasse(classe, 'Invocações Místicas', 1);
  if (maxInvocacoes > 0) {
    const elegiveis = invocacoesMisticas.filter((i) => i.prerequisitos.nivelMinimo === null);
    selection.invocacoesMisticasEscolhidas = embaralhar(elegiveis)
      .slice(0, maxInvocacoes)
      .map((i) => i.id);
  }
  const maxTruques = valorRecursoClasse(classe, 'Truques Conhecidos', 1);
  if (maxTruques > 0) {
    selection.truquesEscolhidos = embaralhar(magiasDaClasse(classe.nome, 0))
      .slice(0, maxTruques)
      .map((m) => m.nome);
  }
  const maxMagias = valorRecursoClasse(classe, 'Magias Preparadas', 1);
  if (maxMagias > 0) {
    selection.magiasPreparadasEscolhidas = embaralhar(magiasDaClasse(classe.nome, 1))
      .slice(0, maxMagias)
      .map((m) => m.nome);
  }

  // Escolhas da Origem (ferramenta, quando a Origem pede escolha; opção
  // de equipamento A/B).
  const origemObj = origens.find((o) => o.nome === origemNome);
  selection.equipamentoOrigemEscolhido = Math.random() < 0.5 ? 'A' : 'B';
  if (origemObj?.ferramenta.categoria === 'escolha') {
    const opcoes = gruposFerramenta[origemObj.ferramenta.grupo] ?? [];
    selection.ferramentaOrigemEscolhida = sorteiaUm(opcoes)?.nome ?? null;
  }

  // Escolhas da Espécie (Tamanho, perícia à escolha, Versátil,
  // sub-escolha) — só as espécies com esses traços preenchem algo,
  // mesma lógica de `randomizarEscolhasEspecie`.
  const especieObj = especies.find((e) => e.nome === especieNome);
  if (especieObj?.tamanho.opcoes) {
    selection.tamanhoEspecieEscolhido = sorteiaUm(especieObj.tamanho.opcoes) ?? null;
  }
  const tracoPericia = especieObj ? tracoComEscolhaDePericia(especieObj) : undefined;
  if (tracoPericia) {
    const opcoes = tracoPericia.opcoesPericia ?? pericias.map((p) => p.nome);
    selection.periciaEspecieEscolhida = sorteiaUm(opcoes) ?? null;
  }
  if (especieObj?.traços.some((t) => t.id === 'versatil')) {
    selection.talentoEspecieEscolhido = sorteiaUm(talentosOrigem)?.id ?? null;
  }
  const opcoesSubescolha = especieObj ? opcoesSubescolhaNoWizard(especieObj) : null;
  if (opcoesSubescolha) {
    selection.subescolhaEspecieEscolhida = sorteiaUm(opcoesSubescolha)?.nome ?? null;
  }

  // Línguas, alinhamento — genérico, mesma lógica do wizard.
  const outrosIdiomas = idiomas.filter((i) => i.nome !== 'Comum').map((i) => i.nome);
  selection.linguas = ['Comum', ...embaralhar(outrosIdiomas).slice(0, 2)];
  selection.alinhamento = sorteiaUm(alinhamentos);

  return selection;
}

/** Reaproveitada por `levelUpAleatorio.ts` (Level Up Rápido) — mesmo
 * critério de disponibilidade de `TelaEscolherTalento.motivoIndisponivel`,
 * só que como booleano (pra sortear em vez de exibir motivo). */
export function talentoDisponivel(t: Talento, nivel: number, atributosFinais: Record<Atributo, number>): boolean {
  if (t.prerequisitos.nivelMinimo !== null && nivel < t.prerequisitos.nivelMinimo) return false;
  return t.prerequisitos.atributosMinimos.every((a) => (atributosFinais[a] ?? 10) >= 13);
}

/** Resolve o ASI de um talento (mesma decisão de
 * `LevelUpShell.aplicarAsiDoTalento`, sorteada em vez de escolhida) —
 * devolve os códigos de atributo pra `aumentarAtributos` (0, 1 ou 2
 * entradas). */
export function sortearAsiDoTalento(t: Talento): Atributo[] {
  if (t.concedeAsi.tipo === 'nenhum') return [];
  if (t.concedeAsi.tipo === 'distribuir-dois') {
    const emUmSo = Math.random() < 0.5;
    const atributosPossiveis = t.concedeAsi.atributos;
    if (emUmSo) {
      const a = sorteiaUm(atributosPossiveis);
      return a ? [a, a] : [];
    }
    const dois = embaralhar(atributosPossiveis).slice(0, 2);
    return dois.length === 2 ? dois : dois.length === 1 ? [dois[0]] : [];
  }
  // escolha-unica
  const a = sorteiaUm(t.concedeAsi.atributos);
  return a ? [a] : [];
}

/** Aplica Level Ups de nível 2 até `nivelAlvo`, sorteando toda escolha
 * que o Level Up de verdade pediria (subclasse, estilo de luta,
 * truques/magias preparadas, especialista, ASI/talento) — mesmo
 * espírito do 🔀 do wizard, mas em lote. PV usa a média do dado (sem
 * rolar), por nível. Dádiva Épica fica de fora — a lista ainda não
 * existe no app (ver PENDENCIAS.md), mesmo estado do Level Up normal. */
function aplicarLevelUpsAleatorios(
  classe: Classe,
  selecaoInicial: WizardSelection,
  nivelAlvo: number,
  subclasseForcada?: string | null,
): {
  selecao: WizardSelection;
  nivel: number;
  pvMax: number;
  subclasseAtual: string | null;
  estiloDeLutaAtual: string | null;
  truquesAtual: string[];
  magiasPreparadasAtual: string[];
  periciasEspecialistaAtual: string[];
  talentosGeraisAtual: string[];
} {
  let selecao = { ...selecaoInicial };
  let pvMax = calcularPvMaximoNivel1(selecao) ?? 0;
  let subclasseAtual: string | null = null;
  let estiloDeLutaAtual: string | null = selecao.estiloDeLutaEscolhido;
  let truquesAtual = [...selecao.truquesEscolhidos];
  let magiasPreparadasAtual = [...selecao.magiasPreparadasEscolhidas];
  let periciasEspecialistaAtual: string[] = [];
  let talentosGeraisAtual: string[] = [];

  const conValor = valorFinalAtributo(selecao, 'CON') ?? 10;
  const mediaPvPorNivel =
    dadoVidaValor[classe.dadoDeVida] + modificador(conValor) + bonusPvPorNivelDaEspecie(selecao) + bonusPvPorNivelDoTalento(selecao);
  const subclassesDaClasse = subclasses.filter((s) => s.classeId === classe.id);

  for (let nivel = 2; nivel <= nivelAlvo; nivel++) {
    pvMax += mediaPvPorNivel;

    if (classe.nivelSubclasse === nivel && !subclasseAtual && subclassesDaClasse.length > 0) {
      subclasseAtual = subclasseForcada ?? sorteiaUm(subclassesDaClasse)?.nome ?? null;
    }

    if (temEstiloDeLutaTrocavel(classe, nivel) && !estiloDeLutaAtual) {
      estiloDeLutaAtual = sorteiaUm(estilosDeLuta)?.nome ?? null;
    }

    const maxTruques = valorRecursoClasse(classe, 'Truques Conhecidos', nivel);
    if (maxTruques > 0) {
      truquesAtual = embaralhar(magiasDaClasse(classe.nome, 0))
        .slice(0, maxTruques)
        .map((m) => m.nome);
    }

    const maxMagias = valorRecursoClasse(classe, 'Magias Preparadas', nivel);
    if (maxMagias > 0) {
      const circuloMaximo = Math.max(0, ...espacosDeMagiaAtivos(classe, nivel).map((e) => e.circulo));
      const disponiveis = magiasDaClasse(classe.nome)
        .filter((m) => m.circulo > 0 && m.circulo <= circuloMaximo);
      magiasPreparadasAtual = embaralhar(disponiveis)
        .slice(0, maxMagias)
        .map((m) => m.nome);
    }

    if (niveisComEspecialista(classe).includes(nivel)) {
      const jaProficiente = periciasProficientes(selecao);
      const candidatas = jaProficiente.filter((p) => !periciasEspecialistaAtual.includes(p));
      periciasEspecialistaAtual = [...periciasEspecialistaAtual, ...embaralhar(candidatas).slice(0, 2)];
    }

    if (niveisComASI(classe).includes(nivel)) {
      const atributosFinaisAtuais = Object.fromEntries(
        atributosOrdem.map((a) => [a, valorFinalAtributo(selecao, a) ?? 10]),
      ) as Record<Atributo, number>;
      const usarTalento = Math.random() < 0.5;
      const opcoesTalento = usarTalento
        ? talentos.filter(
            (t) =>
              t.categoria === 'Geral' &&
              t.id !== 'aumento-no-valor-de-atributo' &&
              (t.repetivel || !talentosGeraisAtual.includes(t.id)) &&
              talentoDisponivel(t, nivel, atributosFinaisAtuais),
          )
        : [];
      const talentoEscolhido =
        sorteiaUm(opcoesTalento) ?? talentos.find((t) => t.id === 'aumento-no-valor-de-atributo') ?? null;
      if (talentoEscolhido) {
        talentosGeraisAtual = [...talentosGeraisAtual, talentoEscolhido.id];
        const codigos = sortearAsiDoTalento(talentoEscolhido);
        if (codigos.length > 0) {
          selecao = { ...selecao, atributos: aumentarAtributos(selecao.atributos, codigos) };
        }
      }
    }
  }

  return {
    selecao,
    nivel: nivelAlvo,
    pvMax,
    subclasseAtual,
    estiloDeLutaAtual,
    truquesAtual,
    magiasPreparadasAtual,
    periciasEspecialistaAtual,
    talentosGeraisAtual,
  };
}

export interface OpcaoGeradorTeste {
  id: string;
  nome: string;
}

/** Opções pros 4 dropdowns do popup — só o que já está `disponivel`
 * no catálogo (mesma regra do wizard normal: nada "(em breve)"). */
export function opcoesGeradorTeste(): {
  classes: OpcaoGeradorTeste[];
  origens: OpcaoGeradorTeste[];
  especies: OpcaoGeradorTeste[];
} {
  const porNome = (a: OpcaoGeradorTeste, b: OpcaoGeradorTeste) => a.nome.localeCompare(b.nome, 'pt-BR');
  return {
    classes: classes.filter((c) => c.disponivel).map((c) => ({ id: c.id, nome: c.nome })).sort(porNome),
    origens: origens.filter((o) => o.disponivel).map((o) => ({ id: o.id, nome: o.nome })).sort(porNome),
    especies: especies.filter((e) => e.disponivel).map((e) => ({ id: e.id, nome: e.nome })).sort(porNome),
  };
}

/** Subclasses da classe pedida que já têm característica mecânica
 * implementada de verdade (`subclasseImplementada`, mesmo bloqueio já
 * usado na tela de escolha de subclasse do Level Up) — dropdown
 * opcional "Subclasse" do gerador só oferece essas, nunca uma que
 * ainda é só nome/ícone. */
export function subclassesDisponiveisParaTeste(classeNome: string): OpcaoGeradorTeste[] {
  const classe = classes.find((c) => c.nome === classeNome);
  if (!classe) return [];
  return subclasses
    .filter((s) => s.classeId === classe.id && subclasseImplementada(s.nome))
    .map((s) => ({ id: s.id, nome: s.nome }));
}

/** Gera e devolve um `PersonagemSalvo` completo, pronto pra salvar —
 * quem chama decide se salva (`armazenamentoPersonagens.salvar`) e
 * pra onde navegar depois. Não salva sozinho, pra manter esse módulo
 * livre de efeito colateral (mais fácil de testar/reaproveitar). */
export function gerarPersonagemTeste(params: {
  classeNome: string;
  origemNome: string;
  especieNome: string;
  nivelAlvo: number;
  /** Subclasse escolhida à mão no popup (dropdown opcional) — `null`/
   * ausente = sorteia como sempre. Só faz efeito se `nivelAlvo` já
   * bater o nível de subclasse da classe (senão o personagem nem
   * chega lá, igual um Level Up de verdade). */
  subclasseNome?: string | null;
}): PersonagemSalvo {
  const classe = classes.find((c) => c.nome === params.classeNome);
  if (!classe) throw new Error(`Classe não encontrada: ${params.classeNome}`);

  const selecaoNivel1 = gerarSelecaoNivel1(classe, params.origemNome, params.especieNome);
  const nivelAlvo = Math.max(1, params.nivelAlvo);

  if (nivelAlvo === 1) {
    const pvMax = calcularPvMaximoNivel1(selecaoNivel1) ?? 0;
    return {
      id: gerarIdPersonagem(),
      criadoEm: new Date().toISOString(),
      nivel: 1,
      xp: 0,
      pvAtual: pvMax,
      pvMax,
      selecao: selecaoNivel1,
    };
  }

  const resultado = aplicarLevelUpsAleatorios(classe, selecaoNivel1, nivelAlvo, params.subclasseNome);
  return {
    id: gerarIdPersonagem(),
    criadoEm: new Date().toISOString(),
    nivel: resultado.nivel,
    xp: 0,
    pvAtual: resultado.pvMax,
    pvMax: resultado.pvMax,
    selecao: resultado.selecao,
    subclasseAtual: resultado.subclasseAtual,
    estiloDeLutaAtual: resultado.estiloDeLutaAtual,
    truquesAtual: resultado.truquesAtual,
    magiasPreparadasAtual: resultado.magiasPreparadasAtual,
    periciasEspecialistaAtual: resultado.periciasEspecialistaAtual,
    talentosGeraisAtual: resultado.talentosGeraisAtual,
  };
}

