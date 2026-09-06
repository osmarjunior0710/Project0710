// Gerado a partir de dnd-master-referencia.xlsx, aba "Talentos". Não
// editar valores à mão — regenerar a partir da planilha se algo mudar.
//
// Cobre as 4 categorias oficiais (Geral, Dádiva Épica, Origem, Estilo
// de Luta = 75 talentos) — os 10 "Talento Selvagem" são conteúdo não
// oficial (UA Psiônico 2025) e ficam isolados em `talentosSelvagens`,
// fora do catálogo principal (mesmo tratamento das magias UA Psion).
//
// Pré-requisito de atributo mínimo: as colunas "Força Mín."..."Carisma
// Mín." da planilha tinham um bug (valor da coluna de ASI vazado pra
// cá) — o Osmar corrigiu talento por talento, conferindo página a
// página do livro. Confirmado: quando existe pré-requisito de
// atributo de verdade, o valor é sempre 13 (nunca outro número) — por
// isso `atributosMinimos` guarda só a lista de atributos exigidos, sem
// precisar de um valor por atributo.
//
// Fase 1 do plano de Talentos (ver DECISOES-DESIGN.md) — só dado e
// schema. Classificação de texto em Ação/Ação Bônus/Reação/Passiva
// (Fase 2) e seleção na Ficha (Fase 3) — feitas. Fase 4 (efeito
// mecânico de verdade) está começando, em lotes pequenos — ver
// PENDENCIAS.md "Talentos — Fase 4".
//
// IMPORTANTE sobre `efeitoMecanico`: esse campo NÃO vem da planilha —
// é anotado à mão, talento por talento, só quando a Fase 4 chega nele
// (ver DECISOES-CLASSES.md "Talentos — arquitetura final"). Se este arquivo for
// regenerado a partir da planilha no futuro, os `efeitoMecanico` já
// implementados precisam ser reaplicados manualmente — não são
// perdidos por acidente só se alguém lembrar de conferir antes de
// sobrescrever.

import type { Atributo } from '../../wizardFixtures';

export type CategoriaTalento = 'Geral' | 'Dádiva Épica' | 'Origem' | 'Estilo de Luta' | 'Talento Selvagem';

export interface PrerequisitosTalento {
  nivelMinimo: number | null;
  /** Atributos que precisam estar em 13+ (valor único confirmado em
   * toda a planilha — nunca outro número). Lista vazia = sem
   * pré-requisito de atributo. */
  atributosMinimos: Atributo[];
  /** Pré-requisito em texto livre não validável automaticamente (ex:
   * "Característica Conjuração ou Magia de Pacto") — mostrar como
   * aviso não-bloqueante, nunca travar a escolha por causa dele. */
  outro: string | null;
}

/** Schema de ASI por talento — 2 formatos reais encontrados na
 * planilha (ver seção 2 do plano em PENDENCIAS.md):
 * - `escolha-unica`: +1 num único atributo à escolha, dentre os
 *   listados (1 atributo = fixo, sem escolha real; 2-3 = escolha
 *   pequena; 6 = "qualquer atributo").
 * - `distribuir-dois`: +2 num só ou +1 em dois, dentre os listados —
 *   hoje só "Aumento no Valor de Atributo", que reaproveita o mesmo
 *   seletor de ASI genérico já usado no Level Up.
 * `maximo` é 20 normalmente, 30 pros talentos de Dádiva Épica. */
export type ConcedeAsiTalento =
  | { tipo: 'nenhum' }
  | { tipo: 'escolha-unica'; atributos: Atributo[]; maximo: number }
  | { tipo: 'distribuir-dois'; atributos: Atributo[]; maximo: number };

/** Efeito mecânico de verdade — Fase 4, um talento por vez. Só os
 * talentos já implementados têm esse campo; o resto continua `[PH]`
 * (salvo/mostrado, sem efeito na ficha) até chegar a vez deles. */
