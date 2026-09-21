import { useState } from 'react';
import styles from '../../components/TrocarArmaMaestria.module.css';

interface PvManualModalProps {
  /** `dano` > 0 tira PV; cura devolve. Sempre passa o valor já com sinal
   * (`-n` dano, `+n` cura) pro mesmo `onAlterarPv` dos botões −5/+5. */
  onAplicar: (delta: number) => void;
  onFechar: () => void;
}

/** Campo pra digitar um valor de PV e aplicar como dano (vermelho) ou
 * cura (verde) — aplica e fecha, pra a animação da barra ficar visível. */
export default function PvManualModal({ onAplicar, onFechar }: PvManualModalProps) {
  const [texto, setTexto] = useState('');
  const valor = Number.parseInt(texto, 10);
  const valido = Number.isFinite(valor) && valor > 0;

  function aplicar(sinal: 1 | -1) {
    if (!valido) return;
    onAplicar(sinal * valor);
    onFechar();
  }

  const estiloBotao = (cor: string) => ({
    flex: 1,
    minHeight: 44,
    borderRadius: 'var(--shape-sm)',
    border: 'none',
    background: cor,
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: valido ? 'pointer' : 'default',
    opacity: valido ? 1 : 0.4,
  });

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>❤️ Pontos de Vida — valor manual</div>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          autoFocus
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Quantos pontos?"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            fontSize: 22,
            padding: 'var(--space-3)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            textAlign: 'center',
            marginBottom: 'var(--space-3)',
            background: 'var(--panel)',
            color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={estiloBotao('var(--danger)')} onClick={() => aplicar(-1)}>
            Tomar dano
          </div>
          <div style={estiloBotao('var(--good)')} onClick={() => aplicar(1)}>
            Curar
          </div>
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
