// Armazenamento de personagens — interface trocável (CLAUDE.md regra 4:
// "nunca acesse localStorage direto de dentro de componentes"). Hoje só
// existe a implementação local; nuvem (Supabase) entra na Fase 5.

import type { WizardSelection } from './personagem';
import type { ItemMochila } from './mochila';
import type { Pet } from './pets';
import type { PersonagemClasse } from './multiclasse';
import { ID_PERSONAGEM_DEMO } from '../data/personagemDemo';

export interface PersonagemSalvo {
  id: string;
  criadoEm: string;
  /** Nível TOTAL do personagem (soma de todas as classes, se
   * multiclasse) — `selecao.classe`/`subclasseAtual` abaixo continuam
   * sendo o formato "1 classe só" (pré-multiclasse); ver `classes`. */
  nivel: number;
  xp: number;
  pvAtual: number;
  selecao: WizardSelection;
  /** Classes do personagem (Fase M — Multiclasse). Ausente = personagem
   * salvo antes da Fase M, ou nunca multiclassou — `core/multiclasse.ts`'s
   * `classesDoPersonagem` deriva 1 elemento único de `selecao.classe`/
   * `nivel`/`subclasseAtual` nesse caso (mesmo padrão de "campo ausente
   * cai pro antigo" já usado nos campos abaixo). Só escrito de verdade
   * quando o Level Up ganhar a escolha de classe (Fase M2) — até lá,
   * fica sempre ausente, nenhum comportamento muda. */
  classes?: PersonagemClasse[];
  /** Campos abaixo guardam estado de progressão que muda DEPOIS da
   * criação (Level Up, Descanso, uso de recursos em combate) — tudo
   * opcional porque personagens salvos antes dessa entrega não têm
   * esses campos ainda; quem lê usa `??` com um fallback derivado de
   * `selecao`/nível 1 (ver `FichaShell.tsx`). Sem isso, dar F5 na
   * Ficha depois de subir de nível perdia o progresso — só `nivel`,
   * `xp` e `pvAtual` eram salvos, o resto (PV máximo real, Estilo de
   * Luta trocado, Maestria em Arma trocada, usos gastos de recurso)
   * só existia em estado do React, nunca em disco. */
  pvMax?: number;
  /** PV Temporário atual (ex: concedido por Vigor Ínfero/Vitalidade
   * Vazia) — absorve dano antes do PV normal, nunca soma com cura.
   * Ausente/0 = sem PV Temporário. Ver `core/pvTemporario.ts`. */
  pvTemporarioAtual?: number;
  /** Subclasse escolhida — versão placeholder (ver PENDENCIAS.md
   * "Escolha de subclasse — versão placeholder"): só o nome, usado
   * hoje pra trocar o ícone do personagem na Lista. Nenhuma
   * característica mecânica de subclasse existe ainda. */
  subclasseAtual?: string | null;
  estiloDeLutaAtual?: string | null;
  /** Qual classe está "em foco" na ficha hoje (seletor tipo pill,
   * só aparece com 2+ classes) — decide de qual classe vêm Truques/
   * Magias/recursos de classe exibidos. Ausente = primeira classe de
   * `classes` (ou a única, pra quem não multiclassou). */
  classeAtivaAtual?: string;
  /** Perícia(s)/instrumento(s) ganhos ESPECIFICAMENTE ao multiclassar
   * pra uma classe nova (SDD Multiclasse, seção 6 — ex: Bardo ganha 1
   * perícia + 1 Instrumento Musical à escolha) — somam com as
   * proficiências normais de perícia/ferramenta, nunca as substituem.
   * Ausente/vazio = nenhuma escolha desse tipo ainda. */
  periciasMulticlasseAtual?: string[];
  ferramentasMulticlasseAtual?: string[];
  maestriaArmaAtual?: string[];
  folegoGasto?: number;
  indomavelGasto?: number;
  surtoGasto?: number;
  /** @deprecated Etapa 4.1 — só existia 1 círculo simultâneo possível.
   * Substituído por `espacosGastosPorCirculo` (Etapa 4.2). Mantido só
   * pra migrar personagens salvos antes dessa entrega (ver
   * `FichaShell.tsx`) — nunca mais escrito. */
  espacosGastos?: number;
  /** @deprecated Fase M4b (multiclasse) — só guardava 1 personagem =
   * 1 classe, então círculo sozinho já identificava o pool. Substituído
   * por `espacosGastosPorClasseECirculo`. Mantido só pra migrar
   * personagens salvos antes do M4b (ver `FichaShell.tsx`) — nunca
   * mais escrito. */
  espacosGastosPorCirculo?: Record<number, number>;
  /** Espaços de Magia gastos, por CLASSE e por círculo (Fase M4b —
   * multiclasse: 2 classes podem ter espaços do mesmo número de
   * círculo ao mesmo tempo, ex. Bruxo com Pacto no círculo 2 e Mago
   * com Espaços de Magia normais também no círculo 2 — sem separar por
   * classe, gastar um erradamente descontava do outro). Chave externa
   * = nome da classe (`PersonagemClasse.classe`), interna = círculo.
   * Ausente = personagem nunca gastou espaço desde essa entrega;
   * `FichaShell.tsx` migra de `espacosGastosPorCirculo`/`espacosGastos`
   * (campos antigos, sempre pra dentro da classe ORIGINAL — só existia
   * 1 classe quando eles foram escritos). */
  espacosGastosPorClasseECirculo?: Record<string, Record<number, number>>;
  inspiracaoGasto?: number;
  /** Truques conhecidos DEPOIS da criação — cresce/troca no Level Up
   * (Etapa 4.1). Ausente = personagem nunca passou por um Level Up
   * com troca de Truques ainda; `FichaShell.tsx` cai pra
   * `selecao.truquesEscolhidos` (retrato da criação) nesse caso. */
  truquesAtual?: string[];
  /** Magias Preparadas DEPOIS da criação — cresce/troca no Level Up
   * (Etapa 4.3, mesmo padrão de `truquesAtual`). Ausente = personagem
   * nunca passou por um Level Up com troca de Magias Preparadas
   * ainda; `FichaShell.tsx` cai pra `selecao.magiasPreparadasEscolhidas`
   * (retrato da criação) nesse caso. */
  magiasPreparadasAtual?: string[];
  /** Livro de Magias (grimório) do Mago — pool de magias CONHECIDAS,
   * maior que `magiasPreparadasAtual` (ver DECISOES-CLASSES.md
   * "Casters", Padrão C). Cresce +2 por nível, nunca troca/diminui.
   * Ausente = cai pra `selecao.livroDeMagiasEscolhido` (retrato da
   * criação) — mesmo padrão de `truquesAtual`. `[]` pra quem não tem
   * essa característica (hoje, todo mundo além do Mago). */
  livroDeMagiasAtual?: string[];
  /** Invocações Místicas (Bruxo) conhecidas DEPOIS da criação — cresce/
   * troca no Level Up (Etapa 4.3 do Bruxo), mesmo padrão de
   * `truquesAtual`. Ausente = cai pra `selecao.invocacoesMisticasEscolhidas`
   * (retrato da criação). */
  invocacoesMisticasAtual?: string[];
  /** Livro das Sombras (Bruxo, Pacto do Tomo) — 3 truques + 2 magias
   * rituais atuais, combinados numa lista só (ver DND-Regras.md).
   * Trocável a qualquer momento via "Reconjurar o Livro" na Ficha
   * (não é fixo por level-up, regra real: re-escolhido a cada
   * Descanso). Ausente = cai pro livro escolhido na criação
   * (`selecao.livroDasSombrasTruques` + `livroDasSombrasMagias`). */
  livroDasSombrasAtual?: string[];
  /** `true` = o Livro já foi reconjurado desde o último Descanso Curto
   * ou Longo — botão "Reconjurar" fica travado até o próximo descanso
   * (a regra real só permite escolher de novo ao final de um
   * descanso). Resetado pra `false` em `descansoCurto`/`descansoLongo`. */
  livroDasSombrasGasto?: boolean;
  /** `true` = Memorizar Magia (Mago, nível 5+) já foi usada desde o
   * último Descanso Curto ou Longo — mesmo padrão de
   * `livroDasSombrasGasto` (reseta nos dois, não só num). Ver
   * `core/magiasPersonagem.ts` (`memorizarMagiaValida`). */
  memorizarMagiaGasta?: boolean;
  /** `true` = Astúcia Mágica (Bruxo, nível 2) já foi usada desde o
   * último Descanso Longo — só ele reseta (não é Descanso Curto,
   * diferente do Livro das Sombras). Ver `core/astuciaMagica.ts`. */
  astuciaMagicaGasta?: boolean;
  /** `true` = Contatar Patrono (Bruxo, nível 9) já foi usada desde o
   * último Descanso Longo — só ele reseta. Conjura Contato Extraplanar
   * sem gastar espaço, sucesso automático na salvaguarda. */
  contatarPatronoGasto?: boolean;
  /** Usos gastos de "A Sorte do Próprio Tenebroso" (Bruxo, Patrono
   * Ínfero, nível 6) desde o último Descanso Longo — só ele reseta.
   * Máximo = mod. Carisma (mín. 1), ver `core/sorteDoTenebroso.ts`. */
  sorteDoTenebrosoGasto?: number;
  /** Pontos de Sorte gastos (Talento de Origem Sortudo) desde o último
   * Descanso Longo — só ele reseta. Máximo = Bônus de Proficiência
   * atual. Sem cálculo automático de vantagem/desvantagem: o jogador
   * já tem os botões de Vantagem/Desvantagem em qualquer rolagem de
   * d20 no RollOverlay — este contador só acompanha quantos pontos
   * ainda restam. Ver `EmDev.md` (Grupo E). */
  pontosDeSorteGasto?: number;
  /** Resistência Ínfera (Bruxo, Patrono Ínfero, nível 10) — tipo de
   * dano escolhido na característica (qualquer um exceto Energético),
   * trocável a cada Descanso Curto ou Longo. `null`/ausente = ainda
   * não escolheu. Só informativo — ver `core/resistenciaInfera.ts`. */
  resistenciaInferaAtual?: string | null;
  /** `true` = já trocada desde o último Descanso Curto ou Longo — o
   * ícone 🔄 fica travado até o próximo (a regra real só permite
   * trocar ao completar um dos dois). Reseta pra `false` nos dois
   * tipos de descanso, diferente da maioria dos outros "Gasto" do
   * Bruxo (que só resetam no Longo). */
  resistenciaInferaGasto?: boolean;
  /** `true` = Lançar no Inferno (Bruxo, Patrono Ínfero, nível 14) já
   * usado desde o último Descanso Longo — só ele reseta (ou gastar 1
   * Espaço de Pacto pra recuperar antes disso). */
  lancarNoInfernoGasto?: boolean;
  /** Arcana Mística (Bruxo, níveis 11/13/15/17) — círculo (6/7/8/9) →
   * nome da magia escolhida pra esse arcanum. Cresce 1 entrada por
   * nível desbloqueado (ver `core/arcanaMistica.ts`). */
  arcanaMisticaAtual?: Record<number, string>;
  /** Círculos de Arcana Mística já usados de graça desde o último
   * Descanso Longo (usos independentes entre si) — só ele reseta. */
  arcanaMisticaGastos?: number[];
  /** IDs de Invocações Místicas cuja magia de graça (`recarga:
   * 'descansoLongo'`, ex: Presente das Profundezas) já foi usada desde
   * o último Descanso Longo — cada uma trava até lá. Invocações
   * `'ilimitado'` nunca entram aqui. Resetado pra `[]` em
   * `descansoLongo`. */
  magiasGratisInvocacoesGastas?: string[];
  /** Perícias escolhidas pra Especialização (dobra o Bônus de
   * Proficiência) — característica "Especialista" do Bardo, ganha nos
   * níveis 2 e 9 (2 escolhas por vez, acumulativas, sem troca — ver
   * `core/levelUp.ts` `niveisComEspecialista`). Ausente/vazio =
   * personagem ainda não passou por um desses níveis. */
  periciasEspecialistaAtual?: string[];
  /** Perícias com proficiência de verdade (não Especialização) ganhas
   * por "Proficiências Bônus" (Colégio do Conhecimento, nível 3) —
   * escolha única de 3, feita 1 vez só. Ausente/vazio = personagem
   * ainda não passou por esse nível com essa subclasse. */
  periciasSubclasseBonusAtual?: string[];
  /** Perícias com proficiência de verdade (não Especialização) ganhas
   * por Talento Geral — Especialista em Perícia (1 livre, qualquer
   * perícia) ou Analítico/Mente Aguçada (1 da lista restrita, só
   * quando o personagem AINDA NÃO era proficiente nela; se já era, a
   * escolha vai pra `periciasEspecialistaAtual` em vez desta — ver
   * `core/periciaTalentoGeral.ts`). Mesmo tratamento de
   * `periciasSubclasseBonusAtual`, junta no mesmo `periciasBonusExtras`
   * de `calcularPericias`. Ausente/vazio = nenhuma escolha desse tipo
   * feita ainda. */
  periciasTalentoGeralAtual?: string[];
  /** "Descobertas Mágicas" (Colégio do Conhecimento, nível 6) — 2
   * magias SEMPRE preparadas, de Clérigo/Druida/Mago, fora da conta
   * normal de Magias Preparadas. Trocável 1 por level-up (mesmo
   * padrão de Truques). Ausente/vazio = personagem ainda não passou
   * por esse nível com essa subclasse. */
  magiasDescobertasMagicasAtual?: string[];
  /** IDs dos Talentos Gerais escolhidos nos níveis de ASI/Talento (ver
   * `core/levelUp.ts` `niveisComASI`, `data/rulesets/dnd2024/talentos.ts`)
   * — acumula 1 por nível em que o jogador escolheu "Talento" em vez de
   * "Aumentar Atributos". Fase 3 do plano de Talentos (ver
   * DECISOES-DESIGN.md/PENDENCIAS.md): só salva e mostra o talento,
   * `[PH]` — nenhum efeito mecânico de verdade ainda (Fase 4). */
  talentosGeraisAtual?: string[];
  /** Escolha extra de magia de Talento Geral que pede 1+ magias
   * (Tocado pela Sombra/Fadas — 1 magia; Conjurador Ritualista — N
   * magias, N = Bônus de Proficiência no momento da escolha — ver
   * `core/magiaTalentoGeral.ts`) — chave é o `id` do talento, valor é
   * a lista de `nome`s escolhidos (1 item pros dois primeiros).
   * Ausente/vazio = nenhuma escolha desse tipo feita ainda (talento
   * ainda não pego, ou pego antes dessa entrega existir). */
  escolhaMagiaTalentoGeral?: Record<string, string[]>;
  /** IDs de talentos marcados com 📌 na tela de escolha do Level Up —
   * planejamento de build ("quero pegar isso num level up futuro"),
   * não afeta nenhuma regra. Ausente/vazio = nenhum favoritado. */
  talentosFavoritosAtual?: string[];
  /** Mochila como estado de verdade (ver DECISOES-FICHA.md "Mochila — decisões de arquitetura consolidadas") — quando ausente (personagem salvo antes
   * dessa entrega), `FichaShell.tsx` reconstrói a lista inicial a
   * partir de `selecao` (mesmo cálculo de sempre), só na 1ª vez. */
  itensMochilaAtual?: ItemMochila[];
  /** Pets/companheiros do personagem (ver EmDevB.md Fase P) — em array
   * desde o início, ausente/vazio = nenhum pet ainda. */
  petsAtual?: Pet[];
  /** Rascunho do Level Up em andamento (passo de PV) — precisa
   * sobreviver a fechar o Level Up ou dar F5, senão o jogador
   * consegue "voltar" saindo da tela pra rolar o dado de vida de
   * novo. `null`/ausente = nenhuma rolagem pendente. Zerado só quando
   * o Level Up é confirmado (`FichaShell.tsx`, `confirmarLevelUp`).
   * Ver DECISOES-DESIGN.md "Level Up — dado de vida rolado...". */
  levelUpHpModo?: 'media' | 'rolar' | null;
  levelUpHpRolado?: number | null;
  /** Estado do turno de Combate (Ação/Ação Bônus/Reação: cada um
   * "disponivel" ou "usada") — pedido do Osmar (2026-09): antes só
   * existia em estado do React, então sair da Ficha e voltar resetava
   * sozinho (F5, trocar de personagem na Lista, etc.), mesmo no meio
   * do MESMO turno de combate. Agora sobrevive a isso, e só reseta de
   * propósito ao rolar nova Iniciativa ou tocar "Fim do Turno"
   * (`FichaShell.tsx`, `aoRolarIniciativa`/`fimDoTurno`). Shape
   * espelha `RecursoTurno`/`EstadoRecurso` de `CombatTab.tsx` sem
   * importar de lá (core/ não depende de ui/, ver CLAUDE.md seção 4).
   * Ausente = personagem nunca teve isso salvo ainda, cai pro padrão
   * (todos "disponivel"). */
  turnStateAtual?: Record<'acao' | 'bonus' | 'reacao', 'disponivel' | 'usada'>;
  /** `true` = Surto de Ação (Guerreiro) já usado NESTE turno — reseta
   * junto com `turnStateAtual` (Fim do Turno/nova Iniciativa), não no
   * Descanso (isso é `surtoGasto`, contador de usos por Descanso
   * Curto, campo diferente). Mesma motivação de persistência acima. */
  surtoUsadoTurnoAtual?: boolean;
  /** Vigor Implacável (Orc) já disparou desde o último Descanso Longo
   * — só ele reseta. Ver `core/vigorImplacavel.ts`. */
  vigorImplacavelGasto?: boolean;
  /** Usos gastos de Conhecimento de Pedras (Anão) desde o último
   * Descanso Longo — só ele reseta. Máximo = Bônus de Proficiência. */
  conhecimentoDePedrasGasto?: number;
  /** Usos gastos de Pico de Adrenalina (Orc) desde o último Descanso
   * Curto OU Longo — os dois resetam (mesmo padrão de Recuperar
   * Fôlego). Máximo = Bônus de Proficiência. */
  picoDeAdrenalinaGasto?: number;
  /** Usos gastos de Ataque de Sopro (Draconato) desde o último
   * Descanso Longo — só ele reseta. Máximo = Bônus de Proficiência. */
  ataqueDeSoproGasto?: number;
  /** `true` = Voo Dracônico (Draconato, nível 5+) já usado desde o
   * último Descanso Longo — só ele reseta. */
  vooDraconicoGasto?: boolean;
  /** Usos gastos de Ancestralidade Gigante (Golias) desde o último
   * Descanso Longo — só ele reseta. Máximo = Bônus de Proficiência.
   * Mesmo contador pras 6 ancestralidades (só 1 foi escolhida na
   * criação, ver `selecao.subescolhaEspecieEscolhida`). */
  ancestralidadeGiganteGasto?: number;
  /** `true` = Forma Grande (Golias, nível 5+) já usada desde o último
   * Descanso Longo — só ele reseta. */
  formaGrandeGasto?: boolean;
  /** `true` = Forma Grande está TRANSFORMADA agora (diferente de
   * `formaGrandeGasto`: o app não segue tempo real, então quem ativou
   * também controla quando desliga — ligar/desligar não mexe no uso
   * gasto, só o Descanso Longo desliga e devolve o uso junto). Usado
   * pra saber se o bônus de tamanho de Capacidade de Carga (Porte
   * Poderoso + Forma Grande) está valendo agora — ver `core/mochila.ts`. */
  formaGrandeAtiva?: boolean;
  /** `true` = Mãos Curativas (Aasimar) já usada desde o último Descanso
   * Longo — só ele reseta. */
  maosCurativasGasto?: boolean;
  /** `true` = Revelação Celestial (Aasimar, nível 3+) já usada desde o
   * último Descanso Longo — só ele reseta. */
  revelacaoCelestialGasto?: boolean;
  /** Nome da forma de Revelação Celestial ativa no momento (Asas
   * Celestiais/Manto Necrótico/Transfiguração Radiante) — `null`/
   * ausente = nenhuma transformação ativa. Como o app não rastreia
   * tempo real (a transformação dura "1 minuto ou até encerrar"), essa
   * lembrança fica visível até o próximo Descanso Longo, junto com
   * `revelacaoCelestialGasto` (reseta os dois juntos). */
  revelacaoCelestialFormaAtiva?: string | null;
  /** Usos gastos de "Falar com Animais - Traço de Gnomo" (Gnomo do
   * Bosque) desde o último Descanso Longo — só ele reseta. Máximo =
   * Bônus de Proficiência. */
  falarComAnimaisGnomoGasto?: number;
  /** Inspiração Heroica (recurso universal, ver `Backlog.md`/SDD) —
   * flag booleano, nunca contador ("nunca mais de uma de cada vez").
   * `true` = personagem tem agora. O jogador liga/desliga manualmente
   * na aba Atributos (representa concessão do Mestre, já que o app
   * não tem modo Mestre); Humano também vira `true` sozinho a cada
   * Descanso Longo (traço Eficiente). Gasto = usar o reroll no
   * RollOverlay, que zera pra `false`. */
  inspiracaoHeroicaAtiva?: boolean;
}

