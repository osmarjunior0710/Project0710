import { describe, it, expect } from 'vitest';
import { magiasPeritoNecromanciaNesteNivel, catalogoPeritoNecromancia, formasFamiliarMortoVivoElegiveis } from './necromante';
import { classes } from '../data/rulesets/dnd2024/classes';

const mago = classes.find((c) => c.nome === 'Mago')!;

describe('magiasPeritoNecromanciaNesteNivel', () => {
  it('caso normal — ao atingir o nível 3 (escolha da subclasse), concede 2', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 2, 3)).toBe(2);
  });

  it('caso de borda — nível abaixo de 3 nunca concede nada (subclasse ainda não existe)', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 1, 2)).toBe(0);
  });

  it('concede +1 quando o level-up desbloqueia um círculo de magia novo (ex: nível 5, 3º círculo)', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 4, 5)).toBe(1);
  });

  it('não concede nada num level-up que não desbloqueia círculo novo', () => {
    expect(magiasPeritoNecromanciaNesteNivel(mago, 5, 6)).toBe(0);
  });
});

describe('catalogoPeritoNecromancia', () => {
  it('caso normal — só magias de Necromancia de círculo 1+ até o máximo', () => {
    const catalogo = catalogoPeritoNecromancia(2);
    expect(catalogo.length).toBeGreaterThan(0);
    expect(catalogo.every((m) => m.escola === 'Necromancia' && m.circulo >= 1 && m.circulo <= 2)).toBe(true);
  });

  it('caso de borda — círculo máximo 0 não inclui nenhuma magia (só truques ficariam de fora também)', () => {
    expect(catalogoPeritoNecromancia(0)).toEqual([]);
  });
});

describe('formasFamiliarMortoVivoElegiveis', () => {
  it('caso normal — Necromante nível 3+ vê Esqueleto e Zumbi', () => {
    const formas = formasFamiliarMortoVivoElegiveis('Necromante', 3);
    expect(formas.map((c) => c.nome).sort()).toEqual(['Esqueleto', 'Zumbi']);
  });

  it('caso de borda — sem a característica ainda (nível 2, ou outra subclasse) não mostra nada', () => {
    expect(formasFamiliarMortoVivoElegiveis('Necromante', 2)).toEqual([]);
    expect(formasFamiliarMortoVivoElegiveis('Abjurador', 5)).toEqual([]);
    expect(formasFamiliarMortoVivoElegiveis(null, 5)).toEqual([]);
  });
});
