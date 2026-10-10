import styles from '../../components/TrocarArmaMaestria.module.css';

/** Primeira pergunta da Torrente de Golpes / Ataque Desarmado Adicional (Monge), logo depois de
 * escolher "de graça" ou "gastar Foco": o jogador só vai atacar (a sequência roda direto, sem
 * perguntas) ou quer poder Empurrar/Imobilizar (aí cada ataque pergunta Dano/Empurrar/Imobilizar
 * antes de rolar). Desenho do Osmar, 2026-10. "fechar" cancela a Torrente (nada foi gasto ainda). */
export function ModoTorrenteModal({
  onEscolher,
  onFechar,
}: {
  onEscolher: (modo: 'dano' | 'escolher') => void;
  onFechar: () => void;
}) {
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>👊 Torrente de Golpes — o que você vai fazer?</div>
        <div className="opt-card" onClick={() => onEscolher('dano')}>
          <div className="opt-card-name">🗡 Só atacar</div>
          <div className="opt-card-desc">Os ataques rodam em sequência, direto, sem perguntar nada no meio.</div>
        </div>
        <div className="opt-card" onClick={() => onEscolher('escolher')}>
          <div className="opt-card-name">🤼 Atacar, empurrar ou imobilizar</div>
          <div className="opt-card-desc">Antes de cada ataque você escolhe entre Dano, Empurrar ou Imobilizar.</div>
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}

/** Pergunta de CADA ataque da sequência quando o jogador escolheu "Atacar, empurrar ou imobilizar".
 * Sem "fechar": é uma decisão obrigatória pra o ataque seguir. */
export function OpcaoAtaqueTorrenteModal({
  numero,
  total,
  onEscolher,
}: {
  numero: number;
  total: number;
  onEscolher: (opcao: 'dano' | 'empurrar' | 'imobilizar') => void;
}) {
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          👊 Torrente de Golpes — ataque {numero}/{total}
        </div>
        <div className="opt-card" onClick={() => onEscolher('dano')}>
          <div className="opt-card-name">👊 Dano</div>
          <div className="opt-card-desc">Jogada de ataque; se acertar, dano.</div>
        </div>
        <div className="opt-card" onClick={() => onEscolher('empurrar')}>
          <div className="opt-card-name">🤼 Empurrar</div>
          <div className="opt-card-desc">Sem jogada de ataque: o alvo faz salvaguarda.</div>
        </div>
        <div className="opt-card" onClick={() => onEscolher('imobilizar')}>
          <div className="opt-card-name">🤝 Imobilizar</div>
          <div className="opt-card-desc">Sem jogada de ataque: o alvo faz salvaguarda. Precisa de uma mão livre.</div>
        </div>
      </div>
    </div>
  );
}
