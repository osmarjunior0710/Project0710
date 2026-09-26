# DECISOES-FICHA.md

> Decisões de design sobre a **Ficha do personagem** fora do
> Combat — abas Perfil/Atributos/Mochila/Magias, Loja, Equipamento,
> Itens Mágicos, Level Up (overlay em cima da Ficha), auto-save.
> Parte da família `DECISOES-*.md` — ver o índice em
> `DECISOES-DESIGN.md` pra saber em qual arquivo procurar cada
> assunto, e a seção 7 do `CLAUDE.md` pra regra de quando
> registrar uma entrada aqui.
>
> **Este arquivo guarda só padrão/decisão que vai importar de novo no
> futuro** — não é changelog de entrega. Bug já corrigido, ajuste
> visual pontual e narração de "fiz X, testei Y" não entram aqui: o
> código funcionando é a prova; o Git guarda o histórico.

---

## Descansos — pertencem à aba Perfil, não à aba Combat

**Decisão:** botões de Descanso Curto/Longo ficam na aba Perfil —
descanso não é uma ação de turno, é algo que acontece entre/depois de
combates. Mantém a aba Combat focada em "o que eu faço agora, no meu
turno".

## Level Up — toda escolha de ASI passa por uma tela de confirmação com "valor atual → valor novo"

**Decisão:** qualquer talento que conceda Aumento no Valor de Atributo
(`concedeAsi.tipo !== 'nenhum'`) sempre passa pelo passo extra
`'asiAtributo'` do Level Up, mesmo quando só existe 1 atributo possível
(`escolha-unica` com 1 atributo só). Nesse caso a única opção já vem
pré-selecionada (nada pro jogador escolher de verdade), mas a tela
ainda mostra "Atributo valor-atual → valor-novo" antes de confirmar —
nunca aplica o +1 em silêncio sem o jogador ver a mudança.

**Por quê:** o jogador precisa de referência de quanto o atributo vai
subir antes de confirmar, mesmo quando não há escolha real — aplicar
direto sem tela (como acontecia antes) deixava sem contexto o que
mudou. O mesmo padrão vale pra qualquer talento com ASI daqui pra
frente, incluindo os que ainda serão implementados.

## Ficha — nada é editável livremente depois de salva

**Decisão:** não existe distinção "editável sem XP" vs. "travada com
XP" (existiu no protótipo inicial, removida por simplificar demais
sem ganho real). Depois que o personagem é salvo, nada é editável
livremente — toda mudança passa pelo fluxo oficial (Level Up,
Mochila, Descanso). Não há hoje campo de texto/número solto editável
na Ficha; tudo é calculado a partir da seleção + progressão.

**Pendência conhecida:** isso ainda não é bloqueio funcional de
verdade em todo canto, é a regra assumida pelo design da tela.

## Tabbar da Ficha vira pill flutuante — padrão a repetir

**Decisão:** barra de abas (Perfil/Mochila/Magias/Combat) é uma pill
flutuante centralizada (`position: fixed`, sombra), não uma faixa
fixa de largura total no rodapé — mesmo padrão já usado nas pills
Voltar/Avançar do wizard. **Padrão a repetir** pra qualquer navegação
fixa futura no app: 2ª vez que uma barra de largura total virou pill
flutuante (a 1ª foi o rodapé do wizard).

## Ficha lê o personagem real via componente filho, não early return antes dos hooks

**Decisão:** `FichaShell.tsx` é dois componentes — o de fora só busca
o personagem pelo `:id` e decide entre "não encontrado" ou renderizar
`FichaConteudo`, que recebe o `PersonagemSalvo` já garantido como
prop e só aí chama hooks.

**Por quê (gotcha reaproveitável em qualquer tela nova que dependa de
um recurso buscado por rota):** um `if (!x) return (...)` **antes**
de hooks no mesmo componente quebra a Regra dos Hooks do React (hooks
precisam rodar sempre na mesma ordem) — bug sutil de estado
bagunçado, não erro óbvio. Separar em dois componentes resolve limpo.

## Mochila — decisões de arquitetura consolidadas

**Peso desconhecido vira aviso, nunca 0 silencioso** — quando um item
não tem peso cadastrado pra aquele nome exato, a Mochila mostra "sem
peso cadastrado" na linha e soma quantos itens ficaram de fora do
total ("N itens não entram nessa soma"), em vez de fingir peso 0.
Regra geral do projeto (nunca inventar dado que a planilha não tem)
aplicada dentro do motor de cálculo, não só na importação.

