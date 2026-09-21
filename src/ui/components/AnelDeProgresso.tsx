import type { ReactNode } from 'react';

interface AnelDeProgressoProps {
  /** 0 a 1 (fora do intervalo é cortado). */
  progresso: number;
  tamanho?: number;
  /** Conteúdo no centro do anel (texto curto). */
  children?: ReactNode;
  ariaLabel?: string;
}

/** Indicador de progresso circular (M3, variante reta, arco com ponta
 * arredondada) — gira a partir do topo, sentido horário. */
export default function AnelDeProgresso({ progresso, tamanho = 52, children, ariaLabel }: AnelDeProgressoProps) {
  const espessura = 4;
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const p = Math.max(0, Math.min(1, progresso));

  return (
    <div style={{ position: 'relative', width: tamanho, height: tamanho }} role="img" aria-label={ariaLabel}>
      <svg width={tamanho} height={tamanho} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="var(--panel2)" strokeWidth={espessura} />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - p)}
          style={{ transition: 'stroke-dashoffset var(--motion-standard) var(--ease-standard)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1.1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
