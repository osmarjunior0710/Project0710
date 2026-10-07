import styles from '../../components/TrocarArmaMaestria.module.css';

interface AvisoModalProps {
  titulo: string;
  texto: string;
  onFechar: () => void;
}

/** Popup genérico pra resultado informativo SEM rolagem nem escolha —
 * só um aviso que o jogador precisa ler (ex.: Queda Lenta, "reduza o
 * dano em X"). Osmar pediu (2026-10): deixar esse tipo de resultado
 * só como `feedback` no corpo da aba Combate é fácil de não notar
 * (mesmo motivo que tirou as 3 técnicas do Monge de dentro do painel
 * — ver `TecnicaMongeModal.tsx`/`DECISOES-COMBATE.md`). Reaproveita o
 * mesmo card flutuante central (`TrocarArmaMaestria.module.css`),
 * z-index explícito acima do `SidePanel` (110/111) pelo mesmo motivo:
 * abre bem na hora de fechar o painel de Reação. */
export default function AvisoModal({ titulo, texto, onFechar }: AvisoModalProps) {
  return (
    <div className={styles.overlay} style={{ zIndex: 120 }} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{titulo}</div>
        <div style={{ fontSize: 14, marginBottom: 16 }}>{texto}</div>
        <div className="btn btn-primary" onClick={onFechar}>
          Ok
        </div>
      </div>
    </div>
  );
}
