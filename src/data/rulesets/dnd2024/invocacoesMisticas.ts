// Invocações Místicas do Bruxo — Livro do Jogador (D&D 5e 2024), Cap.
// 3, "Opções de Invocações Místicas" (pág. 71-73). Transcrito à mão
// (a planilha mestra não tem essa seção — é conteúdo de classe, não
// de talento nem de antecedente) e conferido contra o PDF do livro
// enviado pelo Osmar.
//
// Fase 1 (ver EmDev.md/PENDENCIAS.md "Bruxo — Invocações Místicas Fase
// 2"): só o catálogo + escolha no wizard/Level Up. `efeitoMecanico`
// real (Fase 2) entra depois, em lotes pequenos — mesmo padrão já
// usado em Talentos Fase 4 (`talentos.ts`).
//
// `tipo` classifica a frequência real de uso, achado importante (ver
// SDD do Osmar): NÃO é um pool de usos genérico — cada invocação tem
// sua própria regra.
// - 'passiva': sempre ativa, nunca custa ação nem recurso.
// - 'avontade': ativável quantas vezes por dia, sem gastar espaço de
//   magia (mas ainda usa o tempo de conjuração normal da magia).
// - 'limitada': tem teto real (usos por descanso, custa recurso
//   específico) — ver `custoOuLimite`.

import type { SentidoConcedido } from './sentidos';

export interface PrerequisitosInvocacao {
  nivelMinimo: number | null;
  /** `id` de outra invocação que precisa já estar conhecida. */
  invocacaoRequeridaId: string | null;
}

export type TipoFrequenciaInvocacao = 'passiva' | 'avontade' | 'limitada';

export interface InvocacaoMistica {
  id: string;
  nome: string;
  tipo: TipoFrequenciaInvocacao;
  /** Só preenchido quando `tipo === 'limitada'` — texto livre do
   * teto/custo/recarga (ex.: "1 uso, recarrega Descanso Longo"). */
  custoOuLimite: string | null;
  prerequisitos: PrerequisitosInvocacao;
  /** `true` = pode ser escolhida mais de uma vez, cada escolha
   * vinculada a um truque/talento diferente (ex.: Explosão
   * Agonizante) — a vinculação em si ainda não é modelada (Fase 2). */
  repetivel: boolean;
  beneficios: string;
  /** Nomes exatos de magia mencionados em `beneficios` (ex: "Conjura
   * Armadura Arcana...") — usados pra virar pill+ícone clicável na
   * tela (ver `TextoComMagias`), em vez de texto solto. Vazio quando o
   * benefício não referencia nenhuma magia específica. */
  magiasMencionadas: string[];
  /** Fase 2 — só preenchido nas invocações "conjura X sem gastar um
   * espaço de magia" (nome exato de `magias.ts`). `recarga: 'ilimitado'`
   * = pode usar quantas vezes quiser (avontade); `'descansoLongo'` = só
   * 1x, recarrega no próximo Descanso Longo (`tipo === 'limitada'`).
   * `null` nas invocações que não seguem esse padrão. */
  magiaGratisConcedida: { nome: string; recarga: 'ilimitado' | 'descansoLongo' } | null;
  /** Fase 2 — só Vigor Ínfero: PV Temporário concedido a cada uso (2d4+4
   * de Vitalidade Vazia, valor MÁXIMO do dado, sem rolar — regra da
   * própria invocação). `null` nas outras 27 — nenhuma outra concede PV
   * Temporário. Diferente das outras "conjura de graça" (que não têm
   * efeito repetível pra rastrear), essa sempre mantém botão "Usar" de
   * verdade mesmo sendo `avontade`/ilimitada, porque cada uso pode
   * atualizar o PV Temporário atual (`ganharPvTemporario`, pega o
   * maior valor, não soma). */
  pvTemporarioConcedido: number | null;
  /** Sentido passivo permanente concedido (ver `sentidos.ts`) — só
   * Visão da Bruxa e Visão Diabólica hoje. `null` nas outras 26. */
  sentidoConcedido: SentidoConcedido | null;
  /** Formas especiais de Familiar concedidas por essa invocação (nomes
   * exatos de `criaturas.ts`) — só Pacto da Corrente hoje (8 formas,
   * ver `beneficios` acima). `null` nas outras 27 — nenhuma outra
   * concede Familiar. Ver `core/invocacoesFamiliar.ts`. */
  formasFamiliarConcedidas: string[] | null;
  pagina: number;
  fonte: string;
}

