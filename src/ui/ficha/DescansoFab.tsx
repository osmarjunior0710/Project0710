import { useEffect, useRef, useState } from 'react';
import styles from './DescansoFab.module.css';

interface DescansoFabProps {
  onDescansoCurto: () => void;
  onDescansoLongo: () => void;
}

/** FAB de Descanso (Curto/Longo) — mesmo padrão do FAB de dados
 * (`dice3d/Dice3dFab.tsx`): toque expande uma coluna de botões alinhada
 * à direita, tocar fora colapsa. Ancorado à esquerda do FAB de dados pra
 * nunca competir pelo mesmo espaço. Só dispara `onDescanso*` — a
 * transição e o reset de verdade moram no `FichaShell`. */
export default function DescansoFab({ onDescansoCurto, onDescansoLongo }: DescansoFabProps) {
  const [aberto, setAberto] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(e: PointerEvent) {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener('pointerdown', aoClicarFora);
    return () => document.removeEventListener('pointerdown', aoClicarFora);
  }, [aberto]);

  function escolher(acao: () => void) {
    setAberto(false);
    acao();
  }

  return (
    <div ref={raizRef}>
      {aberto && (
        <div className={styles.coluna}>
          <div className={styles.menuBtn} onClick={() => escolher(onDescansoLongo)}>
            🌙 Descanso Longo <span className={styles.duracao}>8 horas</span>
          </div>
          <div className={styles.menuBtn} onClick={() => escolher(onDescansoCurto)}>
            ☕ Descanso Curto <span className={styles.duracao}>1 hora</span>
          </div>
        </div>
      )}
      <div
        className={`${styles.fab} ${aberto ? styles.fabAberto : ''}`}
        onClick={() => setAberto((v) => !v)}
        aria-label="Descanso"
      >
        😴
      </div>
    </div>
  );
}
