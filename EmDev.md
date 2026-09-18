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

## Foco: Dado 3D — Fase B (motor 3D vira o padrão de rolagem oficial) — COMPLETO

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

### Correções pós-B5, achadas testando no celular

- [x] **d100 só rolava a dezena** (0/10/.../90) — a lib entende
      `sides:"100"` STRING como "d100 de face única" (sem unidade);
      número puro `100` faz ela somar um d10 físico escondido e
      devolver 1-100 de verdade. Corrigido em `Dice3dFab.tsx`/
      `RollContext.tsx`. Ver `DECISOES-COMBATE.md`.
- [x] **Sorte/Inspiração Heroica/Perfurador só trocavam o número, sem
      o dado cair de novo** — `onRollComplete` devolve 1 objeto por
      GRUPO, não por dado; o `rollId` que `box.reroll()` precisa mora
      em `grupo.rolls[0]`. Guardar o grupo inteiro fazia `reroll()`
      quebrar por dentro e cair no fallback 2D silenciosamente (sem
      resetar `motor3D`, então nem o CSS aparecia). Corrigido com
      helper `dadoBruto()`. Validado via Playwright: dado físico cai
      de novo de verdade.
- [x] **Vantagem/Desvantagem pré-declarada: os 2 dados na tela
      mostravam valores diferentes mas o histórico registrava os 2
      iguais** — 2 notações separadas (`['1d20','1d20']`) competem por
      um contador interno da lib (corrida entre 2 callbacks `async`
      não aguardados pelo `forEach`). Corrigido trocando por 1 notação
      só (`'2d20'`, `qty:2`) — sem 2º item pra competir. Validado 40x
      seguidas sem colisão. **Risco relacionado, não corrigido**: o
      modo Múltiplos do avulso e o grid de dano (B5) também passam
      array de 2+ itens pra `box.roll()` — mesma corrida em teoria,
      não reproduzida/reportada ainda, registrada no
      `DECISOES-COMBATE.md` como ponto de atenção.
- [x] **Dado batendo/saindo um pouco da borda da tela** — canvas físico
      ganhou 5px de folga nas laterais/embaixo (era `inset: 0` exato).
- [x] **Popup de rolagem (perícia/ataque/etc) reancorado embaixo com
      margem** (era centralizado) — botão "FECHAR" de largura total
      virou um ✕ circular no canto do card. Área de física do dado
      ajustada: topo ~72px (abaixo da barra do nome), base ~340px
      (acima do card reancorado). Valores fixos por estimativa, não
      calculados dinamicamente.
      Verificado: `tsc -b`/`npm test` (532)/`npm run build` limpos +
      Playwright (rolagem cai com folga da borda, popup ancorado
      embaixo, ✕ fecha corretamente).
- [x] **Dado ficou minúsculo** — efeito colateral do canvas menor
      acima (a lib escala o dado pelo tamanho do container). Corrigido
      com `scale: 6.2` explícito em `diceBox3d.ts` (padrão da lib é 5),
      calibrado visualmente via Playwright pra ficar uns 20% menor que
      o tamanho original (não o tamanho minúsculo que tinha ficado).
      Ver `DECISOES-COMBATE.md`.
