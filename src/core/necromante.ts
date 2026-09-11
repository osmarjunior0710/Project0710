import type { Classe } from '../data/rulesets/dnd2024/classes';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import { criaturas, type Criatura } from '../data/rulesets/dnd2024/criaturas';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import { caracteristicaSubclasseDesbloqueada } from './levelUp';
import type { Pet } from './pets';

function circuloMaximoNoNivel(classe: Classe, nivel: number): number {
  return Math.max(0, ...espacosDeMagiaAtivos(classe, nivel).map((e) => e.circulo));
}

/** Perito em Necromancia (Necromante, nível 3, homebrew — ver
 * `caracteristicasSubclasseHomebrew.ts`): quantas magias de
 * Necromancia bônus (gratuitas no Livro de Magias) esse LEVEL-UP
 * específico concede — não é acumulado, é só o delta de "agora" (mesmo
 * padrão de ASI/Arcana Mística em `LevelUpShell.tsx`, que também
 * checam o que muda entre `nivelAnterior` e `novoNivel`). 2 ao atingir
 * o nível 3 (quando a subclasse é escolhida); +1 toda vez que um novo
 * círculo de magia é desbloqueado depois disso; 0 em qualquer outro
 * level-up (inclusive se ainda não tiver a subclasse). */
export function magiasPeritoNecromanciaNesteNivel(classe: Classe, nivelAnterior: number, novoNivel: number): number {
  if (novoNivel < 3) return 0;
  if (novoNivel === 3) return 2;
  const circuloAntes = circuloMaximoNoNivel(classe, nivelAnterior);
  const circuloDepois = circuloMaximoNoNivel(classe, novoNivel);
  return circuloDepois > circuloAntes ? 1 : 0;
}

/** Catálogo elegível pro Perito em Necromancia nesse nível — só magias
 * de Necromancia de verdade (círculo 1+, "magias" no texto da
 * característica, nunca truques — qualquer classe, a característica
 * não restringe à lista de magias de Mago) até o círculo máximo
 * disponível. */
export function catalogoPeritoNecromancia(circuloMaximo: number): Magia[] {
  return magias.filter((m) => m.escola === 'Necromancia' && m.circulo >= 1 && m.circulo <= circuloMaximo);
}

const NOMES_FAMILIAR_MORTO_VIVO = ['Esqueleto', 'Zumbi'];

/** Familiar Morto-Vivo (parte de "Grimório de Necromancia", nível 3,
 * homebrew): ao conjurar Encontrar Familiar, o familiar pode assumir
 * forma de Esqueleto ou Zumbi em vez das formas usuais — mesmo padrão
 * de `formasFamiliarDasInvocacoes` (Bruxo/Pacto da Corrente), só que a
 * elegibilidade vem de uma característica de subclasse em vez de uma
 * Invocação Mística. `[]` = personagem ainda não tem a característica
 * (esconde a caixa "Convocar Familiar" na aba Pets). */
export function formasFamiliarMortoVivoElegiveis(subclasse: string | null, nivel: number): Criatura[] {
  if (!caracteristicaSubclasseDesbloqueada(subclasse, 'Grimório de Necromancia', nivel)) return [];
  return criaturas.filter((c) => NOMES_FAMILIAR_MORTO_VIVO.includes(c.nome));
}

/** `Criatura.tipo` é "Morto-Vivo" (Esqueleto) ou "Morto-vivo" (Zumbi)
 * na planilha — mesma coisa, mas grafada diferente entre linhas (ver
 * PENDENCIAS.md, aviso ao Osmar). Comparação sem diferenciar
 * maiúscula/minúscula pra não depender de corrigir o dado agora. */
export function ehMortoVivo(criatura: Criatura): boolean {
  return criatura.tipo.toLowerCase() === 'morto-vivo';
}

