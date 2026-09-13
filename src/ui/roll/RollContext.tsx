import { createContext, useCallback, useContext, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { useColapsavel } from '../hooks/useColapsavel';
import { suportaWebGL } from '../utils/suportaWebGL';
import { carregarDiceBox3D, garantirTemaDiceBox3D, type DiceBoxResultado } from './diceBox3d';

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
  /** Objeto BRUTO devolvido pelo motor 3D pra ESTE dado específico —
   * só existe quando a rolagem usou física (ver `RollState.motor3D`).
   * Guardado pra poder repassar pra `box.reroll()` no Perfurador (ver
   * sdd/sdd-dado-3d.md "Rerolagem") — o app nunca lê os campos dele. */
  resultadoBruto?: DiceBoxResultado;
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
  /** `true` = esta rolagem usou o motor 3D (física de verdade,
   * `@3d-dice/dice-box`) em vez de `Math.random()` — Fase B do dado 3D
   * (`sdd/sdd-dado-3d.md`). Pra 'd20': só cobre d20 simples (sem
   * Vantagem/Desvantagem PRÉ-declarada) por enquanto — `RollOverlay`
   * usa isso pra mostrar o canvas físico em vez do `DadoVisual` CSS
   * pro 1º dado; se o jogador escolher Vantagem/Desvantagem DEPOIS
   * (`escolherVantagemPosRolagem`), o 2º dado continua 2D, fica `true`
   * mesmo assim (só o 1º é físico). Pra 'dados' (dano/outros, B5):
   * cobre TANTO o dado único quanto o grid de 2+ dados — mas o grid
   * (`dadosIndividuais`) continua desenhando o `DadoVisual` CSS normal
   * mesmo com `motor3D`, DIFERENTE do 'd20' — o grid não é "o mesmo
   * dado duplicado", é a UI de escolher qual rerolar (Perfurador), tem
   * que continuar clicável mesmo com o dado físico caindo por trás
   * como reforço visual. */
  motor3D?: boolean;
  /** `true` só quando o 2º dado (Vantagem/Desvantagem PRÉ-declarada,
   * `box.roll(['1d20','1d20'])`) também veio do motor 3D — diferente
   * de um 2º dado adicionado DEPOIS via `escolherVantagemPosRolagem`
   * (ainda 2D nesta fase, ver sdd/sdd-dado-3d.md), que nunca marca
   * isto. `RollOverlay` usa pra decidir se esconde o `DadoVisual` CSS
   * dos DOIS dados (par físico) ou só do 1º (2º ainda 2D). */
  dado2Motor3D?: boolean;
  /** Objeto BRUTO devolvido pelo motor 3D pro d20 simples atual
   * (`concluirPlano` em `rolarD20`) — só existe quando `motor3D` é
   * `true`. Guardado pra poder repassar pra `box.reroll()` depois
   * (Sorte/Inspiração Heroica, ver sdd/sdd-dado-3d.md "Rerolagem") —
   * o app nunca lê os campos dele, só passa de volta pra lib. */
  resultadoBrutoD20?: DiceBoxResultado;
  /** Mesma ideia de `resultadoBrutoD20`, só que pra uma rolagem 'dados'
   * de 1 DADO SÓ (sem `dadosIndividuais`, ver `rolarDados`) — usado
   * pelo `rerollDadoEscolhido`/`usarRerollSe1` desse caso. Rolagem com
   * 2+ dados guarda o bruto de CADA dado em `DadoIndividual.resultadoBruto`
   * em vez de um único campo aqui. */
  resultadoBrutoDados?: DiceBoxResultado;
}

/** 1 linha do histórico de rolagens (últimas 20, mais recente
 * primeiro) — pedido do Osmar (2026-09): "pegar todas as rolagens, de
 * dentro do rolador de dados [3D avulso] e do resto da ficha [rolagens
 * de verdade, `rolarD20`/`rolarDados`]". Fica no `RollContext` (não em
 * `Dice3dFab.tsx`) porque é o único lugar que os dois mundos
 * enxergam — o resto da Ficha nem sabe que o dado 3D existe. */
