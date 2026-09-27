import { describe, it, expect } from 'vitest';
import {
  magiasVersadoEmEvocacaoNesteNivel,
  catalogoVersadoEmEvocacao,
  truquePotenteAtivo,
  truqueElegivelTruquePotente,
  evocacaoPotencializadaAtiva,
  bonusEvocacaoPotencializada,
  sobrecargaAtiva,
  sobrecargaElegivel,
  danoMaximoSobrecarga,
  danoNecroticoSobrecarga,
} from './evocador';
import { classes } from '../data/rulesets/dnd2024/classes';
import { magias } from '../data/rulesets/dnd2024/magias';

const mago = classes.find((c) => c.nome === 'Mago')!;

describe('magiasVersadoEmEvocacaoNesteNivel', () => {
  it('caso normal — ao atingir o nível 3 (escolha da subclasse), concede 2', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 2, 3)).toBe(2);
  });

  it('caso de borda — nível abaixo de 3 nunca concede nada (subclasse ainda não existe)', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 1, 2)).toBe(0);
  });

  it('concede +1 quando o level-up desbloqueia um círculo de magia novo (ex: nível 5, 3º círculo)', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 4, 5)).toBe(1);
  });

  it('não concede nada num level-up que não desbloqueia círculo novo', () => {
    expect(magiasVersadoEmEvocacaoNesteNivel(mago, 5, 6)).toBe(0);
  });
});

describe('catalogoVersadoEmEvocacao', () => {
  it('caso normal — só magias de Evocação de Mago, círculo 1+ até o máximo', () => {
    const catalogo = catalogoVersadoEmEvocacao(2);
    expect(catalogo.length).toBeGreaterThan(0);
    expect(catalogo.every((m) => m.escola === 'Evocação' && m.classes.includes('Mago') && m.circulo >= 1 && m.circulo <= 2)).toBe(
      true,
    );
  });

  it('caso de borda — círculo máximo 0 não inclui nenhuma magia', () => {
    expect(catalogoVersadoEmEvocacao(0)).toEqual([]);
  });
});

describe('truquePotenteAtivo', () => {
  it('caso normal — Evocador nível 3+ tem a característica', () => {
    expect(truquePotenteAtivo('Evocador', 3)).toBe(true);
  });

  it('caso de borda — nível abaixo de 3, ou subclasse ausente/outra, não tem', () => {
    expect(truquePotenteAtivo('Evocador', 2)).toBe(false);
    expect(truquePotenteAtivo(null, 5)).toBe(false);
    expect(truquePotenteAtivo('Necromante', 5)).toBe(false);
  });
});

describe('truqueElegivelTruquePotente', () => {
  it('caso normal — truque com dano cadastrado é elegível', () => {
    const truqueComDano = magias.find((m) => m.circulo === 0 && m.danoBaseDado != null)!;
    expect(truqueComDano).toBeDefined();
    expect(truqueElegivelTruquePotente(truqueComDano)).toBe(true);
  });

  it('caso de borda — truque sem dano, ou magia de círculo 1+, não é elegível', () => {
    const truqueSemDano = magias.find((m) => m.circulo === 0 && m.danoBaseDado == null)!;
    expect(truqueSemDano).toBeDefined();
    expect(truqueElegivelTruquePotente(truqueSemDano)).toBe(false);

    const magiaComCirculo = magias.find((m) => m.circulo >= 1 && m.danoBaseDado != null)!;
    expect(magiaComCirculo).toBeDefined();
    expect(truqueElegivelTruquePotente(magiaComCirculo)).toBe(false);
  });
});

describe('evocacaoPotencializadaAtiva', () => {
  it('caso normal — Evocador nível 10+ tem a característica', () => {
    expect(evocacaoPotencializadaAtiva('Evocador', 10)).toBe(true);
  });

  it('caso de borda — nível abaixo de 10, ou subclasse ausente/outra, não tem', () => {
    expect(evocacaoPotencializadaAtiva('Evocador', 9)).toBe(false);
    expect(evocacaoPotencializadaAtiva(null, 15)).toBe(false);
    expect(evocacaoPotencializadaAtiva('Necromante', 15)).toBe(false);
  });
});

