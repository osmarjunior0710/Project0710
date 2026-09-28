import { describe, it, expect } from 'vitest';
import {
  niveisComASI,
  niveisComDadivaEpica,
  temEstiloDeLutaTrocavel,
  estiloDeLutaPedidoNoLevelUp,
  estiloDeLutaTrocaTodoNivel,
  numeroDeAtaques,
  caracteristicasDoNivel,
  caracteristicasSubclasseAcumuladas,
  caracteristicasDoNivelComSubclasse,
  NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE,
} from './levelUp';
import { classes } from '../data/rulesets/dnd2024/classes';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro');
if (!guerreiro) throw new Error('Fixture "Guerreiro" não encontrada em data/rulesets/dnd2024/classes.ts');
const bardo = classes.find((c) => c.nome === 'Bardo');
if (!bardo) throw new Error('Fixture "Bardo" não encontrada em data/rulesets/dnd2024/classes.ts');
const paladino = classes.find((c) => c.nome === 'Paladino');
if (!paladino) throw new Error('Fixture "Paladino" não encontrada em data/rulesets/dnd2024/classes.ts');

describe('niveisComASI (reconhece por ID estável, não por nome de exibição)', () => {
  it('lista os 6 níveis de ASI do Guerreiro (4,6,8,12,14,16)', () => {
    expect(niveisComASI(guerreiro)).toEqual([4, 6, 8, 12, 14, 16]);
  });

  it('retorna vazio pra uma classe sem progressão nenhuma (caso de borda)', () => {
    expect(niveisComASI({ ...guerreiro, progressao: [] })).toEqual([]);
  });

  it('Paladino tem os 4 níveis padrão de ASI (4,8,12,16), sem os extras do Guerreiro', () => {
    expect(niveisComASI(paladino)).toEqual([4, 8, 12, 16]);
  });
});

describe('niveisComDadivaEpica', () => {
  it('Guerreiro só ganha Dádiva Épica no nível 19', () => {
    expect(niveisComDadivaEpica(guerreiro)).toEqual([19]);
  });

  it('Paladino também só ganha Dádiva Épica no nível 19', () => {
    expect(niveisComDadivaEpica(paladino)).toEqual([19]);
  });
});

describe('temEstiloDeLutaTrocavel', () => {
  it('true a partir do nível 1 (Guerreiro ganha Estilo de Luta já no nível 1)', () => {
    expect(temEstiloDeLutaTrocavel(guerreiro, 1)).toBe(true);
  });

  it('false pra um nível antes de a classe ter chegado lá (caso de borda: nível 0)', () => {
    expect(temEstiloDeLutaTrocavel(guerreiro, 0)).toBe(false);
  });

  it('Paladino só ganha Estilo de Luta no nível 2 (diferente do Guerreiro, que já tem no 1)', () => {
    expect(temEstiloDeLutaTrocavel(paladino, 1)).toBe(false);
    expect(temEstiloDeLutaTrocavel(paladino, 2)).toBe(true);
  });
});

describe('numeroDeAtaques', () => {
  it('1 ataque antes do nível 5 (ainda sem Ataque Extra)', () => {
    expect(numeroDeAtaques(guerreiro, 4)).toBe(1);
  });

  it('escala 2 -> 3 -> 4 ataques nos saltos reais do Guerreiro (níveis 5, 11, 20)', () => {
    expect(numeroDeAtaques(guerreiro, 5)).toBe(2);
    expect(numeroDeAtaques(guerreiro, 11)).toBe(3);
    expect(numeroDeAtaques(guerreiro, 20)).toBe(4);
  });

  it('Paladino para em 2 ataques pra sempre — só tem "Ataque Extra" (nível 5), nunca "Dois/Três Ataques Extras"', () => {
    expect(numeroDeAtaques(paladino, 4)).toBe(1);
    expect(numeroDeAtaques(paladino, 5)).toBe(2);
    expect(numeroDeAtaques(paladino, 20)).toBe(2);
  });
});

describe('caracteristicasDoNivel — níveis sem característica nomeada (Paladino 13/17) e placeholder de subclasse (7)', () => {
  it('nível sem nada de novo (13) devolve lista vazia, sem quebrar', () => {
    expect(caracteristicasDoNivel(paladino, 13)).toEqual([]);
  });

  it('"Característica de Subclasse" (nível 7) vem sem descrição própria (depende do juramento escolhido)', () => {
    expect(caracteristicasDoNivel(paladino, 7)).toEqual([
      { nome: 'Característica de Subclasse', descricao: null, statusImplementacao: undefined },
    ]);
  });
});

describe('caracteristicasSubclasseAcumuladas', () => {
  it('acumula por nível — Colégio do Conhecimento no 3 tem 2, no 6 tem 3, no 14 tem as 4', () => {
    expect(caracteristicasSubclasseAcumuladas('Colégio do Conhecimento', 3).map((c) => c.nome)).toEqual([
      'Palavras de Interrupção',
      'Proficiências Bônus',
    ]);
    expect(caracteristicasSubclasseAcumuladas('Colégio do Conhecimento', 6)).toHaveLength(3);
    expect(caracteristicasSubclasseAcumuladas('Colégio do Conhecimento', 14)).toHaveLength(4);
  });

  it('retorna vazio sem subclasse escolhida (caso de borda: null)', () => {
    expect(caracteristicasSubclasseAcumuladas(null, 20)).toEqual([]);
  });
});

describe('caracteristicasDoNivelComSubclasse', () => {
  it('Bardo nível 6 com Colégio do Conhecimento: troca o placeholder pela característica real (Descobertas Mágicas)', () => {
    const resultado = caracteristicasDoNivelComSubclasse(bardo, 6, 'Colégio do Conhecimento');
    expect(resultado.map((c) => c.nome)).toEqual(['Descobertas Mágicas']);
    expect(resultado[0].descricao).not.toBeNull();
  });

  it('caso de borda: sem subclasse escolhida, o placeholder fica como está (não quebra, não inventa texto)', () => {
    const resultado = caracteristicasDoNivelComSubclasse(bardo, 6, null);
    expect(resultado.map((c) => c.nome)).toEqual([NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE]);
    expect(resultado[0].descricao).toBeNull();
  });
});

describe('Estilo de Luta — só o Guerreiro troca a cada nível (livro Cap. 3)', () => {
  it('estiloDeLutaTrocaTodoNivel: Guerreiro sim, Paladino não', () => {
    expect(estiloDeLutaTrocaTodoNivel(guerreiro)).toBe(true);
    expect(estiloDeLutaTrocaTodoNivel(paladino)).toBe(false);
  });

  it('Guerreiro é perguntado em todo nível a partir do 1', () => {
    expect(estiloDeLutaPedidoNoLevelUp(guerreiro, 1)).toBe(true);
    expect(estiloDeLutaPedidoNoLevelUp(guerreiro, 9)).toBe(true);
  });

  it('Paladino é perguntado só no nível 2 (nunca no 1, nunca depois)', () => {
    expect(estiloDeLutaPedidoNoLevelUp(paladino, 1)).toBe(false);
    expect(estiloDeLutaPedidoNoLevelUp(paladino, 2)).toBe(true);
    expect(estiloDeLutaPedidoNoLevelUp(paladino, 3)).toBe(false);
    expect(estiloDeLutaPedidoNoLevelUp(paladino, 9)).toBe(false);
    expect(estiloDeLutaPedidoNoLevelUp(paladino, 20)).toBe(false);
  });
});
