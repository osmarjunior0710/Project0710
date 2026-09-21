import type { ReactNode } from 'react';
import styles from './SidePanel.module.css';

type Side = 'left' | 'right' | 'bottom';

interface SidePanelProps {
  open: boolean;
  side: Side;
  title: string;
  onClose: () => void;
  children: ReactNode;
  detalhesAtivo: boolean;
  onToggleDetalhes: () => void;
}

const temaClass: Record<Side, string> = {
  left: styles.temaAcao,
  right: styles.temaBonus,
  bottom: styles.temaReacao,
};

const sideClass: Record<Side, string> = {
  left: styles.panelLeft,
  right: styles.panelRight,
  bottom: styles.panelBottom,
};

export default function SidePanel({ open, side, title, onClose, children, detalhesAtivo, onToggleDetalhes }: SidePanelProps) {
  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${sideClass[side]} ${temaClass[side]} ${open ? styles.panelOpen : ''}`}>
        <div className={styles.title}>{title}</div>
        <div className={styles.detalhesRow} onClick={onToggleDetalhes}>
          <span>Detalhes</span>
          <div className={`${styles.switchTrack} ${detalhesAtivo ? styles.switchOn : ''}`}>
            <div className={styles.switchThumb} />
          </div>
        </div>
        {children}
        <div className={styles.closeLabel} onClick={onClose}>
          fechar
        </div>
      </div>
    </>
  );
}
