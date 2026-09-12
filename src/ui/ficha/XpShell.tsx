import { useState } from 'react';
import styles from '../components/TrocarArmaMaestria.module.css';

interface XpShellProps {
  xpAtual: number;
  /** `null` = já no nível máximo (20), não tem próximo marco. */
  proximoMarco: { nivel: number; xpNecessario: number } | null;
  /** Sempre delta positivo — soma quando `onAjustar(valor)`, subtrai
   * quando `onAjustar(-valor)`, nunca deixa o total ficar negativo. */
  onAjustar: (delta: number) => void;
  onFechar: () => void;
}

/** Popup de "quanto de XP" — separado do "⚡ Inst. Level Up" (pedido
 * do Osmar, 2026-09): esse aqui só ACUMULA XP, sem subir de nível
 * sozinho. A seta de Level Up (no card "nível atual" da aba
 * Atributos) só fica ativa quando o total aqui bate o marco do
 * próximo nível — ver `core/experiencia.ts`. Mesmo padrão visual de
 * popup centralizado do resto do app (reaproveita
 * `TrocarArmaMaestria.module.css`, ver `ColheitaMacabraModal.tsx`). */
export default function XpShell({ xpAtual, proximoMarco, onAjustar, onFechar }: XpShellProps) {
  const [valorTexto, setValorTexto] = useState('');
  const valor = parseInt(valorTexto, 10);
  const valorValido = Number.isInteger(valor) && valor > 0;

  function aplicar(sinal: 1 | -1) {
    if (!valorValido) return;
    onAjustar(sinal * valor);
    setValorTexto('');
  }

  return (
    <div className={styles.overlay} style={{ zIndex: 50 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>✨ Experiência (XP)</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', margin: '4px 0 4px' }}>{xpAtual} XP</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 14 }}>
          {proximoMarco
            ? `Faltam ${Math.max(0, proximoMarco.xpNecessario - xpAtual)} XP pro nível ${proximoMarco.nivel} (marco: ${proximoMarco.xpNecessario})`
            : 'Nível máximo (20) — não tem próximo marco de XP.'}
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="Quanto de XP?"
          value={valorTexto}
          onChange={(e) => setValorTexto(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--shape-sm)',
            color: 'var(--text)',
            fontFamily: 'inherit',
            fontSize: 16,
            marginBottom: 10,
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            className="btn btn-primary"
            style={{ flex: 1, padding: 12, textAlign: 'center', opacity: valorValido ? 1 : 0.5 }}
            onClick={() => aplicar(1)}
          >
            ➕ Adicionar
          </div>
          <div className="btn" style={{ flex: 1, padding: 12, textAlign: 'center', opacity: valorValido ? 1 : 0.5 }} onClick={() => aplicar(-1)}>
            ➖ Remover
          </div>
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
