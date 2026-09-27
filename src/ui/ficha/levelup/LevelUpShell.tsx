import { useState } from 'react';
import { artePorLados } from '../../roll/dadosArte';
import { dadoVidaValor } from '../../../data/levelUpFixtures';
import type { Atributo } from '../../../data/wizardFixtures';
import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import type { WizardSelection } from '../../../core/personagem';
import { magiasDaClasse, type Magia } from '../../../data/rulesets/dnd2024/magias';
import { subclasses } from '../../../data/rulesets/dnd2024/subclasses';
import { estilosDeLuta } from '../../../data/rulesets/dnd2024/estilosDeLuta';
import { ID_CARACTERISTICA_SUBCLASSE } from '../../../data/rulesets/dnd2024/idsCaracteristicasSubclasse';
import { ID_CARACTERISTICA_CLASSE } from '../../../data/rulesets/dnd2024/idsCaracteristicasClasse';
import { proficienciasIniciaisClasse } from '../../../data/rulesets/dnd2024/classesProficienciasIniciais';
import {
  caracteristicasDoNivel,
  caracteristicasDoNivelComSubclasse,
  NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE,
  niveisComASI,
  niveisComDadivaEpica,
  niveisComEspecialista,
  temEstiloDeLutaTrocavel,
  subclasseImplementada,
  caracteristicaDesbloqueada,
  caracteristicaSubclasseDesbloqueada,
  NOMES_ESPECIALISTA,
} from '../../../core/levelUp';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { valorRecursoClasse } from '../../../core/recursosClasse';
import {
  agruparMagiasPorCirculo,
  espacosDeMagiaAtivos,
  usaRedefinicaoPorDescanso,
} from '../../../core/magiasPersonagem';
import {
  invocacoesElegiveisAteNivel,
  invocacaoRequeridaDe,
  invocacaoBloqueadaPorRequisitoAusente,
  invocacoesQueDependemDe,
  INVOCACOES_COM_VINCULO_TRUQUE,
  truquesElegiveisParaVinculo,
} from '../../../core/invocacoesMisticas';
import { circulosArcanaMisticaDesbloqueados, magiasElegiveisArcanaMistica, trocasArcanaMistica } from '../../../core/arcanaMistica';
import { magiasPeritoNecromanciaNesteNivel, catalogoPeritoNecromancia } from '../../../core/necromante';
import { magiasVersadoEmEvocacaoNesteNivel, catalogoVersadoEmEvocacao } from '../../../core/evocador';
import { magiasElegiveisMaestria } from '../../../core/maestriaDeMagias';
import { magiasElegiveisAssinatura } from '../../../core/assinaturaMagica';
import { iconesMagia } from '../../../core/classificarMagia';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TextoComMagias from '../../components/TextoComMagias';
import GrupoMagiaColapsavel from '../../components/GrupoMagiaColapsavel';
import IconeClasse, { temBannerProprio } from '../../components/IconeClasse';
import BadgeHomebrew from '../../components/BadgeHomebrew';
import DistribuirPontosAtributo from '../../components/DistribuirPontosAtributo';
import { useAvisoTemporario } from '../../hooks/useAvisoTemporario';
import { talentos } from '../../../data/rulesets/dnd2024/talentos';
import { opcoesMagiaEscolhidaPorEscola, opcoesMagiasRituais, quantidadeMagiasRituais } from '../../../core/magiaTalentoGeral';
import { opcoesPericiaRestrita } from '../../../core/periciaTalentoGeral';
import { opcoesAtributoResiliente } from '../../../core/talentoAtributo';
import { armasElegiveisParaMaestriaExtra, armasParaMaestria, quantidadeMaestriaEmArma } from '../../../core/maestriaArma';
import TelaEscolherTalento from './TelaEscolherTalento';
import TrocarValorSimples from '../../components/TrocarValorSimples';
import { useEscolhaMultipla } from '../hooks/useEscolhaMultipla';
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
    /** Mapa COMPLETO (antigos + recém-vinculados), mesmo padrão de
     * `truquesEscolhidos`/`invocacoesMisticasEscolhidas` — nunca perde
     * um vínculo já existente, só cresce. `null` = nenhuma vinculação
     * pendente nesse level-up (passo não entrou na sequência). */
    invocacoesTruqueVinculadoEscolhido: Record<string, string> | null;
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
     * for Resiliente (`atributo-e-salvaguarda-escolhidos`) — 1 entrada
     * `{ [talentoId]: atributoEscolhido }`. `null` = nenhuma escolha
     * desse tipo nesse level-up. */
    escolhaAtributoTalentoGeral: Record<string, string> | null;
    /** Só preenchido quando o Talento Geral ESCOLHIDO NESTE level-up
     * for Mestre das Armas (`slot-maestria-extra`) — nome da arma
     * escolhida pro slot extra de Maestria. `null` = talento não
     * escolhido nesse level-up. */
    maestriaArmaTalentoEscolhida: string | null;
    /** Lista COMPLETA (antigas + novas) de Maestria em Arma NATIVA da
     * classe (Guerreiro/Bárbaro) — cresce sozinha nos níveis certos
     * (4/10/16 pro Guerreiro), mesmo padrão de `truquesEscolhidos`.
     * `null` = classe sem esse recurso, ou nenhuma vaga nova nesse
     * level-up (passo não entrou na sequência). */
    maestriaArmaEscolhida: string[] | null;
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
    /** Conhecimento Primordial (Bárbaro, nível 3) — perícia extra
     * escolhida NESTE level-up. `null` = passo não apareceu (já tinha
     * sido escolhida antes, ou personagem não é Bárbaro nível 3+). */
    conhecimentoPrimordialPericiaEscolhida: string | null;
    /** Acadêmico (Mago, nível 2) — perícia escolhida NESTE level-up.
     * `null` = passo não apareceu (já tinha sido escolhida antes, ou
     * personagem não é Mago nível 2+). */
    academicoPericiaEscolhida: string | null;
    /** Maestria de Magias (Mago, nível 18) — `{1: nomeMagia, 2: nomeMagia}`
     * escolhidas NESTE level-up. `null` = passo não apareceu (já tinha
     * sido escolhida antes, ou personagem não é Mago nível 18+). */
    maestriaDeMagiasEscolhida: Record<number, string> | null;
    /** Assinatura Mágica (Mago, nível 20) — as 2 magias de 3º círculo
     * escolhidas NESTE level-up. `null` = passo não apareceu (já tinha
     * sido escolhida antes, ou personagem não é Mago nível 20+). */
    assinaturaMagicaEscolhida: string[] | null;
  }) => void;
  /** Controlado pelo `FichaShell` (persistido junto com o resto do
   * progresso) em vez de estado local — uma vez rolado o dado de
   * vida, fechar o Level Up (ou dar F5) não pode apagar o resultado e
   * abrir margem pra rolar de novo. Ver DECISOES-DESIGN.md. */
  hpModo: 'media' | 'rolar' | 'manual' | null;
  onHpModoChange: (modo: 'media' | 'rolar' | 'manual' | null) => void;
  hpRolado: number | null;
  onHpRoladoChange: (valor: number | null) => void;
  /** Truques que o personagem já tem (pré-marcados na tela de escolha
   * — Etapa 4.1). */
  truquesAtuais: string[];
  /** Maestria em Arma NATIVA (Guerreiro/Bárbaro) que o personagem já
   * tem — pré-marcadas na tela que aparece só quando o total de vagas
   * cresce (níveis 4/10/16 pro Guerreiro). Ver `core/maestriaArma.ts`
   * (`quantidadeMaestriaEmArma`). */
  maestriaArmaAtual: string[];
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
  /** Truque já vinculado a cada Invocação Mística que exige essa
   * escolha (Explosão Agonizante/Repulsiva) — chave = id da invocação,
   * valor = NOME do truque. Ausente/sem a chave = ainda não vinculado
   * — dispara o passo `vinculoTruqueInvocacao` de novo, mesmo que a
   * invocação já estivesse marcada de um level-up anterior (ver
   * `core/invocacoesMisticas.ts`). */
  invocacoesTruqueVinculadoAtuais: Record<string, string>;
  /** Arcana Mística (Bruxo, níveis 11/13/15/17) — círculo → nome da
   * magia já escolhida pra ele. Só a escolha inicial é feita aqui
   * (trocar depois fica pra outra entrega, ver PENDENCIAS.md). */
  arcanaMisticaAtuais: Record<number, string>;
  /** Maestria de Magias (Mago, nível 18) — `{1: nomeMagia, 2: nomeMagia}`,
   * `{}` = ainda não escolhida. Só a escolha inicial é feita aqui —
   * trocar no Descanso Longo fica pra Entrega 6b (ver SDD do Mago). */
  maestriaDeMagiasAtuais: Record<number, string>;
  /** Assinatura Mágica (Mago, nível 20) — as 2 magias já escolhidas,
   * `[]` = ainda não escolhida. Escolha permanente, sem troca depois. */
  assinaturaMagicaAtuais: string[];
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
  /** Conhecimento Primordial (Bárbaro, nível 3) — perícia extra já
   * escolhida (permanente, `null` = ainda não escolhida — o passo
   * aparece de novo até o jogador escolher). */
  conhecimentoPrimordialPericiaAtual: string | null;
  /** Acadêmico (Mago, nível 2) — perícia já escolhida (permanente,
   * `null` = ainda não escolhida — o passo aparece de novo até o
   * jogador escolher). */
  academicoPericiaAtual: string | null;
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
  | 'conhecimentoPrimordial'
  | 'academico'
  | 'estiloDeLuta'
  | 'truques'
  | 'livroDeMagias'
  | 'peritoNecromancia'
  | 'versadoEmEvocacao'
  | 'magiasPreparadas'
  | 'invocacoes'
  | 'vinculoTruqueInvocacao'
  | 'descobertasMagicas'
  | 'especialista'
  | 'asi'
  | 'asiAtributo'
  | 'talentoMagia'
  | 'periciaLivreTalento'
  | 'periciaRestritaTalento'
  | 'resilienteAtributo'
  | 'maestriaArmaTalento'
  | 'maestriaArmaCrescimento'
  | 'dadivaEpica'
  | 'arcanaMistica'
  | 'iniciadoEmMagia'
  | 'maestriaDeMagias'
  | 'assinaturaMagica'
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
  maestriaArmaAtual,
  magiasPreparadasAtuais,
  livroDeMagiasAtuais,
  magiasDaClasseDisponiveis,
  invocacoesMisticasAtuais,
  invocacoesTruqueVinculadoAtuais,
  arcanaMisticaAtuais,
  maestriaDeMagiasAtuais,
  assinaturaMagicaAtuais,
  magiaIniciadaOrigemAtual,
  magiaIniciadaEspecieAtual,
  periciasEspecialistaAtuais,
  periciasProficientesDoPersonagem,
  periciasSubclasseBonusAtuais,
  conhecimentoPrimordialPericiaAtual,
  academicoPericiaAtual,
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
  const maxMaestriaArma = quantidadeMaestriaEmArma(classe, novoNivel);
  const armasParaMaestriaAtual = armasParaMaestria(classe);
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

  // Guia do Level Up (CLAUDE.md §12.1, pedido do Osmar depois do bug do
  // Acadêmico): "Novas Características" mostra o delta real de cada
  // recurso que muda neste nível, não só o texto solto das
  // características passivas — compara o valor no nível ANTERIOR
  // (`personagem.nivel`) contra o novo, já calculado acima.
  const deltasDoNivel: { label: string; texto: string }[] = [];
  const maxTruquesAntes = valorRecursoClasse(classe, 'Truques Conhecidos', personagem.nivel);
  if (maxTruques !== maxTruquesAntes) deltasDoNivel.push({ label: 'Truques', texto: `${maxTruquesAntes} → ${maxTruques}` });
  const maxMagiasPreparadasAntes = valorRecursoClasse(classe, 'Magias Preparadas', personagem.nivel);
  if (maxMagiasPreparadas !== maxMagiasPreparadasAntes) {
    deltasDoNivel.push({ label: 'Magias Preparadas', texto: `${maxMagiasPreparadasAntes} → ${maxMagiasPreparadas}` });
  }
  const maxLivroDeMagiasAntes = valorRecursoClasse(classe, 'Livro de Magias', personagem.nivel);
  if (maxLivroDeMagias !== maxLivroDeMagiasAntes) {
    deltasDoNivel.push({ label: 'Livro de Magias', texto: `${maxLivroDeMagiasAntes} → ${maxLivroDeMagias}` });
  }
  const espacosAntesDoNivel = espacosDeMagiaAtivos(classe, personagem.nivel);
  const espacosDepoisDoNivel = espacosDeMagiaAtivos(classe, novoNivel);
  const circulosComEspaco = [
    ...new Set([...espacosAntesDoNivel.map((e) => e.circulo), ...espacosDepoisDoNivel.map((e) => e.circulo)]),
  ].sort((a, b) => a - b);
  for (const c of circulosComEspaco) {
    const antes = espacosAntesDoNivel.find((e) => e.circulo === c)?.maximo ?? 0;
    const depois = espacosDepoisDoNivel.find((e) => e.circulo === c)?.maximo ?? 0;
    if (antes !== depois) deltasDoNivel.push({ label: `Espaços de Magia (${c}º Círculo)`, texto: `${antes} → ${depois}` });
  }
  const magiasPreparadasDaClasse = magiasDaClasseDisponiveis.filter((m) => m.circulo <= circuloMaximoNovoNivel);
  const descobertasMagicasCatalogo = poolDescobertasMagicas.filter(
    (m) => m.circulo === 0 || m.circulo <= circuloMaximoNovoNivel,
  );
  // Descobertas Mágicas: sempre 2 (número fixo da própria
  // característica, não escala com nível — diferente de Truques/Magias
  // Preparadas), trocável 1 por level-up, mesmo padrão de Truques.
  const MAX_DESCOBERTAS_MAGICAS = 2;
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

  // Mesmo motivo do comentário acima — precisa vir antes da montagem
  // de `luSteps`, já que o passo `vinculoTruqueInvocacao` só entra na
  // sequência quando o jogador ACABOU de marcar Explosão Agonizante/
  // Repulsiva NESTA MESMA tela de Invocações (`invocacoesEscolhidas`),
  // não só quando já tinha de antes. Por isso este hook é declarado
  // aqui, fora da posição "natural" dele lá embaixo com os outros
  // `useEscolhaMultipla` (linha ~500+).
  const {
    escolhidos: invocacoesEscolhidas,
    toggle: toggleInvocacao,
    trocas: trocasDeInvocacao,
  } = useEscolhaMultipla(invocacoesMisticasAtuais, maxInvocacoes, {
    // Não deixa remover uma invocação que ainda serve de requisito pra
    // outra que continua marcada (regra real: precisa desmontar a
    // cadeia de trás pra frente, 1 troca por level-up).
    podeRemover: (id, escolhidos) => invocacoesQueDependemDe(id, escolhidos).length === 0,
    podeAdicionar: (id, escolhidos) => {
      const inv = invocacoesCatalogo.find((c) => c.id === id);
      return !inv || !invocacaoBloqueadaPorRequisitoAusente(inv, escolhidos);
    },
  });
  // Truque vinculado a cada Invocação Mística que exige essa escolha
  // (Explosão Agonizante/Repulsiva) — seedado do que já existe salvo;
  // a tela `vinculoTruqueInvocacao` só marca/substitui a(s) chave(s)
  // pendente(s) (nunca perde o vínculo de uma invocação que não mudou
  // nada neste level-up).
  const [vinculoTruqueEscolhido, setVinculoTruqueEscolhido] = useState<Record<string, string>>(
    invocacoesTruqueVinculadoAtuais,
  );
  // Precisa vinculação: marcada (agora ou antes) e AINDA sem truque —
  // dispara o passo mesmo quando a invocação não mudou neste level-up
  // (retroativo, pra personagem que já tinha ela de antes desta
  // funcionalidade existir). IMPORTANTE: filtra contra
  // `invocacoesTruqueVinculadoAtuais` (prop, nunca muda durante ESTE
  // level-up), NUNCA contra `vinculoTruqueEscolhido` (state ao vivo) —
  // senão, escolher o truque NA PRÓPRIA tela já encolhe `luSteps`
  // (esse passo desaparece da lista) no mesmo render, empurrando
  // `luIndex` pro passo seguinte sozinho, ANTES do jogador confirmar,
  // e a escolha se perde (nunca chega no payload de `onConfirmar`).
  const invocacoesQuePrecisamVinculo = INVOCACOES_COM_VINCULO_TRUQUE.filter(
    (id) => (invocacoesEscolhidas.includes(id) || invocacoesMisticasAtuais.includes(id)) && !invocacoesTruqueVinculadoAtuais[id],
  );

  // Perito em Necromancia (Necromante, homebrew — ver core/necromante.ts):
  // quantas magias de Necromancia bônus ESTE level-up concede (2 ao
  // escolher a subclasse no nível 3, +1 por círculo novo depois disso).
  const magiasPeritoNecromanciaBonusNesteNivel =
    subclasseEscolhida === 'Necromante' ? magiasPeritoNecromanciaNesteNivel(classe, personagem.nivel, novoNivel) : 0;

  // Versado em Evocação (Mago/Evocador, nível 3, regra oficial — ver
  // core/evocador.ts): quantas magias de Evocação bônus ESTE level-up
  // concede (2 ao escolher a subclasse no nível 3, +1 por círculo novo
  // depois disso). Mesmo formato de Perito em Necromancia acima.
  const magiasVersadoEmEvocacaoBonusNesteNivel =
    subclasseEscolhida === 'Evocador' ? magiasVersadoEmEvocacaoNesteNivel(classe, personagem.nivel, novoNivel) : 0;

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
  /** Talento escolhido concede ASI (qualquer `concedeAsi.tipo` que não
   * seja `'nenhum'`) — sempre passa pelo passo extra `'asiAtributo'`,
   * mesmo quando só há 1 atributo possível (`escolha-unica` com 1 só):
   * a opção já vem pré-selecionada por `aplicarAsiDoTalento`, mas a
   * tela mostra o "valor atual → valor novo" antes de confirmar, em
   * vez de aplicar em silêncio. Ver DECISOES-DESIGN.md. */
  const precisaEscolherAtributoDoTalento =
    talentoObjEscolhido !== null && talentoObjEscolhido.concedeAsi.tipo !== 'nenhum';
  // Talento Geral com magia(s) ESCOLHIDA(S) — por escola restrita
  // (Tocado pela Sombra/Fadas, 1 magia) ou Rituais (Conjurador
  // Ritualista, N = Bônus de Proficiência) — passo extra só entra
  // quando o talento ESCOLHIDO NESTE level-up pede essa sub-escolha
  // (mesmo padrão de `precisaEscolherAtributoDoTalento`, não retroage
  // sobre talentos já escolhidos em level-ups anteriores).
  const tipoEfeitoTalentoEscolhido = talentoObjEscolhido?.efeitoMecanico?.tipo;
  const precisaEscolherMagiaDoTalentoNovo =
    tipoEfeitoTalentoEscolhido === 'magia-escolhida-por-escola' || tipoEfeitoTalentoEscolhido === 'magias-rituais-por-proficiencia';
  // Resiliente (`atributo-e-salvaguarda-escolhidos`) — mesmo padrão de
  // `precisaEscolherAtributoDoTalento`/`precisaEscolherMagiaDoTalentoNovo`,
  // só entra quando o talento ESCOLHIDO NESTE level-up for esse.
  const precisaEscolherAtributoResiliente = tipoEfeitoTalentoEscolhido === 'atributo-e-salvaguarda-escolhidos';
  const opcoesAtributoResilienteAtual = talentoObjEscolhido ? opcoesAtributoResiliente(talentoObjEscolhido.id, classe) : [];
  const [atributoResilienteEscolhido, setAtributoResilienteEscolhido] = useState<Atributo | null>(null);
  // Mestre das Armas (`slot-maestria-extra`) — mesmo padrão de
  // `precisaEscolherAtributoResiliente`, só entra quando o talento
  // ESCOLHIDO NESTE level-up for esse.
  const precisaEscolherMaestriaArmaTalento = tipoEfeitoTalentoEscolhido === 'slot-maestria-extra';
  const opcoesMaestriaArmaTalentoAtual = precisaEscolherMaestriaArmaTalento
    ? armasElegiveisParaMaestriaExtra(classe, talentosGeraisAtuais)
    : [];
  const [maestriaArmaTalentoEscolhida, setMaestriaArmaTalentoEscolhida] = useState<string | null>(null);
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

  // Conhecimento Primordial (Bárbaro, nível 3) — "outra perícia à sua
  // escolha da lista de perícias disponíveis pra Bárbaros no nível 1"
  // (Livro do Jogador) — reaproveita a MESMA lista de
  // `proficienciasIniciaisClasse` usada na criação (não duplica um
  // catálogo próprio), menos as que o personagem já é proficiente.
  const opcoesConhecimentoPrimordialAtual = (proficienciasIniciaisClasse[classe.id]?.periciasEscolha.opcoes ?? []).filter(
    (nome) => !periciasProficientesDoPersonagem.includes(nome),
  );
  const [conhecimentoPrimordialEscolhida, setConhecimentoPrimordialEscolhida] = useState<string | null>(null);

  // Acadêmico (Mago, nível 2) — lista fixa da própria característica
  // (Livro do Jogador), não vem da planilha/proficienciasIniciaisClasse
  // (diferente de Conhecimento Primordial): sempre as mesmas 6 opções,
  // independente do que o personagem já é proficiente (a regra real
  // concede proficiência + Especialização juntas, então não precisa
  // filtrar quem já tem).
  const ACADEMICO_PERICIAS = ['Arcanismo', 'História', 'Investigação', 'Medicina', 'Natureza', 'Religião'];
  const [academicoEscolhida, setAcademicoEscolhida] = useState<string | null>(null);
  const [maestriaCirculo1Escolhida, setMaestriaCirculo1Escolhida] = useState<string | null>(null);
  const [maestriaCirculo2Escolhida, setMaestriaCirculo2Escolhida] = useState<string | null>(null);

  const luSteps: LuStep[] = ['pv'];
  // Só entra na sequência se sobrar pelo menos 1 subclasse IMPLEMENTADA
  // pra escolher — senão o passo travaria o Level Up pra sempre (todo
  // card aparece travado, sem opção de avançar). Continua null até a
  // 1ª Trilha da classe ser implementada; nesse momento o passo volta
  // a aparecer (condição já cobre isso: `!personagem.subclasse`).
  if (classe.nivelSubclasse === novoNivel && !personagem.subclasse && subclassesDaClasse.some((s) => subclasseImplementada(s.nome))) {
    luSteps.push('subclasse');
  }
  // Subclasse do PRÓPRIO level-up (se acabou de ser escolhida no passo
  // acima) ou já escolhida antes — os dois casos podem disparar
  // "Proficiências Bônus" (Colégio do Conhecimento, nível 3), sempre 1
  // única vez (nunca de novo depois que as 3 perícias já existem).
  if (
    caracteristicaSubclasseDesbloqueada(subclasseEscolhida, ID_CARACTERISTICA_SUBCLASSE.proficienciasBonus, novoNivel) &&
    periciasSubclasseBonusAtuais.length === 0
  ) {
    luSteps.push('proficienciasBonus');
  }
  // Conhecimento Primordial (Bárbaro, nível 3) — escolha única,
  // permanente (mesmo padrão de "Proficiências Bônus" acima, só que é
  // característica de CLASSE base, não de subclasse). Se não sobrar
  // nenhuma opção (já proficiente em todas as 6), o passo simplesmente
  // não aparece — não tem nada pra escolher.
  if (
    caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.conhecimentoPrimordial, novoNivel) !== null &&
    !conhecimentoPrimordialPericiaAtual &&
    opcoesConhecimentoPrimordialAtual.length > 0
  ) {
    luSteps.push('conhecimentoPrimordial');
  }
  // Acadêmico (Mago, nível 2) — escolha única, permanente, mesmo
  // padrão de Conhecimento Primordial acima, mas as 6 opções nunca
  // ficam vazias (não filtra por proficiência já existente).
  if (
    caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.academico, novoNivel) !== null &&
    !academicoPericiaAtual
  ) {
    luSteps.push('academico');
  }
  // Maestria de Magias (Mago, nível 18) — escolha única inicial, mesmo
  // padrão de Acadêmico acima. Trocar no Descanso Longo é a Entrega 6b.
  if (
    caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.maestriaDeMagias, novoNivel) !== null &&
    Object.keys(maestriaDeMagiasAtuais).length === 0
  ) {
    luSteps.push('maestriaDeMagias');
  }
  // Assinatura Mágica (Mago, nível 20) — escolha única, permanente
  // (sem regra de troca, diferente da Maestria de Magias acima).
  if (
    caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.assinaturaMagica, novoNivel) !== null &&
    assinaturaMagicaAtuais.length === 0
  ) {
    luSteps.push('assinaturaMagica');
  }
  if (temEstiloDeLutaTrocavel(classe, novoNivel)) luSteps.push('estiloDeLuta');
  // Diferente de Truques/Invocações (sempre no array quando a classe
  // tem o recurso, mesmo sem vaga nova) — Maestria em Arma só entra
  // quando o total de vagas CRESCEU de verdade nesse nível (senão seria
  // um passo vazio pra Guerreiro/Bárbaro na maioria dos level-ups).
  if (maxMaestriaArma > maestriaArmaAtual.length) luSteps.push('maestriaArmaCrescimento');
  if (maxTruques > 0) luSteps.push('truques');
  if (temLivroDeMagias) luSteps.push('livroDeMagias');
  if (magiasPeritoNecromanciaBonusNesteNivel > 0) luSteps.push('peritoNecromancia');
  if (magiasVersadoEmEvocacaoBonusNesteNivel > 0) luSteps.push('versadoEmEvocacao');
  if (maxMagiasPreparadas > 0) luSteps.push('magiasPreparadas');
  if (maxInvocacoes > 0) luSteps.push('invocacoes');
  // Independe de `maxInvocacoes > 0` — dispara mesmo num level-up que
  // não concede invocação nova, se alguma marcada antes ainda não
  // tiver truque vinculado (ver comentário de `invocacoesQuePrecisamVinculo`).
  if (invocacoesQuePrecisamVinculo.length > 0) luSteps.push('vinculoTruqueInvocacao');
  // Descobertas Mágicas aparece TODA vez que já estiver desbloqueada
  // (mesmo padrão de Truques) — sempre pode trocar 1 das 2, mesmo sem
  // ser a primeira vez.
  if (caracteristicaSubclasseDesbloqueada(subclasseEscolhida, ID_CARACTERISTICA_SUBCLASSE.descobertasMagicas, novoNivel)) {
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
    if (precisaEscolherAtributoResiliente && opcoesAtributoResilienteAtual.length > 0) luSteps.push('resilienteAtributo');
    if (precisaEscolherMaestriaArmaTalento && opcoesMaestriaArmaTalentoAtual.length > 0) luSteps.push('maestriaArmaTalento');
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

  // Características que já ganham uma tela própria mais adiante nesse
  // mesmo Level Up não aparecem de novo como card no passo "Novas
  // Características" — evita repetir a mesma coisa 2x (ver
  // DECISOES-DESIGN.md "Level Up — passo 'Novas Características' só
  // entra quando sobra algo pra mostrar"). Uma característica passiva
  // sem tela própria (ex: "Ataque Extra") continua aparecendo
  // normalmente — esse passo é o único lugar que mostra ela.
  // Toda característica que ganha tela própria some do card cheio (evita
  // duplicar o mesmo nome 2x nesta tela), mas ainda precisa aparecer
  // como 1 linha de delta aqui — senão ela desaparece da tela por
  // completo (achado do Osmar: Acadêmico tinha sumido daqui depois da
  // exclusão). "escolha pendente" é o texto padrão pra escolha ainda não
  // feita; cada característica com fraseado próprio (ASI/Arcana
  // Mística) mantém o texto específico.
  const nomesComTelaPropria = new Set<string>();
  if (luSteps.includes('subclasse')) {
    nomesComTelaPropria.add(`Subclasse de ${classe.nome}`);
    deltasDoNivel.push({ label: `Subclasse de ${classe.nome}`, texto: 'escolha pendente' });
  }
  if (luSteps.includes('proficienciasBonus')) {
    nomesComTelaPropria.add('Proficiências Bônus');
    deltasDoNivel.push({ label: 'Proficiências Bônus', texto: 'escolha pendente' });
  }
  if (luSteps.includes('descobertasMagicas')) {
    nomesComTelaPropria.add('Descobertas Mágicas');
    deltasDoNivel.push({ label: 'Descobertas Mágicas', texto: 'escolha pendente' });
  }
  if (luSteps.includes('peritoNecromancia')) {
    nomesComTelaPropria.add('Perito em Necromancia');
    deltasDoNivel.push({ label: 'Perito em Necromancia', texto: 'escolha pendente' });
  }
  if (luSteps.includes('versadoEmEvocacao')) {
    nomesComTelaPropria.add('Versado em Evocação');
    deltasDoNivel.push({ label: 'Versado em Evocação', texto: 'escolha pendente' });
  }
  if (luSteps.includes('conhecimentoPrimordial')) {
    nomesComTelaPropria.add('Conhecimento Primordial');
    deltasDoNivel.push({ label: 'Conhecimento Primordial', texto: 'escolha pendente' });
  }
  if (luSteps.includes('academico')) {
    nomesComTelaPropria.add('Acadêmico');
    deltasDoNivel.push({ label: 'Acadêmico', texto: 'escolha pendente' });
  }
  if (luSteps.includes('maestriaDeMagias')) {
    nomesComTelaPropria.add('Maestria de Magias');
    deltasDoNivel.push({ label: 'Maestria de Magias', texto: 'escolha pendente' });
  }
  if (luSteps.includes('assinaturaMagica')) {
    nomesComTelaPropria.add('Assinatura Mágica');
    deltasDoNivel.push({ label: 'Assinatura Mágica', texto: 'escolha pendente' });
  }
  if (luSteps.includes('estiloDeLuta')) {
    nomesComTelaPropria.add('Estilo de Luta');
    deltasDoNivel.push({ label: 'Estilo de Luta', texto: 'disponível pra trocar' });
  }
  if (luSteps.includes('especialista')) {
    NOMES_ESPECIALISTA.forEach((n) => nomesComTelaPropria.add(n));
    deltasDoNivel.push({ label: 'Especialista', texto: 'escolha pendente' });
  }
  if (luSteps.includes('asi')) {
    nomesComTelaPropria.add('Aumento no Valor de Atributo');
    deltasDoNivel.push({ label: 'Aumento no Valor de Atributo / Talento', texto: 'disponível' });
  }
  if (luSteps.includes('dadivaEpica')) {
    nomesComTelaPropria.add('Dádiva Épica');
    deltasDoNivel.push({ label: 'Dádiva Épica', texto: 'disponível' });
  }
  if (luSteps.includes('arcanaMistica') && novoCirculoArcanaMistica !== null) {
    nomesComTelaPropria.add(`Arcana Mística (${novoCirculoArcanaMistica}º círculo)`);
    deltasDoNivel.push({ label: `Arcana Mística (${novoCirculoArcanaMistica}º círculo)`, texto: 'escolha pendente' });
  }

  // "Novas Características" agora é o guia do nível inteiro (CLAUDE.md
  // §12.1) — entra na sequência quando sobra pelo menos 1 característica
  // passiva OU 1 delta de recurso (Truques/Magias/Espaços/ASI) pra
  // mostrar (mesmo padrão condicional de todo o resto deste array — ver
  // DECISOES-DESIGN.md acima referenciado).
  const features = caracteristicasDoNivelComSubclasse(classe, novoNivel, subclasseEscolhida).filter(
    (f) => !nomesComTelaPropria.has(f.nome),
  );
  if (features.length > 0 || deltasDoNivel.length > 0) luSteps.splice(1, 0, 'features');
  luSteps.push('resumo');

  const [luIndex, setLuIndex] = useState(0);
  const [faseDramatica, setFaseDramatica] = useState<FaseDramatica>('idle');
  const [valorDadoAnimado, setValorDadoAnimado] = useState<number | null>(null);
  const [estiloDeLutaEscolhido, setEstiloDeLutaEscolhido] = useState<string | null>(personagem.estiloDeLuta);
  // 8 passos de "escolha múltipla com máximo" (G4.1 do foco de saúde do
  // projeto, ver `EmDevB.md`/`useEscolhaMultipla.ts`) — cada um mantém
  // os MESMOS nomes locais de sempre, só a implementação da escolha em
  // si veio pro hook.
  const {
    escolhidos: truquesEscolhidos,
    toggle: toggleTruque,
    trocas: trocasDeTruque,
  } = useEscolhaMultipla(truquesAtuais, maxTruques, {
    // Mago (usaRedefPorDescanso): truque já conhecido é travado aqui —
    // a troca dele é só no Descanso Longo, não no Level Up.
    bloqueado: (nome) => usaRedefPorDescanso && truquesAtuais.includes(nome),
  });
  // Vagas nativas de Maestria em Arma (Guerreiro/Bárbaro) que crescem
  // sozinhas por nível (4/10/16 pro Guerreiro) — arma já escolhida
  // fica travada aqui (trocar uma existente é só no Descanso Longo,
  // ver `TrocarArmaMaestria.tsx` na aba Atributos), este passo só
  // preenche as vagas NOVAS que a subida de nível abriu.
  const { escolhidos: maestriaArmaEscolhida, toggle: toggleMaestriaArma } = useEscolhaMultipla(
    maestriaArmaAtual,
    maxMaestriaArma,
    { bloqueado: (nome) => maestriaArmaAtual.includes(nome) },
  );
  const { escolhidos: livroDeMagiasEscolhido, toggle: toggleLivroDeMagias } = useEscolhaMultipla(
    livroDeMagiasAtuais,
    maxLivroDeMagias,
    // Grimório nunca perde magia — item já conhecido fica travado.
    { bloqueado: (nome) => livroDeMagiasAtuais.includes(nome) },
  );
  // Perito em Necromancia — pura adição, esvazia a cada level-up (as
  // escolhas de level-ups anteriores já viraram parte permanente de
  // `livroDeMagiasAtuais`, não precisam ser re-rastreadas aqui).
  const { escolhidos: peritoNecromanciaEscolhidas, toggle: togglePeritoNecromancia } = useEscolhaMultipla(
    [],
    magiasPeritoNecromanciaBonusNesteNivel,
  );
  // Versado em Evocação — pura adição, mesmo formato de Perito em
  // Necromancia acima.
  const { escolhidos: versadoEmEvocacaoEscolhidas, toggle: toggleVersadoEmEvocacao } = useEscolhaMultipla(
    [],
    magiasVersadoEmEvocacaoBonusNesteNivel,
  );
  // Assinatura Mágica — escolha única permanente, mesmo padrão de Perito
  // em Necromancia acima (sempre começa vazia, sem regra de troca).
  const MAX_ASSINATURA_MAGICA = 2;
  const { escolhidos: assinaturaMagicaEscolhidas, toggle: toggleAssinaturaMagica } = useEscolhaMultipla(
    [],
    MAX_ASSINATURA_MAGICA,
  );
  const {
    escolhidos: magiasPreparadasEscolhidas,
    toggle: toggleMagiaPreparada,
    trocas: trocasDeMagia,
  } = useEscolhaMultipla(magiasPreparadasAtuais, maxMagiasPreparadas, {
    // Mago (usaRedefPorDescanso): magia já preparada é travada aqui —
    // a redefinição livre é só no Descanso Longo, não no Level Up.
    bloqueado: (nome) => usaRedefPorDescanso && magiasPreparadasAtuais.includes(nome),
  });
  // Especialista é só ADIÇÃO — nunca substitui uma perícia já
  // especializada (diferente de Truques/Magias Preparadas, que podem
  // trocar 1 por level-up), então o `toggle` nem deixa desmarcar o que
  // já veio de um nível anterior.
  const { escolhidos: especialistaEscolhidas, toggle: toggleEspecialista } = useEscolhaMultipla(
    periciasEspecialistaAtuais,
    maxEspecialista,
    { bloqueado: (nome) => periciasEspecialistaAtuais.includes(nome) },
  );
  const { escolhidos: proficienciasBonusEscolhidas, toggle: toggleProficienciaBonus } = useEscolhaMultipla(
    periciasSubclasseBonusAtuais,
    3,
  );
  const {
    escolhidos: descobertasMagicasEscolhidas,
    toggle: toggleDescobertaMagica,
    trocas: trocasDeDescobertaMagica,
  } = useEscolhaMultipla(magiasDescobertasMagicasAtuais, MAX_DESCOBERTAS_MAGICAS);
  const [asiEscolhas, setAsiEscolhas] = useState<Atributo[]>([]);
  const [aviso, setAviso] = useAvisoTemporario();
  // Valor manual (pedido do Osmar) — pra quando o dado de vida já foi
  // rolado na mesa antes de existir a ficha digital. Fica separado
  // (não usa `hpRolado` até confirmar em "Avançar") pra não travar o
  // campo de texto assim que o número digitado ficar válido — o
  // "travado" (ver JSX) só aparece de verdade depois de avançar.
  const [hpManualTexto, setHpManualTexto] = useState('');

  const media = dadoVidaValor[personagem.dadoVida] + personagem.conMod + personagem.bonusPvPorNivel;
  const dadoVidaMax = parseInt(personagem.dadoVida.slice(1), 10);
  const hpManualNumero = parseInt(hpManualTexto, 10);
  const hpManualValido = Number.isInteger(hpManualNumero) && hpManualNumero >= 1 && hpManualNumero <= dadoVidaMax;
  const pvGanho =
    hpModo === 'media'
      ? media
      : hpModo === 'rolar'
        ? hpRolado !== null
          ? hpRolado + personagem.conMod + personagem.bonusPvPorNivel
          : null
        : hpModo === 'manual'
          ? hpRolado !== null
            ? hpRolado + personagem.conMod + personagem.bonusPvPorNivel
            : hpManualValido
              ? hpManualNumero + personagem.conMod + personagem.bonusPvPorNivel
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

  const truquesValido =
    truquesEscolhidos.length === maxTruques && trocasDeTruque <= (usaRedefPorDescanso ? 0 : 1);

  const livroDeMagiasValido = livroDeMagiasEscolhido.length === maxLivroDeMagias;

  // Pool exclui o que já está (ou acabou de entrar, no passo anterior)
  // no grimório — a escolha bônus não pode repetir uma magia que o
  // personagem já vai ganhar de qualquer jeito.
  const poolPeritoNecromancia = catalogoPeritoNecromancia(circuloMaximoNovoNivel).filter(
    (m) => !livroDeMagiasEscolhido.includes(m.nome),
  );
  const peritoNecromanciaValido = peritoNecromanciaEscolhidas.length === magiasPeritoNecromanciaBonusNesteNivel;

  // Versado em Evocação — mesmo tratamento de pool (exclui o que já
  // vai entrar no Livro de Magias pelo passo normal).
  const poolVersadoEmEvocacao = catalogoVersadoEmEvocacao(circuloMaximoNovoNivel).filter(
    (m) => !livroDeMagiasEscolhido.includes(m.nome),
  );
  const versadoEmEvocacaoValido = versadoEmEvocacaoEscolhidas.length === magiasVersadoEmEvocacaoBonusNesteNivel;

  // Maestria de Magias — pool vem do Livro de Magias JÁ com o que foi
  // escolhido neste mesmo level-up (`livroDeMagiasEscolhido`), não só
  // o que já existia antes.
  const livroDeMagiasComoObjetos = magiasDaClasse(classe.nome).filter((m) => livroDeMagiasEscolhido.includes(m.nome));
  const poolMaestriaCirculo1 = magiasElegiveisMaestria(livroDeMagiasComoObjetos, 1);
  const poolMaestriaCirculo2 = magiasElegiveisMaestria(livroDeMagiasComoObjetos, 2);
  const maestriaDeMagiasValido = maestriaCirculo1Escolhida !== null && maestriaCirculo2Escolhida !== null;

  // Assinatura Mágica — mesmo motivo de "pool com o que foi escolhido
  // neste mesmo level-up" da Maestria de Magias acima.
  const poolAssinaturaMagica = magiasElegiveisAssinatura(livroDeMagiasComoObjetos);
  const assinaturaMagicaValido = assinaturaMagicaEscolhidas.length === MAX_ASSINATURA_MAGICA;

  const invocacoesValido = invocacoesEscolhidas.length === maxInvocacoes && trocasDeInvocacao <= 1;

  const descobertasMagicasValido =
    descobertasMagicasEscolhidas.length === MAX_DESCOBERTAS_MAGICAS && trocasDeDescobertaMagica <= 1;

  const magiasPreparadasValido =
    magiasPreparadasEscolhidas.length === maxMagiasPreparadas && trocasDeMagia <= (usaRedefPorDescanso ? 0 : 1);
  // Mago só pode preparar o que já está no grimório (escolhido no passo
  // anterior, "livroDeMagias", + os bônus de "peritoNecromancia"/
  // "versadoEmEvocacao") — outras classes continuam vendo a lista
  // inteira da classe, igual sempre foi.
  const magiasPreparadasPool = temLivroDeMagias
    ? magiasPreparadasDaClasse.filter(
        (m) =>
          livroDeMagiasEscolhido.includes(m.nome) ||
          peritoNecromanciaEscolhidas.includes(m.nome) ||
          versadoEmEvocacaoEscolhidas.includes(m.nome),
      )
    : magiasPreparadasDaClasse;

  const especialistaValido = especialistaEscolhidas.length === maxEspecialista;

  // Proficiências Bônus (Colégio do Conhecimento, nível 3): escolha
  // única de 3 perícias entre as que o personagem AINDA não é
  // proficiente — nunca aparece de novo depois de confirmada (ver
  // condição de `luSteps` acima).
  const periciasNaoProficientes = pericias.filter((p) => !periciasProficientesDoPersonagem.includes(p.nome)).map((p) => p.nome);

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

  /** Ao escolher um talento com `concedeAsi`, pré-seleciona o que dá
   * pra pré-selecionar — `escolha-unica` com 1 atributo só já marca
   * esse atributo (sem escolha real pro jogador fazer), mas ainda
   * passa pelo passo extra 'asiAtributo' pra mostrar "valor atual →
   * valor novo" antes de confirmar. O resto (`distribuir-dois`, ou
   * `escolha-unica` com 2+ atributos) fica em branco pro jogador
   * escolher nesse mesmo passo — ver `precisaEscolherAtributoDoTalento`.
   * Ver DECISOES-DESIGN.md. */
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
    conhecimentoPrimordial: 'Conhecimento Primordial',
    academico: 'Acadêmico',
    estiloDeLuta: 'Estilo de Luta',
    truques: 'Truques',
    livroDeMagias: 'Livro de Magias',
    peritoNecromancia: 'Perito em Necromancia',
    versadoEmEvocacao: 'Versado em Evocação',
    magiasPreparadas: 'Magias Preparadas',
    invocacoes: 'Invocações Místicas',
    vinculoTruqueInvocacao: 'Truque Vinculado',
    descobertasMagicas: 'Descobertas Mágicas',
    especialista: 'Especialista',
    asi: 'Atributo ou Talento',
    asiAtributo: 'Atributo do Talento',
    talentoMagia: 'Magia do Talento',
    periciaLivreTalento: 'Perícia do Talento',
    periciaRestritaTalento: 'Perícia do Talento',
    resilienteAtributo: 'Atributo (Resiliente)',
    maestriaArmaTalento: 'Arma (Mestre das Armas)',
    maestriaArmaCrescimento: 'Maestria em Arma',
    dadivaEpica: 'Dádiva Épica',
    arcanaMistica: 'Arcana Mística',
    iniciadoEmMagia: 'Iniciado em Magia',
    maestriaDeMagias: 'Maestria de Magias',
    assinaturaMagica: 'Assinatura Mágica',
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
      if (hpModo === 'manual' && hpRolado === null) {
        if (!hpManualValido) {
          setAviso(`Digite um valor entre 1 e ${dadoVidaMax} antes de avançar.`);
          return;
        }
        onHpRoladoChange(hpManualNumero);
      }
    }
    if (
      step === 'subclasse' &&
      subclassesDaClasse.some((s) => subclasseImplementada(s.nome)) &&
      subclasseEscolhida === null
    ) {
      setAviso('Escolha uma subclasse antes de avançar.');
      return;
    }
    if (step === 'proficienciasBonus' && !proficienciasBonusValido) {
      setAviso('Escolha exatamente 3 perícias pra Proficiências Bônus antes de avançar.');
      return;
    }
    if (step === 'conhecimentoPrimordial' && conhecimentoPrimordialEscolhida === null) {
      setAviso('Escolha a perícia do Conhecimento Primordial antes de avançar.');
      return;
    }
    if (step === 'academico' && academicoEscolhida === null) {
      setAviso('Escolha a perícia do Acadêmico antes de avançar.');
      return;
    }
    if (step === 'maestriaDeMagias' && !maestriaDeMagiasValido) {
      setAviso('Escolha 1 magia de 1º círculo e 1 de 2º círculo antes de avançar.');
      return;
    }
    if (step === 'assinaturaMagica' && !assinaturaMagicaValido) {
      setAviso(`Escolha exatamente ${MAX_ASSINATURA_MAGICA} magias de 3º círculo antes de avançar.`);
      return;
    }
    if (step === 'maestriaArmaCrescimento' && maestriaArmaEscolhida.length < maxMaestriaArma) {
      setAviso(`Escolha ${maxMaestriaArma - maestriaArmaAtual.length} arma(s) nova(s) de Maestria antes de avançar.`);
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
    if (step === 'peritoNecromancia' && !peritoNecromanciaValido) {
      setAviso(`Escolha exatamente ${magiasPeritoNecromanciaBonusNesteNivel} magia(s) de Necromancia antes de avançar.`);
      return;
    }
    if (step === 'versadoEmEvocacao' && !versadoEmEvocacaoValido) {
      setAviso(`Escolha exatamente ${magiasVersadoEmEvocacaoBonusNesteNivel} magia(s) de Evocação antes de avançar.`);
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
    if (
      step === 'vinculoTruqueInvocacao' &&
      // Só bloqueia quando existe pelo menos 1 truque elegível pra
      // escolher — sem isso, o jogador ficaria travado pra sempre
      // (ex.: marcou a invocação mas ainda não tem nenhum truque de
      // dano conhecido). Sem opção nenhuma, o passo continua marcado
      // como pendente (`vinculoTruqueEscolhido` não ganha a chave) e
      // volta a aparecer no próximo level-up, quando talvez já tenha.
      invocacoesQuePrecisamVinculo.some(
        (id) => !vinculoTruqueEscolhido[id] && truquesElegiveisParaVinculo(id, truquesEscolhidos).length > 0,
      )
    ) {
      setAviso('Escolha o truque vinculado a cada Invocação Mística antes de avançar.');
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
    if (step === 'resilienteAtributo' && atributoResilienteEscolhido === null) {
      setAviso('Escolha o atributo do talento antes de avançar.');
      return;
    }
    if (step === 'maestriaArmaTalento' && maestriaArmaTalentoEscolhida === null) {
      setAviso('Escolha a arma do talento antes de avançar.');
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
        livroDeMagiasEscolhidas: luSteps.includes('livroDeMagias')
          ? [...livroDeMagiasEscolhido, ...peritoNecromanciaEscolhidas, ...versadoEmEvocacaoEscolhidas]
          : null,
        magiasPreparadasEscolhidas: luSteps.includes('magiasPreparadas') ? magiasPreparadasEscolhidas : null,
        invocacoesMisticasEscolhidas: luSteps.includes('invocacoes') ? invocacoesEscolhidas : null,
        invocacoesTruqueVinculadoEscolhido: luSteps.includes('vinculoTruqueInvocacao') ? vinculoTruqueEscolhido : null,
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
        escolhaAtributoTalentoGeral:
          luSteps.includes('resilienteAtributo') && talentoObjEscolhido && atributoResilienteEscolhido
            ? { [talentoObjEscolhido.id]: atributoResilienteEscolhido }
            : null,
        maestriaArmaTalentoEscolhida: luSteps.includes('maestriaArmaTalento') ? maestriaArmaTalentoEscolhida : null,
        maestriaArmaEscolhida: luSteps.includes('maestriaArmaCrescimento') ? maestriaArmaEscolhida : null,
        periciaLivreTalentoEscolhida: luSteps.includes('periciaLivreTalento') ? periciaLivreEscolhida : null,
        periciaRestritaTalentoEscolhida: luSteps.includes('periciaRestritaTalento') ? periciaRestritaEscolhida : null,
        conhecimentoPrimordialPericiaEscolhida: luSteps.includes('conhecimentoPrimordial') ? conhecimentoPrimordialEscolhida : null,
        academicoPericiaEscolhida: luSteps.includes('academico') ? academicoEscolhida : null,
        maestriaDeMagiasEscolhida:
          luSteps.includes('maestriaDeMagias') && maestriaDeMagiasValido
            ? { 1: maestriaCirculo1Escolhida!, 2: maestriaCirculo2Escolhida! }
            : null,
        assinaturaMagicaEscolhida:
          luSteps.includes('assinaturaMagica') && assinaturaMagicaValido ? assinaturaMagicaEscolhidas : null,
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

      {step === 'peritoNecromancia' && (
        <div className={styles.subHeader}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Perito em Necromancia — escolha {magiasPeritoNecromanciaBonusNesteNivel} (
            {peritoNecromanciaEscolhidas.length}/{magiasPeritoNecromanciaBonusNesteNivel})
          </div>
          <div className="label">
            🏠 Homebrew — magias de Necromancia grátis, direto no Livro de Magias, além das que o passo anterior já
            escolheu. Não conta na conta normal do grimório.
          </div>
        </div>
      )}

      {step === 'versadoEmEvocacao' && (
        <div className={styles.subHeader}>
          <div className="section-title" style={{ marginBottom: 4 }}>
            Versado em Evocação — escolha {magiasVersadoEmEvocacaoBonusNesteNivel} (
            {versadoEmEvocacaoEscolhidas.length}/{magiasVersadoEmEvocacaoBonusNesteNivel})
          </div>
          <div className="label">
            Regra oficial: magias de Evocação de Mago grátis, direto no Livro de Magias, além das que o passo anterior
            já escolheu. Não conta na conta normal do grimório.
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
                <div className="opt-card-name">
                  {hpModo === 'manual' ? '✍️ Valor manual — resultado travado' : '🎲 Dado de vida rolado — resultado travado'}
                </div>
                <div className="opt-card-desc">
                  {hpModo === 'manual' ? 'Digitou' : 'Rolou'} <b>{hpRolado}</b> em 1{personagem.dadoVida} + mod. CON ({personagem.conMod >= 0 ? '+' : ''}
                  {personagem.conMod})
                  {personagem.bonusPvPorNivel > 0 && ` + ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`} ={' '}
                  <b>+{hpRolado + personagem.conMod + personagem.bonusPvPorNivel} PV</b>.{' '}
                  {hpModo === 'manual' ? 'Não dá pra editar de novo.' : 'Não dá pra rolar de novo.'}
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
                <div className={`opt-card ${hpModo === 'manual' ? 'selected' : ''}`} onClick={() => onHpModoChange('manual')}>
                  <div className="opt-card-name">Valor manual</div>
                  <div className="opt-card-desc">
                    Já rolou o dado de vida na mesa (sem ficha digital)? Digite o resultado de 1{personagem.dadoVida}{' '}
                    (1 a {dadoVidaMax}) — mod. CON ({personagem.conMod >= 0 ? '+' : ''}
                    {personagem.conMod})
                    {personagem.bonusPvPorNivel > 0 && ` e ${personagem.bonusPvPorNivelLabel} (+${personagem.bonusPvPorNivel})`} são
                    somados automaticamente.
                  </div>
                  {hpModo === 'manual' && (
                    <input
                      className={styles.hpManualInput}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={dadoVidaMax}
                      placeholder={`1 a ${dadoVidaMax}`}
                      value={hpManualTexto}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        setHpManualTexto(e.target.value);
                        setAviso(null);
                      }}
                    />
                  )}
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
            <div className="section-title">Novas características no nível {novoNivel}</div>
            {deltasDoNivel.length > 0 && (
              <div className="opt-card" style={{ cursor: 'default', marginBottom: 10 }}>
                {deltasDoNivel.map((d) => (
                  <div key={d.label} className="opt-card-row" style={{ justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ flex: '1 1 auto', minWidth: 0 }}>{d.label}</span>
                    <span style={{ flex: '0 0 auto', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{d.texto}</span>
                  </div>
                ))}
              </div>
            )}
            {features.map((f) => {
              const ph = f.statusImplementacao?.startsWith('placeholder-') ?? false;
              return (
                <div key={f.nome} className="opt-card" style={{ cursor: 'default' }}>
                  <div className="opt-card-name">
                    {ph && <span style={{ color: 'var(--warn)' }}>[PH] </span>}
                    {f.nome}
                  </div>
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
              );
            })}
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
                      <div className="opt-card-name">
                        {s.nome} {s.homebrew && <BadgeHomebrew />}
                      </div>
                      {!implementada && <div className="opt-card-desc">Ainda não implementada</div>}
                      {!temArte && <div className="opt-card-desc">[PH] ícone ainda não desenhado</div>}
                      {s.homebrew && (
                        <div className="opt-card-desc">
                          Não é regra oficial ainda — vai ser revisada quando o livro sair.
                        </div>
                      )}
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

        {step === 'maestriaArmaCrescimento' && (
          <>
            <div className="section-title">
              Maestria em Arma — escolha {maxMaestriaArma - maestriaArmaAtual.length} nova(s) (
              {maestriaArmaEscolhida.length}/{maxMaestriaArma})
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              Seu treinamento cresceu com o nível — as armas que você já tinha continuam, escolha só a(s) nova(s).
            </div>
            {armasParaMaestriaAtual.map((arma) => {
              const jaTinha = maestriaArmaAtual.includes(arma.nome);
              const marcado = maestriaArmaEscolhida.includes(arma.nome);
              return (
                <div
                  key={arma.id}
                  className={`opt-card ${marcado ? 'selected' : ''}`}
                  style={{ cursor: jaTinha ? 'default' : 'pointer', opacity: jaTinha ? 0.6 : 1 }}
                  onClick={() => {
                    if (jaTinha) return;
                    toggleMaestriaArma(arma.nome);
                  }}
                >
                  <div className="opt-card-name">
                    {arma.nome}
                    {jaTinha ? ' (já tinha)' : ''}
                  </div>
                  <div className="opt-card-desc">
                    {arma.dano} · {arma.maestria}
                  </div>
                </div>
              );
            })}
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

        {step === 'peritoNecromancia' && (
          <>
            {agruparMagiasPorCirculo(poolPeritoNecromancia).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const marcado = peritoNecromanciaEscolhidas.includes(m.nome);
                  return (
                    <div key={m.id} className="check-row" onClick={() => togglePeritoNecromancia(m.nome)}>
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: 'var(--text-faint)', fontSize: 11 }}>({m.circulo}º círculo)</span>
                      </span>
                    </div>
                  );
                }}
              </GrupoMagiaColapsavel>
            ))}
          </>
        )}

        {step === 'versadoEmEvocacao' && (
          <>
            {agruparMagiasPorCirculo(poolVersadoEmEvocacao).map((grupo) => (
              <GrupoMagiaColapsavel key={grupo.circulo} label={grupo.label} magias={grupo.magias}>
                {(m) => {
                  const marcado = versadoEmEvocacaoEscolhidas.includes(m.nome);
                  return (
                    <div key={m.id} className="check-row" onClick={() => toggleVersadoEmEvocacao(m.nome)}>
                      <div className={`check-box ${marcado ? 'checked' : ''}`} />
                      <span className="check-label">
                        <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                        {' '}<span style={{ color: 'var(--text-faint)', fontSize: 11 }}>({m.circulo}º círculo)</span>
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

        {step === 'vinculoTruqueInvocacao' && (
          <>
            {invocacoesQuePrecisamVinculo.map((invocacaoId) => {
              const inv = invocacoesCatalogo.find((i) => i.id === invocacaoId);
              if (!inv) return null;
              const opcoes = truquesElegiveisParaVinculo(invocacaoId, truquesEscolhidos);
              const escolhido = vinculoTruqueEscolhido[invocacaoId];
              return (
                <div key={invocacaoId} style={{ marginBottom: 16 }}>
                  <div className="section-title">{inv.nome} — escolha 1 truque</div>
                  <div className="label" style={{ marginBottom: 8 }}>
                    <TextoComMagias texto={inv.beneficios} nomesMagias={inv.magiasMencionadas} />
                  </div>
                  {opcoes.length === 0 && (
                    <div className="label" style={{ color: 'var(--danger)' }}>
                      Nenhum truque conhecido se encaixa ainda — volte aqui num level-up futuro, depois de aprender
                      um truque elegível.
                    </div>
                  )}
                  {opcoes.map((m) => (
                    <div
                      key={m.id}
                      className={`opt-card ${escolhido === m.nome ? 'selected' : ''}`}
                      onClick={() => setVinculoTruqueEscolhido((prev) => ({ ...prev, [invocacaoId]: m.nome }))}
                    >
                      <div className="opt-card-name">{m.nome}</div>
                      <div className="opt-card-desc">{m.descricaoCurta ?? m.descricaoCompleta}</div>
                    </div>
                  ))}
                </div>
              );
            })}
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

        {step === 'conhecimentoPrimordial' && (
          <>
            <div className="section-title">Conhecimento Primordial — escolha 1 perícia</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Proficiência em outra perícia à sua escolha, entre as disponíveis pra Bárbaros no nível 1. Escolha
              única e permanente.
            </div>
            {opcoesConhecimentoPrimordialAtual.map((nome) => (
              <div
                key={nome}
                className={`opt-card ${conhecimentoPrimordialEscolhida === nome ? 'selected' : ''}`}
                onClick={() => setConhecimentoPrimordialEscolhida(nome)}
              >
                <div className="opt-card-name">{nome}</div>
              </div>
            ))}
          </>
        )}

        {step === 'academico' && (
          <>
            <div className="section-title">Acadêmico — escolha 1 perícia</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Proficiência + Especialização (dobra o bônus) numa das perícias abaixo à sua escolha. Escolha única e
              permanente.
            </div>
            {ACADEMICO_PERICIAS.map((nome) => (
              <div
                key={nome}
                className={`opt-card ${academicoEscolhida === nome ? 'selected' : ''}`}
                onClick={() => setAcademicoEscolhida(nome)}
              >
                <div className="opt-card-name">{nome}</div>
              </div>
            ))}
          </>
        )}

        {step === 'maestriaDeMagias' && (
          <>
            <div className="section-title">Maestria de Magias — escolha 1 de cada círculo</div>
            <div className="label" style={{ marginBottom: 8 }}>
              As 2 escolhidas ficam sempre preparadas e conjuram no círculo delas sem gastar Espaço — só magias com
              tempo de conjuração de uma Ação, do seu Livro de Magias.
            </div>
            <div className={styles.subHeader}>1º círculo</div>
            {poolMaestriaCirculo1.map((m) => (
              <div
                key={m.id}
                className={`opt-card ${maestriaCirculo1Escolhida === m.nome ? 'selected' : ''}`}
                onClick={() => setMaestriaCirculo1Escolhida(m.nome)}
              >
                <div className="opt-card-name">
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
              </div>
            ))}
            <div className={styles.subHeader}>2º círculo</div>
            {poolMaestriaCirculo2.map((m) => (
              <div
                key={m.id}
                className={`opt-card ${maestriaCirculo2Escolhida === m.nome ? 'selected' : ''}`}
                onClick={() => setMaestriaCirculo2Escolhida(m.nome)}
              >
                <div className="opt-card-name">
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 'assinaturaMagica' && (
          <>
            <div className="section-title">
              Assinatura Mágica — escolha {MAX_ASSINATURA_MAGICA} ({assinaturaMagicaEscolhidas.length}/{MAX_ASSINATURA_MAGICA})
            </div>
            <div className="label" style={{ marginBottom: 8 }}>
              Ficam sempre preparadas e cada uma pode ser conjurada 1x no 3º círculo sem gastar Espaço — recarrega no
              Descanso Curto ou Longo. Escolha permanente, sem troca depois.
            </div>
            {poolAssinaturaMagica.map((m) => (
              <div
                key={m.id}
                className={`opt-card ${assinaturaMagicaEscolhidas.includes(m.nome) ? 'selected' : ''}`}
                onClick={() => toggleAssinaturaMagica(m.nome)}
              >
                <div className="opt-card-name">
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
              </div>
            ))}
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
              classe={classe}
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
                  {talentoObjEscolhido.concedeAsi.atributos.length > 1
                    ? `${talentoObjEscolhido.nome} dá +1 num desses atributos, à sua escolha.`
                    : `${talentoObjEscolhido.nome} dá +1 nesse atributo.`}
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

        {step === 'resilienteAtributo' && talentoObjEscolhido && (
          <>
            <div className="section-title">{talentoObjEscolhido.nome} — escolha 1 atributo</div>
            <div className="label" style={{ marginBottom: 8 }}>
              +1 nesse atributo e ganha proficiência de Salvaguarda nele — só atributos em que você ainda não é
              proficiente aparecem aqui.
            </div>
            {opcoesAtributoResilienteAtual.map((atributo) => {
              const base = atributosAtuais[atributo] ?? 10;
              return (
                <div
                  key={atributo}
                  className={`opt-card ${atributoResilienteEscolhido === atributo ? 'selected' : ''}`}
                  onClick={() => {
                    setAtributoResilienteEscolhido(atributo);
                    setAsiEscolhas([atributo]);
                  }}
                >
                  <div className="opt-card-name">
                    {atributo} {base} → {Math.min(base + 1, 20)}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {step === 'maestriaArmaTalento' && talentoObjEscolhido && (
          <>
            <div className="section-title">{talentoObjEscolhido.nome} — escolha 1 arma</div>
            <div className="label" style={{ marginBottom: 8 }}>
              Usa a propriedade de Maestria dessa arma, mesmo sem ser o tipo nativo da classe — troca em Descanso
              Longo. Só armas que você já é proficiente aparecem aqui.
            </div>
            {opcoesMaestriaArmaTalentoAtual.map((arma) => (
              <div
                key={arma.id}
                className={`opt-card ${maestriaArmaTalentoEscolhida === arma.nome ? 'selected' : ''}`}
                onClick={() => setMaestriaArmaTalentoEscolhida(arma.nome)}
              >
                <div className="opt-card-name">{arma.nome}</div>
                <div className="opt-card-desc">
                  {arma.dano} · {arma.maestria}
                </div>
              </div>
            ))}
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
              classe={classe}
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
            {luSteps.includes('maestriaArmaCrescimento') && (
              <div className="summary-row">
                <span>Maestria em Arma</span>
                <span>+{maestriaArmaEscolhida.length - maestriaArmaAtual.length} nova(s)</span>
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
            {luSteps.includes('peritoNecromancia') && (
              <div className="summary-row">
                <span>Perito em Necromancia</span>
                <span>+{peritoNecromanciaEscolhidas.length} nova(s) 🏠</span>
              </div>
            )}
            {luSteps.includes('versadoEmEvocacao') && (
              <div className="summary-row">
                <span>Versado em Evocação</span>
                <span>+{versadoEmEvocacaoEscolhidas.length} nova(s)</span>
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
            {luSteps.includes('vinculoTruqueInvocacao') && (
              <div className="summary-row">
                <span>Truque Vinculado</span>
                <span>
                  {invocacoesQuePrecisamVinculo
                    .map((id) => vinculoTruqueEscolhido[id])
                    .filter((nome): nome is string => Boolean(nome))
                    .join(', ') || 'nenhum truque elegível ainda'}
                </span>
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
            {luSteps.includes('conhecimentoPrimordial') && (
              <div className="summary-row">
                <span>Conhecimento Primordial</span>
                <span>{conhecimentoPrimordialEscolhida ?? 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('academico') && (
              <div className="summary-row">
                <span>Acadêmico</span>
                <span>{academicoEscolhida ?? 'nenhuma escolhida'}</span>
              </div>
            )}
            {luSteps.includes('maestriaDeMagias') && (
              <div className="summary-row">
                <span>Maestria de Magias</span>
                <span>
                  {maestriaCirculo1Escolhida ?? '—'} / {maestriaCirculo2Escolhida ?? '—'}
                </span>
              </div>
            )}
            {luSteps.includes('assinaturaMagica') && (
              <div className="summary-row">
                <span>Assinatura Mágica</span>
                <span>{assinaturaMagicaEscolhidas.join(', ') || 'nenhuma escolhida'}</span>
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
            {luSteps.includes('resilienteAtributo') && (
              <div className="summary-row">
                <span>Atributo (Resiliente)</span>
                <span>{atributoResilienteEscolhido ?? 'nenhum escolhido'}</span>
              </div>
            )}
            {luSteps.includes('maestriaArmaTalento') && (
              <div className="summary-row">
                <span>Arma (Mestre das Armas)</span>
                <span>{maestriaArmaTalentoEscolhida ?? 'nenhuma escolhida'}</span>
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
