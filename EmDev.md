# EmDev.md

> Arquivo da conta principal / branch padrão (ver seção 14.1 do
> `CLAUDE.md`). A outra conta usa `EmDevB.md` — nunca escreva aqui a
> partir da branch `claude/read-claude-md-c75hsf`.
>
> Plano do foco que está em andamento **agora** (ver ciclo de foco,
> seção 6 do `CLAUDE.md`). Diferente da família `DECISOES-*.md`
> (decisão já tomada, permanente) e de `PENDENCIAS.md` (adiado de
> propósito ou travado estruturalmente), este arquivo é só o checklist
> de trabalho do foco sendo executado agora.
>
> Fica vazio entre focos. Quando um foco fecha (seção 6.3), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco ATIVO: Dado 3D — Fase B (motor 3D vira o padrão de rolagem oficial)

Ver `sdd/sdd-dado-3d.md` pra mecânica completa (mapeamento de cada
situação de rolagem — Vantagem/Desvantagem, reroll, grupos mistos,
Modo de Teste, fallbacks). Talentos (abaixo) fica PAUSADO enquanto
este foco roda — não fechado, retomamos depois.

### B1 — Preferência 3D/2D no menu do avatar (1ª entrega, sem mexer no RollContext ainda)

- [x] Nova preferência global (não por personagem) em `localStorage`,
      chave própria (`preferencia-dado-3d`), default `true` (3D) —
      reaproveitou `useColapsavel` (já era genérico o suficiente,
      "expandido/colapsado" = "3D ligado/desligado" aqui), em vez de
      escrever um hook novo.
- [x] Switch "🎲 Dado 3D" no `AvatarMenu.tsx`, junto das outras
      preferências de exibição (ligado = 3D, desligado = 2D clássico).
- [x] `suportaWebGL()` (`ui/utils/suportaWebGL.ts`) — cria um
      `<canvas>` descartável e tenta `webgl2`/`webgl`/
      `experimental-webgl`, checagem clássica de capability detection.
      Calculado 1x por sessão (`useMemo`) em `RollContext`, exposto
      como `dado3DDisponivel`. Sem suporte, a linha do switch fica
      esmaecida/travada (mesmo tratamento visual de botão desabilitado
      já usado em outros lugares do app).
- [x] Modo de Teste força a preferência pra 2D automaticamente
      (`alternarModoTeste` já chama `setPreferenciaDado3D(false)` ao
      ligar) e trava/esmaece o switch enquanto ativo — nunca os dois
      ligados ao mesmo tempo.
- [x] `RollContext` ganhou `dado3DAtivo` (derivado:
      `preferenciaDado3D && dado3DDisponivel && !modoTeste`) — pronto
      pra B2 ler, mas **ainda não é lido em lugar nenhum** —
      `rolarD20Dado`/`rolarD20`/`rolarDados` continuam 100%
      `Math.random()`, só a preferência existe e é visível.
      Verificado: `tsc -b`/`npm test` (512)/`npm run build` limpos +
      Playwright (switch liga/desliga, persiste depois de recarregar a
      página via localStorage, e trava/desliga sozinho ao ligar Modo
      de Teste).

### B2 — d20 simples (perícia/salvaguarda/ataque/iniciativa) usa o motor 3D de verdade

- [x] Motor `@3d-dice/dice-box` virou compartilhado (`ui/roll/
      diceBox3d.ts`) — antes só existia dentro de `Dice3dFab.tsx`
      (ferramenta avulsa); agora tanto o avulso quanto o `RollContext`
      (rolagem oficial) chamam o MESMO `carregarDiceBox3D()`/
      `garantirTemaDiceBox3D()`, evitando 2 instâncias/canvas
      concorrentes.
- [x] `rolarD20` (`RollContext.tsx`): quando `dado3DAtivo` e a
      rolagem NÃO tem Vantagem/Desvantagem pré-declarada (d20 simples
      de verdade), rola via `box.roll('1d20')` e usa o valor físico
      devolvido em vez de `Math.random()` — resto do motor (mod,
      total, crítico, `onResultado`) não muda nada. Falha do motor 3D
      (sem WebGL de repente, erro de rede no `import()` dinâmico) cai
      pro 2D automaticamente, mesmo timing de sempre. Novo campo
      `RollState.motor3D` marca qual rolagem usou física de verdade.
- [x] **Visual confirmado com o Osmar antes de codar:** `RollOverlay`
      mostra o canvas físico (compartilhado com o `Dice3dFab`) por
      trás do card em vez do `DadoVisual` CSS pro 1º dado, quando
      `motor3D` — fundo do overlay fica transparente
      (`.overlaySemFundo`) pra não escurecer 2x. Escolher Vantagem/
      Desvantagem DEPOIS de ver o resultado (`escolherVantagemPosRolagem`)
      continua 2D pro 2º dado (fora de escopo desta entrega) — funciona
      normalmente ao lado do 1º dado físico já assentado.
      Verificado: `tsc -b`/`npm test` (516)/`npm run build` limpos +
      Playwright (perícia com Dado 3D ligado → canvas físico visível
      rolando → total bate com o resultado da física → escolhe
      Vantagem depois → 2º dado 2D aparece, total recalcula certo).

