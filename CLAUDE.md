# CLAUDE.md

> Este arquivo contém regras permanentes deste projeto. Leia por completo
> antes de qualquer trabalho, mesmo que pareça repetitivo — o contexto da
> conversa se perde com o tempo, este arquivo não.
>
> Este arquivo é o "coração" do projeto: regras fixas, que não mudam com
> frequência. Decisões de design que evoluem com o tempo ficam na
> família de arquivos `DECISOES-*.md` (`DECISOES-DESIGN.md`,
> `DECISOES-WIZARD.md`, `DECISOES-FICHA.md`, `DECISOES-COMBATE.md`,
> `DECISOES-CLASSES.md`, `DECISOES-DADOS.md`) — leia o índice no topo
> de `DECISOES-DESIGN.md` pra saber qual arquivo cobre qual assunto,
> e **atualize o arquivo certo** sempre que tomar ou aprender algo
> sobre uma decisão de design (ver seção 7).
> Fatos de regra de D&D já confirmados (catálogo, valores,
> pré-requisitos) ficam em `DND-Regras.md`, organizados por tópico —
> leia esse também antes de mexer em dado de regra (ver seção 3.1).
> Coisas adiadas de propósito (ainda não resolvidas) ficam em
> `PENDENCIAS.md` — leia esse também, e **atualize-o** sempre que adiar
> algo ou resolver algo que estava lá (ver seção 11).
> O plano do foco que está em andamento AGORA mesmo fica em
> `EmDev.md` — leia esse antes de continuar um trabalho em progresso, e
> **mantenha atualizado** enquanto trabalha (ver seção 6 e 14).
> Observação pequena e recorrente de UI/UX/processo (ainda sem virar
> regra permanente) fica em `LICOES-RAPIDAS.md` — na 3ª repetição,
> vira decisão de verdade num `DECISOES-*.md` (ver seção 16). Bug/
> melhoria que o Osmar apontar e não for corrigido na hora fica em
> `Feedback.md` — leia esse antes de propor a próxima entrega, pode ter
> algo relevante já anotado lá (ver seção 15). Melhoria conhecida e
> tecnicamente possível, mas que a gente decide não fazer agora por
> prioridade (diferente de `PENDENCIAS.md`, que é o que trava
> estruturalmente) fica em `Backlog.md` (ver seção 17).

## 1. Quem está do outro lado

O responsável pelo produto (Osmar) **não sabe programar**. Ele só consegue
avaliar entregas testando na tela do celular — nunca leia um relatório
técnico e "confie". Isso muda como você deve trabalhar:

- Nunca diga que algo "deveria funcionar" sem dar um passo a passo de como
  testar na tela.
- Nunca entregue mudanças grandes de uma vez. Prefira sempre a menor
  entrega que já seja testável sozinha.
- Ao final de toda entrega relevante, responda sem que ele precise pedir:
  1. O que exatamente mudou (lista de arquivos, 1 frase cada)
  2. Como testar isso sozinho, sem ler código (passo a passo na tela)
  3. Isso quebra algo que já funcionava antes?
  4. Isso foi testado em largura de celular (~390px) primeiro? Tem algo
     pequeno demais pra tocar com o dedo?

## 2. Fonte de verdade de comportamento: o wireframe

`wireframe-app-rpg-v2.html` é a especificação de comportamento deste
projeto. Toda tela, transição e interação que você construir deve
reproduzir o que está ali — incluindo o Layout C da aba Combat (painel de
Ação/Ação Bônus/Reação, estado Ativo vs Usada, contador de Espaços de
Magia). Não invente fluxo novo sem confirmar antes. Se algo não estiver
claro no wireframe, pergunte — não assuma.

## 3. Fonte de verdade de dados: a planilha, nunca os PDFs

`dnd-master-referencia.xlsx`, na raiz do repositório, é a fonte de dados
de regras (classes, magias, talentos, equipamento, condições). Os PDFs
originais dos livros **não existem neste repositório** de propósito.
Nunca tente buscar regra em outro lugar (memória própria, web) — se a
planilha não tiver algo, pare e avise exatamente o que está faltando.

