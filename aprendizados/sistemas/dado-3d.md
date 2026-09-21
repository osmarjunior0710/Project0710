# Dado 3D — histórico de implementação

> Arquivo de arquivo/referência do sistema "Dado 3D com física" — parte
> do sistema `aprendizados/` (ver `aprendizados/INDICE.md` e a seção
> 7.2 do `CLAUDE.md`). Guarda o processo de construção completo
> (fases, decisões técnicas, bugs achados/corrigidos) que não precisa
> virar padrão permanente em `DECISOES-COMBATE.md` — só o que é
> específico deste sistema (a biblioteca `@3d-dice/dice-box` em si,
> suas particularidades). Os poucos padrões que generalizaram pra
> QUALQUER feature futura (não só dado) foram extraídos de volta pra
> `DECISOES-COMBATE.md` "Dado 3D — escolha e padrões reaproveitáveis"
> na compactação de 2026-09 que criou este arquivo.
>
> Mecânica completa (mapeamento de cada mecanismo do app pro motor
> físico) fica em `sdd/sdd-dado-3d.md` — este arquivo é só o histórico
> de COMO se chegou lá, incluindo os becos sem saída.

---

## Escolha da biblioteca e gotchas de integração

**Escolha:** `@3d-dice/dice-box` (BabylonJS + Ammo.js, física rodando em
Web Worker) — não `dice-box-threejs` (irmã da mesma família, menos
madura/mantida). Todos os 7 tipos (d4-d20, d100) vêm num único
`default.json` + texturas (~620 KB estáticos); o JS da lib (~660 KB) só
baixa via `import()` dinâmico no clique/warm-up, não entra no bundle
principal.

**Gotchas reais (documentar antes de qualquer integração de verdade):**
- A lib não publica tipos TypeScript — precisa de `.d.ts` próprio, só
  com o que for usado.
- O `<canvas>` que a lib cria não vem estilizado — sem
  `width:100%;height:100%` explícito no container, fica no tamanho
  padrão do navegador (300×150px, canto superior esquerdo), invisível,
  sem nenhum erro no console.
- Um container que uma lib externa MEDE pelo tamanho do elemento nunca
  pode ser escondido com `display:none` (zera o tamanho e a lib nunca
  mais desenha nada depois) — usar `visibility:hidden`/`opacity:0`, que
  preserva o tamanho real.
- Um componente que guarda a instância da lib em `useRef` não pode
  desmontar o container real do DOM entre usos (a instância fica presa
  a um canvas morto) — manter sempre montado, escondido via CSS.
- `box.roll()` lê tema/textura de forma SÍNCRONA — precisa `await
  box.loadTheme(id)` antes de rolar com um tema ainda não carregado
  nessa sessão (idempotente depois da 1ª vez).

**Confirmado (lendo `Dice.js` da lib):** a lib decide o resultado só
pela física (raycasting no dado já parado) — não existe API pra forçar
um resultado. Sem forma de gerar o número com `Math.random()`/nosso
motor e só "decorar" com a física depois — quando o dado 3D vira fonte
de verdade de uma rolagem real, a física da lib TEM que ser a origem
do número bruto (motor de vantagem/modificador/total continua nosso).

## Escopo — decisão de fases (Osmar, 2026-09)

O dado 3D vira ferramenta avulsa E motor oficial de rolagem, em fases.

**Fase A (feito):** `Dice3dFab.tsx` formalizado como ferramenta avulsa
permanente da Ficha (não é mais protótipo/`[PH]`) — todos os tipos de
dado, modo Múltiplos, customização de textura/cor, e um histórico de
rolagens **compartilhado com o resto da Ficha** (`RollContext.log`/
`adicionarLog`): toda rolagem real do jogo (`rolarD20`/`rolarDados`,
logada em `fechar()` quando a rolagem está `concluido`) E toda rolagem
avulsa do FAB aparecem na MESMA lista — `RollContext` é o único lugar
que os dois mundos enxergam, já que o resto da Ficha nem sabe que o
dado 3D existe. O d20 avulso do FAB não simula perícia mais (era
sorteio aleatório só pra testar formato) e não pede rótulo nem Normal/
Vantagem/Desvantagem (2026-09, removido a pedido do Osmar — o campo/
botões só faziam sentido pensando na Fase B, mas essa ferramenta avulsa
não está ligada a nenhum teste específico da ficha; rolar d20 aqui é
igual a rolar qualquer outro dado, direto).

