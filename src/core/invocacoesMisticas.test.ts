import { describe, it, expect } from 'vitest';
import {
  invocacoesElegiveisAteNivel,
  invocacaoRequeridaDe,
  invocacaoBloqueadaPorRequisitoAusente,
  invocacoesQueDependemDe,
  invocacaoTemPlaceholder,
  bonusExplosaoAgonizante,
} from './invocacoesMisticas';
import { invocacoesMisticas } from '../data/rulesets/dnd2024/invocacoesMisticas';

const laminaSedenta = invocacoesMisticas.find((i) => i.id === 'lamina-sedenta')!;
const laminaDevoradora = invocacoesMisticas.find((i) => i.id === 'lamina-devoradora')!;
const pactoDaLamina = invocacoesMisticas.find((i) => i.id === 'pacto-da-lamina')!;

describe('invocacoesElegiveisAteNivel', () => {
  it('nível 1: só as 5 sem pré-requisito de nível', () => {
    const elegiveis = invocacoesElegiveisAteNivel(1);
    expect(elegiveis.map((i) => i.id).sort()).toEqual(
      ['armadura-de-sombras', 'mente-mistica', 'pacto-da-corrente', 'pacto-da-lamina', 'pacto-do-tomo'].sort(),
    );
  });

  it('nível 5: soma as que pedem nível 2 e nível 5, ainda sem as de nível 7+', () => {
    const elegiveis = invocacoesElegiveisAteNivel(5);
    expect(elegiveis.some((i) => i.id === 'explosao-agonizante')).toBe(true); // nível 2
    expect(elegiveis.some((i) => i.id === 'lamina-sedenta')).toBe(true); // nível 5
    expect(elegiveis.some((i) => i.id === 'lamento-das-sepulturas')).toBe(false); // nível 7
  });

  it('borda: nível 0 devolve só as sem pré-requisito nenhum', () => {
    const elegiveis = invocacoesElegiveisAteNivel(0);
    expect(elegiveis.length).toBe(5);
  });
});

describe('invocacaoRequeridaDe', () => {
  it('Lâmina Sedenta exige Pacto da Lâmina', () => {
    expect(invocacaoRequeridaDe(laminaSedenta)?.id).toBe('pacto-da-lamina');
  });

  it('sem requisito: null', () => {
    expect(invocacaoRequeridaDe(pactoDaLamina)).toBeNull();
  });
});

describe('invocacaoBloqueadaPorRequisitoAusente', () => {
  it('Lâmina Sedenta sem Pacto da Lâmina marcado: bloqueada', () => {
    expect(invocacaoBloqueadaPorRequisitoAusente(laminaSedenta, [])).toBe(true);
  });

  it('Lâmina Sedenta com Pacto da Lâmina marcado: liberada', () => {
    expect(invocacaoBloqueadaPorRequisitoAusente(laminaSedenta, ['pacto-da-lamina'])).toBe(false);
  });

  it('Lâmina Devoradora com só Pacto da Lâmina (sem Lâmina Sedenta): ainda bloqueada', () => {
    expect(invocacaoBloqueadaPorRequisitoAusente(laminaDevoradora, ['pacto-da-lamina'])).toBe(true);
  });

  it('sem requisito nenhum: nunca bloqueada', () => {
    expect(invocacaoBloqueadaPorRequisitoAusente(pactoDaLamina, [])).toBe(false);
  });
});

describe('invocacoesQueDependemDe', () => {
  it('Pacto da Lâmina com Lâmina Sedenta marcada: tem 1 dependente (não pode remover)', () => {
    const dependentes = invocacoesQueDependemDe('pacto-da-lamina', ['pacto-da-lamina', 'lamina-sedenta']);
    expect(dependentes.map((i) => i.id)).toEqual(['lamina-sedenta']);
  });

  it('Pacto da Lâmina sozinho: sem dependente, pode remover', () => {
    expect(invocacoesQueDependemDe('pacto-da-lamina', ['pacto-da-lamina'])).toEqual([]);
  });

  it('cadeia completa: Lâmina Sedenta tem Lâmina Devoradora como dependente', () => {
    const dependentes = invocacoesQueDependemDe('lamina-sedenta', [
      'pacto-da-lamina',
      'lamina-sedenta',
      'lamina-devoradora',
    ]);
    expect(dependentes.map((i) => i.id)).toEqual(['lamina-devoradora']);
  });
});

describe('invocacaoTemPlaceholder', () => {
  it('invocação com magiaGratisConcedida: sem [PH]', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'armadura-de-sombras')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(false);
  });

  it('Vigor Ínfero (pvTemporarioConcedido): sem [PH]', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'vigor-infero')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(false);
  });

  it('Visão Diabólica (sentidoConcedido): sem [PH]', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'visao-diabolica')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(false);
  });

  it('Pacto da Lâmina/Lâmina Sedenta/Lâmina Devoradora/Pacto do Tomo/Explosão Agonizante: sem [PH] (mecânica própria)', () => {
    for (const id of ['pacto-da-lamina', 'lamina-sedenta', 'lamina-devoradora', 'pacto-do-tomo', 'explosao-agonizante']) {
      const inv = invocacoesMisticas.find((i) => i.id === id)!;
      expect(invocacaoTemPlaceholder(inv)).toBe(false);
    }
  });

  it('Mente Mística: sem [PH] (passiva de texto puro)', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'mente-mistica')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(false);
  });

  it('Lança Mística: ainda [PH] (depende do motor de dano/alcance)', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'lanca-mistica')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(true);
  });

  it('Pacto da Corrente: ainda [PH] (depende de sistema de Familiar)', () => {
    const inv = invocacoesMisticas.find((i) => i.id === 'pacto-da-corrente')!;
    expect(invocacaoTemPlaceholder(inv)).toBe(true);
  });
});

describe('bonusExplosaoAgonizante', () => {
  it('Raio Místico + invocação marcada: soma o mod. de Carisma', () => {
    expect(bonusExplosaoAgonizante('raiomistico', ['explosao-agonizante'], 4)).toBe(4);
  });

  it('Raio Místico sem a invocação marcada: 0', () => {
    expect(bonusExplosaoAgonizante('raiomistico', [], 4)).toBe(0);
  });

  it('borda: outro truque de dano (Toque Necrótico), mesmo com a invocação marcada: 0', () => {
    expect(bonusExplosaoAgonizante('toquenecrotico', ['explosao-agonizante'], 4)).toBe(0);
  });
});