**Próxima entrega (B3):** Vantagem/Desvantagem PRÉ-declarada usando o
motor 3D (`box.roll(['1d20','1d20'])`) — hoje continua 2D mesmo com
`dado3DAtivo` — ver `sdd/sdd-dado-3d.md`.

### B3 — Vantagem/Desvantagem PRÉ-declarada também usa o motor 3D

- [x] `rolarD20`: quando `vantagem` já vem definida na chamada (ex.:
      Desvantagem por armadura sem treinamento) e `dado3DAtivo`, rola
      os 2 dados de uma vez (`box.roll(['1d20','1d20'])`) em vez de só
      o d20 simples — os 2 helpers de conclusão (`concluirPlano`/
      `concluirVantagem`) evitam duplicar a lógica de total/crítico
      entre os caminhos 2D e 3D. Falha do motor cai pro 2D igual ao
      B2 (mesmo par de rolagens, só com `Math.random()`).
- [x] Novo campo `RollState.dado2Motor3D` distingue "os 2 dados vieram
      juntos da física" (esta entrega) de "o 2º dado foi ADICIONADO
      depois, `escolherVantagemPosRolagem`" (ainda 2D, fora de escopo)
      — sem isso o `RollOverlay` não saberia se devia esconder o
      `DadoVisual` CSS do 2º dado também ou não.
      Verificado: `tsc -b`/`npm test` (519)/`npm run build` limpos +
      Playwright (Mago com Cota de Malha equipada sem treinamento →
      toca no atributo FOR → 2 dados físicos caem juntos → card mostra
      "Desvantagem" e o total certo → nenhum `DadoVisual` CSS
      aparece, os 2 são físicos).

**Próxima entrega (B4):** reroll com o motor 3D (Sorte, Inspiração
Heroica, Perfurador) e escolha de Vantagem/Desvantagem DEPOIS de ver o
1º resultado (`box.add('1d20')`) — ver `sdd/sdd-dado-3d.md`.

### B4 — Escolha de Vantagem/Desvantagem DEPOIS do resultado, e reroll (Sorte/Inspiração Heroica) físicos

- [x] `escolherVantagemPosRolagem`: quando o 1º dado já veio do motor
      3D (`estado.motor3D`) e `dado3DAtivo`, o 2º dado (escolhido só
      DEPOIS de ver o resultado) usa `box.add('1d20')` — joga um dado
      A MAIS na cena SEM limpar o que já parou (diferente de
      `.roll()`). Cai pro 2D se o motor 3D falhar.
- [x] `usarSorte`/`usarInspiracaoHeroica`: quando o d20 sendo rerolado
      veio do motor 3D, usa `box.reroll(resultadoBruto, {remove:
      true})` — rerola FISICAMENTE só aquele dado, removendo o
      antigo da cena. Precisou guardar o objeto BRUTO que a lib
      devolve (`RollState.resultadoBrutoD20`, tipo `DiceBoxResultado`
      com `[key: string]: unknown` — o app nunca lê os campos
      internos dele, só repassa de volta pra `reroll()`).
      `dice-box.d.ts` ganhou os tipos de `add()`/`reroll()` (lidos
      direto do bundle minificado da lib, que não publica `.d.ts`).
- **Fora de escopo (Perfurador):** reroll de dano (`rerollDadoEscolhido`/
  `usarRerollSe1`) continua 2D — dano com múltiplos dados em si ainda
  não usa o motor 3D (`rolarDados` 100% `Math.random()`), então não
  tem o que rerolar fisicamente ainda; só entra quando o motor 3D
  cobrir rolagem de dano também (fora do escopo do SDD atual, focado
  em d20).
  Verificado: `tsc -b`/`npm test` (519)/`npm run build` limpos +
  Playwright (atributo sem Vantagem pré-declarada → rola físico →
  escolhe "Vantagem" depois do resultado → 2º dado físico entra na
  cena via `box.add`, sem `DadoVisual` CSS, total recalcula certo).
  Sorte/Inspiração Heroica não testados via Playwright (dependem de um
  d20 físico sair 1 ou de uma característica específica — evento raro
  de forçar num teste automatizado) — o fallback pro 2D em caso de erro
  garante que nunca trava, mas vale um teste manual no celular com um
  Pequenino antes de considerar 100% validado.

### B5 — Rolagem de DANO também usa o motor 3D (Perfurador físico)

Pedido do Osmar: fechar a lacuna que o B4 deixou de fora (`rolarDados`
continuava 100% `Math.random()`) enquanto ele testava as outras
entregas no celular.

- [x] `rolarDados`: com `dado3DAtivo`, rola fisicamente tanto o caso de
      1 dado só (`box.roll({qty:1, sides})`) quanto o grid de 2+ dados/
      grupos mistos (`box.roll([{qty:1,sides},...])`, um grupo `qty:1`
      por dado — precisa ser assim, não `qty:N`, pra conseguir mapear
      `resultados[i]` de volta pro `DadoIndividual` certo). Cai pro 2D
      se o motor 3D falhar, mesmo padrão de `rolarD20`.
