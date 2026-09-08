import { createContext, useCallback, useContext, useRef, useState, type MutableRefObject, type ReactNode } from 'react';

type CritTipo = 'sucesso' | 'falha' | null;

export type Vantagem = 'vantagem' | 'desvantagem';

/** Tipos de dado suportados pelo grid de dados individuais (ver
 * `RollState.dadosIndividuais`). d100 aqui é 1 rolagem de 1 a 100
 * (na mesa costuma ser 2xd10 — "dado percentual" — mas o app rola
 * direto, sem precisar de 2 dados físicos). */
export type LadosDado = 4 | 6 | 8 | 10 | 12 | 20 | 100;

/** 1 dado individual dentro de uma rolagem 'dados' com 2+ dados no
 * total (mistura de tipos permitida — ex.: 1d20 + 1d4 + 1d6 na mesma
 * rolagem, cada grupo com seu próprio `lados`). Só existe quando a
 * rolagem tem 2+ dados; rolagem de 1 dado só continua usando
 * `RollState.valorDado` direto (sem grid), pra não mexer no que já
 * funciona. Ver `RollOverlay.tsx` — grid de 4 colunas, preenche
 * esquerda→direita, quebra linha a cada 4. */
export interface DadoIndividual {
  /** Único dentro da rolagem — usado pra localizar o dado ao rerolar
   * (ver `rerollDadoEscolhido`). Não precisa ser estável entre
   * rolagens diferentes. */
  id: string;
  lados: LadosDado;
  valor: number | '🎲';
}

/** Categoria da rolagem 'd20' — hoje só usada pra decidir se um bônus
 * extra registrado (ver `BonusExtraProvider`) pode aparecer nela.
 * "Teste de atributo" cobre perícia também (perícia É um teste de
 * atributo, regra 5e). Ataque/iniciativa ficam de fora de propósito —
 * nenhuma característica que soma bônus avulso hoje se aplica a eles. */
export type CategoriaRolagemD20 = 'atributoOuSalvaguarda';

/** Uma característica tipo "A Sorte do Próprio Tenebroso" — soma
 * 1 dado avulso a uma rolagem 'd20' já concluída, com usos limitados.
 * Registrado pela Ficha (`FichaShell`) via `registrarBonusExtra`
 * porque o `RollOverlay` é global (montado em `App.tsx`, fora da
 * árvore da Ficha) e não tem acesso direto ao estado do personagem —
 * mesmo problema que Vantagem/Desvantagem não tem (não depende de
 * personagem nenhum). Genérico de propósito: a próxima característica
 * parecida (ex: Orientação/Guidance +1d4) reaproveita sem precisar de
 * um 2º mecanismo. */
export interface BonusExtraProvider {
  /** Rótulo curto pro botão — ex: "Sorte do Ten.". */
  rotulo: string;
  lados: number;
  restantes: number;
  maximo: number;
  /** Consome 1 uso — `false` se não tinha mais uso (não deveria
   * acontecer, já que o botão só aparece com `restantes > 0`, mas a
   * função confia em quem chama pra não duplicar a regra de limite). */
  usar: () => boolean;
}

