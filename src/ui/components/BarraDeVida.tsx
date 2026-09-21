// Barra de Pontos de Vida do personagem — estilo "jogo de luta": o valor
// real (verde) muda na hora e um trecho VERMELHO marca o que acabou de
// ser perdido (dano) ou o que vai ser preenchido (cura); depois de uma
// pausa curta, o marcador alcança o valor real. Vários toques seguidos
// não reiniciam a animação: o alvo se move e o marcador continua de
// onde está (ver `core/animacaoPv.ts` pra tempo). Mesma geometria da
// `LinearProgressBar` (que continua servindo os Pets, sem essa animação).
//
// Animação em JS com requestAnimationFrame, não CSS `transition` em
// geometria SVG — mesma razão da `LinearProgressBar` (não anima de forma
// confiável entre navegadores).

import { useMarcadorAnimado } from '../hooks/useMarcadorAnimado';
import { corPorPercentual } from './LinearProgressBar';

const VIEW_W = 300;
const VIEW_H = 24;
const ESPESSURA = 5;
const Y = (VIEW_H - ESPESSURA) / 2;
const COR_MARCADOR = '#e5484d';

interface BarraDeVidaProps {
  valor: number;
  maximo: number;
  /** PV Temporário — estende a escala além do máximo (trecho azul), sem animação. */
  temporario?: number;
  altura?: number;
}

export default function BarraDeVida({ valor, maximo, temporario = 0, altura = 20 }: BarraDeVidaProps) {
  // `marcador` = onde o trecho vermelho está agora, alcançando `valor`.
  const marcador = useMarcadorAnimado(valor);

  const escala = maximo + temporario;
  const px = (v: number) => (escala > 0 ? (Math.max(0, Math.min(v, maximo)) / escala) * VIEW_W : 0);
  const xMax = escala > 0 ? (maximo / escala) * VIEW_W : VIEW_W;

  // Dano: verde já no valor novo, vermelho de `valor` até o marcador (acima).
  // Cura: verde só até o marcador, vermelho do marcador até `valor` (a preencher).
  const baixo = Math.min(marcador, valor);
  const alto = Math.max(marcador, valor);
  const xVerde = px(baixo);
  const xVermelhoIni = px(baixo);
  const xVermelhoFim = px(alto);
  const corAtiva = corPorPercentual(maximo > 0 ? valor / maximo : 0);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: altura, display: 'block' }}
      role="img"
      aria-label={`Pontos de Vida: ${valor}${temporario > 0 ? ` + ${temporario} temporário` : ''} de ${maximo}`}
    >
      <rect x={0} y={Y + 1} width={VIEW_W} height={3} rx={1.5} fill="var(--line)" />
      {temporario > 0 && (
        <rect x={xMax} y={Y} width={Math.max(0, VIEW_W - xMax)} height={ESPESSURA} rx={ESPESSURA / 2} fill="var(--accent)" />
      )}
      {xVermelhoFim - xVermelhoIni > 0.01 && (
        <rect
          x={xVermelhoIni}
          y={Y}
          width={xVermelhoFim - xVermelhoIni}
          height={ESPESSURA}
          rx={ESPESSURA / 2}
          fill={COR_MARCADOR}
        />
      )}
      {xVerde > 0.01 && <rect x={0} y={Y} width={xVerde} height={ESPESSURA} rx={ESPESSURA / 2} fill={corAtiva} />}
    </svg>
  );
}