- [x] **Decisão de UI sem precisar perguntar de novo** (já é o padrão
      estabelecido no B2/B3 pro `RollOverlay`): dado ÚNICO some da UI
      (CSS) igual ao d20 simples — o físico é a única coisa visível.
      GRID (2+ dados) é DIFERENTE de propósito: continua desenhando os
      ícones normalmente MESMO com `motor3D` — o grid não é "o mesmo
      dado duplicado" (motivo de esconder no d20), é a UI de escolher
      QUAL dado rerolar (Perfurador); esconder ele quebraria essa
      interação, já que não dá pra saber em qual dado físico específico
      o jogador tocou na tela. O dado físico caindo vira só reforço
      visual atrás do card, o grid continua sendo a fonte de verdade
      clicável — não precisou inventar nenhuma interação nova.
- [x] `rerollDadoEscolhido`/`usarRerollSe1`: quando o dado (do grid,
      por `id`, ou o único da rolagem sem grid) tinha vindo do motor
      3D, usa `box.reroll(resultadoBruto, {remove:true})` — mesmo
      padrão do B4 pro d20. Precisou de `DadoIndividual.resultadoBruto`
      (bruto por dado, pro caso do grid) e `RollState.resultadoBrutoDados`
      (bruto único, pro caso sem grid) — os 2 novos campos espelham o
      `resultadoBrutoD20` que já existia.
- [x] `ladosParaLib()`: d100 de dano (nunca usado hoje, mas o tipo
      `LadosDado` permite) precisa de `sides: "100"` (string) igual o
      avulso — sem isso quebraria se algum dia usado.
      Verificado: `tsc -b`/`npm test` (529)/`npm run build` limpos +
      Playwright (Guerreiro com Espada Grande equipada, 2d6+1 físico:
      2 dados caem no fundo, grid mostra os 2 valores, total bate;
      Ataque Desarmado, 1d1-1 físico: nenhum `DadoVisual` CSS aparece,
      só o total). Perfurador/reroll físico do grid não testado via
      Playwright (precisa de personagem com o talento — mesma limitação
      de forçar cenário raro já registrada no B4) — o fallback 2D
      garante que nunca trava, mas vale teste manual se o Osmar tiver
      um personagem com Perfurador à mão.

### Redesenho do FAB avulso (Fase A) — coluna de botões em vez de overlay escuro

Pedido do Osmar depois do B4: o FAB avulso (🎲, ferramenta solta, não
official roll) tinha um overlay preto cobrindo a tela inteira com os
controles dentro. Trocado por uma coluna de botões que expande do
próprio FAB pra cima, alinhada à direita, sem fundo escuro nenhum.

- [x] Botões, de baixo (perto do FAB) pra cima: Múltiplos, d4, d6, d8,
      d10, d12, d20, d100, Histórico — cada um um pill (`.menuBtn`),
      coluna com `flex-direction: column-reverse` +
      `align-items: flex-end`. Ordem corrigida no caminho: `column-
      reverse` bota o 1º item do DOM embaixo (perto do FAB) e o último
      em cima — pra Múltiplos ficar embaixo, ele precisa vir PRIMEIRO
      no JSX, não por último.
- [x] Pills mudaram de branco pra `var(--accent)` (mesmo tom do 🎲) —
      branco puro contra o resto da tela ficou estranho (pedido do
      Osmar). O próprio 🎲 ganhou um estado "afundado"/selecionado
      (`.fabAberto`, azul-marinho `#1e2a6e` + sombra por dentro) enquanto
      a coluna está expandida — ele não tem função de rolar nesse
      momento (só fecha), o visual "pressionado" deixa isso claro.
- [x] Removida a Customização de tema/cor (`temaId`/`corHex`/
      `TEMAS`/`CORES`) — o tema fica sempre "default" e cada TIPO de
      dado ganhou cor FIXA própria (`CORES_POR_TIPO`): d4 azul, d6
      cian, d8 verde, d10 amarelo, d12 laranja, d20 vermelho, d100
      roxo. Pra dar cor por tipo numa MESMA rolagem (ex.: Múltiplos com
      d6+d20 juntos), a notação virou array de objetos
      `{ qty, sides, themeColor }` em vez de string — a lib já suporta
      isso (`Z.themeColor || d.themeColor`, lido direto do bundle
      minificado), só não estava documentado no `dice-box.d.ts` (agora
      tem `DiceBoxGrupoNotacao`/`DiceBoxNotacao`).
- [x] Canvas físico do dado (`#dice3d-canvas-host`) continua cobrindo a
      tela inteira (precisa do espaço pra física), mas agora
      TRANSPARENTE (`pointer-events: none`) — o dado cai visível por
      cima da tela normal, sem nenhum fundo escondendo o app atrás.
- [x] Resultado/erro/carregando viraram uma pílula flutuante no topo da
      tela (`.statusFlutuante`), independente da coluna de botões.
- [x] Histórico virou popup central com botão de fechar (✕) explícito
      (`.logPopup`/`.logPopupFechar`) — pedido à parte do Osmar,
      diferente do resto (que só fecha clicando fora).
