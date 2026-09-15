# EmDevB.md

> Arquivo desta conta (branch `claude/read-claude-md-c75hsf` — ver
> seção 14.1 do `CLAUDE.md`). A conta principal usa `EmDev.md` — nunca
> escreva lá a partir desta branch, mesmo que ele apareça aqui depois
> de um merge (nesse caso o conteúdo é da outra conta, só chegou junto).
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

## Foco: Bárbaro — 5ª classe implementada

Próxima classe depois de Guerreiro/Bardo/Bruxo/Mago (aprovado pelo
Osmar). Chapéu 1 (PM) e chapéu 2 (Game Designer/SDD, só a Fúria — o
resto da progressão/subclasses não precisou de SDD próprio) já
concluídos e aprovados. Documento: `sdd/sdd-barbaro-furia.md`.

**Osmar não tinha em mãos a decupagem externa do Bárbaro nem o guia de
Golias** (mencionados em `PENDENCIAS.md`) — seguindo só com a planilha
mestra (já tem toda a progressão + as 4 Trilhas) e o Cap. 3 do Livro
do Jogador (PDF `04a_-_Cap_3_Classes_de_Personagem_Barbaro_a_Feiticeiro.pdf`).

**Decisões confirmadas (ver SDD pra detalhe completo):**
- Fúria: Caminho Simplificado — fica ativa até "Encerrar Fúria" (ou
  Armadura Pesada), sem tentar detectar "atacou neste turno".
- UI: ativar continua no painel Ação Bônus (gasta 1 uso); card fixo
  sempre visível em Combat mostra "Fúria: ATIVA" + bônus + botão
  Encerrar.

### Plano de entregas

- [x] **B1 — Dado no banco:** `classes.ts` (progressão nível 1-20,
      recursos Fúrias/Dano da Fúria/Maestria em Arma, `disponivel:
      false`), `caracteristicasClasse.ts` (as 20 características base,
      3 células limpas de conteúdo colado de outra aba da planilha —
      Maestria em Arma/Conhecimento Primordial/Campeão Primitivo, ver
      comentário no arquivo), `subclasses.ts` (as 4 Trilhas, só nome/
      id por enquanto — características de cada uma entram em
      B5-B8). Achado no caminho: `ClasseStep.tsx` tinha uma lista
      hardcoded (`CLASSES_EM_BREVE`) desatualizada, com "Mago"
      duplicado (já tinha virado `disponivel: true` no dado real, mas
      continuava também na lista hardcoded — 2 cards, 1 clicável e 1
      cinza) — corrigido junto (removido Mago e Bárbaro do hardcoded,
      já que Bárbaro agora vem do dado real também). Verificado com
      `tsc -b`/`npm test` (512)/`npm run build` limpos + tela de
      criação de personagem: "Bárbaro" aparece 1x só (em breve),
      "Mago" aparece 1x só (não mais duplicado), zero erro de console.
