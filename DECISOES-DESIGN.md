# DECISOES-DESIGN.md

> Este arquivo guarda decisão de arquitetura/UI/processo do projeto —
> por que um padrão de UI foi escolhido, por que uma regra de D&D foi
> simplificada de um jeito específico, o que já foi tentado e
> descartado. Fato de regra de D&D já confirmado vai em
> `DND-Regras.md`, não aqui — ver seção 3.1 do `CLAUDE.md`.
>
> **Ficou grande demais pra um arquivo só (passou de 5900 linhas) —
> a partir de 2026-09 as decisões são organizadas por área, num de
> 6 arquivos da família `DECISOES-*.md`:**
>
> | Arquivo | Assunto |
> |---|---|
> | `DECISOES-DESIGN.md` (este) | Sistema de design geral — tema, M3, ícones, componentes reaproveitáveis (popups/molduras/cards), deploy, versão, arquitetura de alto nível, processo |
> | `DECISOES-WIZARD.md` | Wizard de criação de personagem — passos, navegação, atributos, geradores de teste |
> | `DECISOES-FICHA.md` | Ficha (fora do Combat) — Perfil, Mochila, Loja, Equipamento, Itens Mágicos, Level Up |
> | `DECISOES-COMBATE.md` | Aba Combat — economia de ação, espaços de magia em combate, PV, iniciativa |
> | `DECISOES-CLASSES.md` | Implementação de cada classe (Guerreiro, Bardo/Colégio do Conhecimento) e Talentos/ASI |
> | `DECISOES-DADOS.md` | Camada `data/` — schema de import da planilha mestra |
>
> **Antes de registrar uma decisão nova, escolha o arquivo pelo
> assunto** (a tabela acima ajuda); na dúvida entre dois, escolha o
> que a tela/fluxo específico mais afetado; se for algo que atravessa
> vários (ex: um padrão de UI reaproveitado em toda tela), fica aqui
> em `DECISOES-DESIGN.md`. Ver seção 7 do `CLAUDE.md` pra regra
> completa de quando registrar.
>
> **2026-09 — 1ª divisão + passagem de compactação:** o arquivo único
> tinha passado de 5900 linhas; a divisão por área sozinha não ia
> segurar o crescimento (2 classes + 1 subclasse já tinham gerado
> ~2200 linhas de changelog em `DECISOES-CLASSES.md`, e faltam ~10
> classes + ~35 subclasses pra implementar). Junto da divisão, os 2
> arquivos mais pesados (`DECISOES-CLASSES.md`, `DECISOES-FICHA.md`)
> passaram por uma compactação — narração de entrega/bug corrigido/
> "testei X" removida, só padrão reaproveitável ficou. Regra daqui
> pra frente, pra não engordar de novo: ver seção 7 do `CLAUDE.md`.

---

## Level Up — overlay em cima da ficha, não uma rota separada

**Decisão:** o fluxo de Level Up (`LevelUpShell`) é renderizado como um
overlay de tela cheia (`position: fixed`) **dentro** do componente da
ficha (`FichaShell`), trocado por uma flag de estado
(`levelUpAberto`), e não por uma navegação de rota (`/ficha/:id/levelup`).

**Contexto:** o wireframe HTML original usa uma "tela" separada
(`screen-levelup`) alcançada por `go('screen-levelup')`. Copiar esse
padrão literalmente como uma rota React Router faria o React desmontar o
`FichaShell` ao navegar — perdendo todo o estado vivo da sessão de
combate (PV atual, Espaços de Magia gastos, estado Ativo/Usada dos 3
botões de turno) só porque o jogador foi fazer level-up no meio de uma
sessão. Manter como overlay dentro do mesmo componente preserva esse
estado.

**Alternativas descartadas:** rota `/ficha/:id/levelup` separada,
descartada pelo motivo acima.

**Padrão a repetir:** qualquer fluxo futuro que precise "tomar a tela
inteira" mas continuar dentro do contexto de uma ficha já aberta (ex:
editor de item, ficha de NPC dentro de uma sessão) deve seguir esse
mesmo padrão — overlay controlado por estado local, não rota nova.

**Data/origem:** 2026-08, entrega 0.7.

## Rolagem de dados — contexto global (`RollProvider`), não popup por tela

**Decisão:** existe um único componente de overlay de dado
(`RollOverlay`) montado uma vez no topo do app (`App.tsx`), controlado
por um React Context (`RollContext`/`useRoll()`). Qualquer tela chama
`rolarD20(...)` ou `rolarDados(...)` de qualquer lugar da árvore de
componentes, sem precisar montar sua própria cópia do overlay.

**Contexto:** o wireframe tinha um único `#roll-overlay` compartilhado
manipulado via funções globais (`roll()`, `rollDamage()`) porque era só
HTML/JS solto. Em React, o equivalente correto de "uma coisa só que
qualquer tela aciona" é Context + Provider no topo da árvore, não
duplicar o componente de overlay em cada tela que precisa rolar dado.

**Data/origem:** 2026-08, entrega 0.7.

## Tema visual do app de verdade (React): light, não dark

**Decisão:** o app em React usa paleta **clara** (fundo claro, texto
escuro), ainda monocromática/cinza — não o dark do wireframe HTML
original.

**Contexto:** o wireframe HTML (`wireframe-app-rpg-v2.html`) foi feito em
dark de propósito pra simular "protótipo neutro" (ver seção 9 do
`guia-mestre-projeto.md`), mas na hora de validar texto e leitura durante
o desenvolvimento em React, o Osmar achou mais fácil revisar em fundo
claro. Pedido explícito, na entrega 0.2.

**Alternativas descartadas:** manter o dark do wireframe como já estava —
descartado porque dificultava a validação de texto nesta fase.

**Pendência conhecida:** a direção visual "RPGzística" de verdade
(tipografia old-school, paleta dourado/bronze, textura) continua adiada
pra mais pra frente (ver seção 9 do `guia-mestre-projeto.md`) — light aqui
é só facilitar revisão nesta fase inicial, não é a decisão final de
identidade visual. Quando a direção visual entrar, esse tema muda de novo
e essa entrada deve ser atualizada.

**Data/origem:** 2026-08, durante a entrega 0.2 (Fase 0 — esqueleto
navegável).

## Carimbo de versão visível em toda entrega

**Decisão:** todo build publicado mostra um carimbo `v{AAAA}{MM}_{HHmm}`
(ano/mês/hora/minuto do commit) fixo e discreto na tela, lido de
`src/version.ts`.

**Contexto:** o Osmar testa cada entrega abrindo o mesmo link Netlify
repetidas vezes. Sem um jeito visível de diferenciar versões, é difícil
saber se o navegador está mostrando a entrega nova ou uma versão em
cache. Pedido explícito, na entrega 0.2. Regra fixa registrada também no
`CLAUDE.md` (seção 10).

**Data/origem:** 2026-08, durante a entrega 0.2.

---

## UI — tooltip em texto sublinhado / pill com ícone "i" (a implementar)

**Decisão (adiada, só registrada por ora):** qualquer termo com descrição
própria (talento, magia, truque) aparece sublinhado; tocar abre popup com
a descrição, sem trocar de tela. Quando o termo é uma opção selecionável
em formato de pill, o mesmo comportamento vem de um ícone "i" ao lado em
vez do sublinhado.

**Contexto:** mesmo padrão do builder anterior. Ainda não está no
wireframe atual.

## Técnica de escala pra molduras ornamentadas — 9-slice (border-image)

**Decisão:** painéis, botões e cards com moldura ornamentada (a pele RPG
que vai por cima da estrutura M3) devem usar a técnica **9-slice**
(equivalente web do 9-patch/9-slice que o Osmar já usava no Unity) via
CSS `border-image` — não gerar uma imagem por tamanho de componente.

**O que é:** o asset é dividido numa grade 3x3. Os 4 cantos nunca
esticam (preservam o entalhe/ornamento); as bordas do meio esticam só
numa direção; o centro estica nas duas. Implementado via
`border-image-source` + `border-image-slice` + `border-image-width`, com
`border-image-repeat: repeat` pra texturas como pedra/tecido (evita
esticar e borrar) ou `stretch` pra gradientes lisos.

**Contexto:** pergunta direta do Osmar comparando com a técnica que ele
já usa em Unity para assets de jogo. Confirmado que existe equivalente
nativo em CSS, sem precisar de biblioteca extra pra DOM comum (só
necessário considerar solução alternativa tipo `NineSlicePlane` do
Pixi.js se algum componente futuro for renderizado em canvas/WebGL em vez
de DOM normal).

**Relevância direta:** os estandartes e emblemas com moldura ornamentada
já produzidos são candidatos naturais a usar esse padrão quando virarem
componentes reais (botões, cards) de tamanho variável.

## Referência de design — Material Design 3 (m3.material.io)

