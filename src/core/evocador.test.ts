import { describe, it, expect } from 'vitest';
import { magiasVersadoEmEvocacaoNesteNivel, catalogoVersadoEmEvocacao } from './evocador';
import { classes } from '../data/rulesets/dnd2024/classes';

const mago = classes.find((c) => c.nome === 'Mago')!;

describe('magiasVersadoEmEvocacaoNesteNivel', () => {
  it('caso normal — ao atingir o nível 3 (escolha da subclasse), concede 2', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 2, 3)).toBe(2);
  });

  it('caso de borda — nível abaixo de 3 nunca concede nada (subclasse ainda não existe)', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 1, 2)).toBe(0);
  });

  it('concede +1 quando o level-up desbloqueia um círculo de magia novo (ex: nível 5, 3º círculo)', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 4, 5)).toBe(1);
  });

  it('não concede nada num level-up que não desbloqueia círculo novo', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 5, 6)).toBe(0);
  });
});

describe('catalogoVersadoEmEvocacao', () => {
  it('caso normal — só magias de Evocação de Mago, círculo 1+ até o máximo', () => {
    const catalogo = catalogoVersadoEmEvocacao(2);
    expect(catalogo.length).toBeGreaterThan(0);
    expect(catalogo.every((m) => m.escola === 'Evocação' && m.classes.includes('Mago') && m.circulo >= 1 && m.circulo <= 2)).toBe(
      true,
    );
  });

  it('caso de borda — círculo máximo 0 não inclui nenhuma magia', () => {
    expect(catalogoVersadoEmEvocacao(0)).toEqual([]);
  });
});
