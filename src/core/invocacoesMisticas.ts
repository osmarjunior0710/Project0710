// Invocações Místicas do Bruxo — leitura genérica (wizard B2 + Level
// Up B4.3 usam a mesma função, não duplicam o filtro).

import { invocacoesMisticas, type InvocacaoMistica } from '../data/rulesets/dnd2024/invocacoesMisticas';

/** Invocações que o personagem já pode escolher/manter num dado nível
 * — sem pré-requisito de nível, ou com pré-requisito já alcançado.
 * Só olha nível — `invocacaoRequeridaId` (dependência entre
 * invocações) é checado à parte, ver funções abaixo, porque depende
 * do que o jogador JÁ marcou, não só do nível. */
export function invocacoesElegiveisAteNivel(nivel: number): InvocacaoMistica[] {
  return invocacoesMisticas.filter((i) => i.prerequisitos.nivelMinimo === null || i.prerequisitos.nivelMinimo <= nivel);
}

/** A invocação que `inv` exige (Pacto da Lâmina pra Lâmina Sedenta,
 * por exemplo), ou `null` quando `inv` não depende de nenhuma outra. */
export function invocacaoRequeridaDe(inv: InvocacaoMistica): InvocacaoMistica | null {
  if (!inv.prerequisitos.invocacaoRequeridaId) return null;
  return invocacoesMisticas.find((i) => i.id === inv.prerequisitos.invocacaoRequeridaId) ?? null;
}

/** `true` quando `inv` tem uma invocação-requisito e ela NÃO está entre
 * as atualmente marcadas — bloqueia escolher `inv` sozinha (regra real:
 * Lâmina Sedenta não existe sem Pacto da Lâmina, Lâmina Devoradora não
 * existe sem Lâmina Sedenta, etc.). */
export function invocacaoBloqueadaPorRequisitoAusente(inv: InvocacaoMistica, invocacoesAtuais: string[]): boolean {
  const requerida = inv.prerequisitos.invocacaoRequeridaId;
  return requerida !== null && !invocacoesAtuais.includes(requerida);
}

/** Invocações (dentre as atualmente marcadas) que dependem de `id` —
 * usado pra travar a REMOÇÃO: não dá pra tirar Pacto da Lâmina
 * enquanto Lâmina Sedenta ainda estiver marcada (regra real: pra
 * abandonar uma cadeia, precisa desmontar de trás pra frente, 1 troca
 * por level-up). */
export function invocacoesQueDependemDe(id: string, invocacoesAtuais: string[]): InvocacaoMistica[] {
  return invocacoesMisticas.filter(
    (i) => i.prerequisitos.invocacaoRequeridaId === id && invocacoesAtuais.includes(i.id),
  );
}

/** Invocações com mecânica própria que não passa por nenhum dos 3
 * campos padrão (`magiaGratisConcedida`/`pvTemporarioConcedido`/
 * `sentidoConcedido`) — Pacto da Lâmina (cria a arma), Lâmina
 * Sedenta/Devoradora (Ataque Extra), Pacto do Tomo (Livro das
 * Sombras) e Explosão Agonizante (soma Carisma ao dano de Raio
 * Místico, ver `bonusExplosaoAgonizante`) têm implementação própria
 * em outro lugar do app. */
const IDS_COM_MECANICA_PROPRIA = ['pacto-da-lamina', 'lamina-sedenta', 'lamina-devoradora', 'pacto-do-tomo', 'explosao-agonizante'];

/** Regra real: Explosão Agonizante deixa o jogador escolher QUALQUER
 * truque de Bruxo causador de dano pra vincular o bônus — o app ainda
 * não modela essa escolha (`repetivel`, comentário "Fase 2" em
 * `InvocacaoMistica`). Simplificação adotada: fixar em Raio Místico
 * (id `raiomistico`) — único truque causador de dano EXCLUSIVO de
 * Bruxo (Rajada de Veneno/Toque Necrótico são compartilhados com
 * outras classes), de longe a escolha mais comum na mesa de verdade. */
const ID_TRUQUE_EXPLOSAO_AGONIZANTE = 'raiomistico';

/** Bônus de dano (mod. de Carisma) que Explosão Agonizante soma à
 * jogada de dano de `magiaId` — `0` quando a magia não é o truque
 * vinculado (ver `ID_TRUQUE_EXPLOSAO_AGONIZANTE`) ou o personagem não
 * tem a invocação. */
export function bonusExplosaoAgonizante(magiaId: string, invocacoesAtuais: string[], modCarisma: number): number {
  if (magiaId !== ID_TRUQUE_EXPLOSAO_AGONIZANTE) return 0;
  if (!invocacoesAtuais.includes('explosao-agonizante')) return 0;
  return modCarisma;
}

/** Invocações passivas de texto puro — regra real, sem cálculo
 * possível (mesmo tratamento das ações genéricas do Cap.1, CLAUDE.md
 * seção 12: texto de regra correto não é placeholder só por ter pouca
 * interatividade). Visão da Bruxa/Visão Diabólica não entram aqui —
 * já saem do `[PH]` sozinhas via `sentidoConcedido`. */
const IDS_PASSIVAS_TEXTO_REAL = ['mente-mistica'];

/** `true` quando a Ficha ainda deve mostrar `[PH] sem efeito mecânico
 * ainda` pra essa invocação — só as que genuinamente dependem de um
 * sistema que o app não tem (motor de dano/alcance de magia, Familiar,
 * "salvar de 0 PV", ou uma escolha extra tipo Lições dos Grandes
 * Antigos) continuam `true`. Ver PENDENCIAS.md pra cada uma. */
export function invocacaoTemPlaceholder(inv: InvocacaoMistica): boolean {
  if (inv.magiaGratisConcedida !== null || inv.pvTemporarioConcedido !== null || inv.sentidoConcedido !== null) {
    return false;
  }
  if (IDS_COM_MECANICA_PROPRIA.includes(inv.id) || IDS_PASSIVAS_TEXTO_REAL.includes(inv.id)) return false;
  return true;
}