const FONTE = 'Livro do Jogador (D&D 5e 2024)';
const semPrereq = (nivelMinimo: number | null = null): PrerequisitosInvocacao => ({
  nivelMinimo,
  invocacaoRequeridaId: null,
});

export const invocacoesMisticas: InvocacaoMistica[] = [
  {
    id: 'armadura-de-sombras',
    nome: 'Armadura de Sombras',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(),
    repetivel: false,
    beneficios: 'Conjura Armadura Arcana em si sem gastar um espaço de magia.',
    magiasMencionadas: ['Armadura Arcana'],
    magiaGratisConcedida: { nome: 'Armadura Arcana', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'explosao-agonizante',
    nome: 'Explosão Agonizante',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: true,
    beneficios:
      'Escolha um truque de Bruxo conhecido que cause dano — soma o modificador de Carisma às jogadas de dano dessa magia.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'explosao-repulsiva',
    nome: 'Explosão Repulsiva',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: true,
    beneficios:
      'Escolha um truque de Bruxo que exija jogada de ataque. Ao acertar criatura Grande ou menor com esse truque, pode empurrá-la 3 metros.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'investimento-do-mestre-da-corrente',
    nome: 'Investimento do Mestre da Corrente',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: { nivelMinimo: 5, invocacaoRequeridaId: 'pacto-da-corrente' },
    repetivel: false,
    beneficios:
      'Seu familiar de Pacto da Corrente ganha voo ou natação 12m, Ataque Rápido (Ação Bônus), usa sua CD pra magias/efeitos, causa dano Necrótico ou Radiante em vez do normal, e concede Resistência a ele via Reação sua.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'lamento-das-sepulturas',
    nome: 'Lamento das Sepulturas',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(7),
    repetivel: false,
    beneficios: 'Conjura Falar com Mortos sem gastar um espaço de magia.',
    magiasMencionadas: ['Falar com Mortos'],
    magiaGratisConcedida: { nome: 'Falar com Mortos', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'lamina-devoradora',
    nome: 'Lâmina Devoradora',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: { nivelMinimo: 12, invocacaoRequeridaId: 'lamina-sedenta' },
    repetivel: false,
    beneficios: 'O Ataque Extra de Lâmina Sedenta concede 2 ataques extras em vez de 1.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'lamina-sedenta',
    nome: 'Lâmina Sedenta',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: { nivelMinimo: 5, invocacaoRequeridaId: 'pacto-da-lamina' },
    repetivel: false,
    beneficios: 'Ganha Ataque Extra, restrito à sua arma de pacto.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 71,
    fonte: FONTE,
  },
  {
    id: 'lanca-mistica',
    nome: 'Lança Mística',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: true,
    beneficios:
      'Escolha um truque de Bruxo que cause dano e tenha alcance de 3m ou mais — o alcance aumenta em 9 metros por nível de Bruxo.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'licoes-dos-grandes-antigos',
    nome: 'Lições dos Grandes Antigos',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: true,
    beneficios: 'Concede permanentemente 1 talento de Origem à sua escolha (não é magia nem habilidade ativa).',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'mascara-das-muitas-faces',
    nome: 'Máscara das Muitas Faces',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: false,
    beneficios: 'Conjura Disfarçar-se sem gastar um espaço de magia.',
    magiasMencionadas: ['Disfarçar-se'],
    magiaGratisConcedida: { nome: 'Disfarçar-se', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'mente-mistica',
    nome: 'Mente Mística',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(),
    repetivel: false,
    beneficios: 'Vantagem em salvaguardas de Constituição pra manter Concentração.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'mestre-das-infindaveis-formas',
    nome: 'Mestre das Infindáveis Formas',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(5),
    repetivel: false,
    beneficios: 'Conjura Alterar-se sem gastar um espaço de magia.',
    magiasMencionadas: ['Alterar-se'],
    magiaGratisConcedida: { nome: 'Alterar-se', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'olhar-de-duas-mentes',
    nome: 'Olhar de Duas Mentes',
    tipo: 'limitada',
    custoOuLimite: 'Ação Bônus pra ativar/manter, sem teto diário — só custa a Ação Bônus a cada turno',
    prerequisitos: semPrereq(5),
    repetivel: false,
    beneficios:
      'Toca criatura voluntária e percebe pelos sentidos dela até o fim do próximo turno; pode conjurar como se estivesse no espaço dela, até 18m de distância entre vocês.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'pacto-da-corrente',
    nome: 'Pacto da Corrente',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(),
    repetivel: false,
    beneficios:
      'Aprende Convocar Familiar permanentemente e conjura como ação Usar Magia sem gastar espaço de magia — formas especiais: Cobra Peçonhenta, Diabrete, Esfinge Maravilhosa, Esqueleto, Pseudodragão, Quasit, Slaad Girino, Sprite.',
    magiasMencionadas: ['Convocar Familiar'],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: [
      'Cobra Peçonhenta',
      'Diabrete',
      'Esfinge Maravilhosa',
      'Esqueleto',
      'Pseudodragão',
      'Quasit',
      'Slaad Girino',
      'Sprite',
    ],
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'pacto-da-lamina',
    nome: 'Pacto da Lâmina',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(),
    repetivel: false,
    beneficios:
      'Como Ação Bônus, cria/vincula uma arma de pacto (Simples ou Marcial) ou vincula uma arma mágica tocada — usa Carisma pra ataque/dano com ela, pode ser Foco de Conjuração.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'pacto-do-tomo',
    nome: 'Pacto do Tomo',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(),
    repetivel: false,
    beneficios:
      'Conjura um Livro das Sombras ao final de um Descanso Curto ou Longo — escolha 3 truques e 2 magias de 1º círculo com a marca Ritual (de qualquer classe) pra ficarem sempre preparadas enquanto o livro existir; re-escolhidas toda vez que o livro surge, não fixas.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'passo-ascendente',
    nome: 'Passo Ascendente',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(5),
    repetivel: false,
    beneficios: 'Conjura Levitação em si sem gastar um espaço de magia.',
    magiasMencionadas: ['Levitação'],
    magiaGratisConcedida: { nome: 'Levitação', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'presente-das-profundezas',
    nome: 'Presente das Profundezas',
    tipo: 'limitada',
    custoOuLimite: '1 uso (a parte de conjurar Respirar na Água sem gastar espaço), recarrega Descanso Longo',
    prerequisitos: semPrereq(5),
    repetivel: false,
    beneficios:
      'Respira debaixo d’água e nada no seu Deslocamento normal sempre (passivo); além disso, 1x entre Descansos Longos, conjura Respirar na Água sem gastar espaço de magia.',
    magiasMencionadas: ['Respirar na Água'],
    magiaGratisConcedida: { nome: 'Respirar na Água', recarga: 'descansoLongo' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 72,
    fonte: FONTE,
  },
  {
    id: 'presente-dos-protetores',
    nome: 'Presente dos Protetores',
    tipo: 'limitada',
    custoOuLimite: '1 gatilho compartilhado entre todos os nomes na página, recarrega Descanso Longo',
    prerequisitos: { nivelMinimo: 9, invocacaoRequeridaId: 'pacto-do-tomo' },
    repetivel: false,
    beneficios:
      'Nova página no Livro das Sombras — até (mod. Carisma, mín. 1) criaturas nomeadas ficam com 1 PV em vez de cair a 0, uma única vez até você completar um Descanso Longo.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'punicao-mistica',
    nome: 'Punição Mística',
    tipo: 'limitada',
    custoOuLimite: '1 espaço de Magia de Pacto, no máximo 1x por turno',
    prerequisitos: { nivelMinimo: 5, invocacaoRequeridaId: 'pacto-da-lamina' },
    repetivel: false,
    beneficios:
      'Ao acertar com a arma de pacto, gasta 1 espaço de Pacto: +1d8 dano Energético + 1d8 por círculo do espaço gasto; pode impor Caído se o alvo for Enorme ou menor.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'salto-sobrenatural',
    nome: 'Salto Sobrenatural',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: false,
    beneficios: 'Conjura Salto em si sem gastar um espaço de magia.',
    magiasMencionadas: ['Salto'],
    magiaGratisConcedida: { nome: 'Salto', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'sorvedouro-de-vida',
    nome: 'Sorvedouro de Vida',
    tipo: 'limitada',
    custoOuLimite: '1 Dado de Vida (só a parte de cura), no máximo 1x por turno',
    prerequisitos: { nivelMinimo: 9, invocacaoRequeridaId: 'pacto-da-lamina' },
    repetivel: false,
    beneficios:
      'Ao acertar com a arma de pacto: +1d6 dano Necrótico/Psíquico/Radiante (grátis, à escolha) e pode gastar 1 Dado de Vida pra curar = resultado + mod. Constituição (mín. 1).',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'uno-com-as-sombras',
    nome: 'Uno com as Sombras',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(5),
    repetivel: false,
    beneficios: 'Em área de Meia-luz ou Escuridão, conjura Invisibilidade em si sem gastar um espaço de magia.',
    magiasMencionadas: ['Invisibilidade'],
    magiaGratisConcedida: { nome: 'Invisibilidade', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'vigor-infero',
    nome: 'Vigor Ínfero',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: false,
    beneficios:
      'Conjura Vitalidade Vazia em si sem gastar um espaço de magia; PV temporários = valor máximo do dado (sem rolar).',
    magiasMencionadas: ['Vitalidade Vazia'],
    magiaGratisConcedida: { nome: 'Vitalidade Vazia', recarga: 'ilimitado' },
    // Vitalidade Vazia (magias.ts): "2d4 + 4 PV Temporários" — valor
    // MÁXIMO do dado (regra da própria invocação, sem rolar) = 2×4 + 4.
    pvTemporarioConcedido: 12,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'visao-da-bruxa',
    nome: 'Visão da Bruxa',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(15),
    repetivel: false,
    beneficios: 'Visão Verdadeira, alcance de 9 metros.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: { tipo: 'visaoVerdadeira', alcanceMetros: 9 },
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'visao-diabolica',
    nome: 'Visão Diabólica',
    tipo: 'passiva',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: false,
    beneficios: 'Vê normalmente em Meia-luz e Escuridão (mágica ou não) até 36 metros.',
    magiasMencionadas: [],
    magiaGratisConcedida: null,
    pvTemporarioConcedido: null,
    sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 36 },
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'visoes-de-reinos-distantes',
    nome: 'Visões de Reinos Distantes',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(9),
    repetivel: false,
    beneficios: 'Conjura Olho Arcano sem gastar um espaço de magia.',
    magiasMencionadas: ['Olho Arcano'],
    magiaGratisConcedida: { nome: 'Olho Arcano', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
  {
    id: 'visoes-nebulosas',
    nome: 'Visões Nebulosas',
    tipo: 'avontade',
    custoOuLimite: null,
    prerequisitos: semPrereq(2),
    repetivel: false,
    beneficios: 'Conjura Imagem Silenciosa sem gastar um espaço de magia.',
    magiasMencionadas: ['Imagem Silenciosa'],
    magiaGratisConcedida: { nome: 'Imagem Silenciosa', recarga: 'ilimitado' },
    pvTemporarioConcedido: null,
    sentidoConcedido: null,
    formasFamiliarConcedidas: null,
    pagina: 73,
    fonte: FONTE,
  },
];
