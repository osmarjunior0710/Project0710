# SDD — Dado 3D como motor de rolagem (com fallback pro 2D)

> Ver `sdd/README.md` pra regra de manutenção deste arquivo (não é
> descartável — corrige aqui se um erro for encontrado depois).

## Decisão de escopo (Osmar, 2026-09)

O dado 3D (`@3d-dice/dice-box`, prototipado isolado em `Dice3dFab.tsx`)
vai virar **os dois**, em fases:

1. **Fase A — ferramenta avulsa (já praticamente pronta):** formalizar
   o que já existe no protótipo (todos os tipos de dado, modo
   Múltiplos, log das últimas rolagens, customização de
   textura/cor) como parte definitiva do app — sem tocar no motor de
   regra (`RollContext.tsx`).
2. **Fase B — rolagem oficial do jogo:** o motor 3D passa a ser
   **o padrão** pra toda rolagem real (Combate/Magias/Atributos),
   substituindo `Math.random()`. Existe uma preferência no menu do
   avatar pra o jogador trocar pra **2D** a qualquer momento — os dois
   sistemas continuam existindo lado a lado, nunca um substituindo o
   outro no código.

Este documento cobre a Fase B (a mecânica em si) e como ela precisa
conviver com o sistema 2D existente. A Fase A não precisa de SDD
próprio — é só "promover" UI que já existe, sem regra nova.

## Achado técnico que define toda a arquitetura

`@3d-dice/dice-box` decide o resultado **só pela física** (raycasting
no dado já parado — confirmado lendo `Dice.js`: `s.value =
o[s.dieType][d.faceId]`). **Não existe API pra forçar um resultado.**
Consequência: quando o modo 3D está ativo, **a física da lib é a
fonte do número aleatório** — não dá pra continuar gerando o número
com `Math.random()` e só "decorar" com a física depois. O motor de
regra (vantagem, modificador, total) continua sendo nosso; só a
origem do valor bruto do dado muda de fonte.

## Preferência 3D/2D

- Nova preferência **global** (não por personagem — é gosto de como
  jogar, não dado de personagem), mesmo padrão de `useColapsavel`
  (`itensDetalhados`/`pesoAtivo`): `localStorage`, chave própria,
  **default `3d`**.
- Fica no menu do avatar (`AvatarMenu.tsx`), junto com as outras
  preferências de exibição — um switch "🎲 Dado 3D" (ligado = 3D,
  desligado = 2D clássico).
- **Modo de Teste força 2D automaticamente** (ver seção própria
  abaixo) — nunca os dois ativos ao mesmo tempo.
- Sem WebGL no aparelho → cai pro 2D automaticamente, mesmo com a
  preferência marcada em 3D (detecção já existe dentro da lib —
  ver "Fallbacks", abaixo).

## Mapeamento mecânica atual → motor 3D

Central: `RollContext.tsx` ganha um "provedor de valor bruto" que
troca de implementação conforme a preferência — o resto do arquivo
(cálculo de total, crítico, texto, chamadas dos 24 pontos em
Combat/Reação/Ação/Atributos/Magias) **não muda**, só a função que
hoje faz `1 + Math.floor(Math.random() * lados)`.

### d20 simples (perícia, salvaguarda, ataque, iniciativa)

- Hoje: `rolarD20Dado()` → `Math.random()`.
- 3D: `box.roll('1d20')`, aguarda o `onRollComplete`, usa o valor
  devolvido. Mesma pausa dramática de hoje (`RollOverlay`), só que a
  duração passa a ser "até a física parar" em vez de 1s fixo (ver
  "Timing", abaixo).

### Vantagem/Desvantagem

Duas situações diferentes no código atual, mapeiam pra 2 mecanismos
diferentes da lib:

- **Vantagem/Desvantagem pré-declarada** (já se sabe antes de rolar,
  ex.: penalidade de armadura): rola os 2 dados de uma vez —
  `box.roll(['1d20','1d20'])`, mesmo padrão já validado no protótipo
  do modo Múltiplos.
