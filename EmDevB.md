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

## Foco: Mago (classe base) + Motor de Pets/Familiar + Necromante (subclasse homebrew)

**Pedido do Osmar:** implementar a classe Mago inteira primeiro, depois
a subclasse homebrew Necromante (ainda não é regra oficial — tudo dela
precisa ficar marcado como homebrew, porque o livro oficial ainda não
saiu e a regra vai ser revisada quando sair). Material: planilha mestra
(SDD), PDF oficial "Cap. 3 — Guardião a Paladino" (cobre Mago) e PDF
homebrew "Subclasses Arcanas" (cobre Necromante).

**Pesquisa já feita, confirmada linha a linha entre planilha e PDF
oficial (batem 100%, sem divergência):**
- Progressão 1-20 completa (recursos: Truques 3→5, Magias Preparadas
  4→25, Espaços de Magia 1º-9º círculo).
- 8 características nomeadas: Adepto de Ritual/Conjuração/Recuperação
  Arcana (nv1), Acadêmico (nv2), Subclasse de Mago (nv3), Aumento no
  Valor de Atributo (nv4/8/12/16), Memorizar Magia (nv5), Maestria de
  Magias (nv18), Dádiva Épica (nv19), Assinatura Mágica (nv20). Níveis
  6/10/14 = "Característica de Subclasse" (placeholder da planilha,
  resolve contra a subclasse escolhida, mesmo padrão de Bardo/Guerreiro).
  Níveis 7/9/11/13/15/17 não têm característica nomeada nova.
- Proficiências: Armas Simples, sem treinamento de armadura (já
  confirmado em `proficienciasArmaArmaduraClasse.ts` — **nenhuma
  mudança necessária nesse arquivo**). 2 perícias à escolha (Arcanismo/
  História/Intuição/Investigação/Medicina/Natureza/Religião).
  Equipamento inicial: (A) 2 Adagas + Foco Arcano (Cajado) + Kit de
  Erudito + Livro de Magias + Túnica + 5 PO; ou (B) 55 PO.
- 4 subclasses oficiais na planilha: Abjurador, Adivinhador, Evocador,
  Ilusionista (Necromante **não está** na planilha — confirma que é
  mesmo só homebrew, sem atalho de dado).

**Achado central — mecanismo novo que nenhuma classe ainda tem:**
diferente de Bardo/Bruxo (magias preparadas = magias conhecidas, 1
lista só), Mago tem 2 camadas: o **Livro de Magias** (grimório — pool
maior, começa com 6 magias de 1º círculo, ganha +2 por nível depois do
1º, nunca diminui) e as **Magias Preparadas** (subconjunto do grimório,
tamanho por nível igual à tabela — ver "Casters" em
`DECISOES-CLASSES.md`, esse é o "Padrão C" mencionado lá, com a camada
extra do grimório finalmente sendo implementada). Regras de troca:
- **Ao completar Descanso Longo:** redefinição livre — troca QUALQUER
  quantidade de Magias Preparadas por outras do grimório (não só 1,
  diferente de Bardo/Bruxo).
- **Ao completar Descanso Longo (nível 2+):** aprende +2 magias novas
  no grimório (escolha livre, nunca substitui — só cresce).
- **Memorizar Magia (nível 5+, Descanso Curto):** troca só 1 magia
  preparada por outra do grimório — mecanismo SEPARADO do de cima,
  menor, disponível com mais frequência.

**Pesquisa do PDF homebrew (Necromante) — texto completo já lido, 6
características (nv 3, 3, 6, 6, 10, 14):**
- Nv3 Perito em Necromancia: 2 magias de Necromancia (até 2º círculo)
  grátis no grimório; a cada novo círculo de espaço, +1 magia de
  Necromancia grátis no grimório.
- Nv3 Grimório de Necromancia: Resistência a dano necrótico (passiva);
  Colheita Macabra (ao conjurar magia de Necromancia com espaço, cura
  1 Morto-Vivo aliado); Familiar Morto-Vivo (Encontrar Familiar vira
  Esqueleto/Zumbi).
- Nv6 Poder Funesto: Recuperação Arcana também reduz Exaustão em 1;
  dano de Necromancia ignora resistência a necrótico.
- Nv6 Legião dos Mortos: Animar Mortos sempre preparada + 1x grátis;
  Mortos-Vivos convocados/criados por magia de Necromancia ganham PV
  extra e dano bônus no ataque.
- Nv10 Colheita dos Mortos: ao ficar Ensanguentado, Reação pra reduzir
  a 0 PV um Morto-Vivo controlado e curar a si mesmo.
- Nv14 Mestre da Morte: Ação Bônus dá PV Temp a Mortos-Vivos
  controlados; Reação de explosão necrótica (dano em área + CD) quando
  um Morto-Vivo controlado é reduzido a 0 PV.

**Pedido novo do Osmar (2026-09) — muda o plano, generaliza um bloqueio
que já existia:** a maioria das características do Necromante depende
de "criatura convocada/controlada pelo personagem" existir no app —
mesmo conceito que já travava uma pendência do Bruxo (Pacto da
Corrente/Familiar, registrada em `PENDENCIAS.md`). Em vez de resolver
isso só pro Necromante, o Osmar pediu uma aba nova **"Pets"** (depois
de Combate na barra de abas) como motor genérico de "Familiar e outras
criaturas sob controle", pra servir Bruxo, Mago/Necromante e qualquer
classe futura que conceda algo parecido — não é mais uma entrega
isolada de uma subclasse. Vira uma fase própria (Fase P abaixo), entre
a Fase A (Mago base, não depende disso) e a Fase B (Necromante, que
passa a USAR o motor da Fase P em vez de reinventar).

