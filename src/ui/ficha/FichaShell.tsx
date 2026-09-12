import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { armazenamentoPersonagens, type PersonagemSalvo } from '../../core/armazenamentoPersonagens';
import { garantirPersonagemDemo, ID_PERSONAGEM_DEMO } from '../../core/personagemDemo';
import { useColapsavel } from '../hooks/useColapsavel';
import { useAutosavePersonagem } from './hooks/useAutosavePersonagem';
import {
  bonusProficiencia,
  calcularAtributosFinais,
  calcularCAEquipado,
  calcularIniciativa,
  calcularPercepcaoPassiva,
  calcularPericias,
  calcularProficienciasFerramenta,
  calcularPvMaximoNivel1,
  bonusPvPorNivelDaEspecie,
  bonusPvPorNivelDoTalento,
  rotulosBonusPvPorNivel,
  classeDaSelecao,
  efeitoMecanicoDoTalento,
  explicarCAEquipado,
  explicarIniciativa,
  explicarPercepcaoPassiva,
  explicarPvMaximo,
  periciasProficientes,
} from '../../core/calculoPersonagem';
import { aumentarAtributos, modificador, valorFinalAtributo, type WizardSelection } from '../../core/personagem';
import { atributosOrdem, type Atributo } from '../../data/wizardFixtures';
import {
  classesDoPersonagem,
  nivelTotalPersonagem,
  opcoesLevelUp,
  deveEscolherClasseNoLevelUp,
  temPonteDeMagiaDePacto,
  temConjuracaoMulticlasse,
  contaNaConjuracaoMulticlasse,
  nivelEquivalenteConjuracaoMulticlasse,
  espacosMagiaParaNivelCombinado,
  type PersonagemClasse,
} from '../../core/multiclasse';
import { classes as catalogoClasses } from '../../data/rulesets/dnd2024/classes';
import EscolherClasseLevelUp, { type ResultadoEscolhaClasseLevelUp } from './levelup/EscolherClasseLevelUp';
import {
  calcularCapacidadeMaxima,
  calcularItensIniciais,
  criarItemManual,
  explicarCapacidadeMaxima,
  type ItemMochila,
} from '../../core/mochila';
import {
  criarPet,
  alterarPvPet as alterarPvPetPuro,
  pvMaxEfetivoPet,
  comBonusExtra,
  ganharPvTemporarioPet,
  type Pet,
  type AjustesPet,
} from '../../core/pets';
import { criaturas } from '../../data/rulesets/dnd2024/criaturas';
import { formasFamiliarDasInvocacoes } from '../../core/invocacoesFamiliar';
import {
  formasFamiliarMortoVivoElegiveis as formasFamiliarMortoVivoElegiveisNecro,
  bonusLegiaoDosMortos,
  petsMortoVivo,
  personagemEnsanguentado,
  opcoesColheitaDosMortos,
  bonusPvTempMestreDaMorte,
  algumMortoVivoEm0PV,
} from '../../core/necromante';
import {
  alternarDuasMaosVersatil,
  desequiparItem as desequiparItemPuro,
  equiparNoSlot,
  resumoEquipado,
  type SlotEquipamento,
} from '../../core/equipamento';
import { ataqueAtual, ataqueBonusMaoSecundaria } from '../../core/ataque';
import { alternarSintonizacao } from '../../core/sintonizacao';
import { armaDePactoAtual, vincularArmaDePacto, desvincularArmaDePacto, ataqueExtraDoPactoDaLamina } from '../../core/pactoDaLamina';
import { armasParaMaestria as listarArmasParaMaestria } from '../../core/maestriaArma';
import { quantidadeRecuperarFolego } from '../../core/recursosClasse';
import { personagemConjura } from '../../core/conjuracao';
import { magiasGratisDasInvocacoes, type MagiaGratisDeInvocacao } from '../../core/invocacoesMagiaGratis';
import { aplicarAlteracaoPv, ganharPvTemporario } from '../../core/pvTemporario';
import { deveAplicarVigorImplacavel } from '../../core/vigorImplacavel';
import { tipoDanoSubescolha, opcoesEscolhaReutilizavel } from '../../core/especieSubescolha';
import { dadosAtaqueDeSopro } from '../../core/ataqueDeSopro';
import { calcularSentidos } from '../../core/sentidos';
import { valorBencaoDoTenebroso } from '../../core/bencaoDoTenebroso';
import { magiasPactoDoInfero } from '../../core/magiasPactoDoInfero';
import { truquesEspecie, magiasEspecie as magiasEspecieDoPersonagem } from '../../core/magiasEspecie';
import { truquesMagiaIniciada, magiasMagiaIniciada } from '../../core/magiaTalentoOrigem';
import {
  truquesTalentoGeral,
  magiasSempreTalentoGeral,
  magiasGratisDosTalentosGerais,
  temRitualRapido,
  CHAVE_RITUAL_RAPIDO,
  type MagiaGratisDeTalentoGeral,
} from '../../core/magiaTalentoGeral';
import { acoesConvertidasEmBonus } from '../../core/periciaTalentoGeral';
import { temPerfurador } from '../../core/rerollDanoTalento';
import { acoesBase } from '../../data/exampleCombat';
import { usosSorteDoTenebroso } from '../../core/sorteDoTenebroso';
import { armaduraSemTreinamentoEquipada } from '../../core/proficienciaArmadura';
import { useRoll } from '../roll/RollContext';
import { sortearLevelUpRapido } from '../../core/levelUpAleatorio';
import { podeLevelUpPorXp, proximoMarcoXp } from '../../core/experiencia';
import { espacosARecuperar } from '../../core/astuciaMagica';
import {
  espacosDeMagiaAtivos,
  ehMagiaDeReacao,
  modAcertoConjuracao as calcularModAcertoConjuracao,
  truquesDoPersonagem,
  magiasPreparadasDoPersonagem,
  deficitTruques,
  deficitMagiasPreparadas,
  magiasDisponiveisParaPreparar,
  poolDescobertasMagicas,
  usaRedefinicaoPorDescanso,
  espacosCombinadosComoAtivos,
  type PoolDePonte,
} from '../../core/magiasPersonagem';
import { usosInspiracaoMaximo, dadoInspiracao, fonteDeInspiracaoDesbloqueada } from '../../core/inspiracaoBardo';
import {
  caracteristicaDesbloqueada,
  caracteristicaSubclasseDesbloqueada,
  contarRepeticoesCaracteristica,
  numeroDeAtaques,
} from '../../core/levelUp';
import { ID_CARACTERISTICA_SUBCLASSE } from '../../data/rulesets/dnd2024/idsCaracteristicasSubclasse';
import { estilosDeLuta } from '../../data/rulesets/dnd2024/estilosDeLuta';
import { armaduras } from '../../data/rulesets/dnd2024/armaduras';
import { origens } from '../../data/rulesets/dnd2024/origens';
import { especies } from '../../data/rulesets/dnd2024/especies';
import { magias, magiasDaClasse, type Magia } from '../../data/rulesets/dnd2024/magias';
import AvatarMenu from './AvatarMenu';
import styles from './FichaShell.module.css';
import AtributosTab from './tabs/AtributosTab';
import PerfilTab from './tabs/PerfilTab';
import MochilaTab from './tabs/MochilaTab';
import MagiasTab from './tabs/MagiasTab';
import CombatTab, { type EstadoRecurso, type RecursoTurno } from './tabs/CombatTab';
import PetsTab from './tabs/PetsTab';
import AjustarPetShell from './pets/AjustarPetShell';
import ColheitaMacabraModal from '../components/ColheitaMacabraModal';
import Dice3dFab from './dice3d/Dice3dFab';
import LevelUpShell, { type PersonagemNivel } from './levelup/LevelUpShell';
import CompletarMagiasShell from './levelup/CompletarMagiasShell';
import LivroDasSombrasShell from './levelup/LivroDasSombrasShell';
import MemorizarMagiaShell from './levelup/MemorizarMagiaShell';
import DescansoOverlay, { type FaseDescanso, type TipoDescanso } from './DescansoOverlay';
import XpShell from './XpShell';

type TabName = 'atributos' | 'perfil' | 'mochila' | 'magias' | 'combat' | 'pets';

/** Nome do "Falar com Animais" concedido pelo Gnomo do Bosque — ver
 * comentário em `magias.ts` (id "falarcomanimais-gnomo") sobre por que
 * é uma entrada separada da magia normal. */
const NOME_FALAR_COM_ANIMAIS_GNOMO = 'Falar com Animais - Traço de Gnomo';

const TABS: { id: TabName; label: string; icon: string }[] = [
  { id: 'atributos', label: 'Atributos', icon: '🧬' },
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'mochila', label: 'Mochila', icon: '🎒' },
  { id: 'magias', label: 'Magias', icon: '📖' },
  { id: 'combat', label: 'Combate', icon: '⚔' },
  { id: 'pets', label: 'Pets', icon: '🐾' },
];

const turnoInicial: Record<RecursoTurno, EstadoRecurso> = {
  acao: 'disponivel',
  bonus: 'disponivel',
  reacao: 'disponivel',
};

export default function FichaShell() {
  const navigate = useNavigate();
  const { id } = useParams();
  const personagemSalvo = id === ID_PERSONAGEM_DEMO ? garantirPersonagemDemo() : id ? armazenamentoPersonagens.buscar(id) : null;

  if (!personagemSalvo) {
    return (
      <div className={styles.screen}>
        <div className={styles.header}>
          <span className="back" onClick={() => navigate('/lista')}>
            ←
          </span>
          <div className={styles.name}>Personagem não encontrado</div>
        </div>
        <div className="label" style={{ padding: 16 }}>
          Esse personagem não existe (ou foi salvo num navegador diferente — o armazenamento hoje é só local,
          nuvem entra mais pra frente). Volte pra lista e escolha outro.
        </div>
      </div>
    );
  }

  return <FichaConteudo personagemSalvo={personagemSalvo} />;
}

