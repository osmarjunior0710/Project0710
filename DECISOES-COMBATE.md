# DECISOES-COMBATE.md

> Decisões de design sobre a **aba Combat** — Layout C, economia
> de ação/ação bônus/reação, espaços de magia em combate, PV,
> iniciativa, upcast na ação "Usar Magia". Parte da família
> `DECISOES-*.md` — ver o índice em `DECISOES-DESIGN.md` pra
> saber em qual arquivo procurar cada assunto, e a seção 7 do
> `CLAUDE.md` pra regra de quando registrar uma entrada aqui — e pro
> critério de "isso é padrão reaproveitável ou changelog de entrega"
> que mantém este arquivo pequeno.

---

## Combat Layout C — painéis com `position: fixed` na viewport (não relativos ao frame)

**Decisão:** os painéis deslizantes de Ação/Ação Bônus/Reação (Layout C,
já escolhido antes — ver entrada "Combate — economia de ação" abaixo)
usam `position: fixed` relativo à viewport do navegador, igual às pills
do wizard, em vez de `position: absolute` relativo a um elemento "frame"
como no wireframe HTML original (que simulava um celular dentro da
página). Como o app de verdade não tem esse frame — a tela real do
celular já é o contêiner — `fixed` é o equivalente correto.

**Contexto:** decisão técnica quase óbvia (o wireframe tinha uma div
`#frame` simulando um celular; o app de verdade não tem isso), mas
registro aqui porque estabelece um padrão: **qualquer overlay/painel
futuro** (bottom sheet, modais, o Roll Overlay que chega na 0.7) deve
seguir esse mesmo padrão de `fixed` na viewport, não tentar reproduzir
posicionamento relativo ao "frame" do wireframe.

**Data/origem:** 2026-08, entrega 0.6.

## Combate — economia de ação (Layout C)

**Decisão:** interação de combate usa 3 botões fixos (Ação / Ação Bônus /
Reação), cada um abrindo um painel deslizante do seu lado correspondente
na tela: Ação desliza da esquerda, Ação Bônus da direita, Reação sobe de
baixo. Dentro do painel de Ação, "Usar Magia" é um acordeão que expande
inline (não navega pra outra tela).

**Contexto:** o app precisa ser jogável em tempo real durante uma sessão
de mesa, sem atrapalhar o ritmo do jogo.

**Alternativas descartadas:**
- **Radial/pizza menu** com as 12 ações do Cap. 1 espalhadas em círculo
  ao redor de um botão central "Ação", com interação de arrastar até
  "grudar" na opção mais próxima. Implementado e testado — ficou
  visualmente poluído em tela de celular (itens pequenos demais, difícil
  de mirar com o dedo). Padrão que funciona melhor em telas grandes
  (desktop) com mais espaço. **Não repetir esse padrão em mobile.**
- **Botão único "Ação" abrindo lista vertical simples empilhada** — menos
  ruim que o radial, mas ainda misturava os 3 tipos de recurso (Ação,
  Ação Bônus, Reação) numa lista só, dificultando ver rapidamente qual
  recurso já foi gasto no turno.

## Combate — estado Ativo vs Usada

**Decisão:** cada um dos 3 botões (Ação/Bônus/Reação) tem 2 estados
visuais: "ativo" (colorido, clicável) e "usada" (cinza, bloqueado,
`pointer-events:none`). Um botão "↻ Fim do Turno" restaura os 3 de uma vez.

**Contexto:** na prática de mesa, um jogador comum tem só 1 Ação, 1 Ação
Bônus (se tiver) e 1 Reação por turno — o app deveria refletir isso
visualmente pra evitar o jogador (ou o app) perder a conta do que já foi
usado.

**Caso conhecido e propositalmente adiado:** classes/situações que
concedem mais de 1 do mesmo recurso por turno (ex: Monge com Rajada de
Golpes, multiclasse) não são cobertas por este modelo simples de
booleano. Tratamento específico fica pra quando isso for implementado de
verdade — não travar o MVP por causa disso.

## Combate — espaços de magia

**Decisão:** contador visual de pips (preenchido/gasto) por círculo de
magia, dentro do acordeão "Usar Magia". Truques (círculo 0) não consomem
espaço; magias de círculo 1+ consomem, e bloqueiam nova conjuração quando
zerado.

