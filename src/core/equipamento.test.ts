import { describe, it, expect } from 'vitest';
import {
  identificarEquipamento,
  slotsValidos,
  resumoEquipado,
  equiparNoSlot,
  desequiparItem,
  alternarDuasMaosVersatil,
  categoriaMochila,
} from './equipamento';
import type { ItemMochila } from './mochila';

function item(id: string, nome: string, overrides: Partial<ItemMochila> = {}): ItemMochila {
  return { id, nome, quantidade: 1, peso: null, origemDoItem: 'Manual', ...overrides };
}

describe('identificarEquipamento', () => {
  it('arma comum (Adaga) — tipo arma, sem Duas Mãos, sem Versátil', () => {
    expect(identificarEquipamento('Adaga')).toEqual({ tipo: 'arma', duasMaos: false, dadoVersatil: null });
  });

  it('arma Versátil (Cajado) — extrai o dado maior da propriedade', () => {
    expect(identificarEquipamento('Cajado')).toEqual({ tipo: 'arma', duasMaos: false, dadoVersatil: '1d8' });
  });

  it('arma Duas Mãos (Clava Grande) — duasMaos true, sem Versátil', () => {
    expect(identificarEquipamento('Clava Grande')).toEqual({ tipo: 'arma', duasMaos: true, dadoVersatil: null });
  });

  it('armadura (Couro Batido) — tipo armadura', () => {
    expect(identificarEquipamento('Couro Batido').tipo).toBe('armadura');
  });

  it('escudo — tipo escudo, não armadura', () => {
    expect(identificarEquipamento('Escudo').tipo).toBe('escudo');
  });

  it('borda: nome que não bate com nenhum catálogo (comida, item mágico ainda não importado) vira genérico', () => {
    expect(identificarEquipamento('Item Que Não Existe Em Lugar Nenhum')).toEqual({
      tipo: 'generico',
      duasMaos: false,
      dadoVersatil: null,
    });
  });
});

describe('slotsValidos', () => {
  it('arma normal oferece Mão Principal e Mão Secundária', () => {
    expect(slotsValidos({ tipo: 'arma', duasMaos: false, dadoVersatil: null })).toEqual(['maoPrincipal', 'maoSecundaria']);
  });

  it('arma de Duas Mãos só oferece Mão Principal', () => {
    expect(slotsValidos({ tipo: 'arma', duasMaos: true, dadoVersatil: null })).toEqual(['maoPrincipal']);
  });

  it('armadura/escudo/genérico: só o slot próprio ou nenhum', () => {
    expect(slotsValidos({ tipo: 'armadura', duasMaos: false, dadoVersatil: null })).toEqual(['armadura']);
    expect(slotsValidos({ tipo: 'escudo', duasMaos: false, dadoVersatil: null })).toEqual(['escudo']);
    expect(slotsValidos({ tipo: 'generico', duasMaos: false, dadoVersatil: null })).toEqual([]);
  });
});

describe('resumoEquipado', () => {
  it('acha cada item pelo slot ocupado', () => {
    const itens = [
      item('1', 'Espada Longa', { slot: 'maoPrincipal' }),
      item('2', 'Couro Batido', { slot: 'armadura' }),
    ];
    const r = resumoEquipado(itens);
    expect(r.maoPrincipal?.id).toBe('1');
    expect(r.armadura?.id).toBe('2');
    expect(r.maoSecundaria).toBeNull();
    expect(r.escudo).toBeNull();
  });

  it('borda: arma de Duas Mãos na Mão Principal marca maoSecundariaOcupadaPorDuasMaos', () => {
    const itens = [item('1', 'Clava Grande', { slot: 'maoPrincipal' })];
    expect(resumoEquipado(itens).maoSecundariaOcupadaPorDuasMaos).toBe(true);
  });

  it('borda: nada equipado devolve tudo null/false', () => {
    const r = resumoEquipado([item('1', 'Adaga')]);
    expect(r).toEqual({
      maoPrincipal: null,
      maoSecundaria: null,
      maoSecundariaOcupadaPorDuasMaos: false,
      armadura: null,
      escudo: null,
    });
  });
});