**Fase B (feito):** o motor 3D vira o padrão pra toda rolagem oficial
do jogo (Combate/Magias/Atributos), com preferência 3D/2D no menu do
avatar.

## Fase B1 — preferência 3D/2D

`RollContext` ganhou `preferenciaDado3D`/`dado3DDisponivel`/
`dado3DAtivo` (o último, derivado). Persistência reaproveitou
`useColapsavel` direto (é só um boolean com `localStorage`,
"expandido/colapsado" vira "3D ligado/desligado" sem precisar de hook
novo). Suporte a WebGL detectado 1x por sessão via `<canvas>`
descartável tentando `webgl2`/`webgl`/`experimental-webgl`
(`ui/utils/suportaWebGL.ts`) — padrão pra qualquer feature 3D futura
que precise da mesma checagem. `alternarModoTeste` força a preferência
pra `false` ao ligar (física real é incompatível com resultado fixo de
QA) — mutuamente exclusivos por design, nunca checar só um dos dois
isoladamente pra decidir o motor de rolagem, sempre usar `dado3DAtivo`
(já combina os 3 fatores).

## Fase B2 — d20 simples usa o motor 3D de verdade, com canvas compartilhado

O `@3d-dice/dice-box` só pode ter 1 instância/canvas por vez (mesmo
gotcha de sempre, ver "Gotchas reais" acima) — virou módulo próprio
(`ui/roll/diceBox3d.ts`, `carregarDiceBox3D`/`garantirTemaDiceBox3D`),
não mais exclusivo do `Dice3dFab.tsx`. `Dice3dFab` agora fica com o
wrapper visível (`mostrarWrapper = aberto || estado?.motor3D`) tanto
quando o jogador abre o FAB avulso quanto quando uma rolagem OFICIAL
(`RollOverlay`) está usando física — qualquer entrega futura que
precise do motor 3D reaproveita esse mesmo módulo, nunca cria uma 2ª
instância.

**Decisão de UI confirmada com o Osmar antes de codar (seção 6.4):**
o `RollOverlay` mostra o dado físico de verdade caindo (não mantém a
animação CSS enquanto rola escondido por trás) — o objetivo da Fase B
é o jogador SENTIR a física, esconder ela derrotaria o propósito. Fundo
do `RollOverlay` fica transparente quando `motor3D` (`.overlaySemFundo`)
pra não escurecer 2x em cima do fundo escuro que já vem do canvas
compartilhado.

**Escopo desta entrega — só d20 SIMPLES:** Vantagem/Desvantagem
PRÉ-declarada continua 2D mesmo com o motor 3D ligado (mecanismo
diferente da lib, `box.roll(['1d20','1d20'])` — entrega futura B3).
Escolher Vantagem/Desvantagem DEPOIS de ver o resultado
(`escolherVantagemPosRolagem`) também continua 2D pro 2º dado — o 1º
(físico) fica como está, o 2º aparece do jeito CSS de sempre ao lado
dele. `RollState.motor3D` marca a rolagem inteira (não cada dado
individualmente) — usado só pelo `RollOverlay` pra decidir se
desenha o `DadoVisual` CSS do 1º dado ou deixa o canvas físico mostrar
sozinho.

## Fase B3 — Vantagem/Desvantagem pré-declarada também física

Quando `vantagem` já vem definida na CHAMADA de `rolarD20` (ex.:
Desvantagem por armadura sem treinamento — diferente de escolhida
DEPOIS de ver o resultado), `dado3DAtivo` rola os 2 dados juntos
(`box.roll(['1d20','1d20'])`), não só 1. Precisou de um 2º campo,
`RollState.dado2Motor3D`, porque `motor3D` sozinho não bastava mais
pra decidir a UI: uma rolagem pode ter `motor3D: true` com o 2º dado
ainda 2D (post-roll `escolherVantagemPosRolagem`, que não mudou nesta
entrega) — só quando `dado2Motor3D` também é `true` é que o
`RollOverlay` esconde o `DadoVisual` CSS dos DOIS dados; caso
contrário, esconde só o 1º e desenha o 2º normal. `concluirPlano`/
`concluirVantagem` (dentro de `rolarD20`) são os 2 únicos pontos que
fecham uma rolagem 'd20' — usados pelos 4 caminhos (2D simples, 2D
Vantagem, 3D simples, 3D Vantagem) evitando duplicar a lógica de
total/crítico entre eles.

