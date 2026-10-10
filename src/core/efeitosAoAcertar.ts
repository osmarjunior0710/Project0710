// Efeitos "ao acertar" em fila (foco aberto em 2026-10, pedido do Osmar — ver EmDev.md e
// Feedback.md "Acerto com várias habilidades de 'ao acertar'"). Fluxo: d20 acertou → lista com
// checkbox → rola o dano (efeito da fase 'dano' entra na rolagem) → fila dos efeitos da fase
// 'depois' (1 marcado abre direto; 2+ pergunta qual primeiro até sobrar 1).
// [codeimplementation]

export type FaseEfeitoAoAcertar = 'dano' | 'depois';

export interface EfeitoAoAcertar {
  /** ID estável (nunca o nome de exibição). */
  id: string;
  nome: string;
  /** Tag de origem mostrada na lista: "Monge", "Talento", "Espécie"... */
  origem: string;
  descricao: string;
  /** 'dano' = muda a rolagem de dano (ex.: dado extra); 'depois' = popup/ação depois do dano (fila). */
  fase: FaseEfeitoAoAcertar;
  /** Pontos de Foco gastos na EXECUÇÃO do efeito (não ao marcar). */
  custoFoco?: number;
}

/** Soma do Foco que os efeitos marcados vão gastar. */
export function focoDosMarcados(efeitos: readonly EfeitoAoAcertar[], marcados: ReadonlySet<string>): number {
  return efeitos.reduce((soma, e) => (marcados.has(e.id) ? soma + (e.custoFoco ?? 0) : soma), 0);
}

/** `true` se o efeito já está marcado (sempre pode desmarcar) ou se marcá-lo ainda cabe no Foco restante. */
export function podeMarcarEfeito(
  efeito: EfeitoAoAcertar,
  efeitos: readonly EfeitoAoAcertar[],
  marcados: ReadonlySet<string>,
  focoRestante: number,
): boolean {
  if (marcados.has(efeito.id)) return true;
  const proximo = new Set(marcados);
  proximo.add(efeito.id);
  return focoDosMarcados(efeitos, proximo) <= focoRestante;
}

/** Efeitos marcados de uma fase, na ordem da lista. */
export function marcadosDaFase(
  efeitos: readonly EfeitoAoAcertar[],
  marcados: ReadonlySet<string>,
  fase: FaseEfeitoAoAcertar,
): EfeitoAoAcertar[] {
  return efeitos.filter((e) => e.fase === fase && marcados.has(e.id));
}

export type PassoDaFila =
  | { tipo: 'fim' }
  | { tipo: 'automatico'; efeito: EfeitoAoAcertar }
  | { tipo: 'escolher'; opcoes: EfeitoAoAcertar[] };

/** Próximo passo da fila: vazia = fim; 1 restante = abre sozinho; 2+ = jogador escolhe o primeiro. */
export function proximoPassoDaFila(fila: readonly EfeitoAoAcertar[]): PassoDaFila {
  if (fila.length === 0) return { tipo: 'fim' };
  if (fila.length === 1) return { tipo: 'automatico', efeito: fila[0] };
  return { tipo: 'escolher', opcoes: [...fila] };
}

export function removerDaFila(fila: readonly EfeitoAoAcertar[], id: string): EfeitoAoAcertar[] {
  return fila.filter((e) => e.id !== id);
}
