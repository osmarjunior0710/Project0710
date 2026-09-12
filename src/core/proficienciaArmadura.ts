// Proficiência de armadura/escudo real por classe — SDD "Penalidades
// por Falta de Proficiência (Armadura, Escudo e Arma)", fornecido pelo
// Osmar. Mesmo padrão de `core/proficienciaArma.ts` (planilha, aba
// "Proficiências de Classe", zero constante hardcoded de classe aqui),
// só que pra `treinamentoArmadura` em vez de `proficienciaArmas`.

import type { Classe } from '../data/rulesets/dnd2024/classes';
import type { Armadura } from '../data/rulesets/dnd2024/armaduras';
import { proficienciasArmaArmaduraClasse } from '../data/rulesets/dnd2024/proficienciasArmaArmaduraClasse';
import { proficienciasEntradaMulticlasse } from '../data/rulesets/dnd2024/proficienciasEntradaMulticlasse';
import { talentos } from '../data/rulesets/dnd2024/talentos';

export type CategoriaArmadura = 'Leve' | 'Média' | 'Pesada' | 'Escudos';

/** Categorias de Armadura/Escudo concedidas por talento (Especialista
 * em Armaduras Leves/Médias/Pesadas) — varre TODOS os talentos em
 * `talentosAtuais`, não só o primeiro achado, porque mais de um pode
 * conceder categorias diferentes ao mesmo personagem (ex.: Leves +
 * Médias no mesmo personagem, cada um com seu próprio `efeitoMecanico`
 * do mesmo tipo). Diferente de `efeitoMecanicoDoTalento`
 * (`calculoPersonagem.ts`), que devolve só o primeiro match — não
 * serve aqui. */
function categoriasArmaduraDosTalentos(talentosAtuais: string[] | undefined): Set<CategoriaArmadura> {
  const categorias = new Set<CategoriaArmadura>();
  if (!talentosAtuais) return categorias;
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'proficiencia-armadura') {
      t.efeitoMecanico.categorias.forEach((c) => categorias.add(c));
    }
  }
  return categorias;
}

/** `true` se a classe ATIVA (ou um talento como Especialista em
 * Armaduras, ou uma OUTRA classe multiclassada em `classesExtrasNomes`)
 * dá treinamento com a categoria de Armadura/Escudo. `talentosAtuais`
 * é opcional, mesmo padrão de `classeProficienteComArma`. Sem entrada
 * de classe nem talento = sem treinamento (nunca assume).
 * `classesExtrasNomes` = nomes de OUTRAS classes que o personagem já
 * tem via multiclasse (ver `core/multiclasse.ts`) — cada uma checada
 * pelo pacote REDUZIDO de `proficienciasEntradaMulticlasse.ts`, nunca
 * pelo pacote de nível 1 completo (só a classe ativa usa esse). */
export function classeProficienteComArmadura(
  classe: Classe,
  categoria: CategoriaArmadura,
  talentosAtuais?: string[],
  classesExtrasNomes?: string[],
): boolean {
  if (categoriasArmaduraDosTalentos(talentosAtuais).has(categoria)) return true;

  const entrada = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
  if (entrada?.treinamentoArmadura.includes(categoria)) return true;

  for (const nomeExtra of classesExtrasNomes ?? []) {
    const entradaExtra = proficienciasEntradaMulticlasse.find((p) => p.classe === nomeExtra);
    if (entradaExtra?.treinamentoArmadura.includes(categoria)) return true;
  }

  return false;
}

/** Categoria de Armadura (Leve/Média/Pesada) da armadura equipada —
 * `null` sem armadura (a categoria "Escudo" nunca aparece aqui, ela é
 * tratada à parte por `classeProficienteComArmadura(..., 'Escudos')`,
 * ver `core/calculoPersonagem.ts`). */
export function categoriaArmaduraEquipada(armaduraCatalogo: Armadura | undefined): 'Leve' | 'Média' | 'Pesada' | null {
  if (!armaduraCatalogo) return null;
  if (armaduraCatalogo.categoria.startsWith('Armadura Leve')) return 'Leve';
  if (armaduraCatalogo.categoria.startsWith('Armadura Média')) return 'Média';
  if (armaduraCatalogo.categoria.startsWith('Armadura Pesada')) return 'Pesada';
  return null;
}

/** `true` = personagem está vestindo Armadura (Leve/Média/Pesada) sem
 * treinamento com ela agora — gatilho das 2 penalidades do SDD:
 * Desvantagem em D20 de Força/Destreza (`core/ataque.ts`,
 * `AtributosTab`, Iniciativa) e bloqueio de conjuração
 * (`AcaoPanelContent.conjurarMagia`). Sem armadura equipada = `false`
 * (a regra só existe enquanto a armadura errada estiver no corpo). */
export function armaduraSemTreinamentoEquipada(
  classe: Classe | null,
  armaduraCatalogo: Armadura | undefined,
  talentosAtuais?: string[],
  classesExtrasNomes?: string[],
): boolean {
  const categoria = categoriaArmaduraEquipada(armaduraCatalogo);
  if (categoria === null || !classe) return false;
  return !classeProficienteComArmadura(classe, categoria, talentosAtuais, classesExtrasNomes);
}
