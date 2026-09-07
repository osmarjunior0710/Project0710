import { describe, it, expect } from 'vitest';
import { classificarMagia, usarMagiaTemAcaoAutomatizada } from './classificarMagia';
import { magias } from '../data/rulesets/dnd2024/magias';

function magia(id: string) {
  const m = magias.find((m) => m.id === id);
  if (!m) throw new Error(`Fixture "${id}" não encontrada em data/rulesets/dnd2024/magias.ts`);
  return m;
}

describe('classificarMagia', () => {
  it('detecta salvaguarda pela abreviação "Salv." (Badalar Fúnebre)', () => {
    expect(classificarMagia(magia('badalarfunebre')).salvaguarda).toBe(true);
  });

  it('truque de ataque não é marcado como salvaguarda (Raio Místico)', () => {
    const c = classificarMagia(magia('raiomistico'));
    expect(c.ataque).toBe(true);
    expect(c.salvaguarda).toBe(false);
  });
});

describe('usarMagiaTemAcaoAutomatizada', () => {
  it('truque de ataque (Raio Místico) — tem ação (rola d20)', () => {
    expect(usarMagiaTemAcaoAutomatizada(magia('raiomistico'))).toBe(true);
  });

  it('truque de salvaguarda sem ataque (Badalar Fúnebre) — tem ação (Modal de Salvaguarda)', () => {
    expect(usarMagiaTemAcaoAutomatizada(magia('badalarfunebre'))).toBe(true);
  });

  it('truque utilitário sem salvaguarda nem ataque (Prestidigitação Arcana) — tem ação (não precisa de jogada, "Usar" sem efeito é o certo)', () => {
    expect(usarMagiaTemAcaoAutomatizada(magia('prestidigitacaoarcana'))).toBe(true);
  });

  it('magia preparada (círculo > 0) de salvaguarda sempre "tem ação" — gastar o espaço já é uma ação válida', () => {
    const magiaDeCirculo = magias.find((m) => m.circulo > 0 && classificarMagia(m).salvaguarda);
    if (!magiaDeCirculo) throw new Error('Nenhuma magia de círculo > 0 com "Salv." encontrada pra testar a borda');
    expect(usarMagiaTemAcaoAutomatizada(magiaDeCirculo)).toBe(true);
  });
});
