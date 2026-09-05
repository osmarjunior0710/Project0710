# EmDev.md

> Plano do foco que está em andamento **agora** (ver ciclo de foco,
> seção 6 do `CLAUDE.md`). Diferente da família `DECISOES-*.md`
> (decisão já tomada, permanente) e de `PENDENCIAS.md` (adiado de
> propósito ou travado estruturalmente), este arquivo é só o checklist
> de trabalho do foco sendo executado agora.
>
> Fica vazio entre focos. Quando um foco fecha (seção 6.3), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco: Espécies (raças) — habilitar as 7 que faltam

Hoje só Anão, Orc e Pequenino estão liberadas. Conferido contra a
planilha (aba Espécies, sem mudança de estrutura) e contra o PDF do
Cap. 4 do Livro do Jogador (fornecido pelo Osmar) — o texto de
`especies.ts` bate 100% com o livro, incluindo as tabelas de
sub-escolha (Herança Dracônica, Linhagem Élfica, Linhagem Gnômica,
Ancestralidade Gigante, Legados Ínferos, Revelação Celestial). Não
falta dado, falta estruturar o texto corrido em campos próprios + tela
de escolha, espécie por espécie.

Ordem de entrega (menor/mais simples primeiro, reaproveitando padrão
sempre que possível — ver 6.1):

