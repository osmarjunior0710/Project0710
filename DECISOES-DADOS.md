# DECISOES-DADOS.md

> Decisões de design sobre a **camada `data/`** — schema de
> import da planilha mestra (Origens/Espécies/Classes/Magias/
> Talentos), padrão de pasta/formato, correções de planilha.
> Fato de regra de D&D já confirmado (não decisão de design) vai
> em `DND-Regras.md`, não aqui — ver seção 3.1 do `CLAUDE.md`.
> Parte da família `DECISOES-*.md` — ver o índice em
> `DECISOES-DESIGN.md`, e a seção 7 do `CLAUDE.md` pra regra de
> quando registrar uma entrada aqui — e pro critério de "isso é
> padrão reaproveitável ou changelog de entrega" que mantém este
> arquivo pequeno.

---

## Padrão de import: 1 pasta, 1 formato por categoria

`data/rulesets/dnd2024/` recebe um arquivo por categoria (`origens.ts`,
`talentos.ts`, `ferramentas.ts`, `magias.ts`, `classes.ts`, ...), todos
exportando um array no mesmo padrão de objeto, indexado por `id`. Evita
que cada categoria de dado vire "um jeito diferente de importar".

## Catálogo grande liberado aos poucos — cards "(em breve)"

Quando só parte de um catálogo (Origens, Espécies, Classes...) está
selecionável de verdade, os itens restantes aparecem visíveis na
lista, mas não-selecionáveis: tag "(em breve)" no card +
`pointer-events`/`btn-disabled`. Mesmo tratamento nas 3 categorias já
usadas — reaproveitar sempre que um catálogo grande for liberado
item a item em vez de tudo de uma vez. O que falta pra liberar cada
item específico vive em `PENDENCIAS.md`, não aqui.

## Talento referenciado por Origem entra na mesma leva, não depois

Quando uma categoria é referenciada por um campo obrigatório de outra
que já está sendo importada (ex: toda Origem aponta pra 1 Talento de
Origem fixo), importe as duas juntas — nunca deixe a categoria
referenciada pra uma entrega futura separada. Sem isso, o campo vira
um nome solto sem descrição/efeito de verdade conectado. Vale pro
próximo caso parecido (ex: Subclasse referenciando característica
ainda não migrada).

## Item de Origem/Classe nasce no formato de Mochila

Equipamento concedido por Origem ou Classe usa a mesma estrutura de
item que a aba Mochila espera (nome, quantidade, peso, categoria), com
uma tag `origemDoItem` (antecedente / classe / loja). Esses itens vão
parar de verdade no inventário do personagem — não são texto
decorativo do wizard. Uma estrutura de item única evita reimplementar
"o que é um item" em três lugares diferentes (origem, classe, loja).

## Confirme uniformidade real, campo a campo, antes de assumir schema comum

**Origens (16):** schema uniforme de 1 camada só, sem exceção (3
atributos, 1 talento, 2 perícias, 1 ferramenta, 2 opções de
equipamento) — confirmado campo a campo na planilha antes de
importar. 5 das 16 (Artista, Artesão, Guarda, Nobre, Soldado) têm 1
campo de ferramenta que é um GRUPO de escolha (Instrumento Musical,
Kit de Jogos, Ferramentas de Artesão), não um item fixo — **regra de
UI decorrente: nunca mostrar só "(escolha)"**; a tela lista os itens
concretos do grupo (ex: Alaúde, Flauta, Gaita de Foles...) como cards
individuais tocáveis, igual a qualquer outra escolha do wizard. A
escolha fica em `WizardSelection.ferramentaOrigemEscolhida`, e o
wizard bloqueia "Avançar" até ela ser feita (mesmo mecanismo de
validação bloqueante do `DECISOES-DESIGN.md`).

**Classes (12) NÃO repetem essa uniformidade** — schema em 3 camadas:
(1) núcleo 100% universal (atributo primário, dado de vida, 2
salvaguardas, nível de subclasse sempre 3 nas 12 classes, Bônus de
Proficiência e níveis de ASI compartilhados globalmente); (2) array de
`recursos` — toda classe tem ao menos 1, mas formato varia (ver as 4
famílias abaixo); (3) características por nível, lista solta, não
generaliza. **Padrão geral: nunca assuma que a uniformidade de uma
categoria se repete na próxima — confirme direto na planilha antes de
desenhar o schema.**

