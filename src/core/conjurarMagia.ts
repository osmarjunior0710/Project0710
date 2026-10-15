// Decisão do que acontece ao conjurar uma magia com espaço (qual
// mecânica, que rolagem fazer, que texto de feedback mostrar, se
// qualifica pra Colheita Macabra) — extraído de 3 cópias quase
// idênticas que existiam em `MagiasTab.tsx`/`AcaoPanelContent.tsx`/
// `ReacaoPanelContent.tsx` (postmortem Mago/Necromante, 2026-09): a
// Colheita Macabra só estava ligada em 2 das 3, porque cada painel
// reimplementava a mesma lógica por conta própria. Esta função pura
// centraliza só a DECISÃO — cada painel continua aplicando o
// resultado do seu próprio jeito (estado local, callback pro
// componente pai, painel fecha ou não), já que essa parte genuinamente
// difere entre os 3 e não faz sentido forçar igual.

import type { Magia } from '../data/rulesets/dnd2024/magias';
import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';
import { calcularDanoMagia, calcularCuraMagia, mecanicaDaMagia, fmtDado, type MecanicaMagia } from './magiaDano';
import { curaColheitaMacabra } from './necromante';
import { bonusExplosaoAgonizante } from './invocacoesMisticas';
import { bonusEvocacaoPotencializada } from './evocador';
import { disciplinaParaConjuracao } from './disciplinasPsionicas';

/** Rolagem de 1 dado só (acerto de magia) — mesmo formato mínimo de
 * `RollD20Options` (`useRoll()`), sem `quantidade`/`lados` (sempre 1d20). */
export interface RollAcertoSpec {
  label: string;
  formula: string;
  mod: number;
  /** Quebra do `mod` (mesmo formato do "ⓘ" de CA/perícia/ataque) —
   * `undefined` quando `explicarModAcertoConjuracao` não pôde
   * calcular (mesmos casos de `modAcertoConjuracao` null). */
  explicacaoMod?: ExplicacaoCalculo;
}

/** Rolagem de dano/cura (N dados) — mesmo formato mínimo de
 * `RollDadosOptions` (`useRoll()`). */
export interface RollDadosSpec {
  label: string;
  formula: string;
  quantidade: number;
  lados: number;
  mod: number;
  /** Ver `RollAcertoSpec.explicacaoMod` — quebra do dado de cura (B8). */
  explicacaoMod?: ExplicacaoCalculo;
  /** Ver `DanoPendenteMagia.tipo` — só preenchido em `rollDano` (dano
   * automático); `rollCura` não tem tipo de dano. */
  tipo?: string | null;
}

export interface DanoPendenteMagia {
  label: string;
  quantidade: number;
  lados: number;
  mod: number;
  /** Ver `RollAcertoSpec.explicacaoMod`/`CalculoDanoMagia.explicacao`
   * — quebra do dado de dano (B8), com a linha extra de Explosão
   * Agonizante somada quando aplicável. */
  explicacaoMod?: ExplicacaoCalculo;
  /** Tipo de dano da magia (`CalculoDanoMagia.tipo`) — usado pra saber se
   * qualifica pra "Modo de Ataque" da Mente Aguçada (Psiônico, UA, exige
   * dano Psíquico). `null` = magia sem tipo de dano único cadastrado. */
  tipo: string | null;
}

