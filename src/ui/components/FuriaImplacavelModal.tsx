import styles from './TrocarArmaMaestria.module.css';
import InfoValor from './InfoValor';
import type { ExplicacaoCalculo } from '../../core/calculoPersonagem';

interface FuriaImplacavelModalProps {
  /** 'oferta' = ainda não rolou (mostra CD + botão de rolar); 'resultado'
   * = dado já rolado, mostra sucesso (curar) ou falha (Inconsciente). */
  fase: 'oferta' | 'resultado';
  /** CD da salvaguarda de Constituição (10 + 5× tentativas desde o
   * último descanso — ver `core/furiaImplacavel.ts`, `cdFuriaImplacavel`). */
  cd: number;
  mod: number;
  explicacaoMod: ExplicacaoCalculo;
  /** Só relevante na fase 'resultado'. */
  passou: boolean;
  /** PV que a cura aplica em caso de sucesso (2× nível de Bárbaro). */
  pvCura: number;
  onRolar: () => void;
  onDispensar: () => void;
  onCurar: () => void;
  onFechar: () => void;
}

/** Modal de Fúria Implacável (Bárbaro nível 11) — aparece ao cair a 0
 * PV com a Fúria ativa (`FichaShell.tsx`, `alterarPv`). Mesmo padrão
 * visual/estrutural de `ColheitaMacabraModal` (popup centralizado,
 * `TrocarArmaMaestria.module.css`, vive no `FichaShell` pra sobreviver
 * troca de aba). Diferente de uma salvaguarda-vs-CD normal (onde o app
 * nunca modela a comparação, só mostra a CD e deixa o jogador dizer se
 * passou), aqui o app já sabe o resultado — a Salvaguarda de
 * Constituição É a rolagem que decide se o PERSONAGEM fica de pé, não
 * uma reação de outra criatura fora do app — então rola o d20 pelo
 * `rolarD20` de sempre (mesmo popup padrão) e já resolve sucesso/falha
 * sozinho. */
export default function FuriaImplacavelModal({
  fase,
  cd,
  mod,
  explicacaoMod,
  passou,
  pvCura,
  onRolar,
  onDispensar,
  onCurar,
  onFechar,
}: FuriaImplacavelModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 50 }} onClick={fase === 'oferta' ? onDispensar : undefined}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>😡 Fúria Implacável</div>
        {fase === 'oferta' ? (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14 }}>
              Você caiu a 0 Pontos de Vida com a Fúria ativa. Fazer a Salvaguarda de Constituição?
            </div>
            <div style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 4 }}>
              CD {cd} <InfoValor titulo="Salvaguarda de Constituição" explicacao={explicacaoMod} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 14 }}>
              1d20 {mod >= 0 ? '+' : '-'} {Math.abs(mod)}
            </div>
            <div className="btn btn-primary" style={{ padding: 12, textAlign: 'center', marginBottom: 8 }} onClick={onRolar}>
              🎲 Rolar Salvaguarda
            </div>
            <div className={styles.close} onClick={onDispensar}>
              Dispensar (fica Inconsciente)
            </div>
          </>
        ) : passou ? (
          <>
            <div style={{ fontSize: 13, color: 'var(--good)', marginBottom: 14 }}>✅ Sucesso!</div>
            <div
              className="btn"
              style={{
                padding: 12,
                textAlign: 'center',
                background: 'var(--good)',
                borderColor: 'var(--good)',
                color: '#fff',
                fontWeight: 'bold',
              }}
              onClick={onCurar}
            >
              Curar {pvCura} PV
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--danger)', marginBottom: 14 }}>
              🩸 Inconsciente
            </div>
            <div className={styles.close} onClick={onFechar}>
              Fechar
            </div>
          </>
        )}
      </div>
    </div>
  );
}
