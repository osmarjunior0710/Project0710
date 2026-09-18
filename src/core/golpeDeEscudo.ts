// Golpe de Escudo (Mestre em Escudos) — CD fixa "8 + mod. de Força +
// Bônus de Proficiência" (Cap. 5, p.207), mesmo formato de
// `explicarCdAtaqueDeSopro` (Apêndice C): não passa pelo motor de
// conjuração, é sempre Força, direto.

import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';

export function explicarCdGolpeDeEscudo(forMod: number, prof: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'CD base', valor: '8' },
      { label: 'mod. FOR', valor: fmtMod(forMod) },
      { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
    ],
    total: { label: 'CD', valor: String(8 + forMod + prof) },
  };
}
