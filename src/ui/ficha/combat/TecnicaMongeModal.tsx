import styles from '../../components/TrocarArmaMaestria.module.css';

export type TipoTecnicaMonge = 'defesa-paciente' | 'passo-do-vento' | 'torrente';

interface TecnicaMongeModalProps {
  tipo: TipoTecnicaMonge;
  pontosDeFocoMaximo: number;
  pontosDeFocoRestantes: number;
  onEscolher: (comFoco: boolean) => void;
  onFechar: () => void;
}

const INFO: Record<TipoTecnicaMonge, { titulo: string; icone: string; graca: string; foco: string }> = {
  'defesa-paciente': {
    titulo: 'Defesa Paciente',
    icone: '🥋',
    graca: 'Esquivar (Ação Bônus)',
    foco: 'Esquivar + Desengajar (Ação Bônus)',
  },
  'passo-do-vento': {
    titulo: 'Passo do Vento',
    icone: '💨',
    graca: 'Correr ou Desengajar (Ação Bônus)',
    foco: 'Correr ou Desengajar (Ação Bônus) + salto dobrado de distância',
  },
  torrente: {
    titulo: 'Torrente de Golpes',
    icone: '👊',
    graca: '1 Ataque Desarmado extra (Ação Bônus)',
    foco: '2 Ataques Desarmados extras (Ação Bônus)',
  },
};

/** Popup de escolha "de graça" vs "gastar 1 Ponto de Foco" pras 3
 * técnicas do Monge (ver sdd/sdd-monge.md seção 4) — mesmo padrão
 * visual de `MaosConsagradasModal.tsx` (cartão flutuante central, não
 * mais uma sub-tela dentro do painel de Ação Bônus — pedido do Osmar,
 * 2026-10). Pra Torrente de Golpes, escolher aqui já dispara o 1º
 * Ataque Desarmado na hora (ver `CombatTab.tsx` `escolherTecnicaMonge`)
 * — o jogador não precisa reabrir o painel de Ação Bônus pra atacar. */
export default function TecnicaMongeModal({
  tipo,
  pontosDeFocoMaximo,
  pontosDeFocoRestantes,
  onEscolher,
  onFechar,
}: TecnicaMongeModalProps) {
  const info = INFO[tipo];
  const semFoco = pontosDeFocoRestantes <= 0;

  function escolher(comFoco: boolean) {
    onEscolher(comFoco);
    onFechar();
  }

  return (
    // z-index explícito: o painel de Ação Bônus (`SidePanel.module.css`)
    // usa 110/111, acima do 55 padrão de `.overlay` — o popup abre
    // bem na hora de fechar aquele painel (mesma transição), então
    // precisa ficar por cima dele enquanto desliza pra fora.
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {info.icone} {info.titulo}
        </div>
        <div className="opt-card" onClick={() => escolher(false)}>
          <div className="opt-card-name">De graça</div>
          <div className="opt-card-desc">{info.graca}</div>
        </div>
        <div
          className="opt-card"
          style={semFoco ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          onClick={() => escolher(true)}
        >
          <div className="opt-card-name">
            Gastar 1 Ponto de Foco ({pontosDeFocoRestantes}/{pontosDeFocoMaximo})
          </div>
          <div className="opt-card-desc">{info.foco}</div>
        </div>
        <div className={styles.close} onClick={onFechar}>
          fechar
        </div>
      </div>
    </div>
  );
}