function FichaConteudo({ personagemSalvo }: { personagemSalvo: PersonagemSalvo }) {
  const navigate = useNavigate();
  const { registrarBonusExtra, registrarSorte, registrarInspiracaoHeroica, estado: rollEmAndamento } = useRoll();
  const [selecao, setSelecao] = useState<WizardSelection>(personagemSalvo.selecao);

  // Multiclasse (Fase M2/M3, ver EmDevB.md e SDD Multiclasse) —
  // `classesAtual` é a fonte de verdade de nível por classe;
  // `classeAtivaNome` decide qual classe está "em foco" na ficha agora
  // (Truques/Magias/recursos de classe, e qual classe o Level Up vai
  // aplicar). Pra 100% dos personagens de hoje (1 classe só),
  // `classeAtivaNome` sempre bate com essa única classe — nada muda.
  const [classesAtual, setClassesAtual] = useState<PersonagemClasse[]>(() => classesDoPersonagem(personagemSalvo));
  const [classeAtivaNome, setClasseAtivaNome] = useState<string>(
    () => personagemSalvo.classeAtivaAtual ?? classesDoPersonagem(personagemSalvo)[0]?.classe ?? '',
  );
  const classeAtivaEntry = classesAtual.find((c) => c.classe === classeAtivaNome);
  const nivelTotalAtual = nivelTotalPersonagem(classesAtual);

  const classe = catalogoClasses.find((c) => c.nome === classeAtivaNome) ?? classeDaSelecao(selecao);
  // Proficiência de arma/armadura NÃO segue a classe ativa (pill de
  // exibição) — segue "classe original" (a primeira, com o pacote de
  // nível 1 completo, sempre `classesAtual[0]`) + qualquer OUTRA classe
  // multiclassada depois dela (pacote reduzido, SDD Multiclasse seção
  // 6) — mesmo que o jogador esteja com a classe original "em foco" ou
  // não. Sem essa distinção, trocar a pill pra classe nova faria o
  // personagem "perder" proficiência de arma/armadura que ele já tinha
  // de verdade desde o nível 1.
  const classeOriginalNome = classesAtual[0]?.classe;
  const classeOriginal = catalogoClasses.find((c) => c.nome === classeOriginalNome) ?? classe;
  const classesMulticlassadasNomes = classesAtual.filter((c) => c.classe !== classeOriginalNome).map((c) => c.classe);
  const conValor = selecao.atributos.CON;

  const [tab, setTab] = useState<TabName>('atributos');
  const [pvMax, setPvMax] = useState(personagemSalvo.pvMax ?? calcularPvMaximoNivel1(selecao) ?? personagemSalvo.pvAtual);
  const [estiloDeLutaAtivo, setEstiloDeLutaAtivo] = useState<string | null>(
    personagemSalvo.estiloDeLutaAtual ?? selecao.estiloDeLutaEscolhido,
  );
  const [periciasMulticlasseAtuais, setPericiasMulticlasseAtuais] = useState<string[]>(
    personagemSalvo.periciasMulticlasseAtual ?? [],
  );
  const [ferramentasMulticlasseAtuais, setFerramentasMulticlasseAtuais] = useState<string[]>(
    personagemSalvo.ferramentasMulticlasseAtual ?? [],
  );
  const [escolhendoClasseLevelUp, setEscolhendoClasseLevelUp] = useState(false);
  // Objeto derivado (não é state) — nível/subclasse vêm da classe ATIVA
  // (`classeAtivaEntry`); PV máximo/mod. CON/bônus fixo por nível são
  // do personagem inteiro, iguais pra qualquer classe em foco.
  const personagem: PersonagemNivel = {
    nivel: classeAtivaEntry?.nivel ?? 0,
    pvMax,
    dadoVida: classe?.dadoDeVida ?? 'd8',
    conMod: conValor !== null ? modificador(conValor) : 0,
    subclasse: classeAtivaEntry?.subclasse ?? null,
    estiloDeLuta: estiloDeLutaAtivo,
    bonusPvPorNivel: bonusPvPorNivelDaEspecie(selecao) + bonusPvPorNivelDoTalento(selecao),
    bonusPvPorNivelLabel: rotulosBonusPvPorNivel(selecao).join(' + '),
  };
  const [pvAtual, setPvAtual] = useState(personagemSalvo.pvAtual);
  const [pvTemporario, setPvTemporario] = useState(personagemSalvo.pvTemporarioAtual ?? 0);
  const [maestriaArma, setMaestriaArma] = useState<string[]>(personagemSalvo.maestriaArmaAtual ?? selecao.maestriaArmaEscolhida);
  const [truquesAtuais, setTruquesAtuais] = useState<string[]>(personagemSalvo.truquesAtual ?? selecao.truquesEscolhidos);
  const [magiasPreparadasAtuais, setMagiasPreparadasAtuais] = useState<string[]>(
    personagemSalvo.magiasPreparadasAtual ?? selecao.magiasPreparadasEscolhidas,
  );
  const [livroDeMagiasAtuais, setLivroDeMagiasAtuais] = useState<string[]>(
    personagemSalvo.livroDeMagiasAtual ?? selecao.livroDeMagiasEscolhido,
  );
  const [invocacoesMisticasAtuais, setInvocacoesMisticasAtuais] = useState<string[]>(
    personagemSalvo.invocacoesMisticasAtual ?? selecao.invocacoesMisticasEscolhidas,
  );
  const [periciasEspecialistaAtuais, setPericiasEspecialistaAtuais] = useState<string[]>(
    personagemSalvo.periciasEspecialistaAtual ?? [],
  );
  const [periciasSubclasseBonusAtuais, setPericiasSubclasseBonusAtuais] = useState<string[]>(
    personagemSalvo.periciasSubclasseBonusAtual ?? [],
  );
  const [periciasTalentoGeralAtuais, setPericiasTalentoGeralAtuais] = useState<string[]>(
    personagemSalvo.periciasTalentoGeralAtual ?? [],
  );
  const [magiasDescobertasMagicasAtuais, setMagiasDescobertasMagicasAtuais] = useState<string[]>(
    personagemSalvo.magiasDescobertasMagicasAtual ?? [],
  );
  const [livroDasSombrasAtuais, setLivroDasSombrasAtuais] = useState<string[]>(
    personagemSalvo.livroDasSombrasAtual ?? [...selecao.livroDasSombrasTruques, ...selecao.livroDasSombrasMagias],
  );
  const [livroDasSombrasGasto, setLivroDasSombrasGasto] = useState<boolean>(personagemSalvo.livroDasSombrasGasto ?? false);
  /** "Memorizar Magia" (Mago, nível 5+) — 1x por Descanso Curto, reseta
   * em `descansoCurto`/`descansoLongo` (mesmo padrão de Livro das
   * Sombras — reseta nos dois, não só num). */
  const [memorizarMagiaGasta, setMemorizarMagiaGasta] = useState<boolean>(personagemSalvo.memorizarMagiaGasta ?? false);
  const [magiasGratisGastas, setMagiasGratisGastas] = useState<string[]>(
    personagemSalvo.magiasGratisInvocacoesGastas ?? [],
  );
  const [talentosGeraisAtuais, setTalentosGeraisAtuais] = useState<string[]>(personagemSalvo.talentosGeraisAtual ?? []);
  // Escolha de magia por escola restrita (Tocado pela Sombra/Fadas) —
  // ver `core/magiaTalentoGeral.ts`.
  const [escolhaMagiaTalentoGeral, setEscolhaMagiaTalentoGeral] = useState<Record<string, string[]>>(
    personagemSalvo.escolhaMagiaTalentoGeral ?? {},
  );
  const [talentosFavoritos, setTalentosFavoritos] = useState<string[]>(personagemSalvo.talentosFavoritosAtual ?? []);
  const [folegoGasto, setFolegoGasto] = useState(personagemSalvo.folegoGasto ?? 0);
  const [vigorImplacavelGasto, setVigorImplacavelGasto] = useState(personagemSalvo.vigorImplacavelGasto ?? false);
  const [conhecimentoDePedrasGasto, setConhecimentoDePedrasGasto] = useState(personagemSalvo.conhecimentoDePedrasGasto ?? 0);
  const [picoDeAdrenalinaGasto, setPicoDeAdrenalinaGasto] = useState(personagemSalvo.picoDeAdrenalinaGasto ?? 0);
  const [ataqueDeSoproGasto, setAtaqueDeSoproGasto] = useState(personagemSalvo.ataqueDeSoproGasto ?? 0);
  const [vooDraconicoGasto, setVooDraconicoGasto] = useState(personagemSalvo.vooDraconicoGasto ?? false);
  const [ancestralidadeGiganteGasto, setAncestralidadeGiganteGasto] = useState(
    personagemSalvo.ancestralidadeGiganteGasto ?? 0,
  );
  const [formaGrandeGasto, setFormaGrandeGasto] = useState(personagemSalvo.formaGrandeGasto ?? false);
  const [formaGrandeAtiva, setFormaGrandeAtiva] = useState(personagemSalvo.formaGrandeAtiva ?? false);
  const [maosCurativasGasto, setMaosCurativasGasto] = useState(personagemSalvo.maosCurativasGasto ?? false);
  const [revelacaoCelestialGasto, setRevelacaoCelestialGasto] = useState(personagemSalvo.revelacaoCelestialGasto ?? false);
  const [revelacaoCelestialFormaAtiva, setRevelacaoCelestialFormaAtiva] = useState(
    personagemSalvo.revelacaoCelestialFormaAtiva ?? null,
  );
  const [falarComAnimaisGnomoGasto, setFalarComAnimaisGnomoGasto] = useState(
    personagemSalvo.falarComAnimaisGnomoGasto ?? 0,
  );
  const [inspiracaoHeroicaAtiva, setInspiracaoHeroicaAtiva] = useState(personagemSalvo.inspiracaoHeroicaAtiva ?? false);
  const [indomavelGasto, setIndomavelGasto] = useState(personagemSalvo.indomavelGasto ?? 0);
  const [pontosDeSorteGasto, setPontosDeSorteGasto] = useState(personagemSalvo.pontosDeSorteGasto ?? 0);
  const [sorteDoTenebrosoGasto, setSorteDoTenebrosoGasto] = useState(personagemSalvo.sorteDoTenebrosoGasto ?? 0);
  const [resistenciaInferaAtual, setResistenciaInferaAtual] = useState<string | null>(
    personagemSalvo.resistenciaInferaAtual ?? null,
  );
  const [resistenciaInferaGasto, setResistenciaInferaGasto] = useState(personagemSalvo.resistenciaInferaGasto ?? false);
  const [lancarNoInfernoGasto, setLancarNoInfernoGasto] = useState(personagemSalvo.lancarNoInfernoGasto ?? false);
  const [surtoGasto, setSurtoGasto] = useState(personagemSalvo.surtoGasto ?? 0);
  const [inspiracaoGasto, setInspiracaoGasto] = useState(personagemSalvo.inspiracaoGasto ?? 0);
  const [astuciaMagicaGasta, setAstuciaMagicaGasta] = useState(personagemSalvo.astuciaMagicaGasta ?? false);
  const [contatarPatronoGasto, setContatarPatronoGasto] = useState(personagemSalvo.contatarPatronoGasto ?? false);
  const [arcanaMisticaAtuais, setArcanaMisticaAtuais] = useState<Record<number, string>>(
    personagemSalvo.arcanaMisticaAtual ?? {},
  );
  const [arcanaMisticaGastos, setArcanaMisticaGastos] = useState<number[]>(personagemSalvo.arcanaMisticaGastos ?? []);
  const [surtoUsadoTurno, setSurtoUsadoTurno] = useState(personagemSalvo.surtoUsadoTurnoAtual ?? false);
  const [restStatus, setRestStatus] = useState<string | null>(null);
  const [turnState, setTurnState] = useState<Record<RecursoTurno, EstadoRecurso>>(
    personagemSalvo.turnStateAtual ?? turnoInicial,
  );
  // Espaços de Magia gastos — SEPARADOS por classe (Fase M4b,
  // multiclasse): 2 classes podem ter espaço do MESMO número de
  // círculo ao mesmo tempo (ex: Bruxo com Pacto no 2º círculo + Mago
  // com Espaços de Magia normais também no 2º) — sem separar por
  // classe, gastar um descontava do outro por engano. Chave externa =
  // nome da classe; `espacosGastosPorCirculo` (const derivada logo
  // abaixo) é só a "fatia" da classe ATIVA, pro resto do código
  // continuar lendo exatamente como sempre leu.
  const [espacosGastosPorClasseECirculo, setEspacosGastosPorClasseECirculo] = useState<Record<string, Record<number, number>>>(
    () => {
      if (personagemSalvo.espacosGastosPorClasseECirculo) return personagemSalvo.espacosGastosPorClasseECirculo;
      const classeOriginalNomeInit = classesAtual[0]?.classe;
      if (!classeOriginalNomeInit) return {};
      // Migração de personagem salvo ANTES do M4b — só existia 1
      // classe, então o dict antigo (por círculo só) inteiro pertence
      // a ela.
      if (personagemSalvo.espacosGastosPorCirculo) {
        return { [classeOriginalNomeInit]: personagemSalvo.espacosGastosPorCirculo };
      }
      // Migração de personagem salvo antes da Etapa 4.2 (só existia 1
      // círculo simultâneo possível) — o valor antigo vira o gasto do
      // círculo que já estava ativo na época.
      if (personagemSalvo.espacosGastos) {
        const circuloAntigo = espacosDeMagiaAtivos(classeDaSelecao(selecao), personagemSalvo.nivel)[0]?.circulo;
        if (circuloAntigo !== undefined) {
          return { [classeOriginalNomeInit]: { [circuloAntigo]: personagemSalvo.espacosGastos } };
        }
      }
      return {};
    },
  );
  const espacosGastosPorCirculo = espacosGastosPorClasseECirculo[classeAtivaNome] ?? {};
  /** Atualiza o pool de espaços gastos de UMA classe específica (default
   * = classe ativa) — usado pela ponte do Bruxo (M4b) pra gastar/
   * devolver espaço de uma classe DIFERENTE da que está em foco agora. */
  function atualizarEspacosGastos(
    atualizador: (prev: Record<number, number>) => Record<number, number>,
    classeNome: string = classeAtivaNome,
  ) {
    setEspacosGastosPorClasseECirculo((prev) => ({ ...prev, [classeNome]: atualizador(prev[classeNome] ?? {}) }));
  }
  const [itensMochila, setItensMochila] = useState<ItemMochila[]>(
    personagemSalvo.itensMochilaAtual ?? calcularItensIniciais(selecao),
  );
  const [pets, setPets] = useState<Pet[]>(personagemSalvo.petsAtual ?? []);
  const [ajustarPetAberto, setAjustarPetAberto] = useState(false);
  /** Colheita Macabra (Necromante) — mora aqui (não dentro da aba
   * Magias/Combate) pra sobreviver à troca de aba e aparecer igual
   * não importa de onde a magia foi conjurada, ver
   * `ColheitaMacabraModal.tsx`. */
  const [colheitaMacabraPendente, setColheitaMacabraPendente] = useState<{ cura: number } | null>(null);
  const [levelUpAberto, setLevelUpAberto] = useState(false);
  const [completarAberto, setCompletarAberto] = useState<'truques' | 'magiasPreparadas' | null>(null);
  const [livroDasSombrasAberto, setLivroDasSombrasAberto] = useState(false);
  const [memorizarMagiaAberto, setMemorizarMagiaAberto] = useState(false);
  /** Transição de Descanso (fade + prompt de redefinir Magias
   * Preparadas no Descanso Longo) — ver `DescansoOverlay.tsx` e
   * `iniciarDescanso`/`aoFadeInCompleto` abaixo. `null` = nenhuma
   * transição em andamento (telas normais). `'escolhendoMagias'` é uma
   * fase própria do `FichaShell` (não do overlay — ver `DescansoOverlay`),
   * enquanto a tela de redefinição livre (`MemorizarMagiaShell`, modo
   * `'livre'`) está aberta por cima. */
  const [descansoEmAndamento, setDescansoEmAndamento] = useState<{
    tipo: TipoDescanso;
    fase: FaseDescanso | 'escolhendoMagias';
  } | null>(null);
  const [levelUpHpModo, setLevelUpHpModo] = useState<'media' | 'rolar' | 'manual' | null>(
    personagemSalvo.levelUpHpModo ?? null,
  );
  const [levelUpHpRolado, setLevelUpHpRolado] = useState<number | null>(personagemSalvo.levelUpHpRolado ?? null);
  const [xpAtual, setXpAtual] = useState(personagemSalvo.xpAtual ?? 0);
  const [xpPopupAberto, setXpPopupAberto] = useState(false);
  const [itensDetalhados, setItensDetalhados] = useColapsavel('itens-detalhados', false);
  const [pesoAtivo, setPesoAtivo] = useState(true);

  const desValor = valorFinalAtributo(selecao, 'DES') ?? 10;
  // Talentos que entram no cálculo (Fase 4): os escolhidos em Level
  // Up (`talentosGeraisAtuais`) MAIS o Talento de Origem, ganho fixo
  // na criação (ex: Alerta) — nunca passa pelo picker de Level Up,
  // então não vive em `talentosGeraisAtuais` — MAIS o talento pego
  // pelo traço Versátil (Humano), mesmo motivo.
  const origemPersonagem = origens.find((o) => o.nome === selecao.origem) ?? null;
  const talentosEfetivos = [
    ...talentosGeraisAtuais,
    ...(origemPersonagem ? [origemPersonagem.talentoOrigemId] : []),
    ...(selecao.talentoEspecieEscolhido ? [selecao.talentoEspecieEscolhido] : []),
  ];
  const ca = calcularCAEquipado(itensMochila, desValor, personagem.estiloDeLuta, talentosEfetivos, classeOriginal, classesMulticlassadasNomes);
  // Penalidade de proficiência de Armadura (SDD "Penalidades por Falta
  // de Proficiência") — Desvantagem em D20 de Força/Destreza sempre
  // que a armadura equipada (Leve/Média/Pesada) não tiver treinamento;
  // consumido por AtributosTab (atributo/perícia/Iniciativa) e
  // CombatTab/AcaoPanelContent (ataques, Iniciativa do painel).
  const itemArmaduraEquipada = itensMochila.find((it) => it.slot === 'armadura');
  const armaduraEquipadaCatalogo = itemArmaduraEquipada
    ? armaduras.find((a) => a.nome === itemArmaduraEquipada.nome)
    : undefined;
  const desvantagemForcaDestreza = armaduraSemTreinamentoEquipada(classeOriginal, armaduraEquipadaCatalogo, talentosEfetivos, classesMulticlassadasNomes);
  const iniciativa = calcularIniciativa(selecao, classe, nivelTotalAtual, talentosEfetivos);
  const percepcaoPassiva = calcularPercepcaoPassiva(selecao, nivelTotalAtual);
  const atributos = calcularAtributosFinais(selecao);
  const atributosFinaisAtuais = Object.fromEntries(
    atributosOrdem.map((a) => [a, valorFinalAtributo(selecao, a) ?? 10]),
  ) as Record<Atributo, number>;
  const pericias = calcularPericias(
    selecao,
    personagem.nivel,
    periciasEspecialistaAtuais,
    [...periciasSubclasseBonusAtuais, ...periciasTalentoGeralAtuais, ...periciasMulticlasseAtuais],
    nivelTotalAtual,
  );
  const proficienciasFerramenta = calcularProficienciasFerramenta(selecao, nivelTotalAtual, ferramentasMulticlasseAtuais);
  const bonusProficienciaAtual = classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const capacidadeMaxima = calcularCapacidadeMaxima(selecao, formaGrandeAtiva);
  const explicacaoCapacidadeMaxima = explicarCapacidadeMaxima(selecao, formaGrandeAtiva);
  const explicacaoPv = explicarPvMaximo(selecao, personagem.pvMax);
  const explicacaoCa = explicarCAEquipado(itensMochila, desValor, personagem.estiloDeLuta, talentosEfetivos, classeOriginal, classesMulticlassadasNomes);
  const explicacaoIniciativa = explicarIniciativa(selecao, classe, nivelTotalAtual, talentosEfetivos);
  const explicacaoPercepcaoPassiva = explicarPercepcaoPassiva(selecao, nivelTotalAtual);
  const estiloDeLuta = estilosDeLuta.find((e) => e.nome === personagem.estiloDeLuta) ?? null;
  const usosFolegoMaximo = classe ? quantidadeRecuperarFolego(classe, personagem.nivel) : 0;
  const usosFolegoRestantes = Math.max(0, usosFolegoMaximo - folegoGasto);
  const temVigorImplacavel = selecao.especie === 'Orc';
  const usosConhecimentoDePedrasMaximo = selecao.especie === 'Anão' && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosConhecimentoDePedrasRestantes = Math.max(0, usosConhecimentoDePedrasMaximo - conhecimentoDePedrasGasto);
  const usosPicoDeAdrenalinaMaximo = selecao.especie === 'Orc' && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosPicoDeAdrenalinaRestantes = Math.max(0, usosPicoDeAdrenalinaMaximo - picoDeAdrenalinaGasto);
  const especieAtual = especies.find((e) => e.nome === selecao.especie) ?? null;
  const ataqueDeSoproDisponivel = selecao.especie === 'Draconato';
  const usosAtaqueDeSoproMaximo = ataqueDeSoproDisponivel && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosAtaqueDeSoproRestantes = Math.max(0, usosAtaqueDeSoproMaximo - ataqueDeSoproGasto);
  const conValorFinal = valorFinalAtributo(selecao, 'CON') ?? 10;
  const cdAtaqueDeSopro = 8 + modificador(conValorFinal) + bonusProficienciaAtual;
  const numDadosAtaqueDeSopro = dadosAtaqueDeSopro(nivelTotalAtual);
  const tipoDanoAtaqueDeSopro = especieAtual ? tipoDanoSubescolha(especieAtual, selecao) : null;
  const vooDraconicoDisponivel = selecao.especie === 'Draconato' && nivelTotalAtual >= 5;
  const ancestralidadeGiganteEscolhida = selecao.especie === 'Golias' ? selecao.subescolhaEspecieEscolhida : null;
  const usosAncestralidadeGiganteMaximo =
    ancestralidadeGiganteEscolhida && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosAncestralidadeGiganteRestantes = Math.max(0, usosAncestralidadeGiganteMaximo - ancestralidadeGiganteGasto);
  const formaGrandeDisponivel = selecao.especie === 'Golias' && nivelTotalAtual >= 5;
  const modConstituicaoAtual = modificador(conValorFinal);
  const maosCurativasDisponivel = selecao.especie === 'Aasimar';
  const dadosMaosCurativas = bonusProficienciaAtual;
  const revelacaoCelestialDisponivel = selecao.especie === 'Aasimar' && nivelTotalAtual >= 3;
  const opcoesRevelacaoCelestial = especieAtual ? opcoesEscolhaReutilizavel(especieAtual) ?? [] : [];
  const danoBonusRevelacaoCelestial = bonusProficienciaAtual;
  const carValorFinal = valorFinalAtributo(selecao, 'CAR') ?? 10;
  const cdMantoNecrotico = 8 + modificador(carValorFinal) + bonusProficienciaAtual;
  const falarComAnimaisGnomoDisponivel =
    selecao.especie === 'Gnomo' && selecao.subescolhaEspecieEscolhida === 'Gnomo do Bosque';
  const usosFalarComAnimaisGnomoMaximo =
    falarComAnimaisGnomoDisponivel && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosFalarComAnimaisGnomoRestantes = Math.max(0, usosFalarComAnimaisGnomoMaximo - falarComAnimaisGnomoGasto);
  const conjura = personagemConjura(classe, selecao, talentosEfetivos);
  const espacos = espacosDeMagiaAtivos(classe, personagem.nivel);
  // Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — só quando o
  // personagem tem Bruxo E outra classe conjuradora ao mesmo tempo.
  // `outraClasseComConjuracao` é a "outra" (não a ativa agora) — com
  // só 2 classes possíveis hoje (4 classes implementadas, Guerreiro
  // nunca conjura), é sempre a única candidata; deixa de existir se
  // um dia o personagem puder ter 3+ classes ao mesmo tempo.
  const outraClasseEntry = classesAtual.find((c) => c.classe !== classeAtivaNome);
  const ponte: PoolDePonte | null =
    temPonteDeMagiaDePacto(classesAtual) && outraClasseEntry
      ? {
          classeNome: outraClasseEntry.classe,
          espacos: espacosDeMagiaAtivos(catalogoClasses.find((c) => c.nome === outraClasseEntry.classe) ?? null, outraClasseEntry.nivel),
          espacosGastosPorCirculo: espacosGastosPorClasseECirculo[outraClasseEntry.classe] ?? {},
        }
      : null;
  // M4c — quando a classe ATIVA é uma das 2+ classes conjuradoras
  // normais combinadas (SDD Multiclasse seção 8.2), o pool exibido/
  // gasto passa a ser o COMBINADO (chave própria "combinado", nunca o
  // da classe isolada) em vez do de cada classe separada — Bruxo nunca
  // entra aqui (Magia de Pacto sempre à parte, mesmo multiclassado).
  const emConjuracaoCombinada = temConjuracaoMulticlasse(classesAtual) && (classeAtivaEntry ? contaNaConjuracaoMulticlasse(classeAtivaEntry) : false);
  const chaveDoPoolDeMagia = emConjuracaoCombinada ? 'combinado' : classeAtivaNome;
  const espacosParaConjurar = emConjuracaoCombinada
    ? espacosCombinadosComoAtivos(espacosMagiaParaNivelCombinado(nivelEquivalenteConjuracaoMulticlasse(classesAtual)) ?? [])
    : espacos;
  const espacosGastosParaConjurar = emConjuracaoCombinada ? (espacosGastosPorClasseECirculo['combinado'] ?? {}) : espacosGastosPorCirculo;
  const truques = truquesDoPersonagem(truquesAtuais);
  const magiasPreparadas = magiasPreparadasDoPersonagem(magiasPreparadasAtuais);
  const magiasDescobertasMagicas = magiasPreparadasDoPersonagem(magiasDescobertasMagicasAtuais);
  const livroDasSombras = magiasPreparadasDoPersonagem(livroDasSombrasAtuais);
  const memorizarMagiaDisponivel = classe ? caracteristicaDesbloqueada(classe, 'Memorizar Magia', personagem.nivel) !== null : false;
  const livroDeMagias = magiasPreparadasDoPersonagem(livroDeMagiasAtuais);
  const usaRedefPorDescanso = usaRedefinicaoPorDescanso(classe);
  const magiasGratisConcedidas = magiasGratisDasInvocacoes(invocacoesMisticasAtuais);
  const formasFamiliarElegiveis = formasFamiliarDasInvocacoes(invocacoesMisticasAtuais);
  const formasFamiliarMortoVivoElegiveis = formasFamiliarMortoVivoElegiveisNecro(personagem.subclasse, personagem.nivel);
  const legiaoDosMortosDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.legiaoDosMortos, personagem.nivel);
  const modIntAtual = atributos.find((a) => a.atributo === 'INT')?.mod ?? 0;
  const colheitaMacabraDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.grimorioDeNecromancia, personagem.nivel);
  const colheitaDosMortosDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.colheitaDosMortos, personagem.nivel);
  const personagemEstaEnsanguentado = personagemEnsanguentado(pvAtual, personagem.pvMax);
  const opcoesColheitaDosMortosAtuais = opcoesColheitaDosMortos(pets, personagem.nivel);
  const mestreDaMorteDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.mestreDaMorte, personagem.nivel);
  const pvTempMestreDaMorteAtual = mestreDaMorteDisponivel ? bonusPvTempMestreDaMorte(personagem.nivel) : 0;
  const petsMortoVivoAtuais = petsMortoVivo(pets);
  const mestreDaMorteExplosaoLiberadaAtual = algumMortoVivoEm0PV(pets);
  const astuciaMagicaDisponivel = classe ? caracteristicaDesbloqueada(classe, 'Astúcia Mágica', personagem.nivel) !== null : false;
  const contatarPatronoDisponivel = classe ? caracteristicaDesbloqueada(classe, 'Contatar Patrono', personagem.nivel) !== null : false;
  const contatoExtraplanar = magias.find((m) => m.nome === 'Contato Extraplanar') ?? null;
  const arcanaMisticaEscolhidas = Object.entries(arcanaMisticaAtuais)
    .map(([circulo, nomeMagia]) => ({ circulo: Number(circulo), magia: magias.find((m) => m.nome === nomeMagia) ?? null }))
    .filter((item): item is { circulo: number; magia: Magia } => item.magia !== null)
    .sort((a, b) => a.circulo - b.circulo);
  const mestreMisticoDisponivel = classe ? caracteristicaDesbloqueada(classe, 'Mestre Místico', personagem.nivel) !== null : false;
  const espacoPactoAtual = espacos[0] ?? null;
  const espacosGastosPacto = espacoPactoAtual ? (espacosGastosPorCirculo[espacoPactoAtual.circulo] ?? 0) : 0;
  const astuciaMagicaRecupera = espacoPactoAtual
    ? espacosARecuperar(espacoPactoAtual.maximo, espacosGastosPacto, mestreMisticoDisponivel)
    : 0;
  const sentidos = calcularSentidos(selecao.especie, invocacoesMisticasAtuais, selecao.subescolhaEspecieEscolhida);
  const faltamTruques = deficitTruques(classe, personagem.nivel, truquesAtuais);
  const faltamMagiasPreparadas = deficitMagiasPreparadas(classe, personagem.nivel, magiasPreparadasAtuais);
  // Descobertas Mágicas/Livro das Sombras contam como magia sempre
  // preparada (fora do limite normal) — entram no que dá pra conjurar
  // em combate, mas são arrays PRÓPRIOS separados, só unidos aqui pra
  // montar a lista de "o que aparece nos painéis de Ação/Reação".
  const magiasPactoDoInferoDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.magiasDePactoDoInfero, personagem.nivel);
  const magiasPactoDoInferoAtuais = magiasPactoDoInferoDisponivel ? magiasPactoDoInfero(personagem.nivel) : [];
  const magiasPactoDoInferoPreparadas = magiasPreparadasDoPersonagem(magiasPactoDoInferoAtuais);
  // Truques + magias fixas da Linhagem Élfica/Gnômica (e futuramente
  // Legado Ínfero) — gatilho é nível de PERSONAGEM, não de classe
  // (espécie não tem classe própria), ver `core/magiasEspecie.ts`.
  const magiasEspecieAtuais = [
    ...truquesEspecie(selecao),
    ...magiasEspecieDoPersonagem(selecao, nivelTotalAtual),
  ];
  const magiasEspeciePreparadas = magiasPreparadasDoPersonagem(magiasEspecieAtuais);
  // "Falar com Animais - Traço de Gnomo" sai da lista genérica de
  // conjuração (que sempre exige gastar Espaço de Magia de verdade) —
  // ela tem card e contador PRÓPRIOS no painel Ação (usos = Bônus de
  // Proficiência, grátis, ver `usarFalarComAnimaisGnomo` abaixo), mas
  // continua aparecendo em "Magias da Espécie" na aba Magias
  // (`magiasEspecieAtuais`, sem filtro) só como referência.
  const magiasEspeciePreparadasConjuraveis = magiasEspeciePreparadas.filter(
    (m) => m.nome !== NOME_FALAR_COM_ANIMAIS_GNOMO,
  );
  // Talento de Origem "Iniciado em Magia" (Acólito/Guia/Sábio) — fixo
  // desde a criação, ver `core/magiaTalentoOrigem.ts`.
  const magiasTalentoOrigemAtuais = [...truquesMagiaIniciada(selecao), ...magiasMagiaIniciada(selecao)];
  const magiasTalentoOrigemPreparadas = magiasPreparadasDoPersonagem(magiasTalentoOrigemAtuais);
  // Pra Substituição de Magia no Level Up (ver LevelUpShell) — só
  // preenchido quando a gaveta correspondente realmente tem algo
  // escolhido (a lista e a magia sempre são preenchidas juntas).
  const magiaIniciadaOrigemAtual =
    origemPersonagem?.talentoOrigemVariante && selecao.magiaMagiaIniciadaEscolhida
      ? { lista: origemPersonagem.talentoOrigemVariante, magia: selecao.magiaMagiaIniciadaEscolhida }
      : null;
  const magiaIniciadaEspecieAtual =
    selecao.listaMagiaIniciadaEspecieEscolhida && selecao.magiaMagiaIniciadaEspecieEscolhida
      ? { lista: selecao.listaMagiaIniciadaEspecieEscolhida, magia: selecao.magiaMagiaIniciadaEspecieEscolhida }
      : null;
  // Talentos Gerais com magia FIXA (sem escolha, Telecinético/
  // Telepático) e/ou escolhida por escola (Tocado pela Sombra/Fadas)
  // — ver `core/magiaTalentoGeral.ts`.
  const magiasTalentoGeralAtuais = [
    ...truquesTalentoGeral(talentosEfetivos),
    ...magiasSempreTalentoGeral(talentosEfetivos, escolhaMagiaTalentoGeral),
  ];
  const magiasTalentoGeralPreparadas = magiasPreparadasDoPersonagem(magiasTalentoGeralAtuais);
  const magiasGratisTalentoGeral = magiasGratisDosTalentosGerais(talentosEfetivos, escolhaMagiaTalentoGeral);
  const ritualRapidoDisponivel = temRitualRapido(talentosEfetivos);
  const ritualRapidoGasto = magiasGratisGastas.includes(CHAVE_RITUAL_RAPIDO);
  const nomesAcoesBonusExtras = acoesConvertidasEmBonus(talentosEfetivos);
  const acoesGenericasBonus = acoesBase.filter((a) => nomesAcoesBonusExtras.includes(a.nome));
  const magiasConjuraveis = [
    ...magiasPreparadas,
    ...magiasDescobertasMagicas,
    ...livroDasSombras,
    ...magiasPactoDoInferoPreparadas,
    ...magiasEspeciePreparadasConjuraveis,
    ...magiasTalentoOrigemPreparadas,
    ...magiasTalentoGeralPreparadas,
  ];
  const magiasPreparadasReacao = magiasConjuraveis.filter(ehMagiaDeReacao);
  const magiasPreparadasAcao = magiasConjuraveis.filter((m) => !ehMagiaDeReacao(m));
  const modAcertoConjuracao = calcularModAcertoConjuracao(selecao, classe, nivelTotalAtual);
  const usosInspiracaoMax = usosInspiracaoMaximo(selecao, classe, personagem.nivel);
  const usosInspiracaoRestantes = Math.max(0, usosInspiracaoMax - inspiracaoGasto);
  const tamanhoDadoInspiracao = dadoInspiracao(classe, personagem.nivel);
  const fonteDeInspiracao = fonteDeInspiracaoDesbloqueada(classe, personagem.nivel);
  const numAtaquesBase = classe ? numeroDeAtaques(classe, personagem.nivel) : 1;
  const indomavelMaximo = classe ? contarRepeticoesCaracteristica(classe, 'Indomável', personagem.nivel) : 0;
  const indomavelRestantes = Math.max(0, indomavelMaximo - indomavelGasto);
  const pontosDeSorteDisponivel = efeitoMecanicoDoTalento(talentosEfetivos, 'pontos-de-sorte') !== null;
  const danoDesarmadoRerollDisponivel = efeitoMecanicoDoTalento(talentosEfetivos, 'dado-ataque-desarmado') !== null;
  const perfuradorDisponivel = temPerfurador(talentosEfetivos);
  const pontosDeSorteMaximo = pontosDeSorteDisponivel ? bonusProficienciaAtual : 0;
  const pontosDeSorteRestantes = Math.max(0, pontosDeSorteMaximo - pontosDeSorteGasto);
  const surtoMaximo = classe ? contarRepeticoesCaracteristica(classe, 'Surto de Ação', personagem.nivel) : 0;
  const surtoRestantes = Math.max(0, surtoMaximo - surtoGasto);
  const mestreTatico = classe ? caracteristicaDesbloqueada(classe, 'Mestre Tático', personagem.nivel) : null;
  const ataquesEstudados = classe ? caracteristicaDesbloqueada(classe, 'Ataques Estudados', personagem.nivel) : null;
  const ajusteTatico = classe ? caracteristicaDesbloqueada(classe, 'Ajuste Tático', personagem.nivel) : null;
  const contraEncantamentoDisponivel = classe ? caracteristicaDesbloqueada(classe, 'Contra-Encantamento', personagem.nivel) !== null : false;
  const inspiracaoSuperiorDesbloqueada = classe ? caracteristicaDesbloqueada(classe, 'Inspiração Superior', personagem.nivel) !== null : false;
  const palavrasDeInterrupcaoDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.palavrasDeInterrupcao, personagem.nivel);
  const periciaInigualavelDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.periciaInigualavel, personagem.nivel);
  const bencaoDoTenebrosoDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.bencaoDoTenebroso, personagem.nivel);
  const sorteDoTenebrosoDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.aSorteDoProprioTenebroso, personagem.nivel);
  const resistenciaInferaDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.resistenciaInfera, personagem.nivel);
  const lancarNoInfernoDisponivel = caracteristicaSubclasseDesbloqueada(personagem.subclasse, ID_CARACTERISTICA_SUBCLASSE.lancarNoInferno, personagem.nivel);
  const forMod = atributos.find((a) => a.atributo === 'FOR')?.mod ?? 0;
  const desMod = atributos.find((a) => a.atributo === 'DES')?.mod ?? 0;
  const carMod = atributos.find((a) => a.atributo === 'CAR')?.mod ?? 0;
  const sorteDoTenebrosoMaximo = sorteDoTenebrosoDisponivel ? usosSorteDoTenebroso(carMod) : 0;
  const sorteDoTenebrosoRestantes = Math.max(0, sorteDoTenebrosoMaximo - sorteDoTenebrosoGasto);
  const equipadoAtual = resumoEquipado(itensMochila);
  const armaEquipada = equipadoAtual.maoPrincipal;
  const ataque = classe
    ? ataqueAtual(
        armaEquipada?.nome ?? null,
        classe,
        personagem.nivel,
        forMod,
        desMod,
        armaEquipada?.duasMaosAtivo === true,
        personagem.estiloDeLuta,
        equipadoAtual.maoSecundaria !== null,
        armaEquipada?.armaDePacto ? carMod : undefined,
        talentosEfetivos,
      )
    : null;
  const numAtaques = Math.max(
    numAtaquesBase,
    1 + ataqueExtraDoPactoDaLamina(invocacoesMisticasAtuais, armaEquipada?.armaDePacto === true),
  );
  const ataqueBonus = classe
    ? ataqueBonusMaoSecundaria(
        armaEquipada?.nome ?? null,
        equipadoAtual.maoSecundaria?.nome ?? null,
        classe,
        personagem.nivel,
        forMod,
        desMod,
        personagem.estiloDeLuta,
        talentosEfetivos,
      )
    : null;

  // Salva progresso automaticamente a cada mudança relevante — Level
  // Up, Descanso, troca de arma de Maestria, uso de Recuperar
  // Fôlego/Indomável/Surto de Ação. Sem isso, um F5 na Ficha depois de
  // subir de nível voltava tudo pro estado da criação (só nivel/xp/
  // pvAtual eram salvos, o resto só existia em estado do React).
  // `turnState`/`surtoUsadoTurno` também entram aqui (pedido do Osmar,
  // 2026-09) — sair da Ficha e voltar não deve resetar o turno de
  // combate em andamento; só reseta de propósito ao rolar nova
  // Iniciativa ou tocar "Fim do Turno" (`aoRolarIniciativa`/
  // `fimDoTurno` abaixo). Efeito em si mora em `useAutosavePersonagem`
  // (G3.1, ver EmDevB.md) — aqui só monta o objeto salvo e a lista de
  // dependências, exatamente como antes.
  useAutosavePersonagem(
    {
      ...personagemSalvo,
      selecao,
      nivel: nivelTotalAtual,
      classes: classesAtual,
      classeAtivaAtual: classeAtivaNome,
      periciasMulticlasseAtual: periciasMulticlasseAtuais,
      ferramentasMulticlasseAtual: ferramentasMulticlasseAtuais,
      pvAtual,
      turnStateAtual: turnState,
      surtoUsadoTurnoAtual: surtoUsadoTurno,
      pvMax: personagem.pvMax,
      pvTemporarioAtual: pvTemporario,
      subclasseAtual: personagem.subclasse,
      estiloDeLutaAtual: personagem.estiloDeLuta,
      maestriaArmaAtual: maestriaArma,
      folegoGasto,
      vigorImplacavelGasto,
      conhecimentoDePedrasGasto,
      picoDeAdrenalinaGasto,
      ataqueDeSoproGasto,
      vooDraconicoGasto,
      ancestralidadeGiganteGasto,
      formaGrandeGasto,
      formaGrandeAtiva,
      maosCurativasGasto,
      revelacaoCelestialGasto,
      revelacaoCelestialFormaAtiva,
      falarComAnimaisGnomoGasto,
      inspiracaoHeroicaAtiva,
      indomavelGasto,
      pontosDeSorteGasto,
      sorteDoTenebrosoGasto,
      resistenciaInferaAtual,
      resistenciaInferaGasto,
      lancarNoInfernoGasto,
      surtoGasto,
      espacosGastosPorClasseECirculo,
      inspiracaoGasto,
      truquesAtual: truquesAtuais,
      magiasPreparadasAtual: magiasPreparadasAtuais,
      livroDeMagiasAtual: livroDeMagiasAtuais,
      invocacoesMisticasAtual: invocacoesMisticasAtuais,
      periciasEspecialistaAtual: periciasEspecialistaAtuais,
      periciasSubclasseBonusAtual: periciasSubclasseBonusAtuais,
      periciasTalentoGeralAtual: periciasTalentoGeralAtuais,
      magiasDescobertasMagicasAtual: magiasDescobertasMagicasAtuais,
      livroDasSombrasAtual: livroDasSombrasAtuais,
      livroDasSombrasGasto,
      memorizarMagiaGasta,
      astuciaMagicaGasta,
      contatarPatronoGasto,
      arcanaMisticaAtual: arcanaMisticaAtuais,
      arcanaMisticaGastos,
      magiasGratisInvocacoesGastas: magiasGratisGastas,
      talentosGeraisAtual: talentosGeraisAtuais,
      escolhaMagiaTalentoGeral,
      talentosFavoritosAtual: talentosFavoritos,
      itensMochilaAtual: itensMochila,
      petsAtual: pets,
      levelUpHpModo,
      levelUpHpRolado,
      xpAtual,
    },
    [
      personagemSalvo,
      selecao,
      nivelTotalAtual,
      classesAtual,
      classeAtivaNome,
      periciasMulticlasseAtuais,
      ferramentasMulticlasseAtuais,
      personagem.pvMax,
      pets,
      personagem.subclasse,
      personagem.estiloDeLuta,
      pvAtual,
      turnState,
      surtoUsadoTurno,
      pvTemporario,
      maestriaArma,
      folegoGasto,
      vigorImplacavelGasto,
      conhecimentoDePedrasGasto,
      picoDeAdrenalinaGasto,
      ataqueDeSoproGasto,
      vooDraconicoGasto,
      ancestralidadeGiganteGasto,
      formaGrandeGasto,
      formaGrandeAtiva,
      maosCurativasGasto,
      revelacaoCelestialGasto,
      revelacaoCelestialFormaAtiva,
      falarComAnimaisGnomoGasto,
      inspiracaoHeroicaAtiva,
      indomavelGasto,
      pontosDeSorteGasto,
      sorteDoTenebrosoGasto,
      resistenciaInferaAtual,
      resistenciaInferaGasto,
      lancarNoInfernoGasto,
      surtoGasto,
      espacosGastosPorClasseECirculo,
      inspiracaoGasto,
      truquesAtuais,
      magiasPreparadasAtuais,
      livroDeMagiasAtuais,
      invocacoesMisticasAtuais,
      periciasEspecialistaAtuais,
      periciasSubclasseBonusAtuais,
      periciasTalentoGeralAtuais,
      magiasDescobertasMagicasAtuais,
      livroDasSombrasAtuais,
      livroDasSombrasGasto,
      memorizarMagiaGasta,
      astuciaMagicaGasta,
      contatarPatronoGasto,
      arcanaMisticaAtuais,
      arcanaMisticaGastos,
      magiasGratisGastas,
      talentosGeraisAtuais,
      escolhaMagiaTalentoGeral,
      talentosFavoritos,
      itensMochila,
      levelUpHpModo,
      levelUpHpRolado,
      xpAtual,
    ],
  );

  function toggleFavoritoTalento(id: string) {
    setTalentosFavoritos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function alterarPv(delta: number) {
    const resultado = aplicarAlteracaoPv(pvAtual, personagem.pvMax, pvTemporario, delta);
    if (temVigorImplacavel && deveAplicarVigorImplacavel(pvAtual, resultado.pvAtual, vigorImplacavelGasto)) {
      setPvAtual(1);
      setVigorImplacavelGasto(true);
      setRestStatus('🩸 Vigor Implacável — em vez de cair a 0, você fica com 1 Ponto de Vida (recarrega no Descanso Longo).');
      setPvTemporario(resultado.pvTemporario);
      return;
    }
    setPvAtual(resultado.pvAtual);
    setPvTemporario(resultado.pvTemporario);
  }

  function usarConhecimentoDePedras(): boolean {
    if (usosConhecimentoDePedrasRestantes <= 0) return false;
    setConhecimentoDePedrasGasto((v) => v + 1);
    return true;
  }

  function usarPicoDeAdrenalina(): boolean {
    if (usosPicoDeAdrenalinaRestantes <= 0) return false;
    setPicoDeAdrenalinaGasto((v) => v + 1);
    setPvTemporario((atual) => ganharPvTemporario(atual, bonusProficienciaAtual));
    return true;
  }

  function usarAtaqueDeSopro(): boolean {
    if (usosAtaqueDeSoproRestantes <= 0) return false;
    setAtaqueDeSoproGasto((v) => v + 1);
    return true;
  }

  function usarVooDraconico(): boolean {
    if (vooDraconicoGasto) return false;
    setVooDraconicoGasto(true);
    return true;
  }

  function usarAncestralidadeGigante(): boolean {
    if (usosAncestralidadeGiganteRestantes <= 0) return false;
    setAncestralidadeGiganteGasto((v) => v + 1);
    return true;
  }

  /** Toggle — ligar (1ª vez, gasta o uso) ou desligar (encerrar antes
   * do Descanso Longo, sem devolver o uso) a Forma Grande. Só o
   * Descanso Longo desliga sozinho e devolve o uso (ver
   * `descansoLongo`) — o app não segue tempo real pra saber quando os
   * 10 minutos da transformação acabam. */
  function usarFormaGrande(): boolean {
    if (formaGrandeAtiva) {
      setFormaGrandeAtiva(false);
      return true;
    }
    if (formaGrandeGasto) return false;
    setFormaGrandeGasto(true);
    setFormaGrandeAtiva(true);
    return true;
  }

  function usarMaosCurativas(): boolean {
    if (maosCurativasGasto) return false;
    setMaosCurativasGasto(true);
    return true;
  }

  function usarRevelacaoCelestial(formaEscolhida: string): boolean {
    if (revelacaoCelestialGasto) return false;
    setRevelacaoCelestialGasto(true);
    setRevelacaoCelestialFormaAtiva(formaEscolhida);
    return true;
  }

  function usarFalarComAnimaisGnomo(): boolean {
    if (usosFalarComAnimaisGnomoRestantes <= 0) return false;
    setFalarComAnimaisGnomoGasto((v) => v + 1);
    return true;
  }

  function marcarUsado(categoria: RecursoTurno) {
    setTurnState((prev) => ({ ...prev, [categoria]: 'usada' }));
  }

  function fimDoTurno() {
    setTurnState(turnoInicial);
    setSurtoUsadoTurno(false);
  }

  /** `classeNome` — omitido = gasta do pool "principal" em foco agora
   * (a classe ativa, ou o pool COMBINADO quando `emConjuracaoCombinada`
   * — ver M4c); passado = gasta de OUTRA classe (ponte de Magia de
   * Pacto, SDD Multiclasse seção 8.5 — só chega aqui vindo de
   * `EscolherCirculoShell` quando `ponte` não é `null`). */
  function gastarSlotCirculo(circulo: number, classeNome: string = chaveDoPoolDeMagia): boolean {
    const ehPoolPrincipal = classeNome === chaveDoPoolDeMagia;
    const espacosDaClasse = ehPoolPrincipal ? espacosParaConjurar : (ponte?.espacos ?? []);
    const gastosDaClasse = ehPoolPrincipal ? espacosGastosParaConjurar : (ponte?.espacosGastosPorCirculo ?? {});
    const def = espacosDaClasse.find((e) => e.circulo === circulo);
    const gasto = gastosDaClasse[circulo] ?? 0;
    if (!def || gasto >= def.maximo) return false;
    atualizarEspacosGastos((prev) => ({ ...prev, [circulo]: (prev[circulo] ?? 0) + 1 }), classeNome);
    return true;
  }

  /** Pra ações que gastam "1 Espaço de Magia" sem se importar de qual
   * círculo (ex: Fonte de Inspiração) — usa o de menor círculo com
   * espaço sobrando. */
  function gastarQualquerSlot(): boolean {
    for (const e of espacos) {
      const gasto = espacosGastosPorCirculo[e.circulo] ?? 0;
      if (gasto < e.maximo) return gastarSlotCirculo(e.circulo);
    }
    return false;
  }

  function usarInspiracao(): boolean {
    if (usosInspiracaoRestantes <= 0) return false;
    setInspiracaoGasto((v) => v + 1);
    return true;
  }

  function recuperarInspiracaoComEspaco(): boolean {
    if (inspiracaoGasto <= 0) return false;
    if (!gastarQualquerSlot()) return false;
    setInspiracaoGasto((v) => Math.max(0, v - 1));
    return true;
  }

  /** "Perícia Inigualável" (Colégio do Conhecimento, nv14): devolve 1
   * uso de Inspiração de Bardo SEM gastar Espaço de Magia — reembolso
   * condicional de quando o teste/ataque continua falhando mesmo
   * depois de somar o dado (regra pede rolar antes de saber se vai
   * gastar de verdade, por isso o gasto é otimista e essa função só
   * desfaz se o jogador confirmar que ainda falhou). */
  function devolverUsoInspiracao() {
    setInspiracaoGasto((v) => Math.max(0, v - 1));
  }

  /** "Inspiração Superior" (nv18): ao rolar Iniciativa, recupera usos
   * gastos de Inspiração de Bardo até ter 2, se tiver menos que isso —
   * nunca reduz usos já disponíveis, nunca passa do máximo da classe. */
  function recuperarInspiracaoAoRolarIniciativa() {
    if (!inspiracaoSuperiorDesbloqueada) return;
    setInspiracaoGasto((atual) => {
      const restantesAlvo = Math.min(usosInspiracaoMax, 2);
      const restantesAtual = Math.max(0, usosInspiracaoMax - atual);
      if (restantesAtual >= restantesAlvo) return atual;
      return usosInspiracaoMax - restantesAlvo;
    });
  }

  /** Rolar Iniciativa = início de um novo turno de combate (regra da
   * mesa: cada rolagem de Iniciativa começa uma cena nova) — reseta
   * Ação/Ação Bônus/Reação e Surto de Ação do turno, mesmo padrão do
   * "Fim do Turno" (`fimDoTurno` abaixo). Sem isso, rolar Iniciativa
   * de novo (ex.: começando outro combate) manteria os 3 botões
   * travados do combate anterior. */
  function aoRolarIniciativa() {
    setTurnState(turnoInicial);
    setSurtoUsadoTurno(false);
    recuperarInspiracaoAoRolarIniciativa();
  }

  function descansoLongo() {
    setPvAtual(personagem.pvMax);
    // Eficiente (Humano) — "começa cada dia com Inspiração Heroica";
    // como o app não segue tempo real, a aproximação (ver SDD) é
    // conceder de novo a cada Descanso Longo. Nunca desliga sozinho
    // aqui — só o jogador desliga (manual ou usando o reroll).
    if (selecao.especie === 'Humano') setInspiracaoHeroicaAtiva(true);
    setEspacosGastosPorClasseECirculo({});
    setFolegoGasto(0);
    setVigorImplacavelGasto(false);
    setConhecimentoDePedrasGasto(0);
    setPicoDeAdrenalinaGasto(0);
    setAtaqueDeSoproGasto(0);
    setVooDraconicoGasto(false);
    setAncestralidadeGiganteGasto(0);
    setFormaGrandeGasto(false);
    setFormaGrandeAtiva(false);
    setMaosCurativasGasto(false);
    setRevelacaoCelestialGasto(false);
    setRevelacaoCelestialFormaAtiva(null);
    setFalarComAnimaisGnomoGasto(0);
    setIndomavelGasto(0);
    setPontosDeSorteGasto(0);
    setSorteDoTenebrosoGasto(0);
    setSurtoGasto(0);
    setInspiracaoGasto(0);
    setLivroDasSombrasGasto(false);
    setMemorizarMagiaGasta(false);
    setAstuciaMagicaGasta(false);
    setContatarPatronoGasto(false);
    setResistenciaInferaGasto(false);
    setLancarNoInfernoGasto(false);
    setArcanaMisticaGastos([]);
    setMagiasGratisGastas([]);
    fimDoTurno();
    setRestStatus(`Descanso Longo: PV restaurado para ${personagem.pvMax}/${personagem.pvMax}, Espaços de Magia, Recuperar Fôlego, Indomável, Surto de Ação, Inspiração de Bardo, Pontos de Sorte e traços de espécie recuperados.`);
  }

  function descansoCurto() {
    // Percorre TODAS as classes do personagem (não só a ativa) — o
    // Bruxo recupera Magia de Pacto no Descanso Curto mesmo se a pill
    // em foco agora for outra classe (Fase M4b, achado do mesmo bug de
    // pool compartilhado corrigido nesta entrega). `algumCirculoRecuperou`
    // é calculado ANTES do `setEspacosGastosPorClasseECirculo` (não
    // dentro do updater) — o updater do useState não roda na hora, na
    // sequência síncrona desta função.
    const circulosQueRecuperamPorClasse = classesAtual.map((c) => {
      const classeCatalogo = catalogoClasses.find((cc) => cc.nome === c.classe) ?? null;
      const circulos = espacosDeMagiaAtivos(classeCatalogo, c.nivel)
        .filter((e) => e.recuperaNoDescansoCurto)
        .map((e) => e.circulo);
      return { classeNome: c.classe, circulos };
    });
    const algumCirculoRecuperou = circulosQueRecuperamPorClasse.some((c) => c.circulos.length > 0);
    if (algumCirculoRecuperou) {
      setEspacosGastosPorClasseECirculo((prev) => {
        const proximo = { ...prev };
        for (const { classeNome, circulos } of circulosQueRecuperamPorClasse) {
          if (circulos.length === 0) continue;
          const poolClasse = { ...(proximo[classeNome] ?? {}) };
          for (const circ of circulos) poolClasse[circ] = 0;
          proximo[classeNome] = poolClasse;
        }
        return proximo;
      });
    }
    if (fonteDeInspiracao) setInspiracaoGasto(0);
    setFolegoGasto((v) => Math.max(0, v - 1));
    setLivroDasSombrasGasto(false);
    setMemorizarMagiaGasta(false);
    setResistenciaInferaGasto(false);
    setPicoDeAdrenalinaGasto(0);
    setRestStatus(
      `Descanso Curto: ${algumCirculoRecuperou ? 'Espaços de Magia recuperados, ' : ''}${fonteDeInspiracao ? 'Inspiração de Bardo recuperada, ' : ''}1 uso de Recuperar Fôlego devolvido, Pico de Adrenalina recuperado. PV não recupera automaticamente por descanso curto.`,
    );
  }

  /** Toca em "Descanso Curto"/"Descanso Longo" (aba Atributos) — só
   * dispara a transição visual (`DescansoOverlay`); o reset de verdade
   * (`descansoCurto`/`descansoLongo`) só acontece com a tela já 100%
   * preta, ver `aoFadeInCompleto`. */
  function iniciarDescanso(tipo: TipoDescanso) {
    setDescansoEmAndamento({ tipo, fase: 'entrando' });
  }

  function aoFadeInCompleto() {
    if (!descansoEmAndamento) return;
    if (descansoEmAndamento.tipo === 'curto') {
      descansoCurto();
    } else {
      descansoLongo();
    }
    // Só pergunta se sobra alguma Magia Preparada pra redefinir — sem
    // isso, um Mago nível 1 (0 Magias Preparadas ainda escolhidas)
    // veria uma pergunta sem sentido.
    const perguntaRedefinir =
      descansoEmAndamento.tipo === 'longo' && usaRedefPorDescanso && magiasPreparadasAtuais.length > 0;
    setDescansoEmAndamento((prev) => (prev ? { ...prev, fase: perguntaRedefinir ? 'perguntaRedefinir' : 'saindo' } : prev));
  }

  /** Resposta ao prompt "quer alterar suas magias preparadas?" —
   * `sim` abre a tela de escolha livre (`MemorizarMagiaShell`, modo
   * `'livre'`); `não` já manda pro fade-out. */
  function aoResponderRedefinir(sim: boolean) {
    setDescansoEmAndamento((prev) => (prev ? { ...prev, fase: sim ? 'escolhendoMagias' : 'saindo' } : prev));
  }

  function aoConfirmarRedefinicao(novaLista: string[]) {
    setMagiasPreparadasAtuais(novaLista);
    setDescansoEmAndamento((prev) => (prev ? { ...prev, fase: 'saindo' } : prev));
  }

  function aoFimDaTransicaoDescanso() {
    setDescansoEmAndamento(null);
  }

  function usarAstuciaMagica() {
    if (astuciaMagicaGasta || !espacoPactoAtual || astuciaMagicaRecupera <= 0) return;
    const circulo = espacoPactoAtual.circulo;
    atualizarEspacosGastos((prev) => ({ ...prev, [circulo]: Math.max(0, (prev[circulo] ?? 0) - astuciaMagicaRecupera) }));
    setAstuciaMagicaGasta(true);
  }

  function usarContatarPatrono() {
    if (contatarPatronoGasto) return;
    setContatarPatronoGasto(true);
  }

  function aplicarBencaoDoTenebroso() {
    const valor = valorBencaoDoTenebroso(carMod, personagem.nivel);
    setPvTemporario((atual) => ganharPvTemporario(atual, valor));
  }

  function usarArcanaMistica(circulo: number) {
    if (arcanaMisticaGastos.includes(circulo)) return;
    setArcanaMisticaGastos((prev) => [...prev, circulo]);
  }

  function usarMagiaGratisDeInvocacao(item: MagiaGratisDeInvocacao) {
    if (item.recarga === 'descansoLongo' && !magiasGratisGastas.includes(item.invocacaoId)) {
      setMagiasGratisGastas((prev) => [...prev, item.invocacaoId]);
    }
    if (item.pvTemporarioConcedido !== null) {
      setPvTemporario((atual) => ganharPvTemporario(atual, item.pvTemporarioConcedido!));
    }
  }

  /** Chave própria (`talento:...`) na MESMA lista `magiasGratisGastas`
   * das Invocações Místicas — nunca colide com `invocacaoId` (ids de
   * catálogos diferentes), evita criar um 2º array de "gasto" só pra
   * isso. */
  function chaveMagiaGratisTalento(item: MagiaGratisDeTalentoGeral): string {
    return `talento:${item.talentoId}:${item.magia.nome}`;
  }

  function usarMagiaGratisDeTalentoGeral(item: MagiaGratisDeTalentoGeral) {
    const chave = chaveMagiaGratisTalento(item);
    if (item.recarga === 'descansoLongo' && !magiasGratisGastas.includes(chave)) {
      setMagiasGratisGastas((prev) => [...prev, chave]);
    }
  }

  /** Ritual Rápido (Conjurador Ritualista) — 1 uso ÚNICO COMPARTILHADO
   * entre TODAS as magias Rituais conhecidas (não 1 por magia, ver
   * `CHAVE_RITUAL_RAPIDO`). Mesma lista `magiasGratisGastas`, reseta
   * junto no Descanso Longo sem precisar de tratamento especial. */
  function usarRitualRapido() {
    if (!magiasGratisGastas.includes(CHAVE_RITUAL_RAPIDO)) {
      setMagiasGratisGastas((prev) => [...prev, CHAVE_RITUAL_RAPIDO]);
    }
  }

  function trocarArmaMaestria(armaAntiga: string, armaNova: string) {
    setMaestriaArma((prev) => prev.map((a) => (a === armaAntiga ? armaNova : a)));
  }

  function alterarQuantidadeItem(id: string, delta: number) {
    setItensMochila((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantidade: Math.max(0, it.quantidade + delta) } : it)),
    );
  }

  function removerItemMochila(id: string) {
    setItensMochila((prev) => prev.filter((it) => it.id !== id));
  }

  function adicionarItemMochila(nome: string, quantidade: number) {
    setItensMochila((prev) => [...prev, criarItemManual(nome, quantidade)]);
  }

  function equiparItem(id: string, slot: SlotEquipamento) {
    setItensMochila((prev) => equiparNoSlot(prev, id, slot));
  }

  function desequiparItem(id: string) {
    setItensMochila((prev) => desequiparItemPuro(prev, id));
  }

  function adicionarPet(nome: string, criaturaId: string, origemInvocacaoId?: string, ajustes?: AjustesPet) {
    const criatura = criaturas.find((c) => c.id === criaturaId);
    if (!criatura) return;
    setPets((prev) => {
      // Convocar de novo pela MESMA fonte substitui o pet anterior
      // dela (mesmo padrão de "só 1 arma de pacto por vez" do Pacto da
      // Lâmina) — nunca afeta pets de outras origens/avulsos.
      const semAntigoDaMesmaFonte = origemInvocacaoId ? prev.filter((p) => p.origemInvocacaoId !== origemInvocacaoId) : prev;
      return [...semAntigoDaMesmaFonte, criarPet(nome, criatura, origemInvocacaoId, ajustes)];
    });
  }

  function removerPet(id: string) {
    setPets((prev) => prev.filter((p) => p.id !== id));
  }

  function alterarPvPet(id: string, delta: number) {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const criatura = criaturas.find((c) => c.id === p.criaturaId);
        if (!criatura) return p;
        return alterarPvPetPuro(p, delta, pvMaxEfetivoPet(p, criatura));
      }),
    );
  }

  function alternarBonusLegiaoDosMortos(id: string, ligado: boolean, circuloDoEspacoGasto: number) {
    setPets((prev) =>
      prev.map((p) =>
        p.id === id
          ? comBonusExtra(p, ligado ? { rotulo: 'Legião dos Mortos', ...bonusLegiaoDosMortos(circuloDoEspacoGasto, modIntAtual) } : null)
          : p,
      ),
    );
  }

  function usarColheitaDosMortos(petId: string, cura: number) {
    alterarPvPet(petId, -9999);
    alterarPv(cura);
  }

  function usarMestreDaMorte(petIds: string[]) {
    setPets((prev) => prev.map((p) => (petIds.includes(p.id) ? ganharPvTemporarioPet(p, pvTempMestreDaMorteAtual) : p)));
  }

  function alternarDuasMaos(id: string) {
    setItensMochila((prev) => alternarDuasMaosVersatil(prev, id));
  }

  function alternarSintonizacaoItem(id: string) {
    setItensMochila((prev) => alternarSintonizacao(prev, id));
  }

  function vincularArmaDePactoHandler(nomeArma: string) {
    setItensMochila((prev) => vincularArmaDePacto(prev, nomeArma));
  }

  function desvincularArmaDePactoHandler() {
    setItensMochila((prev) => desvincularArmaDePacto(prev));
  }

  function usarUsoFolego(): boolean {
    if (usosFolegoRestantes <= 0) return false;
    setFolegoGasto((v) => v + 1);
    return true;
  }

  function usarIndomavel(): boolean {
    if (indomavelRestantes <= 0) return false;
    setIndomavelGasto((v) => v + 1);
    return true;
  }

  function usarPontoDeSorte(): boolean {
    if (pontosDeSorteRestantes <= 0) return false;
    setPontosDeSorteGasto((v) => v + 1);
    return true;
  }

  function usarSorteDoTenebroso(): boolean {
    if (sorteDoTenebrosoRestantes <= 0) return false;
    setSorteDoTenebrosoGasto((v) => v + 1);
    return true;
  }

  function usarLancarNoInferno(): boolean {
    if (lancarNoInfernoGasto) return false;
    setLancarNoInfernoGasto(true);
    return true;
  }

  function recuperarLancarNoInfernoComEspacoDePacto(): boolean {
    if (!lancarNoInfernoGasto) return false;
    if (!gastarQualquerSlot()) return false;
    setLancarNoInfernoGasto(false);
    return true;
  }

  // Registra "A Sorte do Próprio Tenebroso" como bônus extra disponível
  // no modal de rolagem global (ver RollContext) — some sozinho
  // (`registrarBonusExtra(null)`) se a Ficha desmontar ou o personagem
  // deixar de ter a característica.
  useEffect(() => {
    if (!sorteDoTenebrosoDisponivel) {
      registrarBonusExtra(null);
      return;
    }
    registrarBonusExtra({
      rotulo: 'Sorte do Ten.',
      lados: 10,
      restantes: sorteDoTenebrosoRestantes,
      maximo: sorteDoTenebrosoMaximo,
      usar: usarSorteDoTenebroso,
    });
    return () => registrarBonusExtra(null);
  }, [sorteDoTenebrosoDisponivel, sorteDoTenebrosoRestantes, sorteDoTenebrosoMaximo, registrarBonusExtra]);

  // Registra Sorte (Pequenino) no modal de rolagem global — some
  // sozinho se a Ficha desmontar ou a espécie mudar.
  useEffect(() => {
    registrarSorte(selecao.especie === 'Pequenino');
    return () => registrarSorte(false);
  }, [selecao.especie, registrarSorte]);

  function alternarInspiracaoHeroica() {
    setInspiracaoHeroicaAtiva((v) => !v);
  }

  // Registra Inspiração Heroica no modal de rolagem global — some
  // sozinha se a Ficha desmontar. `usar` zera o flag quando o
  // jogador reroga um d20 pelo RollOverlay (ver RollContext).
  useEffect(() => {
    registrarInspiracaoHeroica({
      disponivel: inspiracaoHeroicaAtiva,
      usar: () => setInspiracaoHeroicaAtiva(false),
    });
    return () => registrarInspiracaoHeroica(null);
  }, [inspiracaoHeroicaAtiva, registrarInspiracaoHeroica]);

  function usarSurto(): boolean {
    if (surtoRestantes <= 0 || surtoUsadoTurno) return false;
    setSurtoGasto((v) => v + 1);
    setSurtoUsadoTurno(true);
    return true;
  }

  function confirmarLevelUp(resultado: {
    novoNivel: number;
    pvGanho: number;
    subclasseEscolhida: string | null;
    estiloDeLutaEscolhido: string | null;
    truquesEscolhidos: string[] | null;
    livroDeMagiasEscolhidas: string[] | null;
    magiasPreparadasEscolhidas: string[] | null;
    invocacoesMisticasEscolhidas: string[] | null;
    periciasEspecialistaEscolhidas: string[] | null;
    periciasSubclasseBonusEscolhidas: string[] | null;
    magiasDescobertasMagicasEscolhidas: string[] | null;
    atributosAumentados: Atributo[] | null;
    talentoGeralEscolhido: string | null;
    dadivaEpicaEscolhida: string | null;
    arcanaMisticaAlteracoes: Record<number, string> | null;
    magiaIniciadaAlteracoes: { origem: string | null; especie: string | null } | null;
    escolhaMagiaTalentoGeral: Record<string, string[]> | null;
    periciaLivreTalentoEscolhida: string | null;
    periciaRestritaTalentoEscolhida: string | null;
  }) {
    const novosAtributos = resultado.atributosAumentados
      ? aumentarAtributos(selecao.atributos, resultado.atributosAumentados)
      : null;
    if (novosAtributos) setSelecao((prev) => ({ ...prev, atributos: novosAtributos }));
    // Grava o nível/subclasse novos na classe ATIVA dentro de `classesAtual`
    // (não mais num `personagem` solto) — cria a entrada se for a
    // primeira vez que essa classe aparece (multiclasse nova, `nivelAtual`
    // 0 → 1 escolhido em `EscolherClasseLevelUp`). `conMod` não precisa de
    // sync manual mais: deriva de `selecao.atributos.CON` a cada render.
    setClassesAtual((prev) => {
      const idx = prev.findIndex((c) => c.classe === classeAtivaNome);
      if (idx === -1) {
        return [...prev, { classe: classeAtivaNome, nivel: resultado.novoNivel, subclasse: resultado.subclasseEscolhida ?? null }];
      }
      return prev.map((c, i) =>
        i === idx ? { ...c, nivel: resultado.novoNivel, subclasse: resultado.subclasseEscolhida ?? c.subclasse } : c,
      );
    });
    setPvMax((v) => v + resultado.pvGanho);
    if (resultado.estiloDeLutaEscolhido) setEstiloDeLutaAtivo(resultado.estiloDeLutaEscolhido);
    setPvAtual((v) => v + resultado.pvGanho);
    if (resultado.truquesEscolhidos) setTruquesAtuais(resultado.truquesEscolhidos);
    if (resultado.livroDeMagiasEscolhidas) setLivroDeMagiasAtuais(resultado.livroDeMagiasEscolhidas);
    if (resultado.magiasPreparadasEscolhidas) setMagiasPreparadasAtuais(resultado.magiasPreparadasEscolhidas);
    if (resultado.invocacoesMisticasEscolhidas) setInvocacoesMisticasAtuais(resultado.invocacoesMisticasEscolhidas);
    if (resultado.periciasEspecialistaEscolhidas) setPericiasEspecialistaAtuais(resultado.periciasEspecialistaEscolhidas);
    if (resultado.periciasSubclasseBonusEscolhidas) setPericiasSubclasseBonusAtuais(resultado.periciasSubclasseBonusEscolhidas);
    if (resultado.magiasDescobertasMagicasEscolhidas) setMagiasDescobertasMagicasAtuais(resultado.magiasDescobertasMagicasEscolhidas);
    if (resultado.talentoGeralEscolhido) {
      setTalentosGeraisAtuais((prev) => [...prev, resultado.talentoGeralEscolhido!]);
      // Já foi escolhido de verdade — não faz mais sentido continuar
      // "planejado" na seção de Favoritos.
      setTalentosFavoritos((prev) => prev.filter((id) => id !== resultado.talentoGeralEscolhido));
    }
    if (resultado.dadivaEpicaEscolhida) {
      setTalentosGeraisAtuais((prev) => [...prev, resultado.dadivaEpicaEscolhida!]);
      setTalentosFavoritos((prev) => prev.filter((id) => id !== resultado.dadivaEpicaEscolhida));
    }
    if (resultado.arcanaMisticaAlteracoes) {
      setArcanaMisticaAtuais((prev) => ({ ...prev, ...resultado.arcanaMisticaAlteracoes }));
    }
    if (resultado.magiaIniciadaAlteracoes) {
      const { origem, especie } = resultado.magiaIniciadaAlteracoes;
      setSelecao((prev) => ({
        ...prev,
        magiaMagiaIniciadaEscolhida: origem ?? prev.magiaMagiaIniciadaEscolhida,
        magiaMagiaIniciadaEspecieEscolhida: especie ?? prev.magiaMagiaIniciadaEspecieEscolhida,
      }));
    }
    if (resultado.escolhaMagiaTalentoGeral) {
      setEscolhaMagiaTalentoGeral((prev) => ({ ...prev, ...resultado.escolhaMagiaTalentoGeral }));
    }
    if (resultado.periciaLivreTalentoEscolhida) {
      setPericiasTalentoGeralAtuais((prev) => [...prev, resultado.periciaLivreTalentoEscolhida!]);
    }
    if (resultado.periciaRestritaTalentoEscolhida) {
      // Decide proficiência vs. Especialização comparando com o que o
      // personagem já tinha ANTES desse level-up (fechamento captura o
      // estado atual, antes dos `set*` acima aplicarem) — ver
      // `core/periciaTalentoGeral.ts`.
      const jaEraProficiente = [
        ...periciasProficientes(selecao),
        ...periciasSubclasseBonusAtuais,
        ...periciasTalentoGeralAtuais,
        ...periciasMulticlasseAtuais,
      ].includes(resultado.periciaRestritaTalentoEscolhida);
      if (jaEraProficiente) {
        setPericiasEspecialistaAtuais((prev) => [...prev, resultado.periciaRestritaTalentoEscolhida!]);
      } else {
        setPericiasTalentoGeralAtuais((prev) => [...prev, resultado.periciaRestritaTalentoEscolhida!]);
      }
    }
    setLevelUpHpModo(null);
    setLevelUpHpRolado(null);
    setLevelUpAberto(false);
  }

  function levelUpRapido() {
    if (!classe) return;
    const resultado = sortearLevelUpRapido({
      classe,
      personagem,
      truquesAtuais,
      magiasPreparadasAtuais,
      livroDeMagiasAtuais,
      invocacoesMisticasAtuais,
      arcanaMisticaAtuais,
      periciasEspecialistaAtuais,
      periciasProficientesDoPersonagem: [
        ...periciasProficientes(selecao),
        ...periciasSubclasseBonusAtuais,
        ...periciasTalentoGeralAtuais,
        ...periciasMulticlasseAtuais,
      ],
      periciasSubclasseBonusAtuais,
      magiasDescobertasMagicasAtuais,
      atributosFinaisAtuais,
      talentosGeraisAtuais,
    });
    confirmarLevelUp(resultado);
  }

  // XP e Level Up "pela seta" ficam separados do "⚡ Inst. Level Up"
  // (menu do avatar, ver AvatarMenu) — pedido do Osmar (2026-09): a
  // seta só aparece quando o XP acumulado já bate o marco do próximo
  // nível (dado real, `core/experiencia.ts`); o raio ignora XP de
  // propósito (ferramenta de teste). XP nunca é obrigatório de manter
  // em dia — quem não quer usar marco de XP, usa só o raio.
  const proximoMarco = proximoMarcoXp(nivelTotalAtual);
  const podeLevelUpPelaXp = podeLevelUpPorXp(nivelTotalAtual, xpAtual);

  function ajustarXp(delta: number) {
    setXpAtual((v) => Math.max(0, v + delta));
  }

  if (escolhendoClasseLevelUp) {
    const opcoes = opcoesLevelUp(classesAtual, atributosFinaisAtuais, catalogoClasses);
    return (
      <EscolherClasseLevelUp
        opcoes={opcoes}
        classePadrao={classeAtivaNome}
        onFechar={() => setEscolhendoClasseLevelUp(false)}
        onConfirmar={(resultado: ResultadoEscolhaClasseLevelUp) => {
          setClasseAtivaNome(resultado.classeEscolhida);
          if (resultado.periciasEscolhidas) setPericiasMulticlasseAtuais((prev) => [...prev, ...resultado.periciasEscolhidas!]);
          if (resultado.ferramentasEscolhidas) setFerramentasMulticlasseAtuais((prev) => [...prev, ...resultado.ferramentasEscolhidas!]);
          setEscolhendoClasseLevelUp(false);
          setLevelUpAberto(true);
        }}
      />
    );
  }

  if (levelUpAberto && classe) {
    return (
      <LevelUpShell
        personagem={personagem}
        classe={classe}
        onFechar={() => setLevelUpAberto(false)}
        onConfirmar={confirmarLevelUp}
        hpModo={levelUpHpModo}
        onHpModoChange={setLevelUpHpModo}
        hpRolado={levelUpHpRolado}
        onHpRoladoChange={setLevelUpHpRolado}
        truquesAtuais={truquesAtuais}
        truquesDaClasse={magiasDaClasse(classe.nome, 0)}
        magiasPreparadasAtuais={magiasPreparadasAtuais}
        livroDeMagiasAtuais={livroDeMagiasAtuais}
        magiasDaClasseDisponiveis={magiasDisponiveisParaPreparar(classe, personagem.nivel + 1)}
        invocacoesMisticasAtuais={invocacoesMisticasAtuais}
        arcanaMisticaAtuais={arcanaMisticaAtuais}
        magiaIniciadaOrigemAtual={magiaIniciadaOrigemAtual}
        magiaIniciadaEspecieAtual={magiaIniciadaEspecieAtual}
        periciasEspecialistaAtuais={periciasEspecialistaAtuais}
        periciasProficientesDoPersonagem={[
          ...periciasProficientes(selecao),
          ...periciasSubclasseBonusAtuais,
          ...periciasTalentoGeralAtuais,
          ...periciasMulticlasseAtuais,
        ]}
        periciasSubclasseBonusAtuais={periciasSubclasseBonusAtuais}
        magiasDescobertasMagicasAtuais={magiasDescobertasMagicasAtuais}
        poolDescobertasMagicas={poolDescobertasMagicas(9)}
        atributosAtuais={selecao.atributos}
        atributosFinaisAtuais={atributosFinaisAtuais}
        talentosGeraisAtuais={talentosGeraisAtuais}
        escolhaMagiaTalentoGeralAtuais={escolhaMagiaTalentoGeral}
        talentosFavoritosAtuais={talentosFavoritos}
        onToggleFavoritoTalento={toggleFavoritoTalento}
      />
    );
  }

  if (completarAberto === 'truques' && classe) {
    return (
      <CompletarMagiasShell
        titulo="Truques"
        atuais={truquesAtuais}
        catalogo={magiasDaClasse(classe.nome, 0)}
        deficit={faltamTruques}
        onFechar={() => setCompletarAberto(null)}
        onConfirmar={(novaLista) => {
          setTruquesAtuais(novaLista);
          setCompletarAberto(null);
        }}
      />
    );
  }

  if (completarAberto === 'magiasPreparadas' && classe) {
    const circuloMaximo = Math.max(0, ...espacosDeMagiaAtivos(classe, personagem.nivel).map((e) => e.circulo));
    // Mago (e qualquer classe futura com Livro de Magias): só pode
    // preparar o que já está no grimório — restringe o catálogo antes
    // de mostrar. Sem Livro de Magias (Bardo/Bruxo), catálogo continua
    // a lista inteira da classe, igual sempre foi.
    const catalogoBase = magiasDisponiveisParaPreparar(classe, personagem.nivel).filter((m) => m.circulo <= circuloMaximo);
    const catalogoMagiasPreparadas =
      livroDeMagiasAtuais.length > 0 ? catalogoBase.filter((m) => livroDeMagiasAtuais.includes(m.nome)) : catalogoBase;
    return (
      <CompletarMagiasShell
        titulo="Magias Preparadas"
        atuais={magiasPreparadasAtuais}
        catalogo={catalogoMagiasPreparadas}
        classeNome={classe.nome}
        deficit={faltamMagiasPreparadas}
        onFechar={() => setCompletarAberto(null)}
        onConfirmar={(novaLista) => {
          setMagiasPreparadasAtuais(novaLista);
          setCompletarAberto(null);
        }}
      />
    );
  }

  if (livroDasSombrasAberto) {
    return (
      <LivroDasSombrasShell
        atuais={livroDasSombrasAtuais}
        truquesConhecidos={truquesAtuais}
        magiasPreparadasConhecidas={magiasPreparadasAtuais}
        onFechar={() => setLivroDasSombrasAberto(false)}
        onConfirmar={(novaLista) => {
          setLivroDasSombrasAtuais(novaLista);
          setLivroDasSombrasGasto(true);
          setLivroDasSombrasAberto(false);
        }}
      />
    );
  }

  if (memorizarMagiaAberto) {
    return (
      <MemorizarMagiaShell
        modo="unica"
        atuais={magiasPreparadasAtuais}
        catalogo={livroDeMagias}
        onFechar={() => setMemorizarMagiaAberto(false)}
        onConfirmar={(novaLista) => {
          setMagiasPreparadasAtuais(novaLista);
          setMemorizarMagiaGasta(true);
          setMemorizarMagiaAberto(false);
        }}
      />
    );
  }

  if (descansoEmAndamento?.fase === 'escolhendoMagias') {
    return (
      <MemorizarMagiaShell
        modo="livre"
        atuais={magiasPreparadasAtuais}
        catalogo={livroDeMagias}
        onFechar={() => aoResponderRedefinir(false)}
        onConfirmar={aoConfirmarRedefinicao}
      />
    );
  }

  if (ajustarPetAberto) {
    return (
      <AjustarPetShell
        onFechar={() => setAjustarPetAberto(false)}
        onConfirmar={(nome, criaturaId, ajustes) => {
          adicionarPet(nome, criaturaId, undefined, ajustes);
          setAjustarPetAberto(false);
        }}
      />
    );
  }

  return (
    <div className={styles.screen}>
      {descansoEmAndamento && (
        <DescansoOverlay
          tipo={descansoEmAndamento.tipo}
          fase={descansoEmAndamento.fase}
          onFadeInCompleto={aoFadeInCompleto}
          onResponderRedefinir={aoResponderRedefinir}
          onFimAnimacao={aoFimDaTransicaoDescanso}
        />
      )}
      {/* Só monta depois que o RollOverlay (rolagem de acerto/dano da
          própria magia) fechar — como o fundo dele é semitransparente
          (rgba(0,0,0,0.6)), esse modal "espiava" por trás enquanto os
          2 ficavam abertos ao mesmo tempo (achado pelo Osmar testando
          no celular). A ordem continua certa (Colheita Macabra é o
          próximo passo), só não pode ficar visível antes da vez dele. */}
      {colheitaMacabraPendente && rollEmAndamento === null && (
        <ColheitaMacabraModal
          cura={colheitaMacabraPendente.cura}
          petsElegiveis={petsMortoVivo(pets)}
          onCurar={(petId) => {
            alterarPvPet(petId, colheitaMacabraPendente.cura);
            setColheitaMacabraPendente(null);
          }}
          onFechar={() => setColheitaMacabraPendente(null)}
        />
      )}
      {xpPopupAberto && (
        <XpShell
          xpAtual={xpAtual}
          proximoMarco={proximoMarco}
          onAjustar={ajustarXp}
          onFechar={() => setXpPopupAberto(false)}
        />
      )}
      <div className={styles.header}>
        <span className="back" onClick={() => navigate('/lista')}>
          ←
        </span>
        <div>
          <div className={styles.name}>{selecao.nome || '(sem nome)'}</div>
          <div className={styles.meta}>
            {selecao.especie ?? '—'}{' '}
            {classesAtual.length > 1
              ? classesAtual.map((c) => `${c.classe} ${c.nivel}${c.subclasse ? ` (${c.subclasse})` : ''}`).join(' / ')
              : `${selecao.classe ?? '—'}${personagem.subclasse ? ` (${personagem.subclasse})` : ''}`}
            {' · Nível '}
            {nivelTotalAtual} · CA {ca ?? '—'}
          </div>
          {classesAtual.length > 1 && (
            <div className={styles.classePills}>
              {classesAtual.map((c) => (
                <span
                  key={c.classe}
                  className={`${styles.classePill} ${c.classe === classeAtivaNome ? styles.classePillAtiva : ''}`}
                  onClick={() => setClasseAtivaNome(c.classe)}
                >
                  {c.classe}
                </span>
              ))}
            </div>
          )}
        </div>
        <AvatarMenu
          itensDetalhados={itensDetalhados}
          onToggleItensDetalhados={() => setItensDetalhados(!itensDetalhados)}
          pesoAtivo={pesoAtivo}
          onTogglePeso={() => setPesoAtivo((v) => !v)}
          onLevelUpRapido={classe ? levelUpRapido : undefined}
        />
      </div>

      <div className={styles.tabContent}>
        {tab === 'atributos' && (
          <AtributosTab
            nivel={personagem.nivel}
            pvMax={personagem.pvMax}
            pvAtual={pvAtual}
            ca={ca}
            iniciativa={iniciativa}
            percepcaoPassiva={percepcaoPassiva}
            bonusProficiencia={bonusProficienciaAtual}
            explicacaoPv={explicacaoPv}
            explicacaoCa={explicacaoCa}
            explicacaoIniciativa={explicacaoIniciativa}
            explicacaoPercepcaoPassiva={explicacaoPercepcaoPassiva}
            atributos={atributos}
            pericias={pericias}
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            proficienciasFerramenta={proficienciasFerramenta}
            onDescansoLongo={() => iniciarDescanso('longo')}
            onDescansoCurto={() => iniciarDescanso('curto')}
            restStatus={restStatus}
            onAbrirLevelUp={() => {
              const opcoes = opcoesLevelUp(classesAtual, atributosFinaisAtuais, catalogoClasses);
              if (deveEscolherClasseNoLevelUp(opcoes)) {
                setEscolhendoClasseLevelUp(true);
              } else {
                setLevelUpAberto(true);
              }
            }}
            xpAtual={xpAtual}
            proximoMarcoXp={proximoMarco}
            podeLevelUpPelaXp={podeLevelUpPelaXp}
            onAbrirXpPopup={() => setXpPopupAberto(true)}
            maestriaArma={maestriaArma}
            armasParaMaestria={classe ? listarArmasParaMaestria(classe) : []}
            onTrocarArmaMaestria={trocarArmaMaestria}
            onRolarIniciativa={aoRolarIniciativa}
            sentidos={sentidos}
            resistenciaInferaDisponivel={resistenciaInferaDisponivel}
            resistenciaInferaAtual={resistenciaInferaAtual}
            resistenciaInferaGasto={resistenciaInferaGasto}
            onTrocarResistenciaInfera={(tipo) => {
              setResistenciaInferaAtual(tipo);
              setResistenciaInferaGasto(true);
            }}
            temVigorImplacavel={temVigorImplacavel}
            vigorImplacavelGasto={vigorImplacavelGasto}
            inspiracaoHeroicaAtiva={inspiracaoHeroicaAtiva}
            onAlternarInspiracaoHeroica={alternarInspiracaoHeroica}
          />
        )}
        {tab === 'perfil' && (
          <PerfilTab
            selecao={selecao}
            classe={classe}
            nivel={personagem.nivel}
            subclasse={personagem.subclasse}
            talentosGeraisAtuais={talentosGeraisAtuais}
            invocacoesMisticasAtuais={invocacoesMisticasAtuais}
          />
        )}
        {tab === 'mochila' && (
          <MochilaTab
            itens={itensMochila}
            itensDetalhados={itensDetalhados}
            pesoAtivo={pesoAtivo}
            capacidadeMaxima={capacidadeMaxima}
            explicacaoCapacidadeMaxima={explicacaoCapacidadeMaxima}
            onAlterarQuantidade={alterarQuantidadeItem}
            onRemoverItem={removerItemMochila}
            onAdicionarItem={adicionarItemMochila}
            onEquipar={equiparItem}
            onDesequipar={desequiparItem}
            onAlternarDuasMaos={alternarDuasMaos}
            onAlternarSintonizacao={alternarSintonizacaoItem}
          />
        )}
        {tab === 'magias' && (
          <MagiasTab
            classe={classe}
            nivel={personagem.nivel}
            espacosGastosPorCirculo={espacosGastosParaConjurar}
            classeAtivaNome={chaveDoPoolDeMagia}
            ponte={ponte}
            espacosParaConjurar={espacosParaConjurar}
            onGastarSlotCirculo={gastarSlotCirculo}
            modAcertoConjuracao={modAcertoConjuracao}
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            conjura={conjura}
            truquesAtuais={truquesAtuais}
            magiasPreparadasAtuais={magiasPreparadasAtuais}
            livroDeMagiasAtuais={livroDeMagiasAtuais}
            magiasDescobertasMagicasAtuais={magiasDescobertasMagicasAtuais}
            livroDasSombrasAtuais={livroDasSombrasAtuais}
            temPactoDoTomo={invocacoesMisticasAtuais.includes('pacto-do-tomo')}
            livroDasSombrasGasto={livroDasSombrasGasto}
            onReconjurarLivro={() => !livroDasSombrasGasto && setLivroDasSombrasAberto(true)}
            memorizarMagiaDisponivel={memorizarMagiaDisponivel}
            memorizarMagiaGasta={memorizarMagiaGasta}
            onMemorizarMagia={() => !memorizarMagiaGasta && setMemorizarMagiaAberto(true)}
            astuciaMagicaDisponivel={astuciaMagicaDisponivel}
            astuciaMagicaGasta={astuciaMagicaGasta}
            astuciaMagicaRecupera={astuciaMagicaRecupera}
            onUsarAstuciaMagica={usarAstuciaMagica}
            contatarPatronoDisponivel={contatarPatronoDisponivel}
            contatoExtraplanar={contatoExtraplanar}
            contatarPatronoGasto={contatarPatronoGasto}
            onUsarContatarPatrono={usarContatarPatrono}
            arcanaMisticaEscolhidas={arcanaMisticaEscolhidas}
            arcanaMisticaGastos={arcanaMisticaGastos}
            onUsarArcanaMistica={usarArcanaMistica}
            magiasGratisConcedidas={magiasGratisConcedidas}
            magiasGratisGastas={magiasGratisGastas}
            onUsarMagiaGratis={usarMagiaGratisDeInvocacao}
            magiasGratisTalentoGeral={magiasGratisTalentoGeral}
            onUsarMagiaGratisTalentoGeral={usarMagiaGratisDeTalentoGeral}
            ritualRapidoDisponivel={ritualRapidoDisponivel}
            ritualRapidoGasto={ritualRapidoGasto}
            onUsarRitualRapido={usarRitualRapido}
            magiasPactoDoInferoAtuais={magiasPactoDoInferoAtuais}
            magiasEspecieAtuais={magiasEspecieAtuais}
            magiasTalentoOrigemAtuais={magiasTalentoOrigemAtuais}
            magiasTalentoGeralAtuais={magiasTalentoGeralAtuais}
            temPactoDaLamina={invocacoesMisticasAtuais.includes('pacto-da-lamina')}
            armaDePactoAtual={armaDePactoAtual(itensMochila)}
            onVincularArmaDePacto={vincularArmaDePactoHandler}
            onDesvincularArmaDePacto={desvincularArmaDePactoHandler}
            faltamTruques={faltamTruques}
            faltamMagiasPreparadas={faltamMagiasPreparadas}
            onCompletarTruques={() => setCompletarAberto('truques')}
            onCompletarMagiasPreparadas={() => setCompletarAberto('magiasPreparadas')}
            colheitaMacabraDisponivel={colheitaMacabraDisponivel}
            onColheitaMacabraDisponivel={(cura) => setColheitaMacabraPendente({ cura })}
          />
        )}
        {tab === 'combat' && (
          <CombatTab
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            acoesGenericasBonus={acoesGenericasBonus}
            pvAtual={pvAtual}
            pvMax={personagem.pvMax}
            pvTemporario={pvTemporario}
            bencaoDoTenebrosoDisponivel={bencaoDoTenebrosoDisponivel}
            onAplicarBencaoDoTenebroso={aplicarBencaoDoTenebroso}
            lancarNoInfernoDisponivel={lancarNoInfernoDisponivel}
            lancarNoInfernoGasto={lancarNoInfernoGasto}
            onUsarLancarNoInferno={usarLancarNoInferno}
            onRecuperarLancarNoInfernoComEspacoDePacto={recuperarLancarNoInfernoComEspacoDePacto}
            onAlterarPv={alterarPv}
            turnState={turnState}
            onMarcarUsado={marcarUsado}
            onFimDoTurno={fimDoTurno}
            espacos={espacosParaConjurar}
            espacosGastosPorCirculo={espacosGastosParaConjurar}
            onGastarSlotCirculo={gastarSlotCirculo}
            classeAtivaNome={chaveDoPoolDeMagia}
            ponte={ponte}
            estiloDeLuta={estiloDeLuta}
            nivel={personagem.nivel}
            usosFolegoMaximo={usosFolegoMaximo}
            usosFolegoRestantes={usosFolegoRestantes}
            onUsarUsoFolego={usarUsoFolego}
            usosConhecimentoDePedrasMaximo={usosConhecimentoDePedrasMaximo}
            usosConhecimentoDePedrasRestantes={usosConhecimentoDePedrasRestantes}
            onUsarConhecimentoDePedras={usarConhecimentoDePedras}
            usosPicoDeAdrenalinaMaximo={usosPicoDeAdrenalinaMaximo}
            usosPicoDeAdrenalinaRestantes={usosPicoDeAdrenalinaRestantes}
            onUsarPicoDeAdrenalina={usarPicoDeAdrenalina}
            ataqueDeSoproDisponivel={ataqueDeSoproDisponivel}
            usosAtaqueDeSoproMaximo={usosAtaqueDeSoproMaximo}
            usosAtaqueDeSoproRestantes={usosAtaqueDeSoproRestantes}
            cdAtaqueDeSopro={cdAtaqueDeSopro}
            numDadosAtaqueDeSopro={numDadosAtaqueDeSopro}
            tipoDanoAtaqueDeSopro={tipoDanoAtaqueDeSopro}
            onUsarAtaqueDeSopro={usarAtaqueDeSopro}
            vooDraconicoDisponivel={vooDraconicoDisponivel}
            vooDraconicoGasto={vooDraconicoGasto}
            onUsarVooDraconico={usarVooDraconico}
            ancestralidadeGiganteEscolhida={ancestralidadeGiganteEscolhida}
            usosAncestralidadeGiganteMaximo={usosAncestralidadeGiganteMaximo}
            usosAncestralidadeGiganteRestantes={usosAncestralidadeGiganteRestantes}
            onUsarAncestralidadeGigante={usarAncestralidadeGigante}
            modConstituicaoAtual={modConstituicaoAtual}
            formaGrandeDisponivel={formaGrandeDisponivel}
            formaGrandeGasto={formaGrandeGasto}
            formaGrandeAtiva={formaGrandeAtiva}
            onUsarFormaGrande={usarFormaGrande}
            maosCurativasDisponivel={maosCurativasDisponivel}
            maosCurativasGasto={maosCurativasGasto}
            dadosMaosCurativas={dadosMaosCurativas}
            onUsarMaosCurativas={usarMaosCurativas}
            revelacaoCelestialDisponivel={revelacaoCelestialDisponivel}
            revelacaoCelestialGasto={revelacaoCelestialGasto}
            revelacaoCelestialFormaAtiva={revelacaoCelestialFormaAtiva}
            opcoesRevelacaoCelestial={opcoesRevelacaoCelestial}
            danoBonusRevelacaoCelestial={danoBonusRevelacaoCelestial}
            cdMantoNecrotico={cdMantoNecrotico}
            onUsarRevelacaoCelestial={usarRevelacaoCelestial}
            falarComAnimaisGnomoDisponivel={falarComAnimaisGnomoDisponivel}
            usosFalarComAnimaisGnomoMaximo={usosFalarComAnimaisGnomoMaximo}
            usosFalarComAnimaisGnomoRestantes={usosFalarComAnimaisGnomoRestantes}
            onUsarFalarComAnimaisGnomo={usarFalarComAnimaisGnomo}
            conjura={conjura}
            truques={truques}
            magiasPreparadasAcao={magiasPreparadasAcao}
            magiasPreparadasReacao={magiasPreparadasReacao}
            modAcertoConjuracao={modAcertoConjuracao}
            numAtaques={numAtaques}
            indomavelMaximo={indomavelMaximo}
            indomavelRestantes={indomavelRestantes}
            onUsarIndomavel={usarIndomavel}
            pontosDeSorteMaximo={pontosDeSorteMaximo}
            pontosDeSorteRestantes={pontosDeSorteRestantes}
            onUsarPontoDeSorte={usarPontoDeSorte}
            danoDesarmadoRerollDisponivel={danoDesarmadoRerollDisponivel}
            perfuradorDisponivel={perfuradorDisponivel}
            surtoMaximo={surtoMaximo}
            surtoRestantes={surtoRestantes}
            surtoUsadoTurno={surtoUsadoTurno}
            onUsarSurto={usarSurto}
            mestreTatico={mestreTatico}
            ataquesEstudados={ataquesEstudados}
            ajusteTatico={ajusteTatico}
            ataqueAtual={ataque}
            ataqueBonus={ataqueBonus}
            usosInspiracaoMaximo={usosInspiracaoMax}
            usosInspiracaoRestantes={usosInspiracaoRestantes}
            tamanhoDadoInspiracao={tamanhoDadoInspiracao}
            fonteDeInspiracao={fonteDeInspiracao}
            onUsarInspiracao={usarInspiracao}
            onRecuperarInspiracaoComEspaco={recuperarInspiracaoComEspaco}
            contraEncantamentoDisponivel={contraEncantamentoDisponivel}
            palavrasDeInterrupcaoDisponivel={palavrasDeInterrupcaoDisponivel}
            periciaInigualavelDisponivel={periciaInigualavelDisponivel}
            onDevolverUsoInspiracao={devolverUsoInspiracao}
            iniciativaMod={iniciativa}
            onRolarIniciativa={aoRolarIniciativa}
            colheitaMacabraDisponivel={colheitaMacabraDisponivel}
            onColheitaMacabraDisponivel={(cura) => setColheitaMacabraPendente({ cura })}
            colheitaDosMortosDisponivel={colheitaDosMortosDisponivel}
            personagemEnsanguentado={personagemEstaEnsanguentado}
            opcoesColheitaDosMortos={opcoesColheitaDosMortosAtuais}
            onColheitaDosMortos={usarColheitaDosMortos}
            mestreDaMorteDisponivel={mestreDaMorteDisponivel}
            petsMortoVivo={petsMortoVivoAtuais}
            pvTempMestreDaMorte={pvTempMestreDaMorteAtual}
            onUsarMestreDaMorte={usarMestreDaMorte}
            mestreDaMorteExplosaoLiberada={mestreDaMorteExplosaoLiberadaAtual}
            modIntAtual={modIntAtual}
          />
        )}
        {tab === 'pets' && (
          <PetsTab
            pets={pets}
            formasFamiliarElegiveis={formasFamiliarElegiveis}
            formasFamiliarMortoVivoElegiveis={formasFamiliarMortoVivoElegiveis}
            legiaoDosMortosDisponivel={legiaoDosMortosDisponivel}
            onAdicionarPet={adicionarPet}
            onRemoverPet={removerPet}
            onAlterarPvPet={alterarPvPet}
            onAlternarBonusLegiaoDosMortos={alternarBonusLegiaoDosMortos}
            onAbrirAjustarPet={() => setAjustarPetAberto(true)}
          />
        )}
      </div>

      <div className={styles.tabbarLayer}>
        <div className={styles.tabbar}>
          {TABS.map((t) => (
            <div
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.tabIconWrap}>
                <span className={styles.tabIcon}>{t.icon}</span>
              </span>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <Dice3dFab />
    </div>
  );
}
