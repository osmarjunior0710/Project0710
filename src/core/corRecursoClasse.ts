// Cor dos pips/selos de cada classe — pedido do Osmar (2026-09): cada
// classe tem UMA cor, igual em qualquer tela onde o recurso dela
// aparece (área de recursos do Combate, painéis de Ação/Bônus/Reação,
// aba Magias, selo de Multiclasse...). Ver DECISOES-CLASSES.md.
//
// Até 2026-09 isso era um enum fechado de 5 valores atrelados a
// tokens de design COMPARTILHADOS (--accent, --danger, --pip-*) — só
// dava pra cobrir 5 classes e o hex de cada uma era o mesmo usado por
// outra parte da UI (ex: --danger também é o vermelho de erro). O
// Osmar decidiu as 12 cores finais (uma por classe, escolhidas no
// protótipo `/prototipo` → "Cor de cada classe") num hex PRÓPRIO,
// dedicado, sem relação com os tokens de design gerais — daí o valor
// virar `string` (hex) livre em vez de um enum de nomes.

export interface CorClasse {
  hex: string;
  /** `true` = texto branco por cima da cor (pill de PillClasse.tsx);
   * pips não usam texto, só a cor de fundo. */
  textoClaro: boolean;
}

const COR_POR_CLASSE: Record<string, CorClasse> = {
  Bárbaro: { hex: '#e30039', textoClaro: true },
  Bardo: { hex: '#e6bb00', textoClaro: true },
  Bruxo: { hex: '#7536eb', textoClaro: true },
  Clérigo: { hex: '#42d4f4', textoClaro: true },
  Druida: { hex: '#0d8c1e', textoClaro: true },
  Feiticeiro: { hex: '#ff3df5', textoClaro: true },
  Guardião: { hex: '#bfef45', textoClaro: false },
  Guerreiro: { hex: '#a10028', textoClaro: true },
  Ladino: { hex: '#ff8000', textoClaro: true },
  Mago: { hex: '#2b53e3', textoClaro: true },
  Monge: { hex: '#c45200', textoClaro: true },
  Paladino: { hex: '#000075', textoClaro: true },
};

/** `null` = a classe ainda não tem cor definida (usa o azul padrão do
 * app até o Osmar escolher — não deveria acontecer mais, as 12 classes
 * oficiais já têm cor). */
export function corDoRecursoDaClasse(nomeClasse: string): CorClasse | null {
  return COR_POR_CLASSE[nomeClasse] ?? null;
}