- [x] Clicar fora do FAB + coluna + popup de log colapsa tudo de volta
      pro FAB (`pointerdown` no `document`, ignorado se o alvo está
      dentro do wrapper que embrulha FAB/coluna/popup).
      Verificado: `tsc -b`/`npm test` (529)/`npm run build` limpos +
      Playwright em 390px (coluna expande com a ordem certa, sem
      "Customizar"; clicar fora colapsa; d20 rola físico vermelho;
      Histórico abre em popup com ✕ que fecha só ele).

## Foco: Talentos — Fase 4 completa (efeito mecânico de verdade) — PAUSADO, retomar depois do Dado 3D

77 talentos ainda sem efeito mecânico, em 5 categorias (Geral 42,
Talento Selvagem 10, Dádiva Épica 12, Estilo de Luta 7, Origem 6).
Ordem acordada com o Osmar: **Origem primeiro** (é o que aparece na
criação de personagem), depois Geral; Talento Selvagem/Dádiva Épica
ficam pra depois do Mago (nicho/nível altíssimo). Cada categoria vira
seu próprio conjunto de sub-focos (A = Origem, B = Geral, ...) — antes
de propor a quebra de cada um, sempre relê tudo que já existe (código
+ livro, quando o Osmar fornecer o PDF) antes de sugerir os grupos.

### A. Origem

**A.0 — leitura/revisão (feita 2026-09):** comparado o código
(`talentos.ts`, `DECISOES-CLASSES.md`, `Backlog.md`) contra o livro
(PDF Cap. 5, fornecido pelo Osmar, p.200-202). Achados registrados em
`LICOES-RAPIDAS.md`. Grupos propostos e aprovados pelo Osmar:

- [x] **A.1 — Correção de dado** (sem mecânica nova, só texto):
      Sortudo perdeu a cláusula "nível 5+ nega crítico" (não existe na
      regra 2024, parece herança 2014) — removida de `talentos.ts` e
      do código que a lia (`pontosDeSorteNegaCritico` em
      `FichaShell.tsx`/`CombatTab.tsx`). Valentão de Taverna tinha o
      benefício "empurrar 1,5m ao acertar Desarmado" descrito errado —
      reescrito como os 4 benefícios reais (Ataque Desarmado
      Aprimorado, Dano Garantido, Armamento Improvisado, Corrida
      Aprimorada, Ataque em Investida), com o que falta implementar
      listado no Backlog.md. Verificado: `tsc -b`/`npm test`
      (221)/`npm run build` limpos.
