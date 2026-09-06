import { describe, it, expect } from 'vitest';
import { concessoesJaConcedidas } from './concessoesJaConcedidas';
import { origens } from '../data/rulesets/dnd2024/origens';
import { especies } from '../data/rulesets/dnd2024/especies';
import { criarSelecaoInicial } from './personagem';

const nobre = origens.find((o) => o.id === 'nobre');
if (!nobre) throw new Error('Fixture "nobre" não encontrada em data/rulesets/dnd2024/origens.ts');

const aasimar = especies.find((e) => e.nome === 'Aasimar');
if (!aasimar) throw new Error('Fixture "Aasimar" não encontrada em data/rulesets/dnd2024/especies.ts');

describe('concessoesJaConcedidas — Perícia/Ferramenta (Classe/Origem, comportamento herdado)', () => {
  it('inclui as 2 perícias fixas da origem e a ferramenta escolhida (caso normal — Nobre)', () => {
    const s = { ...criarSelecaoInicial(), origem: 'Nobre', ferramentaOrigemEscolhida: 'Baralho' };
    const r = concessoesJaConcedidas(s, nobre);
    expect(r.pericias.has('História')).toBe(true);
    expect(r.pericias.has('Persuasão')).toBe(true);
    expect(r.ferramentas.has('Baralho')).toBe(true);
  });

  it('ferramenta de escolha ainda não escolhida não entra no conjunto (borda — nada travado ainda)', () => {
    const s = { ...criarSelecaoInicial(), origem: 'Nobre', ferramentaOrigemEscolhida: null };
    const r = concessoesJaConcedidas(s, nobre);
    expect(r.ferramentas.size).toBe(0);
  });

  it('sem origem selecionada, só considera o que a classe já concedeu', () => {
    const s = { ...criarSelecaoInicial(), periciasClasseEscolhidas: ['Atletismo'] };
    const r = concessoesJaConcedidas(s, undefined);
    expect(r.pericias.has('Atletismo')).toBe(true);
    expect(r.pericias.size).toBe(1);
  });
});

describe('concessoesJaConcedidas — fonte de cada concessão', () => {
  it('perícia da Classe aparece com fonte "Classe"', () => {
    const s = { ...criarSelecaoInicial(), periciasClasseEscolhidas: ['Atletismo'] };
    const r = concessoesJaConcedidas(s, undefined);
    expect(r.pericias.get('Atletismo')).toBe('Classe');
  });

  it('perícia da Origem aparece com fonte "Origem" (quando não veio da Classe)', () => {
    const s = { ...criarSelecaoInicial(), origem: 'Nobre' };
    const r = concessoesJaConcedidas(s, nobre);
    expect(r.pericias.get('História')).toBe('Origem');
  });

  it('empate Classe × Origem no mesmo nome — Classe tem prioridade na fonte mostrada', () => {
    const s = { ...criarSelecaoInicial(), origem: 'Nobre', periciasClasseEscolhidas: ['História'] };
    const r = concessoesJaConcedidas(s, nobre);
    expect(r.pericias.get('História')).toBe('Classe');
  });
});

describe('concessoesJaConcedidas — Truques/Magias da Espécie', () => {
  it('truque fixo da espécie (ex.: Luz do Aasimar) aparece com fonte "Espécie"', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Aasimar' };
    const r = concessoesJaConcedidas(s, undefined, aasimar);
    expect(r.truques.get('Luz')).toBe('Espécie');
  });

  it('sem espécie informada (tela roda antes da etapa de Espécie), não considera truque nenhum', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Aasimar' };
    const r = concessoesJaConcedidas(s, undefined);
    expect(r.truques.size).toBe(0);
  });

  it('truque também escolhido na Classe mantém fonte "Classe" (prioridade sobre Espécie)', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Aasimar', truquesEscolhidos: ['Luz'] };
    const r = concessoesJaConcedidas(s, undefined, aasimar);
    expect(r.truques.get('Luz')).toBe('Classe');
  });
});