export type EfeitoMecanicoTalento =
  /** Soma o Bônus de Proficiência atual na Iniciativa (Alerta). */
  | { tipo: 'bonus-iniciativa-bonus-proficiencia' }
  /** +`bonus` na CA enquanto uma Armadura (Leve/Média/Pesada) estiver
   * equipada (Defensivo, do Estilo de Luta). */
  | { tipo: 'bonus-ca-com-armadura'; bonus: number }
  /** Com Armadura Média equipada e Destreza final >= `desMinima`,
   * eleva o teto do mod. de Destreza somado na CA pra `tetoDes` em vez
   * do padrão da armadura (Mestre em Armaduras Médias). */
  | { tipo: 'teto-des-armadura-media'; desMinima: number; tetoDes: number }
  /** +`bonus` na jogada de ataque com armas à Distância (Arquearia,
   * do Estilo de Luta). */
  | { tipo: 'bonus-ataque-distancia'; bonus: number }
  /** +`bonus` no dano ao empunhar 1 arma corpo a corpo numa mão e
   * nenhuma outra arma (Duelismo, do Estilo de Luta). */
  | { tipo: 'bonus-dano-uma-mao-sem-outra-arma'; bonus: number }
  /** +`porNivel` de PV máximo a cada nível de personagem (Vigoroso).
   * O livro descreve como "+2x nível ao pegar o talento, +2 a cada
   * nível seguinte" — só colapsa nesse valor fixo por nível porque,
   * hoje, esse talento só é alcançável via Talento de Origem (sempre
   * ganho no nível 1 da criação, nunca escolhido depois via ASI). Ver
   * `core/calculoPersonagem.ts` (`bonusPvPorNivelDoTalento`). */
  | { tipo: 'bonus-pv-por-nivel'; porNivel: number }
  /** Troca o dado de dano do Ataque Desarmado, de "1 fixo" pra
   * `quantidade`d`lados` (Valentão de Taverna: 1d4). Mesmo campo serve
   * pro Estilo de Luta Combate Desarmado (1d6, ou 1d8 desarmado de
   * verdade) quando ele ganhar `efeitoMecanico` — ver
   * `core/ataque.ts` (`ataqueDesarmado`). */
  | { tipo: 'dado-ataque-desarmado'; quantidade: number; lados: number }
  /** Concede a pool "Pontos de Sorte" (Sortudo) — máximo = Bônus de
   * Proficiência atual, recarrega em Descanso Longo. Cada ponto gasto
   * dá Vantagem numa rolagem sua ou Desvantagem num ataque contra
   * você (ou, nível 5+, vira acerto normal um crítico contra você) —
   * como o RollOverlay já tem Vantagem/Desvantagem livres em qualquer
   * rolagem de d20, este efeito só precisa acompanhar a pool em si
   * (ver `FichaShell.tsx`/`CombatTab.tsx`, sem cálculo automático de
   * bônus como Sorte do Tenebroso). */
  | { tipo: 'pontos-de-sorte' };

/** Escolha de proficiência concedida pelo próprio talento (diferente de
 * `ConcedeAsiTalento`, que é ajuste de atributo) — hoje só Habilidoso
 * usa isso ("3 escolhas de perícia ou ferramenta, em qualquer
 * combinação"), mas o formato é genérico pra qualquer talento futuro
 * que peça a mesma coisa (ver CLAUDE.md 6.1 e PENDENCIAS.md "Origens
 * com seleção extra no Talento de Origem"). Ausente = talento não
 * concede escolha de proficiência nenhuma. */
export type ConcedeProficienciasTalento = {
  quantidade: number;
  tipos: ('pericia' | 'ferramenta')[];
};

/** Escolha de ferramenta restrita a 1 grupo específico de
 * `gruposFerramenta` (ex.: Artifista pede 3 "Ferramentas de Artesão",
 * Músico pede 3 "Instrumento Musical") — diferente de
 * `ConcedeProficienciasTalento`, que mistura perícia/ferramenta
 * livremente sem restringir a um grupo. Mesmo formato já usado pra
 * ferramenta de CLASSE (`ferramentasEscolha` em
 * `classesProficienciasIniciais.ts`), só reaproveitado aqui pro
 * Talento de Origem (CLAUDE.md 6.1). */
export type ConcedeFerramentaGrupoTalento = {
  quantidade: number;
  grupo: string;
};

export interface Talento {
  id: string;
  nome: string;
  categoria: CategoriaTalento;
  repetivel: boolean;
  prerequisitos: PrerequisitosTalento;
  concedeAsi: ConcedeAsiTalento;
  concedeProficiencias?: ConcedeProficienciasTalento;
  concedeFerramentaGrupo?: ConcedeFerramentaGrupoTalento;
  /** `true` só pro talento Iniciado em Magia — sinaliza que o wizard
   * precisa mostrar a tela de escolha de 2 truques + 1 magia de 1º
   * círculo (lista de classe fixada em `Origem.talentoOrigemVariante`)
   * + atributo de conjuração (Int/Sab/Car), em vez da tela genérica de
   * `concedeProficiencias`. Ver `TalentoOrigemEscolhasStep`. */
  concedeMagiaIniciada?: true;
  /** Texto bruto da coluna "Benefícios" — Fase 2 classifica em
   * Ação/Ação Bônus/Reação/Passiva, quebrando em frases quando o
   * talento tiver múltiplos efeitos (ex: Conjurador Bélico). */
  beneficios: string;
  /** Ver `EfeitoMecanicoTalento` — ausente = ainda `[PH]` (Fase 4 não
   * chegou nesse talento). */
  efeitoMecanico?: EfeitoMecanicoTalento;
  pagina: number;
  fonte: string;
}

