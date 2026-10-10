import { describe, expect, it } from 'vitest';
import { montarPersonagemTesteMulticlasse } from './personagemTesteMulticlasse';
import { construirCatalogoLoja } from './loja';
import { itensMagicos } from '../data/rulesets/dnd2024/itensMagicos';

describe('Char Multiclasse — mochila com 1 de cada item do jogo', () => {
  const itens = montarPersonagemTesteMulticlasse().itensMochilaAtual ?? [];
  const nomes = itens.map((i) => i.nome);

  it('não repete nome de item', () => {
    expect(new Set(nomes).size).toBe(nomes.length);
  });

  it('tem todo item da Loja (menos os kits) e todo item mágico', () => {
    for (const grupo of construirCatalogoLoja()) {
      if (grupo.id === 'kits') continue;
      for (const item of grupo.itens) expect(nomes).toContain(item.nome);
    }
    for (const magico of itensMagicos) expect(nomes).toContain(magico.nome);
  });

  it('não sintoniza nenhum item mágico', () => {
    expect(itens.some((i) => i.sintonizado)).toBe(false);
  });
});