**Aprendizado de regra importante:** Bruxo (Warlock) usa Magia de Pacto,
que recupera em **Descanso Curto** — diferente da maioria dos
conjuradores, que só recuperam em Descanso Longo. Isso já foi
implementado corretamente no protótipo. **Ao portar pra dado real, cada
classe conjuradora precisa declarar sua própria regra de recuperação de
espaço** — não assumir que todas recuperam só no Descanso Longo.

## Nomenclatura da 4ª aba: "Combat", não "Play"

**Decisão:** a aba de ações de turno se chama "Combat" (com ícone de
espadas cruzadas), não "Play" como no rascunho inicial.

**Contexto:** "Play" era genérico demais e não deixava claro o propósito
específico da aba (ações de combate em tempo real).

## Combate — Reação vira botão baixo/compacto, não mais mesmo tamanho de Ação/Bônus

Ajuste pedido pelo Osmar sobre o Layout C: Ação e Ação Bônus continuam
lado a lado, tamanho grande (76px, ícone empilhado). Reação virou uma
barra horizontal baixa (`--touch-target-min`, ícone+nome+estado numa
linha só) embaixo das outras duas — usada com bem menos frequência
numa sessão normal de mesa, não precisa do mesmo destaque visual.
Comportamento (estado ativo/usada, painel deslizante de baixo) não
mudou, só o tamanho/formato do botão-gatilho.

**Cogitado e descartado nessa conversa:** adicionar uma 4ª categoria
"Grátis" (ações que não gastam nenhum dos 3 recursos — trocar de arma
equipada, etc.), numa grade 2×2. Osmar decidiu não seguir por ora —
prefere manter só as 3 categorias já existentes, com a Reação só
menor. Se "ações grátis" virar necessidade real de novo, reabrir como
proposta nova (a planilha precisaria mapear quais ações realmente são
grátis — não é regra pra inventar de memória).

**Data/origem:** 2026-08.

## Combat — 3 ajustes rápidos (cor de remoção, título do painel, switch Detalhes)

Pedidos do Osmar testando o Level Up e o Combat:

1. **Marcação "será removido" (Level Up de Truques) vira vermelha, não
   amarela.** Regra de cor confirmada: amarelo/`--warn` fica reservado
   pra aviso/criticidade (ex.: "só pode trocar 1 truque"); qualquer
   ação de remover/apagar usa vermelho/`--danger` — mesmo padrão já
   usado no botão de apagar personagem (`CharacterList.tsx`).
2. **Título dos painéis de Combat perde o "— escolha uma"** — "⚔
   Ação", "⚡ Bônus", "🛡 Reação", sem sufixo.
3. **Switch "Detalhes" novo**, entre o título e a lista de cada painel
   (Ação/Bônus/Reação) — liga/desliga o texto explicativo de cada
   linha (`rowDesc`). Ligado por padrão (comportamento de sempre).
   Desligado, o texto some, **exceto** a informação essencial de
   arma/Ataque Desarmado (dado de dano, tipo, mãos, alcance/munição —
   ex.: "1d8 Perfurante · Duas Mãos, Munição..."), que o Osmar pediu
   pra manter sempre visível porque o jogador precisa saber isso na
   hora de atacar. Implementado separando, nas linhas de ataque
   (arma e mão secundária), o texto essencial (`ataqueAtual.descricao`/
   `ataqueBonus.descricao` — já vem assim de `core/ataque.ts`, sem
   floreio) da frase explicativa extra (regra de Ataque Extra/Leve
   nas duas mãos/etc.), que aí sim é escondida com o switch.
   `SidePanel.tsx` ganhou o switch (reaproveitando o mesmo padrão
   visual do menu de preferências do avatar); estado vive em
   `CombatTab.tsx` (sessão, não persiste — mesmo padrão de
   `itensDetalhados`/`pesoAtivo` da Mochila).

**Testado:** Playwright 390×844 — painel de Ação do Guerreiro, switch
ligado mostra tudo, desligado esconde todo texto exceto "Soco, chute
ou golpe corpo a corpo sem arma. Dano Contundente." no Ataque
Desarmado; título confirmado sem "escolha uma".

**Data/origem:** 2026-08.

## Combat "Usar Magia" (Ação) — fluxo de 2 telas com upcast real (Fase A)