- [x] **B2 — Habilitado na criação (wizard):** `classesProficienciasIniciais.ts`
      (2 perícias de {Atletismo, Intimidação, Lidar com Animais,
      Natureza, Percepção, Sobrevivência}, equipamento A: 4
      Machadinhas + Machado Grande + Kit de Aventureiro + 15 PO / B:
      75 PO) + `classes.ts` virou `disponivel: true`. Proficiência de
      arma/armadura já vinha pronta em `proficienciasArmaArmaduraClasse.ts`
      (toda a planilha "Proficiências de Classe" já tinha sido
      importada antes, pras 12 classes de uma vez).
      **2 achados corrigidos no caminho** (bugs reais, não deixados
      pra depois):
      1. `armasParaMaestria` (`core/maestriaArma.ts`) devolvia o
         catálogo de armas INTEIRO (incluindo à distância) pra
         qualquer classe com proficiência "Armas Simples e Marciais" —
         certo pro Guerreiro, errado pro Bárbaro (a característica
         real restringe a Corpo a Corpo). Filtrado por nome de classe
         (só essa exceção existe hoje) + teste novo.
      2. `calcularCAEquipado`/`explicarCAEquipado` (`core/calculoPersonagem.ts`)
         não tinham NENHUM tratamento pra "Defesa sem Armadura" (CA
         sem armadura = 10 + DES + CON, não só 10 + DES) — gap nunca
         exposto antes porque nenhuma classe implementada tinha essa
         característica. Novo ID estável
         `ID_CARACTERISTICA_CLASSE.defesaSemArmadura` +
         `temDefesaSemArmadura(classe)` (checa a progressão, não o
         nível — a característica é sempre nível 1) + 2 novos params
         `conValor` nas 2 funções (só 1 call site em `FichaShell.tsx`,
         atualizado) + 3 testes novos (com/sem armadura, e confirma
         que Guerreiro continua sem somar CON).
      Verificado com `tsc -b`/`npm test` (516)/`npm run build` limpos
      + criado um Bárbaro de verdade pelo wizard (2 Maestrias de
      arma Corpo a Corpo, 2 perícias, equipamento A) e também via
      "🎲 Personagem de Teste" (nível 5, Golias) — CA bateu com
      10+DES+CON sem armadura, popup "ⓘ" mostra a linha "mod.
      Constituição (Defesa sem Armadura)" certinha, zero erro de
      console.
- [x] **B3 — Motor de Fúria:** `core/recursosClasse.ts` ganhou
      `quantidadeFuria`/`bonusDanoFuria` (+ testes). `core/ataque.ts`
      ganhou o parâmetro `bonusDanoSeForca` nas 4 funções de ataque
      (`ataqueDesarmado`, `ataqueComArma`, `ataqueAtual`,
      `ataqueBonusMaoSecundaria`) — soma sozinho quando o ataque usa
      Força de verdade (nunca à distância; em Acuidade só quando Força
      ≥ Destreza; nunca com `atribForcada`, ex. Pacto da Lâmina) — SDD
      seção 5 atualizada pra registrar essa escolha de implementação
      (não precisou expor `atributoUsado` em `AtaqueResolvido`). Novos
      campos `furiaGasto`/`furiaAtiva` em `PersonagemSalvo`.
      `FichaShell.tsx`: `usarFuria()` (toggle igual à Forma Grande, mas
      com banco contado + trava de Armadura Pesada pra ATIVAR),
      `equiparItem` encerra a Fúria sozinha ao equipar Armadura Pesada
      enquanto ativa, `descansoCurto` devolve 1 uso (sem desligar),
      `descansoLongo` zera gasto e desliga. `CombatTab`/
      `BonusPanelContent`: linha de ativar no painel de Ação Bônus
      (só ativa — desligar é sempre pelo card fixo) + card fixo sempre
      visível na tela principal do Combate (decisão já confirmada),
      mostrando "Fúria: ATIVA" + efeitos + botão "Encerrar Fúria"
      quando ativa, ou "N de M usos disponíveis" quando não.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (529)/`npm run build` limpos + Playwright num Bárbaro nível 5 de
      teste (Modo de Teste ligado pra dado determinístico): card
      correto antes/depois de ativar, painel de Bônus mostra "já
      ativa" quando tenta reabrir, dano da Fúria somado de verdade
      (personagem com FOR −1 rolou "1d1 + 1" com Fúria ativa = −1 + 2,
      bate com `bonusDanoFuria` no nível 5), equipar Cota de Malha
      (Armadura Pesada) encerrou a Fúria sozinha sem devolver o uso,
      Descanso Curto devolveu 1 uso sem desligar a Fúria já ativa,
      Descanso Longo zerou usos gastos e desligou. Zero erro de
      console.
