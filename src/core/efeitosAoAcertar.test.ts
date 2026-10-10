import { describe, expect, it } from 'vitest';
import {
  focoDosMarcados,
  marcadosDaFase,
  podeMarcarEfeito,
  proximoPassoDaFila,
  removerDaFila,
  type EfeitoAoAcertar,
} from './efeitosAoAcertar';

const base = { origem: 'Monge', descricao: '' };
const A: EfeitoAoAcertar = { ...base, id: 'a', nome: 'A', fase: 'depois', custoFoco: 1 };
const B: EfeitoAoAcertar = { ...base, id: 'b', nome: 'B', fase: 'depois' };
const C: EfeitoAoAcertar = { ...base, id: 'c', nome: 'C', fase: 'dano' };
const todos = [A, B, C];

describe('Foco dos efeitos marcados', () => {
  it('soma só o custo dos marcados', () => {
    expect(focoDosMarcados(todos, new Set(['a', 'b']))).toBe(1);
    expect(focoDosMarcados(todos, new Set())).toBe(0);
  });

  it('bloqueia marcar o que passa do Foco restante, mas deixa desmarcar', () => {
    expect(podeMarcarEfeito(A, todos, new Set(), 0)).toBe(false);
    expect(podeMarcarEfeito(A, todos, new Set(), 1)).toBe(true);
    expect(podeMarcarEfeito(A, todos, new Set(['a']), 0)).toBe(true);
    expect(podeMarcarEfeito(B, todos, new Set(), 0)).toBe(true);
  });
});

describe('marcadosDaFase', () => {
  it('filtra por fase e por marcado, mantendo a ordem da lista', () => {
    expect(marcadosDaFase(todos, new Set(['b', 'a', 'c']), 'depois').map((e) => e.id)).toEqual(['a', 'b']);
    expect(marcadosDaFase(todos, new Set(['a']), 'dano')).toEqual([]);
  });
});

describe('fila de efeitos depois do dano', () => {
  it('vazia = fim; 1 = automático; 2+ = escolher', () => {
    expect(proximoPassoDaFila([])).toEqual({ tipo: 'fim' });
    expect(proximoPassoDaFila([A])).toEqual({ tipo: 'automatico', efeito: A });
    expect(proximoPassoDaFila([A, B])).toEqual({ tipo: 'escolher', opcoes: [A, B] });
  });

  it('exemplo do Osmar: a, b, c marcados → C, depois A, B entra sozinho', () => {
    const c: EfeitoAoAcertar = { ...C, fase: 'depois' };
    let fila = [A, B, c];
    expect(proximoPassoDaFila(fila).tipo).toBe('escolher');
    fila = removerDaFila(fila, 'c');
    expect(proximoPassoDaFila(fila).tipo).toBe('escolher');
    fila = removerDaFila(fila, 'a');
    expect(proximoPassoDaFila(fila)).toEqual({ tipo: 'automatico', efeito: B });
    expect(proximoPassoDaFila(removerDaFila(fila, 'b'))).toEqual({ tipo: 'fim' });
  });
});
