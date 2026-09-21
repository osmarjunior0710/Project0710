import type { ReactNode } from 'react';
import { useMarcadorAnimado } from '../hooks/useMarcadorAnimado';

interface AnelDeProgressoProps {
  /** Valor atual e o valor que completa o anel (ex.: XP e XP do próximo
   * marco). Mudanças de `valor` animam: o trecho novo aparece num azul mais
   * claro e vai sendo preenchido (mesma animação da barra de vida). */
  valor: number;
  maximo: number;
  tamanho?: number;
  /** Conteúdo no centro do anel (texto curto). */
  children?: ReactNode;
  ariaLabel?: string;
}

/** Indicador de progresso circular (M3, variante reta, arco com ponta
 * arredondada) — gira a partir do topo, sentido horário. */
export default function AnelDeProgresso({ valor, maximo, tamanho = 52, children, ariaLabel }: AnelDeProgressoProps) {
  const espessura = 4;
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const marcador = useMarcadorAnimado(valor);
  const fracao = (v: number) => (maximo > 0 ? Math.max(0, Math.min(1, v / maximo)) : 0);
  // Ganho: cheio até o marcador, claro do marcador até `valor` (a preencher).
  // Perda: cheio já no valor novo, claro do valor até o marcador (o que sumiu).
  const pCheio = fracao(Math.min(marcador, valor));
  const pClaro = fracao(Math.max(marcador, valor));

  return (
    <div style={{ position: 'relative', width: tamanho, height: tamanho }} role="img" aria-label={ariaLabel}>
      <svg width={tamanho} height={tamanho} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="var(--panel2)" strokeWidth={espessura} />
        {pClaro > pCheio && (
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.35}
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia * (1 - pClaro)}
          />
        )}
        {pCheio > 0 && (
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia * (1 - pCheio)}
          />
        )}
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
