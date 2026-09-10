// Motor de Level Up — Entrega B1 (plano "Guerreiro 1-20", ver
// DECISOES-DESIGN.md). Tudo derivado da progressão real da classe
// (`classes.ts`, já importada da planilha) e de `caracteristicasClasse.ts`
// — zero constante de D&D hardcoded, zero suposição fixa por classe.

import { caracteristicasClasse } from '../data/rulesets/dnd2024/caracteristicasClasse';
import { caracteristicasSubclasse } from '../data/rulesets/dnd2024/caracteristicasSubclasse';
import { caracteristicasSubclasseHomebrew } from '../data/rulesets/dnd2024/caracteristicasSubclasseHomebrew';
import type { Classe } from '../data/rulesets/dnd2024/classes';
import { ID_CARACTERISTICA_CLASSE } from '../data/rulesets/dnd2024/idsCaracteristicasClasse';

// Junta as características oficiais (planilha) com as homebrew
// (Necromante, transcrita à mão — ver caracteristicasSubclasseHomebrew.ts)
// numa lista só, pra todo o motor de Level Up ler igual, sem precisar
// saber a origem de cada uma. A UI mostra o selo de homebrew olhando
// `Subclasse.homebrew` (subclasses.ts), não essa lista.
const todasCaracteristicasSubclasse = [...caracteristicasSubclasse, ...caracteristicasSubclasseHomebrew];

export interface CaracteristicaNivel {
  nome: string;
  descricao: string | null;
}

/** Níveis em que a classe ganha "Aumento no Valor de Atributo" — lido
 * direto da progressão real da classe, não uma tabela fixa. Guerreiro
 * tem 6 níveis de ASI (4,6,8,12,14,16), diferente da maioria das
 * outras classes (5 níveis) — variação real confirmada no livro, ver
 * DECISOES-CLASSES.md "Motor de Level Up genérico".
 * Reconhecida por ID estável (`ID_CARACTERISTICA_CLASSE.asi`, ver
 * CLAUDE.md seção 13), não por comparação direta do nome de exibição. */
export function niveisComASI(classe: Classe): number[] {
  const nome = ID_CARACTERISTICA_CLASSE.asi;
  return classe.progressao.filter((p) => p.caracteristicas.includes(nome)).map((p) => p.nivel);
}

/** Níveis em que a classe concede uma "Dádiva Épica" — categoria de
 * escolha exclusiva de nível único (só nível 19 no Guerreiro hoje). */
export function niveisComDadivaEpica(classe: Classe): number[] {
  const nome = ID_CARACTERISTICA_CLASSE.dadivaEpica;
  return classe.progressao.filter((p) => p.caracteristicas.includes(nome)).map((p) => p.nivel);
}

/** True se a classe já concedeu "Estilo de Luta" em algum nível até
 * `nivelAtual` (inclusive) — regra confirmada no livro: "sempre que
 * atinge um nível [de Guerreiro], você pode substituir o talento que
 * escolheu por um talento diferente de Estilo de Luta" (não é escolha
 * única do nível 1, é reconsiderável em todo level-up daí em diante).
 * Generalizado por ID de característica, não hardcoded pra
 * Guerreiro — Guardião/Paladino também têm "Estilo de Luta" (concedido
 * no nível 2 deles); quando forem importados, isso já funciona sem
 * mudar código. */
export function temEstiloDeLutaTrocavel(classe: Classe, nivelAtual: number): boolean {
  const nome = ID_CARACTERISTICA_CLASSE.estiloDeLuta;
  return classe.progressao.some((p) => p.nivel <= nivelAtual && p.caracteristicas.includes(nome));
}

/** Características (com descrição real, quando `caracteristicasClasse.ts`
 * já tiver o nível importado) desbloqueadas num nível específico da
 * classe. Níveis sem descrição própria ainda (ex: "Aumento no Valor de
 * Atributo" repetido, "Característica de Subclasse" placeholder) voltam
 * com `descricao: null` — quem renderiza decide o que mostrar nesse caso.
 *
 * Algumas características (ex: "Indomável") são re-listadas em níveis
 * mais altos na progressão só pra indicar um uso extra do mesmo recurso,
 * não uma descrição nova — `caracteristicasClasse.ts` só tem UMA entrada
 * (no nível em que a característica foi introduzida). Por isso a busca
 * pega a entrada de maior nível ≤ nível atual, não uma igualdade exata. */
export function caracteristicasDoNivel(classe: Classe, nivel: number): CaracteristicaNivel[] {
  const linha = classe.progressao.find((p) => p.nivel === nivel);
  if (!linha) return [];
  return linha.caracteristicas.map((nome) => {
    const candidatos = caracteristicasClasse.filter(
      (c) => c.classe === classe.nome && c.nome === nome && c.nivel <= nivel,
    );
    const detalhe = candidatos.sort((a, b) => b.nivel - a.nivel)[0];
    return { nome, descricao: detalhe?.descricao ?? null };
  });
}

