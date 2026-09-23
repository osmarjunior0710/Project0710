import { describe, it, expect } from 'vitest';
import { orcamentoRecuperacaoArcana } from './recuperacaoArcana';

// [PH] [codeimplementation] — stub, ver comentário do arquivo. Teste cobre
// só o comportamento atual (sempre 0); atualizar quando a mecânica real
// entrar (orçamento = Math.ceil(nivel / 2), ver SDD).
describe('orcamentoRecuperacaoArcana', () => {
  it('nível normal — ainda não implementado, retorna 0', () => {
    expect(orcamentoRecuperacaoArcana(6)).toBe(0);
  });

  it('nível mínimo (1) — ainda não implementado, retorna 0', () => {
    expect(orcamentoRecuperacaoArcana(1)).toBe(0);
  });
});
