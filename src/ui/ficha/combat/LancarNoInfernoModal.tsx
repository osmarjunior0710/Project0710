import styles from '../../components/TrocarArmaMaestria.module.css';
import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';
import InfoValor from '../../components/InfoValor';

interface LancarNoInfernoModalProps {
  cd: number | null;
  /** Quebra da CD (B8) — `null` quando `cd` também é `null`. */
  explicacaoCd: ExplicacaoCalculo | null;
  onRolarDano: () => void;
  onFechar: () => void;
}

/** Popup "Lançar no Inferno" (Bruxo, Patrono Ínfero, nível 14) — abre
 * ao tocar o card no Combat, depois de acertar um ataque. Reaproveita
 * o CSS genérico de `TrocarArmaMaestria`/`TrocarValorSimples` (mesmo
 * padrão visual de popup pequeno centralizado). "Rolar Dano" fecha
 * este popup e aciona `rolarDados` (RollContext) — mesma tela de
 * rolagem já usada em qualquer outro dado avulso do app, não duplica
 * animação própria. */
export default function LancarNoInfernoModal({ cd, explicacaoCd, onRolarDano, onFechar }: LancarNoInfernoModalProps) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>Lançar no Inferno</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Alvo faz salvaguarda de Carisma</div>
        <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 12 }}>
          CD {cd ?? '—'} {explicacaoCd && <InfoValor titulo="Lançar no Inferno" explicacao={explicacaoCd} />}
        </div>
        <div style={{ fontSize: 12, color: 'var(--good)', marginBottom: 4 }}>✅ Sucesso: evita a magia</div>
        <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 14 }}>
          ❌ Falha: 8d10 de dano Psíquico (Ínferos não sofrem) + Incapacitado até o final do seu próximo turno
        </div>
        <div className="btn btn-primary" style={{ padding: 12 }} onClick={onRolarDano}>
          🎲 Rolar Dano (8d10 Psíquico)
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
