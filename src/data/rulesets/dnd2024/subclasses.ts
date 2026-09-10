// Nomes de subclasse confirmados na planilha mestra / Livro do Jogador
// (D&D 5e 2024) — só o nome, sem as características mecânicas ainda
// (essas ficam pra quando a subclasse for implementada de verdade, ver
// PENDENCIAS.md "Escolha de subclasse — versão placeholder"). Cada
// `id` bate com o arquivo `{id}-banner.webp` em `assets/icones-classes/`.

export interface Subclasse {
  id: string;
  classeId: string;
  nome: string;
  /** `true` = ainda não é regra oficial (ex: Necromante do Mago, PDF
   * homebrew do Osmar) — todo lugar que mostrar nome/característica
   * dessa subclasse precisa exibir o selo de homebrew (ver
   * `BadgeHomebrew.tsx`), nunca checar por nome. `false` = regra do
   * Livro do Jogador, sem selo. Ver DECISOES-CLASSES.md "B0". */
  homebrew: boolean;
}

export const subclasses: Subclasse[] = [
  { id: 'bardo-colegio-da-bravura', classeId: 'bardo', nome: 'Colégio da Bravura', homebrew: false },
  { id: 'bardo-colegio-da-danca', classeId: 'bardo', nome: 'Colégio da Dança', homebrew: false },
  { id: 'bardo-colegio-do-conhecimento', classeId: 'bardo', nome: 'Colégio do Conhecimento', homebrew: false },
  { id: 'bardo-colegio-do-glamour', classeId: 'bardo', nome: 'Colégio do Glamour', homebrew: false },
  { id: 'bruxo-patrono-arquifada', classeId: 'bruxo', nome: 'Patrono Arquifada', homebrew: false },
  { id: 'bruxo-patrono-celestial', classeId: 'bruxo', nome: 'Patrono Celestial', homebrew: false },
  { id: 'bruxo-patrono-grande-antigo', classeId: 'bruxo', nome: 'Patrono O Grande Antigo', homebrew: false },
  { id: 'bruxo-patrono-infero', classeId: 'bruxo', nome: 'Patrono Ínfero', homebrew: false },
  { id: 'mago-abjurador', classeId: 'mago', nome: 'Abjurador', homebrew: false },
  { id: 'mago-adivinhador', classeId: 'mago', nome: 'Adivinhador', homebrew: false },
  { id: 'mago-evocador', classeId: 'mago', nome: 'Evocador', homebrew: false },
  { id: 'mago-ilusionista', classeId: 'mago', nome: 'Ilusionista', homebrew: false },
  { id: 'mago-necromante', classeId: 'mago', nome: 'Necromante', homebrew: true },
];
