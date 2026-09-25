import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import type { Origem } from '../../../data/rulesets/dnd2024/origens';
import type { WizardSelection } from '../../../core/personagem';
import type { PersonagemClasse } from '../../../core/multiclasse';
import type { PersonagemNivel } from '../levelup/LevelUpShell';
import type { Pet } from '../../../core/pets';
import type { AtributoFinal } from '../../../core/calculoPersonagem';
import { classes as catalogoClasses } from '../../../data/rulesets/dnd2024/classes';
import {
  temPonteDeMagiaDePacto,
  temConjuracaoMulticlasse,
  contaNaConjuracaoMulticlasse,
  nivelEquivalenteConjuracaoMulticlasse,
  espacosMagiaParaNivelCombinado,
} from '../../../core/multiclasse';
import { personagemConjura } from '../../../core/conjuracao';
import { caracteristicaDesbloqueada } from '../../../core/levelUp';
import { ID_CARACTERISTICA_CLASSE } from '../../../data/rulesets/dnd2024/idsCaracteristicasClasse';
import { magiasRituaisElegiveis } from '../../../core/adeptoDeRitual';
import { magiasGratisDasInvocacoes } from '../../../core/invocacoesMagiaGratis';
import { formasFamiliarDasInvocacoes } from '../../../core/invocacoesFamiliar';
import {
  formasFamiliarMortoVivoElegiveis as formasFamiliarMortoVivoElegiveisNecro,
  petsMortoVivo,
  personagemEnsanguentado,
  opcoesColheitaDosMortos,
  bonusPvTempMestreDaMorte,
  algumMortoVivoEm0PV,
} from '../../../core/necromante';
import { magias, type Magia } from '../../../data/rulesets/dnd2024/magias';
import { espacosARecuperar } from '../../../core/astuciaMagica';
import { calcularSentidos } from '../../../core/sentidos';
import { magiasPactoDoInfero } from '../../../core/magiasPactoDoInfero';
import { truquesEspecie, magiasEspecie as magiasEspecieDoPersonagem } from '../../../core/magiasEspecie';
import { truquesMagiaIniciada, magiasMagiaIniciada } from '../../../core/magiaTalentoOrigem';
import {
  truquesTalentoGeral,
  magiasSempreTalentoGeral,
  magiasGratisDosTalentosGerais,
  temRitualRapido,
  CHAVE_RITUAL_RAPIDO,
} from '../../../core/magiaTalentoGeral';
import { acoesConvertidasEmBonus } from '../../../core/periciaTalentoGeral';
import { acoesBase } from '../../../data/exampleCombat';
import {
  espacosDeMagiaAtivos,
  ehMagiaDeReacao,
  ehMagiaDeAcaoBonus,
  magiasPreparadasDoPersonagem,
  magiasConhecidasComClasse,
  nomesDeMagiasConhecidas,
  deficitTruques,
  deficitMagiasPreparadas,
  usaRedefinicaoPorDescanso,
  espacosCombinadosComoAtivos,
  type PoolDePonte,
  type MagiaConhecida,
  type MagiaComClasseOpcional,
} from '../../../core/magiasPersonagem';

/** Nome do "Falar com Animais" concedido pelo Gnomo do Bosque — ver
 * comentário em `magias.ts` (id "falarcomanimais-gnomo") sobre por que
 * é uma entrada separada da magia normal. Movido de `FichaShell.tsx`
 * junto com o bloco que o usa (G3.3). */
const NOME_FALAR_COM_ANIMAIS_GNOMO = 'Falar com Animais - Traço de Gnomo';

/** Todo o bloco de derivação de magia/conjuração/pool combinado do
 * `FichaShell.tsx` (G3.3 do foco de saúde do projeto, ver `EmDevB.md`)
 * — cópia literal do que já existia lá, só movida pra fora do
 * componente. Puramente derivado (nenhum `useState`/efeito aqui
 * dentro), por isso não precisa seguir as Regras de Hooks apesar do
 * nome `use*` (mantido por consistência com os outros arquivos desta
 * pasta). Também inclui as poucas derivações de Pets que dependiam de
 * características de subclasse já resolvidas antes (`mestreDaMorteDisponivel`,
 * calculado por `caracteristicasSubclasseAtivas`, G3.4). */
