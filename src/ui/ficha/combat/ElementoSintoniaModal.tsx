import styles from '../../components/TrocarArmaMaestria.module.css';
import { ELEMENTOS_SINTONIA } from '../../../core/ataquesElementais';

interface ElementoSintoniaModalProps {
  /** Título/subtítulo — padrão = Ataques Elementais; a Explosão Elemental reaproveita
   * o mesmo modal só trocando o texto. */
  titulo?: string;
  descricao?: string;
  onEscolher: (elemento: string) => void;
  onFechar: () => void;
}

const ICONE: Record<string, string> = {
  Ácido: '🧪',
  Elétrico: '⚡',
  Gélido: '❄️',
  Ígneo: '🔥',
  Trovejante: '🌩',
};

/** Escolha do elemento dos Ataques Elementais (Monge, Combatente dos
 * Elementos, Sintonia Elemental ativa) — 2ª tela aberta pelo botão
 * "🌪 Elemental" do popup de dano do Ataque Desarmado. Mesmo padrão de
 * `TecnicaMongeModal.tsx` (cartão central com `opt-card`s, z-index acima
 * dos painéis laterais). "fechar" = não usar o elemento nesse ataque. */
export default function ElementoSintoniaModal({ titulo, descricao, onEscolher, onFechar }: ElementoSintoniaModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo ?? '🌪 Ataques Elementais — escolha o tipo de dano'}</div>
        <div className="label" style={{ marginBottom: 8 }}>
          {descricao ?? 'Esse Ataque Desarmado causa o dano do elemento em vez do tipo normal.'}
        </div>
        {ELEMENTOS_SINTONIA.map((elemento) => (
          <div key={elemento} className="opt-card" onClick={() => onEscolher(elemento)}>
            <div className="opt-card-name">
              {ICONE[elemento]} {elemento}
            </div>
          </div>
        ))}
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
