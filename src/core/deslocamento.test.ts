import { describe, expect, it } from 'vitest';
import {
  calcularDeslocamento,
  deslocamentoDaEspecie,
  forcaMinimaDaArmadura,
  formatarMetros,
  type EntradaDeslocamento,
} from './deslocamento';

const base: EntradaDeslocamento = {
  baseEspecieM: 9,
  armaduraEquipada: false,
  armaduraPesada: false,
  escudoEquipado: false,
  forcaMinimaArmadura: null,
  forcaPersonagem: 10,
  bonusMovimentoSemArmaduraM: 0,
  temMovimentoRapido: false,
  temVelocista: false,
  temDadivaDaVelocidade: false,
  formaGrandeAtiva: false,
  passoDestrutivoAtivo: false,
  niveisExaustao: 0,
};

describe('parse e formatação', () => {
  it('lê metros da espécie, com vírgula decimal', () => {
    expect(deslocamentoDaEspecie('9 metros')).toBe(9);
    expect(deslocamentoDaEspecie('10,5 metros')).toBe(10.5);
    expect(deslocamentoDaEspecie('')).toBe(null);
    expect(deslocamentoDaEspecie(undefined)).toBe(null);
  });
  it('lê a Força mínima da armadura', () => {
    expect(forcaMinimaDaArmadura('For 13')).toBe(13);
    expect(forcaMinimaDaArmadura('—')).toBe(null);
  });
  it('formata metros no padrão do app', () => {
    expect(formatarMetros(9)).toBe('9 m');
    expect(formatarMetros(10.5)).toBe('10,5 m');
  });
});

describe('calcularDeslocamento', () => {
  it('só a base da espécie quando não há nenhuma outra fonte', () => {
    const r = calcularDeslocamento(base);
    expect(r.totalM).toBe(9);
    expect(r.explicacao.linhas).toEqual([{ label: 'Base da espécie', valor: '9 m' }]);
  });

  it('sub-espécie substitui a base (Elfo Silvestre 10,5 m) e aparece no rótulo', () => {
    const r = calcularDeslocamento({ ...base, baseSubespecieM: 10.5, rotuloSubespecie: 'Elfo Silvestre' });
    expect(r.totalM).toBe(10.5);
    expect(r.explicacao.linhas[0]).toEqual({ label: 'Base — Elfo Silvestre', valor: '10,5 m' });
  });

  it('Monge sem armadura nem escudo soma Movimento sem Armadura', () => {
    const r = calcularDeslocamento({ ...base, bonusMovimentoSemArmaduraM: 4.5 });
    expect(r.totalM).toBe(13.5);
    expect(r.explicacao.total.valor).toBe('13,5 m');
  });

  it('Monge com armadura OU escudo equipado perde o bônus, e o ⓘ mostra o motivo', () => {
    const comArmadura = calcularDeslocamento({ ...base, bonusMovimentoSemArmaduraM: 3, armaduraEquipada: true });
    expect(comArmadura.totalM).toBe(9);
    expect(comArmadura.explicacao.linhas[1].label).toContain('inativo: armadura equipada');
    expect(comArmadura.explicacao.linhas[1].valor).toBe('(+3 m)');
    const comEscudo = calcularDeslocamento({ ...base, bonusMovimentoSemArmaduraM: 3, escudoEquipado: true });
    expect(comEscudo.totalM).toBe(9);
    expect(comEscudo.explicacao.linhas[1].label).toContain('inativo: escudo equipado');
  });

  it('Bárbaro soma Movimento Rápido, exceto com Armadura Pesada (armadura média ainda vale)', () => {
    expect(calcularDeslocamento({ ...base, temMovimentoRapido: true }).totalM).toBe(12);
    expect(calcularDeslocamento({ ...base, temMovimentoRapido: true, armaduraEquipada: true }).totalM).toBe(12);
    expect(calcularDeslocamento({ ...base, temMovimentoRapido: true, armaduraEquipada: true, armaduraPesada: true }).totalM).toBe(9);
  });

  it('Força abaixo do mínimo da armadura reduz 3 m; Força suficiente não reduz', () => {
    const fraco = calcularDeslocamento({ ...base, armaduraEquipada: true, armaduraPesada: true, forcaMinimaArmadura: 13, forcaPersonagem: 12 });
    expect(fraco.totalM).toBe(6);
    const forte = calcularDeslocamento({ ...base, armaduraEquipada: true, armaduraPesada: true, forcaMinimaArmadura: 13, forcaPersonagem: 13 });
    expect(forte.totalM).toBe(9);
  });

  it('talentos, Forma Grande e Passo Destrutivo somam; efeitos temporários só quando ligados', () => {
    const r = calcularDeslocamento({ ...base, temVelocista: true, temDadivaDaVelocidade: true, formaGrandeAtiva: true, passoDestrutivoAtivo: true });
    expect(r.totalM).toBe(9 + 3 + 9 + 3 + 6);
  });

  it('Exaustão reduz 1,5 m por nível; nunca fica negativo', () => {
    expect(calcularDeslocamento({ ...base, niveisExaustao: 2 }).totalM).toBe(6);
    expect(calcularDeslocamento({ ...base, niveisExaustao: 10 }).totalM).toBe(0);
  });

  it('borda: personagem sem espécie tem base 0; extras (itens futuros) entram na soma', () => {
    expect(calcularDeslocamento({ ...base, baseEspecieM: null }).totalM).toBe(0);
    const r = calcularDeslocamento({
      ...base,
      extras: [{ id: 'botas', rotulo: 'Botas (teste)', metros: 3, tem: true, ativa: true }],
    });
    expect(r.totalM).toBe(12);
  });
});
