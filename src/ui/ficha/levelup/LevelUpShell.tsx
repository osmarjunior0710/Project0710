import { useState } from 'react';
import { artePorLados } from '../../roll/dadosArte';
import { dadoVidaValor } from '../../../data/levelUpFixtures';
import type { Atributo } from '../../../data/wizardFixtures';
import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import type { WizardSelection } from '../../../core/personagem';
import { magiasDaClasse, type Magia } from '../../../data/rulesets/dnd2024/magias';
import { subclasses } from '../../../data/rulesets/dnd2024/subclasses';
import { estilosDeLuta } from '../../../data/rulesets/dnd2024/estilosDeLuta';
import {
  caracteristicasDoNivel,
  caracteristicasDoNivelComSubclasse,
  NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE,
  niveisComASI,
  niveisComDadivaEpica,
  niveisComEspecialista,
  temEstiloDeLutaTrocavel,
  subclasseImplementada,
  caracteristicaSubclasseDesbloqueada,
  NOMES_ESPECIALISTA,
} from '../../../core/levelUp';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { valorRecursoClasse } from '../../../core/recursosClasse';
import {
  agruparMagiasPorCirculo,
  contarTrocas,
  espacosDeMagiaAtivos,
  usaRedefinicaoPorDescanso,
} from '../../../core/magiasPersonagem';
import {
  invocacoesElegiveisAteNivel,
  invocacaoRequeridaDe,
  invocacaoBloqueadaPorRequisitoAusente,
  invocacoesQueDependemDe,
} from '../../../core/invocacoesMisticas';
import { circulosArcanaMisticaDesbloqueados, magiasElegiveisArcanaMistica, trocasArcanaMistica } from '../../../core/arcanaMistica';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TextoComMagias from '../../components/TextoComMagias';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';
import IconeClasse, { temBannerProprio } from '../../components/IconeClasse';
import DistribuirPontosAtributo from '../../components/DistribuirPontosAtributo';
import { useAvisoTemporario } from '../../hooks/useAvisoTemporario';
import { talentos } from '../../../data/rulesets/dnd2024/talentos';
import { opcoesMagiaEscolhidaPorEscola, opcoesMagiasRituais, quantidadeMagiasRituais } from '../../../core/magiaTalentoGeral';
import { opcoesPericiaRestrita } from '../../../core/periciaTalentoGeral';
import TelaEscolherTalento from './TelaEscolherTalento';
import TrocarValorSimples from '../../components/TrocarValorSimples';
import styles from './LevelUpShell.module.css';

export interface PersonagemNivel {
  nivel: number;
  pvMax: number;
  dadoVida: string;
  conMod: number;
  subclasse: string | null;
  estiloDeLuta: string | null;
  /** Bônus fixo de PV máximo por nível ganho, de traço de espécie
   * (ex.: Tenacidade Anã, +1) e/ou talento de Origem (ex.: Vigoroso,
   * +2) — 0 pra quem não tem nenhum. Ver `core/calculoPersonagem.ts`
   * (`bonusPvPorNivelDaEspecie`/`bonusPvPorNivelDoTalento`). */
  bonusPvPorNivel: number;
  /** Nome(s) da(s) fonte(s) de `bonusPvPorNivel`, já concatenados (ex.:
   * "Tenacidade Anã", "Vigoroso", "Tenacidade Anã + Vigoroso") — string
   * vazia se `bonusPvPorNivel` for 0. Ver `rotulosBonusPvPorNivel`. */
  bonusPvPorNivelLabel: string;
}

interface LevelUpShellProps {
  personagem: PersonagemNivel;
  classe: Classe;
  onFechar: () => void;
  onConfirmar: (resultado: {
    novoNivel: number;
    pvGanho: number;
    subclasseEscolhida: string | null;
    estiloDeLutaEscolhido: string | null;
    truquesEscolhidos: string[] | null;
    /** Livro de Magias (Mago) — lista COMPLETA (antigas + novas), mesmo
     * padrão de `truquesEscolhidos`/`magiasPreparadasEscolhidas`. O
     * grimório nunca perde magia nesse passo (ver
     * `usaRedefinicaoPorDescanso`) — só cresce. `null` = classe sem
     * essa característica. */
    livroDeMagiasEscolhidas: string[] | null;
    magiasPreparadasEscolhidas: string[] | null;
    invocacoesMisticasEscolhidas: string[] | null;
    periciasEspecialistaEscolhidas: string[] | null;
    periciasSubclasseBonusEscolhidas: string[] | null;
    magiasDescobertasMagicasEscolhidas: string[] | null;
    atributosAumentados: Atributo[] | null;
    talentoGeralEscolhido: string | null;
    dadivaEpicaEscolhida: string | null;
    /** Só os círculos que MUDARAM nesse level-up — escolha inicial de
     * um círculo novo, e/ou 1 troca de um círculo já conhecido (regra
     * real permite os dois no mesmo level-up). `null` = nada mudou. */
    arcanaMisticaAlteracoes: Record<number, string> | null;
    /** Só as gavetas que MUDARAM nesse level-up — `null` num campo =
     * essa gaveta não trocou (ou não existe pro personagem). */
    magiaIniciadaAlteracoes: { origem: string | null; especie: string | null } | null;
    /** Só preenchido quando o Talento Geral escolhido NESTE level-up
     * pede magia(s) escolhida(s) — por escola restrita (Tocado pela
     * Sombra/Fadas, 1 magia) ou Rituais (Conjurador Ritualista, N) —
     * 1 entrada `{ [talentoId]: magiasEscolhidas }`. `null` = nenhuma
     * escolha desse tipo nesse level-up. */
    escolhaMagiaTalentoGeral: Record<string, string[]> | null;
    /** Só preenchido quando o Talento Geral ESCOLHIDO NESTE level-up
     * for Especialista em Perícia — 1 perícia LIVRE (qualquer uma,
     * ainda não proficiente) que vira proficiência de verdade. `null`
     * = talento não escolhido nesse level-up. */
    periciaLivreTalentoEscolhida: string | null;
    /** Só preenchido quando o Talento Geral ESCOLHIDO NESTE level-up
     * for Analítico/Mente Aguçada — 1 perícia da lista restrita do
     * talento (nome bruto; o `FichaShell` decide se vira proficiência
     * ou Especialização, comparando com o que o personagem já tinha
     * ANTES desse level-up). `null` = talento não escolhido nesse
     * level-up. */
    periciaRestritaTalentoEscolhida: string | null;
  }) => void;
  /** Controlado pelo `FichaShell` (persistido junto com o resto do
   * progresso) em vez de estado local — uma vez rolado o dado de
   * vida, fechar o Level Up (ou dar F5) não pode apagar o resultado e
   * abrir margem pra rolar de novo. Ver DECISOES-DESIGN.md. */
  hpModo: 'media' | 'rolar' | null;
  onHpModoChange: (modo: 'media' | 'rolar' | null) => void;
  hpRolado: number | null;
  onHpRoladoChange: (valor: number | null) => void;
  /** Truques que o personagem já tem (pré-marcados na tela de escolha
   * — Etapa 4.1). */
  truquesAtuais: string[];
  /** Catálogo completo de Truques da classe, pra escolher de/pra. */
  truquesDaClasse: Magia[];
  /** Magias Preparadas que o personagem já tem (Etapa 4.3). */
  magiasPreparadasAtuais: string[];
  /** Livro de Magias (grimório) do Mago — pool de magias CONHECIDAS,
   * maior que `magiasPreparadasAtuais` (ver DECISOES-CLASSES.md
   * "Casters", Padrão C). `[]` pra quem não tem essa característica. */
  livroDeMagiasAtuais: string[];
  /** Invocações Místicas (Bruxo) que o personagem já tem — Etapa 4.3
   * do Bruxo, mesmo padrão de troca de Truques (1 por level-up). */
  invocacoesMisticasAtuais: string[];
  /** Arcana Mística (Bruxo, níveis 11/13/15/17) — círculo → nome da
   * magia já escolhida pra ele. Só a escolha inicial é feita aqui
   * (trocar depois fica pra outra entrega, ver PENDENCIAS.md). */
  arcanaMisticaAtuais: Record<number, string>;
  /** Talento "Iniciado em Magia" pego pela Origem (Acólito/Guia/Sábio)
   * — `null` quando o personagem não tem esse talento por essa fonte.
   * Regra real (Cap. 5, p.201, "Substituição de Magia"): a cada
   * level-up pode trocar a magia de 1º círculo por outra da MESMA
   * lista — os truques não são trocáveis. */
  magiaIniciadaOrigemAtual: { lista: string; magia: string } | null;
  /** Mesmo talento, só que pego avulso pelo traço Versátil (Humano) —
   * gaveta independente da de cima (ver `core/personagem.ts`), por
   * isso trocado separadamente. */
  magiaIniciadaEspecieAtual: { lista: string; magia: string } | null;
  /** Catálogo de magias de círculo > 0 da classe (todos os círculos —
   * filtrado por círculo ativo no nível novo aqui dentro). */
  magiasDaClasseDisponiveis: Magia[];
  /** Perícias já escolhidas pra Especialização (dobra o Bônus de
   * Proficiência) — característica "Especialista" do Bardo. */
  periciasEspecialistaAtuais: string[];
  /** Perícias em que o personagem é proficiente — de onde a escolha
   * de Especialista pode vir (só dá pra especializar o que já é
   * proficiente). */
  periciasProficientesDoPersonagem: string[];
  /** Perícias já escolhidas pra "Proficiências Bônus" (Colégio do
   * Conhecimento, nível 3) — escolha única, feita 1 vez só (quando o
   * array chega a 3, o passo não aparece mais). */
  periciasSubclasseBonusAtuais: string[];
  /** "Descobertas Mágicas" (Colégio do Conhecimento, nível 6) — 2
   * magias já escolhidas (pré-marcadas, trocável 1 por level-up, mesmo
   * padrão de Truques). */
  magiasDescobertasMagicasAtuais: string[];
  /** Catálogo de onde vêm as 2 magias de Descobertas Mágicas —
   * Clérigo/Druida/Mago, TODOS os círculos (filtrado por círculo ativo
   * no nível novo aqui dentro, mesmo padrão de `magiasDaClasseDisponiveis`). */
  poolDescobertasMagicas: Magia[];
  /** Atributos atuais do personagem (já com Level Ups anteriores
   * aplicados) — pra mostrar base/mod real na tela de Aumento de
   * Atributo. */
  atributosAtuais: WizardSelection['atributos'];
  /** Atributos FINAIS (base + bônus de espécie/origem/ASI já
   * aplicados) — usado só pra validar Atributo Mínimo de Talentos
   * (regra real checa a pontuação total, não a base). */
  atributosFinaisAtuais: Record<Atributo, number>;
  /** Talentos Gerais já escolhidos em Level Ups anteriores — Fase 3 do
   * plano de Talentos (ver DECISOES-DESIGN.md/PENDENCIAS.md). */
  talentosGeraisAtuais: string[];
  /** Magia(s) já escolhida(s) por Talento Geral em Level Ups anteriores
   * (chave = id do talento) — usado só pra detectar o crescimento do
   * Conjurador Ritualista (Bônus de Proficiência subiu, pode escolher
   * mais 1 magia Ritual) sem duplicar/perder as já escolhidas antes. */
  escolhaMagiaTalentoGeralAtuais: Record<string, string[]>;
  /** IDs de talentos marcados com 📌 (planejamento pra escolher num
   * level up futuro) — persistido por personagem. */
  talentosFavoritosAtuais: string[];
  onToggleFavoritoTalento: (id: string) => void;
}

