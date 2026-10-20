import { describe, expect, it } from 'vitest';
import {
  AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO,
  circuloGratisTelecineseIntensificada,
  podeConjurarTelecineseIntensificada,
} from './telecineseIntensificada';

describe('podeConjurarTelecineseIntensificada', () => {
  it('permite com a característica disponível e 4+ Dados de Energia', () => {
    expect(podeConjurarTelecineseIntensificada(true, 4)).toBe(true);
    expect(podeConjurarTelecineseIntensificada(true, 10)).toBe(true);
  });

  it('bloqueia sem a característica', () => {
    expect(podeConjurarTelecineseIntensificada(false, 10)).toBe(false);
  });

  it('bloqueia com menos de 4 Dados de Energia', () => {
    expect(podeConjurarTelecineseIntensificada(true, 3)).toBe(false);
  });
});

describe('circuloGratisTelecineseIntensificada', () => {
  it('devolve o círculo base quando é Telecinese e está elegível', () => {
    expect(circuloGratisTelecineseIntensificada('Telecinese', 5, true, 4)).toBe(5);
  });

  it('nunca vale pra outra magia', () => {
    expect(circuloGratisTelecineseIntensificada('Esmagamento Telecinético', 3, true, 10)).toBe(null);
  });

  it('null sem dados suficientes', () => {
    expect(circuloGratisTelecineseIntensificada('Telecinese', 5, true, 2)).toBe(null);
  });
});

describe('AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO', () => {
  it('menciona a duração e o alvo Colossal', () => {
    expect(AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO).toContain('1 minuto');
    expect(AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO).toContain('Colossais');
  });
});
