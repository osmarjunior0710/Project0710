# DECISOES-COMBATE.md

> Decisões de design sobre a **aba Combat** — Layout C, economia
> de ação/ação bônus/reação, espaços de magia em combate, PV,
> iniciativa, upcast na ação "Usar Magia". Parte da família
> `DECISOES-*.md` — ver o índice em `DECISOES-DESIGN.md` pra
> saber em qual arquivo procurar cada assunto, e a seção 7 do
> `CLAUDE.md` pra regra de quando registrar uma entrada aqui — e pro
> critério de "isso é padrão reaproveitável ou changelog de entrega"
> que mantém este arquivo pequeno.
>
> Compactado em 2026-09 (2ª passagem, só este arquivo) — entradas que
> só narravam progresso/teste ou bug sem lição foram cortadas; o que
> sobrou foi reescrito como padrão generalizado, sem a narrativa de
> como se chegou lá.
>
> Compactado de novo em 2026-09 (3ª passagem) — o histórico completo do
> Dado 3D (fases A-B6, cada bug achado testando no celular) saiu daqui
> e virou `aprendizados/sistemas/dado-3d.md`; só os padrões que
> generalizaram pra além do dado em si ficaram. 1 entrada desatualizada
> (descrevia um `DanoPendente`/modal de Ataque que não existe mais
> desde o retrofit do Fluxo Acerto/Erro) foi removida, salvando só o
> que ainda vale numa entrada existente.

---

## Combat Layout C — overlays usam `position: fixed` na viewport, não no "frame" do wireframe

**Padrão:** qualquer painel/overlay deslizante (Ação/Bônus/Reação, bottom
sheet, Roll Overlay, etc.) usa `position: fixed` relativo à viewport real
do navegador — o wireframe original simulava um celular dentro de uma div
`#frame`; o app de verdade não tem esse frame, a tela real já é o
contêiner. Vale pra qualquer overlay novo daqui pra frente.

## Fluxo Acerto/Erro — o popup de rolagem pergunta, nunca "atira e esquece"

**Problema resolvido:** até 2026-09, toda rolagem de ataque (e a
escolha de efeito que algumas características concedem depois de
acertar, ex. Golpe Brutal) usava um padrão "atira e esquece" — o app
liberava dano/efeito na MESMA chamada que iniciava a rolagem, sem
saber se o jogador realmente acertou, e "escolher um efeito" só
escrevia um texto de lembrete, nunca mudava nada de verdade. Ver
`sdd/sdd-fluxo-rolagem.md` pro levantamento completo e
`aprendizados/classes/barbaro.md` pra origem do achado (pendência de
Golpe Brutal). Protótipo iterado com o Osmar em `/prototipo/acerto-erro`
antes de formalizar — 4 rodadas até fechar (telas separadas quebravam
a sensação de "popup de verdade"; a versão final estende o PRÓPRIO
popup em vez de substituí-lo).

**Padrão definitivo, 3 peças, cada uma opcional/aditiva (nenhuma muda
o comportamento de quem não passa o campo novo):**

1. **`RollD20Options.confirmarAcerto: { onAcertou, onErrou }`** — numa
   rolagem de ATAQUE (ou qualquer d20 onde "acertar" decide o próximo
   passo), troca o ✕/tap-fora por 2 botões no rodapé do popup de
   rolagem ("Errei" à esquerda/vermelho, "Acertei" à direita/verde,
   MESMO estilo de Vantagem/Desvantagem). Errei fecha e volta pro
   estado anterior; Acertei fecha e roda `onAcertou` (normalmente
   dispara a rolagem de dano).
2. **`RollDadosOptions.confirmarFechamento: { rotulo?, aoTocar? }`**
   — numa rolagem de DANO que pode ter uma escolha de efeito depois
   (ex. Golpe Brutal), troca o fechamento normal por 1 botão no
   rodapé: sem `rotulo` mostra "OK" azul simples (personagem sem
   nenhuma característica com escolha — só fecha); com `rotulo`, mostra
   esse texto (nome da característica, ex. "🔨 Golpe Brutal") — tocar
   fecha o popup de dano e roda `aoTocar` (normalmente abre o popup de
   efeito). Quem decide qual dos dois passar é sempre o CALLER (o
   painel/aba que sabe se o personagem tem a característica), nunca o
   `RollOverlay`.
3. **Popup de efeito é um MODAL PRÓPRIO, fora do `RollOverlay`** —
   não é rolagem de dado, é escolha pura. `src/ui/components/
   EscolherEfeitoModal.tsx`, mesmo padrão visual dos modais já
   existentes (`ColheitaMacabraModal`/`FuriaImplacavelModal`,
   `TrocarArmaMaestria.module.css`) + `opt-card`/`opt-card-name`/
   `opt-card-desc` (globais, mesmo componente que a aba Combate já
   usava pro picker antigo de Golpe Brutal) pra cada opção — título +
   parágrafo, nunca só um nome solto. Botão "OK" sempre visível mas
   `btn-disabled` até pelo menos 1 opção escolhida.
4. **`RollDadosOptions.confirmarAlvoCura: { onMeCurar, onCurarOutro? }`**
   — extensão do mesmo padrão pra Cura (2026-09, pedido direto do
   Osmar, sem rodada de protótipo: "cura como o acerto/erro"). Numa
   rolagem de CURA que pode ter como alvo o próprio personagem OU
   outra criatura, troca o fechamento normal por 2 botões (mesmo
   estilo Errei/Acertei): "Curar outro" (esquerda/vermelho) só fecha —
   não existe seletor genérico de "qual outra criatura" ainda, quem
   precisa disso (Colheita Macabra) continua com o próprio modal
   dedicado, sem passar por aqui; "Me curar" (direita/verde) fecha E
   aplica o total rolado no PV do personagem (`onMeCurar`). Usado por
   magia de cura genérica (3 painéis: Ação/Bônus, Reação, aba Magias —
   cada um com sua própria cópia de `decidirConjuracao`/`rollCura`) e
   Mãos Curativas (Aasimar). Cura que É SEMPRE "eu mesmo" (Recuperar
   Fôlego, Fúria Implacável) continua com `onResultado` direto, sem
   esse gate — não tem escolha de alvo pra perguntar.

