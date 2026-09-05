# DECISOES-WIZARD.md

> Decisões de design sobre o **wizard de criação de personagem**
> (passos, navegação, atributos, escolhas de Origem/Espécie no
> fluxo de criação, geradores de personagem de teste). Parte da
> família `DECISOES-*.md` — ver o índice em `DECISOES-DESIGN.md`
> pra saber em qual arquivo procurar cada assunto, e a seção 7 do
> `CLAUDE.md` pra regra de quando registrar uma entrada aqui — e pro
> critério de "isso é padrão reaproveitável ou changelog de entrega"
> que mantém este arquivo pequeno.

---

## Wizard — navegação em pills flutuantes ancoradas + sorteio + validação bloqueante

**Decisão:** a partir da entrega 0.4-extra, o wizard de criação (e deve
valer pra qualquer fluxo de múltiplos passos que vier depois — level-up,
por exemplo) usa 3 mecanismos que **não existiam no wireframe original**:

1. **Voltar/Avançar viram pills flutuantes** (`border-radius: 999px`),
   ancoradas com `position: fixed` no rodapé da viewport — Voltar no
   canto inferior esquerdo, Avançar/Salvar no canto inferior direito.
   O conteúdo da etapa rola por baixo delas (scroll não move as pills).
   Isso troca a barra de rodapé fixa de largura total do wireframe
   (`.wiz-footer`), que ocupava uma faixa inteira da tela.
2. **Botão de sorteio (🔀)**, um FAB circular ancorado na borda esquerda
   da tela (fixed, `left: 12px`, centralizado verticalmente). Aparece só
   nas etapas que têm algo pra sortear (Classe, Origem, Espécie,
   Atributos — inclui o ajuste de antecedente +1/+1/+1, Línguas,
   Alinhamento, Resumo — sorteia um nome). Não aparece nas telas
   puramente informativas (Escolhas da Classe/Origem/Espécie) nem na
   Loja (compra é opcional, nada "precisa" ser sorteado ali).
3. **Validação bloqueante no Avançar:** cada etapa declara o que é
   obrigatório pra sair dela. Se faltar, o clique em Avançar não navega
   — mostra um aviso curto (ex: "Escolha uma classe antes de avançar.")
   e mantém o jogador na mesma tela.

**Contexto:** pedido explícito do Osmar, pra acelerar o preenchimento
(sorteio pra quem não se importa em escolher manualmente cada campo) e
evitar avançar com uma etapa incompleta sem perceber.

**Quais campos foram considerados "obrigatórios" (decisão minha, meio
arbitrária — revisar com o Osmar se algo não fizer sentido):**
- Classe, Origem, Espécie, Alinhamento: obrigatórios (todo personagem
  precisa ter os quatro).
- Atributos: obrigatório preencher os 6 valores **e** aplicar o ajuste de
  antecedente (+1/+1/+1) antes de avançar — sem isso o PV/Percepção do
  Resumo saem errados.
- Línguas: **opcional** — o livro permite escolher até 2, não exige
  mínimo.
- Loja: **opcional** — comprar item nenhum é uma escolha válida.
- Resumo: só o **nome** é obrigatório pra salvar (aparência/personalidade
  ficam livres).

**Alternativas descartadas:** manter o rodapé de largura total do
wireframe — descartado porque ocupava espaço vertical fixo em toda tela,
e o pedido explícito era "ocupar menos espaço".

**Data/origem:** 2026-08, logo após a entrega 0.4 (Fase 0).

## Wizard de criação — telas separadas por grupo (lista → escolhas)

**Decisão:** cada grupo do wizard (Classe, Origem, Espécie) é dividido em
2 telas: uma de **lista** (cards com imagem à esquerda + info à direita,
onde o jogador escolhe a opção) e outra de **escolhas** (detalhes,
seleções específicas daquela opção, ex: perícias da classe escolhida).

**Contexto:** pedido explícito do Osmar, pra manter cada tela focada numa
única decisão por vez (hierarquia de informação progressiva).

## Atributos — ajuste de antecedente é parte da tela de Atributos

**Decisão:** depois de distribuir os 6 valores do array padrão, uma seção
adicional na mesma tela permite aplicar o ajuste do antecedente (+1/+1/+1
nos três atributos indicados pelo antecedente, ou +2/+1 — este último
ainda não implementado).

**Alternativas descartadas:** não foi cogitada uma tela separada pra
isso — o ajuste é conceitualmente parte da "distribuição final" dos
atributos, não uma etapa independente.

**Atualização:** a trava nos 3 atributos do antecedente foi implementada
— ver "Atributos — travados nos 3 elegíveis do antecedente, com opção de
desbloqueio" abaixo. Essa pendência específica está resolvida.

## Atributos — travados nos 3 elegíveis do antecedente, com opção de desbloqueio

**Decisão:** na tela de Atributos, os 3 atributos elegíveis da origem
escolhida (`origem.atributosElegiveis`, já importado junto com Origens)
vêm liberados pra receber o ajuste +1/+1/+1; os outros 3 ficam com
visual bloqueado (`btn-disabled`, `pointer-events: none`) e a função de
toggle também recusa a mudança mesmo se o clique acontecer por outro
caminho — dupla trava (CSS + lógica), não só visual.

Um checkbox **"Desbloquear atributos"** (novo campo
`desbloquearAtributos: boolean` no `WizardSelection`) libera os 6
atributos pra escolha livre, ignorando a regra do antecedente. Ao
desmarcar o checkbox de novo, qualquer atributo fora dos 3 elegíveis que
tivesse recebido o ajuste é removido automaticamente (evita ficar um
ajuste "ilegal" preso depois de destravar e retravar).

