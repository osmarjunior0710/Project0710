import { describe, it, expect } from 'vitest';
import { classeProficienteComArma } from './proficienciaArma';
import { classes } from '../data/rulesets/dnd2024/classes';
import { armas } from '../data/rulesets/dnd2024/armas';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

function arma(nome: string) {
  const a = armas.find((a) => a.nome === nome);
  if (!a) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/armas.ts`);
  return a;
}

describe('classeProficienteComArma', () => {
  it('Guerreiro (Simples e Marciais) é proficiente com qualquer arma', () => {
    expect(classeProficienteComArma(classe('Guerreiro'), arma('Espada Longa'))).toBe(true);
    expect(classeProficienteComArma(classe('Guerreiro'), arma('Adaga'))).toBe(true);
  });

  it('Bardo (só Simples, mesmo perfil que o Bruxo vai ter) NÃO é proficiente com arma Marcial', () => {
    expect(classeProficienteComArma(classe('Bardo'), arma('Espada Longa'))).toBe(false);
    expect(classeProficienteComArma(classe('Bardo'), arma('Adaga'))).toBe(true);
  });

  it('borda: classe sem entrada na tabela de proficiência devolve false, nunca assume', () => {
    const semEntrada = { ...classe('Guerreiro'), nome: 'Classe Inexistente' };
    expect(classeProficienteComArma(semEntrada, arma('Adaga'))).toBe(false);
  });

  it('Treinamento com Armas Marciais: Bardo (só Simples) vira proficiente com arma Marcial', () => {
    expect(classeProficienteComArma(classe('Bardo'), arma('Espada Longa'), ['treinamento-com-armas-marciais'])).toBe(
      true,
    );
  });

  it('Treinamento com Armas Marciais não afeta arma Simples nem some sem o talento', () => {
    expect(classeProficienteComArma(classe('Bardo'), arma('Espada Longa'), [])).toBe(false);
    expect(classeProficienteComArma(classe('Bardo'), arma('Adaga'), ['treinamento-com-armas-marciais'])).toBe(true);
  });
});
