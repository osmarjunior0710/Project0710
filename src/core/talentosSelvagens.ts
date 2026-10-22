// Talentos Selvagens (Psiônico UA 2025, não oficial, E7 — ver
// sdd/sdd-talentos-selvagens.md). O truque+magia(s) grátis de cada um
// (seção 1.1 do SDD) já funciona de verdade, reaproveitando
// `core/magiaTalentoGeral.ts` direto (efeitoMecanico: 'magia-geral-
// concedida') — este arquivo só cobre os 10 BENEFÍCIOS ÚNICOS (seção
// 3 do SDD), cada um com função própria (CLAUDE.md §6.3.1) — grupos
// com a MESMA mecânica reaproveitam 1 função parametrizada (seção 6
// do SDD: "Grupos A/B/C agrupam o que antes seriam 7 entregas em 3"),
// nunca 1 função por talento repetida. Grupo A já é `[codeimplementation]`
// (Entrega 2); B/C/D ainda são `[PH]` (entregas futuras).

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
 * [codeimplementation] (Entrega 2) — card próprio no painel de Ação
 * (`AcaoPanelContent.tsx`), 1x/turno; efeito só narrativo (o app não
 * calcula resistência de alvo, mesmo espírito de
 * `core/ataquesElementais.ts`), então não precisa aplicar o tipo em
 * nenhum cálculo de dano de verdade — só declarar/avisar. */
export function tipoDanoTrocaTalentoSelvagem(talentosAtuais: string[] | undefined): string | null {
  if (!talentosAtuais) return null;
  for (const id of talentosAtuais) {
    const tipo = TIPO_DANO_POR_TALENTO_GRUPO_A[id];
    if (tipo) return tipo;
  }
  return null;
}

/** IDs do Grupo B (Clarividência/Empata) → a Ação que ganha Vantagem. */
const ACAO_VANTAGEM_POR_TALENTO_GRUPO_B: Record<string, string> = {
  clarividencia: 'Buscar',
  empata: 'Influenciar',
};

/** Grupo B (Clarividência/Empata) — "ao usar a Ação X, pode conceder
 * Vantagem a si mesmo num teste feito como parte dela" (usos = Bônus
 * de Proficiência/Descanso Longo) — devolve a Ação do talento ATIVO
 * deste grupo, ou `null`. [PH] [placeholder-codeimplementation] —
 * ainda não concede a Vantagem de verdade. */
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
