import type { Classe } from '../data/rulesets/dnd2024/classes';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import { caracteristicaSubclasseDesbloqueada } from './levelUp';
import { ID_CARACTERISTICA_SUBCLASSE } from '../data/rulesets/dnd2024/idsCaracteristicasSubclasse';
import { fmtDado, type CalculoDanoMagia } from './magiaDano';
import { fmtMod } from './calculoPersonagem';

function circuloMaximoNoNivel(classe: Classe, nivel: number): number {
  return Math.max(0, ...espacosDeMagiaAtivos(classe, nivel).map((e) => e.circulo));
}

/** Versado em Evocação (Mago/Evocador, nível 3, regra oficial): quantas
 * magias de Evocação bônus (gratuitas no Livro de Magias) esse
 * LEVEL-UP específico concede — não é acumulado, é só o delta de
 * "agora" (mesmo padrão de `magiasPeritoNecromanciaNesteNivel`,
 * Necromante homebrew). 2 ao atingir o nível 3 (quando a subclasse é
 * escolhida); +1 toda vez que um novo círculo de espaço de magia é
 * desbloqueado depois disso; 0 em qualquer outro level-up. */
export function magiasVersadoEmEvocacaoNesteNivel(classe: Classe, nivelAnterior: number, novoNivel: number): number {
  if (novoNivel < 3) return 0;
  if (novoNivel === 3) return 2;
  const circuloAntes = circuloMaximoNoNivel(classe, nivelAnterior);
  const circuloDepois = circuloMaximoNoNivel(classe, novoNivel);
  return circuloDepois > circuloAntes ? 1 : 0;
}

/** Catálogo elegível pro Versado em Evocação nesse nível — só magias
 * de Evocação de MAGO (o texto da característica restringe à lista de
 * magias de Mago, diferente de Perito em Necromancia que não
 * restringe por classe) até o círculo máximo disponível. */
export function catalogoVersadoEmEvocacao(circuloMaximo: number): Magia[] {
  return magias.filter((m) => m.escola === 'Evocação' && m.classes.includes('Mago') && m.circulo >= 1 && m.circulo <= circuloMaximo);
}

/** Truque Potente (Mago/Evocador, nível 3, regra oficial) —
 * `true` = personagem já tem a característica nesse nível. */
export function truquePotenteAtivo(subclasse: string | null, nivel: number): boolean {
  return caracteristicaSubclasseDesbloqueada(subclasse, ID_CARACTERISTICA_SUBCLASSE.truquePotente, nivel);
}

/** Truque Potente vale só pra truque (círculo 0) com dano cadastrado —
 * o texto da característica ("seus truques que causam dano") não
 * restringe por escola, diferente de Versado em Evocação/Evocação
 * Potencializada/Sobrecarga (SDD `sdd-mago-evocador.md`, seção 3). */
export function truqueElegivelTruquePotente(m: Magia): boolean {
  return m.circulo === 0 && m.danoBaseDado != null;
}

/** Evocação Potencializada (Mago/Evocador, nível 10, regra oficial) —
 * `true` = personagem já tem a característica nesse nível. */
export function evocacaoPotencializadaAtiva(subclasse: string | null, nivel: number): boolean {
  return caracteristicaSubclasseDesbloqueada(subclasse, ID_CARACTERISTICA_SUBCLASSE.evocacaoPotencializada, nivel);
}

/** Quanto o mod. de Inteligência soma ao dano dessa magia — 0 quando a
 * característica não está ativa OU a magia não é "de Mago da escola de
 * Evocação" (texto oficial restringe as duas coisas, igual a Versado
 * em Evocação). Sempre positivo pro jogador na prática (INT negativo
 * seria raríssimo num Mago) — por isso não tem toggle, é automático. */
export function bonusEvocacaoPotencializada(m: Magia, ativa: boolean, modInt: number): number {
  if (!ativa) return 0;
  if (m.escola !== 'Evocação' || !m.classes.includes('Mago')) return 0;
  return modInt;
}

/** Aplica `bonusEvocacaoPotencializada` num `CalculoDanoMagia` já
 * pronto (caso Salvaguarda, calculado fora de `decidirConjuracao` —
 * ver `abrirSalvaguarda`/`processarMagiaAoUsar`) — mesmo formato de
 * quebra ("ⓘ") usado no caso Ataque, reaproveitado aqui pra não
 * duplicar a lógica de merge nas 2 telas (Combate e Magias). Retorna
 * `dano` sem alteração quando o bônus é 0. */
export function aplicarEvocacaoPotencializadaAoDano(
  dano: CalculoDanoMagia,
  m: Magia,
  ativa: boolean,
  modInt: number,
): CalculoDanoMagia {
  const bonus = bonusEvocacaoPotencializada(m, ativa, modInt);
  if (bonus === 0) return dano;
  return {
    ...dano,
    mod: dano.mod + bonus,
    explicacao: {
      linhas: [...dano.explicacao.linhas, { label: 'Evocação Potencializada', valor: fmtMod(bonus) }],
      total: { ...dano.explicacao.total, valor: fmtDado(dano.quantidade, dano.lados, dano.mod + bonus) },
    },
  };
}

/** Sobrecarga (Mago/Evocador, nível 14, regra oficial) —
 * `true` = personagem já tem a característica nesse nível. */
export function sobrecargaAtiva(subclasse: string | null, nivel: number): boolean {
  return caracteristicaSubclasseDesbloqueada(subclasse, ID_CARACTERISTICA_SUBCLASSE.sobrecarga, nivel);
}

/** Sobrecarga vale pra qualquer magia "de Mago" com dano, conjurada com
 * espaço de 1º a 5º círculo — sem restrição de escola (diferente de
 * Versado em Evocação/Evocação Potencializada). `circuloUsado` é o
 * círculo do ESPAÇO gasto (upcast conta o círculo do espaço, não o
 * círculo base da magia); truque (círculo 0) e espaço de 6º+ ficam de
 * fora. */
export function sobrecargaElegivel(m: Magia, circuloUsado: number, ativa: boolean): boolean {
  if (!ativa) return false;
  if (!m.classes.includes('Mago') || m.danoBaseDado == null) return false;
  return circuloUsado >= 1 && circuloUsado <= 5;
}

/** Dano máximo de Sobrecarga — cada dado no valor mais alto possível
 * (nunca rola), já contando o dobro de dados do Crítico primeiro (SDD
 * "seção 3": a mecânica de crítico do app dobra a QUANTIDADE de dados
 * antes de rolar; "dano máximo" só aplica depois de já saber quantos
 * dados existem). */
export function danoMaximoSobrecarga(quantidade: number, lados: number, mod: number, critico: boolean): number {
  const fator = critico ? 2 : 1;
  return quantidade * fator * lados + mod;
}

/** Dano Necrótico auto-infligido ao usar Sobrecarga de novo antes do
 * Descanso Longo — `null` na 1ª vez desde o descanso (regra: "ao fazer
 * isso pela primeira vez, você não sofre nenhum efeito adverso").
 * `usosAntesDesteUso` é o contador ANTES de incrementar por este uso
 * (0 = 1ª vez, 1 = 2ª vez → 2d12/círculo, 2 = 3ª vez → 3d12/círculo,
 * ...). Ignora Resistência/Imunidade (informativo — o app não modela
 * nenhuma das duas). */
export function danoNecroticoSobrecarga(usosAntesDesteUso: number, circuloUsado: number): { quantidade: number; lados: 12 } | null {
  if (usosAntesDesteUso <= 0) return null;
  return { quantidade: (1 + usosAntesDesteUso) * circuloUsado, lados: 12 };
}
