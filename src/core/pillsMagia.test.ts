import { describe, it, expect } from 'vitest';
import { resumoTipoAcao, resumoDuracao, componentesVSM } from './pillsMagia';

describe('resumoTipoAcao', () => {
  it('agrupa qualquer "Ação Bônus, que..." em "Ação Bônus"', () => {
    expect(resumoTipoAcao('Ação Bônus')).toBe('Ação Bônus');
    expect(
      resumoTipoAcao(
        'Ação Bônus, que você realiza imediatamente após acertar um alvo com uma arma Corpo a Corpo ou um Ataque Desarmado'
      )
    ).toBe('Ação Bônus');
  });

  it('agrupa qualquer "Reação, que..." em "Reação"', () => {
    expect(
      resumoTipoAcao('Reação, que você realiza ao receber dano de uma criatura à sua vista e a até 18 metros de você')
    ).toBe('Reação');
  });

  it('agrupa "Ação"/"Uma ação"/"Ação ou Ritual" em "Ação"', () => {
    expect(resumoTipoAcao('Ação')).toBe('Ação');
    expect(resumoTipoAcao('Uma ação')).toBe('Ação');
    expect(resumoTipoAcao('Ação ou Ritual')).toBe('Ação');
  });

  it('resolve a magia com 2 modos ("Ação (X) ou 8 horas (Y)") como "Ação"', () => {
    expect(resumoTipoAcao('Ação (Crescimento Excessivo) ou 8 horas (Fertilização)')).toBe('Ação');
  });

  it('abrevia tempo fixo, ignorando o sufixo "ou Ritual"', () => {
    expect(resumoTipoAcao('1 hora')).toBe('1h');
    expect(resumoTipoAcao('1 hora ou Ritual')).toBe('1h');
    expect(resumoTipoAcao('1 minuto')).toBe('1min');
    expect(resumoTipoAcao('1 minuto ou Ritual')).toBe('1min');
    expect(resumoTipoAcao('10 minutos')).toBe('10min');
    expect(resumoTipoAcao('10 minutos ou Ritual')).toBe('10min');
    expect(resumoTipoAcao('12 horas')).toBe('12h');
    expect(resumoTipoAcao('24 horas')).toBe('24h');
    expect(resumoTipoAcao('8 horas')).toBe('8h');
  });

  it('devolve null quando o campo é null', () => {
    expect(resumoTipoAcao(null)).toBeNull();
  });
});

describe('resumoDuracao', () => {
  it('mantém "Instantânea" e "Especial" como estão', () => {
    expect(resumoDuracao('Instantânea')).toBe('Instantânea');
    expect(resumoDuracao('Especial')).toBe('Especial');
  });

  it('agrupa as 2 variantes de "Até ser dissipada" em "Até dissipar"', () => {
    expect(resumoDuracao('Até ser dissipada')).toBe('Até dissipar');
    expect(resumoDuracao('Até ser dissipada ou acionada')).toBe('Até dissipar');
  });

  it('abrevia "Até X"', () => {
    expect(resumoDuracao('Até 1 hora')).toBe('Até 1h');
    expect(resumoDuracao('Até 1 minuto')).toBe('Até 1min');
    expect(resumoDuracao('Até 8 horas')).toBe('Até 8h');
  });

  it('abrevia "Concentração, até X"', () => {
    expect(resumoDuracao('Concentração, até 1 dia')).toBe('Conc. 1 dia');
    expect(resumoDuracao('Concentração, até 1 hora')).toBe('Conc. 1h');
    expect(resumoDuracao('Concentração, até 1 minuto')).toBe('Conc. 1min');
    expect(resumoDuracao('Concentração, até 10 minutos')).toBe('Conc. 10min');
    expect(resumoDuracao('Concentração, até 2 horas')).toBe('Conc. 2h');
    expect(resumoDuracao('Concentração, até 6 rodadas')).toBe('Conc. 6 rodadas');
    expect(resumoDuracao('Concentração, até 8 horas')).toBe('Conc. 8h');
  });

  it('abrevia tempo fixo puro, mantendo dia/rodada sem abreviação', () => {
    expect(resumoDuracao('1 dia')).toBe('1 dia');
    expect(resumoDuracao('7 dias')).toBe('7 dias');
    expect(resumoDuracao('10 dias')).toBe('10 dias');
    expect(resumoDuracao('30 dias')).toBe('30 dias');
    expect(resumoDuracao('1 rodada')).toBe('1 rodada');
    expect(resumoDuracao('1 hora')).toBe('1h');
    expect(resumoDuracao('8 horas')).toBe('8h');
    expect(resumoDuracao('24 horas')).toBe('24h');
    expect(resumoDuracao('1 minuto')).toBe('1min');
    expect(resumoDuracao('10 minutos')).toBe('10min');
  });

  it('devolve null quando o campo é null', () => {
    expect(resumoDuracao(null)).toBeNull();
  });
});

describe('componentesVSM', () => {
  it('detecta os 3 juntos, com material descrito entre parênteses', () => {
    expect(componentesVSM('V, S, M (uma pitada de sal)')).toEqual({ v: true, s: true, m: true });
  });

  it('detecta só 1 componente', () => {
    expect(componentesVSM('V')).toEqual({ v: true, s: false, m: false });
    expect(componentesVSM('S')).toEqual({ v: false, s: true, m: false });
  });

  it('detecta 2 componentes sem o 3º', () => {
    expect(componentesVSM('V, S')).toEqual({ v: true, s: true, m: false });
    expect(componentesVSM('S, M (um fio de cobre)')).toEqual({ v: false, s: true, m: true });
    expect(componentesVSM('V, M (a língua de uma cobra)')).toEqual({ v: true, s: false, m: true });
  });

  it('ignora o sufixo residual "+N" da planilha', () => {
    expect(componentesVSM('V, S +2')).toEqual({ v: true, s: true, m: false });
    expect(componentesVSM('V, S, M (pelo ou uma pena) +0')).toEqual({ v: true, s: true, m: true });
  });

  it('devolve os 3 como false quando o campo é null', () => {
    expect(componentesVSM(null)).toEqual({ v: false, s: false, m: false });
  });
});