**Antes de começar qualquer entrega que toque em dado de regra**
(classes, subclasses, origens, espécies, talentos, magias, equipamento,
condições, progressão) — mesmo que pareça que o dado já foi importado
antes — **abra `dnd-master-referencia.xlsx` e confira a aba relevante
primeiro**, comparando com o que já existe em `src/data/`. O Osmar edita
essa planilha por fora das conversas com o Claude Code (corrige,
completa, reorganiza abas) — o histórico de chat perde essa evolução,
a planilha não. Se encontrar diferença entre o que está importado e o
que a planilha tem agora, trate como um bug de dado desatualizado:
avise o Osmar, não silenciosamente ignore nem silenciosamente
sobrescreva sem dizer o que mudou.

### 3.1 Regra de jogo confirmada vs. decisão de design — arquivos separados

`DND-Regras.md` guarda **fatos de regra de D&D já confirmados**
(catálogo, valores, exceções, pré-requisitos) organizados por tópico.
A família `DECISOES-*.md` guarda só decisão de arquitetura/UI/processo
do app (ver seção 7 e o índice no topo de `DECISOES-DESIGN.md`).
Antes desta regra, os dois ficavam misturados no mesmo arquivo, que
cresceu demais e virou difícil de reler.

- **Ordem de consulta pra regra de jogo:** primeiro `DND-Regras.md`;
  enquanto a migração não estiver marcada como concluída lá (ver o
  aviso "Status da migração" no topo daquele arquivo), também confira
  o(s) arquivo(s) `DECISOES-*.md` relevante(s) ao assunto (ver
  índice), que ainda podem ter regra de jogo não migrada. Quando
  `DND-Regras.md` marcar a migração como concluída, pare de checar a
  família `DECISOES-*.md` pra regra de jogo — só decisão de design
  continua lá.
- **Sempre que, lendo ou escrevendo em qualquer arquivo
  `DECISOES-*.md`, você encontrar ou for registrar um fato de regra
  de D&D** (não uma decisão de arquitetura/UI) — verifique se
  `DND-Regras.md` já tem um tópico onde esse fato se encaixa; se
  tiver, agrupe lá; se não tiver, crie um tópico novo. Depois de
  mover, apague o fato do arquivo `DECISOES-*.md` de origem, deixando
  lá só a decisão de design que eventualmente dependia dele
  (referencie o tópico de `DND-Regras.md` em vez de repetir o fato).
- Migração é incremental, tópico por tópico — não precisa migrar tudo
  de uma vez. Cada tópico só sai da lista de "ainda em
  DECISOES-*.md" quando alguém (Osmar ou Claude Code) mover de
  verdade o conteúdo.

## 4. Arquitetura em camadas — não negociável

- `data/` — conteúdo de regras (JSON/TS gerado a partir da planilha). Zero
  lógica aqui.
- `core/` — motor de cálculo (CA, PV, modificadores, economia de ação).
  Zero constante de D&D hardcoded — tudo lido de `data/`. TypeScript
  obrigatório aqui.
- `ui/` — componentes React. Nenhuma regra de D&D deve viver aqui; UI só
  exibe o que `core/` calcula.
- Armazenamento (local hoje, nuvem no futuro) fica atrás de uma interface
  trocável — nunca acesse `localStorage` direto de dentro de componentes.

## 5. Mobile/Tablet first — ordem de construção, não checklist final

Construa e teste em largura de celular (~390px) **primeiro**. Tablet e
desktop são "esticar depois", nunca o ponto de partida. Toda área
clicável precisa ser grande o suficiente pro dedo, não pro cursor. Nunca
esconda informação importante atrás de hover.

## 5.1 Ordem de construção de UI: M3 primeiro, pele RPG depois

Ao implementar qualquer componente/tela nova, siga sempre esta ordem:
1. Estrutura e comportamento seguindo Material Design 3
   (m3.material.io) — espaçamento, states, motion, acessibilidade,
   padrões de componente (bottom sheet, FAB, seleção, etc.).
