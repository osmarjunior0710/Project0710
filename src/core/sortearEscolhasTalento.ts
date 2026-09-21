// Sorteio das escolhas de um Talento no wizard (Origem, Versátil da Espécie)
// — usado pelo botão "🎲 Aleatório" de cada lista e pelo "🔀 Sortear tudo
// desta etapa". Sempre evita o que o personagem já possui por outra fonte
// (`ConcessoesJaConcedidas`: Classe/Origem/Espécie/Talento) e nunca repete.

import type { Atributo } from '../data/wizardFixtures';
import type { Talento } from '../data/rulesets/dnd2024/talentos';
import { gruposFerramenta } from '../data/rulesets/dnd2024/ferramentas';
import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';
import { pericias } from '../data/rulesets/dnd2024/pericias';
import type { ConcessoesJaConcedidas } from './concessoesJaConcedidas';
import { sortearEscolhas } from './sortearEscolhas';

const todasFerramentas = Array.from(new Set(Object.values(gruposFerramenta).flat().map((f) => f.nome))).sort();

export const ATRIBUTOS_DE_CONJURACAO: Atributo[] = ['INT', 'SAB', 'CAR'];

/** Opções e quantidade de um talento que concede proficiências (perícias e/
 * ou ferramentas) à escolha — `null` se o talento não concede isso. */
export function opcoesProficienciaDoTalento(talento: Talento): { opcoes: string[]; max: number } | null {
  const concede = talento.concedeProficiencias;
  const grupo = talento.concedeFerramentaGrupo;
  if (!concede && !grupo) return null;
  const max = concede?.quantidade ?? grupo!.quantidade;
  const mostrarPericias = concede?.tipos.includes('pericia') ?? false;
  const mostrarFerramentas = grupo !== undefined || (concede?.tipos.includes('ferramenta') ?? false);
  const opcoesFerramenta = grupo ? (gruposFerramenta[grupo.grupo] ?? []).map((f) => f.nome) : todasFerramentas;
  return {
    opcoes: [...(mostrarPericias ? pericias.map((p) => p.nome) : []), ...(mostrarFerramentas ? opcoesFerramenta : [])],
    max,
  };
}

/** Sorteia as proficiências do talento, mantendo `atuais` (se couber) e
 * evitando perícias/ferramentas que o personagem já tem. */
export function sortearProficienciasDoTalento(
  talento: Talento,
  jaConcedidas: ConcessoesJaConcedidas,
  atuais: string[] = [],
  rng?: () => number,
): string[] {
  const info = opcoesProficienciaDoTalento(talento);
  if (!info) return atuais;
  const evitar = new Set<string>([...jaConcedidas.pericias.keys(), ...jaConcedidas.ferramentas.keys()]);
  return sortearEscolhas(info.opcoes, atuais, info.max, evitar, rng);
}

/** "Já possui" por OUTRA fonte que não o próprio talento. */
function deOutraFonte(mapa: Map<string, string>): Set<string> {
  return new Set([...mapa].filter(([, fonte]) => fonte !== 'Talento').map(([nome]) => nome));
}

/** Iniciado em Magia: 2 truques + 1 magia de 1º círculo da `lista` de classe
 * (Clérigo/Druida/Mago), nenhum já possuído por outra fonte, e um atributo
 * de conjuração. */
export function sortearMagiaIniciada(
  lista: string,
  jaConcedidas: ConcessoesJaConcedidas,
  rng: () => number = Math.random,
): { truques: string[]; magia: string | null; atributo: Atributo } {
  const truques = sortearEscolhas(
    magiasDaClasse(lista, 0).map((m) => m.nome),
    [],
    2,
    deOutraFonte(jaConcedidas.truques),
    rng,
  );
  const [magia] = sortearEscolhas(
    magiasDaClasse(lista, 1).map((m) => m.nome),
    [],
    1,
    deOutraFonte(jaConcedidas.magias),
    rng,
  );
  const atributo = ATRIBUTOS_DE_CONJURACAO[Math.min(ATRIBUTOS_DE_CONJURACAO.length - 1, Math.floor(rng() * ATRIBUTOS_DE_CONJURACAO.length))];
  return { truques, magia: magia ?? null, atributo };
}
