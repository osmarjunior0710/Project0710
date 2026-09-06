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
não um número calculado por círculo escolhido — isso viraria "Cura
1d8" na opção de 1º círculo, "2d8" na de 2º, etc., mas exigiria mapear
a fórmula de upcast estruturada de cada magia (trabalho de planilha
grande). Registrado em PENDENCIAS.md "Upcast — efeito calculado por
círculo" — Osmar quer fechar Talentos antes de voltar nisso.

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

