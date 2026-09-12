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

## Foco: Fase M — Multiclasse (M4 — Conjuração Combinada)

Continuação da Fase M (M0-M3 fechados, ver `DECISOES-CLASSES.md`).
Osmar aprovou seguir ("bora") logo após o fechamento do M2+M3.

Plano em 3 entregas pequenas:
- **M4a — Motor: classificação de conjurador + nível equivalente**
  (sem nada visível na tela ainda).
- [x] **M4b (parte 1) — Isolamento do pool de espaços por classe.**
  Achado ao investigar a ponte do Bruxo: `espacosGastosPorCirculo`
  era 1 dict SÓ (chave = número do círculo), compartilhado entre
  QUALQUER classe ativa — 2 classes com espaço no mesmo número de
  círculo (ex: Bruxo com Pacto no 2º + Mago com Espaços normais também
  no 2º) corrompiam o contador uma da outra. Também achado: Descanso
  Curto só recuperava os círculos da classe ATIVA no momento do
  descanso — o Bruxo perdia a recuperação de Pacto se a pill estivesse
  noutra classe. Corrigido: novo estado
  `espacosGastosPorClasseECirculo: Record<string, Record<number, number>>`
  (chave externa = nome da classe), com migração automática do formato
  antigo (1 classe só) pra dentro da classe original. Descanso Curto
  agora percorre TODAS as classes do personagem, não só a ativa.
  Testado ao vivo no navegador: gastar um Espaço de Magia com Mago
  ativo (Guerreiro/Mago) mostra o contador de 1º círculo caindo de 2/2
  pra 1/2 corretamente, sem regressão no caso de 1 classe só.
  tsc(-b)/testes(419)/build verdes.
- [x] **M4b (parte 2) — ponte de uso cruzado de espaços entre Magia de
  Pacto do Bruxo e Conjuração normal.** Confirmado com o Osmar antes de
  codar (CLAUDE.md §6): pergunta sempre que os 2 pools tiverem espaço
  pro círculo da magia (nunca some fora, e nunca assume 1 dos 2 como
  "prioridade fixa"); com só 1 dos 2 tendo espaço, gasta dele direto,
  sem perguntar nada. Confirmado também que a ponte vale nos DOIS
  sentidos — qualquer uma das 2 classes pode gastar de qualquer um dos
  2 pools, não só "a que combina com a origem da magia" (SDD Multiclasse
  seção 8.5).
  Novo `core/magiasPersonagem.ts`: `opcoesGastoComPonte` junta as
  opções de círculo da classe ativa + (se `temPonteDeMagiaDePacto`,
  `core/multiclasse.ts`) as da outra classe, cada uma rotulada com a
  classe dona. `EscolherCirculoShell` (tela compartilhada por
  Magias/Ação/Reação) mostra o rótulo da classe só quando existem 2+
  classes nas opções — pra 100% dos personagens sem essa combinação,
  tela idêntica a antes. `gastarSlotCirculo` (`FichaShell.tsx`) ganhou
  um 2º parâmetro opcional (classe a descontar, default = ativa).
  Painel de Reação NÃO ganhou a ponte ainda (já não tem o picker novo,
  ver `PENDENCIAS.md` "Painel de Reação ainda usa a lista plana antiga") —
  continua gastando só da classe ativa.
  6 testes Vitest novos em `magiasPersonagem.test.ts` (sem ponte =
  idêntico a antes; com ponte = junta as 2; pool da ponte cheio não
  aparece) + 3 em `multiclasse.test.ts` (`temPonteDeMagiaDePacto`).
  **Não testado ao vivo no navegador** (só Vitest) — só alcançável
  hoje com Bruxo+Bardo ou Bruxo+Mago multiclasse, criar esse
  personagem de teste levaria muitas etapas de wizard; a cobertura de
  teste usa os números oficiais do livro como fixture. tsc(-b)/
  testes(425)/build verdes.
- [ ] **M4c — Ficha: Magias tab mostra o pool combinado** (quando 2+
  classes conjuradoras normais coexistem) em vez de cada classe
  separada.

- [x] **M4a — Motor: classificação de conjurador + nível equivalente.**
  Nova tabela `data/rulesets/dnd2024/conjuradorMulticlasse.ts` (12
  classes, SDD seção 8.2 — fato de regra, não vem da planilha, mesmo
  padrão de exceção documentada de `classesProficienciasIniciais.ts`):
  'completo' (Bardo/Clérigo/Druida/Feiticeiro/Mago), 'meio'
  (Guardião/Paladino), 'terco-com-subclasse' (Guerreiro/Cavaleiro
  Místico, Ladino/Trapaceiro Arcano — só conta com a subclasse certa),
  'pacto' (Bruxo — nunca entra na soma), 'nenhum' (Bárbaro/Monge).
  `core/multiclasse.ts` ganhou `temConjuracaoMulticlasse` (2+ classes
  contam = true), `temMagiaDePacto`, `nivelEquivalenteConjuracaoMulticlasse`
  (soma cheia/metade-pra-cima/terço-pra-baixo conforme o tipo),
  reaproveitando `espacosMagiaParaNivelCombinado` (já existia desde M1).
  10 testes Vitest novos (incluindo o exemplo oficial do livro:
  Guardião 4/Feiticeiro 3 = nível equivalente 5). **Não testável na
  tela** — só motor, nenhuma das 4 classes implementadas hoje
  (Guerreiro/Bardo/Bruxo/Mago) alcança o caso "terço-com-subclasse"
  ainda. tsc(-b)/testes(419)/build verdes.
