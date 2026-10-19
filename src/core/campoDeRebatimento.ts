// Campo de Rebatimento (Psiônico, subclasse Psicinético, nível 6) —
// "Quando você conjura Shield em resposta a ser atingido por uma
// jogada de ataque e faz com que o ataque desencadeador erre, você
// pode gastar um Dado de Energia Psiônica para lançar a força de
// volta contra o atacante. O atacante realiza um teste de resistência
// de Destreza. Role um Dado de Energia Psiônica. Em uma falha, o
// atacante sofre dano de Força igual ao valor rolado + seu
// modificador de Inteligência. Em um sucesso, o atacante sofre metade
// desse dano. Independentemente do resultado do teste, você ganha
// Pontos de Vida Temporários iguais à quantidade de dano causado."
// O app não sabe se Escudo Arcano foi conjurado nem se o ataque errou
// (narrativo, fora do alcance do app) — o card fica disponível sempre
// que a Reação não foi usada e há Dado de Energia; o texto explica a
// pré-condição. PV Temporário é automático (o app já rastreia o
// personagem, diferente do atacante). [codeimplementation]

import type { ExplicacaoCalculo } from './calculoPersonagem';
import { fmtMod } from './calculoPersonagem';

export function temCampoDeRebatimento(nivelPsionico: number): boolean {
  return nivelPsionico >= 6;
}

export function podeAtivarCampoDeRebatimento(nivelPsionico: number, dadosRestantes: number): boolean {
  return temCampoDeRebatimento(nivelPsionico) && dadosRestantes > 0;
}

/** Dano em caso de FALHA do atacante — "valor rolado + mod. Inteligência". Também o valor de PV
 * Temporário ganho nesse caso (mesmo número). */
export function danoCampoDeRebatimento(dadoRolado: number, modInt: number): number {
  return dadoRolado + modInt;
}

/** Dano em caso de SUCESSO do atacante — metade do valor acima, arredondado pra baixo (padrão
 * 5e). Também o valor de PV Temporário ganho nesse caso. */
export function danoCampoDeRebatimentoSucesso(dadoRolado: number, modInt: number): number {
  return Math.floor(danoCampoDeRebatimento(dadoRolado, modInt) / 2);
}

/** Quebra (ⓘ) da conta de dano em caso de falha — "o dado rolado + modificador de Inteligência". */
export function explicarDanoCampoDeRebatimento(dadoRolado: number, modInt: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'Dado rolado', valor: `${dadoRolado}` },
      { label: 'Modificador de Inteligência', valor: fmtMod(modInt) },
    ],
    total: { label: 'Dano de Força (falha) / PV Temporário ganho', valor: `${danoCampoDeRebatimento(dadoRolado, modInt)}` },
  };
}
