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

## Foco atual: Monge — classe base (nível 1-20, sem subclasse)

8ª classe do projeto. SDD completo em `sdd/sdd-monge.md` (chapéu 2) —
leia antes de implementar qualquer entrega, principalmente a seção 2
(CA sem armadura precisa GENERALIZAR a função existente pro 2º
atributo poder ser SAB, não só CON, e pra perder o bônus com Escudo —
não é só "trocar Bárbaro por Monge").

**2 células da planilha com dado bugado** (aba Subclasses, só afeta
as 4 subclasses — não a classe base desta leva): Combatente das
Sombras nível 3 tem texto de outra legenda colado; Combatente dos
Elementos nível 17 tem a introdução inteira do capítulo de Paladino
colada no final. Extrair só o texto certo na hora de importar (mesmo
tratamento do Bruxo/Mestre Místico) — não usar a célula como está.

- [x] **Entrega 1 — dado no banco, nada visível ainda.** `classes.ts`
      (progressão completa + recursos: Bônus de Artes Marciais em
      Nº DE LADOS do dado — 6/8/10/12 —, Pontos de Foco, Movimento sem
      Armadura), `classesProficienciasIniciais.ts` (já tinha
      `proficienciasArmaArmaduraClasse.ts` pronto, confirmado), CA sem
      armadura generalizada (`DEFESA_SEM_ARMADURA_POR_CLASSE`,
      `core/calculoPersonagem.ts` — Bárbaro CON/mantém com Escudo,
      Monge SAB/perde com Escudo; `calcularCA` do wizard, que nem
      tinha o caso do Bárbaro, ganhou de quebra). `ferramentasEscolha`
      generalizado pra aceitar array de grupos (Monge escolhe entre 2
      grupos — Artesão OU Instrumento). 3 novas funções em
      `recursosClasse.ts` (`ladosDadoArtesMarciais`/
      `quantidadePontosDeFoco`/`bonusMovimentoSemArmadura`), todas
      testadas. Achado de quebra, registrado em PENDENCIAS.md:
      Bárbaro e Paladino faltam em `proficienciasEntradaMulticlasse.ts`
      (fora de escopo desta entrega). Validado ao vivo: Monge continua
      "(em breve)" no wizard, nenhum personagem de outra classe quebrou.
      `npx tsc -b`, `npm test -- --run` (862/862), `npm run build`
      verdes.
- [x] **Entrega 2 — habilitar Monge na criação (wizard).** `disponivel:
      true` em `classes.ts`. Nova `core/monge.ts` (`ehArmaDeMonge` —
      Armas Simples Corpo a Corpo OU Marciais Corpo a Corpo com
      propriedade Leve, distinto da proficiência ampla do Monge, que
      cobre toda arma Simples inclusive à distância), testado (4
      casos). `core/ataque.ts` generalizado: `ataqueDesarmado` e
      `ataqueComArma` agora usam o Dado de Artes Marciais no lugar do
      dado normal (nunca somam — pega o maior) e permitem rolar com
      Destreza em vez de Força quando ela for maior (mesmo padrão já
      usado por Acuidade). Banner de classes prontas do wizard
      (`ClasseStep.tsx`) corrigido de quebra — estava sem Paladino e
      sem Monge. Testado ao vivo via Playwright em 390px: personagem
      Monge criado do zero pelo wizard (perícias, ferramenta — o
      picker juntou Ferramentas de Artesão + Instrumento Musical num
      só grupo, como esperado —, atributos, idiomas), CA calculada
      certo (14 = 10+DES+SAB) tanto no resumo do wizard quanto na
      Ficha salva, Ataque Desarmado no Combate rolando `1d20+4` (mod.
      Destreza +2 + Bônus de Proficiência +2 — confirmado na própria
      tela de detalhe do app). `npx tsc -b`, `npm test -- --run`
      (872/872), `npm run build` verdes.