## Fase B4 — 2º dado pós-resultado e reroll físicos

`@3d-dice/dice-box` não publica `.d.ts` — os tipos de `add()`/
`reroll()` em `types/dice-box.d.ts` foram lidos direto do bundle
minificado da lib (`node_modules/@3d-dice/dice-box/dist/
dice-box.es.js`), já que a doc pública não cobre esses 2 métodos.
`DiceBoxResultado` ganhou `[key: string]: unknown` de propósito — o
objeto que a lib devolve em `onRollComplete` tem campos internos
minificados (`rollId`/`groupId`/etc.) que o app nunca precisa NOMEAR,
só guardar inteiro (`RollState.resultadoBrutoD20`) e repassar de volta
pra `reroll()` — casar contra o formato exato desses campos seria
frágil (a lib pode mudá-los numa atualização) e desnecessário.

- **`escolherVantagemPosRolagem`** (Vantagem/Desvantagem escolhida SÓ
  depois de ver o resultado): usa `box.add('1d20')` — diferente de
  `.roll()`, não limpa o dado que já está parado na cena, então o 2º
  cai do lado do 1º.
- **`usarSorte`/`usarInspiracaoHeroica`**: usam `box.reroll(resultadoBruto,
  {remove: true})` pra rerolar FISICAMENTE só aquele dado específico,
  removendo o antigo da cena.
- **Fora de escopo, registrado no Backlog quando for a vez:** reroll de
  DANO (Perfurador) continua 2D — `rolarDados` em si ainda não usa o
  motor 3D pra nenhum tipo de dado (só d20 até aqui), então não tem
  resultado físico pra rerolar ainda.

## Fase B5 — rolagem de DANO também física

`rolarDados` ganhou o mesmo tratamento do d20 (B2/B3), com uma
diferença de UI importante:

- **1 dado só:** esconde o `DadoVisual` CSS igual ao d20 simples — o
  físico é a única coisa visível, sem ambiguidade nenhuma de "qual
  dado" (só existe 1).
- **Grid de 2+ dados:** o grid CONTINUA desenhando os ícones
  normalmente, mesmo com `motor3D: true` — **diferente** do d20/dado
  único. Motivo: pro d20, esconder o CSS evita "2 dados iguais na
  tela" (duplicação); pro grid, os ícones NÃO são duplicação — são a
  UI de ESCOLHER qual dado rerolar (Perfurador). Esconder o grid
  quebraria essa interação (não tem como saber em qual dado FÍSICO
  específico o jogador tocou na tela, a lib não expõe picking por
  clique). Solução: o dado físico cai como reforço visual atrás do
  card, o grid continua sendo a fonte de verdade clicável, com os
  MESMOS valores da física.
- Reroll físico (`rerollDadoEscolhido`/`usarRerollSe1`) segue o mesmo
  `box.reroll(resultadoBruto, {remove:true})` do B4, só que por-dado:
  `DadoIndividual` ganhou `resultadoBruto?: DiceBoxResultado` (grid) e
  `RollState` ganhou `resultadoBrutoDados?: DiceBoxResultado` (dado
  único, espelha `resultadoBrutoD20`) — cada grupo de notação vai pro
  motor como `{qty:1, sides}` (um grupo por dado, nunca `qty:N`), única
  forma de mapear `resultados[i]` de volta pro dado certo do grid.
- Dado d100 usa `sides: 100` (NÚMERO) igual aos outros — ver "d100
  corrigido" abaixo (achado depois de publicado).

## Redesenho do FAB avulso (Fase A) — coluna de botões, sem overlay escuro

