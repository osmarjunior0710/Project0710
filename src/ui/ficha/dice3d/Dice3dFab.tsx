import { useEffect, useRef, useState } from 'react';
import type DiceBox from '@3d-dice/dice-box';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

/** [PH] Protótipo isolado (pedido do Osmar, 2026-09) — testa se dado 3D
 * de verdade (física, não CSS) é viável nesse app antes de decidir
 * trocar a arte 2D atual. `@3d-dice/dice-box` (BabylonJS + Ammo.js,
 * roda em Web Worker) é carregado sob demanda (dynamic import) assim
 * que a Ficha abre — não bloqueia o carregamento inicial do app (a
 * Ficha já mostra tudo antes disso terminar), mas já fica pronto antes
 * do jogador tocar o FAB pela 1ª vez. Toda a UI aqui é placeholder —
 * ainda não está ligada a nenhuma rolagem real do jogo. Ver
 * DECISOES-COMBATE.md pro resultado desse teste. */
export default function Dice3dFab() {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [modoMultiplo, setModoMultiplo] = useState(false);
  const [selecoes, setSelecoes] = useState<Partial<Record<TipoDado, number>>>({});
  const diceBoxRef = useRef<DiceBox | null>(null);
  const carregandoPromiseRef = useRef<Promise<DiceBox> | null>(null);

  const totalSelecionado = Object.values(selecoes).reduce((acc, n) => acc + (n ?? 0), 0);

  function carregar(): Promise<DiceBox> {
    if (diceBoxRef.current) return Promise.resolve(diceBoxRef.current);
    if (carregandoPromiseRef.current) return carregandoPromiseRef.current;
    setCarregando(true);
    const promessa = (async () => {
      const { default: DiceBoxCtor } = await import('@3d-dice/dice-box');
      const box = new DiceBoxCtor({
        container: '#dice3d-canvas-host',
        assetPath: `${import.meta.env.BASE_URL}assets/`,
        theme: 'default',
      });
      await box.init();
      diceBoxRef.current = box;
      setCarregando(false);
      return box;
    })();
    carregandoPromiseRef.current = promessa;
    return promessa;
  }

  // Pré-carrega assim que a Ficha abre, pra já estar pronto quando o
  // jogador tocar o FAB — o host do canvas fica sempre montado (nunca
  // desmonta ao fechar o overlay), só escondido via CSS, senão a lib
  // perde a referência do <canvas> e a 2ª rolagem não aparece mais.
  useEffect(() => {
    carregar().catch((e) => {
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    });
  }, []);

  function abrir() {
    setAberto(true);
    setResultado(null);
    setErro(null);
    setModoMultiplo(false);
    setSelecoes({});
  }

  async function rolarNotacoes(notacoes: string[]) {
    setResultado(null);
    setErro(null);
    try {
      const box = await carregar();
      box.onRollComplete = (resultados) => {
        const total = resultados.reduce((acc, r) => acc + r.value, 0);
        setResultado(total);
      };
      box.roll(notacoes.length === 1 ? notacoes[0] : notacoes);
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
    rolarNotacoes([`1${tipo}`]);
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
    const notacoes = TIPOS.filter((tipo) => (selecoes[tipo] ?? 0) > 0).map(
      (tipo) => `${selecoes[tipo]}${tipo}`,
    );
    rolarNotacoes(notacoes);
    setModoMultiplo(false);
    setSelecoes({});
  }

  function fechar() {
    setAberto(false);
  }

  const labelBotaoMultiplo = !modoMultiplo
    ? '[PH] Múltiplos'
    : totalSelecionado === 0
      ? '[PH] Cancelar'
      : `[PH] Rolar (${totalSelecionado})`;

  return (
    <>
      <div className={styles.fab} onClick={abrir} title="[PH] Protótipo: dado 3D">
        🎲
      </div>
      {/* Sempre montado (nunca condicional) — a lib do dado 3D fica
          dona desse nó de verdade; escondido via CSS quando fechado. */}
      <div className={aberto ? styles.overlay : styles.overlayEscondido}>
        <div id="dice3d-canvas-host" className={styles.canvasHost} />
        {aberto && (
          <>
            {carregando && <div className={styles.status}>[PH] Carregando dado 3D…</div>}
            {erro && <div className={styles.status}>⚠️ {erro}</div>}
            {resultado !== null && <div className={styles.resultado}>{resultado}</div>}
            {!carregando && !erro && resultado === null && !modoMultiplo && (
              <div className={styles.status}>[PH] Escolha um dado pra rolar</div>
            )}
            {modoMultiplo && (
              <div className={styles.status}>[PH] Toque nos dados que quer rolar juntos</div>
            )}
            <div className={styles.controles}>
              <div className={styles.tipos}>
                {TIPOS.map((tipo) => (
                  <div key={tipo} className={styles.tipoBtn} onClick={() => tocarTipo(tipo)}>
                    {tipo}
                    {modoMultiplo && (selecoes[tipo] ?? 0) > 0 && (
                      <span className={styles.tipoBadge}>×{selecoes[tipo]}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.multiploBtn} onClick={tocarBotaoMultiplo}>
                {labelBotaoMultiplo}
              </div>
              <div className={styles.fechar} onClick={fechar}>
                [PH] fechar
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
