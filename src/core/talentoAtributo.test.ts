import { describe, it, expect } from 'vitest';
import { opcoesAtributoResiliente, atributosResilienteEscolhidos } from './talentoAtributo';
import { classes } from '../data/rulesets/dnd2024/classes';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro')!;

describe('opcoesAtributoResiliente', () => {
  it('devolve todo atributo que a classe NÃO dá proficiência de Salvaguarda (Guerreiro: FOR/CON já proficientes)', () => {
    const opcoes = opcoesAtributoResiliente('resiliente', guerreiro);
    expect(opcoes).toEqual(['DES', 'INT', 'SAB', 'CAR']);
  });

  it('borda: talento diferente de Resiliente devolve []', () => {
    expect(opcoesAtributoResiliente('sortudo', guerreiro)).toEqual([]);
  });

  it('borda: classeOriginal null devolve todos os 6 atributos', () => {
    expect(opcoesAtributoResiliente('resiliente', null)).toHaveLength(6);
  });
});

describe('atributosResilienteEscolhidos', () => {
  it('devolve o atributo escolhido quando o personagem tem Resiliente e a escolha já foi feita', () => {
    const resultado = atributosResilienteEscolhidos(['resiliente'], { resiliente: 'SAB' });
    expect(resultado).toEqual(['SAB']);
  });

  it('borda: talento presente mas sem escolha feita ainda (ou sem talentos/escolhas) devolve []', () => {
    expect(atributosResilienteEscolhidos(['resiliente'], {})).toEqual([]);
    expect(atributosResilienteEscolhidos(undefined, undefined)).toEqual([]);
  });
});
