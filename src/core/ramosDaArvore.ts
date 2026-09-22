// Ramos da Árvore (Bárbaro, Trilha da Árvore do Mundo, nível 6) — CD
// fixa "8 + mod. de Força + Bônus de Proficiência", mesmo formato de
// `explicarCdGolpeDeEscudo`/`explicarCdAtaqueDeSopro`: não passa pelo
// motor de conjuração, é sempre Força, direto.

import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';

export function explicarCdRamosDaArvore(forMod: number, prof: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'CD base', valor: '8' },
      { label: 'mod. FOR', valor: fmtMod(forMod) },
      { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
    ],
    total: { label: 'CD', valor: String(8 + forMod + prof) },
  };
}