export const talentos: Talento[] = [
  {
    id: "alerta",
    nome: "Alerta",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Soma Bônus de Proficiência na Iniciativa. Pode trocar sua Iniciativa com a de um aliado voluntário imediatamente após rolar (nenhum dos dois pode estar Incapacitado).",
    efeitoMecanico: { tipo: 'bonus-iniciativa-bonus-proficiencia' },
    pagina: 199,
    fonte: "PHB 2024",
  },
  {
    id: "artifista",
    nome: "Artifista",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    concedeFerramentaGrupo: { quantidade: 3, grupo: 'Ferramentas de Artesão' },
    beneficios: "Proficiência com 3 Ferramentas de Artesão à escolha. 20% de desconto em itens não-mágicos. Ao completar Descanso Longo, fabrica um item da tabela Fabricação Rápida (se tiver a ferramenta certa); some no próximo Descanso Longo.",
    pagina: 200,
    fonte: "PHB 2024",
  },
  {
    id: "atacante-selvagem",
    nome: "Atacante Selvagem",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "1x/turno, ao acertar com arma, role o dano da arma duas vezes e use qualquer um dos resultados.",
    pagina: 201,
    fonte: "PHB 2024",
  },
  {
    id: "curandeiro",
    nome: "Curandeiro",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Com Kit de Curandeiro: gasta 1 uso (Ação Usar Objeto) pra tratar alguém a 1,5m — ele gasta 1 Dado de Vida, você rola, ele cura o resultado + seu Bônus de Proficiência. Sempre que rolar dado de cura (magia ou este talento), pode rerolar se tirar 1.",
    pagina: 201,
    fonte: "PHB 2024",
  },
  {
    id: "habilidoso",
    nome: "Habilidoso",
    categoria: "Origem",
    repetivel: true,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    concedeProficiencias: { quantidade: 3, tipos: ['pericia', 'ferramenta'] },
    beneficios: "Proficiência em 3 perícias ou ferramentas à escolha, em qualquer combinação.",
    pagina: 201,
    fonte: "PHB 2024",
  },
  {
    id: "iniciado-em-magia",
    nome: "Iniciado em Magia",
    categoria: "Origem",
    repetivel: true,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    concedeMagiaIniciada: true,
    beneficios: "Escolhe lista de Clérigo, Druida ou Mago: 2 truques + 1 magia de 1º círculo sempre preparada (conjura 1x/dia grátis, senão gasta espaço). Atributo de conjuração (Int/Sab/Car) escolhido ao pegar o talento. Repetível: precisa escolher lista diferente cada vez.",
    pagina: 201,
    fonte: "PHB 2024",
  },
  {
    id: "musico",
    nome: "Músico",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    concedeFerramentaGrupo: { quantidade: 3, grupo: 'Instrumento Musical' },
    beneficios: "Proficiência com 3 Instrumentos Musicais. Ao completar Descanso Curto/Longo, toca música e dá Inspiração Heroica a um número de aliados = seu Bônus de Proficiência.",
    pagina: 202,
    fonte: "PHB 2024",
  },
  {
    id: "sortudo",
    nome: "Sortudo",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    efeitoMecanico: { tipo: 'pontos-de-sorte' },
    beneficios: "Pontos de Sorte = Bônus de Proficiência (recarrega em Descanso Longo). Gaste 1 pra: dar Vantagem numa jogada sua de d20, impor Desvantagem num ataque contra você, ou (nível 5+) transformar um acerto crítico contra você em acerto normal.",
    pagina: 201,
    fonte: "PHB 2024",
  },
  {
    id: "valentao-de-taverna",
    nome: "Valentão de Taverna",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    efeitoMecanico: { tipo: 'dado-ataque-desarmado', quantidade: 1, lados: 4 },
    beneficios: "Ataque Desarmado causa 1d4+Força Contundente (em vez do normal); pode rerolar 1 no dano. Proficiência com armas improvisadas. 1x/turno, ao acertar Desarmado na ação Atacar, pode empurrar o alvo 1,5m.",
    pagina: 202,
    fonte: "PHB 2024",
  },
  {
    id: "vigoroso",
    nome: "Vigoroso",
    categoria: "Origem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'nenhum' },
    efeitoMecanico: { tipo: 'bonus-pv-por-nivel', porNivel: 2 },
    beneficios: "PV máximo +2x seu nível de personagem ao pegar o talento; +2 PV extra a cada nível seguinte.",
    pagina: 202,
    fonte: "PHB 2024",
  },
  {
    id: "adepto-elemental",
    nome: "Adepto Elemental",
    categoria: "Geral",
    repetivel: true,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Característica Conjuração ou Magia de Pacto" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Escolha 1 tipo de dano (Ácido/Elétrico/Gélido/Ígneo/Trovejante): suas magias ignoram Resistência a esse dano, e você trata qualquer 1 em dado de dano desse tipo como 2. Repetível, escolhendo outro tipo cada vez.",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "agressor",
    nome: "Agressor",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Ação Correr: +3m de Deslocamento nessa ação. Movendo 3m+ em linha reta antes de acertar corpo a corpo: +1d8 dano OU empurra alvo 3m (1x/turno).",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "analitico",
    nome: "Analítico",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['INT', 'SAB'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['SAB', 'CAR'], maximo: 20 },
    beneficios: "Escolhe Intuição/Investigação/Percepção: ganha proficiência ou Especialização. Ação Procurar vira Ação Bônus.",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "atirador-arcano",
    nome: "Atirador Arcano",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Característica Conjuração ou Magia de Pacto" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Ataques de magia ignoram Cobertura Parcial/¾. Conjurar a 1,5m de inimigo não dá Desvantagem. Magias de ataque com alcance 3m+: +18m de alcance.",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "atleta",
    nome: "Atleta",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Deslocamento de Escalada = normal. Levanta-se de Caído gastando só 1,5m. Salta em Distância/Altura correndo após só 1,5m de movimento.",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "ator",
    nome: "Ator",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['CAR'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['CAR'], maximo: 20 },
    beneficios: "Disfarçado de pessoa real/fictícia: Vantagem em Atuação/Enganação pra convencer. Pode imitar sons/fala; quem ouve precisa de teste de Intuição (CD 8+seu mod. Carisma+Bônus Proficiência) pra perceber que é falso.",
    pagina: 203,
    fonte: "PHB 2024",
  },
  {
    id: "aumento-no-valor-de-atributo",
    nome: "Aumento no Valor de Atributo",
    categoria: "Geral",
    repetivel: true,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'distribuir-dois', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Aumenta 1 atributo em +2, OU dois atributos em +1 cada, à escolha (máx. 20).",
    pagina: 204,
    fonte: "PHB 2024",
  },
  {
    id: "chef",
    nome: "Chef",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['CON', 'SAB'], maximo: 20 },
    beneficios: "Proficiência com Utensílios de Cozinheiro. Descanso Curto: prepara comida especial (4+Bônus Prof. porções) — quem come e gasta Dado de Vida cura +1d8 extra. 1h de trabalho ou Descanso Longo: guloseimas (Bônus Prof. unidades, duram 8h) — Ação Bônus pra comer, ganha PV temp = Bônus Prof.",
    pagina: 204,
    fonte: "PHB 2024",
  },
  {
    id: "combatente-montado",
    nome: "Combatente Montado",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'SAB'], maximo: 20 },
    beneficios: "Montado: Vantagem contra inimigos desmontados menores que a montaria a 1,5m dela. Sua montaria não sofre dano em salvaguarda bem-sucedida (metade se falhar) enquanto você a monta. Pode redirecionar ataques contra a montaria pra você.",
    pagina: 204,
    fonte: "PHB 2024",
  },
  {
    id: "conjurador-belico",
    nome: "Conjurador Bélico",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Característica Conjuração ou Magia de Pacto" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Vantagem em salvaguardas de Concentração. Reação: conjura magia (tempo=ação, alvo único) em vez de sofrer Ataque de Oportunidade ao ser provocado. Conjura componentes somáticos mesmo empunhando arma/escudo.",
    pagina: 204,
    fonte: "PHB 2024",
  },
  {
    id: "conjurador-ritualista",
    nome: "Conjurador Ritualista",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['INT', 'SAB', 'CAR'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Escolhe magias de 1º círculo com tag Ritual = seu Bônus de Proficiência: sempre preparadas, conjuráveis com qualquer espaço. Ritual Rápido: conjura 1 delas no tempo normal (não o de ritual), sem espaço, 1x/Descanso Longo.",
    pagina: 204,
    fonte: "PHB 2024",
  },
  {
    id: "duelista-defensivo",
    nome: "Duelista Defensivo",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES'], maximo: 20 },
    beneficios: "Empunhando arma de Acuidade: Reação ao ser acertado corpo a corpo, soma Bônus de Proficiência na CA (pode fazer errar), válido até seu próximo turno.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "envenenador",
    nome: "Envenenador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES', 'INT'], maximo: 20 },
    beneficios: "Ignora Resistência a dano Venenoso. Proficiência com Kit de Veneno; 1h+50PO fabrica doses = Bônus Prof.; Ação Bônus aplica em arma/munição (dura 1min ou até causar dano). Quem sofre: Salv. Constituição ou 2d8 Venenoso + Envenenado.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "esmagador",
    nome: "Esmagador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'CON'], maximo: 20 },
    beneficios: "1x/turno, ao causar dano Contundente, empurra alvo 1,5m pra espaço livre (se não maior que você). Crítico com dano Contundente: ataques contra esse alvo têm Vantagem até seu próximo turno.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-ambidestro",
    nome: "Especialista Ambidestro",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Ação Atacar com arma Leve: ataque adicional como Ação Bônus com outra arma corpo a corpo sem Duas Mãos (sem somar mod. de atributo no dano extra, a menos que negativo). Desembainha/embainha 2 armas sem Duas Mãos de uma vez.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-em-armaduras-leves",
    nome: "Especialista em Armaduras Leves",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Treinamento com Armadura Leve e Escudos.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-em-armaduras-medias",
    nome: "Especialista em Armaduras Médias",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Treinamento com Armadura Leve" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Treinamento com Armadura Média.",
    pagina: 205,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-em-armaduras-pesadas",
    nome: "Especialista em Armaduras Pesadas",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Treinamento com Armadura Média" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'CON'], maximo: 20 },
    beneficios: "Treinamento com Armadura Pesada.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-em-besta",
    nome: "Especialista em Besta",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES'], maximo: 20 },
    beneficios: "Ignora propriedade Recarga de bestas; carrega munição sem mão livre. Atirar a 1,5m de inimigo não dá Desvantagem. Ataque adicional (propriedade Leve) com besta Leve: soma mod. de atributo no dano se ainda não somava.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "especialista-em-pericia",
    nome: "Especialista em Perícia",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "+1 em qualquer atributo. Proficiência em 1 perícia à escolha. Especialização numa perícia que já tenha proficiência.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "exterminador-de-conjuradores",
    nome: "Exterminador de Conjuradores",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Causar dano em alvo concentrando: ele tem Desvantagem na salvaguarda de Concentração. Ao falhar salvaguarda de Int/Sab/Car, pode escolher ser bem-sucedido em vez disso (1x, recarrega em Descanso Curto/Longo).",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "imobilizador",
    nome: "Imobilizador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Ataque Desarmado na ação Atacar: pode usar Dano E Imobilizar juntos (1x/turno). Vantagem em ataques contra alvo Imobilizado por você. Não gasta movimento extra pra mover uma criatura Imobilizada do seu tamanho ou menor.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "lider-inspirador",
    nome: "Líder Inspirador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['SAB', 'CAR'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['SAB', 'CAR'], maximo: 20 },
    beneficios: "Descanso Curto/Longo: discurso/música/dança pra até 6 aliados a 9m que presenciaram — ganham PV temp = seu nível + mod. do atributo aumentado.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "mente-agucada",
    nome: "Mente Aguçada",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['INT'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT'], maximo: 20 },
    beneficios: "Escolhe Arcanismo/História/Investigação/Natureza/Religião: proficiência ou Especialização. Ação Analisar vira Ação Bônus.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-das-armas",
    nome: "Mestre das Armas",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Usa propriedade de Maestria de 1 tipo de arma Simples/Marcial à escolha (mesmo sem ser nativo dela); troca em Descanso Longo.",
    pagina: 206,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-em-armaduras-medias",
    nome: "Mestre em Armaduras Médias",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Treinamento com Armadura Média" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Com Armadura Média e Destreza 16+: soma +3 (em vez de +2) na CA.",
    efeitoMecanico: { tipo: 'teto-des-armadura-media', desMinima: 16, tetoDes: 3 },
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-em-armaduras-pesadas",
    nome: "Mestre em Armaduras Pesadas",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Treinamento com Armadura Pesada" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'CON'], maximo: 20 },
    beneficios: "Com Armadura Pesada, reduz dano Contundente/Cortante/Perfurante sofrido em valor = seu Bônus de Proficiência.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-em-armas-de-haste",
    nome: "Mestre em Armas de Haste",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Com Cajado/Lança/arma Extensão+Pesada: após atacar, Ação Bônus pra atacar com a outra ponta (1d4 Contundente). Reação: ataca quem entra no seu alcance com essas armas.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-em-armas-grandes",
    nome: "Mestre em Armas Grandes",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR'], maximo: 20 },
    beneficios: "Com arma Pesada, ação Atacar: dano extra = Bônus de Proficiência. Após Crítico ou reduzir alguém a 0 PV com arma corpo a corpo: ataque extra (Ação Bônus).",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-em-escudos",
    nome: "Mestre em Escudos",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Treinamento com Escudo" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR'], maximo: 20 },
    beneficios: "Acertar corpo a corpo a 1,5m: pode golpear com Escudo também (Salv. Força CD 8+mod.Força+Bônus Prof.) — empurra 1,5m ou Caído, 1x/turno. Reação: com Escudo e sucesso em salv. Destreza que daria metade do dano, evita todo o dano.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "mestre-atirador",
    nome: "Mestre-Atirador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES'], maximo: 20 },
    beneficios: "Ataques à distância ignoram Cobertura Parcial/¾. Atirar a 1,5m de inimigo não dá Desvantagem. Atirar no alcance máximo não dá Desvantagem.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "perfurador",
    nome: "Perfurador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "1x/turno, ao causar dano Perfurante, rerola 1 dado de dano (usa o novo). Crítico com dano Perfurante: rola 1 dado extra de dano.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "resiliente",
    nome: "Resiliente",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: "Escolha atributo sem proficiência em salvaguarda" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "+1 no atributo escolhido (sem proficiência de salvaguarda ainda) + ganha proficiência em salvaguarda desse atributo.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "resistente",
    nome: "Resistente",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['CON'], maximo: 20 },
    beneficios: "Vantagem em Salvaguardas Contra Morte. Ação Bônus: gasta 1 Dado de Vida, cura PV = resultado rolado.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "sentinela",
    nome: "Sentinela",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['FOR', 'DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Ataque de Oportunidade quando alguém a 1,5m Desengaja ou acerta outro alvo (não só ao sair do alcance). Acertar com Ataque de Oportunidade: Deslocamento do alvo vira 0 pelo resto do turno.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "sorrateiro",
    nome: "Sorrateiro",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['DES'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES'], maximo: 20 },
    beneficios: "Visão às Cegas 3m. Vantagem em Furtividade ao Esconder-se em combate. Errar ataque escondido não revela sua posição.",
    pagina: 207,
    fonte: "PHB 2024",
  },
  {
    id: "talhador",
    nome: "Talhador",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "1x/turno, ao causar dano Cortante, reduz Deslocamento do alvo em 3m até seu próximo turno. Crítico com dano Cortante: alvo tem Desvantagem em ataques até seu próximo turno.",
    pagina: 208,
    fonte: "PHB 2024",
  },
  {
    id: "telecinetico",
    nome: "Telecinético",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Aprende Mãos Mágicas (sem V/S, mão invisível, +9m de alcance/distância). Ação Bônus: empurra telecineticamente criatura à vista a 9m (Salv. Força CD 8+mod.+Bônus Prof. ou move 1,5m).",
    pagina: 208,
    fonte: "PHB 2024",
  },
  {
    id: "telepatico",
    nome: "Telepático",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Fala telepaticamente com quem vê a 18m (num idioma que conhece; só é entendido por quem sabe o idioma, sem resposta). Detectar Pensamentos sempre preparada, conjura grátis 1x/Descanso Longo (ou com espaço de magia depois).",
    pagina: 208,
    fonte: "PHB 2024",
  },
  {
    id: "tocado-pela-sombra",
    nome: "Tocado pela Sombra",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Escolhe 1 magia de 1º círculo (Ilusão ou Necromancia): ela + Invisibilidade ficam sempre preparadas, conjuráveis grátis 1x/Descanso Longo cada (ou com espaço depois).",
    pagina: 208,
    fonte: "PHB 2024",
  },
  {
    id: "tocado-pelas-fadas",
    nome: "Tocado pelas Fadas",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 20 },
    beneficios: "Escolhe 1 magia de 1º círculo (Adivinhação ou Encantamento): ela + Passo Nebuloso ficam sempre preparadas, conjuráveis grátis 1x/Descanso Longo cada (ou com espaço depois).",
    pagina: 208,
    fonte: "PHB 2024",
  },
  {
    id: "treinamento-com-armas-marciais",
    nome: "Treinamento com Armas Marciais",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 20 },
    beneficios: "Proficiência com armas Marciais.",
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "velocista",
    nome: "Velocista",
    categoria: "Geral",
    repetivel: false,
    prerequisitos: { nivelMinimo: 4, atributosMinimos: ['DES', 'CON'], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['DES', 'CON'], maximo: 20 },
    beneficios: "Deslocamento +3m. Ação Correr: Terreno Difícil não custa movimento extra no resto do turno. Ataques de Oportunidade contra você têm Desvantagem.",
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "arquearia",
    nome: "Arquearia",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "+2 nas jogadas de ataque com armas à distância.",
    efeitoMecanico: { tipo: 'bonus-ataque-distancia', bonus: 2 },
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "combate-com-armas-de-arremesso",
    nome: "Combate com Armas de Arremesso",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "+2 no dano ao acertar ataque à distância com arma de Arremesso.",
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "combate-com-armas-grandes",
    nome: "Combate com Armas Grandes",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ao rolar dano com arma corpo a corpo de duas mãos (Duas Mãos ou Versátil empunhada com 2 mãos): trata 1s e 2s como 3.",
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "combate-com-duas-armas",
    nome: "Combate com Duas Armas",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Soma mod. de atributo no dano do ataque adicional de arma Leve, se ainda não somava.",
    pagina: 209,
    fonte: "PHB 2024",
  },
  {
    id: "combate-desarmado",
    nome: "Combate Desarmado",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ataque Desarmado causa 1d6+Força Contundente (1d8 se sem arma/escudo em mãos). Início do turno: 1d4 Contundente extra a criatura Imobilizada por você.",
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "defensivo",
    nome: "Defensivo",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "+1 CA enquanto usa armadura Leve, Média ou Pesada.",
    efeitoMecanico: { tipo: 'bonus-ca-com-armadura', bonus: 1 },
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "duelismo",
    nome: "Duelismo",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Com 1 arma corpo a corpo numa mão e nenhuma outra arma: +2 no dano dessa arma.",
    efeitoMecanico: { tipo: 'bonus-dano-uma-mao-sem-outra-arma', bonus: 2 },
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "interceptacao",
    nome: "Interceptação",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Reação: quando alguém à vista acerta outra criatura a 1,5m de você, reduz o dano em 1d10+Bônus de Proficiência. Precisa empunhar Escudo ou arma Simples/Marcial.",
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "luta-as-cegas",
    nome: "Luta às Cegas",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Visão às Cegas 3m.",
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "protetivo",
    nome: "Protetivo",
    categoria: "Estilo de Luta",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Característica de Estilo de Luta" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Reação: quando alguém à vista ataca alvo (não você) a 1,5m de você, interpõe Escudo (se empunhado) — Desvantagem no ataque desencadeador e em todos contra o alvo até seu próximo turno, enquanto você ficar a 1,5m dele.",
    pagina: 210,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-fortitude",
    nome: "Dádiva da Fortitude",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). PV máximo +40. Ao recuperar PV, cura extra = mod. Constituição (1x, recarrega no início do seu próximo turno).",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-proeza-em-combate",
    nome: "Dádiva da Proeza em Combate",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Errar ataque: transforma em acerto (1x, recarrega no início do seu próximo turno).",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-proficiencia-em-pericia",
    nome: "Dádiva da Proficiência em Perícia",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Proficiência em todas as perícias. Especialização numa perícia que já tenha proficiência.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-recordacao-de-magia",
    nome: "Dádiva da Recordação de Magia",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: "Característica Conjuração" },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 Int/Sab/Car (máx. 30). Ao conjurar com espaço de 1º-4º círculo, role 1d4: se bater com o círculo do espaço, ele não é gasto.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-recuperacao",
    nome: "Dádiva da Recuperação",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Até a Morte: ao cair a 0 PV, fica com 1 PV e cura metade do máximo (1x/Descanso Longo). Recuperar Vitalidade: reserva de 10d10, Ação Bônus gasta dados e cura o total (recarrega em Descanso Longo).",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-resistencia-a-energia",
    nome: "Dádiva da Resistência à Energia",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Resistência a 2 tipos de dano à escolha (Ácido/Elétrico/Gélido/Ígneo/Necrótico/Psíquico/Radiante/Trovejante/Venenoso), troca em Descanso Longo. Reação: redireciona dano resistido pra outra criatura à vista (Salv. Destreza ou 2d12+Constituição).",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-velocidade",
    nome: "Dádiva da Velocidade",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Ação Bônus: Desengajar (também encerra Imobilizado). Deslocamento +9m.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-viagem-dimensional",
    nome: "Dádiva da Viagem Dimensional",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Após Atacar ou Usar Magia: teleporta até 9m pra espaço desocupado à vista.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-da-visao-verdadeira",
    nome: "Dádiva da Visão Verdadeira",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Visão Verdadeira 18m.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-do-ataque-irresistivel",
    nome: "Dádiva do Ataque Irresistível",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES'], maximo: 30 },
    beneficios: "+1 Força ou Destreza (máx. 30). Dano Contundente/Cortante/Perfurante sempre ignora Resistência. Tirou 20 no ataque: dano extra = valor do atributo aumentado.",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-do-destino",
    nome: "Dádiva do Destino",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Você/aliado a 18m acerta/erra Teste D20: role 2d4 como bônus ou penalidade nesse teste (1x, recarrega ao rolar Iniciativa ou Descanso Curto/Longo).",
    pagina: 211,
    fonte: "PHB 2024",
  },
  {
    id: "dadiva-do-espirito-da-noite",
    nome: "Dádiva do Espírito da Noite",
    categoria: "Dádiva Épica",
    repetivel: false,
    prerequisitos: { nivelMinimo: 19, atributosMinimos: [], outro: null },
    concedeAsi: { tipo: 'escolha-unica', atributos: ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'], maximo: 30 },
    beneficios: "+1 em qualquer atributo (máx. 30). Em Meia-luz/Escuridão: Ação Bônus pra ficar Invisível (encerra ao agir); e Resistência a todo dano exceto Psíquico/Radiante.",
    pagina: 211,
    fonte: "PHB 2024",
  },
];