describe('equiparNoSlot', () => {
  it('equipa o item no slot pedido', () => {
    const itens = [item('1', 'Adaga')];
    const r = equiparNoSlot(itens, '1', 'maoPrincipal');
    expect(r.find((i) => i.id === '1')?.slot).toBe('maoPrincipal');
  });

  it('libera quem já ocupava o mesmo slot', () => {
    const itens = [item('1', 'Adaga', { slot: 'maoPrincipal' }), item('2', 'Machadinha')];
    const r = equiparNoSlot(itens, '2', 'maoPrincipal');
    expect(r.find((i) => i.id === '1')?.slot).toBeNull();
    expect(r.find((i) => i.id === '2')?.slot).toBe('maoPrincipal');
  });

  it('borda: arma de Duas Mãos na Mão Principal libera Mão Secundária e Escudo', () => {
    const itens = [
      item('1', 'Adaga', { slot: 'maoSecundaria' }),
      item('2', 'Escudo', { slot: 'escudo' }),
      item('3', 'Clava Grande'),
    ];
    const r = equiparNoSlot(itens, '3', 'maoPrincipal');
    expect(r.find((i) => i.id === '1')?.slot).toBeNull();
    expect(r.find((i) => i.id === '2')?.slot).toBeNull();
    expect(r.find((i) => i.id === '3')?.slot).toBe('maoPrincipal');
  });

  it('borda: Escudo e arma na Mão Secundária se excluem (mesma mão)', () => {
    const itens = [item('1', 'Adaga', { slot: 'maoSecundaria' }), item('2', 'Escudo')];
    const r = equiparNoSlot(itens, '2', 'escudo');
    expect(r.find((i) => i.id === '1')?.slot).toBeNull();
    expect(r.find((i) => i.id === '2')?.slot).toBe('escudo');
  });

  it('borda: id que não existe na lista devolve a lista intacta', () => {
    const itens = [item('1', 'Adaga')];
    expect(equiparNoSlot(itens, 'fantasma', 'maoPrincipal')).toEqual(itens);
  });
});

describe('desequiparItem', () => {
  it('limpa o slot e desliga duasMaosAtivo', () => {
    const itens = [item('1', 'Cajado', { slot: 'maoPrincipal', duasMaosAtivo: true })];
    const r = desequiparItem(itens, '1');
    expect(r[0].slot).toBeNull();
    expect(r[0].duasMaosAtivo).toBe(false);
  });
});

describe('alternarDuasMaosVersatil', () => {
  it('liga o modo Duas Mãos numa arma Versátil equipada na Mão Principal', () => {
    const itens = [item('1', 'Cajado', { slot: 'maoPrincipal' })];
    const r = alternarDuasMaosVersatil(itens, '1');
    expect(r.find((i) => i.id === '1')?.duasMaosAtivo).toBe(true);
  });

  it('ao ligar, libera Mão Secundária e Escudo', () => {
    const itens = [item('1', 'Cajado', { slot: 'maoPrincipal' }), item('2', 'Escudo', { slot: 'escudo' })];
    const r = alternarDuasMaosVersatil(itens, '1');
    expect(r.find((i) => i.id === '2')?.slot).toBeNull();
  });

  it('borda: arma não Versátil não liga o modo (Adaga)', () => {
    const itens = [item('1', 'Adaga', { slot: 'maoPrincipal' })];
    expect(alternarDuasMaosVersatil(itens, '1')).toEqual(itens);
  });

  it('borda: item não equipado na Mão Principal não liga o modo', () => {
    const itens = [item('1', 'Cajado', { slot: 'maoSecundaria' })];
    expect(alternarDuasMaosVersatil(itens, '1')).toEqual(itens);
  });
});

describe('categoriaMochila', () => {
  it('arma → "arma"; armadura e escudo → "armadura"; resto → "outros"', () => {
    expect(categoriaMochila('Adaga')).toBe('arma');
    expect(categoriaMochila('Couro Batido')).toBe('armadura');
    expect(categoriaMochila('Escudo')).toBe('armadura');
    expect(categoriaMochila('Corda (15m)')).toBe('outros');
  });
});
