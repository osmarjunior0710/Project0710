import { useState } from 'react';
import { useRoll } from '../roll/RollContext';
import type { HouseRules } from '../../core/houseRules';
import SidePanel from './combat/SidePanel';
import styles from './AvatarMenu.module.css';

interface AvatarMenuProps {
  itensDetalhados: boolean;
  onToggleItensDetalhados: () => void;
  houseRules: HouseRules;
  onAlternarHouseRule: (chave: keyof HouseRules) => void;
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
  houseRules,
  onAlternarHouseRule,
  onLevelUpRapido,
  niveisComSnapshot,
  nivelAtualSnapshot,
  onRestaurarNivel,
}: AvatarMenuProps) {
  const [aberto, setAberto] = useState(false);
  const [houseRulesAberto, setHouseRulesAberto] = useState(false);
  const { modoTeste, alternarModoTeste, preferenciaDado3D, alternarPreferenciaDado3D, dado3DDisponivel } = useRoll();

  const descDado3D = !dado3DDisponivel
    ? 'Seu aparelho não suporta gráficos 3D (WebGL) — usando o dado clássico.'
    : modoTeste
      ? 'Desligado enquanto o Modo de Teste está ativo (física de verdade não combina com resultado fixo).'
      : 'Rolagens oficiais do jogo usam física de verdade em vez de sorteio. Desligado = dado clássico.';

  const dado3DTravado = !dado3DDisponivel || modoTeste;

  const preferencias = [
    {
      label: 'Itens detalhados',
      desc: 'Mostra a descrição de cada item direto na Mochila',
      valor: itensDetalhados,
      onToggle: onToggleItensDetalhados,
      desabilitado: false,
    },
    {
      label: '🎲 Dado 3D',
      desc: descDado3D,
      valor: preferenciaDado3D && dado3DDisponivel && !modoTeste,
      onToggle: dado3DTravado ? () => {} : alternarPreferenciaDado3D,
      desabilitado: dado3DTravado,
    },
    {
      label: '🎲 Modo de Teste',
      desc: 'Todo d20 sai fixo em 1, 10, 15, 20 (em sequência) — dano continua de verdade. Desliga sozinho ao recarregar a página.',
      valor: modoTeste,
      onToggle: alternarModoTeste,
      desabilitado: false,
    },
  ];

  // Regras de jogo da mesa — salvas por conta (ver `core/houseRules.ts`).
  const regrasDaCasa = [
    {
      chave: 'pesoMochila' as const,
      label: 'Peso da Mochila',
      desc: 'Mostra o peso de cada item e a barra de carga',
    },
    {
      chave: 'pesoMoedas' as const,
      label: 'Peso das moedas',
      desc: 'Conta o peso das moedas na carga da Mochila (100 moedas = 1 kg). Só vale com o Peso da Mochila ligado.',
    },
    {
      chave: 'confirmacaoCritico' as const,
      label: 'Confirmação de crítico',
      desc: 'Ao tirar 1 ou 20 natural em um ataque, rola um 2º d20 de confirmação (só informativo — o Mestre decide) antes do dano.',
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
              <div
                key={p.label}
                className={`${styles.menuRow} ${p.desabilitado ? styles.menuRowDesabilitado : ''}`}
                onClick={p.onToggle}
              >
                <div className={styles.menuRowText}>
                  <div className={styles.menuRowLabel}>{p.label}</div>
                  <div className={styles.menuRowDesc}>{p.desc}</div>
                </div>
                <div className={`${styles.switchTrack} ${p.valor ? styles.switchOn : ''}`}>
                  <div className={styles.switchThumb} />
                </div>
              </div>
            ))}
            <div
              className={styles.menuRow}
              onClick={() => {
                setHouseRulesAberto(true);
                setAberto(false);
              }}
            >
              <div className={styles.menuRowText}>
                <div className={styles.menuRowLabel}>📜 House Rules</div>
                <div className={styles.menuRowDesc}>Regras da mesa — valem pra todos os seus personagens.</div>
              </div>
              <span className={styles.menuRowChevron}>›</span>
            </div>
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
      <SidePanel
        open={houseRulesAberto}
        side="right"
        tema="casa"
        title="📜 House Rules"
        onClose={() => setHouseRulesAberto(false)}
      >
        {regrasDaCasa.map((r) => (
          <div key={r.chave} className={styles.menuRow} onClick={() => onAlternarHouseRule(r.chave)}>
            <div className={styles.menuRowText}>
              <div className={styles.menuRowLabel}>{r.label}</div>
              <div className={styles.menuRowDesc}>{r.desc}</div>
            </div>
            <div className={`${styles.switchTrack} ${houseRules[r.chave] ? styles.switchOn : ''}`}>
              <div className={styles.switchThumb} />
            </div>
          </div>
        ))}
      </SidePanel>
    </div>
  );
}
