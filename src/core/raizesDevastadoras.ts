// Raízes Devastadoras (Bárbaro, Trilha da Árvore do Mundo, nível 10) —
// a opção Derrubar usa a CD da maestria de arma "Derrubar" (Apêndice C):
// "8 + seu modificador de atributo do ataque + Bônus de Proficiência".
// Arma Pesada/Versátil nunca tem Acuidade neste catálogo, então o
// atributo do ataque é sempre Força — mesmo formato de
// `explicarCdGolpeDeEscudo`/`explicarCdRamosDaArvore`, arquivo próprio
// (característica diferente, mesma fórmula) em vez de reaproveitar o
// nome de outra feature.

import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';

export function explicarCdRaizesDevastadoras(forMod: number, prof: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'CD base', valor: '8' },
      { label: 'mod. FOR', valor: fmtMod(forMod) },
      { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
    ],
    total: { label: 'CD', valor: String(8 + forMod + prof) },
  };
}
