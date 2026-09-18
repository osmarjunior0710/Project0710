// Ataque real com a arma equipada — Entrega E3.2 do Plano de Equipamento
// (ver DECISOES-DESIGN.md). Substitui o fixture [PH] fixo (Adaga) do
// "Atacar" no Combat. Zero constante de D&D hardcoded: dano/propriedade
// vêm de `data/rulesets/dnd2024/armas.ts` (planilha), bônus de
// proficiência vem de `calculoPersonagem.ts`.

import { armas, type Arma } from '../data/rulesets/dnd2024/armas';
import type { Classe } from '../data/rulesets/dnd2024/classes';
import { estilosDeLuta } from '../data/rulesets/dnd2024/estilosDeLuta';
import { bonusProficiencia, efeitoMecanicoDoTalento, fmtMod } from './calculoPersonagem';
import { identificarEquipamento } from './equipamento';
import { classeProficienteComArma } from './proficienciaArma';
import type { AtaqueInfo } from '../data/exampleCombat';

/** Efeito mecânico (Fase 4) do Estilo de Luta escolhido pelo
 * personagem, se houver — `estiloDeLutaEscolhido` guarda o `nome`
 * (não o `id`), mesmo padrão de `personagem.estiloDeLutaEscolhido`. */
function efeitoDoEstiloDeLuta(estiloDeLutaEscolhido: string | null | undefined) {
  if (!estiloDeLutaEscolhido) return null;
  return estilosDeLuta.find((e) => e.nome === estiloDeLutaEscolhido)?.efeitoMecanico ?? null;
}

export interface AtaqueResolvido {
  nome: string;
  descricao: string;
  info: AtaqueInfo;
}

function parseDano(dano: string): { quantidade: number; lados: number; tipo: string } {
  const m = dano.match(/^(\d+)d(\d+)\s*(.*)$/i);
  if (!m) return { quantidade: 1, lados: 4, tipo: dano };
  return { quantidade: parseInt(m[1], 10), lados: parseInt(m[2], 10), tipo: m[3].trim() };
}

/**
 * Ataque Desarmado — confirmado no Apêndice C (Glossário de Regras):
 * "Seu bônus para a jogada é igual ao seu modificador de Força mais
 * seu Bônus de Proficiência. Se acertar, o alvo sofre dano Contundente
 * igual a 1 mais seu modificador de Força." Só a opção "Dano" está
 * implementada aqui — "Empurrar"/"Imobilizar" (testes de resistência,
 * sem rolagem de dano) ficam de fora por enquanto, ver PENDENCIAS.md.
 *
 * `talentosAtuais` — Valentão de Taverna troca o "1 fixo" por um dado
 * de verdade (`dado-ataque-desarmado`, ver `talentos.ts`); sem esse
 * talento, o dano continua o "1d1" padrão (na prática, sempre 1).
 */
export function ataqueDesarmado(
  classe: Classe,
  nivel: number,
  forMod: number,
  talentosAtuais?: string[],
  bonusDanoSeForca = 0,
): AtaqueResolvido {
  const prof = bonusProficiencia(classe, nivel);
  const dadoTalento = efeitoMecanicoDoTalento(talentosAtuais, 'dado-ataque-desarmado');
  const danoQuantidade = dadoTalento?.quantidade ?? 1;
  const danoLados = dadoTalento?.lados ?? 1;
  return {
    nome: 'Ataque Desarmado',
    descricao: 'Soco, chute ou golpe corpo a corpo sem arma. Dano Contundente.',
    // Ataque Desarmado sempre usa Força (Apêndice C) — `bonusDanoSeForca`
    // (Dano da Fúria do Bárbaro, ver sdd/sdd-barbaro-furia.md) soma
    // sempre que informado, sem precisar checar atributo.
    info: {
      modAcerto: forMod + prof,
      explicacaoAcerto: {
        linhas: [
          { label: 'mod. FOR', valor: fmtMod(forMod) },
          { label: 'Bônus de Proficiência', valor: fmtMod(prof) },
        ],
        total: { label: 'Ataque Desarmado', valor: fmtMod(forMod + prof) },
      },
      danoQuantidade,
      danoLados,
      danoMod: forMod + bonusDanoSeForca,
      danoTipo: 'Contundente',
      usouForca: true,
    },
  };
}