**Contexto:** pedido direto do Osmar — a regra é clara sobre quais 3
atributos cada antecedente permite, então dava pra travar isso sem
esperar UI mais elaborada. O checkbox de escape existe porque o jogador
pode ter uma razão de mesa pra fugir da regra (ex: variante de regra da
campanha, personagem feito sem seguir antecedente à risca).

**Data/origem:** 2026-08, pedido direto do Osmar.

## UI — floaters de resumo em progresso durante o wizard (a implementar)

**Decisão (adiada, só registrada por ora):** 3 painéis flutuantes durante
a criação de personagem, cada um acumulando o que já foi adicionado numa
categoria — Perfil (perícias, talentos), Itens (kits, itens de
classe/origem), Truques e Magias. Ajuda o jogador a ver o que já está
"garantido" na ficha e evita duplicata de concessão (ex: duas fontes
diferentes dando a mesma perícia).

**Contexto:** padrão que já existia no builder anterior do Osmar, vale
reaproveitar. Ainda não está no wireframe atual — entra quando chegar a
hora de detalhar o wizard visualmente.

## Tela de Escolhas da Origem — layout revisado

**Decisão:** revisão de layout pedida pelo Osmar depois de ver a tela na
prática:
- Header mostra só o nome da origem (não mais "Origem — Talento: X").
- Talento vira um card próprio (nome + descrição), não uma linha de
  resumo genérica.
- Perícias concedidas ficam lado a lado (tags numa linha), não uma por
  linha.
- Tira o rótulo "fixa" de perícia/ferramenta — se está na tela, é porque
  foi concedido; não precisa dizer que é fixo.
- Valores de moeda ficam como texto simples (não em `.tag` — correção:
  a ideia original era só marcar que "PO"/"PP"/"PC" é uma variável que um
  dia vira símbolo/ícone de moeda, ex: "50 PO" → "50🪙", não colocar o
  valor inteiro dentro de uma pill visual).
- **Equipamento inicial vira escolha de verdade** entre Opção A e Opção
  B (antes era só texto informativo) — clicável, com estado selecionado,
  valida antes de avançar, e tem sorteio (🔀).

**Contexto:** a primeira versão desta tela era só informativa (mostrava
o que a origem oferece, mas a escolha real ficava pra depois, na Loja).
Na prática ficou confuso — o jogador via as opções mas não podia
escolher ali, e a Loja não sabia dessa escolha.

**Detalhe de implementação:** novo campo `equipamentoOrigemEscolhido:
'A' | 'B' | null` no estado do wizard.

**Data/origem:** 2026-08, revisão da entrega 1.1.

## FAB de sorteio (🔀) ancorado no canto inferior, não mais no meio vertical

**Decisão:** o FAB de sorteio do wizard passa de `top: 50%` (flutuando
no meio vertical da tela, fixo na viewport) para ancorado no canto
inferior esquerdo, logo acima da pill "Voltar".

**Contexto:** bug encontrado durante teste visual da revisão da tela de
Escolhas da Origem — como o FAB fica fixo na viewport (não rola com o
conteúdo), qualquer tela com texto mais longo tinha o meio do texto
tampado pelo círculo do FAB no meio do scroll. Ancorado no rodapé, junto
das pills, ele nunca mais sobrepõe conteúdo, e ainda fica sempre visível
igual antes.

**Alternativas descartadas:** manter no meio vertical — descartado por
ser a causa direta do bug.

**Data/origem:** 2026-08, mesma revisão acima.

## "Concedido pela origem" — Talento + Perícias como botões tonais (InfoChip)

**Decisão:** tudo que é "garantido/fixado" ao escolher uma origem
(Talento de Origem, as 2 Perícias) aparece junto, numa seção só
("Concedido pela origem"), cada um como um **botão tonal** (M3: fundo
preenchido com `--accent-dim`, sem borda, formato pill) mostrando
`{nome} ⓘ`. Tocar abre o mesmo popup central (nome + descrição) usado
pelos itens de equipamento. Novo componente `ui/components/InfoChip.tsx`.

