import styles from './TrocarArmaMaestria.module.css';

interface AtivarEfeitoModalProps {
  titulo: string;
  textoEfeito: string;
  /** Ex.: "Este efeito só pode ser usado uma vez por turno." — só
   * quando o efeito tiver essa restrição; some pra quem não tiver. */
  restricaoTexto?: string | null;
  onAtivar: () => void;
  onNaoUsar: () => void;
}

/** Popup "Ativar efeito", 3ª peça do Fluxo Acerto/Erro pra
 * característica que dispara automaticamente ao ACERTAR (sem nada pra
 * renunciar antes, diferente do Golpe Brutal) — ex.: Esmagador/
 * Talhador. Disparado pelo `confirmarFechamento` do popup de dano,
 * mesmo padrão do `EscolherEfeitoModal`, mas formato diferente: 1
 * efeito só (não é escolha entre vários) e 2 botões — "Ativar" aplica
 * e marca o uso; "Não usar" fecha sem marcar nada, deixando o talento
 * livre pro PRÓXIMO ataque do mesmo turno (o jogador pode guardar pra
 * um alvo melhor). Tocar fora do card conta como "Não usar". */
export default function AtivarEfeitoModal({
  titulo,
  textoEfeito,
  restricaoTexto,
  onAtivar,
  onNaoUsar,
}: AtivarEfeitoModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 60 }} onClick={onNaoUsar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        <div className="opt-card" style={{ marginBottom: 10 }}>
          <div className="opt-card-name">Ativar efeito</div>
          <div className="opt-card-desc">
            {textoEfeito}
            {restricaoTexto && (
              <>
                <br />
                <br />
                {restricaoTexto}
              </>
            )}
          </div>
        </div>
        <div className="btn btn-primary" style={{ marginBottom: 8 }} onClick={onAtivar}>
          ✅ Ativar
        </div>
        <div className="btn" onClick={onNaoUsar}>
          🚫 Não usar
        </div>
      </div>
    </div>
  );
}
