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

/** Nº de usos de Canalizar Divindade (Paladino) no nível atual — 0 antes
 * do nível 3, 2 do 3 ao 10, 3 do 11 em diante (lido de `classes.ts`).
 * Sentido Divino e as demais opções gastam usos do mesmo banco. Recarga:
 * 1 uso no Descanso Curto, todos no Longo (livro Cap. 3). */
export function quantidadeCanalizarDivindade(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Bônus de Canalizar Divindade', nivel);
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

/** Tamanho da reserva de PV de Mãos Consagradas (Paladino) no nível
 * atual: 5 × nível de Paladino (livro Cap. 3, "Nível 1: Mãos
 * Consagradas") — fórmula fixa, não vem de coluna da planilha como os
 * outros recursos "banco de usos". Diferente deles, o gasto aqui é em
 * PONTOS (quantidade escolhida pelo jogador), não em usos de 1 em 1. */
export function quantidadeMaosConsagradas(classe: Classe, nivel: number): number {
  return classe.id === 'paladino' ? 5 * nivel : 0;
}

/** Nº de LADOS do Dado de Artes Marciais (Monge) no nível atual —
 * 6/8/10/12, nunca o valor rolado. SUBSTITUI o dado de dano do Ataque
 * Desarmado/armas de Monge (usa o MAIOR entre os dois), nunca soma —
 * diferente do Dano da Fúria do Bárbaro, que é bônus adicional. Ver
 * `sdd/sdd-monge.md` seção 1. */
export function ladosDadoArtesMarciais(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Bônus de Artes Marciais', nivel);
}

/** Nº de Pontos de Foco (Monge) no nível atual — recarrega no Descanso
 * Curto E no Longo (igual Magia de Pacto do Bruxo, diferente de Fúria/
 * Canalizar Divindade que só recarregam parcial no Curto). */
export function quantidadePontosDeFoco(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Pontos de Foco', nivel);
}

/** Bônus de Deslocamento (em metros) de Movimento sem Armadura (Monge)
 * no nível atual — só vale sem armadura/escudo equipado, ver
 * `sdd/sdd-monge.md` (mesma condição da Defesa sem Armadura). */
export function bonusMovimentoSemArmadura(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Movimento sem Armadura', nivel);
}

/** Aura de Proteção (Paladino, nível 6) está ativa — passiva, sempre
 * ligada, sem "ativar" nada (livro Cap. 3: "você irradia uma aura...").
 * Simplificação conhecida: a regra desliga a aura se o Paladino tiver a
 * condição Incapacitado, mas o app ainda não rastreia condições ativas
 * no próprio personagem nenhuma — fica sempre ativa a partir do nível 6. */
export function temAuraDeProtecao(classe: Classe, nivel: number): boolean {
  return classe.id === 'paladino' && nivel >= 6;
}
