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

---

## Combat Layout C — overlays usam `position: fixed` na viewport, não no "frame" do wireframe

**Padrão:** qualquer painel/overlay deslizante (Ação/Bônus/Reação, bottom
sheet, Roll Overlay, etc.) usa `position: fixed` relativo à viewport real
do navegador — o wireframe original simulava um celular dentro de uma div
`#frame`; o app de verdade não tem esse frame, a tela real já é o
contêiner. Vale pra qualquer overlay novo daqui pra frente.

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

## Magia de ataque/salvaguarda — 2 modais, 1 única fonte de decisão de qual abrir

**Padrão:** os 2 pontos de acesso a magia no app (aba Magias, aba
Combat) sempre disparam a MESMA lógica — nunca comportamento divergente
entre lugares diferentes que fazem a mesma coisa.

- **Modal de Ataque** (magia tipo Raio Místico): rola 1d20 de ataque
  (igual arma), depois oferece "Rolar Dano" via `DanoPendente` — mesmo
  padrão de arma, não um popup próprio. O app nunca modela CA do
  inimigo — o jogador decide se acertou.
- **Modal de Salvaguarda** (`MagiaSalvaguardaModal.tsx`): quem rola é o
  ALVO, fora do app; o modal só mostra CD + atributo exigido + o que
  acontece no sucesso/falha (textos separados) + botão "Rolar Dano"
  sempre com dano cheio (jogador ajusta na mesa). Reaproveita
  `TrocarArmaMaestria.module.css`.