export interface RollState {
  label: string;
  formula: string;
  fase: 'rolando' | 'concluido';
  /** 'd20' = sempre 1 dado de 20 lados (teste/salvaguarda/ataque) — só
   * esse tipo aceita Vantagem/Desvantagem, inclusive escolhida DEPOIS
   * de ver o primeiro resultado. 'dados' = quantidade/lados
   * variáveis (dano e outras rolagens de dado avulso) — nunca tem
   * Vantagem/Desvantagem, regra de D&D não usa esse conceito aqui. */
  tipo: 'd20' | 'dados';
  valorDado: number | string;
  /** Segundo d20, só quando Vantagem/Desvantagem está em jogo (pré-
   * definida na chamada ou escolhida depois pelo jogador). `'🎲'`
   * enquanto rola, `null`/`undefined` quando não há 2º dado. */
  dado2?: number | string | null;
  /** Qual das duas regras está valendo pro par de d20 acima — null
   * quando não há Vantagem/Desvantagem nesta rolagem. */
  vantagem?: Vantagem | null;
  /** Só em rolagens tipo 'd20' — guardado pra poder recalcular o
   * total quando o jogador escolhe Vantagem/Desvantagem depois de já
   * ver o primeiro resultado (ver `escolherVantagemPosRolagem`). */
  mod?: number;
  total: number | null;
  critico: CritTipo;
  /** Mostra os botões Desvantagem/Vantagem — só true pra uma rolagem
   * 'd20' já concluída, sem Vantagem/Desvantagem pré-definida e sem
   * 2º dado ainda escolhido. Vira false assim que o jogador decide. */
  podeEscolherVantagem: boolean;
  /** Categoria opcional — `undefined`/ausente = nenhum bônus extra
   * pode se aplicar a esta rolagem. */
  categoria?: CategoriaRolagemD20;
  /** Preenchido quando o jogador já aplicou o `BonusExtraProvider`
   * registrado — guarda rótulo + valor rolado, pra mostrar a quebra
   * do total e travar o botão (regra real: no máximo 1x por jogada).
   * `valor: '🎲'` enquanto anima (mesmo efeito do 2º d20 de Vantagem/
   * Desvantagem) — `total` só soma o valor quando a animação termina. */
  bonusExtra?: { rotulo: string; lados: number; valor: number | string } | null;
  /** `true` = o jogador já usou Sorte (Pequenino) nesta rolagem — só 1x
   * por rolagem, mesmo que o novo resultado também seja 1. */
  sorteUsada?: boolean;
  /** `true` = o jogador já usou Inspiração Heroica nesta rolagem. */
  inspiracaoHeroicaUsada?: boolean;
  /** Lados do dado — só preenchido em rolagens 'dados' de 1 dado só
   * elegíveis pro reroll de "saiu 1" (ver `rerollSe1`), pra dar pra
   * rejogar o mesmo dado depois. */
  lados?: number;
  /** "Reroll de 1" genérico (Cura Garantida do Curandeiro, Dano
   * Garantido do Valentão de Taverna — mesma regra: "se esse dado sair
   * 1, pode jogar de novo e usar o novo resultado, só 1x"). `rotulo` é
   * o texto do botão, varia por talento. Só faz sentido numa rolagem
   * 'dados' de 1 dado só (`quantidade === 1` na chamada de
   * `rolarDados`) — com mais de 1 dado não dá pra saber qual dado
   * rerolar sem guardar cada resultado individual, que não existe
   * hoje (só a soma). */
  rerollSe1?: { rotulo: string } | null;
  /** `true` = o jogador já usou o `rerollSe1` desta rolagem — só 1x,
   * mesmo que o novo resultado também seja 1. */
  rerollSe1Usado?: boolean;
  /** Preenchido só quando a rolagem 'dados' tem 2+ dados no total —
   * ver `DadoIndividual`. `undefined`/ausente = rolagem de 1 dado só
   * (ou rolagem 'd20'), sem grid. */
  dadosIndividuais?: DadoIndividual[];
  /** Perfurador (Talento Geral) — rerolar 1 dado À ESCOLHA do
   * jogador, independente do valor que saiu (diferente de
   * `rerollSe1`, que só habilita quando saiu 1). Só faz sentido com
   * `dadosIndividuais` presente (2+ dados) — com 1 dado só não teria
   * "qual escolher", usa `rerollSe1` nesse caso. */
  rerollEscolhido?: { rotulo: string } | null;
  /** `true` = o jogador já usou o `rerollEscolhido` desta rolagem —
   * só 1x, em QUALQUER um dos dados. */
  rerollEscolhidoUsado?: boolean;
}

/** Inspiração Heroica — flag booleano por personagem (nunca contador,
 * ver SDD): se `disponivel`, rejoga QUALQUER d20 já concluído (sem
 * Vantagem/Desvantagem em jogo) e usa o novo resultado, gastando a
 * inspiração (`usar()` zera o flag no personagem). Registrado pela
 * Ficha do mesmo jeito que `BonusExtraProvider`, pelo mesmo motivo
 * (`RollOverlay` é global, sem acesso direto ao estado do personagem).
 * Só cobre rolagens de D20 por enquanto — reroll de dano fica pro
 * Backlog.md. */
