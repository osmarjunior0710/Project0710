import { describe, it, expect } from 'vitest';
import { LIMITE_SINTONIZACAO, itemExigeSintonizacao, contarSintonizados, alternarSintonizacao } from './sintonizacao';
import type { ItemMochila } from './mochila';

function item(id: string, nome: string, sintonizado = false): ItemMochila {
  return { id, nome, quantidade: 1, peso: null, origemDoItem: 'Manual', sintonizado };
}

describe('itemExigeSintonizacao', () => {
  it('item mágico real com requerSintonizacao (Anel de Calor) devolve true', () => {
    expect(itemExigeSintonizacao('Anel de Calor')).toBe(true);
  });

  it('borda: item comum (não é item mágico do catálogo) devolve false', () => {
    expect(itemExigeSintonizacao('Corda (15m)')).toBe(false);
  });

  it('borda: nome vazio/inexistente não quebra, devolve false', () => {
    expect(itemExigeSintonizacao('Item Que Não Existe Em Lugar Nenhum')).toBe(false);
  });
});

describe('contarSintonizados', () => {
  it('conta só os itens com sintonizado=true', () => {
    const itens = [item('1', 'A', true), item('2', 'B', false), item('3', 'C', true)];
    expect(contarSintonizados(itens)).toBe(2);
  });

  it('borda: lista vazia conta 0', () => {
    expect(contarSintonizados([])).toBe(0);
  });
});

describe('alternarSintonizacao', () => {
  it('liga a sintonização de um item desligado', () => {
    const itens = [item('1', 'Anel de Calor', false)];
    const r = alternarSintonizacao(itens, '1');
    expect(r.find((i) => i.id === '1')?.sintonizado).toBe(true);
  });

  it('desliga a sintonização de um item ligado, mesmo no limite', () => {
    const itens = [item('1', 'A', true), item('2', 'B', true), item('3', 'C', true)];
    const r = alternarSintonizacao(itens, '1');
    expect(r.find((i) => i.id === '1')?.sintonizado).toBe(false);
  });

  it(`borda: trava silenciosa ao tentar ligar o ${LIMITE_SINTONIZACAO + 1}º item (limite de ${LIMITE_SINTONIZACAO})`, () => {
    const itens = [item('1', 'A', true), item('2', 'B', true), item('3', 'C', true), item('4', 'D', false)];
    const r = alternarSintonizacao(itens, '4');
    expect(r.find((i) => i.id === '4')?.sintonizado).toBe(false);
    expect(r).toEqual(itens); // devolve a lista intacta, não muda nada
  });

  it('borda: id que não existe na lista devolve a lista intacta, sem erro', () => {
    const itens = [item('1', 'A', false)];
    expect(alternarSintonizacao(itens, 'id-fantasma')).toEqual(itens);
  });
});