**Problema:** o acordeão único de "Usar Magia" empilhava Truques +
Magias Preparadas numa lista só, sem parar — algumas classes chegam a
20+ magias preparadas em níveis altos. O Osmar pediu um fluxo em
telas, e aproveitou pra fechar o upcast de verdade (que nunca existiu
— `gastarSlotCirculo` só aceitava o círculo exato da magia).

**Regra de upcast confirmada com o Osmar (regra real do livro):** uma
magia NUNCA cabe num Espaço de Magia de círculo MENOR que o dela, mas
cabe no dela ou em qualquer um MAIOR, contanto que sobre espaço —
mesmo até círculo 9 (classes full-caster). `core/magiasPersonagem.ts`
ganhou `circulosDisponiveisParaConjurar(magiaCirculo, espacos,
espacosGastosPorCirculo)`, genérica pra qualquer classe/círculo, sem
hardcode.

**Fluxo em 2 telas cheias (mesmo padrão `.screen`/`.header`/`.body`/
`.navLayer` de `LevelUpShell.module.css`, reaproveitado — nenhum CSS
novo pro esqueleto):**
- **Tela 2** (`SelecionarMagiaShell.tsx`): Truques + Magias Preparadas
  agrupados por círculo (`GrupoMagiaColapsavel`, mesmo componente do
  Level Up — do círculo mais alto pro mais baixo, Truques sempre
  disponíveis). Magia de círculo N fica esmaecida/sem clique só quando
  NENHUM espaço ≥ N sobra.
- **Tela 3** (`EscolherCirculoShell.tsx`): só aparece quando a magia
  tem mais de 1 círculo disponível pra upar — mostra o card da magia
  (com o texto que já tem "Upcast: +Xd8 por círculo" pras ~131 magias
  que escalam) e uma opção por círculo com os espaços disponíveis.
  Com só 1 círculo possível, pula direto pra conjurar (não faz
  sentido perguntar sem escolha real).