**4 famílias de recurso de Classe** (referência pra quando cada classe
for importada):
- **Conjurador completo** (Bardo, Clérigo, Druida, Feiticeiro, Mago):
  truques + magias preparadas + espaços por círculo (1º-9º), recupera
  no Descanso Longo.
- **Conjurador parcial/meio-conjurador** (Guardião, Paladino): mesma
  estrutura, só até 5º círculo. A tabela (Magias Preparadas + Espaços
  de Magia, níveis 1-20) é **idêntica número por número entre as
  duas**, conferida linha a linha na planilha — compartilham 1 arquivo
  (`progressao-meio-conjurador.ts`) em vez de duplicar. "Magias
  Preparadas" não é fórmula simples (não é "nível/2 + mod") — é
  progressão irregular da tabela oficial, sempre importar como valores
  de tabela, nunca calcular.
- **Conjurador com regra própria** (Bruxo): Magia de Pacto, recupera no
  Descanso Curto (ver `DECISOES-COMBATE.md`).
- **Recurso não-mágico com banco** (Bárbaro: Fúrias; Guerreiro:
  Recuperar Fôlego; Monge: Pontos de Foco; Feiticeiro: Pontos de
  Feitiçaria além da magia).
- **Sem banco, só bônus crescente** (Ladino: Ataque Furtivo; Monge:
  Artes Marciais) — não é "gasta e recupera", é valor que sobe com o
  nível.

Guerreiro foi o piloto de Classes por usar a família mais simples (só
Recuperar Fôlego, sem conjuração, sem subclasse até nível 3).

**Espécies (10):** 5 têm sub-escolha além dos traços fixos (Herança
Dracônica, Linhagem Élfica, Linhagem Gnômica, Ancestralidade Gigante,
Legado Ínfero) — schema genérico com campo `natureza`, que **não é a
mesma coisa** pras 3 variantes encontradas:
- `identidade_permanente` — escolhida 1x na criação, nunca muda, é
  "quem o personagem é" (Draconato, Golias).
- `linhagem_com_progressao_magica` — escolhida 1x, mas desbloqueia
  magia automática nos níveis 3 e 5 (Elfo, Tiferino; Gnomo só nível 1).
  Precisa "conversar" com o motor de level-up pra desbloquear sozinha
  nesses níveis — não é escolha manual do jogador.
- `escolha_reutilizavel` — escolhida de novo toda vez que a habilidade
  é usada, não é identidade fixa (Aasimar — Revelação Celestial); não
  aparece no wizard, só dentro da aba Combat na hora de usar.

Tratar as 3 como a mesma coisa gera bug real de UX (perguntar de novo
no combate algo que já devia estar fixo desde a criação, ou nunca
perguntar algo que precisa ser escolhido a cada uso). Traço que herda
efeito da sub-escolha (ex: tipo de dano do Ataque de Sopro do Draconato
conforme a cor de dragão) é marcado com `traçosVinculadosASubescolha` e
resolvido em tempo de leitura pelo motor de cálculo — nunca duplicado
como valor fixo em dois lugares. Precedente à parte: Aasimar, Humano e
Tiferino têm Tamanho como escolha (Médio/Pequeno), schema `{ fixo,
opcoes }`. Anão, Humano, Orc e Pequenino: `subescolha: null` é o valor
correto, não é dado faltando.

## Tela "Escolhas da Classe" replica o padrão de "Escolhas da Origem"

Resumo do núcleo em `summary-row`, características de nível 1 como
InfoChip (só informação) — exceto quando a característica é uma
ESCOLHA de verdade (ex: Estilo de Luta), que vira opt-cards de escolha
única. Perícias como checkboxes (máx. N), equipamento inicial como
opt-cards A/B/C com itens tocáveis quando têm descrição. Reaproveitar
essa mesma composição pra qualquer classe nova em vez de desenhar tela
diferente por classe.

## Cálculo de CA — Bárbaro e Monge têm regra própria (única exceção do núcleo)

O motor de cálculo de CA precisa checar, antes da fórmula padrão, se a
classe tem "Defesa sem Armadura" própria. Só 2 das 12 classes têm:
- **Bárbaro:** `10 + mod. Destreza + mod. Constituição`, mantém o
  benefício mesmo empunhando Escudo.
