// Talentos Selvagens (Psiônico UA 2025, não oficial, E7 — ver
// sdd/sdd-talentos-selvagens.md). O truque+magia(s) grátis de cada um
// (seção 1.1 do SDD) já funciona de verdade, reaproveitando
// `core/magiaTalentoGeral.ts` direto (efeitoMecanico: 'magia-geral-
// concedida') — este arquivo só cobre os 10 BENEFÍCIOS ÚNICOS (seção
// 3 do SDD), cada um com função própria (CLAUDE.md §6.3.1) — grupos
// com a MESMA mecânica reaproveitam 1 função parametrizada (seção 6
// do SDD: "Grupos A/B/C agrupam o que antes seriam 7 entregas em 3"),
// nunca 1 função por talento repetida. Grupo A (Entrega 2) e Grupo B
// (Entrega 3) já são `[codeimplementation]`; C/D ainda são `[PH]`
// (entregas futuras).

/** IDs do Grupo A (Atmocinese/Criocinese/Pirocinese) — mesma mecânica,
 * só o tipo de dano muda; mapeado pra quando a mecânica real existir. */
const TIPO_DANO_POR_TALENTO_GRUPO_A: Record<string, string> = {
  atmocinese: 'Elétrico',
  criocinese: 'Gélido',
  pirocinese: 'Ígneo',
};

/** Grupo A (Atmocinese/Criocinese/Pirocinese) — "1x/turno, ao
 * conjurar magia ou acertar ataque com dano Contundente/Cortante/
 * Perfurante/Psíquico, pode mudar o tipo pra X" — devolve o tipo de
 * dano do talento ATIVO deste grupo, ou `null` se não tiver nenhum.
 * [codeimplementation] (Entrega 2, completo) — lado de ATAQUE plugado
 * no sistema "Efeitos ao Acertar" (`CombatTab.efeitosAoAcertar`/
 * `executarEfeitoAoAcertar`), mesma opção genérica "🎯 Tipo de dano
 * diferente do normal" já usada por Golpes Potencializados (Monge) e
 * Arma Sagrada (Paladino); lado de MAGIA plugado nos 3 lugares que
 * conjuram magia (`useUsarMagiaPainel.tsx` — Ação/Ação Bônus;
 * `ReacaoPanelContent.tsx` — Reação, com conceito de turno igual ao
 * ataque; `MagiasTab.tsx` — sem conceito de turno, mesmo tratamento
 * já dado a Mente Aguçada ali) via `elegivelTrocaTipoDeDanoTalentoSelvagem`
 * abaixo, lendo `Magia.danoBaseTipo` direto do catálogo. Em todos os
 * casos a escolha acontece DEPOIS do acerto/ao conjurar, nunca antes
 * de atacar/conjurar (mesmo padrão de Ataques Elementais,
 * `core/ataquesElementais.ts`), e é só narrativa (o app não calcula
 * resistência de alvo). */
export function tipoDanoTrocaTalentoSelvagem(talentosAtuais: string[] | undefined): string | null {
  if (!talentosAtuais) return null;
  for (const id of talentosAtuais) {
    const tipo = TIPO_DANO_POR_TALENTO_GRUPO_A[id];
    if (tipo) return tipo;
  }
  return null;
}

/** Os 4 tipos que o Grupo A pode trocar (regra do livro). */
export const TIPOS_DANO_TROCAVEIS_TALENTO_SELVAGEM = ['Contundente', 'Cortante', 'Perfurante', 'Psíquico'];

/** `true` quando vale oferecer a troca pra uma magia específica —
 * mesma checagem usada no lado de ataque (`CombatTab.efeitosAoAcertar`),
 * só que a partir de `Magia.danoBaseTipo` em vez de `AtaqueInfo.danoTipo`
 * (lado de magia, ver `useUsarMagiaPainel.tsx`/`MagiasTab.tsx`/
 * `ReacaoPanelContent.tsx`). */
export function elegivelTrocaTipoDeDanoTalentoSelvagem(
  danoBaseTipo: string | null | undefined,
  tipoNovo: string | null,
  usadoNoTurno: boolean,
): boolean {
  return !!tipoNovo && !usadoNoTurno && !!danoBaseTipo && TIPOS_DANO_TROCAVEIS_TALENTO_SELVAGEM.includes(danoBaseTipo);
}