- **Escolha PÓS-rolagem** (`escolherVantagemPosRolagem` — jogador vê
  o 1º resultado e SÓ DEPOIS decide se quer Vantagem/Desvantagem):
  o 1º dado já rolou e parou sozinho (`box.roll('1d20')`); ao
  escolher, usa **`box.add('1d20')`** (método da lib que joga um dado
  A MAIS na cena SEM limpar os que já estão parados — diferente de
  `.roll()`, que sempre limpa tudo primeiro) — o 2º dado cai do lado
  do 1º, e o app compara os dois normalmente (`Math.max`/`Math.min`,
  lógica que já existe).

### Rerolagem (Perfurador, Inspiração Heroica, Sorte, "reroll se 1")

Hoje: `dadosIndividuais` guarda cada dado com um `id` estável;
`rerollDadoEscolhido(id)` troca só aquele valor e re-soma o total.

3D: a lib tem **`box.reroll(dieResultObject, {remove, hide})`** —
rerola FISICAMENTE só o dado identificado (usa o objeto de resultado
que a própria lib devolveu pro dado, com `rollId` interno). Pra isso
funcionar, `dadosIndividuais` precisa guardar também o **objeto de
resultado bruto da lib** (não só `{id, lados, valor}` como hoje) pra
poder repassar pro `reroll()` depois. Detalhe de implementação pra
resolver na Fase B — não muda o comportamento visível.

### Dano com múltiplos dados / grupos mistos (`gruposExtras`)

Já validado no protótipo: `box.roll(['3d6','2d4','1d8'])` — a lib já
aceita array de notações de tipos diferentes na mesma rolagem, sem
lógica extra. Mapeia direto pro que `gruposExtras` já faz hoje.

### Crítico (dobra os dados de dano)

Hoje o app não modela dano em crítico ainda (ver `Backlog.md`) — fora
de escopo aqui também. Quando existir, dobra a notação
(`3d6` → `['3d6','3d6']` ou `'6d6'`, a decidir na hora) — mesma
mecânica de "vários dados", nada novo.

### Modo de Teste (sequência fixa 1/10/15/20 pra QA)

**Incompatível com física de verdade** — não dá pra forçar face. Duas
decisões:
1. Ligar "Modo de Teste" **força a preferência pra 2D** automaticamente
   (e desliga o switch "Dado 3D" do menu do avatar, com aviso) —
   evita o usuário achar que tá testando com dado fixo e na verdade
   tá vendo física de verdade.
2. Quando o app precisar de um substituto de "Modo de Teste" também
   pro fluxo 3D (ex.: QA específica de física), reaproveitar o padrão
   **"Valor manual"** já criado pro dado de vida do Level Up — digitar
   o resultado em vez de rolar. Não faz parte da Fase B em si, só
   fica registrado aqui como caminho natural se precisar.

### Fallbacks (sempre caem pro 2D, comportamento idêntico)

- **Sem WebGL:** a lib detecta sozinha e loga aviso — nesse caso o
  app usa 2D mesmo com a preferência em "3D" (não silenciosamente
  mostra uma tela quebrada). Checar a mesma condição que a lib usa
  (suporte a WebGL) ANTES de tentar montar o motor 3D, pra decidir
  synchronously se cai pro 2D sem esperar a lib carregar e falhar.
- **Lib falhou ao carregar** (erro de rede no `import()` dinâmico,
  etc.): mesmo tratamento — cai pro 2D pra aquela rolagem, sem travar
  o jogo.

## Timing / UX

- Hoje: 1s fixo (CSS spin) antes de mostrar o resultado, sempre.
- 3D: a física demora mais que 1s pra assentar de verdade — os testes
  do protótipo mostraram algo entre ~2s (1 dado) e ~8-10s (10 dados
  simultâneos, caso do modo Múltiplos). **Isso é aceitável pra
  rolagem única de combate** (não muito diferente de rolar um dado
  físico de verdade na mesa), mas é uma mudança de ritmo real que vale
  o Osmar sentir num teste real antes de aprovar a Fase B inteira —
  registrar como ponto de atenção, não travar a decisão agora.

## Fora de escopo deste documento

- Escolha de qual entrega específica vem primeiro dentro da Fase B —
  isso é o chapéu de Product Manager (ver conversa/`EmDev`/`EmDevB`
  quando a Fase B for aberta como foco).
- Layout/onde cada botão fica na tela — chapéu de Product/UI Design.