- **Monge:** `10 + mod. Destreza + mod. Sabedoria`, **perde** o
  benefício se usar Escudo ou vestir qualquer armadura.

Nenhuma outra classe tem regra de CA sem armadura própria. A subclasse
Bardo — Colégio da Dança (`10 + Destreza + Carisma`, nível 3) é
característica de **subclasse**, não entra na função central de
cálculo de CA por classe — resolve como característica normal de
subclasse quando subclasses forem importadas.

**Padrão de implementação:** função de CA centralizada que recebe
(classe, atributos, armadura equipada, escudo equipado) e resolve
nessa ordem: (1) a classe tem regra própria sem armadura? (2) o
personagem está de fato sem armadura equipada? (3) aplica a regra
especial; senão, fórmula padrão por categoria de armadura (Leve: base
+ Destreza sem limite; Média: base + Destreza até +2; Pesada: base,
sem Destreza) + Escudo (+2, se aplicável). Nunca espalhar `if classe
=== "Bárbaro"` pelo código — uma função só. (Motor de CA ainda não
implementado; registrado aqui pra já nascer certo quando for
construído.)

## Idiomas — regras confirmadas

- Toda Origem/Espécie concede o mesmo total: Comum obrigatório
  (travado, não dá pra desmarcar) + 2 à escolha, **sem restringir
  categoria** — Raros aparecem liberados na mesma tela, junto dos
  Comuns. Confirmado que nenhuma aba da planilha (Antecedentes,
  Espécies) tem coluna de idioma, então o total não varia por
  origem/espécie. "Boa justificativa de história" pra escolher um
  idioma Raro é regra de **narrativa**, não trava mecânica — vira
  aviso informativo na tela, nunca bloqueio de seleção.
- Característica de **Classe** nível 1 pode conceder idioma extra além
  disso: Druida ganha Druídico fixo; Ladino ganha Gíria dos Ladrões
  fixo + 1 à escolha (confirmado na aba Características de Classe; as
  outras 10 classes ainda não foram auditadas linha a linha, ver
  `PENDENCIAS.md`). Padrão: `data/rulesets/dnd2024/idiomaExtraClasse.ts`
  — mapa `Record<nomeClasse, { fixo: string[]; escolhaLivre: number }>`,
  lido por `core/idiomas.ts` (`totalIdiomasEsperados`, testado) e pela
  tela de Línguas: idioma fixo entra sozinho (não consome a escolha
  livre do jogador), e o total de escolhas cresce dinamicamente por
  `escolhaLivre`. Reaproveitável pras próximas classes só adicionando
  entrada no mapa — nenhuma tela muda. Sempre que um mecanismo assim
  for adicionado, conferir que ele também aparece em algum lugar da
  Ficha (não só na revisão do wizard antes de salvar) — foi preciso
  adicionar seção "Idiomas" no Perfil pra isso ficar visível.
- Fora de escopo ainda: idioma que concede magia junto (ex: Druídico →
  Falar com Animais sempre preparada) — precisa do mesmo mecanismo que
  falta pro Talento de Origem Iniciado em Magia (ver `PENDENCIAS.md`).

## Exceção "fonte = livro, não planilha" — quando e como usar

Padrão pra quando a planilha não cobre um campo mecânico e o Osmar
autoriza extrair direto do PDF do livro (exceção à regra geral do
`CLAUDE.md` seção 3 de "só planilha" — sempre com pedido explícito,
nunca decisão unilateral):
- Vira arquivo `.ts` **separado** do gerado da planilha (nunca mistura
  no mesmo arquivo), mapeado por `id` do registro correspondente,
  consumido como `arquivoExtra[id]` nas telas.
- A planilha em si **nunca** é editada por causa dessa exceção.
- Se a planilha ganhar depois a coluna equivalente, o arquivo separado
  é descartado e o campo migra pro import normal — sem quebrar nada,
  porque o ponto de consumo já é indexado por `id`.
- Casos já usados: `descricoesOrigens.ts` (16 parágrafos de sabor de
  Origem, Cap. 4 do Livro do Jogador); `classesProficienciasIniciais.ts`
  (perícias à escolha + equipamento inicial de Guerreiro, Cap. 3 — a
  parte de arma/armadura saiu depois pra uma aba própria da planilha,
  ver abaixo).

