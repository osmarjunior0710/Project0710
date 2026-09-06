import { describe, it, expect } from 'vitest';
import { truquesEspecie, magiasEspecie } from './magiasEspecie';
import { criarSelecaoInicial } from './personagem';

function selecao(especie: string, subescolhaEspecieEscolhida: string | null): ReturnType<typeof criarSelecaoInicial> {
  return { ...criarSelecaoInicial(), especie, subescolhaEspecieEscolhida };
}

describe('truquesEspecie', () => {
  it('resolve o truque conhecido da linhagem escolhida', () => {
    expect(truquesEspecie(selecao('Elfo', 'Drow'))).toEqual(['Luzes Dançantes']);
  });

  it('resolve MAIS de um truque quando a opção concede vários (Gnomo das Rochas)', () => {
    expect(truquesEspecie(selecao('Gnomo', 'Gnomo das Rochas'))).toEqual(['Prestidigitação Arcana', 'Reparar']);
  });

  it('retorna [] sem espécie/sub-escolha compatível', () => {
    expect(truquesEspecie(criarSelecaoInicial())).toEqual([]);
  });

  it('junta o truque fixo da espécie (Taumaturgia) com o da linhagem escolhida (Tiferino)', () => {
    expect(truquesEspecie(selecao('Tiferino', 'Infernal'))).toEqual(['Taumaturgia', 'Raio de Fogo']);
  });

  it('truque fixo aparece mesmo sem sub-escolha escolhida ainda', () => {
    expect(truquesEspecie(selecao('Tiferino', null))).toEqual(['Taumaturgia']);
  });

  it('espécie com truque fixo e SEM linhagem estruturada ainda (Aasimar — Portador da Luz)', () => {
    expect(truquesEspecie(selecao('Aasimar', null))).toEqual(['Luz']);
  });
});

describe('magiasEspecie', () => {
  it('nível 1-2: nenhuma magia ainda (Elfo — sem magia de nível 1)', () => {
    expect(magiasEspecie(selecao('Elfo', 'Alto Elfo'), 1)).toEqual([]);
    expect(magiasEspecie(selecao('Elfo', 'Alto Elfo'), 2)).toEqual([]);
  });

  it('nível 3: desbloqueia a magia de nível 3', () => {
    expect(magiasEspecie(selecao('Elfo', 'Alto Elfo'), 3)).toEqual(['Detectar Magia']);
  });

  it('nível 5+: acumula a de nível 3 e a de nível 5', () => {
    expect(magiasEspecie(selecao('Elfo', 'Alto Elfo'), 5)).toEqual(['Detectar Magia', 'Passo Nebuloso']);
    expect(magiasEspecie(selecao('Elfo', 'Alto Elfo'), 20)).toEqual(['Detectar Magia', 'Passo Nebuloso']);
  });

  it('sem sub-escolha escolhida ainda, retorna vazio mesmo em nível alto', () => {
    expect(magiasEspecie(selecao('Elfo', null), 5)).toEqual([]);
  });

  it('magia de nível 1 (Gnomo do Bosque — Falar com Animais) já disponível desde a criação', () => {
    expect(magiasEspecie(selecao('Gnomo', 'Gnomo do Bosque'), 1)).toEqual(['Falar com Animais - Traço de Gnomo']);
  });

  it('Gnomo das Rochas não tem magia de nível 1/3/5, só os truques', () => {
    expect(magiasEspecie(selecao('Gnomo', 'Gnomo das Rochas'), 5)).toEqual([]);
  });
});