- [x] **A.2 — Motor de reroll de dado não-d20**: `RollContext` ganhou
      `rerollSe1`/`usarRerollSe1` — quando `rolarDados` é chamado com
      `quantidade === 1`, mostra o valor de verdade (antes sempre
      "💥") e aceita `{ rotulo }` pra oferecer reroll se sair 1, mesmo
      botão visual da Sorte (Pequenino). Plugado no Valentão de
      Taverna (Dano Garantido, `CombatTab.rolarDanoPendente`, só
      quando o dano é do Ataque Desarmado E o talento está ativo).
      Curandeiro (Cura Garantida) fica só com o motor pronto — falta a
      ação de cura em si (Backlog.md, bloqueada por "curar outro
      personagem" não existir). Achado no caminho: `DanoPendente.label`
      do Ataque Desarmado vem com emoji (`"Dano — 🗡 Ataque
      Desarmado"`), comparação exata (`===`) não bate — usar
      `.endsWith()`. Detalhe completo em `DECISOES-COMBATE.md`.
      Verificado: `tsc -b`/`npm test` (221)/`npm run build` limpos +
      Playwright (Math.random forçado pra 1 no 1d4 → botão aparece →
      reroll dá outro valor → botão some, não pode usar 2x).
- [x] **A.3 — Substituição de Magia (Iniciado em Magia)**: novo passo
      `iniciadoEmMagia` no `LevelUpShell` — a cada level-up (sem
      limite de 1, diferente de Arcana Mística), troca a magia de 1º
      círculo por outra da mesma lista, pra cada gaveta ativa (Origem
      e/ou Versátil, independentes). Reaproveita `TrocarValorSimples`
      e o padrão visual de "trocar já conhecido" da Arcana Mística.
      Padrão generalizado registrado em `DECISOES-CLASSES.md`.
      Verificado: `tsc -b`/`npm test` (221)/`npm run build` limpos +
      Playwright (personagem Sábio nível 1 → Level Up nível 2 → troca
      Alarme por Armadura Arcana → Confirmar → persistido em
      `selecao.magiaMagiaIniciadaEscolhida`).
- Bloqueados (registrados no Backlog.md, sem entrega de código por
  enquanto): Troca de Iniciativa (Alerta), desconto de loja/Fabricação
  Rápida (Artifista), Atacante Selvagem completo, Médico de Combate
  (Curandeiro), Canção Encorajadora (Músico), Armamento
  Improvisado/Corrida Aprimorada/Ataque em Investida (Valentão de
  Taverna).

### B. Geral

**B.0 — leitura/revisão (feita 2026-09):** comparado o código
(`talentos.ts`, 43 talentos — 42 sem efeito mecânico + Mestre em
Armaduras Médias já pronto) contra a planilha mestra (aba Talentos,
sem diferença nenhuma de texto) e o livro (PDF Cap. 5, p.202-209).
Achado: **Conjurador Ritualista** falta 1 frase real do livro
("sempre que seu Bônus de Proficiência aumentar, pode adicionar mais
1 magia de 1º círculo com Ritual às sempre preparadas") — vira B.1.
Grupos propostos e aprovados pelo Osmar:

- [x] **B.0.1 — Marcação de placeholder por talento** (pedido do
      Osmar antes de começar B.1): `talentoTemPlaceholder` (já
      existia em `classificarTalento.ts`, só era usado no Perfil)
      agora também aparece na própria tela de escolha do Level Up
      (`TelaEscolherTalento`) e nos 2 pontos do Perfil que ainda não
      usavam (card do Talento de Origem, talento pego pelo Versátil).
      Corrigido também um falso-positivo: Habilidoso e Iniciado em
      Magia são cobertos por mecanismo próprio (`concedeProficiencias`/
      `concedeMagiaIniciada`), não por `efeitoMecanico` — sem isso
      apareceriam como `[PH]` mesmo estando 100% prontos. Músico
      continua `[PH]` de propósito (só a proficiência com instrumento
      está pronta, a Canção Encorajadora ainda falta). Conforme cada
      talento do Grupo B ganhar `efeitoMecanico`, o `[PH]` some
      sozinho — não precisa mexer nesse texto de novo.
      Verificado: `tsc -b`/`npm test` (223)/`npm run build` limpos +
      Playwright (Guerreiro nível 3→4, tela de escolha de Talento
      mostra `[PH]` em cada card sem efeito, largura 390px).
- [x] **B.1 — Correção de texto (sem mecânica nova)**: Conjurador
      Ritualista ganhou a frase que faltava (livro, p.203) sobre o
      número de magias Rituais sempre preparadas crescer +1 toda vez
      que o Bônus de Proficiência aumentar depois de pegar o talento,
      e a nota de que o atributo de conjuração é o atributo aumentado
      por este talento. A planilha mestra (aba Talentos) também está
      sem essa frase — avisar o Osmar pra ele decidir se atualiza lá
      também. Verificado: `tsc -b`/`npm test` (223)/`npm run build`
      limpos (só texto, nada plugado em cálculo ainda — `[PH]`
      continua até B.4).
- [x] **B.2 — Proficiências simples**: escopo corrigido no caminho —
      Especialista em Armaduras Leves/Médias/Pesadas não têm nada pra
      calcular hoje (a Ficha não modela penalidade por armadura sem
      treinamento em lugar nenhum), então foram pro Backlog.md em vez
      de ganhar um `efeitoMecanico` de mentirinha. Só **Treinamento
      com Armas Marciais** entrou: novo tipo
      `proficiencia-armas-marciais`, lido em
      `classeProficienteComArma` (`core/proficienciaArma.ts`) — arma
      Marcial conta como proficiente mesmo se a classe só é Simples.
      Propagado por `ataqueComArma`/`ataqueAtual`/
      `ataqueBonusMaoSecundaria` até `FichaShell.tsx`. Verificado:
      `tsc -b`/`npm test` (226)/`npm run build` limpos (testes novos:
      Bardo com o talento soma Bônus de Proficiência numa Espada
      Longa, que sem o talento não somaria).
- [x] **B.3 — Bônus numérico direto** — Osmar decidiu NÃO implementar:
      Velocista trava sem métrica de Deslocamento em lugar nenhum da
      Ficha; Líder Inspirador/Chef travam em "vários aliados" (mesmo
      motivo de Inspiração Heroica). Ficam só como texto (`[PH]`) —
      cada jogador resolve PV Temporário/Deslocamento na própria ficha
      depois de anunciar na mesa. Detalhe completo no Backlog.md.
- **B.4 — Magia sempre-preparada** — escopo corrigido no caminho:
      Adepto Elemental/Atirador Arcano saem (modificam magia já
      conjurada, não concedem nenhuma — não é bem "magia sempre-
      preparada", vão pro Backlog.md). Sobram Conjurador Ritualista,
      Telecinético, Telepático, Tocado pela Sombra/Fadas.
  - [x] **B.4.1 — sem escolha nenhuma** (Telecinético, Telepático):
        novo `efeitoMecanico: 'magia-geral-concedida'` (truque(s) e/ou
        magia(s) FIXAS, sem tela nova — `core/magiaTalentoGeral.ts`).
        Telecinético dá o truque Mãos Mágicas; Telepático dá Detectar
        Pensamentos sempre preparada + grátis 1x/Descanso Longo (nova
        seção "Magias Grátis de Talentos Gerais" na aba Magias, mesmo
        padrão de `magiasGratisDasInvocacoes`, com chave própria
        `talento:...` na mesma lista `magiasGratisGastas` — sem criar
        2º array). `personagemConjura` (`core/conjuracao.ts`) passou a
        considerar esses talentos — sem isso, um Guerreiro só com
        Telepático teria a aba Magias escondida. Verificado: `tsc -b`/
        `npm test` (251)/`npm run build` limpos + Playwright (Guerreiro
        nível 4 pega Telepático → aba Magias aparece com "Detectar
        Pensamentos" grátis → usa → vira "Usada").
  - [x] **B.4.2 — escolha de 1 magia entre 2 escolas** (Tocado pela
        Sombra: Ilusão/Necromancia; Tocado pelas Fadas: Adivinhação/
        Encantamento): novo `efeitoMecanico: 'magia-escolhida-por-
        escola'` + novo passo `talentoMagia` no `LevelUpShell` (entra
        na sequência só quando o Talento Geral ESCOLHIDO NESTE
        level-up pede essa sub-escolha — mesmo padrão condicional de
        `asiAtributo`). Escolha salva em `PersonagemSalvo.
        escolhaMagiaTalentoGeral` (chave = id do talento). A magia
        FIXA (Invisibilidade/Passo Nebuloso) e a ESCOLHIDA ficam cada
        uma com seu próprio "grátis 1x/Descanso Longo" independente —
        regra real trata como 2 usos separados, não 1 pool. Level Up
        Rápido nunca sorteia essa sub-escolha (fica só com a fixa até
        o jogador escolher manualmente). Verificado: `tsc -b`/`npm
        test` (279)/`npm run build` limpos + Playwright (Guerreiro
        pega Tocado pela Sombra → tela mostra as 8 magias reais de
        Ilusão/Necromancia 1º círculo → escolhe Destruição Colérica →
        confirma → aba Magias mostra as 2 magias, cada uma com botão
        "Usar de graça" próprio).
  - [x] **B.4.3 — Conjurador Ritualista**: novo `efeitoMecanico:
        'magias-rituais-por-proficiencia'`. Reaproveita o passo
        `talentoMagia` do B.4.2, mas com contagem variável
        (`quantidadeMagiasRituais` = Bônus de Proficiência no momento
        da escolha) e multi-seleção até esse limite (em vez de 1 só).
        Opções vêm de `opcoesMagiasRituais`: magias de 1º círculo com
        "Ritual" no campo `tempoConjuracao` (não existe coluna
        dedicada de Ritual na planilha, mas a tag já está codificada
        nesse texto — confirmado com 12 magias reais de 1º círculo).
        `PersonagemSalvo.escolhaMagiaTalentoGeral` mudou de
        `Record<string,string>` pra `Record<string,string[]>` pra
        suportar N magias (Tocado pela Sombra/Fadas continuam com 1
        item na lista). Verificado: `tsc -b`/`npm test` (287)/`npm run
        build` limpos + Playwright (Guerreiro nível 4 pega Conjurador
        Ritualista → tela mostra as 12 magias Rituais reais de 1º
        círculo → escolhe exatamente 2 (limite do Bônus de
        Proficiência) → confirma → aba Magias mostra as 2 como
        "sempre preparadas").
  - [x] **B.4.3.1 — Ritual Rápido + crescimento automático** (os 2
        pedaços que tinham ficado de fora, ver `Backlog.md` até
        2026-09): Ritual Rápido é 1 uso ÚNICO COMPARTILHADO entre
        todas as magias Rituais conhecidas — reaproveita a mesma lista
        `magiasGratisGastas`, só com 1 chave FIXA por talento
        (`CHAVE_RITUAL_RAPIDO`) em vez de 1 chave por magia; UI nova
        na aba Magias ("Ritual Rápido"), com pip de cor diferente
        (roxo/lavanda, `TickPips`/`ContadorUsos` ganharam
        `variante="especial"`, nova var `--accent-especial`) pra não
        confundir com Espaço de Magia normal — reaproveitável por
        qualquer recurso "extra"/pool compartilhado futuro. Crescimento
        automático: o passo `talentoMagia` do Level Up agora também
        dispara pra quem JÁ TEM Conjurador Ritualista, sempre que o
        Bônus de Proficiência sobe de novo (níveis 5/9/13/17 — fora do
        calendário de ASI, empurrado pra fora daquele bloco condicional
        no `LevelUpShell`) e o novo total (`quantidadeMagiasRituais`) é
        maior que quantas já foram escolhidas — as antigas ficam
        pré-marcadas e travadas ("já escolhida"), só dá pra completar
        até o novo limite. Verificado: `tsc -b`/`npm test` (290)/`npm
        run build` limpos + Playwright (Guerreiro nível 4 com
        Conjurador Ritualista + 2 magias já escolhidas → aba Magias
        mostra "Ritual Rápido" com pip roxo → usa → pip fica cinza,
        botão trava até Descanso Longo → level up pra nível 5 → passo
        "Magia do Talento" reaparece sozinho, fora de qualquer tela de
        ASI, mostrando "Bônus de Proficiência aumentou — escolha 3
        (2/3)" com Alarme/Identificar travadas como "já escolhida" →
        escolhe Detectar Magia → confirma → aba Magias mostra as 3
        magias sempre preparadas).
  - [x] **B.4.3.2 — Botão "Grátis" nas magias Rituais elegíveis, sem
        perder o "Usar" normal** (pedido do Osmar ao ver o Ritual
        Rápido pronto, evoluído em 3 rodadas — a 2ª versão tinha
        REMOVIDO sem querer o jeito de conjurar gastando Espaço pra
        quem tem Espaços de verdade, ex.: um conjurador de verdade com
        esse talento, não só Guerreiro): na seção "Magias de Talentos
        Gerais", a magia com tag Ritual
        (`elegivelRitualRapido = ritualRapidoDisponivel &&
        m.tempoConjuracao?.includes('Ritual')`) mostra os DOIS botões
        lado a lado — "Grátis" (roxo, `usarBtnRitual`, ativa o Ritual
        Rápido pra essa magia, `onUsarRitualRapido`) e "Usar" (segue
        gastando Espaço normal, `usarMagia`) — independentes: gastar o
        grátis não trava o "Usar" de quem tem Espaço sobrando. "Grátis"
        e o botão genérico da seção "Ritual Rápido" continuam
        compartilhando o mesmo estado (`ritualRapidoGasto`). Verificado:
        `tsc -b`/`npm test` (290)/`npm run build` limpos + Playwright
        (Bardo com Conjurador Ritualista e Espaços de 1º círculo
        sobrando → Alarme mostra "Grátis"+"Usar" lado a lado → toca
        "Grátis" → vira "Usada" (cinza) mas "Usar" continua ativo,
        pronto pra gastar Espaço de verdade).
- [x] **B.5 — Escolha de perícia**: Analítico, Mente Aguçada,
      Especialista em Perícia. 2 `efeitoMecanico` novos:
      `pericia-restrita-ou-especializacao` (Analítico/Mente Aguçada —
      1 perícia de lista fixa, vira proficiência ou Especialização
      dependendo se o personagem já era proficiente nela — decidido no
      `FichaShell`, comparando com o estado ANTES do level-up) e
      `pericia-livre-mais-especializacao` (Especialista em Perícia — 1
      perícia LIVRE via `concedeProficiencias` do próprio talento,
      ligado agora também no Level Up além do Wizard, MAIS 1
      Especialização independente, reaproveitando a MESMA vaga do
      "Especialista" de classe do Bardo, só soma +1 quando o talento é
      escolhido). Novo campo `PersonagemSalvo.periciasTalentoGeralAtual`
      (mesmo tratamento de `periciasSubclasseBonusAtual`, junta no
      mesmo `periciasBonusExtras` de `calcularPericias`). 2 passos
      novos no `LevelUpShell` (`periciaLivreTalento`/
      `periciaRestritaTalento`), sempre DEPOIS do passo `asi` no array
      (nunca antes — bug real encontrado e corrigido: empurrar
      `especialista` pra antes de `asi` quando o talento concede vaga
      extra fazia o `luIndex` "pular" de passo no instante em que o
      talento era escolhido, porque o array mudava de tamanho ANTES do
      índice de `asi`; corrigido movendo o push de `especialista` pra
      DEPOIS do bloco de ASI, mesmo padrão já usado por
      `precisaCrescerMagiaRitual`). "Ação vira Ação Bônus" (Procurar/
      Analisar): pedido do Osmar foi manter nas DUAS listas (Ação
      normal E Ação Bônus, jogador escolhe qual gasta a cada turno) —
      nova função `acoesConvertidasEmBonus` (`core/
      periciaTalentoGeral.ts`) filtra `acoesBase` (Cap. 1) e
      `BonusPanelContent` ganhou seção própria pra elas, com
      `onEscolher` ligado ao MESMO `escolherNoPainel('bonus', ...)`
      que a Ação/Reação já usavam (antes só a Ação/Reação marcavam o
      recurso do turno como usado; Ação Bônus não tinha esse fio
      ligado pra nenhum item — agora tem, só pras ações genéricas).
      Verificado: `tsc -b`/`npm test` (301)/`npm run build` limpos +
      Playwright (Guerreiro pega Especialista em Perícia → escolhe
      Furtividade como perícia livre + Intuição como Especialização →
      aba Atributos mostra Furtividade proficiente e Intuição com ⭐;
      Guerreiro com Analítico → aba Combat mostra "Procurar" tanto no
      painel de Ação quanto no de Ação Bônus).
- Agressor/Esmagador/Sentinela/Talhador — decidido NÃO implementar
  (2026-09, mesmo espírito do B.3): ficam só como texto, o jogador
  lembra sozinho na mesa. Motivo de cada um registrado em Backlog.md.
- [x] **B.6 — Perfurador + grid de dados individuais**: pedido do
      Osmar de "aprofundar a rolagem de dados" antes de arrumar o
      Perfurador. Novo `RollState.dadosIndividuais` (`core`/ver
      DECISOES-COMBATE.md "Grid de dados individuais") — rolagem de
      dano com 2+ dados agora mostra cada dado (grid 4 colunas,
      suporta mistura de tipos d4/d6/d8/d10/d12/d20/d100 na mesma
      rolagem via `gruposExtras`), 1 dado só continua igual
      (`.diceRow`, sem grid). Perfurador ganhou `efeitoMecanico:
      'reroll-um-dado-de-dano'` — reroll de 1 dado à escolha (toca no
      dado com 2+; botão direto com 1 só) quando o dano é Perfurante
      (`AtaqueInfo.danoTipo` propagado até `DanoPendente.tipoDano`).
      "+1 dado extra no crítico" (Perfurador) e "dano dobra em
      crítico" (geral) ficaram de fora — app ainda não modela dano em
      crítico nenhum, ver Backlog.md. Verificado: `tsc -b`/`npm test`
      (304)/`npm run build` limpos + Playwright (Adaga 1d4 Perfurante
      com Perfurador → botão "Perfurador — jogar de novo" aparece e
      substitui o valor; Espada Grande 2d6 Cortante → grid mostra os
      2 dados individuais, soma bate com o total).

### C. Penalidades por falta de proficiência (Armadura/Escudo/Arma)

Achado durante o B.2 (Especialista em Armaduras ficou sem consumidor)
— o Osmar trouxe o SDD completo (`sdd-penalidade-proficiencia-
equipamento.md`) e pediu pra resolver ANTES de continuar o B.3, pra
não esquecer. Regra real (Cap. 6, "Treinamento com Armadura"/
"Proficiência em Armas"): 3 penalidades independentes, nunca a mesma
regra reaproveitada —
- **Armadura** (Leve/Média/Pesada) sem treinamento: Desvantagem em
  QUALQUER Teste de D20 de Força ou Destreza (testes, perícias,
  iniciativa, ataques, salvaguardas) + não pode conjurar magias.
- **Escudo** sem treinamento: só não soma o bônus de CA do escudo —
  sem Desvantagem, sem trava de magia.
- **Arma** sem proficiência: só não soma o Bônus de Proficiência no
  ataque — já implementado (`classeProficienteComArma`), nada a fazer
  aqui além de manter.

Grupos aprovados pelo Osmar (do mais isolado pro mais espalhado):

- [x] **C.1 — Motor de proficiência de Armadura/Escudo**: novo arquivo
      `core/proficienciaArmadura.ts` (`classeProficienteComArmadura`),
      mesmo padrão de `classeProficienteComArma`, lendo
      `treinamentoArmadura` da planilha. Especialista em Armaduras
      Leves/Médias/Pesadas ganharam `efeitoMecanico: 'proficiencia-
      armadura'` (Leves concede `['Leve','Escudos']` junto, conforme o
      livro) — fecha o item do Backlog.md aberto no B.2. Varre TODOS
      os talentos do personagem (não só o primeiro achado), porque
      2 talentos diferentes podem contribuir categorias diferentes ao
      mesmo tempo. Verificado: `tsc -b`/`npm test` (234)/`npm run
      build` limpos.
- [x] **C.2 — CA sem bônus de escudo sem treinamento**:
      `calcularCAEquipado`/`explicarCAEquipado` ganharam parâmetro
      `classe` opcional — só somam `bonusEscudo` se
      `classeProficienteComArmadura(classe, 'Escudos', talentos)` for
      `true`; sem `classe` passada (chamadas antigas, ex. resumo do
      wizard), comportamento antigo preservado. Popup do "ⓘ" mostra
      "Escudo (sem treinamento) +0" quando aplicável. Verificado:
      `tsc -b`/`npm test`/`npm run build` limpos + Playwright (Bardo
      com Couro Batido + Escudo → CA 12, sem os +2 do escudo; popup
      mostra a linha "sem treinamento").
- [x] **C.3 — Desvantagem em D20 de Força/Destreza sem treinamento de
      armadura**: sinal único `desvantagemForcaDestreza` calculado 1x
      em `FichaShell.tsx` (`armaduraSemTreinamentoEquipada`) e passado
      pra `AtributosTab` (atributo FOR/DES, perícias de FOR/DES,
      Iniciativa), `CombatTab` (Iniciativa do painel, ataque Mão
      Secundária) e `AcaoPanelContent` (ataque principal) — cada
      chamada de `rolarD20` correspondente ganha `vantagem:
      'desvantagem'` condicional. Não fixa Vantagem/Desvantagem
      escolhida manualmente — só força quando o jogador ainda não
      escolheu nenhuma. Verificado: `tsc -b`/`npm test`/`npm run
      build` limpos + Playwright (Bardo com Cota de Malha — FOR e
      ataque com Espada Longa saem em Desvantagem automática; CAR
      continua rolagem normal, com os botões de Vantagem/Desvantagem
      livres pro jogador escolher).
- [x] **C.4 — Bloqueio de conjuração com armadura errada**: trava
      `conjurarMagia` em `AcaoPanelContent.tsx` (Ação) E
      `ReacaoPanelContent.tsx` (Reação) — os 2 pontos únicos por onde
      toda conjuração de combate passa — mais um reforço em
      `MagiasTab.tsx` (`usarMagia`/`usarMagiaGratis`), que também
      deixa conjurar direto fora do Combat. Linha "✨ Usar Magia" fica
      acinzentada com aviso "Bloqueado — Armadura equipada sem
      treinamento impede conjurar magias." Verificado: `tsc -b`/`npm
      test`/`npm run build` limpos + Playwright (painel de Ação com
      Cota de Malha equipada mostra a linha bloqueada).

Grupo C fechado — volta o B.3 (pausado acima).