## Planilha ganhou colunas que fecharam gaps antigos (referência de import)

- Aba nova "Proficiências de Classe" (Classe × Proficiência com Armas ×
  Treinamento com Armadura) — importada em
  `proficienciasArmaArmaduraClasse.ts`, substituiu a parte de
  arma/armadura de `classesProficienciasIniciais.ts` (que ficou só com
  perícias/equipamento, que a planilha ainda não tem).
- Armas (38) e Armaduras (13) ganharam coluna "Descrição" — síntese
  gerada a partir dos campos estruturados já existentes
  (Dano/Propriedades/Maestria; CA/Força mínima/Furtividade), não é
  extração de texto livre do livro. Importadas em
  `armas.ts`/`armaduras.ts` e ligadas em `buscarDescricaoItem.ts`.
- **Nome de item pode divergir entre a fonte de uma exceção-do-livro e
  a planilha** (ex: "Armadura de Couro Batido" no PDF vs "Couro
  Batido" na planilha, que já separa a categoria no cabeçalho da
  seção) — ao reconciliar, o nome da **planilha sempre vence**, porque
  é ela que alimenta busca/popup de descrição.
- **Mesmo talento/nome grafado diferente entre 2 abas** (ex: aba
  Antecedentes grafava "Artífice", aba Talentos e o livro confirmam
  "Artifista") — confirme a grafia oficial com o Osmar/livro e corrija
  **só no mapeamento de import** (comentário no topo do arquivo
  gerado), nunca edite a planilha por conta própria nem deixe a
  inconsistência se propagar pro app.

## Duplicidade de conteúdo colado em "Descrição Completa" de nível alto — pendência de dado real

~24 células de "Descrição Completa" (Características de Classe e
Subclasses) têm, coladas dentro da mesma célula, o dump inteiro de uma
lista que já existe corretamente em outra aba (Opções de Classe) — erro
de extração PDF→planilha, não texto longo legítimo. Padrão comum:
características de "Conjuração" carregam a lista de magias da classe
inteira coladas dentro; características de nível 14+ carregam listas de
invocações/manobras/formas. Nenhuma célula do Guerreiro (classe base)
tem o problema — só as subclasses dele (ainda não importadas) e outras
classes/subclasses futuras. **Ação:** resolver célula por célula sob
demanda, no momento de importar cada classe/subclasse de verdade —
nunca importar uma dessas células "como está". Lista viva de quais
ainda faltam: `PENDENCIAS.md` (não duplicar aqui).

## Descrição Curta × Completa — padrão pra qualquer catálogo novo do livro

Todo catálogo grande (Origens, Espécies, Magias, Itens...) usa 2 campos
de texto, não 1: a completa (`introducao`/`descricaoCompleta`, tela de
detalhe) e uma versão curta (~250-350 caracteres, coluna "Descrição
Curta (auto/app, revisar)" na planilha) só pro card da **lista** —
nunca substitui a completa em lugar nenhum. A curta vale como "ponto de
partida, revisar depois" mesmo quando é gerada automaticamente (corte
na frase mais próxima do limite, sem revisão manual linha a linha) —
mesmo tratamento que outras colunas "auto/revisar" já têm no projeto;
se o Osmar revisar manualmente depois, só atualiza a célula e
reimporta, sem mudar estrutura. Quando o Claude Code escrever uma
versão curta nova direto no código (categoria ainda sem a coluna na
planilha), peça pro Osmar também salvar como coluna nova na planilha
(mesmo texto, comentário no cabeçalho avisando que é resumo próprio,
não trecho literal do livro) — pra não perder esse texto fora do
código.

**Completa nem sempre é texto literal do livro — depende do formato da
fonte.** Quando o livro tem 1 parágrafo de prosa por item (Magias,
Equipamento de Aventura, Itens Mágicos), completa é texto **literal**
extraído do PDF. Quando o livro só tem tabela + regras gerais sem
parágrafo por item (Armas, Armaduras), completa é texto **próprio**,
sintetizado combinando a linha da tabela com a consequência mecânica de
cada regra. Decidir qual dos dois vale **antes** de começar a extrair,
não item por item.