**Efeito visual de Cura — só em magia, decisão explícita do Osmar:**
"Me curar" numa magia de cura (não Mãos Curativas, não Recuperar
Fôlego — "tenho outros planos pra vida subindo") dispara uma vinheta
verde na base da tela + partículas "+" subindo, 2s, mesma técnica da
vinheta de Fúria (`CombatTab.module.css` `.furiaVinheta`) mas
ONE-SHOT (`useState` + `setTimeout`, padrão da "piscada" de Fim de
Turno) em vez de toggle contínuo. Vive em `FichaShell.tsx`
(`onCuraDeMagiaAplicada` = `alterarPv` + `dispararEfeitoCura`), não em
`CombatTab.tsx`, porque o gatilho pode vir da aba Magias (fora da
árvore do CombatTab) — precisa ficar montado num ancestral comum das
duas abas pra aparecer independente de qual está ativa.

**Achado importante pra qualquer vinheta full-tela futura — `z-index`
depende de QUAL borda:** a vinheta de Fúria usa `z-index: -1` porque
fica nas bordas ESQUERDA/DIREITA, onde os cards sempre têm margem
lateral (o vão deixa a vinheta "espiar" por trás). A vinheta de Cura,
na BASE da tela, não tem esse vão — cards vão até quase a tabbar fixa
(`z-index: 30`), escondendo `z-index: -1` por completo (testado:
100% invisível). Solução: `z-index: 20` — acima do conteúdo normal
(cards, sem z-index próprio), abaixo da tabbar (30), fazendo o verde
"nascer" de baixo dela. Regra geral: `z-index: -1` só funciona pra
vinheta de borda ONDE EXISTE margem/vão de verdade; vinheta que
precisa aparecer sobre conteúdo denso (like a base da tela) precisa
de um `z-index` positivo escolhido em relação à UI fixa mais próxima.

**Continua fora de escopo (decisão antiga, ainda vale):** o efeito
escolhido nunca aplica nada de verdade no alvo (o app não modela
inimigo/status de terceiro) — só populates o feedback/log pro jogador
aplicar na mesa. Isso não mudou com o Fluxo Acerto/Erro, só o
CAMINHO até a escolha.