2. Só depois, aplicar a pele temática de RPG por cima (textura,
   tipografia old-school, paleta dourada/bronze — ver
   `DECISOES-DESIGN.md` pra detalhes já registrados, seção "Sistema
   de design geral").
Isso é um processo padrão, não uma escolha caso a caso — vale pra toda
tela nova daqui pra frente.

## 6. Ciclo de um foco de trabalho — abrir, executar, fechar

Todo trabalho roda em cima de um **foco** (uma classe, uma aba, um
sistema) registrado no `EmDev.md`. Nunca comece a implementar sem um
plano aprovado.

**Abrindo um foco:** proponha a quebra em entregas pequenas, checando
antes o que já existe no código pra reaproveitar (ver 6.1), o que a
família `DECISOES-*.md` já decidiu sobre assunto parecido, e o que
`PENDENCIAS.md` já tinha registrado sobre esse foco (não reabrir sem
saber o que já tinha contexto). Pra qualquer característica nova com
interação ativa em Combat/UI (não é só reaproveitar um padrão já
validado), **pergunte ao Osmar onde ela fica e como o jogador ativa
ANTES de codar** — não construa e ajuste depois. Só comece a escrever
código depois de aprovado.

**Durante o foco:** um achado que dá pra resolver dentro do MESMO foco,
só não nessa entrega, vira **item novo dentro do próprio `EmDev.md`**
(quebrando mais se for grande) — nunca vai direto pro `PENDENCIAS.md`
enquanto o foco não fechar. Só vai direto pro `PENDENCIAS.md`, mesmo no
meio do foco, o que **trava estruturalmente** — depende de algo que não
existe fora desse foco (motor que falta, dado que a planilha não tem,
decisão do Osmar ainda em aberto) — porque isso não é "termino depois
dentro desse foco", é "não dá pra terminar sem outra coisa existir
primeiro" (ver seção 11). Fricção pequena de UI/UX/processo que se
repete vai pro `LICOES-RAPIDAS.md` (seção 16), não vira regra
permanente na hora.

**Fechando um foco** (todos os passos relevantes do `EmDev.md` viraram
`[x]`, ou o Osmar decide encerrar por outro motivo): (1) aprendizado
generalizável vira entrada no `DECISOES-*.md` certo (seção 7); (2) o
que ficou de propósito sem fazer vai pro `PENDENCIAS.md`, agrupado sob
o tópico do foco (seção 11); (3) aproveite esse momento pra também
limpar do `PENDENCIAS.md` qualquer coisa — mesmo de outro foco — que
foi resolvida no caminho; (4) esvazie o `EmDev.md`; (5) pergunte qual o
próximo foco.

### 6.1 Reaproveite o padrão que já existe — não invente um novo

Antes de desenhar schema, componente ou fluxo novo, procure ativamente
se já existe algo parecido no código (schema de dado semelhante,
componente de escolha semelhante, tela com a mesma forma de interação)
e siga esse padrão em vez de criar um jeito novo de fazer a mesma
coisa. Isso vale tanto pra dado (`data/`) quanto pra UI (`ui/`):

- Antes de criar um campo/interface novo, procure se um campo parecido
  já resolve o problema (ex.: um mecanismo de "escolha de item de um
  grupo" já existente pode servir pra um caso novo sem precisar de
  estrutura própria).
- Antes de desenhar uma tela/passo novo do wizard, veja como uma tela
  parecida já resolve (mesmo componente de pill, mesmo padrão de
  destaque pra "já possui", mesmo jeito de mostrar escolha em lista).
- Se o pedido parecer exigir 2 coisas novas mas 1 delas já é coberta
  por um mecanismo existente, implemente só a parte genuinamente nova.

**Por quê:** o app já tem vários casos parecidos-mas-não-iguais
acumulados (ex.: diferentes formas de "escolher 1 de um grupo", de
"escolher N itens", de exibir "concedido por X") — cada padrão novo
que não reaproveita o que já existe aumenta esse ruído e torna a
manutenção mais difícil. Antes de propor o plano da seção 6, gaste um
momento conferindo o schema/componente mais próximo do que já existe.

## 7. Regra de atualização da família DECISOES-*.md

Sempre que você tomar (ou o usuário tomar, com sua ajuda) uma decisão de
design que não é óbvia a partir do código — por que um padrão de UI foi
escolhido, por que uma regra de D&D foi simplificada de um jeito
específico, o que já foi tentado e descartado — registre numa entrada
nova, não só no chat. O chat se perde; esses arquivos não.

Desde 2026-09 as decisões são organizadas por área em 6 arquivos
(`DECISOES-DESIGN.md`, `DECISOES-WIZARD.md`, `DECISOES-FICHA.md`,
`DECISOES-COMBATE.md`, `DECISOES-CLASSES.md`, `DECISOES-DADOS.md`) —
o índice no topo de `DECISOES-DESIGN.md` explica o escopo de cada um.
Escolha o arquivo pelo assunto da decisão; na dúvida entre dois, use
o que a tela/fluxo mais afetado pela decisão pertence; se for um
padrão que atravessa várias telas (ex: componente reaproveitável,
arquitetura de alto nível), vai em `DECISOES-DESIGN.md`.

Antes de propor uma solução de UI ou de regra que pareça uma decisão de
design (não só uma correção técnica óbvia), **consulte o(s) arquivo(s)
relevante(s) primeiro** pra não repetir uma decisão que já foi tomada e
revertida antes.

### 7.1 Esses arquivos são padrão reaproveitável, não changelog — critério de escrita

Em 2026-09, depois de implementar só 2 classes (Guerreiro, Bardo) e 1
subclasse, o arquivo de decisões de classe já tinha passado de 2000
linhas — insustentável faltando ~10 classes e ~35 subclasses. Passagem
de compactação feita (ver `DECISOES-DESIGN.md`), e daqui pra frente
**toda entrada nova precisa passar neste teste antes de ser escrita:**

> "Se eu (ou outra sessão do Claude Code) estiver implementando uma
> classe/tela/feature PARECIDA daqui a 2 meses, essa entrada muda como
> eu vou fazer isso?"

Se a resposta for sim, escreva — e escreva o **padrão generalizado**
(o que vale pra qualquer classe/tela parecida), não só o caso
específico que motivou a descoberta. Se a resposta for não, **não
escreva uma entrada** — o código funcionando já é a prova de que
funciona, e o Git guarda o histórico de como se chegou lá. Nunca
entram como entrada nova:
- Bug já corrigido, sem lição reaproveitável além do fix em si.
- "Entrega X feita, aqui está o que testei" — narração de progresso.
  Isso é reporte de status pro Osmar (ver seção 1), não decisão de
  design; não precisa de registro permanente depois de comunicado.
- Ajuste visual pontual sem padrão por trás (ex: "esse texto virou 2
  linhas em vez de 1").
- Qualquer parágrafo que comece descrevendo o que você TESTOU
  (Playwright, cenário, resultado) — teste é prova de que funcionou
  nessa entrega, não conhecimento que vale reler depois.

**Quando uma decisão evolui em várias idas e voltas** (ex: 3 tentativas
de UI até acertar) — não registre as tentativas erradas como entradas
separadas. Registre **só o estado final**, como se tivesse sido
desenhado certo da primeira vez; a lição de "por que as tentativas
anteriores não funcionaram" só entra se ela própria for um padrão
reaproveitável (ex: "toda escolha em tela cheia usa X, não Y").

**Sinal de que um arquivo da família precisa de outra compactação:**
mais de ~600-800 linhas, ou mais de ~15-20 entradas. Compactar não é
apagar informação — é reescrever o que sobrou de várias entregas
relacionadas numa entrada só, focada no padrão, cortando a narrativa
de como se chegou lá.

## 8. Lacunas de dados conhecidas (não travam o projeto)

Estas informações ainda não foram extraídas dos livros. Se uma entrega
depender de uma delas, avise o Osmar especificamente qual — ele resolve
sob demanda:
- Auditoria de Ação Bônus/Reação nas 337 linhas de Subclasses da planilha
- Talentos com ativação em combate (quais concedem Ação Bônus/Reação)
- Confirmar se número de idiomas concedidos é sempre 2 ou varia por
  Origem/Espécie — **resolvido:** não varia, planilha não tem coluna de
  idioma em Origem/Espécie. Ver `DECISOES-DADOS.md`.
~~Idioma extra concedido por característica de Classe nível 1~~ —
  mecanismo implementado pra Druida (Druídico, fixo) e Ladino (Gíria
  dos Ladrões + 1 à escolha), ver `DECISOES-DADOS.md`. As outras 10
  classes ainda não foram auditadas linha a linha na aba
  "Características de Classe" — ver `PENDENCIAS.md`.
- **~24 células de "Descrição Completa" (Características de Classe e
  Subclasses) têm conteúdo duplicado de outra aba colado dentro** — ver
  `auditoria-planilha-mestra.md` (arquivo do Osmar, não faz parte do
  repositório) pra lista completa. NÃO usar essas células como estão;
  extrair só a descrição própria da característica antes de importar,
  do mesmo jeito que já foi feito com Bruxo/Mestre Místico (referência
  de correção no mesmo arquivo). Nenhuma célula do Guerreiro (nível 1-20
  na classe base) está nessa lista — só afeta subclasses dele
  (Cavaleiro Místico nível 3, Mestre da Batalha nível 18), que ainda não
  foram importadas.

~~Bônus de Proficiência por nível~~ — já estava na planilha mestra (aba
Progressão de Classe), removido.
~~Tabela de XP por nível~~ — já existe na planilha (aba Evolução do
Personagem), removido.
~~Proficiências de arma/armadura/escudo por classe~~ — extraída dos
livros pelo Osmar, nova aba "Proficiências de Classe" na planilha,
removido. Ver `DECISOES-DADOS.md`.
~~Fórmula exata de capacidade de carga (Força × multiplicador)~~ —
confirmada na planilha mestra, aba "Glossário de Regras" (termo
"Capacidade de Carga"): Força × 7 kg pra Tamanho Pequeno/Médio (única
combinação usada pelas espécies jogáveis do projeto hoje). Corrige o
valor anterior (Força × 7,5 kg), que tinha sido estimado de memória
antes da planilha ser conferida. Ver `DECISOES-FICHA.md`.
~~Popup de descrição de Armas e Armaduras~~ — planilha ganhou coluna
"Descrição" nas duas abas, importado e ligado. Removido.
~~Progressão de círculo dos meio-conjuradores (Guardião/Paladino)~~ —
confirmada linha a linha, idêntica entre as duas classes, removido. Ver
`DECISOES-DADOS.md`.

## 9. Escopo do produto (não expandir sem confirmar)

- Só D&D 5e (regras 2024), sem abstração para outros sistemas.
- Uso pessoal — Osmar e o grupo de mesa dele. Sem lançamento público, sem
  monetização, sem paywall.
- Login/nuvem (Supabase) só entra na Fase 5, depois de tudo local estar
  testado e aprovado.

## 10. Carimbo de versão visível (obrigatório em toda entrega)

Toda entrega publicada precisa mostrar, em algum ponto fixo da tela
(rodapé discreto), um carimbo de versão no formato:

```
v{AAAA}{MM}_{HHmm}
```

- `AAAA` = ano, `MM` = mês, `HHmm` = hora e minuto, **do momento do
  commit/push**, sempre em **horário de Brasília (UTC-3)** — não o
  horário do servidor onde o Claude Code roda, que costuma ser UTC.
- Exemplo: `v202608_1100` = ano 2026, mês 08, 11h00 (Brasília).
- Fonte única: `src/version.ts`, exportando a constante `APP_VERSION`.
- **Antes de cada `git push`**, atualize `src/version.ts` com o horário
  atual em Brasília (`TZ='America/Sao_Paulo' date +"%Y%m_%H%M"`) e
  inclua esse arquivo no commit.
- Motivo: o Osmar usa esse carimbo pra confirmar rapidamente, no celular,
  se o navegador carregou a versão nova ou se ainda está servindo cache
  antigo — sem precisar adivinhar.

## 11. Regra de atualização do PENDENCIAS.md

`PENDENCIAS.md` recebe só 2 tipos de entrada (ver ciclo de foco, seção
6) — **nunca** joga aqui um "ainda não fiz" que dá pra terminar dentro
do mesmo foco (isso fica no `EmDev.md`):
1. **No fechamento de um foco** — o que ficou de propósito sem fazer.
2. **A qualquer momento** — algo que trava estruturalmente: depende de
   algo que não existe fora desse foco (motor que falta, dado que a
   planilha não tem, decisão do Osmar ainda em aberto). Não é "termino
   depois dentro desse foco", é "não dá pra terminar sem outra coisa
   existir primeiro".

**Organize por tópico** (`## Nome do foco/assunto`), agrupando as
entregas relacionadas sob o mesmo cabeçalho — facilita achar tudo que
falta de um assunto de uma vez, em vez de espalhado. Quando algo da
lista for resolvido, mova a entrada pro arquivo `DECISOES-*.md`
correspondente ao assunto (como decisão tomada — ver índice no topo de
`DECISOES-DESIGN.md`) e remova de `PENDENCIAS.md` — não deixe as duas
listas com a mesma coisa. Antes de propor uma entrega nova que toque em
dado de regra (origens, classes, espécies, talentos, magias),
**consulte esse arquivo primeiro** pra não reabrir uma pendência que já
tinha contexto registrado.

## 12. Marcação de conteúdo placeholder — prefixo `[PH]`

Qualquer texto visível na tela que **não** venha de regra real
validada — dado fixture/exemplo (ex: `data/exampleCombat.ts`), número
inventado só pra preencher espaço, ou qualquer coisa colocada só pra
o layout não ficar vazio enquanto a lógica de verdade não existe —
precisa começar com `[PH]` no próprio texto exibido (ex: "🗡 Atacar
`[PH]` valores de exemplo (Adaga +4)"). Isso vale tanto pro nome
quanto pra descrição, o que fizer mais sentido pro caso.

- **Objetivo:** o Osmar consegue olhar qualquer tela e saber na hora
  o que já foi revisado/é regra real (sem `[PH]`) vs. o que ainda é
  espaço reservado esperando dado/lógica de verdade (com `[PH]`) —
  sem precisar perguntar ou ler código.
- **Ao substituir o placeholder por lógica/dado real, remova o
  `[PH]`** — não deixe as duas coisas ao mesmo tempo.
- **Regra permanente daqui pra frente:** sempre que, durante qualquer
  entrega, você notar um texto na tela que se encaixa nessa definição
  e ainda não tem `[PH]`, adicione — mesmo que não tenha sido pedido
  especificamente pra essa tela. Não espere uma revisão formal pra
  marcar.
- Ações genéricas do Cap. 1 (Ajudar, Analisar, Correr, etc.) **não**
  são placeholder — são texto de regra real, mesmo sem cálculo por
  trás ainda. `[PH]` é só pra número/nome inventado, não pra texto de
  regra correto com pouca interatividade.

## 13. Testes automatizados e IDs estáveis — obrigatório em `core/` daqui pra frente

Decidido depois de uma auditoria externa (ver DECISOES-DESIGN.md) —
duas regras permanentes pra reduzir o risco de regressão silenciosa
conforme o motor de cálculo cresce:

- **Toda função nova em `core/` que calcula um valor de regra** (CA,
  PV, iniciativa, perícia, dano, recurso, etc.) **precisa vir com
  teste automatizado (Vitest) no mesmo commit/entrega**, cobrindo pelo
  menos 1 caso normal e 1 caso de borda (valor mínimo/máximo,
  ausência de dado, etc.). `npm test` faz parte do checklist de toda
  entrega, junto com `npm run build` — nunca fazer push com teste
  quebrado.
- **Ao alterar uma função de cálculo já existente**, atualizar (ou
  adicionar, se ainda não existir) o teste correspondente antes de
  considerar a entrega concluída — não deixar pra depois.
- **Toda característica/regra que o código precisa RECONHECER
  programaticamente** (não só exibir na tela) — ex: "esse nível dá
  Aumento no Valor de Atributo", "essa característica é Estilo de
  Luta" — deve usar um **ID estável** no dado, nunca comparação pelo
  nome de exibição. O nome pode mudar por revisão editorial da
  planilha (o Osmar edita por fora, ver seção 3) sem que a regra deva
  quebrar; o ID é só uso interno do código, o nome continua sendo o
  texto mostrado ao jogador. Casos antigos que ainda comparam por
  nome migram aos poucos, sob demanda — não é preciso migrar tudo de
  uma vez, mas todo código **novo** já nasce usando ID.

## 14. Regra de atualização do EmDev.md

`EmDev.md` é o plano do foco **em andamento agora** (ver ciclo de foco,
seção 6) — diferente da família `DECISOES-*.md` (o que já foi
decidido, permanente) e de `PENDENCIAS.md` (adiado de propósito ou
travado estruturalmente), este é só o checklist de passos sendo
executados neste momento, pra não perder o fio se a conversa for
interrompida/retomada depois.

- **Ao abrir um foco** (seção 6, antes de escrever qualquer código) e
  o Osmar aprovar o plano, escreva os passos em `EmDev.md` como
  checklist (`- [ ]` / `- [x]`), não só na resposta do chat.
- **Marque cada passo como `[x]` assim que ele for concluído** —
  durante o trabalho, não só no final.
- **Achado no caminho que dá pra resolver dentro do MESMO foco vira
  item novo aqui** (quebrando mais se for grande) — não vai direto pro
  `PENDENCIAS.md` (ver seção 6/11).
- **Ao fechar o foco** (todos os passos relevantes viraram `[x]`, ou o
  Osmar decide encerrar): mova aprendizado durável pro `DECISOES-*.md`
  certo (seção 7), mova o que sobrou de propósito pro `PENDENCIAS.md`
  agrupado (seção 11), aproveite pra limpar do `PENDENCIAS.md` o que
  foi resolvido no caminho (mesmo de outro foco), e só DEPOIS esvazie
  este arquivo. `EmDev.md` nunca é o lugar definitivo pra nada, só o
  rascunho de trabalho.
- Se o Osmar pedir pra trocar de assunto no meio de um plano ainda não
  concluído (pausa temporária, não fechamento de foco), deixe o
  conteúdo como está (não apague plano incompleto) — ele continua ali
  pra retomar depois.
- Um plano recém-aprovado **substitui** o conteúdo anterior se o
  anterior já estava 100% `[x]` (aí já deveria ter sido fechado); não
  deveria haver 2 planos diferentes simultâneos aqui — se acontecer,
  pergunte ao Osmar qual está valendo.

## 15. Regra de atualização do Feedback.md

`Feedback.md` é a lista de bugs/melhorias que o Osmar aponta testando
na tela, mas que **não são corrigidos na hora** — fica pra decidir
prioridade depois, junto com ele.

- **Sempre que o Osmar reportar um bug ou pedir uma melhoria e vocês
  decidirem não resolver imediatamente**, registre em `Feedback.md`
  (o que é, onde acontece, 1-2 frases — não precisa do detalhe
  técnico de uma entrada de `DECISOES-*.md`, é só pra não esquecer).
- **Antes de propor a próxima entrega**, dê uma olhada em
  `Feedback.md` — pode ter algo relevante já anotado ali que a
  próxima entrega deveria cobrir.
- **Ao resolver um item da lista**, apague a entrada de
  `Feedback.md` — se a correção também for uma decisão de design não
  óbvia, registre no arquivo `DECISOES-*.md` certo (seção 7); se for
  só um bug corrigido sem lição reaproveitável, não precisa de
  registro permanente em lugar nenhum (ver seção 7.1).
- Diferente de `PENDENCIAS.md` (coisas que o Claude Code adia de
  propósito por decisão técnica, ex: dado que a planilha não tem
  ainda) — `Feedback.md` é a lista que **o Osmar** alimenta testando
  o app, não o Claude Code decidindo adiar algo sozinho.

## 16. Regra de atualização do LICOES-RAPIDAS.md

`LICOES-RAPIDAS.md` guarda observação pequena e recorrente de UI/UX/
processo que ainda não vale virar regra permanente em `DECISOES-*.md`
— evita lotar aquela família com barulho (seção 7.1) sem perder o
padrão de vista.

- Sempre que notar uma fricção pequena que se repete (ex: "esqueci a
  pill de novo", "perguntar onde a UI fica antes de codar deu certo de
  novo") — anote aqui, 1-2 frases, com a data.
- **Na 3ª vez que a MESMA lição aparecer**, pare e pergunte ao Osmar
  se ela vira regra permanente. Se sim, escreva a versão generalizada
  no `DECISOES-*.md` certo (seguindo o teste da seção 7.1) e apague
  daqui. Se não, risque/apague também — 2 ocorrências sem virar regra
  não precisam ficar acumulando pra sempre.

## 17. Regra de atualização do Backlog.md

`Backlog.md` guarda melhoria conhecida e tecnicamente possível, mas
que a gente decide não fazer AGORA por prioridade — diferente de
`PENDENCIAS.md` (que é o que trava estruturalmente: falta dado que a
planilha não tem, motor que ainda não existe, decisão do Osmar em
aberto). Backlog é "dá pra fazer, só não é a hora"; Pendências é "não
dá pra fazer sem outra coisa acontecer primeiro".

- Sempre que, ao entregar uma característica, você perceber um pedaço
  dela que dá pra fazer mas decidiu deixar de fora por escopo/tempo
  (ex: "essa regra vale pra qualquer dado, mas só implementei pro
  D20") — registre aqui, agrupado por tópico (`## Nome do assunto`),
  1-3 frases por item.
- Quando o Osmar decidir puxar um item do Backlog pra implementar de
  verdade, ele vira um foco normal (`EmDev.md`, seção 6) e a entrada
  correspondente sai daqui.
- Diferente de `PENDENCIAS.md`, aqui não precisa agrupar por foco de
  origem — agrupe pelo assunto/característica em si, já que o vínculo
  com o foco que a criou não importa tanto quanto o que falta fazer.
- Diferente de `PENDENCIAS.md` (trabalho ainda não feito) — isso aqui
  é só observação de padrão de comportamento/processo, não uma tarefa.
