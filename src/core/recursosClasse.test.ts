import { describe, it, expect } from 'vitest';
import { valorRecursoClasse, quantidadeRecuperarFolego } from './recursosClasse';
import { classes } from '../data/rulesets/dnd2024/classes';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

describe('valorRecursoClasse', () => {
  it('acha o recurso pelo prefixo do nome e lê o valor do nível pedido (Guerreiro, Recuperar Fôlego)', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 1)).toBe(2);
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 10)).toBe(4);
  });

  it('borda: prefixo que não bate com nenhum recurso da classe devolve 0, nunca undefined/erro', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recurso Que Não Existe', 1)).toBe(0);
  });

  it('borda: nível sem entrada na tabela (fora do range 1-20) devolve 0', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 0)).toBe(0);
  });
});

describe('quantidadeRecuperarFolego', () => {
  it('Guerreiro nível 1 tem 2 usos, nível 10 tem 4 (progressão real da planilha)', () => {
    expect(quantidadeRecuperarFolego(classe('Guerreiro'), 1)).toBe(2);
    expect(quantidadeRecuperarFolego(classe('Guerreiro'), 10)).toBe(4);
  });

  it('borda: classe sem esse recurso (Bardo não tem Recuperar Fôlego) devolve 0', () => {
    expect(quantidadeRecuperarFolego(classe('Bardo'), 1)).toBe(0);
  });
});