export interface RegistroLog {
  id: string;
  /** Nome da perícia/ação (rolagem real, vem de `label`) OU "Rolagem
   * de NdX + ..."/rótulo livre (dado 3D avulso). */
  titulo: string;
  /** Valores de cada dado, na ordem que caíram. */
  valores: (number | string)[];
  /** "Vantagem" | "Desvantagem" — omitido = rolagem sem os dois. */
  tag?: string;
  total: number;
  /** Parcelas somadas pra formar o total (dado(s) mantido(s) +
   * modificador, ou todos os dados de uma rolagem sem modificador). */
  partesTotal: (number | string)[];
}

const MAX_LOG = 20;

/** Converte uma `RollState` concluída (rolagem real da Ficha) numa
 * `RegistroLog` — chamado só de dentro de `fechar()` (1x por sessão de
 * rolagem, não a cada mutação intermediária de Vantagem/reroll/Bônus
 * Extra, já que o jogador só fecha o overlay depois de decidir tudo). */
function criarRegistroLogDaRolagem(estado: RollState): Omit<RegistroLog, 'id'> {
  const mod = estado.mod ?? 0;
  let valores: (number | string)[];
  let usado: number | string;
  let tag: string | undefined;

  if (estado.tipo === 'd20' && estado.dado2 != null) {
    valores = [estado.valorDado, estado.dado2];
    const d1 = typeof estado.valorDado === 'number' ? estado.valorDado : 0;
    const d2 = typeof estado.dado2 === 'number' ? estado.dado2 : 0;
    usado = estado.vantagem === 'desvantagem' ? Math.min(d1, d2) : Math.max(d1, d2);
    tag = estado.vantagem === 'desvantagem' ? 'Desvantagem' : 'Vantagem';
  } else if (estado.dadosIndividuais) {
    valores = estado.dadosIndividuais.map((d) => d.valor);
    usado = valores.reduce((acc: number, v) => acc + (typeof v === 'number' ? v : 0), 0);
  } else {
    valores = [estado.valorDado];
    usado = estado.valorDado;
  }

  const partesTotal: (number | string)[] = [usado];
  if (estado.bonusExtra && typeof estado.bonusExtra.valor === 'number') {
    partesTotal.push(estado.bonusExtra.valor);
  }
  if (mod !== 0) partesTotal.push(mod);

  return {
    titulo: estado.label,
    valores,
    tag,
    total: estado.total ?? 0,
    partesTotal,
  };
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
  /** Preferência SALVA do jogador (`localStorage`, mesmo padrão de
   * `useColapsavel`) — Fase A/B do Dado 3D (`sdd/sdd-dado-3d.md`).
   * Ainda não é lida por nenhuma rolagem real (isso é a próxima
   * entrega, B2) — hoje só controla o switch "🎲 Dado 3D" do
   * `AvatarMenu`. Ligar "Modo de Teste" força essa preferência pra
   * `false` automaticamente (física de verdade é incompatível com
   * resultado fixo pra QA) — não use este valor puro pra decidir o
   * motor de rolagem, use `dado3DAtivo`. */
  preferenciaDado3D: boolean;
  alternarPreferenciaDado3D: () => void;
  /** `false` quando o aparelho não suporta WebGL — calculado 1x
   * (`suportaWebGL`), não muda durante a sessão. */
  dado3DDisponivel: boolean;
  /** Valor DERIVADO pronto pra decidir o motor de rolagem (Fase B):
   * `preferenciaDado3D && dado3DDisponivel && !modoTeste`. */
  dado3DAtivo: boolean;
  /** Histórico compartilhado de rolagens (últimas `MAX_LOG`, mais
   * recente primeiro) — alimentado automaticamente por toda rolagem
   * real (`rolarD20`/`rolarDados`, via `fechar()`) E pelo dado 3D
   * avulso (`Dice3dFab.tsx`, via `adicionarLog`), já que os dois
   * mundos precisam aparecer no mesmo lugar (pedido do Osmar). */
  log: RegistroLog[];
  /** Acrescenta 1 linha ao histórico compartilhado — usado pelo dado 3D
   * avulso (rolagens que não passam por `rolarD20`/`rolarDados`, então
   * não caem sozinhas no log via `fechar()`). */
  adicionarLog: (registro: Omit<RegistroLog, 'id'>) => void;
}