**Decisão:** usar o Material Design 3 do Google como referência de
**estrutura/comportamento** (espaçamento, states de componente, motion,
acessibilidade, padrões de bottom sheet/FAB/seleção) sempre que houver
dúvida se um padrão de UI está dentro de boa prática.

**Nota importante (correção de um mal-entendido inicial):** estrutura
(M3) e identidade visual RPGzística **não são excludentes** — são duas
camadas independentes. Um botão pode seguir o padrão estrutural de pill
do M3 (formato, área de toque, comportamento de seleção) e ao mesmo tempo
ter textura de pedra/pergaminho e tipografia old-school por cima. Não é
"M3 ou RPG", é "M3 por baixo, RPG por cima" — dá pra fazer os dois ao
mesmo tempo, a qualquer momento, sem esperar uma fase específica.

**Sobre timing:** a recomendação de "visual pode vir depois" era só
sobre prioridade (validar fluxo/lógica é mais urgente porque bloqueia
decisões; visual não bloqueia nada). Não é uma regra contra começar a
aplicar identidade visual mais cedo, se o Osmar quiser — só não é
pré-requisito pra avançar o resto.

**Decisão de processo de construção (confirmada):** todo componente será
construído primeiro seguindo a estrutura/comportamento do M3 (isso é o
"correto por padrão" ao implementar qualquer tela nova), e só depois
recebe a alteração temática de RPG por cima. Ou seja, a ordem de trabalho
padrão é sempre: 1) implementar com M3 como base estrutural → 2) aplicar
a pele RPGzística. Isso vale como diretriz permanente de como construir
qualquer tela nova daqui pra frente, não só uma observação pontual. Regra
correspondente registrada no `CLAUDE.md`, seção 5.1.

**Contexto:** Osmar encontrou o m3.material.io e perguntou se dava pra
usar sempre como referência.

**Pendência conhecida:** as telas já construídas na Fase 0 (splash,
login, home, lista, wizard, ficha, combate) **não foram auditadas** contra
M3 retroativamente — essa regra vale como padrão daqui pra frente, pra
telas novas ou quando uma tela existente for revisitada por outro motivo.
Não é gatilho pra uma varredura geral agora.

## Popup de descrição de item — implementado (ItemComDescricao)

**Decisão:** o padrão "tooltip em texto sublinhado", que estava adiado
desde a entrega de Origens, agora existe de verdade:
`ui/components/ItemComDescricao.tsx`. Nome do item vem com sublinhado
serrilhado quando tem descrição cadastrada; toque abre um popup central
(mesmo estilo visual do `RollOverlay`: card com borda de destaque,
sombra, botão "fechar") com o nome no topo e a descrição embaixo. Item
sem descrição renderiza como texto simples, sem sublinhado.

**Contexto:** o Osmar atualizou a planilha mestra com uma coluna
"Descrição" nova em **Equipamento de Aventura** (98/98 itens) e
**Montarias e Veículos** (2/19 itens — Sela Militar e Sela Exótica são
os únicos com regra mecânica; o resto é só carga/custo). Isso desbloqueou
o popup que antes só estava desenhado no papel.