**Decisão consciente de escopo — Fase A vs B:** por enquanto a Tela 3
mostra só o TEXTO da magia (já suficiente, o jogador lê e calcula),
não um número calculado por círculo escolhido. **Fase B concluída
depois** (foco "Auditoria de Magias", ver DECISOES-DADOS.md "Magias —
motor de dano completo") — `core/magiaDano.ts` hoje calcula o dado
certo (Dano Base + Upcast + Escala de Truque) e já é usado pra rodar o
dano de verdade depois de conjurar. A ÚNICA coisa que ainda não existe
é mostrar esse número PRÉVIO em cada opção de círculo da própria Tela
3 (antes de escolher) — trivial de fazer agora que o motor existe, só
não foi pedido ainda (ver Backlog.md).

**Também decidido não fazer agora:** o "empilhar telas com offset
lateral" que o Osmar sugeriu como visual fica pra quando ele decidir
como quer deixar isso "interessante" — a Fase A entregou o
comportamento (telas cheias sequenciais, mesmo padrão já usado em
Level Up), não o polish visual do empilhamento.

**Só o painel de Ação ganhou o picker novo** — Reação continua com a
lista simples antiga (registrado em PENDENCIAS.md; normalmente tem
poucas magias qualificadas, o problema de lista infinita não bate tão
forte lá).

**Testado:** Playwright 390×844 — Bardo nível 5 (1º: 4 espaços, 2º: 3,
3º: 2), 1º círculo esgotado manualmente. Tela 2 mostrou "Curar
Ferimentos" (1º círculo) ainda clicável; Tela 3 ofereceu só 2º e 3º
círculo (1º corretamente ausente); escolhido 2º círculo, confirmado
que gastou um espaço de 2º (não de 1º, que já estava zerado) —
`espacosGastosPorCirculo` final `{"1":4,"2":1}`. Testado também o
caminho de 1 círculo só (Bardo nível 1): clicar na magia conjura
direto, sem passar pela Tela 3.

**Data/origem:** 2026-08.

## Magia de ataque/salvaguarda — 2 modais, mesmos 2 pontos de acesso (Magias + Combat)

**Pedido do Osmar:** os 2 pontos onde o jogador já usa magia (aba
Magias — direto da lista; aba Combat — Ação/Ação Bônus/Reação)
precisam dos mesmos 2 modais novos, disparados pela mesma lógica —
nunca comportamento diferente entre os 2 lugares.

- **Modal de Ataque** (magia tipo Raio Místico) — rola 1d20 de ataque
  à distância/corpo a corpo (igual arma), depois oferece "🎲 Rolar
  Dano" — reaproveita 100% o padrão `DanoPendente` que arma já usava
  (banner + botão, não um popup próprio). O app nunca modela CA do
  inimigo (igual arma, sempre foi assim) — o jogador decide na mesa se
  acertou.
- **Modal de Salvaguarda** (novo componente, `MagiaSalvaguardaModal.tsx`)
  — quem rola a salvaguarda é o ALVO, fora do app; o modal só mostra
  CD + atributo exigido + o que acontece no sucesso/falha (textos
  SEPARADOS, um por resultado — sucesso pode ser dano nenhum, metade,
  ou completo dependendo da magia) + botão "Rolar Dano" sempre com
  dano cheio (jogador ajusta na mesa se soube que o alvo passou —
  mesma filosofia do Ataque de Sopro/Lançar no Inferno, nunca tenta
  rastrear sucesso/falha sozinho). Popup pequeno sem estado próprio,
  reaproveita `TrocarArmaMaestria.module.css` (mesmo molde visual de
  `AtaqueDeSoproModal`).

**Qual modal abrir é decidido por UMA fonte só:** o campo estruturado
`ataqueOuSalvaguarda` (ver DECISOES-DADOS.md), nunca a heurística de
regex de `classificarMagia` (usada só pro ícone ⚔️ da lista) — usar 2
fontes pra essa decisão arriscaria elas discordarem e abrir o modal
errado. Efeito colateral bom: truque de salvaguarda sem ataque (ex.
Badalar Fúnebre) que antes ficava com "Usar" travado (nenhuma jogada
automatizável existia) agora sempre tem uma ação válida.

**Data/origem:** 2026-09.

## Tela 3 do upcast sempre aparece, mesmo com 1 círculo só disponível

**Pedido do Osmar:** mesmo quando a magia só tem 1 círculo possível
pra gastar (ex: Bardo com uma única magia de 2º círculo — não tem
"escolha" real), a Tela 3 (`EscolherCirculoShell`) continua aparecendo
antes de conjurar, em vez de pular direto — importante o jogador ver
qual espaço tá sendo gasto, mesmo sem opção. Removido o atalho que
existia em `AcaoPanelContent.tsx` (`if (circulosDisponiveis.length ===
1) conjurarMagia(...)`).

**Testado:** Playwright 390×844 — aba Magias com 1º círculo 3/4 (3
azuis + 1 cinza no fim), 2º círculo 1/3 (1 azul + 2 cinzas no fim), 3º
círculo 2/2 (ambos azuis) — confirma esvaziamento pela direita em
todos os tamanhos. Tela 3 do upcast confirmada mostrando os ticks por
círculo em vez de texto, e aparecendo mesmo com só 1 círculo
disponível.

**Data/origem:** 2026-08.

## Combat — botões de Iniciativa e Fim do Turno no topo da aba

**O que é:** pedido do Osmar — 2 botões novos no topo da aba Combat
(acima de Pontos de Vida), no mesmo estilo visual dos botões
Ação/Ação Bônus.

- **Iniciativa** (esquerda): 1º toque rola 1d20 + mod. de Iniciativa
  (reaproveita o `rolarD20` do `RollContext`, mesmo padrão de todo
  resto do app) e mostra o resultado direto no botão + "(Aperte
  novamente para terminar o combate)". 2º toque limpa o valor, volta
  ao estado inicial ("🎲 Iniciativa"). Também dispara a recuperação de
  Inspiração de Bardo do "Inspiração Superior" (nv18), igual o mesmo
  gatilho já existente na aba Atributos — rolar Iniciativa é rolar
  Iniciativa, não importa qual botão da tela disparou.
- **Fim do Turno** (direita): mesmo comportamento de sempre (reseta
  Ação/Ação Bônus/Reação pro estado "ativo") — só mudou de lugar (era
  uma faixa tracejada mais abaixo na tela). Não mexe no valor de
  Iniciativa — ele é "por combate", não "por turno", só o 2º toque no
  próprio botão de Iniciativa encerra.

Testado via Playwright (390px): rolar Iniciativa mostra o valor no
botão E no overlay de rolagem: 2º toque limpa; Fim do Turno com
Iniciativa ativa preserva o valor.

