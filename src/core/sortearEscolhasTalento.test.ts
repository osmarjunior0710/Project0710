import { describe, expect, it } from 'vitest';
import { talentosOrigem } from '../data/rulesets/dnd2024/talentos';
import type { ConcessoesJaConcedidas } from './concessoesJaConcedidas';
import { opcoesProficienciaDoTalento, sortearMagiaIniciada, sortearProficienciasDoTalento } from './sortearEscolhasTalento';

const vazio = (): ConcessoesJaConcedidas => ({
  pericias: new Map(),
  ferramentas: new Map(),
  truques: new Map(),
  magias: new Map(),
});

const musico = talentosOrigem.find((t) => t.nome === 'Músico');
if (!musico) throw new Error('Fixture "Músico" não encontrada');

describe('sortearProficienciasDoTalento (Músico: 3 instrumentos)', () => {
  it('escolhe 3 instrumentos distintos do grupo', () => {
    const r = sortearProficienciasDoTalento(musico, vazio());
    expect(r).toHaveLength(3);
    expect(new Set(r).size).toBe(3);
    expect(r.every((n) => opcoesProficienciaDoTalento(musico)!.opcoes.includes(n))).toBe(true);
  });

  it('nunca sorteia o que o personagem já possui (ex.: Oboé vindo da Origem)', () => {
    const ja = vazio();
    ja.ferramentas.set('Oboé', 'Origem');
    for (let i = 0; i < 60; i++) expect(sortearProficienciasDoTalento(musico, ja)).not.toContain('Oboé');
  });

  it('mantém o que já estava marcado', () => {
    const r = sortearProficienciasDoTalento(musico, vazio(), ['Lira']);
    expect(r[0]).toBe('Lira');
    expect(r).toHaveLength(3);
  });
});

describe('sortearMagiaIniciada', () => {
  it('2 truques + 1 magia da lista, sem o que já veio de outra fonte, e atributo válido', () => {
    const ja = vazio();
    ja.truques.set('Raio de Fogo', 'Classe');
    ja.magias.set('Mísseis Mágicos', 'Classe');
    for (let i = 0; i < 40; i++) {
      const r = sortearMagiaIniciada('Mago', ja);
      expect(r.truques).toHaveLength(2);
      expect(r.truques).not.toContain('Raio de Fogo');
      expect(r.magia).not.toBeNull();
      expect(r.magia).not.toBe('Mísseis Mágicos');
      expect(['INT', 'SAB', 'CAR']).toContain(r.atributo);
    }
  });

  it('o que veio do próprio Talento não conta como "já possui" (pode ficar)', () => {
    const ja = vazio();
    ja.truques.set('Raio de Fogo', 'Talento');
    const usaramRaio = Array.from({ length: 200 }, () => sortearMagiaIniciada('Mago', ja, Math.random).truques).some((t) => t.includes('Raio de Fogo'));
    expect(usaramRaio).toBe(true);
  });
});
