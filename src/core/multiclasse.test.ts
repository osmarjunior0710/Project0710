import { describe, it, expect } from 'vitest';
import {
  classesDoPersonagem,
  nivelTotalPersonagem,
  nivelNaClasse,
  preRequisitoDaClasse,
  atendePreRequisitoMulticlasse,
  espacosMagiaParaNivelCombinado,
} from './multiclasse';
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

describe('preRequisitoDaClasse', () => {
  it('caso normal — Mago exige 13 em Inteligência', () => {
    expect(preRequisitoDaClasse('Mago')).toEqual({
      classe: 'Mago',
      atributosMinimos: ['INT'],
      modo: 'todos',
      fonte: 'Livro do Jogador (D&D 5e 2024)',
    });
  });

  it('caso de borda — classe sem entrada na tabela (não é multiclassável/não existe) devolve undefined', () => {
    expect(preRequisitoDaClasse('Não Existe')).toBeUndefined();
  });
});

describe('atendePreRequisitoMulticlasse', () => {
  const preReqGuardiao = preRequisitoDaClasse('Guardião')!; // modo 'todos' — DES e SAB
  const preReqGuerreiro = preRequisitoDaClasse('Guerreiro')!; // modo 'qualquer' — FOR ou DES

  it('caso normal — modo "todos" (Guardião), atende só quando os 2 atributos batem', () => {
    expect(atendePreRequisitoMulticlasse({ FOR: 10, DES: 13, CON: 10, INT: 10, SAB: 13, CAR: 10 }, preReqGuardiao)).toBe(true);
    expect(atendePreRequisitoMulticlasse({ FOR: 10, DES: 13, CON: 10, INT: 10, SAB: 12, CAR: 10 }, preReqGuardiao)).toBe(false);
  });

  it('caso de borda — modo "qualquer" (Guerreiro), atende com só 1 dos 2 atributos', () => {
    expect(atendePreRequisitoMulticlasse({ FOR: 13, DES: 8, CON: 10, INT: 10, SAB: 10, CAR: 10 }, preReqGuerreiro)).toBe(true);
    expect(atendePreRequisitoMulticlasse({ FOR: 8, DES: 8, CON: 10, INT: 10, SAB: 10, CAR: 10 }, preReqGuerreiro)).toBe(false);
  });
});

describe('espacosMagiaParaNivelCombinado', () => {
  it('caso normal — nível combinado 5 (mesma tabela do Livro do Jogador)', () => {
    expect(espacosMagiaParaNivelCombinado(5)).toEqual([4, 3, 2, 0, 0, 0, 0, 0, 0]);
  });

  it('caso de borda — fora da faixa 1-20 devolve null', () => {
    expect(espacosMagiaParaNivelCombinado(21)).toBeNull();
    expect(espacosMagiaParaNivelCombinado(0)).toBeNull();
  });
});
