import { describe, expect, it } from 'vitest';
import { classes } from '../data/rulesets/dnd2024/classes';
import { disciplinasPsionicas } from '../data/rulesets/dnd2024/disciplinasPsionicas';
import {
  caracteristicaDisciplinaTemTexto,
  disciplinaParaRolagem,
  DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO,
  podeUsarDisciplina,
  quantidadeDisciplinasPsionicas,
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