- [x] **Entrega 3 — Pontos de Foco + as 3 técnicas base** (Defesa
      Paciente/Passo do Vento/Torrente de Golpes) — cada uma com
      escolha "de graça" vs "gastar 1 Foco", painel de Ação Bônus.
      Pontos de Foco exibido como pips (pedido do Osmar: 20 pips em 2
      linhas de 10 — `TickPips.tsx` ganhou prop `quebrarACada`,
      `RecursoVisivel` ganhou `exibicao: 'pips-bloco'`). Resets de
      Descanso Curto E Longo (`pontosDeFocoGasto`, grupo "Monge" em
      ordem alfabética). Torrente de Golpes reaproveita `ataqueDesarmado`
      forçado (nunca a arma equipada) + o mesmo padrão de contador
      "(ataque X/Y)" do Ataque Extra. Achado corrigido de quebra:
      `pontosDeFocoMaximo`/`ataqueTorrente` em `FichaShell.tsx` tinham
      que olhar a entrada de Monge em `classesAtual` DIRETO (não
      `classe`/`personagem.nivel`, que seguem a classe conjuradora
      "ativa") — senão a técnica inteira sumia numa multiclasse onde o
      Monge não é a classe conjuradora em foco. Achado corrigido de
      quebra #2: `abrirPainel` (`CombatTab.tsx`) bloqueava reabrir o
      card de Ação/Ação Bônus assim que `onMarcarUsado` marcava a
      categoria "usada" no 1º ataque de uma sequência — quebrava o 2º+
      ataque do Ataque Extra (bug pré-existente, não só do Monge) E o
      Torrente de Golpes inteiro; corrigido com uma exceção que
      reconhece ataque pendente de qualquer um dos dois. `Char
      Multiclasse` (`personagemTesteMulticlasse.ts`) ganhou o Monge na
      lista (estava esquecido desde a Entrega 1/2). Testado ao vivo via
      Playwright em 390px: Pontos de Foco 20/20 em 2 linhas de 10
      confirmadas visualmente; Torrente de Golpes com Foco liberando 2
      Ataques Desarmados de verdade (reabrindo o painel pro 2º ataque,
      contador "ataque 1/2" → "2/2"), Foco descontando certo (20→19).
      `npx tsc -b`, `npm test -- --run` (876/876), `npm run build`
      verdes.
- [x] **Entrega 3b — Metabolismo Incomum** (nível 2). Texto real
      conferido na planilha ("Características de Classe") — tem 2
      efeitos juntos, não só recuperar Foco: restaura todos os Pontos
      de Foco gastos E cura PV (dado de Artes Marciais + nível de
      Monge). Pergunta Sim/Não ao rolar Iniciativa (mesmo padrão visual
      de "Perícia Inigualável"), só aparece se Monge nível 2+ e ainda
      não usado desde o último Descanso Longo — não exige ter Foco
      gasto (a cura sozinha já vale a pergunta). "Não" não gasta o
      uso — pode perguntar de novo na próxima Iniciativa antes do
      próximo Descanso Longo. `metabolismoIncomumUsado` persistido,
      resetado só no Descanso Longo (não no Curto). Mesma correção de
      multiclasse das entregas anteriores: olha a entrada de Monge em
      `classesAtual` direto, não a classe "ativa". Testado ao vivo via
      Playwright: pergunta aparece com o texto/fórmula certos (1d12 +
      nível 20), "Sim" restaura Pontos de Foco pra 20/20 e dispara a
      rolagem de cura "Metabolismo Incomum (cura) — 1d12 + 20". `npx
      tsc -b`, `npm test -- --run` (876/876), `npm run build` verdes.
