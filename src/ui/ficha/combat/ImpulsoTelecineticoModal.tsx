import styles from '../../components/TrocarArmaMaestria.module.css';

interface ImpulsoTelecineticoModalProps {
  dadosRestantes: number;
  ladosDado: number;
  onEscolher: (comDado: boolean) => void;
  onFechar: () => void;
}

/** Popup do Impulso Telecinético (Psiônico, UA 2025 — Poder Psiônico): mostra o texto da característica e as 3 saídas
 * (sem dado / com Dado de Energia / fechar). Mesmo padrão visual de `TecnicaMongeModal.tsx` (cartão central, z-index acima
 * do painel de Ação Bônus). A salvaguarda do alvo vem depois, no `SalvaguardaDoAlvoModal`. */
export default function ImpulsoTelecineticoModal({ dadosRestantes, ladosDado, onEscolher, onFechar }: ImpulsoTelecineticoModalProps) {
  const semDado = dadosRestantes <= 0;
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>💥 Impulso Telecinético</div>
        <div style={{ fontSize: 12, marginBottom: 12, textAlign: 'left' }}>
          Como uma Ação Bônus, escolha uma criatura Grande ou menor que você possa ver a até 9 metros. O alvo deve passar em um teste de
          resistência de Força ou será empurrado (ou puxado — à sua escolha) para uma direção reta a uma distância igual a 1,5 metros.
          Alternativamente, você pode rolar um Dado de Energia Psiônica ao realizar esta Ação Bônus, e a distância percorrida é igual a 5
          vezes o número rolado. O dado só é gasto se o alvo falhar na resistência.
        </div>
        <div className="opt-card" onClick={() => onEscolher(false)}>
          <div className="opt-card-name">Sem dado</div>
          <div className="opt-card-desc">Empurra ou puxa 1,5 m</div>
        </div>
        <div className="opt-card" style={semDado ? { opacity: 0.5, pointerEvents: 'none' } : undefined} onClick={() => onEscolher(true)}>
          <div className="opt-card-name">Com Dado de Energia (d{ladosDado})</div>
          <div className="opt-card-desc">
            {semDado ? 'Sem Dados de Energia disponíveis' : 'Distância = 5 m × o resultado; o dado só é gasto se o alvo falhar'}
          </div>
        </div>
        <div className="btn btn-primary" style={{ marginTop: 12 }} onClick={onFechar}>
          Fechar
        </div>
      </div>
    </div>
  );
}