/**
 * Ataque com uma arma real do catálogo. Atributo usado: Força
 * (Corpo a Corpo) ou Destreza (à Distância) por padrão; com a
 * propriedade Acuidade, usa o maior entre os dois (Cap. 1: "a
 * propriedade Acuidade... permite que você use Força ou Destreza").
 *
 * `semModAtributoNoDano` é o ataque bônus da propriedade Leve (E3.3):
 * o dano não soma o modificador de atributo, a menos que ele seja
 * negativo (Cap. 6: "não adiciona seu modificador de atributo ao dano
 * do ataque adicional, a menos que esse modificador seja negativo").
 *
 * `duasMaosAtivo` é o modo 2 mãos de uma arma Versátil (E3.4): troca
 * o dado de dano pelo maior, indicado entre parênteses na propriedade
 * (ex.: "Versátil (1d10)") — planilha, não hardcoded.
 *
 * `estiloDeLutaEscolhido` (Fase 4 dos Talentos) soma o bônus de
 * Arquearia (+2 no acerto à Distância) e/ou Duelismo (+2 no dano corpo
 * a corpo com 1 arma numa mão e nenhuma outra — precisa
 * `outraArmaNaMaoSecundaria === false` e não estar em modo 2 mãos).
 *
 * Bônus de Proficiência só soma se a classe é realmente proficiente
 * com a arma (`classeProficienteComArma`) — sem isso, atacar com arma
 * fora da proficiência ainda funciona (regra real: só perde o bônus,
 * não trava o ataque).
 *
 * `atribForcada` (Pacto da Lâmina do Bruxo) substitui inteiramente a
 * escolha Força/Destreza/Acuidade de cima — a arma de pacto usa
 * Carisma pro ataque/dano, sempre, independente da propriedade da
 * arma. `undefined` = comportamento normal, sem mudança.
 */
export function ataqueComArma(
  arma: Arma,
  classe: Classe,
  nivel: number,
  forMod: number,
  desMod: number,
  semModAtributoNoDano = false,
  duasMaosAtivo = false,
  estiloDeLutaEscolhido?: string | null,
  outraArmaNaMaoSecundaria = false,
  atribForcada?: number,
  talentosAtuais?: string[],
  classesExtrasNomes?: string[],
  /** Dano da Fúria (Bárbaro, ver sdd/sdd-barbaro-furia.md) — só soma
   * quando o ataque usa Força de verdade (nunca em armas à distância;
   * em armas com Acuidade, só quando Força empata ou supera Destreza —
   * a mesma escolha que decide `atribMod` abaixo). */
  bonusDanoSeForca = 0,
): AtaqueResolvido {
  const acuidade = arma.propriedades.includes('Acuidade');
  const distancia = arma.categoria.includes('à Distância');
  const atribMod = atribForcada ?? (acuidade ? Math.max(forMod, desMod) : distancia ? desMod : forMod);
  const usouForca = !atribForcada && !distancia && (!acuidade || forMod >= desMod);
  const prof = classeProficienteComArma(classe, arma, talentosAtuais, classesExtrasNomes) ? bonusProficiencia(classe, nivel) : 0;
  const dadoVersatil = identificarEquipamento(arma.nome).dadoVersatil;
  const usaVersatil = duasMaosAtivo && dadoVersatil;
  const { quantidade, lados, tipo } = usaVersatil ? parseDano(`${dadoVersatil} ${arma.dano.replace(/^\d+d\d+\s*/, '')}`) : parseDano(arma.dano);
  const danoMod = semModAtributoNoDano && atribMod > 0 ? 0 : atribMod;
  const descPropriedades = arma.propriedades ? ` · ${arma.propriedades}` : '';

  const efeitoEstilo = efeitoDoEstiloDeLuta(estiloDeLutaEscolhido);
  const bonusArquearia = distancia && efeitoEstilo?.tipo === 'bonus-ataque-distancia' ? efeitoEstilo.bonus : 0;
  const podeDuelismo = !distancia && !duasMaosAtivo && !outraArmaNaMaoSecundaria;
  const bonusDuelismo = podeDuelismo && efeitoEstilo?.tipo === 'bonus-dano-uma-mao-sem-outra-arma' ? efeitoEstilo.bonus : 0;
  // Mestre em Armas Grandes — Maestria em Armas Pesadas: dano extra
  // (=Bônus de Proficiência) sempre que acertar com arma Pesada, sem
  // limite de "1x/turno" (livro não restringe). Usa o Bônus de
  // Proficiência do PERSONAGEM, não o `prof` condicional de cima (esse
  // só soma quando proficiente com a arma — o talento não exige isso).
  const bonusArmaPesada =
    arma.propriedades.includes('Pesada') && efeitoMecanicoDoTalento(talentosAtuais, 'dano-extra-e-cortar-arma-pesada') !== null
      ? bonusProficiencia(classe, nivel)
      : 0;

  // Rótulo do atributo usado no acerto, pro popup de rolagem (B7) —
  // mesma lógica de `atribMod` acima, só nomeando a fonte. `atribForcada`
  // só existe pro Pacto da Lâmina hoje (ver doc da função), sempre
  // Carisma — se ganhar outro chamador no futuro, precisa virar
  // parâmetro em vez de fixo.
  const rotuloAtributo = atribForcada !== undefined ? 'mod. CAR (Pacto da Lâmina)' : acuidade ? `mod. ${usouForca ? 'FOR' : 'DES'} (Acuidade)` : `mod. ${usouForca ? 'FOR' : 'DES'}`;

  return {
    nome: arma.nome,
    descricao: `${usaVersatil ? `${dadoVersatil} ${tipo}` : arma.dano}${descPropriedades}${usaVersatil ? ' (empunhada com 2 mãos)' : ''}.`,
    info: {
      modAcerto: atribMod + prof + bonusArquearia,
      explicacaoAcerto: {
        linhas: [
          { label: rotuloAtributo, valor: fmtMod(atribMod) },
          ...(prof !== 0 ? [{ label: 'Bônus de Proficiência', valor: fmtMod(prof) }] : []),
          ...(bonusArquearia !== 0 ? [{ label: 'Arquearia (Estilo de Luta)', valor: fmtMod(bonusArquearia) }] : []),
        ],
        total: { label: `Ataque — ${arma.nome}`, valor: fmtMod(atribMod + prof + bonusArquearia) },
      },
      danoQuantidade: quantidade,
      danoLados: lados,
      danoMod: danoMod + bonusDuelismo + bonusArmaPesada + (usouForca ? bonusDanoSeForca : 0),
      danoTipo: tipo,
      usouForca,
    },
  };
}

