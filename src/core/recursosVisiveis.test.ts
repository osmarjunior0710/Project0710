import { describe, expect, it } from 'vitest';
import { classes as catalogo } from '../data/rulesets/dnd2024/classes';
import { criarSelecaoInicial } from './personagem';
import { montarRecursosVisiveis, type EntradaRecursosVisiveis } from './recursosVisiveis';

const selecaoCar20 = () => {
  const s = criarSelecaoInicial();
  return { ...s, atributos: { ...s.atributos, CAR: 20, FOR: 20, CON: 20 } };
};

function entrada(classes: EntradaRecursosVisiveis['classes'], gastos: Partial<EntradaRecursosVisiveis['gastos']> = {}): EntradaRecursosVisiveis {
  return {
    classes,
    catalogo,
    selecao: selecaoCar20(),
    gastos: { furia: 0, folego: 0, canalizarDivindade: 0, inspiracao: 0, maosConsagradas: 0, espacosPorClasseECirculo: {}, ...gastos },
  };
}

describe('montarRecursosVisiveis', () => {
  it('Bárbaro nível 1: Fúria com 2 usos, todos disponíveis', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Bárbaro', nivel: 1, subclasse: null }]));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ id: 'furia', nome: 'Fúria', maximo: 2, restantes: 2 });
    expect(r[0].descricao.join(' ')).toContain('Recarrega');
  });

  it('gasto desconta dos restantes e nunca fica negativo', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Bárbaro', nivel: 1, subclasse: null }], { furia: 5 }));
    expect(r[0].restantes).toBe(0);
  });

  it('multiclasse Bárbaro/Bardo/Bruxo mostra as 3 linhas juntas, com o nível de cada classe', () => {
    const r = montarRecursosVisiveis(
      entrada([
        { classe: 'Bárbaro', nivel: 1, subclasse: null },
        { classe: 'Bardo', nivel: 1, subclasse: null },
        { classe: 'Bruxo', nivel: 1, subclasse: null },
      ]),
    );
    expect(r.map((x) => x.id)).toEqual(['furia', 'inspiracao-de-bardo', 'magia-de-pacto']);
    // CAR 20 = +5: Inspiração com 5 usos; Bruxo nível 1 = 1 espaço de Pacto
    expect(r.find((x) => x.id === 'inspiracao-de-bardo')?.maximo).toBe(5);
    expect(r.find((x) => x.id === 'magia-de-pacto')?.maximo).toBe(1);
  });

  it('espaço de Pacto gasto sai dos restantes (chave do pool = nome da classe)', () => {
    const r = montarRecursosVisiveis(
      entrada([{ classe: 'Bruxo', nivel: 1, subclasse: null }], { espacosPorClasseECirculo: { Bruxo: { 1: 1 } } }),
    );
    expect(r[0]).toMatchObject({ id: 'magia-de-pacto', maximo: 1, restantes: 0 });
  });

  it('Guerreiro: Recuperar Fôlego', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Guerreiro', nivel: 1, subclasse: null }], { folego: 1 }));
    expect(r[0]).toMatchObject({ id: 'recuperar-folego', maximo: 2, restantes: 1 });
  });

  it('cada recurso vem com a cor final da classe (core/corRecursoClasse.ts)', () => {
    const r = montarRecursosVisiveis(
      entrada([
        { classe: 'Bárbaro', nivel: 1, subclasse: null },
        { classe: 'Bardo', nivel: 1, subclasse: null },
        { classe: 'Bruxo', nivel: 1, subclasse: null },
        { classe: 'Guerreiro', nivel: 1, subclasse: null },
      ]),
    );
    expect(r.map((x) => x.cor)).toEqual([
      { hex: '#e30039', textoClaro: true },
      { hex: '#e6bb00', textoClaro: true },
      { hex: '#7536eb', textoClaro: true },
      { hex: '#a10028', textoClaro: true },
    ]);
  });

  it('classe sem recurso desse tipo (Mago) e classe fora do catálogo não geram linha', () => {
    expect(montarRecursosVisiveis(entrada([{ classe: 'Mago', nivel: 5, subclasse: null }]))).toEqual([]);
    expect(montarRecursosVisiveis(entrada([{ classe: 'Inventada', nivel: 3, subclasse: null }]))).toEqual([]);
  });
});

describe('Canalizar Divindade (Paladino)', () => {
  it('nível 2: nenhuma linha (só existe a partir do nível 3)', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 2, subclasse: null }]));
    expect(r.find((x) => x.id === 'canalizar-divindade')).toBeUndefined();
  });

  it('nível 3: 2 usos; nível 11: 3 usos', () => {
    const n3 = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 3, subclasse: null }]));
    expect(n3.find((x) => x.id === 'canalizar-divindade')).toMatchObject({ maximo: 2, restantes: 2 });
    const n11 = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 11, subclasse: null }]));
    expect(n11.find((x) => x.id === 'canalizar-divindade')).toMatchObject({ maximo: 3, restantes: 3 });
  });

  it('gasto desconta e nunca fica negativo', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 3, subclasse: null }], { canalizarDivindade: 1 }));
    expect(r.find((x) => x.id === 'canalizar-divindade')?.restantes).toBe(1);
    const r2 = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 3, subclasse: null }], { canalizarDivindade: 9 }));
    expect(r2.find((x) => x.id === 'canalizar-divindade')?.restantes).toBe(0);
  });

  it('descrição diz como recarrega (1 no Curto, todos no Longo)', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 3, subclasse: null }]));
    expect(r.find((x) => x.id === 'canalizar-divindade')?.descricao.join(' ')).toContain('Descanso Curto');
  });
});

describe('Mãos Consagradas (Paladino)', () => {
  it('nível 1: reserva de 5 PV, exibida como barra (não pips)', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 1, subclasse: null }]));
    expect(r.find((x) => x.id === 'maos-consagradas')).toMatchObject({ maximo: 5, restantes: 5, exibicao: 'barra' });
  });

  it('nível 5: reserva de 25 PV', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 5, subclasse: null }]));
    expect(r.find((x) => x.id === 'maos-consagradas')).toMatchObject({ maximo: 25, restantes: 25 });
  });

  it('gasto desconta em PONTOS (não em usos) e nunca fica negativo', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 5, subclasse: null }], { maosConsagradas: 18 }));
    expect(r.find((x) => x.id === 'maos-consagradas')?.restantes).toBe(7);
    const r2 = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 5, subclasse: null }], { maosConsagradas: 999 }));
    expect(r2.find((x) => x.id === 'maos-consagradas')?.restantes).toBe(0);
  });

  it('descrição diz que só recarrega no Descanso Longo', () => {
    const r = montarRecursosVisiveis(entrada([{ classe: 'Paladino', nivel: 5, subclasse: null }]));
    expect(r.find((x) => x.id === 'maos-consagradas')?.descricao.join(' ')).toContain('só no Descanso Longo');
  });
});
