import type { EfeitoAoAcertar } from '../../core/efeitosAoAcertar';
import styles from './TrocarArmaMaestria.module.css';

interface EscolherProximoEfeitoModalProps {
  opcoes: EfeitoAoAcertar[];
  onEscolher: (id: string) => void;
}

/** Fila de efeitos "ao acertar" com 2+ marcados: pergunta qual resolver primeiro. Tocar numa opção já abre o
 * efeito (sem botão OK); quando sobra só 1, ele entra sozinho e este modal nem aparece. Não fecha tocando fora. */
export default function EscolherProximoEfeitoModal({ opcoes, onEscolher }: EscolherProximoEfeitoModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }}>
      <div className={styles.card}>
        <div className={styles.title}>Qual efeito primeiro?</div>
        {opcoes.map((efeito) => (
          <div key={efeito.id} className="opt-card" onClick={() => onEscolher(efeito.id)}>
            <div className="opt-card-name">
              {efeito.nome}
              <span
                style={{
                  marginLeft: 6,
                  padding: '0 6px',
                  border: '1px solid var(--accent)',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 'normal',
                  color: 'var(--accent)',
                }}
              >
                {efeito.origem}
              </span>
            </div>
            <div className="opt-card-desc">{efeito.descricao}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