/** Legião dos Mortos (Necromante, nível 6, homebrew): PV extra (igual
 * ao nível de Mago) e dano bônus (igual ao mod. de Inteligência) que
 * Mortos-Vivos convocados/criados por magia de Necromancia ganham —
 * calculado aqui, mas aplicado manualmente por pet em `PetsTab.tsx`
 * (não dá pra saber automaticamente qual pet veio de qual magia). */
export function bonusLegiaoDosMortos(nivelMago: number, modInt: number): { pv: number; dano: number } {
  return { pv: nivelMago, dano: modInt };
}

/** Colheita Macabra (parte de "Grimório de Necromancia", nível 3,
 * homebrew): quanto um Morto-Vivo aliado recupera de PV sempre que o
 * personagem conjura uma magia de Necromancia usando um espaço de
 * magia — dobro do círculo do espaço gasto (upcast conta o círculo do
 * espaço, não o círculo original da magia). */
export function curaColheitaMacabra(circuloDoEspacoGasto: number): number {
  return circuloDoEspacoGasto * 2;
}

/** Pets Morto-Vivo sob controle do personagem — filtro reaproveitado
 * por toda característica que só afeta Mortos-Vivos (Colheita
 * Macabra, Colheita dos Mortos, Mestre da Morte), ver `ehMortoVivo`. */
export function petsMortoVivo(pets: Pet[]): Pet[] {
  return pets.filter((p) => {
    const criatura = criaturas.find((c) => c.id === p.criaturaId);
    return criatura !== undefined && ehMortoVivo(criatura);
  });
}

/** Personagem "Ensanguentado" — PV atual em metade ou menos do
 * máximo (arredondado pra baixo), condição padrão de D&D 2024 que
 * dispara Colheita dos Mortos (Necromante, nível 10). */
export function personagemEnsanguentado(pvAtual: number, pvMax: number): boolean {
  return pvMax > 0 && pvAtual <= Math.floor(pvMax / 2);
}

/** Colheita dos Mortos (Necromante, nível 10, homebrew): quanto o
 * personagem recupera de PV ao reduzir a 0 PV um Morto-Vivo sob seu
 * controle — igual ao nível de Mago do personagem (texto real da
 * característica, ver `caracteristicasSubclasseHomebrew.ts`; corrigido
 * de uma transcrição anterior errada que usava "dobro do ND" — o
 * Osmar reportou testando no celular, nível 11 curou só 1 PV em vez
 * de 11). Não depende da criatura em si, por isso não precisa mais de
 * `ndCriatura`. */
export function curaColheitaDosMortos(nivelMago: number): number {
  return nivelMago;
}

/** Pets Morto-Vivo elegíveis pra Colheita dos Mortos, já com a cura
 * calculada (mesmo valor pra todos — não varia por pet, ver
 * `curaColheitaDosMortos`). */
export function opcoesColheitaDosMortos(pets: Pet[], nivelMago: number): { pet: Pet; cura: number }[] {
  const cura = curaColheitaDosMortos(nivelMago);
  return petsMortoVivo(pets).map((pet) => ({ pet, cura }));
}

/** Mestre da Morte (Necromante, nível 14, parte de Ação Bônus): quanto
 * PV Temporário cada Morto-Vivo controlado ganha — igual ao nível de
 * Mago do personagem. */
export function bonusPvTempMestreDaMorte(nivelMago: number): number {
  return nivelMago;
}

/** Mestre da Morte (Necromante, nível 14, parte de Reação): `true` =
 * existe pelo menos 1 Morto-Vivo controlado reduzido a 0 PV agora —
 * gatilho da Reação de explosão necrótica, independente de COMO o pet
 * chegou a 0 (dano manual na aba Pets ou a própria Colheita dos
 * Mortos), já que os dois só mexem no mesmo `Pet.pvAtual` compartilhado. */
export function algumMortoVivoEm0PV(pets: Pet[]): boolean {
  return petsMortoVivo(pets).some((p) => p.pvAtual === 0);
}
