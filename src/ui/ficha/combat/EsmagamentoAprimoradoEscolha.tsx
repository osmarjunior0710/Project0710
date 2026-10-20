import styles from '../../components/TrocarArmaMaestria.module.css';

interface EsmagamentoAprimoradoEscolhaProps {
  dadosRestantes: number;
  dadosLados: number;
  onRolarNormal: () => void;
  onUsarAprimorado: () => void;
}

/** Esmagamento Telecinético Aprimorado (Psiônico, subclasse Psicinético, nível 10) — mesmo
 * padrão de `SobrecargaEscolha.tsx` (cartão central, 2 saídas). Aparece SÓ quando
 * `esmagamentoAprimoradoElegivel` é `true`. */
export default function EsmagamentoAprimoradoEscolha({
  dadosRestantes,
  dadosLados,
  onRolarNormal,
  onUsarAprimorado,
}: EsmagamentoAprimoradoEscolhaProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>💥 Esmagamento Telecinético Aprimorado</div>
        <div style={{ fontSize: 13, marginBottom: 16 }}>
          Você pode gastar 1 Dado de Energia Psiônica (d{dadosLados}, {dadosRestantes} restante
          {dadosRestantes === 1 ? '' : 's'}) pra somar o resultado ao dano E reduzir o Deslocamento do alvo à metade até o
          início do seu próximo turno — vale falhando ou passando na salvaguarda.
        </div>
        <div className="btn btn-primary" onClick={onRolarNormal}>
          🎲 Rolar Dano Normal
        </div>
        <div className="btn" style={{ marginTop: 8 }} onClick={onUsarAprimorado}>
          💥 Gastar 1 Dado de Energia (d{dadosLados})
        </div>
      </div>
    </div>
  );
}
