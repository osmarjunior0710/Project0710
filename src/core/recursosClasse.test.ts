import { describe, it, expect } from 'vitest';
import {
  valorRecursoClasse,
  quantidadeRecuperarFolego,
  quantidadeFuria,
  bonusDanoFuria,
  quantidadeMaosConsagradas,
  temAuraDeProtecao,
  ladosDadoArtesMarciais,
  quantidadePontosDeFoco,
  bonusMovimentoSemArmadura,
} from './recursosClasse';
import { classes } from '../data/rulesets/dnd2024/classes';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

describe('valorRecursoClasse', () => {
  it('acha o recurso pelo prefixo do nome e lê o valor do nível pedido (Guerreiro, Recuperar Fôlego)', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 1)).toBe(2);
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 10)).toBe(4);
  });

  it('borda: prefixo que não bate com nenhum recurso da classe devolve 0, nunca undefined/erro', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recurso Que Não Existe', 1)).toBe(0);
  });

  it('borda: nível sem entrada na tabela (fora do range 1-20) devolve 0', () => {
    expect(valorRecursoClasse(classe('Guerreiro'), 'Recuperar Fôlego', 0)).toBe(0);
  });
});

describe('quantidadeRecuperarFolego', () => {
  it('Guerreiro nível 1 tem 2 usos, nível 10 tem 4 (progressão real da planilha)', () => {
    expect(quantidadeRecuperarFolego(classe('Guerreiro'), 1)).toBe(2);
    expect(quantidadeRecuperarFolego(classe('Guerreiro'), 10)).toBe(4);
  });

  it('borda: classe sem esse recurso (Bardo não tem Recuperar Fôlego) devolve 0', () => {
    expect(quantidadeRecuperarFolego(classe('Bardo'), 1)).toBe(0);
  });
});

describe('quantidadeFuria', () => {
  it('Bárbaro nível 1 tem 2 usos, nível 20 tem 6 (progressão real da planilha)', () => {
    expect(quantidadeFuria(classe('Bárbaro'), 1)).toBe(2);
    expect(quantidadeFuria(classe('Bárbaro'), 20)).toBe(6);
  });

  it('borda: classe sem esse recurso (Guerreiro não tem Fúria) devolve 0', () => {
    expect(quantidadeFuria(classe('Guerreiro'), 1)).toBe(0);
  });
});

describe('bonusDanoFuria', () => {
  it('Bárbaro nível 1 soma +2, nível 9 sobe pra +3, nível 17 sobe pra +4', () => {
    expect(bonusDanoFuria(classe('Bárbaro'), 1)).toBe(2);
    expect(bonusDanoFuria(classe('Bárbaro'), 9)).toBe(3);
    expect(bonusDanoFuria(classe('Bárbaro'), 17)).toBe(4);
  });

  it('borda: classe sem Fúria devolve 0', () => {
    expect(bonusDanoFuria(classe('Guerreiro'), 1)).toBe(0);
  });
});

describe('quantidadeMaosConsagradas', () => {
  it('Paladino: reserva é 5 × nível (nível 1 = 5 PV, nível 20 = 100 PV)', () => {
    expect(quantidadeMaosConsagradas(classe('Paladino'), 1)).toBe(5);
    expect(quantidadeMaosConsagradas(classe('Paladino'), 5)).toBe(25);
    expect(quantidadeMaosConsagradas(classe('Paladino'), 20)).toBe(100);
  });

  it('borda: classe sem Mãos Consagradas devolve 0', () => {
    expect(quantidadeMaosConsagradas(classe('Guerreiro'), 5)).toBe(0);
  });
});

describe('temAuraDeProtecao', () => {
  it('Paladino nível 6+: ativa', () => {
    expect(temAuraDeProtecao(classe('Paladino'), 6)).toBe(true);
    expect(temAuraDeProtecao(classe('Paladino'), 20)).toBe(true);
  });

  it('borda: Paladino nível 5 (ainda não chegou): inativa', () => {
    expect(temAuraDeProtecao(classe('Paladino'), 5)).toBe(false);
  });

  it('borda: outra classe no nível 6: inativa', () => {
    expect(temAuraDeProtecao(classe('Guerreiro'), 6)).toBe(false);
  });
});

describe('ladosDadoArtesMarciais', () => {
  it('Monge: 1d6 no nível 1, escala até 1d12 no nível 17-20', () => {
    expect(ladosDadoArtesMarciais(classe('Monge'), 1)).toBe(6);
    expect(ladosDadoArtesMarciais(classe('Monge'), 5)).toBe(8);
    expect(ladosDadoArtesMarciais(classe('Monge'), 11)).toBe(10);
    expect(ladosDadoArtesMarciais(classe('Monge'), 20)).toBe(12);
  });

  it('borda: classe sem Dado de Artes Marciais devolve 0', () => {
    expect(ladosDadoArtesMarciais(classe('Guerreiro'), 5)).toBe(0);
  });
});

describe('quantidadePontosDeFoco', () => {
  it('Monge: 0 no nível 1 (ainda não tem Foco do Monge), cresce 1:1 com o nível a partir do 2', () => {
    expect(quantidadePontosDeFoco(classe('Monge'), 1)).toBe(0);
    expect(quantidadePontosDeFoco(classe('Monge'), 2)).toBe(2);
    expect(quantidadePontosDeFoco(classe('Monge'), 20)).toBe(20);
  });

  it('borda: classe sem Pontos de Foco devolve 0', () => {
    expect(quantidadePontosDeFoco(classe('Guerreiro'), 10)).toBe(0);
  });
});

describe('bonusMovimentoSemArmadura', () => {
  it('Monge: 0 no nível 1, +3m no 2, escala até +9m no 18-20', () => {
    expect(bonusMovimentoSemArmadura(classe('Monge'), 1)).toBe(0);
    expect(bonusMovimentoSemArmadura(classe('Monge'), 2)).toBe(3);
    expect(bonusMovimentoSemArmadura(classe('Monge'), 6)).toBe(4.5);
    expect(bonusMovimentoSemArmadura(classe('Monge'), 20)).toBe(9);
  });

  it('borda: classe sem esse recurso devolve 0', () => {
    expect(bonusMovimentoSemArmadura(classe('Guerreiro'), 10)).toBe(0);
  });
});
