import type DiceBox from '@3d-dice/dice-box';
import type { DiceBoxGrupoNotacao, DiceBoxResultado } from '@3d-dice/dice-box';
export type { DiceBoxResultado };

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

/** Cor fixa por número de lados do dado (pedido do Osmar) — mesma tabela
 * que o FAB avulso (`Dice3dFab.tsx`) já usava, agora compartilhada aqui
 * pra qualquer rolagem OFICIAL (`RollContext.tsx`) também respeitar a
 * mesma cor por tipo, em vez de cair na cor padrão do tema. */
export const COR_POR_LADOS: Record<number, string> = {
  4: '#2e6da4',
  6: '#0097a7',
  8: '#2e8555',
  10: '#d4ac0d',
  12: '#d4690d',
  20: '#c0392b',
  100: '#7d3c98',
};

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
      scale: 6.75,
      // Explícito de propósito (ver DECISOES-DESIGN.md "Sombra do dado
      // 3D sumiu") — a lib já traz isso como padrão, mas depender só do
      // default interno dela não é confiável o suficiente pra uma coisa
      // que já sumiu 1x sem nenhuma mudança nossa nesse valor.
      enableShadows: true,
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

/** Filtra `resultados` (o array que `onRollComplete` acabou de
 * entregar) pra devolver só os grupos que NÃO estavam em `idsAntes` —
 * puro/testável separado de `lancarGrupos()` de propósito (o resto da
 * função depende do motor 3D de verdade, não dá pra testar sem
 * mockar). Base do B6 (ver DECISOES-COMBATE.md "Consolidação do motor
 * de dado 3D"): pra `.roll()` (que sempre limpa a cena antes),
 * `idsAntes` chega vazio e todo mundo em `resultados` é novo — pra
 * `.add()`, só o(s) grupo(s) recém-criado(s) sobra(m). Se por algum
 * motivo nada sobrar (`idsAntes` continha TODOS os ids — não deveria
 * acontecer numa rolagem de verdade), devolve `resultados` inteiro em
 * vez de array vazio, pra nunca deixar quem chamou sem nada pra ler. */
export function gruposNovos(idsAntes: ReadonlySet<unknown>, resultados: DiceBoxResultado[]): DiceBoxResultado[] {
  const novos = resultados.filter((r) => !idsAntes.has(r.id));
  return novos.length > 0 ? novos : resultados;
}

/** Espera depois do último dado assentar antes de começar a sumir
 * (pedido do Osmar: "conta 3s, e de 3s até 5s eles vão de 100 a 0"). */
const ESPERA_ANTES_DO_FADE_MS = 3000;
/** Duração do fade em si (3s → 5s = 2000ms). Precisa bater com a
 * `transition` aplicada em `agendarFadeDados()` — os dois valores só
 * existem aqui, não tem CSS separado pra manter em sincronia. */
const DURACAO_FADE_MS = 2000;

let fadeTimeoutRef: ReturnType<typeof setTimeout> | null = null;

/** Cancela um fade agendado e devolve o canvas físico pro 100% de
 * opacidade na hora (sem transição) — chamado ANTES de qualquer
 * `roll()`/`add()`/`reroll()` novo, pra nunca começar uma rolagem nova
 * com o dado anterior ainda sumindo ou já invisível. Direto no DOM (via
 * `getElementById`, não um componente React) porque quem dispara isso
 * é o motor 3D (`diceBox3d.ts`), fora da árvore de componentes — e pra
 * não acoplar este módulo genérico ao CSS Module de um consumidor
 * específico (`Dice3dFab.module.css`). */
export function cancelarFadeDados() {
  if (fadeTimeoutRef) {
    clearTimeout(fadeTimeoutRef);
    fadeTimeoutRef = null;
  }
  const host = document.getElementById(DICE3D_CANVAS_HOST_ID);
  if (host) {
    host.style.transition = 'none';
    host.style.opacity = '1';
  }
}

/** Agenda o dado físico sumir sozinho — chamado no `onRollComplete` de
 * QUALQUER rolagem (roll/add/reroll, oficial ou avulsa) depois que a
 * física de todo mundo já assentou. Sempre cancela/reinicia o timer
 * anterior primeiro (`cancelarFadeDados`) — se um 2º dado assentar
 * antes do fade do 1º terminar (ex.: Vantagem/Desvantagem escolhida
 * DEPOIS do resultado, `box.add()`), o relógio dos 3s recomeça do zero
 * pros dois juntos, em vez de um sumir enquanto o outro ainda nem
 * apareceu. */
export function agendarFadeDados() {
  cancelarFadeDados();
  fadeTimeoutRef = setTimeout(() => {
    const host = document.getElementById(DICE3D_CANVAS_HOST_ID);
    if (host) {
      host.style.transition = `opacity ${DURACAO_FADE_MS}ms linear`;
      host.style.opacity = '0';
    }
    fadeTimeoutRef = null;
  }, ESPERA_ANTES_DO_FADE_MS);
}

