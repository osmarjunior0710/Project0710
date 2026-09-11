import type { Criatura } from '../data/rulesets/dnd2024/criaturas';
import { caCriatura, pvMaxCriatura, valorAtributoCriatura } from './criaturas';
import { modFmt } from './personagem';
import { aplicarAlteracaoPv, ganharPvTemporario } from './pvTemporario';
import type { Atributo } from '../data/wizardFixtures';

/** Sobrescreve CA/PV máximo/atributos específicos da `Criatura` de
 * origem de um pet — "pega uma criatura do catálogo e ajusta alguns
 * números" (pedido do Osmar, Fase P/P5), não um stat block livre do
 * zero. Campo ausente = usa o valor da criatura normalmente. */
export interface AjustesPet {
  ca?: number;
  pvMax?: number;
  atributos?: Partial<Record<Atributo, number>>;
}

/** Bônus extra manual (ligado/desligado pelo jogador) num pet — pra
 * característica que dá PV/dano bônus a certos pets sem o motor
 * genérico precisar saber qual característica é (ex: Legião dos
 * Mortos do Necromante, ver `core/necromante.ts`). `rotulo` é só
 * texto pra exibição, os valores vêm calculados de fora. */
export interface BonusExtraPet {
  rotulo: string;
  pv: number;
  dano: number;
}

/** Pet/companheiro sob controle do personagem (Familiar do Bruxo/Mago,
 * Morto-Vivo do Necromante, montaria, etc) — em array desde o início
 * (nunca trava em "1 só"), ver EmDevB.md Fase P/P0. PV rastreado de
 * verdade (não só exibido), mesmo padrão -5/-1/+1/+5 já usado pro
 * personagem, incluindo PV Temporário (`core/pvTemporario.ts` — mesmo
 * motor genérico do personagem, primeira fonte pra pet é Mestre da
 * Morte do Necromante, ver `core/necromante.ts`). */
export interface Pet {
  id: string;
  /** Nome escolhido pelo jogador pra esse pet (não o nome da espécie). */
  nome: string;
  /** Referencia `Criatura.id` em `data/rulesets/dnd2024/criaturas.ts` —
   * de lá vêm CA/PV máximo/atributos/ações (nunca duplicados aqui,
   * exceto o que `ajustes` sobrescrever). */
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
  /** Ver `AjustesPet` — ausente/vazio = usa a criatura de origem sem
   * nenhuma alteração (caso comum). */
  ajustes?: AjustesPet;
  /** Ver `BonusExtraPet` — `null`/ausente = nenhum bônus ativo. */
  bonusExtra?: BonusExtraPet | null;
  /** PV Temporário do pet — mesmo motor de `personagem.pvTemporarioAtual`
   * (absorve dano antes do PV normal, não soma com o que já tem, fica
   * o maior valor). `undefined`/0 = nenhum. */
  pvTemporario?: number;
}

let contadorId = 0;
function gerarIdPet(): string {
  contadorId += 1;
  return `pet-${Date.now()}-${contadorId}`;
}

export function criarPet(nome: string, criatura: Criatura, origemInvocacaoId?: string, ajustes?: AjustesPet): Pet {
  return {
    id: gerarIdPet(),
    nome,
    criaturaId: criatura.id,
    pvAtual: ajustes?.pvMax ?? pvMaxCriatura(criatura),
    origemInvocacaoId,
    ajustes,
  };
}

/** Aplica dano (`delta` negativo) ou cura (`delta` positivo) a um pet,
 * sempre travado entre 0 e o PV máximo (já considerando `ajustes`) —
 * dano desconta primeiro do PV Temporário do pet, igual ao personagem
 * (`aplicarAlteracaoPv`, mesmo motor reaproveitado). */
export function alterarPvPet(pet: Pet, delta: number, pvMax: number): Pet {
  const resultado = aplicarAlteracaoPv(pet.pvAtual, pvMax, pet.pvTemporario ?? 0, delta);
  return { ...pet, pvAtual: resultado.pvAtual, pvTemporario: resultado.pvTemporario };
}

/** Concede PV Temporário a um pet — não soma com o que já tem, fica o
 * maior valor entre os dois (mesma regra de `ganharPvTemporario` do
 * personagem, ver `core/pvTemporario.ts`). */
export function ganharPvTemporarioPet(pet: Pet, valor: number): Pet {
  return { ...pet, pvTemporario: ganharPvTemporario(pet.pvTemporario ?? 0, valor) };
}

export function caEfetivaPet(pet: Pet, criatura: Criatura): number {
  return pet.ajustes?.ca ?? caCriatura(criatura);
}

export function pvMaxEfetivoPet(pet: Pet, criatura: Criatura): number {
  const base = pet.ajustes?.pvMax ?? pvMaxCriatura(criatura);
  return base + (pet.bonusExtra?.pv ?? 0);
}

/** Liga (`bonusExtra` preenchido) ou desliga (`null`) o bônus extra
 * manual de um pet — motor genérico, quem chama decide rótulo/valores
 * (ver `BonusExtraPet`). */
export function comBonusExtra(pet: Pet, bonusExtra: BonusExtraPet | null): Pet {
  return { ...pet, bonusExtra: bonusExtra ?? undefined };
}

/** Valor de um atributo do pet, já formatado `"valor (mod)"` igual ao
 * padrão de exibição de `Criatura.atributos` — usa o ajuste quando
 * existir, senão o valor original da criatura (já vem formatado). */
export function atributoEfetivoPet(pet: Pet, criatura: Criatura, atributo: Atributo): string {
  const ajuste = pet.ajustes?.atributos?.[atributo];
  if (ajuste === undefined) return criatura.atributos[atributo];
  return `${ajuste} (${modFmt(ajuste)})`;
}

/** Compara os valores digitados num formulário de ajuste contra os da
 * criatura base e devolve só o que REALMENTE mudou — evita salvar
 * `ajustes` redundante quando o jogador não alterou nada daquele
 * campo (ver `AjustarPetShell.tsx`). `undefined` no valor final =
 * campo não editado. */
export function calcularAjustesPet(
  criatura: Criatura,
  valores: { ca: number; pvMax: number; atributos: Record<Atributo, number> },
): AjustesPet {
  const ajustes: AjustesPet = {};
  if (valores.ca !== caCriatura(criatura)) ajustes.ca = valores.ca;
  if (valores.pvMax !== pvMaxCriatura(criatura)) ajustes.pvMax = valores.pvMax;
  const atributosAjustados: Partial<Record<Atributo, number>> = {};
  for (const atributo of Object.keys(valores.atributos) as Atributo[]) {
    if (valores.atributos[atributo] !== valorAtributoCriatura(criatura, atributo)) {
      atributosAjustados[atributo] = valores.atributos[atributo];
    }
  }
  if (Object.keys(atributosAjustados).length > 0) ajustes.atributos = atributosAjustados;
  return ajustes;
}