- [x] **1. Humano** — sem sub-escolha real, só 3 traços simples:
  - [x] Tamanho (Médio ou Pequeno) — seletor novo de 2 opções, mesmo
        padrão do "Equipamento A ou B" do `OrigemEscolhasStep.tsx`.
  - [x] Hábil (perícia à escolha) — reaproveita o padrão de checkbox
        de `TalentoOrigemEscolhasStep.tsx`.
  - [x] Versátil (talento de Origem à escolha) — reaproveita
        `TelaEscolherTalento.tsx` com `categoria="Origem"`.
  - [x] Marcar `disponivel: true` no dado, tirar do texto "(em breve)".
  - Testado com Playwright (gerador de Personagem de Teste): Humano
    aparece na lista de espécies, perícia e talento escolhidos batem
    na tela de Perfil ("Hábil — escolhida: X", "Versátil — escolhido:
    Y"). `npx tsc -b`, `npm test -- --run` (162 testes) e
    `npm run build` passando.
- [x] **2. Draconato** — piloto da natureza `identidade_permanente`:
      Herança Dracônica estruturada em `Especie.opcoesSubescolha` (novo
      campo genérico, reaproveitável pro Golias), tela de escolha das
      10 cores de dragão na "Escolhas da Espécie", Ataque de
      Sopro/Resistência a Dano resolvidos em tempo de leitura pelo tipo
      de dano da cor escolhida (`core/especieSubescolha.ts`, com
      teste) — nunca duplicado como valor fixo.
  - Testado com Playwright: wizard bloqueia avançar sem escolher a cor
    ("Complete as escolhas da espécie"), tela de escolha mostra as 10
    cores com o tipo de dano de cada uma, e a Ficha (aba Perfil) mostra
    "Herança Dracônica: Cobre"/"Azul" e "Ataque de Sopro (Tipo de dano:
    Elétrico)" resolvidos corretamente pra 2 cores diferentes. `npx tsc
    -b`, `npm test -- --run` (164 testes) e `npm run build` passando.
- [x] **3. Golias** — mesma natureza `identidade_permanente`,
      reaproveitando o padrão do Draconato (Ancestralidade Gigante, 6
      opções — Gelo/Fogo/Pedra/Nuvem/Colina/Tempestade, usos = Bônus de
      Proficiência). Diferença do Draconato: aqui o próprio traço já
      lista as 6 opções por completo (não distribuídas em traços
      separados), então criei a flag `usaDescricaoEfeitoDaSubescolha`
      (vs. `usaTipoDanoDaSubescolha` do Draconato) e centralizei a
      resolução num helper único `core/especieSubescolha.ts`
      (`descricaoTracoResolvida`, com teste) reaproveitado pelo wizard
      e pela Ficha — texto original do traço nunca alterado, só
      complementado com "— Benefício escolhido: X".
  - Testado com Playwright: Golias aparece na lista, e a Ficha mostra
    corretamente "Ancestralidade Gigante — Queimadura de Fogo (Gigante
    de Fogo)" e "Salto da Nuvem (Gigante das Nuvens)" em 2 personagens
    diferentes, com o texto completo do benefício escolhido anexado ao
    fim do card. `npx tsc -b`, `npm test -- --run` (168 testes) e
    `npm run build` passando.
- [x] **4. Elfo** — piloto da natureza `linhagem_com_progressao_magica`:
      Linhagem Élfica (3 opções: Alto Elfo/Drow/Elfo Silvestre), cada
      uma com truque conhecido fixo + 2 magias sempre preparadas
      (níveis de PERSONAGEM 3 e 5, não de classe — `core/magiasEspecie.ts`,
      com teste). Mudanças de maior alcance:
  - `OpcaoIdentidadePermanente` renomeada pra `OpcaoSubescolha`
    (genérica pras 2 naturezas com escolha única na criação) — Golias/
    Draconato continuam funcionando sem alteração de comportamento.
  - `core/conjuracao.ts` (`personagemConjura`) passou a aceitar a
    seleção e contar magia de espécie como fonte própria — sem isso um
    Guerreiro Elfo nunca veria a aba Magias, mesmo tendo truque/magia
    da linhagem (testado e confirmado com teste automatizado).
  - `core/sentidos.ts` (`calcularSentidos`) ganhou parâmetro pra somar
    o sentido da opção de sub-escolha escolhida (Drow: Visão no Escuro
    18m→36m), mesma regra de "usa o maior valor" já existente.
  - Nova seção "Magias da Espécie" na aba Magias, mesmo padrão de
    "Magias de Pacto do Ínfero" (sempre preparada, fora do limite
    normal).
  - "Sentidos Aguçados" (perícia à escolha entre 3 opções) generalizado
    junto com o Hábil do Humano — `opcoesPericia` no traço, mesmo campo
    `periciaEspecieEscolhida`.
  - **Achado no caminho:** "Passos Sem Rastro" (texto oficial do traço)
    não bate com o nome no catálogo de Magias (`"Passo Sem Rastro"`,
    singular) — divergência entre 2 abas da planilha mestra. Usado o
    nome do catálogo pra busca funcionar, comentário no código explica
    — **avisar o Osmar** pra conferir/corrigir na planilha.
  - **Não implementado nesta entrega (fora do pedido original):** a
    escolha de atributo de conjuração (Int/Sab/Car) da Linhagem Élfica
    pra ataque/CD das magias da espécie — nenhuma das 9 magias
    concedidas pelas 3 linhagens precisa disso pra funcionar hoje
    (Fogo das Fadas é a única com CD, ainda sem UI de salvaguarda no
    app). Registrar como pendência quando a auditoria de Magias chegar
    nesse ponto.
  - Testado com Playwright: Guerreiro Elfo (classe sem magia) nível 5
    mostra a aba Magias com o truque + as 2 magias da linhagem
    sorteada (testado com Alto Elfo/Elfo Silvestre/Drow em rodadas
    diferentes); Drow mostra Visão no Escuro 36m na aba Atributos.
    `npx tsc -b`, `npm test -- --run` (180 testes) e `npm run build`
    passando.
- [x] **5. Gnomo** — mesma natureza, versão mais simples (Linhagem
      Gnômica, 2 opções, só nível 1, sem progressão 3/5). Reaproveitou
      100% o mecanismo do Elfo, só generalizando 2 pontos que o Elfo
      não precisava:
  - `truqueConhecido` (1 truque) virou `truquesConhecidos: string[]`
    — Gnomo das Rochas concede 2 (Prestidigitação Arcana + Reparar).
  - Novo `magiaNivel1` em `OpcaoSubescolha`/`core/magiasEspecie.ts` —
    Gnomo do Bosque (Falar com Animais) já vem desde a criação, não
    espera nível 3 como o Elfo.
  - Testado com Playwright: Gnomo das Rochas mostra os 2 truques com
    "Usar" habilitado (Ação, sem gastar espaço); Gnomo do Bosque no
    nível 1 já mostra Ilusão Menor + Falar com Animais (1º círculo).
    `npx tsc -b`, `npm test -- --run` (183 testes) e `npm run build`
    passando.
- [x] **6. Tiferino** — mesma natureza, reaproveitando o padrão de
      Elfo/Gnomo (Legados Ínferos: Abissal/Ctônico/Infernal, progressão
      3/5 como Elfo). Único caso novo: "Presença Sobrenatural" concede
      Taumaturgia pra QUALQUER Tiferino, independente do legado — novo
      campo `Especie.truqueFixo` (junta com os truques da linhagem em
      `truquesEspecie()`). Zero mudança nas telas (wizard/Perfil/
      gerador de teste já eram 100% genéricos desde o Gnomo).
  - Testado com Playwright: as 9 espécies não-Aasimar já disponíveis;
    Tiferino Ctônico mostra Taumaturgia (fixo) + Toque Necrótico
    (legado) + Vitalidade Vazia (nível 3) + Raio do Enfraquecimento
    (nível 5) na aba Magias, e "Legado Ínfero: Ctônico" resolvido na
    aba Perfil. `npx tsc -b`, `npm test -- --run` (185 testes) e
    `npm run build` passando.
- [x] **7. Aasimar** — decisão do Osmar: habilitar a espécie AGORA
      (`disponivel: true`) mesmo sem a mecânica ativa pronta, deixando
      os 2 traços ativos (Mãos Curativas, Revelação Celestial) como
      características ganhas/texto na Perfil por enquanto — mesmo
      tratamento que todo outro traço ativo ainda não mecanizado (ver
      item 8). Único pedaço que dava pra ligar sem esperar Combat:
      Portador da Luz (truque Luz, igual pra qualquer Aasimar,
      independente da Revelação Celestial) — reaproveitou o
      `Especie.truqueFixo` criado pro Tiferino, então já aparece na aba
      Magias/soma pra "Guerreiro Aasimar também conjura" igual aos
      outros casos.
  - Testado com Playwright: as 10 espécies do Livro do Jogador
    aparecem na lista (nenhuma mais "em breve"); Aasimar mostra "Luz"
    na aba Magias e os 5 traços como texto na Perfil (sem linha de
    "sub-escolha", já que Revelação Celestial não é escolhida no
    wizard). `npx tsc -b`, `npm test -- --run` (187 testes) e
    `npm run build` passando.
- [ ] **8. Traços ATIVOS de espécie em Combat** — achado no meio do
      foco (Ataque de Sopro do Draconato só aparecia como texto na aba
      Perfil, igual todo outro traço — nenhum traço ativo de espécie
      tinha botão/ação em Combat). Decisão do Osmar: fechar tudo agora,
      nesta mesma sessão, sem pausar entre as espécies. Ordem de
      entrega (menor/mais reaproveitável primeiro):

  - [x] **8a. Anão — Conhecimento de Pedras** + **Orc — Pico de
        Adrenalina e Vigor Implacável** — mesmo padrão de "Ação Bônus
        com usos = Bônus de Proficiência" já existente (Recuperar
        Fôlego do Guerreiro), 2 cards novos em `BonusPanelContent.tsx`.
        Vigor Implacável é reativo (sem botão) — hook direto em
        `alterarPv()` (`core/vigorImplacavel.ts`, com teste), com
        status mostrado na aba Atributos. Testado com Playwright: Anão
        nível 5 mostra "Conhecimento de Pedras 3/3", decrementa ao
        usar; Orc mostra "Pico de Adrenalina 3/3" que aplica +3 PV
        Temporário (Bônus de Proficiência) e trava o botão "Bônus" do
        turno; Vigor Implacável aparece "DISPONÍVEL" na aba Atributos.
        `npx tsc -b`, `npm test -- --run` (191 testes) e `npm run
        build` passando.
  - [x] **8b. Pequenino — Sorte** — reroll no d20 quando sai 1, em
        QUALQUER teste de d20 (não só atributo/salvaguarda, diferente
        do Bônus Extra) — variante nova no `RollContext.tsx`
        (`sorteDisponivel`/`registrarSorte`/`usarSorte`), botão "🍀
        Sorte — jogar de novo" no `RollOverlay.tsx` ao lado de
        Vantagem/Desvantagem, sem limite de usos (regra real), só 1x
        por rolagem mesmo que o novo resultado também seja 1
        (`sorteUsada`). Testado com Playwright forçando `Math.random`
        pra garantir o 1 e depois o reroll: Pequenino mostra o botão e
        o resultado muda de 1→11 ao usar; Humano (controle) não mostra
        o botão. `npx tsc -b`, `npm test -- --run` (191 testes) e
        `npm run build` passando.
  - [x] **8c. Draconato — Ataque de Sopro + Voo Dracônico** — Ataque
        de Sopro reaproveita 100% o padrão visual/mecânico de "Lançar
        no Inferno" (novo `AtaqueDeSoproModal.tsx`, mesmo CSS): card
        de nível superior na aba Combat (fora dos painéis Ação/Bônus/
        Reação, igual Lançar no Inferno), CD = 8 + mod. Constituição +
        Bônus de Proficiência (`core/ataqueDeSopro.ts`, dados escalam
        1d10→4d10 por nível, com teste), tipo de dano resolvido pela
        cor de dragão já escolhida (`tipoDanoSubescolha`, reaproveitado
        do Draconato). Voo Dracônico é um toggle simples (1x/Descanso
        Longo, nível 5+) no molde do Recuperar Fôlego, sem dado. Testado
        com Playwright: Draconato nível 5 mostra "Ataque de Sopro 3/3",
        modal com "CD 14" e "2d10 de dano Elétrico" corretos pra cor
        Azul, "Rolar Dano" aciona o RollOverlay compartilhado (16 no
        2d10), usos decrementam pra 2/3; "Voo Dracônico" aparece no
        painel Bônus. `npx tsc -b`, `npm test -- --run` (195 testes) e
        `npm run build` passando.
  - [x] **8d. Golias — Ancestralidade Gigante + Forma Grande** — as 6
        ancestralidades compartilham 1 pool de usos (= Bônus de
        Proficiência, Descanso Longo) mas caem em 3 locais de UI
        diferentes conforme a opção escolhida na criação: Arrepio do
        Gelo/Queimadura de Fogo/Tombo da Colina viram card de nível
        superior em Combat (toque ao acertar, igual Ataque de Sopro/
        Lançar no Inferno); Salto da Nuvem entra no painel Bônus
        (teleporte, sem dado); Resistência da Pedra/Trovão da
        Tempestade entram no painel Reação (`ReacaoPanelContent.tsx`,
        mesmo padrão do Contra-Encantamento). Forma Grande é o toggle
        simples de sempre (1x/Descanso Longo, nível 5+, molde do Voo
        Dracônico) no painel Bônus. Testado com Playwright forçando
        `Math.random` pra fixar cada ancestralidade: Arrepio do Gelo
        rola 1d6 e mostra "3/3 usos" no card de nível superior; Salto
        da Nuvem e Forma Grande aparecem certos no painel Bônus (usa
        decrementa 3/3→2/3, Forma Grande marca "já usado" depois de 1
        uso); Resistência da Pedra rola "1d12 + 1" (mod. Constituição)
        no painel Reação e marca a Reação do turno como "usada".
        `npx tsc -b`, `npm test -- --run` (195 testes) e `npm run
        build` passando.
  - [x] **8e. Aasimar — Mãos Curativas + Revelação Celestial** — Mãos
        Curativas é card no painel Ação (Usar Magia), rola Xd4 (X =
        Bônus de Proficiência), 1x/Descanso Longo. Revelação Celestial
        é a 1ª mecânica `escolha_reutilizavel` de verdade: card no
        painel Bônus abre uma tela com as 3 formas (Asas Celestiais/
        Manto Necrótico/Transfiguração Radiante) — cada uma com o texto
        completo do efeito, reaproveitando o mesmo componente
        `opt-card`/`opt-card-desc` já usado nos cards de sub-escolha do
        wizard (pedido do Osmar: nunca esconder o efeito atrás de um
        modal minúsculo). Escolhida a forma, o app não segue tempo real
        (a transformação dura "1 minuto ou até encerrar" no livro) —
        então em vez de contar minuto, o painel Bônus passa a mostrar
        um bloco fixo "🔒 Transformado: X" com o texto completo da
        forma, como lembrete, até o Descanso Longo resetar (mesmo
        Descanso que devolve o uso). As 3 opções entraram em
        `especies.ts` como `opcoesSubescolha` novo helper
        `opcoesEscolhaReutilizavel()` em `core/especieSubescolha.ts`
        busca essas opções sem misturar com os *Subescolha escolhidos
        no wizard (`opcoesSubescolhaNoWizard`). Testado com Playwright:
        Aasimar nível 5 mostra "Mãos Curativas — 3d4" no painel Ação
        (rola 11, marca Ação como usada); painel Bônus mostra "Revelação
        Celestial", ao tocar abre as 3 formas com texto completo e CD
        do Manto Necrótico calculada certa (14 = 8 + mod. Carisma +
        Bônus de Proficiência); escolher Manto Necrótico grava a
        lembrança no painel Bônus e marca a Ação Bônus do turno como
        usada. `npx tsc -b`, `npm test -- --run` (195 testes) e `npm
        run build` passando.
  - [x] **8f. Gnomo do Bosque — Falar com Animais grátis** — a magia
        concedida pelo traço é conjurável sem gastar Espaço de Magia um
        número de vezes = Bônus de Proficiência (Descanso Longo), mas
        antes disso o app tratava ela igual a qualquer magia normal de
        1º círculo — exigindo um Espaço de Magia de verdade, o que
        travava totalmente quem não tem espaço (ex.: Guerreiro Gnomo do
        Bosque). Correção: criada uma 2ª entrada no catálogo de magias,
        **"Falar com Animais - Traço de Gnomo"** (mesmo efeito, nome
        próprio pra nunca colidir com a "Falar com Animais" que um
        conjurador de verdade, ex. Druida, já conhece pela classe — se
        o personagem tiver as duas, aparecem como 2 linhas separadas,
        cada uma com sua própria regra de custo). Essa entrada saiu da
        lista genérica de "Usar Magia" (que sempre pede Espaço de
        Magia) e ganhou card e contador PRÓPRIOS no painel Ação, igual
        Mãos Curativas do Aasimar — continua listada em "Magias da
        Espécie" na aba Magias só como referência. Testado com
        Playwright: Gnomo do Bosque nível 5 mostra "Falar com Animais
        (Traço de Gnomo)" com 3/3 usos no painel Ação; tocar marca a
        Ação do turno como usada e fecha o painel com o lembrete. `npx
        tsc -b`, `npm test -- --run` (195 testes) e `npm run build`
        passando.

Item 8 fechado — todas as espécies com traço ATIVO em Combat têm
mecânica funcional (Gnomo das Rochas continua só descritivo de
propósito, fabricar dispositivo é utilidade/downtime, não combate).

  **Só passivo/descritivo — não precisa de UI em Combat, texto na
  aba Perfil já resolve:** Visão no Escuro (todas — já é
  `sentidoConcedido`), Resistência a Toxinas/Celestial/a Dano,
  Corajoso, Agilidade Pequenina, Furtividade Natural,
  Eficiente, Ancestralidade Feérica, Sentidos Aguçados, Transe,
  Astúcia de Gnomo, Porte Poderoso, Presença Sobrenatural, Portador da
  Luz (concede truque — entra na lista de magias normal, não é UI de
  espécie própria), benefício de nível 1 de Linhagem Élfica/Legado
  Ínfero (Alto Elfo/Drow/Elfo Silvestre e os 3 Legados Ínferos — truque
  concedido + efeito passivo, sem botão de ativar).

- [x] **9. Tenacidade Anã (Anão) não afetava PV máximo** — achado pelo
      Osmar depois do item 8 fechar: essa característica tinha sido
      classificada como "só passivo/descritivo" (lista acima), mas na
      real ela MUDA um número (PV máximo +1 no nível 1, e mais +1 a
      cada Level Up) — não é só texto, é cálculo que faltava em
      `core/calculoPersonagem.ts` (nova `bonusPvPorNivelDaEspecie`,
      testada) e nos 3 lugares que somam PV ganho por nível
      (`LevelUpShell.tsx` — Level Up de verdade —,
      `core/levelUpAleatorio.ts` — Level Up Rápido ⚡ — e
      `core/geradorPersonagemTeste.ts` — Personagem de Teste). O popup
      ⓘ de PV máximo (`explicarPvMaximoNivel1`/`explicarPvMaximo`)
      também não citava o bônus, então mesmo cabendo, o número certo
      não tinha como ser conferido. Testado com Playwright: Anão
      Guerreiro CON 14 nível 1 mostra PV 13/13 (10 do dado d10+mod CON,
      +1 Tenacidade Anã) com o popup ⓘ citando "+ Tenacidade Anã";
      Level Up Rápido pra nível 2 (CON 8, -1) soma +6 (média d10 6 -1
      +1 Tenacidade Anã), popup mostra "Ganho em Level Ups seguintes
      +6" = 16 total. `npx tsc -b`, `npm test -- --run` (198 testes,
      3 novos) e `npm run build` passando.

**Lição pro processo:** "não precisa de UI em Combat" não é o mesmo
teste que "é puramente descritivo" — uma característica pode não ter
botão nenhum pra apertar e AINDA ASSIM alterar um número que o core
calcula (CA, PV, iniciativa, etc.). Releia a `descricao` de cada traço
"passivo" com essa pergunta em mente antes de arquivar como só-texto.

Depois do item 9, o Osmar pediu uma auditoria completa das 10 espécies
(todo bônus, implementado ou não) — feita em resposta no chat, achou
mais 1 bug real (item 10) e 1 pendência (Inspiração Heroica do Humano,
que o Osmar vai definir como implementar antes da gente mexer).

- [x] **10. Porte Poderoso (Golias) não afetava Capacidade de Carga**
      — mesma categoria de bug do item 9: o traço "conta como 1 tamanho
      maior" pra Capacidade de Carga, um número real que o app já
      calculava (`core/mochila.ts`), mas a fórmula nunca lia isso —
      sempre usava o multiplicador de Pequeno/Médio (×7 kg), mesmo pra
      Golias. Corrigido lendo a tabela oficial completa (Pequeno/Médio
      ×7, Grande ×13,5, Enorme ×27, Colossal ×54,5 — já confirmada em
      DECISOES-FICHA.md) e contando "passos de tamanho acima do
      padrão": Porte Poderoso sempre soma 1 passo (Golias vira Grande
      só pra esse cálculo). Forma Grande (traço separado, 10 min ou até
      encerrar) soma outro passo ENQUANTO ativa — como o app não segue
      tempo real, vira um **toggle** de verdade na Ficha (ligar/
      desligar manual, não um botão de uso único): ligar gasta o uso
      (1x/Descanso Longo) e desligar não devolve, só o Descanso Longo
      desliga sozinho e devolve o uso junto. Toggle novo reaproveita o
      mesmo estilo visual do switch "Detalhes" do painel lateral (CSS
      movido pra `PanelRows.module.css` pra virar reaproveitável).
      Testado com Playwright: Golias FOR 8 nível 5 mostra Capacidade
      Máxima 108 kg (8 × 13,5, Porte Poderoso) com o popup ⓘ explicando
      "conta 1 tamanho acima... + Porte Poderoso"; ligar Forma Grande
      no painel Bônus mostra o switch aceso e a Capacidade de Carga na
      aba Mochila sobe pra 216 kg (8 × 27, Enorme = 2 tamanhos acima).
      `npx tsc -b`, `npm test -- --run` (203 testes, 5 novos) e `npm
      run build` passando.

- [x] **11. Inspiração Heroica (Humano/universal)** — SDD lido e
      validado com o Osmar antes de codar (`17ef8e54-sddinspiracaoheroica.md`).
      Recurso universal, flag booleano (nunca contador — "nunca mais
      de uma de cada vez"). Layout da aba Atributos mudou: Nível +
      botões de Level Up (agora só ícone ⬆️/⚡, sem texto, pra caber)
      dividem a linha com PV; a antiga posição do PV na segunda linha
      virou a caixa nova "Ins. Her." (boolean, toque liga/desliga —
      representa concessão do Mestre, já que o app não tem modo
      Mestre). Humano (traço Eficiente) liga sozinho a cada Descanso
      Longo, sem nunca desligar sozinho. Efeito implementado (por
      enquanto só em rolagens de D20, ver Backlog.md pra dano): igual
      ao padrão já usado pela Sorte do Pequenino (`RollContext.tsx`/
      `RollOverlay.tsx`) — se `disponivel`, qualquer d20 concluído (sem
      Vantagem/Desvantagem em jogo) ganha o botão "✨ Inspiração
      Heroica" com o texto menor "Rola dado novamente e fica com novo
      valor"; usar reroga o dado e desliga o flag. Criado `Backlog.md`
      (regra de atualização em CLAUDE.md seção 17) pra guardar melhoria
      conhecida mas não prioritária agora — primeira entrada é o
      próprio reroll de dano da Inspiração Heroica. Testado com
      Playwright: caixa "Ins. Her." liga/desliga tocando; ao rolar
      Iniciativa com ela ligada aparece o botão novo ao lado de
      Vantagem/Desvantagem; usar reroga o d20 e a caixa volta pra "—";
      Humano nível 1 mostra "—" antes do Descanso Longo e "✨ Sim"
      depois. `npx tsc -b`, `npm test -- --run` (203 testes) e `npm
      run build` passando.
      **Ajuste pedido pelo Osmar na hora:** "Sim/—" em texto não
      parecia um controle tocável — trocado por 1 pip (`TickPips`,
      mesmo padrão visual de todo contador de uso do app: azul = tem,
      cinza = não tem). Removido também o emoji 🎲 do valor de
      Iniciativa na aba Atributos (só o número, sem o dado).