/** Rerola FISICAMENTE o grupo identificado por `resultadoBruto` (Sorte,
 * Inspiração Heroica, Perfurador — ver "Rerolagem" em
 * sdd/sdd-dado-3d.md) — irmã de `lancarGrupos()`, mas pra `reroll()`
 * em vez de `roll()`/`add()`: `box.reroll()` REAPROVEITA o `groupId` do
 * dado original (é assim que a lib "sabe" que é o mesmo dado, não um
 * novo), então `gruposNovos()` não se aplica aqui — o grupo rerolado
 * pode estar em QUALQUER posição no array que `onRollComplete` devolve
 * (a cena pode ter 2+ dados vivos, ex.: grid do Perfurador), nunca só
 * o último. Por isso acha pelo `id` de volta, com fallback pro último
 * item só se por algum motivo o id não bater (não deveria acontecer).
 * `remove: true` tira o dado antigo da cena no lugar do novo. */
export async function rerolarGrupo(resultadoBruto: DiceBoxResultado): Promise<DiceBoxResultado> {
  const box = await carregarDiceBox3D();
  cancelarFadeDados();
  return new Promise((resolve) => {
    box.onRollComplete = (resultados) => {
      agendarFadeDados();
      resolve(resultados.find((g) => g.id === resultadoBruto.groupId) ?? resultados[resultados.length - 1]);
    };
    box.reroll(resultadoBruto, { remove: true });
  });
}

export type ModoLancamento = 'roll' | 'add';

/** Ponto único de entrada pra jogar dado(s) físico(s) na cena (`B6` —
 * ver DECISOES-COMBATE.md) — cor por tipo (`COR_POR_LADOS`) e a
 * identificação de "qual resultado é o novo" (`gruposNovos`) ficam
 * aqui, não em cada chamador. Devolve só os grupos NOVOS desta
 * chamada, na ordem que a lib os criou — quem chama não precisa saber
 * se foi `roll()` (limpa tudo, tudo é novo) ou `add()` (soma um grupo
 * a mais, só ele é novo).
 *
 * Não cobre `reroll()` (Sorte/Inspiração Heroica/Perfurador) — esse
 * caso reaproveita o `groupId` de um dado já existente em vez de criar
 * um novo, então "o que é novo" não se aplica; migra pra cá só na B6.4
 * junto de `rerolarFisico()`. */
export async function lancarGrupos(
  grupos: DiceBoxGrupoNotacao | DiceBoxGrupoNotacao[],
  opcoes: { modo?: ModoLancamento; tema?: string } = {},
): Promise<DiceBoxResultado[]> {
  const box = await carregarDiceBox3D();
  await garantirTemaDiceBox3D(box, opcoes.tema ?? 'default');
  const lista = Array.isArray(grupos) ? grupos : [grupos];
  const comCor = lista.map((g) => ({ ...g, themeColor: g.themeColor ?? COR_POR_LADOS[g.sides] }));
  const idsAntes = new Set(box.getRollResults().map((r) => r.id));
  cancelarFadeDados();
  return new Promise((resolve) => {
    box.onRollComplete = (resultados) => {
      agendarFadeDados();
      resolve(gruposNovos(idsAntes, resultados));
    };
    const notacao = comCor.length === 1 ? comCor[0] : comCor;
    if (opcoes.modo === 'add') box.add(notacao);
    else box.roll(notacao);
  });
}

/** Agrupa a lista de dados (só o nº de lados de cada um, na ordem do
 * grid) em 1 notação por tipo de dado, na ordem da primeira aparição —
 * ex.: [8, 8, 6] vira `[{sides: 8, qty: 2}, {sides: 6, qty: 1}]`. Existe
 * porque mandar N notações "1dX" concorrentes pra lib 3D dispara uma
 * corrida interna (mesmo achado da Vantagem, ver `rolarD20` em
 * `RollContext.tsx`): o 2º dado volta sem valor e conta como 0 no
 * total. Com 1 grupo por tipo (`qty` = quantos), nada disputa nada. */
export function agruparDadosPorLados(lados: number[]): { sides: number; qty: number }[] {
  const contagem = new Map<number, number>();
  for (const l of lados) contagem.set(l, (contagem.get(l) ?? 0) + 1);
  return [...contagem.entries()].map(([sides, qty]) => ({ sides, qty }));
}

/** Devolve, na ordem original de `lados`, um item de cada "pool" por
 * número de lados — inverso de `agruparDadosPorLados`: `pools` guarda os
 * resultados de cada grupo (`grupo.rolls`), e cada dado da lista pega o
 * próximo do pool do seu tipo. Pool acabou antes da hora (lib devolveu
 * menos dados que o pedido) = `undefined` naquela posição. */
export function distribuirPorLados<T>(lados: number[], pools: Map<number, T[]>): (T | undefined)[] {
  const cursor = new Map<number, number>();
  return lados.map((l) => {
    const i = cursor.get(l) ?? 0;
    cursor.set(l, i + 1);
    return pools.get(l)?.[i];
  });
}
