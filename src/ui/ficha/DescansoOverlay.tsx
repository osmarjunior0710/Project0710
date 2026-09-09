import { useEffect, useRef, useState } from 'react';
import styles from './DescansoOverlay.module.css';

export type TipoDescanso = 'curto' | 'longo';
export type FaseDescanso = 'entrando' | 'perguntaRedefinir' | 'saindo';

/** Descanso Curto: 0,5s fade-in + 0,5s fade-out (1s total). Descanso
 * Longo: 1s + 1s (2s total) — pedido explícito do Osmar, ver
 * EmDevB.md A6.1. */
const DURACAO_MS: Record<TipoDescanso, number> = { curto: 500, longo: 1000 };

interface DescansoOverlayProps {
  tipo: TipoDescanso;
  fase: FaseDescanso;
  /** Chamado quando o fade-in termina (tela já 100% preta) — é aqui
   * que o reset de verdade (`descansoCurto`/`descansoLongo`) deve
   * acontecer, escondido atrás da tela preta. */
  onFadeInCompleto: () => void;
  /** Só relevante na fase `perguntaRedefinir` (Descanso Longo de quem
   * tem redefinição livre — hoje só Mago). */
  onResponderRedefinir: (sim: boolean) => void;
  /** Chamado quando o fade-out termina — hora de desmontar o overlay. */
  onFimAnimacao: () => void;
}

/** Overlay genérico de transição de Descanso (fade pro preto, nome do
 * descanso em branco no meio, fade de volta) — mesmo padrão de overlay
 * de tela cheia (`position: fixed`) já usado por RollOverlay/
 * LevelUpShell, ver DECISOES-DESIGN.md. Fica montado por cima da tela
 * normal (não substitui, ver `FichaShell.tsx`) — assim o fade-in
 * escurece o que já estava na tela em vez de cortar direto pro preto.
 *
 * A fase `perguntaRedefinir` (Descanso Longo, classe com redefinição
 * livre) pausa a animação com a tela já 100% preta — só quando o
 * jogador responde Sim/Não o `FichaShell` decide o próximo passo
 * (abrir a tela de escolha, ou já mandar pra fase `saindo`). */
export default function DescansoOverlay({ tipo, fase, onFadeInCompleto, onResponderRedefinir, onFimAnimacao }: DescansoOverlayProps) {
  const duracao = DURACAO_MS[tipo];
  const [opaco, setOpaco] = useState(fase !== 'entrando');

  const onFadeInCompletoRef = useRef(onFadeInCompleto);
  onFadeInCompletoRef.current = onFadeInCompleto;
  const onFimAnimacaoRef = useRef(onFimAnimacao);
  onFimAnimacaoRef.current = onFimAnimacao;

  useEffect(() => {
    if (fase !== 'entrando') return;
    const id = requestAnimationFrame(() => setOpaco(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fase === 'entrando') {
      const t = setTimeout(() => onFadeInCompletoRef.current(), duracao);
      return () => clearTimeout(t);
    }
    if (fase === 'saindo') {
      setOpaco(false);
      const t = setTimeout(() => onFimAnimacaoRef.current(), duracao);
      return () => clearTimeout(t);
    }
  }, [fase, duracao]);

  return (
    <div className={styles.overlay} style={{ opacity: opaco ? 1 : 0, transitionDuration: `${duracao}ms` }}>
      {fase === 'perguntaRedefinir' ? (
        <div className={styles.pergunta}>
          <div className={styles.texto}>Quer alterar suas magias preparadas?</div>
          <div className={styles.botoes}>
            <div className={styles.botao} onClick={() => onResponderRedefinir(false)}>
              Não
            </div>
            <div className={`${styles.botao} ${styles.botaoPrimario}`} onClick={() => onResponderRedefinir(true)}>
              Sim
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.texto}>{tipo === 'curto' ? 'Descanso Curto' : 'Descanso Longo'}</div>
      )}
    </div>
  );
}
