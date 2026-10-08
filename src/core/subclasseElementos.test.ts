import { describe, expect, it } from 'vitest';
import { subclasseImplementada } from './levelUp';
import { caracteristicasSubclasse } from '../data/rulesets/dnd2024/caracteristicasSubclasse';

describe('Monge — Combatente dos Elementos (dado importado)', () => {
  const doElementos = caracteristicasSubclasse.filter((c) => c.subclasse === 'Combatente dos Elementos');

  it('libera a escolha da subclasse (tem característica importada) e as outras 3 continuam bloqueadas', () => {
    expect(subclasseImplementada('Combatente dos Elementos')).toBe(true);
    expect(subclasseImplementada('Combatente da Mão Espalmada')).toBe(false);
  });

  it('tem as 5 características nos níveis certos', () => {
    expect(doElementos.map((c) => [c.nivel, c.nome])).toEqual([
      [3, 'Manipular Elementos'],
      [3, 'Sintonia Elemental'],
      [6, 'Explosão Elemental'],
      [11, 'Passo dos Elementos'],
      [17, 'Ápice Elemental'],
    ]);
  });

  it('borda: o nível 17 não carrega o texto do capítulo do Paladino colado na planilha', () => {
    const apice = doElementos.find((c) => c.nome === 'Ápice Elemental');
    expect(apice?.descricao).not.toContain('Paladino');
    expect(apice?.descricao.endsWith('Trovejante. No início de cada um dos seus turnos, você pode alterar essa escolha.')).toBe(true);
  });
});
