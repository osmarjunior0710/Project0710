import { useEffect, useRef, useState } from 'react';
import styles from './DescansoFab.module.css';

interface DescansoFabItem {
  label: string;
  sufixo?: string;
  onClick: () => void;
}

interface DescansoFabProps {
  icone: string;
  itens: DescansoFabItem[];
}

/** FAB único (canto inferior esquerdo, acima da tabbar) — toque expande
 * uma coluna de botões alinhada à esquerda, tocar fora colapsa. Mesmo
 * padrão do FAB de dados (`dice3d/Dice3dFab.tsx`). Genérico o
 * suficiente pra 2 usos hoje: Descanso (Curto/Longo, `FichaShell`,
 * sempre visível fora da aba Combate) e Fim de Turno (1 item só,
 * `CombatTab`, só existe enquanto essa aba está montada — mesmo
 * espaço na tela, nunca os 2 ao mesmo tempo). */
export default function DescansoFab({ icone, itens }: DescansoFabProps) {
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
          {itens.map((item) => (
            <div key={item.label} className={styles.menuBtn} onClick={() => escolher(item.onClick)}>
              {item.label} {item.sufixo && <span className={styles.duracao}>{item.sufixo}</span>}
            </div>
          ))}
        </div>
      )}
      <div
        className={`${styles.fab} ${aberto ? styles.fabAberto : ''}`}
        onClick={() => setAberto((v) => !v)}
        aria-label="Ações rápidas"
      >
        <span className={styles.fabIcone}>{icone}</span>
      </div>
    </div>
  );
}