**Retrofit completo (2026-09, pedido do Osmar: "o fluxo do protótipo de
ataque vira o fluxo pra tudo"):** todo ataque no app usa Acerto/Erro
sempre, sem exceção — não existe mais "atira e esquece" pra ataque.
Cobertura final: Ataque normal, Ataque Bônus (mão secundária), Cortar
(Mestre em Armas Grandes), ataque de magia (3 painéis: Ação/Bônus,
Reação, aba Magias, via `core/conjurarMagia.ts` `decidirConjuracao`) e
Ancestralidade Gigante (ver entrada "Esmagador/Talhador" abaixo, que
generalizou pra cobrir os 3). Sem talento/característica aplicável, o
popup de dano mostra só "OK" — nunca mais o botão manual "Rolar Dano".
`DanoPendente`/`danoPendente`/`onEscolher(...,dano)` (o mecanismo
inteiro do padrão antigo) foram removidos por completo — nada mais
produz isso. Toda característica NOVA que precise de "confirma
acerto"/"escolhe efeito" já nasce usando esse padrão.

**Cuidado ao portar dano pendente pra `confirmarAcerto`:** o dano de
ataque com arma pode ter rerolls de Talento amarrados
(`rerollSe1`/`rerollEscolhido` — Dano Garantido do Valentão de
Taverna, Perfurador), fáceis de esquecer já que moravam só na FUNÇÃO
COMPARTILHADA do botão antigo "Rolar Dano" (não em cada produtor de
dano pendente) — ao migrar CADA produtor pro popup próprio, replique
essas condições em CADA UM, não só no ataque principal.

## Combate — economia de ação: 3 botões fixos, cada um abre painel do seu lado

**Decisão:** Ação/Ação Bônus/Reação são 3 botões fixos; cada um abre um
painel deslizante do seu lado correspondente (Ação da esquerda, Ação
Bônus da direita, Reação sobe de baixo). Dentro do painel de Ação, "Usar
Magia" expande inline como acordeão — não navega pra outra tela.

**Padrões mobile testados e descartados, não repetir:**
- Menu radial/pizza com as ações em círculo ao redor de um botão central
  — itens pequenos demais pro dedo em celular; funciona melhor em telas
  grandes com mais espaço (desktop).
- Lista vertical única misturando os 3 tipos de recurso — dificulta ver
  rápido o que já foi gasto no turno.

## Combate — estado Ativo vs Usada

**Decisão:** cada botão de recurso (Ação/Bônus/Reação) tem 2 estados —
ativo (colorido, clicável) e usada (cinza, bloqueado,
`pointer-events:none`). "↻ Fim do Turno" restaura os 3 de uma vez.

**Dívida técnica conhecida:** o modelo é um booleano simples (usado/não
usado) — não cobre classe/situação que concede mais de 1 uso do MESMO
recurso por turno (ex.: Monge com Rajada de Golpes, Multiclasse).
Tratamento específico fica pra quando isso for implementado de verdade.

## Combate — espaços de magia: pips por círculo, recuperação é regra por classe

**Decisão:** contador visual de pips (preenchido/gasto) por círculo,
dentro do acordeão "Usar Magia". Truques não consomem espaço; círculo 1+
consome e bloqueia nova conjuração quando zerado.

**Padrão:** cada classe conjuradora declara sua PRÓPRIA regra de
recuperação de espaço — nunca assumir Descanso Longo pra todas (Bruxo/
Magia de Pacto recupera em Descanso Curto).

## Combate — Reação é botão baixo/compacto; Ação e Ação Bônus continuam grandes

**Padrão:** recurso usado com menos frequência numa sessão de mesa
(Reação) ganha tratamento visual menor/mais compacto (barra horizontal
baixa, `--touch-target-min`) que os recursos usados praticamente todo
turno (Ação/Bônus, 76px, ícone empilhado) — comportamento (estado ativo/
usada, painel deslizante) é o mesmo, só muda o peso visual do gatilho.

**Cogitado e descartado:** 4ª categoria "Grátis" (ações que não gastam
nenhum dos 3 recursos, ex.: trocar de arma equipada) numa grade 2×2 —
não implementar sem a planilha mapear quais ações são realmente grátis;
reabrir como proposta nova se virar necessidade real.

## Combat — convenção de cor (remoção = vermelho) e switch "Detalhes"

**Convenção de cor confirmada:** amarelo/`--warn` é só pra aviso/
criticidade; qualquer ação de remover/apagar usa vermelho/`--danger`
(mesmo padrão do botão de apagar personagem, `CharacterList.tsx`).

**Padrão de switch "Detalhes":** um switch (`SidePanel.tsx`, estado de
sessão em `CombatTab.tsx`, mesmo padrão de `itensDetalhados`/`pesoAtivo`
da Mochila) liga/desliga o texto explicativo de apoio por linha
(`rowDesc`) — mas a informação ESSENCIAL pra decisão do jogador (ex.:
dado de dano/tipo/alcance de uma arma) nunca é escondida: sempre separe
"texto essencial pra agir agora" de "explicação de regra por trás", só o
2º some com o switch.

## Combat "Usar Magia" — fluxo de telas cheias com upcast real

**Regra de upcast (real, confirmada):** uma magia nunca cabe num Espaço
de círculo MENOR que o dela, cabe no dela ou em qualquer maior (até
círculo 9), contanto que sobre espaço. `core/magiasPersonagem.ts` →
`circulosDisponiveisParaConjurar(magiaCirculo, espacos,
espacosGastosPorCirculo)`, genérica pra qualquer classe/círculo, sem
hardcode.

**Padrão de fluxo:** telas cheias sequenciais reaproveitando o esqueleto
`.screen`/`.header`/`.body`/`.navLayer` de `LevelUpShell.module.css`
(nenhum CSS novo de esqueleto) — Truques/Magias Preparadas agrupados por
círculo (`SelecionarMagiaShell.tsx`, componente `GrupoMagiaColapsavel`,
mesmo do Level Up; magia de círculo N fica esmaecida só quando NENHUM
espaço ≥ N sobra). A tela de escolha de círculo (`EscolherCirculoShell.tsx`)
mostra o card da magia + 1 opção por círculo com espaços disponíveis, e
**sempre aparece antes de conjurar, mesmo com 1 único círculo possível**
— importante o jogador ver qual espaço está sendo gasto, mesmo sem
escolha real.

**Escopo consciente:** a tela de escolha de círculo mostra só o TEXTO da
magia (ex.: "Upcast: +Xd8 por círculo"), não um número pré-calculado por
opção — `core/magiaDano.ts` (`calcularDanoMagia`) já calcula o dado certo
e é usado pra rodar o dano depois de conjurar; mostrar esse número PRÉVIO
em cada opção é só o que falta (ver Backlog.md). Só o painel de Ação
ganhou esse fluxo novo — Reação ficou com a lista simples antiga (ver
PENDENCIAS.md).

## Combat — botões de Iniciativa e Fim do Turno no topo da aba

- **Iniciativa:** 1º toque rola 1d20+mod (mesmo `rolarD20` do
  `RollContext` de sempre) e mostra o resultado no próprio botão; 2º
  toque limpa (reinicia). Também dispara a recuperação de Inspiração de
  Bardo (nv18), mesmo gatilho já existente na aba Atributos — **rolar
  Iniciativa é rolar Iniciativa, não importa qual tela disparou.**
- **Fim do Turno:** reseta Ação/Bônus/Reação (comportamento de sempre);
  não mexe no valor de Iniciativa — ela é "por combate", não "por
  turno", só o 2º toque no próprio botão de Iniciativa encerra.

## Combat — Pontos de Vida: indicador linear M3 por severidade

**Estado final:** a barra de PV é um indicador linear reto M3
(`LinearProgressBar.tsx`, renomeado de uma 1ª tentativa
`WavyProgressBar.tsx`) — cor por severidade: >50% verde (`--good`),
25-50% âmbar (`--warn`), ≤25% vermelho (`--danger`), trecho não
preenchido em `--line`. A variante "wavy" (M3 Expressive) foi tentada e
descartada — não ficou legível no tamanho de tela do app; ficar sempre
com a linear reta. Os botões de ajuste viraram 1 linha de 5 abaixo do
card (−5 · −1 · Manual `[PH]` · +1 · +5), não mais dentro dele —
"Manual" ainda é `[PH]`, aguarda campo de digitar quantidade exata.
`onAlterarPv(delta)` já aceitava qualquer delta, sem mudança em `core/`.

## Modo de Teste — sequência fixa de d20 pra testar estados visuais, sem afetar dano

**Padrão:** ferramenta de QA que força resultado de dado previsível
(fila fixa `[1, 10, 15, 20]`, dá a volta no fim), com escopo restrito ao
d20 — dano e qualquer outro dado continuam de verdade mesmo ligado.
Nunca persiste entre carregamentos de página, e mostra indicador visual
(badge) quando ativo, pra nunca "esquecer ligado" no meio de uma sessão
de jogo real. `RollContext.tsx`: `modoTeste`/`alternarModoTeste`,
`rolarD20Dado` como função pura parametrizada por refs (não state, por
rodar dentro de callback memoizado com deps vazias). Vantagem/
Desvantagem (2 d20 juntos) consome o PRÓXIMO da fila pra cada um, sem
lógica adicional.

## Reroll condicionado — motor genérico pra "se sair 1, pode jogar de novo" (1 dado)

**Padrão:** `RollState.valorDado` guarda o valor real (não decorativo)
quando `rolarDados` é chamado com `quantidade === 1`; passar
`rerollSe1: { rotulo }` na chamada da ação só quando o personagem tiver
o talento — o resto (botão no overlay, 1 reroll só) é automático.
Primeiro caso: Valentão de Taverna. Ver "Grid de dados individuais"
abaixo pra reroll não condicionado ao valor.

**Gotcha:** o nome de um ataque já vem com emoji embutido (`` `🗡
${nome}` ``), então um label/nome composto nunca bate com `===` exato
— comparação por nome precisa de `.includes`/`.endsWith` (ex.:
`nome.endsWith('Ataque Desarmado')` em `AcaoPanelContent.tsx`/
`CombatTab.tsx`, pra decidir Dano Garantido/Perfurador).

## Grid de dados individuais — rolagem de 2+ dados mostra cada valor, com arte por tipo

**Padrão:** `RollState.dadosIndividuais?: DadoIndividual[]` (`{id,
lados, valor}`) só existe quando a rolagem tem 2+ dados no total
(suporta mistura de tipos via `RollDadosOptions.gruposExtras`). Rolagem
de 1 dado só NÃO ganha o campo — mantém a aparência antiga de propósito
(nunca mudar o que já funciona sem necessidade). `RollOverlay.tsx`
escolhe o layout pelo campo: presente → quebra em linhas de até 4 dados
centralizadas; ausente → linha única de sempre.

**Arte por tipo de dado:** mapa `lados → import` centralizado em
`src/ui/roll/dadosArte.ts` (`artePorLados`) — arquivo COMPARTILHADO
porque existe mais de 1 lugar no app que desenha um "dado girando"
(ver dívida técnica abaixo). Um `lados` sem arte cadastrada (ex.: dano
fixo modelado como "1 lado só", sem d1 físico) cai de volta na moldura
genérica antiga sem quebrar nada — é o comportamento CORRETO, não bug.

**Padrão de duração sincronizada:** toda animação de "suspense" (giro do
dado, piscada de Fim de Turno) tem sua duração numa ÚNICA constante JS
(`DURACAO_ANIMACAO_MS`, `DURACAO_PISCADA_MS`), repassada ao CSS via
custom property escrita via `style` inline — nunca duplicar o número
separadamente no JS e no `@keyframes`.

**Dívida técnica conhecida:** `LevelUpShell.tsx` tem seu PRÓPRIO
mecanismo de "dado rolando" (`setInterval` + tela preta full-screen),
criado antes do `RollContext`/`RollOverlay` e **nunca unificado** com
eles — hoje as 2 telas só compartilham a fonte de arte (`dadosArte.ts`),
não o motor de rolagem em si. Se aparecer uma 3ª tela de "dado rolando",
reaproveitar `dadosArte.ts`; uma futura unificação de motor fica pra
quando essa área for mexida de novo por outro motivo.

**Reroll à escolha (não condicionado a sair 1):** generaliza o
mecanismo de reroll acima pra "qualquer dado, qualquer valor" — com
grid, o jogador toca no dado (`id`) que quer rerolar; com 1 dado só,
reaproveita o mesmo botão do reroll condicionado. `core/
rerollDanoTalento.ts` (`temPerfurador`) + `AtaqueInfo.danoTipo` decidem
quando oferecer (ex.: Perfurador, só quando o dano é Perfurante).

## Magia/característica com múltiplos ataques discretos (feixes) — simplificar pra 1 ataque + N dados

**Padrão:** quando uma característica concede RAW múltiplas jogadas de
ataque separadas (feixes/rajadas), mas o app já trata "acertar" como
decisão do jogador (não calcula CA do inimigo), simplifique pra **1
rolagem de ataque + N dados de dano somados numa rolagem só** —
reaproveitando o mesmo mecanismo de "N cópias do dado" já usado por
Aprimoramento de Truque/upcast (`escalaTruqueTipo: "dado"`), nunca
criando um sistema de "múltiplos ataques" à parte. Antes de desenhar
estrutura nova pra um caso parecido, confira se o valor final bate com
"dado base + 1 dado por [o que escala]" — só saia desse padrão se os
dados forem de tamanhos diferentes por ataque, ou a progressão não
crescer em degraus fixos. Ver `core/magiaDano.ts`.

## Penalidade de proficiência (Armadura/Escudo/Arma) — 3 regras independentes, sinal calculado 1 vez só

**Regra real:** arma sem proficiência só perde o Bônus de Proficiência
no ataque (`core/proficienciaArma.ts`); escudo sem proficiência só não
soma bônus de CA (`calcularCAEquipado`); armadura sem proficiência dá
Desvantagem em QUALQUER d20 de Força/Destreza e bloqueia conjuração
inteira enquanto vestida — as 3 nunca compartilham a mesma regra.

**Padrão pra "Desvantagem em toda rolagem de X":** calcular o sinal
booleano UMA VEZ no nível mais alto (`FichaShell.tsx`, `core/
proficienciaArmadura.ts`) e passar como prop simples pra cada tela que
faz a rolagem afetada — nunca recalcular o sinal dentro de cada
componente; aplicar `vantagem: 'desvantagem'` só quando a rolagem ainda
não tem Vantagem/Desvantagem decidida por outro motivo, nunca
sobrescrevendo uma escolha explícita. Ataque com magia usa o atributo de
conjuração, nunca esse sinal.

**Bloqueio de conjuração:** trava em TODOS os pontos que deixam
conjurar direto (Ação e Reação em Combat, mais a aba Magias) — sempre
bloqueio de verdade (retorno cedo, sem gastar Espaço nem rolar), nunca
só aviso visual.

**Padrão pra somar categorias vindas de vários talentos:** quando mais
de 1 talento pode contribuir a mesma categoria ao mesmo personagem (ex.:
proficiência de armadura por talento), varra TODOS os talentos com
aquele tipo — `efeitoMecanicoDoTalento` não serve pra isso (para no
primeiro match).

## "Usar Magia" — painel de Espaços de Magia fixo à direita, só nessa tela

**Padrão de CSS (armadilha real):** um ancestral com `transform` (ex.:
um drawer/`SidePanel` animando slide-in) vira o "containing block" de
todo `position:fixed` descendente — por isso uma tela aberta de dentro
desse drawer nunca ocupa 100% da largura real da viewport, mesmo
marcada como `fixed`. Isso é esperado pelo CSS, não é bug a corrigir; só
o elemento que PRECISA cobrir a tela cheia de verdade deve escapar disso
via `createPortal` pro `<body>`.

**Padrão de padding reservado:** `padding-right`/margem reservada num
container pra um elemento `fixed` relativo à tela CHEIA precisa ser
calculada pela largura REAL do container (que pode ser menor que 100%
da tela, ver acima), nunca pela largura do próprio elemento fixed.

## Estado "temporário" de turno precisa persistir — reset é sempre um evento explícito

**Padrão:** qualquer estado que pareça "durar só o turno/a sessão", mas
que o jogador veria sumir sozinho ao trocar de tela (sair/voltar da
Ficha, F5, trocar de aba do navegador), precisa entrar no mesmo save
automático de tudo mais — o reset tem que ser um EVENTO explícito, nunca
"o componente desmontou". Aqui: Ação/Bônus/Reação e Surto de Ação
(`PersonagemSalvo.turnStateAtual`/`surtoUsadoTurnoAtual`) resetam só em
"Fim do Turno" ou ao rolar Iniciativa nova (RAW, toda rolagem de
Iniciativa é início de combate/cena novo).

## "Fim do Turno" — transição de "piscada de olho" esconde o reset

**Padrão:** uma troca de estado que merece ser disfarçada (não
instantânea/visível) pode fechar a tela com 2 planos cobrindo-a por
completo, aplicar o reset de verdade no MEIO exato da transição (tela
100% coberta, ninguém vê o salto) e reabrir em seguida — duração
sincronizada JS/CSS via custom property (mesmo padrão de
`DURACAO_PISCADA_MS`, ver "Grid de dados individuais" acima).

## Padrão: variante de um componente que não desmonta nunca deriva de um estado que já virou "vazio"

**Lição (de um bug real: painéis de Ação Bônus/Reação sempre saíam pela
esquerda ao fechar):** quando um componente decide QUAL VARIANTE
renderizar (lado/cor/layout) mas nunca desmonta — só troca de classe CSS
pra animar — essa variante não pode vir de um estado que já virou
`null`/fechado no mesmo instante em que a animação de SAÍDA começa.
Guarde o "último valor válido" num estado separado (aqui: `ultimoPainel`
ao lado de `painelAberto`) — só o booleano puro de aberto/fechado deve
resetar na hora certa.

## Dado 3D — escolha e padrões reaproveitáveis

**Escolha:** `@3d-dice/dice-box` (BabylonJS + Ammo.js, física real rodando
em Web Worker) formalizada em fases — Fase A: ferramenta avulsa
(`Dice3dFab.tsx`, todos os tipos de dado, histórico compartilhado com o
resto da Ficha via `RollContext.log`); Fase B: virou o motor OFICIAL de
toda rolagem do jogo (Combate/Magias/Atributos), com preferência 3D/2D
no menu do avatar. Histórico completo do processo (cada fase B1-B6,
cada bug achado/corrigido testando no celular, os gotchas da lib) vive
em `aprendizados/sistemas/dado-3d.md` — mecânica/mapeamento completo
em `sdd/sdd-dado-3d.md`. Só os padrões abaixo generalizaram pra além do
dado em si e continuam aqui.

**Cache de promise "carrega 1x" precisa limpar a própria ref ao
REJEITAR:** qualquer módulo que guarda a promise de inicialização numa
`ref`/variável de módulo (singleton, evita criar 2 instâncias)
precisa limpar essa referência no `.catch()`, não só no sucesso — sem
isso, um erro PASSAGEIRO (rede, layout momentâneo) vira permanente pro
resto da sessão, porque toda chamada seguinte reusa a mesma promise já
rejeitada em vez de tentar de novo. Vale pra qualquer lib carregada sob
demanda desse jeito, não só o motor de dado 3D (onde foi achado).

**Botão flutuante que expande uma coluna de ações alinhada a ele, sem
overlay:** padrão do FAB avulso de dado (`Dice3dFab.tsx`) — coluna
expande do próprio botão pra cima (`flex-direction: column-reverse` +
`align-items: flex-end`), sem escurecer a tela, fecha com 1
`pointerdown` no `document` que ignora cliques dentro de um wrapper
`ref` que embrulha o conjunto inteiro. Usar esse esqueleto pra qualquer
FAB futuro com múltiplas ações, em vez de abrir um overlay/bottom sheet
cheio pra poucas opções.

**Botão circular de canto — área de toque maior que o círculo
visível:** o ✕ de fechar do `RollOverlay` separa a área de TOQUE
(`.close`, ainda `--touch-target-min`) do círculo VISÍVEL (`.closeIcon`,
menor) — o centro da área de toque fica no VÉRTICE do canto do card
(`top/right: calc(var(--touch-target-min) / -2)`, metade fora/metade
dentro), então texto de tamanho variável ao lado nunca invade essa
região. Reaproveitar em qualquer botão circular de canto futuro que
precise conviver com conteúdo de tamanho variável ao lado.

## Roteamento Ação/Ação Bônus/Reação de magia é só o Tempo de Conjuração da própria magia

Cada magia/truque conjurável entra no painel certo do Combate
(`useMagiasEConjuracao.ts`) comparando `magia.tempoConjuracao` — nunca
por uma lista hardcoded de nomes. `core/magiasPersonagem.ts`:
`ehMagiaDeReacao`/`ehMagiaDeAcaoBonus` (`startsWith('Reação')`/
`startsWith('Ação Bônus')` — cobre as variantes descritivas dos
Golpes Divinos/Destruições, que também são Ação Bônus na regra real).
Reação é checada ANTES de Ação Bônus (nenhuma magia é as 2 coisas).
Exceção deliberadamente NÃO coberta: uma característica do personagem
que mude o tipo de ação de uma magia específica — não existe nenhuma
assim implementada hoje; se aparecer, o roteamento vira uma função que
aceita um override por personagem, em vez de olhar só a magia.

**"Usar Magia" virou um hook compartilhado entre os painéis:**
`useUsarMagiaPainel.tsx` (`ui/ficha/combat/`) tem TODO o fluxo
(picker Truque/Magia Preparada → `EscolherCirculoShell` se for o caso
→ `decidirConjuracao`) que antes só existia dentro de
`AcaoPanelContent.tsx` — extraído pra reaproveitar sem copiar ~90
linhas quando `BonusPanelContent.tsx` ganhou o mesmo fluxo (pedido do
Osmar: Danação, Ação Bônus do Bruxo, aparecia no painel errado).
Devolve `{ picker, abrirLista }`: quem chama faz
`if (picker) return picker;` antes do resto do JSX normal (mesmo
padrão de antes, só que compartilhado) e usa `abrirLista` no `onClick`
da linha "✨ Usar Magia". `DanoPendente` saiu de dentro de
`AcaoPanelContent.tsx` pra `DanoPendente.ts` própria — evita import
circular (o hook precisa do tipo, e agora `AcaoPanelContent` importa o
hook).

**Painel que fica MONTADO depois de fechar o drawer precisa resetar sua
própria navegação interna no fechamento — não só ao clicar "Voltar":**
`CombatTab.tsx` só zera `painelAberto` ao fechar (`fecharPainel()`),
nunca desmonta `AcaoPanelContent`/`BonusPanelContent` de verdade
(`ultimoPainel` guarda o conteúdo pra reabrir sem remontar). Isso é
seguro pra a maioria dos casos, mas quebra quando o conteúdo interno
tem seu próprio "sub-picker" com estado (o "Usar Magia" do
`useUsarMagiaPainel.tsx`) — se o jogador fecha o drawer inteiro
tocando na área escurecida ao lado (backdrop; o "screen" do picker,
`position:fixed` dentro do `transform` do drawer, só cobre a LARGURA
do drawer, não a viewport toda — a área escurecida ao lado continua
tocável) em vez de usar o "← Voltar" do próprio picker, o picker nunca
roda seu próprio `onFechar`/reset. Se esse sub-picker também tiver
conteúdo em Portal pro `document.body` (caso do painel "Espaços" do
`SelecionarMagiaShell`), ele fica preso na tela por cima do app
inteiro, mesmo com o drawer já visualmente fechado — bug reportado
pelo Osmar em 2026-09 ("aperta Ação, usar magia, mostra os slots e
volta, o popup fica na tela"). **Padrão de correção, vale pra
qualquer painel parecido no futuro:** o hook/componente que guarda o
sub-picker recebe um prop `aberto` (mapeado pro `open` do `SidePanel`
que o hospeda) e um `useEffect` que reseta o próprio estado de
navegação sempre que `aberto` vira `false` — não depender só do
`onFechar` interno do sub-picker, porque o drawer pode fechar por
fora dele.

**Data/origem:** 2026-09, pedido do Osmar.

## Recurso novo em `CombatTab.tsx` — 1 prop-objeto agrupado, não 3-4 props soltas

Até 2026-09, cada característica de classe/espécie que "gasta e
recupera" em Combat (Fôlego, Conhecimento de Pedras, Ataque de Sopro,
etc.) virava uma quadra de props soltas em `CombatTabProps`
(`xDisponivel`/`xMaximo`/`xRestantes`/`onUsarX`) — a interface tinha
chegado a ~93 props (G4.2 do foco de saúde do projeto, ver
`EmDevB.md`).

**Padrão daqui pra frente:** todo recurso novo desse tipo entra como 1
prop-objeto só, não como props soltas. 2 formas cobrem quase tudo:
- **Contador simples** — reusa o tipo `RecursoContado` já definido em
  `CombatTab.tsx`: `{ maximo, restantes, onUsar: () => boolean }`.
  Quando o recurso também tem um "existe pro personagem?" (a maioria
  das características de espécie), soma `disponivel: boolean` (ou,
  quando a informação em si já serve de flag — caso de
  Ancestralidade Gigante — um campo com o valor escolhido, ex.
  `escolhida: string | null`).
- **Flag de 1 uso** (`disponivel`/`gasto`/`onUsar`, sem contador) —
  Voo Dracônico, Forma Grande, Mãos Curativas.

Campos extras específicos do recurso (Ataque de Sopro: `cd`/
`numDados`/`tipoDano`; Revelação Celestial: `formaAtiva`/`opcoes`/
`danoBonus`/`cdManto`) entram direto no MESMO objeto, sem tentar forçar
um tipo genérico único pra todo mundo — só o formato
contador/flag é compartilhado.

`CombatTab` desestrutura cada grupo já renomeando de volta pros nomes
locais de sempre (`folego: { maximo: usosFolegoMaximo, restantes:
usosFolegoRestantes, onUsar: onUsarUsoFolego }`) — o corpo do
componente (JSX, funções internas) nunca precisa saber que o dado
chegou agrupado. `FichaShell.tsx` monta o objeto na hora de passar
(`folego={{ maximo: usosFolegoMaximo, ... }}`), lendo as MESMAS
variáveis de sempre — nenhuma das duas pontas perde nome nenhum.

**Deliberadamente NÃO propagado pros 3 painéis internos**
(`AcaoPanelContent`/`BonusPanelContent`/`ReacaoPanelContent`) — eles
continuam recebendo os valores soltos de sempre. Agrupar só a
fronteira `FichaShell` → `CombatTab` (a que cresce a cada classe/
espécie nova) manteve o escopo pequeno e a rede de segurança forte
(`tsc -b --force` sozinho bastou, sem erro nenhum pra corrigir depois
do regroup, dado que os nomes internos não mudaram).

## `ExplicacaoCalculo` também serve pra notação de dado (não só número resolvido)

O popup "ⓘ" (`ExplicacaoCalculo`/`InfoValor`) nasceu pra valores que já
resolvem num número (CA, perícia, modificador de ataque, CD). Ao levar
esse popup pra dano/cura de magia (B8), o "total" não é um número — só
existe como notação de dado (ex. "10d6"), porque o valor de verdade só
sai depois de rolar de verdade. Decidido reaproveitar o MESMO tipo
(`total: {label, valor}`, `valor` como string) em vez de criar uma
variante nova — `valor` já era string, só o CONTEÚDO passa a ser uma
notação em vez de um número formatado. `fmtDado(quantidade, lados, mod,
comSinal?)` (`core/magiaDano.ts`) formata essa notação, com "+" na
frente quando a linha é um incremento (Aprimoramento de Truque,
Upcast) — mesma função central de formatação pras duas pontas (a linha
extra e o total somado).

**Padrão pra lembrar:** ao expor a quebra de qualquer cálculo cujo
resultado final só existe como fórmula de dado (não como número), não
criar um tipo de popup novo — usar `ExplicacaoCalculo` normalmente,
com `total.valor` como notação de dado.

## CD de magia é compartilhada entre features que usam a mesma fórmula

Ao dar ⓘ pra CD (B8): Salvaguarda de Magia e "Lançar no Inferno"
(Bruxo, Patrono Ínfero) usam EXATAMENTE a mesma fórmula (`cdConjuracao(
modAcertoConjuracao)`) — só o alvo/efeito da salvaguarda muda, não o
número. "Ataque de Sopro" (Draconato) é uma CD DIFERENTE (baseada em
Constituição, Apêndice C: 8 + mod. CON + Bônus de Proficiência), não a
de conjuração.

**Padrão pra lembrar:** antes de computar/expor a quebra de uma CD (ou
qualquer valor) nova, checar se ela já é a MESMA fórmula de algo que já
existe no app — reaproveitar 1 valor calculado 1x (`explicarCdConjuracao`,
calculado em `FichaShell.tsx`) pra alimentar todos os popups que mostram
essa CD, em vez de recalcular por feature.

## Salvaguarda do alvo — modal único pra "CD do jogador, o ALVO que salva"

Toda característica onde o personagem impõe uma CD e é o ALVO (inimigo/
NPC) quem faz a salvaguarda — Ataque de Sopro (Draconato), Lançar no
Inferno (Bruxo), Salvaguarda de Magia e Golpe de Escudo (Mestre em
Escudos) — é o MESMO caso mecânico: o app não modela PV/atributo de
monstro, então nunca rola a salvaguarda do alvo sozinho, só mostra a CD
(+ quebra ⓘ) e o texto de Sucesso/Falha; o jogador resolve na mesa e
toca a ação disponível (rolar dano, ou só fechar quando não há dano —
Golpe de Escudo só empurra/derruba).

Até 2026-09 essas 4 features tinham 3 modais quase idênticos copiados à
mão (`AtaqueDeSoproModal`/`LancarNoInfernoModal`/`MagiaSalvaguardaModal`)
e Golpe de Escudo nem passava por um modal — era uma linha solta que
marcava "usado" na hora, sem mostrar CD/Sucesso/Falha num popup. Achado
pelo Osmar testando: Golpe de Escudo não seguia o mesmo padrão de
"mostrar CD → resolver na mesa → confirmar" que os outros 3 já tinham.
Unificados num componente só, `SalvaguardaDoAlvoModal.tsx` (título,
atributo, CD+ⓘ, Sucesso/Falha, até 2 botões de ação opcionais, texto
alternativo quando não há ação de dano) — os 4 casos passaram a
consumir o mesmo componente, Golpe de Escudo virou o 4º consumidor em
vez de uma linha solta (mesmo padrão de "abrir modal + marcar uso na
mesma ação" que Ataque de Sopro/Lançar no Inferno já usavam).

**Padrão pra lembrar:** qualquer talento/magia/característica NOVA que
seja "CD do personagem, o alvo que salva" (sem o app rolar o dado do
alvo) usa `SalvaguardaDoAlvoModal` — nunca cria um modal próprio pra
esse formato.

**Qual mecânica ativar (Ataque/Salvaguarda/Cura/Nenhuma) vem sempre de
1 campo estruturado** (`ataqueOuSalvaguarda` na planilha →
`mecanicaDaMagia`/`decidirConjuracao` em `core/conjurarMagia.ts`) —
nunca da heurística de regex (`classificarMagia`), que existe só pra
decidir o ÍCONE da lista de magias, não pra rotear comportamento. Duas
fontes pra mesma decisão arriscam discordar e abrir o fluxo errado.

## Salvaguarda do Alvo — popup único (Fluxo Acerto/Erro estendido, 2026-09)

Extensão do padrão acima: até aqui `SalvaguardaDoAlvoModal` mostrava CD
+ Sucesso/Falha em texto e um botão manual de "Rolar Dano" — "atira e
esquece" (jogador dividia "metade do dano" por 2 na mesa sozinho).
Pedido do Osmar: aplicar o mesmo espírito do Fluxo Acerto/Erro (ver
"Fluxo Acerto/Erro sem 'renunciar' nada antes" abaixo) — rolar sozinho
e já mostrar o valor certo, sem 2ª interação manual.

**Layout final** (aprovado direto pelo Osmar depois de uma cena de
exploração em `/prototipo`, sem precisar de rodada formal de
protótipo): título → CD + atributo → divisor → **Falha** (texto, com o
valor rolado quando há dano) → divisor → **Sucesso** (idem) → aviso de
upcast (se houver) → botão de dano condicional extra (se houver, ex.
Badalar Fúnebre — continua manual, é um dano à PARTE sem relação com
Sucesso/Falha) → 1 único botão **Ok**. Fecha só pelo Ok — tirou o toque
fora e o "✕", pra não perder a leitura por engano (mesma ideia do
`confirmarAcerto`/`confirmarFechamento` do Fluxo Acerto/Erro: uma
decisão que precisa ser vista não fecha sozinha).

**Como o dado entra no texto:** quando a ação tem fórmula de dano, o
app já rola (`rolarDados` com `confirmarFechamento`, igual qualquer
outro encadeamento do Fluxo Acerto/Erro) ANTES do popup final abrir —
o botão "OK" do resultado do dado já leva direto pro popup preenchido,
nunca aparecem os 2 juntos. O texto de Falha/Sucesso nunca é
reescrito/parseado — o valor rolado é só PREFIXADO
(`"${total} — ${texto original}"`) pras 2 magias com texto vindo da
planilha (Falha sempre "Dano completo", nunca precisa saber o tipo);
pros 3 casos hardcoded (Ataque de Sopro, Lançar no Inferno, Golpe de
Escudo) o texto já é escrito pelo código, então é só reescrito limpo
com o número dentro, sem prefixo.

**Por que o Sucesso da magia genérica continua sem número:** só a
magia lida da planilha (`mecanica === 'salvaguarda'`) não sabe se
`salvaguardaSucesso` quer dizer metade/nenhum/cheio sem comparar por
TEXTO livre — trava contra a regra de ID estável (seção 13 do
`CLAUDE.md`), então esse bloco específico continua só com o texto da
planilha, sem valor calculado, até existir uma coluna/ID pra isso (ver
`PENDENCIAS.md` "Salvaguarda do Alvo"). Os 3 casos hardcoded não têm
esse problema — a semântica de cada um já mora no código.

**Padrão pra lembrar:** toda ação nova nesse formato (CD do jogador,
alvo que salva) que tenha fórmula de dano própria já rola sozinha ao
abrir e mostra Falha/Sucesso com o número certo — nunca mais um botão
manual de "Rolar Dano" dentro de `SalvaguardaDoAlvoModal`.

## Fluxo Acerto/Erro sem "renunciar" nada antes — Esmagador/Talhador/Ancestralidade Gigante

Diferente do Golpe Brutal (o 1º caso do Fluxo Acerto/Erro), Esmagador/
Talhador/Ancestralidade Gigante (Golias) não têm NADA pra renunciar
antes de atacar — o gatilho ("ao acertar", às vezes só "com o tipo de
dano certo") é automático. O "Atacar" normal (`rolarAtaque` em
`AcaoPanelContent.tsx`) decide o botão extra do popup de dano nesta
ordem de prioridade: Esmagador/Talhador (se a arma bater o tipo de
dano do talento E o personagem tiver E ainda não usado no turno) →
senão Ancestralidade Gigante (se a espécie/escolha bater E sobrar uso)
→ senão só "OK". Os 2 primeiros nunca coexistem por dano
(Contundente/Cortante são mutuamente exclusivos numa arma), mas
Ancestralidade Gigante TEORICAMENTE poderia coincidir com um deles
(Golias + Talento Geral) — como o popup só tem espaço pra 1 botão
extra, o talento (ligado à arma) ganha prioridade nesse caso raro.

**Ancestralidade Gigante só no ataque principal, decisão explícita do
Osmar:** antes, era um card avulso "toque ao acertar", usável depois
de QUALQUER ataque (Ataque Bônus, Cortar, magia, Reação). Migrar pra
dentro do popup de dano do ataque principal (pedido do Osmar: "junto
no popup de dano, igual Esmagador/Talhador") faz o mesmo talento SÓ
disparar por esse caminho agora — não tem botão equivalente pra Ataque
Bônus/Cortar/magia/Reação. Coerente com Esmagador/Talhador (que também
só existiram no ataque principal desde sempre), mas é uma restrição
REAL pra quem usa Ancestralidade Gigante depois de outro tipo de
ataque — ver `Backlog.md` "Ancestralidade Gigante só no ataque
principal".

**Peça nova: `AtivarEfeitoModal.tsx`** — pro popup final de talento com
1 efeito só (não é escolha entre vários, por isso não reaproveita
`EscolherEfeitoModal`) e 2 botões: "✅ Ativar" (aplica e marca o uso) e
"🚫 Não usar" (fecha sem marcar nada — o talento continua livre pro
PRÓXIMO ataque do MESMO turno, útil quando o alvo já morreu ou o
jogador quer guardar pra um ataque melhor). Suporta um texto de
restrição opcional (ex.: "Este efeito só pode ser usado uma vez por
turno."), mostrado após uma linha em branco dentro do próprio card.

**Escopo decidido com o Osmar (2026-09):** só a arma da Mão Principal
(mesmo corte do Golpe de Escudo); e o bônus de Crítico desses 2
talentos (Vantagem/Desvantagem CONTRA o alvo) ficou de fora — o app
não modela turno/alvo nesse nível pra automatizar isso, então fica só
no texto do talento (`beneficios`) pro jogador aplicar sozinho na
mesa, sem nenhum aviso automático. Validado antes em low-fidelity no
ambiente de Protótipos (`EsmagadorTalhadorCena.tsx`) — ver
`aprendizados/talentos/fase-4.md`.

**Padrão pra lembrar:** talento futuro que dispare automaticamente ao
ACERTAR (sem nada pra renunciar antes) segue este molde — desvio
condicional dentro da função de ataque já existente + `AtivarEfeitoModal`
pro popup final — nunca um toggle "antes de atacar" (isso é só pra
características que EXIGEM uma escolha prévia, tipo Golpe Brutal
renunciando Vantagem).

**Atualização 2026-09 — a premissa "nunca coexistem" quebrou (Raízes
Devastadoras, Bárbaro):** Esmagador/Talhador disparam por TIPO DE DANO
da arma; Raízes Devastadoras (Trilha da Árvore do Mundo, nível 10)
dispara por PROPRIEDADE da arma (Pesada/Versátil) — gatilhos
independentes, então uma arma como Clava Grande (Pesada + Contundente)
qualifica pros 2 ao mesmo tempo, e nada no livro proíbe usar os 2 no
mesmo acerto. Layout validado em baixa fidelidade no ambiente de
Protótipos (`EsmagadorRaizesCena.tsx`, 3 opções comparadas — ver
`aprendizados/` quando a entrega fechar): quando **mais de 1** efeito
condicional qualifica no mesmo acerto, o botão do popup de dano abre um
popup com **N cartões** (1 por efeito), cada um resolvendo
independente — só quando qualifica exatamente 1, o botão continua indo
direto pro modal daquele efeito (sem essa etapa a mais), mantendo o
comportamento de hoje intacto. Isso generaliza o `golpeCondicionalPendente`
de "no máximo 1 talento pendente" (`'esmagador' | 'talhador' | null`)
pra "0 ou mais efeitos pendentes ao mesmo tempo" — ainda não
implementado em produção no momento deste registro, só o layout foi
decidido.
