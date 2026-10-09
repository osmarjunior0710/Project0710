import { describe, expect, it } from 'vitest';
import {
  formulaDanoExplosaoElemental,
  metadeDoDanoDaExplosao,
  podeUsarExplosaoElemental,
  temExplosaoElemental,
} from './explosaoElemental';

describe('Explosão Elemental', () => {
  it('só Monge nível 6+ da subclasse Combatente dos Elementos', () => {
    expect(temExplosaoElemental(6, 'Combatente dos Elementos')).toBe(true);
    expect(temExplosaoElemental(5, 'Combatente dos Elementos')).toBe(false);
    expect(temExplosaoElemental(20, 'Combatente das Sombras')).toBe(false);
  });
  it('usar custa 2 Pontos de Foco', () => {
    expect(podeUsarExplosaoElemental(6, 'Combatente dos Elementos', 2)).toBe(true);
    expect(podeUsarExplosaoElemental(6, 'Combatente dos Elementos', 1)).toBe(false);
  });
  it('dano = 3 dados de Artes Marciais; sucesso = metade arredondada pra baixo', () => {
    expect(formulaDanoExplosaoElemental(8)).toBe('3d8');
    expect(formulaDanoExplosaoElemental(12)).toBe('3d12');
    expect(metadeDoDanoDaExplosao(17)).toBe(8);
    expect(metadeDoDanoDaExplosao(3)).toBe(1);
  });
});
