import { describe, it, expect } from 'vitest';
import { calcularCapacidadeMaxima } from './mochila';
import { criarSelecaoInicial, type WizardSelection } from './personagem';

function selecaoComForca(especie: string, forca: number, overrides: Partial<WizardSelection> = {}): WizardSelection {
  const s = criarSelecaoInicial();
  s.especie = especie;
  s.atributos = { FOR: forca, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 };
  return { ...s, ...overrides };
}

describe('calcularCapacidadeMaxima (Força × multiplicador de Tamanho)', () => {
  it('Pequeno/Médio (padrão, qualquer espécie sem Porte Poderoso) usa ×7', () => {
    expect(calcularCapacidadeMaxima(selecaoComForca('Humano', 14))).toBe(98); // 14 × 7
  });

  it('Golias (Porte Poderoso, sempre) conta 1 tamanho acima — ×13,5', () => {
    expect(calcularCapacidadeMaxima(selecaoComForca('Golias', 14))).toBe(189); // 14 × 13,5
  });

  it('Golias com Forma Grande ativa soma outro tamanho acima — ×27', () => {
    expect(calcularCapacidadeMaxima(selecaoComForca('Golias', 14), true)).toBe(378); // 14 × 27
  });

  it('Forma Grande ativa não afeta quem não é Golias (parâmetro ignorado)', () => {
    expect(calcularCapacidadeMaxima(selecaoComForca('Humano', 14), true)).toBe(98);
  });

  it('retorna null quando Força ainda não foi definida (personagem em criação)', () => {
    expect(calcularCapacidadeMaxima(criarSelecaoInicial())).toBeNull();
  });
});