const RollContext = createContext<RollContextValue | null>(null);

/** 1s = tempo pro dado dar 2 voltas completas (ver `.die`/`.dieGrid`
 * em `RollOverlay.module.css`) antes do valor/total aparecer — pedido
 * do Osmar, suspense proposital. Os 2 têm que ficar em sincronia: se
 * mudar aqui, mude a duração do keyframe `spin` também. */
const DURACAO_ANIMACAO_MS = 1000;

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

/** `onRollComplete` devolve 1 objeto por GRUPO (não por dado) — o dado
 * individual de verdade, com o `rollId` que `box.reroll()` precisa,
 * mora em `grupo.rolls[0]` (todo grupo que este app monta tem
 * `qty: 1`, ver `DiceBoxResultado`). Usar sempre isso, nunca o grupo
 * cru, em qualquer lugar que guarde um resultado pra rerolar depois. */
function dadoBruto(grupo: DiceBoxResultado): DiceBoxResultado {
  return grupo.rolls?.[0] ?? grupo;
}

/** Rerola FISICAMENTE o d20 identificado por `resultadoBruto` (Sorte,
 * Inspiração Heroica — ver "Rerolagem" em sdd/sdd-dado-3d.md) — usado
 * só quando o d20 original já veio do motor 3D. `remove: true` tira o
 * dado antigo da cena no lugar do novo (senão os 2 ficariam visíveis
 * juntos). Cai pro `onFalha` (2D) se o motor 3D falhar por qualquer
 * motivo — mesmo espírito do fallback de `rolarD20`. */
async function rerolarFisico(
  resultadoBruto: DiceBoxResultado,
  onSucesso: (novoValor: number, novoResultado: DiceBoxResultado) => void,
  onFalha: () => void,
) {
  try {
    const box = await carregarDiceBox3D();
    box.onRollComplete = (resultados) => onSucesso(resultados[0].value, dadoBruto(resultados[0]));
    box.reroll(resultadoBruto, { remove: true });
  } catch {
    onFalha();
  }
}

