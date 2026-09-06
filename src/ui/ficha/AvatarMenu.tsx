import { useState } from 'react';
import { useRoll } from '../roll/RollContext';
import styles from './AvatarMenu.module.css';

interface AvatarMenuProps {
  itensDetalhados: boolean;
  onToggleItensDetalhados: () => void;
  pesoAtivo: boolean;
  onTogglePeso: () => void;
}

/** Avatar no canto superior direito da Ficha — toque abre um menu
 * dropdown com preferências de exibição da Mochila. O menu já nasce
 * pronto pra receber mais preferências depois sem precisar de outro
 * ponto de entrada na UI. */
export default function AvatarMenu({ itensDetalhados, onToggleItensDetalhados, pesoAtivo, onTogglePeso }: AvatarMenuProps) {
  const [aberto, setAberto] = useState(false);
  const { modoTeste, alternarModoTeste } = useRoll();

  const preferencias = [
    {
      label: 'Itens detalhados',
      desc: 'Mostra a descrição de cada item direto na Mochila',
      valor: itensDetalhados,
      onToggle: onToggleItensDetalhados,
    },
    {
      label: 'Peso da Mochila',
      desc: 'Mostra o peso de cada item e a barra de carga',
      valor: pesoAtivo,
      onToggle: onTogglePeso,
    },
    {
      label: '🎲 Modo de Teste',
      desc: 'Todo d20 sai fixo em 1, 10, 15, 20 (em sequência) — dano continua de verdade. Desliga sozinho ao recarregar a página.',
      valor: modoTeste,
      onToggle: alternarModoTeste,
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.avatar} onClick={() => setAberto((v) => !v)}>
        👤
        {modoTeste && <div className={styles.badgeModoTeste} title="Modo de Teste ativo" />}
      </div>
      {aberto && (
        <>
          <div className={styles.backdrop} onClick={() => setAberto(false)} />
          <div className={styles.menu}>
            <div className={styles.menuTitle}>Preferências</div>
            {preferencias.map((p) => (
              <div key={p.label} className={styles.menuRow} onClick={p.onToggle}>
                <div className={styles.menuRowText}>
                  <div className={styles.menuRowLabel}>{p.label}</div>
                  <div className={styles.menuRowDesc}>{p.desc}</div>
                </div>
                <div className={`${styles.switchTrack} ${p.valor ? styles.switchOn : ''}`}>
                  <div className={styles.switchThumb} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
