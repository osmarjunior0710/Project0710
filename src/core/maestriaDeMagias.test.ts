import { describe, it, expect } from 'vitest';
import { magiasElegiveisMaestria, circuloGratisMaestria } from './maestriaDeMagias';
import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';

describe('magiasElegiveisMaestria', () => {
  it('círculo 1 — só as com tempo de conjuração de Ação', () => {
    const misseisMagicos = magiasDaClasse('Mago').find((m) => m.nome === 'Mísseis Mágicos')!; // Ação
    const alarme = magiasDaClasse('Mago').find((m) => m.nome === 'Alarme')!; // 1 minuto ou Ritual
    const livro = [misseisMagicos, alarme];

    expect(magiasElegiveisMaestria(livro, 1)).toEqual([misseisMagicos]);
  });

  it('livro vazio — retorna vazio', () => {
    expect(magiasElegiveisMaestria([], 2)).toEqual([]);
  });
});

describe('circuloGratisMaestria', () => {
  it('magia é uma das 2 escolhas — devolve o círculo dela', () => {
    const escolhas = { 1: 'Mísseis Mágicos', 2: 'Flecha Ácida de Melf' };
    expect(circuloGratisMaestria('Mísseis Mágicos', escolhas)).toBe(1);
    expect(circuloGratisMaestria('Flecha Ácida de Melf', escolhas)).toBe(2);
  });

  it('magia não é nenhuma das escolhas — null', () => {
    expect(circuloGratisMaestria('Alarme', { 1: 'Mísseis Mágicos', 2: 'Flecha Ácida de Melf' })).toBeNull();
  });
});
