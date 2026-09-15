// Ataque de Sopro (Draconato) — quantidade de d10 escala por nível de
// personagem: 1d10 (1-4), 2d10 (5-10), 3d10 (11-16), 4d10 (17+).

import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';

export function dadosAtaqueDeSopro(nivel: number): number {
  if (nivel >= 17) return 4;
  if (nivel >= 11) return 3;
  if (nivel >= 5) return 2;
  return 1;
}

/** Quebra da CD do Ataque de Sopro — regra fixa "8 + mod. de
 * Constituição + Bônus de Proficiência" (Apêndice C). `conMod`/`prof`
 * já vêm calculados de fora (o Draconato não tem atributo de
 * conjuração — é sempre Constituição, direto, sem o motor de
 * `magiasPersonagem.ts`). B8, ver DECISOES-COMBATE.md. */
export function explicarCdAtaqueDeSopro(conMod: number, prof: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'CD base', valor: '8' },
      { label: 'mod. CON', valor: fmtMod(conMod) },
      { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
    ],
    total: { label: 'CD', valor: String(8 + conMod + prof) },
  };
}
