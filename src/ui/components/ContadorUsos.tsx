import TickPips from './TickPips';

interface ContadorUsosProps {
  /** Quanto o recurso tem no total (ex: usos máximos de Indomável). */
  total: number;
  /** Quanto já foi gasto/usado. */
  usados: number;
  tamanho?: 'sm' | 'lg';
}

/** Pips + "restantes/total", pra colocar ao lado do NOME de qualquer
 * recurso "o jogador tem N vezes pra usar" — nunca dentro do parágrafo
 * de descrição. Regra permanente (ver DECISOES-DESIGN.md, pedido do
 * Osmar 2026-09): a Ficha tinha vários desses contadores enterrados no
 * meio de um texto corrido ("...({restantes}/{maximo} usos)..."),
 * difícil de ler rápido — todo contador de usos novo já nasce assim,
 * ao lado do título. */
export default function ContadorUsos({ total, usados, tamanho = 'sm' }: ContadorUsosProps) {
  const restantes = total - usados;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textTransform: 'none', letterSpacing: 'normal' }}>
      <TickPips total={total} usados={usados} tamanho={tamanho} />
      <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>
        {restantes}/{total}
      </span>
    </span>
  );
}