export interface ConjuracaoDecidida {
  mecanica: MecanicaMagia;
  /** Presente só quando `mecanica === 'ataque'` e `modAcertoConjuracao`
   * foi informado — rolagem de acerto a fazer. */
  rollAcerto?: RollAcertoSpec;
  /** Presente só quando `mecanica === 'ataque'` e a magia tem dano
   * cadastrado — dano a deixar pendente (botão "Rolar Dano"). */
  danoPendente?: DanoPendenteMagia;
  /** Presente só quando `mecanica === 'cura'` e a magia tem cura
   * cadastrada — rolagem de cura a fazer. */
  rollCura?: RollDadosSpec;
  /** Presente só quando `mecanica === 'dano-automatico'` — dano a
   * rolar direto, sem jogada de acerto/salvaguarda antes (a magia já
   * acerta sozinha, ex.: Destruição Divina/Mísseis Mágicos). */
  rollDano?: RollDadosSpec;
  /** Texto de feedback pro jogador — já pronto pra cada caso (ataque
   * com/sem dano cadastrado, salvaguarda, cura, nenhuma mecânica
   * especial reconhecida). */
  textoFeedback: string;
  /** `> 0` quando essa conjuração se qualifica pra Colheita Macabra
   * (Necromante, "Grimório de Necromancia") — `null` quando não
   * (característica não desbloqueada, magia não é de Necromancia, ou
   * não gastou um espaço de verdade). */
  curaColheitaMacabra: number | null;
  /** Disciplina Psiônica que se encaixa nesta conjuração (Psiônico UA, E4c:
   * Aperfeiçoamento de Precognição/Bio-Retorno/Insinuação do Id/Pensamentos
   * Destrutivos) — `null` quando nenhuma bate (escola errada, disciplina não
   * conhecida, ou já usou uma disciplina comum neste turno). `quantidadeDados`
   * é 1 (Aperfeiçoamento/Insinuação) ou o mod. de Inteligência, possivelmente
   * 0/negativo (Bio-Retorno/Pensamentos Destrutivos — nesse caso a tela
   * aplica o mínimo de 1 direto, sem rolar dado nenhum). */
  disciplinaPosConjuracao: DisciplinaPosConjuracaoInfo | null;
}

/** Forma mínima de `disciplinaPosConjuracao` acima — exportado pra quem exibe o popup (ver
 * `DisciplinaPosConjuracaoModal.tsx`) não precisar repetir o shape em cada painel/aba. */
export interface DisciplinaPosConjuracaoInfo {
  id: string;
  nome: string;
  descricao: string;
  quantidadeDados: number;
}

/** O que `onDisciplinaPosConjuracaoDisponivel` recebe de cada painel/aba — `aoResolverSalvaguarda`
 * só vem preenchido quando a magia TAMBÉM abre `SalvaguardaDoAlvoModal` (Insinuação do
 * Id/Pensamentos Destrutivos, que exigem salvaguarda): quem chama usa isso pra só abrir a
 * Salvaguarda DEPOIS da Disciplina resolver, já com o texto do resultado pronto pra virar linha
 * extra — ver `FichaShell.tsx` `usarDisciplinaPosConjuracao`. */
export interface DisciplinaPosConjuracaoPendente extends DisciplinaPosConjuracaoInfo {
  aoResolverSalvaguarda?: (texto: string | null) => void;
}

/** Decide o que fazer ao conjurar `m`, usando `circuloUsado` pra
 * escalar dano/cura (0 = truque). `gastouEspacoDeVerdade` é uma flag
 * SEPARADA de `circuloUsado > 0` — necessária porque uma magia
 * concedida de graça por Invocação Mística pode ter círculo > 0 sem
 * ter gastado espaço nenhum (a Colheita Macabra exige "usando um
 * espaço de magia" de verdade, não qualquer conjuração).
 * `truqueVinculadoAgonizante` (NOME do truque escolhido no Level Up
 * pra Explosão Agonizante, `undefined` = invocação ausente/ainda não
 * vinculada) + `modCarisma` só alimentam essa invocação (ver
 * `bonusExplosaoAgonizante`) — sem efeito em qualquer outra magia.
 * `evocacaoPotencializadaAtiva` + `modInt` alimentam a característica
 * homônima do Evocador (ver `bonusEvocacaoPotencializada`) — os 2
 * bônus são independentes e podem somar juntos (ex.: Multiclasse
 * Bruxo/Mago). */