**Verificado na planilha — isso NÃO é mais bloqueio de dado, só de
motor/UI:** a aba "Estatísticas de Criaturas" já tem **51 criaturas
com stat block completo** (CA, Iniciativa, PV, Deslocamento, os 6
atributos, Perícias, Resistências/Imunidades/Vulnerabilidades,
Sentidos, ND, Traços, Ações, Ações Bônus, Reações, Fonte) — inclui as
13 formas padrão de Encontrar Familiar (Morcego, Gato, Corvo, Coruja,
Doninha, Rato, Aranha, Rã, Lagarto, Polvo, Caranguejo, Cobra
Peçonhenta, Gavião) **e** as 2 formas especiais do Necromante
(Esqueleto, Zumbi — stat block completo, conferido acima). Só falta
construir o motor/UI que usa esse dado.

---

### FASE A — Mago, classe base (fazer primeiro, sequência pedida pelo Osmar)

- [x] **A1 — Dados.** `classes.ts` (núcleo + progressão + recursos:
  Truques/Magias Preparadas/9 Espaços de Magia por círculo, mesmo
  padrão de array-por-círculo do Bardo); `caracteristicasClasse.ts`
  (10 linhas de característica — 8 nomes distintos, 3 no nível 1);
  `classesProficienciasIniciais.ts` (2 perícias de 7 opções +
  equipamento A/B). **Ajuste em cima do plano:** o "Livro de Magias"
  não precisou de `core/` novo — virou só mais um `RecursoClasse`
  ("Livro de Magias (quantidade)", 6 no nv1 + 2 por nível depois),
  lido pelo `valorRecursoClasse` genérico que já existe (mesmo usado
  por Truques Conhecidos/Magias Preparadas) — nenhum motor novo
  necessário ainda (só quando a Ficha precisar de fato separar "no
  grimório" de "preparada", na A3+). `mago.disponivel = false` por
  enquanto (Wizard/Ficha ainda não usam esse dado — ativa no fim da
  A2). `npx tsc --noEmit`, `npm test -- --run` (290 passando) e
  `npm run build` verdes. **Não é testável na tela ainda** (Mago
  continua fora da lista de classes do wizard até a A2) — só dado
  puro importado.
- [x] **A2 — Wizard.** `WizardSelection` ganhou
  `livroDeMagiasEscolhido: string[]`. `ClasseEscolhasStep.tsx`: nova
  seção "Livro de Magias — escolha 6" (mesmo componente de check-row
  de sempre) ANTES de "Magias Preparadas", que passou a listar só as
  magias já marcadas no grimório (não mais a lista inteira da classe)
  — desmarcar uma magia do grimório também desmarca das Preparadas se
  estava lá (`toggleLivroDeMagias`). `WizardShell.tsx` (`isValid` +
  `randomizarEscolhasClasse`) e `geradorPersonagemTeste.ts` (mesmo
  ajuste pro gerador de Personagem de Teste) atualizados pra sortear o
  grimório ANTES das preparadas e restringir o sorteio das preparadas
  ao grimório sorteado. `mago.disponivel = true` — Mago agora aparece
  de verdade na lista de classes do wizard.
  **Testado no navegador** (Playwright, 390px): Mago selecionável,
  tela "Escolhas da Classe" mostra os 2 blocos corretos, randomizar
  preenche 6/6 no livro e 4/4 nas preparadas, e desmarcar uma magia do
  livro que também estava preparada derruba os dois contadores juntos
  (confirmado 6/6→5/6 e 4/4→3/4 na mesma ação) — sem erro no console.
  tsc/testes(290)/build verdes.
  **Fora do escopo desta entrega (fica pra A5 — Level Up):**
  `aplicarLevelUpsAleatorios` (gerador de Personagem de Teste em
  níveis 2+) ainda re-sorteia Magias Preparadas direto da lista da
  classe, sem respeitar o grimório — só afeta o gerador de teste em
  nível alto, não o wizard normal.
- [x] **A3 — Ficha (aba Magias).** `MagiasTab.tsx` ganhou seção nova
  "Livro de Magias" (logo antes de "Magias Preparadas") — mostra TODAS
  as magias do grimório, cada uma com tag "preparada" (verde/normal) ou
  "não preparada" (cinza), derivado comparando com
  `magiasPreparadasAtuais`. Só aparece quando `livroDeMagiasAtuais.length
  > 0` (hoje só Mago). Novo estado `livroDeMagiasAtuais` em
  `FichaShell.tsx` (mesmo padrão `personagemSalvo.campoAtual ??
  selecao.campoEscolhido` de Truques/Preparadas — sem setter ainda, só
  leitura, cresce/troca na A5) + novo campo `livroDeMagiasAtual?` em
  `PersonagemSalvo`.
  **Achado corrigido no caminho:** `ATRIBUTO_POR_NOME` (usado por
  `modAcertoConjuracao` — bônus de ataque/CD de conjuração) só tinha
  Carisma mapeado; Mago (Inteligência) não estava lá — sem isso, CD/
  ataque de magia do Mago voltaria `null` (número desaparecendo da
  tela) mesmo com Espaço de Magia funcionando. Corrigido, com teste
  novo (`modAcertoConjuracao`, 3 casos: Mago/INT, Bruxo/CAR ainda
  funcionando, borda classe-null/sem-mapeamento).
  **Achado corrigido no caminho (invariante):** a tela "Completar
  Magias Preparadas" (`completarAberto === 'magiasPreparadas'`) listava
  o catálogo inteiro da classe, sem checar o grimório — um Mago com
  déficit conseguiria "completar" preparando uma magia que nem está no
  livro. Catálogo agora filtra pelo grimório quando ele existe.
  **Testado no navegador** (Playwright + gerador "🎲 Personagem de
  Teste", nível 1): Espaços de Magia/Truques/Magias da Espécie
  funcionando normal; "Livro de Magias" mostra as 6 magias com a tag
  certa (4 preparada / 2 não preparada, confirmado por contagem);
  "Usar" numa preparada gasta o Espaço de verdade (pip mudou de
  2/2 pra 1/2); sem erro de console em nenhum passo. tsc/testes(304)/
  build verdes.
- [x] **A4 — Combat.** Zero linha de código precisou mudar — o painel
  de Ação/Reação já lê `truques`/`magiasPreparadasAcao`/
  `magiasPreparadasReacao`/`modAcertoConjuracao` de `FichaShell.tsx`,
  todos genéricos e já corretos pro Mago desde a A1-A3 (nenhum
  `CombatTab.tsx`/`AcaoPanelContent.tsx`/`SelecionarMagiaShell.tsx` tem
  comparação hardcoded por nome de classe). **Testado no navegador**
  (Playwright, 390px, gerador de Personagem de Teste nível 1): painel
  de Ação → "Usar Magia" mostra Truques (4) e 1º Círculo (4) reais;
  conjurar gasta o Espaço de verdade, marca a Ação como usada, mostra
  o texto da magia — sem erro de console, sem NaN/undefined. Confirma
  que o motor genérico (Bardo/Bruxo) já cobria Mago de graça.
- [x] **A5a — Level Up: crescimento (feito).** Novo passo
  `'livroDeMagias'` no `LevelUpShell.tsx` (entre Truques e Magias
  Preparadas) — "coleção que só cresce", mesmo padrão do Especialista
  (item já marcado fica travado, sem opção de desmarcar). Novo par de
  funções genéricas em `core/magiasPersonagem.ts`:
  `usaRedefinicaoPorDescanso(classe)` (true só quando a classe tem
  "Livro de Magias" — hoje só Mago) e `completarListaDeMagias(atuais,
  catalogo, max)` (cresce até `max` sem nunca remover). Truques e
  Magias Preparadas do Mago agora ficam travados no Level Up
  (`trocasDeTruque`/`trocasDeMagia` precisam ser 0, não `<=1` como
  Bardo/Bruxo) — a troca de verdade só acontece no Descanso Longo
  (A6). Magias Preparadas passa a escolher só dentre o que está no
  Livro de Magias (`magiasPreparadasPool`). Resumo do Level Up ganhou
  linha "Livro de Magias" e trocou o texto de Truques/Preparadas pra
  "+N nova(s)" quando for classe de redefinição-por-descanso (em vez
  de "sem troca", que ficaria enganoso pra crescimento puro).
  ASI (4/8/12/16) já funcionava de graça (mesma leitura genérica de
  `niveisComASI` que Guerreiro/Bardo/Bruxo usam).
  **Também atualizado (consistência, mesmo bug pra qualquer level-up
  em lote de um Mago):** `core/levelUpAleatorio.ts` (Level Up Rápido
  ⚡) e `core/geradorPersonagemTeste.ts`'s `aplicarLevelUpsAleatorios`
  (Personagem de Teste em nível 2+) — ambos respeitam agora
  `usaRedefinicaoPorDescanso` e crescem o grimório antes de escolher
  preparadas, com teste novo em cada um.
  **Testado no navegador** (Playwright, 390px, Level Up de verdade —
  não só o Rápido): truque "já tinha" trava de verdade (clique não
  desmarca); "Livro de Magias — escolha 8 (6/8)" mostra certo;
  completar o livro libera exatamente essas 8 opções (não a lista
  inteira da classe) na tela de Magias Preparadas seguinte; Resumo
  mostra "+2 nova(s)"/"+1 nova(s)"; após confirmar, ficha mostra
  Nível 2, Espaços de Magia 3 pips, Preparadas crescidas — sem erro de
  console. tsc/testes(309)/build verdes.
  **Fora do escopo desta entrega, vira A5b:** Memorizar Magia (nível
  5+, card na Combat, 1x por Descanso Curto, troca 1 preparada) — é
  um mecanismo GATILHADO POR DESCANSO CURTO, mais parecido com
  Astúcia Mágica do Bruxo do que com Level Up; fica pra sua própria
  entrega pequena, junto ou logo depois da A6 (que já mexe na mesma
  área de Descanso).
- [x] **A5b — Memorizar Magia (nível 5+).** Card na aba Magias (não
  Combat — é uma troca de preparo, mesmo lugar de "Completar Magias
  Preparadas", não uma ação de round), mesmo padrão visual de "já
  usada" da Astúcia Mágica do Bruxo/Livro das Sombras. Novo
  `core/magiasPersonagem.ts`: `memorizarMagiaValida(atuais, escolhidas)`
  (exatamente 1 troca, tamanho da lista não muda). Novo
  `MemorizarMagiaShell.tsx` (cópia estrutural do `LivroDasSombrasShell`
  já existente — mesma UI de check-row com grupo por círculo, item já
  preparado trava só quando desmarcado sozinho, sem 2ª opção marcada).
  `FichaShell.tsx` ganhou `memorizarMagiaGasta` (novo campo em
  `PersonagemSalvo`) e o guard de render do shell.
  **Ajuste em cima do plano:** o reset acontece nos DOIS tipos de
  descanso (Curto E Longo), não só Curto como a frase original do
  plano dizia — mesmo padrão já usado pelo Livro das Sombras do Bruxo
  (faz sentido: Descanso Longo já libera a redefinição livre completa,
  então também libera essa troca menor de graça).
  **Testado no navegador** (Playwright, 390px, Personagem de Teste
  Mago nível 5): card só aparece a partir do nível 5; botão Confirmar
  fica desabilitado com 0 trocas e habilita com exatamente 1; após
  confirmar, a magia nova aparece na seção "Magias Preparadas" e a
  removida some de lá (confirmado lendo especificamente as linhas
  daquela seção, não busca de texto na página inteira); card vira
  "já usada" até o próximo descanso; Descanso Curto libera o card de
  novo — sem erro de console em nenhum passo. tsc/testes(315)/build
  verdes.
- [x] **A6 — Transição de Descanso (fade + prompt).** Pedido explícito
  do Osmar, plugado nos 2 botões já existentes de `AtributosTab.tsx`
  (`onDescansoCurto`/`onDescansoLongo`, antes sem nenhum feedback
  visual) — **invertida na ordem com a A7 (era A7, pedido do Osmar
  2026-09) pra vir antes da subclasse placeholder.**
  - [x] A6.1 — `DescansoOverlay.tsx` novo (`position: fixed`, mesmo
    padrão de overlay de tela cheia de `RollOverlay`/`LevelUpShell`):
    fade-in pro preto (opacity 0→1 via CSS transition, não
    `@keyframes` — permite pausar a meio caminho pro A6.2), texto
    "Descanso Curto"/"Descanso Longo" em branco no meio, fade-out.
    Curto: 0,5s+0,5s (1s total). Longo: 1s+1s (2s total). O reset de
    verdade (`descansoCurto`/`descansoLongo`) só roda quando a tela já
    está 100% preta (escondido atrás do overlay) — clicar no botão não
    chama mais essas funções direto, passa por `iniciarDescanso`.
  - [x] A6.2 — só no Descanso Longo, e só se sobrar alguma Magia
    Preparada (evita pergunta sem sentido num Mago nível 1 recém-
    criado): quando `usaRedefinicaoPorDescanso(classe)` é true (hoje
    só Mago), a transição pausa 100% preta com a pergunta "Quer
    alterar suas magias preparadas?" (Sim/Não). Sim → abre
    `MemorizarMagiaShell` num novo modo `'livre'` (prop `modo:
    'unica' | 'livre'`, generalizando o componente da A5b em vez de
    duplicar — só difere na validação: `'unica'` exige exatamente 1
    troca, `'livre'` aceita qualquer quantidade, inclusive 0). Não ou
    Confirmar na tela de redefinir → volta pro overlay preto e roda o
    fade-out. Classe sem essa característica (Bardo/Bruxo/Guerreiro)
    nunca vê a pergunta, só o fade normal.
  **Testado no navegador** (Playwright, 390px): Guerreiro (Descanso
  Curto e Longo) mostra só o fade com o texto certo, nunca a pergunta;
  Mago nível 5 no Descanso Curto também nunca pergunta (só o
  "Memorizar Magia" da A5b faz isso, não a transição); Mago no
  Descanso Longo pausa preto com a pergunta, "Sim" abre "Redefinir
  Magias Preparadas" (troca livre confirmada, refletida certinha na
  aba Magias depois), "Não" fecha a pergunta e termina o fade-out
  sozinho — sem erro de console em nenhum caminho. tsc/testes(322)/
  build verdes.
- [x] **A7 — Subclasse placeholder.** Abjurador/Adivinhador/Evocador/
  Ilusionista (nomes confirmados na planilha, aba Subclasses — sem
  prefixo "Escola de", diferente do Livro do Jogador oficial) em
  `subclasses.ts`, ids `mago-abjurador`/`mago-adivinhador`/
  `mago-evocador`/`mago-ilusionista`. **Zero código novo** — a tela de
  escolha de subclasse do Level Up já lê `subclasses.ts` filtrando por
  `classeId` e já trava sozinha qualquer subclasse sem entrada em
  `caracteristicasSubclasse.ts` (mesmo padrão que já trava 3 dos 4
  colégios do Bardo e 3 dos 4 patronos do Bruxo — só adicionar as
  linhas de dado bastou, confirma reuso 100%).
  **Ícone recebido do Osmar, guardado pra Fase B (ainda NÃO virou
  subclasse selecionável):** `mago-necromante-banner.webp` (convertido
  de PNG, redimensionado pra 512×512 igual aos outros emblemas) já está
  em `assets/icones-classes/` — quando a B0 (convenção de badge
  homebrew) for decidida e o Necromante entrar em `subclasses.ts` com
  `id: 'mago-necromante'`, o ícone já aparece sozinho (mesmo glob
  automático que já pega os outros).
  **Testado no navegador** (Playwright, 390px, Level Up manual nível
  1→3 de um Mago): as 4 subclasses aparecem na tela "Escolha sua
  Subclasse", travadas (opacidade reduzida, clique não faz nada) com
  "Ainda não implementada" — igual ao padrão já visto em Bardo/Bruxo;
  Personagem de Teste criado direto no nível 3 mostra a subclasse
  sorteada certinha no cabeçalho ("Mago (Abjurador)"). tsc/
  testes(322)/build verdes.
  **Ajuste pedido pelo Osmar (§12 do CLAUDE.md):** as 4 subclasses ainda
  caem no fallback genérico 🖼 (sem emblema próprio, diferente de TODAS
  as outras subclasses do app — Bardo/Bruxo já têm arte mesmo pras que
  não têm mecânica) — isso precisa ficar explícito, não só implícito no
  🖼. Novo `temBannerProprio(id)` exportado de `IconeClasse.tsx`
  (reaproveitável por qualquer outra tela que precise da mesma checagem)
  usado no card de escolha de subclasse pra mostrar "[PH] ícone ainda
  não desenhado" nas 4 sem emblema — Necromante (Fase B) já tem emblema
  de verdade, então não entra nesse aviso quando for adicionado.

### FASE P — Motor de Familiar/Pet (genérico — Bruxo, Mago, qualquer
classe futura), entre a Fase A e a Fase B

**Por que entra aqui e não dentro do Necromante:** não depende de Mago
pra existir (Bruxo já tem uma pendência real esperando por isso desde
antes deste foco) — fazendo agora, a Fase B (Necromante) já nasce
usando o motor pronto em vez de reinventar.

- [x] **P0 — decisões de escopo, confirmadas pelo Osmar (2026-09).**
  Pets em array desde o início (não trava em "1 só", pra já servir a
  Legião dos Mortos do Necromante); PV/CA do pet rastreável de verdade
  (dano/cura, mesmo padrão -5/-1/+1/+5 já usado no personagem).
- [x] **P1 — Dados.** Aba "Estatísticas de Criaturas" da planilha
  conferida linha a linha antes de importar (seção 3 do CLAUDE.md): 51
  criaturas, 28 colunas idênticas em todas as linhas (Familiares do
  Bruxo e Esqueleto/Zumbi do Necromante juntos na mesma tabela — não
  precisou reconciliar nada entre "pets/invocações/animais", já é uma
  tabela única). Formatos 100% consistentes, confirmados um a um:
  CA sempre número puro; PV sempre `"total (fórmula)"`; Iniciativa
  sempre `"mod (total)"`; os 6 atributos sempre `"valor (mod[, salv
  +N])"`; Deslocamento em lista separada por vírgula (1º item sem
  rótulo = base, resto rotulado Voo/Natação/Escalada/Escavação).
  `data/rulesets/dnd2024/criaturas.ts` novo: interface `Criatura` (28
  campos, quase todos string — mesmo padrão 1:1 de `armas.ts`, zero
  lógica) + as 51 linhas importadas. `core/criaturas.ts` novo:
  `caCriatura(c)`/`pvMaxCriatura(c)` — só os 2 números que o motor de
  Pets precisa rastrear de verdade, extraídos por regex simples (não
  precisa de parser de fórmula de dado, o total já vem pronto antes do
  parêntese) — com teste Vitest cobrindo caso normal + borda (ex.: PV
  com subtração "1d4 – 1") pra cada.
  **Achado corrigido no caminho (avisar o Osmar — mesma categoria já
  registrada na seção 8 do CLAUDE.md, só que numa aba diferente):** 4
  células de Ações/Ações Bônus tinham o nome da criatura da PRÓXIMA
  página colado no final (contaminação de cabeçalho do PDF de origem,
  não é conteúdo de regra) — Alce, Cobra Constritora, Texugo (campo
  Ações) e Tigre (Ações Bônus). Truncado na frase real antes de
  importar (confirmado que a frase real termina em ponto final antes
  do nome colado, nada de regra foi cortado). Vale auditar a aba
  inteira por esse padrão se outra entrega mexer nela de novo.
- [x] **P2 — Aba nova "Pets".** `FichaShell.tsx` (`TABS`, depois de
  `combat`, ícone 🐾). Novo `core/pets.ts`: interface `Pet` (id, nome
  escolhido, `criaturaId`, `pvAtual` — CA/PV máximo/atributos/ações
  nunca duplicados, sempre lidos de `criaturas.ts` na hora); `criarPet`
  (id gerado com contador + `Date.now()`, mesmo padrão de
  `mochila.ts`/`pactoDaLamina.ts`) e `alterarPvPet` (trava entre 0 e o
  máximo, sem PV Temporário — pets não têm essa fonte ainda), com
  testes (caso normal + bordas de dano/cura passando do limite).
  `PersonagemSalvo.petsAtual?: Pet[]` novo.
  `PetsTab.tsx` novo: 1 card por pet (nome, CA, barra de PV com os
  mesmos botões −5/−1/+1/+5 do personagem — `LinearProgressBar`
  reaproveitado 100%, mesma barra da aba Combat —, os 6 atributos,
  Deslocamento/Sentidos/Perícias/Traços/Ações/Ações Bônus/Reações) +
  botão de remover (✕) + formulário "Adicionar Pet" (nome + `<select>`
  com as 51 criaturas), mesmo padrão do "+ Adicionar item" da Mochila
  (`MochilaTab.tsx`) reaproveitado.
  **Ajuste em cima do plano:** por enquanto o "ganhar um pet" já é
  genérico (qualquer criatura do catálogo, não só uma forma restrita)
  — deixa a aba já testável e útil sozinha (ver seção 1 do CLAUDE.md,
  "menor entrega testável"), e ainda serve de base pro P5 (pet avulso).
  A P3 vai RESTRINGIR essa escolha quando vier de uma fonte específica
  (ex: só as 13 formas de Encontrar Familiar pro Bruxo), não substituir
  o mecanismo — é o mesmo componente, só com a lista de opções filtrada.
  **Testado no navegador** (Playwright, 390px): aba vazia mostra
  "Nenhum pet ainda"; adicionar "Sombra" (Gato) mostra CA 12, PV 2/2,
  atributos e Traços/Ações reais; −1 leva a 1/2, +1 volta a 2/2; ✕
  remove e volta ao estado vazio — sem erro de console.
  tsc/testes(331)/build verdes.
- [x] **P3+P4 — Fluxo de "ganhar"/remover pet + ligar ao Bruxo (feitos
  juntos — P3 sozinho não seria testável sem um caller real).**
  `InvocacaoMistica` ganhou `formasFamiliarConcedidas: string[] | null`
  (mesmo padrão de `magiaGratisConcedida`/`sentidoConcedido`), Pacto da
  Corrente preenchido com as 8 formas especiais reais do texto de
  `beneficios` (Cobra Peçonhenta, Diabrete, Esfinge Maravilhosa,
  Esqueleto, Pseudodragão, Quasit, Slaad Girino, Sprite — todas já
  conferidas existindo em `criaturas.ts`, sem precisar de dado novo).
  `core/invocacoesFamiliar.ts` novo: `formasFamiliarDasInvocacoes`
  (mesmo formato de `magiasGratisDasInvocacoes`), com testes.
  `PetsTab.tsx`: novo card "🔮 Convocar Familiar (Pacto da Corrente)"
  reaproveitando 100% o mesmo `AdicionarPet` do P2, só com a lista de
  criaturas restrita — nenhum componente novo.
  **"Desfazer o vínculo" virou "só 1 familiar por vez, convocar de
  novo substitui":** `Pet.origemInvocacaoId?: string` marca a origem;
  convocar de novo pela mesma fonte (`adicionarPet` em
  `FichaShell.tsx`) remove o pet anterior DAQUELA fonte antes de
  adicionar o novo — mesmo padrão já usado pra "só 1 arma de pacto por
  vez" (Pacto da Lâmina). Pets avulsos (sem origem) nunca são afetados.
  Fecha a pendência do Bruxo/Familiar em `PENDENCIAS.md` — as outras
  invocações do mesmo grupo (Investimento do Mestre da Corrente etc)
  continuam bloqueadas por outros motores que não existem.
  **Testado no navegador** (Playwright, 390px, Bruxo nível 2 com Pacto
  da Corrente): select mostra exatamente as 8 formas especiais (não as
  51 do catálogo); convocar "Alfa" (Sprite) aparece certinho; convocar
  de novo pela mesma caixa com "Beta" (Quasit) substitui Alfa (1 card
  só, não 2); adicionar um pet avulso ("Ceva", Cavalo de Montaria)
  pela caixa genérica NÃO mexe no familiar — os 2 convivem (2 cards).
  tsc/testes(335)/build verdes.
- [x] **P5 — Criar pet avulso, ajustando a partir do catálogo.**
  Decisão do Osmar (confirmada por pergunta direta, 2 respostas):
  (1) não é stat block livre do zero — pega uma criatura do catálogo
  como base e ajusta só os números que precisar (ex: "é um Lobo, mas
  mais forte"); (2) fica em tela cheia separada, mesmo padrão dos
  outros formulários grandes do app (Level Up, escolha de magia), não
  espremido dentro da caixa "Adicionar Pet".
  `core/pets.ts` ganhou `AjustesPet` (`ca?`/`pvMax?`/
  `atributos?: Partial<Record<Atributo, number>>`) + `Pet.ajustes?` +
  `caEfetivaPet`/`pvMaxEfetivoPet`/`atributoEfetivoPet` (usam o ajuste
  quando existe, senão caem pro valor da criatura — nunca duplicam
  dado) + `calcularAjustesPet` (compara os valores digitados contra a
  criatura base e só guarda o que REALMENTE mudou, evita `ajustes`
  redundante). `core/criaturas.ts` ganhou `valorAtributoCriatura`
  (extrai o valor bruto de `"valor (mod)"`, ponto de partida pros
  inputs). Todas com teste (caso normal + borda), 6 novos no total.
  `ui/ficha/pets/AjustarPetShell.tsx` novo (pasta nova, mesmo padrão de
  `combat/` — shells específicos de uma aba): nome + select de criatura
  base + inputs de CA/PV máximo/6 atributos, pré-preenchidos com os
  valores da criatura escolhida (trocar a criatura reseta os campos).
  Reaproveita `LevelUpShell.module.css` pro `.screen`/`.header`/
  `.body`/`.navLayer` (zero CSS de shell novo, só os inputs em si).
  `PetsTab.tsx`: card de pet mostra tag "ajustado" ao lado de CA/PV
  quando difere do padrão, e um `•` ao lado do nome do atributo
  ajustado — transparência de que aquele número não é o da planilha.
  **Testado no navegador** (Playwright, 390px): abre a partir da caixa
  "⚙️ Pet com atributos diferentes do padrão?"; trocar pra Lobo
  preenche CA 12/PV 11/FOR 14 (valores reais do Lobo); ajustar CA pra
  16 e FOR pra 20 e confirmar mostra o pet "Fenrir" com CA 16
  (tag "ajustado"), FOR 20 (•), e PV/DES/CON/INT/SAB/CAR intactos
  (iguais ao Lobo, sem marcação) — sem erro de console.
  tsc/testes(341)/build verdes.

**Fase P (Motor de Pets/Familiar) fechada — P0 a P5 completos.**
Próximo: Fase B (Necromante, subclasse homebrew).

- [x] **B0 — Convenção de marcação "homebrew".** Confirmada com o
  Osmar (proposta aprovada direto): campo `homebrew: boolean` em
  `Subclasse` (`subclasses.ts`, obrigatório em toda entrada — mesmo
  padrão de campo explícito de `InvocacaoMistica`, nunca opcional).
  `ui/components/BadgeHomebrew.tsx` novo: selo âmbar "🏠 Homebrew"
  (usa `--warn`, mesma cor de outros avisos do app) — sempre acompanhado
  de uma linha de texto visível "Não é regra oficial ainda — vai ser
  revisada quando o livro sair" (não um tooltip: hover não existe em
  touch, precisa aparecer sem interação, mesmo espírito do `[PH]`).
  Aplicado nos 2 lugares que mostram subclasse hoje: card de escolha
  no Level Up (`LevelUpShell.tsx`) e seção "Subclasse" da aba Perfil
  (`PerfilTab.tsx`) — os dois lêem `Subclasse.homebrew`, nunca
  comparam por nome.
- [x] **B1 — Dados.** `subclasses.ts` ganhou `mago-necromante`
  (`homebrew: true`, ícone `mago-necromante-banner.webp` já preparado
  na A7). Novo `caracteristicasSubclasseHomebrew.ts` (não
  `caracteristicasSubclasse.ts` — aquele arquivo é "gerado da planilha,
  não editar à mão"; Necromante não está na planilha, é transcrito do
  PDF homebrew, merece arquivo próprio com proveniência clara) — 6
  características reais (nv 3×2, 6×2, 10, 14). `core/levelUp.ts` junta
  os dois arrays (`todasCaracteristicasSubclasse`) numa função só, pro
  motor de Level Up ler igual sem se importar de onde veio — zero
  mudança nos 4 pontos que já liam `caracteristicasSubclasse` (só
  trocou a fonte). `subclasseImplementada('Necromante')` já retorna
  `true` de graça (mesma checagem genérica de sempre) — a subclasse já
  aparece SELECIONÁVEL no Level Up, não travada como as 4 oficiais
  ainda sem mecânica.
  **Testado no navegador** (Playwright, 390px, Level Up manual Mago
  nível 1→3): card "Necromante 🏠 Homebrew" aparece destravado, com
  ícone de verdade (não 🖼); escolhida e confirmada, o cabeçalho mostra
  "Mago (Necromante)"; aba Perfil mostra "SUBCLASSE — NECROMANTE
  🏠 HOMEBREW" com o aviso de "não é regra oficial" e as 2
  características de nível 3 (Perito em Necromancia, Grimório de
  Necromancia) com o texto real — sem erro de console.
  tsc/testes(341)/build verdes.
- [x] **B2 — Mecânica simples (sem depender da Fase P).** Resistência
  Necrótica não precisou de código novo — o app não tem motor de
  resistência a dano por tipo pro personagem jogador em lugar nenhum
  ainda (Resistência Ínfera do Bruxo é escolha visível, não cálculo
  automático), então a característica já fica coberta só pelo texto
  real mostrado na Perfil (B1). Perito em Necromancia ganhou
  `core/necromante.ts`: `magiasPeritoNecromanciaNesteNivel(classe,
  nivelAnterior, novoNivel)` (delta do level-up — 2 ao atingir o nível
  3, +1 toda vez que um círculo de magia novo desbloqueia depois disso,
  0 no resto — mesmo padrão de ASI/Arcana Mística, nunca acumulado) +
  `catalogoPeritoNecromancia(circuloMaximo)` (só magias de Necromancia,
  círculo 1+, até o círculo disponível). 6 testes Vitest cobrindo
  nível 3, nível abaixo de 3, círculo novo (nível 5, 3º círculo) e
  nenhum círculo novo (nível 6) — também serviram pra confirmar a
  progressão real de círculo do Mago (1→nv1, 2→nv3, 3→nv5).
  `LevelUpShell.tsx` ganhou o passo `peritoNecromancia` (novo item do
  `LuStep`), condicionado a `subclasseEscolhida === 'Necromante'` +
  o delta acima > 0, reaproveitando o componente `GrupoMagiaColapsavel`
  e o padrão de `check-row` já usado em "Livro de Magias". Decisão de
  arquitetura: em vez de um array persistido separado, as magias
  escolhidas aqui são só MAIS um passo de escolha que termina
  fundido no mesmo `livroDeMagiasEscolhidas` enviado no `onConfirmar`
  — a regra real diz que elas entram "direto no livro de magias", e
  como o grimório já é só uma lista de nomes sem metadado de origem,
  não tem por que rastrear "vieram do Perito" separadamente; isso
  também evita mexer em `FichaShell.tsx`/`armazenamentoPersonagens.ts`
  (zero campo novo pra persistir). O pool de escolha exclui o que já
  está no grimório (evita repetir a mesma magia como "grátis" e como
  escolha normal do mesmo level-up), e a pool de Magias Preparadas
  passa a aceitar as magias do Perito como preparáveis, igual às do
  Livro de Magias normal.
  **Testado no navegador** (Playwright, 390px, personagem Mago
  Necromante criado do zero pelo wizard, nível 1→6): nível 3 mostra o
  passo "Perito em Necromancia — escolha 2" com o aviso 🏠 Homebrew
  visível e o catálogo certo (1º+2º círculo); nível 4 NÃO mostra o
  passo; nível 5 mostra de novo com "escolha 1" e already inclui o 3º
  círculo (confirma o desbloqueio); nível 6 NÃO mostra. Na aba Magias,
  o Livro de Magias final lista as 2 magias do nível 3 ("Raio do
  Enfraquecimento") e a do nível 5 ("Falar com Mortos") junto com as
  normais — confirma que a fusão no grimório persistiu corretamente
  por vários level-ups seguidos, sem erro de console.
  tsc/testes(347)/build verdes.
**B3 — Mecânica que usa o motor de Pets (Fase P já fechada), quebrada
em 5 entregas pequenas** (perguntei ao Osmar onde cada uma fica e como
o jogador ativa ANTES de codar, ver respostas abaixo — CLAUDE.md §6):

- **Familiar Morto-Vivo:** card dedicado na aba Pets (mesmo padrão do
  "Convocar Familiar" do Bruxo), restrito a Esqueleto/Zumbi.
- **Bônus da Legião dos Mortos (PV extra + dano bônus):** campo
  visível no `PetCard`, ligado/desligado manualmente pelo jogador —
  sem cálculo automático de qual magia criou o pet.
- **Colheita Macabra:** ligado ao "Usar Magia" de verdade (não um
  botão solto) — ao conjurar magia de Necromancia com espaço, mostra
  a lista de quem pode ser curado filtrada só pra Morto-Vivo
  (precisa de uma função de "isso é Morto-Vivo?" olhando
  `Criatura.tipo`, cuidado com a inconsistência de maiúscula/minúscula
  já encontrada nos dados — "Morto-Vivo" no Esqueleto vs "Morto-vivo"
  no Zumbi).
- **Colheita dos Mortos / Mestre da Morte:** botões na aba Combate que
  abrem a escolha de pet(s) afetado(s) e refletem o resultado na aba
  Pets — Colheita dos Mortos escolhe 1 aliado Morto-Vivo da lista e
  mata ele pra curar o personagem; Mestre da Morte mostra todos os
  aliados Morto-Vivo numa multi-seleção (mesmo padrão de seleção
  múltipla já usado em magias) e aplica PV Temporário a todos os
  marcados.

- [x] **B3a — Familiar Morto-Vivo.** `core/necromante.ts` ganhou
  `formasFamiliarMortoVivoElegiveis(subclasse, nivel)` — mesmo padrão
  de `formasFamiliarDasInvocacoes` (Bruxo), só que a elegibilidade vem
  de `caracteristicaSubclasseDesbloqueada(subclasse, 'Grimório de
  Necromancia', nivel)` em vez de uma Invocação Mística (a
  característica já cobre Familiar Morto-Vivo desde o nível 3). 2
  testes Vitest (nível 3+ mostra Esqueleto/Zumbi; nível 2 ou outra
  subclasse não mostra nada). `PetsTab.tsx` ganhou um 2º card
  "🧟 Familiar Morto-Vivo (Encontrar Familiar) — escolha a forma",
  reaproveitando o componente `AdicionarPet` já existente, com um
  `origemInvocacaoId` próprio (`necromante-familiar-morto-vivo`) —
  convocar de novo substitui o anterior, mesma regra de "só 1 por vez"
  do Convocar Familiar do Bruxo. `FichaShell.tsx` só precisou calcular
  a lista e passar como prop — zero campo novo pra persistir (a
  criação do pet já usa o mecanismo `adicionarPet` existente).
  **Testado no navegador** (Playwright, 390px, Mago Necromante nível
  3): o card aparece com Esqueleto/Zumbi no dropdown; convocar
  "Ossorius" (Esqueleto) cria o pet; convocar "Podrengo" (Zumbi) logo
  depois substitui — só 1 card no final, com CA/PV/traços reais do
  Zumbi.
  tsc/testes(349)/build verdes.
- [x] **B3b — Legião dos Mortos (bônus manual no PetCard).** Cobre só
  a parte de PV extra/dano bônus (a parte de "Animar Mortos sempre
  preparada + 1x grátis" ainda não foi feita, ver nota abaixo).
  `core/pets.ts` ganhou `BonusExtraPet` (`{ rotulo, pv, dano }`) como
  campo opcional em `Pet` — motor genérico, não sabe o nome da
  característica, só guarda o que o CALLER mandou; `pvMaxEfetivoPet`
  passou a somar esse bônus; `comBonusExtra(pet, bonusOuNull)` liga/
  desliga. **Achado no caminho, corrigido:** `alterarPvPet` (o
  handler de +/-5/+/-1 no `FichaShell.tsx`) usava `pvMaxCriatura`
  puro (valor CRU da criatura) como teto de cura em vez de
  `pvMaxEfetivoPet` (que já considera `ajustes`/`bonusExtra`) — bug
  antigo desde a P5 (ajustar CA/PV de um pet não afetava o teto real
  de cura), corrigido junto porque senão o bônus de PV desta entrega
  nem seria testável de verdade. `core/necromante.ts` ganhou
  `ehMortoVivo(criatura)` (compara `tipo` sem diferenciar maiúscula/
  minúscula — a planilha tem "Morto-Vivo" no Esqueleto e "Morto-vivo"
  no Zumbi, mesma coisa grafada diferente, ver PENDENCIAS.md) e
  `bonusLegiaoDosMortos(nivelMago, modInt)` (PV = nível de Mago, dano
  = mod. INT). `PetsTab.tsx`: `PetCard` ganhou uma linha de toggle
  ("🦴 Legião dos Mortos — +X PV, +Y dano nos ataques"), só visível
  quando a característica está desbloqueada (nível 6+) E o pet é
  Morto-Vivo (`ehMortoVivo`) — um Gato comum nunca mostra o toggle,
  mesmo com a característica ativa. PV mostra tag "🦴 +X" quando
  ligado. 9 testes Vitest novos (2 em `pets.test.ts`, 7 em
  `necromante.test.ts`, incluindo o caso de borda da grafia
  "Morto-vivo" minúscula do Zumbi).
  **Testado no navegador** (Playwright, 390px, Necromante nível 6):
  convocou Zumbi (Podrengo) e Gato comum (Bichano) — toggle "Legião
  dos Mortos +6 PV, +3 dano" só aparece no Zumbi; ligar sobe PV de
  15/15 pra 15/21; desligar volta pra 15/15; sem erro de console.
  tsc/testes(356)/build verdes.
- [ ] **B3b-2 — Legião dos Mortos, parte que falta.** Animar Mortos
  sempre preparada (some na lista de Magias Preparadas sem gastar
  vaga) + 1x grátis sem espaço de magia por Descanso Longo — ainda não
  desenhado onde fica; decidir junto com o Osmar quando chegar a vez
  (mesmo padrão de "sempre preparada" já usado noutras características,
  ver Descobertas Mágicas/Mago).
- [x] **B3c — Colheita Macabra (ligado ao Usar Magia, filtro
  Morto-Vivo).** `core/necromante.ts` ganhou `curaColheitaMacabra(circulo)`
  (dobro do círculo do espaço gasto — upcast conta o círculo GASTO, não
  o original da magia) e `petsElegiveisColheitaMacabra(pets)` (filtra
  só Morto-Vivo, reaproveitando `ehMortoVivo`). Novo componente
  compartilhado `ui/components/ColheitaMacabraBanner.tsx` — banner
  "🩸 Colheita Macabra — cura X PV..." com dropdown de pet + botões
  Curar/Dispensar, no mesmo estilo visual do banner "Rolagem de acerto
  feita" que já existia. **Achado ao investigar onde plugar:** existem
  DUAS implementações separadas e já duplicadas de "conjurar magia com
  espaço" (`MagiasTab.tsx`'s `processarMagiaAoUsar` e
  `AcaoPanelContent.tsx`'s `conjurarMagia`, usadas respectivamente pela
  aba Magias e pelo painel de Ação do Combate) — Colheita Macabra
  precisou ser plugada nas DUAS, cada uma disparando o banner só
  quando `circulo !== null` (slot de verdade gasto, não truque nem
  magia grátis de invocação) E `magia.escola === 'Necromancia'`.
  **Achado de arquitetura, resolvido:** no painel de Ação do Combate, o
  próprio painel FECHA assim que a magia é conjurada (`onEscolher`
  desmonta o `AcaoPanelContent`) — por isso o banner de Colheita
  Macabra não podia viver dentro do painel (sumiria antes do jogador
  ver); mora em `CombatTab.tsx` (que sobrevive ao fechamento), igual
  já acontecia com `danoPendente`/`feedback`, com `AcaoPanelContent`
  só avisando via um callback novo (`onColheitaMacabraDisponivel`)
  quando a conjuração se qualifica.
  **Testado no navegador** (Playwright, 390px, Necromante nível 3,
  familiar Zumbi danificado de propósito pra ver a cura): conjurar
  "Vitalidade Vazia" com espaço de 1º círculo pela aba Magias mostrou
  o banner "cura 2 PV", escolher o Zumbi e confirmar curou de 10/15
  pra 12/15; repetindo pelo painel de Ação do Combate com espaço de 2º
  círculo mostrou "cura 4 PV" corretamente (upcast conta certo) — sem
  erro de console nos dois fluxos.
  tsc/testes(360)/build verdes.
- [ ] **B3d — Colheita dos Mortos (botão de Reação no Combate).**
- [ ] **B3e — Mestre da Morte (Ação Bônus multi-seleção + Reação).**
- [ ] **B4 — Poder Funesto, parte sem motor novo.** Recuperação
  Arcana também reduz Exaustão em 1 (reaproveita o campo de Exaustão
  já existente, se houver) e Necrose Avassaladora (dano de Necromancia
  ignora resistência — depende do motor de dano de magia por tipo,
  registrar em `PENDENCIAS.md` se não existir ainda, mesma trava já
  conhecida do talento Adepto Elemental no `Backlog.md`).

---

**Próximo passo:** B3c fechado — seguir com **B3d** (Colheita dos
Mortos, botão de Reação no Combate que escolhe um pet Morto-Vivo e o
mata pra curar o personagem).
