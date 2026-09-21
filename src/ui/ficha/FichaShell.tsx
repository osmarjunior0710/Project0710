import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { armazenamentoPersonagens, type PersonagemSalvo } from '../../core/armazenamentoPersonagens';
import { garantirPersonagemDemo, ID_PERSONAGEM_DEMO } from '../../core/personagemDemo';
import { useColapsavel } from '../hooks/useColapsavel';
import { useHouseRules } from './hooks/useHouseRules';
import { useAutosavePersonagem } from './hooks/useAutosavePersonagem';
import { recursoContado, recursoFlagUnica } from './hooks/recursoGasto';
import { caracteristicasSubclasseAtivas } from './hooks/caracteristicasSubclasseAtivas';
import { useMagiasEConjuracao } from './hooks/useMagiasEConjuracao';
import {
  bonusProficiencia,
  calcularAtributosFinais,
  calcularCAEquipado,
  calcularIniciativa,
  calcularPercepcaoPassiva,
  calcularPericias,
  calcularSalvaguardas,
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
import { atributosResilienteEscolhidos } from '../../core/talentoAtributo';
import { atributosOrdem, type Atributo } from '../../data/wizardFixtures';
import {
  classesDoPersonagem,
  nivelTotalPersonagem,
  opcoesLevelUp,
  deveEscolherClasseNoLevelUp,
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
import {
  bonusLegiaoDosMortos,
  petsMortoVivo,
} from '../../core/necromante';
import {
  alternarDuasMaosVersatil,
  desequiparItem as desequiparItemPuro,
  equiparNoSlot,
  resumoEquipado,
  type SlotEquipamento,
} from '../../core/equipamento';
import { ataqueAtual, ataqueBonusMaoSecundaria } from '../../core/ataque';
import { armas } from '../../data/rulesets/dnd2024/armas';
import { explicarCdGolpeDeEscudo } from '../../core/golpeDeEscudo';
import { alternarSintonizacao } from '../../core/sintonizacao';
import { armaDePactoAtual, vincularArmaDePacto, desvincularArmaDePacto, ataqueExtraDoPactoDaLamina } from '../../core/pactoDaLamina';
import { armasParaMaestria as listarArmasParaMaestria, armasElegiveisParaMaestriaExtra } from '../../core/maestriaArma';
import { quantidadeRecuperarFolego, quantidadeFuria, bonusDanoFuria } from '../../core/recursosClasse';
import { type MagiaGratisDeInvocacao } from '../../core/invocacoesMagiaGratis';
import { aplicarAlteracaoPv, ganharPvTemporario } from '../../core/pvTemporario';
import { deveAplicarVigorImplacavel } from '../../core/vigorImplacavel';
import { deveOferecerFuriaImplacavel, cdFuriaImplacavel, pvFuriaImplacavel } from '../../core/furiaImplacavel';
import { aplicarCampeaoPrimitivo } from '../../core/campeaoPrimitivo';
import { ajustarPvMaximoPorMudancaDeCon } from '../../core/pvRetroativo';
import { tipoDanoSubescolha, opcoesEscolhaReutilizavel } from '../../core/especieSubescolha';
import { dadosAtaqueDeSopro, explicarCdAtaqueDeSopro } from '../../core/ataqueDeSopro';
import { valorBencaoDoTenebroso } from '../../core/bencaoDoTenebroso';
import {
  CHAVE_RITUAL_RAPIDO,
  type MagiaGratisDeTalentoGeral,
} from '../../core/magiaTalentoGeral';
import { temPerfurador } from '../../core/rerollDanoTalento';
import { usosSorteDoTenebroso } from '../../core/sorteDoTenebroso';
import { armaduraSemTreinamentoEquipada } from '../../core/proficienciaArmadura';
import { useRoll } from '../roll/RollContext';
import { sortearLevelUpRapido } from '../../core/levelUpAleatorio';
import { podeLevelUpPorXp, proximoMarcoXp } from '../../core/experiencia';
import {
  espacosDeMagiaAtivos,
  modAcertoConjuracao as calcularModAcertoConjuracao,
  explicarModAcertoConjuracao,
  explicarCdConjuracao,
  magiasDisponiveisParaPreparar,
  poolDescobertasMagicas,
} from '../../core/magiasPersonagem';
import { usosInspiracaoMaximo, dadoInspiracao, fonteDeInspiracaoDesbloqueada } from '../../core/inspiracaoBardo';
import { caracteristicaDesbloqueada, contarRepeticoesCaracteristica, numeroDeAtaques } from '../../core/levelUp';
import { ID_CARACTERISTICA_CLASSE } from '../../data/rulesets/dnd2024/idsCaracteristicasClasse';
import { estilosDeLuta } from '../../data/rulesets/dnd2024/estilosDeLuta';
import { armaduras } from '../../data/rulesets/dnd2024/armaduras';
import { origens } from '../../data/rulesets/dnd2024/origens';
import { especies } from '../../data/rulesets/dnd2024/especies';
import { magiasDaClasse } from '../../data/rulesets/dnd2024/magias';
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
import FuriaImplacavelModal from '../components/FuriaImplacavelModal';
import Dice3dFab from './dice3d/Dice3dFab';
import DescansoFab from './DescansoFab';
import DadosDeVidaModal from './DadosDeVidaModal';
import { reservaDeDadosDeVida, totalDeDadosRestantes } from '../../core/dadosDeVida';
import LevelUpShell, { type PersonagemNivel } from './levelup/LevelUpShell';
import CompletarMagiasShell from './levelup/CompletarMagiasShell';
import LivroDasSombrasShell from './levelup/LivroDasSombrasShell';
import MemorizarMagiaShell from './levelup/MemorizarMagiaShell';
import DescansoOverlay, { type FaseDescanso, type TipoDescanso } from './DescansoOverlay';
import XpShell from './XpShell';

type TabName = 'atributos' | 'perfil' | 'mochila' | 'magias' | 'combat' | 'pets';

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

/** Duração do efeito de Cura (ver `dispararEfeitoCura`) — mesma
 * constante escrita no CSS via `style` inline (`--duracao-cura`),
 * nunca duplicada separadamente (padrão de duração sincronizada, ver
 * DECISOES-COMBATE.md). */
const DURACAO_CURA_MS = 2000;

/** Partículas "+" do efeito de Cura — mesma técnica de
 * `PARTICULAS_FURIA` (`CombatTab.tsx`), mas só nascendo da BASE da
 * tela e subindo (`dy` sempre negativo), não vindo das 4 bordas.
 * Lista fixa (decoração, não precisa variar entre renders); soma de
 * `delay` + `duration` de cada uma fica dentro de `DURACAO_CURA_MS`,
 * pra nenhuma ficar cortada no meio quando o efeito some. */
const PARTICULAS_CURA: { left: string; dy: string; delay: string; duration: string }[] = [
  { left: '10%', dy: '-160px', delay: '0s', duration: '1.6s' },
  { left: '25%', dy: '-190px', delay: '0.15s', duration: '1.4s' },
  { left: '40%', dy: '-150px', delay: '0.3s', duration: '1.7s' },
  { left: '55%', dy: '-200px', delay: '0.05s', duration: '1.5s' },
  { left: '70%', dy: '-170px', delay: '0.25s', duration: '1.6s' },
  { left: '85%', dy: '-185px', delay: '0.1s', duration: '1.5s' },
];

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
  const {
    registrarBonusExtra,
    registrarSorte,
    registrarInspiracaoHeroica,
    registrarForcaIndomavel,
    estado: rollEmAndamento,
    rolarD20,
  } = useRoll();
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
  /** Campeão Primitivo (Bárbaro nível 20) — checa TODAS as classes do
   * personagem (não só a ativa/original), já que a característica
   * afeta Força/Constituição do personagem inteiro, não só da classe
   * em foco. Ver `core/campeaoPrimitivo.ts`. */
  const temCampeaoPrimitivo = classesAtual.some((c) => {
    const classeCatalogo = catalogoClasses.find((cc) => cc.nome === c.classe);
    return classeCatalogo ? caracteristicaDesbloqueada(classeCatalogo, ID_CARACTERISTICA_CLASSE.campeaoPrimitivo, c.nivel) !== null : false;
  });

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
  /** Efeito de Cura (ver `dispararEfeitoCura`/`onCuraDeMagiaAplicada`)
   * — `useState(false)` + `setTimeout`, mesmo padrão da "piscada" de
   * Fim de Turno (`CombatTab.tsx`), não um toggle contínuo. */
  const [curaEfeitoAtivo, setCuraEfeitoAtivo] = useState(false);
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
  /** Truque vinculado a cada Invocação Mística que exige essa escolha
   * (Explosão Agonizante/Repulsiva) — chave = id da invocação, valor =
   * NOME do truque. Escolhido numa tela própria do Level Up, logo
   * depois de Invocações Místicas (ver `core/invocacoesMisticas.ts`,
   * `INVOCACOES_COM_VINCULO_TRUQUE`). */
  const [invocacoesTruqueVinculado, setInvocacoesTruqueVinculado] = useState<Record<string, string>>(
    personagemSalvo.invocacoesTruqueVinculado ?? {},
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
  // Escolha de atributo do Resiliente — ver `core/talentoAtributo.ts`.
  const [escolhaAtributoTalentoGeral, setEscolhaAtributoTalentoGeral] = useState<Record<string, string>>(
    personagemSalvo.escolhaAtributoTalentoGeral ?? {},
  );
  // Slot EXTRA de Maestria em Arma do Mestre das Armas — independente
  // dos slots nativos (`maestriaArma`) — ver `core/maestriaArma.ts`.
  const [maestriaArmaExtra, setMaestriaArmaExtra] = useState<string | null>(
    personagemSalvo.maestriaArmaTalentoGeralAtual ?? null,
  );
  const [talentosFavoritos, setTalentosFavoritos] = useState<string[]>(personagemSalvo.talentosFavoritosAtual ?? []);
  const [folegoGasto, setFolegoGasto] = useState(personagemSalvo.folegoGasto ?? 0);
  const [vigorImplacavelGasto, setVigorImplacavelGasto] = useState(personagemSalvo.vigorImplacavelGasto ?? false);
  // Dados de Vida gastos por tipo (ver `core/dadosDeVida.ts`) — a reserva
  // sempre soma TODAS as classes, nunca só a classe em foco.
  const [dadosDeVidaGastos, setDadosDeVidaGastos] = useState<Record<string, number>>(
    personagemSalvo.dadosDeVidaGastos ?? {},
  );
  const [dadosDeVidaAberto, setDadosDeVidaAberto] = useState(false);
  const [furiaImplacavelUsos, setFuriaImplacavelUsos] = useState(personagemSalvo.furiaImplacavelUsosDesdeDescanso ?? 0);
  const [furiaPersistenteUsada, setFuriaPersistenteUsada] = useState(personagemSalvo.furiaPersistenteUsada ?? false);
  const [furiaImplacavelPendente, setFuriaImplacavelPendente] = useState(false);
  /** `null` = ainda oferecendo (fase 'oferta' do modal), esperando o
   * jogador tocar em rolar; `true`/`false` = dado já rolado, resultado
   * decidido (fase 'resultado'). */
  const [furiaImplacavelResultado, setFuriaImplacavelResultado] = useState<boolean | null>(null);
  const [conhecimentoDePedrasGasto, setConhecimentoDePedrasGasto] = useState(personagemSalvo.conhecimentoDePedrasGasto ?? 0);
  const [picoDeAdrenalinaGasto, setPicoDeAdrenalinaGasto] = useState(personagemSalvo.picoDeAdrenalinaGasto ?? 0);
  const [ataqueDeSoproGasto, setAtaqueDeSoproGasto] = useState(personagemSalvo.ataqueDeSoproGasto ?? 0);
  const [vooDraconicoGasto, setVooDraconicoGasto] = useState(personagemSalvo.vooDraconicoGasto ?? false);
  const [ancestralidadeGiganteGasto, setAncestralidadeGiganteGasto] = useState(
    personagemSalvo.ancestralidadeGiganteGasto ?? 0,
  );
  const [formaGrandeGasto, setFormaGrandeGasto] = useState(personagemSalvo.formaGrandeGasto ?? false);
  const [formaGrandeAtiva, setFormaGrandeAtiva] = useState(personagemSalvo.formaGrandeAtiva ?? false);
  const [furiaGasto, setFuriaGasto] = useState(personagemSalvo.furiaGasto ?? 0);
  const [furiaAtiva, setFuriaAtiva] = useState(personagemSalvo.furiaAtiva ?? false);
  const [ataqueImprudenteAtivo, setAtaqueImprudenteAtivo] = useState(personagemSalvo.ataqueImprudenteAtivoTurno ?? false);
  const [golpeBrutalUsadoTurno, setGolpeBrutalUsadoTurno] = useState(personagemSalvo.golpeBrutalUsadoTurno ?? false);
  // Golpe de Escudo (Mestre em Escudos) — 1x por turno, mesmo padrão
  // de `golpeBrutalUsadoTurno`.
  const [golpeDeEscudoUsadoTurno, setGolpeDeEscudoUsadoTurno] = useState(personagemSalvo.golpeDeEscudoUsadoTurno ?? false);
  // Esmagador/Talhador — mesmo padrão 1x/turno, flags independentes
  // (o personagem pode ter os 2 talentos ao mesmo tempo).
  const [esmagadorUsadoTurno, setEsmagadorUsadoTurno] = useState(personagemSalvo.esmagadorUsadoTurno ?? false);
  const [talhadorUsadoTurno, setTalhadorUsadoTurno] = useState(personagemSalvo.talhadorUsadoTurno ?? false);
  const [conhecimentoPrimordialPericiaEscolhida, setConhecimentoPrimordialPericiaEscolhida] = useState(
    personagemSalvo.conhecimentoPrimordialPericiaEscolhida ?? null,
  );
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
  // Maestria em Arma — regra real (livro): troca 1x a cada Descanso
  // Longo, não a qualquer momento (ver DECISOES-CLASSES.md). Default
  // `true` (disponível) pra não travar personagens já salvos antes
  // desta correção existir — passa a `false` só depois do 1º uso,
  // volta a `true` no próximo Descanso Longo. Slot nativo (Guerreiro/
  // Bárbaro) e o slot extra do talento Mestre das Armas são fontes
  // INDEPENDENTES (o livro concede a troca separadamente em cada),
  // cada um com sua própria trava.
  const [maestriaArmaTrocaDisponivel, setMaestriaArmaTrocaDisponivel] = useState(
    personagemSalvo.maestriaArmaTrocaDisponivel ?? true,
  );
  const [maestriaArmaTalentoTrocaDisponivel, setMaestriaArmaTalentoTrocaDisponivel] = useState(
    personagemSalvo.maestriaArmaTalentoTrocaDisponivel ?? true,
  );
  // Cortar (Mestre em Armas Grandes) — libera 1 ataque bônus com a
  // MESMA arma após Crítico (detectado sozinho, ver useEffect abaixo)
  // ou reduzir o alvo a 0 PV (confirmação manual). Reseta em
  // `fimDoTurno`, mesmo padrão de `golpeBrutalUsadoTurno`.
  const [cortarPronto, setCortarPronto] = useState(personagemSalvo.cortarProntoTurno ?? false);
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
  // Aviso temporário na tela (hoje só Vigor Implacável). O texto de
  // "o que o Descanso recuperou" foi removido a pedido do Osmar.
  useEffect(() => {
    if (!restStatus) return;
    const t = setTimeout(() => setRestStatus(null), 9000);
    return () => clearTimeout(t);
  }, [restStatus]);
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
  const [xpAtual, setXpAtual] = useState(personagemSalvo.xp ?? 0);
  const [xpPopupAberto, setXpPopupAberto] = useState(false);
  // [Ferramenta de teste] Snapshot de cada nível já visitado (ver
  // PersonagemSalvo.snapshotsNivel) — precisa de `useState` próprio
  // (mesmo padrão de todo o resto do estado persistido aqui) em vez
  // de derivar direto de `personagemSalvo.snapshotsNivel` a cada
  // render: `personagemSalvo` é relido de fora (localStorage) no topo
  // do componente a cada render, então usá-lo como fonte de verdade
  // dentro do efeito de auto-save (abaixo) perde escritas anteriores
  // quando 2 níveis são alcançados em sequência rápida.
  const [snapshotsNivel, setSnapshotsNivel] = useState<Record<number, Omit<PersonagemSalvo, 'snapshotsNivel'>>>(
    personagemSalvo.snapshotsNivel ?? {},
  );
  const [itensDetalhados, setItensDetalhados] = useColapsavel('itens-detalhados', false);
  const { regras: houseRules, alternar: alternarHouseRule } = useHouseRules();
  const pesoAtivo = houseRules.pesoMochila;

  const desValor = valorFinalAtributo(selecao, 'DES') ?? 10;
  const conValorFinal = aplicarCampeaoPrimitivo(valorFinalAtributo(selecao, 'CON') ?? 10, 'CON', temCampeaoPrimitivo);
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
  const ca = calcularCAEquipado(itensMochila, desValor, conValorFinal, personagem.estiloDeLuta, talentosEfetivos, classeOriginal, classesMulticlassadasNomes);
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
  const atributos = calcularAtributosFinais(selecao, temCampeaoPrimitivo);
  const atributosFinaisAtuais = Object.fromEntries(
    atributosOrdem.map((a) => [a, aplicarCampeaoPrimitivo(valorFinalAtributo(selecao, a) ?? 10, a, temCampeaoPrimitivo)]),
  ) as Record<Atributo, number>;
  const forMod = atributos.find((a) => a.atributo === 'FOR')?.mod ?? 0;
  const desMod = atributos.find((a) => a.atributo === 'DES')?.mod ?? 0;
  const carMod = atributos.find((a) => a.atributo === 'CAR')?.mod ?? 0;
  // Conhecimento Primordial (Bárbaro, nível 3) — enquanto a Fúria
  // estiver ativa, essas 5 perícias usam o mod. de Força em vez do
  // atributo normal (ver `calcularPericias`, parâmetro
  // `substituicaoForca`). Lista fixa da própria característica (Livro
  // do Jogador), não vem da planilha.
  const temConhecimentoPrimordial = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.conhecimentoPrimordial, personagem.nivel) !== null
    : false;
  const PERICIAS_CONHECIMENTO_PRIMORDIAL = ['Acrobacia', 'Furtividade', 'Intimidação', 'Percepção', 'Sobrevivência'];
  const pericias = calcularPericias(
    selecao,
    personagem.nivel,
    periciasEspecialistaAtuais,
    [
      ...periciasSubclasseBonusAtuais,
      ...periciasTalentoGeralAtuais,
      ...periciasMulticlasseAtuais,
      ...(conhecimentoPrimordialPericiaEscolhida ? [conhecimentoPrimordialPericiaEscolhida] : []),
    ],
    nivelTotalAtual,
    { ativa: temConhecimentoPrimordial && furiaAtiva, mod: forMod, pericias: PERICIAS_CONHECIMENTO_PRIMORDIAL },
    temCampeaoPrimitivo,
  );
  const salvaguardas = calcularSalvaguardas(
    selecao,
    classeOriginal,
    nivelTotalAtual,
    atributosResilienteEscolhidos(talentosEfetivos, escolhaAtributoTalentoGeral),
    temCampeaoPrimitivo,
  );
  const proficienciasFerramenta = calcularProficienciasFerramenta(selecao, nivelTotalAtual, ferramentasMulticlasseAtuais);
  const bonusProficienciaAtual = classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const capacidadeMaxima = calcularCapacidadeMaxima(selecao, formaGrandeAtiva, temCampeaoPrimitivo);
  const explicacaoCapacidadeMaxima = explicarCapacidadeMaxima(selecao, formaGrandeAtiva, temCampeaoPrimitivo);
  const explicacaoPv = explicarPvMaximo(selecao, personagem.pvMax);
  const explicacaoCa = explicarCAEquipado(itensMochila, desValor, conValorFinal, personagem.estiloDeLuta, talentosEfetivos, classeOriginal, classesMulticlassadasNomes);
  const explicacaoIniciativa = explicarIniciativa(selecao, classe, nivelTotalAtual, talentosEfetivos);
  const explicacaoPercepcaoPassiva = explicarPercepcaoPassiva(selecao, nivelTotalAtual);
  const estiloDeLuta = estilosDeLuta.find((e) => e.nome === personagem.estiloDeLuta) ?? null;
  const usosFolegoMaximo = classe ? quantidadeRecuperarFolego(classe, personagem.nivel) : 0;
  const usosFolegoRestantes = Math.max(0, usosFolegoMaximo - folegoGasto);
  // Fúria (Bárbaro) — ver sdd/sdd-barbaro-furia.md. `armaduraPesadaEquipada`
  // também trava a ATIVAÇÃO (regra real) e força o encerramento
  // automático ao equipar (ver `equiparItem`).
  const furiaMaximo = classe ? quantidadeFuria(classe, nivelTotalAtual) : 0;
  const furiaDisponivel = furiaMaximo > 0;
  const furiaRestantes = Math.max(0, furiaMaximo - furiaGasto);
  const furiaBonusDano = classe ? bonusDanoFuria(classe, nivelTotalAtual) : 0;
  const armaduraPesadaEquipada = armaduraEquipadaCatalogo?.categoria.startsWith('Armadura Pesada') ?? false;
  const temVigorImplacavel = selecao.especie === 'Orc';
  const usosConhecimentoDePedrasMaximo = selecao.especie === 'Anão' && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosConhecimentoDePedrasRestantes = Math.max(0, usosConhecimentoDePedrasMaximo - conhecimentoDePedrasGasto);
  const usosPicoDeAdrenalinaMaximo = selecao.especie === 'Orc' && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosPicoDeAdrenalinaRestantes = Math.max(0, usosPicoDeAdrenalinaMaximo - picoDeAdrenalinaGasto);
  const especieAtual = especies.find((e) => e.nome === selecao.especie) ?? null;
  const ataqueDeSoproDisponivel = selecao.especie === 'Draconato';
  const usosAtaqueDeSoproMaximo = ataqueDeSoproDisponivel && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosAtaqueDeSoproRestantes = Math.max(0, usosAtaqueDeSoproMaximo - ataqueDeSoproGasto);
  const cdAtaqueDeSopro = 8 + modificador(conValorFinal) + bonusProficienciaAtual;
  const explicacaoCdAtaqueDeSopro = explicarCdAtaqueDeSopro(modificador(conValorFinal), bonusProficienciaAtual);
  const numDadosAtaqueDeSopro = dadosAtaqueDeSopro(nivelTotalAtual);
  const tipoDanoAtaqueDeSopro = especieAtual ? tipoDanoSubescolha(especieAtual, selecao) : null;
  const vooDraconicoDisponivel = selecao.especie === 'Draconato' && nivelTotalAtual >= 5;
  const ancestralidadeGiganteEscolhida = selecao.especie === 'Golias' ? selecao.subescolhaEspecieEscolhida : null;
  const usosAncestralidadeGiganteMaximo =
    ancestralidadeGiganteEscolhida && classe ? bonusProficiencia(classe, nivelTotalAtual) : 0;
  const usosAncestralidadeGiganteRestantes = Math.max(0, usosAncestralidadeGiganteMaximo - ancestralidadeGiganteGasto);
  const formaGrandeDisponivel = selecao.especie === 'Golias' && nivelTotalAtual >= 5;
  const modConstituicaoAtual = modificador(conValorFinal);
  const reservaDadosDeVida = reservaDeDadosDeVida(
    classesAtual,
    (nome) => catalogoClasses.find((c) => c.nome === nome)?.dadoDeVida,
    dadosDeVidaGastos,
  );
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
  // G3.4 (foco de saúde do projeto, ver EmDevB.md): consolida os
  // 11 `caracteristicaSubclasseDesbloqueada(subclasse, ID, nível)`
  // (mesmos 2 primeiros argumentos sempre, só o ID muda) numa chamada
  // só — os nomes locais abaixo continuam exatamente os mesmos de
  // antes, só a forma de calculá-los mudou.
  const {
    legiaoDosMortos: legiaoDosMortosDisponivel,
    grimorioDeNecromancia: colheitaMacabraDisponivel,
    colheitaDosMortos: colheitaDosMortosDisponivel,
    mestreDaMorte: mestreDaMorteDisponivel,
    magiasDePactoDoInfero: magiasPactoDoInferoDisponivel,
    palavrasDeInterrupcao: palavrasDeInterrupcaoDisponivel,
    periciaInigualavel: periciaInigualavelDisponivel,
    bencaoDoTenebroso: bencaoDoTenebrosoDisponivel,
    aSorteDoProprioTenebroso: sorteDoTenebrosoDisponivel,
    resistenciaInfera: resistenciaInferaDisponivel,
    lancarNoInferno: lancarNoInfernoDisponivel,
  } = caracteristicasSubclasseAtivas(personagem.subclasse, personagem.nivel, [
    'legiaoDosMortos',
    'grimorioDeNecromancia',
    'colheitaDosMortos',
    'mestreDaMorte',
    'magiasDePactoDoInfero',
    'palavrasDeInterrupcao',
    'periciaInigualavel',
    'bencaoDoTenebroso',
    'aSorteDoProprioTenebroso',
    'resistenciaInfera',
    'lancarNoInferno',
  ]);
  // G3.3 (foco de saúde do projeto, ver EmDevB.md): todo o bloco de
  // magia/conjuração/pool combinado (antes ~150 linhas soltas aqui)
  // agora mora em `useMagiasEConjuracao` — cópia literal, mesmos nomes
  // locais de sempre, nada de comportamento mudou.
  const {
    conjura,
    espacos,
    ponte,
    chaveDoPoolDeMagia,
    espacosParaConjurar,
    espacosGastosParaConjurar,
    memorizarMagiaDisponivel,
    livroDeMagias,
    usaRedefPorDescanso,
    magiasGratisConcedidas,
    formasFamiliarElegiveis,
    formasFamiliarMortoVivoElegiveis,
    modIntAtual,
    personagemEstaEnsanguentado,
    opcoesColheitaDosMortosAtuais,
    pvTempMestreDaMorteAtual,
    petsMortoVivoAtuais,
    mestreDaMorteExplosaoLiberadaAtual,
    astuciaMagicaDisponivel,
    contatarPatronoDisponivel,
    contatoExtraplanar,
    arcanaMisticaEscolhidas,
    espacoPactoAtual,
    astuciaMagicaRecupera,
    sentidos,
    faltamTruques,
    faltamMagiasPreparadas,
    magiasPactoDoInferoAtuais,
    magiasEspecieAtuais,
    magiasTalentoOrigemAtuais,
    magiaIniciadaOrigemAtual,
    magiaIniciadaEspecieAtual,
    magiasTalentoGeralAtuais,
    magiasGratisTalentoGeral,
    ritualRapidoDisponivel,
    ritualRapidoGasto,
    acoesGenericasBonus,
    magiasPreparadasReacao,
    magiasPreparadasBonus,
    magiasPreparadasAcao,
    truquesAcao,
    truquesBonus,
  } = useMagiasEConjuracao({
    classe,
    personagem,
    selecao,
    classesAtual,
    classeAtivaNome,
    classeAtivaEntry,
    espacosGastosPorClasseECirculo,
    espacosGastosPorCirculo,
    talentosEfetivos,
    truquesAtuais,
    magiasPreparadasAtuais,
    magiasDescobertasMagicasAtuais,
    livroDasSombrasAtuais,
    livroDeMagiasAtuais,
    invocacoesMisticasAtuais,
    pets,
    atributos,
    arcanaMisticaAtuais,
    escolhaMagiaTalentoGeral,
    magiasGratisGastas,
    nivelTotalAtual,
    origemPersonagem,
    pvAtual,
    mestreDaMorteDisponivel,
    magiasPactoDoInferoDisponivel,
  });
  const modAcertoConjuracao = calcularModAcertoConjuracao(selecao, classe, nivelTotalAtual);
  const explicacaoAcertoConjuracao = explicarModAcertoConjuracao(selecao, classe, nivelTotalAtual);
  const explicacaoCdConjuracao = explicarCdConjuracao(selecao, classe, nivelTotalAtual);
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
  const temSentidoDePerigo = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.sentidoDePerigo, personagem.nivel) !== null
    : false;
  const temAtaqueImprudente = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.ataqueImprudente, personagem.nivel) !== null
    : false;
  const temInstintosPrimitivos = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.instintosPrimitivos, personagem.nivel) !== null
    : false;
  const temGolpeBrutal = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.golpeBrutal, personagem.nivel) !== null
    : false;
  /** 0 = ainda não chegou no nível 13; 1 = nível 13-16 (+2 efeitos);
   * 2 = nível 17+ (2d10, escolhe 2 efeitos de uma vez) — mesmo padrão
   * de "conta repetições do mesmo nome" já usado por Indomável/Surto
   * de Ação (2 níveis de característica com o MESMO nome). */
  const golpeBrutalFortalecidoCount = classe
    ? contarRepeticoesCaracteristica(classe, ID_CARACTERISTICA_CLASSE.golpeBrutalFortalecido, personagem.nivel)
    : 0;
  const golpeBrutalDados = golpeBrutalFortalecidoCount >= 2 ? 2 : 1;
  const golpeBrutalEfeitosNivel13 = golpeBrutalFortalecidoCount >= 1;
  const golpeBrutalEscolhas = golpeBrutalFortalecidoCount >= 2 ? 2 : 1;
  const temFuriaImplacavel = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.furiaImplacavel, personagem.nivel) !== null
    : false;
  /** Salvaguarda de Constituição do personagem — reaproveitada pela
   * própria Fúria Implacável pra rolar o d20 dela (ver
   * `rolarFuriaImplacavel`), em vez de mandar o jogador pra aba
   * Atributos. */
  const salvaguardaCon = salvaguardas.find((s) => s.atributo === 'CON') ?? null;
  const temFuriaPersistente = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.furiaPersistente, personagem.nivel) !== null
    : false;
  /** Botão "Recuperar Fúria" só aparece com a característica, pelo
   * menos 1 uso gasto pra recuperar de verdade, e ainda não usada
   * desde o último Descanso Longo — regra real não trava no instante
   * exato de rolar Iniciativa (ver `EmDevB.md`, B4.7). */
  const furiaPersistenteDisponivel = temFuriaPersistente && furiaGasto > 0 && !furiaPersistenteUsada;
  const temForcaIndomavel = classe
    ? caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.forcaIndomavel, personagem.nivel) !== null
    : false;
  const forValorFinal = aplicarCampeaoPrimitivo(valorFinalAtributo(selecao, 'FOR') ?? 10, 'FOR', temCampeaoPrimitivo);
  const sorteDoTenebrosoMaximo = sorteDoTenebrosoDisponivel ? usosSorteDoTenebroso(carMod) : 0;
  const sorteDoTenebrosoRestantes = Math.max(0, sorteDoTenebrosoMaximo - sorteDoTenebrosoGasto);
  const equipadoAtual = resumoEquipado(itensMochila);
  const armaEquipada = equipadoAtual.maoPrincipal;
  const armaEquipadaCatalogo = armaEquipada ? armas.find((a) => a.nome === armaEquipada.nome) : undefined;
  const armaEquipadaEhCorpoACorpo = armaEquipadaCatalogo ? !armaEquipadaCatalogo.categoria.includes('à Distância') : false;
  const temMestreArmasGrandes = efeitoMecanicoDoTalento(talentosEfetivos, 'dano-extra-e-cortar-arma-pesada') !== null;
  // Cortar só pode ser oferecido com arma Corpo a Corpo (regra real) —
  // gate usado tanto pro botão manual "Reduziu a 0 PV?" quanto pro
  // useEffect de detecção automática de Crítico, mais abaixo.
  const podeOferecerCortar = temMestreArmasGrandes && armaEquipadaEhCorpoACorpo;
  // Golpe de Escudo (Mestre em Escudos) — precisa de arma Corpo a
  // Corpo (mesma checagem de Cortar) + Escudo equipado.
  const temMestreEmEscudos = efeitoMecanicoDoTalento(talentosEfetivos, 'golpe-de-escudo') !== null;
  const podeOferecerGolpeDeEscudo = temMestreEmEscudos && armaEquipadaEhCorpoACorpo && equipadoAtual.escudo !== null;
  const explicacaoCdGolpeDeEscudo = podeOferecerGolpeDeEscudo
    ? explicarCdGolpeDeEscudo(forMod, bonusProficienciaAtual)
    : null;
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
        furiaAtiva ? furiaBonusDano : 0,
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
        furiaAtiva ? furiaBonusDano : 0,
      )
    : null;

  // Esmagador/Talhador — só oferece quando o ataque PRINCIPAL causa o
  // tipo de dano certo (Mão Secundária fica de fora, mesmo escopo do
  // Golpe de Escudo), tem o talento, e ainda não usou neste turno.
  const temEsmagador = efeitoMecanicoDoTalento(talentosEfetivos, 'esmagador') !== null;
  const temTalhador = efeitoMecanicoDoTalento(talentosEfetivos, 'talhador') !== null;
  const podeOferecerEsmagador = temEsmagador && !esmagadorUsadoTurno && ataque?.info.danoTipo === 'Contundente';
  const podeOferecerTalhador = temTalhador && !talhadorUsadoTurno && ataque?.info.danoTipo === 'Cortante';

  // Cortar (Mestre em Armas Grandes) — detecta Crítico sozinho no
  // ataque PRINCIPAL: toda rolagem de ataque usa o label "Ataque —
  // ..." (ver `AcaoPanelContent.tsx`/`CombatTab.tsx`), e a do ataque
  // principal sempre inclui o nome da arma equipada — suficiente pra
  // distinguir do ataque da Mão Secundária (arma diferente na imensa
  // maioria dos casos). "Reduzir a 0 PV" não dá pra detectar (o app
  // não sabe o PV do inimigo) — fica pro botão manual em
  // `AcaoPanelContent.tsx` (`confirmarCortarPorReduzirAZero`).
  useEffect(() => {
    if (
      podeOferecerCortar &&
      ataque &&
      rollEmAndamento?.fase === 'concluido' &&
      rollEmAndamento.critico === 'sucesso' &&
      rollEmAndamento.label.startsWith('Ataque —') &&
      rollEmAndamento.label.includes(ataque.nome)
    ) {
      setCortarPronto(true);
    }
  }, [rollEmAndamento]);
  /** Ataque de Cortar em si — MESMA arma do ataque principal (`ataque`,
   * já calculado acima), só liberado quando `cortarPronto`. `null` =
   * some da UI (painel de Ação Bônus simplesmente não mostra). */
  const cortarAtaque = cortarPronto ? ataque : null;
  function confirmarCortarPorReduzirAZero() {
    if (podeOferecerCortar) setCortarPronto(true);
  }
  function usarCortar() {
    setCortarPronto(false);
  }

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
  // Tira `snapshotsNivel` do spread — o snapshot de cada nível nunca
  // pode conter snapshots dentro dele (aninhamento infinito).
  const { snapshotsNivel: _snapshotsNivelIgnorado, ...personagemSalvoBase } = personagemSalvo;
  const estadoAtual: Omit<PersonagemSalvo, 'snapshotsNivel'> = {
    ...personagemSalvoBase,
    selecao,
    nivel: nivelTotalAtual,
    classes: classesAtual,
    classeAtivaAtual: classeAtivaNome,
    periciasMulticlasseAtual: periciasMulticlasseAtuais,
    ferramentasMulticlasseAtual: ferramentasMulticlasseAtuais,
    pvAtual,
    turnStateAtual: turnState,
    surtoUsadoTurnoAtual: surtoUsadoTurno,
    ataqueImprudenteAtivoTurno: ataqueImprudenteAtivo,
    golpeBrutalUsadoTurno,
    cortarProntoTurno: cortarPronto,
    golpeDeEscudoUsadoTurno,
    esmagadorUsadoTurno,
    talhadorUsadoTurno,
    conhecimentoPrimordialPericiaEscolhida,
    pvMax: personagem.pvMax,
    pvTemporarioAtual: pvTemporario,
    subclasseAtual: personagem.subclasse,
    estiloDeLutaAtual: personagem.estiloDeLuta,
    maestriaArmaAtual: maestriaArma,
    folegoGasto,
    vigorImplacavelGasto,
    furiaImplacavelUsosDesdeDescanso: furiaImplacavelUsos,
    dadosDeVidaGastos,
    furiaPersistenteUsada,
    conhecimentoDePedrasGasto,
    picoDeAdrenalinaGasto,
    ataqueDeSoproGasto,
    vooDraconicoGasto,
    ancestralidadeGiganteGasto,
    formaGrandeGasto,
    formaGrandeAtiva,
    furiaGasto,
    furiaAtiva,
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
    maestriaArmaTrocaDisponivel,
    maestriaArmaTalentoTrocaDisponivel,
    lancarNoInfernoGasto,
    surtoGasto,
    espacosGastosPorClasseECirculo,
    inspiracaoGasto,
    truquesAtual: truquesAtuais,
    magiasPreparadasAtual: magiasPreparadasAtuais,
    livroDeMagiasAtual: livroDeMagiasAtuais,
    invocacoesMisticasAtual: invocacoesMisticasAtuais,
    invocacoesTruqueVinculado,
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
    escolhaAtributoTalentoGeral,
    maestriaArmaTalentoGeralAtual: maestriaArmaExtra,
    talentosFavoritosAtual: talentosFavoritos,
    itensMochilaAtual: itensMochila,
    petsAtual: pets,
    levelUpHpModo,
    levelUpHpRolado,
    xp: xpAtual,
  };

  // Snapshot de teste (ver PersonagemSalvo.snapshotsNivel) — captura 1x
  // por nível, na 1ª vez que ele é alcançado (não fica reescrevendo a
  // cada mudancinha). Efeito PRÓPRIO, com deps mínimas (só
  // `nivelTotalAtual`) — separado do autosave abaixo de propósito.
  useEffect(() => {
    setSnapshotsNivel((prev) => (nivelTotalAtual in prev ? prev : { ...prev, [nivelTotalAtual]: estadoAtual }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivelTotalAtual]);

  useAutosavePersonagem(
    { ...estadoAtual, snapshotsNivel },
    [
      personagemSalvo,
      snapshotsNivel,
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
      ataqueImprudenteAtivo,
      golpeBrutalUsadoTurno,
      cortarPronto,
      golpeDeEscudoUsadoTurno,
      esmagadorUsadoTurno,
      talhadorUsadoTurno,
      conhecimentoPrimordialPericiaEscolhida,
      pvTemporario,
      maestriaArma,
      folegoGasto,
      vigorImplacavelGasto,
      furiaImplacavelUsos,
      furiaPersistenteUsada,
      conhecimentoDePedrasGasto,
      picoDeAdrenalinaGasto,
      ataqueDeSoproGasto,
      vooDraconicoGasto,
      ancestralidadeGiganteGasto,
      formaGrandeGasto,
      formaGrandeAtiva,
      furiaGasto,
      furiaAtiva,
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
      maestriaArmaTrocaDisponivel,
      maestriaArmaTalentoTrocaDisponivel,
      lancarNoInfernoGasto,
      surtoGasto,
      espacosGastosPorClasseECirculo,
      inspiracaoGasto,
      truquesAtuais,
      magiasPreparadasAtuais,
      livroDeMagiasAtuais,
      invocacoesMisticasAtuais,
      invocacoesTruqueVinculado,
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
      escolhaAtributoTalentoGeral,
      maestriaArmaExtra,
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
    if (temFuriaImplacavel && deveOferecerFuriaImplacavel(pvAtual, resultado.pvAtual, furiaAtiva)) {
      setFuriaImplacavelPendente(true);
    }
  }

  /** Aplica a cura de uma MAGIA (mecânica `cura`, ver
   * `core/conjurarMagia.ts`) escolhendo "Me curar" no popup de
   * rolagem — além de somar o PV (`alterarPv`), dispara o efeito
   * visual de Cura (pedido do Osmar: "só em magias de cura, tenho
   * outros planos pra vida subindo" — por isso NÃO usa essa função
   * pra Mãos Curativas/Recuperar Fôlego/os botões manuais de PV, que
   * continuam só com `alterarPv` puro). */
  function onCuraDeMagiaAplicada(total: number) {
    alterarPv(total);
    dispararEfeitoCura();
  }

  function dispararEfeitoCura() {
    setCuraEfeitoAtivo(true);
    setTimeout(() => setCuraEfeitoAtivo(false), DURACAO_CURA_MS);
  }

  /** Fúria Implacável (Bárbaro nível 11+) — rola a própria Salvaguarda
   * de Constituição pelo `rolarD20` de sempre (mesmo popup de dado
   * padrão) e decide sozinho se passou, comparando com a CD atual. A
   * CD sobe (+5) a cada TENTATIVA (passe ou falhe — regra real: "a
   * cada vez que usar essa característica após a primeira", usar =
   * tentar, não só ter sucesso), volta a 10 no Descanso Curto/Longo. */
  function rolarFuriaImplacavel() {
    const mod = salvaguardaCon?.mod ?? 0;
    const cdAtual = cdFuriaImplacavel(furiaImplacavelUsos);
    rolarD20({
      label: 'Salvaguarda de Constituição — Fúria Implacável',
      formula: `1d20 ${mod >= 0 ? '+' : '-'} ${Math.abs(mod)}`,
      mod,
      explicacaoMod: salvaguardaCon?.explicacao,
      categoria: 'atributoOuSalvaguarda',
      onResultado: (total) => {
        setFuriaImplacavelUsos((v) => v + 1);
        setFuriaImplacavelResultado(total >= cdAtual);
      },
    });
  }

  /** "Curar" (fase 'resultado', sucesso) — aplica o PV cheio (2× nível
   * NA CLASSE Bárbaro) e fecha o modal. */
  function curarFuriaImplacavel() {
    setPvAtual(pvFuriaImplacavel(personagem.nivel));
    setFuriaImplacavelPendente(false);
    setFuriaImplacavelResultado(null);
  }

  /** Fecha o modal sem curar — tanto "Dispensar" (fase 'oferta', nunca
   * rolou) quanto "Fechar" (fase 'resultado', falhou). PV continua
   * como estava (0). */
  function fecharFuriaImplacavel() {
    setFuriaImplacavelPendente(false);
    setFuriaImplacavelResultado(null);
  }

  // G3.2 (foco de saúde do projeto, ver EmDevB.md): `recursoContado`/
  // `recursoFlagUnica` embrulham o par useState de cada recurso e
  // absorvem o "se não sobrou uso, recusa; senão soma 1" repetido —
  // `useState`, descansoCurto/Longo e o autosave continuam intocados,
  // lendo/zerando os mesmos campos de sempre por nome.
  const conhecimentoDePedras = recursoContado(usosConhecimentoDePedrasMaximo, conhecimentoDePedrasGasto, setConhecimentoDePedrasGasto);
  function usarConhecimentoDePedras(): boolean {
    return conhecimentoDePedras.usar();
  }

  const picoDeAdrenalina = recursoContado(usosPicoDeAdrenalinaMaximo, picoDeAdrenalinaGasto, setPicoDeAdrenalinaGasto);
  function usarPicoDeAdrenalina(): boolean {
    if (!picoDeAdrenalina.usar()) return false;
    setPvTemporario((atual) => ganharPvTemporario(atual, bonusProficienciaAtual));
    return true;
  }

  const ataqueDeSopro = recursoContado(usosAtaqueDeSoproMaximo, ataqueDeSoproGasto, setAtaqueDeSoproGasto);
  function usarAtaqueDeSopro(): boolean {
    return ataqueDeSopro.usar();
  }

  const vooDraconico = recursoFlagUnica(vooDraconicoGasto, setVooDraconicoGasto);
  function usarVooDraconico(): boolean {
    return vooDraconico.usar();
  }

  const ancestralidadeGigante = recursoContado(usosAncestralidadeGiganteMaximo, ancestralidadeGiganteGasto, setAncestralidadeGiganteGasto);
  function usarAncestralidadeGigante(): boolean {
    return ancestralidadeGigante.usar();
  }

  /** Toggle — ligar (1ª vez, gasta o uso) ou desligar (encerrar antes
   * do Descanso Longo, sem devolver o uso) a Forma Grande. Só o
   * Descanso Longo desliga sozinho e devolve o uso (ver
   * `descansoLongo`) — o app não segue tempo real pra saber quando os
   * 10 minutos da transformação acabam. Fica de fora do padrão
   * genérico acima de propósito: 2 booleanos interdependentes
   * (`Gasto`/`Ativa`), não 1 só. */
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

  /** Toggle — ligar (1ª vez, gasta 1 uso do banco) ou desligar (encerrar
   * manualmente) a Fúria (Bárbaro). Ver sdd/sdd-barbaro-furia.md —
   * duração simplificada: não expira sozinha por turno, só ao
   * "Encerrar Fúria" ou ao vestir Armadura Pesada (esse 2º caso é
   * forçado em `equiparItem`, não aqui). Ativar trava com Armadura
   * Pesada já equipada (regra real: não entra em Fúria vestindo
   * Armadura Pesada). */
  function usarFuria(): boolean {
    if (furiaAtiva) {
      setFuriaAtiva(false);
      return true;
    }
    if (furiaRestantes <= 0 || armaduraPesadaEquipada) return false;
    setFuriaGasto((v) => v + 1);
    setFuriaAtiva(true);
    return true;
  }

  /** Fúria Persistente (Bárbaro nível 15+) — zera os usos gastos de
   * Fúria e marca como usada até o próximo Descanso Longo. */
  function recuperarFuriaPersistente() {
    setFuriaGasto(0);
    setFuriaPersistenteUsada(true);
  }

  const maosCurativas = recursoFlagUnica(maosCurativasGasto, setMaosCurativasGasto);
  function usarMaosCurativas(): boolean {
    return maosCurativas.usar();
  }

  const revelacaoCelestial = recursoFlagUnica(revelacaoCelestialGasto, setRevelacaoCelestialGasto);
  function usarRevelacaoCelestial(formaEscolhida: string): boolean {
    if (!revelacaoCelestial.usar()) return false;
    setRevelacaoCelestialFormaAtiva(formaEscolhida);
    return true;
  }

  const falarComAnimaisGnomo = recursoContado(usosFalarComAnimaisGnomoMaximo, falarComAnimaisGnomoGasto, setFalarComAnimaisGnomoGasto);
  function usarFalarComAnimaisGnomo(): boolean {
    return falarComAnimaisGnomo.usar();
  }

  function marcarUsado(categoria: RecursoTurno) {
    setTurnState((prev) => ({ ...prev, [categoria]: 'usada' }));
  }

  function fimDoTurno() {
    setTurnState(turnoInicial);
    setSurtoUsadoTurno(false);
    setAtaqueImprudenteAtivo(false);
    setGolpeBrutalUsadoTurno(false);
    setCortarPronto(false);
    setGolpeDeEscudoUsadoTurno(false);
    setEsmagadorUsadoTurno(false);
    setTalhadorUsadoTurno(false);
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

  const inspiracaoDeBardo = recursoContado(usosInspiracaoMax, inspiracaoGasto, setInspiracaoGasto);
  function usarInspiracao(): boolean {
    return inspiracaoDeBardo.usar();
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
    setDadosDeVidaGastos({});
    // Eficiente (Humano) — "começa cada dia com Inspiração Heroica";
    // como o app não segue tempo real, a aproximação (ver SDD) é
    // conceder de novo a cada Descanso Longo. Nunca desliga sozinho
    // aqui — só o jogador desliga (manual ou usando o reroll).
    if (selecao.especie === 'Humano') setInspiracaoHeroicaAtiva(true);
    setEspacosGastosPorClasseECirculo({});
    setFolegoGasto(0);
    setVigorImplacavelGasto(false);
    setFuriaImplacavelUsos(0);
    setFuriaPersistenteUsada(false);
    setConhecimentoDePedrasGasto(0);
    setPicoDeAdrenalinaGasto(0);
    setAtaqueDeSoproGasto(0);
    setVooDraconicoGasto(false);
    setAncestralidadeGiganteGasto(0);
    setFormaGrandeGasto(false);
    setFormaGrandeAtiva(false);
    setFuriaGasto(0);
    setFuriaAtiva(false);
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
    setMaestriaArmaTrocaDisponivel(true);
    setMaestriaArmaTalentoTrocaDisponivel(true);
    setLancarNoInfernoGasto(false);
    setArcanaMisticaGastos([]);
    setMagiasGratisGastas([]);
    fimDoTurno();
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
    setFuriaGasto((v) => Math.max(0, v - 1));
    setFuriaImplacavelUsos(0);
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
    // Descanso Curto: só abre o passo de Dados de Vida se dá pra usar de
    // verdade (tem dado sobrando, está vivo e com PV faltando) — com PV
    // cheio, pula o passo todo (pedido do Osmar).
    if (
      descansoEmAndamento?.tipo === 'curto' &&
      totalDeDadosRestantes(reservaDadosDeVida) > 0 &&
      pvAtual > 0 &&
      pvAtual < personagem.pvMax
    ) {
      setDadosDeVidaAberto(true);
    }
    setDescansoEmAndamento(null);
  }

  function gastarDadoDeVida(tipo: string, cura: number) {
    setDadosDeVidaGastos((prev) => ({ ...prev, [tipo]: (prev[tipo] ?? 0) + 1 }));
    alterarPv(cura);
  }

  function usarAstuciaMagica() {
    if (astuciaMagicaGasta || !espacoPactoAtual || astuciaMagicaRecupera <= 0) return;
    const circulo = espacoPactoAtual.circulo;
    atualizarEspacosGastos((prev) => ({ ...prev, [circulo]: Math.max(0, (prev[circulo] ?? 0) - astuciaMagicaRecupera) }));
    setAstuciaMagicaGasta(true);
  }

  const contatarPatrono = recursoFlagUnica(contatarPatronoGasto, setContatarPatronoGasto);
  function usarContatarPatrono() {
    contatarPatrono.usar();
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
    setMaestriaArmaTrocaDisponivel(false);
  }

  function trocarMaestriaArmaExtra(armaNova: string) {
    setMaestriaArmaExtra(armaNova);
    setMaestriaArmaTalentoTrocaDisponivel(false);
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
    // Fúria (Bárbaro) encerra sozinha ao vestir Armadura Pesada — regra
    // real, ver sdd/sdd-barbaro-furia.md. Só checa quando o slot é
    // 'armadura' pra não gastar um find() à toa nos outros slots.
    if (slot === 'armadura' && furiaAtiva) {
      const item = itensMochila.find((it) => it.id === id);
      const catalogo = item ? armaduras.find((a) => a.nome === item.nome) : undefined;
      if (catalogo?.categoria.startsWith('Armadura Pesada')) {
        setFuriaAtiva(false);
      }
    }
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

  const usoFolego = recursoContado(usosFolegoMaximo, folegoGasto, setFolegoGasto);
  function usarUsoFolego(): boolean {
    return usoFolego.usar();
  }

  const indomavel = recursoContado(indomavelMaximo, indomavelGasto, setIndomavelGasto);
  function usarIndomavel(): boolean {
    return indomavel.usar();
  }

  const pontoDeSorte = recursoContado(pontosDeSorteMaximo, pontosDeSorteGasto, setPontosDeSorteGasto);
  function usarPontoDeSorte(): boolean {
    return pontoDeSorte.usar();
  }

  const sorteDoTenebroso = recursoContado(sorteDoTenebrosoMaximo, sorteDoTenebrosoGasto, setSorteDoTenebrosoGasto);
  function usarSorteDoTenebroso(): boolean {
    return sorteDoTenebroso.usar();
  }

  const lancarNoInferno = recursoFlagUnica(lancarNoInfernoGasto, setLancarNoInfernoGasto);
  function usarLancarNoInferno(): boolean {
    return lancarNoInferno.usar();
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

  // Registra Força Indomável (Bárbaro nível 18) no modal de rolagem
  // global — aplica sozinho em teste/salvaguarda de Força (sem botão,
  // sem custo, ver `RollContext.tsx`). Some sozinha se a Ficha
  // desmontar ou a classe/nível/valor de Força mudar.
  useEffect(() => {
    registrarForcaIndomavel(temForcaIndomavel ? forValorFinal : null);
    return () => registrarForcaIndomavel(null);
  }, [temForcaIndomavel, forValorFinal, registrarForcaIndomavel]);

  const surto = recursoContado(surtoMaximo, surtoGasto, setSurtoGasto);
  function usarSurto(): boolean {
    if (surtoUsadoTurno) return false;
    if (!surto.usar()) return false;
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
    invocacoesTruqueVinculadoEscolhido: Record<string, string> | null;
    periciasEspecialistaEscolhidas: string[] | null;
    periciasSubclasseBonusEscolhidas: string[] | null;
    magiasDescobertasMagicasEscolhidas: string[] | null;
    atributosAumentados: Atributo[] | null;
    talentoGeralEscolhido: string | null;
    dadivaEpicaEscolhida: string | null;
    arcanaMisticaAlteracoes: Record<number, string> | null;
    magiaIniciadaAlteracoes: { origem: string | null; especie: string | null } | null;
    escolhaMagiaTalentoGeral: Record<string, string[]> | null;
    escolhaAtributoTalentoGeral: Record<string, string> | null;
    maestriaArmaTalentoEscolhida: string | null;
    maestriaArmaEscolhida: string[] | null;
    periciaLivreTalentoEscolhida: string | null;
    periciaRestritaTalentoEscolhida: string | null;
    conhecimentoPrimordialPericiaEscolhida: string | null;
  }) {
    // Constituição ANTES de qualquer mudança deste Level Up — precisa
    // vir antes do `aumentarAtributos`/`setSelecao` abaixo, senão perde
    // o valor de referência pro ajuste retroativo de PV logo adiante.
    const conAntes = valorFinalAtributo(selecao, 'CON') ?? 10;
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
    // Constituição DEPOIS deste Level Up — soma o Aumento no Valor de
    // Atributo (se escolhido) E o Campeão Primitivo (Bárbaro, ao
    // chegar no nível 20 NESTA classe — automático, sem escolha). Se
    // o mod. de Constituição mudou, o PV Máximo precisa do ajuste
    // retroativo (regra real: PV Máximo recalcula como se o mod. novo
    // já valesse desde sempre) — `resultado.pvGanho` já foi calculado
    // com o mod. ANTIGO (`LevelUpShell`/`geradorPersonagemTeste` sempre
    // resolvem o ganho de PV do nível antes de aplicar qualquer ASI
    // desse mesmo nível), então até o ganho DESTE nível entra no
    // ajuste — por isso o multiplicador é `nivelTotalAtual + 1` (nível
    // total incluindo o que acabou de ser ganho), não `nivelTotalAtual`.
    const chegouAoCampeaoPrimitivo = classeAtivaNome === 'Bárbaro' && resultado.novoNivel === 20;
    const conDepoisAsi = novosAtributos ? (valorFinalAtributo({ ...selecao, atributos: novosAtributos }, 'CON') ?? conAntes) : conAntes;
    const conDepois = aplicarCampeaoPrimitivo(conDepoisAsi, 'CON', chegouAoCampeaoPrimitivo);
    const aplicarAjustePv = (v: number) =>
      conDepois === conAntes
        ? v
        : ajustarPvMaximoPorMudancaDeCon(v, modificador(conAntes), modificador(conDepois), nivelTotalAtual + 1);
    setPvMax((v) => aplicarAjustePv(v + resultado.pvGanho));
    if (resultado.estiloDeLutaEscolhido) setEstiloDeLutaAtivo(resultado.estiloDeLutaEscolhido);
    setPvAtual((v) => aplicarAjustePv(v + resultado.pvGanho));
    if (resultado.truquesEscolhidos) setTruquesAtuais(resultado.truquesEscolhidos);
    if (resultado.livroDeMagiasEscolhidas) setLivroDeMagiasAtuais(resultado.livroDeMagiasEscolhidas);
    if (resultado.magiasPreparadasEscolhidas) setMagiasPreparadasAtuais(resultado.magiasPreparadasEscolhidas);
    if (resultado.invocacoesMisticasEscolhidas) setInvocacoesMisticasAtuais(resultado.invocacoesMisticasEscolhidas);
    if (resultado.invocacoesTruqueVinculadoEscolhido) setInvocacoesTruqueVinculado(resultado.invocacoesTruqueVinculadoEscolhido);
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
    if (resultado.escolhaAtributoTalentoGeral) {
      setEscolhaAtributoTalentoGeral((prev) => ({ ...prev, ...resultado.escolhaAtributoTalentoGeral }));
    }
    if (resultado.maestriaArmaTalentoEscolhida) {
      setMaestriaArmaExtra(resultado.maestriaArmaTalentoEscolhida);
    }
    if (resultado.maestriaArmaEscolhida) {
      setMaestriaArma(resultado.maestriaArmaEscolhida);
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
    if (resultado.conhecimentoPrimordialPericiaEscolhida) {
      setConhecimentoPrimordialPericiaEscolhida(resultado.conhecimentoPrimordialPericiaEscolhida);
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
      invocacoesTruqueVinculadoAtuais: invocacoesTruqueVinculado,
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
      conhecimentoPrimordialPericiaAtual: conhecimentoPrimordialPericiaEscolhida,
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

  // [Ferramenta de teste] Pula pra qualquer nível já visitado (ver
  // PersonagemSalvo.snapshotsNivel) — pedido do Osmar (2026-09): "ir
  // até o nível 20 pra testar, voltar e arrumar". Recarrega a página
  // de propósito (em vez de tentar resetar cada `useState` na mão) —
  // o mount inicial já sabe ler cada campo persistido corretamente, é
  // mais simples e confiável reaproveitar isso do que duplicar a
  // lógica de inicialização. Voltar pra um nível anterior APAGA os
  // snapshots dos níveis ACIMA dele (pedido do Osmar) — ex: foi até o
  // 15, voltou pro 12, os snapshots de 13/14/15 somem (a próxima subida
  // a partir do 12 vai gerar snapshots novos pra esses níveis).
  function restaurarSnapshotNivel(nivel: number) {
    const snapshot = snapshotsNivel[nivel];
    if (!snapshot) return;
    const snapshotsSemFuturo = Object.fromEntries(
      Object.entries(snapshotsNivel).filter(([n]) => Number(n) <= nivel),
    );
    armazenamentoPersonagens.salvar({ ...snapshot, snapshotsNivel: snapshotsSemFuturo });
    window.location.reload();
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
        maestriaArmaAtual={maestriaArma}
        truquesDaClasse={magiasDaClasse(classe.nome, 0)}
        magiasPreparadasAtuais={magiasPreparadasAtuais}
        livroDeMagiasAtuais={livroDeMagiasAtuais}
        magiasDaClasseDisponiveis={magiasDisponiveisParaPreparar(classe, personagem.nivel + 1)}
        invocacoesMisticasAtuais={invocacoesMisticasAtuais}
        invocacoesTruqueVinculadoAtuais={invocacoesTruqueVinculado}
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
        conhecimentoPrimordialPericiaAtual={conhecimentoPrimordialPericiaEscolhida}
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
      {curaEfeitoAtivo && (
        <div
          className={styles.curaVinheta}
          aria-hidden="true"
          style={{ ['--duracao-cura' as string]: `${DURACAO_CURA_MS}ms` }}
        >
          {PARTICULAS_CURA.map((p, i) => (
            <span
              key={i}
              className={styles.curaParticula}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                ['--cp-dy' as string]: p.dy,
              }}
            >
              +
            </span>
          ))}
        </div>
      )}
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
      {/* Mesmo motivo do Colheita Macabra acima (não "espiar" atrás do
          RollOverlay da própria rolagem de dano que zerou o PV, NEM da
          própria rolagem da Salvaguarda de Constituição que este modal
          dispara — ver `rolarFuriaImplacavel`). */}
      {furiaImplacavelPendente && rollEmAndamento === null && (
        <FuriaImplacavelModal
          fase={furiaImplacavelResultado === null ? 'oferta' : 'resultado'}
          cd={cdFuriaImplacavel(furiaImplacavelUsos)}
          mod={salvaguardaCon?.mod ?? 0}
          explicacaoMod={salvaguardaCon?.explicacao ?? { linhas: [], total: { label: '', valor: '' } }}
          passou={furiaImplacavelResultado ?? false}
          pvCura={pvFuriaImplacavel(personagem.nivel)}
          onRolar={rolarFuriaImplacavel}
          onDispensar={fecharFuriaImplacavel}
          onCurar={curarFuriaImplacavel}
          onFechar={fecharFuriaImplacavel}
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
          houseRules={houseRules}
          onAlternarHouseRule={alternarHouseRule}
          onLevelUpRapido={classe ? levelUpRapido : undefined}
          niveisComSnapshot={Object.keys(snapshotsNivel)
            .map(Number)
            .sort((a, b) => a - b)}
          nivelAtualSnapshot={nivelTotalAtual}
          onRestaurarNivel={restaurarSnapshotNivel}
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
            salvaguardas={salvaguardas}
            temSentidoDePerigo={temSentidoDePerigo}
            desvantagemForcaDestreza={desvantagemForcaDestreza}
            proficienciasFerramenta={proficienciasFerramenta}
            reservaDadosDeVida={reservaDadosDeVida}
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
            maestriaArmaTrocaDisponivel={maestriaArmaTrocaDisponivel}
            maestriaArmaExtra={maestriaArmaExtra}
            armasElegiveisMaestriaExtra={classe ? armasElegiveisParaMaestriaExtra(classe, talentosEfetivos) : []}
            onTrocarMaestriaArmaExtra={trocarMaestriaArmaExtra}
            maestriaArmaTalentoTrocaDisponivel={maestriaArmaTalentoTrocaDisponivel}
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
            invocacoesTruqueVinculado={invocacoesTruqueVinculado}
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
            onCuraDeMagiaAplicada={onCuraDeMagiaAplicada}
            espacosParaConjurar={espacosParaConjurar}
            onGastarSlotCirculo={gastarSlotCirculo}
            modAcertoConjuracao={modAcertoConjuracao}
            explicacaoAcertoConjuracao={explicacaoAcertoConjuracao}
            explicacaoCdConjuracao={explicacaoCdConjuracao}
            truqueVinculadoAgonizante={invocacoesTruqueVinculado['explosao-agonizante']}
            modCarisma={carMod}
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
            temInstintosPrimitivos={temInstintosPrimitivos}
            acoesGenericasBonus={acoesGenericasBonus}
            pvAtual={pvAtual}
            pvMax={personagem.pvMax}
            pvTemporario={pvTemporario}
            bencaoDoTenebroso={{ disponivel: bencaoDoTenebrosoDisponivel, onAplicar: aplicarBencaoDoTenebroso }}
            lancarNoInferno={{
              disponivel: lancarNoInfernoDisponivel,
              gasto: lancarNoInfernoGasto,
              onUsar: usarLancarNoInferno,
              onRecuperarComEspacoDePacto: recuperarLancarNoInfernoComEspacoDePacto,
            }}
            onAlterarPv={alterarPv}
            onCuraDeMagiaAplicada={onCuraDeMagiaAplicada}
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
            folego={{ maximo: usosFolegoMaximo, restantes: usosFolegoRestantes, onUsar: usarUsoFolego }}
            conhecimentoDePedras={{
              maximo: usosConhecimentoDePedrasMaximo,
              restantes: usosConhecimentoDePedrasRestantes,
              onUsar: usarConhecimentoDePedras,
            }}
            picoDeAdrenalina={{
              maximo: usosPicoDeAdrenalinaMaximo,
              restantes: usosPicoDeAdrenalinaRestantes,
              onUsar: usarPicoDeAdrenalina,
            }}
            ataqueDeSopro={{
              disponivel: ataqueDeSoproDisponivel,
              maximo: usosAtaqueDeSoproMaximo,
              restantes: usosAtaqueDeSoproRestantes,
              cd: cdAtaqueDeSopro,
              explicacaoCd: explicacaoCdAtaqueDeSopro,
              numDados: numDadosAtaqueDeSopro,
              tipoDano: tipoDanoAtaqueDeSopro,
              onUsar: usarAtaqueDeSopro,
            }}
            vooDraconico={{ disponivel: vooDraconicoDisponivel, gasto: vooDraconicoGasto, onUsar: usarVooDraconico }}
            ancestralidadeGigante={{
              escolhida: ancestralidadeGiganteEscolhida,
              maximo: usosAncestralidadeGiganteMaximo,
              restantes: usosAncestralidadeGiganteRestantes,
              onUsar: usarAncestralidadeGigante,
            }}
            modConstituicaoAtual={modConstituicaoAtual}
            formaGrande={{
              disponivel: formaGrandeDisponivel,
              gasto: formaGrandeGasto,
              ativa: formaGrandeAtiva,
              onUsar: usarFormaGrande,
            }}
            furia={{
              disponivel: furiaDisponivel,
              maximo: furiaMaximo,
              restantes: furiaRestantes,
              ativa: furiaAtiva,
              bonusDano: furiaBonusDano,
              onUsar: usarFuria,
              persistenteDisponivel: furiaPersistenteDisponivel,
              onRecuperarPersistente: recuperarFuriaPersistente,
            }}
            ataqueImprudente={{
              disponivel: temAtaqueImprudente,
              ativo: ataqueImprudenteAtivo,
              onAtivar: () => setAtaqueImprudenteAtivo(true),
            }}
            golpeBrutal={{
              disponivel: temGolpeBrutal,
              dados: golpeBrutalDados,
              efeitosNivel13: golpeBrutalEfeitosNivel13,
              escolhas: golpeBrutalEscolhas,
              usadoTurno: golpeBrutalUsadoTurno,
              onUsar: () => setGolpeBrutalUsadoTurno(true),
            }}
            cortar={{
              disponivel: podeOferecerCortar,
              ataque: cortarAtaque,
              onConfirmarReduziuAZero: confirmarCortarPorReduzirAZero,
              onUsar: usarCortar,
            }}
            golpeDeEscudo={{
              disponivel: podeOferecerGolpeDeEscudo,
              cd: explicacaoCdGolpeDeEscudo ? Number(explicacaoCdGolpeDeEscudo.total.valor) : null,
              explicacaoCd: explicacaoCdGolpeDeEscudo,
              usadoTurno: golpeDeEscudoUsadoTurno,
              onUsar: () => setGolpeDeEscudoUsadoTurno(true),
            }}
            golpeCondicional={{
              esmagadorDisponivel: podeOferecerEsmagador,
              talhadorDisponivel: podeOferecerTalhador,
              onAtivarEsmagador: () => setEsmagadorUsadoTurno(true),
              onAtivarTalhador: () => setTalhadorUsadoTurno(true),
            }}
            maosCurativas={{
              disponivel: maosCurativasDisponivel,
              gasto: maosCurativasGasto,
              dados: dadosMaosCurativas,
              onUsar: usarMaosCurativas,
            }}
            revelacaoCelestial={{
              disponivel: revelacaoCelestialDisponivel,
              gasto: revelacaoCelestialGasto,
              formaAtiva: revelacaoCelestialFormaAtiva,
              opcoes: opcoesRevelacaoCelestial,
              danoBonus: danoBonusRevelacaoCelestial,
              cdManto: cdMantoNecrotico,
              onUsar: usarRevelacaoCelestial,
            }}
            falarComAnimaisGnomo={{
              disponivel: falarComAnimaisGnomoDisponivel,
              maximo: usosFalarComAnimaisGnomoMaximo,
              restantes: usosFalarComAnimaisGnomoRestantes,
              onUsar: usarFalarComAnimaisGnomo,
            }}
            conjura={conjura}
            truquesAcao={truquesAcao}
            truquesBonus={truquesBonus}
            magiasPreparadasAcao={magiasPreparadasAcao}
            magiasPreparadasBonus={magiasPreparadasBonus}
            magiasPreparadasReacao={magiasPreparadasReacao}
            modAcertoConjuracao={modAcertoConjuracao}
            explicacaoAcertoConjuracao={explicacaoAcertoConjuracao}
            explicacaoCdConjuracao={explicacaoCdConjuracao}
            truqueVinculadoAgonizante={invocacoesTruqueVinculado['explosao-agonizante']}
            modCarisma={carMod}
            numAtaques={numAtaques}
            indomavel={{ maximo: indomavelMaximo, restantes: indomavelRestantes, onUsar: usarIndomavel }}
            pontosDeSorte={{ maximo: pontosDeSorteMaximo, restantes: pontosDeSorteRestantes, onUsar: usarPontoDeSorte }}
            danoDesarmadoRerollDisponivel={danoDesarmadoRerollDisponivel}
            perfuradorDisponivel={perfuradorDisponivel}
            surto={{ maximo: surtoMaximo, restantes: surtoRestantes, usadoTurno: surtoUsadoTurno, onUsar: usarSurto }}
            mestreTatico={mestreTatico}
            ataquesEstudados={ataquesEstudados}
            ajusteTatico={ajusteTatico}
            ataqueAtual={ataque}
            ataqueBonus={ataqueBonus}
            inspiracao={{
              maximo: usosInspiracaoMax,
              restantes: usosInspiracaoRestantes,
              tamanhoDado: tamanhoDadoInspiracao,
              fonteDeInspiracao,
              onUsar: usarInspiracao,
              onRecuperarComEspaco: recuperarInspiracaoComEspaco,
              onDevolverUso: devolverUsoInspiracao,
            }}
            contraEncantamentoDisponivel={contraEncantamentoDisponivel}
            palavrasDeInterrupcaoDisponivel={palavrasDeInterrupcaoDisponivel}
            periciaInigualavelDisponivel={periciaInigualavelDisponivel}
            iniciativaMod={iniciativa}
            explicacaoIniciativa={explicacaoIniciativa}
            onRolarIniciativa={aoRolarIniciativa}
            colheitaMacabra={{
              disponivel: colheitaMacabraDisponivel,
              onDisponivel: (cura) => setColheitaMacabraPendente({ cura }),
            }}
            colheitaDosMortos={{
              disponivel: colheitaDosMortosDisponivel,
              personagemEnsanguentado: personagemEstaEnsanguentado,
              opcoes: opcoesColheitaDosMortosAtuais,
              onEscolher: usarColheitaDosMortos,
            }}
            mestreDaMorte={{
              disponivel: mestreDaMorteDisponivel,
              pets: petsMortoVivoAtuais,
              pvTemp: pvTempMestreDaMorteAtual,
              onUsar: usarMestreDaMorte,
              explosaoLiberada: mestreDaMorteExplosaoLiberadaAtual,
            }}
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

      {dadosDeVidaAberto && (
        <DadosDeVidaModal
          reserva={reservaDadosDeVida}
          pvAtual={pvAtual}
          pvMax={personagem.pvMax}
          pvTemporario={pvTemporario}
          modConstituicao={modConstituicaoAtual}
          onGastar={gastarDadoDeVida}
          onTerminar={() => setDadosDeVidaAberto(false)}
        />
      )}
      <DescansoFab onDescansoCurto={() => iniciarDescanso('curto')} onDescansoLongo={() => iniciarDescanso('longo')} />
      <Dice3dFab />
      {restStatus && (
        <div className={styles.avisoDescanso} onClick={() => setRestStatus(null)}>
          {restStatus}
        </div>
      )}
    </div>
  );
}
