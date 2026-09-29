// Indicador linear (M3) — usado hoje só pra Pontos de Vida na aba
// Combat. Trecho preenchido colorido por severidade (bom/atenção/
// perigo), trecho restante em tom neutro. Começou como a variante
// "wavy" (M3 Expressive) — trocado pra reto a pedido do Osmar (mais
// legível que a onda).
//
// PV Temporário (2026-09, pedido do Osmar): a escala da barra se
// estende além do máximo quando existe PV Temporário — verde até o
// PV máximo, azul do máximo até máximo+temporário (regra real: dano
// desconta do Temporário primeiro, então ele "cobre" a ponta da
// barra). Sem PV Temporário, a barra se comporta exatamente como
// antes (escala = só o máximo).
//
// Transição de ~0,5s ao mudar de valor (ex: tomar -5 de dano) — feita
// em JS com requestAnimationFrame, não CSS `transition` no atributo
// SVG: testado e `transition` em `x`/`width` de `<rect>`/`<line>` não
// anima de forma confiável entre navegadores, pula seco pro valor
// final. Interpolar o valor exibido em JS funciona sempre.

import { useEffect, useRef, useState } from 'react';

const VIEW_W = 300;
const VIEW_H = 24;
const ESPESSURA = 5;
const Y = (VIEW_H - ESPESSURA) / 2;
const DURACAO_MS = 500;

export function corPorPercentual(pct: number): string {
  if (pct <= 0.25) return 'var(--danger)';
  if (pct <= 0.5) return 'var(--warn)';
  return 'var(--good)';
}

/** Anima suavemente de um valor numérico pro outro sempre que `alvo`
 * muda, sem depender de CSS transition em geometria SVG. Exportado pra
 * `BarraRecurso.tsx` reaproveitar a mesma técnica em barras que não são
 * PV (ex: reserva de Mãos Consagradas). */
export function useValorAnimado(alvo: number, duracaoMs: number): number {
  const [exibido, setExibido] = useState(alvo);
  const exibidoRef = useRef(alvo);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    exibidoRef.current = exibido;
  }, [exibido]);

  useEffect(() => {
    if (alvo === exibidoRef.current) return;
    const de = exibidoRef.current;
    const diferenca = alvo - de;
    const inicio = performance.now();

    function passo(agora: number) {
      const t = Math.min(1, (agora - inicio) / duracaoMs);
      const suavizado = 1 - (1 - t) * (1 - t); // ease-out quadrático
      const valor = de + diferenca * suavizado;
      setExibido(valor);
      exibidoRef.current = valor;
      if (t < 1) frameRef.current = requestAnimationFrame(passo);
    }
    frameRef.current = requestAnimationFrame(passo);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo, duracaoMs]);

  return exibido;
}

interface LinearProgressBarProps {
  valor: number;
  maximo: number;
  /** PV Temporário atual — soma na escala da barra (0 = comportamento
   * de antes, sem trecho azul). */
  temporario?: number;
  altura?: number;
}

export default function LinearProgressBar({ valor, maximo, temporario = 0, altura = 20 }: LinearProgressBarProps) {
  const valorAnim = useValorAnimado(valor, DURACAO_MS);
  const temporarioAnim = useValorAnimado(temporario, DURACAO_MS);

  const escala = maximo + temporarioAnim;
  const corAtiva = corPorPercentual(maximo > 0 ? valorAnim / maximo : 0);

  const xValor = escala > 0 ? (Math.max(0, Math.min(valorAnim, maximo)) / escala) * VIEW_W : 0;
  const xMax = escala > 0 ? (maximo / escala) * VIEW_W : VIEW_W;
  const xTemp = escala > 0 ? ((maximo + temporarioAnim) / escala) * VIEW_W : VIEW_W;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: altura, display: 'block' }}
      role="img"
      aria-label={`Pontos de Vida: ${valor}${temporario > 0 ? ` + ${temporario} temporário` : ''} de ${maximo}`}
    >
      <rect x={0} y={Y + 1} width={VIEW_W} height={3} rx={1.5} fill="var(--line)" />
      {temporarioAnim > 0.01 && (
        <rect x={xMax} y={Y} width={Math.max(0, xTemp - xMax)} height={ESPESSURA} rx={ESPESSURA / 2} fill="var(--accent)" />
      )}
      {xValor > 0.01 && <rect x={0} y={Y} width={xValor} height={ESPESSURA} rx={ESPESSURA / 2} fill={corAtiva} />}
    </svg>
  );
}
