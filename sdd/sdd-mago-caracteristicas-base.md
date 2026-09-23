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
reportou), Maestria de Magias (nv.18), Assinatura Mágica (nv.20).

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
  específicos. A TROCA delas (permitida em Descanso Longo) é secundária
  — como pouquíssimos personagens chegam nível 18-20, a troca pode
  ficar de fora da primeira entrega e ir pro `PENDENCIAS.md` sem
  travar o resto.

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
- **Troca de Maestria de Magias/Assinatura Mágica no Descanso Longo**
  fica de fora da primeira leva de entregas (nenhum personagem de
  teste chega nível 18-20 hoje) — vai pro `PENDENCIAS.md` ao fechar o
  foco, não trava as entregas principais.

## 5. Quebra em entregas

1. **Entrega 1 — Acadêmico** (nv.2, o bug reportado): passo de Level
   Up + wiring em `calcularPericias`. Menor e mais urgente (todo Mago
   passa pelo nível 2).
2. **Entrega 2 — Recuperação Arcana** (nv.1): pergunta condicional no
   Descanso Curto + tela de escolha de círculos com orçamento.
3. **Entrega 3 — Adepto de Ritual** (nv.1): seção nova na aba Magias
   listando magias Rituais do Livro não preparadas, conjuração livre.
4. **Entrega 4 — Maestria de Magias** (nv.18): passo de Level Up +
   conjuração grátis no círculo mais baixo.
5. **Entrega 5 — Assinatura Mágica** (nv.20): passo de Level Up +
   conjuração grátis 1x por descanso (2 flags).
6. **Entrega 6 — Fechamento:** testes/tsc/build,
   `aprendizados/classes/mago.md` (criar), `PENDENCIAS.md` ganha a
   troca de Maestria/Assinatura no Descanso Longo (nv.18/20, baixa
   prioridade). Depois disso, retomar o foco do Evocador (Entrega 2,
   Versado em Evocação) de onde parou.
