import styles from '../../components/TrocarArmaMaestria.module.css';

interface ImpulsoTelecineticoModalProps {
  dadosRestantes: number;
  ladosDado: number;
  /** Técnicas Telecinéticas (Psiônico, subclasse Psicinético, nível 3) — adiciona a 3ª opção
   * "Com 1d4" (nunca gasta recurso). `false` = card nem aparece, comportamento idêntico a antes. */
  tecnicasTelecineticasDisponivel: boolean;
  onEscolher: (origem: 'nenhum' | 'energia' | 'd4') => void;
  onFechar: () => void;
}

/** Popup do Impulso Telecinético (Psiônico, UA 2025 — Poder Psiônico): mostra o texto da característica e as saídas
 * (sem dado / com Dado de Energia / com 1d4 de Técnicas Telecinéticas / fechar). Mesmo padrão visual de
 * `TecnicaMongeModal.tsx` (cartão central, z-index acima do painel de Ação Bônus). A salvaguarda do alvo vem
 * depois, no `SalvaguardaDoAlvoModal`. */
export default function ImpulsoTelecineticoModal({
  dadosRestantes,
  ladosDado,
  tecnicasTelecineticasDisponivel,
  onEscolher,
  onFechar,
}: ImpulsoTelecineticoModalProps) {
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
        <div className="opt-card" onClick={() => onEscolher('nenhum')}>
          <div className="opt-card-name">Sem dado</div>
          <div className="opt-card-desc">Empurra ou puxa 1,5 m. Não gasta nada.</div>
        </div>
        <div className="opt-card" style={semDado ? { opacity: 0.5, pointerEvents: 'none' } : undefined} onClick={() => onEscolher('energia')}>
          <div className="opt-card-name">
            Com Dado de Energia (d{ladosDado}{semDado ? '' : `, ${dadosRestantes} restante${dadosRestantes === 1 ? '' : 's'}`})
          </div>
          <div className="opt-card-desc">
            {semDado
              ? 'Sem Dados de Energia disponíveis'
              : 'Distância = 5 m × o resultado. Só gasta 1 Dado de Energia se o alvo FALHAR — se passar, não gasta nada.'}
          </div>
        </div>
        {tecnicasTelecineticasDisponivel && (
          <div className="opt-card" onClick={() => onEscolher('d4')}>
            <div className="opt-card-name">Com 1d4 (Técnicas Telecinéticas)</div>
            <div className="opt-card-desc">
              Distância = 5 m × o resultado (1 a 4). Nunca gasta nenhum recurso — mas tende a ser menor que o Dado de Energia.
            </div>
          </div>
        )}
        <div className="btn btn-primary" style={{ marginTop: 12 }} onClick={onFechar}>
          Fechar
        </div>
      </div>
    </div>
  );
}
