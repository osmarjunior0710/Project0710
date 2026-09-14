import { describe, expect, it } from 'vitest';
import { gruposNovos } from './diceBox3d';
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