**Qual modal abrir vem de 1 campo estruturado só** (`ataqueOuSalvaguarda`,
ver DECISOES-DADOS.md) — nunca da heurística de regex (`classificarMagia`,
usada só pro ícone da lista). Duas fontes pra mesma decisão arriscam
discordar e abrir o modal errado.

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
${nome}` ``), então um label composto (`DanoPendente.label`) nunca bate
com `===` exato — comparação por nome dentro de um label precisa de
`.includes`/`.endsWith`.

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

## Dado 3D com física (não CSS) — `@3d-dice/dice-box`, Fase A formalizada

**Escolha:** `@3d-dice/dice-box` (BabylonJS + Ammo.js, física rodando em
Web Worker) — não `dice-box-threejs` (irmã da mesma família, menos
madura/mantida). Todos os 7 tipos (d4-d20, d100) vêm num único
`default.json` + texturas (~620 KB estáticos); o JS da lib (~660 KB) só
baixa via `import()` dinâmico no clique/warm-up, não entra no bundle
principal.

**Gotchas reais (documentar antes de qualquer integração de verdade):**
- A lib não publica tipos TypeScript — precisa de `.d.ts` próprio, só
  com o que for usado.
- O `<canvas>` que a lib cria não vem estilizado — sem
  `width:100%;height:100%` explícito no container, fica no tamanho
  padrão do navegador (300×150px, canto superior esquerdo), invisível,
  sem nenhum erro no console.
- Um container que uma lib externa MEDE pelo tamanho do elemento nunca
  pode ser escondido com `display:none` (zera o tamanho e a lib nunca
  mais desenha nada depois) — usar `visibility:hidden`/`opacity:0`, que
  preserva o tamanho real.
- Um componente que guarda a instância da lib em `useRef` não pode
  desmontar o container real do DOM entre usos (a instância fica presa
  a um canvas morto) — manter sempre montado, escondido via CSS.
- `box.roll()` lê tema/textura de forma SÍNCRONA — precisa `await
  box.loadTheme(id)` antes de rolar com um tema ainda não carregado
  nessa sessão (idempotente depois da 1ª vez).

**Confirmado (lendo `Dice.js` da lib):** a lib decide o resultado só
pela física (raycasting no dado já parado) — não existe API pra forçar
um resultado. Sem forma de gerar o número com `Math.random()`/nosso
motor e só "decorar" com a física depois — quando o dado 3D vira fonte
de verdade de uma rolagem real, a física da lib TEM que ser a origem
do número bruto (motor de vantagem/modificador/total continua nosso).
Mapeamento completo de cada mecânica atual (Vantagem pré/pós-rolagem,
reroll, grupos mistos, Modo de Teste) pro motor 3D: ver
`sdd/sdd-dado-3d.md`.

**Escopo — decisão de fases (Osmar, 2026-09):** o dado 3D vira os dois,
em fases. **Fase A** (feito): `Dice3dFab.tsx` formalizado como
ferramenta avulsa permanente da Ficha (não é mais protótipo/`[PH]`) —
todos os tipos de dado, modo Múltiplos, customização de textura/cor, e
um histórico de rolagens **compartilhado com o resto da Ficha**
(`RollContext.log`/`adicionarLog`): toda rolagem real do jogo
(`rolarD20`/`rolarDados`, logada em `fechar()` quando a rolagem está
`concluido`) E toda rolagem avulsa do FAB aparecem na MESMA lista —
`RollContext` é o único lugar que os dois mundos enxergam, já que o
resto da Ficha nem sabe que o dado 3D existe. O d20 avulso do FAB não
simula perícia mais (era sorteio aleatório só pra testar formato) e
não pede rótulo nem Normal/Vantagem/Desvantagem (2026-09, removido a
pedido do Osmar — o campo/botões só faziam sentido pensando na Fase B,
mas essa ferramenta avulsa não está ligada a nenhum teste específico
da ficha; rolar d20 aqui é igual a rolar qualquer outro dado, direto).
**Fase B** (em andamento, ver EmDev.md):
o motor 3D vira o padrão pra toda rolagem oficial do jogo (Combate/
Magias/Atributos), com preferência 3D/2D no menu do avatar — ver o
SDD pra mecânica completa.

**Fase B1 (feito) — preferência 3D/2D:** `RollContext` ganhou
`preferenciaDado3D`/`dado3DDisponivel`/`dado3DAtivo` (o último,
derivado, ainda sem nenhum consumidor — só existe pra B2 ler depois).
Persistência reaproveitou `useColapsavel` direto (é só um boolean com
`localStorage`, "expandido/colapsado" vira "3D ligado/desligado" sem
precisar de hook novo). Suporte a WebGL detectado 1x por sessão via
`<canvas>` descartável tentando `webgl2`/`webgl`/`experimental-webgl`
(`ui/utils/suportaWebGL.ts`) — padrão pra qualquer feature 3D futura
que precise da mesma checagem. `alternarModoTeste` força a preferência
pra `false` ao ligar (física real é incompatível com resultado fixo de
QA) — mutuamente exclusivos por design, nunca checar só um dos dois
isoladamente pra decidir o motor de rolagem, sempre usar `dado3DAtivo`
(já combina os 3 fatores).

**Fase B2 (feito) — d20 simples usa o motor 3D de verdade, com canvas
compartilhado:** o `@3d-dice/dice-box` só pode ter 1 instância/canvas
por vez (mesmo gotcha de sempre, ver "Dado 3D com física" acima) —
virou módulo próprio (`ui/roll/diceBox3d.ts`, `carregarDiceBox3D`/
`garantirTemaDiceBox3D`), não mais exclusivo do `Dice3dFab.tsx`.
`Dice3dFab` agora fica com o wrapper visível (`mostrarWrapper = aberto
|| estado?.motor3D`) tanto quando o jogador abre o FAB avulso quanto
quando uma rolagem OFICIAL (`RollOverlay`) está usando física —
qualquer entrega futura que precise do motor 3D reaproveita esse mesmo
módulo, nunca cria uma 2ª instância.

**Decisão de UI confirmada com o Osmar antes de codar (seção 6.4):**
o `RollOverlay` mostra o dado físico de verdade caindo (não mantém a
animação CSS enquanto rola escondido por trás) — o objetivo da Fase B
é o jogador SENTIR a física, esconder ela derrotaria o propósito. Fundo
do `RollOverlay` fica transparente quando `motor3D` (`.overlaySemFundo`)
pra não escurecer 2x em cima do fundo escuro que já vem do canvas
compartilhado.

**Escopo desta entrega — só d20 SIMPLES:** Vantagem/Desvantagem
PRÉ-declarada continua 2D mesmo com o motor 3D ligado (mecanismo
diferente da lib, `box.roll(['1d20','1d20'])` — entrega futura B3).
Escolher Vantagem/Desvantagem DEPOIS de ver o resultado
(`escolherVantagemPosRolagem`) também continua 2D pro 2º dado — o 1º
(físico) fica como está, o 2º aparece do jeito CSS de sempre ao lado
dele. `RollState.motor3D` marca a rolagem inteira (não cada dado
individualmente) — usado só pelo `RollOverlay` pra decidir se
desenha o `DadoVisual` CSS do 1º dado ou deixa o canvas físico mostrar
sozinho.

**Fase B3 (feito) — Vantagem/Desvantagem PRÉ-declarada também física:**
quando `vantagem` já vem definida na CHAMADA de `rolarD20` (ex.:
Desvantagem por armadura sem treinamento — diferente de escolhida
DEPOIS de ver o resultado), `dado3DAtivo` rola os 2 dados juntos
(`box.roll(['1d20','1d20'])`), não só 1. Precisou de um 2º campo,
`RollState.dado2Motor3D`, porque `motor3D` sozinho não bastava mais
pra decidir a UI: uma rolagem pode ter `motor3D: true` com o 2º dado
ainda 2D (post-roll `escolherVantagemPosRolagem`, que não mudou nesta
entrega) — só quando `dado2Motor3D` também é `true` é que o
`RollOverlay` esconde o `DadoVisual` CSS dos DOIS dados; caso
contrário, esconde só o 1º e desenha o 2º normal. `concluirPlano`/
`concluirVantagem` (dentro de `rolarD20`) são os 2 únicos pontos que
fecham uma rolagem 'd20' — usados pelos 4 caminhos (2D simples, 2D
Vantagem, 3D simples, 3D Vantagem) evitando duplicar a lógica de
total/crítico entre eles.

**Fase B4 (feito) — 2º dado pós-resultado e reroll físicos:**
`@3d-dice/dice-box` não publica `.d.ts` — os tipos de `add()`/
`reroll()` em `types/dice-box.d.ts` foram lidos direto do bundle
minificado da lib (`node_modules/@3d-dice/dice-box/dist/
dice-box.es.js`), já que a doc pública não cobre esses 2 métodos.
`DiceBoxResultado` ganhou `[key: string]: unknown` de propósito — o
objeto que a lib devolve em `onRollComplete` tem campos internos
minificados (`rollId`/`groupId`/etc.) que o app nunca precisa NOMEAR,
só guardar inteiro (`RollState.resultadoBrutoD20`) e repassar de volta
pra `reroll()` — casar contra o formato exato desses campos seria
frágil (a lib pode mudá-los numa atualização) e desnecessário.

- **`escolherVantagemPosRolagem`** (Vantagem/Desvantagem escolhida SÓ
  depois de ver o resultado): usa `box.add('1d20')` — diferente de
  `.roll()`, não limpa o dado que já está parado na cena, então o 2º
  cai do lado do 1º.
- **`usarSorte`/`usarInspiracaoHeroica`**: usam `box.reroll(resultadoBruto,
  {remove: true})` pra rerolar FISICAMENTE só aquele dado específico,
  removendo o antigo da cena.
- **Fora de escopo, registrado no Backlog quando for a vez:** reroll de
  DANO (Perfurador) continua 2D — `rolarDados` em si ainda não usa o
  motor 3D pra nenhum tipo de dado (só d20 até aqui), então não tem
  resultado físico pra rerolar ainda.

**Redesenho do FAB avulso (Fase A) — coluna de botões, sem overlay
escuro, cor fixa por tipo de dado:** o `Dice3dFab.tsx` (ferramenta
avulsa) trocou o overlay preto cobrindo a tela toda por uma coluna de
botões que expande do próprio FAB pra cima, alinhada à direita
(`flex-direction: column-reverse` + `align-items: flex-end`), ordem
fixa de baixo (perto do FAB) pra cima: Múltiplos → d4 → d6 → d8 → d10 →
d12 → d20 → d100 → Histórico. Clicar fora do conjunto (FAB + coluna +
popup de log) colapsa tudo — um `pointerdown` no `document` que ignora
cliques dentro de um wrapper `ref` que embrulha os três. **Padrão
reaproveitável:** "botão flutuante que expande uma coluna de ações
alinhada a ele, sem overlay, fecha ao clicar fora" — usar esse mesmo
esqueleto pra qualquer FAB futuro com múltiplas ações, em vez de abrir
um overlay/bottom sheet cheio pra poucas opções.

Customização de tema/cor foi REMOVIDA (o Osmar decidiu fixar em vez de
deixar escolher) — tema sempre "default", e cada TIPO de dado tem cor
FIXA própria (`CORES_POR_TIPO`: d4 azul, d6 cian, d8 verde, d10
amarelo, d12 laranja, d20 vermelho, d100 roxo). Pra colorir por tipo
numa MESMA rolagem (ex.: Múltiplos com d6+d20 juntos, cada um com sua
cor), a notação passada pra `box.roll()`/`box.add()` virou array de
objetos `{ qty, sides, themeColor }` em vez de string — confirmado
lendo o bundle minificado que o campo por-grupo (`grupo.themeColor`)
tem prioridade sobre o do nível da rolagem inteira; `d100` precisa de
`sides: "100"` (string, não número) pro caso especial de dado de face
única da lib. `dice-box.d.ts` ganhou `DiceBoxGrupoNotacao`/
`DiceBoxNotacao` pra cobrir essa forma alternativa.

O canvas físico continua cobrindo a tela inteira (precisa do espaço
pra física cair), mas agora com `pointer-events: none` e SEM fundo —
o dado cai visível por cima do conteúdo normal da Ficha, não mais
sobre um fundo escurecido. Resultado/erro/carregando viraram uma
pílula flutuante fixa no topo da tela, independente de onde a coluna de
botões está. Histórico é a única exceção ao "fecha só clicando fora":
abre como popup central com botão de fechar (✕) explícito, pedido à
parte do Osmar.

Ajuste de cor no caminho: os pills começaram brancos, mas o Osmar achou
estranho contra o resto da tela — viraram `var(--accent)` (mesmo tom do
🎲). **Padrão pra qualquer botão flutuante que "perde a função" quando
seu próprio menu está aberto** (aqui, o 🎲 só fecha nesse momento, não
rola nada): dar um estado visual "afundado"/selecionado nele mesmo, não
só mudar a cor dos itens do menu — aqui virou `.fabAberto` (tom mais
escuro da mesma família, `#1e2a6e`, + `box-shadow: inset` em vez de por
fora, simulando "pressionado").

**Data/origem:** 2026-09, pedido do Osmar.

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
