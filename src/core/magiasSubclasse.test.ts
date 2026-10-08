import { describe, expect, it } from 'vitest';
import { truquesConcedidosPorSubclasse } from './magiasSubclasse';

describe('truquesConcedidosPorSubclasse', () => {
  it('Monge nível 3 de Combatente dos Elementos conhece Elementalismo', () => {
    expect(truquesConcedidosPorSubclasse([{ classe: 'Monge', nivel: 3, subclasse: 'Combatente dos Elementos' }])).toEqual([
      { nomeMagia: 'Elementalismo', classe: 'Monge' },
    ]);
  });
  it('borda: sem subclasse escolhida, de outra subclasse ou abaixo do nível 3, não concede nada', () => {
    expect(truquesConcedidosPorSubclasse([{ classe: 'Monge', nivel: 5, subclasse: null }])).toEqual([]);
    expect(truquesConcedidosPorSubclasse([{ classe: 'Monge', nivel: 5, subclasse: 'Combatente da Mão Espalmada' }])).toEqual([]);
    expect(truquesConcedidosPorSubclasse([{ classe: 'Monge', nivel: 2, subclasse: 'Combatente dos Elementos' }])).toEqual([]);
  });
  it('multiclasse: não duplica e só olha a subclasse da classe certa', () => {
    const r = truquesConcedidosPorSubclasse([
      { classe: 'Mago', nivel: 20, subclasse: 'Evocador' },
      { classe: 'Monge', nivel: 20, subclasse: 'Combatente dos Elementos' },
    ]);
    expect(r).toEqual([{ nomeMagia: 'Elementalismo', classe: 'Monge' }]);
  });
});