**Data/origem:** 2026-08.

## Combat — Pontos de Vida vira indicador "wavy" (M3 Expressive)

**O que é:** pedido do Osmar — redesenhar o bloco de PV da aba Combat:
1. Removido o texto de aviso de protótipo.
2. A barra de PV virou um indicador linear "wavy" (componente M3
   Expressive) — novo componente `WavyProgressBar.tsx`
   (`ui/components/`), SVG com `preserveAspectRatio="none"` (estica
   pra largura real do container sem precisar medir em JS). Cor muda
   por severidade: >50% verde (`--good`), 25-50% âmbar (`--warn`),
   ≤25% vermelho (`--danger`) — trecho não preenchido fica em
   `--line` (neutro).
3. Os botões +/- saíram de dentro do card de PV e viraram uma linha de
   5 botões abaixo: −5 · −1 · Manual `[PH]` · +1 · +5. "Manual" ainda
   não faz nada (marcado `[PH]` por enquanto, CLAUDE.md seção 12) — é
   pra quando tiver um campo de digitar quantidade exata.

Nenhuma mudança em `core/` — `onAlterarPv(delta)` já aceitava
qualquer delta, só passou a ser chamado com -5/+5 também.

Testado via Playwright em 390px, com PV cheio (barra toda verde), PV
baixo em ~36% (mostra âmbar) e PV zerado (barra toda neutra, sem
trecho colorido).

**Data/origem:** 2026-08.

## Combat — ajuste de padding + barra de PV volta a ser reta

**O que é:** 2 ajustes rápidos pedidos pelo Osmar, em cima da entrega
anterior:
1. `WavyProgressBar.tsx` renomeado pra `LinearProgressBar.tsx` e
   simplificado — tirada a onda (senoide), volta a ser uma linha reta
   colorida por severidade. A variante "wavy" do M3 Expressive não
   ficou legível o suficiente no tamanho de tela do app; decisão:
   ficar só com o indicador linear reto (ainda M3, só não a variante
   "wavy").
2. Padding reduzido nos botões da aba Combat: `.splitBtn` (Ação/Ação
   Bônus/Iniciativa/Fim do Turno) de `min-height: 76px` + padding
   grande pra `58px` + padding menor; `.splitBtnSmall` (Reação) com
   padding vertical reduzido. O texto "(Aperte novamente...)" do botão
   de Iniciativa ganhou uma classe própria (`.sbHint`, 9px) separada
   do `.sbState` genérico (10px, maiúsculo) — é só um lembrete, não
   precisa do mesmo peso visual do "ATIVO/USADA".

**Data/origem:** 2026-08.

## Modo de Teste — sequência fixa de d20, sem afetar dano nem persistir (2026-09)

**Decisão:** o RNG de verdade (`Math.random()` em `RollContext.tsx`)
já era genuinamente aleatório — auditado, sem bug encontrado. O pedido
do Osmar era outra coisa: um jeito de FORÇAR resultados previsíveis de
d20 pra testar os 4 estados visuais que mais importam (1 = falha
crítica, 20 = sucesso crítico, 10/15 = meio-termo) sem depender de
sorte durante teste manual.

**Mecanismo:** `RollContext` ganhou `modoTeste`/`alternarModoTeste`,
toggle no `AvatarMenu` (canto superior direito da Ficha). Ligado, todo
d20 sai da sequência fixa `[1, 10, 15, 20]` em ordem, dando a volta no
fim — `rolarD20Dado` vira função pura parametrizada por 2 refs
(`modoTeste`/`indice`, não state, porque é chamada de dentro de
callbacks memoizados com `[]` de dependência). Quando 2 d20 saem
juntos (Vantagem/Desvantagem), cada um consome o PRÓXIMO da fila —
nunca reseta entre eles — então "1, 10" sai sozinho sem lógica
adicional, só por chamar a mesma função 2x em sequência.

**Escopo deliberadamente restrito a d20:** dano e qualquer outro dado
(`rolarDados`, Bônus Extra tipo Sorte do Tenebroso) continuam de
verdade mesmo com o modo ligado — o objetivo é testar acerto/crítico,
não dano.

**Nunca persiste** (sempre nasce desligado a cada carregamento de
página) e mostra um badge vermelho no avatar quando ativo — pra nunca
"esquecer ligado" no meio de uma sessão de jogo de verdade sem
perceber.

