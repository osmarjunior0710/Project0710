import { describe, it, expect } from 'vitest';
import { classesDoPersonagem, nivelTotalPersonagem, nivelNaClasse } from './multiclasse';
import type { PersonagemSalvo } from './armazenamentoPersonagens';
import type { WizardSelection } from './personagem';

function selecaoBase(classe: string | null): WizardSelection {
  return {
    classe,
  } as WizardSelection;
}

function personagemBase(overrides: Partial<PersonagemSalvo>): PersonagemSalvo {
  return {
    id: 'pj-1',
    criadoEm: '2026-01-01',
    nivel: 5,
    xp: 0,
    pvAtual: 10,
    selecao: selecaoBase('Mago'),
    ...overrides,
  };
}

describe('classesDoPersonagem', () => {
  it('caso normal — personagem sem `classes` (formato antigo) deriva 1 elemento único', () => {
    const p = personagemBase({ nivel: 5, subclasseAtual: 'Necromante' });
    expect(classesDoPersonagem(p)).toEqual([{ classe: 'Mago', nivel: 5, subclasse: 'Necromante' }]);
  });

  it('caso normal — personagem com `classes` já preenchido usa direto (multiclasse de verdade)', () => {
    const classes = [
      { classe: 'Bárbaro', nivel: 1 },
      { classe: 'Mago', nivel: 2, subclasse: 'Necromante' },
    ];
    const p = personagemBase({ classes });
    expect(classesDoPersonagem(p)).toBe(classes);
  });

  it('caso de borda — sem classe nenhuma (selecao.classe null) devolve array vazio', () => {
    const p = personagemBase({ selecao: selecaoBase(null) });
    expect(classesDoPersonagem(p)).toEqual([]);
  });

  it('caso de borda — sem subclasseAtual (ainda não escolhida), vira `null` no elemento derivado', () => {
    const p = personagemBase({ subclasseAtual: undefined });
    expect(classesDoPersonagem(p)[0].subclasse).toBeNull();
  });
});

describe('nivelTotalPersonagem', () => {
  it('caso normal — soma o nível de todas as classes', () => {
    expect(
      nivelTotalPersonagem([
        { classe: 'Bárbaro', nivel: 1 },
        { classe: 'Mago', nivel: 2 },
      ]),
    ).toBe(3);
  });

  it('caso de borda — array vazio soma 0', () => {
    expect(nivelTotalPersonagem([])).toBe(0);
  });
});

describe('nivelNaClasse', () => {
  it('caso normal — encontra o nível da classe pedida', () => {
    const classes = [
      { classe: 'Bárbaro', nivel: 1 },
      { classe: 'Mago', nivel: 2 },
    ];
    expect(nivelNaClasse(classes, 'Mago')).toBe(2);
  });

  it('caso de borda — classe sem nenhum nível (nunca multiclassou pra lá) devolve 0', () => {
    const classes = [{ classe: 'Bárbaro', nivel: 1 }];
    expect(nivelNaClasse(classes, 'Mago')).toBe(0);
  });
});