**Extração de PDF por fronteira de cabeçalho — 3 armadilhas
recorrentes** (localizar cada nome MAIÚSCULO e cortar até o próximo
cabeçalho; apareceram em quase todo lote de 50, valem checagem
sistemática, não só "quando parece errado"):
1. **Cabeçalho repetido** (nome do item reaparece numa legenda de
   tabela/imagem) some com o texto do item anterior.
2. **Último item da lista sem fronteira seguinte** vaza até a próxima
   seção do capítulo.
3. **Família com parágrafo mestre compartilhado** (variantes nomeadas,
   ex: Foco Arcano, Anel de Comandar Elementais) — se as variantes
   forem excluídas da busca por já estarem previstas pra outro lote, o
   cabeçalho delas para de servir de fronteira e o item anterior vaza a
   seção inteira; a correção é sempre incluir o cabeçalho como
   fronteira mesmo sem atribuir texto a ele ainda.

**Detecção sistemática:** conferir o tamanho (chars) de cada texto
extraído do lote antes de commitar — um outlier (muito maior ou menor
que os vizinhos) quase sempre é um dos 3 bugs acima, não conteúdo
genuinamente longo.

**Classificação derivada (`tipoItem`/`bonusItem`/`cargas`) não tenta
cobrir 100% do catálogo.** Item com carga numérica vira
`"ativo-com-carga"` mesmo quando também é arma/armadura com bônus fixo
(os 2 campos convivem — `bonusItem` guarda o bônus, `cargas` guarda a
carga). Só vira `"arma"/"armadura"/"escudo"` puro sem carga. Item cuja
mecânica varia por exemplar específico (ex: "Arma +1, +2 ou +3") ou tem
bloco de estatística próprio fica com o campo `null` de propósito —
forçar um valor faria o código mentir sobre um item que precisa de
pergunta manual ("qual variante você tem?"). Lista completa de itens
`null` e o motivo de cada um: `PENDENCIAS.md`.

**Gap achado contra o livro (item real faltando na planilha):** ao
encontrar um item que existe no livro mas não tem linha na planilha,
nunca preencher sozinho — confirme com o Osmar antes, e ao inserir
respeite a ordem que a aba já usa (aqui: Raridade → Alfabético dentro
do grupo, não alfabético puro).

## Magias — Upcast estruturado (extração + classificação)

Texto livre da coluna "Upcast" da planilha foi estruturado em colunas
novas (a antiga fica intacta pra comparação):
- `Upcast_Tipo`: **Dado por Círculo** (mais comum) / **Alvo por
  Círculo** / **Flat por Círculo** / **Fórmula Própria** (efeito já
  escala sozinho pelo círculo do espaço, sem bônus adicional a somar)
  / **Outro** (texto livre, regra não-linear demais) / **Nenhum**
  (truques e magias sem upcast).