describe('bonusEvocacaoPotencializada', () => {
  it('caso normal — magia de Evocação de Mago soma o mod. de Inteligência', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(raioDeFogo).toBeDefined();
    expect(bonusEvocacaoPotencializada(raioDeFogo, true, 3)).toBe(3);
  });

  it('caso de borda — característica inativa não soma nada', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(bonusEvocacaoPotencializada(raioDeFogo, false, 3)).toBe(0);
  });

  it('caso de borda — magia de outra escola (mesmo sendo de Mago) não soma', () => {
    const naoEvocacao = magias.find((m) => m.escola !== 'Evocação' && m.classes.includes('Mago'))!;
    expect(naoEvocacao).toBeDefined();
    expect(bonusEvocacaoPotencializada(naoEvocacao, true, 3)).toBe(0);
  });

  it('caso de borda — magia de Evocação que não é "de Mago" não soma (ex: Chama Sagrada, só Clérigo)', () => {
    const chamaSagrada = magias.find((m) => m.nome === 'Chama Sagrada')!;
    expect(chamaSagrada).toBeDefined();
    expect(chamaSagrada.classes.includes('Mago')).toBe(false);
    expect(bonusEvocacaoPotencializada(chamaSagrada, true, 3)).toBe(0);
  });
});

describe('sobrecargaAtiva', () => {
  it('caso normal — Evocador nível 14+ tem a característica', () => {
    expect(sobrecargaAtiva('Evocador', 14)).toBe(true);
  });

  it('caso de borda — nível abaixo de 14, ou subclasse ausente/outra, não tem', () => {
    expect(sobrecargaAtiva('Evocador', 13)).toBe(false);
    expect(sobrecargaAtiva(null, 20)).toBe(false);
    expect(sobrecargaAtiva('Necromante', 20)).toBe(false);
  });
});

describe('sobrecargaElegivel', () => {
  it('caso normal — magia de Mago com dano, espaço de 1º a 5º círculo, característica ativa', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(sobrecargaElegivel(raioDeFogo, 3, true)).toBe(true);
  });

  it('caso de borda — característica inativa nunca é elegível', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(sobrecargaElegivel(raioDeFogo, 3, false)).toBe(false);
  });

  it('caso de borda — truque (círculo 0 do espaço) não é elegível', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(sobrecargaElegivel(raioDeFogo, 0, true)).toBe(false);
  });

  it('caso de borda — espaço de 6º círculo ou maior não é elegível', () => {
    const raioDeFogo = magias.find((m) => m.nome === 'Raio de Fogo')!;
    expect(sobrecargaElegivel(raioDeFogo, 6, true)).toBe(false);
  });

  it('caso de borda — magia sem dano cadastrado, ou que não é de Mago, não é elegível', () => {
    const magiaSemDano = magias.find((m) => m.classes.includes('Mago') && m.circulo >= 1 && m.danoBaseDado == null)!;
    expect(magiaSemDano).toBeDefined();
    expect(sobrecargaElegivel(magiaSemDano, 2, true)).toBe(false);

    const naoDeMago = magias.find((m) => !m.classes.includes('Mago') && m.circulo >= 1 && m.danoBaseDado != null)!;
    expect(naoDeMago).toBeDefined();
    expect(sobrecargaElegivel(naoDeMago, 2, true)).toBe(false);
  });
});

describe('danoMaximoSobrecarga', () => {
  it('caso normal — cada dado no valor máximo + mod, sem crítico', () => {
    expect(danoMaximoSobrecarga(2, 10, 4, false)).toBe(2 * 10 + 4);
  });

  it('caso de borda — crítico dobra a quantidade de dados antes de aplicar o máximo', () => {
    expect(danoMaximoSobrecarga(2, 10, 4, true)).toBe(2 * 2 * 10 + 4);
  });
});

describe('danoNecroticoSobrecarga', () => {
  it('caso de borda — 1ª vez desde o Descanso Longo não causa dano nenhum', () => {
    expect(danoNecroticoSobrecarga(0, 3)).toBeNull();
  });

  it('caso normal — 2ª vez: 2d12 por círculo do espaço gasto', () => {
    expect(danoNecroticoSobrecarga(1, 3)).toEqual({ quantidade: 6, lados: 12 });
  });

  it('escala mais 1d12 por círculo a cada uso extra (3ª vez: 3d12/círculo)', () => {
    expect(danoNecroticoSobrecarga(2, 3)).toEqual({ quantidade: 9, lados: 12 });
  });
});
