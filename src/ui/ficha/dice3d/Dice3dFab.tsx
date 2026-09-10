import { useEffect, useRef, useState } from 'react';
import type DiceBox from '@3d-dice/dice-box';
import styles from './Dice3dFab.module.css';

const TIPOS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const;
type TipoDado = (typeof TIPOS)[number];

/** Protótipo isolado (pedido do Osmar, 2026-09) — testa se dado 3D de
 * verdade (física, não CSS) é viável nesse app antes de decidir trocar
 * a arte 2D atual. `@3d-dice/dice-box` (BabylonJS + Ammo.js, roda em
 * Web Worker) é carregado sob demanda (dynamic import) assim que a
 * Ficha abre — não bloqueia o carregamento inicial do app (a Ficha já
 * mostra tudo antes disso terminar), mas já fica pronto antes do
 * jogador tocar o FAB pela 1ª vez. Ver DECISOES-COMBATE.md pro
 * resultado desse teste. */
export default function Dice3dFab() {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const carregandoPromiseRef = useRef<Promise<DiceBox> | null>(null);

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
  }

  async function rolar(tipo: TipoDado) {
    setResultado(null);
    setErro(null);
    try {
      const box = await carregar();
      box.onRollComplete = (resultados) => {
        const total = resultados.reduce((acc, r) => acc + r.value, 0);
        setResultado(total);
      };
      box.roll(`1${tipo}`);
    } catch (e) {
      setCarregando(false);
      setErro(e instanceof Error ? e.message : 'Erro desconhecido ao carregar o dado 3D.');
    }
  }

  function fechar() {
    setAberto(false);
  }

  return (
    <>
      <div className={styles.fab} onClick={abrir} title="Protótipo: dado 3D">
        🎲
      </div>
      {/* Sempre montado (nunca condicional) — a lib do dado 3D fica
          dona desse nó de verdade; escondido via CSS quando fechado. */}
      <div className={aberto ? styles.overlay : styles.overlayEscondido}>
        <div id="dice3d-canvas-host" className={styles.canvasHost} />
        {aberto && (
          <>
            {carregando && <div className={styles.status}>Carregando dado 3D…</div>}
            {erro && <div className={styles.status}>⚠️ {erro}</div>}
            {resultado !== null && <div className={styles.resultado}>{resultado}</div>}
            {!carregando && !erro && resultado === null && (
              <div className={styles.status}>Escolha um dado pra rolar</div>
            )}
            <div className={styles.tipos}>
              {TIPOS.map((tipo) => (
                <div key={tipo} className={styles.tipoBtn} onClick={() => rolar(tipo)}>
                  {tipo}
                </div>
              ))}
            </div>
            <div className={styles.fechar} onClick={fechar}>
              fechar
            </div>
          </>
        )}
      </div>
    </>
  );
}
