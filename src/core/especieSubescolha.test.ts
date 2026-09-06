import { describe, it, expect } from 'vitest';
import { tipoDanoSubescolha, descricaoTracoResolvida } from './especieSubescolha';
import { especies } from '../data/rulesets/dnd2024/especies';
import { criarSelecaoInicial } from './personagem';

const draconato = especies.find((e) => e.id === 'draconato');
if (!draconato) throw new Error('Fixture "Draconato" não encontrada em data/rulesets/dnd2024/especies.ts');
const golias = especies.find((e) => e.id === 'golias');
if (!golias) throw new Error('Fixture "Golias" não encontrada em data/rulesets/dnd2024/especies.ts');

describe('tipoDanoSubescolha', () => {
  it('resolve o tipo de dano da cor de dragão escolhida', () => {
    const s = { ...criarSelecaoInicial(), subescolhaEspecieEscolhida: 'Vermelho' };
    expect(tipoDanoSubescolha(draconato, s)).toBe('Ígneo');
  });

  it('retorna null quando a sub-escolha ainda não foi feita', () => {
    expect(tipoDanoSubescolha(draconato, criarSelecaoInicial())).toBeNull();
  });
});

describe('descricaoTracoResolvida', () => {
  it('usaTipoDanoDaSubescolha: acrescenta o tipo de dano ao texto original, sem alterá-lo', () => {
    const ataqueDeSopro = draconato.traços.find((t) => t.nome === 'Ataque de Sopro');
    if (!ataqueDeSopro) throw new Error('Traço "Ataque de Sopro" não encontrado');
    const s = { ...criarSelecaoInicial(), subescolhaEspecieEscolhida: 'Verde' };
    const resultado = descricaoTracoResolvida(ataqueDeSopro, draconato, s);
    expect(resultado.startsWith(ataqueDeSopro.descricao)).toBe(true);
    expect(resultado).toContain('Tipo de dano: Venenoso');
  });

  it('usaDescricaoEfeitoDaSubescolha: acrescenta o benefício escolhido ao texto original', () => {
    const ancestralidade = golias.traços.find((t) => t.nome === 'Ancestralidade Gigante');
    if (!ancestralidade) throw new Error('Traço "Ancestralidade Gigante" não encontrado');
    const s = { ...criarSelecaoInicial(), subescolhaEspecieEscolhida: 'Salto da Nuvem (Gigante das Nuvens)' };
    const resultado = descricaoTracoResolvida(ancestralidade, golias, s);
    expect(resultado.startsWith(ancestralidade.descricao)).toBe(true);
    expect(resultado).toContain('teleporta magicamente até 9 metros');
  });

  it('sem sub-escolha feita, retorna o texto original sem complemento', () => {
    const ataqueDeSopro = draconato.traços.find((t) => t.nome === 'Ataque de Sopro');
    if (!ataqueDeSopro) throw new Error('Traço "Ataque de Sopro" não encontrado');
    expect(descricaoTracoResolvida(ataqueDeSopro, draconato, criarSelecaoInicial())).toBe(ataqueDeSopro.descricao);
  });

  it('traço sem flag nenhuma retorna o texto original', () => {
    const visao = draconato.traços.find((t) => t.nome === 'Visão no Escuro');
    if (!visao) throw new Error('Traço "Visão no Escuro" não encontrado');
    const s = { ...criarSelecaoInicial(), subescolhaEspecieEscolhida: 'Verde' };
    expect(descricaoTracoResolvida(visao, draconato, s)).toBe(visao.descricao);
  });
});
