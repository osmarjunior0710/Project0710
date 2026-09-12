import { describe, it, expect } from 'vitest';
import { classeProficienteComArmadura, categoriaArmaduraEquipada, armaduraSemTreinamentoEquipada } from './proficienciaArmadura';
import { classes } from '../data/rulesets/dnd2024/classes';
import { armaduras } from '../data/rulesets/dnd2024/armaduras';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

function armadura(nome: string) {
  const a = armaduras.find((a) => a.nome === nome);
  if (!a) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/armaduras.ts`);
  return a;
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

  it('multiclasse: classe extra dá treinamento mesmo se a classe ativa não dá (Mago ativo + Guerreiro extra)', () => {
    expect(classeProficienteComArmadura(classe('Mago'), 'Média', [], ['Guerreiro'])).toBe(true);
    expect(classeProficienteComArmadura(classe('Mago'), 'Escudos', [], ['Guerreiro'])).toBe(true);
  });

  it('multiclasse: classe extra que só dá Leve (Bruxo) não dá Média/Escudos', () => {
    expect(classeProficienteComArmadura(classe('Mago'), 'Leve', [], ['Bruxo'])).toBe(true);
    expect(classeProficienteComArmadura(classe('Mago'), 'Média', [], ['Bruxo'])).toBe(false);
  });
});

describe('categoriaArmaduraEquipada', () => {
  it('reconhece Leve/Média/Pesada pelo prefixo da categoria', () => {
    expect(categoriaArmaduraEquipada(armadura('Couro Batido'))).toBe('Leve');
    expect(categoriaArmaduraEquipada(armadura('Gibão de Peles'))).toBe('Média');
    expect(categoriaArmaduraEquipada(armadura('Cota de Malha'))).toBe('Pesada');
  });

  it('sem armadura (undefined): null', () => {
    expect(categoriaArmaduraEquipada(undefined)).toBe(null);
  });
});

describe('armaduraSemTreinamentoEquipada', () => {
  it('Bardo com Cota de Malha (Pesada, sem treinamento): true', () => {
    expect(armaduraSemTreinamentoEquipada(classe('Bardo'), armadura('Cota de Malha'))).toBe(true);
  });

  it('Bardo com Couro Batido (Leve, com treinamento): false', () => {
    expect(armaduraSemTreinamentoEquipada(classe('Bardo'), armadura('Couro Batido'))).toBe(false);
  });

  it('Bardo + Especialista em Armaduras Pesadas com Cota de Malha: false (talento cobre)', () => {
    expect(
      armaduraSemTreinamentoEquipada(classe('Bardo'), armadura('Cota de Malha'), ['especialista-em-armaduras-pesadas']),
    ).toBe(false);
  });

  it('sem armadura equipada: false, mesmo sem nenhuma proficiência', () => {
    expect(armaduraSemTreinamentoEquipada(classe('Bardo'), undefined)).toBe(false);
  });

  it('sem classe (ex.: resumo do wizard antes de terminar): false, nunca assume', () => {
    expect(armaduraSemTreinamentoEquipada(null, armadura('Cota de Malha'))).toBe(false);
  });
});