**Kits desagregam nos itens de dentro** — "Kit de X" nunca aparece
como 1 linha; `core/mochila.ts` já desagrega ao montar a lista (cada
componente vira item real, com peso/descrição próprios), verificado
contra a aba **"Kits — Conteúdo"** da planilha (mais confiável que
texto livre "Contém:" solto em outras abas). Kit sem lista de itens
nessa aba (Curandeiro, Escalada) é item único, não desagrega.

**Mochila é estado de verdade, não cálculo derivado a cada render:**
`FichaShell.tsx` inicializa da seleção 1 vez, depois só muta
(+/-/remover/adicionar), auto-save persiste. Cada item tem `id`
estável (não índice de array — quebraria ao remover). Categoria de
origem (Origem/Classe/Loja/Manual) é só metadado, não controla mais
agrupamento visual — tudo numa lista só.

**Padrão de ação destrutiva:** `-` de quantidade trava em 0 (não
apaga a linha sozinho); remover exige confirmação em 2 toques (1º
toque vira "confirmar 🗑" por 3s, 2º remove) — evita perder item por 1
toque errado sem precisar de modal separado. Mesmo padrão vale pra
qualquer ação destrutiva frequente no app.

**Agrupada em categorias fixas** (Armas / Armadura+Escudo / Jóias e
Artefatos / Outros, via `categoriaMochila` — reaproveita
`identificarEquipamento`, ver "Equipamento" abaixo), grupo vazio fica
invisível (não aparece como cabeçalho sem itens). "Jóias e Artefatos"
fica sempre vazio até existir dado de item mágico com categoria
própria.

**Faixas de cor da barra de peso** (mesma função usada por Loja e
Mochila, `corDaCarga`): até 75% verde, até 85% amarelo, até 95%
laranja, até 100% vermelho, acima de 100% vermelho escuro. O
percentual usado pra decidir a cor não é limitado a 100 (precisa
saber se passou do limite); só a LARGURA da barra é.

**Data/origem:** 2026-08, plano de Equipamento E1 + ajustes.

## Avatar → menu de preferências (Itens detalhados / Peso da Mochila)

**Decisão:** ícone 👤 no cabeçalho da Ficha abre um dropdown M3 com
switches de preferência de exibição — hoje 2: "Itens detalhados"
(mostra descrição de cada item sempre visível, em vez de popup ⓘ) e
"Peso da Mochila" (mostra/esconde a caixa de Carga + coluna de peso
juntas). Estrutura em lista (`.map()`), pensada pra crescer sem
precisar de outro ponto de entrada na tela.

**Gotcha reaproveitável:** overlay `position: fixed` renderizado
dentro de um elemento clicável precisa de `stopPropagation` no clique
de fechar, senão o clique vaza pro elemento pai — já apareceu 3x
(`InfoValor`, `InfoChip`, `ItemComDescricao`) antes de virar hábito
de checar em todo componente de popup novo.

**Pendência conhecida:** preferência não persiste entre sessões
(reseta ao recarregar) — estado local por ora.

**Data/origem:** 2026-08.

## Apagar personagem — dupla confirmação no próprio botão (revertido de "digitar a palavra", 2026-09)

**Decisão atual:** 1º toque no 🗑️ arma o botão (vira "Confirmar",
vermelho/texto branco); 2º toque no MESMO botão apaga de vez. Qualquer
outro toque na tela desarma sem apagar.

**Padrão reaproveitado em qualquer outra exclusão do app** (não só
personagem) — ex.: remover Pet na aba Pets (`PetsTab.tsx`, 2026-09).
Antes de criar um `window.confirm`/modal novo pra qualquer exclusão
futura, use esse mesmo botão de 2 toques.

**Histórico:** a versão anterior pedia digitar a palavra "apagar" num
modal, justamente pra evitar confirmar no automático sem querer — o
Osmar pediu a troca de volta pra um fluxo de 2 toques mais rápido,
ciente de que fica mais fácil de apagar sem querer que digitar uma
palavra. Se isso virar problema de novo, a solução anterior (modal +
palavra digitada) já está no histórico do Git pra recuperar.

## Capacidade máxima de carga — Força × 7 kg (Pequeno/Médio)

