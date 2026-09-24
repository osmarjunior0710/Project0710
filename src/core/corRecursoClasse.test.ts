import { describe, expect, it } from 'vitest';
import { corDoRecursoDaClasse } from './corRecursoClasse';

describe('corDoRecursoDaClasse', () => {
  it('cores definidas pelo Osmar: Bárbaro vermelho, Bardo mostarda, Bruxo roxo, Guerreiro azul, Mago azul-claro', () => {
    expect(corDoRecursoDaClasse('Bárbaro')).toBe('vermelho');
    expect(corDoRecursoDaClasse('Bardo')).toBe('mostarda');
    expect(corDoRecursoDaClasse('Bruxo')).toBe('roxo');
    expect(corDoRecursoDaClasse('Guerreiro')).toBe('azul');
    expect(corDoRecursoDaClasse('Mago')).toBe('azul-claro');
  });

  it('classe sem cor definida devolve null (azul padrão)', () => {
    expect(corDoRecursoDaClasse('Inventada')).toBeNull();
  });
});
