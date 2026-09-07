// Proficiência de armadura/escudo real por classe — SDD "Penalidades
// por Falta de Proficiência (Armadura, Escudo e Arma)", fornecido pelo
// Osmar. Mesmo padrão de `core/proficienciaArma.ts` (planilha, aba
// "Proficiências de Classe", zero constante hardcoded de classe aqui),
// só que pra `treinamentoArmadura` em vez de `proficienciaArmas`.

import type { Classe } from '../data/rulesets/dnd2024/classes';
import { proficienciasArmaArmaduraClasse } from '../data/rulesets/dnd2024/proficienciasArmaArmaduraClasse';
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

/** `true` se a classe (ou um talento como Especialista em Armaduras)
 * dá treinamento com a categoria de Armadura/Escudo — lê o texto
 * livre da coluna "Treinamento com Armadura" da planilha. `talentosAtuais`
 * é opcional, mesmo padrão de `classeProficienteComArma`. Sem entrada
 * de classe nem talento = sem treinamento (nunca assume). */
export function classeProficienteComArmadura(
  classe: Classe,
  categoria: CategoriaArmadura,
  talentosAtuais?: string[],
): boolean {
  if (categoriasArmaduraDosTalentos(talentosAtuais).has(categoria)) return true;

  const entrada = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
  if (!entrada) return false;
  return entrada.treinamentoArmadura.includes(categoria);
}