- [x] **Entrega 3c — UX das 3 técnicas revista** (achado durante
      review do Osmar, 2026-10): Defesa Paciente/Passo do Vento/
      Torrente de Golpes viravam uma sub-tela DENTRO do painel de Ação
      Bônus — Osmar queria um popup central (mesmo padrão de
      `MaosConsagradasModal.tsx`), e a Torrente especificamente tinha
      vaivém ruim (escolher → fechava → reabrir pra atacar → fechava →
      reabrir de novo pro 2º ataque). Criado `TecnicaMongeModal.tsx`
      (popup reaproveitando `TrocarArmaMaestria.module.css`, z-index
      120 — acima do painel de Ação Bônus, 110/111, que fecha ao abrir
      o popup). Escolher a Torrente já dispara o Ataque 1 na hora; o
      2º ataque (se gastou Foco) vira um card fixo no corpo do
      Combate, fora de qualquer painel — `abrirPainel` (`CombatTab.tsx`)
      voltou a só ter a exceção do Ataque Extra (a exceção da Torrente
      não é mais necessária, o botão dela não mora mais lá dentro).
      Testado ao vivo via Playwright: popup aparece centralizado,
      "Gastar 1 Foco" dispara o Ataque 1 sozinho (Foco 20→19, popup de
      rolagem "1d20+13" abre na hora), card "ataque 2/2" aparece na
      tela principal sem abrir painel nenhum. `npx tsc -b`, `npm test
      -- --run` (876/876), `npm run build` verdes.
- [x] **Entrega 3d — bug do 2º ataque da Torrente corrigido** (Osmar
      testou e o 2º ataque simplesmente não aparecia). Causa: o
      contador `ataquesTorrenteFeitos` avançava LOGO ao disparar a
      rolagem do 1º ataque (`rolarD20` só ABRE o popup, não espera o
      resultado) — o card do 2º ataque "existia" tecnicamente desde o
      início, escondido atrás do popup do 1º. Corrigido movendo o
      avanço do contador pra dentro de `onErrou` (errou → aparece na
      hora) e `confirmarFechamento.aoTocar` do popup de dano (acertou →
      só aparece depois de fechar o dano) — mesmo padrão descrito pelo
      Osmar. Testado ao vivo via Playwright os 2 caminhos: errar (clica
      "Errei" → card "ataque 2/2" aparece) e acertar (clica "Acertei" →
      rola dano → card só aparece DEPOIS de fechar o popup de dano,
      nunca antes). `npx tsc -b`, `npm test -- --run` (876/876), `npm
      run build` verdes.
- [x] **Entrega 3e — Torrente vira ataque contínuo de verdade, sem 2º
      input** (Osmar testou de novo: o card "ataque 2/2" da 3d
      tecnicamente aparecia, mas só depois de perceber que era um card
      passivo no corpo da tela — não um popup — ele achou que "não
      tinha segundo ataque". Esclarecido o pedido original: Torrente é
      vários socos em sequência, nunca deveria ter um 2º input
      perguntando se ataca de novo). Reescrito `rolarAtaqueTorrente`
      pra receber `(numero, total)` por parâmetro (não state, que
      ainda não atualizou na hora que o 1º ataque dispara) e, ao
      resolver cada ataque (`onErrou` ou `confirmarFechamento.aoTocar`
      do dano), chamar a si mesma pro próximo ataque automaticamente
      se ainda sobrar algum — removido o card "toque pra rolar" do
      corpo do Combate, não existe mais nenhum toque no meio da
      sequência. Testado ao vivo via Playwright os 2 caminhos: errar
      (2º ataque abre sozinho assim que "Errei" é tocado) e acertar
      (2º ataque abre sozinho assim que o popup de dano é fechado com
      "OK") — nenhum dos dois precisa de clique extra. `npx tsc -b`,
      `npm test -- --run` (876/876), `npm run build` verdes.

**Achado fora do escopo do Monge, corrigido de passagem** (Osmar
notou testando a Torrente de Golpes): o FAB de Dado 3D (🎲) flutuava
por CIMA de qualquer painel de Ação/Ação Bônus/Reação aberto (z-index
130/131/132, acima do painel, 110/111) — cobria a última linha do
conteúdo. Baixado pra 94/95/96 (abaixo do painel, igual o FAB de
Descanso já fazia) — `Dice3dFab.module.css`. O canvas da física do
dado em si (`Dice3dCanvasHost`, z-index 120) NÃO mudou — esse precisa
continuar acima do painel pra o dado caindo aparecer por cima de um
painel aberto, só o botão/menu/histórico ocioso é que não devia.

