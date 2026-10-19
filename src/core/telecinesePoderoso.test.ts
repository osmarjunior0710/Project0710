import { describe, it, expect } from 'vitest';
import { temTelecinesePoderoso, aplicarTelecinesePoderosoEmMagia } from './telecinesePoderoso';
import { magias } from '../data/rulesets/dnd2024/magias';

const maosMagicas = magias.find((m) => m.nome === 'Mãos Mágicas')!;
const luz = magias.find((m) => m.nome === 'Luz')!;

describe('temTelecinesePoderoso', () => {
  it('nível 2: ainda não bateu o nível 3', () => {
    expect(temTelecinesePoderoso(2)).toBe(false);
  });

  it('nível 3+: disponível', () => {
    expect(temTelecinesePoderoso(3)).toBe(true);
  });
});

describe('aplicarTelecinesePoderosoEmMagia', () => {
  it('sem a característica: Mãos Mágicas intacta (alcance base)', () => {
    const resultado = aplicarTelecinesePoderosoEmMagia(maosMagicas, false);
    expect(resultado.alcance).toBe('9 metros');
    expect(resultado).toBe(maosMagicas);
  });

  it('com a característica: Mãos Mágicas ganha alcance 18 metros e nota explicando o bônus na descrição completa', () => {
    const resultado = aplicarTelecinesePoderosoEmMagia(maosMagicas, true);
    expect(resultado.alcance).toBe('18 metros');
    expect(resultado.descricaoCompleta).toContain('Telecinese Poderoso');
    expect(resultado.descricaoCompleta).toContain('9 quilos');
  });

  it('a nota também entra na descrição CURTA (padrão do popup abre nela, não pode contradizer o alcance do topo)', () => {
    const resultado = aplicarTelecinesePoderosoEmMagia(maosMagicas, true);
    expect(resultado.descricaoCurta).toContain('Telecinese Poderoso');
    expect(resultado.descricaoCurta).toContain('18 metros');
  });

  it('caso de borda: outra magia qualquer nunca é alterada, mesmo com a característica', () => {
    const resultado = aplicarTelecinesePoderosoEmMagia(luz, true);
    expect(resultado).toBe(luz);
  });
});