export function decidirConjuracao(
  m: Magia,
  circuloUsado: number,
  nivelPersonagem: number,
  modAcertoConjuracao: number | null,
  colheitaMacabraDisponivel: boolean,
  gastouEspacoDeVerdade: boolean,
  truqueVinculadoAgonizante: string | undefined,
  modCarisma: number,
  explicacaoAcertoConjuracao: ExplicacaoCalculo | null = null,
  evocacaoPotencializadaAtiva = false,
  modInt = 0,
  disciplinasPsionicasConhecidas: string[] = [],
  disciplinaPsionicaBloqueada = false,
): ConjuracaoDecidida {
  const curaMacabra =
    colheitaMacabraDisponivel && gastouEspacoDeVerdade && m.escola === 'Necromancia' ? curaColheitaMacabra(circuloUsado) : null;

  const mecanica = mecanicaDaMagia(m);

  const disciplina = disciplinaPsionicaBloqueada
    ? null
    : disciplinaParaConjuracao(disciplinasPsionicasConhecidas, m, mecanica === 'salvaguarda');
  const disciplinaPosConjuracao = disciplina
    ? {
        id: disciplina.id,
        nome: disciplina.nome,
        descricao: disciplina.descricao,
        quantidadeDados: disciplina.id === 'bio-retorno' || disciplina.id === 'pensamentos-destrutivos' ? modInt : 1,
      }
    : null;

  if (mecanica === 'ataque' && modAcertoConjuracao !== null) {
    const dano = calcularDanoMagia(m, circuloUsado, nivelPersonagem);
    const bonusAgonizante = bonusExplosaoAgonizante(m.nome, truqueVinculadoAgonizante, modCarisma);
    const bonusEvocacao = bonusEvocacaoPotencializada(m, evocacaoPotencializadaAtiva, modInt);
    const somarBonus = (base: typeof dano, bonus: number, label: string) =>
      base && bonus !== 0
        ? {
            ...base,
            mod: base.mod + bonus,
            explicacao: {
              linhas: [...base.explicacao.linhas, { label, valor: fmtMod(bonus) }],
              total: { ...base.explicacao.total, valor: fmtDado(base.quantidade, base.lados, base.mod + bonus) },
            },
          }
        : base;
    const danoFinal = somarBonus(somarBonus(dano, bonusAgonizante, 'Explosão Agonizante'), bonusEvocacao, 'Evocação Potencializada');
    return {
      mecanica,
      rollAcerto: {
        label: `Ataque de Magia — ${m.nome}`,
        formula: `1d20 + ${modAcertoConjuracao}`,
        mod: modAcertoConjuracao,
        explicacaoMod: explicacaoAcertoConjuracao ?? undefined,
      },
      danoPendente: danoFinal
        ? {
            label: `Dano — ✨ ${m.nome}`,
            quantidade: danoFinal.quantidade,
            lados: danoFinal.lados,
            mod: danoFinal.mod,
            explicacaoMod: danoFinal.explicacao,
            tipo: danoFinal.tipo,
          }
        : undefined,
      textoFeedback: danoFinal
        ? 'Rolagem de acerto feita.'
        : 'Rolagem de acerto feita. Veja a descrição da magia (ⓘ) pro dano.',
      curaColheitaMacabra: curaMacabra,
      disciplinaPosConjuracao,
    };
  }

  if (mecanica === 'salvaguarda') {
    return {
      mecanica,
      textoFeedback: 'Alvo faz salvaguarda — veja o popup pra CD e dano.',
      curaColheitaMacabra: curaMacabra,
      disciplinaPosConjuracao,
    };
  }

  if (mecanica === 'cura') {
    const cura = calcularCuraMagia(m, circuloUsado, nivelPersonagem);
    if (cura) {
      return {
        mecanica,
        rollCura: {
          label: `Cura — ✨ ${m.nome}`,
          formula: `${cura.quantidade}d${cura.lados}${cura.mod ? ` + ${cura.mod}` : ''}`,
          quantidade: cura.quantidade,
          lados: cura.lados,
          mod: cura.mod,
          explicacaoMod: cura.explicacao,
        },
        textoFeedback: 'Cura rolada — escolha o alvo no popup ("Me curar" ou "Curar outro").',
        curaColheitaMacabra: curaMacabra,
        disciplinaPosConjuracao,
      };
    }
  }

  if (mecanica === 'dano-automatico') {
    const dano = calcularDanoMagia(m, circuloUsado, nivelPersonagem);
    if (dano) {
      return {
        mecanica,
        rollDano: {
          label: `Dano — ✨ ${m.nome}`,
          formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
          quantidade: dano.quantidade,
          lados: dano.lados,
          mod: dano.mod,
          explicacaoMod: dano.explicacao,
          tipo: dano.tipo,
        },
        textoFeedback: 'Dano automático — role e aplique no alvo.',
        curaColheitaMacabra: curaMacabra,
        disciplinaPosConjuracao,
      };
    }
  }

  return { mecanica: 'nenhuma', textoFeedback: m.descricaoCurta ?? '', curaColheitaMacabra: curaMacabra, disciplinaPosConjuracao };
}