- Dado/Alvo/Flat por Círculo usam `Upcast_CirculoBase` (o "acima de
  X") + o valor (`Upcast_Dado`/`Upcast_Alvos`/`Upcast_Flat`).
- `Upcast_Texto` sempre preenchido (exceto Nenhum), pra exibir mesmo
  quando não dá pra rodar dado automaticamente.

Recorte de propósito: só os 3 tipos "por Círculo" entram no cálculo
automático (fórmula: valor base + (círculo usado − CirculoBase) ×
valor do upcast); "Fórmula Própria" e "Outro" ficam de fora —
forçar esses casos numa fórmula genérica exigiria exceção em cima de
exceção, e o texto livre já resolve a exibição.

**Técnica de extração reaproveitável:** o círculo da **própria** magia
(coluna já existente) serve de checagem cruzada contra o texto extraído
do PDF — por regra, "acima de X" no upcast É SEMPRE o círculo da
própria magia; qualquer trecho com X diferente do círculo da magia é
sinal de erro de leitura do PDF (colunas de layout embaralhadas). Rodar
essa checagem em qualquer extração futura de upcast/escala, não só
nessa leva.

**Pendência de dado, não corrigida:** 55 IDs da aba Magias são
reaproveitados entre magias diferentes (ex: as 14 magias "Invocar X"
compartilham 1 ID) — não afeta o app hoje porque `magias.ts` gera o
próprio `id` a partir do nome (slug), nunca lê essa coluna; registrado
caso vire problema em outro uso futuro da planilha.

## Magias — motor de dano completo (Dano Base + Upcast + Escala de Truque)

Fecha o motor de rolagem de dano ponta a ponta: Dano Base por magia,
Ataque vs. Salvaguarda, texto de sucesso/falha, e escala por **nível do
personagem** (Aprimoramento de Truque — truque não tem círculo pra
escalar, upcast é só por círculo).

**Técnica reaproveitável pra qualquer campo estruturado novo extraído
de magia:** ler o texto já importado em `descricaoCompleta` (nunca
reler os PDFs do zero a cada campo novo — o corpus por magia já
extraído serve de base pra qualquer campo estruturado subsequente) e
casar contra frases fixas do livro via regex + revisão manual das
exceções (nunca assumir 100% de acerto automático). Cada campo novo
custa cada vez menos porque reaproveita o mesmo corpus.

Campos: `DanoBase_Dado`/`DanoBase_Tipo` (`null` = magia sem dano direto
num alvo; `danoBaseTipo: "escolhido"`/`"aleatório"` cobrem tipo
variável); `AtaqueOuSalvaguarda` (única fonte de verdade pra decidir
qual modal abrir — **não** usar a heurística de regex de
`classificarMagia`, essa é só pro ícone da lista, ver
`DECISOES-COMBATE.md`); `Salvaguarda_Falha`/`Salvaguarda_Sucesso` (só
quando há salvaguarda **e** dano); `EscalaTruque_Tipo: "dado"` (soma 1
dado do mesmo tamanho do Dano Base por nível 5/11/17 do personagem,
nunca por círculo).

`core/magiaDano.ts`: `calcularEscalonamento` é o motor genérico
(extraído de dentro de `calcularDanoMagia`), reaproveitado por
`calcularDanoMagia` e `calcularCuraMagia` — cada um só passa o campo
certo e decora o resultado (`tipo` de dano só existe pra dano). Ordem
de soma: Escala de Truque (nível do personagem) primeiro, Upcast
(círculo do espaço) depois — as 2 mecânicas nunca coexistem hoje na
mesma magia, mas a ordem já cobre se coexistirem um dia. Upcast só soma
automático quando o dado do upcast bate no tamanho do Dano Base; caso
contrário devolve `upcastNaoAutomatico: true` e a UI mostra o texto em
vez de somar sozinha.

**Imprecisões aceitas, não bloqueantes** (casos extremos demais pra
estruturar): dano narrativo que só acontece depois, não no momento da
salvaguarda (Rogar Maldição) — funciona normal, cabe ao jogador rolar o
dano na hora certa; magias com múltiplos efeitos sorteados (Rajada de
Mísseis Cintilantes / Muralha Prismática) têm texto de sucesso/falha
aproximado.

## Magias — cura reaproveita o motor de Upcast do dano, sem mecanismo próprio

Nenhuma magia de cura rolava dado até essa auditoria — coluna nova
`CuraBase_Dado` (mesmo formato "NdM"/"NdM + F" de `DanoBase_Dado`), e o
**mesmo** motor de Upcast (que já descreve como qualquer efeito escala,
não só dano) resolve a escala — nada de sistema de escalonamento
paralelo. `MecanicaMagia` ganhou `'cura'`, checado **antes** de
ataque/salvaguarda em `mecanicaDaMagia` (nenhuma das 7 magias de cura
hoje tem os dois, mas a ordem já cobre o caso futuro).

Só entram no campo quando a cura é 1 dado único cruzado contra o Upcast
já existente (7 das 391 magias: Curar Ferimentos, Palavra Curativa,
Oração de Cura, Palavra Curativa em Massa, Curar Ferimentos em Massa,
Aura de Vitalidade, Regeneração).

Ficam de fora de propósito (não cabem no formato "NdM" ou dependem de
mecânica que o app não modela ainda — ver `PENDENCIAS.md`/`Backlog.md`
se precisar entrar depois): cura de valor fixo sem dado, cura derivada
de outro efeito já modelado (% do dano causado), cura que consome
recurso do próprio personagem (Dados de Vida, tamanho varia por
classe), efeito incidental de 1 PV fixo, magia com escolha entre cura
OU dano no mesmo lançamento.

**Decisão de UI (Osmar):** o jogador aplica o PV manualmente — o app
não tem conceito de "alvo" pra aplicar cura sozinho (nem toda cura é no
próprio conjurador).
