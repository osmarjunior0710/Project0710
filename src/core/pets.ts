import type { Criatura } from '../data/rulesets/dnd2024/criaturas';
import { pvMaxCriatura } from './criaturas';

/** Pet/companheiro sob controle do personagem (Familiar do Bruxo/Mago,
 * Morto-Vivo do Necromante, montaria, etc) — em array desde o início
 * (nunca trava em "1 só"), ver EmDevB.md Fase P/P0. PV rastreado de
 * verdade (não só exibido), mesmo padrão -5/-1/+1/+5 já usado pro
 * personagem (`core/pvTemporario.ts`), sem PV Temporário (pets ainda
 * não têm nenhuma fonte disso). */
export interface Pet {
  id: string;
  /** Nome escolhido pelo jogador pra esse pet (não o nome da espécie). */
  nome: string;
  /** Referencia `Criatura.id` em `data/rulesets/dnd2024/criaturas.ts` —
   * de lá vêm CA/PV máximo/atributos/ações (nunca duplicados aqui). */
  criaturaId: string;
  pvAtual: number;
  /** `InvocacaoMistica.id` que concedeu esse pet (ex:
   * "pacto-da-corrente"), quando veio de uma fonte restrita — convocar
   * de novo pela MESMA fonte substitui o pet anterior dela (mesmo
   * padrão de "só 1 arma de pacto por vez" do Pacto da Lâmina, ver
   * DECISOES-CLASSES.md), sem afetar pets de outras origens.
   * `undefined` = pet avulso/manual (P5), nunca substituído
   * automaticamente. */
  origemInvocacaoId?: string;
}

let contadorId = 0;
function gerarIdPet(): string {
  contadorId += 1;
  return `pet-${Date.now()}-${contadorId}`;
}

export function criarPet(nome: string, criatura: Criatura, origemInvocacaoId?: string): Pet {
  return { id: gerarIdPet(), nome, criaturaId: criatura.id, pvAtual: pvMaxCriatura(criatura), origemInvocacaoId };
}

/** Aplica dano (`delta` negativo) ou cura (`delta` positivo) a um pet,
 * sempre travado entre 0 e o PV máximo da criatura de origem. */
export function alterarPvPet(pet: Pet, delta: number, pvMax: number): Pet {
  return { ...pet, pvAtual: Math.max(0, Math.min(pvMax, pet.pvAtual + delta)) };
}
