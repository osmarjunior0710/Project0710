import styles from './TrocarArmaMaestria.module.css';

interface DisciplinaPosConjuracaoModalProps {
  nome: string;
  descricao: string;
  /** Quantos Dados de Energia Psiônica essa escolha gasta — 1 (Aperfeiçoamento de Precognição/
   * Insinuação do Id) ou o mod. de Inteligência, que pode ser 0/negativo (Bio-Retorno/Pensamentos
   * Destrutivos — aí não rola nada, só garante o mínimo de 1 do próprio texto da regra). */
  quantidadeDados: number;
  dadosRestantes: number;
  onUsar: () => void;
  onDispensar: () => void;
}

/** Popup pós-conjuração das 4 Disciplinas Psiônicas que dependem da escola da magia (Psiônico UA,
 * E4c) — mesmo padrão central de `TecnicaMongeModal.tsx`/`ColheitaMacabraModal.tsx`: o jogador decide
 * usar ou não, nunca automático (texto da regra é sempre "você pode gastar"). Vive em
 * `FichaShell.tsx` (não dentro da aba Magias/Combate) — sobrevive à troca de aba, igual a Colheita
 * Macabra, já que a magia pode ter sido conjurada em qualquer uma das duas. */
export default function DisciplinaPosConjuracaoModal({
  nome,
  descricao,
  quantidadeDados,
  dadosRestantes,
  onUsar,
  onDispensar,
}: DisciplinaPosConjuracaoModalProps) {
  const custo = Math.max(1, quantidadeDados);
  const semDados = quantidadeDados > 0 && dadosRestantes < custo;
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onDispensar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>🔮 {nome}</div>
        <div style={{ fontSize: 13, marginBottom: 14 }}>{descricao}</div>
        <div
          className="btn btn-primary"
          style={{ marginBottom: 8, opacity: semDados ? 0.5 : 1, pointerEvents: semDados ? 'none' : 'auto' }}
          onClick={onUsar}
        >
          {quantidadeDados > 0
            ? `Gastar ${custo} Dado${custo > 1 ? 's' : ''} de Energia Psiônica (${dadosRestantes} restante${dadosRestantes === 1 ? '' : 's'})`
            : 'Usar (mínimo garantido, sem dado pra rolar)'}
        </div>
        <div className="btn" onClick={onDispensar}>
          Não usar
        </div>
      </div>
    </div>
  );
}