export function useMagiasEConjuracao(input: {
  classe: Classe | null;
  personagem: PersonagemNivel;
  selecao: WizardSelection;
  classesAtual: PersonagemClasse[];
  classeAtivaNome: string;
  classeAtivaEntry: PersonagemClasse | undefined;
  espacosGastosPorClasseECirculo: Record<string, Record<number, number>>;
  espacosGastosPorCirculo: Record<number, number>;
  talentosEfetivos: string[];
  /** Marcados com a classe que concedeu (multiclasse) — ver
   * `sdd/sdd-multiclasse-truques-magias.md`. */
  truquesAtuais: MagiaConhecida[];
  magiasPreparadasAtuais: MagiaConhecida[];
  magiasDescobertasMagicasAtuais: string[];
  livroDasSombrasAtuais: string[];
  livroDeMagiasAtuais: string[];
  invocacoesMisticasAtuais: string[];
  pets: Pet[];
  atributos: AtributoFinal[];
  arcanaMisticaAtuais: Record<number, string>;
  /** Maestria de Magias (Mago, nível 18) — `{1: nomeMagia, 2: nomeMagia}`. */
  maestriaDeMagiasAtuais: Record<number, string>;
  escolhaMagiaTalentoGeral: Record<string, string[]>;
  magiasGratisGastas: string[];
  nivelTotalAtual: number;
  origemPersonagem: Origem | null;
  pvAtual: number;
  mestreDaMorteDisponivel: boolean;
  magiasPactoDoInferoDisponivel: boolean;
}) {
  const {
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
    maestriaDeMagiasAtuais,
    escolhaMagiaTalentoGeral,
    magiasGratisGastas,
    nivelTotalAtual,
    origemPersonagem,
    pvAtual,
    mestreDaMorteDisponivel,
    magiasPactoDoInferoDisponivel,
  } = input;

  // Bug real corrigido (Entrega 5f, achado testando o Char Multiclasse
  // — Bárbaro/Bardo/Bruxo): `classe` aqui é só a classe ÂNCORA (1ª do
  // personagem, ver FichaShell.tsx), que pode muito bem não conjurar
  // (ex.: Bárbaro) mesmo com OUTRA classe do personagem conjurando —
  // antes disso escondia a aba Magias inteira. Checa TODAS as classes.
  const conjura = classesAtual.some((c) => personagemConjura(catalogoClasses.find((cc) => cc.nome === c.classe) ?? null, selecao, talentosEfetivos));
  const espacos = espacosDeMagiaAtivos(classe, personagem.nivel);
  // Ponte de Magia de Pacto (SDD Multiclasse seção 8.5) — só quando o
  // personagem tem Bruxo E outra classe conjuradora ao mesmo tempo.
  // Bug corrigido (Entrega 5b, achado testando o Char Multiclasse —
  // Bárbaro/Bardo/Bruxo): `outraClasseEntry` pegava a 1ª classe
  // diferente da ativa, sem checar se ela CONJURA — com 3+ classes
  // (Bárbaro no meio, que não conjura), a ponte apontava pra ele e
  // sumia (0 espaços). Agora busca especificamente a classe certa:
  // Bruxo quando a ativa é outra conjuradora, ou a OUTRA conjuradora
  // quando a ativa é Bruxo.
  const outraClasseEntry =
    classeAtivaNome === 'Bruxo'
      ? classesAtual.find((c) => c.classe !== 'Bruxo' && contaNaConjuracaoMulticlasse(c))
      : classesAtual.find((c) => c.classe === 'Bruxo');
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
    ? espacosCombinadosComoAtivos(
        // A tabela Conjurador Multiclasse só vai até 20 — trava aí pra nunca voltar vazio.
        espacosMagiaParaNivelCombinado(Math.min(20, nivelEquivalenteConjuracaoMulticlasse(classesAtual))) ?? [],
      )
    : espacos;
  const espacosGastosParaConjurar = emConjuracaoCombinada ? (espacosGastosPorClasseECirculo['combinado'] ?? {}) : espacosGastosPorCirculo;
  // Pareado com a classe (multiclasse) — o seletor de magia em
  // Combate mostra o selo (`PillClasse`) nesses 2, ver
  // `sdd/sdd-multiclasse-truques-magias.md`. As listas fixas abaixo
  // (Descobertas Mágicas etc.) são sempre de 1 classe só — entram
  // como `classe: null` (sem pill) quando forem juntadas a estas.
  const truquesComClasse = magiasConhecidasComClasse(truquesAtuais);
  const preparadasComClasse = magiasConhecidasComClasse(magiasPreparadasAtuais);
  const truques = truquesComClasse.map((t) => t.magia);
  const magiasPreparadas = preparadasComClasse.map((t) => t.magia);
  const magiasDescobertasMagicas = magiasPreparadasDoPersonagem(magiasDescobertasMagicasAtuais);
  const livroDasSombras = magiasPreparadasDoPersonagem(livroDasSombrasAtuais);
  // Entrega 5d (Multiclasse, ver EmDev.md) — características
  // específicas do Mago/Bruxo (Memorizar Magia, Adepto de Ritual,
  // Astúcia Mágica, Contatar Patrono, Maestria de Magias, Mestre
  // Místico) checam se o personagem TEM aquela classe em
  // `classesAtual` (com o NÍVEL dessa entrada), não mais "a classe
  // ativa é X" — do contrário, sumiam da tela sempre que o pill não
  // estivesse na classe certa.
  const magoEntry = classesAtual.find((c) => c.classe === 'Mago');
  const magoObj = magoEntry ? catalogoClasses.find((cc) => cc.nome === 'Mago') ?? null : null;
  const bruxoEntry = classesAtual.find((c) => c.classe === 'Bruxo');
  const bruxoObj = bruxoEntry ? catalogoClasses.find((cc) => cc.nome === 'Bruxo') ?? null : null;
  const memorizarMagiaDisponivel =
    magoObj && magoEntry ? caracteristicaDesbloqueada(magoObj, 'Memorizar Magia', magoEntry.nivel) !== null : false;
  const livroDeMagias = magiasPreparadasDoPersonagem(livroDeMagiasAtuais);
  const adeptoDeRitualDisponivel =
    magoObj && magoEntry ? caracteristicaDesbloqueada(magoObj, 'Adepto de Ritual', magoEntry.nivel) !== null : false;
  const magiasRituaisDoLivro = adeptoDeRitualDisponivel
    ? magiasRituaisElegiveis(livroDeMagias, nomesDeMagiasConhecidas(magiasPreparadasAtuais))
    : [];
  const usaRedefPorDescanso = usaRedefinicaoPorDescanso(magoObj);
  const magiasGratisConcedidas = magiasGratisDasInvocacoes(invocacoesMisticasAtuais);
  const formasFamiliarElegiveis = formasFamiliarDasInvocacoes(invocacoesMisticasAtuais);
  const formasFamiliarMortoVivoElegiveis = formasFamiliarMortoVivoElegiveisNecro(personagem.subclasse, personagem.nivel);
  const modIntAtual = atributos.find((a) => a.atributo === 'INT')?.mod ?? 0;
  const personagemEstaEnsanguentado = personagemEnsanguentado(pvAtual, personagem.pvMax);
  const opcoesColheitaDosMortosAtuais = opcoesColheitaDosMortos(pets, personagem.nivel);
  const pvTempMestreDaMorteAtual = mestreDaMorteDisponivel ? bonusPvTempMestreDaMorte(personagem.nivel) : 0;
  const petsMortoVivoAtuais = petsMortoVivo(pets);
  const mestreDaMorteExplosaoLiberadaAtual = algumMortoVivoEm0PV(pets);
  const astuciaMagicaDisponivel =
    bruxoObj && bruxoEntry ? caracteristicaDesbloqueada(bruxoObj, 'Astúcia Mágica', bruxoEntry.nivel) !== null : false;
  const contatarPatronoDisponivel =
    bruxoObj && bruxoEntry ? caracteristicaDesbloqueada(bruxoObj, 'Contatar Patrono', bruxoEntry.nivel) !== null : false;
  const contatoExtraplanar = magias.find((m) => m.nome === 'Contato Extraplanar') ?? null;
  const arcanaMisticaEscolhidas = Object.entries(arcanaMisticaAtuais)
    .map(([circulo, nomeMagia]) => ({ circulo: Number(circulo), magia: magias.find((m) => m.nome === nomeMagia) ?? null }))
    .filter((item): item is { circulo: number; magia: Magia } => item.magia !== null)
    .sort((a, b) => a.circulo - b.circulo);
  const maestriaDeMagiasDisponivel =
    magoObj && magoEntry
      ? caracteristicaDesbloqueada(magoObj, ID_CARACTERISTICA_CLASSE.maestriaDeMagias, magoEntry.nivel) !== null
      : false;
  const magiasMaestriaDoLivro = Object.values(maestriaDeMagiasAtuais)
    .map((nomeMagia) => magias.find((m) => m.nome === nomeMagia))
    .filter((m): m is Magia => m !== undefined);
  const mestreMisticoDisponivel =
    bruxoObj && bruxoEntry ? caracteristicaDesbloqueada(bruxoObj, 'Mestre Místico', bruxoEntry.nivel) !== null : false;
  // Achado corrigido de passagem (Entrega 5d): Astúcia Mágica recupera
  // espaço de PACTO especificamente — antes usava sempre o `espacos`
  // (pool da classe ATIVA no pill), errado quando o pill não estava
  // no Bruxo. Agora usa o pool certo de qualquer forma: o próprio
  // `espacos` quando a ativa É o Bruxo, ou o da ponte quando não é
  // (a ponte, quando existe, é sempre o Bruxo nesse caso — ver
  // `outraClasseEntry` acima).
  const espacoPactoAtual = classeAtivaNome === 'Bruxo' ? espacos[0] ?? null : ponte?.classeNome === 'Bruxo' ? ponte.espacos[0] ?? null : null;
  const espacosGastosPactoPool = classeAtivaNome === 'Bruxo' ? espacosGastosPorCirculo : ponte?.espacosGastosPorCirculo ?? {};
  const espacosGastosPacto = espacoPactoAtual ? (espacosGastosPactoPool[espacoPactoAtual.circulo] ?? 0) : 0;
  const astuciaMagicaRecupera = espacoPactoAtual
    ? espacosARecuperar(espacoPactoAtual.maximo, espacosGastosPacto, mestreMisticoDisponivel)
    : 0;
  const sentidos = calcularSentidos(selecao.especie, invocacoesMisticasAtuais, selecao.subescolhaEspecieEscolhida);
  // Compara a cota da classe ATIVA contra só os itens marcados com
  // ela (Entrega 4 — corrigido, ver core/magiasPersonagem.ts).
  const faltamTruques = deficitTruques(classe, personagem.nivel, truquesAtuais);
  const faltamMagiasPreparadas = deficitMagiasPreparadas(classe, personagem.nivel, magiasPreparadasAtuais);
  // Descobertas Mágicas/Livro das Sombras contam como magia sempre
  // preparada (fora do limite normal) — entram no que dá pra conjurar
  // em combate, mas são arrays PRÓPRIOS separados, só unidos aqui pra
  // montar a lista de "o que aparece nos painéis de Ação/Reação".
  // `magiasPactoDoInferoDisponivel` vem de fora (G3.4,
  // `caracteristicasSubclasseAtivas`) — recebido como parâmetro em vez
  // de recalculado aqui, pra não duplicar a mesma checagem de
  // característica de subclasse em 2 lugares.
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
  // Proficiência, grátis, ver `usarFalarComAnimaisGnomo` no
  // `FichaShell`), mas continua aparecendo em "Magias da Espécie" na
  // aba Magias (`magiasEspecieAtuais`, sem filtro) só como referência.
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
  // `null` = lista fixa de 1 classe só (sem ambiguidade de
  // multiclasse pra marcar) — ver `MagiaComClasseOpcional`.
  const semClasse = (m: Magia): MagiaComClasseOpcional => ({ magia: m, classe: null });
  const magiasConjuraveis: MagiaComClasseOpcional[] = [
    ...preparadasComClasse,
    ...magiasDescobertasMagicas.map(semClasse),
    ...livroDasSombras.map(semClasse),
    ...magiasPactoDoInferoPreparadas.map(semClasse),
    ...magiasEspeciePreparadasConjuraveis.map(semClasse),
    ...magiasTalentoOrigemPreparadas.map(semClasse),
    ...magiasTalentoGeralPreparadas.map(semClasse),
  ];
  // Roteia cada magia conjurável pro painel certo do Combate (Ação/
  // Ação Bônus/Reação), pelo próprio Tempo de Conjuração da magia —
  // Reação sempre checada primeiro (nenhuma magia é as 2 coisas ao
  // mesmo tempo). Truques passam pelo mesmo roteamento (poucos, mas
  // existem truques de Ação Bônus — ex.: Bordão Místico/Criar Chamas).
  const magiasPreparadasReacao = magiasConjuraveis.filter((i) => ehMagiaDeReacao(i.magia));
  const magiasPreparadasBonus = magiasConjuraveis.filter((i) => !ehMagiaDeReacao(i.magia) && ehMagiaDeAcaoBonus(i.magia));
  const magiasPreparadasAcao = magiasConjuraveis.filter((i) => !ehMagiaDeReacao(i.magia) && !ehMagiaDeAcaoBonus(i.magia));
  const truquesBonus = truquesComClasse.filter((i) => ehMagiaDeAcaoBonus(i.magia));
  const truquesAcao = truquesComClasse.filter((i) => !ehMagiaDeAcaoBonus(i.magia));

  return {
    conjura,
    espacos,
    outraClasseEntry,
    ponte,
    emConjuracaoCombinada,
    chaveDoPoolDeMagia,
    espacosParaConjurar,
    espacosGastosParaConjurar,
    truques,
    magiasPreparadas,
    magiasDescobertasMagicas,
    livroDasSombras,
    memorizarMagiaDisponivel,
    livroDeMagias,
    adeptoDeRitualDisponivel,
    magiasRituaisDoLivro,
    maestriaDeMagiasDisponivel,
    magiasMaestriaDoLivro,
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
    mestreMisticoDisponivel,
    espacoPactoAtual,
    espacosGastosPacto,
    astuciaMagicaRecupera,
    sentidos,
    faltamTruques,
    faltamMagiasPreparadas,
    magiasPactoDoInferoAtuais,
    magiasPactoDoInferoPreparadas,
    magiasEspecieAtuais,
    magiasEspeciePreparadas,
    magiasEspeciePreparadasConjuraveis,
    magiasTalentoOrigemAtuais,
    magiasTalentoOrigemPreparadas,
    magiaIniciadaOrigemAtual,
    magiaIniciadaEspecieAtual,
    magiasTalentoGeralAtuais,
    magiasTalentoGeralPreparadas,
    magiasGratisTalentoGeral,
    ritualRapidoDisponivel,
    ritualRapidoGasto,
    nomesAcoesBonusExtras,
    acoesGenericasBonus,
    magiasConjuraveis,
    magiasPreparadasReacao,
    magiasPreparadasBonus,
    magiasPreparadasAcao,
    truquesAcao,
    truquesBonus,
  };
}
