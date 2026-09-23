# SDD — Mago: características da classe base sem mecânica (auditoria)

> Chapéu de Game Designer (CLAUDE.md §6.2), foco "Mago — características
> base quebradas". Aberto no meio do foco Evocador (pausado, ver
> `EmDevB.md`) depois de uma auditoria completa das 10 características
> da classe base de Mago (`caracteristicasClasse.ts`), pedida pelo
> Osmar ("faz uma limpa em mago por completo... desconfie das coisas
> que são texto puro e não estão ligadas a nada").

## 0. Resultado da auditoria

Conferidas as 10 características de `classe: 'Mago'`:

**Com mecânica de verdade (nada a fazer):** Conjuração (nv.1 — truques/
Livro de Magias/Espaços/Magias Preparadas, todo o fluxo de Level Up já
funciona), Subclasse de Mago (nv.3), Aumento no Valor de Atributo
(nv.4/8/12/16, mecanismo genérico), Memorizar Magia (nv.5, flag
própria), Dádiva Épica (nv.19, mecanismo genérico).

**Só texto, zero código (o resto deste SDD):** Adepto de Ritual (nv.1),
Recuperação Arcana (nv.1), Acadêmico (nv.2 — o bug que o Osmar
reportou, já corrigido na Entrega 1), Maestria de Magias (nv.18),
Assinatura Mágica (nv.20).

**Achado numa 2ª passada (CLAUDE.md §6.1.2, leitura das páginas 147-149
do PDF completas, não só as linhas nomeadas da planilha):** "Expandindo
e Substituindo um Livro de Magias" — uma caixa de texto solta entre
Acadêmico (nv.2) e Subclasse de Mago (nv.3), sem nome de característica
própria na planilha, com 2 mecânicas reais de Copiar Magia (ver seção
1). Confirma o motivo de ter escapado da 1ª auditoria: só existem
linhas nomeadas "Nível X: Nome" na aba de Características de Classe —
regra solta no meio do capítulo não vira linha, então nunca apareceu
na lista original.

## 1. Regra real de cada uma

- **Adepto de Ritual** (nv.1): "Você pode conjurar qualquer magia como
  um Ritual se essa magia tiver o marcador Ritual e a magia estiver em
  seu livro de magias. Você não precisa ter a magia preparada, mas
  deve ler o livro para conjurar uma magia deste modo."
- **Recuperação Arcana** (nv.1): "Ao completar um Descanso Curto, você
  pode escolher recuperar espaços de magia gastos. Os espaços de magia
  podem ter um círculo combinado igual a não mais da metade do seu
  nível de Mago (arredondado para cima), e nenhum dos espaços pode ser
  de 6º círculo ou superior. [...] Você pode usar esta característica
  novamente após completar um Descanso Longo."
- **Acadêmico** (nv.2): "Escolha uma das seguintes perícias nas quais
  você tem proficiência: Arcanismo, História, Investigação, Medicina,
  Natureza ou Religião. Você tem Especialização na perícia escolhida."
- **Maestria de Magias** (nv.18): "Escolha uma magia de 1º e uma de 2º
  círculo em seu livro de magias que tenham um tempo de conjuração de
  uma ação. Você sempre tem essas magias preparadas, e pode conjurá-las
  em seu círculo mais baixo sem gastar um espaço de magia. Para
  conjurar qualquer uma delas em um círculo superior, você deve gastar
  um espaço de magia. Ao completar um Descanso Longo, você pode
  estudar seu livro de magias e substituir uma dessas magias por uma
  magia elegível do mesmo círculo do livro."
- **Assinatura Mágica** (nv.20): "Escolha duas magias de 3º círculo em
  seu livro de magias como suas assinaturas mágicas. Você sempre tem
  essas magias preparadas e pode conjurá-las, cada uma delas, uma vez
  no 3º círculo sem gastar um espaço de magia. [...] você não pode
  conjurá-las deste modo novamente até completar um Descanso Curto ou
  Longo. Para conjurar uma das magias em um círculo superior, você deve
  gastar um espaço de magia."
- **Expandindo e Substituindo um Livro de Magias** (caixa de texto,
  sem nível — vale desde que o personagem tem Livro de Magias, nv.1+):
  - **Copiando uma Magia para o Livro**: "Ao encontrar uma magia de
    Mago de 1º círculo ou superior, você pode copiá-la para o seu
    livro de magias se for de um círculo que você possa preparar e se
    tiver tempo para copiá-la. Para cada círculo de magia, a
    transcrição leva 2 horas e custa 50 PO."
  - **Copiando o Livro**: "Você pode copiar uma magia do seu livro de
    magias para outro livro. [...] Você precisa gastar apenas 1 hora e
    10 PO para cada círculo de magia copiada." (backup/segundo livro —
    o Osmar confirmou: 1 única feature de "Copiar Magia" com escolha
    entre os 2 modos, não 2 entregas separadas.)