export interface InspiracaoHeroicaProvider {
  disponivel: boolean;
  /** Gasta a Inspiração Heroica no personagem (zera o flag). */
  usar: () => void;
}

interface RollD20Options {
  label: string;
  formula: string;
  mod: number;
  /** Rola 2d20 já de cara e usa o maior ('vantagem') ou o menor
   * ('desvantagem') — omitido = rolagem normal (1d20), com os botões
   * de Vantagem/Desvantagem disponíveis depois do resultado. */
  vantagem?: Vantagem;
  /** Ver `CategoriaRolagemD20` — omitido = nenhum bônus extra
   * registrado pode se aplicar a esta rolagem. */
  categoria?: CategoriaRolagemD20;
  onResultado?: (total: number, d20: number) => void;
}

interface RollDadosOptions {
  label: string;
  formula: string;
  quantidade: number;
  lados: number;
  mod: number;
  /** Grupos de dado de OUTROS tipos na MESMA rolagem — ex.: dano
   * 1d20 + 1d4 + 1d6 vira `{ quantidade: 1, lados: 20 }` (principal)
   * + `gruposExtras: [{ quantidade: 1, lados: 4 }, { quantidade: 1,
   * lados: 6 }]`. Cada grupo aparece com seus próprios dados no grid
   * (ver `DadoIndividual`/`RollOverlay.tsx`), sem misturar contagem
   * com o grupo principal. Omitido = só o grupo principal. */
  gruposExtras?: { quantidade: number; lados: LadosDado }[];
  /** Ver `RollState.rerollSe1` — só tem efeito quando `quantidade`
   * é 1 (e sem `gruposExtras`). */
  rerollSe1?: { rotulo: string };
  /** Ver `RollState.rerollEscolhido` — só tem efeito com 2+ dados no
   * total (`quantidade` + soma de `gruposExtras`). */
  rerollEscolhido?: { rotulo: string };
  onResultado?: (total: number) => void;
}

interface RollContextValue {
  estado: RollState | null;
  rolarD20: (opts: RollD20Options) => void;
  rolarDados: (opts: RollDadosOptions) => void;
  /** Só tem efeito numa rolagem 'd20' concluída, sem Vantagem/
   * Desvantagem ainda decidida — rola um 2º d20 e usa o maior
   * ('vantagem') ou o menor ('desvantagem') dos dois, recalculando
   * total e crítico a partir do dado escolhido. */
  escolherVantagemPosRolagem: (tipo: Vantagem) => void;
  fechar: () => void;
  /** Bônus extra registrado agora (ver `BonusExtraProvider`) — `null`
   * quando nenhuma característica desse tipo está disponível pro
   * personagem da tela atual. */
  bonusExtraDisponivel: BonusExtraProvider | null;
  /** A Ficha chama isso num `useEffect` toda vez que o recurso do
   * personagem muda (usos restantes, nível, etc.) — passar `null`
   * remove o registro (ex: ao sair da tela). */
  registrarBonusExtra: (provider: BonusExtraProvider | null) => void;
  /** Consome 1 uso do `bonusExtraDisponivel` atual e soma o dado
   * rolado ao total da rolagem concluída em exibição — só tem efeito
   * numa rolagem 'd20' concluída, com a categoria certa, sem bônus
   * já aplicado, e com usos restantes. */
  aplicarBonusExtra: () => void;
  /** `true` só pro personagem da tela atual ter Sorte (Pequenino) —
   * controla se o botão de reroll aparece quando o d20 mostrar 1. */
  sorteDisponivel: boolean;
  registrarSorte: (disponivel: boolean) => void;
  /** Joga de novo o d20 de uma rolagem 'd20' concluída que mostrou 1,
   * sem Vantagem/Desvantagem em jogo e ainda não usada nesta rolagem —
   * substitui o resultado (não soma um 2º dado, diferente de
   * Vantagem/Desvantagem e do Bônus Extra). Sempre usa a nova jogada,
   * mesmo se também sair 1 (regra real). */
  usarSorte: () => void;
  /** Joga de novo o dado de uma rolagem 'dados' de 1 dado só (ver
   * `RollState.rerollSe1`) que mostrou 1 e ainda não usou o reroll —
   * substitui o resultado, sempre usa a nova jogada mesmo se também
   * sair 1 (mesma regra do `usarSorte`, só que pra dano/cura em vez
   * de d20). */
  usarRerollSe1: () => void;
  /** Joga de novo 1 dado À ESCOLHA do jogador (ver
   * `RollState.rerollEscolhido`) — passe o `id` do `DadoIndividual`
   * tocado (rolagem com grid, 2+ dados) ou omita (rolagem de 1 dado
   * só, sem grid — mesmo botão do `rerollSe1`, sem exigir que o valor
   * seja 1). Só tem efeito com reroll disponível, ainda não usado
   * nesta rolagem, e o dado apontado com valor numérico (não durante
   * a animação). Substitui o valor desse dado e recalcula o total —
   * os outros dados (se houver) não mudam. */
  rerollDadoEscolhido: (id?: string) => void;
  /** `true` só quando o personagem da tela atual tem Inspiração
   * Heroica agora — controla se o botão de reroll aparece em QUALQUER
   * d20 concluído (sem Vantagem/Desvantagem em jogo). */
  inspiracaoHeroicaDisponivel: boolean;
  registrarInspiracaoHeroica: (provider: InspiracaoHeroicaProvider | null) => void;
  /** Joga de novo o d20 de uma rolagem 'd20' concluída (qualquer
   * resultado, sem Vantagem/Desvantagem em jogo, ainda não usada
   * nesta rolagem) — substitui o resultado e gasta a Inspiração
   * Heroica do personagem (`InspiracaoHeroicaProvider.usar`). */
  usarInspiracaoHeroica: () => void;
  /** Modo de Teste (ver `AvatarMenu`) — `true` faz todo d20 sair da
   * sequência fixa 1/10/15/20 em vez de rolar de verdade (dano e
   * outros dados continuam aleatórios). Não persiste entre sessões —
   * sempre nasce desligado, pra nunca "esquecer ligado" sem perceber. */
  modoTeste: boolean;
  alternarModoTeste: () => void;
}

