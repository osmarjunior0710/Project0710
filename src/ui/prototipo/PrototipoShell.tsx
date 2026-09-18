import { useNavigate } from 'react-router-dom';
import { cenasPrototipo } from './cenas';
import styles from './PrototipoShell.module.css';

/** Lista de cenas do ambiente de Protótipo (`/prototipo`) — ferramenta
 * interna (Osmar + Claude Code), não uma feature do jogo. Serve pra
 * validar fluxo/UX em baixa fidelidade, clicando na tela, antes de
 * decidir a versão final. Ver `sdd/sdd-fluxo-rolagem.md`. */
export default function PrototipoShell() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <span className="back" onClick={() => navigate('/lista')}>
          ←
        </span>
        <div>
          <div className={styles.headerTitle}>🧪 Protótipos</div>
          <div className="label">ambiente interno, sem dado real de personagem</div>
        </div>
      </div>

      <p className={styles.aviso}>
        Cada cena testa um fluxo de interação isolado, com estado de mentirinha — nada aqui
        afeta personagem nenhum. Serve pra decidir "como deveria funcionar" antes de implementar
        de verdade.
      </p>

      {cenasPrototipo.map((cena) => (
        <div
          key={cena.id}
          className={`box ${styles.cena}`}
          onClick={() => navigate(`/prototipo/${cena.id}`)}
        >
          <div className={styles.cenaTitulo}>{cena.titulo}</div>
          <div className={styles.cenaDescricao}>{cena.descricao}</div>
        </div>
      ))}
    </div>
  );
}