/** IDs do Grupo B (Clarividência/Empata) → a Ação que ganha Vantagem.
 * "Buscar" na planilha é a mesma ação de D&D que o app já lista como
 * "Procurar" (`data/exampleCombat.ts` `acoesBase`) — só tradução
 * diferente, por isso o valor aqui é 'Procurar', não 'Buscar'. */
const ACAO_VANTAGEM_POR_TALENTO_GRUPO_B: Record<string, string> = {
  clarividencia: 'Procurar',
  empata: 'Influenciar',
};

/** Grupo B (Clarividência/Empata) — "ao usar a Ação X, pode conceder
 * Vantagem a si mesmo num teste feito como parte dela" (usos = Bônus
 * de Proficiência/Descanso Longo) — devolve a Ação do talento ATIVO
 * deste grupo, ou `null`. [codeimplementation] (Entrega 3) — plugado
 * em `AcaoPanelContent.tsx`: tocar no card da ação certa (com usos
 * sobrando) abre a escolha "Normal" vs. "Com Vantagem" via
 * `EscolherEfeitoModal`, mesmo padrão do Grupo A. Contador de usos
 * (`usosMaximo = Bônus de Proficiência`, reseta no Descanso Longo)
 * vive em `FichaShell.tsx`, mesmo padrão de Ancestralidade Gigante. */
export function acaoVantagemTalentoSelvagem(talentosAtuais: string[] | undefined): string | null {
  if (!talentosAtuais) return null;
  for (const id of talentosAtuais) {
    const acao = ACAO_VANTAGEM_POR_TALENTO_GRUPO_B[id];
    if (acao) return acao;
  }
  return null;
}

/** IDs do Grupo C (Modelador de Carne/Trapaceiro Psiônico) → atributo +
 * perícias do teste bonificado. */
const TESTE_BONIFICADO_POR_TALENTO_GRUPO_C: Record<string, { atributo: string; pericias: string[] }> = {
  'modelador-de-carne': { atributo: 'Destreza', pericias: ['Acrobacia', 'Prestidigitação'] },
  'trapaceiro-psionico': { atributo: 'Carisma', pericias: ['Enganação', 'Persuasão'] },
};

/** Grupo C (Modelador de Carne/Trapaceiro Psiônico) — "num teste de X
 * (perícia A ou B), soma mod. Inteligência (mín. +1)" (usos = Bônus
 * de Proficiência/Descanso Longo) — devolve o atributo/perícias do
 * talento ATIVO deste grupo, ou `null`. [PH]
 * [placeholder-codeimplementation] — ainda não soma o bônus de verdade. */
export function testeBonificadoTalentoSelvagem(
  talentosAtuais: string[] | undefined,
): { atributo: string; pericias: string[] } | null {
  if (!talentosAtuais) return null;
  for (const id of talentosAtuais) {
    const teste = TESTE_BONIFICADO_POR_TALENTO_GRUPO_C[id];
    if (teste) return teste;
  }
  return null;
}

/** Biocinese — "quando magia sua cura PV, pode rolar 1d4 extra e
 * somar à cura" (usos = Bônus de Proficiência/Descanso Longo). [PH]
 * [placeholder-codeimplementation]. */
export function temBiocinese(talentosAtuais: string[] | undefined): boolean {
  return !!talentosAtuais?.includes('biocinese');
}

/** Sussurrador Mental — "Ação: conexão telepática com 1 criatura
 * vista a 36m, por 1h" (1x/Descanso Curto ou Longo). Mecânica
 * diferente de `core/conexaoTelepatica.ts` (Psiônico base) — ver SDD
 * seção 3, Grupo D. [PH] [placeholder-codeimplementation]. */
export function temSussurradorMental(talentosAtuais: string[] | undefined): boolean {
  return !!talentosAtuais?.includes('sussurrador-mental');
}

/** Psicinético (Talento) — "Ação Correr: +3m de Deslocamento até o
 * fim do turno" (usos = Bônus de Proficiência/Descanso Longo).
 * BLOQUEADO estruturalmente (PENDENCIAS.md: a ação Correr não é
 * rastreada como estado) — fica `[PH]` até essa pendência resolver.
 * [placeholder-codeimplementation]. */
export function temPsicineticoTalento(talentosAtuais: string[] | undefined): boolean {
  return !!talentosAtuais?.includes('psicinetico-talento');
}
