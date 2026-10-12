import { corDoRecursoDaClasse } from '../../core/corRecursoClasse';
import TickPips from './TickPips';
import styles from './TrocarArmaMaestria.module.css';

interface DisciplinaPosConjuracaoModalProps {
  nome: string;
  descricao: string;
  /** Quantos Dados de Energia Psiônica essa escolha gasta — 1 (Aperfeiçoamento de Precognição/
   * Insinuação do Id) ou o mod. de Inteligência, que pode ser 0/negativo (Bio-Retorno/Pensamentos
   * Destrutivos — aí não rola nada, só garante o mínimo de 1 do próprio texto da regra). */
  quantidadeDados: number;
  dadosMaximo: number;
  dadosRestantes: number;
  /** Lados do Dado de Energia Psiônica (d6/d8/d10/d12, escala por nível) —
   * só pro rótulo "Dados de Energia Psiônica (dN)", igual ao resto do app
   * (ver `RecursosDeClasse.tsx`). */
  dadosLados: number;
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
  dadosMaximo,
  dadosRestantes,
  dadosLados,
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
        {quantidadeDados > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 14 }}>
            <span style={{ fontSize: 13 }}>Dados de Energia Psiônica (d{dadosLados})</span>
            <TickPips total={dadosMaximo} usados={dadosMaximo - dadosRestantes} cor={corDoRecursoDaClasse('Psiônico')} />
          </div>
        )}
        <div
          className="btn btn-primary"
          style={{ marginBottom: 8, opacity: semDados ? 0.5 : 1, pointerEvents: semDados ? 'none' : 'auto' }}
          onClick={onUsar}
        >
          {quantidadeDados > 0
            ? `Gastar ${custo} Dado${custo > 1 ? 's' : ''} de Energia Psiônica`
            : 'Usar (mínimo garantido, sem dado pra rolar)'}
        </div>
        <div className="btn" onClick={onDispensar}>
          Não usar
        </div>
      </div>
    </div>
  );
}