- [x] **Entrega 4a — Queda Lenta** (nível 4, painel de Reação). Sem
      rolagem — valor fixo (5 × nível de Monge), nova linha em
      `ReacaoPanelContent.tsx`, gated por `nivelMonge >= 4` (prop já
      existia, reaproveitada do Metabolismo Incomum). Jogador desconta
      manual nos botões −5/−1/Manual já existentes (mesmo padrão de "a
      ficha nunca calcula dano recebido sozinha"). Testado ao vivo via
      Playwright: linha aparece a partir do nível 4, toque mostra
      "Reduza o dano da queda em 100 (5 × seu nível de Monge)" pro
      personagem de teste nível 20, Reação marcada "usada" depois.
      `npx tsc -b`, `npm test -- --run` (876/876), `npm run build`
      verdes.
- [x] **Entrega 4a.1 — Queda Lenta vira popup** (Osmar testou: deixar
      só como `feedback` no corpo da aba Combate é fácil de não notar,
      mesmo problema já visto na Torrente de Golpes/3 técnicas antes
      de virarem popup). Criado `AvisoModal.tsx` — popup genérico
      reaproveitável pra qualquer resultado informativo SEM rolagem
      nem escolha (card central, mesmo CSS de `TrocarArmaMaestria`,
      z-index 120 acima do SidePanel). `ReacaoPanelContent` ganhou
      `onAbrirAvisoReacao` (CombatTab implementa: marca Reação usada +
      fecha painel + abre o popup) — Queda Lenta usa esse caminho em
      vez de `onEscolher`. Golpe Atordoante (Entrega 4b) deve
      reaproveitar o mesmo `AvisoModal` quando fizer sentido. Testado
      ao vivo via Playwright: popup abre centralizado ao tocar Queda
      Lenta, "Ok" fecha e Reação continua marcada "usada". `npx tsc
      -b`, `npm test -- --run` (876/876), `npm run build` verdes.
- [x] **Entrega 4b — Golpe Atordoante** (nível 5). Botão "💫 Golpe Atordoante" no popup de dano de um acerto com arma de Monge/Desarmado (principal e Torrente de Golpes; array de botões já suportado pelo `confirmarFechamento`). Gasta 1 Foco, 1x por turno (`golpeAtordoanteUsadoTurno`, reseta no Fim do Turno), e abre o `SalvaguardaDoAlvoModal` existente (CD 8+SAB+prof, Falha/Sucesso em texto). `core/golpeAtordoante.ts` + testes; `AtaqueInfo.armaDeMonge`. Fora do escopo: Ataque da Mão Secundária. Validado ao vivo (390px): botão aparece, popup certo, 2º acerto no mesmo turno só mostra OK. tsc/883 testes verdes.
- [x] **Entrega 4c — Defletir Ataques + Defletir Energia** (níveis 3 e 13). Linha "🛡 Defletir Ataques" no grupo Monge da Reação (nível 3+); descrição troca pra "qualquer tipo de dano" no nível 13. Rola 1d10+DES+nível de Monge (redução, jogador desconta no PV); popup do dado oferece "redirecionar (1 Foco)" → rola 2×dado de Artes Marciais+DES e abre `SalvaguardaDoAlvoModal` (CD de Foco 8+SAB+prof, DES). `core/defletirAtaques.ts` + testes. Tipo de dano do ataque inimigo não é checado (app não sabe). Validado ao vivo 390px. tsc/887 testes verdes.
- [ ] **Entrega 5 — resto dos níveis 6-20** (Evasão, Movimento
      Acrobático, Foco Aprimorado, Restauro Pessoal, Sobrevivente
      Disciplinado, Foco Perfeito, Defesa Superior, Dádiva Épica, Corpo
      e Mente). Foco Perfeito (nível 15) reaproveita o mesmo gatilho de
      Rolar Iniciativa da Entrega 3b.
- [ ] **Entrega 6 — personagem de teste + revisão final**, sem
      subclasse ainda (subclasses viram foco(s) separado(s) depois).

Subclasses (Mão Espalmada, Misericórdia, Sombras, Elementos) ficam
pra focos futuros, como já foi feito com Bárbaro/Paladino/Guerreiro.