**Contexto:** correção de uma versão anterior desta tela que tinha
tratado Talento (card grande, sempre expandido) e Perícias (tags sem
info) como coisas visualmente diferentes — na prática, do ponto de
vista do jogador, ambos são a mesma categoria ("coisa que a origem te
dá"), e deveriam ter o mesmo tratamento visual e a mesma interação
(toque → popup), não um formato por tipo de dado.

**Detalhe de implementação:** `data/rulesets/dnd2024/pericias.ts` — nova
importação (18 perícias, aba "Perícias" da planilha) usando a coluna
"Exemplo de uso" como descrição, já que a planilha não tem uma coluna
chamada literalmente "Descrição" pra perícias.

**`InfoChip` vs `ItemComDescricao`:** dois componentes parecidos de
propósito, não um só — `InfoChip` é pro padrão "lista curta de coisas
concedidas" (visual de botão tonal, cabe pouca coisa lado a lado);
`ItemComDescricao` é pro padrão "termo dentro de um parágrafo/lista
longa" (texto sublinhado, não quebra o fluxo de leitura). Mesma lógica
de popup por baixo, apresentação diferente por contexto de uso.

**Data/origem:** 2026-08, correção pedida logo após a entrega do popup
de itens.

## "Concedido pela origem" — 3 linhas rotuladas (Talento / Perícias / Per. com Ferramentas)

**Decisão:** a seção "Concedido pela origem" da tela de Escolhas da
Origem virou 3 linhas separadas, cada uma com um rótulo de texto
seguido do(s) botão(ões) tonal(is) InfoChip:
- `Talento: {chip}`
- `Perícias {chip} {chip}`
- `Per. com Ferramentas: {chip}` (ou `(escolha abaixo)` em texto simples
  quando a origem usa ferramenta de categoria "escolha" e o jogador
  ainda não escolheu nenhuma opção na lista abaixo)

**Contexto:** o Osmar pediu pra devolver o talento (que tinha ficado só
com perícias na mesma linha) e organizar em linhas rotuladas, além de
unificar a ferramenta nessa mesma seção-resumo — antes ela tinha um
bloco "Ferramenta" separado, sem descrição nenhuma.

**Ferramenta agora tem descrição:** a aba "Ferramentas" da planilha já
tinha a coluna "Uso (ação Usar Objeto)" — foi importada como campo
`descricao` em `ferramentas.ts` (pros grupos de escolha: Instrumento
Musical, Kit de Jogos, Ferramentas de Artesão) e num novo mapa
`descricaoFerramentaFixa` (pras ferramentas fixas que não pertencem a
nenhum grupo: Suprimentos de Calígrafo, Ferramentas de Ladrão, Kit de
Falsificação, Kit de Herbalismo, Ferramentas de Carpinteiro, Ferramentas
de Cartógrafo, Ferramentas de Navegador, Kit de Disfarce, Kit de
Veneno). Um novo `buscarDescricaoFerramenta.ts` (mesmo padrão de
`buscarDescricaoItem.ts`) faz a busca por nome pras duas fontes.

**Nota sobre Instrumento Musical e Kit de Jogos:** a planilha só tem 1
linha de "Uso" por grupo (não por instrumento/jogo individual) — por
isso, ex: Alaúde e Tambor mostram a mesma descrição genérica de
"Instrumento Musical" no popup. Isso é fiel à planilha, não uma
simplificação nossa.

**Bloco de seleção da ferramenta (categoria "escolha"):** continua
existindo abaixo do resumo, com a lista de opções clicáveis — só perdeu
o título "Ferramenta" (virou redundante já que o resumo já mostra
"Per. com Ferramentas:").

**Data/origem:** 2026-08, mesmo dia da entrega das descrições
narrativas de origem.

## Marcação de duplicidade (Perícias) e iconografia de Magias (ataque/cura/custo) — só na criação

Portado do "outro modelo" (versão anterior do app do Osmar,
`rjunior0710.github.io`), a pedido dele — 2 recursos de UX que já
existiam lá:

**1. Marcação de duplicidade.** Aviso não-bloqueante quando uma
escolha do wizard já foi concedida em outra etapa. Escopo confirmado
com o Osmar: **só a criação de personagem por enquanto** — a Ficha
precisaria de uma abordagem diferente (não é escolha, é revisão de
personagem já pronto), fica pra depois.

Duas implementações convivem, cada uma resolvendo uma forma diferente
de sobreposição:

- `core/duplicidadeSelecao.ts` (`nomesDuplicados(...grupos: string[][]):
  Set<string>`) — genérica, conta nomes únicos por grupo e marca quem
  aparece em 2+ grupos. Único uso hoje: **Perícia da Origem × Perícia
  da Classe** nos **cards de Origem** (`OrigemStep.tsx`, já que a
  ordem real do wizard é Classe→Origem, não o contrário — o aviso não
  faz sentido nos checkboxes de Perícia da Classe, a Origem ainda nem
  foi escolhida nesse ponto). Cada card calcula `nomesDuplicados(
  selection.periciasClasseEscolhidas, origem.pericias)` e, se houver
  sobreposição, ganha borda tracejada `var(--warn)` (classe
  `.opt-card-duplicada`) + texto "⚠️ X já escolhida na Classe" abaixo
  da descrição.
- `core/concessoesJaConcedidas.ts` (`concessoesJaConcedidas(selection,
  origem?, especie?): { pericias, ferramentas, truques, magias }`,
  cada um um `Map<nome, FonteConcessao>` com `FonteConcessao = 'Classe'
  | 'Origem' | 'Talento' | 'Espécie'`) — pra telas de escolha LIVRE
  (não card de opção fixa): mostra a tag "já possui - {fonte}" ao lado
  do item, cobrindo hoje Perícia (Hábil do Humano, Talento de Origem
  livre) e, desde que as 10 espécies ficaram disponíveis, também
  Truque/Magia — a colisão real é Espécie (truque/magia fixo da
  linhagem, ex. Alto Elfo → Prestidigitação Arcana) × o que já foi
  escolhido na Classe. Como Classe roda ANTES de Espécie no wizard, o
  aviso aparece no lado inverso do fluxo normal (na tela de Espécie,
  não na de Classe) — "avise depois, deixe o jogador voltar" é o mesmo
  padrão já usado pela Origem. `ClasseEscolhasStep.tsx` também usa a
  mesma função (só entra em jogo se o jogador voltou depois de já ter
  passado por Origem/Espécie). Empate entre 2 fontes → prioridade
  Classe > Origem > Espécie na fonte mostrada (Talento hoje não
  concede truque/magia de forma estruturada, ver PENDENCIAS.md
  "Origens com seleção extra no Talento de Origem").

**2. Iconografia de Magias.** ⚔️ ataque / ❤️‍🩹 cura / 🪙 componente com
custo em PO — podem aparecer sozinhos ou combinados na mesma pill de
Truque/Magia Preparada da criação. `core/classificarMagia.ts` exporta
`classificarMagia(magia): {ataque, cura, custoComponente}`, heurística
por regex em cima de `descricaoCurta` (coluna curada, não
`descricaoCompleta` — que tem problema de conteúdo colado documentado
no cabeçalho de `magias.ts`) e `componentes`:
- `ataque`: `/\bataques?\b[^."]{0,30}:/i` — captura os marcadores
  formais do livro ("Ataque corpo a corpo:", "Ataque à distância:",
  "Ataque:"), maiúscula ou minúscula (varia se a frase é o início da
  descrição ou está no meio, ex. depois de parêntese) — confirmado
  por amostra da planilha.
- `cura`: `/\bcura(m)?\b/i` OU (`recupera(m)? + todo/metade/dígito`,
  removendo antes qualquer trecho "não recupera..." — evita falso
  positivo em magias que negam cura, ex. "não recupera PV" do Toque
  do Vampiro).
- `custoComponente`: `/\d+[^.)]{0,20}\b(po|pp|pc)\b/i` — precisa de um
  número antes da sigla de moeda dentro de uma janela curta (não
  exclui frases como "no valor de 100 ou mais PO", que é o padrão real
  da planilha), sem casar menção solta a moeda sem custo (ex. "um fio
  de cobre", sem número, não marca).

**Aceito explicitamente pelo Osmar que a heurística pode errar
ocasionalmente** ("vamos seguir, se aparecer erros, nós corrigimos") —
não é regra de mecânica, é só ajuda visual pra achar magia mais rápido.
Testado contra a amostra real da planilha (Bardo, ~36 magias entre
truques e 1º círculo) sem falso positivo/negativo encontrado nos casos
verificados manualmente.

**Testado:** Playwright 390×844, fluxo completo Classe (Bardo) →
Perícias (Intuição/Religião/Atuação, colidindo de propósito com
Acólito/Andarilho/Artista/Sábio) → Ferramentas → Truques → Magias
Preparadas → Equipamento → Origem. Confirmado: ⚔️/❤️‍🩹/🪙 aparecem nas
pills certas (ex. Palavra Curativa → ❤️‍🩹, Identificar → 🪙); ao chegar
em Origem, os 4 cards com Perícia colidente mostram a borda tracejada
`--warn` + texto de aviso; escolher a Origem mesmo assim continua
funcionando.

**Data/origem:** 2026-08.

## Botão 🔀 vai pro lado direito (perto do Avançar); tarja de erro some sozinha

**2 ajustes pedidos pelo Osmar:**

1. `.randomFab` (botão "Sortear tudo desta etapa" do wizard) trocou
   `left` por `right` no CSS — fica flutuando acima do "Avançar →" em
   vez do "← Voltar".

2. A tarja fixa de erro (`.warning`, usada no Wizard e no Level Up)
   nunca teve timer — ficava na tela até o jogador corrigir e tentar
   avançar de novo, o que o Osmar achou demorado demais. Novo hook
   `ui/hooks/useAvisoTemporario.ts` — mesma API de `useState`, mas some
   sozinha 3s depois de aparecer (`setAviso(null)` continua funcionando
   pra limpar na hora, ex: ao corrigir e avançar com sucesso).
   Reaproveitado nos dois lugares que tinham essa tarja (`WizardShell.tsx`,
   `LevelUpShell.tsx`) — os avisos inline do Combat (`aviso`/`avisoSlot`
   dos painéis de Ação/Reação) não usam essa tarja fixa, ficaram de
   fora por enquanto.

**Testado:** Playwright 390×844 — botão confirmado do lado direito.
Erro de validação disparado (avançar sem escolher classe) e cronometrado
até sumir sozinho: ~2,8s (dentro da margem do timer de 3s + polling).

**Data/origem:** 2026-08.

## Origem — card de seleção resumido, com Perícias/Ferramenta/Talento visíveis

**Contexto:** o card de cada Origem na tela "2. Origem" do wizard só
mostrava a descrição narrativa completa (3-5 frases, texto do livro)
— pra saber o que a Origem realmente concede (Perícias, Ferramenta,
Talento) o jogador precisava avançar pra tela seguinte
(`OrigemEscolhasStep`). O Osmar pediu pra resolver isso direto no
card de seleção.

**Decisão:**
1. Nova descrição de 1 frase por Origem, em
   `data/rulesets/dnd2024/descricoesOrigensCurtas.ts` — resumo próprio
   (não é trecho literal do livro, diferente de `descricoesOrigens.ts`,
   que continua sendo usado por inteiro na tela seguinte, essa não
   mudou).
2. O card ganhou 3 linhas novas, reaproveitando o mesmo padrão de
   `OrigemEscolhasStep.tsx` (chip `InfoChip`, toque abre popup com a
   descrição completa — perícia, ferramenta ou talento): Perícias (2),
   Ferramenta (nome fixo, ou "escolha 1 de {grupo}" quando é
   `categoria: 'escolha'`, já que nesse card ainda não existe uma
   ferramenta escolhida) e Talento (nome + variante entre parênteses,
   quando houver).
3. `InfoChip` já usa `e.stopPropagation()` no toque — importante
   porque o card inteiro tem `onClick` pra selecionar a Origem; tocar
   num chip só abre o popup, não seleciona a Origem por engano.

**Testado:** Playwright 390×844 — card mostra Perícias/Ferramenta/
Talento corretos (ex: Andarilho → Furtividade/Intuição, Ferramentas de
Ladrão, Sortudo); toque no chip "Sortudo" abre o popup sem marcar o
card como selecionado; aviso de perícia duplicada com a Classe
continua funcionando.

**Data/origem:** 2026-08.

## Personagem de Teste — gerador automático pra testar rápido

**Contexto:** o Osmar pediu uma forma rápida de criar um personagem
completo pra testar telas, sem passar pelos ~10 passos do wizard toda
vez — só escolher Classe/Origem/Espécie/Nível, o resto sorteado
(atributos, perícias, magias, talentos, kit de equipamento inicial da
Classe/Origem).

**Decisão:** reaproveitar a lógica que já existia — cada passo do
wizard já tem um botão 🔀 "sortear tudo desta etapa"
(`randomizarClasse`/`randomizarEscolhasClasse`/etc em
`WizardShell.tsx`). Portei essa mesma lógica pra
`core/geradorPersonagemTeste.ts`, como funções puras encadeadas (sem
UI, sem passar pelas telas), e completei com um "Level Up automático"
pros níveis acima de 1 — mesma decisão que `LevelUpShell` pediria
(subclasse, estilo de luta, truques/magias preparadas, especialista,
ASI-ou-talento), só que sorteada em vez de escolhida a cada passo.
Confirmado com o Osmar: PV usa a média do dado por nível (sem rolar,
sem "PV máximo sempre") — mesmo padrão "usar a média" já default no
wizard/Level Up normal.

**Simplificações deliberadas** (é ferramenta de teste, não faz parte
do fluxo real de jogo):
- Truques/Magias Preparadas são resorteados do zero em cada nível
  (não respeita a regra real de "só 1 troca por level-up" — não faz
  sentido aplicar esse limite numa geração instantânea).
- Talento/ASI: 50% chance de pegar "Aumento no Valor de Atributo"
  (ASI puro), 50% chance de um Talento Geral aleatório entre os
  válidos pro nível/atributos atuais (mesma validação de Nível/Atributo
  Mínimo do picker real).
- Dádiva Épica (Cap. 5) fica de fora — a lista ainda não existe no
  app (mesmo estado `[PH]` do Level Up normal).
- Não abre o wizard nem o Level Up — salva o personagem já pronto
  direto (`armazenamentoPersonagens.salvar`) e navega pra Ficha.

**UI:** botão "🎲 Personagem de Teste" na tela "Seus personagens"
(`CharacterList.tsx`) — não entrou na Home pra não quebrar as "3
opções fixas" que já existiam lá. Abre um popup
(`PersonagemTesteModal.tsx`) com 4 `<select>` (Classe/Origem/Espécie —
só as opções `disponivel: true`, mesma regra do wizard — e Nível
1-20); "Criar" gera e já navega pra Ficha do personagem novo.

**Testado:** Playwright 390×844 — gerado em nível 1, 5, 8, 12 e 20,
com combinações diferentes de Classe/Origem/Espécie; ficha abre sem
erro de JS em nenhum caso, navegando por todas as abas
(Atributos/Perfil/Mochila/Magias/Combate); nível 8 confirmado com
subclasse aplicada (ícone/nome no cabeçalho), PV/CA/atributos
condizentes com o nível.

**Data/origem:** 2026-08.

## Personagem de Teste — atalho pra gerar "1 nível antes de um Talento"

**Contexto:** o Osmar notou que, testando Alerta/Defensivo/Arquearia/
Duelismo (lote 1 da Fase 4), só via "Mestre em Armaduras Médias"
aparecer — esperado, não é bug: Alerta vem só de Origens específicas
(ex: Criminoso) e os 3 de Estilo de Luta só aparecem se o Estilo
sorteado pelo gerador for exatamente aquele (1 em 10). Só Mestre em
Armaduras Médias é Talento Geral de verdade, escolhido pela lista —
por isso aparecia sozinho num personagem gerado aleatoriamente. Em
vez de eu forçar essas combinações no gerador, o Osmar preferiu poder
subir de nível manualmente e escolher o Talento na hora, testando o
fluxo real de Level Up.

**Decisão:** no popup "Personagem de Teste", embaixo do dropdown de
Nível, uma linha de atalhos calculada a partir de `niveisComASI` da
Classe escolhida (recalcula ao trocar de Classe) — 1 chip por nível
de Talento da classe, mostrando "nível X (Talento no X+1)"; tocar
seta o dropdown pra `X` (1 a menos que o nível de verdade). Gera o
personagem exatamente 1 nível antes de qualquer Talento/ASI da
classe escolhida — o jogador dá "Level Up" na Ficha logo em seguida e
cai direto no passo de escolha, podendo testar qualquer Talento (não
só os já implementados na Fase 4) através do fluxo real.

**Testado:** Playwright 390×844 — chips corretos pro Guerreiro (4, 6,
8, 12, 14, 16 — tem Talento extra, diferente da maioria das classes);
clicar no chip "nível 3 (Talento no 4)" ajustou o dropdown pra 3 e
ficou destacado; personagem gerado nível 3; "Level Up" na Ficha abriu
normalmente, pronto pra escolher o Talento do nível 4.

**Data/origem:** 2026-08.

## Botão "Criar 1 personagem por Talento implementado"

**Contexto:** o Osmar pediu um jeito de conferir de vez os 5 talentos
da Fase 4 lote 1 sem depender do sorteio acertar a combinação certa
(Alerta só vem de Origem específica; os 3 de Estilo de Luta são 1 em
10 no sorteio) — nome do personagem de teste = nome do talento, 1 pra
cada.

**Decisão:** `core/geradorPersonagemTeste.ts` ganhou
`TALENTOS_FASE4_IMPLEMENTADOS` (catálogo com `tipo: 'origem' |
'estiloDeLuta' | 'geral'`, um por talento já implementado — atualizar
aqui a cada novo lote da Fase 4) e `gerarPersonagemComTalento(id)`,
que monta Classe/Origem/Espécie compatíveis automaticamente pro tipo
certo (`'origem'` busca a Origem que concede aquele
`talentoOrigemId`; `'estiloDeLuta'` busca uma Classe com Estilo de
Luta trocável e força esse Estilo; `'geral'` sobe até o 1º nível de
ASI da Classe e força esse Talento em vez do sorteio 50/50) e seta
`selecao.nome` = nome do talento. `gerarPersonagensDeTesteDosTalentos()`
gera os 5 de uma vez; botão "🧪 Criar 1 personagem por Talento
implementado" na tela "Seus personagens" salva todos e recarrega a
lista.

**Bug encontrado e corrigido no processo:** o card de cada personagem
na lista mostrava `pvAtual/pvMax` errado pra qualquer personagem
acima do nível 1 — `CharacterList.tsx` calculava o "PV máximo" sempre
com `calcularPvMaximoNivel1(selecao)` (fórmula de nível 1), ignorando
o campo `p.pvMax` (PV máximo real, acumulado nos Level Ups) que já
existe em `PersonagemSalvo` e já é usado corretamente em
`FichaShell.tsx`. Resultado visível: "Mestre em Armaduras Médias"
(nível 4) aparecia como "32/11 PV" (atual maior que o "máximo").
Corrigido pra `p.pvMax ?? calcularPvMaximoNivel1(selecao) ?? p.pvAtual`
— mesmo padrão de fallback já usado em `FichaShell.tsx` (o `??`
cobre só personagens salvos antes desse campo existir). Não era um
bug introduzido por essa entrega — só nunca tinha aparecido porque
não havia antes uma forma rápida de criar um personagem já acima do
nível 1.

**Testado:** Playwright 390×844 — os 5 personagens saem com o
talento/estilo certo (`talentosGeraisAtual`/`estiloDeLutaAtual`
conferidos via localStorage) e nome = nome do talento; Iniciativa do
"Alerta" bateu (+4 = +2 DES +2 Prof.); PV da lista corrigido em todos
os 5 depois do fix (antes só o de nível 4 mostrava o bug, porque os
de nível 1 nunca tinham Level Up acumulado pra divergir).

**Data/origem:** 2026-08.

## Personagens de teste de Estilo de Luta já nascem com o item certo equipado

**Contexto:** o Osmar não sabia como confirmar Arquearia — o
personagem de teste tinha o Estilo de Luta marcado, mas nenhum efeito
visível, porque nenhum dos 3 efeitos de Estilo de Luta (Arquearia,
Duelismo, Defensivo) aparece em lugar nenhum sem o item certo
EQUIPADO (arma à Distância / arma corpo a corpo de 1 mão só / Armadura
— ver `core/ataque.ts` e `core/calculoPersonagem.ts`, lote 1 da Fase
4). O kit de equipamento inicial da Classe é sorteado entre as opções
A/B/C, e nem toda opção tem o item necessário (ex: só a opção B do
Guerreiro tem um Arco Longo).

**Decisão:** `gerarPersonagemComTalento` (em
`core/geradorPersonagemTeste.ts`) ganhou
`garantirEquipamentoParaEstiloDeLuta` — depois de montar o
personagem, verifica se o kit sorteado já tem o item certo; se não
tiver, troca pra uma opção de equipamento (A/B/C) da Classe que
tenha, e equipa esse item no slot certo (`core/equipamento.ts`
`equiparNoSlot` — Mão Principal pras armas, Armadura pro Defensivo)
antes de salvar. Assim o personagem de teste já nasce pronto pra
mostrar o efeito, sem o Osmar precisar caçar item na Mochila.

**Testado:** Playwright 390×844 — "Arquearia" nasceu com Arco Longo
na Mão Principal (aba Mochila confirma "Equipado Agora"); "Duelismo"
com Adaga na Mão Principal e nada na Mão Secundária; "Defensivo" com
Couro Batido na Armadura; ataque com o Arco Longo rolou "1d20 + 6" —
consistente com DES+Prof.+Arquearia.

**Data/origem:** 2026-08.

## Removido: "Criar 1 personagem por Talento implementado"

**Contexto:** o Osmar achou a função "atrapalhando" e pediu pra
tirar tudo, deixando só o gerador aleatório (Classe/Origem/Espécie/
Nível) sem o botão de forçar talento específico.

**Decisão:** removidos de `core/geradorPersonagemTeste.ts`:
`TALENTOS_FASE4_IMPLEMENTADOS`, `gerarPersonagemComTalento`,
`gerarPersonagensDeTesteDosTalentos`,
`garantirEquipamentoParaEstiloDeLuta` e os helpers de identificar
arma/armadura por nome — junto com o parâmetro `talentoForcadoId` de
`aplicarLevelUpsAleatorios`/`gerarPersonagemTeste`, que só existia
pra sustentar essa função. Botão "🧪 Criar 1 personagem por Talento
implementado" removido de `CharacterList.tsx`. O botão "🎲 Personagem
de Teste" (gerador aleatório puro) e o atalho "1 nível antes de um
Talento" no seu popup continuam — não faziam parte do que foi pedido
pra tirar.

**Data/origem:** 2026-08.

## Personagem de Teste — dropdown opcional de Subclasse

**O que é:** pedido do Osmar — 5º dropdown no popup "🎲 Personagem de
Teste", **opcional**, sempre começa vazio ("— sortear —"). Só aparece
quando Nível ≥ nível de subclasse da Classe escolhida (Bardo = 3) — e
só lista subclasses que já têm característica mecânica implementada
de verdade (`subclasseImplementada`, mesmo bloqueio já usado na tela
de escolha de subclasse do Level Up — hoje só "Colégio do
Conhecimento" pra Bardo).

**Implementação:**
- `core/geradorPersonagemTeste.ts`: nova função
  `subclassesDisponiveisParaTeste(classeNome)`; `gerarPersonagemTeste`
  ganhou parâmetro opcional `subclasseNome`, repassado pra
  `aplicarLevelUpsAleatorios` (novo parâmetro `subclasseForcada`) — se
  vier preenchido, usa em vez de sortear; deixado vazio, comportamento
  de sempre (sorteia entre as opções implementadas).
- `PersonagemTesteModal.tsx`: a validade da escolha é só DERIVADA do
  estado a cada render (`subclasseValida`), sem `useEffect` — troca de
  Classe ou nível caindo abaixo do de subclasse invalida a escolha
  anterior automaticamente (não sobra uma subclasse de outra classe
  selecionada por engano).

**Fora de escopo de propósito:** a subclasse forçada ainda não gera
as escolhas mecânicas dela (Proficiências Bônus, Descobertas
Mágicas) — o gerador nunca fez isso nem pra subclasse sorteada, esse
gap já é conhecido (ver sessão de testes do Colégio do Conhecimento,
sempre precisou passar pelo Level Up manual pra preencher essas
escolhas). Só a ESCOLHA da subclasse deixou de ser aleatória.

Testado via Playwright: dropdown ausente em nível 1; aparece em nível
3 só com "Colégio do Conhecimento"; personagem gerado com a subclasse
escolhida de verdade (não sorteada).

**Data/origem:** 2026-08.

## Criação de Personagem — modo "+2/+1" do ajuste de Antecedente

**O que é:** o passo "3c. Atributos" do wizard só tinha o modo
"+1/+1/+1" funcional; o card "+2/+1" ficava desabilitado ("em
breve"). Implementado o modo que faltava, reaproveitando a mesma UI
de +/- redondos que já existia no Level Up pra distribuir os 2 pontos
de Aumento no Valor de Atributo — regra real é a mesma forma
(distribuir N pontos, no máximo 2 no mesmo atributo), só muda o total
(2 no Level Up, 3 no ajuste de Antecedente).

**Implementação:**
- `WizardSelection.bonusModo` (`core/personagem.ts`) ganhou o
  literal `'21'` além de `'111'` — `valorFinalAtributo` já era
  genérico (conta ocorrências no array `bonusEscolhas`), não precisou
  mudar.
- Nova UI compartilhada `ui/components/DistribuirPontosAtributo.tsx`
  (+ `.module.css`) — extraída da função local
  `renderDistribuirPontos()` que só existia dentro de
  `LevelUpShell.tsx`. Componente controlado: recebe `pontosTotal`,
  `escolhas`, `atributosBase`, `onIncrementar`/`onDecrementar` e um
  `atributoTravado` opcional — cada tela (Level Up ou wizard) mantém
  seu próprio estado e regra de validação, só a renderização da
  tabela é compartilhada.
- `LevelUpShell.tsx` passou a usar o componente novo no lugar da
  função local (removida, junto com as classes CSS
  `.asiHeaderRow`/`.asiRow`/`.asiStepper`/`.asiBtn` que só ela usava).
- `AtributosStep.tsx`: card "+2/+1" habilitado, com
  `incrementarBonus21`/`decrementarBonus21` respeitando o mesmo
  travamento de atributo elegível do Antecedente (`atributoTravado`)
  que o modo "+1/+1/+1" já respeitava.
- `WizardShell.tsx`: validação do passo agora aceita `bonusModo !==
  null` (qualquer um dos dois modos), não só `'111'`.
- Removido o aviso de protótipo "só o modo +1/+1/+1 está funcional" —
  os dois modos agora funcionam. O botão 🔀 de aleatorizar o passo
  continua só usando o modo "+1/+1/+1" de propósito (não foi pedido
  pra aleatorizar o modo "+2/+1" também).

Testado via Playwright em 390px: preencheu os 6 atributos, trocou pro
modo "+2/+1", confirmou trava nos atributos fora da lista de
elegíveis do Antecedente sorteado, aplicou +2 num atributo elegível
(botão "+" trava sozinho ao chegar em 2) e +1 em outro, "Faltam"
chegou a 0, e "Avançar" levou pro próximo passo (Línguas) sem
bloqueio.

**Data/origem:** 2026-08.

## Criação de Personagem — ajuste de Antecedente unificado num só modo

**O que é:** o Osmar testou na tela e viu que "+1/+1/+1" e "+2/+1" no
passo "3c. Atributos" usavam 2 soluções de UI diferentes (grade de
cards tocáveis vs. lista de +/- redondos) — pediu pra unificar as
duas, usando a solução da lista (`DistribuirPontosAtributo`, a mesma
já usada no Level Up). Como distribuir 3 pontos com no máximo 2 no
mesmo atributo já cobre as duas formas válidas da regra (1+1+1 ou
2+1) automaticamente, o seletor de modo (os 2 cards "+1/+1/+1" /
"+2/+1") virou desnecessário — sumiu, sobrou só a lista.

**Implementação:**
- `AtributosStep.tsx`: removidos `setBonusModo`/`setBonusModo21`/
  `toggleBonus` e a grade antiga; sempre renderiza
  `<DistribuirPontosAtributo pontosTotal={3} .../>` assim que os 6
  atributos base estão preenchidos, com `atributoTravado` bloqueando
  os 3 atributos fora da lista de elegíveis do Antecedente (igual já
  fazia no modo "+2/+1").
- `bonusModo` (`'111' | '21' | null`) removido de `WizardSelection`
  (`core/personagem.ts`) e de todo lugar que setava — não tinha mais
  uso depois de sumir o seletor de modo (`WizardShell.tsx`'s
  `randomizarAtributos`, `geradorPersonagemTeste.ts`). Validação do
  passo simplificada pra só checar `bonusEscolhas.length === 3`.
- `DistribuirPontosAtributo.tsx`/`.module.css`: nova classe
  `.rowTravado` — a linha inteira de um atributo bloqueado (não só os
  botões +/-, como antes) fica cinza escuro/esmaecida, deixando claro
  visualmente que não dá pra tocar ali sem marcar "Desbloquear
  atributos". Efeito colateral bom: o Level Up (que nunca passa
  `atributoTravado`) não muda nada, já que a classe só é aplicada
  quando esse prop existe e retorna true.

Testado via Playwright em 390px: só a lista aparece agora (sem
seletor de modo); atributos fora da lista de elegíveis do Antecedente
sorteado (CON/SAB/CAR pra uma Origem com FOR/DES/INT elegíveis)
apareceram visivelmente esmaecidos com botões travados; aplicar +2
num elegível e +1 em outro chegou em "Faltam 0" e liberou "Avançar".

**Data/origem:** 2026-09.

## Personagem fixo de demonstração (URL estável pra outra IA/pessoa ver a UI)

**O que é:** pedido do Osmar — precisava de uma URL fixa
(`/ficha/demo-bardo-colegio-conhecimento`) que leva sempre ao mesmo
personagem, não apagável, independente de quem/qual navegador abra —
motivo: dar acesso a outra IA pra ver a UI sem precisar criar um
personagem primeiro. Personagem: Bardo/Colégio do Conhecimento nível
20, Origem Artista, Espécie Humano, com os 2 kits iniciais (classe +
origem) preenchendo a Mochila.

**Problema real de arquitetura, resolvido:** o armazenamento hoje é
só `localStorage` (por navegador, ver `core/armazenamentoPersonagens.ts`)
— não existe backend compartilhado (Supabase só entra na Fase 5, ver
CLAUDE.md seção 9). Uma URL fixa sozinha NÃO faz um navegador
diferente enxergar o mesmo dado. Solução: o personagem é um dado
**congelado** (`data/personagemDemo.ts`, gerado 1 vez com
`core/geradorPersonagemTeste.ts` e colado como literal, não gerado em
tempo de execução) — `FichaShell.tsx` chama
`core/personagemDemo.ts`'s `garantirPersonagemDemo()` quando o id da
URL bate com `ID_PERSONAGEM_DEMO`: se esse navegador ainda não tem
esse personagem salvo, semeia com o dado congelado. Assim, QUALQUER
navegador que abrir a URL cria localmente o mesmo personagem-base na
1ª visita. Editar esse personagem na tela (PV, mochila, etc.)
continua funcionando normal e persiste NESSE navegador — só não pode
ser apagado, e um navegador diferente sempre parte do mesmo estado
congelado.

**"Não apagável":** duas camadas — `armazenamentoPersonagens.ts`'s
`apagar()` recusa silenciosamente se `id === ID_PERSONAGEM_DEMO`
(garantia de verdade, funciona não importa por onde alguém tente
apagar); `CharacterList.tsx` também troca o botão 🗑️ por uma tag
"🔒 fixo" só nesse personagem, pra não mostrar um botão que não faz
nada.

**Por que "kit A" nos dois (não B):** o kit B da Classe Bardo é só
90 PO sem item nenhum (ganhar ouro em vez de equipamento, opção real
do livro) — pro personagem de demonstração servir pra ver a Mochila
cheia, os dois precisam ser o kit COM item (opção A tanto de Classe
quanto de Origem). "Kit de Artista" (item da opção A de Classe) já
expande sozinho pros itens de dentro dele via
`core/mochila.ts`'s `calcularItensIniciais` — não precisei fazer nada
extra pra isso acontecer.

Testado via Playwright com um contexto de navegador 100% limpo (sem
`localStorage` prévio) acessando a URL direto — personagem carregou
completo (PV 143/143, Espaços de Magia até 9º círculo, Mochila com
itens de Classe + Origem, CA 12 com a Couro equipada automaticamente)
sem passar pela Lista nem pelo wizard antes.

**Data/origem:** 2026-09.

## Passo condicional no wizard + escolha livre de proficiência (Talento de Origem)

**Padrão pra passo do wizard que só existe pra algumas escolhas
anteriores** (ex: "2c. Talento da Origem", que só aparece quando o
talento da origem escolhida concede uma escolha extra — hoje só
Habilidoso, futuramente Iniciado em Magia): `WizardStepDef` ganhou um
campo opcional `condicao?: (s: WizardSelection) => boolean`. A lista
de passos continua sendo declarada inteira e fixa (`steps`), mas é
filtrada em `condicao` a cada render (`stepsAtivos`) antes de indexar
— com `wizIndex` (estado bruto) sempre grampeado pro tamanho da lista
filtrada (`idx = Math.min(wizIndex, stepsAtivos.length - 1)`) pra
nunca apontar fora dos passos ativos se uma escolha anterior mudar. As
funções de navegação (`wizNext`/`wizPrev`) e os pontinhos de progresso
usam `idx`/`stepsAtivos`, não mais o `wizIndex`/`steps` brutos.

**Escolha livre de perícia/ferramenta (Habilidoso) — schema genérico,
não hardcoded pro talento específico:** `Talento` ganhou
`concedeProficiencias?: { quantidade: number; tipos: ('pericia' |
'ferramenta')[] }` (`talentos.ts`) — reconhecido pelo **ID** do
talento (`habilidoso`), nunca pelo nome de exibição (seção 13 do
CLAUDE.md). `WizardSelection` ganhou
`proficienciasTalentoOrigemEscolhidas: string[]` (nomes de perícia e
ferramenta misturados na mesma lista). Novo
`core/proficienciasOrigem.ts`'s `proficienciasJaConcedidas(selection,
origem)` deriva o conjunto do que o personagem já tem por Origem/
Classe (2 perícias fixas + ferramenta já escolhida + o que a Classe já
concedeu) — usado só pra marcar visualmente "já possui" na lista de
escolha (`check-row`/`check-box`, mesmo padrão de qualquer outra
escolha múltipla do wizard), sem bloquear a escolha (duplicar é válido
em D&D, só não ganha nada a mais).

**Por que isso desbloqueou 3 origens de uma vez (Nobre, Escriba,
Charlatão):** as 3 usam Habilidoso e já tinham todo o resto do dado
pronto na planilha (só ficavam com `disponivel: false` esperando essa
UI) — o passo novo é genérico por talento, não por origem, então as 3
foram destravadas juntas sem custo extra. Ver PENDENCIAS.md "Origens
com seleção extra no Talento de Origem" pro que ainda falta (Iniciado
em Magia, mesma ideia mas escolha de truque+magia de lista de classe,
schema diferente).

**Data/origem:** 2026-09. Pedido do Osmar pra implementar a Origem
Nobre.
