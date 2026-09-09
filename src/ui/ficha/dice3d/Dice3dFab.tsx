import { useRef, useState } from 'react';
import type DiceBox from '@3d-dice/dice-box';
import styles from './Dice3dFab.module.css';

/** Protótipo isolado (pedido do Osmar, 2026-09) — testa se dado 3D de
 * verdade (física, não CSS) é viável nesse app antes de decidir trocar
 * a arte 2D atual. `@3d-dice/dice-box` (BabylonJS + Ammo.js, roda em
 * Web Worker) é carregado sob demanda (dynamic import) só quando o FAB
 * é tocado — não pesa no carregamento inicial do app. Ver
 * DECISOES-COMBATE.md pro resultado desse teste. */
export default function Dice3dFab() {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const diceBoxRef = useRef<DiceBox | null>(null);

  async function rolar() {
    setAberto(true);
    setResultado(null);
    setErro(null);
    try {
      if (!diceBoxRef.current) {
        setCarregando(true);
        const { default: DiceBoxCtor } = await import('@3d-dice/dice-box');
        const box = new DiceBoxCtor({
          container: '#dice3d-canvas-host',
          assetPath: `${import.meta.env.BASE_URL}assets/`,
          theme: 'default',
        });
        await box.init();
        diceBoxRef.current = box;
        setCarregando(false);
      }
      diceBoxRef.current.onRollComplete = (resultados) => {
        const total = resultados.reduce((acc, r) => acc + r.value, 0);
        setResultado(total);
      };
      diceBoxRef.current.roll('1d20');
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
      <div className={styles.fab} onClick={rolar} title="Protótipo: dado 3D">
        🎲
      </div>
      {aberto && (
        <div className={styles.overlay}>
          <div id="dice3d-canvas-host" className={styles.canvasHost} />
          {carregando && <div className={styles.status}>Carregando dado 3D…</div>}
          {erro && <div className={styles.status}>⚠️ {erro}</div>}
          {resultado !== null && <div className={styles.resultado}>{resultado}</div>}
          <div className={styles.fechar} onClick={fechar}>
            fechar
          </div>
        </div>
      )}
    </>
  );
}
