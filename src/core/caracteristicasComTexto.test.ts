import { describe, expect, it } from 'vitest';
import { classes } from '../data/rulesets/dnd2024/classes';
import { caracteristicasClasse } from '../data/rulesets/dnd2024/caracteristicasClasse';

/** Guarda do postmortem do Monge (2026-10): as 22 características do Monge ficaram meses sem texto
 * importado e ninguém percebeu, porque a progressão já listava os nomes. Toda característica NOMEADA na
 * progressão de uma classe precisa ter o texto em `caracteristicasClasse.ts` — ou estar nesta lista de
 * exceções CONHECIDAS (com o motivo). Nome novo sem texto quebra este teste de propósito. */
const EXCECOES: Record<string, string> = {
  'Característica de Subclasse': 'vaga genérica: o texto vem da subclasse escolhida (caracteristicasSubclasse.ts)',
  'Especialização': 'Bardo nível 9: tratada pelo mecanismo de Especialista (nome da tabela ≠ nome da característica)',
};

function ehArcanaMistica(nome: string): boolean {
  return nome.startsWith('Arcana Mística (');
}

describe('toda característica da progressão tem texto importado', () => {
  it('nenhuma característica de nenhuma classe fica sem texto (fora as exceções conhecidas)', () => {
    const faltando: string[] = [];
    for (const c of classes) {
      for (const p of c.progressao) {
        for (const nome of p.caracteristicas) {
          if (EXCECOES[nome] || ehArcanaMistica(nome)) continue; // Arcana Mística (6º-9º círculo): 1 entrada genérica
          if (!caracteristicasClasse.some((f) => f.classe === c.nome && f.nome === nome)) faltando.push(`${c.nome} ${p.nivel}: ${nome}`);
        }
      }
    }
    expect(faltando, `Características sem texto: ${faltando.join('; ')}`).toEqual([]);
  });

  it('borda: o Monge (caso que motivou o teste) tem as 21 características únicas do nível 1 ao 20 com texto', () => {
    const monge = classes.find((c) => c.nome === 'Monge');
    expect(monge).toBeDefined();
    const nomes = new Set(monge!.progressao.flatMap((p) => p.caracteristicas).filter((n) => !EXCECOES[n]));
    for (const nome of nomes) {
      expect(caracteristicasClasse.some((f) => f.classe === 'Monge' && f.nome === nome), nome).toBe(true);
    }
    expect(nomes.size).toBeGreaterThanOrEqual(20);
  });
});