type LuStep =
  | 'pv'
  | 'features'
  | 'subclasse'
  | 'proficienciasBonus'
  | 'estiloDeLuta'
  | 'truques'
  | 'livroDeMagias'
  | 'magiasPreparadas'
  | 'invocacoes'
  | 'descobertasMagicas'
  | 'especialista'
  | 'asi'
  | 'asiAtributo'
  | 'talentoMagia'
  | 'periciaLivreTalento'
  | 'periciaRestritaTalento'
  | 'dadivaEpica'
  | 'arcanaMistica'
  | 'iniciadoEmMagia'
  | 'resumo';
type FaseDramatica = 'idle' | 'rolando' | 'resultado';

const NOMES_ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
const DURACAO_ROLAGEM_MS = 1400;

export default function LevelUpShell({
  personagem,
  classe,
  onFechar,
  onConfirmar,
  hpModo,
  onHpModoChange,
  hpRolado,
  onHpRoladoChange,
  truquesAtuais,
  truquesDaClasse,
  magiasPreparadasAtuais,
  livroDeMagiasAtuais,
  magiasDaClasseDisponiveis,
  invocacoesMisticasAtuais,
  arcanaMisticaAtuais,
  magiaIniciadaOrigemAtual,
  magiaIniciadaEspecieAtual,
  periciasEspecialistaAtuais,
  periciasProficientesDoPersonagem,
  periciasSubclasseBonusAtuais,
  magiasDescobertasMagicasAtuais,
  poolDescobertasMagicas,
  atributosAtuais,
  atributosFinaisAtuais,
  talentosGeraisAtuais,
  escolhaMagiaTalentoGeralAtuais,
  talentosFavoritosAtuais,
  onToggleFavoritoTalento,
}: LevelUpShellProps) {
  const novoNivel = personagem.nivel + 1;
  const maxTruques = valorRecursoClasse(classe, 'Truques Conhecidos', novoNivel);
  const maxMagiasPreparadas = valorRecursoClasse(classe, 'Magias Preparadas', novoNivel);
  const maxLivroDeMagias = valorRecursoClasse(classe, 'Livro de Magias', novoNivel);
  const temLivroDeMagias = maxLivroDeMagias > 0;
  // Mago (e futuras classes com o mesmo Padrão C, ver DECISOES-CLASSES.md
  // "Casters"): Truques/Magias Preparadas só trocam no Descanso Longo,
  // NUNCA no Level Up — aqui é só crescimento (0 trocas permitidas).
  // Bardo/Bruxo continuam com a regra de sempre (0 ou 1 troca).
  const usaRedefPorDescanso = usaRedefinicaoPorDescanso(classe);
  const maxInvocacoes = valorRecursoClasse(classe, 'Invocações Místicas', novoNivel);
  const invocacoesCatalogo = invocacoesElegiveisAteNivel(novoNivel);
  const circuloMaximoNovoNivel = Math.max(0, ...espacosDeMagiaAtivos(classe, novoNivel).map((e) => e.circulo));
  const magiasPreparadasDaClasse = magiasDaClasseDisponiveis.filter((m) => m.circulo <= circuloMaximoNovoNivel);
  const descobertasMagicasCatalogo = poolDescobertasMagicas.filter(
    (m) => m.circulo === 0 || m.circulo <= circuloMaximoNovoNivel,
  );
  // Especialista não é uma tabela por nível (não tem coluna numérica
  // na planilha) — a regra real é sempre "+2 perícias por gatilho"
  // (confirmado na descrição da característica), por isso o incremento
  // fixo em vez de ler de `recursos`.
  const especialistaDisparaAgora = niveisComEspecialista(classe).includes(novoNivel);
  const subclassesDaClasse = subclasses.filter((s) => s.classeId === classe.id);

  // Precisa vir antes da montagem de `luSteps` — decide se o passo
  // "proficienciasBonus" entra na sequência quando a subclasse
  // escolhida NESTE level-up (não só uma já salva de antes) desbloqueia
  // "Proficiências Bônus" no mesmo nível (Colégio do Conhecimento,
  // nível 3 — subclasse e a escolha de perícia chegam juntas).
  const [subclasseEscolhida, setSubclasseEscolhida] = useState<string | null>(personagem.subclasse);

  // Precisa vir antes da montagem de `luSteps` — decide se o passo
  // extra "asiAtributo" entra na sequência (ver mais abaixo).
  const [talentoEscolhido, setTalentoEscolhido] = useState<string | null>(null);
  const talentoObjEscolhido = talentoEscolhido ? (talentos.find((t) => t.id === talentoEscolhido) ?? null) : null;
  // Especialista em Perícia soma +1 vaga na MESMA mecânica de
  // Especialista de classe (ver `maxEspecialista` abaixo) — precisa
  // vir depois de `talentoObjEscolhido` existir.
  const maxEspecialista =
    periciasEspecialistaAtuais.length +
    (especialistaDisparaAgora ? 2 : 0) +
    (talentoObjEscolhido?.efeitoMecanico?.tipo === 'pericia-livre-mais-especializacao' ? 1 : 0);
  // Dádiva Épica (nível 19) — mesma mecânica de "Talento Geral" do
  // passo `asi`, só filtrada por categoria, sem aplicar ASI (Dádivas
  // Épicas não concedem Aumento de Atributo).
  const [dadivaEpicaEscolhida, setDadivaEpicaEscolhida] = useState<string | null>(null);
  // Arcana Mística (níveis 11/13/15/17) — o círculo novo é o que
  // aparece em `novoNivel` mas não em `personagem.nivel` (a diferença
  // entre os dois nunca é mais de 1 círculo, dado o espaçamento real
  // da característica na tabela de Bruxo).
  const circulosArcanaAntes = circulosArcanaMisticaDesbloqueados(classe, personagem.nivel);
  const circulosArcanaDepois = circulosArcanaMisticaDesbloqueados(classe, novoNivel);
  const novoCirculoArcanaMistica = circulosArcanaDepois.find((c) => !circulosArcanaAntes.includes(c)) ?? null;
  // Semeado com o que o personagem já tinha — a cada level-up (não só
  // quando desbloqueia um círculo novo) o jogador pode trocar 1 magia
  // de arcanum já escolhida por outra do mesmo círculo.
  const [arcanaMisticaEscolhidas, setArcanaMisticaEscolhidas] = useState<Record<number, string>>(arcanaMisticaAtuais);
  /** Círculos que MUDARAM em relação ao que o personagem já tinha —
   * inclui tanto a escolha inicial de um círculo novo quanto uma troca
   * de círculo já conhecido (os dois podem acontecer no mesmo
   * level-up). Usado no resumo e no resultado final. */
  const arcanaMisticaAlteracoesPendentes = Object.fromEntries(
    Object.entries(arcanaMisticaEscolhidas).filter(([circulo, magia]) => arcanaMisticaAtuais[Number(circulo)] !== magia),
  );
  // Iniciado em Magia (Origem e/ou Versátil) — "Substituição de Magia"
  // (Cap. 5, p.201): a cada level-up pode trocar a magia de 1º círculo
  // por outra da mesma lista, sem limite de 1 troca (diferente de
  // Arcana Mística, que trava em 1 por level-up).
  const [magiaIniciadaOrigemEscolhida, setMagiaIniciadaOrigemEscolhida] = useState<string | null>(
    magiaIniciadaOrigemAtual?.magia ?? null,
  );
  const [magiaIniciadaEspecieEscolhida, setMagiaIniciadaEspecieEscolhida] = useState<string | null>(
    magiaIniciadaEspecieAtual?.magia ?? null,
  );
  const magiaIniciadaAlteracoesPendentes = {
    origem:
      magiaIniciadaOrigemAtual && magiaIniciadaOrigemEscolhida !== magiaIniciadaOrigemAtual.magia
        ? magiaIniciadaOrigemEscolhida
        : null,
    especie:
      magiaIniciadaEspecieAtual && magiaIniciadaEspecieEscolhida !== magiaIniciadaEspecieAtual.magia
        ? magiaIniciadaEspecieEscolhida
        : null,
  };
  /** Talento escolhido pede uma escolha de atributo real (não é
   * `'nenhum'`, nem `escolha-unica` com 1 atributo só, que já aplica
   * direto sem passo extra). */
  const precisaEscolherAtributoDoTalento =
    talentoObjEscolhido !== null &&
    talentoObjEscolhido.concedeAsi.tipo !== 'nenhum' &&
    (talentoObjEscolhido.concedeAsi.tipo === 'distribuir-dois' || talentoObjEscolhido.concedeAsi.atributos.length > 1);
  // Talento Geral com magia(s) ESCOLHIDA(S) — por escola restrita
  // (Tocado pela Sombra/Fadas, 1 magia) ou Rituais (Conjurador
  // Ritualista, N = Bônus de Proficiência) — passo extra só entra
  // quando o talento ESCOLHIDO NESTE level-up pede essa sub-escolha
  // (mesmo padrão de `precisaEscolherAtributoDoTalento`, não retroage
  // sobre talentos já escolhidos em level-ups anteriores).
  const tipoEfeitoTalentoEscolhido = talentoObjEscolhido?.efeitoMecanico?.tipo;
  const precisaEscolherMagiaDoTalentoNovo =
    tipoEfeitoTalentoEscolhido === 'magia-escolhida-por-escola' || tipoEfeitoTalentoEscolhido === 'magias-rituais-por-proficiencia';
  // Crescimento do Conjurador Ritualista: mesmo passo `talentoMagia`,
  // mas disparado num level-up POSTERIOR ao que concedeu o talento —
  // sempre que o Bônus de Proficiência sobe, o total de magias Rituais
  // permitido cresce junto (regra real: "pode adicionar mais 1"). Não
  // depende de nível de ASI (Bônus de Proficiência sobe em 5/9/13/17,
  // ASI em 4/8/12/16/19 — calendários diferentes).
  const talentoConjuradorRitualista = talentos.find((t) => t.id === 'conjurador-ritualista') ?? null;
  const magiasRituaisJaEscolhidas = escolhaMagiaTalentoGeralAtuais['conjurador-ritualista'] ?? [];
  const maxMagiasRituaisAgora = quantidadeMagiasRituais(classe, novoNivel);
  const precisaCrescerMagiaRitual =
    tipoEfeitoTalentoEscolhido !== 'magias-rituais-por-proficiencia' &&
    talentosGeraisAtuais.includes('conjurador-ritualista') &&
    talentoConjuradorRitualista !== null &&
    maxMagiasRituaisAgora > magiasRituaisJaEscolhidas.length;
  const talentoMagiaAlvo = precisaEscolherMagiaDoTalentoNovo
    ? talentoObjEscolhido
    : precisaCrescerMagiaRitual
      ? talentoConjuradorRitualista
      : null;
  const opcoesMagiaTalento = !talentoMagiaAlvo
    ? []
    : talentoMagiaAlvo.efeitoMecanico?.tipo === 'magia-escolhida-por-escola'
      ? opcoesMagiaEscolhidaPorEscola(talentoMagiaAlvo.id)
      : talentoMagiaAlvo.efeitoMecanico?.tipo === 'magias-rituais-por-proficiencia'
        ? opcoesMagiasRituais(talentoMagiaAlvo.id)
        : [];
  const maxMagiasTalento =
    talentoMagiaAlvo?.efeitoMecanico?.tipo === 'magias-rituais-por-proficiencia' ? maxMagiasRituaisAgora : 1;
  // Crescimento pré-marca as já escolhidas antes (não perde nem deixa
  // trocar as antigas, só permite ADICIONAR até o novo máximo).
  const [magiasEscolhidasTalento, setMagiasEscolhidasTalento] = useState<string[]>(
    precisaCrescerMagiaRitual ? magiasRituaisJaEscolhidas : [],
  );

  // Especialista em Perícia: 2 escolhas independentes no MESMO
  // level-up em que o talento é escolhido — 1 perícia LIVRE (vira
  // proficiência, reaproveita `concedeProficiencias` do próprio
  // talento) + 1 Especialização (reaproveita a MESMA vaga do passo
  // `especialista` de classe, só soma +1 quando esse talento entra).
  const concedeEspecializacaoExtra = tipoEfeitoTalentoEscolhido === 'pericia-livre-mais-especializacao';
  const [periciaLivreEscolhida, setPericiaLivreEscolhida] = useState<string | null>(null);

  // Analítico/Mente Aguçada: 1 perícia de uma lista RESTRITA — vira
  // proficiência ou Especialização dependendo se o personagem já era
  // proficiente nela (decidido no `FichaShell`, que sabe o estado
  // ANTES desse level-up).
  const opcoesPericiaRestritaAtual = talentoObjEscolhido ? opcoesPericiaRestrita(talentoObjEscolhido.id) : [];
  const [periciaRestritaEscolhida, setPericiaRestritaEscolhida] = useState<string | null>(null);

  const luSteps: LuStep[] = ['pv', 'features'];
  if (classe.nivelSubclasse === novoNivel && !personagem.subclasse) luSteps.push('subclasse');
  // Subclasse do PRÓPRIO level-up (se acabou de ser escolhida no passo
  // acima) ou já escolhida antes — os dois casos podem disparar
  // "Proficiências Bônus" (Colégio do Conhecimento, nível 3), sempre 1
  // única vez (nunca de novo depois que as 3 perícias já existem).
  if (
    caracteristicaSubclasseDesbloqueada(subclasseEscolhida, 'Proficiências Bônus', novoNivel) &&
    periciasSubclasseBonusAtuais.length === 0
  ) {
    luSteps.push('proficienciasBonus');
  }
  if (temEstiloDeLutaTrocavel(classe, novoNivel)) luSteps.push('estiloDeLuta');
  if (maxTruques > 0) luSteps.push('truques');
  if (temLivroDeMagias) luSteps.push('livroDeMagias');
  if (maxMagiasPreparadas > 0) luSteps.push('magiasPreparadas');
  if (maxInvocacoes > 0) luSteps.push('invocacoes');
  // Descobertas Mágicas aparece TODA vez que já estiver desbloqueada
  // (mesmo padrão de Truques) — sempre pode trocar 1 das 2, mesmo sem
  // ser a primeira vez.
  if (caracteristicaSubclasseDesbloqueada(subclasseEscolhida, 'Descobertas Mágicas', novoNivel)) {
    luSteps.push('descobertasMagicas');
  }
  // `especialista` só pode depender do talento ESCOLHIDO NESTE
  // level-up (`concedeEspecializacaoExtra`) se for empurrado pra
  // DEPOIS do passo `asi` — senão, escolher o talento na hora muda o
  // tamanho do array ANTES do índice de 'asi', deslocando o próprio
  // passo 'asi' e fazendo o `luIndex` (que não muda nesse instante)
  // "pular" pro passo errado no meio da escolha. Mesmo motivo de
  // `precisaCrescerMagiaRitual` ficar fora do bloco de ASI: qualquer
  // passo cuja existência depende do talento ESCOLHIDO NESTE level-up
  // só pode entrar DEPOIS de 'asi' no array, nunca antes.
  if (niveisComASI(classe).includes(novoNivel)) {
    luSteps.push('asi');
    // Passo extra só entra na sequência quando o talento escolhido
    // pede escolha de atributo — mesma lista, mesma bolinha de
    // progresso, mesmo padrão de "Avançar" de todo o resto do wizard.
    if (precisaEscolherAtributoDoTalento) luSteps.push('asiAtributo');
    if (precisaEscolherMagiaDoTalentoNovo) luSteps.push('talentoMagia');
    if (concedeEspecializacaoExtra) luSteps.push('periciaLivreTalento');
    if (opcoesPericiaRestritaAtual.length > 0) luSteps.push('periciaRestritaTalento');
  }
  if (especialistaDisparaAgora || concedeEspecializacaoExtra) luSteps.push('especialista');
  // Fora do bloco de ASI — o crescimento de magias Rituais acompanha o
  // Bônus de Proficiência, não os níveis de Aumento de Atributo.
  if (precisaCrescerMagiaRitual) luSteps.push('talentoMagia');
  if (niveisComDadivaEpica(classe).includes(novoNivel)) luSteps.push('dadivaEpica');
  // Também aparece em qualquer level-up seguinte (não só quando um
  // círculo novo desbloqueia) se o personagem já tiver pelo menos 1
  // arcanum escolhido — regra real permite trocar a qualquer momento.
  if (novoCirculoArcanaMistica !== null || Object.keys(arcanaMisticaAtuais).length > 0) luSteps.push('arcanaMistica');
  if (magiaIniciadaOrigemAtual || magiaIniciadaEspecieAtual) luSteps.push('iniciadoEmMagia');
  luSteps.push('resumo');

  // Características que já ganham uma tela própria mais adiante nesse
  // mesmo Level Up não aparecem de novo como card no passo "Novas
  // Características" — evita repetir a mesma coisa 2x (ver
  // DECISOES-DESIGN.md "Level Up — passo de Novas Características não
  // duplica característica com tela própria"). Uma característica
  // passiva sem tela própria (ex: "Ataque Extra") continua aparecendo
  // normalmente — esse passo é o único lugar que mostra ela.
  const nomesComTelaPropria = new Set<string>();
  if (luSteps.includes('subclasse')) nomesComTelaPropria.add(`Subclasse de ${classe.nome}`);
  if (luSteps.includes('proficienciasBonus')) nomesComTelaPropria.add('Proficiências Bônus');
  if (luSteps.includes('descobertasMagicas')) nomesComTelaPropria.add('Descobertas Mágicas');
  if (luSteps.includes('estiloDeLuta')) nomesComTelaPropria.add('Estilo de Luta');
  if (luSteps.includes('especialista')) NOMES_ESPECIALISTA.forEach((n) => nomesComTelaPropria.add(n));
  if (luSteps.includes('asi')) nomesComTelaPropria.add('Aumento no Valor de Atributo');
  if (luSteps.includes('dadivaEpica')) nomesComTelaPropria.add('Dádiva Épica');
  if (luSteps.includes('arcanaMistica') && novoCirculoArcanaMistica !== null) {
    nomesComTelaPropria.add(`Arcana Mística (${novoCirculoArcanaMistica}º círculo)`);
  }

  const [luIndex, setLuIndex] = useState(0);
  const [faseDramatica, setFaseDramatica] = useState<FaseDramatica>('idle');
  const [valorDadoAnimado, setValorDadoAnimado] = useState<number | null>(null);
  const [estiloDeLutaEscolhido, setEstiloDeLutaEscolhido] = useState<string | null>(personagem.estiloDeLuta);
  const [truquesEscolhidos, setTruquesEscolhidos] = useState<string[]>(truquesAtuais);
  const [livroDeMagiasEscolhido, setLivroDeMagiasEscolhido] = useState<string[]>(livroDeMagiasAtuais);
  const [magiasPreparadasEscolhidas, setMagiasPreparadasEscolhidas] = useState<string[]>(magiasPreparadasAtuais);
  const [invocacoesEscolhidas, setInvocacoesEscolhidas] = useState<string[]>(invocacoesMisticasAtuais);
  const [especialistaEscolhidas, setEspecialistaEscolhidas] = useState<string[]>(periciasEspecialistaAtuais);
  const [proficienciasBonusEscolhidas, setProficienciasBonusEscolhidas] = useState<string[]>(periciasSubclasseBonusAtuais);
  const [descobertasMagicasEscolhidas, setDescobertasMagicasEscolhidas] = useState<string[]>(magiasDescobertasMagicasAtuais);
  const [asiEscolhas, setAsiEscolhas] = useState<Atributo[]>([]);
  const [aviso, setAviso] = useAvisoTemporario();

  const media = dadoVidaValor[personagem.dadoVida] + personagem.conMod + personagem.bonusPvPorNivel;
  const pvGanho =
    hpModo === 'media'
      ? media
      : hpModo === 'rolar'
        ? hpRolado !== null
          ? hpRolado + personagem.conMod + personagem.bonusPvPorNivel
          : null
        : null;

  // Rolagem do dado de vida é definitiva assim que acontece — só roda
  // uma vez, disparada pelo "Avançar" (não por um botão dentro do
  // passo), com uma pausa dramática em tela cheia antes do resultado.
  // Uma vez que `hpRolado` é preenchido, o passo PV fica travado (ver
  // JSX abaixo) — voltar/reabrir o Level Up não permite rolar de novo.
  function iniciarRolagemDramatica() {
    const lados = parseInt(personagem.dadoVida.slice(1), 10);
    setFaseDramatica('rolando');
    const intervalo = setInterval(() => {
      setValorDadoAnimado(1 + Math.floor(Math.random() * lados));
    }, 90);
    setTimeout(() => {
      clearInterval(intervalo);
      const resultado = 1 + Math.floor(Math.random() * lados);
      setValorDadoAnimado(resultado);
      onHpRoladoChange(resultado);
      setFaseDramatica('resultado');
    }, DURACAO_ROLAGEM_MS);
  }

  function continuarAposRolagem() {
    setFaseDramatica('idle');
    setLuIndex((i) => i + 1);
  }

  function toggleTruque(nome: string) {
    // Mago (usaRedefPorDescanso): truque já conhecido é travado aqui —
    // a troca dele é só no Descanso Longo, não no Level Up.
    if (usaRedefPorDescanso && truquesAtuais.includes(nome)) return;
    const i = truquesEscolhidos.indexOf(nome);
    if (i > -1) {
      setTruquesEscolhidos((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (truquesEscolhidos.length < maxTruques) setTruquesEscolhidos((prev) => [...prev, nome]);
  }

  const trocasDeTruque = contarTrocas(truquesAtuais, truquesEscolhidos);
  const truquesValido =
    truquesEscolhidos.length === maxTruques && trocasDeTruque <= (usaRedefPorDescanso ? 0 : 1);

  function toggleLivroDeMagias(nome: string) {
    // Grimório nunca perde magia — item já conhecido fica travado.
    if (livroDeMagiasAtuais.includes(nome)) return;
    const i = livroDeMagiasEscolhido.indexOf(nome);
    if (i > -1) {
      setLivroDeMagiasEscolhido((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (livroDeMagiasEscolhido.length < maxLivroDeMagias) {
      setLivroDeMagiasEscolhido((prev) => [...prev, nome]);
    }
  }

  const livroDeMagiasValido = livroDeMagiasEscolhido.length === maxLivroDeMagias;

  function toggleInvocacao(id: string) {
    const i = invocacoesEscolhidas.indexOf(id);
    if (i > -1) {
      // Não deixa remover uma invocação que ainda serve de requisito
      // pra outra que continua marcada (regra real: precisa desmontar
      // a cadeia de trás pra frente, 1 troca por level-up).
      if (invocacoesQueDependemDe(id, invocacoesEscolhidas).length > 0) return;
      setInvocacoesEscolhidas((prev) => prev.filter((x) => x !== id));
      return;
    }
    const inv = invocacoesCatalogo.find((c) => c.id === id);
    if (inv && invocacaoBloqueadaPorRequisitoAusente(inv, invocacoesEscolhidas)) return;
    if (invocacoesEscolhidas.length < maxInvocacoes) setInvocacoesEscolhidas((prev) => [...prev, id]);
  }

  const trocasDeInvocacao = contarTrocas(invocacoesMisticasAtuais, invocacoesEscolhidas);
  const invocacoesValido = invocacoesEscolhidas.length === maxInvocacoes && trocasDeInvocacao <= 1;

  // Descobertas Mágicas: sempre 2 (número fixo da própria
  // característica, não escala com nível — diferente de Truques/Magias
  // Preparadas), trocável 1 por level-up, mesmo padrão de Truques.
  const MAX_DESCOBERTAS_MAGICAS = 2;
  function toggleDescobertaMagica(nome: string) {
    const i = descobertasMagicasEscolhidas.indexOf(nome);
    if (i > -1) {
      setDescobertasMagicasEscolhidas((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (descobertasMagicasEscolhidas.length < MAX_DESCOBERTAS_MAGICAS) {
      setDescobertasMagicasEscolhidas((prev) => [...prev, nome]);
    }
  }
  const trocasDeDescobertaMagica = contarTrocas(magiasDescobertasMagicasAtuais, descobertasMagicasEscolhidas);
  const descobertasMagicasValido =
    descobertasMagicasEscolhidas.length === MAX_DESCOBERTAS_MAGICAS && trocasDeDescobertaMagica <= 1;

  function toggleMagiaPreparada(nome: string) {
    // Mago (usaRedefPorDescanso): magia já preparada é travada aqui —
    // a redefinição livre é só no Descanso Longo, não no Level Up.
    if (usaRedefPorDescanso && magiasPreparadasAtuais.includes(nome)) return;
    const i = magiasPreparadasEscolhidas.indexOf(nome);
    if (i > -1) {
      setMagiasPreparadasEscolhidas((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (magiasPreparadasEscolhidas.length < maxMagiasPreparadas) {
      setMagiasPreparadasEscolhidas((prev) => [...prev, nome]);
    }
  }

  const trocasDeMagia = contarTrocas(magiasPreparadasAtuais, magiasPreparadasEscolhidas);
  const magiasPreparadasValido =
    magiasPreparadasEscolhidas.length === maxMagiasPreparadas && trocasDeMagia <= (usaRedefPorDescanso ? 0 : 1);
  // Mago só pode preparar o que já está no grimório (escolhido no passo
  // anterior, "livroDeMagias") — outras classes continuam vendo a lista
  // inteira da classe, igual sempre foi.
  const magiasPreparadasPool = temLivroDeMagias
    ? magiasPreparadasDaClasse.filter((m) => livroDeMagiasEscolhido.includes(m.nome))
    : magiasPreparadasDaClasse;

  // Especialista é só ADIÇÃO — nunca substitui uma perícia já
  // especializada (diferente de Truques/Magias Preparadas, que podem
  // trocar 1 por level-up), então `toggle` nem deixa desmarcar o que
  // já veio de um nível anterior.
  function toggleEspecialista(nome: string) {
    if (periciasEspecialistaAtuais.includes(nome)) return;
    const i = especialistaEscolhidas.indexOf(nome);
    if (i > -1) {
      setEspecialistaEscolhidas((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (especialistaEscolhidas.length < maxEspecialista) setEspecialistaEscolhidas((prev) => [...prev, nome]);
  }

  const especialistaValido = especialistaEscolhidas.length === maxEspecialista;

  // Proficiências Bônus (Colégio do Conhecimento, nível 3): escolha
  // única de 3 perícias entre as que o personagem AINDA não é
  // proficiente — nunca aparece de novo depois de confirmada (ver
  // condição de `luSteps` acima).
  const periciasNaoProficientes = pericias.filter((p) => !periciasProficientesDoPersonagem.includes(p.nome)).map((p) => p.nome);

  function toggleProficienciaBonus(nome: string) {
    const i = proficienciasBonusEscolhidas.indexOf(nome);
    if (i > -1) {
      setProficienciasBonusEscolhidas((prev) => prev.filter((x) => x !== nome));
      return;
    }
    if (proficienciasBonusEscolhidas.length < 3) setProficienciasBonusEscolhidas((prev) => [...prev, nome]);
  }

  const proficienciasBonusValido = proficienciasBonusEscolhidas.length === 3;

  const PONTOS_ASI = 2;
  const pontosAsiGastos = asiEscolhas.length;
  const pontosAsiRestantes = PONTOS_ASI - pontosAsiGastos;

  function pontosNoAtributo(a: Atributo): number {
    return asiEscolhas.filter((x) => x === a).length;
  }

  /** Regra real: +2 num atributo só, ou +1 em dois — nunca mais de 2
   * no mesmo, nunca passa de 20 no total, nunca mais de 2 pontos
   * gastos no total. */
  function incrementarAsi(a: Atributo) {
    const nesse = pontosNoAtributo(a);
    const base = atributosAtuais[a] ?? 10;
    if (pontosAsiRestantes <= 0 || nesse >= 2 || base + nesse >= 20) return;
    setAsiEscolhas((prev) => [...prev, a]);
  }

  function decrementarAsi(a: Atributo) {
    const idx = asiEscolhas.indexOf(a);
    if (idx === -1) return;
    setAsiEscolhas((prev) => prev.filter((_, i) => i !== idx));
  }

  /** Ao escolher um talento com `concedeAsi`, decide o que fazer com o
   * ASI que ele concede — `escolha-unica` com 1 atributo só aplica
   * direto (sem escolha real). O resto (`distribuir-dois`, ou
   * `escolha-unica` com 2+ atributos) fica pro passo extra
   * 'asiAtributo' — ver `precisaEscolherAtributoDoTalento`. Ver
   * DECISOES-DESIGN.md. */
  function aplicarAsiDoTalento(t: (typeof talentos)[number]) {
    if (t.concedeAsi.tipo === 'nenhum') {
      setAsiEscolhas([]);
      return;
    }
    if (t.concedeAsi.tipo === 'distribuir-dois') {
      setAsiEscolhas([]);
      return;
    }
    if (t.concedeAsi.atributos.length === 1) {
      setAsiEscolhas([t.concedeAsi.atributos[0]]);
    } else {
      setAsiEscolhas([]);
    }
  }

  const step = luSteps[luIndex];
  const nomesStep: Record<LuStep, string> = {
    pv: 'Pontos de Vida',
    features: 'Novas Características',
    subclasse: 'Escolha de Subclasse',
    proficienciasBonus: 'Proficiências Bônus',
    estiloDeLuta: 'Estilo de Luta',
    truques: 'Truques',
    livroDeMagias: 'Livro de Magias',
    magiasPreparadas: 'Magias Preparadas',
    invocacoes: 'Invocações Místicas',
    descobertasMagicas: 'Descobertas Mágicas',
    especialista: 'Especialista',
    asi: 'Atributo ou Talento',
    asiAtributo: 'Atributo do Talento',
    talentoMagia: 'Magia do Talento',
    periciaLivreTalento: 'Perícia do Talento',
    periciaRestritaTalento: 'Perícia do Talento',
    dadivaEpica: 'Dádiva Épica',
    arcanaMistica: 'Arcana Mística',
    iniciadoEmMagia: 'Iniciado em Magia',
    resumo: 'Resumo',
  };

  function avancar() {
    if (step === 'pv') {
      if (hpModo === null) {
        setAviso('Escolha um método de PV antes de avançar.');
        return;
      }
      if (hpModo === 'rolar' && hpRolado === null) {
        setAviso(null);
        iniciarRolagemDramatica();
        return;
      }
    }
    if (step === 'subclasse' && subclassesDaClasse.length > 0 && subclasseEscolhida === null) {
      setAviso('Escolha uma subclasse antes de avançar.');
      return;
    }
    if (step === 'proficienciasBonus' && !proficienciasBonusValido) {
      setAviso('Escolha exatamente 3 perícias pra Proficiências Bônus antes de avançar.');
      return;
    }
    if (step === 'truques' && !truquesValido) {
      const trocouAlgumJaTinha = trocasDeTruque > (usaRedefPorDescanso ? 0 : 1);
      setAviso(
        trocouAlgumJaTinha
          ? usaRedefPorDescanso
            ? 'A troca de truques é só no Descanso Longo, não no Level Up — desmarque o(s) que já tinha.'
            : 'Você só pode trocar 1 truque por level-up — desmarque menos truques que já tinha.'
          : `Escolha exatamente ${maxTruques} truques antes de avançar.`,
      );
      return;
    }
    if (step === 'livroDeMagias' && !livroDeMagiasValido) {
      setAviso(`Escolha exatamente ${maxLivroDeMagias} magias pro Livro de Magias antes de avançar.`);
      return;
    }
    if (step === 'magiasPreparadas' && !magiasPreparadasValido) {
      const trocouAlgumaJaTinha = trocasDeMagia > (usaRedefPorDescanso ? 0 : 1);
      setAviso(
        trocouAlgumaJaTinha
          ? usaRedefPorDescanso
            ? 'A redefinição livre de Magias Preparadas é só no Descanso Longo, não no Level Up — desmarque a(s) que já tinha.'
            : 'Você só pode trocar 1 magia preparada por level-up — desmarque menos magias que já tinha.'
          : `Escolha exatamente ${maxMagiasPreparadas} magias preparadas antes de avançar.`,
      );
      return;
    }
    if (step === 'invocacoes' && !invocacoesValido) {
      setAviso(
        trocasDeInvocacao > 1
          ? 'Você só pode trocar 1 Invocação Mística por level-up — desmarque menos invocações que já tinha.'
          : `Escolha exatamente ${maxInvocacoes} Invocações Místicas antes de avançar.`,
      );
      return;
    }
    if (step === 'descobertasMagicas' && !descobertasMagicasValido) {
      setAviso(
        trocasDeDescobertaMagica > 1
          ? 'Você só pode trocar 1 magia de Descobertas Mágicas por level-up — desmarque menos magias que já tinha.'
          : `Escolha exatamente ${MAX_DESCOBERTAS_MAGICAS} magias antes de avançar.`,
      );
      return;
    }
    if (step === 'especialista' && !especialistaValido) {
      setAviso(`Escolha exatamente ${maxEspecialista - periciasEspecialistaAtuais.length} perícia(s) pra Especialista antes de avançar.`);
      return;
    }
    if (step === 'asi' && talentoEscolhido === null) {
      setAviso('Escolha um Talento antes de avançar.');
      return;
    }
    if (step === 'dadivaEpica' && dadivaEpicaEscolhida === null) {
      setAviso('Escolha uma Dádiva Épica antes de avançar.');
      return;
    }
    if (step === 'arcanaMistica') {
      if (novoCirculoArcanaMistica !== null && !arcanaMisticaEscolhidas[novoCirculoArcanaMistica]) {
        setAviso('Escolha uma magia de Arcana Mística antes de avançar.');
        return;
      }
      if (trocasArcanaMistica(arcanaMisticaAtuais, arcanaMisticaEscolhidas) > 1) {
        setAviso('Você só pode trocar 1 arcanum por level-up — desfaça a outra troca.');
        return;
      }
    }
    if (step === 'asiAtributo') {
      if (talentoObjEscolhido && talentoObjEscolhido.concedeAsi.tipo === 'distribuir-dois' && pontosAsiRestantes > 0) {
        setAviso(`Distribua os ${PONTOS_ASI} pontos do talento antes de avançar.`);
        return;
      }
      if (talentoObjEscolhido && talentoObjEscolhido.concedeAsi.tipo === 'escolha-unica' && asiEscolhas.length === 0) {
        setAviso('Escolha o atributo do talento antes de avançar.');
        return;
      }
    }
    if (step === 'talentoMagia' && magiasEscolhidasTalento.length < maxMagiasTalento) {
      setAviso(
        maxMagiasTalento > 1
          ? `Escolha ${maxMagiasTalento} magias antes de avançar (${magiasEscolhidasTalento.length}/${maxMagiasTalento}).`
          : 'Escolha a magia do talento antes de avançar.',
      );
      return;
    }
    if (step === 'periciaLivreTalento' && periciaLivreEscolhida === null) {
      setAviso('Escolha a perícia livre do talento antes de avançar.');
      return;
    }
    if (step === 'periciaRestritaTalento' && periciaRestritaEscolhida === null) {
      setAviso('Escolha a perícia do talento antes de avançar.');
      return;
    }
    setAviso(null);
    if (step === 'resumo') {
      onConfirmar({
        novoNivel,
        pvGanho: pvGanho ?? 0,
        subclasseEscolhida,
        estiloDeLutaEscolhido,
        truquesEscolhidos: luSteps.includes('truques') ? truquesEscolhidos : null,
        livroDeMagiasEscolhidas: luSteps.includes('livroDeMagias') ? livroDeMagiasEscolhido : null,
        magiasPreparadasEscolhidas: luSteps.includes('magiasPreparadas') ? magiasPreparadasEscolhidas : null,
        invocacoesMisticasEscolhidas: luSteps.includes('invocacoes') ? invocacoesEscolhidas : null,
        periciasEspecialistaEscolhidas: luSteps.includes('especialista') ? especialistaEscolhidas : null,
        periciasSubclasseBonusEscolhidas: luSteps.includes('proficienciasBonus') ? proficienciasBonusEscolhidas : null,
        magiasDescobertasMagicasEscolhidas: luSteps.includes('descobertasMagicas') ? descobertasMagicasEscolhidas : null,
        atributosAumentados: luSteps.includes('asi') && asiEscolhas.length > 0 ? asiEscolhas : null,
        talentoGeralEscolhido: luSteps.includes('asi') ? talentoEscolhido : null,
        dadivaEpicaEscolhida: luSteps.includes('dadivaEpica') ? dadivaEpicaEscolhida : null,
        arcanaMisticaAlteracoes:
          luSteps.includes('arcanaMistica') && Object.keys(arcanaMisticaAlteracoesPendentes).length > 0
            ? arcanaMisticaAlteracoesPendentes
            : null,
        magiaIniciadaAlteracoes:
          luSteps.includes('iniciadoEmMagia') &&
          (magiaIniciadaAlteracoesPendentes.origem !== null || magiaIniciadaAlteracoesPendentes.especie !== null)
            ? magiaIniciadaAlteracoesPendentes
            : null,
        escolhaMagiaTalentoGeral:
          luSteps.includes('talentoMagia') && talentoMagiaAlvo && magiasEscolhidasTalento.length > 0
            ? { [talentoMagiaAlvo.id]: magiasEscolhidasTalento }
            : null,
        periciaLivreTalentoEscolhida: luSteps.includes('periciaLivreTalento') ? periciaLivreEscolhida : null,
        periciaRestritaTalentoEscolhida: luSteps.includes('periciaRestritaTalento') ? periciaRestritaEscolhida : null,
      });
      return;
    }
    setLuIndex((i) => i + 1);
  }

  function voltar() {
    setAviso(null);
    if (luIndex === 0) {
      onFechar();
      return;
    }
    setLuIndex((i) => i - 1);
  }

  const features = caracteristicasDoNivelComSubclasse(classe, novoNivel, subclasseEscolhida).filter(
    (f) => !nomesComTelaPropria.has(f.nome),
  );
  const dadivaEpica = caracteristicasDoNivel(classe, novoNivel).find((f) => f.nome === 'Dádiva Épica');
  const arcanaMisticaFeature =
    novoCirculoArcanaMistica !== null
      ? caracteristicasDoNivel(classe, novoNivel).find((f) => f.nome === `Arcana Mística (${novoCirculoArcanaMistica}º círculo)`)
      : undefined;
  const magiasBruxo = magiasDaClasse('Bruxo');
  const jaConhecidasArcanaMistica = [...truquesAtuais, ...magiasPreparadasAtuais, ...Object.values(arcanaMisticaAtuais)];
  const opcoesArcanaMistica =
    novoCirculoArcanaMistica !== null ? magiasElegiveisArcanaMistica(novoCirculoArcanaMistica, jaConhecidasArcanaMistica) : [];
  // Pra trocar um círculo JÁ conhecido — exclui a própria magia dele
  // (senão nunca apareceria como opção de troca) mas inclui as escolhas
  // em andamento dos outros círculos (evita repetir a mesma magia em
  // 2 círculos no mesmo level-up).
  function opcoesTrocaArcana(circulo: number): string[] {
    const jaConhecidas = [
      ...truquesAtuais,
      ...magiasPreparadasAtuais,
      ...Object.entries(arcanaMisticaEscolhidas)
        .filter(([c]) => Number(c) !== circulo)
        .map(([, m]) => m),
    ];
    return magiasElegiveisArcanaMistica(circulo, jaConhecidas).map((m) => m.nome);
  }

  if (faseDramatica !== 'idle') {
    const arteDadoVida = artePorLados(parseInt(personagem.dadoVida.slice(1), 10));
    return (
      <div className={styles.dramaScreen}>
        {faseDramatica === 'rolando' ? (
          <>
            <div className={styles.dramaLabel}>rolando 1{personagem.dadoVida}...</div>
            <div className={`${styles.dramaDie} ${styles.dramaDieSpinning} ${arteDadoVida ? styles.dramaDieComArte : ''}`}>
              {arteDadoVida && <img src={arteDadoVida} alt="" className={styles.dramaDieArtImg} />}
              <span className={styles.dramaDieValue}>{valorDadoAnimado ?? '?'}</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.dramaLabel}>resultado</div>
            <div className={`${styles.dramaDie} ${arteDadoVida ? styles.dramaDieComArte : ''}`}>
              {arteDadoVida && <img src={arteDadoVida} alt="" className={styles.dramaDieArtImg} />}
              <span className={styles.dramaDieValue}>{hpRolado}</span>
            </div>
            <div className={styles.dramaSub}>
              {hpRolado} + mod. CON ({personagem.conMod >= 0 ? '+' : ''}
              {personagem.conMod})
              {personagem.bonusPvPorNivel > 0 && ` + ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`}
            </div>
            <div className={styles.dramaTotal}>+{(hpRolado ?? 0) + personagem.conMod + personagem.bonusPvPorNivel} PV</div>
            <div className={`btn btn-primary ${styles.dramaBtn}`} onClick={continuarAposRolagem}>
              Continuar →
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>
            Nível {novoNivel} — {nomesStep[step]}
          </div>
        </div>
        <div className={styles.progress}>
          {luSteps.map((s, i) => (
            <div key={s} className={`${styles.dot} ${i < luIndex ? styles.dotDone : ''} ${i === luIndex ? styles.dotCurrent : ''}`} />
          ))}
        </div>
      </div>

      {step === 'livroDeMagias' && (
        <div className={styles.subHeader}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Livro de Magias — escolha {maxLivroDeMagias} ({livroDeMagiasEscolhido.length}/{maxLivroDeMagias})
          </div>
          <div className="label">
            Regra oficial: a cada nível, seu grimório ganha 2 magias novas — as que já tinha nunca saem daqui. A
            troca de Magias Preparadas acontece só no Descanso Longo, não neste passo.
          </div>
        </div>
      )}

      {step === 'magiasPreparadas' && (
        <div className={styles.subHeader}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Magias Preparadas — escolha {maxMagiasPreparadas} ({magiasPreparadasEscolhidas.length}/{maxMagiasPreparadas})
          </div>
          <div className="label">
            {usaRedefPorDescanso
              ? 'Escolha dentre as magias do seu Livro de Magias (passo anterior) — a troca da lista completa acontece só no Descanso Longo, não aqui.'
              : 'Regra oficial: a cada nível, você pode substituir 1 das magias que já tem preparada por outra da lista (de qualquer círculo pro qual você tenha espaço).'}
          </div>
        </div>
      )}

      {step === 'descobertasMagicas' && (
        <div className={styles.subHeader}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Descobertas Mágicas — escolha {MAX_DESCOBERTAS_MAGICAS} ({descobertasMagicasEscolhidas.length}/{MAX_DESCOBERTAS_MAGICAS})
          </div>
          <div className="label">
            Característica do Colégio do Conhecimento — magias de Clérigo, Druida ou Mago, SEMPRE preparadas (não
            contam na conta normal de Magias Preparadas). Pode substituir 1 por level-up.
          </div>
        </div>
      )}

      <div className={styles.body}>
        {step === 'pv' && (
          <>
            <div className="section-title">Como determinar os novos PV?</div>
            {hpRolado !== null ? (
              <div className="opt-card selected" style={{ cursor: 'default' }}>
                <div className="opt-card-name">🎲 Dado de vida rolado — resultado travado</div>
                <div className="opt-card-desc">
                  Rolou <b>{hpRolado}</b> em 1{personagem.dadoVida} + mod. CON ({personagem.conMod >= 0 ? '+' : ''}
                  {personagem.conMod})
                  {personagem.bonusPvPorNivel > 0 && ` + ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`} ={' '}
                  <b>+{hpRolado + personagem.conMod + personagem.bonusPvPorNivel} PV</b>. Não dá pra rolar de novo.
                </div>
              </div>
            ) : (
              <>
                <div className={`opt-card ${hpModo === 'media' ? 'selected' : ''}`} onClick={() => onHpModoChange('media')}>
                  <div className="opt-card-name">Usar a média fixa</div>
                  <div className="opt-card-desc">
                    {dadoVidaValor[personagem.dadoVida]} (média de {personagem.dadoVida}) + mod. CON ({personagem.conMod >= 0 ? '+' : ''}
                    {personagem.conMod})
                    {personagem.bonusPvPorNivel > 0 && ` + ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`} ={' '}
                    <b>+{media} PV</b>
                  </div>
                </div>
                <div className={`opt-card ${hpModo === 'rolar' ? 'selected' : ''}`} onClick={() => onHpModoChange('rolar')}>
                  <div className="opt-card-name">Rolar o dado de vida 🎲</div>
                  <div className="opt-card-desc">
                    Rola 1{personagem.dadoVida} + mod. CON ({personagem.conMod >= 0 ? '+' : ''}
                    {personagem.conMod})
                    {personagem.bonusPvPorNivel > 0 && ` + ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`} — ao
                    tocar em "Avançar" o dado rola e o resultado é definitivo, sem chance de rolar de novo.
                  </div>
                </div>
              </>
            )}
            <div className="summary-row" style={{ marginTop: 14 }}>
              <span>PV atuais</span>
              <span>{personagem.pvMax}</span>
            </div>
            <div className="summary-row">
              <span>PV após level up</span>
              <span>{pvGanho !== null ? personagem.pvMax + pvGanho : '—'}</span>
            </div>
          </>
        )}

        {step === 'features' && (
          <>
            <div className="section-title">Características desbloqueadas no nível {novoNivel}</div>
            {features.length === 0 && (
              <div className="label">Nenhuma característica nova nesse nível.</div>
            )}
            {features.map((f) => (
              <div key={f.nome} className="opt-card" style={{ cursor: 'default' }}>
                <div className="opt-card-name">{f.nome}</div>
                {f.descricao ? (
                  <div className="opt-card-desc">{f.descricao}</div>
                ) : f.nome === NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE ? (
                  <div className="opt-card-desc" style={{ color: 'var(--text-faint)' }}>
                    Depende da subclasse escolhida ({subclasseEscolhida ?? 'nenhuma'}) — essa subclasse ainda não tem
                    característica de nível {novoNivel} importada.
                  </div>
                ) : (
                  <div className="opt-card-desc" style={{ color: 'var(--text-faint)' }}>
                    Descrição detalhada ainda não importada pra esse nível/característica.
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {step === 'subclasse' && (
          <>
            <div className="section-title">Escolha sua subclasse</div>
            <div className="label" style={{ marginBottom: 8, color: 'var(--warn)' }}>
              [PH] Subclasses sem características mecânicas implementadas aparecem travadas — só dá pra escolher
              entre elas quando a Ficha souber aplicar as regras de verdade.
            </div>
            {subclassesDaClasse.length === 0 && (
              <div className="box" style={{ padding: 14, textAlign: 'center', color: 'var(--text-faint)', fontSize: 12 }}>
                ＋ subclasses de {classe.nome} ainda não foram importadas.
              </div>
            )}
            {subclassesDaClasse.map((s) => {
              const implementada = subclasseImplementada(s.nome);
              const temArte = temBannerProprio(s.id);
              return (
                <div
                  key={s.id}
                  className={`opt-card ${subclasseEscolhida === s.nome ? 'selected' : ''}`}
                  style={implementada ? undefined : { opacity: 0.5, pointerEvents: 'none' }}
                  onClick={() => setSubclasseEscolhida(s.nome)}
                >
                  <div className="opt-card-row">
                    <IconeClasse id={s.id} />
                    <div className="opt-card-info">
                      <div className="opt-card-name">{s.nome}</div>
                      {!implementada && <div className="opt-card-desc">Ainda não implementada</div>}
                      {!temArte && <div className="opt-card-desc">[PH] ícone ainda não desenhado</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {step === 'estiloDeLuta' && (
          <>
            <div className="section-title">Manter ou trocar seu Estilo de Luta</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Regra oficial: a cada nível de {classe.nome}, você pode substituir o Estilo de Luta escolhido por
              outro — não precisa manter o mesmo.
            </div>
            {estilosDeLuta.map((e) => (
              <div
                key={e.id}
                className={`opt-card ${estiloDeLutaEscolhido === e.nome ? 'selected' : ''}`}
                style={{ padding: '10px 12px' }}
                onClick={() => setEstiloDeLutaEscolhido(e.nome)}
              >
                <div className="opt-card-name">{e.nome}</div>
                <div className="opt-card-desc">{e.beneficios}</div>
              </div>
            ))}
          </>
        )}

        {step === 'truques' && (
          <>
            <div className="section-title">
              Truques — escolha {maxTruques} ({truquesEscolhidos.length}/{maxTruques})
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              {usaRedefPorDescanso
                ? 'Só cresce aqui — a troca de um truque que já conhece é só no Descanso Longo, não no Level Up.'
                : 'Regra oficial: a cada nível, você pode substituir 1 dos truques que já conhece por outro da lista — não precisa mexer se não quiser.'}
            </div>
            {agruparMagiasPorCirculo(truquesDaClasse).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const jaTinha = truquesAtuais.includes(m.nome);
                  const marcado = truquesEscolhidos.includes(m.nome);
                  const removendo = jaTinha && !marcado;
                  return (
                    <div
                      key={m.id}
                      className={`check-row ${jaTinha ? (removendo ? styles.truqueRemovendo : styles.truqueAtual) : ''}`}
                      onClick={() => toggleTruque(m.nome)}
                    >
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: removendo ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                          ({m.escola}
                          {removendo ? ' · 🔻 será removido' : jaTinha ? ' · já tinha' : ''})
                        </span>
                      </span>
                    </div>
                  );
                }}
              </GrupoMagiaColapsavel>
            ))}
            {trocasDeTruque > (usaRedefPorDescanso ? 0 : 1) && (
              <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
                ⚠️ {trocasDeTruque} truques trocados —{' '}
                {usaRedefPorDescanso ? 'a troca é só no Descanso Longo.' : 'só pode trocar 1 por level-up.'}
              </div>
            )}
          </>
        )}

        {step === 'livroDeMagias' && (
          <>
            {agruparMagiasPorCirculo(magiasPreparadasDaClasse).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const jaTinha = livroDeMagiasAtuais.includes(m.nome);
                  const marcado = livroDeMagiasEscolhido.includes(m.nome);
                  return (
                    <div
                      key={m.id}
                      className={`check-row ${jaTinha ? styles.truqueAtual : ''}`}
                      onClick={() => toggleLivroDeMagias(m.nome)}
                    >
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                          ({m.circulo}º círculo{jaTinha ? ' · já tinha' : ''})
                        </span>
                      </span>
                    </div>
                  );
                }}
              </GrupoMagiaColapsavel>
            ))}
          </>
        )}

        {step === 'invocacoes' && (
          <>
            <div className="section-title">
              Invocações Místicas — escolha {maxInvocacoes} ({invocacoesEscolhidas.length}/{maxInvocacoes})
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              Regra oficial: a cada nível, você pode substituir 1 das invocações que já conhece por outra da lista
              — não precisa mexer se não quiser. [PH] sem efeito mecânico ainda — só o texto de regra.
            </div>
            {invocacoesCatalogo.map((inv) => {
              const jaTinha = invocacoesMisticasAtuais.includes(inv.id);
              const marcado = invocacoesEscolhidas.includes(inv.id);
              const removendo = jaTinha && !marcado;
              const requerida = invocacaoRequeridaDe(inv);
              const bloqueadaPorRequisito = !marcado && invocacaoBloqueadaPorRequisitoAusente(inv, invocacoesEscolhidas);
              const travadaPorDependente = marcado && invocacoesQueDependemDe(inv.id, invocacoesEscolhidas).length > 0;
              return (
                <div
                  key={inv.id}
                  className={`check-row ${jaTinha ? (removendo ? styles.truqueRemovendo : styles.truqueAtual) : ''}`}
                  style={bloqueadaPorRequisito ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
                  onClick={() => toggleInvocacao(inv.id)}
                >
                  <div className={`check-box ${marcado ? 'checked' : ''}`} />
                  <div className="check-label" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div className="opt-card-name">
                      {inv.nome}
                      {removendo && <span style={{ color: 'var(--danger)', fontSize: 11 }}> · 🔻 será removida</span>}
                      {jaTinha && !removendo && (
                        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}> · já tinha</span>
                      )}
                    </div>
                    <div className="opt-card-desc">
                      <TextoComMagias texto={inv.beneficios} nomesMagias={inv.magiasMencionadas} />
                    </div>
                    {requerida && (
                      <div style={{ color: bloqueadaPorRequisito ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                        Requer: {requerida.nome}
                        {bloqueadaPorRequisito && ' — marque essa primeiro'}
                      </div>
                    )}
                    {travadaPorDependente && (
                      <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                        🔒 não pode remover — é requisito de outra invocação que você mantém
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {trocasDeInvocacao > 1 && (
              <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
                ⚠️ {trocasDeInvocacao} invocações trocadas — só pode trocar 1 por level-up.
              </div>
            )}
          </>
        )}

        {step === 'magiasPreparadas' && (
          <>
            {agruparMagiasPorCirculo(magiasPreparadasPool).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const jaTinha = magiasPreparadasAtuais.includes(m.nome);
                  const marcado = magiasPreparadasEscolhidas.includes(m.nome);
                  const removendo = jaTinha && !marcado;
                  const viaSegredosMagicos = !m.classes.includes(classe.nome);
                  return (
                    <div
                      key={m.id}
                      className={`check-row ${jaTinha ? (removendo ? styles.truqueRemovendo : styles.truqueAtual) : ''}`}
                      onClick={() => toggleMagiaPreparada(m.nome)}
                    >
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: removendo ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                          ({m.circulo}º círculo
                          {removendo ? ' · 🔻 será removida' : jaTinha ? ' · já tinha' : ''}
                          {viaSegredosMagicos ? ' · via Segredos Mágicos' : ''})
                        </span>
                      </span>
                    </div>
                  );
                }}
              </GrupoMagiaColapsavel>
            ))}
            {trocasDeMagia > (usaRedefPorDescanso ? 0 : 1) && (
              <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
                ⚠️ {trocasDeMagia} magias trocadas —{' '}
                {usaRedefPorDescanso ? 'a redefinição livre é só no Descanso Longo.' : 'só pode trocar 1 por level-up.'}
              </div>
            )}
          </>
        )}

        {step === 'descobertasMagicas' && (
          <>
            {agruparMagiasPorCirculo(descobertasMagicasCatalogo).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const jaTinha = magiasDescobertasMagicasAtuais.includes(m.nome);
                  const marcado = descobertasMagicasEscolhidas.includes(m.nome);
                  const removendo = jaTinha && !marcado;
                  return (
                    <div
                      key={m.id}
                      className={`check-row ${jaTinha ? (removendo ? styles.truqueRemovendo : styles.truqueAtual) : ''}`}
                      onClick={() => toggleDescobertaMagica(m.nome)}
                    >
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: removendo ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                          ({m.circulo === 0 ? m.escola : `${m.circulo}º círculo`}
                          {removendo ? ' · 🔻 será removida' : jaTinha ? ' · já tinha' : ''})
                        </span>
                      </span>
                    </div>
                  );
                }}
              </GrupoMagiaColapsavel>
            ))}
            {trocasDeDescobertaMagica > 1 && (
              <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
                ⚠️ {trocasDeDescobertaMagica} magias trocadas — só pode trocar 1 por level-up.
              </div>
            )}
          </>
        )}

        {step === 'proficienciasBonus' && (
          <>
            <div className="section-title">
              Proficiências Bônus — escolha 3 ({proficienciasBonusEscolhidas.length}/3)
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              Característica do Colégio do Conhecimento — proficiência em 3 perícias à sua escolha, entre as que
              você ainda não é proficiente.
            </div>
            {periciasNaoProficientes.map((nome) => {
              const marcada = proficienciasBonusEscolhidas.includes(nome);
              return (
                <div key={nome} className="check-row" onClick={() => toggleProficienciaBonus(nome)}>
                  <div className={`check-box ${marcada ? 'checked' : ''}`} />
                  <span className="check-label">{nome}</span>
                </div>
              );
            })}
          </>
        )}

        {step === 'especialista' && (
          <>
            <div className="section-title">
              Especialista — escolha {maxEspecialista - periciasEspecialistaAtuais.length} (
              {especialistaEscolhidas.length - periciasEspecialistaAtuais.length}/{maxEspecialista - periciasEspecialistaAtuais.length})
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              Dobra o Bônus de Proficiência nas perícias escolhidas — só dá pra escolher entre as que você já é
              proficiente.
            </div>
            {periciasEspecialistaAtuais.length > 0 && (
              <>
                <div className={styles.subHeader}>Selecionadas previamente</div>
                {periciasProficientesDoPersonagem
                  .filter((nome) => periciasEspecialistaAtuais.includes(nome))
                  .map((nome) => (
                    <div key={nome} className={`check-row ${styles.truqueAtual}`} style={{ cursor: 'default' }}>
                      <div className="check-box checked" />
                      <span className="check-label">{nome}</span>
                    </div>
                  ))}
                <div className={styles.subHeader}>Disponíveis</div>
              </>
            )}
            {periciasProficientesDoPersonagem
              .filter((nome) => !periciasEspecialistaAtuais.includes(nome))
              .map((nome) => {
                const marcada = especialistaEscolhidas.includes(nome);
                return (
                  <div key={nome} className="check-row" onClick={() => toggleEspecialista(nome)}>
                    <div className={`check-box ${marcada ? 'checked' : ''}`} />
                    <span className="check-label">{nome}</span>
                  </div>
                );
              })}
          </>
        )}

        {step === 'asi' && (
          <>
            <div className="section-title">Escolha um Talento</div>
            <TelaEscolherTalento
              nivelAtual={novoNivel}
              atributosFinais={atributosFinaisAtuais}
              talentosGeraisAtuais={talentosGeraisAtuais}
              favoritos={talentosFavoritosAtuais}
              onToggleFavorito={onToggleFavoritoTalento}
              selecionado={talentoEscolhido}
              onSelecionar={(id) => {
                if (id === talentoEscolhido) return;
                setTalentoEscolhido(id);
                const t = talentos.find((x) => x.id === id);
                if (t) aplicarAsiDoTalento(t);
              }}
            />
          </>
        )}

        {step === 'asiAtributo' && talentoObjEscolhido && (
          <>
            <div className="section-title">{talentoObjEscolhido.nome}</div>
            {talentoObjEscolhido.concedeAsi.tipo === 'distribuir-dois' && (
              <DistribuirPontosAtributo
                pontosTotal={PONTOS_ASI}
                escolhas={asiEscolhas}
                atributosBase={atributosAtuais}
                onIncrementar={incrementarAsi}
                onDecrementar={decrementarAsi}
              />
            )}
            {talentoObjEscolhido.concedeAsi.tipo === 'escolha-unica' && (
              <>
                <div className="label" style={{ marginBottom: 10 }}>
                  {talentoObjEscolhido.nome} dá +1 num desses atributos, à sua escolha.
                </div>
                {talentoObjEscolhido.concedeAsi.atributos.map((a) => {
                  const base = atributosAtuais[a] ?? 10;
                  const maximo = talentoObjEscolhido.concedeAsi.tipo !== 'nenhum' ? talentoObjEscolhido.concedeAsi.maximo : 20;
                  return (
                    <div key={a} className={`opt-card ${asiEscolhas[0] === a ? 'selected' : ''}`} onClick={() => setAsiEscolhas([a])}>
                      <div className="opt-card-name">
                        {a} {base} → {Math.min(base + 1, maximo)}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {step === 'talentoMagia' && talentoMagiaAlvo && (
          <>
            <div className="section-title">
              {talentoMagiaAlvo.nome}
              {precisaCrescerMagiaRitual ? ' — Bônus de Proficiência aumentou' : ''} — escolha {maxMagiasTalento} (
              {magiasEscolhidasTalento.length}/{maxMagiasTalento})
            </div>
            <div className="label" style={{ marginBottom: 10 }}>
              {precisaCrescerMagiaRitual
                ? `Seu Bônus de Proficiência subiu — pode escolher mais ${maxMagiasRituaisAgora - magiasRituaisJaEscolhidas.length} magia(s) de 1º círculo com Ritual às sempre preparadas.`
                : talentoMagiaAlvo.beneficios}
            </div>
            {opcoesMagiaTalento.map((m) => {
              const jaEraEscolhida = precisaCrescerMagiaRitual && magiasRituaisJaEscolhidas.includes(m.nome);
              const selecionada = magiasEscolhidasTalento.includes(m.nome);
              const cheioSemSelecionar = !selecionada && magiasEscolhidasTalento.length >= maxMagiasTalento;
              return (
                <div
                  key={m.id}
                  className={`opt-card ${selecionada ? 'selected' : ''}`}
                  style={{
                    padding: '10px 12px',
                    cursor: jaEraEscolhida || cheioSemSelecionar ? 'default' : 'pointer',
                    opacity: cheioSemSelecionar && !jaEraEscolhida ? 0.5 : 1,
                  }}
                  onClick={() => {
                    if (jaEraEscolhida) return;
                    if (selecionada) {
                      setMagiasEscolhidasTalento((prev) => prev.filter((n) => n !== m.nome));
                    } else if (!cheioSemSelecionar) {
                      setMagiasEscolhidasTalento((prev) => [...prev, m.nome]);
                    }
                  }}
                >
                  <div className="opt-card-name">
                    {m.nome}
                    {jaEraEscolhida ? ' (já escolhida)' : ''}
                  </div>
                  <div className="opt-card-desc">{m.descricaoCurta ?? m.descricaoCompleta}</div>
                </div>
              );
            })}
          </>
        )}

        {step === 'periciaLivreTalento' && (
          <>
            <div className="section-title">Especialista em Perícia — perícia livre</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Proficiência em 1 perícia à sua escolha, entre as que você ainda não é proficiente.
            </div>
            {periciasNaoProficientes.map((nome) => (
              <div
                key={nome}
                className={`opt-card ${periciaLivreEscolhida === nome ? 'selected' : ''}`}
                onClick={() => setPericiaLivreEscolhida(nome)}
              >
                <div className="opt-card-name">{nome}</div>
              </div>
            ))}
          </>
        )}

        {step === 'periciaRestritaTalento' && talentoObjEscolhido && (
          <>
            <div className="section-title">{talentoObjEscolhido.nome} — escolha 1 perícia</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Vira proficiência se você ainda não for proficiente nela, ou Especialização (dobra o Bônus de
              Proficiência) se já for.
            </div>
            {opcoesPericiaRestritaAtual.map((nome) => {
              const jaProficiente = periciasProficientesDoPersonagem.includes(nome);
              return (
                <div
                  key={nome}
                  className={`opt-card ${periciaRestritaEscolhida === nome ? 'selected' : ''}`}
                  onClick={() => setPericiaRestritaEscolhida(nome)}
                >
                  <div className="opt-card-name">{nome}</div>
                  <div className="opt-card-desc">{jaProficiente ? 'Já proficiente → vira Especialização' : 'Vira proficiência'}</div>
                </div>
              );
            })}
          </>
        )}

        {step === 'dadivaEpica' && (
          <>
            <div className="section-title">Dádiva Épica</div>
            {dadivaEpica?.descricao && <div className="label" style={{ marginBottom: 10 }}>{dadivaEpica.descricao}</div>}
            <TelaEscolherTalento
              categoria="Dádiva Épica"
              nivelAtual={novoNivel}
              atributosFinais={atributosFinaisAtuais}
              talentosGeraisAtuais={talentosGeraisAtuais}
              favoritos={talentosFavoritosAtuais}
              onToggleFavorito={onToggleFavoritoTalento}
              selecionado={dadivaEpicaEscolhida}
              onSelecionar={(id) => {
                if (id === dadivaEpicaEscolhida) return;
                setDadivaEpicaEscolhida(id);
              }}
            />
          </>
        )}

        {step === 'arcanaMistica' && (
          <>
            {novoCirculoArcanaMistica !== null && (
              <>
                <div className="section-title">Arcana Mística — {novoCirculoArcanaMistica}º círculo</div>
                {arcanaMisticaFeature?.descricao && (
                  <div className="label" style={{ marginBottom: 10 }}>
                    {arcanaMisticaFeature.descricao}
                  </div>
                )}
                {opcoesArcanaMistica.map((m) => (
                  <div
                    key={m.id}
                    className={`opt-card ${arcanaMisticaEscolhidas[novoCirculoArcanaMistica] === m.nome ? 'selected' : ''}`}
                    style={{ padding: '10px 12px', cursor: 'pointer' }}
                    onClick={() =>
                      setArcanaMisticaEscolhidas((prev) => ({ ...prev, [novoCirculoArcanaMistica]: m.nome }))
                    }
                  >
                    <div className="opt-card-name">{m.nome}</div>
                    <div className="opt-card-desc">{m.descricaoCurta ?? m.descricaoCompleta}</div>
                  </div>
                ))}
              </>
            )}

            {Object.keys(arcanaMisticaAtuais).length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: novoCirculoArcanaMistica !== null ? 14 : 0 }}>
                  Trocar um arcanum já conhecido
                </div>
                <div className="label" style={{ marginBottom: 8 }}>
                  Opcional — no máximo 1 troca por level-up, mesmo se você já escolheu um círculo novo acima.
                </div>
                {Object.keys(arcanaMisticaAtuais)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map((circulo) => {
                    const atual = arcanaMisticaEscolhidas[circulo] ?? arcanaMisticaAtuais[circulo];
                    const trocado = atual !== arcanaMisticaAtuais[circulo];
                    const magiaAtual = magiasBruxo.find((m) => m.nome === atual);
                    return (
                      <div key={circulo} className="opt-card" style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div className="opt-card-name">
                            {circulo}º círculo —
                            <br />
                            {magiaAtual ? <MagiaComDescricao magia={magiaAtual} /> : atual}
                            {trocado && <span style={{ color: 'var(--danger)', fontSize: 11 }}> · trocado</span>}
                          </div>
                          <TrocarValorSimples
                            titulo={`Trocar arcanum do ${circulo}º círculo`}
                            valorAtual={atual}
                            opcoes={opcoesTrocaArcana(circulo)}
                            onTrocar={(nova) => setArcanaMisticaEscolhidas((prev) => ({ ...prev, [circulo]: nova }))}
                            renderOpcao={(nome) => {
                              const m = magiasBruxo.find((mm) => mm.nome === nome);
                              return m ? <MagiaComDescricao magia={m} /> : nome;
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                {trocasArcanaMistica(arcanaMisticaAtuais, arcanaMisticaEscolhidas) > 1 && (
                  <div className="label" style={{ color: 'var(--danger)', marginTop: 6 }}>
                    ⚠️ mais de 1 arcanum trocado — só pode trocar 1 por level-up.
                  </div>
                )}
              </>
            )}
          </>
        )}

        {step === 'iniciadoEmMagia' && (
          <>
            <div className="section-title">Iniciado em Magia — Substituição de Magia</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Opcional — a cada level-up pode trocar a magia de 1º círculo por outra da mesma lista. Os truques não
              são trocáveis.
            </div>
            {[
              { rotulo: 'Iniciado em Magia (Origem)', atual: magiaIniciadaOrigemAtual, escolhida: magiaIniciadaOrigemEscolhida, onTrocar: setMagiaIniciadaOrigemEscolhida },
              { rotulo: 'Iniciado em Magia (Versátil)', atual: magiaIniciadaEspecieAtual, escolhida: magiaIniciadaEspecieEscolhida, onTrocar: setMagiaIniciadaEspecieEscolhida },
            ]
              .filter((slot): slot is typeof slot & { atual: { lista: string; magia: string } } => slot.atual !== null)
              .map((slot) => {
                const trocado = slot.escolhida !== slot.atual.magia;
                const magiaAtualObj = magiasDaClasse(slot.atual.lista, 1).find((m) => m.nome === slot.escolhida);
                return (
                  <div key={slot.rotulo} className="opt-card" style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <div className="opt-card-name">
                        {slot.rotulo} ({slot.atual.lista}) —
                        <br />
                        {magiaAtualObj ? <MagiaComDescricao magia={magiaAtualObj} /> : slot.escolhida}
                        {trocado && <span style={{ color: 'var(--danger)', fontSize: 11 }}> · trocado</span>}
                      </div>
                      <TrocarValorSimples
                        titulo={`Trocar magia de ${slot.rotulo}`}
                        valorAtual={slot.escolhida ?? ''}
                        opcoes={magiasDaClasse(slot.atual.lista, 1).map((m) => m.nome)}
                        onTrocar={slot.onTrocar}
                        renderOpcao={(nome) => {
                          const m = magiasDaClasse(slot.atual!.lista, 1).find((mm) => mm.nome === nome);
                          return m ? <MagiaComDescricao magia={m} /> : nome;
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {step === 'resumo' && (
          <>
            <div className="section-title">Resumo do Level Up</div>
            <div className="summary-row">
              <span>Novo nível</span>
              <span>{novoNivel}</span>
            </div>
            <div className="summary-row">
              <span>PV ganhos</span>
              <span>+{pvGanho ?? '—'}</span>
            </div>
            <div className="summary-row">
              <span>Novo PV máximo</span>
              <span>{pvGanho !== null ? personagem.pvMax + pvGanho : '—'}</span>
            </div>
            {subclasseEscolhida && (
              <div className="summary-row">
                <span>Subclasse</span>
                <span>{subclasseEscolhida}</span>
              </div>
            )}
            {luSteps.includes('estiloDeLuta') && (
              <div className="summary-row">
                <span>Estilo de Luta</span>
                <span>{estiloDeLutaEscolhido ?? 'nenhum escolhido'}</span>
              </div>
            )}
            {luSteps.includes('truques') && (
              <div className="summary-row">
                <span>Truques</span>
                <span>
                  {usaRedefPorDescanso
                    ? truquesEscolhidos.length > truquesAtuais.length
                      ? `+${truquesEscolhidos.length - truquesAtuais.length} novo(s)`
                      : 'sem alteração'
                    : trocasDeTruque > 0
                      ? `${trocasDeTruque} trocado(s)`
                      : 'sem troca'}
                </span>
              </div>
            )}
            {luSteps.includes('livroDeMagias') && (
              <div className="summary-row">
                <span>Livro de Magias</span>
                <span>
                  {livroDeMagiasEscolhido.length > livroDeMagiasAtuais.length
                    ? `+${livroDeMagiasEscolhido.length - livroDeMagiasAtuais.length} nova(s)`
                    : 'sem alteração'}
                </span>
              </div>
            )}
            {luSteps.includes('magiasPreparadas') && (
              <div className="summary-row">
                <span>Magias Preparadas</span>
                <span>
                  {usaRedefPorDescanso
                    ? magiasPreparadasEscolhidas.length > magiasPreparadasAtuais.length
                      ? `+${magiasPreparadasEscolhidas.length - magiasPreparadasAtuais.length} nova(s)`
                      : 'sem alteração'
                    : trocasDeMagia > 0
                      ? `${trocasDeMagia} trocada(s)`
                      : 'sem troca'}
                </span>
              </div>
            )}
            {luSteps.includes('invocacoes') && (
              <div className="summary-row">
                <span>Invocações Místicas</span>
                <span>{trocasDeInvocacao > 0 ? `${trocasDeInvocacao} trocada(s)` : 'sem troca'}</span>
              </div>
            )}
            {luSteps.includes('descobertasMagicas') && (
              <div className="summary-row">
                <span>Descobertas Mágicas</span>
                <span>{trocasDeDescobertaMagica > 0 ? `${trocasDeDescobertaMagica} trocada(s)` : 'sem troca'}</span>
              </div>
            )}
            {luSteps.includes('especialista') && (
              <div className="summary-row">
                <span>Especialista</span>
                <span>{especialistaEscolhidas.slice(periciasEspecialistaAtuais.length).join(', ') || 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('proficienciasBonus') && (
              <div className="summary-row">
                <span>Proficiências Bônus</span>
                <span>{proficienciasBonusEscolhidas.join(', ') || 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('arcanaMistica') && (
              <div className="summary-row">
                <span>Arcana Mística</span>
                <span>
                  {Object.keys(arcanaMisticaAlteracoesPendentes).length > 0
                    ? `${Object.keys(arcanaMisticaAlteracoesPendentes).length} círculo(s) alterado(s)`
                    : 'sem troca'}
                </span>
              </div>
            )}
            {luSteps.includes('iniciadoEmMagia') && (
              <div className="summary-row">
                <span>Iniciado em Magia</span>
                <span>
                  {magiaIniciadaAlteracoesPendentes.origem || magiaIniciadaAlteracoesPendentes.especie
                    ? 'magia trocada'
                    : 'sem troca'}
                </span>
              </div>
            )}
            {luSteps.includes('talentoMagia') && (
              <div className="summary-row">
                <span>{maxMagiasTalento > 1 ? 'Magias do Talento' : 'Magia do Talento'}</span>
                <span>{magiasEscolhidasTalento.length > 0 ? magiasEscolhidasTalento.join(', ') : 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('periciaLivreTalento') && (
              <div className="summary-row">
                <span>Perícia livre (talento)</span>
                <span>{periciaLivreEscolhida ?? 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('periciaRestritaTalento') && (
              <div className="summary-row">
                <span>Perícia do talento</span>
                <span>{periciaRestritaEscolhida ?? 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('asi') && (
              <div className="summary-row">
                <span>Talento</span>
                <span>{talentoObjEscolhido?.nome ?? 'nenhum escolhido'}</span>
              </div>
            )}
            {luSteps.includes('asi') && asiEscolhas.length > 0 && (
              <div className="summary-row">
                <span>Atributo do talento</span>
                <span>
                  {NOMES_ATRIBUTOS.filter((a) => pontosNoAtributo(a as Atributo) > 0)
                    .map((a) => `${a} +${pontosNoAtributo(a as Atributo)}`)
                    .join(', ')}
                </span>
              </div>
            )}
            <div className="label" style={{ marginTop: 10 }}>
              Confirmar aplica as mudanças na ficha e marca a ficha como "com XP" — a edição livre de valores base
              trava a partir daí.
            </div>
          </>
        )}
      </div>

      {aviso && <div className={styles.warning}>{aviso}</div>}

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={voltar}>
          ← Voltar
        </div>
        <div className={`btn btn-primary ${styles.pill}`} onClick={avancar}>
          {step === 'resumo' ? 'Confirmar ✓' : 'Avançar →'}
        </div>
      </div>
    </div>
  );
}
