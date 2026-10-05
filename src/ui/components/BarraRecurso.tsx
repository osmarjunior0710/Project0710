// Barra colorida com número dentro, pra recurso "reserva de PONTOS"
// grande demais pra bolinhas (ex: Mãos Consagradas, até 100 no nível
// 20 do Paladino) — pedido do Osmar (2026-09), usando a barra de vida
// como referência. Diferente de `LinearProgressBar.tsx` (cor varia por
// % de PV restante), aqui a cor é FIXA (a cor da classe) — não é
// "saúde", é "quanto sobrou da reserva". Reaproveita a mesma animação
// suave (`useValorAnimado`, requestAnimationFrame) da barra de vida.

import { useValorAnimado } from './LinearProgressBar';

const VIEW_W = 300;
const VIEW_H = 40;
const ESPESSURA = 28;
const Y = (VIEW_H - ESPESSURA) / 2;
const DURACAO_MS = 500;

interface BarraRecursoProps {
  valor: number;
  maximo: number;
  /** Hex fixo (ver `core/corRecursoClasse.ts`) — não varia com o valor. */
  cor: string;
  /** Texto centralizado dentro da barra, ex: "23/25 PV". */
  rotulo: string;
  altura?: number;
  /** Quanto do `valor` atual SERIA gasto se o jogador confirmar agora
   * (ex.: Mãos Consagradas somando cura + condições marcadas antes de
   * tocar "Confirmar") — mesma ideia do "pedaço vermelho" de dano
   * pendente na barra de PV, só que aqui é sempre "vai sair da
   * reserva", nunca dano de verdade. Desenhado como um pedaço
   * `var(--danger)` na PONTA do preenchimento (entre `valor - pendente`
   * e `valor`) — o que sobra depois de confirmar fica a cor normal.
   * `undefined`/0 = sem prévia, barra sólida como sempre. */
  pendente?: number;
}

export default function BarraRecurso({ valor, maximo, cor, rotulo, altura = 32, pendente = 0 }: BarraRecursoProps) {
  const valorAnim = useValorAnimado(valor, DURACAO_MS);
  const xValor = maximo > 0 ? (Math.max(0, Math.min(valorAnim, maximo)) / maximo) * VIEW_W : 0;
  const pendenteClamped = Math.max(0, Math.min(pendente, valor));
  const xRestante = maximo > 0 ? (Math.max(0, valor - pendenteClamped) / maximo) * VIEW_W : 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: altura, display: 'block' }}
        role="img"
        aria-label={rotulo}
      >
        <rect x={0} y={Y} width={VIEW_W} height={ESPESSURA} rx={ESPESSURA / 2} fill="var(--line)" />
        {xValor > 0.01 && <rect x={0} y={Y} width={xValor} height={ESPESSURA} rx={ESPESSURA / 2} fill={cor} />}
        {pendenteClamped > 0 && xValor > xRestante && (
          <rect x={xRestante} y={Y} width={xValor - xRestante} height={ESPESSURA} rx={ESPESSURA / 2} fill="var(--danger)" />
        )}
      </svg>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.7)',
          pointerEvents: 'none',
        }}
      >
        {rotulo}
      </span>
    </div>
  );
}