const RollContext = createContext<RollContextValue | null>(null);

const DURACAO_ANIMACAO_MS = 480;

/** Modo de Teste (ver `AvatarMenu`): em vez de rolar de verdade, todo
 * d20 sai dessa sequência fixa, em ordem, dando a volta quando chega
 * no fim — pensada pra exercitar os 4 estados visuais de acerto que
 * mais importam testar (1 = falha crítica, 10/15 = resultado
 * mediano, 20 = sucesso crítico) sem depender de sorte. Quando 2 d20
 * saem juntos (Vantagem/Desvantagem), cada um consome o PRÓXIMO da
 * fila — nunca reseta entre eles — então uma rolagem com Vantagem já
 * sai como "1, depois 10" naturalmente, sem lógica extra. Só afeta
 * d20 — dano e qualquer outro dado (`rolarDados`) continuam de
 * verdade mesmo com o modo ligado, já que o objetivo é testar
 * acerto/crítico, não dano. */
const SEQUENCIA_MODO_TESTE = [1, 10, 15, 20];

/** `modoTeste`/`indice` são refs (não state) de propósito: esta função
 * roda dentro de callbacks memoizados com `[]` de dependência
 * (`rolarD20`, `escolherVantagemPosRolagem`, etc.) — só uma ref
 * garante que a leitura enxergue o valor mais recente do toggle, sem
 * precisar recriar esses callbacks a cada mudança. */
function rolarD20Dado(modoTeste: MutableRefObject<boolean>, indice: MutableRefObject<number>): number {
  if (modoTeste.current) {
    const valor = SEQUENCIA_MODO_TESTE[indice.current % SEQUENCIA_MODO_TESTE.length];
    indice.current += 1;
    return valor;
  }
  return 1 + Math.floor(Math.random() * 20);
}

function criticoDe(d20: number): CritTipo {
  return d20 === 1 ? 'falha' : d20 === 20 ? 'sucesso' : null;
}