## Reroll de "saiu 1" — motor genérico pra dado avulso (não-d20)

**Problema:** vários talentos/características têm a mesma regra —
"se esse dado de dano/cura sair 1, pode jogar de novo e usar o novo
resultado, só 1x" (Dano Garantido do Valentão de Taverna, Cura
Garantida do Curandeiro) — mas o `RollContext` só sabia fazer isso pra
d20 (`usarSorte`, Sorte do Pequenino). `rolarDados` (tipo `'dados'`)
nem guardava o valor de cada dado — só a soma total, mostrando sempre
"💥" decorativo.

**Mecanismo:** quando `rolarDados` é chamado com `quantidade === 1`,
`RollState.valorDado` agora guarda o número de verdade (não "💥") e
aceita `rerollSe1: { rotulo }` — se o resultado sair 1, o
`RollOverlay` mostra um botão "🎲 {rotulo} — jogar de novo"
(`usarRerollSe1` no contexto), mesmo padrão visual do botão de Sorte.
Continua só com 1 dado só de propósito (não precisa saber "qual dado
saiu 1" com mais de um) — mas o grid de `dadosIndividuais` (ver
entrada abaixo, "Grid de dados individuais") resolveu a limitação
geral de "só a soma, sem saber cada dado" pra quem precisar, então
esse não é mais um teto técnico, só a escolha certa pra ESSE caso
específico (reroll condicionado ao valor sair exatamente 1).

**Como plugar num talento novo:** no `rolarDados({...})` da ação,
passar `rerollSe1: { rotulo: 'Nome do Benefício' }` só quando o
personagem tiver o talento — resto é automático. Primeiro uso:
Valentão de Taverna (Ataque Desarmado, `CombatTab.rolarDanoPendente`,
gate por `efeitoMecanicoDoTalento(talentosEfetivos,
'dado-ataque-desarmado')`, mesma característica que já controla o
dado 1d4). Curandeiro (Cura Garantida) fica só com o motor pronto —
falta a ação de cura em si existir (ver Backlog.md, curar OUTRO
personagem ainda não é modelado).

**Achado no caminho:** o `nome` passado pra `rolarAtaque` já vem com
emoji (`` `🗡 ${ataqueAtual.nome}` ``), então `DanoPendente.label` fica
`"Dano — 🗡 Ataque Desarmado"`, não `"Dano — Ataque Desarmado"`.
Comparação exata (`===`) falha silenciosamente aqui — use
`.endsWith(...)` ou `.includes(...)` pra detectar o nome do ataque
dentro do label sempre que precisar comparar por nome de novo.

## Grid de dados individuais — rolagem de 2+ dados mostra cada um, não só a soma (2026-09)

**Motivo:** pedido do Osmar pra "aprofundar a rolagem de dados" —
rolagem de dano com 2+ dados só mostrava "💥" decorativo + a soma; sem
saber o valor de CADA dado, não dá pra implementar nada que dependa de
1 dado específico (reroll à escolha, futuras regras "maior/menor
dado", etc.). Também pedido: suportar MISTURA de tipos na mesma
rolagem (ex.: 1d20 + 1d4 + 1d6) e deixar definidos os 7 tipos de dado
do jogo (d4/d6/d8/d10/d12/d20/d100 — d100 aqui é 1 rolagem direta de
1-100, a mesa usa 2xd10 físicos, o app não precisa).

**Mecanismo:** `RollState.dadosIndividuais?: DadoIndividual[]`
(`{ id, lados, valor }`) — só existe quando a rolagem `'dados'` tem 2+
dados no TOTAL (`quantidade` do grupo principal + soma dos
`gruposExtras`, ver `RollDadosOptions.gruposExtras` pra misturar
tipos). Rolagem de 1 dado só **não** ganha esse campo — continua
exatamente como antes (`.diceRow` de sempre), decisão explícita do
Osmar pra não mudar a aparência do que já funciona. `RollOverlay.tsx`
escolhe o layout pelo campo: `dadosIndividuais` presente → grid
(`.diceGrid`, CSS `grid-template-columns: repeat(4, 1fr)` — SEMPRE 4
colunas, quebra linha sozinha via `grid-auto-flow` do CSS, sem lógica
de quebra manual); ausente → `.diceRow` de sempre.

**Arte por tipo de dado:** 1 classe CSS por `lados`
(`.dieTipo4`...`.dieTipo100`), todas com o MESMO visual por enquanto
(`CLASSE_POR_LADOS` em `RollOverlay.tsx`) — só existem separadas já
prontas pra receber 1 `background-image` própria por tipo quando o
Osmar desenhar a arte, sem precisar mexer na estrutura de novo.

**Reroll de 1 dado À ESCOLHA (Perfurador)** — generaliza o
`rerollSe1` acima pra "reroll de qualquer dado, independente do
valor": `RollState.rerollEscolhido`/`rerollEscolhidoUsado` +
`rerollDadoEscolhido(id?)` no contexto. Com grid (2+ dados), o
jogador TOCA no dado que quer rerolar (`id` do `DadoIndividual`); com
1 dado só, reaproveita o MESMO botão do `rerollSe1` (sem exigir que o
valor seja 1) — Perfurador funciona nos 2 casos, já que a maioria das
armas de nível baixo rola 1 dado só. `core/rerollDanoTalento.ts`
(`temPerfurador`) + `AtaqueInfo.danoTipo` (já existia, só não
chegava até o dado de dano) propagado através de `DanoPendente.tipoDano`
até `CombatTab.rolarDanoPendente`, que só passa `rerollEscolhido`
quando o dano é Perfurante.

**Fora do escopo, registrado em Backlog.md:** "+1 dado extra no
crítico" do Perfurador — depende de dano em crítico geral (dobrar os
dados), que o app ainda não modela pra ataque nenhum.

