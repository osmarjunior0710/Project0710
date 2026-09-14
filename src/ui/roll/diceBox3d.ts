import type DiceBox from '@3d-dice/dice-box';
export type { DiceBoxResultado } from '@3d-dice/dice-box';

/** Dono único do motor `@3d-dice/dice-box` — antes vivia dentro de
 * `Dice3dFab.tsx` (ferramenta avulsa), agora é compartilhado com
 * `RollOverlay.tsx` (rolagens oficiais, Fase B — ver
 * `sdd/sdd-dado-3d.md`) porque só pode existir 1 `<canvas>`/instância
 * por vez (o container é fixo no DOM, ver `Dice3dCanvasHost.tsx`).
 * Módulo (não hook/contexto) de propósito: o `DiceBox` não é estado de
 * React, é uma instância de engine que sobrevive a qualquer
 * remount de componente. */
let diceBoxRef: DiceBox | null = null;
let carregandoPromiseRef: Promise<DiceBox> | null = null;

export const DICE3D_CANVAS_HOST_ID = 'dice3d-canvas-host';

export function carregarDiceBox3D(): Promise<DiceBox> {
  if (diceBoxRef) return Promise.resolve(diceBoxRef);
  if (carregandoPromiseRef) return carregandoPromiseRef;
  const promessa = (async () => {
    const { default: DiceBoxCtor } = await import('@3d-dice/dice-box');
    const box = new DiceBoxCtor({
      container: `#${DICE3D_CANVAS_HOST_ID}`,
      assetPath: `${import.meta.env.BASE_URL}assets/`,
      theme: 'default',
      // Compensa o canvas ter ficado menor (área de física ajustada
      // pro popup reancorado embaixo, ver Dice3dFab.module.css) — a
      // lib recalcula o tamanho do dado com base no espaço disponível,
      // então um canvas menor sozinho deixava o dado minúsculo. Padrão
      // da lib é 5; achado testando no celular (pedido do Osmar: "uns
      // 20% menor que o tamanho original", não do tamanho que ficou).
      scale: 7,
    });
    await box.init();
    diceBoxRef = box;
    return box;
  })();
  carregandoPromiseRef = promessa;
  // Achado testando no celular: se `box.init()` falhar 1x por qualquer
  // motivo passageiro (ex.: container com altura momentaneamente 0
  // durante uma mudança de layout), a promise ficava guardada pra
  // sempre — toda rolagem seguinte reusava essa MESMA promise rejeitada
  // e caía pro 2D sem nunca mais tentar o motor 3D de novo na mesma
  // sessão (só um refresh de página "resolvia"). Limpar a referência no
  // erro deixa a PRÓXIMA rolagem tentar inicializar de novo do zero.
  promessa.catch(() => {
    carregandoPromiseRef = null;
  });
  return promessa;
}

/** `roll()` acessa os dados do tema de forma síncrona — precisa
 * garantir que ele já foi baixado/carregado antes (idempotente, só
 * baixa de verdade na 1ª vez que cada tema é escolhido nesta sessão). */
export async function garantirTemaDiceBox3D(box: DiceBox, temaId: string) {
  await box.loadTheme(temaId);
}