## 2. O que já existe no motor (reaproveitar, não reinventar)

- **`calcularPericias(selection, nivel, periciasEspecialista,
  periciasBonusExtras, ...)`** (`core/calculoPersonagem.ts:516`) já
  separa PROFICIÊNCIA extra (`periciasBonusExtras` — hoje alimentado
  por `conhecimentoPrimordialPericiaEscolhida` e outras fontes, ver
  `FichaShell.tsx:579`) de ESPECIALISTA/dobra (`periciasEspecialista`
  — 1º parâmetro, `periciasEspecialistaAtuais`). Acadêmico escolhe 1
  perícia que precisa entrar nos DOIS arrays ao mesmo tempo (ganha
  proficiência NOVA + já vem com a dobra) — nenhum mecanismo genérico
  faz isso hoje (Especialista de Bardo pressupõe proficiência
  PRÉ-EXISTENTE), mas basta 1 estado novo alimentando os dois lugares.
- **`conhecimentoPrimordial`** (`LevelUpShell.tsx`, step + state +
  `opt-card` list) é o template exato de "escolha 1 perícia de uma
  lista fixa, uma vez só, permanente" — Acadêmico copia a mesma
  estrutura trocando a lista fixa (6 perícias em vez de 5) e o destino
  do valor escolhido (entra em `periciasBonusExtras` E em
  `periciasEspecialista`, não só 1 dos 2).
- **`DescansoOverlay`/`aoFadeInCompleto`/fase `'perguntaRedefinir'`**
  (`FichaShell.tsx:1526-1546`) já é o padrão de "pergunta condicional
  no meio da transição de descanso" (usado hoje só no Descanso Longo,
  pra Magias Preparadas) — Recuperação Arcana precisa do mesmo padrão,
  mas no Descanso CURTO, condicionado a "é Mago, nível 1+, e tem pelo
  menos 1 Espaço gasto que pode ser recuperado" (senão a pergunta
  aparece sem sentido, mesmo cuidado já tomado pra Magias Preparadas).
- **`espacosGastosPorClasseECirculo`** (estado já existente,
  `FichaShell.tsx`) é onde a recuperação escreve — mesma estrutura que
  `descansoCurto()`/`descansoLongo()` já zeram pra outros casos, só que
  aqui é uma recuperação PARCIAL escolhida pelo jogador, não um reset
  total.
- **`livroDeMagias`** (estado já existente, lista completa de magias
  conhecidas — diferente de `magiasPreparadas`, que é só o subconjunto
  ativo) é de onde Adepto de Ritual/Maestria de Magias/Assinatura
  Mágica filtram suas opções — não precisa de nenhum novo mecanismo de
  "quais magias o personagem conhece", só filtrar essa lista já
  existente.
- **`m.tempoConjuracao?.includes('Ritual')`** (já usado em
  `MagiasTab.tsx` pro Ritual Rápido do talento Conjurador Ritualista)
  é o mesmo filtro que Adepto de Ritual precisa — mas Adepto de Ritual
  é ILIMITADO (sem gasto/contador), diferente do Ritual Rápido (1 uso
  compartilhado por Descanso Longo) — não reaproveita o STATE do
  Ritual Rápido, só o padrão visual de listar magias com tag Ritual.
- **`m.tempoConjuracao === 'Ação' || m.tempoConjuracao === 'Ação ou
  Ritual'`** é o filtro de "tempo de conjuração de uma ação" que
  Maestria de Magias exige (confirmado contra os valores reais da
  planilha, `magias.ts`).
