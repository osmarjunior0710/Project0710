// Disciplinas Psiônicas (Psiônico, UA 2025) — regra da escolha e do uso por turno. Ver sdd/sdd-psionico.md.
//
// "Você adquire duas disciplinas à sua escolha. Você pode usar apenas uma disciplina por turno, e apenas
// uma vez por turno, a menos que a descrição diga o contrário. Sempre que você subir de nível como
// psiônico, pode substituir uma disciplina conhecida por outra. Você aprende uma opção adicional no
// nível 5, 10, 13 e 17."
//
// [PH] [codeimplementation] — a escolha (Level Up) e a regra de uso por turno estão aqui; a mecânica de cada
// disciplina entra nas entregas E4b-E4d.

import type { Classe } from '../data/rulesets/dnd2024/classes';
import { caracteristicasClasse } from '../data/rulesets/dnd2024/caracteristicasClasse';
import { disciplinasPsionicas, type DisciplinaPsionica } from '../data/rulesets/dnd2024/disciplinasPsionicas';

const NOME_CARACTERISTICA = 'Disciplina Psiônica';

/** Quantas Disciplinas Psiônicas o personagem conhece no nível de PSIÔNICO dado: 2 no nível em que a característica
 * aparece pela 1ª vez (nível 2) e +1 em cada nível seguinte em que ela reaparece (5, 10, 13 e 17) — lido da
 * progressão da classe, nenhum nível hardcoded. */
export function quantidadeDisciplinasPsionicas(classe: Classe, nivelPsionico: number): number {
  const aparicoes = classe.progressao.filter((p) => p.nivel <= nivelPsionico && p.caracteristicas.includes(NOME_CARACTERISTICA)).length;
  return aparicoes === 0 ? 0 : aparicoes + 1;
}

/** O PDF só descreve a característica na classe; confirma que o texto existe (usado em teste). */
export function caracteristicaDisciplinaTemTexto(): boolean {
  return caracteristicasClasse.some((c) => c.classe === 'Psiônico' && c.nome === NOME_CARACTERISTICA && c.descricao.length > 0);
}

/** Disciplinas cujo texto diz que NÃO gastam a "1 por turno": Defesa Psiônica ("Você ainda pode usar outra Disciplina
 * Psiônica neste turno") e Mente Aguçada ("Ao usar Mente Aguçada, você também pode usar uma Disciplina Psiônica
 * diferente neste turno"). */
export const DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO: readonly string[] = ['defesa-psionica', 'mente-agucada'];

export interface UsoDeDisciplinasNoTurno {
  /** Ids das disciplinas já usadas neste turno. */
  usadas: string[];
}

/** Resultado de tentar usar uma disciplina agora — `motivo` explica o bloqueio pra mostrar na tela. */
export function podeUsarDisciplina(estado: UsoDeDisciplinasNoTurno, id: string): { pode: true } | { pode: false; motivo: string } {
  if (estado.usadas.includes(id)) return { pode: false, motivo: 'Essa Disciplina já foi usada neste turno.' };
  const jaUsouComum = estado.usadas.some((u) => !DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO.includes(u));
  if (jaUsouComum) return { pode: false, motivo: 'Você já usou uma Disciplina Psiônica neste turno.' };
  return { pode: true };
}

/** Registra o uso (imutável) — chamar só depois de `podeUsarDisciplina` dar `pode: true`. */
export function registrarUsoDeDisciplina(estado: UsoDeDisciplinasNoTurno, id: string): UsoDeDisciplinasNoTurno {
  return { usadas: [...estado.usadas, id] };
}

/** `true` quando já usou alguma disciplina "comum" (que conta na regra de 1 por turno) neste turno —
 * usado por quem ainda não sabe QUAL disciplina vai se aplicar (ex.: antes de saber a escola da magia
 * conjurada), só se já está bloqueado de qualquer forma. */
export function algumaDisciplinaComumUsadaNoTurno(estado: UsoDeDisciplinasNoTurno): boolean {
  return estado.usadas.some((u) => !DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO.includes(u));
}

/** Qual das disciplinas CONHECIDAS soma o Dado de Energia a esta rolagem de d20 — por perícia (o rótulo da rolagem é o nome da perícia)
 * ou por ataque. `null` = nenhuma se aplica. */
export function disciplinaParaRolagem(conhecidas: string[], rolagem: { label: string; ehAtaque: boolean }): DisciplinaPsionica | null {
  for (const d of disciplinasPsionicas) {
    if (!conhecidas.includes(d.id) || !d.gatilho) continue;
    if (d.gatilho.tipo === 'ataque' && rolagem.ehAtaque) return d;
    if (d.gatilho.tipo === 'pericia' && !rolagem.ehAtaque && d.gatilho.pericias.includes(rolagem.label)) return d;
  }
  return null;
}

/** A regra "1 disciplina por turno, 1 vez cada" só existe onde há o conceito de turno: as rolagens da aba Combate (ataque). Um teste de
 * perícia feito pela aba Atributos é narrativo — sem turno, sem limite e sem registrar uso (a mesma disciplina pode ser usada de novo). */
export function rolagemTemLimiteDeTurno(rolagem: { ehAtaque: boolean }): boolean {
  return rolagem.ehAtaque;
}

/** Qual das disciplinas CONHECIDAS se encaixa ao conjurar `magia` (E4c) — por escola, e só quando a
 * magia exige teste de resistência pras que pedem isso (Insinuação do Id, Pensamentos Destrutivos).
 * `null` = nenhuma se aplica (escola não bate, ou a disciplina não foi escolhida). */
export function disciplinaParaConjuracao(conhecidas: string[], magia: { escola: string }, exigeSalvaguarda: boolean): DisciplinaPsionica | null {
  for (const d of disciplinasPsionicas) {
    if (!conhecidas.includes(d.id) || d.gatilho?.tipo !== 'conjuracao') continue;
    if (!d.gatilho.escolas.includes(magia.escola)) continue;
    if (d.gatilho.exigeSalvaguarda && !exigeSalvaguarda) continue;
    return d;
  }
  return null;
}
