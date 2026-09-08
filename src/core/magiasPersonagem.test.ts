import { describe, it, expect } from 'vitest';
import { espacosDeMagiaAtivos, magiasDisponiveisParaPreparar, poolDescobertasMagicas, cdConjuracao, modAcertoConjuracao } from './magiasPersonagem';
import { classes } from '../data/rulesets/dnd2024/classes';
import { criarSelecaoInicial } from './personagem';

const bardo = classes.find((c) => c.nome === 'Bardo');
if (!bardo) throw new Error('Fixture "Bardo" não encontrada em data/rulesets/dnd2024/classes.ts');
const bruxo = classes.find((c) => c.nome === 'Bruxo');
if (!bruxo) throw new Error('Fixture "Bruxo" não encontrada em data/rulesets/dnd2024/classes.ts');
const mago = classes.find((c) => c.nome === 'Mago');
if (!mago) throw new Error('Fixture "Mago" não encontrada em data/rulesets/dnd2024/classes.ts');

describe('espacosDeMagiaAtivos', () => {
  it('Bardo (1 recurso por círculo): nível 3 tem 1º E 2º círculo simultâneos', () => {
    const espacos = espacosDeMagiaAtivos(bardo, 3);
    expect(espacos.map((e) => e.circulo)).toEqual([1, 2]);
    expect(espacos.every((e) => !e.recuperaNoDescansoCurto)).toBe(true);
  });

  it('Bruxo (pool único): sempre devolve 1 item só, com o círculo do espaço do nível — nível 5 = 3º círculo', () => {
    const espacos = espacosDeMagiaAtivos(bruxo, 5);
    expect(espacos).toHaveLength(1);
    expect(espacos[0]).toMatchObject({ circulo: 3, maximo: 2, recuperaNoDescansoCurto: true });
  });

  it('borda: nível fora da tabela / classe null devolve array vazio, nunca quebra', () => {
    expect(espacosDeMagiaAtivos(null, 5)).toEqual([]);
    expect(espacosDeMagiaAtivos(bruxo, 999)).toEqual([]);
  });
});

describe('magiasDisponiveisParaPreparar', () => {
  it('antes do nível 10 (sem Segredos Mágicos): só magias da própria classe', () => {
    const pool = magiasDisponiveisParaPreparar(bardo, 9);
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((m) => m.classes.includes('Bardo'))).toBe(true);
  });

  it('a partir do nível 10 (Segredos Mágicos): pool cresce com Clérigo/Druida/Mago, sem duplicar magia', () => {
    const poolAntes = magiasDisponiveisParaPreparar(bardo, 9);
    const poolDepois = magiasDisponiveisParaPreparar(bardo, 10);
    expect(poolDepois.length).toBeGreaterThan(poolAntes.length);
    expect(poolDepois.some((m) => !m.classes.includes('Bardo'))).toBe(true);
    const ids = poolDepois.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('poolDescobertasMagicas', () => {
  it('circuloMaximo 0 (só truque disponível): traz truques de Clérigo/Druida/Mago, nenhuma magia de círculo', () => {
    const pool = poolDescobertasMagicas(0);
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((m) => m.circulo === 0)).toBe(true);
    const classesPermitidas = ['Clérigo', 'Druida', 'Mago'];
    expect(pool.every((m) => m.classes.some((c) => classesPermitidas.includes(c)))).toBe(true);
  });

  it('circuloMaximo maior: inclui magias de círculo até o limite, sem duplicar, sem passar do limite', () => {
    const pool = poolDescobertasMagicas(3);
    expect(pool.some((m) => m.circulo > 0)).toBe(true);
    expect(pool.every((m) => m.circulo <= 3)).toBe(true);
    const ids = pool.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('modAcertoConjuracao', () => {
  it('Mago (Inteligência): mod. de INT + Bônus de Proficiência do nível', () => {
    const selecao = { ...criarSelecaoInicial(), atributos: { ...criarSelecaoInicial().atributos, INT: 16 } };
    // INT 16 = +3; nível 1 Mago = Bônus de Proficiência +2 → total +5.
    expect(modAcertoConjuracao(selecao, mago, 1)).toBe(5);
  });

  it('Bruxo (Carisma, atributo já mapeado antes do Mago): continua funcionando', () => {
    const selecao = { ...criarSelecaoInicial(), atributos: { ...criarSelecaoInicial().atributos, CAR: 14 } };
    // CAR 14 = +2; nível 1 Bruxo = Bônus de Proficiência +2 → total +4.
    expect(modAcertoConjuracao(selecao, bruxo, 1)).toBe(4);
  });

  it('borda: classe null, ou atributo primário sem mapeamento (Guerreiro), devolve null', () => {
    const selecao = criarSelecaoInicial();
    expect(modAcertoConjuracao(selecao, null, 1)).toBeNull();
    const guerreiro = classes.find((c) => c.nome === 'Guerreiro');
    if (!guerreiro) throw new Error('Fixture "Guerreiro" não encontrada em data/rulesets/dnd2024/classes.ts');
    expect(modAcertoConjuracao(selecao, guerreiro, 1)).toBeNull();
  });
});

describe('cdConjuracao', () => {
  it('CD = 8 + bônus de acerto de conjuração', () => {
    expect(cdConjuracao(5)).toBe(13);
  });

  it('mod negativo/zero: CD ainda soma normal (sem mínimo especial)', () => {
    expect(cdConjuracao(0)).toBe(8);
  });
});