- **Padrão "2 magias escolhidas, cada uma gasta um uso próprio,
  reseta em X"** — nenhuma característica existente faz exatamente
  isso ainda (mais perto: Magia de Pacto do Ínfero do Bruxo é uma
  lista FIXA sem escolha do jogador; Perito em Necromancia é escolha
  mas sem "conjura de graça 1x"). Assinatura Mágica precisa de
  contador próprio (2 flags booleanas, uma por magia escolhida,
  resetando em Descanso Curto OU Longo — os 2 resetters, não só 1).
- **`Moedas`/`totalEmPC`/`totalEmPO`** (`core/moedas.ts`) já modela a
  bolsa de moedas do personagem (5 denominações, conta interna em PC)
  — Copiar Magia usa isso pra cobrar o custo (50 PO/círculo pra
  copiar magia nova; 10 PO/círculo pra copiar pro livro reserva). Hoje
  nada no app deduz moedas automaticamente (Mochila deixa o jogador
  editar o total à mão) — decisão de auto-deduzir ou só informar o
  custo fica pra hora de implementar essa entrega (seção 4).
- **`valorRecursoClasse`/`espacosDeMagiaAtivos`** (já usados em
  `LevelUpShell.tsx` pra calcular `maxTruques`/`maxMagiasPreparadas`/
  espaços por círculo do NOVO nível) são a base do "Guia do Level Up"
  (seção 3/4) — só falta calcular a MESMA coisa pro nível ANTERIOR
  (`personagem.nivel`, hoje não computado) pra virar delta
  antes→depois.

## 3. Decisões de leitura (sem mecânica nova pro app, ou pendente de confirmação)

- **Adepto de Ritual, ilimitado de verdade, sem contador** — RAW não
  tem limite de uso (só o custo narrativo do tempo de Ritual, +10min,
  que o app não simula tempo de jogo). Vira uma seção só de LISTAGEM +
  botão "Conjurar como Ritual" (sem gastar Espaço, sem contar como
  Magia Preparada) pra qualquer magia com tag Ritual no
  `livroDeMagias`, disponível sempre que for Mago nível 1+.
- **Recuperação Arcana — orçamento de círculos, não de espaços** — a
  regra é "círculo COMBINADO até metade do nível (arred. pra cima)",
  não "N espaços". Ex.: Mago nível 6 pode recuperar até 3 círculos
  combinados: 1 espaço de 3º, ou 3 espaços de 1º, ou 1+2, etc. — tela
  de escolha múltipla com um total rodando, trava quando o orçamento
  acaba (mesmo espírito da tela "Livro de Magias — escolha N" já
  usada no Level Up, adaptada pra "escolha até o orçamento X").
- **Maestria de Magias e Assinatura Mágica são passos de Level Up
  (nv.18/20), reaproveitando "escolha da lista do Livro de Magias"**
  — mesma UI de "grid de magias pra escolher" já usada em Perito em
  Necromancia, só filtrando por círculo/tempo de conjuração
  específicos. **Só Maestria de Magias tem regra de troca** ("Ao
  completar um Descanso Longo, você pode... substituir uma dessas
  magias por uma magia elegível do mesmo círculo" — Assinatura Mágica
  não menciona troca nenhuma no texto, escolha é permanente). A troca
  de Maestria de Magias entra na MESMA entrega da característica (não
  é trabalho extra de verdade — reaproveita a mesma tela de escolha
  já construída pra Entrega 4, só disparada por um gatilho novo:
  pergunta condicional no Descanso Longo, mesmo padrão de
  "quer redefinir Magias Preparadas?" já usado ali. Corrigido depois
  do Osmar apontar que "deixar pela metade" não faz sentido quando o
  custo de fazer certo já é baixo).
- **Copiar Magia é 1 feature só, com escolha entre 2 modos** (não 2
  entregas): "Copiar magia nova pro Livro" (de uma fonte externa —
  pergaminho, outro livro achado na aventura — pra dentro do SEU
  Livro de Magias, 2h+50 PO/círculo) vs. "Copiar magia conhecida pra
  outro livro" (backup/livro reserva, 1h+10 PO/círculo). O app não
  modela um "2º livro" separado — o modo backup fica registrado só
  como confirmação/nota (não muda `livroDeMagias`, já que a magia já
  estava lá); o modo "nova" é o que de fato adiciona uma magia ao
  `livroDeMagias`.
