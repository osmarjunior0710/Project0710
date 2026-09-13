// Leitura genérica de `recursos` da classe (`classes.ts`) por nome +
// nível — usado por qualquer recurso com "banco de usos" numérico
// (Recuperar Fôlego, Maestria em Arma...). Zero constante hardcoded:
// tudo lido da progressão real importada da planilha.

import type { Classe } from '../data/rulesets/dnd2024/classes';

export function valorRecursoClasse(classe: Classe, prefixoNome: string, nivel: number): number {
  const recurso = classe.recursos.find((r) => r.nome.startsWith(prefixoNome));
  return recurso?.valorPorNivel[nivel] ?? 0;
}

/** Nº de usos de Recuperar Fôlego no nível atual — Mente Tática (nível
 * 2) gasta usos do mesmo banco, não tem contador próprio (ver
 * DECISOES-CLASSES.md "Guerreiro — recursos e mecânicas implementadas"). */
export function quantidadeRecuperarFolego(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Recuperar Fôlego', nivel);
}

/** Nº de usos de Fúria (Bárbaro) no nível atual — banco de ativações,
 * não de turnos (ver `sdd/sdd-barbaro-furia.md`). */
export function quantidadeFuria(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Fúrias', nivel);
}

/** Bônus de dano da Fúria (Bárbaro) no nível atual — soma no dano de
 * qualquer ataque baseado em Força enquanto a Fúria estiver ativa. */
export function bonusDanoFuria(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Dano da Fúria', nivel);
}