export function RollProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<RollState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [modoTeste, setModoTesteState] = useState(false);
  const modoTesteRef = useRef(false);
  const indiceModoTesteRef = useRef(0);
  const alternarModoTeste = useCallback(() => {
    modoTesteRef.current = !modoTesteRef.current;
    indiceModoTesteRef.current = 0;
    setModoTesteState(modoTesteRef.current);
  }, []);

  const rolarD20 = useCallback(({ label, formula, mod, vantagem, categoria, onResultado }: RollD20Options) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setEstado({
      label,
      formula,
      fase: 'rolando',
      tipo: 'd20',
      valorDado: '🎲',
      dado2: vantagem ? '🎲' : null,
      vantagem: vantagem ?? null,
      mod,
      total: null,
      critico: null,
      podeEscolherVantagem: false,
      categoria,
      bonusExtra: null,
    });
    timeoutRef.current = setTimeout(() => {
      const rolagem1 = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
      if (vantagem) {
        const rolagem2 = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
        const usado = vantagem === 'vantagem' ? Math.max(rolagem1, rolagem2) : Math.min(rolagem1, rolagem2);
        const total = usado + mod;
        setEstado({
          label,
          formula,
          fase: 'concluido',
          tipo: 'd20',
          valorDado: rolagem1,
          dado2: rolagem2,
          vantagem,
          mod,
          total,
          critico: criticoDe(usado),
          podeEscolherVantagem: false,
          categoria,
          bonusExtra: null,
          sorteUsada: false,
          inspiracaoHeroicaUsada: false,
        });
        onResultado?.(total, usado);
      } else {
        const total = rolagem1 + mod;
        setEstado({
          label,
          formula,
          fase: 'concluido',
          tipo: 'd20',
          valorDado: rolagem1,
          dado2: null,
          vantagem: null,
          mod,
          total,
          critico: criticoDe(rolagem1),
          podeEscolherVantagem: true,
          categoria,
          bonusExtra: null,
          sorteUsada: false,
          inspiracaoHeroicaUsada: false,
        });
        onResultado?.(total, rolagem1);
      }
    }, DURACAO_ANIMACAO_MS);
  }, []);

  const rolarDados = useCallback(
    ({ label, formula, quantidade, lados, mod, gruposExtras, rerollSe1, rerollEscolhido, onResultado }: RollDadosOptions) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // "reroll se 1"/reroll de 1 dado só fazem sentido sabendo o
      // valor de UM dado só — com mais de 1 dado (ou grupos extras),
      // vira o grid de `dadosIndividuais` (ver `DadoIndividual`).
      const umDadoSo = quantidade === 1 && (!gruposExtras || gruposExtras.length === 0);
      // Ordem: grupo principal primeiro, depois cada grupo extra na
      // ordem passada — é a ordem em que aparecem no grid (esquerda→
      // direita, 4 por linha).
      const especificacaoDados: { lados: LadosDado }[] = umDadoSo
        ? []
        : [
            ...Array.from({ length: quantidade }, () => ({ lados: lados as LadosDado })),
            ...(gruposExtras ?? []).flatMap((g) => Array.from({ length: g.quantidade }, () => ({ lados: g.lados }))),
          ];
      setEstado({
        label,
        formula,
        fase: 'rolando',
        tipo: 'dados',
        valorDado: '🎲',
        total: null,
        critico: null,
        podeEscolherVantagem: false,
        dadosIndividuais: umDadoSo
          ? undefined
          : especificacaoDados.map((d, i) => ({ id: `d${i}`, lados: d.lados, valor: '🎲' })),
      });
      timeoutRef.current = setTimeout(() => {
        if (umDadoSo) {
          const soma = 1 + Math.floor(Math.random() * lados);
          const total = soma + mod;
          setEstado({
            label,
            formula,
            fase: 'concluido',
            tipo: 'dados',
            valorDado: soma,
            total,
            critico: null,
            podeEscolherVantagem: false,
            lados,
            mod,
            rerollSe1: rerollSe1 ?? null,
            rerollSe1Usado: false,
            // Perfurador com 1 dado só (arma comum em níveis baixos)
            // reaproveita o botão de reroll de baixo — sem grid,
            // sem exigir toque no dado (não tem ambiguidade de "qual
            // dado" com 1 só). Ver `rerollDadoEscolhido`.
            rerollEscolhido: rerollEscolhido ?? null,
            rerollEscolhidoUsado: false,
          });
          onResultado?.(total);
          return;
        }
        const dadosIndividuais: DadoIndividual[] = especificacaoDados.map((d, i) => ({
          id: `d${i}`,
          lados: d.lados,
          valor: 1 + Math.floor(Math.random() * d.lados),
        }));
        const soma = dadosIndividuais.reduce((acc, d) => acc + (typeof d.valor === 'number' ? d.valor : 0), 0);
        const total = soma + mod;
        setEstado({
          label,
          formula,
          fase: 'concluido',
          tipo: 'dados',
          valorDado: soma,
          total,
          critico: null,
          podeEscolherVantagem: false,
          mod,
          dadosIndividuais,
          rerollEscolhido: rerollEscolhido ?? null,
          rerollEscolhidoUsado: false,
        });
        onResultado?.(total);
      }, DURACAO_ANIMACAO_MS);
    },
    [],
  );

  /** `id` presente = rolagem com grid (2+ dados), reroleta só o dado
   * apontado. `id` ausente = rolagem de 1 dado só (sem grid — ver
   * `rolarDados`, ramo `umDadoSo`), reroleta o único dado
   * (`valorDado`/`lados` no nível raiz do estado) — mesmo botão que
   * já existe pro `rerollSe1`, só sem exigir que o valor seja 1. */
  const rerollDadoEscolhido = useCallback((id?: string) => {
    setEstado((prev) => {
      if (!prev || prev.fase !== 'concluido' || prev.tipo !== 'dados') return prev;
      if (!prev.rerollEscolhido || prev.rerollEscolhidoUsado) return prev;
      if (id && prev.dadosIndividuais) {
        const dado = prev.dadosIndividuais.find((d) => d.id === id);
        if (!dado || typeof dado.valor !== 'number') return prev;
        return {
          ...prev,
          dadosIndividuais: prev.dadosIndividuais.map((d) => (d.id === id ? { ...d, valor: '🎲' } : d)),
          rerollEscolhidoUsado: true,
        };
      }
      if (typeof prev.valorDado !== 'number') return prev;
      return { ...prev, valorDado: '🎲', rerollEscolhidoUsado: true };
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'dados') return prev;
        if (id && prev.dadosIndividuais) {
          const dado = prev.dadosIndividuais.find((d) => d.id === id);
          if (!dado) return prev;
          const novoValor = 1 + Math.floor(Math.random() * dado.lados);
          const novosDados = prev.dadosIndividuais.map((d) => (d.id === id ? { ...d, valor: novoValor } : d));
          const soma = novosDados.reduce((acc, d) => acc + (typeof d.valor === 'number' ? d.valor : 0), 0);
          const total = soma + (prev.mod ?? 0);
          return { ...prev, dadosIndividuais: novosDados, total };
        }
        if (prev.lados === undefined) return prev;
        const novoValor = 1 + Math.floor(Math.random() * prev.lados);
        const total = novoValor + (prev.mod ?? 0);
        return { ...prev, valorDado: novoValor, total };
      });
    }, DURACAO_ANIMACAO_MS);
  }, []);

  const escolherVantagemPosRolagem = useCallback((tipo: Vantagem) => {
    setEstado((prev) => {
      if (!prev || prev.fase !== 'concluido' || prev.tipo !== 'd20' || !prev.podeEscolherVantagem) return prev;
      return { ...prev, dado2: '🎲', vantagem: tipo, podeEscolherVantagem: false };
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'd20') return prev;
        const rolagem1 = typeof prev.valorDado === 'number' ? prev.valorDado : 0;
        const rolagem2 = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
        const usado = prev.vantagem === 'vantagem' ? Math.max(rolagem1, rolagem2) : Math.min(rolagem1, rolagem2);
        const total = usado + (prev.mod ?? 0);
        return { ...prev, dado2: rolagem2, total, critico: criticoDe(usado) };
      });
    }, DURACAO_ANIMACAO_MS);
  }, []);

  const fechar = useCallback(() => setEstado(null), []);

  const [bonusExtraProvider, setBonusExtraProvider] = useState<BonusExtraProvider | null>(null);
  const registrarBonusExtra = useCallback((provider: BonusExtraProvider | null) => setBonusExtraProvider(provider), []);

  const aplicarBonusExtra = useCallback(() => {
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'd20') return;
    if (!estado.categoria || estado.bonusExtra) return;
    if (!bonusExtraProvider || bonusExtraProvider.restantes <= 0) return;
    if (!bonusExtraProvider.usar()) return;
    const { rotulo, lados } = bonusExtraProvider;
    setEstado((prev) => (prev ? { ...prev, bonusExtra: { rotulo, lados, valor: '🎲' } } : prev));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const valor = 1 + Math.floor(Math.random() * lados);
      setEstado((prev) =>
        prev ? { ...prev, bonusExtra: { rotulo, lados, valor }, total: (prev.total ?? 0) + valor } : prev,
      );
    }, DURACAO_ANIMACAO_MS);
  }, [estado, bonusExtraProvider]);

  const [sorteDisponivel, setSorteDisponivel] = useState(false);
  const registrarSorte = useCallback((disponivel: boolean) => setSorteDisponivel(disponivel), []);

  const usarSorte = useCallback(() => {
    if (!sorteDisponivel) return;
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'd20') return;
    if (estado.valorDado !== 1 || estado.dado2 || estado.sorteUsada) return;
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', sorteUsada: true } : prev));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'd20') return prev;
        const novaRolagem = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
        const total = novaRolagem + (prev.mod ?? 0) + (typeof prev.bonusExtra?.valor === 'number' ? prev.bonusExtra.valor : 0);
        return { ...prev, valorDado: novaRolagem, total, critico: criticoDe(novaRolagem) };
      });
    }, DURACAO_ANIMACAO_MS);
  }, [estado, sorteDisponivel]);

  const usarRerollSe1 = useCallback(() => {
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'dados') return;
    if (!estado.rerollSe1 || estado.rerollSe1Usado) return;
    if (estado.valorDado !== 1) return;
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', rerollSe1Usado: true } : prev));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'dados' || prev.lados === undefined) return prev;
        const novaRolagem = 1 + Math.floor(Math.random() * prev.lados);
        const total = novaRolagem + (prev.mod ?? 0);
        return { ...prev, valorDado: novaRolagem, total };
      });
    }, DURACAO_ANIMACAO_MS);
  }, [estado]);

  const [inspiracaoHeroicaProvider, setInspiracaoHeroicaProvider] = useState<InspiracaoHeroicaProvider | null>(null);
  const registrarInspiracaoHeroica = useCallback(
    (provider: InspiracaoHeroicaProvider | null) => setInspiracaoHeroicaProvider(provider),
    [],
  );

  const usarInspiracaoHeroica = useCallback(() => {
    if (!inspiracaoHeroicaProvider?.disponivel) return;
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'd20') return;
    if (estado.dado2 || estado.inspiracaoHeroicaUsada) return;
    inspiracaoHeroicaProvider.usar();
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', inspiracaoHeroicaUsada: true } : prev));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'd20') return prev;
        const novaRolagem = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
        const total = novaRolagem + (prev.mod ?? 0) + (typeof prev.bonusExtra?.valor === 'number' ? prev.bonusExtra.valor : 0);
        return { ...prev, valorDado: novaRolagem, total, critico: criticoDe(novaRolagem) };
      });
    }, DURACAO_ANIMACAO_MS);
  }, [estado, inspiracaoHeroicaProvider]);

  return (
    <RollContext.Provider
      value={{
        estado,
        rolarD20,
        rolarDados,
        escolherVantagemPosRolagem,
        fechar,
        bonusExtraDisponivel: bonusExtraProvider,
        registrarBonusExtra,
        aplicarBonusExtra,
        sorteDisponivel,
        registrarSorte,
        usarSorte,
        usarRerollSe1,
        rerollDadoEscolhido,
        inspiracaoHeroicaDisponivel: inspiracaoHeroicaProvider?.disponivel ?? false,
        registrarInspiracaoHeroica,
        usarInspiracaoHeroica,
        modoTeste,
        alternarModoTeste,
      }}
    >
      {children}
    </RollContext.Provider>
  );
}

export function useRoll(): RollContextValue {
  const ctx = useContext(RollContext);
  if (!ctx) throw new Error('useRoll precisa estar dentro de um <RollProvider>');
  return ctx;
}
