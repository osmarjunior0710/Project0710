import { useState } from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import styles from './InfoValor.module.css';

interface InfoTextoProps {
  titulo: string;
  /** Um parágrafo por item. */
  paragrafos: string[];
}

/** "ⓘ" que abre um popup só de texto explicativo (título + parágrafos) —
 * mesmo ícone/popup do `InfoValor`, só que sem tabela de conta (ele é
 * pra número calculado; este é pra explicar uma regra). */
export default function InfoTexto({ titulo, paragrafos }: InfoTextoProps) {
  const [aberto, setAberto] = useState(false);
  useLockBodyScroll(aberto);

  return (
    <>
      <span
        className={styles.icon}
        onClick={(e) => {
          e.stopPropagation();
          setAberto(true);
        }}
      >
        ⓘ
      </span>
      {aberto && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            e.stopPropagation();
            setAberto(false);
          }}
        >
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>{titulo}</div>
            {paragrafos.map((p, i) => (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 10px', textTransform: 'none' }}>
                {p}
              </p>
            ))}
            <div
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                setAberto(false);
              }}
            >
              fechar
            </div>
          </div>
        </div>
      )}
    </>
  );
}
