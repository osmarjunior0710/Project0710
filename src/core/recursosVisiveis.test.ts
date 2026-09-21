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
    gastos: { furia: 0, folego: 0, inspiracao: 0, espacosPorClasseECirculo: {}, ...gastos },
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

  it('classe sem recurso desse tipo (Mago) e classe fora do catálogo não geram linha', () => {
    expect(montarRecursosVisiveis(entrada([{ classe: 'Mago', nivel: 5, subclasse: null }]))).toEqual([]);
    expect(montarRecursosVisiveis(entrada([{ classe: 'Inventada', nivel: 3, subclasse: null }]))).toEqual([]);
  });
});
