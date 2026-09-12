import { describe, it, expect } from 'vitest';
import {
  classesDoPersonagem,
  nivelTotalPersonagem,
  nivelNaClasse,
  preRequisitoDaClasse,
  atendePreRequisitoMulticlasse,
  espacosMagiaParaNivelCombinado,
  opcoesLevelUp,
  deveEscolherClasseNoLevelUp,
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

const CATALOGO = [{ nome: 'Guerreiro' }, { nome: 'Bardo' }, { nome: 'Bruxo' }, { nome: 'Mago' }, { nome: 'Guardião' }];

describe('opcoesLevelUp', () => {
  it('caso normal — 1 classe só, sem atender pré-requisito de nenhuma outra: só ela mesma na lista', () => {
    const classes = [{ classe: 'Mago', nivel: 5 }];
    const atributos = { FOR: 8, DES: 10, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    expect(opcoesLevelUp(classes, atributos, CATALOGO)).toEqual([{ classe: 'Mago', nivelAtual: 5 }]);
  });

  it('caso normal — 1 classe só, atendendo pré-requisito de outra: as duas aparecem (nova como nível 0)', () => {
    const classes = [{ classe: 'Mago', nivel: 5 }];
    const atributos = { FOR: 13, DES: 10, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    expect(opcoesLevelUp(classes, atributos, CATALOGO)).toEqual([
      { classe: 'Mago', nivelAtual: 5 },
      { classe: 'Guerreiro', nivelAtual: 0 },
    ]);
  });

  it('caso normal — já multiclasse (2 classes): as 2 sempre aparecem, independente de elegibilidade nova', () => {
    const classes = [
      { classe: 'Guerreiro', nivel: 3 },
      { classe: 'Mago', nivel: 2 },
    ];
    const atributos = { FOR: 13, DES: 10, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    expect(opcoesLevelUp(classes, atributos, CATALOGO)).toEqual([
      { classe: 'Guerreiro', nivelAtual: 3 },
      { classe: 'Mago', nivelAtual: 2 },
    ]);
  });

  it('modo "qualquer" (Guerreiro): FOR OU DES basta pra oferecer a classe nova', () => {
    const classes = [{ classe: 'Mago', nivel: 5 }];
    const atributos = { FOR: 8, DES: 13, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    const opcoes = opcoesLevelUp(classes, atributos, CATALOGO);
    expect(opcoes.some((o) => o.classe === 'Guerreiro')).toBe(true);
  });

  it('modo "todos" (Guardião): só DES não basta, precisa de SAB junto', () => {
    const classes = [{ classe: 'Mago', nivel: 5 }];
    const atributos = { FOR: 8, DES: 13, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    const opcoes = opcoesLevelUp(classes, atributos, CATALOGO);
    expect(opcoes.some((o) => o.classe === 'Guardião')).toBe(false);
  });

  it('caso de borda — não atende mais o pré-requisito de uma classe já possuída: continua na lista, mas não oferece nenhuma nova', () => {
    const classes = [{ classe: 'Guerreiro', nivel: 3 }];
    const atributos = { FOR: 8, DES: 8, CON: 10, INT: 16, SAB: 10, CAR: 10 };
    expect(opcoesLevelUp(classes, atributos, CATALOGO)).toEqual([{ classe: 'Guerreiro', nivelAtual: 3 }]);
  });
});

describe('deveEscolherClasseNoLevelUp', () => {
  it('caso normal — 1 opção só: não mostra o passo', () => {
    expect(deveEscolherClasseNoLevelUp([{ classe: 'Mago', nivelAtual: 5 }])).toBe(false);
  });

  it('caso de borda — 2+ opções: mostra o passo', () => {
    expect(
      deveEscolherClasseNoLevelUp([
        { classe: 'Mago', nivelAtual: 5 },
        { classe: 'Guerreiro', nivelAtual: 0 },
      ]),
    ).toBe(true);
  });
});