## Magia/característica com múltiplos ataques discretos (feixes,
## rajadas) — simplificada pra 1 ataque + N dados de dano

**Problema:** algumas magias (Raio Místico) e, no futuro, talentos
como Ataque Extra de arma já concedem N jogadas de ataque separadas
por turno (RAW: cada feixe/ataque rola seu próprio d20, acerta ou erra
independente). O app nunca modela a CA do inimigo (o jogador decide
"acertei" sozinho, na mesa) — simular N ataques independentes exigiria
rastrear resultado individual de cada um, sem ganho real pro jogador.

**Decisão:** sempre que uma característica conceder múltiplos ataques
que RAW seriam jogadas separadas, mas o app já trata "acertar" como
decisão do jogador (não calculada), simplificar pra **1 rolagem de
ataque única + N dados de dano somados numa rolagem só** — não simular
N jogadas de ataque independentes. Reaproveita 100% o mecanismo que já
existe pra "N cópias do mesmo dado de dano" (Aprimoramento de Truque,
Upcast "dado-por-círculo") em vez de criar um sistema de "múltiplos
ataques" novo. Primeiro caso: Raio Místico (Bruxo) — RAW cria 2/3/4
feixes com jogada de ataque separada cada nos níveis 5/11/17;
`magias.ts` marca `escalaTruqueTipo: "dado"` (mesmo campo do
Aprimoramento de Truque comum) em vez de um campo próprio, porque o
resultado numérico é idêntico (base 1d10 + 1 dado por patamar = 2/3/4
dados, mesma coisa que "N feixes de 1d10"). Ver `core/magiaDano.ts`
`calcularDanoMagia`.

**Ao encontrar um caso novo parecido** (outra magia com "feixes"/
"raios"/"ataques separados", ou um talento de arma com Ataque Extra
que precise de tratamento especial): primeiro confira se o valor final
bate com "dado base + 1 dado por [o que quer que escale]" — se bater,
reaproveita `escalaTruqueTipo`/Upcast, sem mecanismo novo. Só crie
estrutura nova se o valor não seguir essa fórmula simples (ex.: dados
de tamanhos diferentes por ataque, ou nº de ataques que não cresce em
degraus fixos).

## Penalidade de proficiência de Armadura/Escudo/Arma — 3 regras independentes, sinal único calculado 1x

Regra real (Cap. 6): armadura, escudo e arma têm penalidades
DIFERENTES por falta de proficiência, nunca a mesma regra reaproveitada
— arma só perde o Bônus de Proficiência no ataque (`core/
proficienciaArma.ts`, já existia); escudo só não soma o bônus de CA
(`core/calculoPersonagem.ts`, `calcularCAEquipado`); armadura (Leve/
Média/Pesada) dá Desvantagem em QUALQUER D20 de Força/Destreza +
bloqueia conjuração inteira, enquanto estiver vestida.