/** Resolve o ataque disponível pelo nome do item na Mão Principal —
 * arma real do catálogo se identificar, senão Ataque Desarmado.
 * `duasMaosAtivo` vem do `ItemMochila.duasMaosAtivo` da arma.
 * `atribForcada` — ver `ataqueComArma` (Pacto da Lâmina). */
export function ataqueAtual(
  nomeArmaEquipada: string | null,
  classe: Classe,
  nivel: number,
  forMod: number,
  desMod: number,
  duasMaosAtivo = false,
  estiloDeLutaEscolhido?: string | null,
  outraArmaNaMaoSecundaria = false,
  atribForcada?: number,
  talentosAtuais?: string[],
  bonusDanoSeForca = 0,
): AtaqueResolvido {
  const arma = nomeArmaEquipada ? armas.find((a) => a.nome === nomeArmaEquipada) : undefined;
  return arma
    ? ataqueComArma(
        arma,
        classe,
        nivel,
        forMod,
        desMod,
        false,
        duasMaosAtivo,
        estiloDeLutaEscolhido,
        outraArmaNaMaoSecundaria,
        atribForcada,
        talentosAtuais,
        undefined,
        bonusDanoSeForca,
      )
    : ataqueDesarmado(classe, nivel, forMod, talentosAtuais, bonusDanoSeForca);
}

/**
 * Ataque bônus da propriedade Leve (E3.3) — só existe quando a arma
 * da Mão Principal E a da Mão Secundária forem as duas Leve
 * (confirmado no Cap. 6, ver DECISOES-DESIGN.md "Sistema de
 * Equipamento"). `null` quando a condição não é satisfeita — painel
 * de Ação Bônus simplesmente não mostra a opção.
 *
 * Especialista Ambidestro (`mao-secundaria-sem-exigir-leve`) relaxa a
 * exigência: só a Mão Principal precisa ser Leve — a Secundária só não
 * pode ser Duas Mãos (regra base, continua valendo pros dois casos).
 */
export function ataqueBonusMaoSecundaria(
  nomeMaoPrincipal: string | null,
  nomeMaoSecundaria: string | null,
  classe: Classe,
  nivel: number,
  forMod: number,
  desMod: number,
  estiloDeLutaEscolhido?: string | null,
  talentosAtuais?: string[],
  bonusDanoSeForca = 0,
): AtaqueResolvido | null {
  if (!nomeMaoPrincipal || !nomeMaoSecundaria) return null;
  const principal = armas.find((a) => a.nome === nomeMaoPrincipal);
  const secundaria = armas.find((a) => a.nome === nomeMaoSecundaria);
  if (!principal || !secundaria) return null;
  if (secundaria.propriedades.includes('Duas Mãos')) return null;
  const secundariaSemExigirLeve = efeitoMecanicoDoTalento(talentosAtuais, 'mao-secundaria-sem-exigir-leve') !== null;
  if (!principal.propriedades.includes('Leve')) return null;
  if (!secundariaSemExigirLeve && !secundaria.propriedades.includes('Leve')) return null;
  // `outraArmaNaMaoSecundaria: true` — este ATAQUE é o de outra arma
  // na mão secundária, então Duelismo ("nenhuma outra arma") nunca se
  // aplica aqui, só potencialmente no ataque principal.
  return ataqueComArma(
    secundaria,
    classe,
    nivel,
    forMod,
    desMod,
    true,
    false,
    estiloDeLutaEscolhido,
    true,
    undefined,
    talentosAtuais,
    undefined,
    bonusDanoSeForca,
  );
}