O `Dice3dFab.tsx` (ferramenta avulsa) trocou o overlay preto cobrindo a
tela toda por uma coluna de botões que expande do próprio FAB pra
cima, alinhada à direita (`flex-direction: column-reverse` +
`align-items: flex-end`), ordem fixa de baixo (perto do FAB) pra cima:
Múltiplos → d4 → d6 → d8 → d10 → d12 → d20 → d100 → Histórico. Clicar
fora do conjunto (FAB + coluna + popup de log) colapsa tudo — um
`pointerdown` no `document` que ignora cliques dentro de um wrapper
`ref` que embrulha os três. (**Este padrão — "botão flutuante que
expande uma coluna de ações alinhada a ele, sem overlay, fecha ao
clicar fora" — generalizou e vive em `DECISOES-COMBATE.md`.**)

Customização de tema/cor foi REMOVIDA (o Osmar decidiu fixar em vez de
deixar escolher) — tema sempre "default", e cada TIPO de dado tem cor
FIXA própria (`CORES_POR_TIPO`: d4 azul, d6 cian, d8 verde, d10
amarelo, d12 laranja, d20 vermelho, d100 roxo). Pra colorir por tipo
numa MESMA rolagem (ex.: Múltiplos com d6+d20 juntos, cada um com sua
cor), a notação passada pra `box.roll()`/`box.add()` virou array de
objetos `{ qty, sides, themeColor }` em vez de string — confirmado
lendo o bundle minificado que o campo por-grupo (`grupo.themeColor`)
tem prioridade sobre o do nível da rolagem inteira. `dice-box.d.ts`
ganhou `DiceBoxGrupoNotacao`/`DiceBoxNotacao` pra cobrir essa forma
alternativa (`sides` é sempre NÚMERO, ver "d100 corrigido" abaixo — a
1ª versão desta entrega dizia que d100 precisava de `sides: "100"`
STRING, o que estava ERRADO e foi a causa do bug corrigido logo em
seguida).

## d100 corrigido — "só rolava a dezena" (achado testando no celular)

A implementação original (Fase A e o B5) passava `sides: "100"`
STRING pro d100, achando que era o jeito "certo" de pedir um d100 de
verdade — na real, isso ativa um modo DIFERENTE da lib ("d100 de face
única", só a dezena — 0, 10, 20...90, nunca as unidades). Lendo o
bundle do `world.onscreen.js`: com `sides: 100` NÚMERO (sem essa
string), a lib automaticamente soma um d10 físico "escondido" por trás
(não aparece na tela, mas roda a física dele) e devolve pro
`onRollComplete` o valor JÁ somado, 1 a 100 — é assim que se pede um
d100 de verdade nessa lib. Corrigido em `Dice3dFab.tsx`
(`SIDES_POR_TIPO.d100`) e `RollContext.tsx` (`rolarDados`, removida a
função `ladosParaLib` que fazia a conversão errada). **Padrão pra
lembrar:** `sides` de QUALQUER dado nesta lib (incluindo d100) é sempre
NÚMERO puro — nunca precisa de tratamento especial por tipo.

## Reroll físico corrigido — "Inspiração Heroica só troca o número, não rerola"

Achado testando no celular. `onRollComplete`/`getRollResults()`
devolvem 1 objeto por GRUPO de rolagem, NÃO por dado — `.value` do
grupo já é a soma certa (por isso os totais sempre bateram), mas o
`rollId` que `box.reroll()` precisa pra identificar QUAL dado físico
rerolar só existe um nível mais fundo, em `grupo.rolls[0]`. O B4/B5
guardavam o GRUPO inteiro como "resultado bruto"
(`resultadoBrutoD20`/`DadoIndividual.resultadoBruto`/
`resultadoBrutoDados`) — `box.reroll()` recebia esse grupo, não achava
`rollId` no lugar esperado e jogava um erro interno
(`Cannot set properties of undefined (setting 'removeCollectionId')`),
caindo no fallback 2D **silenciosamente**; como `RollState.motor3D`
nunca era resetado nesse fallback, o `RollOverlay` continuava
escondendo o `DadoVisual` CSS — resultado: o número mudava (o 2D
rolava de verdade) mas nada aparecia na tela, física nem CSS.

**Padrão pra lembrar (vale pra qualquer uso futuro de `box.reroll()`):**
nunca guarde o objeto de `onRollComplete` direto — sempre extraia
`grupo.rolls[0]` primeiro (helper `dadoBruto()` em `RollContext.tsx`).
Como cada grupo que este app monta sempre tem `qty: 1` (1 grupo por
dado, ver `especificacaoDados`), isso resolve pra 1 dado OU pra um
grid de N dados ao mesmo tempo — é o MESMO array por posição
(`resultados[i]` ↔ `especificacaoDados[i]`), só precisa ler 1 nível
mais fundo em cada posição, sem lógica separada por caso. Diagnosticado
com um `console.log` temporário dentro do `try/catch` de
`rerolarFisico()` (removido depois de confirmar a causa) — vale como
técnica padrão pra depurar qualquer "cai no fallback silencioso e eu
não sei por quê" nesta lib: um fallback silencioso sem log é opaco até
alguém logar o erro real dentro do catch.

## Vantagem/Desvantagem pré-declarada corrigida — race condition de groupId

Achado testando no celular: "os 2 dados mostraram 16/17 na tela mas o
histórico registrou 16/16". O B3 pedia os 2 d20 como 2 notações
SEPARADAS (`box.roll(['1d20', '1d20'])`). A lib processa cada notação
da notation array com um `forEach` cujo callback é `async` mas nunca é
`await`ado pelo próprio `forEach` — os 2 itens rodam INTERCALADOS, e o
contador interno de `groupId` só incrementa DEPOIS que cada item
termina de processar seus dados. Se as 2 chamadas de "carregar tema"
(mesmo tema, quase sempre já em cache) resolverem próximas o
suficiente, os 2 itens podem ler o MESMO valor de `groupId` antes que
o 1º incremente — só 1 grupo sobrevive em `rollGroupData`, e os 2
dados físicos (cada um com um valor real e diferente) ficam associados
ao MESMO resultado reportado.

**Corrigido eliminando a corrida por completo** (não só reduzindo a
chance dela): trocar as 2 notações separadas por 1 notação SÓ com
`qty: 2` (`box.roll('2d20')`) — vira 1 item só no `forEach`, sem
segundo item pra disputar o contador. Os 2 resultados individuais saem
de `resultados[0].rolls[0]`/`rolls[1]` (ver `DiceBoxResultado.rolls`)
em vez de `resultados[0]`/`resultados[1]`. Validado repetindo a
rolagem 40x seguidas sem nenhuma colisão (contra qualquer chance de
reproduzir via automação antes da correção).

**Risco relacionado, NÃO corrigido ainda** (mesma corrida, superfície
diferente): o modo Múltiplos do avulso (`Dice3dFab.tsx`, 2+ tipos de
dado juntos) e o grid de dano (B5, 2+ dados/grupos) TAMBÉM passam um
array de 2+ itens de notação pra `box.roll()` — a mesma corrida pode,
em teoria, embaralhar valores entre dados de tipos/posições diferentes
nesses casos. Não reproduzido nem reportado ainda; registrado aqui
como ponto de atenção pra abrir como entrega própria se algum dia
aparecer um sintoma parecido nesses fluxos.

## Bug: 2º dado não reconhecido (desde o B4)

Achado testando no celular, Vantagem/Desvantagem escolhida DEPOIS do
resultado. `onRollComplete`/`getRollResults()` devolve TODOS os grupos
vivos na cena desde o último `.clear()` — `box.roll()` limpa
(`this.clear()` no topo da função), `box.add()` NÃO.
`escolherVantagemPosRolagem` usa exatamente `box.add('1d20')` de
propósito (pra não apagar o 1º dado já parado) — mas isso significa
que, quando o 2º dado cai, `resultados` chega com 2 posições: `[0]` é
o grupo VELHO (1º dado, já mostrado antes) e o novo dado (o que acabou
de cair) é sempre o ÚLTIMO da lista. O código lia `resultados[0]` —
pegava o 1º dado de novo, nunca o 2º. Como `Math.max`/`Math.min` de um
valor contra ELE MESMO só devolve esse mesmo valor, o total parecia
"plausível" (igual ao 1º dado) e passou despercebido até o Osmar
comparar o número na tela contra os dois dados físicos visíveis.
Corrigido lendo `resultados[resultados.length - 1]`.

**Mesmo bug, superfície diferente, achado revisando o código:**
`rerolarFisico()` (Sorte/Inspiração Heroica/Perfurador) assumia
`resultados[0]` também — errado quando tem 2+ dados vivos (grid do
Perfurador): `box.reroll()` REAPROVEITA o `groupId` do dado original
(por isso "sabe" que é o mesmo dado), mas o array de resultados ainda
lista TODOS os grupos — o grupo rerolado pode estar em QUALQUER
posição, não só a última. Corrigido achando o grupo certo por `id ===
groupId` do dado original, em vez de assumir posição fixa.

**Padrão pra lembrar (vale pra `box.add()` e `box.reroll()`
igualmente):** depois de qualquer chamada que NÃO seja `box.roll()`
(que limpa tudo), `onRollComplete` devolve o histórico INTEIRO de
grupos da cena, não só o que acabou de mudar — nunca assumir
`resultados[0]`. Pra `add()` (grupo novo, sempre no fim): use o
ÚLTIMO item. Pra `reroll()` (grupo existente, reaproveitado): ache
pelo `id`/`groupId` do dado original.

## Popup reancorado embaixo + botão fechar virou ✕ circular (pedido do Osmar, 2026-09)

`RollOverlay`'s `.overlay` mudou de centralizado pra `align-items:
flex-end` com `padding-bottom`, e o antigo botão "FECHAR" de largura
total virou um círculo `✕` (`position: absolute`, canto superior
direito do card, `.card` ganhou `position: relative` pra isso
funcionar) — libera espaço vertical sem perder a área de toque mínima
(`--touch-target-min`, mesmo padrão do `.back`).

**Ajuste posterior (feedback do Osmar, testando o Golpe Brutal do
Bárbaro):** título comprido (2+ linhas, ex. "Ataque — Ataque Desarmado
(Golpe Brutal)") corria por baixo do ✕. Corrigido separando a área de
toque (`.close`, ainda `--touch-target-min`) do círculo VISÍVEL
(`.closeIcon`, menor, ~28px) — o centro do `.close` agora fica no
VÉRTICE do canto do card (metade fora, metade dentro:
`top/right: calc(var(--touch-target-min) / -2)`), então o título
nunca mais alcança essa região por dentro do card, não importa quantas
linhas quebrar. (**Este padrão — botão circular de canto com área de
toque maior que o círculo visível — generalizou e vive em
`DECISOES-COMBATE.md`.**)

O canvas físico compartilhado (`Dice3dFab.module.css`
`.canvasWrapper`) deixou de ser `inset: 5px` uniforme e virou limites
por lado: topo ~72px (abaixo de onde a barra do nome do personagem
costuma ficar — ela NÃO é fixa/sticky, esse valor é só uma estimativa
razoável, igual o `bottom: 92px` do FAB já fazia) e base ~340px (acima
do card reancorado embaixo). Valores fixos por estimativa, não
calculados dinamicamente — ajustar se algum estado específico do card
(muitas opções ao mesmo tempo) empurrar o topo do card pra além dessa
faixa.

**Efeito colateral do canvas menor — dado ficou minúsculo (achado
testando no celular logo depois):** a lib calcula o tamanho visual do
dado com base no espaço disponível do container (`config.scale`,
padrão `5`) — encolher o canvas pro popup reancorado (acima) também
encolheu o dado sem querer, bem mais do que os ~20% menores que o
Osmar quis. Corrigido passando `scale: 6.2` explícito em
`diceBox3d.ts` (`carregarDiceBox3D`) pra compensar — valor calibrado
visualmente via Playwright (não tem fórmula exata pra "20% menor que
o tamanho antigo", foi ajuste por olho comparando screenshots).
**Padrão pra lembrar:** qualquer mudança futura no TAMANHO do
container do canvas físico (`Dice3dFab.module.css` `.canvasWrapper`)
pode precisar recalibrar esse `scale` junto — os dois não são
independentes nesta lib.

**Falha de init "gruda" pra sempre até recarregar a página (achado
testando no celular: "chama o quadrado preto mas não vem o dado 3D e
puxa o 2D"):** `carregarDiceBox3D()` guarda a promise de `box.init()`
em `carregandoPromiseRef` (singleton, pra não criar 2 instâncias) —
mas se `box.init()` rejeitar por QUALQUER motivo passageiro (ex.:
container com altura momentaneamente 0 durante uma mudança de layout
do navegador mobile, erro de rede pontual), essa `ref` ficava presa na
mesma promise REJEITADA pra sempre — toda rolagem seguinte, na mesma
sessão de página, reusava essa promise já rejeitada e caía pro 2D sem
nunca mais tentar o motor 3D de novo (só um refresh de página
"resolvia"). **Corrigido:** ao rejeitar, a função limpa a própria
`ref` (`promessa.catch(() => { carregandoPromiseRef = null; })`),
então a PRÓXIMA chamada tenta inicializar do zero em vez de reusar o
erro antigo. (**Este padrão — cache de promise "carrega 1x" precisa
limpar a própria ref ao rejeitar — generalizou pra qualquer singleton
loader e vive em `DECISOES-COMBATE.md`.**)

O canvas físico continua cobrindo a tela inteira (precisa do espaço
pra física cair), mas com `pointer-events: none` e SEM fundo — o dado
cai visível por cima do conteúdo normal da Ficha, não mais sobre um
fundo escurecido. Resultado/erro/carregando viraram uma pílula
flutuante fixa no topo da tela, independente de onde a coluna de
botões está. Histórico é a única exceção ao "fecha só clicando fora":
abre como popup central com botão de fechar (✕) explícito, pedido à
parte do Osmar.

Ajuste de cor no caminho: os pills começaram brancos, mas o Osmar achou
estranho contra o resto da tela — viraram `var(--accent)` (mesmo tom do
🎲). **Padrão pra qualquer botão flutuante que "perde a função" quando
seu próprio menu está aberto** (aqui, o 🎲 só fecha nesse momento, não
rola nada): dar um estado visual "afundado"/selecionado nele mesmo, não
só mudar a cor dos itens do menu — aqui virou `.fabAberto` (tom mais
escuro da mesma família, `#1e2a6e`, + `box-shadow: inset` em vez de por
fora, simulando "pressionado").

Achado depois, testando no celular, que virou regra padrão do app
inteiro (não só deste FAB) — ver `DECISOES-DESIGN.md` "Regra padrão:
nenhum toque no app deve virar seleção de texto".

## Dado 3D — cor fixa por tipo também nas rolagens oficiais

Até 2026-09, `CORES_POR_TIPO` (cor fixa por tipo de dado, ex.: d20
vermelho) só existia dentro de `Dice3dFab.tsx` (dado avulso) — as
rolagens OFICIAIS (`RollContext.tsx`: d20 simples, Vantagem/
Desvantagem, dano) nunca passavam `themeColor` nenhum pro `box.roll()`/
`box.add()`, caindo sempre na cor padrão do tema. Corrigido movendo a
tabela pra `diceBox3d.ts` (`COR_POR_LADOS`, indexada por número de
lados — `RollContext` não tem o tipo `TipoDado` do FAB, só `LadosDado`/
`sides` numérico) e usando em todo `box.roll()`/`box.add()` das duas
pontas. **Padrão pra lembrar:** qualquer coisa "decidida uma vez pro
dado 3D" (cor, escala, tema) deve morar em `diceBox3d.ts` desde o
início, não dentro de um dos 2 consumidores (`Dice3dFab.tsx` ou
`RollContext.tsx`) — os dois sempre compartilham o mesmo motor/canvas,
então duplicar (ou esquecer de propagar) a decisão num dos dois lados
é o bug natural que essa arquitetura convida.

## Consolidação do motor de dado 3D (B6) — `lancarGrupos()` central

Pedido do Osmar depois de ver a MESMA classe de bug (adivinhar qual
resultado do `onRollComplete` é o novo) aparecer 2x em lugares
diferentes (`escolherVantagemPosRolagem` e `rerolarFisico`, ver
correções acima) — cada ponto de entrada (`rolarD20`,
`escolherVantagemPosRolagem`, `rerolarFisico`, `rolarDados`, FAB
avulso) reimplementava sozinho "chamar `box.roll`/`add`/`reroll`,
adivinhar a posição certa no array, aplicar cor, cair pro 2D".

**Solução, `lancarGrupos()` em `diceBox3d.ts`:** em vez de adivinhar
por posição (`[0]`/último) ou por `id` conhecido de antemão, a função
tira um SNAPSHOT dos `groupId`s já na cena (`box.getRollResults()`,
método síncrono da lib, não documentado nos tipos que a gente já tinha
— adicionado em `dice-box.d.ts`) ANTES de chamar `roll()`/`add()`; no
`onRollComplete`, filtra e devolve só os grupos que NÃO estavam nesse
snapshot. Isso vale igual pra `roll()` (limpa tudo antes, então
`idsAntes` chega vazio e tudo é novo) e `add()` (só o grupo
recém-criado sobra) — quem chama nunca mais precisa saber qual dos
dois foi usado por trás. Cor por tipo (`COR_POR_LADOS`) também entra
aqui dentro, aplicada a cada grupo antes de mandar pra lib.

**Por que não bastava só "usar sempre o último item"?** Porque
`reroll()` (Sorte/Inspiração Heroica/Perfurador) REAPROVEITA um
`groupId` já existente em vez de criar um novo — pra esse caso "o que é
novo" não existe, o filtro de `lancarGrupos()` não se aplica. Fica de
fora de propósito (migra separado, junto de `rerolarFisico()`).

**Migração incremental, não big-bang:** a função nasceu isolada (B6.1,
sem ninguém chamando ainda) — cada call site (`rolarD20`,
`escolherVantagemPosRolagem`, `rerolarFisico`, `rolarDados`, FAB
avulso) migra na sua própria entrega pequena depois, trocando só a
"cabeça" de cada função sem mudar nada visível.

O núcleo puro (`gruposNovos`, a função de filtro em si, sem depender do
motor 3D de verdade) tem teste automatizado (`diceBox3d.test.ts`) —
`lancarGrupos()` em volta dele não, porque depende do
`@3d-dice/dice-box` de verdade (Web Worker + canvas), mesmo padrão já
aceito pro resto do motor de dado 3D (validado por Playwright manual,
não Vitest).

## Dado 3D — fade automático depois de parar (sem shader por dado)

Pedido do Osmar: o dado físico ficava parado na tela pra sempre até a
próxima rolagem limpar a cena — melhor ele sumir sozinho depois de um
tempo (3s parado, depois 2s de fade até sumir).

**Por que não dá pra fazer fade por dado individual:** `@3d-dice/
dice-box` roda a física/render (BabylonJS) dentro de um Web Worker —
`box.roll()`/`add()`/`reroll()` só mandam mensagens pro worker
(`postMessage`), o app principal nunca tem acesso ao mesh/material de
cada dado pra animar opacidade um por um. O único controle exposto no
lado principal é o `<canvas>` inteiro (um elemento DOM normal).
Contornar isso exigiria estender o protocolo interno do worker (não
documentado, quebra fácil em atualização da lib) — decidido não fazer.

**Solução aceita:** fade no HOST do canvas inteiro (`agendarFadeDados`/
`cancelarFadeDados`, `diceBox3d.ts`), via `opacity`/`transition` direto
no DOM (`getElementById`, não um componente React — evita acoplar um
módulo genérico, usado por 2 consumidores diferentes, ao CSS Module de
um deles). `cancelarFadeDados()` roda antes de qualquer `roll()`/
`add()`/`reroll()` novo; `agendarFadeDados()` roda dentro de TODO
`onRollComplete` de qualquer rolagem (mesmo as que ainda não migraram
pra `lancarGrupos()`, ver B6 acima) — quando um 2º dado assenta antes
do fade do 1º terminar, o timer reinicia do zero pros dois juntos.

**Padrão pra lembrar:** qualquer novo call site do motor 3D (`roll`/
`add`/`reroll`) precisa chamar os dois — `cancelarFadeDados()` antes de
disparar a física, `agendarFadeDados()` dentro do `onRollComplete` —
até que o B6 termine de consolidar tudo em `lancarGrupos()` (que já
chama os dois sozinho).