- **A tela "Novas Características" do Level Up vira o guia completo do
  nível** (pedido do Osmar, depois do bug do Acadêmico mostrar que
  texto sem número ao lado engana): toda linha mostra o delta real
  (Truques: X→Y, Magias Preparadas: X→Y, Espaços de Magia por Círculo:
  X→Y quando mudar, ASI: disponível) + cada característica nova com
  seu texto E seu `statusImplementacao` (CLAUDE.md §12.1) — linha
  `placeholder-*` mostra `[PH]` automaticamente. Característica
  `textonly` (confirmada) aparece só aqui, sem step depois;
  característica `codeimplementation` aparece aqui E leva ao step de
  verdade na sequência (quando o step já existir).
- **Esta entrega também é o "gancho" pra classificar TODAS as 10
  características do Mago com `statusImplementacao`** (retroativo,
  já que são o foco atual — CLAUDE.md §12.1 permite isso só na classe
  em andamento). Acadêmico vira `codeimplementation` (feito); as
  outras 4 (Recuperação Arcana, Adepto de Ritual, Maestria de Magias,
  Assinatura Mágica) viram `placeholder-codeimplementation` (têm
  mecânica real prevista, ainda não construída); Conjuração/Subclasse
  de Mago/ASI/Memorizar Magia/Dádiva Épica viram `codeimplementation`
  (já funcionam). Nenhuma do Mago vira `textonly` — todas as 10 têm
  mecânica real esperada.

## 4. Decisões de implementação (chapéu de execução decide o detalhe fino por entrega)

- **Acadêmico:** novo `LuStep` ('academico'), cópia estrutural de
  `conhecimentoPrimordial` — lista fixa `['Arcanismo', 'História',
  'Investigação', 'Medicina', 'Natureza', 'Religião']`, estado
  `academicoPericiaEscolhida: string | null`. No `calcularPericias`
  de `FichaShell.tsx`, o valor escolhido entra tanto em
  `periciasBonusExtras` (junto de `conhecimentoPrimordialPericiaEscolhida`
  etc.) quanto em `periciasEspecialistaAtuais` (junto do que já vem de
  Especialista/Especialização).
- **Recuperação Arcana:** nova fase no fluxo de Descanso Curto —
  `DescansoOverlay` ganha uma pergunta condicional (mesmo padrão da
  `'perguntaRedefinir'` do Longo) quando `classe === 'Mago' && nivel
  >= 1 && algumEspacoGasto`. "Sim" abre uma tela nova (grid de
  círculos gastos, orçamento = `Math.ceil(nivel / 2)`, nenhum círculo
  6+) — reaproveita `TickPips`/padrão de contagem já usado em
  `EscolherCirculoShell`. Flag "já usado desde o Descanso Longo"
  (`recuperacaoArcanaGasta`, reseta em `descansoLongo()`).
- **Adepto de Ritual:** nova seção na aba Magias (`MagiasTab.tsx`),
  visível só pra Mago nível 1+ — lista as magias do `livroDeMagias`
  com `tempoConjuracao?.includes('Ritual')` que NÃO estão em
  `magiasPreparadas` (as já preparadas conjuram normal, sem precisar
  dessa característica), cada uma com botão "Conjurar como Ritual"
  (sem gasto de Espaço, sem popup de escolha de círculo).
- **Maestria de Magias:** novo `LuStep` no nível 18, grid filtrando
  `livroDeMagias` por círculo (1 e depois 2, 2 telas ou 1 tela com 2
  seções) e `tempoConjuracao` de Ação. As 2 escolhidas viram
  "sempre preparadas" (mesmo tratamento de Magias de Pacto do Ínfero,
  que já ficam fora da conta normal de Magias Preparadas) + têm um
  botão "conjurar sem gastar Espaço" na aba Magias/Combate.
