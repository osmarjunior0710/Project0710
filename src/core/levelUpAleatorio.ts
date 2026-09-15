// Level Up Rápido — botão "⚡" ao lado do Level Up normal (Ficha, aba
// Atributos). Ferramenta de desenvolvimento/teste (mesmo espírito do
// "🎲 Personagem de Teste" — ver `geradorPersonagemTeste.ts`): sobe 1
// nível de verdade, sorteando toda escolha que o Level Up de verdade
// pediria, sem passar por nenhuma tela. O resultado tem exatamente o
// formato que `LevelUpShell`'s `onConfirmar` produz, pra
// `FichaShell.confirmarLevelUp` aplicar sem precisar de um caminho de
// código separado (CLAUDE.md 6.1 — reaproveita em vez de duplicar).

import { dadoVidaValor } from '../data/levelUpFixtures';
import type { Atributo } from '../data/wizardFixtures';
import type { Classe } from '../data/rulesets/dnd2024/classes';
import { subclasses } from '../data/rulesets/dnd2024/subclasses';
import { estilosDeLuta } from '../data/rulesets/dnd2024/estilosDeLuta';
import { ID_CARACTERISTICA_SUBCLASSE } from '../data/rulesets/dnd2024/idsCaracteristicasSubclasse';
import { ID_CARACTERISTICA_CLASSE } from '../data/rulesets/dnd2024/idsCaracteristicasClasse';
import { pericias } from '../data/rulesets/dnd2024/pericias';
import { proficienciasIniciaisClasse } from '../data/rulesets/dnd2024/classesProficienciasIniciais';
import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';
import { talentos } from '../data/rulesets/dnd2024/talentos';
import type { InvocacaoMistica } from '../data/rulesets/dnd2024/invocacoesMisticas';
import {
  caracteristicaDesbloqueada,
  caracteristicaSubclasseDesbloqueada,
  niveisComASI,
  niveisComDadivaEpica,
  niveisComEspecialista,
  temEstiloDeLutaTrocavel,
  subclasseImplementada,
} from './levelUp';
import { valorRecursoClasse } from './recursosClasse';
import {
  completarListaDeMagias,
  espacosDeMagiaAtivos,
  poolDescobertasMagicas,
  usaRedefinicaoPorDescanso,
} from './magiasPersonagem';
import {
  invocacoesElegiveisAteNivel,
  invocacaoBloqueadaPorRequisitoAusente,
  INVOCACOES_COM_VINCULO_TRUQUE,
  truquesElegiveisParaVinculo,
} from './invocacoesMisticas';
import { circulosArcanaMisticaDesbloqueados, magiasElegiveisArcanaMistica } from './arcanaMistica';
import { embaralhar, sorteiaUm } from './sorteio';
import { talentoDisponivel, sortearAsiDoTalento } from './geradorPersonagemTeste';

export interface PersonagemParaLevelUpRapido {
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
}

export interface ParamsLevelUpRapido {
  classe: Classe;
  personagem: PersonagemParaLevelUpRapido;
  truquesAtuais: string[];
  magiasPreparadasAtuais: string[];
  livroDeMagiasAtuais: string[];
  invocacoesMisticasAtuais: string[];
  invocacoesTruqueVinculadoAtuais: Record<string, string>;
  arcanaMisticaAtuais: Record<number, string>;
  periciasEspecialistaAtuais: string[];
  periciasProficientesDoPersonagem: string[];
  periciasSubclasseBonusAtuais: string[];
  magiasDescobertasMagicasAtuais: string[];
  atributosFinaisAtuais: Record<Atributo, number>;
  talentosGeraisAtuais: string[];
  /** Bárbaro nível 3 — Conhecimento Primordial já escolhida (`null` se
   * ainda não escolheu, mesmo sentido de `periciasSubclasseBonusAtuais`
   * vazio). Ver `LevelUpShell.tsx`. */
  conhecimentoPrimordialPericiaAtual: string | null;
}

