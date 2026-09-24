import { describe, it, expect } from 'vitest';
import { magiasElegiveisAssinatura, circuloGratisAssinatura } from './assinaturaMagica';
import { magias } from '../data/rulesets/dnd2024/magias';

describe('magiasElegiveisAssinatura', () => {
  it('livro com magias de 3º círculo — filtra só essas', () => {
    const circulo3 = magias.find((m) => m.classes.includes('Mago') && m.circulo === 3)!;
    const circulo1 = magias.find((m) => m.classes.includes('Mago') && m.circulo === 1)!;
    expect(magiasElegiveisAssinatura([circulo3, circulo1])).toEqual([circulo3]);
  });

  it('livro vazio — retorna vazio', () => {
    expect(magiasElegiveisAssinatura([])).toEqual([]);
  });
});

describe('circuloGratisAssinatura', () => {
  const escolhas = ['Bola de Fogo', 'Contramagia'];

  it('magia é uma das 2 escolhas, ainda não gasta — devolve círculo 3', () => {
    expect(circuloGratisAssinatura('Bola de Fogo', escolhas, [])).toBe(3);
  });

  it('magia já foi conjurada de graça neste período — null', () => {
    expect(circuloGratisAssinatura('Bola de Fogo', escolhas, ['Bola de Fogo'])).toBeNull();
  });

  it('magia não é nenhuma das escolhas — null', () => {
    expect(circuloGratisAssinatura('Mísseis Mágicos', escolhas, [])).toBeNull();
  });
});