export const talentosSelvagens: Talento[] = [
  {
    id: "atmocinese",
    nome: "Atmocinese",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "1x/turno, ao conjurar magia ou acertar ataque com dano Contundente/Cortante/Perfurante/Psíquico, pode mudar o tipo pra Elétrico. Conhece Toque Chocante + tem Névoa sempre preparada (grátis 1x/Descanso Longo, depois com espaço); nível 3+: também Rajada de Vento do mesmo jeito. Atributo de conjuração (Int/Sab/Car) escolhido ao pegar o talento.",
    pagina: 21,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "biocinese",
    nome: "Biocinese",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Quando magia sua cura PV, pode rolar 1d4 extra e somar à cura (usos = Bônus de Proficiência/Descanso Longo). Conhece Poupar os Moribundos + tem Palavra Curativa sempre preparada (grátis 1x/Descanso Longo); nível 3+: também Vigor Arcano do mesmo jeito.",
    pagina: 21,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "clarividencia",
    nome: "Clarividência",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ação Buscar: Vantagem no teste (usos = Bônus de Proficiência/Descanso Longo). Conhece Orientação + tem Detectar o Bem e o Mal sempre preparada (grátis 1x/Descanso Longo); nível 3+: também Ver o Invisível do mesmo jeito.",
    pagina: 21,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "criocinese",
    nome: "Criocinese",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "1x/turno, ao conjurar magia ou acertar ataque com dano Contundente/Cortante/Perfurante/Psíquico, pode mudar o tipo pra Gélido. Conhece Raio de Gelo + tem Armadura de Agathys e Faca de Gelo sempre preparadas (cada uma grátis 1x/Descanso Longo, depois com espaço).",
    pagina: 22,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "empata",
    nome: "Empata",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ação Influenciar: Vantagem no teste (usos = Bônus de Proficiência/Descanso Longo). Tem Enfeitiçar Pessoa sempre preparada (grátis 1x/Descanso Longo); nível 3+: também Acalmar Emoções do mesmo jeito.",
    pagina: 22,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "modelador-de-carne",
    nome: "Modelador de Carne",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Teste de Destreza (Acrobacia/Prestidigitação): +mod. Inteligência (mín +1), usos = Bônus de Proficiência/Descanso Longo. Tem Passos Largos sempre preparada (grátis 1x/Descanso Longo); nível 3+: também Alterar-se do mesmo jeito.",
    pagina: 22,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "sussurrador-mental",
    nome: "Sussurrador Mental",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ação: conexão telepática com 1 criatura vista a 36m, por 1h enquanto ficarem a 36m um do outro (precisa idioma comum; 1x/Descanso Curto ou Longo). Conhece Talho Mental + tem Sussurros Dissonantes sempre preparada (grátis 1x/Descanso Longo).",
    pagina: 22,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "trapaceiro-psionico",
    nome: "Trapaceiro Psiônico",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Teste de Carisma (Enganação/Persuasão): +mod. Inteligência (mín +1), usos = Bônus de Proficiência/Descanso Longo. Conhece Ilusão Menor + tem Disfarçar-se sempre preparada (grátis 1x/Descanso Longo).",
    pagina: 23,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "psicinetico-talento",
    nome: "Psicinético (Talento)",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "Ação Correr: +3m de Deslocamento até o fim do turno (usos = Bônus de Proficiência/Descanso Longo). Conhece Arremesso Telecinético + tem Onda Trovejante sempre preparada (grátis 1x/Descanso Longo).",
    pagina: 23,
    fonte: "UA Psiônico 2025",
  },
  {
    id: "pirocinese",
    nome: "Pirocinese",
    categoria: "Talento Selvagem",
    repetivel: false,
    prerequisitos: { nivelMinimo: null, atributosMinimos: [], outro: "Não pode possuir outro Talento Selvagem" },
    concedeAsi: { tipo: 'nenhum' },
    beneficios: "1x/turno, ao conjurar magia ou acertar ataque com dano Contundente/Cortante/Perfurante/Psíquico, pode mudar o tipo pra Ígneo. Conhece Criar Chama + tem Mãos Flamejantes sempre preparada (grátis 1x/Descanso Longo); nível 3+: também Raio Abrasador do mesmo jeito.",
    pagina: 23,
    fonte: "UA Psiônico 2025",
  },
];

/** Só os 10 Talentos de Origem — usado pelo wizard (Origem concede 1
 * automaticamente) e pela aba Perfil. */
export const talentosOrigem: Talento[] = talentos.filter((t) => t.categoria === 'Origem');