**Padrão usado pra "Desvantagem em toda rolagem de X":** calcular o
sinal booleano UMA VEZ em `FichaShell.tsx`
(`armaduraSemTreinamentoEquipada`, `core/proficienciaArmadura.ts`) e
passar como prop simples (`desvantagemForcaDestreza`) pra cada tela
que faz uma rolagem afetada — nunca recalcular o sinal dentro de cada
componente. Em cada chamada de `rolarD20`, o sinal vira `vantagem:
'desvantagem'` só quando a rolagem ainda não tem Vantagem/Desvantagem
decidida por outro motivo — nunca sobrescreve uma escolha explícita.
Pontos que hoje leem o sinal: `AtributosTab` (atributo FOR/DES,
perícias de FOR/DES, Iniciativa), `CombatTab` (Iniciativa do painel,
ataque de Mão Secundária), `AcaoPanelContent` (ataque principal).
Ataques com magia (`modAcertoConjuracao`) NÃO usam esse sinal — usam o
atributo de conjuração, nunca Força/Destreza.

**Bloqueio de conjuração:** trava em 3 pontos — `conjurarMagia` em
`AcaoPanelContent.tsx` (Ação) e em `ReacaoPanelContent.tsx` (Reação),
mais reforço em `MagiasTab.tsx` (única outra tela que deixa conjurar
direto, fora do Combat). Cada ponto é bloqueio de verdade (`return`
cedo, sem gastar Espaço de Magia nem rolar), não só aviso — a regra
real diz "impede conjurar", não "desconta something".

**Proficiência de Armadura/Escudo por talento** (Especialista em
Armaduras Leves/Médias/Pesadas) usa o mesmo desenho de "somar
categorias de vários talentos" já visto — como mais de 1 talento pode
contribuir categorias diferentes ao mesmo personagem, a leitura varre
TODOS os talentos com esse `tipo`, nunca só o primeiro achado
(`efeitoMecanicoDoTalento` do `calculoPersonagem.ts` não serve aqui —
ele já para no primeiro match).

**Data/origem:** 2026-09, SDD fornecido pelo Osmar durante o foco de
Talentos Fase 4 (Grupo C, entre B.2 e B.3).

## "Usar Magia" (Combat) ganha painel de Espaços de Magia ancorado à direita — só nessa tela

**Pedido do Osmar** ao ver a Tela 2 do fluxo "Usar Magia" (lista de
Truques/Magias Preparadas) num Mago de nível alto: o resumo de
Espaços ficava espremido em 1-2 linhas de texto corrido no topo
("1º: 4/4 2º: 3/3..."), enquanto a aba Magias já tinha uma versão boa
disso (pips grandes, 1 linha por círculo, seção "Espaços de Magia").
Pedido: mostrar essa MESMA informação, só que num painel à DIREITA da
lista, exclusivamente na Tela 2 do "Usar Magia" (não na aba Magias
normal) — desaparece junto com a lista ao voltar/mudar de ideia.

**Implementação:** `SelecionarMagiaShell.tsx` ganhou CSS próprio
(`SelecionarMagiaShell.module.css`, não mexe no `LevelUpShell.module.css`
compartilhado). O painel (`.painelEspacos`) usa `position: fixed`
(mesma técnica do `.navLayer`/botão "Avançar" do Level Up) — ancorado
à direita da tela, centralizado verticalmente (`top:50%` +
`translateY(-50%)`), pra ficar sempre visível mesmo com a lista de
magias rolando por baixo, em vez de rolar junto no fluxo normal do
documento. Largo o suficiente pra caber 4 pips de `TickPips
tamanho="sm"` por linha antes de quebrar. `.listCol` ganha
`padding-right` pra nenhum texto da lista ficar embaixo do painel
fixo. Testado com Mago nível 17 (9 círculos simultâneos) e nível 1 (1
círculo só) — cabe nos dois casos em ~390px sem cortar a lista, e o
painel se mantém parado na tela mesmo rolando a lista.

**Data/origem:** 2026-09, revisão pedida pelo Osmar depois do foco
Mago (outra conta/branch) chegar na Combat — 1ª versão (painel dentro
do flex row, rolando junto com a lista) foi corrigida depois que o
Osmar testou no celular de verdade e pediu pra ancorar fixo.

