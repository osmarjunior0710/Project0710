import { useRoll } from './RollContext';
import { DICE3D_CANVAS_HOST_ID } from './diceBox3d';
import styles from './Dice3dCanvasHost.module.css';

/** Host GLOBAL do `<canvas>` do motor de dado 3D — montado 1x em
 * `App.tsx`, nunca desmonta enquanto o app estiver aberto.
 *
 * **Bug corrigido (2026-09):** esse `<div>` costumava viver DENTRO do
 * `Dice3dFab.tsx`, que só é renderizado dentro da Ficha
 * (`FichaShell.tsx`). `@3d-dice/dice-box` guarda uma referência única
 * (singleton, ver `diceBox3d.ts`) pro `<canvas>` que cria dentro desse
 * container — sair da Ficha (ex.: pro ambiente de Protótipo, ou até só
 * pra Lista) desmontava o container, e a biblioteca nunca mais
 * reconectava a um novo (`carregarDiceBox3D()` sempre devolve a
 * instância já criada, sem checar se o container dela ainda existe no
 * DOM). Resultado: qualquer rolagem 3D depois disso "morria" — o total
 * ainda calculava certo, mas o dado físico nunca mais aparecia, nem
 * voltando pra Ficha. Só um refresh de página resolvia.
 *
 * Solução: o host precisa ser tão global quanto `RollContext`/
 * `RollOverlay` já são (ver `DECISOES-DESIGN.md` "Rolagem de dados —
 * contexto global") — nunca amarrado à Ficha especificamente.
 *
 * Visibilidade: mostra quando o FAB avulso está aberto
 * (`dado3DFabAberto`, ver `Dice3dFab.tsx`) OU quando uma rolagem
 * OFICIAL está usando o motor 3D (`estado?.motor3D`) — mesma lógica
 * de antes, só que lida daqui em vez de calculada dentro do FAB. */
export default function Dice3dCanvasHost() {
  const { estado, dado3DFabAberto } = useRoll();
  const mostrar = dado3DFabAberto || estado?.motor3D === true;

  return (
    <div className={mostrar ? styles.canvasWrapper : styles.canvasWrapperEscondido}>
      <div id={DICE3D_CANVAS_HOST_ID} className={styles.canvasHost} />
    </div>
  );
}
