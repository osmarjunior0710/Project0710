import { describe, expect, it } from 'vitest';
import { corDoRecursoDaClasse } from './corRecursoClasse';

describe('corDoRecursoDaClasse', () => {
  it('cores finais definidas pelo Osmar (2026-09), uma por classe', () => {
    expect(corDoRecursoDaClasse('Bárbaro')).toEqual({ hex: '#e30039', textoClaro: true });
    expect(corDoRecursoDaClasse('Bardo')).toEqual({ hex: '#e6bb00', textoClaro: true });
    expect(corDoRecursoDaClasse('Bruxo')).toEqual({ hex: '#7536eb', textoClaro: true });
    expect(corDoRecursoDaClasse('Guerreiro')).toEqual({ hex: '#a10028', textoClaro: true });
    expect(corDoRecursoDaClasse('Mago')).toEqual({ hex: '#2b53e3', textoClaro: true });
    expect(corDoRecursoDaClasse('Guardião')).toEqual({ hex: '#bfef45', textoClaro: false });
    expect(corDoRecursoDaClasse('Paladino')).toEqual({ hex: '#000075', textoClaro: true });
  });

  it('classe sem cor definida devolve null (azul padrão)', () => {
    expect(corDoRecursoDaClasse('Inventada')).toBeNull();
  });
});
