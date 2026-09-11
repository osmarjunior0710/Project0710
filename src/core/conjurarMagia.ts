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
import { calcularDanoMagia, calcularCuraMagia, mecanicaDaMagia, type MecanicaMagia } from './magiaDano';
import { curaColheitaMacabra } from './necromante';

/** Rolagem de 1 dado só (acerto de magia) — mesmo formato mínimo de
 * `RollD20Options` (`useRoll()`), sem `quantidade`/`lados` (sempre 1d20). */
export interface RollAcertoSpec {
  label: string;
  formula: string;
  mod: number;
}

/** Rolagem de dano/cura (N dados) — mesmo formato mínimo de
 * `RollDadosOptions` (`useRoll()`). */
export interface RollDadosSpec {
  label: string;
  formula: string;
  quantidade: number;
  lados: number;
  mod: number;
}

export interface DanoPendenteMagia {
  label: string;
  quantidade: number;
  lados: number;
  mod: number;
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
  /** Texto de feedback pro jogador — já pronto pra cada caso (ataque
   * com/sem dano cadastrado, salvaguarda, cura, nenhuma mecânica
   * especial reconhecida). */
  textoFeedback: string;
  /** `> 0` quando essa conjuração se qualifica pra Colheita Macabra
   * (Necromante, "Grimório de Necromancia") — `null` quando não
   * (característica não desbloqueada, magia não é de Necromancia, ou
   * não gastou um espaço de verdade). */
  curaColheitaMacabra: number | null;
}

/** Decide o que fazer ao conjurar `m`, usando `circuloUsado` pra
 * escalar dano/cura (0 = truque). `gastouEspacoDeVerdade` é uma flag
 * SEPARADA de `circuloUsado > 0` — necessária porque uma magia
 * concedida de graça por Invocação Mística pode ter círculo > 0 sem
 * ter gastado espaço nenhum (a Colheita Macabra exige "usando um
 * espaço de magia" de verdade, não qualquer conjuração). */
export function decidirConjuracao(
  m: Magia,
  circuloUsado: number,
  nivelPersonagem: number,
  modAcertoConjuracao: number | null,
  colheitaMacabraDisponivel: boolean,
  gastouEspacoDeVerdade: boolean,
): ConjuracaoDecidida {
  const curaMacabra =
    colheitaMacabraDisponivel && gastouEspacoDeVerdade && m.escola === 'Necromancia' ? curaColheitaMacabra(circuloUsado) : null;

  const mecanica = mecanicaDaMagia(m);

  if (mecanica === 'ataque' && modAcertoConjuracao !== null) {
    const dano = calcularDanoMagia(m, circuloUsado, nivelPersonagem);
    return {
      mecanica,
      rollAcerto: { label: `Ataque de Magia — ${m.nome}`, formula: `1d20 + ${modAcertoConjuracao}`, mod: modAcertoConjuracao },
      danoPendente: dano ? { label: `Dano — ✨ ${m.nome}`, quantidade: dano.quantidade, lados: dano.lados, mod: dano.mod } : undefined,
      textoFeedback: dano
        ? 'Rolagem de acerto feita. Toque "Rolar Dano" pra ver o dano.'
        : 'Rolagem de acerto feita. Veja a descrição da magia (ⓘ) pro dano.',
      curaColheitaMacabra: curaMacabra,
    };
  }

  if (mecanica === 'salvaguarda') {
    return {
      mecanica,
      textoFeedback: 'Alvo faz salvaguarda — veja o popup pra CD e dano.',
      curaColheitaMacabra: curaMacabra,
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
        },
        textoFeedback: 'Cura rolada — aplique o total no alvo.',
        curaColheitaMacabra: curaMacabra,
      };
    }
  }

  return { mecanica: 'nenhuma', textoFeedback: m.descricaoCurta ?? '', curaColheitaMacabra: curaMacabra };
}
