import { describe, expect, it } from 'vitest';
import { avaliarTrocaMenteAgucada, podeAtivarMenteAgucada, temMenteAgucada } from './menteAgucada';

describe('menteAgucada', () => {
  it('temMenteAgucada só com a disciplina conhecida', () => {
    expect(temMenteAgucada(['mente-agucada', 'defesa-psionica'])).toBe(true);
    expect(temMenteAgucada(['defesa-psionica'])).toBe(false);
  });

  it('podeAtivarMenteAgucada exige a disciplina E ao menos 1 dado', () => {
    expect(podeAtivarMenteAgucada(['mente-agucada'], 1)).toBe(true);
    expect(podeAtivarMenteAgucada(['mente-agucada'], 0)).toBe(false);
    expect(podeAtivarMenteAgucada([], 3)).toBe(false);
  });

  const dados = [
    { id: 'd0', valor: 4 },
    { id: 'd1', valor: 1 },
    { id: 'd2', valor: 6 },
  ];

  it('oferece trocar o MENOR dado quando o anotado é maior', () => {
    const r = avaliarTrocaMenteAgucada({
      tipoDano: 'Psíquico',
      ativa: true,
      anotado: 10,
      usadoNesteTurno: false,
      temContextoDeTurno: true,
      dadosIndividuais: dados,
    });
    expect(r).toEqual({ texto: 'Trocar menor resultado (1) por (10)', dadoId: 'd1', novoValor: 10 });
  });

  it('não oferece quando o anotado é igual ou menor que o menor dado', () => {
    expect(
      avaliarTrocaMenteAgucada({
        tipoDano: 'Psíquico',
        ativa: true,
        anotado: 1,
        usadoNesteTurno: false,
        temContextoDeTurno: true,
        dadosIndividuais: dados,
      }),
    ).toBeNull();
  });

  it('não oferece pra dano que não é Psíquico', () => {
    expect(
      avaliarTrocaMenteAgucada({
        tipoDano: 'Fogo',
        ativa: true,
        anotado: 10,
        usadoNesteTurno: false,
        temContextoDeTurno: true,
        dadosIndividuais: dados,
      }),
    ).toBeNull();
  });

  it('não oferece se não está ativa, sem anotado, ou já usado neste turno', () => {
    expect(
      avaliarTrocaMenteAgucada({
        tipoDano: 'Psíquico',
        ativa: false,
        anotado: 10,
        usadoNesteTurno: false,
        temContextoDeTurno: true,
        dadosIndividuais: dados,
      }),
    ).toBeNull();
    expect(
      avaliarTrocaMenteAgucada({
        tipoDano: 'Psíquico',
        ativa: true,
        anotado: null,
        usadoNesteTurno: false,
        temContextoDeTurno: true,
        dadosIndividuais: dados,
      }),
    ).toBeNull();
    expect(
      avaliarTrocaMenteAgucada({
        tipoDano: 'Psíquico',
        ativa: true,
        anotado: 10,
        usadoNesteTurno: true,
        temContextoDeTurno: true,
        dadosIndividuais: dados,
      }),
    ).toBeNull();
  });

  it('sem contexto de turno (aba Magias), ignora usadoNesteTurno — sempre oferece', () => {
    const r = avaliarTrocaMenteAgucada({
      tipoDano: 'Psíquico',
      ativa: true,
      anotado: 10,
      usadoNesteTurno: true,
      temContextoDeTurno: false,
      dadosIndividuais: dados,
    });
    expect(r).toEqual({ texto: 'Trocar menor resultado (1) por (10)', dadoId: 'd1', novoValor: 10 });
  });
});