export function RollProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<RollState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [modoTeste, setModoTesteState] = useState(false);
  const modoTesteRef = useRef(false);
  const indiceModoTesteRef = useRef(0);
  const [preferenciaDado3D, setPreferenciaDado3D] = useColapsavel('preferencia-dado-3d', true);
  const dado3DDisponivel = useMemo(() => suportaWebGL(), []);
  const alternarModoTeste = useCallback(() => {
    modoTesteRef.current = !modoTesteRef.current;
    indiceModoTesteRef.current = 0;
    setModoTesteState(modoTesteRef.current);
    // Física de verdade é incompatível com resultado fixo pra QA — ver
    // "Modo de Teste" em sdd/sdd-dado-3d.md.
    if (modoTesteRef.current) setPreferenciaDado3D(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const alternarPreferenciaDado3D = useCallback(() => {
    setPreferenciaDado3D(!preferenciaDado3D);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenciaDado3D]);
  const dado3DAtivo = preferenciaDado3D && dado3DDisponivel && !modoTeste;

  const rolarD20 = useCallback(
    ({ label, formula, mod, vantagem, categoria, onResultado }: RollD20Options) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const usar3D = dado3DAtivo;
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
        motor3D: usar3D,
      });

      // d20 simples concluído (sem Vantagem/Desvantagem pré-definida) —
      // usado tanto pelo caminho 2D normal quanto pelo fallback quando
      // o motor 3D falha (sem WebGL de repente, erro de rede no
      // `import()` dinâmico) ou nunca completa.
      function concluirPlano(rolagem1: number, viaMotor3D: boolean, resultadoBruto?: DiceBoxResultado) {
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
          motor3D: viaMotor3D,
          resultadoBrutoD20: resultadoBruto,
        });
        onResultado?.(total, rolagem1);
      }

      // Vantagem/Desvantagem PRÉ-declarada (2 dados de uma vez) —
      // `vantagem` só chega aqui truthy, TypeScript não sabe disso.
      function concluirVantagem(rolagem1: number, rolagem2: number, viaMotor3D: boolean) {
        const usado = vantagem === 'vantagem' ? Math.max(rolagem1, rolagem2) : Math.min(rolagem1, rolagem2);
        const total = usado + mod;
        setEstado({
          label,
          formula,
          fase: 'concluido',
          tipo: 'd20',
          valorDado: rolagem1,
          dado2: rolagem2,
          vantagem: vantagem ?? null,
          mod,
          total,
          critico: criticoDe(usado),
          podeEscolherVantagem: false,
          categoria,
          bonusExtra: null,
          sorteUsada: false,
          inspiracaoHeroicaUsada: false,
          motor3D: viaMotor3D,
          dado2Motor3D: viaMotor3D,
        });
        onResultado?.(total, usado);
      }

      if (usar3D) {
        (async () => {
          try {
            const box = await carregarDiceBox3D();
            await garantirTemaDiceBox3D(box, 'default');
            if (vantagem) {
              // 1 grupo só ("2d20", não 2 notações "1d20" separadas) —
              // achado testando no celular: com 2 itens de notação
              // concorrentes, a lib tem uma corrida interna (2 forEach
              // assíncronos disputando o mesmo contador de groupId) que
              // podia fazer os 2 dados físicos caírem com valores
              // diferentes na tela mas o mesmo valor no card/histórico.
              // Com 1 grupo só (qty:2), não tem 2 itens disputando nada.
              box.onRollComplete = (resultados) => {
                const [d1, d2] = resultados[0].rolls ?? [];
                concluirVantagem(d1?.value ?? 0, d2?.value ?? 0, true);
              };
              box.roll('2d20');
            } else {
              box.onRollComplete = (resultados) => concluirPlano(resultados[0].value, true, dadoBruto(resultados[0]));
              box.roll('1d20');
            }
          } catch {
            timeoutRef.current = setTimeout(() => {
              const rolagem1 = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
              if (vantagem) {
                concluirVantagem(rolagem1, rolarD20Dado(modoTesteRef, indiceModoTesteRef), false);
              } else {
                concluirPlano(rolagem1, false);
              }
            }, DURACAO_ANIMACAO_MS);
          }
        })();
        return;
      }

      timeoutRef.current = setTimeout(() => {
        const rolagem1 = rolarD20Dado(modoTesteRef, indiceModoTesteRef);
        if (vantagem) {
          concluirVantagem(rolagem1, rolarD20Dado(modoTesteRef, indiceModoTesteRef), false);
        } else {
          concluirPlano(rolagem1, false);
        }
      }, DURACAO_ANIMACAO_MS);
    },
    [dado3DAtivo],
  );

  const rolarDados = useCallback(
    ({ label, formula, quantidade, lados, mod, gruposExtras, rerollSe1, rerollEscolhido, onResultado }: RollDadosOptions) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const usar3D = dado3DAtivo;
      // "reroll se 1"/reroll de 1 dado só fazem sentido sabendo o
      // valor de UM dado só — com mais de 1 dado (ou grupos extras),
      // vira o grid de `dadosIndividuais` (ver `DadoIndividual`).
      const umDadoSo = quantidade === 1 && (!gruposExtras || gruposExtras.length === 0);
      // Ordem: grupo principal primeiro, depois cada grupo extra na
      // ordem passada — é a ordem em que aparecem no grid (esquerda→
      // direita, 4 por linha) e a mesma ordem em que os grupos são
      // passados pro motor 3D, então `resultados[i]` bate com
      // `especificacaoDados[i]`.
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
        motor3D: usar3D,
      });

      // Dado único concluído (Perfurador com arma de 1 dado só) —
      // usado pelo caminho 2D normal E pelo fallback quando o motor 3D
      // falha, igual ao `concluirPlano` de `rolarD20`.
      function concluirUmDado(soma: number, viaMotor3D: boolean, resultadoBruto?: DiceBoxResultado) {
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
          motor3D: viaMotor3D,
          resultadoBrutoDados: resultadoBruto,
        });
        onResultado?.(total);
      }

      // Grid de 2+ dados concluído — `valores`/`resultadosBrutos` vêm
      // ou da física (mesma ordem de `especificacaoDados`) ou do
      // fallback `Math.random()`.
      function concluirGrid(valores: number[], viaMotor3D: boolean, resultadosBrutos?: DiceBoxResultado[]) {
        const dadosIndividuais: DadoIndividual[] = especificacaoDados.map((d, i) => ({
          id: `d${i}`,
          lados: d.lados,
          valor: valores[i],
          resultadoBruto: resultadosBrutos?.[i],
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
          motor3D: viaMotor3D,
        });
        onResultado?.(total);
      }

      function rolar2D() {
        if (umDadoSo) {
          concluirUmDado(1 + Math.floor(Math.random() * lados), false);
          return;
        }
        concluirGrid(
          especificacaoDados.map((d) => 1 + Math.floor(Math.random() * d.lados)),
          false,
        );
      }

      if (usar3D) {
        (async () => {
          try {
            const box = await carregarDiceBox3D();
            await garantirTemaDiceBox3D(box, 'default');
            if (umDadoSo) {
              box.onRollComplete = (resultados) => concluirUmDado(resultados[0].value, true, dadoBruto(resultados[0]));
              box.roll({ qty: 1, sides: lados });
            } else {
              const grupos = especificacaoDados.map((d) => ({ qty: 1, sides: d.lados }));
              box.onRollComplete = (resultados) =>
                concluirGrid(
                  resultados.map((r) => r.value),
                  true,
                  resultados.map(dadoBruto),
                );
              box.roll(grupos.length === 1 ? grupos[0] : grupos);
            }
          } catch {
            timeoutRef.current = setTimeout(rolar2D, DURACAO_ANIMACAO_MS);
          }
        })();
        return;
      }

      timeoutRef.current = setTimeout(rolar2D, DURACAO_ANIMACAO_MS);
    },
    [dado3DAtivo],
  );

  /** `id` presente = rolagem com grid (2+ dados), reroleta só o dado
   * apontado — FISICAMENTE (`box.reroll`) se aquele dado tinha vindo
   * do motor 3D, senão 2D clássico. `id` ausente = rolagem de 1 dado
   * só (sem grid — ver `rolarDados`, ramo `umDadoSo`), reroleta o
   * único dado (`valorDado`/`lados`/`resultadoBrutoDados` no nível
   * raiz do estado) — mesmo botão que já existe pro `rerollSe1`, só
   * sem exigir que o valor seja 1. Lê `estado` direto (não só `prev`
   * dentro do setter) porque precisa do objeto BRUTO da lib pra
   * chamar `box.reroll()` — mesmo padrão de `usarSorte`/
   * `usarInspiracaoHeroica`. */
  const rerollDadoEscolhido = useCallback(
    (id?: string) => {
      if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'dados') return;
      if (!estado.rerollEscolhido || estado.rerollEscolhidoUsado) return;
      const usar3D = !!estado.motor3D && dado3DAtivo;

      if (id && estado.dadosIndividuais) {
        const dado = estado.dadosIndividuais.find((d) => d.id === id);
        if (!dado || typeof dado.valor !== 'number') return;
        const resultadoBruto = usar3D ? dado.resultadoBruto : undefined;
        setEstado((prev) =>
          prev && prev.dadosIndividuais
            ? {
                ...prev,
                dadosIndividuais: prev.dadosIndividuais.map((d) => (d.id === id ? { ...d, valor: '🎲' } : d)),
                rerollEscolhidoUsado: true,
              }
            : prev,
        );

        function concluir(novoValor: number, novoResultadoBruto?: DiceBoxResultado) {
          setEstado((prev) => {
            if (!prev || !prev.dadosIndividuais) return prev;
            const novosDados = prev.dadosIndividuais.map((d) =>
              d.id === id ? { ...d, valor: novoValor, resultadoBruto: novoResultadoBruto } : d,
            );
            const soma = novosDados.reduce((acc, d) => acc + (typeof d.valor === 'number' ? d.valor : 0), 0);
            return { ...prev, dadosIndividuais: novosDados, total: soma + (prev.mod ?? 0) };
          });
        }

        if (resultadoBruto) {
          rerolarFisico(resultadoBruto, concluir, () => {
            timeoutRef.current = setTimeout(
              () => concluir(1 + Math.floor(Math.random() * dado.lados)),
              DURACAO_ANIMACAO_MS,
            );
          });
          return;
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => concluir(1 + Math.floor(Math.random() * dado.lados)),
          DURACAO_ANIMACAO_MS,
        );
        return;
      }

      if (typeof estado.valorDado !== 'number' || estado.lados === undefined) return;
      const lados = estado.lados;
      const resultadoBruto = usar3D ? estado.resultadoBrutoDados : undefined;
      setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', rerollEscolhidoUsado: true } : prev));

      function concluirUnico(novoValor: number, novoResultadoBruto?: DiceBoxResultado) {
        setEstado((prev) =>
          prev
            ? { ...prev, valorDado: novoValor, total: novoValor + (prev.mod ?? 0), resultadoBrutoDados: novoResultadoBruto }
            : prev,
        );
      }

      if (resultadoBruto) {
        rerolarFisico(resultadoBruto, concluirUnico, () => {
          timeoutRef.current = setTimeout(() => concluirUnico(1 + Math.floor(Math.random() * lados)), DURACAO_ANIMACAO_MS);
        });
        return;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => concluirUnico(1 + Math.floor(Math.random() * lados)), DURACAO_ANIMACAO_MS);
    },
    [estado, dado3DAtivo],
  );

  const escolherVantagemPosRolagem = useCallback(
    (tipo: Vantagem) => {
      if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'd20' || !estado.podeEscolherVantagem) return;
      // 1º dado já parou físico (motor3D) — o 2º entra na MESMA cena
      // via box.add() (não limpa o que já está parado, diferente de
      // .roll()) em vez de Math.random(). Ver "Escolha PÓS-rolagem" em
      // sdd/sdd-dado-3d.md.
      const usar3D = !!estado.motor3D && dado3DAtivo;
      setEstado((prev) => (prev ? { ...prev, dado2: '🎲', vantagem: tipo, podeEscolherVantagem: false } : prev));

      function concluir(rolagem2: number, viaMotor3D: boolean) {
        setEstado((prev) => {
          if (!prev || prev.tipo !== 'd20') return prev;
          const rolagem1 = typeof prev.valorDado === 'number' ? prev.valorDado : 0;
          const usado = prev.vantagem === 'vantagem' ? Math.max(rolagem1, rolagem2) : Math.min(rolagem1, rolagem2);
          const total = usado + (prev.mod ?? 0);
          return { ...prev, dado2: rolagem2, total, critico: criticoDe(usado), dado2Motor3D: viaMotor3D };
        });
      }

      if (usar3D) {
        (async () => {
          try {
            const box = await carregarDiceBox3D();
            await garantirTemaDiceBox3D(box, 'default');
            box.onRollComplete = (resultados) => concluir(resultados[0].value, true);
            box.add('1d20');
          } catch {
            timeoutRef.current = setTimeout(() => {
              concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef), false);
            }, DURACAO_ANIMACAO_MS);
          }
        })();
        return;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef), false);
      }, DURACAO_ANIMACAO_MS);
    },
    [estado, dado3DAtivo],
  );

  const [log, setLog] = useState<RegistroLog[]>([]);
  const adicionarLog = useCallback((registro: Omit<RegistroLog, 'id'>) => {
    const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setLog((prev) => [{ ...registro, id }, ...prev].slice(0, MAX_LOG));
  }, []);

  const fechar = useCallback(() => {
    setEstado((prev) => {
      if (prev && prev.fase === 'concluido') adicionarLog(criarRegistroLogDaRolagem(prev));
      return null;
    });
  }, [adicionarLog]);

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
    const resultadoBruto = estado.motor3D && dado3DAtivo ? estado.resultadoBrutoD20 : undefined;
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', sorteUsada: true } : prev));

    function concluir(novaRolagem: number, novoResultadoBruto?: DiceBoxResultado) {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'd20') return prev;
        const total = novaRolagem + (prev.mod ?? 0) + (typeof prev.bonusExtra?.valor === 'number' ? prev.bonusExtra.valor : 0);
        return { ...prev, valorDado: novaRolagem, total, critico: criticoDe(novaRolagem), resultadoBrutoD20: novoResultadoBruto };
      });
    }

    if (resultadoBruto) {
      rerolarFisico(
        resultadoBruto,
        (novoValor, novoResultado) => concluir(novoValor, novoResultado),
        () => {
          timeoutRef.current = setTimeout(() => concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef)), DURACAO_ANIMACAO_MS);
        },
      );
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef));
    }, DURACAO_ANIMACAO_MS);
  }, [estado, sorteDisponivel, dado3DAtivo]);

  const usarRerollSe1 = useCallback(() => {
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'dados') return;
    if (!estado.rerollSe1 || estado.rerollSe1Usado) return;
    if (estado.valorDado !== 1 || estado.lados === undefined) return;
    const lados = estado.lados;
    const resultadoBruto = estado.motor3D && dado3DAtivo ? estado.resultadoBrutoDados : undefined;
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', rerollSe1Usado: true } : prev));

    function concluir(novaRolagem: number, novoResultadoBruto?: DiceBoxResultado) {
      setEstado((prev) =>
        prev
          ? { ...prev, valorDado: novaRolagem, total: novaRolagem + (prev.mod ?? 0), resultadoBrutoDados: novoResultadoBruto }
          : prev,
      );
    }

    if (resultadoBruto) {
      rerolarFisico(resultadoBruto, concluir, () => {
        timeoutRef.current = setTimeout(() => concluir(1 + Math.floor(Math.random() * lados)), DURACAO_ANIMACAO_MS);
      });
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => concluir(1 + Math.floor(Math.random() * lados)), DURACAO_ANIMACAO_MS);
  }, [estado, dado3DAtivo]);

  const [inspiracaoHeroicaProvider, setInspiracaoHeroicaProvider] = useState<InspiracaoHeroicaProvider | null>(null);
  const registrarInspiracaoHeroica = useCallback(
    (provider: InspiracaoHeroicaProvider | null) => setInspiracaoHeroicaProvider(provider),
    [],
  );

  const usarInspiracaoHeroica = useCallback(() => {
    if (!inspiracaoHeroicaProvider?.disponivel) return;
    if (!estado || estado.fase !== 'concluido' || estado.tipo !== 'd20') return;
    if (estado.dado2 || estado.inspiracaoHeroicaUsada) return;
    const resultadoBruto = estado.motor3D && dado3DAtivo ? estado.resultadoBrutoD20 : undefined;
    inspiracaoHeroicaProvider.usar();
    setEstado((prev) => (prev ? { ...prev, valorDado: '🎲', inspiracaoHeroicaUsada: true } : prev));

    function concluir(novaRolagem: number, novoResultadoBruto?: DiceBoxResultado) {
      setEstado((prev) => {
        if (!prev || prev.tipo !== 'd20') return prev;
        const total = novaRolagem + (prev.mod ?? 0) + (typeof prev.bonusExtra?.valor === 'number' ? prev.bonusExtra.valor : 0);
        return { ...prev, valorDado: novaRolagem, total, critico: criticoDe(novaRolagem), resultadoBrutoD20: novoResultadoBruto };
      });
    }

    if (resultadoBruto) {
      rerolarFisico(
        resultadoBruto,
        (novoValor, novoResultado) => concluir(novoValor, novoResultado),
        () => {
          timeoutRef.current = setTimeout(() => concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef)), DURACAO_ANIMACAO_MS);
        },
      );
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      concluir(rolarD20Dado(modoTesteRef, indiceModoTesteRef));
    }, DURACAO_ANIMACAO_MS);
  }, [estado, inspiracaoHeroicaProvider, dado3DAtivo]);

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
        preferenciaDado3D,
        alternarPreferenciaDado3D,
        dado3DDisponivel,
        dado3DAtivo,
        log,
        adicionarLog,
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
