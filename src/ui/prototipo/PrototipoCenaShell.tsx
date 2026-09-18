import { useParams, useNavigate } from 'react-router-dom';
import { cenasPrototipo } from './cenas';
import styles from './PrototipoShell.module.css';

/** Uma cena individual do ambiente de Protótipo (`/prototipo/:cenaId`).
 * Só resolve o id pelo catálogo e renderiza — cada cena é dona do seu
 * próprio estado/UI, este shell não sabe nada de fluxo de rolagem. */
export default function PrototipoCenaShell() {
  const { cenaId } = useParams<{ cenaId: string }>();
  const navigate = useNavigate();
  const cena = cenasPrototipo.find((c) => c.id === cenaId);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <span className="back" onClick={() => navigate('/prototipo')}>
          ←
        </span>
        <div className={styles.headerTitle}>{cena ? cena.titulo : 'Cena não encontrada'}</div>
      </div>

      {cena ? <cena.Componente /> : <p className={styles.aviso}>Essa cena não existe (mais).</p>}
    </div>
  );
}