- **Assinatura Mágica:** novo `LuStep` no nível 20, grid filtrando
  `livroDeMagias` por círculo 3. As 2 escolhidas ganham 1 flag de uso
  cada (`assinaturaMagicaGasta1`/`2`, resetando em `descansoCurto()`
  E `descansoLongo()`) — botão "conjurar de graça" desabilita depois
  do 1º uso do período, com o botão normal (gastando Espaço) sempre
  disponível como alternativa.
- **Maestria de Magias — troca no Descanso Longo:** pergunta
  condicional (só aparece se a característica já foi adquirida) →
  mesma tela de escolha da Entrega 4, reaberta com a magia atual
  pré-selecionada, trocando por outra elegível do mesmo círculo.
  Nenhum estado novo além do que a Entrega 4 já cria.
- **Guia do Level Up:** no passo `'features'` de `LevelUpShell.tsx`,
  computar `valorRecursoClasse`/`espacosDeMagiaAtivos` pro nível
  ANTERIOR (`personagem.nivel`) além do novo (já calculado) — mostrar
  como linhas "X → Y" só quando o valor muda. Cada característica
  desbloqueada nesse nível ganha um badge `[PH]` quando
  `statusImplementacao` começa com `placeholder-` (lido direto do
  dado, não mais escrito à mão no texto). Adiciona `statusImplementacao`
  nas 10 linhas de `caracteristicasClasse.ts` do Mago (seção 3) e cria
  as 4 funções-esqueleto em `core/` pras características ainda
  `placeholder-codeimplementation` (Recuperação Arcana, Adepto de
  Ritual, Maestria de Magias, Assinatura Mágica) — vazias, só com a
  doc-comment de status (CLAUDE.md §12.1).
- **Copiar Magia:** botão novo na aba Magias (`MagiasTab.tsx`), visível
  pra Mago nível 1+ — abre uma escolha entre "Copiar magia nova pro
  Livro" (grid do catálogo de magias de Mago 1º círculo+ até o círculo
  preparável, ao confirmar soma em `livroDeMagiasAtuais` e informa/
  desconta o custo) e "Copiar pra livro reserva" (grid das magias JÁ
  no `livroDeMagias`, ao confirmar só mostra/desconta o custo, não
  muda estado nenhum — é só registro de que a cópia existe fora do
  livro principal).

## 5. Quebra em entregas

1. **Entrega 1 — Acadêmico** (nv.2, o bug reportado): passo de Level
   Up + wiring em `calcularPericias`. ✅ Feito (`v202609_0822`).
2. **Entrega 2 — Guia do Level Up:** tela "Novas Características"
   passa a mostrar delta real de cada recurso (Truques/Magias
   Preparadas/Espaços por Círculo/ASI) + `[PH]` automático por
   característica via `statusImplementacao`. Classifica as 10
   características do Mago (retroativo) e cria as 4 funções-esqueleto
   em `core/` das que ainda faltam. Base pra todas as entregas
   seguintes já nascerem com o status certo desde o começo.
   ✅ Feito (`v202609_1204`/`v202609_1412`).
3. **Entrega 3 — Copiar Magia pro Livro:** botão na aba Magias, 2
   modos (nova pro livro / backup pra livro reserva), custo em PO.
   ✅ Feito (`v202609_1731`).
4. **Entrega 4 — Recuperação Arcana** (nv.1): pergunta condicional no
   Descanso Curto + tela de escolha de círculos com orçamento.
   ✅ Feito (`v202609_1902`).
5. **Entrega 5 — Adepto de Ritual** (nv.1): seção nova na aba Magias
   listando magias Rituais do Livro não preparadas, conjuração livre.
6. **Entrega 6 — Maestria de Magias** (nv.18): passo de Level Up +
   conjuração grátis no círculo mais baixo + troca no Descanso Longo
   (mesma tela reaberta).
7. **Entrega 7 — Assinatura Mágica** (nv.20): passo de Level Up +
   conjuração grátis 1x por descanso (2 flags).
8. **Entrega 8 — Fechamento:** testes/tsc/build,
   `aprendizados/classes/mago.md` (criar), nota no `PENDENCIAS.md`
   propondo repetir o "Guia do Level Up" (Entrega 2) nas outras 9
   classes já implementadas. Depois disso, retomar o foco do Evocador
   (Entrega 2, Versado em Evocação) de onde parou.
