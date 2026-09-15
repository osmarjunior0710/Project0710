import styles from './TrocarArmaMaestria.module.css';

interface FuriaImplacavelModalProps {
  /** CD da salvaguarda de Constituição (10 + 5× tentativas desde o
   * último descanso — ver `core/furiaImplacavel.ts`, `cdFuriaImplacavel`). */
  cd: number;
  onPassou: () => void;
  onDispensar: () => void;
}

/** Modal de Fúria Implacável (Bárbaro nível 11) — aparece ao cair a 0
 * PV com a Fúria ativa (`FichaShell.tsx`, `alterarPv`). Mesmo padrão
 * visual/estrutural de `ColheitaMacabraModal` (popup centralizado,
 * `TrocarArmaMaestria.module.css`, vive no `FichaShell` pra sobreviver
 * troca de aba). O app nunca modela a salvaguarda em si (mesmo
 * princípio de "o jogador decide se acertou" de todo ataque/CD) — o
 * jogador rola a própria Salvaguarda de Constituição na aba Atributos
 * contra a CD mostrada aqui, e diz o resultado tocando um dos 2
 * botões. */
export default function FuriaImplacavelModal({ cd, onPassou, onDispensar }: FuriaImplacavelModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 50 }} onClick={onDispensar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>😡 Fúria Implacável</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14 }}>
          Você caiu a 0 Pontos de Vida com a Fúria ativa. Role sua Salvaguarda de Constituição (aba Atributos) contra
          CD {cd} — passou?
        </div>
        <div className="btn btn-primary" style={{ padding: 12, textAlign: 'center', marginBottom: 8 }} onClick={onPassou}>
          ✅ Passou — PV vira o dobro do nível de Bárbaro
        </div>
        <div className={styles.close} onClick={onDispensar}>
          Dispensar (PV fica em 0)
        </div>
      </div>
    </div>
  );
}
