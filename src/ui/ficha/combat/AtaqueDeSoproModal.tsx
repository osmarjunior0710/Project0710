import styles from '../../components/TrocarArmaMaestria.module.css';

interface AtaqueDeSoproModalProps {
  cd: number | null;
  tipoDano: string | null;
  numDados: number;
  onRolarDano: () => void;
  onFechar: () => void;
}

/** Popup "Ataque de Sopro" (Draconato) — mesmo padrão visual de
 * "Lançar no Inferno" (popup pequeno centralizado, botão "Rolar
 * Dano" aciona `rolarDados` do RollContext). Substitui um ataque —
 * Cone de 4,5m ou Linha de 9m×1,5m (escolha na hora, não modelado
 * aqui). O app não calcula sucesso/falha do alvo sozinho — rola
 * sempre o dano cheio, o jogador reduz à metade na mesa se o alvo
 * passar na salvaguarda. */
export default function AtaqueDeSoproModal({ cd, tipoDano, numDados, onRolarDano, onFechar }: AtaqueDeSoproModalProps) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>Ataque de Sopro</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvos na área fazem salvaguarda de Destreza</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>CD {cd ?? '—'}</div>
        <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 4 }}>✅ Sucesso: metade do dano</div>
        <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 14 }}>
          ❌ Falha: {numDados}d10 de dano {tipoDano ?? '—'} (Cone de 4,5m ou Linha de 9m×1,5m, à sua escolha)
        </div>
        <div className="btn btn-primary" style={{ padding: 12 }} onClick={onRolarDano}>
          🎲 Rolar Dano ({numDados}d10 {tipoDano ?? ''})
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
