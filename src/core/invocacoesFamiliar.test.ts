import { describe, it, expect } from 'vitest';
import { formasFamiliarDasInvocacoes } from './invocacoesFamiliar';

describe('formasFamiliarDasInvocacoes', () => {
  it('caso normal — Pacto da Corrente concede as 8 formas especiais', () => {
    const formas = formasFamiliarDasInvocacoes(['pacto-da-corrente']);
    const nomes = formas.map((f) => f.nome).sort();
    expect(nomes).toEqual(
      [
        'Cobra Peçonhenta',
        'Diabrete',
        'Esfinge Maravilhosa',
        'Esqueleto',
        'Pseudodragão',
        'Quasit',
        'Slaad Girino',
        'Sprite',
      ].sort(),
    );
  });

  it('caso de borda — sem Pacto da Corrente (ou lista vazia), não concede nenhuma forma', () => {
    expect(formasFamiliarDasInvocacoes([])).toEqual([]);
    expect(formasFamiliarDasInvocacoes(['armadura-de-sombras'])).toEqual([]);
  });
});
