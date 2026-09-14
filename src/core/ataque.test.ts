import { describe, it, expect } from 'vitest';
import { ataqueComArma, ataqueDesarmado } from './ataque';
import { armas } from '../data/rulesets/dnd2024/armas';
import { classes } from '../data/rulesets/dnd2024/classes';

const bruxo = classes.find((c) => c.nome === 'Bruxo')!;
const rapieira = armas.find((a) => a.nome === 'Rapieira')!;
const guerreiro = classes.find((c) => c.nome === 'Guerreiro')!;
const barbaro = classes.find((c) => c.nome === 'Bárbaro')!;
const machadoGrande = armas.find((a) => a.nome === 'Machado Grande')!;
const arcoLongo = armas.find((a) => a.nome === 'Arco Longo')!;

describe('ataqueComArma — atribForcada (Pacto da Lâmina)', () => {
  it('sem atribForcada: usa Força/Destreza/Acuidade normalmente', () => {
    const r = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false);
    // Rapieira tem Acuidade — usa o maior entre Força (1) e Destreza (3).
    // Bruxo não é proficiente em Marcial (só Armas Simples), sem bônus.
    expect(r.info.modAcerto).toBe(3);
    expect(r.info.danoMod).toBe(3);
  });

  it('com atribForcada: ignora Força/Destreza/Acuidade, usa o valor fornecido (Carisma)', () => {
    const semForcar = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false);
    const comForcar = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false, 5);
    expect(comForcar.info.modAcerto).toBe(5 + (semForcar.info.modAcerto - 3));
    expect(comForcar.info.danoMod).toBe(5);
  });

  it('com Treinamento com Armas Marciais: Bruxo (só Simples) soma Bônus de Proficiência na Rapieira (Marcial)', () => {
    const semTalento = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false, undefined, []);
    const comTalento = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false, undefined, [
      'treinamento-com-armas-marciais',
    ]);
    expect(comTalento.info.modAcerto).toBe(semTalento.info.modAcerto + 2);
  });
});

describe('ataqueDesarmado — dado-ataque-desarmado (Valentão de Taverna)', () => {
  it('sem o talento: dano continua "1 fixo" (1d1) + mod. de Força', () => {
    const r = ataqueDesarmado(guerreiro, 1, 3);
    expect(r.info.danoQuantidade).toBe(1);
    expect(r.info.danoLados).toBe(1);
    expect(r.info.danoMod).toBe(3);
  });

  it('com Valentão de Taverna: dano vira 1d4 + mod. de Força', () => {
    const r = ataqueDesarmado(guerreiro, 1, 3, ['valentao-de-taverna']);
    expect(r.info.danoQuantidade).toBe(1);
    expect(r.info.danoLados).toBe(4);
    expect(r.info.danoMod).toBe(3);
  });

  it('bonusDanoSeForca (Dano da Fúria): soma sempre, Ataque Desarmado é sempre Força', () => {
    const r = ataqueDesarmado(barbaro, 1, 3, [], 2);
    expect(r.info.danoMod).toBe(3 + 2);
    expect(r.info.usouForca).toBe(true);
  });
});

describe('ataqueComArma — bonusDanoSeForca (Dano da Fúria do Bárbaro)', () => {
  it('arma Corpo a Corpo sem Acuidade (Machado Grande): soma o bônus no dano', () => {
    const r = ataqueComArma(machadoGrande, barbaro, 1, 3, 1, false, false, null, false, undefined, [], undefined, 2);
    expect(r.info.danoMod).toBe(3 + 2); // mod. Força (3) + bônus da Fúria (2)
    expect(r.info.usouForca).toBe(true);
  });

  it('arma à Distância (Arco Longo): NUNCA soma o bônus, mesmo com Força alta', () => {
    const r = ataqueComArma(arcoLongo, barbaro, 1, 5, 1, false, false, null, false, undefined, [], undefined, 2);
    expect(r.info.danoMod).toBe(1); // só mod. Destreza, sem o bônus da Fúria
    expect(r.info.usouForca).toBe(false);
  });

  it('arma com Acuidade (Rapieira), Destreza maior que Força: não soma o bônus (o ataque usou Destreza)', () => {
    const r = ataqueComArma(rapieira, barbaro, 1, 1, 3, false, false, null, false, undefined, [], undefined, 2);
    expect(r.info.danoMod).toBe(3); // só mod. Destreza, sem o bônus
    expect(r.info.usouForca).toBe(false);
  });

  it('arma com Acuidade (Rapieira), Força maior ou igual: soma o bônus (o ataque usou Força)', () => {
    const r = ataqueComArma(rapieira, barbaro, 1, 4, 2, false, false, null, false, undefined, [], undefined, 2);
    expect(r.info.danoMod).toBe(4 + 2); // mod. Força (4) + bônus da Fúria
    expect(r.info.usouForca).toBe(true);
  });

  it('atribForcada (Pacto da Lâmina) sempre desliga o bônus, mesmo numa arma Corpo a Corpo', () => {
    const r = ataqueComArma(machadoGrande, barbaro, 1, 3, 1, false, false, null, false, 5, [], undefined, 2);
    expect(r.info.danoMod).toBe(5); // só o atributo forçado, sem o bônus da Fúria
    expect(r.info.usouForca).toBe(false);
  });
});

describe('explicacaoAcerto (B7 — quebra do modificador no popup de rolagem)', () => {
  it('Ataque Desarmado: sempre 2 linhas (mod. FOR + Bônus de Proficiência)', () => {
    const r = ataqueDesarmado(guerreiro, 1, 3);
    expect(r.info.explicacaoAcerto.linhas).toEqual([
      { label: 'mod. FOR', valor: '+3' },
      { label: 'Bônus de Proficiência', valor: '+2' },
    ]);
    expect(r.info.explicacaoAcerto.total.valor).toBe('+5');
  });

  it('arma sem proficiência: some a linha de Bônus de Proficiência em vez de mostrar +0', () => {
    const semTalento = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false, undefined, []);
    const labels = semTalento.info.explicacaoAcerto.linhas.map((l) => l.label);
    expect(labels).not.toContain('Bônus de Proficiência');
  });

  it('borda: atribForcada (Pacto da Lâmina) rotula a linha como CAR, não FOR/DES', () => {
    const r = ataqueComArma(rapieira, bruxo, 1, 1, 3, false, false, null, false, 5);
    expect(r.info.explicacaoAcerto.linhas[0].label).toBe('mod. CAR (Pacto da Lâmina)');
    expect(r.info.explicacaoAcerto.linhas[0].valor).toBe('+5');
  });

  it('borda: arma com Acuidade rotula qual atributo venceu (FOR vs DES)', () => {
    const usouDes = ataqueComArma(rapieira, barbaro, 1, 1, 3, false, false, null, false);
    expect(usouDes.info.explicacaoAcerto.linhas[0].label).toBe('mod. DES (Acuidade)');
    const usouFor = ataqueComArma(rapieira, barbaro, 1, 4, 2, false, false, null, false);
    expect(usouFor.info.explicacaoAcerto.linhas[0].label).toBe('mod. FOR (Acuidade)');
  });
});
