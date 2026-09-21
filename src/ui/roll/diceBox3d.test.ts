import { describe, expect, it } from 'vitest';
import { agruparDadosPorLados, distribuirPorLados, gruposNovos } from './diceBox3d';
import type { DiceBoxResultado } from '@3d-dice/dice-box';

function grupo(id: string, value: number): DiceBoxResultado {
  return { id, value };
}

describe('gruposNovos', () => {
  it('caso normal — box.roll() (idsAntes vazio, tudo é novo)', () => {
    const resultados = [grupo('g1', 15), grupo('g2', 3)];
    expect(gruposNovos(new Set(), resultados)).toEqual(resultados);
  });

  it('caso normal — box.add() (só o grupo recém-criado sobra)', () => {
    const antigo = grupo('g1', 15);
    const novo = grupo('g2', 8);
    const idsAntes = new Set([antigo.id]);
    expect(gruposNovos(idsAntes, [antigo, novo])).toEqual([novo]);
  });

  it('borda — todos os ids já existiam antes (nunca deveria acontecer numa rolagem de verdade): devolve tudo em vez de vazio', () => {
    const resultados = [grupo('g1', 15), grupo('g2', 3)];
    const idsAntes = new Set(['g1', 'g2']);
    expect(gruposNovos(idsAntes, resultados)).toEqual(resultados);
  });
});

describe('agruparDadosPorLados / distribuirPorLados', () => {
  it('agrupa por tipo de dado na ordem da primeira aparição', () => {
    expect(agruparDadosPorLados([8, 8, 6])).toEqual([
      { sides: 8, qty: 2 },
      { sides: 6, qty: 1 },
    ]);
  });

  it('caso de borda: lista vazia não gera grupo', () => {
    expect(agruparDadosPorLados([])).toEqual([]);
  });

  it('devolve os resultados na ordem original, mesmo com tipos misturados', () => {
    const pools = new Map<number, string[]>([
      [8, ['a', 'b']],
      [6, ['c']],
    ]);
    expect(distribuirPorLados([8, 6, 8], pools)).toEqual(['a', 'c', 'b']);
  });

  it('pool curto vira undefined na posição que faltou', () => {
    expect(distribuirPorLados([8, 8], new Map([[8, ['a']]]))).toEqual(['a', undefined]);
  });
});