- [x] Escala ajustada de novo (6.2 → 7, "tá pequeno, aumenta um
      pouco") + debug visual temporário no canvas (fundo preto 50%)
      pro Osmar visualizar os limites da área de física — removido
      depois de confirmar os limites certos (transparente de novo).
- [x] Base da área de física reduzida de novo (340px → 265px, sobrava
      espaço entre o preto de debug e o popup).
- [x] **Bug sério achado no celular: depois de alguma rolagem falhar
      1x, o app nunca mais conseguia usar o motor 3D na mesma sessão**
      (ficava sempre no 2D, mesmo a área preta de debug aparecendo
      normal). Causa: `carregarDiceBox3D()` guardava a promise de
      inicialização como singleton, mas nunca limpava essa referência
      se a inicialização REJEITASSE — a mesma promise rejeitada era
      reusada pra sempre. Corrigido: no erro, a referência é limpa, e a
      PRÓXIMA rolagem tenta inicializar o motor do zero em vez de
      reusar o erro antigo. Não reproduzi o gatilho ORIGINAL da falha
      (não reproduziu via Playwright headless) — mas o bug de "nunca
      mais tenta de novo" em si é real e está corrigido; vale confirmar
      no celular se o 3D volta a funcionar depois de qualquer falha
      pontual.
      Verificado: `tsc -b`/`npm test` (536)/`npm run build` limpos.
- [x] **Bug real desde o B4: "2º dado não reconhecido" ao escolher
      Vantagem/Desvantagem DEPOIS de ver o resultado** —
      `escolherVantagemPosRolagem` lia `resultados[0]` depois de
      `box.add('1d20')`, mas `add()` não limpa os grupos antigos:
      `resultados[0]` era sempre o 1º dado (já mostrado antes), nunca o
      2º de verdade. Corrigido lendo o ÚLTIMO item do array (onde o
      grupo recém-adicionado sempre cai). **Mesmo padrão, achado
      revisando o código:** `rerolarFisico()` (Sorte/Inspiração
      Heroica/Perfurador) assumia `resultados[0]` também — errado com
      2+ dados vivos na cena (grid do Perfurador); corrigido achando o
      grupo certo por `id === groupId` do dado original, em vez de
      posição fixa. Ver `DECISOES-COMBATE.md`.
      Verificado: `tsc -b`/`npm test` (536)/`npm run build` limpos +
      Playwright (Vantagem escolhida depois do 1º resultado: total
      corrigido de 6 pra 19, batendo com o maior dos 2 dados físicos
      visíveis na tela).
- [x] **Área preta de debug reancorada de vez em quanto o Osmar não
      confirma os limites finais** — base virou `calc(92px + 52px +
      5px)` (5px acima do topo do FAB) em vez de um valor fixo chutado
      (340px → 265px antes) — como os dois usam `position: fixed` a
      partir da base da tela, acompanha qualquer altura de tela
      sozinho. Preto de debug removido depois, limites confirmados.
- [x] **Escala do dado aumentada de novo** (7 → 7.5, "aumenta só mais
      um pouquinho").
- [x] **Cor por tipo de dado nas rolagens OFICIAIS** (d20/dano) — só o
      FAB avulso respeitava `CORES_POR_TIPO`; as rolagens de verdade
      (d20 simples, Vantagem/Desvantagem, dano com 1 ou mais dados)
      caíam sempre na cor padrão do tema, sem `themeColor` nenhum.
      Tabela movida pra `diceBox3d.ts` (`COR_POR_LADOS`, por número de
      lados em vez de por rótulo `TipoDado`, já que `RollContext` não
      tem esse tipo) e usada em todo `box.roll()`/`box.add()` de
      `RollContext.tsx`. Verificado: `tsc -b`/`npm test` (536)/`npm run
      build` limpos — vale confirmar visualmente no celular (d20
      vermelho, dano por tipo) já que não deu pra reproduzir via
      Playwright headless sem simular login/criação de personagem.

### B6 — Consolidação do motor de dado 3D (1 função central, fim da duplicação)

Pedido do Osmar depois de ver os bugs de grupo/posição se repetirem em
lugares diferentes (B4/B5/correções pós-B5): cada ponto de entrada
(`rolarD20`, `escolherVantagemPosRolagem`, `rerolarFisico`,
`rolarDados`, FAB avulso) reimplementa sozinho "chamar `box.roll`/
`add`/`reroll`, adivinhar qual resultado é o novo, aplicar cor, cair
pro 2D" — é essa duplicação que gerou os bugs recorrentes. Plano
aprovado pelo Osmar:

- [x] **B6.1 — `lancarGrupos()` central em `diceBox3d.ts`**: guarda o
      conjunto de `groupId`s já na cena ANTES de `box.roll()`/`add()`
      (`box.getRollResults()`, método síncrono da lib que a gente não
      tinha nos tipos ainda, adicionado em `dice-box.d.ts`), e no
      `onRollComplete` devolve só os grupos que NÃO existiam antes —
      elimina de vez a classe de bug "adivinhar posição no array" (não
      só os casos de hoje, qualquer um futuro também). Cor por tipo
      (`COR_POR_LADOS`) entra dentro dela também. Núcleo de filtro
      (`gruposNovos`) é função pura, isolada e testada
      (`diceBox3d.test.ts`, 3 casos: roll/add/borda-tudo-já-existia).
      Ninguém usa `lancarGrupos()` ainda — migração de cada call site
      é 1 sub-entrega própria (B6.2 a B6.6). Ver `DECISOES-COMBATE.md`.
      Verificado: `tsc -b`/`npm test` (539)/`npm run build` limpos.
- [x] **B6.2** — migrar `rolarD20` (d20 simples + Vantagem
      pré-declarada) pra `lancarGrupos()`. Troca mecânica: onde antes
      montava `box.onRollComplete`/`box.roll()` na mão e lia
      `resultados[0]`, agora só `const [grupo] = await
      lancarGrupos({...})` — como `roll()` sempre limpa a cena antes,
      `lancarGrupos()` sempre devolve exatamente 1 grupo aqui.
      Fallback pro 2D em caso de erro não mudou. Verificado: `tsc -b`/
      `npm test` (539)/`npm run build` limpos. **Sem validação
      Playwright desta vez** — simular login/criação de personagem só
      pra chegar na tela de rolagem ficou caro pro escopo desta
      entrega; a parte de maior risco (identificar qual resultado é o
      novo) já é coberta pelo teste automatizado de `gruposNovos`
      (B6.1). Vale o Osmar confirmar no celular: perícia/ataque/
      salvaguarda simples E Vantagem/Desvantagem pré-declarada (ex.:
      Desvantagem por armadura sem treinamento) continuam certas.
- [x] **B6.3** — migrar `escolherVantagemPosRolagem` (o `add()`, foi o
      bug mais recente) pra `lancarGrupos({...}, {modo:'add'})` —
      código do call site caiu de ~15 linhas (montar `box`, tema,
      cancelar fade, `onRollComplete` com o comentário de "resultados[
      length-1]") pra 2. Verificado: `tsc -b`/`npm test` (546)/`npm run
      build` limpos + Playwright (2º dado reconhecido certo: 1º dado 3
      → Vantagem → 2º dado 9 físico visível → total 14 = 9+5, bate).
- [x] **B6.4** — migrar `rerolarFisico` (Sorte/Inspiração Heroica/
      Perfurador) — `box.reroll()` reaproveita o `groupId` do dado
      original em vez de criar um novo, então `gruposNovos()` (B6.1)
      não se aplica; ganhou uma irmã, `rerolarGrupo()` em
      `diceBox3d.ts`, com a mesma lógica de achar o grupo certo por
      `id` (não por posição) que já existia, só realocada — call site
      em `RollContext.tsx` caiu de ~14 linhas pra 5. Verificado: `tsc
      -b`/`npm test` (546)/`npm run build` limpos. **Sem validação
      Playwright** — Sorte/Perfurador dependem de sair 1 no d20 ou de
      um personagem com talento específico, caro de forçar num teste
      automatizado (mesma limitação já registrada no B4); é
      realocação quase literal do código já testado, risco baixo. Vale
      teste manual no celular com Sorte/Inspiração Heroica/Perfurador
      quando o Osmar tiver a chance.
- [x] **B6.5** — migrar `rolarDados` (dano, 1 dado e grid) pra
      `lancarGrupos()` — os dois ramos (`umDadoSo`/grid) caíram de ~15
      linhas juntas pra 6. Verificado: `tsc -b`/`npm test` (546)/`npm
      run build` limpos + Playwright (Ataque Desarmado, 1 dado só:
      ataque 1d20+2 físico → "Rolar Dano" → dano físico resolve certo,
      total 3). Grid (2+ dados, ex.: Espada Grande 2d6) não testado via
      Playwright — a ferramenta "Personagem de Teste" não equipa arma
      de dano múltiplo automaticamente, caro de forçar (mesma limitação
      já registrada no B4/B6.4); é migração mecânica idêntica ao ramo
      `umDadoSo` já validado, risco baixo. Vale teste manual com uma
      arma de 2+ dados quando o Osmar tiver a chance.
- [x] **B6.6** — migrar o FAB avulso (`Dice3dFab.tsx`) pra
      `lancarGrupos()` — os "2 mundos" (oficial e avulso) agora usam a
      MESMA função, fim da duplicação. `rolarGenerico` caiu de ~25
      linhas pra 13 (cor por tipo e fade já vêm de dentro da função
      central, não precisa mais montar `themeColor`/`cancelarFadeDados`/
      `agendarFadeDados` na mão). B6 fechado — todo o motor de dado 3D
      (oficial e avulso) passa por `lancarGrupos()`/`rerolarGrupo()`.
      Verificado: `tsc -b`/`npm test` (546)/`npm run build` limpos +
      Playwright (d6 avulso → resultado 1; Múltiplos d6+d20 → 2 dados
      físicos com cor certa — vermelho/d20, teal/d6 — total 18, Histórico
      com as 2 entradas).

Cada sub-entrega é uma troca "por trás", sem mudar nada visível —
risco baixo, checklist de sempre a cada uma.

### B7 — Popup de rolagem mostra a quebra do modificador (não só o total já somado)

Pedido do Osmar: hoje o card de resultado mostra só `1d20 + 7` (número
já somado) — ele quer ver cada parte que compõe esse `+7` (ex.: "FOR
+3, Bônus de Proficiência +2, Fúria +2"), pra QUALQUER rolagem de d20
(perícia, salvaguarda, ataque, iniciativa) — decidido rodar DEPOIS do
B6 (consolidação do motor primeiro, menos risco de mexer 2 coisas ao
mesmo tempo no mesmo código).

**Levantamento (chapéu de Product Manager):** já existe o mecanismo
certo pronto — `ExplicacaoCalculo` (`core/calculoPersonagem.ts`), hoje
usado só no popup "ⓘ" de CA/perícia/salvaguarda/iniciativa (linhas
label+valor + total). Perícia/salvaguarda/atributo/iniciativa já têm
essa quebra pronta; ataque com arma (`core/ataque.ts`, `modAcerto` já
vem somado: atributo + Bônus de Proficiência + Estilo de Luta) e
ataque/CD de Magia (`modAcertoConjuracao`) NÃO têm — precisam expor os
componentes nomeados antes.

- [x] **Entregas 1+2 — fundação + perícia/salvaguarda/atributo/
      iniciativa**: `RollD20Options`/`RollState` ganharam
      `explicacaoMod?: ExplicacaoCalculo` opcional. `RollOverlay`
      reordenado (pedido do Osmar, chapéu de UX): total grande continua
      onde estava, fórmula pequena (`1d20 + N`) desce pra ABAIXO do
      total (é o "como cheguei nele", secundário) e ganha um ⓘ ao lado
      — reaproveita o `InfoValor` já existente (mesmo popup do CA),
      não um componente novo; sem `explicacaoMod`, mostra só a fórmula
      simples, sem ⓘ, igual sempre foi. Plugado em perícia/salvaguarda/
      iniciativa (`AtributosTab.tsx`, reaproveitando `sv.explicacao`/
      `p.explicacao`/`explicacaoIniciativa` que já existiam pro ⓘ) e
      Iniciativa do painel de Combate (`CombatTab.tsx` ganhou a prop
      `explicacaoIniciativa`, repassada por `FichaShell.tsx`).
      Verificado: `tsc -b`/`npm test` (546)/`npm run build` limpos +
      Playwright (Salvaguarda de Força → total 16 grande, `1d20 + 2 ⓘ`
      embaixo → toca no ⓘ → popup mostra "mod. FOR +0 / Bônus de
      Proficiência (proficiente) +2 / Salvaguarda de Força +2").
- [x] **Correções pós-Entregas 1+2, achadas testando no celular:**
  - **Atributo puro (FOR/DES/etc. sem perícia) também ganhou o ⓘ** —
    o Osmar apontou que mesmo sendo 1 termo só HOJE, no futuro algo
    pode somar em cima (ex.: item mágico "+2 em Testes de Força") e o
    popup já devia estar pronto pra isso sem precisar mexer de novo.
    `AtributoFinal` (`core/calculoPersonagem.ts`) ganhou
    `explicacao: ExplicacaoCalculo` (1 linha só, "mod. FOR"), testado
    (`calculoPersonagem.test.ts`, 2 casos: normal e borda mod.
    negativo). Plugado em `AtributosTab.tsx`.
  - **"Rolando..." no lugar do "—"** enquanto o dado ainda cai —
    3 pontinhos entram em cascata (CSS puro, `@keyframes`), fonte
    menor que o total numérico pra não estourar a largura do card.
    Verificado: `tsc -b`/`npm test` (548)/`npm run build` limpos +
    Playwright (atributo puro FOR → "Rolando..." aparece → resolve →
    total 12 → ⓘ mostra "mod. FOR +1 / FOR +1").
- [x] **Entrega 3** — Ataque com arma/desarmado: `AtaqueInfo` ganhou
      `explicacaoAcerto: ExplicacaoCalculo`. `ataqueDesarmado` sempre
      2 linhas (mod. FOR + Bônus de Proficiência, nunca é isento).
      `ataqueComArma` rotula dinamicamente qual atributo venceu
      ("mod. FOR (Acuidade)"/"mod. DES (Acuidade)"/"mod. FOR"/"mod.
      DES"/"mod. CAR (Pacto da Lâmina)" pro `atribForcada`), Bônus de
      Proficiência só aparece quando > 0 (arma fora da proficiência
      não mostra "+0" à toa), Arquearia (Estilo de Luta) só quando
      ativa. `fmtMod` (antes privada) virou exportada de
      `calculoPersonagem.ts` pra não duplicar a formatação de sinal.
      Plugado no ataque principal (`AcaoPanelContent.tsx`) e mão
      secundária (`CombatTab.tsx`). `ataqueAtual`/
      `ataqueBonusMaoSecundaria` ganham de graça (só chamam
      `ataqueComArma`/`ataqueDesarmado` por baixo). Testado
      (`ataque.test.ts`, 4 casos novos: desarmado sempre 2 linhas, sem
      proficiência esconde a linha, Pacto da Lâmina rotula CAR,
      Acuidade rotula o atributo que venceu). Verificado: `tsc -b`/
      `npm test` (552)/`npm run build` limpos + Playwright (Guerreiro,
      Ataque Desarmado → ⓘ aparece → popup mostra "mod. FOR +1 /
      Bônus de Proficiência +2 / Ataque Desarmado +3"). Arma de
      verdade (não desarmado) não testada via Playwright — mesma
      limitação de sempre (ferramenta de teste não equipa arma
      automaticamente) — mas a lógica é idêntica, risco baixo.
- [x] **Entrega 4** — Ataque de Magia: nova função
      `explicarModAcertoConjuracao` (`core/magiasPersonagem.ts`),
      irmã de `modAcertoConjuracao`, sempre 2 linhas (mod. do atributo
      de conjuração, nomeado pelo `atributoPrimario` da classe — ex.
      "mod. Inteligência" — + Bônus de Proficiência, nunca isento).
      `RollAcertoSpec` (`core/conjurarMagia.ts`) ganhou
      `explicacaoMod?`; `decidirConjuracao` ganhou o parâmetro
      `explicacaoAcertoConjuracao` (opcional, default `null`, não
      quebra chamadas antigas). Prop `explicacaoAcertoConjuracao`
      roteada de `FichaShell.tsx` até os 3 pontos que conjuram
      ataque de magia: `MagiasTab.tsx` (direto), e
      `AcaoPanelContent.tsx`/`BonusPanelContent.tsx` (via
      `useUsarMagiaPainel.tsx`, hook compartilhado) +
      `ReacaoPanelContent.tsx` (direto). **CD de Magia (a outra metade
      do nome da entrega) ficou de fora** — CD é só um número exibido
      pro alvo salvar contra, não uma rolagem DESTE personagem, então
      não tem popup de `RollOverlay` pra plugar; não existe ⓘ nenhum
      hoje na exibição da CD em lugar nenhum — vira item de Backlog
      separado se o Osmar quiser esse ⓘ no futuro. Testado
      (`magiasPersonagem.test.ts`, 2 casos: normal Mago + borda
      classe/atributo sem mapeamento). Verificado: `tsc -b`/`npm test`
      (554)/`npm run build` limpos. **Sem validação Playwright** — a
      ferramenta de teste gera magias aleatórias por personagem, achar
      uma magia de ataque de verdade num personagem gerado ficou caro
      de automatizar nesta sessão (múltiplas tentativas travaram no
      clique); é reaproveitamento do mesmo padrão já validado nas
      Entregas 1-3 (`explicacaoMod` opcional, popup cai pro texto
      simples sem ela), risco baixo — vale teste manual no celular com
      um Mago/Bruxo/Feiticeiro/Clérigo/Druida/Bardo usando um truque
      de ataque (⚔️ na lista de magias).

### Correção: fechar o popup antes do dado parar reabria sozinho

Achado testando no celular: fechar o popup de rolagem (✕ ou tocar
fora) enquanto o dado ainda tava caindo (físico ou 2D) não cancelava a
rolagem em andamento — quando o resultado chegava, o `setEstado` do
resultado reabria o popup do zero, mesmo já fechado antes.

- [x] `RollOverlay`: fechar (✕ e tocar fora do card) só funciona
      quando `estado.fase === 'concluido'` — enquanto `'rolando'`, os
      dois ficam travados (✕ esmaecido, 35% de opacidade, sinalizando
      "não dá ainda" em vez de sumir sem explicação). Verificado:
      `tsc -b`/`npm test` (543)/`npm run build` limpos.

### Escala do dado reduzida 10%

- [x] `scale` em `diceBox3d.ts`: 7.5 → 6.75 (pedido do Osmar).
      Verificado: `tsc -b`/`npm test` (546)/`npm run build` limpos.

### Remoção do preto de debug (limites da área de física confirmados)

- [x] `.canvasWrapper`/`.canvasWrapperEscondido` voltaram a
      `background` transparente (removido `rgba(0, 0, 0, 0.5)`) —
      Osmar confirmou os limites (`top: 72px`, `bottom: calc(92px +
      52px + 5px)`, `left/right: 5px`) certos. Verificado: `tsc -b`/
      `npm test` (546)/`npm run build` limpos.

### Fade automático do dado físico depois de parar

Pedido do Osmar: dado físico ficava parado na tela pra sempre (até a
próxima rolagem limpar a cena) — melhor ele sumir sozinho depois de um
tempo. Mecânica combinada: espera 3s depois que a física de TODOS os
dados da rolagem assenta, depois some suavemente em mais 2s (opacity
100→0 de 3s a 5s). Shader/fade por dado individual não é viável — a
física roda dentro de um Web Worker da lib, sem acesso a mesh/material
de fora (ver comentário em `diceBox3d.ts`); o fade aplica no canvas
inteiro.

- [x] `diceBox3d.ts`: `agendarFadeDados()`/`cancelarFadeDados()` —
      manipulam `opacity`/`transition` direto no host do canvas via
      `getElementById` (não um componente React, pra não acoplar este
      módulo genérico ao CSS Module de um consumidor específico).
      `cancelarFadeDados()` sempre roda ANTES de um `roll()`/`add()`/
      `reroll()` novo (devolve opacidade a 100% na hora, sem
      transição); `agendarFadeDados()` sempre roda dentro do
      `onRollComplete` de QUALQUER rolagem (oficial via `lancarGrupos`,
      e os 3 call sites que ainda não migraram pro B6:
      `rerolarFisico`, `escolherVantagemPosRolagem`, `rolarDados`, mais
      o FAB avulso) — se um 2º dado assentar antes do fade do 1º
      terminar (ex.: Vantagem escolhida DEPOIS do resultado), o timer
      reinicia do zero pros dois juntos, nunca um sumindo enquanto o
      outro ainda nem caiu.
      Verificado: `tsc -b`/`npm test` (546)/`npm run build` limpos +
      Playwright (rolagem física → opacity fica 1 até ~3s → cai
      suavemente → chega em 0 por volta de 5s).

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

### B8 — ⓘ na CD de magia/Sopro/Inferno + quebra do dado de dano/cura de magia

Pedido do Osmar: "Seria bom colocar ⓘ no CD e rolagens de magia/cura".
Perguntado e confirmado com ele: o ⓘ na CD vai nas 3 CDs que existem
hoje (Salvaguarda de Magia, Ataque de Sopro do Draconato, Lançar no
Inferno do Bruxo), e a quebra de dado entra pra dano E cura de magia
juntas nesta mesma entrega (não só cura).

- [x] **CD** — `explicarCdConjuracao` (`core/magiasPersonagem.ts`, "CD
      base" 8 + as mesmas linhas de `explicarModAcertoConjuracao`) e
      `explicarCdAtaqueDeSopro` (`core/ataqueDeSopro.ts`, "CD base" 8 +
      mod. CON + Bônus de Proficiência — fórmula própria do Apêndice C,
      diferente da de conjuração). Salvaguarda de Magia e Lançar no
      Inferno usam a MESMA CD (`cdConjuracao(modAcertoConjuracao)`) —
      1 valor só (`explicacaoCdConjuracao`, calculado 1x em
      `FichaShell.tsx`) alimenta os dois popups; Ataque de Sopro usa a
      fórmula própria à parte. `MagiaSalvaguardaModal`/
      `LancarNoInfernoModal`/`AtaqueDeSoproModal` ganharam prop
      `explicacaoCd` e o ⓘ (`InfoValor`) ao lado do número da CD.
- [x] **Dano/Cura de magia** — a composição de dado de magia
      (`core/magiaDano.ts`) nunca teve nomes pras partes: Dado Base +
      Aprimoramento de Truque (escala por nível, truque) + Upcast
      (dado/flat/alvo por círculo) já eram somados direto num
      `quantidade`/`lados`/`mod` final, sem rastro de qual parte veio
      de onde. `calcularEscalonamento()` reescrito pra montar as linhas
      progressivamente e devolver `explicacao: ExplicacaoCalculo` junto
      do resultado de sempre — como o total só existe como notação de
      dado (ex. "10d6"), não um número resolvido, o `total.valor`
      guarda a notação, não um número (uso novo do mesmo tipo
      `ExplicacaoCalculo`, ver `DECISOES-COMBATE.md`). Novo helper
      `fmtDado(quantidade, lados, mod, comSinal?)` formata a notação
      (com "+" na frente pras linhas de incremento). `RollDadosOptions`/
      `rolarDados` (`RollContext.tsx`) ganharam `explicacaoMod?`
      (mesmo padrão do `RollD20Options` do B7) — `RollOverlay` já
      renderiza isso de forma genérica, não precisou mexer lá.
      Explosão Agonizante (`conjurarMagia.ts`) ganhou uma linha própria
      quando aplica o bônus. Roteado em TODOS os pontos que rolam dano/
      cura de magia: `MagiasTab.tsx` e `CombatTab.tsx` (cada um tem sua
      própria cópia de `rolarDanoSalvaguarda`/
      `rolarDanoCondicionalSalvaguarda` — as duas cópias corrigidas) +
      dano pendente (`DanoPendente.ts` ganhou `explicacaoMod?`) + cura
      pendente.
      Testado: `magiaDano.test.ts` (13 casos existentes migrados pra
      `toMatchObject` — o `explicacao` novo não fazia parte do
      `toEqual` antigo — + 4 casos novos cobrindo Dado Base sozinho,
      Aprimoramento de Truque, Upcast dado-por-círculo em dano e em
      cura), `ataqueDeSopro.test.ts` (2 casos novos pra
      `explicarCdAtaqueDeSopro`), `magiasPersonagem.test.ts` (2 casos
      novos pra `explicarCdConjuracao`), `conjurarMagia.test.ts`
      (1 caso novo confirmando a linha extra da Explosão Agonizante).
      Verificado: `tsc -b`/`npm test` (563)/`npm run build` limpos.
      **Sem validação Playwright** — mesma limitação já documentada nas
      Entregas B7 (personagem de teste é gerado aleatório, forçar um
      cenário específico de magia com upcast/truque é caro de
      automatizar); reaproveita o mesmo padrão já validado (`InfoValor`/
      `explicacaoMod` opcional, sem quebra quando ausente), risco baixo
      — vale teste manual no celular com uma magia de dano/cura E os
      3 popups de CD.

### Correção: "Rolando..." padronizado pra todo reroll físico (Vantagem/Desvantagem escolhida depois, Sorte, Inspiração Heroica, Perfurador de 1 dado só)

Achado pelo Osmar: o popup já mostra "Rolando..." com os 3 pontinhos
enquanto o dado 3D cai — mas só na rolagem PRINCIPAL. Vantagem/
Desvantagem escolhida DEPOIS de ver o 1º resultado
(`escolherVantagemPosRolagem`) ainda mostrava o 2º dado com o visual 2D
antigo (ícone 🎲 girando) por cima do dado físico caindo atrás — porque
`fase` ficava travada em `'concluido'` (herdada do 1º dado) durante
todo o reroll, e `dado2Motor3D` só virava `true` quando o dado
TERMINAVA de cair, não quando começava.

- [x] `escolherVantagemPosRolagem`/`usarSorte`/`usarInspiracaoHeroica`/
      `rerollDadoEscolhido` (caso de 1 dado só, sem `dadosIndividuais`)
      — todos os 4 têm o mesmo padrão de "reroll físico via
      `rerolarFisico`/`lancarGrupos`": agora, sempre que o reroll é
      físico de verdade (`usar3D`/`resultadoBruto` truthy), a `fase`
      volta pra `'rolando'` no MESMO `setEstado` que já marcava o
      placeholder `'🎲'`, e volta pra `'concluido'` dentro de cada
      `concluir()`. `dado2Motor3D` (Vantagem/Desvantagem) também virou
      `true` desde o início do reroll, não só no fim — esconde o
      `DadoVisual` CSS do 2º dado o tempo todo, não só depois de
      resolvido. Sem 3D (fallback 2D), nada mudou — mesmo ícone
      girando de sempre. **Fora de propósito:** o grid de dados
      individuais (`dadosIndividuais`, Perfurador com 2+ dados) — esse
      caso é a UI de ESCOLHER qual dado rerolar, não um dado duplicado
      por engano (decisão já registrada em `DECISOES-COMBATE.md` "Grid
      de dados individuais"), continua mostrando "🎲" dentro da célula
      tocada. `aplicarBonusExtra` (Sorte do Tenebroso) também ficou de
      fora — nunca teve suporte a motor 3D pra começo de conversa (sempre
      `Math.random()`), nada a corrigir aqui. Verificado: `tsc -b`/`npm
      test` (563)/`npm run build` limpos + Playwright (Salvaguarda de
      Força 3D → Vantagem → popup mostra "Rolando.." com os 2 dados
      físicos caindo na cena, sem nenhum dado 2D por cima → resolve
      certo, usando o maior dos dois).

## Foco: Personagem de Teste Fixo — sempre o mesmo char, pra parar de depender do gerador aleatório — COMPLETO

Pedido do Osmar: montar na mão um personagem de teste FIXO (não
sorteado), salvo sempre igual, cobrindo atributos extremos e as
situações de regra mais usadas em teste — pra não depender do gerador
aleatório (`core/geradorPersonagemTeste.ts`) toda vez que precisa forçar
um cenário específico (já travou validação Playwright várias vezes,
ex.: B7 Entrega 4, B8). Decisões aprovadas pelo Osmar: soma um botão
novo (não substitui o aleatório), 1 personagem só (Mago multiclasse com
Clérigo — cobre ataque/salvaguarda/cura/upcast/truque escalável +
Multiclasse), nível 20. Talentos (abaixo) continua pausado até este
foco fechar.

- [x] **Entrega 1 — nível 1, Mago só**: `data/personagemTesteFixo.ts`
      (`PersonagemSalvo` congelado, mesmo padrão de
      `data/personagemDemo.ts` — escolhas feitas à mão, não sorteadas,
      não gerado em tempo de execução) + `core/personagemTesteFixo.ts`
      (`recriarPersonagemTesteFixo()`, sempre sobrescreve do zero —
      diferente do Demo, que só cria na 1ª visita). Botão "🧪 Char de
      Teste Fixo" novo em `CharacterList.tsx`, ao lado do "🎲
      Personagem de Teste" aleatório. Perfil: Anão/Mago/Origem Sábio,
      atributos extremos (INT 20, FOR/CAR 8), 3 truques (Raio de Fogo —
      ataque que escala por nível — + 2 utilidade), Livro de Magias (6)
      e Magias Preparadas (4) incluindo Mãos Flamejantes (salvaguarda +
      Upcast dado-por-círculo) e Mísseis Mágicos (sem ataque/
      salvaguarda, Upcast alvo-por-círculo) — cobre os 3 formatos de
      escalonamento testados no B8. Origem Sábio também exercita
      Iniciado em Magia (2 truques + 1 magia de graça). Verificado:
      `tsc -b`/`npm test` (563)/`npm run build` limpos + Playwright
      (390px: botão cria e abre a ficha → atributos/PV batem com o
      congelado → aba Magias mostra truques/preparadas/Iniciado em
      Magia certos → "Usar" no Raio de Fogo dispara "Ataque de Magia —
      Raio de Fogo", `1d20 + 7 ⓘ`). **Rolagem até o fim (Rolar Dano)
      não confirmada via Playwright** — o dado físico 3D não assenta de
      forma confiável em Chromium headless (mesma limitação já
      documentada nas Entregas do B7/B8); a lógica por trás é a mesma
      já validada manualmente, risco baixo.
- [x] **Entrega 2 — nível 20, multiclasse**: Clérigo (proposta
      original) **não existe no app ainda** (só Guerreiro/Bardo/Bruxo/
      Mago/Bárbaro estão implementados, e só essas 4 primeiras têm
      entrada de multiclasse em `proficienciasEntradaMulticlasse.ts`)
      — achado no meio da entrega, perguntado ao Osmar, decidido trocar
      por **Bardo** (já conjurador, já tem Curar Ferimentos/Palavra
      Curativa na própria lista, multiclasse já suportada). Personagem
      final: Mago 17 (Necromante) / Bardo 3 (Colégio do Conhecimento),
      nível 20. Contagens de truques/Livro de Magias/Magias Preparadas
      por nível calculadas com as fórmulas reais de
      `core/recursosClasse.ts` (não a UI de Level Up de verdade — ver
      nota abaixo), escolha de QUAL magia sempre feita à mão: Livro de
      Magias do Mago com 38 magias do 1º ao 9º círculo (inclui Bola de
      Fogo, Contramagia, Teleporte, Dominar Monstro, Chuva de
      Meteoros...), Magias Preparadas combinadas (22 Mago + 6 Bardo,
      lista única — mesmo padrão flat já usado no resto do app pra
      multiclasse) incluindo Curar Ferimentos/Palavra Curativa (cura de
      verdade, o motivo de somar o Bardo). 4 ASI de Mago (níveis 4/8/
      12/16) foram pra CON (até o teto 20) e DES. `classes`/
      `classeAtivaAtual`/`periciasMulticlasseAtual`/
      `ferramentasMulticlasseAtual` preenchidos igual um Level Up de
      verdade preencheria. PV somado nível a nível com a mesma fórmula
      de `aplicarLevelUpsAleatorios` (dado médio + mod CON correspondente
      + bônus da Tenacidade Anã), sem rolar de verdade = 193.
      **Nota de risco:** construído calculando os números com as
      MESMAS funções do motor real, mas sem passar pela UI de Level Up
      de verdade (custaria clicar através de ~19 telas) — validado
      visualmente (não com Vitest, já que é dado estático, não lógica)
      via Playwright: pill Mago/Bardo aparece e alterna, 9 círculos de
      Espaço de Magia ativos (combinado), PV/atributos/Bônus de
      Proficiência batem, Perfil/Mochila/Combate renderizam sem erro,
      "Usar" no Raio de Fogo dá `1d20 + 11` (INT+5 + Prof+6, bate com
      nível 20). Verificado: `tsc -b`/`npm test` (563)/`npm run build`
      limpos.
- [x] **Entrega 3 — Mochila com o catálogo completo**: diferente das
      Entregas 1/2 (dado 100% congelado), a lista de itens é CALCULADA
      em `core/personagemTesteFixo.ts` (`itensCatalogoCompleto()`, 1 de
      cada arma/armadura/item de `armas.ts`/`armaduras.ts`/
      `equipamentoAventura.ts`/`ferramentas.ts`) em vez de congelada em
      `data/` — assim nunca fica desatualizada quando a planilha ganhar
      item novo, ao custo de este personagem não ser 100% estático
      (ver DECISOES-DESIGN.md). `recriarPersonagemTesteFixo()` monta
      `selecao.itens` na hora, por cima do congelado. Resultado: 3
      grupos na Mochila (Armas 40, Armadura 13 — inclui Escudo — e
      Outros 207 — Equipamento de Aventura + Ferramentas/Instrumentos).
      **Carga fica sempre acima da capacidade máxima** (~719 kg vs. 56
      kg) — esperado e aceito: o personagem carrega 1 de cada item do
      catálogo de propósito, nenhum jogador de verdade faria isso.
      Verificado: `tsc -b`/`npm test` (563)/`npm run build` limpos +
      Playwright (Mochila abre com os 3 grupos, populando a contagem
      certa, sem erro de console).

Foco fechado — as 3 entregas do Char de Teste Fixo (nível 1 → nível 20
multiclasse → Mochila completa) estão prontas. Aprendizados registrados
em `DECISOES-WIZARD.md`. Volta o foco de Talentos — Fase 4 (abaixo).

## Foco: Talentos — Fase 4 (efeito mecânico de verdade) — COMPLETO

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

Grupo C fechado.

### D. Geral — reaudit 2026-09 (19 sobras) + revisão dos 23 já implementados

Retomado depois do foco "Personagem de Teste Fixo". Reaudit de código
(sem clicar na tela, ver PENDENCIAS.md "Talentos — validação de UI
pendente") dos 23 talentos/Estilos de Luta já implementados não achou
nada quebrado — Multiclasse e a quebra do popup de rolagem (B7/B8)
continuam encaixando certo em todos.

Dos 19 Talentos Gerais sem `efeitoMecanico` que sobraram de antes,
triagem (chapéu de Product Manager) separou os que dão pra fazer
(rodada de entregas abaixo) dos que travam na mesma trava de sempre
(Deslocamento/estado de inimigo/monta/posição, que o app não modela) —
estes últimos tratados como "decidido não implementar", registrados em
Backlog.md junto dos outros já lá (Agressor/Esmagador/Sentinela/
Talhador/Velocista/etc): Atleta, Ator, Combatente Montado, Conjurador
Bélico, Duelista Defensivo, Especialista em Besta, Exterminador de
Conjuradores, Imobilizador, Mestre em Armas de Haste, Mestre em
Armaduras Pesadas, Mestre-Atirador.

Os 5 viáveis, na ordem que forem entregues:

- [x] **D.1 — Resiliente**: novo `efeitoMecanico: 'atributo-e-
      salvaguarda-escolhidos'` (`core/talentoAtributo.ts`,
      `opcoesAtributoResiliente`/`atributosResilienteEscolhidos`) — só
      atributos em que o personagem AINDA não é proficiente em
      Salvaguarda aparecem como opção. Diferente de todo talento com
      ASI já existente: este não usa `ConcedeAsiTalento` (fica
      `'nenhum'`), o próprio efeito já É o "+1" — escolher o atributo
      no novo passo `resilienteAtributo` do Level Up também alimenta
      `asiEscolhas` direto (reaproveita 100% o mesmo mecanismo de
      aplicar ASI que qualquer outro talento usa, `aumentarAtributos`
      em `FichaShell.tsx`). A proficiência de Salvaguarda em si é
      campo novo (`PersonagemSalvo.escolhaAtributoTalentoGeral`, mesmo
      padrão de `escolhaMagiaTalentoGeral`) — `calcularSalvaguardas`
      ganhou um 4º parâmetro opcional (`atributosExtrasProficientes`)
      que soma essa proficiência extra sem nunca duplicar/remover a da
      classe. Testado (`calculoPersonagem.test.ts` — 2 casos novos:
      soma proficiência extra num atributo que a classe não dava, e
      não duplica quando a classe já dava; `talentoAtributo.test.ts` —
      3 casos). Verificado: `tsc -b`/`npm test` (579)/`npm run build`
      limpos + Playwright (Guerreiro nível 3→4 real, escolhe Resiliente
      no passo de talento → passo novo "Atributo (Resiliente)" oferece
      só DES/INT/SAB/CAR, nunca FOR/CON — já proficientes → escolhe SAB
      → Resumo mostra "Atributo (Resiliente): SAB" + "Atributo do
      talento: SAB +1" → ficha final: SAB sobe de 14 pra 15, vira
      Salvaguarda de Sabedoria proficiente com popup "mod. SAB +2 /
      Bônus de Proficiência (Resiliente) +2 / +4").
- [x] **Correção pós-D.1, apontada pelo Osmar testando no celular**: a
      tela nova "Atributo (Resiliente)" mostrava só o nome do atributo,
      sem referência de quanto ele ia subir — diferente do padrão já
      usado na tela normal de ASI (`escolha-unica`, "atributo valor →
      valor+1"). Corrigido pra usar o mesmo padrão (`atributosAtuais`
      já disponível no componente). Generalizado além do pedido
      original: talento com ASI de 1 atributo só (`escolha-unica` com 1
      item) agora SEMPRE passa pela tela de confirmação com "atual →
      novo" em vez de aplicar em silêncio (antes só entrava na tela
      quando havia 2+ opções pra escolher de verdade) — decisão
      registrada em `DECISOES-FICHA.md`. Verificado: `tsc -b`/`npm
      test` (587)/`npm run build` limpos + Playwright (Bárbaro nível
      3→4, escolhe o talento Resistente — 1 atributo só, CON — no passo
      de talento → tela nova "Atributo do Talento" aparece mesmo sem
      escolha real, mostrando "CON 10 → 11" pré-selecionado → avança →
      Resumo mostra "Talento: Resistente" + "Atributo do talento: CON
      +1" certos).
- [x] **D.2 — Especialista Ambidestro**: novo `efeitoMecanico:
      'mao-secundaria-sem-exigir-leve'`. `ataqueBonusMaoSecundaria`
      (`core/ataque.ts`) passou a checar Duas Mãos na mão SECUNDÁRIA
      separado da checagem de Leve (antes só checava Leve nas duas
      mãos) — com o talento, só a mão PRINCIPAL ainda precisa ser
      Leve; sem o talento, comportamento idêntico a antes (as duas
      precisam ser Leve). ASI usa o mecanismo genérico já existente
      (`concedeAsi`), sem código novo. Testado (`ataque.test.ts` — 4
      casos novos: sem o talento bloqueia mão secundária não-Leve, com
      o talento libera, Duas Mãos continua bloqueando mesmo com o
      talento, mão principal sem Leve continua bloqueando mesmo com o
      talento). Verificado: `tsc -b`/`npm test` (591)/`npm run build`
      limpos. **Sem validação Playwright** — call site em
      `FichaShell.tsx` não mudou (já passava `talentosEfetivos`),
      testar de ponta a ponta exigiria escolher o talento + equipar 2
      armas específicas via Mochila, caro pra esta entrega; a lógica
      nova está isolada e coberta pelos 4 casos automatizados, risco
      baixo — vale confirmar no celular com Adaga na mão principal +
      uma arma corpo a corpo não-Leve (ex.: Machado de Batalha) na
      secundária.
- [x] **D.3 — Mestre das Armas**: novo `efeitoMecanico:
      'slot-maestria-extra'`. Confirmado no livro (Cap. 5, p.206): "1
      tipo de arma Simples ou Marcial à sua escolha, DESDE QUE VOCÊ
      TENHA PROFICIÊNCIA COM ELA" — por isso o pool desse slot usa
      `classeProficienteComArma` (`core/maestriaArma.ts`,
      `armasElegiveisParaMaestriaExtra`), mais amplo que
      `armasParaMaestria()` (que só cobre a categoria nativa ampla do
      Guerreiro/Bárbaro): cobre proficiência restrita (Ladino/Monge) e
      a somada por Treinamento com Armas Marciais. Slot NOVO e
      independente dos nativos (`maestriaArmaTalentoGeralAtual` em
      `armazenamentoPersonagens.ts`, `maestriaArmaExtra` em
      `FichaShell.tsx`) — escolhido no passo novo `maestriaArmaTalento`
      do Level Up (mesmo padrão 7-toques de `resilienteAtributo`),
      trocável em Descanso Longo reaproveitando 100%
      `TrocarArmaMaestria.tsx` (só o pool de opções muda), exibido como
      uma 4ª linha na seção "Maestria em Arma" da aba Atributos, com o
      rótulo "(Mestre das Armas)" pra distinguir do slot nativo.
      Testado (`maestriaArma.test.ts` — 3 casos novos: Bardo só Simples,
      Bardo+Treinamento com Armas Marciais libera o catálogo inteiro,
      borda de classe sem proficiência cadastrada). Verificado: `tsc
      -b`/`npm test` (594)/`npm run build` limpos + Playwright
      (Guerreiro nível 3→4 real, escolhe Mestre das Armas → ASI FOR/DES
      → passo novo "Arma (Mestre das Armas)" com o catálogo inteiro →
      escolhe Mosquete → Resumo mostra "Arma (Mestre das Armas):
      Mosquete" → ficha final: 4ª linha "Mosquete (MESTRE DAS ARMAS)" na
      Maestria em Arma, com seu próprio 🔄 → troca por Adaga
      independente das outras 3, resto intacto).
- [x] **Correção achada no caminho do D.3, apontada pelo Osmar**: os
      slots NATIVOS de Maestria em Arma (Guerreiro/Bárbaro) nunca
      cresciam sozinhos nos níveis certos (Guerreiro: 3→4 no nível 4,
      4→5 no nível 10, 5→6 no nível 16) — o Level Up nunca chamava
      `quantidadeMaestriaEmArma(classe, novoNivel)`, então o total
      ficava congelado no valor da criação pra sempre. Corrigido: novo
      passo `maestriaArmaCrescimento` no `LevelUpShell`, só entra na
      sequência quando `quantidadeMaestriaEmArma(classe, novoNivel) >
      maestriaArmaAtual.length` (cresceu de verdade nesse nível, não é
      passo vazio todo level-up) — reaproveita `useEscolhaMultipla`
      (mesmo hook de Truques/Invocações Místicas) com as armas já
      escolhidas travadas (`bloqueado`), forçando escolher só a(s)
      vaga(s) NOVA(S) que abriram; trocar uma arma já escolhida
      continua sendo só via `TrocarArmaMaestria.tsx` na aba Atributos,
      não nesse passo. Verificado: `tsc -b`/`npm test` (594)/`npm run
      build` limpos + Playwright (Guerreiro nível 3→4 real, 2 rodadas
      com personagens diferentes: passo novo aparece com as 3 armas
      nativas marcadas "(já tinha)" e travadas, escolhe a 4ª → Resumo
      "Maestria em Arma: +1 nova(s)" → ficha final tem as 3 antigas
      intactas + a nova, confirmando que nenhuma foi perdida/trocada
      sem querer).
- [x] **Correção apontada pelo Osmar, achada revisando Mestre das
      Armas**: o 🔄 de Maestria em Arma (nativa Guerreiro/Bárbaro E o
      slot extra do talento) ficava sempre clicável, sem gate nenhum —
      livro confirma "sempre que completar um Descanso Longo, pode
      alterar 1 dessas escolhas". Já era uma simplificação assumida,
      documentada em `PENDENCIAS.md`/`DECISOES-CLASSES.md`. Corrigido:
      2 flags novas (`maestriaArmaTrocaDisponivel`/
      `maestriaArmaTalentoTrocaDisponivel`, independentes entre si —
      cada fonte concede sua própria troca), default `true` (não trava
      personagens já salvos), viram `false` ao usar a troca, voltam a
      `true` no Descanso Longo. `TrocarArmaMaestria.tsx` ganhou prop
      `desabilitado` (mesmo padrão visual/interação já usado em
      Resistência Ínfera — ícone opaco, `pointer-events: none`).
      Verificado: `tsc -b`/`npm test` (594)/`npm run build` limpos +
      Playwright (Guerreiro: troca 1 arma → ícone trava e o texto muda
      pra "já trocou..." → clique forçado no ícone travado não abre o
      popup → Descanso Longo → ícone libera de novo e o texto volta a
      "você pode trocar...").
- [x] **D.4 — Mestre em Armas Grandes**: novo `efeitoMecanico:
      'dano-extra-e-cortar-arma-pesada'`, 2 efeitos independentes na
      mesma flag (livro, p.207).
      **Maestria em Armas Pesadas** (dano extra): automático, sem
      botão — `ataqueComArma` (`core/ataque.ts`) soma o Bônus de
      Proficiência no `danoMod` sempre que a arma tiver a propriedade
      "Pesada", sem limite de "1x/turno" (livro não restringe). Testado
      (`ataque.test.ts` — 2 casos: com talento + arma Pesada soma o
      bônus, sem Pesada não soma mesmo com o talento).
      **Cortar** (ataque bônus, mesma arma): Crítico detectado sozinho
      — novo `useEffect` em `FichaShell.tsx` observa `estado` do
      `useRoll()` e liga `cortarPronto` quando uma rolagem rotulada
      "Ataque — ..." (padrão já usado em `AcaoPanelContent.tsx`/
      `CombatTab.tsx`) conclui com `critico === 'sucesso'` e inclui o
      nome da arma principal — sem precisar de `categoria` nova no
      `RollContext`. "Reduzir a 0 PV" fica com botão manual "☠ Reduziu
      o alvo a 0 PV?" ao lado de Atacar (`AcaoPanelContent.tsx`), só
      aparece com arma Corpo a Corpo equipada. Os dois caminhos liberam
      a MESMA linha nova "🗡 Cortar" no painel de Ação Bônus
      (`BonusPanelContent.tsx`, mesmo padrão visual/estrutural do
      `ataqueBonus` já existente da Mão Secundária — nova prop
      agrupada `cortar: {disponivel, ataque, onConfirmarReduziuAZero,
      onUsar}` roteada FichaShell → CombatTab → Acao/BonusPanelContent,
      mesmo padrão de `golpeBrutal`), reseta em `fimDoTurno()` igual
      `golpeBrutalUsadoTurno`. Verificado: `tsc -b`/`npm test`
      (596)/`npm run build` limpos + Playwright (Guerreiro com Machado
      Grande equipado e o talento injetado via localStorage — sorteio
      de talento/arma é caro de forçar via UI — confirma "☠ Reduziu a 0
      PV?" → aparece "🗡 Cortar — Machado Grande" na Ação Bônus → usa →
      Ação Bônus marca "USADA" → rola "Ataque — Machado Grande
      (Cortar)" com a arma certa). **Reset no Fim do Turno não
      confirmado via Playwright** (overlay do dado físico não fechou a
      tempo no teste headless) — o código reaproveita literalmente o
      mesmo `fimDoTurno()`/padrão de flag já validado por
      `golpeBrutalUsadoTurno`/`ataqueImprudenteAtivo`, risco baixo.
- [x] **D.5 — Mestre em Escudos** (só o Golpe de Escudo — "Interpor
      Escudo", a Reação que anula dano, ficou de fora: depende de um
      efeito EXTERNO com salvaguarda de Destreza que o app não modela).
      Novo `efeitoMecanico: 'golpe-de-escudo'`. CD fixa "8 + mod.FOR +
      Bônus de Proficiência" (livro, p.207) em `core/golpeDeEscudo.ts`
      (`explicarCdGolpeDeEscudo`, mesmo formato de
      `explicarCdAtaqueDeSopro`), testado (`golpeDeEscudo.test.ts` — 2
      casos: normal + borda mod.FOR negativo). Sem rolagem de dano —
      o efeito é só empurrar/derrubar, então o app apenas MOSTRA a CD
      (com ⓘ de quebra) numa linha nova "🛡 Golpe de Escudo" ao lado de
      Atacar (`AcaoPanelContent.tsx`), só aparece com arma Corpo a
      Corpo + Escudo equipados; ao tocar, marca usado (1x/turno,
      mesmo padrão `golpeBrutalUsadoTurno`/`fimDoTurno()`) e a linha
      some — resolver empurrar/Caído fica na mesa, igual toda
      salvaguarda-do-alvo já existente (Ataque de Sopro/Lançar no
      Inferno). Verificado: `tsc -b`/`npm test` (598)/`npm run build`
      limpos + Playwright (Guerreiro com Espada Longa + Escudo
      equipados e o talento injetado via localStorage — sorteio de
      talento/equipamento é caro de forçar via UI — linha "🛡 Golpe de
      Escudo — CD 10" aparece certa → usa → linha some, confirmando o
      "usado".

**Grupo D fechado** — os 5 talentos viáveis da reaudit de 2026-09
implementados (Resiliente, Especialista Ambidestro, Mestre das Armas,
Mestre em Armas Grandes, Mestre em Escudos), mais as 2 correções de
Maestria em Arma achadas no caminho (crescimento nativo por nível,
troca travada por Descanso Longo). Nenhum talento viável restante na
lista — os 11 movidos pro Backlog (Atleta, Ator, Combatente Montado,
etc.) continuam lá até o app ganhar o motor que falta (Deslocamento/
estado de inimigo/posição).

### Correção pós-Grupo D: pré-requisito de Armadura/Escudo passa a bloquear de verdade

Achado pelo Osmar testando "Mestre em Escudos" no celular: o card só
mostrava um aviso não-bloqueante ("⚠️ Requer: Treinamento com Escudo —
confirme que seu personagem atende"), mesmo o app já tendo o dado de
treinamento de cada classe pra checar de verdade. Proposto restringir a
validação aos 5 talentos cujo pré-requisito de texto livre é
exatamente uma categoria de Treinamento com Armadura/Escudo (mapeável
pra `core/proficienciaArmadura.ts`, já usado em CA/Desvantagem sem
treino) — outros pré-requisitos de texto livre (ex.: "Característica
Conjuração ou Magia de Pacto") continuam só aviso, fora de escopo.
Aprovado pelo Osmar ("Correto").

- [x] `PrerequisitosTalento` ganhou `prerequisitoArmadura?: 'Leve' |
      'Média' | 'Pesada' | 'Escudos'` — campo estruturado e validável,
      diferente de `outro` (texto livre, nunca bloqueia). Aplicado nos
      5 talentos que tinham esse pré-requisito em texto
      (`especialista-em-armaduras-medias`/`-pesadas`,
      `mestre-em-armaduras-medias`/`-pesadas`, `mestre-em-escudos`),
      trocando `outro: "Treinamento com Armadura X"` por `outro: null,
      prerequisitoArmadura: 'X'`.
- [x] `TelaEscolherTalento.tsx`: `motivoIndisponivel()` ganhou uma 3ª
      checagem (depois de nível e atributos), reaproveitando a mesma
      `classeProficienteComArmadura()` já usada pra CA/Desvantagem sem
      treino — sem duplicar lógica de proficiência. Precisou de uma
      nova prop opcional `classe?: Classe` (só os 2 call sites do Level
      Up passam, já tinham `classe` em mãos; o call site do Wizard/
      Origem não passa — nenhum talento de Origem usa
      `prerequisitoArmadura`, então pular a checagem ali é seguro).
      Documentado como padrão reaproveitável em `DECISOES-CLASSES.md`
      ("Talentos — arquitetura final"): pré-requisito de texto livre
      vira campo estruturado sempre que o dado pra validar já existe
      em outro lugar do app.
      Verificado: `tsc -b`/`npm test` (598)/`npm run build` limpos +
      Playwright (Guerreiro, com Escudo — treino de verdade — "Mestre
      em Escudos" aparece disponível, sem aviso nenhum). Bloqueio de
      verdade pra classe SEM treino de Escudo (Bardo/Bruxo/Mago, todos
      sem essa proficiência conforme
      `proficienciasArmaArmaduraClasse.ts`) não confirmado via
      Playwright — o helper de avanço automático do teste não lida bem
      com as telas de Truques/Livro de Magias dessas classes (trava
      tentando selecionar as quantidades exatas); a função reutilizada
      (`classeProficienteComArmadura`) já é testada e usada em produção
      pra CA/Desvantagem, risco baixo — vale confirmar no celular com
      um Bardo/Bruxo/Mago sem Escudo.

### Correção pós-Grupo D: Golpe de Escudo ganha o popup padrão de "salvaguarda do alvo"

Achado pelo Osmar testando "Mestre em Escudos" no celular: Golpe de
Escudo mostrava a CD numa linha solta e marcava "usado" na hora do
toque — sem popup, sem mostrar Sucesso/Falha — diferente de Ataque de
Sopro/Lançar no Inferno/Salvaguarda de Magia, que já tinham esse fluxo
de 2 passos (CD + Sucesso/Falha → jogador resolve na mesa → confirma).
Perguntado se o app trata ataque/salvaguarda como função (sim, `core/`
é 100% função — ver `DECISOES-COMBATE.md`), e proposto: como os 3
modais existentes eram quase idênticos (copiados à mão), extrair 1
componente genérico e fazer Golpe de Escudo virar o 4º consumidor em
vez de criar um 4º modal quase igual. Aprovado pelo Osmar ("sim").

- [x] Novo `SalvaguardaDoAlvoModal.tsx` (título, atributo, CD+ⓘ,
      Sucesso/Falha, até 2 botões de ação opcionais — "Rolar Dano"
      principal/condicional —, texto alternativo quando não há dano) —
      substitui `AtaqueDeSoproModal`/`LancarNoInfernoModal`/
      `MagiaSalvaguardaModal` (removidos), que agora chamam o
      componente único com os textos/CDs próprios de cada caso.
      `core/magiaDano.ts` ganhou `rotuloBotaoDanoMagia()` (formata o
      texto do botão "🎲 Rolar Dano (NdM tipo)") pra não duplicar essa
      formatação entre `MagiasTab.tsx`/`CombatTab.tsx` (os 2 lugares
      que abrem o popup de Salvaguarda de Magia).
- [x] Golpe de Escudo (`AcaoPanelContent.tsx`/`CombatTab.tsx`): a linha
      no painel de Ação simplificou (só o nome, CD saiu da linha —
      agora só aparece dentro do popup) e passou a abrir
      `SalvaguardaDoAlvoModal` ao tocar, marcando o uso (1x/turno) na
      MESMA ação de abrir — mesmo padrão de `abrirAtaqueDeSopro`/
      `abrirLancarNoInferno` (`abrirGolpeDeEscudo()` novo em
      `CombatTab.tsx`). Documentado como padrão reaproveitável em
      `DECISOES-COMBATE.md` ("Salvaguarda do alvo — modal único"): toda
      característica nova desse formato ("CD do jogador, alvo salva")
      usa esse componente, nunca cria um modal próprio.
      Verificado: `tsc -b`/`npm test` (598)/`npm run build` limpos +
      Playwright (Guerreiro com Espada Longa + Escudo equipados e o
      talento injetado via localStorage — sorteio de talento/
      equipamento é caro de forçar via UI — linha "🛡 Golpe de Escudo"
      aparece, sem CD na linha → toca → popup "Golpe de Escudo" mostra
      "Alvo faz salvaguarda de Força", CD 12 com ⓘ, "✅ Sucesso: nada
      acontece" / "❌ Falha: empurra 1,5m ou é derrubado..." → fecha →
      linha some da lista, confirmando o uso marcado). Ataque de
      Sopro/Lançar no Inferno/Salvaguarda de Magia não re-testados via
      Playwright nesta entrega — são só troca de "casca" (mesmos
      textos/CDs/callbacks de antes, só via o componente genérico em
      vez do modal próprio), risco baixo; vale o Osmar confirmar visual
      dos 3 no celular (título, CD, Sucesso/Falha, botão de dano)
      continuam iguais a antes.

### Bug achado pelo Osmar: Fúria do Bárbaro sumiu do painel de Ação Bônus

Não relacionado à entrega de Golpe de Escudo — bug antigo em
`BonusPanelContent.tsx`: a condição que decide "Nenhuma ação bônus
disponível pra este personagem no nível atual" checava várias flags
(`vooDraconicoDisponivel`/`saltoDaNuvemDisponivel`/etc.) mas nunca
incluiu `furiaDisponivel` — ficou faltando desde que Fúria foi
implementada (commit "Bárbaro B3: motor de Fúria"). Resultado: um
Bárbaro nível 1 (só Fúria disponível na Ação Bônus, nada mais) sempre
via a mensagem de vazio em vez do toggle de Fúria.

- [x] Adicionado `!furiaDisponivel` na condição de vazio. Verificado:
      `tsc -b`/`npm test` (598)/`npm run build` limpos + Playwright
      (Bárbaro nível 1 → painel de Ação Bônus mostra "Fúria: 2/2
      disponíveis" + toggle → ativa → pips caem pra 1/2, toggle liga,
      "já ativa — encerre pelo card fixo" aparece).
