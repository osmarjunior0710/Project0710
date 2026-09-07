import { describe, it, expect } from 'vitest';
import { classeProficienteComArmadura } from './proficienciaArmadura';
import { classes } from '../data/rulesets/dnd2024/classes';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

describe('classeProficienteComArmadura', () => {
  it('Guerreiro (Leve, Média e Pesada, Escudos) é proficiente com tudo', () => {
    expect(classeProficienteComArmadura(classe('Guerreiro'), 'Leve')).toBe(true);
    expect(classeProficienteComArmadura(classe('Guerreiro'), 'Média')).toBe(true);
    expect(classeProficienteComArmadura(classe('Guerreiro'), 'Pesada')).toBe(true);
    expect(classeProficienteComArmadura(classe('Guerreiro'), 'Escudos')).toBe(true);
  });

  it('Bardo (só Armadura Leve) não é proficiente com Média/Pesada/Escudos', () => {
    expect(classeProficienteComArmadura(classe('Bardo'), 'Leve')).toBe(true);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Média')).toBe(false);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Pesada')).toBe(false);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Escudos')).toBe(false);
  });

  it('Especialista em Armaduras Leves concede Leve E Escudos juntos', () => {
    expect(classeProficienteComArmadura(classe('Bardo'), 'Escudos', ['especialista-em-armaduras-leves'])).toBe(true);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Média', ['especialista-em-armaduras-leves'])).toBe(false);
  });

  it('2 talentos diferentes somam categorias (Médias + Pesadas no mesmo personagem)', () => {
    const t = ['especialista-em-armaduras-medias', 'especialista-em-armaduras-pesadas'];
    expect(classeProficienteComArmadura(classe('Bardo'), 'Média', t)).toBe(true);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Pesada', t)).toBe(true);
    expect(classeProficienteComArmadura(classe('Bardo'), 'Escudos', t)).toBe(false);
  });
});
