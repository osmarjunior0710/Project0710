import { describe, expect, it } from 'vitest';
import { corDoRecursoDaClasse } from './corRecursoClasse';

describe('corDoRecursoDaClasse', () => {
  it('cores definidas pelo Osmar: Bárbaro vermelho, Bardo mostarda, Bruxo roxo', () => {
    expect(corDoRecursoDaClasse('Bárbaro')).toBe('vermelho');
    expect(corDoRecursoDaClasse('Bardo')).toBe('mostarda');
    expect(corDoRecursoDaClasse('Bruxo')).toBe('roxo');
  });

  it('classe sem cor definida devolve null (azul padrão)', () => {
    expect(corDoRecursoDaClasse('Guerreiro')).toBeNull();
    expect(corDoRecursoDaClasse('Inventada')).toBeNull();
  });
});
