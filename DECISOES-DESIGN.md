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
>
> **2026-09 — 2ª passagem de compactação (só este arquivo):** este
> arquivo sozinho tinha voltado a passar de 1480 linhas. Passagem
> nova aplicando o mesmo teste da seção 7.1: entradas superadas por
> uma decisão posterior foram fundidas no estado final (ex: as ~5
> iterações do formato de ícone de Classe/Espécie/Origem viraram 1
> entrada só descrevendo o pipeline de arte atual); bug já corrigido
> sem lição, narração de teste/entrega e ajuste visual pontual sem
> padrão por trás foram cortados.

---

## Level Up — overlay em cima da ficha, não uma rota separada

**Decisão:** qualquer fluxo que precise "tomar a tela inteira" mas
continuar dentro do contexto de uma ficha já aberta (Level Up hoje;
editor de item, ficha de NPC dentro de uma sessão no futuro) deve ser
um overlay de tela cheia (`position: fixed`) renderizado **dentro** do
componente da ficha (`FichaShell`), trocado por flag de estado (ex:
`levelUpAberto`) — nunca uma rota separada (`/ficha/:id/levelup`).

**Por quê:** uma rota React Router desmontaria o `FichaShell` ao
navegar, perdendo todo o estado vivo da sessão de combate (PV atual,
Espaços de Magia gastos, estado Ativo/Usada dos botões de turno) só
porque o jogador foi fazer algo relacionado no meio de uma sessão.

## Rolagem de dados — contexto global (`RollProvider`), não popup por tela

**Decisão:** existe um único componente de overlay de dado
(`RollOverlay`) montado uma vez no topo do app (`App.tsx`), controlado
por um React Context (`RollContext`/`useRoll()`). Qualquer tela chama
`rolarD20(...)`/`rolarDados(...)` de qualquer lugar da árvore, sem
montar sua própria cópia do overlay. Padrão geral: "uma coisa só que
qualquer tela aciona" em React é Context + Provider no topo da árvore,
nunca duplicar o componente de overlay tela por tela.

## Tema visual do app de verdade (React): light, não dark

**Decisão:** o app em React usa paleta **clara** (fundo claro, texto
escuro), ainda monocromática/cinza — diferente do dark do wireframe
HTML (`wireframe-app-rpg-v2.html`, que é dark de propósito só pra
simular "protótipo neutro"). Facilita revisar texto/leitura durante o
desenvolvimento.

**Pendência conhecida:** a direção visual "RPGzística" de verdade
(tipografia old-school, paleta dourado/bronze, textura) continua
adiada — light aqui não é a decisão final de identidade visual. Quando
a direção visual entrar, esse tema muda de novo.

## Técnica de escala pra moldura ornamentada — 9-slice (`border-image`)

**Decisão:** painel/botão/card com moldura ornamentada (pele RPG por
cima da estrutura M3) usa a técnica **9-slice** (equivalente web do
9-patch do Unity) via CSS `border-image-source`/`-slice`/`-width` — não
gerar uma imagem por tamanho de componente. Grade 3×3: os 4 cantos
nunca esticam (preservam entalhe/ornamento), bordas do meio esticam só
numa direção, centro estica nas duas. `border-image-repeat: repeat`
pra textura (pedra/tecido, evita esticar e borrar) ou `stretch` pra
gradiente liso. Nativo em CSS, sem lib extra — só considerar algo tipo
`NineSlicePlane` (Pixi.js) se algum componente futuro renderizar em
canvas/WebGL em vez de DOM normal.

## Referência de design — Material Design 3 (m3.material.io)

**Decisão:** usar o M3 do Google como referência de **estrutura/
comportamento** (espaçamento, states, motion, acessibilidade, padrões
de bottom sheet/FAB/seleção) sempre que houver dúvida se um padrão de
UI está dentro de boa prática. Processo de construção padrão (ver
CLAUDE.md 5.1): 1) M3 como base estrutural → 2) pele RPGzística por
cima.

**Nuance importante:** estrutura (M3) e identidade visual RPGzística
**não são fases sequenciais excludentes** — são duas camadas
independentes que podem ser aplicadas juntas a qualquer momento se o
Osmar quiser (um botão pode seguir o formato/área de toque/estado de
seleção do M3 E já ter textura de pedra/tipografia old-school por
cima). "Visual pode vir depois" é só prioridade (lógica/fluxo bloqueia
decisões, visual não bloqueia nada) — não é regra contra adiantar
identidade visual.