- [x] **B3.1 — Ajustes de UI no card de Fúria (feedback do Osmar
      testando no celular):** texto dos efeitos quebrado em 3 linhas
      (Resistência / Dano da Fúria / Vantagem, em vez de 1 parágrafo
      só); botão "Encerrar Fúria" perdeu o `padding`/`fontSize`
      reduzidos que deixavam ele "maior que o texto" (volta ao `.btn`
      padrão) e ganhou destaque vermelho suave (fundo/borda). Charme
      novo pedido pelo Osmar: enquanto a Fúria está ativa, uma vinheta
      vermelha pulsa nas bordas da tela (degradê transparente no
      centro → vermelho nos últimos pixels) com 16 partículas fixas
      emanando de fora pra dentro pelas 4 bordas — tudo
      `position: fixed`/`pointer-events: none`/`z-index: -1` (mesmo
      raciocínio do `.piscadaOverlay` já existente, só que atrás de
      tudo em vez de na frente), então nunca atrapalha toque em botão.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (529)/`npm run build` limpos + Playwright: vinheta some ao
      encerrar a Fúria, botão continua clicável através da camada
      decorativa.
- [x] **B4.0 — Fundação: Salvaguardas de verdade (pré-requisito pro
      resto do B4).** Achado no caminho ao planejar B4: o app nunca
      distinguia "teste de atributo" de "salvaguarda" — o box FOR/DES/
      CON/INT/SAB/CAR sempre rolava só o mod., sem nunca somar o Bônus
      de Proficiência mesmo pra classe proficiente naquela salvaguarda
      (ex.: Bárbaro é proficiente em FOR/CON, mas isso nunca entrava
      em nenhum cálculo). Decisão do Osmar: criar a distinção de
      verdade agora, não deixar textual/adiado — importa pra Sentido
      de Perigo, Força Indomável e a própria Vantagem de Força da
      Fúria (nível 1, hoje só textual no card). Implementado:
      `core/calculoPersonagem.ts` ganhou `calcularSalvaguardas`
      (+ tipo `SalvaguardaFinal`, + 3 testes) — soma o Bônus de
      Proficiência só quando a **classeOriginal** (nunca classe extra
      de multiclasse) tem aquela salvaguarda; confirmado nos PDFs
      (Cap. 2 "Multiclasse" + a seção "Como um Personagem Multiclasse"
      de cada classe no Cap. 3) que salvaguarda NUNCA vem de
      multiclasse, só da 1ª classe. `AtributosTab.tsx` ganhou 6 linhas
      novas ("Salvaguarda de Força/Destreza/.../Carisma") no topo da
      lista de Perícias, mesmo padrão de linha/rolagem/popup "ⓘ" já
      usado por Perícias. Os 6 boxes de atributo (FOR/DES/.../CAR) no
      topo continuam iguais — só teste de atributo, sem proficiência.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (532)/`npm run build` limpos + Playwright num Bárbaro nível 5
      (FOR 14/CON 17, prof +3): Salvaguarda de Força mostrou 🔵 +5
      (mod +2 + prof +3), Constituição 🔵 +6, as outras 4 ⚫ sem
      bônus, popup "ⓘ" com a conta explicada linha a linha.
