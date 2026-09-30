import { describe, it, expect } from 'vitest';
import { magiasFixasDaClasseBase, circuloGratisMagiaFixaDeClasse } from './magiasFixasDeClasse';
import { classes } from '../data/rulesets/dnd2024/classes';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

describe('magiasFixasDaClasseBase', () => {
  it('Paladino nível 1: ainda não bateu Destruição do Paladino (nível 2)', () => {
    expect(magiasFixasDaClasseBase(classe('Paladino'), 1)).toEqual([]);
  });

  it('Paladino nível 2: Destruição Divina, 1 uso grátis por Descanso Longo', () => {
    expect(magiasFixasDaClasseBase(classe('Paladino'), 2)).toEqual([
      { nomeMagia: 'Destruição Divina', usosGratisPorDescansoLongo: 1 },
    ]);
  });

  it('Paladino nível 5: soma Convocar Montaria (Montaria Fiel) além de Destruição Divina', () => {
    const r = magiasFixasDaClasseBase(classe('Paladino'), 5);
    expect(r).toEqual([
      { nomeMagia: 'Destruição Divina', usosGratisPorDescansoLongo: 1 },
      { nomeMagia: 'Convocar Montaria', usosGratisPorDescansoLongo: 1 },
    ]);
  });

  it('borda: classe sem nenhuma magia fixa devolve []', () => {
    expect(magiasFixasDaClasseBase(classe('Guerreiro'), 20)).toEqual([]);
  });

  it('borda: classe null devolve []', () => {
    expect(magiasFixasDaClasseBase(null, 10)).toEqual([]);
  });
});

describe('circuloGratisMagiaFixaDeClasse', () => {
  const atuais = [{ nomeMagia: 'Destruição Divina', usosGratisPorDescansoLongo: 1 }];

  it('ainda tem uso grátis: devolve o círculo BASE da magia (nunca upcast)', () => {
    expect(circuloGratisMagiaFixaDeClasse('Destruição Divina', 1, atuais, {})).toBe(1);
  });

  it('já gastou o único uso grátis: null', () => {
    expect(circuloGratisMagiaFixaDeClasse('Destruição Divina', 1, atuais, { 'Destruição Divina': 1 })).toBeNull();
  });

  it('magia que não é fixa de classe: null', () => {
    expect(circuloGratisMagiaFixaDeClasse('Bola de Fogo', 3, atuais, {})).toBeNull();
  });
});
