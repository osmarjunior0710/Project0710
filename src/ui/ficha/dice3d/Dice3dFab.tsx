import { useEffect, useRef, useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import { carregarDiceBox3D, DICE3D_CANVAS_HOST_ID } from '../../roll/diceBox3d';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

// Cor fixa por tipo de dado (pedido do Osmar) — substitui a
// customização de tema/cor que existia antes; o tema em si é sempre
// "default" (`diceBox3d.ts` já inicializa com ele).
const CORES_POR_TIPO: Record<TipoDado, string> = {
  d4: '#2e6da4',
  d6: '#0097a7',
  d8: '#2e8555',
  d10: '#d4ac0d',
  d12: '#d4690d',
  d20: '#c0392b',
  d100: '#7d3c98',
};

// `sides` no formato que a lib espera pra cada grupo de rolagem — d100
// precisa ser a string "100" (caso especial dela pro dado percentual
// de face única), os demais são o número de lados.
const SIDES_POR_TIPO: Record<TipoDado, number | string> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: '100',
};

// Painel mostra só ~5 por vez (o resto rola por dentro) — altura por
// item calculada pra bater com o CSS de .logItem (2 linhas + padding).
const LOG_VISIVEIS = 5;
const LOG_ALTURA_ITEM_PX = 52;

/** Ferramenta avulsa de dado 3D (Fase A do `sdd/sdd-dado-3d.md`) —
 * `@3d-dice/dice-box` (BabylonJS + Ammo.js, roda em Web Worker) é
 * carregado sob demanda (dynamic import) assim que a Ficha abre — não
 * bloqueia o carregamento inicial do app, mas já fica pronto antes do
 * jogador tocar o FAB pela 1ª vez. O log de rolagens é compartilhado
 * com o resto da Ficha (`RollContext.log`) — toda rolagem real do jogo
 * também aparece aqui, e vice-versa. Ainda não é o motor oficial de
 * rolagem do jogo (isso é a Fase B, ver o SDD) — este FAB é só uma
 * ferramenta avulsa que o jogador aciona quando quiser rolar dado com
 * física de verdade, sem estar ligada a nenhuma perícia/ataque
 * específico ainda.
 *
 * Toque no FAB expande uma coluna de botões alinhados à direita, de
 * baixo pra cima (Múltiplos → d4…d100 → Histórico) — sem overlay
 * escuro por trás; o dado físico cai por cima da tela normal. Tocar
 * fora da coluna expandida colapsa de volta pro FAB.
 */
