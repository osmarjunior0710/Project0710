import { describe, it, expect } from 'vitest';
import { talentoTemPlaceholder } from './classificarTalento';
import { talentos } from '../data/rulesets/dnd2024/talentos';

describe('talentoTemPlaceholder', () => {
  it('Alerta (Fase 4, tem efeitoMecanico): sem [PH]', () => {
    const t = talentos.find((x) => x.nome === 'Alerta')!;
    expect(talentoTemPlaceholder(t)).toBe(false);
  });

  it('talento sem efeitoMecanico ainda: mantém [PH]', () => {
    const t = talentos.find((x) => x.efeitoMecanico === undefined)!;
    expect(talentoTemPlaceholder(t)).toBe(true);
  });

  it('Habilidoso (coberto por concedeProficiencias, sem efeitoMecanico): sem [PH]', () => {
    const t = talentos.find((x) => x.id === 'habilidoso')!;
    expect(talentoTemPlaceholder(t)).toBe(false);
  });

  it('Músico (concedeFerramentaGrupo cobre só parte do benefício): mantém [PH]', () => {
    const t = talentos.find((x) => x.id === 'musico')!;
    expect(talentoTemPlaceholder(t)).toBe(true);
  });

  it('Analítico/Mente Aguçada (pericia-restrita-ou-especializacao): sem [PH]', () => {
    expect(talentoTemPlaceholder(talentos.find((x) => x.id === 'analitico')!)).toBe(false);
    expect(talentoTemPlaceholder(talentos.find((x) => x.id === 'mente-agucada')!)).toBe(false);
  });

  it('Especialista em Perícia (pericia-livre-mais-especializacao): sem [PH]', () => {
    expect(talentoTemPlaceholder(talentos.find((x) => x.id === 'especialista-em-pericia')!)).toBe(false);
  });

  it('Perfurador (reroll-um-dado-de-dano): sem [PH]', () => {
    expect(talentoTemPlaceholder(talentos.find((x) => x.id === 'perfurador')!)).toBe(false);
  });
});