export interface ResultadoLevelUpRapido {
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
  /** Level Up Rápido nunca troca a magia de Iniciado em Magia (não faz
   * sentido sortear uma troca opcional) — sempre `null` aqui. */
  magiaIniciadaAlteracoes: { origem: string | null; especie: string | null } | null;
  /** Level Up Rápido nunca sorteia a Talentos Gerais como Tocado pela
   * Sombra/Fadas com sub-escolha de magia — sempre `null` aqui. Se o
   * talento sorteado for um desses, o personagem fica só com a magia
   * FIXA (Invisibilidade/Passo Nebuloso) até escolher a outra
   * manualmente num level-up de verdade. */
  escolhaMagiaTalentoGeral: Record<string, string[]> | null;
  /** Level Up Rápido nunca sorteia o atributo do Resiliente (mesma
   * lógica de `escolhaMagiaTalentoGeral` acima) — sempre `null` aqui.
   * Se o talento sorteado for Resiliente, o personagem fica sem o +1/
   * proficiência de Salvaguarda até escolher manualmente depois. */
  escolhaAtributoTalentoGeral: Record<string, string> | null;
  /** Level Up Rápido nunca sorteia a perícia livre/restrita de
   * Especialista em Perícia/Analítico/Mente Aguçada (mesma lógica de
   * `escolhaMagiaTalentoGeral` acima) — sempre `null` aqui. */
  periciaLivreTalentoEscolhida: string | null;
  periciaRestritaTalentoEscolhida: string | null;
  /** Bárbaro nível 3 — Conhecimento Primordial. Diferente de
   * `periciaRestritaTalentoEscolhida` acima, essa é sorteada de verdade
   * (lista fixa e pequena, mesmo padrão de `periciasSubclasseBonusEscolhidas`
   * — não precisa ficar `null` esperando escolha manual). */
  conhecimentoPrimordialPericiaEscolhida: string | null;
}

/** Escolhe Invocações Místicas respeitando pré-requisito (uma pode
 * exigir outra já escolhida) — várias rodadas sobre o catálogo
 * embaralhado até não conseguir mais nenhuma ou bater o máximo, pra
 * dar chance a uma invocação cujo requisito só entrou numa rodada
 * anterior. */
function sortearInvocacoes(catalogo: InvocacaoMistica[], max: number): string[] {
  const escolhidas: string[] = [];
  let restantes = embaralhar(catalogo);
  let progresso = true;
  while (escolhidas.length < max && progresso) {
    progresso = false;
    const proximaRodada: InvocacaoMistica[] = [];
    for (const inv of restantes) {
      if (escolhidas.length >= max || invocacaoBloqueadaPorRequisitoAusente(inv, escolhidas)) {
        proximaRodada.push(inv);
        continue;
      }
      escolhidas.push(inv.id);
      progresso = true;
    }
    restantes = proximaRodada;
  }
  return escolhidas;
}

/** Sorteia o resultado de subir exatamente 1 nível (`personagem.nivel + 1`)
 * — mesmas condições de `LevelUpShell.luSteps` pra decidir quais
 * escolhas se aplicam nesse nível, só que cada uma resolvida por
 * sorteio em vez de tela. PV sempre pela média (nunca rola dado — o
 * objetivo é ser instantâneo). */