**Detalhe de implementação:**
- `data/rulesets/dnd2024/equipamentoAventura.ts` e `montariasVeiculos.ts`
  — dados gerados da planilha, linhas de cabeçalho de seção (ex: "—
  Foco Arcano —") filtradas na importação.
- `data/rulesets/dnd2024/buscarDescricaoItem.ts` — índice único por nome
  (case-insensitive) que cruza as duas fontes; qualquer tela que
  precise saber "esse item tem descrição?" usa essa mesma função, não
  reimplementa a busca.
- O clique no nome do item usa `stopPropagation` — importante porque em
  vários lugares o item aparece **dentro** de um card clicável maior
  (ex: o card de "Opção A" na tela de Origem); sem isso, tocar no nome
  do item também dispararia a seleção do card por baixo.
- Cobertura ainda parcial: Armas e Armaduras não foram importadas (não
  têm campo de descrição corrido na planilha, têm colunas mecânicas) —
  ver `PENDENCIAS.md`.

**Data/origem:** 2026-08, depois da atualização da planilha mestra com a
coluna Descrição.

## ItemComDescricao — regra fixa de qual variante usar (sublinhado vs. ícone)

**Decisão:** `ItemComDescricao` tem 2 variantes visuais pro mesmo
comportamento (toque abre popup com nome+descrição) — a partir de
agora, qual usar não é escolha caso a caso, é regra fixa por contexto:
- **`sublinhado`** (padrão) — termo dentro de uma frase/parágrafo de
  texto corrido (ex: descrição de kit, lista de itens da Loja/Origem).
- **`icone`** (ⓘ solto ao lado, nome sem sublinhado) — termo dentro de
  uma **linha de estatística ou linha com checkbox**, onde sublinhar o
  texto competiria visualmente com o resto da linha ou pareceria um
  controle interativo à parte (ex: Mochila com "itens detalhados"
  desligado, Maestria em Arma — tanto no wizard quanto na Ficha).

**Contexto:** a Maestria em Arma tinha ganhado sublinhado na Ficha (B2)
e ícone no wizard (ajuste seguinte) sem uma regra declarada — o Osmar
notou a inconsistência e perguntou qual deveria ser o padrão único.
Resposta: não existe 1 variante única pro app inteiro, existem 2
variantes com contexto de uso bem definido — o real problema era essa
regra não estar registrada em lugar nenhum, então cada tela escolhia
"no olho". Agora está: tanto no JSDoc de `ItemComDescricao.tsx` quanto
aqui. Qualquer termo novo com popup de descrição consulta essa regra
antes de escolher a variante — não decide de novo.

**Termo de design pra isso:** isso é uma **guideline de uso de
componente** (ou "contrato de variante") — a mesma ideia de design
system que já usamos nesse arquivo pra qualquer decisão de UI: uma vez
registrada, vale pra sempre até você pedir pra mudar, sem precisar
repetir o pedido a cada tela nova.

**Data/origem:** 2026-08.

## Deploy migrado do Netlify pro GitHub Pages

**Decisão:** o app deixou de ser publicado no Netlify
(`dndcompapp.netlify.app`) e passou a ser publicado no GitHub Pages,
via GitHub Actions (`.github/workflows/deploy.yml`), que builda e
publica automaticamente a cada push na branch de desenvolvimento. Novo
link: `https://osmarjunior0710.github.io/Project0710/` (repositório
renomeado de `DND-Conpanion-App` pra `Project0710` em 2026-09 — ver
"Repositório renomeado" logo abaixo).

**Contexto:** o time do Netlify ficou sem crédito operacional
("operational credits"), o que pausou os deploys de produção — os
commits chegavam no GitHub normalmente, mas o site publicado ficou
travado numa versão antiga sem nenhum erro de código envolvido. Como o
app é 100% front-end (sem backend próprio; a Fase 5 com Supabase
conversa direto do navegador, sem precisar de função de servidor), o
GitHub Pages cobre o caso de uso sem depender de crédito pago.

**O que mudou tecnicamente:**
- `vite.config.ts`: `base: '/Project0710/'` (o GitHub Pages serve
  o site dentro de um subcaminho com o nome do repositório, diferente
  do Netlify que serve na raiz).
- `src/main.tsx`: `BrowserRouter` ganhou `basename="/Project0710"`
  pra as rotas do React Router baterem com esse subcaminho.
- `public/404.html` + trecho em `index.html`: truque padrão
  "spa-github-pages" (rafgraph) pra recarregar uma rota tipo
  `/ficha/123` não dar erro 404 — o GitHub Pages não tem redirecionamento
  de rota nativo como o `netlify.toml` tinha.
- `netlify.toml` removido (não é mais usado).

**Limite conhecido pro futuro:** GitHub Pages grátis só serve site
público enquanto o repositório for público. Se um dia o repositório
virar privado, o link para de funcionar (exigiria GitHub Enterprise pra
Pages privado). Registrado aqui pra não ser surpresa depois — hoje o
repo é público, então não trava nada agora.

**Data/origem:** 2026-08, mesmo dia da entrega acima — Osmar pediu a
migração depois de descobrir a pausa de créditos do Netlify.

## Repositório renomeado de DND-Conpanion-App pra Project0710 (2026-09)

O Osmar renomeou o repositório no GitHub. Como o GitHub Pages serve o
site num subcaminho com o nome do repositório (ver decisão acima),
renomear o repo muda o link público e exige atualizar o subcaminho
hardcoded em 3 lugares: `vite.config.ts` (`base`), `src/main.tsx`
(`BrowserRouter basename`), `public/404.html` (`basePath` do truque de
SPA). Os 3 já foram atualizados pra `/Project0710/`. Novo link:
`https://osmarjunior0710.github.io/Project0710/`.

**Se o repositório for renomeado de novo no futuro:** procurar por
esses 3 lugares (mais qualquer entrada da família `DECISOES-*.md` que
cite o nome antigo do repo, como a decisão acima) — não existe mais
nenhum outro lugar no código com o nome hardcoded (confirmado por
busca no repositório inteiro nesta entrega).

## Passada de legibilidade — fontes maiores e cinzas mais escuros

**Decisão:** todo `font-size` de texto pequeno/médio (≤20px) no app
subiu +2px, de forma global — 77 declarações em CSS + inline `style`
espalhadas pelas telas. Além disso, os dois tons de cinza secundário
ficaram mais escuros: `--text-dim` de `#55565b` pra `#45464b`, e
`--text-faint` de `#86878c` pra `#6b6c72` (esse último quase sem
contraste contra o fundo `#f5f5f2`/branco antes da mudança).

**Contexto:** pedido explícito do Osmar — "muito ruim de ler", "mal dá
pra ver o cinza no branco", "os textos são minúsculos". Fontes de
14px+ (títulos, números grandes) não foram tocadas, só as pequenas.

**Como foi feito:** script único fazendo a troca em todos os arquivos
`.css`/`.module.css` e nos `style={{ fontSize: N }}` inline dos
componentes React, não editado tela por tela — garante consistência e
evita esquecer algum componente.

**Pendência de fundo, não resolvida agora:** o projeto ainda não tem
tokens de escala tipográfica (tipo `--font-size-xs/sm/md`) — cada
componente guarda seu próprio valor em px. Esse ajuste manteve o
padrão atual (valores soltos), só que maiores. Migrar pra tokens de
escala é um passo de arquitetura CSS separado, não necessário agora.

**Data/origem:** 2026-08, pedido direto após revisar a entrega de
Espécies.

## Popups (InfoChip/ItemComDescricao) travam o scroll da página de trás

**Decisão:** os dois componentes de popup (`InfoChip`, `ItemComDescricao`)
agora usam um hook novo, `ui/hooks/useLockBodyScroll.ts`, que trava o
scroll da `body` enquanto o popup está aberto e devolve a posição exata
de scroll ao fechar. A trava usa `position: fixed` na `body` (não só
`overflow: hidden`) porque é o único jeito confiável de bloquear scroll
de verdade em navegador mobile — `overflow: hidden` sozinho não impede o
dedo de arrastar o conteúdo de trás em iOS/Android. O `.overlay` dos dois
componentes também ganhou `overscroll-behavior: contain` e
`touch-action: none`, e o `.card` ganhou `max-height: 80vh` +
`overflow-y: auto` (segurança pra descrição muito longa não estourar a
tela em celular baixo).

**Contexto:** o Osmar reportou dois sintomas do mesmo bug, num celular
Android real: o fundo preto do popup "deslocava" com o scroll (subia
quando rolava pra baixo, descia quando rolava pra cima), e a tela de
trás rolava mesmo com o dedo em cima do popup. Isso é o clássico bug de
"scroll vaza atrás do modal" no mobile — o `position: fixed` do overlay
continua correto, mas sem travar a `body`, o navegador deixa a página de
trás rolar por baixo (e em Android/Chrome isso pode gerar um artefato
visual de "atraso" no overlay durante o scroll por inércia).

**Data/origem:** 2026-08, reportado num Samsung Android real, mesmo dia
da entrega de Idiomas.

## Prioridade: fechar fluxo completo wizard → ficha antes de polir tela isolada

**Decisão:** a partir de agora, a prioridade é fechar um caminho
completo de construção de personagem até a ficha final navegável — cada
nova peça de dado (Classe, Talentos e Perícias de classe, etc.) deve
nascer já conectada de ponta a ponta (wizard → ficha), criando o
caminho de regressão junto, em vez de ficar só na tela isolada do
wizard. Ajustes de design fino em telas isoladas (ex: "Escolhas da
Espécie" ainda estranha — ver PENDENCIAS.md) ficam pra depois desse
fluxo estar de pé.

**Contexto:** pedido explícito do Osmar — ele quer validar cada entrega
nova olhando a ficha final resultante, não só a tela do wizard isolada.
Isso também evita retrabalho de polir uma tela isolada antes do
contexto ao redor dela (o resto do fluxo) estar decidido.

**Data/origem:** 2026-08, mesmo dia da pendência de design da tela de
Espécie.

## Ícones de Classe — tamanho de origem e onde ficam no repositório

**Decisão:** a área do ícone nos cards de opção (`.opt-card-img`, usada
em Classe/Origem/Espécie) é **56×56px CSS**. A arte-mestra de cada ícone
é exportada em **512×512px PNG com fundo transparente**, com ~10% de
margem de respiro nas bordas do quadrado (o card corta em
`border-radius`, então arte encostada na borda pode ser cortada). Isso
cobre qualquer densidade de tela (2x/3x) e qualquer tamanho maior que a
gente queira usar no futuro (tablet/desktop) sem precisar redesenhar.

Antes de entrar no repositório, cada PNG de 512px é redimensionado pra
**256×256px** e re-otimizado (ainda bem acima do necessário pro box
atual de 56px, mas ~8x mais leve em disco que o master de 512px) — o
app carrega isso pela rede do celular do Osmar, então tamanho de
arquivo importa mesmo sendo uso pessoal. Arquivos ficam em
`src/assets/icones-classes/{id-da-classe}.png` (nome = id da classe:
`guerreiro.png`, `mago.png` etc). `ClasseStep.tsx` usa
`import.meta.glob` pra montar automaticamente o mapa id→arquivo — não
precisa listar imports um por um nem tocar em código quando uma nova
classe for importada, só adicionar o PNG com o nome certo.

**Contexto:** os 12 ícones de classe (todas, mesmo as 11 ainda "em
breve") vieram prontos do Osmar em 2026-08, então já foram conectados
em todas as classes de uma vez — inclusive nos cards desabilitados —
pra lista de Classe já ficar com a cara final antes mesmo das outras
11 classes serem importadas da planilha.

**Data/origem:** 2026-08, pedido direto do Osmar (upload de
`iconesclasses512.zip`).

## Ícones de Classe — evoluiu pra banner retangular (estandarte), não mais só o losango quadrado

**Decisão:** o emblema em losango quadrado (decisão acima) foi
substituído, classe por classe, por um banner/estandarte retangular
(proporção ~1:2, retrato) conforme o Osmar for entregando a arte de
cada classe. `ClasseStep.tsx` decide sozinho qual formato usar por
classe: se existe um arquivo `{id}-banner.png` em
`src/assets/icones-classes/`, usa ele sem a caixa quadrada, só a
imagem alinhada ao centro vertical do card (classe CSS
`.opt-card-img-banner`, altura fixa 96px, largura livre pela proporção
original); senão cai de volta pro emblema quadrado antigo
(`.opt-card-img`, 56×56px) ou, na ausência de qualquer arquivo, no
placeholder 🖼. Isso permite migrar classe por classe sem quebrar as
que ainda não têm banner.

Master de origem: 887×1774px PNG com alpha, redimensionado pra
256×512px antes de entrar no repositório (mesma lógica de
compressão do emblema quadrado). Guerreiro, Bárbaro, Bardo e Bruxo já
têm banner — o emblema quadrado antigo desses 4 foi **apagado** do
repositório (ficou sem uso, só pesava à toa). As outras 8 classes
continuam com o emblema quadrado até o Osmar mandar o banner de cada
uma.

**Contexto:** o Osmar pediu pra testar o formato banner isolado no
Bárbaro primeiro ("quero ver como fica"), aprovou o resultado, e
decidiu expandir pra todas as classes conforme for reunindo as artes
— não é uma entrega de uma vez só, é incremental.

**Data/origem:** 2026-08, pedido direto do Osmar (upload de
`emblemasclasses512.zip`, depois `barbaro-emblema` avulso pra teste, e
banners de Guerreiro/Bruxo/Bardo em seguida).

**Atualização:** concluído — as 12 classes têm banner agora (Clérigo/
Druida/Feiticeiro e depois Guardião/Ladino/Mago/Monge/Paladino
completaram a lista). Nenhum emblema quadrado sobrou no repositório;
o fallback pro formato quadrado/placeholder em `IconeClasse`
(`ClasseStep.tsx`) continua no código só como rede de segurança caso
algum arquivo de banner seja removido por engano — não é mais
usado na prática.

## `core/` nasce com `personagem.ts` + `calculoPersonagem.ts` + `armazenamentoPersonagens.ts`

**Decisão:** o `WizardSelection` (forma de dado das escolhas do wizard)
e as funções puras de atributo (`modificador`, `modFmt`,
`valorFinalAtributo`) saíram de `ui/wizard/types.ts` e foram pra
`core/personagem.ts` — é dado de personagem, não componente de tela, e
o motor de cálculo precisava importar isso de algum lugar dentro de
`core/`, não de dentro de `ui/`. `core/calculoPersonagem.ts` reúne as
fórmulas (PV máximo nível 1, CA — já resolve pela armadura escolhida no
equipamento inicial, com o parser de texto `"N + modificador de Des
(máx. N)"` da planilha de Armaduras —, Percepção Passiva, Iniciativa,
ouro inicial). `core/armazenamentoPersonagens.ts` é a interface trocável
de armazenamento (`ArmazenamentoPersonagens`) com implementação
`localStorage` por trás — nenhum componente acessa `localStorage`
direto, só essa camada.

**Contexto:** Entrega A1 do plano de 6 entregas pra fechar o fluxo
wizard → Ficha (ver PENDENCIAS.md). Testado de ponta a ponta: um
Guerreiro completo criado no wizard salva de verdade e aparece na Lista
de Personagens com PV/CA/Percepção Passiva calculados, não mais
fixture.

**Pendência conhecida:** a exceção de CA de Bárbaro/Monge (ver decisão
"Cálculo de CA" acima) ainda não tem entrada no motor — nenhuma das
duas classes está importada ainda. A função foi estruturada pra receber
esse lookup por `classeId` quando chegar a vez, sem espalhar `if
classe === "Bárbaro"` pelo código, como já estava recomendado.

## Todo número calculado tem um "ⓘ" explicando a conta

**Decisão:** qualquer valor gerado pelo motor de cálculo (PV máximo, CA,
Percepção Passiva, Iniciativa, Ouro inicial, cada Perícia) mostra um
"ⓘ" tocável logo ao lado — abre um popup com a conta em formato de
**tabela** (efeito à esquerda, valor à direita, alinhado em colunas
invisíveis; a última linha é o total, separada por uma linha divisória
e destacada). Aplicado tanto na tela "7. Resumo" do wizard quanto na
aba Perfil da Ficha — os mesmos números aparecem nos dois lugares.
Texto tipo "no nível 1 nunca rola nem tira média" foi tirado — é
contexto de regra, não parte da conta em si, e poluía o popup.

**Componente novo:** `ui/components/InfoValor.tsx` — mesmo padrão
visual de popup de `InfoChip`/`ItemComDescricao` (overlay + card
central), mas o gatilho é só o ícone "ⓘ" solto, não um chip nem texto
sublinhado. `core/calculoPersonagem.ts` ganhou o tipo
`ExplicacaoCalculo` (`{ linhas: {label, valor}[], total: {label,
valor} }`) e uma função `explicar*` pra cada `calcular*` que devolve
isso já estruturado — nunca uma string solta, exatamente pra caber na
tabela sem parsing.

**Bug corrigido (clique vazava pra linha de baixo):** o popup do
`InfoValor` é renderizado *dentro* da linha clicável que mostra o
número (ex: linha de Perícia que rola dado ao toque). Mesmo com
`position: fixed` cobrindo a tela toda visualmente, no DOM o overlay
continua sendo filho dessa linha — então, sem `stopPropagation`, tocar
pra fechar o popup borbulhava pro `onClick` da linha por baixo e
disparava uma rolagem de dado sem querer. Corrigido com
`e.stopPropagation()` em todo clique dentro do overlay (fechar tocando
fora do card, e no botão "fechar"), não só no ícone que abre. Vale
como lição geral: **qualquer popup `position: fixed` renderizado
dentro de um elemento clicável precisa desse cuidado**, não só o
`InfoValor` — `InfoChip`/`ItemComDescricao` têm o mesmo risco latente
se algum dia forem usados dentro de uma linha com `onClick` (hoje não
são, por isso não deu bug neles ainda).

**Contexto:** pedido direto do Osmar — "olhando só o número, eu não sei
dizer se está certo ou não", mais 2 bugs reportados no formato de texto
livre (nível 1 sem sentido, clique vazando pra rolar dado sem querer
na Ficha). Motivo real do pedido original: ele não programa, não pode
abrir o código pra conferir a fórmula, e cada número novo que aparece
precisa de alguma forma de verificação **na tela**, não só confiar que
"deve estar certo" (regra 1 do `CLAUDE.md`).

**Data/origem:** 2026-08, pedido direto do Osmar (texto livre + versão
com tabela).

## Bug estrutural corrigido: `#root` usava `min-height`, deveria ser `height`

**Decisão:** `#root` (em `index.css`) trocou `min-height: 100vh/100dvh`
por `height: 100vh/100dvh`. Antes disso, a página inteira crescia junto
com o conteúdo e quem rolava era o documento/janela — os containers
internos com `overflow-y: auto` (`.body` do `WizardShell`/`FichaShell`/
`LevelUpShell`, todos já desenhados assumindo que rolariam por conta
própria) nunca chegavam a ficar menores que o próprio conteúdo, então
o `overflow-y: auto` deles nunca entrava em ação de verdade — sem
efeito prático, mas também sem quebrar nada, porque não havia nada que
dependesse disso rolar "por dentro" em vez de rolar a página toda.

**Por que isso importa agora:** o cabeçalho flutuante de ouro/peso da
Loja (pedido do Osmar) usa `position: sticky`, que só funciona de
verdade quando o elemento tem um container-pai que realmente rola
(`overflow-y: auto` com altura finita) — com a página inteira rolando
em vez do `.body`, o sticky não tinha "onde" grudar e sumia da tela ao
rolar. A correção faz `.body` (e equivalentes) virarem o scroll de
verdade, do jeito que a estrutura já tinha sido desenhada pra
funcionar.

**Verificado que não quebra nada:** telas sem scroll interno próprio
(Home, Lista de Personagens) continuam rolando pela página normalmente
— `#root` não ganhou `overflow: hidden`, só um `height` fixo, então
conteúdo que ultrapassar a tela nessas telas ainda tem como aparecer
via rolagem do documento, igual antes. Testado nas 5 telas principais
(Home, Lista, Loja com scroll, Ficha Perfil/Mochila/Combat) sem
regressão visual.

**Data/origem:** 2026-08, achado ao implementar o cabeçalho flutuante
da Loja (pedido do Osmar).

## Passagem de design geral: apertando o espaço em branco (escala de espaçamento + seta duplicada)

**Decisão:** o Osmar achou que o app estava com margem/espaçamento
grande demais no geral (screenshot da Loja como exemplo), fazendo o
fluxo "parecer mil vezes maior" do que precisava. Dois ajustes, os
dois valendo pra tudo (não só uma tela):
- **Escala de espaçamento (`--space-4/5/6` no `index.css`)** apertada:
  16→12px / 20→16px / 24→20px. `--space-1/2/3` (4/8/12px) ficaram como
  estavam — já eram os valores mais finos, o excesso estava nos
  maiores (padding de tela inteira, cabeçalho, cards). Como a maioria
  dos componentes já usa os tokens em vez de pixel fixo, essa mudança
  sozinha aperta a tela inteira (Home, Lista, Loja, Ficha etc.) sem
  precisar editar arquivo por arquivo.
- **Seta de voltar duplicada removida** — `WizardShell` e
  `LevelUpShell` tinham `←` no cabeçalho **e** o pill "← Voltar" no
  rodapé fazendo a mesma coisa. Removida a seta do cabeçalho nos dois,
  mantido só o pill (mesmo padrão do "Avançar →" ao lado). `FichaShell`
  e `CharacterList` não tinham essa duplicação (não têm pill de Voltar
  no rodapé) — não mexidos.
- **Cabeçalhos das 3 "shells" (Wizard/Ficha/LevelUp)** ganharam padding
  mais apertado além do que a escala de tokens já dava sozinha
  (`var(--space-3) var(--space-4) var(--space-2)` no lugar de
  `var(--space-4) var(--space-5) var(--space-3)`), e o corpo rolável
  (`.body`/`.tabContent`) foi de `var(--space-4) var(--space-5)` pra
  `var(--space-3) var(--space-4)`.

**Detalhe técnico que quase quebrou:** o cabeçalho flutuante da Loja
(`.ouroBox`, `position: sticky`) usa um truque de margem negativa pra
cobrir de ponta a ponta por cima do padding do `.body` — o valor da
margem negativa precisa bater exatamente com o padding real do
`.body`. Como o padding do `.body` mudou nesta entrega, a margem
negativa do `.ouroBox` teve que ser atualizada junto (senão sobrava
uma faixa sem cobrir nas bordas). Deixei um comentário no CSS
avisando que os dois precisam mudar juntos se algum dos dois for
mexido de novo.

**Não mexido:** `--touch-target-min` (48px) ficou intocado — a
economia de espaço é só em margem/padding visual, nenhuma área de
toque encolheu.

**Contexto:** pedido direto do Osmar depois de ver a Loja no celular;
confirmado "faz pra tudo" quando perguntei se era só o wizard ou o
app inteiro.

**Data/origem:** 2026-08, pedido direto do Osmar.

## Ícones novos (emblema redondo) substituem os estandartes na tela de Classe

**Decisão:** o Osmar subiu 2 novos ícones em formato de emblema redondo
(dourado/bronze, moldura ornamentada) — Guerreiro (espada) e Bardo
(alaúde) — pra substituir o estandarte alto/estreito antigo na tela
"1. Classe" do wizard. Mesmo arquivo (`{id}-banner.png`), mas exibido
na caixa quadrada padrão (`.opt-card-img-emblema`, ~56-110px) em vez
da caixa alta (`.opt-card-img-banner`) — o formato redondo cabe melhor
nela.

**Classes sem emblema próprio ainda usam uma cópia do emblema do
Guerreiro como placeholder** (as 10 restantes: Bárbaro, Bruxo,
Clérigo, Druida, Feiticeiro, Guardião, Ladino, Mago, Monge, Paladino)
— aparecem cinza/desativadas porque já ficam dentro do card "em
breve" (`btn-disabled`, opacidade 0.35), não precisou de tratamento
visual extra. Trocar pelo emblema real de cada classe assim que
existir — é só substituir o arquivo, o código não muda.

**Bardo corrigido pra `disponivel: false` (achado ao mexer nisso).**
A Etapa 1 (dados) do Bardo tinha deixado `disponivel: true` por engano
— e `ClasseStep.tsx` **nunca filtrava por esse campo** (só Origem e
Espécie filtravam; funcionava por acaso enquanto só existia 1 classe
no array). Corrigidos os dois: Bardo virou `disponivel: false` (wizard
ainda não sabe criar um Bardo de ponta a ponta — falta a Etapa 2), e
`ClasseStep.tsx` agora filtra `classes` por `disponivel` como as
outras telas já faziam, mostrando classes com dado real mas ainda não
prontas ("em breve" com nome/emblema reais) separadas da lista
hardcoded `CLASSES_EM_BREVE` (que agora só cobre as 10 sem dado
nenhum ainda).

**Testado:** Playwright 390×844 — Guerreiro aparece selecionável com
o emblema de espada; Bardo aparece "em breve" com o emblema de
alaúde (cinza); as outras 10 aparecem "em breve" com o emblema de
espada reaproveitado (cinza).

**Data/origem:** 2026-08.

## Card padronizado pra magia/truque (MagiaComDescricao) — mesmo formato sempre

Também portado do "outro modelo", a pedido do Osmar (junto com a
marcação de duplicidade e os ícones de magia da entrega anterior). Em
vez do popup genérico (`ItemComDescricao`, só nome + texto corrido),
`MagiaComDescricao` fixa o formato pra qualquer magia/truque: Nome,
Tipo (Truque ou "Xº Círculo"), toggle Desc. curta/longa, Tempo de
Conjuração + Alcance, Componentes, Duração, e a descrição em si.

Regras confirmadas com o Osmar:
- **Campo em branco fica escondido** — `null`/vazio não aparece como
  linha vazia (ex.: se não tiver Componentes, a linha some).
- **O toggle Desc. curta/Desc. longa só aparece se as duas existirem
  E forem diferentes** — se forem o mesmo texto (ou uma faltando),
  mostra só a descrição direto, sem o par de botões.

Escopo desta entrega: só Magias (única classe conjuradora pronta é
Bardo, único lugar que usa isso hoje é Truques/Magias Preparadas da
criação). Replicar esse padrão de card fixo pra Itens
Comuns/Mágicos/Armas/Armaduras é pendência registrada em
PENDENCIAS.md — cada tipo teria campos próprios (Arma: Dano/
Propriedades/Maestria, por exemplo), não é o mesmo card reaproveitado
1:1.

**Data/origem:** 2026-08.

## Lista de Personagens usa o emblema da Classe no lugar do 👤 genérico

A pedido do Osmar: enquanto o upload de imagem de avatar não existe de
verdade (só um placeholder na tela de Resumo do wizard, agora marcado
`[PH]`), a Lista de Personagens preenche o espaço de avatar com o
emblema redondo da Classe do personagem — a mesma arte já usada na
tela de escolher Classe do wizard.

`IconeClasse` (componente que já existia dentro de `ClasseStep.tsx`)
virou compartilhado (`ui/components/IconeClasse.tsx`) pra poder ser
reaproveitado aqui sem duplicar a lógica de `import.meta.glob` dos
arquivos `-banner.png`. `CharacterList.tsx` busca o `id` da classe do
personagem em `classes.ts` pelo nome salvo e passa pro componente; sem
classe reconhecida (não deveria acontecer, mas por segurança), cai de
volta no 👤 antigo.

**Espaço do avatar aumentado** (48px → 64px) a pedido do Osmar, já que
o emblema é uma arte bonita e merece aparecer bem — `object-fit: cover`
preenche a caixa quadrada sem distorcer.

**Data/origem:** 2026-08.

## Menu inferior vira 5 abas: Atributos / Perfil (nova) / Mochila / Magias / Combate

**Decisão:** a antiga aba "Perfil" (atributos, PV/CA/Iniciativa,
perícias, descanso, maestria em arma) foi renomeada pra **"Atributos"**
(`AtributosTab.tsx`, era `PerfilTab.tsx` — arquivo renomeado, conteúdo
idêntico). O nome "Perfil" foi liberado pra uma aba nova de verdade:
lista as habilidades REAIS do personagem, na ordem Classe → Origem →
Espécie, cada uma como card não-interativo (mesmo padrão `.opt-card`
já usado no step "Características desbloqueadas" do Level Up — zero
componente novo). "Combat" no rótulo virou "Combate" (só o texto, id
interno continua `combat`).

**Classe:** `core/levelUp.ts` ganhou `caracteristicasAcumuladas(classe,
nivelAtual)` — roda `caracteristicasDoNivel` do nível 1 até o atual e
deduplica por nome (características repetidas em vários níveis, tipo
Indomável/Surto de Ação, só contam +1 uso — não viram card duplicado).
Diferente de `caracteristicasDoNivel` (só 1 nível, usada no Level Up
pra mostrar "o que ganhei AGORA"), essa é "tudo que já tenho".

**Origem:** busca o `Talento de Origem` real (`talentosOrigem.ts` via
`origem.talentoOrigemId`) — nome + benefícios reais, com a variante
quando existir (ex. "Iniciado em Magia (Clérigo)").

**Espécie:** os `traços` reais da espécie (`especies.ts`), já vêm
prontos com nome+descrição, sem precisar de lookup.

**Testado:** Playwright 390×844 — barra de 5 abas cabe sem cortar
(largura exata do viewport, sem overflow horizontal), rótulos legíveis.
Aba Perfil de um Anão Bardo mostrou "Classe — Bardo" (Inspiração de
Bardo + Conjuração, descrições completas), "Origem — Fazendeiro"
(Vigoroso: PV máximo +2x nível...), "Espécie — Anão" (Visão no Escuro,
Resistência a Toxinas, Tenacidade Anã, Conhecimento de Pedras) — os 4
traços reais do Anão. Aba Combate confirmada funcionando sem regressão
depois da renomeação do rótulo.

**Data/origem:** 2026-08.

## Ícones de classe/subclasse viram WebP (compressão, ~82% menores)

**Achado do Osmar:** os ícones 512×512 (Bardo + 4 Colégios novos)
deixaram o bundle bem mais pesado — perguntou se dava pra comprimir
sem precisar reimportar as artes originais.

**Decisão:** convertidos de PNG pra WebP (`Pillow`, qualidade 85,
`method=6`) — mesma resolução 512×512, ~82% menores (ex.: Bardo
435KB → 81KB; os 4 Colégios ficaram entre 82-89KB cada, contra
452-474KB em PNG). PNG puro com `optimize=True` (lossless) quase não
ajudou (~3-4%) — a arte gerada por IA já vinha perto do limite de
compressão sem perda; WebP com perda leve (qualidade 85) foi a troca
que realmente valeu, sem degradação visível no tamanho de emblema
exibido (~64px na Lista, ~48-72px nos cards de seleção).

**`IconeClasse.tsx`** — único lugar que referenciava esses arquivos —
trocou o glob de `*.png` pra `*.webp`; resto do componente (lookup por
`{id}-banner.webp` / `{id}.webp`) idêntico, zero mudança de API.

**Achado no processo:** Vite deduplica arquivos de conteúdo
idêntico no build — as 10 classes "em breve" (cópias do emblema do
Guerreiro) e o Guerreiro real acabam virando FISICAMENTE 1 arquivo só
no `dist/` (nome do hash reflete só uma delas), então o ganho real de
espaço no app publicado já era menor do que a soma ingênua dos 16
arquivos sugeria — mas a compressão ainda ajuda bastante nos arquivos
que são conteúdo único (Bardo + 4 Colégios).

**Testado:** Playwright 390×844 — comparação visual direta do arquivo
WebP isolado (sem UI por perto) confirma nitidez igual ao original.
Um "ícone quebrado" aparente na tela de seleção de Classe foi
investigado a fundo (`elementFromPoint`) e identificado como o botão
flutuante 🔀 ("Sortear tudo desta etapa") renderizado sem fonte de
emoji colorida neste ambiente de teste headless — nada a ver com a
troca de formato; confirmado pelo próprio Osmar.

**Data/origem:** 2026-08.

## Ticks/pips padronizados: sempre esvazia de trás pra frente ("tanque de combustível")

**Regra única pedida pelo Osmar, pra todo lugar que mostra "N usos,
alguns já gastos"** (Espaços de Magia, Recuperar Fôlego, Inspiração de
Bardo, Espaço de Magia por círculo no fluxo de upcast): quadradinho
azul = disponível; quando o jogador usa 1, o ÚLTIMO quadradinho vira
cinza (não o primeiro) — array de N sempre preenchido da esquerda,
esvaziando pela direita. Achado ao mexer: o app já tinha as DUAS
convenções coexistindo — `BonusPanelContent.tsx` (Fôlego/Inspiração)
já usava `i >= restantes` (esvazia pela direita, certo), mas
`MagiasTab.tsx` (Espaços de Magia) usava `i < gasto` (esvaziava pela
esquerda, errado/inconsistente).

**Componente novo único:** `ui/components/TickPips.tsx` —
`{ total, usados, tamanho }`, `usados` sempre conta de trás pra frente
(`i >= total - usados`). Substituiu as 2 implementações duplicadas
(`.slotPip`/`.slotPipGasto` de `MagiasTab.module.css` e
`.slotPipLg`/`.slotPipLgGasto` de `PanelRows.module.css`, ambas
removidas — CSS morto). Também usado na Tela 3 do fluxo de upcast
(`EscolherCirculoShell.tsx`), que antes mostrava só o texto "X/Y
espaços disponíveis" — agora mostra os ticks, mais fácil de bater o
olho.

## Ajuste visual — chips mais compactos, "Ferramenta" renomeado, fontes 1px menores em todo o app

**Contexto:** feedback direto do Osmar depois de ver o card de Origem
novo: "o design tá bem ruim" — 3 pontos: (1) o rótulo "Ferramenta"
devia ser "Proficiência na Ferramenta", e a linha de baixo (Origens
com escolha de ferramenta, tipo Artesão) quebrava estranho; (2) os
chips (`InfoChip`) estavam com padding grande demais; (3) pediu pra
reduzir 1px em toda fonte do app, não só dessa tela.

**Decisão:**
1. Rótulo "Ferramenta" → "Proficiência na Ferramenta" em
   `OrigemStep.tsx`. O caso de Origem com escolha de ferramenta (ex:
   Artesão → "escolha 1 de Ferramentas de Artesão") trocou de
   `<span className="label">` (texto solto, sem contenção visual,
   causava a quebra estranha) pra `<span className="tag">` (badge
   pequeno com borda, mesmo componente já usado em "(em breve)" —
   compacto, não quebra).
2. `InfoChip.module.css`: `padding` de `var(--space-2) var(--space-3)`
   (8px/12px) pra `var(--space-1) var(--space-2)` (4px/8px);
   `min-height` de 36px pra 26px — chip visualmente bem mais discreto,
   ainda tocável (o toque é isolado dentro de um card com scroll, não
   uma grade densa de botões adjacentes).
3. **Todo** `font-size` (CSS e `fontSize` inline em TSX) do projeto
   reduzido em 1px, com piso em 10px (nada fica menor que 10px, pra
   não virar ilegível no celular) — script único (`sed`-like em
   Python, não manual) rodou nos 165 pontos encontrados em 40
   arquivos, `.css` e `.tsx`. Números grandes de destaque (dado
   animado, título splash) também caíram 1px, igual pedido — só o piso
   de 10px protege texto já bem pequeno.

**Testado:** `npm run build` limpo depois da mudança; Playwright
390×844 confirmando visualmente o card de Origem (chips menores,
rótulo novo, badge sem quebra).

**Data/origem:** 2026-08.

## Auditoria externa (GPT) — o que foi adotado e o que não foi

**Contexto:** o Osmar trouxe uma auditoria técnica + "SDDs" feita por
outra IA (documento .docx), propondo uma bateria grande de mudanças
estruturais: Vitest com pirâmide de testes completa, contrato
`Character` separado de `WizardSelection`, `schemaVersion` +
migradores versionados na persistência, quebra de
`calculoPersonagem.ts`/`FichaShell.tsx` em módulos/hooks por domínio,
desacoplar o Roll Engine do `RollContext`, CI com gate de
lint+test+build antes do deploy, e um validador automático dos
catálogos de dado.

**Avaliação:** a auditoria acertou 2 achados reais e específicos
deste projeto — (1) zero teste automatizado hoje (`package.json` não
declara `test`, confirmado), e (2) regra de nível/característica de
classe reconhecida por comparação de **nome de exibição** em vez de
ID estável (`levelUp.ts` compara strings tipo `'Mestre Tático'`,
`'Aumento no Valor de Atributo'` — frágil porque o Osmar edita a
planilha por fora, um nome pode mudar de revisão editorial sem que a
regra devesse quebrar). O resto do pacote (contrato `Character`
formal, `schemaVersion`+migradores, quebra de arquivo em hooks por
domínio, CI bloqueando deploy) é conselho correto pra um SaaS com
time e múltiplos usuários, mas pesado demais pro contexto real deste
projeto (uso pessoal, Osmar + grupo de mesa, ver CLAUDE.md seção 9) —
pausar pra fazer tudo isso antes de continuar contraria o próprio
ritmo de entrega pequena e validada na hora que já funciona aqui. O
documento também tinha pelo menos 1 número errado apresentado como
"evidência verificada" (`index.css` "possui 1542 linhas" — na
verdade tinha 368 na hora da checagem, e o projeto já usa CSS Modules
extensivamente, contrariando a própria premissa do achado) — motivo
a mais pra não adotar o pacote inteiro sem checar caso a caso.

**Decisão:** adotar só os 2 pontos verificados e baratos, formalizados
em CLAUDE.md seção 13 (regra permanente daqui pra frente, não só essa
rodada):
1. Toda função nova de cálculo em `core/` vem com teste automatizado
   (Vitest) no mesmo commit.
2. Toda característica/regra reconhecida por código (não só exibida)
   usa ID estável, nunca nome de exibição.

`schemaVersion`+migradores versionados NÃO foi adotado agora — fica
pra quando (se) aparecer um bug real de migração; hoje os fallbacks
`??` opcionais em `PersonagemSalvo` dão conta na prática. Modularização
de `calculoPersonagem.ts`/`FichaShell.tsx`, CI gate e validador de
catálogo também ficam de fora por ora — sem urgência real hoje.

**Data/origem:** 2026-08.

## Entrega 3 — IDs estáveis em `levelUp.ts` (1º caso real de migração)

**O que é:** primeira aplicação prática da regra da seção 13 num
arquivo já existente. Criado `data/rulesets/dnd2024/idsCaracteristicasClasse.ts`
— mapa hand-maintained `ID_CARACTERISTICA_CLASSE` (ex: `asi` →
`'Aumento no Valor de Atributo'`, `estiloDeLuta` → `'Estilo de
Luta'`), no mesmo padrão do `efeitoMecanico` de `talentos.ts`: não vem
da planilha, tem aviso no topo do arquivo pra reaplicar manualmente se
algo mudar. `levelUp.ts` (`niveisComASI`, `niveisComDadivaEpica`,
`temEstiloDeLutaTrocavel`, `NOMES_ESPECIALISTA`,
`CONTAGEM_ATAQUE_EXTRA`) agora compara contra esse ID em vez do nome
de exibição direto. Assinatura pública das funções não mudou — nenhum
outro arquivo precisou ser tocado.

**Escopo reduzido de propósito:** o Osmar escolheu migrar só a parte
interna de `levelUp.ts` nesta entrega, não as ~8 chamadas externas que
ainda passam nome (`caracteristicaDesbloqueada`/
`contarRepeticoesCaracteristica` em `FichaShell.tsx`,
`calculoPersonagem.ts`, `inspiracaoBardo.ts`) — fica pra quando essas
características específicas forem tocadas de novo por outro motivo,
não uma entrega isolada. Ver `PENDENCIAS.md` "Migração de
comparação-por-nome pra ID estável" pro detalhe do que falta.

Teste automatizado novo: `src/core/levelUp.test.ts` (7 casos,
`niveisComASI`/`niveisComDadivaEpica`/`temEstiloDeLutaTrocavel`/
`numeroDeAtaques`, incluindo caso de borda de classe sem progressão e
nível 0), per CLAUDE.md seção 13.

**Data/origem:** 2026-08.

## Modal de rolagem — Vantagem/Desvantagem escolhida DEPOIS do resultado

**O que é:** pedido do Osmar, spec detalhada por ele — depois de uma
rolagem de d20 normal (sem Vantagem/Desvantagem pré-definida),
aparecem 2 botões "Desvantagem" (vermelho, esquerda) e "Vantagem"
(verde, direita) embaixo do resultado. Ao tocar em um, um 2º d20
rola do lado do primeiro (mesma animação de girar), e o total/crítico
são recalculados a partir do dado que a regra manda usar (maior pra
Vantagem, menor pra Desvantagem) — o dado descartado fica com opacidade
reduzida, não escondido (regra pede rolar os 2, não esconder o que não
foi usado).

**Por que só rolagem de d20 (não dano):** Vantagem/Desvantagem é
mecânica exclusiva de teste/salvaguarda/ataque (1 d20) nas regras de
D&D — nunca se aplica a dano nem a "dado extra pra somar num d20"
(ex: Perícia Inigualável, Mente Tática). Por sorte o código já
separava isso: `rolarD20` (sempre 1d20) vs `rolarDados` (quantidade/
lados variáveis) — só precisei ligar os botões novos em `rolarD20`;
`rolarDados` nunca ativa `podeEscolherVantagem` (garantia estrutural,
não um `if` a mais pra lembrar de manter).

**Implementação:**
- `RollContext.tsx`: `RollState` ganhou `tipo` ('d20'/'dados'),
  `dado2` (2º d20, só quando Vantagem/Desvantagem está em jogo),
  `vantagem` (qual regra está valendo), `mod` (guardado só em rolagens
  'd20' pra poder recalcular o total depois) e `podeEscolherVantagem`
  (true só numa rolagem 'd20' concluída, sem Vantagem/Desvantagem
  ainda decidida). Removido o campo antigo `detalheVantagem` (texto)
  — virou visual (2 dados lado a lado + opacidade no descartado).
- Nova função `escolherVantagemPosRolagem(tipo)`: rola o 2º d20 e
  recalcula total/crítico a partir do dado usado pela regra.
- O fluxo de Vantagem/Desvantagem PRÉ-definida na chamada (ex:
  Contra-Encantamento em `ReacaoPanelContent.tsx`, que já nasce com
  `vantagem: 'vantagem'`) continua funcionando igual, só que agora
  também mostra os 2 dados visualmente (antes só tinha o texto) — sem
  os botões, porque a decisão já foi tomada na hora da chamada.
- `RollOverlay.tsx`/`.module.css`: `.card` ganhou `min-width` maior
  (260px) pra já caber os 2 dados sem "pular" de tamanho quando o 2º
  aparece — com 1 dado só, ele fica centralizado dentro dessa largura
  (`.diceRow` com `justify-content: center`); com 2, o 1º desloca pra
  esquerda naturalmente pelo layout flex.

Testado via Playwright em 390px: teste de atributo sem Vantagem/
Desvantagem mostra os 2 botões; clicar em Vantagem faz o 2º dado
girar e resolver (ex: 20 e 1 saíram numa rolagem de Desvantagem — o
1 ficou em destaque com borda de Falha Crítica, o 20 ficou
esmaecido); total e crítico bateram com o dado usado, não com o
primeiro rolado.

**Data/origem:** 2026-09.


## Pill padrão pra toda menção a magia/truque na tela (2026-09)

**Achado do Osmar:** cada tela mostrava magia/truque de um jeito
diferente — algumas com texto sublinhado sem ícone, outras com texto
solto + ícone ⓘ separado do lado, sem consistência entre wizard, Level
Up, Ficha e Combat. "Tá virando uma loucura a inconsistência."

**Decisão:** existe agora **1 formatação só** pra qualquer nome de
magia/truque clicável em qualquer tela — pill com fundo lilás claro
(`var(--accent-dim)`, mesmo tom já usado em cards selecionados) com o
ⓘ **dentro** da própria pill, nunca separado. Implementado em
`MagiaComDescricao.tsx`/`.module.css` (`variante` removida — só existe
1 variante agora, então nem faz mais sentido a prop existir; todos os
~19 pontos de chamada limpos). Como todo lugar do app já usava esse
componente compartilhado, a mudança propagou sozinha pra wizard/Level
Up/Ficha/Combat sem precisar tocar em cada tela individualmente —
prova de que reaproveitar o componente certo (regra 6.1 do CLAUDE.md)
compensa exatamente nessa hora.

**Regra permanente:** toda tela nova que mostrar nome de magia/truque
usa `<MagiaComDescricao magia={m} />` — nunca inventar um jeito
próprio de mostrar/formatar magia numa tela nova.

**Data/origem:** 2026-09.

## "Usar de graça" só existe quando algo é rastreado por uso

**Achado do Osmar:** o botão "Usar de graça" (Invocações Místicas Fase
2 — magia concedida sem gastar Espaço de Pacto) não fazia sentido pra
invocações `ilimitado` (ex: Salto Sobrenatural) — clicar não muda
nada, não há contador, não há efeito rastreável (diferente de uma cura
real, onde cada clique teria efeito). Botão clicável sem efeito nenhum
confunde o jogador (parece que faz algo).

**Decisão:** quando não há NADA contado por uso (`recarga: 'ilimitado'`),
não existe botão — vira uma tag muda `<span className="tag">sem
custo</span>`, mesma formatação já usada pra "já possui"
(`TalentoOrigemEscolhasStep.tsx`) — reaproveito direto da classe global
`.tag`, não um componente novo. Só quando existe estado real por trás
(`recarga: 'descansoLongo'`, rastreado em `magiasGratisGastas`) que o
botão "Usar de graça"/"Usada" continua existindo. Regra generalizável:
**todo botão de ação precisa ter algo rastreável por trás — senão vira
tag informativa, não botão.**

**Data/origem:** 2026-09.

## Barra de PV: PV Temporário estende a escala + animação suave (2026-09)

**Barra de PV Temporário:** pedido do Osmar — quando o personagem tem
PV Temporário, a barra de Pontos de Vida (aba Combat) estende a escala
além do máximo: verde até o PV máximo, azul do máximo até
máximo+temporário. Sem PV Temporário, a barra continua idêntica a
antes (escala = só o máximo, sem trecho azul). `LinearProgressBar.tsx`
ganhou prop opcional `temporario` — reaproveitado pra CombatTab sem
quebrar nenhum outro uso do componente.

**Animação (~0,5s) ao mudar de valor — achado técnico importante:**
CSS `transition` em atributos de geometria SVG (`x1`/`x2` de `<line>`,
até `x`/`width` de `<rect>`) **não anima de forma confiável** — testado
com Playwright amostrando o atributo ao longo do tempo, o valor pula
seco pro final em vez de interpolar. Resolvido animando em **JS puro**
(`requestAnimationFrame`, ease-out quadrático, hook `useValorAnimado`
dentro do próprio componente) — funciona sempre, não depende de
suporte do navegador a transição de geometria SVG. Confirmado via
Playwright: amostrando a largura do retângulo a cada 80ms durante a
transição, os valores interpolam suavemente (69→63→57→52→48→46→45),
não pulam.

**Lição pra próxima barra/indicador animado do app:** não usar CSS
`transition` em atributo de geometria SVG — usar o padrão
`useValorAnimado` (ou extrair pra hook compartilhado se aparecer um
2º caso).

**Data/origem:** 2026-09.

## Cura acima do máximo vira PV Temporário — HOUSE RULE, não regra oficial (2026-09)

**Pedido do Osmar:** o PV enche até o máximo primeiro — se um clique de
cura cruza o máximo, o excedente DESSE clique é descartado (não vira
Temporário), igual à regra real. Só depois de já estar no máximo é que
um novo clique de cura vira PV Temporário inteiro (soma com o que já
tinha, não "pega o maior"). Ex: 90/100 + cura de 15 = 100/100 (os 5
que passariam do máximo são descartados nesse clique); clicar de novo
já em 100/100 com +5 aí sim vira +5 PV Temporário.

**Importante — isso é house rule, NÃO regra oficial:** pela regra real
(Glossário do Livro do Jogador), cura acima do máximo é sempre
perdida, mesmo já no máximo — nenhuma menção a virar PV Temporário.
Por isso essa decisão fica aqui (design), não em `DND-Regras.md` (só
fatos confirmados no livro). Não confundir com `ganharPvTemporario()`
(habilidade que concede PV Temporário direto, tipo Vigor Ínfero) —
essa continua "pega o maior valor", regra real, intocada; a soma só
vale pra cura normal já no máximo (`aplicarAlteracaoPv`).

**Data/origem:** 2026-09.

## Sentidos Especiais viram dado estruturado (não mais só texto) (2026-09)

**Antes:** Visão no Escuro/às Cegas/Verdadeira/Sismiconsciência só
existiam como texto solto dentro da descrição de traço de espécie ou
de Invocação Mística (ex: "Você tem Visão no Escuro com um alcance de
36 metros.") — sem jeito de somar/comparar entre fontes diferentes.

**Agora:** campo estruturado `sentidoConcedido: { tipo, alcanceMetros }
| null` em `TracoEspecie` (`especies.ts`) e `InvocacaoMistica`
(`invocacoesMisticas.ts`), tipo `TipoSentido` centralizado em
`data/rulesets/dnd2024/sentidos.ts` (Visão Comum não entra — todo
personagem já tem, não é algo "concedido"). `core/sentidos.ts` junta
todas as fontes do personagem (espécie + Invocações Místicas atuais,
mais fontes no futuro — itens mágicos, outras classes) num resultado
por tipo.

**Regra de empilhamento — pega o MAIOR valor, nunca soma.** Confirmado
com o Osmar: quando 2+ fontes dão o MESMO tipo de sentido (ex: espécie
já dá Visão no Escuro 36m + uma invocação que também dá Visão no
Escuro), o valor final é o maior entre elas — é a regra padrão do
Apêndice C. Somar só valeria se o texto de uma fonte específica pedisse
isso de propósito (nenhuma hoje pede — o exemplo cogitado foi uma
característica do Patrono Ínfero, ainda não importada; quando essa
hora chegar, decidir um mecanismo de override específico pra ela, não
mudar a regra padrão).

**"Conhecimento de Pedras" do Anão (Sismiconsciência temporária, Ação
Bônus, usos limitados) fica de fora do campo estruturado** — só sentido
passivo permanente entra; habilidade ativada/temporária continua só
como texto do traço, não aparece na seção "Sentidos" da Ficha (que
mostra o que o personagem TEM agora, não o que ele pode ativar).

**Tela:** seção "Sentidos" nova na aba Atributos, antes de "Descanso"
— só aparece se pelo menos 1 valor for > 0 (personagem sem nenhum
sentido especial não vê seção nenhuma).

**Data/origem:** 2026-09, pedido do Osmar depois de revisar a cadeia
de pré-requisito das Invocações Místicas.

## Ferramenta de teste "sorteia e aplica direto" — não reabre o fluxo real, gera o resultado final e chama o mesmo aplicador (2026-09)

Padrão usado 2x agora (Personagem de Teste, Level Up Rápido) — vale
pra qualquer botão de teste futuro que precise "pular" um fluxo de
várias telas: em vez de rodar a UI de verdade em modo automático
(clicando "Avançar" sozinho), uma função pura em `core/` recebe os
mesmos parâmetros que a tela real receberia e devolve **o objeto de
resultado final**, no formato exato que o `onConfirmar`/aplicador real
espera — daí quem chama usa o mesmo aplicador de sempre (`FichaShell.
confirmarLevelUp`, por ex.), sem duplicar a lógica de "o que fazer com
o resultado". Zero tela aparece — clicou, já aplicou.

A função de sorteio replica as MESMAS condições que decidem se cada
passo se aplica (ex: `luSteps` do `LevelUpShell` — subclasse só no
nível certo e se ainda não tinha, Especialista só nos níveis que
concedem, etc.) — nunca reimplementa a regra do zero, só troca "tela
com clique" por "sorteio". Sorteio em si (embaralhar/escolher 1)
mora em `core/sorteio.ts`, compartilhado por qualquer ferramenta desse
tipo — não duplicar `embaralhar`/`sorteiaUm` de novo num terceiro
arquivo.

**Level Up Rápido especificamente:** botão "⚡" ao lado do "⬆ Level
Up" normal (aba Atributos), cor diferente (`var(--warn)`) só pra não
confundir os dois. Sobe exatamente 1 nível por clique (pra subir mais,
clica de novo) — PV sempre pela média (nunca rola dado, é pra ser
instantâneo). `core/levelUpAleatorio.ts` (testado).

## Bônus opcional somado a uma rolagem concluída — vira linha no próprio modal de rolagem, não um card na tela (2026-09)

Padrão pra qualquer característica tipo "A Sorte do Próprio Tenebroso"
(Bruxo): soma um dado avulso a UMA rolagem de teste de
atributo/salvaguarda já feita, com usos limitados. Em vez de um card
separado na Ficha (que obrigava o jogador a rolar, decorar o resultado
manualmente, olhar o card, somar de cabeça — jeito antigo, descartado),
virou uma linha dentro do próprio `RollOverlay` (o modal que já
aparece toda rolagem), do lado dos botões de Vantagem/Desvantagem —
consistente com como Vantagem/Desvantagem já funciona (escolhida DEPOIS
de ver o resultado, recalcula o total na hora).

**Mecanismo (genérico, não é código exclusivo de nenhuma classe):**
`RollContext.tsx` ganhou `BonusExtraProvider` (rótulo, lados do dado,
usos restantes/máximo, função `usar()` que consome 1 uso) +
`registrarBonusExtra`/`aplicarBonusExtra`. Como o `RollOverlay` é
montado global (`App.tsx`, fora da árvore da Ficha), quem TEM o
recurso (`FichaShell.tsx`) registra o provider num `useEffect` toda vez
que o estado muda (e desregistra ao desmontar) — o Overlay só lê o que
está registrado, sem saber nada de Bruxo/Patrono Ínfero. `RollState`
ganhou `categoria` (hoje só `'atributoOuSalvaguarda'`) — só rolagens
marcadas com essa categoria mostram o botão; ataque/dano/iniciativa
nunca marcam, então nunca mostram, sem precisar de lista de exclusão.

**Pra próxima característica parecida** (ex: um "Orientação"/Guidance
+1d4 futuro): reaproveitar o mesmo `BonusExtraProvider`, só trocando
rótulo/lados/fonte do `usar()` — não criar um 2º mecanismo.

## Todo contador "N usos de M" vira pip circular ao lado do nome — nunca texto no meio do parágrafo (2026-09)

**Regra permanente, sem exceção, daqui pra frente:** qualquer recurso
onde o jogador "tem N vezes pra usar algo" (Indomável, Surto de Ação,
Pontos de Sorte, Recuperar Fôlego, Inspiração de Bardo, Espaços de
Magia, Ataque de Sopro, Ancestralidade Gigante, Conhecimento de
Pedras, Pico de Adrenalina, Salto da Nuvem, Perícia Inigualável,
Mente Tática, e qualquer coisa nova parecida) mostra o "quanto resta"
como **pip circular** ao lado do NOME/título do recurso — nunca como
`(3/5 usos — recarrega no Descanso Longo)` enfiado no meio do
parágrafo de descrição. Motivo: a Ficha tinha vários desses contadores
embutidos assim, texto corrido demais pra ler rápido numa tela de
celular no meio de uma sessão de jogo (pedido do Osmar revisando a
tela de Combat).

**Como implementar (2 componentes, `ui/components/`):**
- `TickPips` — os pips em si (bolinha cheia = disponível, cinza = já
  gasto; esvazia do ÚLTIMO índice pro primeiro, nunca do primeiro pro
  último). Círculo (`border-radius: 50%`), não quadrado com canto
  arredondado — decisão visual explícita do Osmar, não usar
  `--shape-xs`/`--shape-sm` aqui.
- `ContadorUsos` — pips + texto pequeno "restantes/total" (cinza,
  `var(--text-faint)`), pronto pra colocar do lado de um título;
  cuida de neutralizar o `text-transform`/`letter-spacing` herdado de
  `.section-title` (que não deve afetar números).

**Onde plugar:** o container do título (`.section-title`,
`.opt-card-name`, ou o rótulo de um `.slotCounter` dentro de um painel
de Ação/Bônus/Reação) vira flex (`display:flex; align-items:center;
gap:8px; flexWrap:wrap`) com o nome + `<ContadorUsos .../>` dentro. O
parágrafo de descrição abaixo mantém só a informação de QUANDO recarga
(Descanso Curto/Longo) — nunca repete o número, que já está no pip.

**Não é pip:** um toggle de 1 uso só (Vigor Implacável, Astúcia
Mágica, Inspiração Heroica) não é "N de M", é liga/desliga — continua
sendo o card/checkbox normal, sem pip (a única exceção existente,
Inspiração Heroica em `AtributosTab`, usa `TickPips` com `total={1}`
só porque já existia antes dessa regra; não é o padrão a copiar pra
um toggle novo).

**Auditoria 2026-09:** os painéis de Ação/Bônus/Reação
(`AcaoPanelContent`/`BonusPanelContent`/`ReacaoPanelContent`,
`EscolherCirculoShell`, `MagiasTab`) já seguiam esse padrão antes da
regra existir formalmente — só precisaram da troca de quadrado pra
círculo. O único lugar com o anti-padrão (contador enterrado no texto)
era `CombatTab.tsx`: Indomável, Pontos de Sorte, Mente Tática, Perícia
Inigualável, Ataque de Sopro, Ancestralidade Gigante — todos
corrigidos.