/** Todas as características de classe já desbloqueadas do nível 1 até
 * `nivelAtual` (inclusive), sem repetir nome — características como
 * "Indomável"/"Surto de Ação" aparecem de novo em níveis mais altos só
 * pra indicar +1 uso do mesmo recurso (ver `contarRepeticoesCaracteristica`),
 * então a 2ª/3ª ocorrência do mesmo nome não vira uma 2ª linha na
 * lista. Usado pela aba "Perfil" da Ficha (lista de habilidades reais
 * do personagem, não só do nível atual). */
export function caracteristicasAcumuladas(classe: Classe, nivelAtual: number): CaracteristicaNivel[] {
  const vistos = new Set<string>();
  const resultado: CaracteristicaNivel[] = [];
  for (let nivel = 1; nivel <= nivelAtual; nivel++) {
    for (const c of caracteristicasDoNivel(classe, nivel)) {
      if (vistos.has(c.nome)) continue;
      vistos.add(c.nome);
      resultado.push(c);
    }
  }
  return resultado;
}

/** True + descrição real se a classe já desbloqueou uma característica
 * nomeada até `nivelAtual` (ex: "Mestre Tático" nível 9, "Ataques
 * Estudados" nível 13) — null se ainda não chegou nesse nível. Usa a
 * mesma busca "maior nível ≤ atual" de `caracteristicasDoNivel`, só que
 * por nome direto em vez de por linha de progressão inteira — útil pra
 * telas (ex: Combat) que só precisam saber de 1 característica
 * específica, sem montar a lista toda do nível. */
export function caracteristicaDesbloqueada(classe: Classe, nome: string, nivelAtual: number): CaracteristicaNivel | null {
  const desbloqueada = classe.progressao.some((p) => p.nivel <= nivelAtual && p.caracteristicas.includes(nome));
  if (!desbloqueada) return null;
  const candidatos = caracteristicasClasse.filter(
    (c) => c.classe === classe.nome && c.nome === nome && c.nivel <= nivelAtual,
  );
  const detalhe = candidatos.sort((a, b) => b.nivel - a.nivel)[0];
  return { nome, descricao: detalhe?.descricao ?? null };
}

/** Conta quantas vezes uma característica com o padrão "repete o mesmo
 * nome pra indicar +1 uso" (ver DECISOES-CLASSES.md "Motor de Level Up
 * genérico") aparece na progressão até `nivelAtual` —
 * usado pra derivar nº de usos de recursos como Indomável (9/13/17) e
 * Surto de Ação (2/17) que não têm coluna numérica própria em
 * `classes.ts` (diferente de Recuperar Fôlego/Maestria em Arma, que
 * têm). Genérico por nome — funciona pra qualquer classe futura com o
 * mesmo padrão, não só Guerreiro. */
export function contarRepeticoesCaracteristica(classe: Classe, nome: string, nivelAtual: number): number {
  return classe.progressao.filter((p) => p.nivel <= nivelAtual && p.caracteristicas.includes(nome)).length;
}

/** Níveis em que a classe concede a escolha de perícias Especialista
 * (dobra o Bônus de Proficiência) — Bardo nos níveis 2 e 9. A
 * planilha mestra usa nomes diferentes de característica pros dois
 * (\"Especialista\" no nível 2, \"Especialização\" no nível 9) mesmo
 * sendo a mesma mecânica (confirmado com o Osmar) — por isso os dois
 * IDs contam aqui, em vez de assumir que a característica sempre se
 * chama igual em todo nível que a concede. */
export const NOMES_ESPECIALISTA: string[] = [ID_CARACTERISTICA_CLASSE.especialista, ID_CARACTERISTICA_CLASSE.especializacao];

export function niveisComEspecialista(classe: Classe): number[] {
  return classe.progressao.filter((p) => p.caracteristicas.some((c) => NOMES_ESPECIALISTA.includes(c))).map((p) => p.nivel);
}

/** Nº de ataques concedidos pela ação Atacar no nível atual — deriva do
 * padrão "muda de nome a cada salto" (convenção 2 da mesma decisão):
 * "Ataque Extra" (2), "Dois Ataques Extras" (3), "Três Ataques Extras"
 * (4) são nomes oficiais usados por várias classes do Livro do Jogador
 * 2024 (não é specific de Guerreiro) pra indicar a mesma mecânica de
 * base escalando — por isso o mapa ID→contagem é genérico, lido
 * contra a progressão real da classe, não uma tabela por classe. */
const CONTAGEM_ATAQUE_EXTRA: Record<string, number> = {
  [ID_CARACTERISTICA_CLASSE.ataqueExtra]: 2,
  [ID_CARACTERISTICA_CLASSE.doisAtaquesExtras]: 3,
  [ID_CARACTERISTICA_CLASSE.tresAtaquesExtras]: 4,
};

