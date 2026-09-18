import { useEffect, useRef, useState } from 'react';
import { useRoll } from '../../roll/RollContext';
import { carregarDiceBox3D, lancarGrupos } from '../../roll/diceBox3d';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

// `sides` no formato que a lib espera pra cada grupo de rolagem — d100
// é NÚMERO puro (100), igual aos outros. Passar STRING "100" faz a lib
// entrar no modo "d100 de face única" (só a dezena, sem a unidade) —
// achado testando no celular ("d100 só rolando a dezena"). Número puro
// aciona o comportamento certo: ela soma um d10 físico "escondido" por
// trás (a lib mesma gerencia isso, `onRollComplete` só recebe o
// resultado já somado, 1 a 100).
const SIDES_POR_TIPO: Record<TipoDado, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
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
  const { log, adicionarLog, registrarDado3DFabAberto } = useRoll();
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [modoMultiplo, setModoMultiplo] = useState(false);
  const [selecoes, setSelecoes] = useState<Partial<Record<TipoDado, number>>>({});
  const [logAberto, setLogAberto] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);

  const totalSelecionado = Object.values(selecoes).reduce((acc, n) => acc + (n ?? 0), 0);

  // Avisa o `RollContext` se o FAB está aberto — o host do canvas 3D
  // agora é global (`Dice3dCanvasHost.tsx`, montado em `App.tsx`), não
  // mais um `<div>` deste componente, então quem decide "mostrar ou
  // não" precisa saber isso de fora. Desmontar com o FAB aberto (não
  // deveria acontecer, mas por segurança) avisa `false` no cleanup.
  useEffect(() => {
    registrarDado3DFabAberto(aberto);
    return () => registrarDado3DFabAberto(false);
  }, [aberto, registrarDado3DFabAberto]);

  // Pré-carrega assim que a Ficha abre, pra já estar pronto quando o
  // jogador tocar o FAB (ou quando a 1ª rolagem oficial 3D acontecer).
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
  // quanto pro modo Múltiplos. Cor por tipo já vem de `lancarGrupos()`
  // (`COR_POR_LADOS`, `diceBox3d.ts`), não precisa montar aqui.
  async function rolarGenerico(itens: { tipo: TipoDado; qtd: number }[]) {
    setResultado(null);
    setErro(null);
    try {
      const ordenados = TIPOS.filter((t) => itens.some((i) => i.tipo === t)).map(
        (t) => itens.find((i) => i.tipo === t)!,
      );
      const grupos = ordenados.map((i) => ({ qty: i.qtd, sides: SIDES_POR_TIPO[i.tipo] }));
      const titulo = `Rolagem de ${ordenados.map((i) => `${i.qtd}${i.tipo}`).join(' + ')}`;
      const resultados = await lancarGrupos(grupos);
      const valores = resultados.map((r) => r.value);
      const total = valores.reduce((acc, v) => acc + v, 0);
      setResultado(total);
      adicionarLog({ titulo, valores, total, partesTotal: valores });
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