**Pendência conhecida:** as telas da Fase 0 não foram auditadas contra
M3 retroativamente — vale como padrão daqui pra frente ou quando uma
tela existente for revisitada por outro motivo, não é gatilho pra
varredura geral.

## `ItemComDescricao` — popup de descrição de item, com regra fixa de variante

**Decisão:** qualquer termo com descrição própria (item, talento,
característica) usa o componente compartilhado
`ui/components/ItemComDescricao.tsx` — toque abre popup central (nome
no topo, descrição embaixo; mesmo estilo visual do `RollOverlay`).
Item sem descrição cadastrada renderiza como texto simples. Índice de
busca único, case-insensitive, por
`data/rulesets/dnd2024/buscarDescricaoItem.ts` — qualquer tela que
precise saber "esse item tem descrição?" usa essa mesma função, não
reimplementa a busca. O clique no nome sempre usa `stopPropagation`
(o item costuma estar dentro de um card clicável maior — sem isso, o
clique também dispararia a seleção do card por baixo).

**Duas variantes visuais, escolha por contexto (não por preferência de
tela) — regra fixa:**
- **`sublinhado`** (padrão) — termo dentro de frase/parágrafo de texto
  corrido (descrição de kit, lista de itens da Loja/Origem).
- **`icone`** (ⓘ solto ao lado, nome sem sublinhado) — termo dentro de
  uma **linha de estatística ou linha com checkbox**, onde sublinhar
  competiria visualmente com o resto da linha (Mochila com "itens
  detalhados" desligado, Maestria em Arma no wizard e na Ficha).

Qualquer termo novo com popup de descrição consulta essa regra antes
de escolher a variante — não decide "no olho" de novo (documentado
também no JSDoc de `ItemComDescricao.tsx`).

**Cobertura de dado:** `equipamentoAventura.ts` e `montariasVeiculos.ts`
vêm da coluna "Descrição" da planilha mestra. Armas e Armaduras ainda
não têm campo de descrição corrida na planilha (só colunas mecânicas)
— ver `PENDENCIAS.md`.

## Deploy: GitHub Pages (não Netlify) — e o que muda se o repositório for renomeado

**Decisão:** o app é publicado via GitHub Actions
(`.github/workflows/deploy.yml`) em GitHub Pages, não mais Netlify
(o Netlify pausou deploy de produção por falta de crédito
operacional, mesmo com commits chegando normalmente no GitHub; como o
app é 100% front-end, Pages cobre o caso de uso sem depender de
crédito pago).

**O que muda tecnicamente por causa do subcaminho** (GitHub Pages
serve dentro de `/<nome-do-repo>/`, diferente da raiz do Netlify):
`vite.config.ts` (`base: '/Project0710/'`), `src/main.tsx`
(`BrowserRouter basename="/Project0710"`), `public/404.html` + trecho
em `index.html` (truque "spa-github-pages" do rafgraph, pra recarregar
uma rota tipo `/ficha/123` não dar 404 — Pages não tem redirect de
rota nativo). `netlify.toml` removido.

**Se o repositório for renomeado de novo:** atualizar esses mesmos 3
lugares pro novo nome (aconteceu uma vez, de `DND-Conpanion-App` pra
`Project0710` em 2026-09) — mais qualquer entrada de `DECISOES-*.md`
que cite o nome antigo. Não existe mais nenhum outro lugar no código
com o nome hardcoded.

**Limite conhecido:** GitHub Pages grátis só serve site público
enquanto o repositório for público — se virar privado, o link para de
funcionar (exigiria GitHub Enterprise). Hoje o repo é público, não
trava nada agora.

## Popup (`InfoChip`/`ItemComDescricao`) trava o scroll da página de trás

**Decisão:** todo popup desse tipo usa `ui/hooks/useLockBodyScroll.ts`
— trava o scroll da `body` enquanto aberto e devolve a posição exata
ao fechar. A trava usa `position: fixed` na `body` (não só `overflow:
hidden`, que sozinho não impede o dedo de arrastar o conteúdo de trás
em iOS/Android — bug clássico de "scroll vaza atrás do modal" no
mobile). O `.overlay` também ganha `overscroll-behavior: contain` +
`touch-action: none`, e o `.card` ganha `max-height: 80vh` +
`overflow-y: auto` (segurança pra descrição muito longa em celular
baixo). Qualquer popup novo em cima da tela segue esse mesmo hook, não
reimplementa a trava.

## Ícones de Classe/Espécie/Origem — pipeline de arte e componente compartilhado

**Formato final (depois de evoluir de emblema quadrado → banner
retangular → emblema redondo):** card de seleção mostra um emblema
redondo dourado/bronze com moldura ornamentada, numa caixa quadrada
(`opt-card-img-emblema`); a Lista de Personagens reaproveita a mesma
arte como avatar (64px, `object-fit: cover`) no lugar do 👤 genérico
enquanto upload de avatar de verdade não existe.

**Pipeline de asset:** arte-mestra 512×512px PNG com fundo
transparente e ~10% de margem de respiro (o card corta em
`border-radius`, arte encostada na borda seria cortada) →
redimensionada pra 256×256 → convertida pra **WebP** (Pillow,
qualidade 85, `method=6`) antes de entrar no repositório — ~82%
menor que o PNG equivalente (PNG `optimize=True` lossless só ganhava
~3-4%, arte gerada por IA já vinha perto do limite de compressão sem
perda), sem degradação visível no tamanho exibido (~48-72px nos
cards). Vale como técnica padrão pra qualquer arte nova desse tipo
que entrar no projeto.

**Convenção de arquivo/componente (idêntica nas 3 categorias):**
`{id}-banner.webp` em `src/assets/icones-classes/`,
`icones-especies/`, `icones-origens/` (nome = id da entidade). Cada
categoria tem seu componente (`ui/components/IconeClasse.tsx`,
`IconeEspecie.tsx`, `IconeOrigem.tsx`) — cópias estruturais exatas:
`import.meta.glob` eager monta o mapa id→arquivo sozinho (nunca listar
import um por um), fallback pro emoji 🖼 quando não há arte pra aquele
id. Adicionar arte nova de uma classe/espécie/origem é só soltar o
arquivo com o nome certo — zero mudança de código. Vite deduplica
arquivos de conteúdo idêntico no build (cópias-placeholder viram
fisicamente 1 arquivo só no `dist/`).

**Hoje:** as 3 categorias completas com arte própria (12 classes, 10
espécies, 16 origens) — não sobra nenhum 🖼 genérico. Existe também um
`psionico-banner.webp` pronto mas **não ligado a nenhuma tela**
(Psiônico é conteúdo Unearthed Arcana, fora de escopo — CLAUDE.md
seção 9); fica pronto caso o escopo mude, sem criar entrada "em breve"
que sugeriria suporte futuro.

## `MagiaComDescricao` — formato único e fixo pra qualquer magia/truque na tela

**Decisão:** qualquer nome de magia/truque clicável em qualquer tela
usa `<MagiaComDescricao magia={m} />` — nunca inventar um jeito
próprio de mostrar/formatar magia numa tela nova. Formato: pill com
fundo lilás claro (`var(--accent-dim)`) com o ⓘ **dentro** da própria
pill (nunca separado). Popup mostra Nome, Tipo (Truque ou "Xº
Círculo"), toggle Desc. curta/longa, Tempo de Conjuração + Alcance,
Componentes, Duração, e a descrição — **campo em branco fica
escondido** (não vira linha vazia), e o **toggle curta/longa só
aparece se as duas existirem E forem diferentes**.

**Por que só 1 variante:** existiu uma variante "sublinhado + ⓘ
separado" e uma "pill lilás com ⓘ dentro" coexistindo por
inconsistência entre telas — resolvido pra 1 formato só, com a prop
`variante` removida do componente (não faz mais sentido existir).
Como todo lugar do app já usava o componente compartilhado, a mudança
de formato propagou sozinha pra wizard/Level Up/Ficha/Combat sem
precisar tocar em cada tela — prova de que reaproveitar o componente
certo (CLAUDE.md 6.5) compensa nessa hora.

**Escopo:** hoje só cobre Magias/Truques. Card fixo equivalente pra
Itens Comuns/Mágicos/Armas/Armaduras (campos próprios por tipo, ex:
Arma teria Dano/Propriedades/Maestria) é pendência registrada em
`PENDENCIAS.md` — não é o mesmo card reaproveitado 1:1.

## Aba "Perfil" — habilidades reais do personagem, agregadas de Classe/Origem/Espécie

**Decisão:** o menu inferior tem 5 abas: Atributos (era "Perfil" —
atributos, PV/CA/Iniciativa, perícias, descanso, renomeada pra abrir
espaço) / **Perfil** (nova) / Mochila / Magias / Combate. A aba Perfil
lista as habilidades REAIS do personagem, ordem Classe → Origem →
Espécie, cada uma como card não-interativo (`.opt-card`, mesmo padrão
já usado no Level Up — zero componente novo).

**Fonte de cada bloco:** Classe usa `core/levelUp.ts` →
`caracteristicasAcumuladas(classe, nivelAtual)`, que roda
`caracteristicasDoNivel` do nível 1 até o atual e deduplica por nome
(característica repetida em vários níveis conta +1 uso, não vira card
duplicado) — diferente de `caracteristicasDoNivel` (só 1 nível, usada
no Level Up pra "o que ganhei AGORA"). Origem busca o Talento de
Origem real (`talentosOrigem.ts`, com variante quando existir, ex:
"Iniciado em Magia (Clérigo)"). Espécie usa os `traços` reais de
`especies.ts` diretamente (já vêm prontos com nome+descrição).

## Padrão de pip/contador de uso — `TickPips` + `ContadorUsos`

**Regra permanente, sem exceção:** qualquer recurso "N vezes pra usar
algo" (Espaços de Magia, Recuperar Fôlego, Inspiração de Bardo,
Indomável, Surto de Ação, Pontos de Sorte, Ataque de Sopro, etc.)
mostra o "quanto resta" como **pip circular** ao lado do NOME/título
do recurso — nunca como texto tipo `(3/5 usos)` enfiado no meio do
parágrafo de descrição (ilegível numa tela de celular no meio de
sessão). O parágrafo abaixo guarda só QUANDO recarrega (Descanso
Curto/Longo), nunca repete o número.

**Componentes (`ui/components/`):** `TickPips` — os pips em si,
círculo (não quadrado com canto arredondado — decisão visual
explícita, não usar tokens de shape aqui), preenchido da esquerda,
**esvazia sempre pelo ÚLTIMO índice primeiro** ("tanque de
combustível": `i >= total - usados`, nunca `i < usados`) — regra única
em qualquer lugar que mostre "N usos, alguns já gastos". `ContadorUsos`
— pips + texto pequeno "restantes/total", pronto pra colocar do lado
de um título. Um recurso extra/compartilhado que aparece na MESMA tela
de um recurso base (ex: Ritual Rápido ao lado de Magias de Talentos
Gerais) usa `variante="especial"` (roxo/lavanda) só na cor do
"disponível" — "já gasto" continua cinza nos dois casos.

**Não é pip:** um toggle de 1 uso só (liga/desliga, ex: Vigor
Implacável, Astúcia Mágica) continua sendo card/checkbox normal, sem
pip — "N de M" é o gatilho, não "tem uma habilidade especial".

## Auditoria externa (GPT) — o que foi adotado e o que não foi

**Contexto:** uma auditoria técnica feita por outra IA (documento
externo) propôs uma bateria de mudanças estruturais pesadas: Vitest
com pirâmide de testes completa, contrato `Character` formal separado
de `WizardSelection`, `schemaVersion` + migradores versionados,
quebra de arquivos grandes em módulos/hooks por domínio, CI com gate
de lint+test+build, validador automático de catálogo de dado.

**Decisão:** adotar só os 2 achados verificados e baratos, hoje regra
permanente em CLAUDE.md seção 13 — (1) toda função nova de cálculo em
`core/` vem com teste Vitest no mesmo commit, (2) característica/regra
reconhecida por código usa ID estável, nunca nome de exibição. O resto
do pacote é conselho correto pra um SaaS com time e múltiplos
usuários, mas pesado demais pro contexto real (uso pessoal, ver
CLAUDE.md seção 9) — fica de fora até (se) aparecer necessidade real
(ex: um bug de migração de fato, não hipotético).

**Lição geral:** uma auditoria externa deve ser verificada achado por
achado antes de adotar — esta tinha pelo menos 1 número apresentado
como "evidência" que não batia com o código real na hora da checagem.

## ID estável — padrão de arquivo de mapeamento hand-maintained

**Decisão:** quando uma característica/regra precisa ser reconhecida
por código (CLAUDE.md seção 13) num dado que já existe sem ID próprio,
o padrão é um arquivo de mapeamento separado, hand-maintained, ex:
`data/rulesets/dnd2024/idsCaracteristicasClasse.ts` exportando um mapa
`ID_CARACTERISTICA_CLASSE` (`asi` → `'Aumento no Valor de Atributo'`
etc.) — mesmo molde do `efeitoMecanico` em `talentos.ts`. O consumidor
(ex: `core/levelUp.ts`) passa a comparar contra o ID, nunca contra o
nome direto, sem mudar sua assinatura pública. O arquivo carrega aviso
no topo pra reaplicar manualmente se o nome de exibição mudar na
planilha.

## Modal de rolagem — Vantagem/Desvantagem escolhida DEPOIS do resultado

**Decisão:** numa rolagem de d20 sem Vantagem/Desvantagem
pré-definida, aparecem 2 botões ("Desvantagem"/"Vantagem") embaixo do
resultado. Ao tocar, um 2º d20 rola do lado do primeiro e o
total/crítico são recalculados a partir do dado que a regra manda
usar — o dado descartado fica com opacidade reduzida, não escondido
(regra pede rolar os 2).

**Só se aplica a rolagem de d20 (nunca dano):** Vantagem/Desvantagem é
mecânica exclusiva de teste/salvaguarda/ataque — o código já separava
`rolarD20` (sempre 1d20) de `rolarDados` (quantidade/lados variáveis),
então os botões só existem em `rolarD20`; `rolarDados` nunca ativa
`podeEscolherVantagem` — garantia estrutural, não um `if` a mais pra
lembrar de manter. `RollState` guarda `tipo`, `dado2`, `vantagem`,
`mod` (pra poder recalcular o total depois) e `podeEscolherVantagem`.
Vantagem/Desvantagem PRÉ-definida na chamada (ex: Contra-Encantamento)
continua funcionando igual, só ganhou a mesma visualização de 2 dados
— sem os botões, porque a decisão já foi tomada na hora da chamada.

## "Usar de graça" só existe quando algo é rastreado por uso

**Regra generalizável:** todo botão de ação precisa ter algo
rastreável por trás (um contador, um estado que muda) — senão vira tag
informativa (`<span className="tag">sem custo</span>`, mesma
formatação de "já possui"), nunca um botão clicável sem efeito nenhum
(confunde o jogador, parece que faz algo). Ex: um recurso `recarga:
'ilimitado'` não tem botão "Usar de graça"; um recurso rastreado
(`recarga: 'descansoLongo'`, contador dedicado) mantém o botão
"Usar de graça"/"Usada".

## Barra de PV Temporário — escala estendida, e lição sobre animar SVG

**Barra de PV Temporário:** quando o personagem tem PV Temporário, a
barra de Pontos de Vida (aba Combat) estende a escala além do máximo
— verde até o PV máximo, azul do máximo até máximo+temporário. Sem PV
Temporário, a barra é idêntica a antes. `LinearProgressBar.tsx` ganhou
prop opcional `temporario`.

**Lição técnica pra qualquer barra/indicador animado do app:** CSS
`transition` em atributo de geometria SVG (`x1`/`x2` de `<line>`,
`x`/`width` de `<rect>`) **não anima de forma confiável** — o valor
pula seco pro final em vez de interpolar. Resolvido animando em **JS
puro** (`requestAnimationFrame`, ease-out quadrático) no hook
`useValorAnimado` — funciona sempre, não depende de suporte do
navegador a transição de geometria SVG. Reaproveitar esse hook em
qualquer barra/indicador novo, não tentar `transition` em atributo SVG
de novo.

## Cura acima do máximo vira PV Temporário — HOUSE RULE, não regra oficial

**Decisão:** o PV enche até o máximo primeiro — se uma cura cruza o
máximo, o excedente DESSE clique é descartado (igual à regra real).
Só depois de já estar no máximo é que uma nova cura vira PV Temporário
inteiro, somando com o que já havia (não "pega o maior"). Ex: 90/100 +
15 = 100/100; clicar de novo já em 100/100 com +5 vira +5 PV
Temporário.

**Por que fica aqui e não em `DND-Regras.md`:** pela regra real
(Glossário do Livro do Jogador), cura acima do máximo é sempre
perdida, mesmo já no máximo — sem nenhuma menção a virar Temporário.
É house rule do Osmar, registrada como tal. Não confundir com
`ganharPvTemporario()` (habilidade que concede PV Temporário direto,
ex: Vigor Ínfero) — essa continua "pega o maior valor", regra real,
intocada; a soma só vale pra cura normal já no máximo
(`aplicarAlteracaoPv`).

## Sentidos Especiais — dado estruturado, regra do maior valor (não soma)

**Decisão:** Visão no Escuro/às Cegas/Verdadeira/Sismiconsciência têm
campo estruturado `sentidoConcedido: { tipo, alcanceMetros } | null` em
`TracoEspecie` (`especies.ts`) e `InvocacaoMistica`
(`invocacoesMisticas.ts`), tipo `TipoSentido` centralizado em
`data/rulesets/dnd2024/sentidos.ts` (Visão Comum não entra — todo
personagem já tem, não é "concedido"). `core/sentidos.ts` junta todas
as fontes do personagem (espécie + Invocações Místicas hoje, mais
fontes no futuro) num resultado por tipo.

**Regra de empilhamento — pega o MAIOR valor entre fontes do MESMO
tipo, nunca soma** (regra padrão do Apêndice C). Somar só valeria se o
texto de uma fonte específica pedisse isso de propósito — nenhuma
hoje pede; se aparecer uma que peça, decidir um override específico
pra ela, não mudar a regra padrão.

**O que fica de fora do campo estruturado:** sentido ativado/temporário
por habilidade limitada (ex: Conhecimento de Pedras do Anão) — só
sentido passivo permanente entra; continua como texto do traço. Tela:
seção "Sentidos" na aba Atributos, só aparece se pelo menos 1 valor
for > 0.

## Ferramenta de teste "sorteia e aplica direto" — pula o fluxo de telas, chama o mesmo aplicador

**Padrão pra qualquer botão de teste que precise "pular" um fluxo de
várias telas:** uma função pura em `core/` recebe os mesmos parâmetros
que a tela real receberia e devolve **o objeto de resultado final**,
no formato exato que o aplicador real espera (ex: `FichaShell.
confirmarLevelUp`) — quem chama reaproveita o mesmo aplicador de
sempre, sem duplicar "o que fazer com o resultado". Zero tela aparece.
A função de sorteio replica as MESMAS condições que decidem se cada
passo se aplica (nunca reimplementa a regra do zero, só troca "tela
com clique" por "sorteio"); o sorteio em si (embaralhar/escolher 1)
mora em `core/sorteio.ts`, compartilhado por qualquer ferramenta desse
tipo. Usado hoje em Personagem de Teste e Level Up Rápido
(`core/levelUpAleatorio.ts` — sempre pela média de PV, nunca rola
dado, pra ser instantâneo).

## Bônus opcional somado a uma rolagem concluída — linha no próprio modal de rolagem

**Padrão (genérico, não exclusivo de nenhuma classe):** uma
característica que soma um dado avulso a UMA rolagem de
teste/salvaguarda já feita (ex: A Sorte do Próprio Tenebroso, Bruxo)
vira uma linha dentro do próprio `RollOverlay` (o modal que já aparece
toda rolagem), do lado dos botões de Vantagem/Desvantagem — nunca um
card separado na Ficha que obrigaria o jogador a rolar e somar de
cabeça. Mecanismo: `RollContext.tsx` tem `BonusExtraProvider`
(rótulo, lados do dado, usos restantes/máximo, função `usar()`) +
`registrarBonusExtra`/`aplicarBonusExtra`. Como o `RollOverlay` é
montado global (fora da árvore da Ficha), quem TEM o recurso
(`FichaShell.tsx`) registra o provider num `useEffect` toda vez que o
estado muda (e desregistra ao desmontar) — o Overlay só lê o que está
registrado, sem saber nada da classe específica. `RollState` tem
`categoria` (`'atributoOuSalvaguarda'` hoje) — só rolagens marcadas
mostram o botão; ataque/dano/iniciativa nunca marcam. Qualquer
característica futura do mesmo formato reaproveita o mesmo
`BonusExtraProvider`, só trocando rótulo/lados/fonte do `usar()`.

## Borda azul = interativo, borda cinza = passivo (regra pra qualquer caixa de stat)

**Regra permanente:** qualquer caixa de número/stat (Ficha ou Wizard)
com borda azul CONTÍNUA (`var(--accent)`, `border-style: solid`,
classe `.hpBoxAccent`) sinaliza que role dado OU tem interação de
toque; borda cinza TRACEJADA padrão (`.box`, sem modificador) sinaliza
que é só informativa, sem toque nenhum — a cor E o traço já comunicam
"dá pra tocar" vs "é só um número", sem precisar de texto explicando.
`.hpBoxAccent` precisa fixar `border-style: solid` explicitamente
porque `.box`/`.stat-box` partem tracejados por padrão. `.stat-box`
também é usado no wizard (`AtributosStep.tsx`), onde azul já significa
outra coisa ("valor já atribuído") — por isso o modificador azul só é
aplicado na Ficha (`AtributosTab.tsx`), nunca na classe global.

**Regra de rótulo:** label de caixa pequena com mais de 1 palavra
sempre quebra depois da 1ª palavra ("Bônus\nProf.", "Percepção\n
Passiva"); label de 1 palavra só (PV, CA) não quebra.

## Barra de abas de nível superior vira Navigation Bar (M3), não pill flutuante

**Regra permanente:** qualquer barra de navegação de nível superior
(a que troca de tela/aba principal, não uma sub-navegação dentro de
uma tela) segue o padrão M3 de Navigation Bar — presa na borda
inferior, largura 100%, sem sombra, `border-top` fino em vez de
elevação; cada item usa `flex: 1 1 0` (todos do mesmo tamanho,
preenchendo a barra inteira, nunca `min-width` fixo deixando espaço
vazio nas pontas); indicador de item ativo é um pill pequeno só atrás
do ÍCONE, não atrás do bloco inteiro (ícone + rótulo). Aplicado na
barra de abas da Ficha (`FichaShell.tsx`, `.tabbarLayer`/`.tabbar`,
indicador `.tabIconWrap`). **Não se aplica** às pills de navegação do
Wizard (`DECISOES-WIZARD.md`) — são passos sequenciais de um fluxo,
não abas paralelas, contexto diferente.

## Motor de Pets/Familiar — arquitetura genérica

**Uma criatura nunca é duplicada — `Pet` só guarda o que é ESPECÍFICO
da instância.** `Pet` (`core/pets.ts`): `id`/`nome`/`criaturaId`/
`pvAtual`/`origemInvocacaoId?`/`ajustes?` — CA, PV máximo, atributos,
ações, traços etc. sempre vêm de `Criatura`
(`data/rulesets/dnd2024/criaturas.ts`) na hora de exibir, nunca
copiados pro pet. Qualquer override (`ajustes`) é a exceção
registrada, não a regra.

**"De onde veio" e "o que mudou" são campos opcionais, não sistemas
separados.** `origemInvocacaoId?` marca qual característica concedeu o
pet (`undefined` = avulso/manual); `ajustes?: AjustesPet` marca
customização em cima da criatura base (`undefined` = stat block
padrão). Os dois são independentes.

**"Só 1 por fonte" é regra de aplicação, não do schema.** O array de
pets nunca trava em tamanho fixo (precisa comportar vários
simultâneos no futuro), mas convocar de novo pela MESMA
`origemInvocacaoId` substitui o pet anterior daquela fonte (mesmo
padrão de "só 1 arma de pacto por vez") — decidido em `adicionarPet`
(`FichaShell.tsx`), não no tipo `Pet[]`. Uma fonte que permita vários
ao mesmo tempo simplesmente não passa `origemInvocacaoId`.

**"Restrito a uma lista" e "livre" são o mesmo formulário, lista
diferente.** `AdicionarPet` (`ui/ficha/tabs/PetsTab.tsx`) recebe
`criaturasDisponiveis: Criatura[]` — telas de "restrito" (formas de
uma invocação) e "catálogo inteiro" são a mesma função de UI chamada
2x com listas diferentes, não 2 componentes.

**"Ajustar alguns números" nunca é stat block livre do zero.**
`AjustarPetShell.tsx` sempre parte de uma `Criatura` do catálogo — só
CA/PV máximo/6 atributos podem ser sobrescritos. `calcularAjustesPet`
descarta qualquer campo que o jogador deixou igual ao original — só o
que É de fato diferente vira `ajustes` salvo.

## Efeito bônus pós-conjuração que atravessa aba — modal no `FichaShell`, não banner na aba

**Regra:** quando uma característica dispara um efeito OPCIONAL depois
de conjurar uma magia com espaço, e a magia pode ser conjurada de mais
de um lugar (aba Magias E painel de Ação do Combate), o estado e a UI
do efeito vivem no `FichaShell.tsx`, nunca dentro da aba/painel que
disparou — um banner com estado local morre ao trocar de aba, e o
jogador teria que voltar pra mesma aba pra interagir. A aba/painel só
avisa "isso se qualificou, aqui está o valor" via 1 callback (ex:
`onXDisponivel(valor)`) — não sabe nada do domínio do efeito.

**Forma final: modal centralizado, não banner inline.** Reaproveita o
CSS de outro modal existente (`TrocarArmaMaestria.module.css`) —
título, texto explicando o efeito, escolha, tudo num card só. `z-index`
mais baixo que o modal de Salvaguarda/Rolagem de Dado: se a mecânica
da própria magia também abrir um desses popups, ele aparece por cima
primeiro, e fechá-lo revela o modal do efeito bônus embaixo, sem
sequenciamento manual (ver `ui/components/ColheitaMacabraModal.tsx`
como referência de implementação).

## `npx tsc --noEmit` não confere nada neste projeto — sempre usar `npx tsc -b`

**Achado:** o `tsconfig.json` da raiz tem `"files": []` com
`references` pra `tsconfig.app.json`/`tsconfig.node.json` (project
references do Vite) — `npx tsc --noEmit` direto na raiz retorna
"limpo" mesmo com erro de tipo real no código, porque não confere nada
contra esse layout. `npm run build` sempre foi seguro (usa `tsc -b &&
vite build` por baixo), mas qualquer checagem de tipo INTERMEDIÁRIA
(fora do checklist completo de publicação) deve usar `npx tsc -b
--force`, nunca `npx tsc --noEmit` sozinho.

## Reação/passiva disparada por "estado chegou a X" — gatilho é o estado compartilhado, nunca "quem mudou"

**Decisão:** quando uma característica dispara (ou libera) uma ação
baseada em um estado atingir um valor (ex: "sempre que um Morto-Vivo
controlado chega a 0 PV"), a checagem de gatilho é uma função pura
derivada do estado compartilhado atual (ex: `algumMortoVivoEm0PV(pets)`
olhando só `Pet.pvAtual`) — **nunca** um evento/callback disparado só
no momento de uma mutação específica.

**Por quê:** o mesmo estado pode ser alterado por caminhos bem
diferentes (dano manual numa aba, ou uma Reação que reduz o pet a 0 de
propósito) — um evento acoplado a só um desses handlers nunca
dispararia pelo outro caminho, mesmo produzindo o mesmo estado final.
Calculando o gatilho como função pura sobre o estado atual, todos os
caminhos funcionam de graça, sem encanamento extra entre handlers.

## Duplicação entre telas que fazem a mesma coisa — extrai só a DECISÃO pra `core/`, não força o estado a ser igual

**Achado:** 3 painéis (`MagiasTab.tsx`, `AcaoPanelContent.tsx`,
`ReacaoPanelContent.tsx`) tinham cada um sua PRÓPRIA cópia de
"conjurar magia com espaço" (qual mecânica, que dado rolar, que texto
mostrar) — uma característica nova só foi ligada em 2 das 3, porque
cada painel reimplementava a lógica por conta própria.

**Decisão:** extrair só a DECISÃO (qual mecânica, que rolagem fazer,
que texto de feedback, se qualifica pra um efeito bônus) pra uma
função PURA em `core/` (ex: `core/conjurarMagia.ts`'s
`decidirConjuracao`) que devolve uma descrição do que fazer — nunca
chama hooks de rolagem diretamente (não dá pra chamar hook de fora de
componente) e nunca decide COMO aplicar o resultado. Cada painel
continua com seu próprio jeito de aplicar (estado local vs. callback
pro pai, fecha ou não) quando essa parte genuinamente difere entre
eles — forçar tudo pra um estado único seria refactor arriscado sem
ganho real, já que o bug era a LÓGICA duplicada, não o estado
diferente.

**Padrão a repetir:** sempre que 2+ telas/painéis calculam a mesma
regra de D&D mas gerenciam o resultado de formas diferentes, extrair
só o CÁLCULO/DECISÃO pra uma função pura em `core/` que todas chamam —
não tentar unificar a gestão de estado junto, a menos que ela também
seja genuinamente igual.
