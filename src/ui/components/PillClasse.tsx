import { corDoRecursoDaClasse, type CorRecurso } from '../../core/corRecursoClasse';
import styles from './PillClasse.module.css';

const CLASSE_DA_COR: Record<CorRecurso, string> = {
  vermelho: styles.pillVermelho,
  roxo: styles.pillRoxo,
  mostarda: styles.pillMostarda,
  azul: styles.pillAzul,
  'azul-claro': styles.pillAzulClaro,
};

/** Selo pequeno com o NOME da classe, na mesma cor já usada nos
 * recursos de Combate (`core/corRecursoClasse.ts`) — usado em
 * qualquer lista de magia/truque de personagem multiclasse pra
 * marcar de qual classe é cada item (ver
 * `sdd/sdd-multiclasse-truques-magias.md`). Classe sem cor definida
 * cai no estilo `.tag` padrão (branco/outline), igual ao "já possui"
 * de perícia. */
export default function PillClasse({ classe }: { classe: string }) {
  const cor = corDoRecursoDaClasse(classe);
  return <span className={`tag ${styles.pill} ${cor ? CLASSE_DA_COR[cor] : ''}`}>{classe}</span>;
}
