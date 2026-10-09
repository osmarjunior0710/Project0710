// Golpe Atordoante (Monge, nível 5) — "8 + mod. de Sabedoria + Bônus de
// Proficiência" (CD de Foco do Monge, ver sdd/sdd-monge.md seção 6).
// Mesmo formato de `explicarCdGolpeDeEscudo`: o alvo é quem salva, o app
// só mostra a CD (popup `SalvaguardaDoAlvoModal`).

import { fmtMod, type ExplicacaoCalculo } from './calculoPersonagem';

export function explicarCdGolpeAtordoante(sabMod: number, prof: number): ExplicacaoCalculo {
  return {
    linhas: [
      { label: 'CD base', valor: '8' },
      { label: 'mod. SAB', valor: fmtMod(sabMod) },
      { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
    ],
    total: { label: 'CD', valor: String(8 + sabMod + prof) },
  };
}

/** [codeimplementation] Golpe Atordoante só é oferecido a partir do
 * nível 5 de Monge, com pelo menos 1 Ponto de Foco, 1x por turno e só em
 * ataque com arma de Monge ou Desarmado. */
export function golpeAtordoanteDisponivel(opts: {
  nivelMonge: number;
  pontosDeFocoRestantes: number;
  usadoTurno: boolean;
  armaDeMongeOuDesarmado: boolean;
}): boolean {
  return opts.nivelMonge >= 5 && opts.pontosDeFocoRestantes >= 1 && !opts.usadoTurno && opts.armaDeMongeOuDesarmado;
}
