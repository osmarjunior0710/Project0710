import { describe, expect, it } from 'vitest';
import { classes } from '../data/rulesets/dnd2024/classes';
import { disciplinasPsionicas } from '../data/rulesets/dnd2024/disciplinasPsionicas';
import {
  caracteristicaDisciplinaTemTexto,
  disciplinaParaRolagem,
  disciplinaParaConjuracao,
  algumaDisciplinaComumUsadaNoTurno,
  DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO,
  podeUsarDisciplina,
  quantidadeDisciplinasPsionicas,
  rolagemTemLimiteDeTurno,
  registrarUsoDeDisciplina,
} from './disciplinasPsionicas';

const psionico = classes.find((c) => c.id === 'psionico')!;

describe('quantidadeDisciplinasPsionicas', () => {
  it('2 no nível 2, +1 nos níveis 5, 10, 13 e 17 (0 antes do nível 2)', () => {
    const q = (n: number) => quantidadeDisciplinasPsionicas(psionico, n);
    expect([1, 2, 4, 5, 9, 10, 12, 13, 16, 17, 20].map(q)).toEqual([0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  });
});

describe('catálogo', () => {
  it('11 disciplinas, ids únicos, todas com texto; as 2 exceções do turno existem', () => {
    expect(disciplinasPsionicas).toHaveLength(11);
    expect(new Set(disciplinasPsionicas.map((d) => d.id)).size).toBe(11);
    expect(disciplinasPsionicas.every((d) => d.descricao.length > 20)).toBe(true);
    for (const id of DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO) expect(disciplinasPsionicas.some((d) => d.id === id)).toBe(true);
    expect(caracteristicaDisciplinaTemTexto()).toBe(true);
  });
});

describe('podeUsarDisciplina — 1 disciplina por turno, 1 vez cada', () => {
  it('nenhuma usada: qualquer uma pode', () => {
    expect(podeUsarDisciplina({ usadas: [] }, 'mira-inerrante')).toEqual({ pode: true });
  });
  it('depois de usar uma comum, nenhuma outra (nem a mesma)', () => {
    const e = registrarUsoDeDisciplina({ usadas: [] }, 'mira-inerrante');
    expect(podeUsarDisciplina(e, 'mente-atenta').pode).toBe(false);
    expect(podeUsarDisciplina(e, 'mira-inerrante').pode).toBe(false);
  });
  it('Defesa Psiônica e Mente Aguçada não gastam a "1 por turno": ainda dá pra usar 1 comum depois', () => {
    let e = registrarUsoDeDisciplina({ usadas: [] }, 'defesa-psionica');
    expect(podeUsarDisciplina(e, 'mira-inerrante').pode).toBe(true);
    e = registrarUsoDeDisciplina(e, 'mente-agucada');
    expect(podeUsarDisciplina(e, 'mira-inerrante').pode).toBe(true);
    e = registrarUsoDeDisciplina(e, 'mira-inerrante');
    expect(podeUsarDisciplina(e, 'mente-atenta').pode).toBe(false);
  });
  it('borda: as exceções não podem ser a 2ª disciplina depois de uma comum, nem repetir no turno', () => {
    const comum = registrarUsoDeDisciplina({ usadas: [] }, 'mira-inerrante');
    expect(podeUsarDisciplina(comum, 'defesa-psionica').pode).toBe(false);
    const defesa = registrarUsoDeDisciplina({ usadas: [] }, 'defesa-psionica');
    expect(podeUsarDisciplina(defesa, 'defesa-psionica').pode).toBe(false);
  });
});

describe('disciplinaParaRolagem', () => {
  const todas = ['consciencia-expandida', 'lingua-diabolica', 'mente-atenta', 'mira-inerrante', 'bio-retorno'];
  it('perícia: cada disciplina vale só pras perícias da ação dela', () => {
    const d = (label: string) => disciplinaParaRolagem(todas, { label, ehAtaque: false })?.id ?? null;
    expect(d('Percepção')).toBe('consciencia-expandida');
    expect(d('Persuasão')).toBe('lingua-diabolica');
    expect(d('Arcanismo')).toBe('mente-atenta');
    expect(d('Atletismo')).toBeNull();
  });
  it('ataque: só Mira Inerrante; sem a disciplina conhecida, nada', () => {
    expect(disciplinaParaRolagem(todas, { label: 'Espada', ehAtaque: true })?.id).toBe('mira-inerrante');
    expect(disciplinaParaRolagem(['consciencia-expandida'], { label: 'Espada', ehAtaque: true })).toBeNull();
    expect(disciplinaParaRolagem([], { label: 'Percepção', ehAtaque: false })).toBeNull();
  });
});

describe('nota do app nas disciplinas de rolagem', () => {
  it('diz a ação e as perícias que valem (lidas do gatilho)', () => {
    const d = (id: string) => disciplinasPsionicas.find((x) => x.id === id)!.descricao;
    expect(d('consciencia-expandida')).toContain('Procurar, vale nas perícias Intuição, Medicina, Percepção e Sobrevivência');
    expect(d('lingua-diabolica')).toContain('Atuação, Enganação, Intimidação, Persuasão e Lidar com Animais');
    expect(d('mente-atenta')).toContain('Analisar (o "Estudar" do UA)');
    expect(d('mente-atenta')).toContain('Arcanismo, História, Investigação, Natureza e Religião');
    expect(d('mira-inerrante')).toContain('popup do ataque');
    expect(d('bio-retorno')).toContain('pergunta logo depois de conjurar a magia');
  });
});

describe('disciplinaParaConjuracao', () => {
  const todas = ['aperfeicoamento-de-precognicao', 'bio-retorno', 'insinuacao-do-id', 'pensamentos-destrutivos'];
  it('bate por escola, sem exigir salvaguarda quando a disciplina não pede', () => {
    expect(disciplinaParaConjuracao(todas, { escola: 'Abjuração' }, false)?.id).toBe('aperfeicoamento-de-precognicao');
    expect(disciplinaParaConjuracao(todas, { escola: 'Adivinhação' }, false)?.id).toBe('aperfeicoamento-de-precognicao');
    expect(disciplinaParaConjuracao(todas, { escola: 'Transmutação' }, false)?.id).toBe('bio-retorno');
  });
  it('Insinuação do Id e Pensamentos Destrutivos só valem quando a magia exige teste de resistência', () => {
    expect(disciplinaParaConjuracao(todas, { escola: 'Ilusão' }, true)?.id).toBe('insinuacao-do-id');
    expect(disciplinaParaConjuracao(todas, { escola: 'Ilusão' }, false)).toBeNull();
    expect(disciplinaParaConjuracao(todas, { escola: 'Evocação' }, true)?.id).toBe('pensamentos-destrutivos');
    expect(disciplinaParaConjuracao(todas, { escola: 'Evocação' }, false)).toBeNull();
  });
  it('escola fora das 4 disciplinas, ou disciplina não conhecida: null', () => {
    expect(disciplinaParaConjuracao(todas, { escola: 'Evocação' }, true)).not.toBeNull();
    expect(disciplinaParaConjuracao(todas, { escola: 'Encantamento' }, false)).toBeNull();
    expect(disciplinaParaConjuracao([], { escola: 'Abjuração' }, false)).toBeNull();
  });
});

describe('algumaDisciplinaComumUsadaNoTurno', () => {
  it('nenhuma usada: false', () => {
    expect(algumaDisciplinaComumUsadaNoTurno({ usadas: [] })).toBe(false);
  });
  it('comum usada: true', () => {
    expect(algumaDisciplinaComumUsadaNoTurno(registrarUsoDeDisciplina({ usadas: [] }, 'mira-inerrante'))).toBe(true);
  });
  it('só as exceções usadas (Defesa Psiônica/Mente Aguçada): continua false', () => {
    let e = registrarUsoDeDisciplina({ usadas: [] }, 'defesa-psionica');
    e = registrarUsoDeDisciplina(e, 'mente-agucada');
    expect(algumaDisciplinaComumUsadaNoTurno(e)).toBe(false);
  });
});

describe('rolagemTemLimiteDeTurno', () => {
  it('ataque (aba Combate) tem limite de turno; teste de perícia (aba Atributos) não', () => {
    expect(rolagemTemLimiteDeTurno({ ehAtaque: true })).toBe(true);
    expect(rolagemTemLimiteDeTurno({ ehAtaque: false })).toBe(false);
  });
});
