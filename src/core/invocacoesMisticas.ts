// Invocações Místicas do Bruxo — leitura genérica (wizard B2 + Level
// Up B4.3 usam a mesma função, não duplicam o filtro).

import { invocacoesMisticas, type InvocacaoMistica } from '../data/rulesets/dnd2024/invocacoesMisticas';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import { mecanicaDaMagia } from './magiaDano';

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
 * Sedenta/Devoradora (Ataque Extra) e Pacto do Tomo (Livro das
 * Sombras) têm implementação própria em outro lugar do app. Explosão
 * Agonizante/Repulsiva NÃO entram aqui — ver
 * `INVOCACOES_COM_VINCULO_TRUQUE`, tratamento à parte porque o
 * placeholder some só DEPOIS de vinculadas a um truque. */
const IDS_COM_MECANICA_PROPRIA = ['pacto-da-lamina', 'lamina-sedenta', 'lamina-devoradora', 'pacto-do-tomo'];

/** Invocações que exigem escolher 1 truque de Bruxo conhecido pra
 * vincular — regra real de cada uma:
 * - Explosão Agonizante: truque que CAUSA DANO (soma Carisma ao dano).
 * - Explosão Repulsiva: truque que EXIGE JOGADA DE ATAQUE (nem todo
 *   truque de ataque causa dano — mais amplo que Agonizante; a regra
 *   real permite empurrar 3m o alvo acertado, efeito ainda manual/
 *   narrativo, não automatizado no Combat).
 * A escolha acontece no Level Up, numa tela própria logo depois de
 * Invocações Místicas (`LevelUpShell.tsx`, passo
 * `vinculoTruqueInvocacao`) — só aparece quando a invocação está
 * marcada (nesse level-up ou em algum anterior) e ainda não tem
 * vínculo salvo (`PersonagemSalvo.invocacoesTruqueVinculado`). */
export const INVOCACOES_COM_VINCULO_TRUQUE = ['explosao-agonizante', 'explosao-repulsiva'] as const;

/** Truques de Bruxo (dentre `truquesConhecidos`, por nome) elegíveis
 * pro vínculo de `invocacaoId` — ver critério de cada uma no comentário
 * de `INVOCACOES_COM_VINCULO_TRUQUE`. Devolve `[]` pra qualquer outra
 * invocação (não devia ser chamada fora das 2 de cima). */
export function truquesElegiveisParaVinculo(invocacaoId: string, truquesConhecidos: string[]): Magia[] {
  return truquesConhecidos
    .map((nome) => magias.find((m) => m.nome === nome && m.circulo === 0))
    .filter((m): m is Magia => {
      if (!m || mecanicaDaMagia(m) !== 'ataque') return false;
      if (invocacaoId === 'explosao-agonizante') return m.danoBaseDado !== null;
      if (invocacaoId === 'explosao-repulsiva') return true;
      return false;
    });
}

/** Bônus de dano (mod. de Carisma) que Explosão Agonizante soma à
 * jogada de dano de `magiaNome` — `0` quando `magiaNome` não é o
 * truque vinculado (`PersonagemSalvo.invocacoesTruqueVinculado['explosao-agonizante']`,
 * `undefined` = ainda não vinculado) ou o personagem não tem a
 * invocação vinculada a nada ainda. */
export function bonusExplosaoAgonizante(magiaNome: string, truqueVinculado: string | undefined, modCarisma: number): number {
  if (!truqueVinculado || magiaNome !== truqueVinculado) return 0;
  return modCarisma;
}

/** Invocações passivas de texto puro — regra real, sem cálculo
 * possível (mesmo tratamento das ações genéricas do Cap.1, CLAUDE.md
 * seção 12: texto de regra correto não é placeholder só por ter pouca
 * interatividade). Visão da Bruxa/Visão Diabólica não entram aqui —
 * já saem do `[PH]` sozinhas via `sentidoConcedido`. */
const IDS_PASSIVAS_TEXTO_REAL = ['mente-mistica'];

/** `true` quando a Ficha ainda deve mostrar `[PH] sem efeito mecânico
 * ainda` pra essa invocação. Explosão Agonizante/Repulsiva saem do
 * `[PH]` assim que tiverem um `truqueVinculado` salvo (o vínculo em si
 * já é a "mecânica" — Agonizante soma Carisma de verdade ao dano
 * desse truque; Repulsiva mostra qual truque empurra, mesmo com o
 * empurrão em si ainda manual). As demais seguem a regra de sempre:
 * só as que genuinamente dependem de um sistema que o app não tem
 * (motor de alcance de magia, Familiar, "salvar de 0 PV", Lições dos
 * Grandes Antigos) continuam `true`. Ver PENDENCIAS.md pra cada uma. */
export function invocacaoTemPlaceholder(inv: InvocacaoMistica, truqueVinculado?: string): boolean {
  if (inv.magiaGratisConcedida !== null || inv.pvTemporarioConcedido !== null || inv.sentidoConcedido !== null) {
    return false;
  }
  if (IDS_COM_MECANICA_PROPRIA.includes(inv.id) || IDS_PASSIVAS_TEXTO_REAL.includes(inv.id)) return false;
  if ((INVOCACOES_COM_VINCULO_TRUQUE as readonly string[]).includes(inv.id)) return !truqueVinculado;
  return true;
}