export default function Dice3dFab() {
  const { log, adicionarLog, estado } = useRoll();
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [modoMultiplo, setModoMultiplo] = useState(false);
  const [selecoes, setSelecoes] = useState<Partial<Record<TipoDado, number>>>({});
  const [logAberto, setLogAberto] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);

  // `true` = uma rolagem OFICIAL (perícia/ataque/etc, RollOverlay) está
  // usando o motor 3D agora — o host do canvas (compartilhado, ver
  // diceBox3d.ts) precisa ficar visível mesmo com este FAB fechado,
  // senão o RollOverlay não tem onde mostrar o dado físico.
  const rollOficialUsando3D = estado?.motor3D === true;
  const mostrarCanvas = aberto || rollOficialUsando3D;

  const totalSelecionado = Object.values(selecoes).reduce((acc, n) => acc + (n ?? 0), 0);

  // Pré-carrega assim que a Ficha abre, pra já estar pronto quando o
  // jogador tocar o FAB (ou quando a 1ª rolagem oficial 3D acontecer)
  // — o host do canvas fica sempre montado (nunca desmonta ao fechar o
  // menu), só escondido via CSS, senão a lib perde a referência do
  // <canvas> e a próxima rolagem não aparece mais.
  useEffect(() => {
    setCarregando(true);
    carregarDiceBox3D()
      .then(() => setCarregando(false))
      .catch((e) => {
        setCarregando(false);
        setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
      });
  }, []);

  // Clique fora da coluna expandida (FAB + botões + popup de log)
  // colapsa tudo de volta pro FAB, igual fechar.
  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(e: PointerEvent) {
      if (raizRef.current && !raizRef.current.contains(e.target as Node)) {
        fechar();
      }
    }
    document.addEventListener('pointerdown', aoClicarFora);
    return () => document.removeEventListener('pointerdown', aoClicarFora);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  function alternarAberto() {
    if (aberto) {
      fechar();
      return;
    }
    setAberto(true);
    setResultado(null);
    setErro(null);
    setModoMultiplo(false);
    setSelecoes({});
    setLogAberto(false);
  }

  function fechar() {
    setAberto(false);
    setLogAberto(false);
    setModoMultiplo(false);
    setSelecoes({});
  }

  // Rolagem "crua" — usada tanto pro toque direto em qualquer tipo
  // quanto pro modo Múltiplos. Cada grupo leva a cor fixa do seu tipo
  // (ver CORES_POR_TIPO) — passado como objeto (não notação em texto)
  // pra lib aceitar `themeColor` por grupo na mesma rolagem.
  async function rolarGenerico(itens: { tipo: TipoDado; qtd: number }[]) {
    setResultado(null);
    setErro(null);
    try {
      const box = await carregarDiceBox3D();
      const ordenados = TIPOS.filter((t) => itens.some((i) => i.tipo === t)).map(
        (t) => itens.find((i) => i.tipo === t)!,
      );
      const grupos = ordenados.map((i) => ({
        qty: i.qtd,
        sides: SIDES_POR_TIPO[i.tipo],
        themeColor: CORES_POR_TIPO[i.tipo],
      }));
      const titulo = `Rolagem de ${ordenados.map((i) => `${i.qtd}${i.tipo}`).join(' + ')}`;
      box.onRollComplete = (resultados) => {
        const valores = resultados.map((r) => r.value);
        const total = valores.reduce((acc, v) => acc + v, 0);
        setResultado(total);
        adicionarLog({ titulo, valores, total, partesTotal: valores });
      };
      box.roll(grupos.length === 1 ? grupos[0] : grupos, { theme: 'default' });
    } catch (e) {
      setCarregando(false);
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    }
  }

  function tocarTipo(tipo: TipoDado) {
    if (modoMultiplo) {
      setSelecoes((prev) => ({ ...prev, [tipo]: (prev[tipo] ?? 0) + 1 }));
      return;
    }
    rolarGenerico([{ tipo, qtd: 1 }]);
  }

  function tocarBotaoMultiplo() {
    if (!modoMultiplo) {
      setModoMultiplo(true);
      setSelecoes({});
      return;
    }
    if (totalSelecionado === 0) {
      setModoMultiplo(false);
      return;
    }
    const itens = TIPOS.filter((tipo) => (selecoes[tipo] ?? 0) > 0).map((tipo) => ({
      tipo,
      qtd: selecoes[tipo]!,
    }));
    rolarGenerico(itens);
    setModoMultiplo(false);
    setSelecoes({});
  }

  const labelBotaoMultiplo = !modoMultiplo
    ? 'Múltiplos'
    : totalSelecionado === 0
      ? 'Cancelar'
      : `Rolar (${totalSelecionado})`;

  return (
    <div ref={raizRef}>
      {/* Sempre montado (nunca condicional) — a lib do dado 3D fica
          dona desse nó de verdade; escondido via CSS quando fechado.
          Também fica visível (sem os controles do FAB) quando uma
          rolagem OFICIAL está usando o motor 3D (`rollOficialUsando3D`)
          — é o mesmo canvas físico compartilhado, ver diceBox3d.ts.
          Sem fundo escuro: o dado cai por cima da tela normal. */}
      <div className={mostrarCanvas ? styles.canvasWrapper : styles.canvasWrapperEscondido}>
        <div id={DICE3D_CANVAS_HOST_ID} className={styles.canvasHost} />
      </div>

      {aberto && (carregando || erro || resultado !== null) && (
        <div className={styles.statusFlutuante}>
          {carregando && 'Carregando dado 3D…'}
          {erro && `⚠️ ${erro}`}
          {!carregando && !erro && resultado !== null && resultado}
        </div>
      )}

      {aberto && (
        <div className={styles.coluna}>
          {/* `column-reverse` inverte a ordem visual — o 1º item do DOM
              fica embaixo (perto do FAB), o último fica em cima. Pra
              Múltiplos ficar embaixo e Histórico em cima (ordem pedida
              pelo Osmar), Múltiplos precisa vir PRIMEIRO aqui. */}
          <div className={styles.menuBtn} onClick={tocarBotaoMultiplo}>
            {labelBotaoMultiplo}
          </div>
          {TIPOS.map((tipo) => (
            <div key={tipo} className={styles.menuBtn} onClick={() => tocarTipo(tipo)}>
              {tipo}
              {modoMultiplo && (selecoes[tipo] ?? 0) > 0 && (
                <span className={styles.tipoBadge}>×{selecoes[tipo]}</span>
              )}
            </div>
          ))}
          <div
            className={styles.menuBtn}
            onClick={() => {
              setLogAberto((v) => !v);
            }}
          >
            📜 Histórico{log.length > 0 && ` (${log.length})`}
          </div>
        </div>
      )}

      {logAberto && (
        <div className={styles.logPopup}>
          <div className={styles.logPopupHeader}>
            <span>Histórico</span>
            <div className={styles.logPopupFechar} onClick={() => setLogAberto(false)}>
              ✕
            </div>
          </div>
          <div
            className={styles.logPanel}
            style={{ maxHeight: `${LOG_VISIVEIS * LOG_ALTURA_ITEM_PX}px` }}
          >
            {log.length === 0 && <div className={styles.logVazio}>Nenhuma rolagem ainda.</div>}
            {log.map((registro) => (
              <div key={registro.id} className={styles.logItem}>
                <div className={styles.logLinha1}>
                  {registro.titulo}: {registro.valores.join(' | ')}
                  {registro.tag && ` (${registro.tag})`}
                </div>
                <div className={styles.logLinha2}>
                  Total: {registro.total} ({registro.partesTotal.join(' + ')})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={aberto ? `${styles.fab} ${styles.fabAberto}` : styles.fab}
        onClick={alternarAberto}
        title="Dado 3D"
      >
        🎲
      </div>
    </div>
  );
}