- [x] **B4.1 — Ataque Imprudente + Sentido de Perigo (nível 2).**
      **Regra nova do processo a partir daqui** (pedido do Osmar,
      2026-09, ver CLAUDE.md §6.4): toda entrega do B4 em diante
      passa por proposta técnica + "ok" do Osmar antes de codar —
      B4 vira uma sequência de sub-entregas (B4.1, B4.2, ...), não 1
      entrega grande só.
      **Ataque Imprudente:** decidido só na 1ª jogada de ataque do
      turno — tocar "🗡 Atacar" abre um mini-picker in-panel ("Ataque
      Normal"/"😤 Ataque Imprudente", mesmo padrão `if (escolhendo)
      return (...)` já usado pela Revelação Celestial) só quando
      `ataquesFeitos === 0` e a classe tem a característica; escolher
      qualquer uma já rola o ataque na hora. Fica ativo o TURNO
      INTEIRO (reseta no Fim do Turno) — Ataque Extra não pergunta de
      novo, só aplica a Vantagem sozinho. Exposto `usouForca: boolean`
      em `AtaqueInfo` (já existia como variável interna em
      `ataqueComArma`/`ataqueDesarmado`, usada pro bônus da Fúria — só
      nunca saía pra fora; zero regra nova, só plumbing) — a Vantagem
      só entra quando o ataque específico usa Força de verdade.
      **Sentido de Perigo:** passivo, Vantagem na linha "Salvaguarda de
      Destreza" (mostra "(Vantagem — Sentido de Perigo)" na própria
      linha) sempre que a classe base tiver a característica.
      **Nova função `resolverVantagem`** (`core/calculoPersonagem.ts`,
      + 4 testes): combina 2 fontes de Vantagem/Desvantagem numa rolagem
      só — regra real, se coincidirem se cancelam. 1ª vez que o app
      precisa disso (Ataque Imprudente/Sentido de Perigo podem coincidir
      com a Desvantagem de Armadura sem treino). IDs novos em
      `idsCaracteristicasClasse.ts` (`sentidoDePerigo`,
      `ataqueImprudente`). Novo campo persistido
      `ataqueImprudenteAtivoTurno` (mesmo padrão de `surtoUsadoTurno`).
      Verificado com `tsc -b --force`/`npm test -- --run`
      (536)/`npm run build` limpos + Playwright: picker aparece só na
      1ª jogada do turno, 2ª jogada (Ataque Extra) já aplica Vantagem
      sozinha sem picker de novo, reseta no Fim do Turno (picker
      reaparece no turno seguinte), Salvaguarda de Destreza rola com
      Vantagem mostrando o rótulo certo no popup/modal.
- [x] **B4.2 — Conhecimento Primordial (nível 3).** Perícia extra à
      escolha (lista de `proficienciasIniciaisClasse[Bárbaro].periciasEscolha.opcoes`
      reaproveitada — mesma do nível 1 — filtrada contra o que já é
      proficiente) + usar Força no lugar do atributo normal em
      Acrobacia/Furtividade/Intimidação/Percepção/Sobrevivência
      enquanto a Fúria estiver ativa.
      `core/calculoPersonagem.ts`: `calcularPericias` ganhou o
      parâmetro `substituicaoForca?: { ativa, mod, pericias }` — troca
      só o mod. usado (Bônus de Proficiência continua igual), com
      rótulo próprio no popup ("mod. Força (Conhecimento Primordial)")
      + 4 testes novos. `LevelUpShell.tsx`: novo passo
      `conhecimentoPrimordial` (mesmo padrão de tela de
      `proficienciasBonus`), único, permanente, só aparece se a classe
      desbloqueou a característica e ainda não tem a perícia
      escolhida. `FichaShell.tsx`: novo estado
      `conhecimentoPrimordialPericiaEscolhida` (persistido), computa
      `temConhecimentoPrimordial` e passa `substituicaoForca` pro
      `calcularPericias` com `ativa: temConhecimentoPrimordial &&
      furiaAtiva`. Novo ID `ID_CARACTERISTICA_CLASSE.conhecimentoPrimordial`.
      **Achado no caminho, corrigido junto:** a ferramenta "⚡ Inst.
      Level Up" (`core/levelUpAleatorio.ts`, sorteia todo Level Up pra
      teste rápido) não sabia dessa escolha nova — sem o ajuste, todo
      Bárbaro criado por ali ficaria pra sempre sem a perícia extra.
      Adicionado `conhecimentoPrimordialPericiaEscolhida` no sorteio,
      mesmo padrão já usado ali pra `periciasSubclasseBonusEscolhidas`
      (lista fixa pequena, sorteia 1 de verdade em vez de deixar
      `null`).
      Verificado com `tsc -b --force`/`npm test -- --run`
      (540)/`npm run build` limpos + Playwright: Bárbaro nível 2 →
      "⚡ Inst. Level Up" → nível 3 ganhou "Sobrevivência" como nova
      perícia proficiente (⚫→🔵); ativar Fúria trocou as 5 perícias
      pra "(FOR)" na lista, com o mod. de Força certo (bônus de
      proficiência preservado onde já tinha); "Encerrar Fúria" reverteu
      as 5 de volta pro atributo/mod. original.
      **Achado à parte, corrigido em seguida (ver B4.2.1 abaixo):** o
      fluxo real de Level Up (setinha ⬆️, não o raio de teste) travava
      no passo "Escolha sua Subclasse" ao chegar no nível 3 — nenhuma
      das 4 Trilhas do Bárbaro está implementada ainda (isso é o
      B5-B8), e o passo de subclasse não deixava avançar sem escolher
      uma travada. Corrigido pra pular o passo em vez de travar — ver
      B4.2.1.
- [x] **B4.2.1 — Corrige o Level Up travando no passo de Subclasse
      (pedido do Osmar, testando o B4.2).** `LevelUpShell.tsx`: o
      passo `'subclasse'` só entra na sequência (`luSteps`) se sobrar
      pelo menos 1 subclasse da classe com `subclasseImplementada(...)
      === true` — antes checava só se a classe tinha ALGUMA subclasse
      cadastrada (implementada ou não), o que trava pra sempre quando
      todas estão travadas (caso do Bárbaro hoje: as 4 Trilhas têm
      dado mas nenhuma tem mecânica). A validação do botão "Avançar"
      (mesma tela) ganhou a mesma checagem, pra ficar consistente.
      Continua null até a 1ª Trilha ser implementada (a condição já
      cobre isso: só pula quando `!personagem.subclasse`) — quando
      isso acontecer, o passo reaparece sozinho pro próximo Level Up
      de quem ainda não escolheu. Mesmo padrão que `sortearLevelUpRapido`
      (raio de teste) já usava (filtra por implementada, deixa `null`
      se nenhuma). Verificado com `tsc -b --force`/`npm test --
      run`/`npm run build` limpos + Playwright: Bárbaro nível 2 → XP
      até o marco → "⬆️ Level Up" de verdade (não o raio) → PV →
      "Novas Características" → pula direto pra "Conhecimento
      Primordial" (sem tela de Subclasse no meio) → Resumo (sem linha
      de Subclasse) → Confirmar → ficha em nível 3, sem travar em
      nenhum passo.
      Osmar: pra testar essa correção no celular, usa um Bárbaro de
      nível 2, abre o popup de XP (toca no texto "X/Y XP" na aba
      Atributos), "➕ Adicionar" 900 XP, fecha o popup, toca a setinha
      "⬆️ Level Up" que aparece — o passo de Subclasse não deve mais
      travar o avanço. Quando a 1ª Trilha (B5) entrar, o passo volta a
      aparecer normalmente pra quem ainda não escolheu.
- [x] **B4.2.2 — Generaliza a correção do B4.2.1 (pedido do Osmar:
      "faz isso com todas as anteriores e deixa como regra pras novas
      também").** A correção do B4.2.1 (`LevelUpShell.tsx`) já era
      genérica — não é código específico de Bárbaro, vale pra
      qualquer classe/subclasse futura automaticamente. Conferido:
      nenhuma classe anterior (Guerreiro/Bardo/Bruxo/Mago) tinha esse
      bug — Guerreiro não tem NENHUMA subclasse cadastrada ainda
      (nunca entrava no passo) e Bardo/Bruxo/Mago sempre têm pelo
      menos 1 subclasse implementada. **Achado uma 2ª inconsistência
      no caminho, corrigida junto:** `core/geradorPersonagemTeste.ts`
      ("🎲 Personagem de Teste") sorteava subclasse de QUALQUER uma da
      classe, sem filtrar por `subclasseImplementada` — diferente de
      `sortearLevelUpRapido` ("⚡ Inst. Level Up"), que já filtrava
      certinho. Corrigido pra usar o mesmo filtro (2 testes novos em
      `geradorPersonagemTeste.test.ts`, esse módulo não tinha teste
      nenhum antes). **Decisão registrada em `DECISOES-CLASSES.md`**
      ("Escolha de subclasse — trava o passo..."), substituindo uma
      entrada de 2026-08 que dizia o oposto (deixar escolher qualquer
      subclasse como placeholder) — a UI já tinha divergido dessa
      decisão antiga (cards travados) antes do Bárbaro expor o bug;
      a entrada antiga nunca tinha sido corrigida pra refletir isso.
      Essa é agora a regra permanente pra qualquer classe/subclasse
      nova: nunca escolher/sortear (tela real ou ferramenta de teste)
      uma subclasse sem mecânica implementada — nem como placeholder.
      Verificado com `tsc -b --force`/`npm test -- --run`
      (545)/`npm run build` limpos + Playwright: "🎲 Personagem de
      Teste" gerando um Bárbaro nível 5 não mostra mais "(Trilha do
      Berserker)" no cabeçalho da Ficha (antes mostrava, mesmo sem
      nenhuma mecânica da Trilha funcionar).
- [x] **B4.2.3 — Corrige regra do Conhecimento Primordial: Força não é
      obrigatório (pergunta do Osmar, testando o B4.2).** O texto real
      ("Sempre que realizar um teste de atributo usando uma das
      seguintes perícias, **pode** realizá-lo como um teste de Força")
      é escolha do jogador a cada rolagem, não substituição automática
      — a implementação original trocava sempre, mesmo quando o
      atributo normal era melhor (ex.: DES +2 vs. FOR +1 — ficava com
      FOR +1, pior). **Decisão do Osmar:** em vez de perguntar a cada
      rolagem (fiel à regra, mas 1 toque a mais em toda rolagem
      dessas 5 perícias), usa sempre o MAIOR mod. entre o atributo
      normal e Força — ninguém escolheria o pior de propósito, mesmo
      resultado prático da escolha manual sem a fricção extra.
      `core/calculoPersonagem.ts`: `calcularPericias` só troca pra
      Força quando `substituicaoForca.mod > modOriginal` (antes trocava
      sempre que `ativa` e a perícia estava na lista, sem comparar) +
      1 teste novo confirmando que DES melhor continua DES mesmo com a
      substituição "ativa" (Fúria ligada). Verificado com `tsc -b
      --force`/`npm test -- --run` (546)/`npm run build` limpos +
      Playwright: Bárbaro com FOR -1 e Fúria ativa — as 5 perícias
      continuam usando DES/SAB/CAR (todas melhores que FOR -1), nenhuma
      trocou pra Força.
- [x] **B4.3 — Ataque Extra + Movimento Rápido (nível 5): confirmado
      que já funcionam sozinhos, zero código novo.** Ataque Extra é o
      mecanismo genérico por ID (`numeroDeAtaques`/`CONTAGEM_ATAQUE_EXTRA`
      em `core/levelUp.ts`) já reaproveitado de outras classes — lê
      `classe.progressao` (que já tinha `'Ataque Extra'` na entrada de
      nível 5 do Bárbaro desde o B1) sem precisar de nada específico.
      Movimento Rápido é só textual — o app nunca trackeia Deslocamento
      numérico do PERSONAGEM em lugar nenhum (só de Pets), então "+3m"
      não tem onde ser aplicado; a descrição real já aparece na aba
      Perfil (`caracteristicasAcumuladas`, dado que já existe desde o
      B1) sem precisar de nada novo. Verificado com Playwright: Bárbaro
      nível 5 já mostra "🗡 Atacar — Ataque Desarmado (ataque 1/2)" no
      Combate (2 ataques reconhecidos automaticamente) e "Movimento
      Rápido" com a descrição completa na aba Perfil.
- [x] **B4.4 — Bote Instintivo + Instintos Primitivos (nível 7).**
      **Instintos Primitivos** (Vantagem em Iniciativa): novo ID
      `ID_CARACTERISTICA_CLASSE.instintosPrimitivos`, novo
      `temInstintosPrimitivos` (`FichaShell.tsx`, mesmo padrão de
      `temSentidoDePerigo`) passado pro `CombatTab`, que combina com
      `desvantagemForcaDestreza` via `resolverVantagem` (já existia
      desde o B4.1) na rolagem de Iniciativa — se coincidirem,
      cancelam, regra real. **Bote Instintivo** (mover metade do
      Deslocamento ao entrar em Fúria): confirmado que fica só textual
      — o app não rastreia Deslocamento do personagem em lugar
      nenhum, então a descrição real já aparece sozinha na aba Perfil
      (dado que já existe desde o B1), zero código. Verificado com
      `tsc -b --force`/`npm test -- --run` (563)/`npm run build`
      limpos + Playwright: Bárbaro nível 7 → Perfil mostra "Instintos
      Primitivos" e "Bote Instintivo" com a descrição completa →
      Combate → tocar "Iniciativa" rola 2 d20 físicos com a tag
      "Vantagem" no popup.
- [ ] **B4.5 — Golpe Brutal (nível 9) + Golpe Brutal Fortalecido
      (nível 13/17):** dano extra condicional a usar Ataque
      Imprudente, com escolha de efeito (Debilitador/Poderoso, depois
      Atordoante/Destruidor). Mais complexo, depende do B4.1 já
      existir.
- [ ] **B4.6 — Fúria Implacável (nível 11):** salvaguarda ao cair a 0
      PV com Fúria ativa — precisa de um gatilho "chegou a 0 PV" que
      hoje não existe.
- [ ] **B4.7 — Fúria Persistente (nível 15):** "recupera todas as
      Fúrias ao rolar Iniciativa" (a duração de 10 min já é o padrão
      desde o B3, nada novo aí).
- [ ] **B4.8 — Força Indomável (nível 18):** reroll de teste OU
      salvaguarda de Força usando o valor cheio, se o resultado for
      menor.
- [ ] **B4.9 — Campeão Primitivo (nível 20):** FOR/CON +4 até 25 —
      mexe no cálculo de atributos finais, ver precedente de "+X até
      Y" de nível 20 antes de desenhar.
- [ ] **B4.10 — ASI (4/8/12/16):** conferir se já funciona sozinho
      (mecanismo genérico por ID, igual Ataque Extra).
- [ ] **B5 — Trilha do Berserker** (nível 3/6/10/14): Frenesi, Fúria
      Irracional, Retaliação, Presença Intimidante.
- [ ] **B6 — Trilha do Coração Selvagem:** Arauto da Fauna, Fúria dos
      Selvagens (escolha a cada ativação), Aspecto dos Selvagens
      (escolha entre Descansos), Arauto da Natureza, Poder dos
      Selvagens (escolha a cada ativação).
- [ ] **B7 — Trilha da Árvore do Mundo:** Vitalidade da Árvore, Ramos
      da Árvore (Reação), Raízes Devastadoras, Percorrer a Árvore.
- [ ] **B8 — Trilha do Fanático:** Campeão dos Deuses (reserva de
      dados), Fúria Divina, Concentração Fanática, Presença Zelosa,
      Fúria dos Deuses (nível 14, forma temporária).

Cada entrega: checklist (`tsc -b`, `npm test -- --run`, `npm run
build`) + teste real na tela antes de publicar (personagem de teste
criado como Bárbaro, clicando o que for novo). B5-B8 pode reordenar a
ordem das Trilhas na hora se uma se mostrar mais simples/pronta que a
outra ao chegar lá.