export interface ArmazenamentoPersonagens {
  listar(): PersonagemSalvo[];
  buscar(id: string): PersonagemSalvo | null;
  salvar(personagem: PersonagemSalvo): void;
  apagar(id: string): void;
}

const CHAVE = 'dnd-companion:personagens';

class ArmazenamentoLocalStorage implements ArmazenamentoPersonagens {
  listar(): PersonagemSalvo[] {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? (JSON.parse(bruto) as PersonagemSalvo[]) : [];
    } catch {
      return [];
    }
  }

  buscar(id: string): PersonagemSalvo | null {
    return this.listar().find((p) => p.id === id) ?? null;
  }

  salvar(personagem: PersonagemSalvo): void {
    const atuais = this.listar().filter((p) => p.id !== personagem.id);
    localStorage.setItem(CHAVE, JSON.stringify([...atuais, personagem]));
  }

  apagar(id: string): void {
    // Personagem fixo de demonstração (ver `data/personagemDemo.ts`)
    // nunca é apagável — a URL fixa precisa continuar funcionando pra
    // sempre, mesmo que alguém tente apagar pela Lista.
    if (id === ID_PERSONAGEM_DEMO) return;
    const restantes = this.listar().filter((p) => p.id !== id);
    localStorage.setItem(CHAVE, JSON.stringify(restantes));
  }
}

export const armazenamentoPersonagens: ArmazenamentoPersonagens = new ArmazenamentoLocalStorage();

export function gerarIdPersonagem(): string {
  return `pj-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
