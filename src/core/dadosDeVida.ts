// Dados de Vida (Livro do Jogador 2024 — ver `DND-Regras.md`, "Dados de
// Vida"): 1 por nível, do tipo da classe. Multiclasse: soma tudo; mesmo
// tipo se combina, tipos diferentes ficam separados (Clérigo 5 /
// Paladino 5 = 5d8 + 5d10). Gastos num Descanso Curto (dado + mod. de
// Constituição, mínimo 1 PV por dado); o Descanso Longo devolve TODOS.

export interface ReservaDadoVida {
  /** "d6" | "d8" | "d10" | "d12" — igual ao campo `dadoDeVida` das classes. */
  tipo: string;
  lados: number;
  /** 1 por nível de classe que usa esse tipo. */
  total: number;
  gastos: number;
  restantes: number;
}

function ladosDoTipo(tipo: string): number {
  return Number.parseInt(tipo.replace(/^d/i, ''), 10);
}

/** Monta a reserva a partir de TODAS as classes do personagem (nunca só
 * a classe em foco). `dadoPorClasse` devolve o tipo de dado de uma
 * classe pelo nome (`undefined` = classe desconhecida, ignorada).
 * `gastos` é o que já foi gasto por tipo — nunca passa do total, mesmo
 * se o personagem perder níveis. Ordenada do menor pro maior dado. */
export function reservaDeDadosDeVida(
  classes: { classe: string; nivel: number }[],
  dadoPorClasse: (nomeClasse: string) => string | undefined,
  gastos: Record<string, number>,
): ReservaDadoVida[] {
  const totais = new Map<string, number>();
  for (const c of classes) {
    const tipo = dadoPorClasse(c.classe);
    if (!tipo || c.nivel <= 0) continue;
    totais.set(tipo, (totais.get(tipo) ?? 0) + c.nivel);
  }
  return [...totais.entries()]
    .map(([tipo, total]) => {
      const gasto = Math.min(total, Math.max(0, gastos[tipo] ?? 0));
      return { tipo, lados: ladosDoTipo(tipo), total, gastos: gasto, restantes: total - gasto };
    })
    .sort((a, b) => a.lados - b.lados);
}

export function totalDeDadosRestantes(reserva: ReservaDadoVida[]): number {
  return reserva.reduce((acc, r) => acc + r.restantes, 0);
}

/** PV recuperados por 1 Dado de Vida gasto: rolagem + mod. de
 * Constituição, mínimo 1. */
export function curaDeDadoDeVida(rolagem: number, modConstituicao: number): number {
  return Math.max(1, rolagem + modConstituicao);
}