/** True se a subclasse já tem pelo menos 1 característica real
 * importada em `caracteristicasSubclasse.ts` (ou homebrew, ver
 * `caracteristicasSubclasseHomebrew.ts`) — usado pra bloquear a
 * escolha de subclasses que ainda são só um nome/ícone (ver
 * PENDENCIAS.md "Escolha de subclasse — versão placeholder"). Genérico
 * por dado, não hardcoded pro nome de nenhuma subclasse específica. */
export function subclasseImplementada(nomeSubclasse: string): boolean {
  return todasCaracteristicasSubclasse.some((c) => c.subclasse === nomeSubclasse);
}

/** Características de subclasse já desbloqueadas (nível 1 até
 * `nivelAtual`, inclusive) — mesmo formato de `caracteristicasAcumuladas`,
 * só que lendo de `caracteristicasSubclasse.ts`/homebrew (dado próprio,
 * chave é o NOME da subclasse, não a classe). `nomeSubclasse === null`
 * (personagem ainda não escolheu, ou subclasse ainda não importada)
 * retorna sempre vazio — nunca quebra. Cada característica de
 * subclasse já tem o nível certo direto no dado (não precisa cruzar
 * com `classe.progressao` como as de classe base). */
export function caracteristicasSubclasseAcumuladas(nomeSubclasse: string | null, nivelAtual: number): CaracteristicaNivel[] {
  if (!nomeSubclasse) return [];
  return todasCaracteristicasSubclasse
    .filter((c) => c.subclasse === nomeSubclasse && c.nivel <= nivelAtual)
    .sort((a, b) => a.nivel - b.nivel)
    .map((c) => ({ nome: c.nome, descricao: c.descricao }));
}

/** Característica(s) de subclasse desbloqueada(s) EXATAMENTE no nível
 * dado (não acumulado) — usado pra resolver o placeholder
 * "Característica de Subclasse" que a planilha usa em
 * `classes.ts`/`progressao` quando o Livro do Jogador diz "veja sua
 * subclasse" em vez de nomear a característica (ela varia por
 * subclasse). Ver `caracteristicasDoNivelComSubclasse`, que já faz essa
 * substituição — usar essa função direto só é necessário fora do fluxo
 * de Level Up. */
export function caracteristicasSubclasseDoNivel(nomeSubclasse: string | null, nivel: number): CaracteristicaNivel[] {
  if (!nomeSubclasse) return [];
  return todasCaracteristicasSubclasse
    .filter((c) => c.subclasse === nomeSubclasse && c.nivel === nivel)
    .map((c) => ({ nome: c.nome, descricao: c.descricao }));
}

/** Nome literal que a planilha usa em `classes.ts` quando a
 * característica daquele nível depende da subclasse escolhida (ex:
 * Bardo nível 6 e 14, Guerreiro nível 7/10/15/18) — o Livro do Jogador
 * só diz "veja sua subclasse" ali, não nomeia nada fixo. */
export const NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE = 'Característica de Subclasse';

/** Igual a `caracteristicasDoNivel`, mas troca qualquer entrada
 * `NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE` pela(s) característica(s)
 * REAL(is) daquele nível da subclasse escolhida (0, 1 ou mais — ex:
 * Colégio do Conhecimento nível 3 tem 2 de uma vez). Se a subclasse
 * ainda não tem dado importado (ou não foi escolhida), o placeholder
 * fica como está — quem renderiza decide o que mostrar nesse caso. */
export function caracteristicasDoNivelComSubclasse(classe: Classe, nivel: number, nomeSubclasse: string | null): CaracteristicaNivel[] {
  const base = caracteristicasDoNivel(classe, nivel);
  return base.flatMap((c) => {
    if (c.nome !== NOME_PLACEHOLDER_CARACTERISTICA_SUBCLASSE) return [c];
    const reais = caracteristicasSubclasseDoNivel(nomeSubclasse, nivel);
    return reais.length > 0 ? reais : [c];
  });
}

/** True se uma característica NOMEADA de subclasse já está desbloqueada
 * no nível atual — mesmo padrão de `caracteristicaDesbloqueada`, só que
 * pra `caracteristicasSubclasse.ts`/homebrew. Usado por telas que só
 * precisam saber de 1 característica específica (ex: painel de Reação). */
export function caracteristicaSubclasseDesbloqueada(nomeSubclasse: string | null, nome: string, nivelAtual: number): boolean {
  if (!nomeSubclasse) return false;
  return todasCaracteristicasSubclasse.some((c) => c.subclasse === nomeSubclasse && c.nome === nome && c.nivel <= nivelAtual);
}

export function numeroDeAtaques(classe: Classe, nivelAtual: number): number {
  let maximo = 1;
  for (const linha of classe.progressao) {
    if (linha.nivel > nivelAtual) break;
    for (const nome of linha.caracteristicas) {
      const contagem = CONTAGEM_ATAQUE_EXTRA[nome];
      if (contagem && contagem > maximo) maximo = contagem;
    }
  }
  return maximo;
}
