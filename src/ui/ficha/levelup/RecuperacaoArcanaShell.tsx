import { useState } from 'react';
import {
  circulosElegiveisRecuperacaoArcana,
  custoEscolhaRecuperacaoArcana,
  escolhaValidaRecuperacaoArcana,
} from '../../../core/recuperacaoArcana';
import TickPips from '../../components/TickPips';
import styles from './LevelUpShell.module.css';
import distribuirStyles from '../../components/DistribuirPontosAtributo.module.css';

interface RecuperacaoArcanaShellProps {
  /** Espaços gastos por círculo, ANTES de qualquer recuperação desta
   * tela — a mesma referência usada pra travar cada linha no que
   * realmente foi gasto. */
  espacosGastosPorCirculo: Record<number, number>;
  /** Orçamento de círculo combinado (metade do nível de Mago,
   * arredondado pra cima — ver `orcamentoRecuperacaoArcana`). */
  orcamento: number;
  onConfirmar: (escolha: Record<number, number>) => void;
  onFechar: () => void;
}

/** Recuperação Arcana (Mago, nível 1, Descanso Curto) — escolhe quantos
 * espaços gastos recuperar por círculo, travado em 2 limites por linha:
 * não passa do que foi GASTO naquele círculo, e não passa do
 * ORÇAMENTO combinado que sobra somando todos os círculos (ver
 * sdd/sdd-mago-caracteristicas-base.md). Mesmo padrão visual de
 * `DistribuirPontosAtributo.tsx` (linha + stepper −/N/+ com 2 travas),
 * adaptado pra círculo em vez de atributo — reaproveita o mesmo CSS
 * (CLAUDE.md §6.5). Os pips de `TickPips` mostram cinza = ainda gasto,
 * azul = marcado pra recuperar (pedido do Osmar). */
export default function RecuperacaoArcanaShell({
  espacosGastosPorCirculo,
  orcamento,
  onConfirmar,
  onFechar,
}: RecuperacaoArcanaShellProps) {
  const circulos = circulosElegiveisRecuperacaoArcana(espacosGastosPorCirculo);
  const [escolha, setEscolha] = useState<Record<number, number>>(() =>
    Object.fromEntries(circulos.map((c) => [c, 0])),
  );

  const custo = custoEscolhaRecuperacaoArcana(escolha);
  const restante = orcamento - custo;
  const valido = escolhaValidaRecuperacaoArcana(escolha, espacosGastosPorCirculo, orcamento);

  function incrementar(circulo: number) {
    setEscolha((prev) => ({ ...prev, [circulo]: (prev[circulo] ?? 0) + 1 }));
  }
  function decrementar(circulo: number) {
    setEscolha((prev) => ({ ...prev, [circulo]: Math.max(0, (prev[circulo] ?? 0) - 1) }));
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>Recuperação Arcana</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="label" style={{ marginBottom: 8 }}>
          Escolha quais Espaços de Magia gastos recuperar — orçamento de {orcamento} círculo(s) combinado(s). Faltam{' '}
          {restante}.
        </div>
        <div className={distribuirStyles.headerRow}>
          <span>Círculo</span>
          <span>Recuperar</span>
        </div>
        {circulos.map((circulo) => {
          const gasto = espacosGastosPorCirculo[circulo] ?? 0;
          const nesse = escolha[circulo] ?? 0;
          const podeIncrementar = nesse < gasto && circulo <= restante;
          return (
            <div key={circulo} className={distribuirStyles.row}>
              <span>{circulo}º círculo</span>
              <span className={distribuirStyles.stepper}>
                <TickPips total={gasto} usados={gasto - nesse} tamanho="sm" />
                <div
                  className={distribuirStyles.btn}
                  style={nesse === 0 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                  onClick={() => decrementar(circulo)}
                >
                  −
                </div>
                <span>{nesse}</span>
                <div
                  className={distribuirStyles.btn}
                  style={!podeIncrementar ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
                  onClick={() => incrementar(circulo)}
                >
                  +
                </div>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onFechar}>
          ← Cancelar
        </div>
        <div className={`btn btn-primary ${styles.pill}`} onClick={() => valido && onConfirmar(escolha)}>
          Confirmar ✓
        </div>
      </div>
    </div>
  );
}
