import styles from '../../components/TrocarArmaMaestria.module.css';

interface SobrecargaEscolhaProps {
  nomeMagia: string;
  danoMaximo: number;
  onRolarNormal: () => void;
  onUsarSobrecarga: () => void;
}

/** Sobrecarga (Mago/Evocador, nível 14, regra oficial — ver
 * `core/evocador.ts`): em vez de rolar o dano de uma magia de Mago
 * conjurada com espaço de 1º a 5º círculo, o jogador pode escolher
 * causar dano máximo. Aparece SÓ quando `sobrecargaElegivel` é `true`
 * — reaproveita o mesmo par overlay/card de `SalvaguardaDoAlvoModal`. */
export default function SobrecargaEscolha({ nomeMagia, danoMaximo, onRolarNormal, onUsarSobrecarga }: SobrecargaEscolhaProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>☠️ Sobrecarga — {nomeMagia}</div>
        <div style={{ fontSize: 13, marginBottom: 16 }}>
          Regra oficial: em vez de rolar, você pode causar dano máximo com essa magia. Usar de novo antes do próximo Descanso Longo
          causa dano Necrótico em você mesmo (escala a cada uso extra).
        </div>
        <div className="btn btn-primary" onClick={onRolarNormal}>
          🎲 Rolar Dano
        </div>
        <div className="btn" style={{ marginTop: 8 }} onClick={onUsarSobrecarga}>
          ☠️ Sobrecarga — {danoMaximo} de dano máximo
        </div>
      </div>
    </div>
  );
}
