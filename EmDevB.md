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
  (A7). Magias Preparadas passa a escolher só dentre o que está no
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
  entrega pequena, junto ou logo depois da A7 (que já mexe na mesma
  área de Descanso).
- [ ] **A5b — Memorizar Magia (nível 5+).** Card na aba Combat (mesmo
  padrão de Astúcia Mágica do Bruxo — botão que trava até o próximo
  Descanso Curto): troca 1 magia preparada por outra do Livro de
  Magias, disponível 1x por Descanso Curto.
- [ ] **A6 — Subclasse placeholder.** Abjurador/Adivinhador/Evocador/
  Ilusionista em `subclasses.ts`, sem mecânica (mesmo padrão já usado
  em Bardo/Bruxo — reaproveite 100%, deve ser rápido).
- [ ] **A7 — Transição de Descanso (fade + prompt).** Pedido explícito
  do Osmar, plugado nos 2 botões já existentes de `AtributosTab.tsx`
  (`onDescansoCurto`/`onDescansoLongo`, hoje sem nenhum feedback
  visual):
  - [ ] A7.1 — overlay genérico de tela cheia: fade-in pro preto,
    texto "Descanso Curto" ou "Descanso Longo" em branco no meio,
    fade-out. Descanso Curto: 0,5s fade-in + 0,5s fade-out (1s
    total). Descanso Longo: 1s fade-in + 1s fade-out (2s total).
    Component novo (provável `DescansoOverlay.tsx`, `position: fixed`,
    mesmo padrão de overlay de tela cheia já usado por `RollOverlay`/
    `LevelUpShell` — ver DECISOES-DESIGN.md).
  - [ ] A7.2 — só no Descanso Longo: se o personagem tiver Magias
    Preparadas no padrão "redefinição livre" (hoje só Mago), a
    transição PARA no preto (sem terminar o fade-in ainda virar
    fade-out) e mostra a pergunta "quer alterar suas magias
    preparadas?" (sim/não). Sim → abre a mesma tela de escolha da A5
    (grimório → preparadas). Não/confirmar → só então roda o
    fade-out. Personagem sem essa característica (ex: Bardo/Bruxo)
    não vê o prompt, só o fade normal.

### FASE P — Motor de Familiar/Pet (genérico — Bruxo, Mago, qualquer
classe futura), entre a Fase A e a Fase B

**Por que entra aqui e não dentro do Necromante:** não depende de Mago
pra existir (Bruxo já tem uma pendência real esperando por isso desde
antes deste foco) — fazendo agora, a Fase B (Necromante) já nasce
usando o motor pronto em vez de reinventar.

- [ ] **P0 — decisões de escopo a confirmar com o Osmar antes de
  codar** (característica nova com interação ativa — seção 6 do
  CLAUDE.md pede perguntar onde fica/como ativa antes; o "onde" já
  está decidido — aba Pets, depois de Combate — falta confirmar):
  quantos pets simultâneos por personagem (proposta: schema em array
  desde o início — hoje Bruxo usa só 1 posição, mas Legião dos Mortos
  do Necromante permite vários Mortos-Vivos ao mesmo tempo, não vale a
  pena fechar em "1 só" cedo); PV/CA do pet rastreável de verdade
  (dano/cura, mesmo padrão -5/-1/+1/+5 já usado no personagem) — proposta:
  sim, porque Colheita dos Mortos/Explosão Cadavérica do Necromante
  (Fase B) só funcionam de verdade se o pet tiver PV de verdade que
  chega a 0.
- [ ] **P1 — Dados.** Importar a aba "Estatísticas de Criaturas" (51
  criaturas) pra `data/rulesets/dnd2024/criaturas.ts`, mesmo padrão
  1:1 dos outros imports (zero lógica aqui).
- [ ] **P2 — Aba nova "Pets".** Entra em `FichaShell.tsx` (`TABS`,
  depois de `combat`) — lista de pets do personagem, 1 card por pet
  (nome escolhido pelo jogador + forma/criatura + CA/PV com barra +
  atributos + ações reais, vindo de `criaturas.ts`).
- [ ] **P3 — Fluxo de "ganhar"/remover um pet.** Escolher a forma
  dentre as elegíveis pra aquela fonte (ex.: lista padrão de Encontrar
  Familiar pro Bruxo) e desfazer o vínculo.
- [ ] **P4 — Ligar ao Bruxo.** Pacto da Corrente (Invocação Mística já
  existe no catálogo, hoje travada) passa a conceder Encontrar
  Familiar de verdade pela aba Pets — fecha a pendência já registrada
  em `PENDENCIAS.md`.

### FASE B — Necromante (subclasse homebrew, só depois das Fases A e P fechadas)

- [ ] **B0 — Convenção de marcação "homebrew".** Proposta a confirmar
  com o Osmar antes de codar (mesmo espírito do `[PH]`, seção 12 do
  CLAUDE.md, mas significado diferente — "não é regra oficial ainda,
  vai ser revisado"): campo `homebrew: boolean` em `Subclasse`
  (`subclasses.ts`) — UI deriva o badge desse campo em qualquer lugar
  que mostrar nome/característica da subclasse (card de escolha na
  Level Up, seção de características na Perfil/Combat), nunca
  hardcoded por nome. Falta decidir o visual do badge (cor, texto —
  ex.: tag âmbar "🏠 Homebrew — a revisar quando a regra oficial
  sair").
- [ ] **B1 — Dados.** `subclasses.ts` (Necromante, `homebrew: true`);
  `caracteristicasSubclasse.ts` (6 características reais, extraídas
  do PDF homebrew — texto já lido e transcrito acima).
- [ ] **B2 — Mecânica simples (sem depender da Fase P).** Perito em
  Necromancia (2 magias de Necromancia grátis no grimório ao pegar a
  subclasse + 1 a cada novo círculo de espaço) e Resistência Necrótica
  (passiva simples).
- [ ] **B3 — Mecânica que usa o motor de Pets (Fase P já fechada).**
  Familiar Morto-Vivo (Encontrar Familiar com formas especiais
  Esqueleto/Zumbi), Colheita Macabra (cura o pet ao conjurar magia de
  Necromancia com espaço), Legião dos Mortos (Animar Mortos, múltiplos
  Mortos-Vivos simultâneos com bônus), Colheita dos Mortos (Reação,
  zera PV do pet e cura o personagem), Mestre da Morte (PV Temp em
  massa + explosão ao pet chegar a 0 PV) — todas viram possíveis assim
  que a Fase P existir, sem bloqueio estrutural novo.
- [ ] **B4 — Poder Funesto, parte sem motor novo.** Recuperação
  Arcana também reduz Exaustão em 1 (reaproveita o campo de Exaustão
  já existente, se houver) e Necrose Avassaladora (dano de Necromancia
  ignora resistência — depende do motor de dano de magia por tipo,
  registrar em `PENDENCIAS.md` se não existir ainda, mesma trava já
  conhecida do talento Adepto Elemental no `Backlog.md`).

---

**Próximo passo:** aguardando o Osmar confirmar este plano (ou pedir
ajuste) antes de começar a escrever qualquer código, começando por A1.
Sequência das 3 fases: **A (Mago base) → P (Pets/Familiar, genérico)
→ B (Necromante, usando o motor da P)**.
