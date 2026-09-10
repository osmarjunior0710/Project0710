import styles from './BadgeHomebrew.module.css';

/** Selo "não é regra oficial ainda" — usado em qualquer lugar que
 * mostre nome/característica de uma subclasse com `homebrew: true`
 * (`subclasses.ts`), nunca checado por nome (ver DECISOES-CLASSES.md
 * "B0"). Hoje só o Necromante do Mago usa isso. */
export default function BadgeHomebrew() {
  return (
    <span className={styles.badge} title="Não é regra oficial ainda — vai ser revisado quando o livro sair">
      🏠 Homebrew
    </span>
  );
}
