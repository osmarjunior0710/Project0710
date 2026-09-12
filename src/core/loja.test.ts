import { describe, it, expect } from 'vitest';
import {
  parseCustoPO,
  formatarPO,
  calcularCustoCarrinho,
  calcularModAtaque,
  classeEhProficiente,
  construirCatalogoLoja,
  type GrupoLoja,
  type LojaItem,
} from './loja';
import { criarSelecaoInicial, type WizardSelection } from './personagem';

function selecao(overrides: Partial<WizardSelection> = {}): WizardSelection {
  return { ...criarSelecaoInicial(), ...overrides };
}

describe('parseCustoPO', () => {
  it('lê valor simples em PO/PP/PC e converte tudo pra PO', () => {
    expect(parseCustoPO('20 PO')).toBe(20);
    expect(parseCustoPO('5 PP')).toBe(0.5);
    expect(parseCustoPO('50 PC')).toBe(0.5);
  });

  it('lê separador de milhar (ponto) e vírgula decimal, formato brasileiro', () => {
    expect(parseCustoPO('1.000 PO')).toBe(1000);
    expect(parseCustoPO('1,6 PO')).toBe(1.6);
  });

  it('borda: texto não reconhecido ("Varia", "—", null/undefined) devolve null, não 0', () => {
    expect(parseCustoPO('Varia')).toBeNull();
    expect(parseCustoPO('—')).toBeNull();
    expect(parseCustoPO(null)).toBeNull();
    expect(parseCustoPO(undefined)).toBeNull();
  });
});

describe('formatarPO', () => {
  it('formata com no máx. 2 casas decimais, separador brasileiro', () => {
    expect(formatarPO(20)).toBe('20 PO');
    expect(formatarPO(1.5)).toBe('1,5 PO');
  });

  it('borda: arredonda pra 2 casas em vez de mostrar dízima', () => {
    expect(formatarPO(1 / 3)).toBe('0,33 PO');
  });
});

describe('calcularCustoCarrinho', () => {
  const catalogo: GrupoLoja[] = [
    {
      id: 'armas-simples-cac',
      titulo: 'Armas Simples — Corpo a Corpo',
      itens: [{ nome: 'Adaga', grupo: 'armas-simples-cac', custoTexto: '2 PO', custoPO: 2, peso: '0,5 kg' } as LojaItem],
    },
  ];

  it('soma preço × quantidade de cada item do carrinho achado no catálogo', () => {
    expect(calcularCustoCarrinho([{ nome: 'Adaga', quantidade: 3 }], catalogo)).toBe(6);
  });

  it('borda: item do carrinho que não existe no catálogo não soma nada (nem quebra)', () => {
    expect(calcularCustoCarrinho([{ nome: 'Item Fantasma', quantidade: 5 }], catalogo)).toBe(0);
  });

  it('borda: carrinho vazio soma 0', () => {
    expect(calcularCustoCarrinho([], catalogo)).toBe(0);
  });
});

describe('calcularModAtaque', () => {
  const catalogo = construirCatalogoLoja();
  const itemEspadaLonga = catalogo.flatMap((g) => g.itens).find((i) => i.nome === 'Espada Longa')!;
  const espadaLonga = { grupo: itemEspadaLonga.grupo, propriedades: itemEspadaLonga.propriedades ?? '' };

  it('borda: atributos ainda não rolados (criação em andamento) devolve null', () => {
    expect(calcularModAtaque(criarSelecaoInicial(), espadaLonga)).toBeNull();
  });

  it('Guerreiro com Força 16 e proficiência Marcial: mod +3 + bônus de proficiência +2 = +5', () => {
    const s = selecao({ classe: 'Guerreiro', atributos: { FOR: 16, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 } });
    const r = calcularModAtaque(s, espadaLonga);
    expect(r).toEqual({ mod: 5, proficiente: true });
  });

  it('classe sem proficiência na categoria da arma não soma bônus de proficiência', () => {
    const s = selecao({ classe: 'Mago', atributos: { FOR: 16, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 } });
    const r = calcularModAtaque(s, espadaLonga);
    expect(r).toEqual({ mod: 3, proficiente: false });
  });
});

describe('classeEhProficiente', () => {
  const catalogo = construirCatalogoLoja();
  const espadaLonga = catalogo.flatMap((g) => g.itens).find((i) => i.nome === 'Espada Longa')!;

  it('Guerreiro (Simples e Marciais) é proficiente com arma Marcial', () => {
    expect(classeEhProficiente(selecao({ classe: 'Guerreiro' }), espadaLonga)).toBe(true);
  });

  it('Bardo (só Simples) não é proficiente com arma Marcial', () => {
    expect(classeEhProficiente(selecao({ classe: 'Bardo' }), espadaLonga)).toBe(false);
  });

  it('borda: sem classe escolhida ainda, assume true (não bloqueia filtro antes da hora)', () => {
    expect(classeEhProficiente(criarSelecaoInicial(), espadaLonga)).toBe(true);
  });
});