**Fato de regra confirmado na planilha** (aba "Glossário de Regras",
tabela oficial por Tamanho — Minúsculo ×3,5, Pequeno/Médio ×7, Grande
×13,5, Enorme ×27, Colossal ×54,5 kg). Toda espécie jogável hoje é
Pequeno ou Médio (mesmo multiplicador), então o código não lê o campo
Tamanho de verdade ainda — só vai precisar quando espécie Grande ou
traço "Porte Poderoso" (Golias) for suportado.

## Loja — decisões de arquitetura consolidadas

**Catálogo real, agrupado por categoria** (Armas/Armadura/Escudos/
Ferramentas/Instrumentos/Focos/Munição/Equipamento de Aventura, cada
categoria em acordeão colapsável), item com layout de campos
específico pro tipo (arma: Dano/Propriedades/Mod. Ataque; armadura:
CA/Furtividade; ferramenta: Atributo). "Kits" (nome começa com "Kit
de ") ganharam categoria própria, separada de Equipamento de
Aventura, com popup de descrição — resto do catálogo mostra a
descrição direto no card, sem popup.

**Comprar/vender com estepper** (`ItemCarrinho[]`, não mais
`string[]` empurra-só) — ouro restante recalculado a cada render,
nunca dessincroniza. Moeda: 1 PO = 10 PP = 100 PC (regra confirmada,
planilha não tem tabela — combinada com o Osmar).

**Mod. de Ataque calculado de verdade:** maior entre FOR/DES se a
arma tiver Acuidade, senão DES pra à Distância e FOR pra Corpo a
Corpo; soma Bônus de Proficiência se a classe for proficiente na
categoria (lido de `proficienciasArmaArmaduraClasse.ts`, dado real).

**"Você já está levando" (Origem/Classe)** — caixas mostrando o que
já foi concedido antes de qualquer compra, reaproveitando
`calcularItensIniciais` (mesma fonte que já monta a Mochila da
Ficha — nada duplicado). Cabeçalho de ouro/peso fica `sticky` ao
rolar.

**Fora de escopo por decisão explícita do Osmar:** desconto de
Talento Artificeiro, corte de itens acima de 205 PO.

**Data/origem:** 2026-08, Entrega A5 + 2 rodadas de ajuste
(referência: prints de um protótipo HTML anterior do Osmar).

## Equipamento — mecanismo de equipar/CA/Atacar/Sintonização

**Identificação por catálogo, não suposição:** `core/equipamento.ts`
cruza o **nome** do item da Mochila contra os catálogos reais
(armas/armaduras) pra saber o tipo — item sem match (ração, item
mágico sem categoria própria) não ganha controle de equipar.

**Exclusividade de slot, derivada de "é a mesma mão física", não
hardcoded por nome de item:** equipar em slot ocupado libera o outro
item automaticamente; arma de Duas Mãos ocupa Mão Principal E libera
Mão Secundária/Escudo; Escudo e Mão Secundária se excluem entre si;
arma Versátil empunhada com 2 mãos (toggle próprio) segue a mesma
regra de "ocupa a Mão Secundária" e usa o dado maior da propriedade
(`Versátil (1d10)`).

**CA/Atacar leem o equipamento de verdade** (não mais a opção A/B/C
do wizard) — Armadura/Escudo iniciais já nascem equipados
automaticamente (primeira Armadura/Escudo da lista inicial), Arma
NÃO (fica sempre escolha explícita na Mochila). Sem nada equipado,
Ataque Desarmado real entra no lugar de fixture.

**Regras de D&D confirmadas contra o livro (Cap. 1/3/5/6, Apêndice
C), relevantes pro cálculo:** Acuidade permite usar FOR ou DES, o
maior; Ataque Desarmado = 1 + mod. FOR de dano Contundente + Bônus de
Proficiência no acerto; propriedade **Leve** permite 1 ataque bônus
com OUTRA arma Leve na Mão Secundária, sem somar mod. de atributo no
dano desse ataque extra (a menos que seja negativo) — é regra de
ATAQUE, não de equipar (duas armas não-Leve continuam podendo ser
equipadas ao mesmo tempo, só não geram o ataque bônus); Sintonização
vale pra qualquer item mágico (arma/armadura/escudo/acessório), não só
"acessório"; Escudo ocupa fisicamente uma mão.

**Sintonização — limite de 3, boolean derivado de texto livre da
planilha:** a coluna real tem 26+ variantes de texto pra "sim"/"não"
— regra aplicada: só é `false` quando o texto começa com "não"/"nao",
qualquer outra coisa vira `true` (inclui "Opcional..." — sintonizar
dá bônus extra). Texto original preservado à parte pra conferência
manual.

**Proficiência com arma real (resolvido no B0 do Bruxo):**
`core/proficienciaArma.ts`'s `classeProficienteComArma(classe, arma)`
lê a coluna "Proficiência com Armas" de `proficienciasArmaArmaduraClasse`
(texto livre) e resolve contra `arma.categoria`/`arma.propriedades` —
sem Bônus de Proficiência se a classe não for proficiente (a regra
real só tira o bônus, não trava o ataque). Padrões cobertos: "Simples
e Marciais" (tudo), "Simples" sozinho, e as 2 exceções por propriedade
já confirmadas na planilha (Ladino: Acuidade OU Leve em qualquer
Marcial; Monge: Leve só em Marcial Corpo a Corpo) — mesma função serve
sem mudança quando essas 2 classes forem importadas. Sem entrada pra
uma classe = não proficiente, nunca assume.

**Data/origem:** 2026-08, plano de Equipamento E2-E4 completo +
verificação de schema contra PDFs reais em chat paralelo.

## Itens Mágicos — catálogo + Sintonizar na Mochila

**Catálogo real** (288 itens, aba "Itens Mágicos" da planilha —
"Itens Mágicos Inteligentes" e "Artefatos" ficam de fora por ora, só
entram se fizerem falta numa mesa real). Botão "✨ Sintonizar" aparece
em qualquer item da Mochila cujo nome bata com o catálogo; popup ⓘ
mostra Categoria/Raridade/Efeito Resumido automaticamente, sem UI
nova — reaproveita o popup que toda linha da Mochila já tinha.

**Testar sem tela de "receber item":** "Adicionar item" (nome livre,
já existia desde a Mochila virar estado de verdade) reconhece
automaticamente um item mágico se o nome bater exatamente com o
catálogo — não precisou de feature nova pra simular ganhar um item.

**Data/origem:** 2026-08.

## Perfil — 18 Perícias completas, Pau pra Toda Obra, Bônus de Proficiência

**Decisão:** todas as 18 perícias sempre aparecem (não só as
proficientes), marcador ⚫ proficiente / ⚪ sem proficiência / ⭐ extra
pra Especialista. Prioridade de bônus por perícia: Especialista
(dobrado) > proficiente (inteiro) > Pau pra Toda Obra (metade,
arredondado pra baixo) > nenhum — ordem que vale pra qualquer classe
com essas características combinadas.

## Magia de item vs. magia natural — sistemas separados

**Decisão:** magia de item mágico (bastão, anel com cargas) não entra
na aba Magias nem em `personagemConjura()` — vive como item com
contador de cargas na Mochila, usado pela ação **"Usar Objeto"**
(distinta de "Usar Magia" no Cap. 1 do livro — distinção que já é do
jogo, não invenção de design). Resolve de graça o caso de
não-conjurador com item mágico, sem lógica de exceção.

`personagemConjura()` só responde "tem fonte PRÓPRIA de conjuração?"
— 3 fontes possíveis: classe atual (implementado), multiclasse
(pendência), Talento de Origem que concede magia (pendência, origens
ainda indisponíveis no wizard).

## Aba Magias sempre visível, nunca escondida por classe

**Decisão:** não-conjurador vê estado vazio, a aba não some —
consistência de navegação (mesma aba sempre no mesmo lugar) vale mais
que economizá-la, e evita quebrar em multiclasse (visibilidade
derivada de `personagemConjura()`, nunca hardcoded por classe).

## Aba Magias tem conjuração de verdade, não só a aba Combat

**Decisão:** truques/magias preparadas na aba Magias têm botão "Usar"
de verdade (reaproveita o mesmo mecanismo do painel de Ação do
Combat — `EscolherCirculoShell`, `gastarSlotCirculo`,
`modAcertoConjuracao`, tudo já existia, só passado como prop pra
mais um lugar) — jogador pode conjurar fora do fluxo estrito de turno
de combate (uso utilitário fora de sessão de luta).

## Ficha — auto-save de progresso via `useEffect`, não save manual por handler

**Decisão:** um único `useEffect` observando os campos que importam
(nível, PV, recursos gastos, equipamento, etc.) salva o personagem
sempre que mudam — não uma chamada de save espalhada em cada handler.

**Por quê:** salvar manualmente logo após um `setState` captura o
valor ANTIGO (setState é assíncrono) — exigiria duplicar cálculos só
pra montar o objeto certo a cada handler novo. O `useEffect` roda
depois do re-render, com o valor atualizado, e cobre qualquer ponto
de mudança futuro de graça, sem precisar lembrar de adicionar a
chamada em handlers novos.

**O que fica de fora de propósito:** estado do turno atual (Ação/
Bônus/Reação usada) não persiste — é esperado resetar como qualquer
app de mesa físico.

## Level Up — rolagem de dado de vida é definitiva e sobrevive a fechar/reload

**Decisão:** ao escolher "Rolar" o dado de PV, uma tela cheia preta
dedicada (não o `RollOverlay` genérico — aquele é feito pra ser
dispensável por toque fora, esse não pode) mostra a animação e o
resultado definitivo; depois disso o passo trava, sem card de escolha
de novo. O estado (`levelUpHpModo`/`levelUpHpRolado`) vive em
`FichaShell.tsx`, não no `LevelUpShell` — sobrevive a fechar a tela
inteira e reabrir, trocar de aba, e F5, porque entra no mesmo
mecanismo de auto-save geral; só zera quando o Level Up é confirmado
de verdade.

**Padrão reaproveitável:** qualquer rolagem "de uma vez só, sem
volta" (não cancelável) não deve reusar o `RollOverlay` genérico —
merece tela própria; e qualquer estado que precise sobreviver a
fechar/reabrir um fluxo (não só navegar dentro dele) precisa subir
pro componente pai que já tem auto-save, não ficar em `useState`
local do fluxo.

**Data/origem:** 2026-08.

## Level Up — 3ª opção de PV (Valor manual) e XP separado do "raio" de teste

**Valor manual (PV):** além de "Usar a média fixa" e "Rolar", existe
"Valor manual" — pra quando o dado de vida já foi rolado numa sessão
de mesa antes de existir a ficha digital. Mesmo mecanismo de trava do
"Rolar" (ver decisão acima: uma vez confirmado em "Avançar", o passo
mostra o resultado travado, sem chance de editar de novo) — a única
diferença é a origem do número (digitado, validado entre 1 e o máximo
do dado da classe, em vez de sorteado). **Padrão:** o valor digitado
fica num buffer de texto local (não escreve no estado persistido
`hpRolado`/`levelUpHpRolado` até "Avançar" confirmar que é válido) —
evita que o card "trava" (que verifica só `hpRolado !== null`) feche
o campo de digitação no meio do usuário ainda ajustando o número.

**XP separado do Level Up Rápido:** a aba Atributos tinha um único
card "nível atual" com 2 botões — ⬆️ (abre o fluxo normal de Level
Up, sempre disponível) e ⚡ (sobe 1 nível sorteando tudo, ferramenta
de teste). Viraram 2 conceitos independentes (pedido do Osmar,
2026-09):
- **⬆️ agora É gated por XP de verdade** — só aparece quando o XP
  acumulado bate o marco do próximo nível (`core/experiencia.ts`,
  regra real em `DND-Regras.md`). A área abaixo dela é uma "barra de
  XP" clicável (todo o chip, não só um botão) que abre
  `XpShell.tsx` — popup pra digitar um valor e Adicionar/Remover
  (nunca "definir" direto, porque o jogador pode ter digitado
  errado da 1ª vez; Remover desfaz).
- **⚡ virou "Inst. Level Up"** e mudou de tela — saiu do card da aba
  Atributos e foi pro menu do avatar (`AvatarMenu.tsx`, onde já mora
  o "🎲 Modo de Teste"), como uma linha de ação (não um toggle). Faz
  exatamente o mesmo sorteio de antes, ignorando XP de propósito —
  continua sendo ferramenta de teste, não regra de jogo.

**Por que separar:** XP acumulado é dado real de progressão (pode
persistir, pode ser consultado depois); o raio é uma ferramenta de
desenvolvimento/teste. Misturar os dois no mesmo card confundia qual
dos 2 é "a regra" e qual é "atalho de teste" — agora a UI já deixa
isso implícito pela localização (card principal vs. menu de
preferências/teste do avatar).

**Data/origem:** 2026-09, pedido do Osmar.

## Ferramenta de teste — snapshot por nível (voltar/avançar pra testar a build)

**Pergunta do Osmar:** dá pra ir até o nível 20 testando, voltar pra
um nível anterior pra arrumar algo, sem perder o progresso de teste
dos níveis mais altos?

**Decisão:** `PersonagemSalvo.snapshotsNivel` guarda uma cópia
completa do personagem na 1ª vez que ele alcança cada nível (1 a 20).
Restaurar um nível (menu do avatar → "🕰️ Voltar pra nível") sobrescreve
o personagem inteiro com essa cópia e recarrega a página — **apaga os
snapshots dos níveis ACIMA do escolhido** (ex: foi até o 15, voltou
pro 12, os snapshots de 13/14/15 somem; subir de novo a partir do 12
cria snapshots novos pra eles). É ferramenta de teste, não regra de
jogo — mora no menu do avatar, junto com "🎲 Modo de Teste"/"⚡ Inst.
Level Up".

**Padrão técnico:** o estado do `useState` de qualquer dado derivado
de "reler algo de fora" (aqui, `personagemSalvo` — recomputado via
`armazenamentoPersonagens.buscar(id)` no topo do componente, a cada
render) **precisa de `useState` próprio** se outro código depender
dele para "acumular" ao longo de várias atualizações seguidas — nunca
usar o valor relido de fora como base de merge dentro de um efeito.
Motivo real encontrado: `personagemSalvo` é uma referência NOVA a
cada render (nunca memoizada), e usá-lo direto como fonte de
"snapshots já existentes" dentro do efeito de auto-save perdia o
snapshot do nível anterior sempre que 2 níveis eram alcançados em
sequência rápida (ex: "⚡ Inst. Level Up" clicado várias vezes
seguidas) — o efeito do 2º nível via `personagemSalvo.snapshotsNivel`
vazio mesmo com o localStorage já tendo o do 1º. Corrigido dando ao
snapshot seu próprio `useState` (mesmo padrão de todo o resto do
estado persistido no componente), inicializado 1x de
`personagemSalvo.snapshotsNivel` no mount.

**Restauração é reload de página, não reset de `useState` na mão:**
como o mount já sabe ler cada campo persistido corretamente (dezenas
de `useState(personagemSalvo.x ?? default)`), reaproveitar isso via
`window.location.reload()` depois de sobrescrever o personagem salvo é
mais simples e confiável do que duplicar essa lógica de inicialização
num "resetar tudo na mão".

**Data/origem:** 2026-09, pedido do Osmar.

## Popup de rolagem (RollOverlay) mostra a quebra do modificador via InfoValor reaproveitado

Pedido do Osmar (B7, `EmDev.md`): o popup de resultado (`RollOverlay`)
mostrava só a fórmula já somada (`1d20 + 7`) — sem dizer de onde vinha
o `+7`. Em vez de desenhar uma tabela nova dentro do card, o popup
reaproveita o `InfoValor` (ícone "ⓘ" + popup com linhas
label/valor + total) que já existia pro CA/perícia/salvaguarda/
iniciativa — mesmo tipo `ExplicacaoCalculo` (`core/
calculoPersonagem.ts`), passado agora também como `RollD20Options.
explicacaoMod`/`RollState.explicacaoMod`.

**Layout (chapéu de UX, não só encanamento):** total grande continua
sendo a resposta principal; a fórmula pequena (secundária, "como
cheguei nele") desceu pra ABAIXO do total (antes ficava acima) e
ganhou o ⓘ do lado. Sem `explicacaoMod` (rolagem que ainda não tem a
quebra pronta, ex.: ataque com arma antes da Entrega 3/4 do B7), o ⓘ
simplesmente não aparece — só a fórmula simples, comportamento
idêntico a antes.

**Padrão pra lembrar:** qualquer rolagem de d20 nova que já tenha um
`ExplicacaoCalculo` calculado em algum lugar (mesmo que só pro ⓘ de
outra tela) deve passar esse MESMO objeto pra `explicacaoMod` — nunca
recalcular ou duplicar a conta só pra alimentar o popup de rolagem.

## PV Máximo precisa recalcular retroativamente quando o mod. de Constituição muda depois da criação

**Achado (foco Bárbaro, Campeão Primitivo — ver `aprendizados/classes/barbaro.md`):**
PV Máximo é um acumulador persistido (`pvMax`), incrementado 1x por
Level Up — nunca recalculado do zero a partir dos atributos atuais.
Isso significa que QUALQUER coisa que aumente o mod. de Constituição
depois de um nível já ganho (Aumento no Valor de Atributo em
Constituição, uma característica de espécie tipo Tenacidade Anã, ou
Campeão Primitivo) precisa de um ajuste retroativo explícito — sem
isso, o PV Máximo fica baixo pra sempre, como se o mod. novo só
valesse a partir de agora. Isso era um bug pré-existente antes do
Bárbaro (nenhum ASI em CON nunca ajustava PV retroativo, nem o ganho
do PRÓPRIO nível do ASI, que usava o mod. antigo).

**Função única e correta, reaproveitável por qualquer fonte de mudança
de CON:** `core/pvRetroativo.ts`'s `ajustarPvMaximoPorMudancaDeCon(pvMaxAtual,
conModAntigo, conModNovo, nivelTotalComEsseNivel)` = `pvMaxAtual +
(conModNovo − conModAntigo) × nivelTotalComEsseNivel` —
matematicamente idêntico a recalcular tudo do zero, porque a parcela
"dado de vida" de cada nível nunca dependeu de Constituição, só a
parcela "mod. CON × nível". O multiplicador é o nível total INCLUINDO
o nível que acabou de ser ganho nesse mesmo Level Up (mesmo quando é
esse próprio Level Up que mudou o CON), porque o ganho de PV desse
nível já foi calculado com o mod. ANTIGO antes de qualquer ASI do
mesmo nível ser aplicado.

**Regra pra qualquer fonte futura que altere Constituição depois da
criação:** sempre chamar essa função (nunca inventar um ajuste
pontual/local) nos dois lugares que resolvem Level Up
(`FichaShell.tsx`'s `confirmarLevelUp`, que cobre tanto o fluxo real
quanto "⚡ Inst. Level Up", e `core/geradorPersonagemTeste.ts`, que
simula toda a progressão de uma vez).

## Pills configuráveis de info de magia — preferência por conta, componente único pra todas as telas

**Decisão:** quando uma linha de lista (magia/truque, aqui; qualquer
outra lista de "cards com selos" no futuro) ganha vários selos de info
opcionais, a config de quais aparecem é UM componente único usado em
TODAS as telas que mostram aquela lista — nunca 1 componente de pill
por tela. Aqui, `PillsMagia` (recebe `magia`, `classe?`, `preferencias`)
substituiu o `PillClasse` isolado nos 4 lugares que mostravam magia
(aba Magias x2, Reação, "Usar Magia" em Combate); qualquer pill nova
(ex.: se a planilha ganhar mais um campo estruturado) entra só nesse
componente, sem tocar nas 4 telas.

**Preferência é por conta/aparelho, não por personagem** (mesmo padrão
de `houseRules.ts`/"Dado 3D"): `core/preferenciasPillsMagia.ts`
(armazenamento) + hook `usePreferenciasPillsMagia` + grupo de toggles
no menu de preferências (ícone 👤, `AvatarMenu.tsx`) — o jogador quer
ver a mesma config em qualquer personagem que abrir no mesmo celular.

**Texto livre vira pill só depois de extração** (`core/pillsMagia.ts`):
`tempoConjuracao`/`duracao` na planilha têm frase inteira em vários
casos (ex.: "Reação, que você executa quando..."), não dá pra exibir
direto — `resumoTipoAcao`/`resumoDuracao` reduzem pro rótulo curto
("Reação", "1h", "Conc. 1min"). Campo já curto/estruturado
(`ataqueOuSalvaguarda`, `escola`) usa o valor puro sem extração.
`componentes` (1 string "V, S, M (...)") vira 3 booleans
(`componentesVSM`) pra virar 3 pills independentes.

**Tela que já agrupa pelo mesmo campo suprime aquele pill, mesmo com a
preferência ligada:** `SelecionarMagiaShell` (agrupa por círculo no
cabeçalho) força `circulo: false` na cópia de preferências que passa
pro componente — repetir o círculo em toda linha, com o cabeçalho já
dizendo, é ruído. Cada tela decide isso, o componente central não.

**Linha com várias pills precisa de `flex-wrap: wrap`**, não só
`display: flex` — com o jogador podendo ligar bastante pill ao mesmo
tempo, uma linha sem wrap estoura a largura do celular
(`MagiasTab.module.css` `.spellRowComPillLinha2`,
`ReacaoPanelContent.tsx` inline).
