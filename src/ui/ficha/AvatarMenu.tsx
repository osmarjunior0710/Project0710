import { useState } from 'react';
import { useRoll } from '../roll/RollContext';
import styles from './AvatarMenu.module.css';

interface AvatarMenuProps {
  itensDetalhados: boolean;
  onToggleItensDetalhados: () => void;
  pesoAtivo: boolean;
  onTogglePeso: () => void;
  /** "⚡ Inst. Level Up" — ferramenta de teste, sobe 1 nível sorteando
   * tudo (mesmo espírito do "🎲 Personagem de Teste"), sem passar por
   * nenhuma tela e sem depender de XP acumulado (ver `XpShell.tsx` e
   * `AtributosTab.tsx` pro fluxo normal, que exige o marco de XP).
   * Mudou pra cá (2026-09, pedido do Osmar) — antes ficava direto no
   * card "nível atual" da aba Atributos. `undefined` quando não tem
   * classe (nada pra subir). */
  onLevelUpRapido?: () => void;
  /** [Ferramenta de teste] Níveis com snapshot salvo (ver
   * `PersonagemSalvo.snapshotsNivel`) — pedido do Osmar (2026-09):
   * "ir até o nível 20 pra testar, voltar e arrumar". Só aparece a
   * seção quando há mais de 1 nível visitado (nada pra escolher com
   * só o atual). */
  niveisComSnapshot: number[];
  nivelAtualSnapshot: number;
  onRestaurarNivel: (nivel: number) => void;
}

/** Avatar no canto superior direito da Ficha — toque abre um menu
 * dropdown com preferências de exibição da Mochila. O menu já nasce
 * pronto pra receber mais preferências depois sem precisar de outro
 * ponto de entrada na UI. */
export default function AvatarMenu({
  itensDetalhados,
  onToggleItensDetalhados,
  pesoAtivo,
  onTogglePeso,
  onLevelUpRapido,
  niveisComSnapshot,
  nivelAtualSnapshot,
  onRestaurarNivel,
}: AvatarMenuProps) {
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
            {onLevelUpRapido && (
              <div
                className={styles.menuRow}
                onClick={() => {
                  onLevelUpRapido();
                  setAberto(false);
                }}
              >
                <div className={styles.menuRowText}>
                  <div className={styles.menuRowLabel}>⚡ Inst. Level Up</div>
                  <div className={styles.menuRowDesc}>
                    Sobe 1 nível sorteando tudo, sem passar pelo fluxo normal e sem precisar de XP — ferramenta de
                    teste.
                  </div>
                </div>
                <span className={styles.menuRowChevron}>›</span>
              </div>
            )}
            {niveisComSnapshot.length > 1 && (
              <>
                <div className={styles.menuTitle}>🕰️ Voltar pra nível (teste)</div>
                <div className={styles.snapshotDesc}>
                  Cada nível já visitado guarda seu próprio estado — pular pra um deles recarrega a Ficha nesse
                  ponto. Atenção: voltar pra um nível anterior apaga os snapshots dos níveis ACIMA dele (ex: ir do
                  15 pro 12 apaga 13/14/15 — subir de novo a partir do 12 cria eles de novo).
                </div>
                <div className={styles.snapshotRow}>
                  {niveisComSnapshot.map((nivel) => (
                    <div
                      key={nivel}
                      className={`${styles.snapshotChip} ${nivel === nivelAtualSnapshot ? styles.snapshotChipAtual : ''}`}
                      onClick={() => {
                        if (nivel === nivelAtualSnapshot) return;
                        onRestaurarNivel(nivel);
                        setAberto(false);
                      }}
                    >
                      {nivel}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
