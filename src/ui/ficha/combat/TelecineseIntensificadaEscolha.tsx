import styles from '../../components/TrocarArmaMaestria.module.css';

interface TelecineseIntensificadaEscolhaProps {
  dadosRestantes: number;
  dadosLados: number;
  onConjurarNormal: () => void;
  onConjurarSemConcentracao: () => void;
}

/** Telecinese Intensificada (Psiônico, subclasse Psicinético, nível 14) — mesmo padrão de
 * `SobrecargaEscolha.tsx`/`EsmagamentoAprimoradoEscolha.tsx` (cartão central, 2 saídas). Diferente
 * dos outros 2: aqui os 4 Dados de Energia já são gastos nos DOIS caminhos (não é "gastar ou não",
 * é "qual versão da magia") — por isso as 2 opções usam o mesmo estilo neutro (`.opt-card`), sem
 * destacar uma em roxo, já que nenhuma das duas é "mais cara" que a outra. */
export default function TelecineseIntensificadaEscolha({
  dadosRestantes,
  dadosLados,
  onConjurarNormal,
  onConjurarSemConcentracao,
}: TelecineseIntensificadaEscolhaProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>💠 Telecinese Intensificada</div>
        <div style={{ fontSize: 13, marginBottom: 16 }}>
          Vai gastar 4 Dados de Energia Psiônica (d{dadosLados}, {dadosRestantes} restante{dadosRestantes === 1 ? '' : 's'})
          em vez de um Espaço de Magia — nos 2 casos abaixo. Escolha a versão:
        </div>
        <div className="opt-card" onClick={onConjurarNormal}>
          <div className="opt-card-name">Conjurar Normal</div>
          <div className="opt-card-desc">Concentração, até 10 minutos. Alvo: criatura ou objeto Enorme ou menor.</div>
        </div>
        <div className="opt-card" style={{ marginTop: 8 }} onClick={onConjurarSemConcentracao}>
          <div className="opt-card-name">Conjurar Sem Concentração</div>
          <div className="opt-card-desc">Dura só 1 minuto (não precisa manter Concentração). Alvo: criatura ou objeto até Colossal.</div>
        </div>
      </div>
    </div>
  );
}