export function sortearLevelUpRapido(params: ParamsLevelUpRapido): ResultadoLevelUpRapido {
  const { classe, personagem } = params;
  const novoNivel = personagem.nivel + 1;
  const pvGanho = dadoVidaValor[personagem.dadoVida] + personagem.conMod + personagem.bonusPvPorNivel;

  let subclasseEscolhida = personagem.subclasse;
  if (classe.nivelSubclasse === novoNivel && !personagem.subclasse) {
    const implementadas = subclasses.filter((s) => s.classeId === classe.id && subclasseImplementada(s.nome));
    subclasseEscolhida = sorteiaUm(implementadas)?.nome ?? null;
  }

  let periciasSubclasseBonusEscolhidas: string[] | null = null;
  if (
    caracteristicaSubclasseDesbloqueada(subclasseEscolhida, ID_CARACTERISTICA_SUBCLASSE.proficienciasBonus, novoNivel) &&
    params.periciasSubclasseBonusAtuais.length === 0
  ) {
    const periciasNaoProficientes = pericias
      .filter((p) => !params.periciasProficientesDoPersonagem.includes(p.nome))
      .map((p) => p.nome);
    periciasSubclasseBonusEscolhidas = embaralhar(periciasNaoProficientes).slice(0, 3);
  }

  let conhecimentoPrimordialPericiaEscolhida: string | null = null;
  if (
    caracteristicaDesbloqueada(classe, ID_CARACTERISTICA_CLASSE.conhecimentoPrimordial, novoNivel) !== null &&
    !params.conhecimentoPrimordialPericiaAtual
  ) {
    const opcoes = (proficienciasIniciaisClasse[classe.id]?.periciasEscolha.opcoes ?? []).filter(
      (nome) => !params.periciasProficientesDoPersonagem.includes(nome),
    );
    conhecimentoPrimordialPericiaEscolhida = sorteiaUm(opcoes) ?? null;
  }

  const estiloDeLutaEscolhido = temEstiloDeLutaTrocavel(classe, novoNivel)
    ? (sorteiaUm(estilosDeLuta)?.nome ?? personagem.estiloDeLuta)
    : personagem.estiloDeLuta;

  // Mago (e futuras classes com o mesmo Padrão C, ver DECISOES-CLASSES.md
  // "Casters"): Truques/Magias Preparadas só trocam no Descanso Longo —
  // aqui é só crescimento, nunca substitui o que já tinha.
  const usaRedefPorDescanso = usaRedefinicaoPorDescanso(classe);

  const maxTruques = valorRecursoClasse(classe, 'Truques Conhecidos', novoNivel);
  const truquesEscolhidos =
    maxTruques > 0
      ? usaRedefPorDescanso
        ? completarListaDeMagias(params.truquesAtuais, embaralhar(magiasDaClasse(classe.nome, 0)), maxTruques)
        : embaralhar(magiasDaClasse(classe.nome, 0))
            .slice(0, maxTruques)
            .map((m) => m.nome)
      : null;

  const circuloMaximoNovoNivel = Math.max(0, ...espacosDeMagiaAtivos(classe, novoNivel).map((e) => e.circulo));
  const poolMagiasDeCirculo = magiasDaClasse(classe.nome).filter(
    (m) => m.circulo > 0 && m.circulo <= circuloMaximoNovoNivel,
  );

  const maxLivroDeMagias = valorRecursoClasse(classe, 'Livro de Magias', novoNivel);
  const livroDeMagiasEscolhidas =
    maxLivroDeMagias > 0
      ? completarListaDeMagias(params.livroDeMagiasAtuais, embaralhar(poolMagiasDeCirculo), maxLivroDeMagias)
      : null;

  const maxMagiasPreparadas = valorRecursoClasse(classe, 'Magias Preparadas', novoNivel);
  const poolMagiasPreparadas = livroDeMagiasEscolhidas
    ? poolMagiasDeCirculo.filter((m) => livroDeMagiasEscolhidas.includes(m.nome))
    : poolMagiasDeCirculo;
  const magiasPreparadasEscolhidas =
    maxMagiasPreparadas > 0
      ? usaRedefPorDescanso
        ? completarListaDeMagias(params.magiasPreparadasAtuais, embaralhar(poolMagiasPreparadas), maxMagiasPreparadas)
        : embaralhar(poolMagiasPreparadas)
            .slice(0, maxMagiasPreparadas)
            .map((m) => m.nome)
      : null;

  const maxInvocacoes = valorRecursoClasse(classe, 'Invocações Místicas', novoNivel);
  const invocacoesMisticasEscolhidas =
    maxInvocacoes > 0 ? sortearInvocacoes(invocacoesElegiveisAteNivel(novoNivel), maxInvocacoes) : null;

  // Mesma pendência retroativa do Level Up de verdade (`LevelUpShell`,
  // `invocacoesQuePrecisamVinculo`) — o Rápido sorteia 1 truque
  // elegível pra cada Explosão Agonizante/Repulsiva marcada (agora ou
  // antes) que ainda não tem vínculo. Sem opção elegível ainda, some
  // sem vincular — o próximo Level Up (rápido ou de verdade) tenta de
  // novo, já que a invocação continua "sem vínculo" nesse caso.
  const invocacoesQuePrecisamVinculo = INVOCACOES_COM_VINCULO_TRUQUE.filter(
    (id) =>
      ((invocacoesMisticasEscolhidas ?? []).includes(id) || params.invocacoesMisticasAtuais.includes(id)) &&
      !params.invocacoesTruqueVinculadoAtuais[id],
  );
  const invocacoesTruqueVinculadoEscolhido =
    invocacoesQuePrecisamVinculo.length > 0
      ? invocacoesQuePrecisamVinculo.reduce<Record<string, string> | null>((acc, id) => {
          const opcoes = truquesElegiveisParaVinculo(id, truquesEscolhidos ?? params.truquesAtuais);
          const escolhido = sorteiaUm(opcoes);
          if (!escolhido) return acc;
          return { ...(acc ?? params.invocacoesTruqueVinculadoAtuais), [id]: escolhido.nome };
        }, null)
      : null;

  const magiasDescobertasMagicasEscolhidas = caracteristicaSubclasseDesbloqueada(
    subclasseEscolhida,
    ID_CARACTERISTICA_SUBCLASSE.descobertasMagicas,
    novoNivel,
  )
    ? embaralhar(poolDescobertasMagicas(circuloMaximoNovoNivel))
        .slice(0, 2)
        .map((m) => m.nome)
    : null;

  let periciasEspecialistaEscolhidas: string[] | null = null;
  if (niveisComEspecialista(classe).includes(novoNivel)) {
    const candidatas = params.periciasProficientesDoPersonagem.filter(
      (p) => !params.periciasEspecialistaAtuais.includes(p),
    );
    periciasEspecialistaEscolhidas = [...params.periciasEspecialistaAtuais, ...embaralhar(candidatas).slice(0, 2)];
  }

  let talentoGeralEscolhido: string | null = null;
  let atributosAumentados: Atributo[] | null = null;
  if (niveisComASI(classe).includes(novoNivel)) {
    const opcoesTalento = talentos.filter(
      (t) =>
        t.categoria === 'Geral' &&
        t.id !== 'aumento-no-valor-de-atributo' &&
        (t.repetivel || !params.talentosGeraisAtuais.includes(t.id)) &&
        talentoDisponivel(t, novoNivel, params.atributosFinaisAtuais),
    );
    const usarTalento = Math.random() < 0.5;
    const talentoEscolhido =
      (usarTalento ? sorteiaUm(opcoesTalento) : null) ??
      talentos.find((t) => t.id === 'aumento-no-valor-de-atributo') ??
      null;
    if (talentoEscolhido) {
      talentoGeralEscolhido = talentoEscolhido.id;
      const codigos = sortearAsiDoTalento(talentoEscolhido);
      atributosAumentados = codigos.length > 0 ? codigos : null;
    }
  }

  let dadivaEpicaEscolhida: string | null = null;
  if (niveisComDadivaEpica(classe).includes(novoNivel)) {
    const opcoes = talentos.filter(
      (t) =>
        t.categoria === 'Dádiva Épica' &&
        (t.repetivel || !params.talentosGeraisAtuais.includes(t.id)) &&
        talentoDisponivel(t, novoNivel, params.atributosFinaisAtuais),
    );
    dadivaEpicaEscolhida = sorteiaUm(opcoes)?.id ?? null;
  }

  let arcanaMisticaAlteracoes: Record<number, string> | null = null;
  const circulosAntes = circulosArcanaMisticaDesbloqueados(classe, personagem.nivel);
  const circulosDepois = circulosArcanaMisticaDesbloqueados(classe, novoNivel);
  const novoCirculoArcanaMistica = circulosDepois.find((c) => !circulosAntes.includes(c)) ?? null;
  if (novoCirculoArcanaMistica !== null) {
    const jaConhecidas = [
      ...(truquesEscolhidos ?? params.truquesAtuais),
      ...(magiasPreparadasEscolhidas ?? params.magiasPreparadasAtuais),
      ...Object.values(params.arcanaMisticaAtuais),
    ];
    const opcoes = magiasElegiveisArcanaMistica(novoCirculoArcanaMistica, jaConhecidas);
    const escolhida = sorteiaUm(opcoes);
    arcanaMisticaAlteracoes = escolhida ? { [novoCirculoArcanaMistica]: escolhida.nome } : null;
  }

  return {
    novoNivel,
    pvGanho,
    subclasseEscolhida,
    estiloDeLutaEscolhido,
    truquesEscolhidos,
    livroDeMagiasEscolhidas,
    magiasPreparadasEscolhidas,
    invocacoesMisticasEscolhidas,
    invocacoesTruqueVinculadoEscolhido,
    periciasEspecialistaEscolhidas,
    periciasSubclasseBonusEscolhidas,
    magiasDescobertasMagicasEscolhidas,
    atributosAumentados,
    talentoGeralEscolhido,
    dadivaEpicaEscolhida,
    arcanaMisticaAlteracoes,
    magiaIniciadaAlteracoes: null,
    escolhaMagiaTalentoGeral: null,
    escolhaAtributoTalentoGeral: null,
    periciaLivreTalentoEscolhida: null,
    periciaRestritaTalentoEscolhida: null,
    conhecimentoPrimordialPericiaEscolhida,
  };
}
