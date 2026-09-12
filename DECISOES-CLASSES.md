# DECISOES-CLASSES.md

> Decisões de design sobre a **implementação de classes** — padrões
> reutilizáveis descobertos implementando Guerreiro, Bardo, Bruxo (+
> Colégio do Conhecimento, Necromante) e Multiclasse, pensados pra
> valer pras próximas classes/subclasses. Parte da família
> `DECISOES-*.md` — ver o índice em `DECISOES-DESIGN.md`, e a seção 7
> do `CLAUDE.md` pra regra de quando registrar uma entrada aqui.
>
> **Este arquivo guarda só padrão/decisão que vai se repetir na
> próxima classe** — não é changelog de entrega. Bug já corrigido,
> ajuste visual pontual e narração de "fiz X, testei Y" **não entram
> aqui**: o código funcionando é a prova; o Git guarda o histórico. Só
> escreva uma entrada nova se a resposta pra "isso muda como eu vou
> implementar a próxima classe?" for sim — ver seção 7 do `CLAUDE.md`
> pra critério completo.

---

## Como decupar uma classe nova antes de implementar

**Padrão:** mapear a progressão real (planilha/livro) nível a nível
procurando categorias de "coisa de level-up"/"coisa de Combat" que o
motor genérico ainda não sabe lidar — cada classe nova costuma
introduzir só 1-2 categorias novas. Categorias já suportadas por
`core/levelUp.ts`: subclasse única (nível fixo por classe),
ASI/Talento, escolha trocável a TODO level-up (Estilo de Luta),
escolha trocável só por Descanso Longo (Maestria em Arma), escolha
exclusiva de nível único (Dádiva Épica), recurso que repete o mesmo
nome ao escalar (Indomável), recurso que muda de nome a cada salto
(Ataque Extra → Dois Ataques Extras), troca opcional de magia
preparada por level-up (padrão A de caster, ver "Casters" abaixo).

**Ordem recomendada dentro de uma classe:** classe base completa (sem
subclasse) primeiro, depois subclasses da mais simples (só passivo,
zero recurso novo) pra mais complexa (subclasse que introduz sistema
inteiro novo). Dentro da base, características simples/passivas antes
das que pedem estado novo (banco de usos, contador por-turno).

**Antes de aceitar um achado de regra rebuscado, confirmar direto no
PDF/planilha** — nunca copiar de memória ou de resumo externo sem
checar.

**Antes de codar a 3ª classe em diante (e toda classe seguinte),
auditar acoplamento implícito deixado pelas anteriores:** buscar
comparação hardcoded de nome de classe ou suposição "toda classe tem
X" antes de importar a próxima, não só quando o bug aparecer. Exemplos
já achados: quantidade de perícias fixa no componente em vez de lida
do recurso real da classe; seção "Estilo de Luta" renderizada
incondicionalmente (usar sempre `temEstiloDeLutaTrocavel` em vez de
assumir a característica); validação de passo travando por algo que
nem toda classe tem. Caso ainda aberto (ver `PENDENCIAS.md`):
`core/ataque.ts` soma Bônus de Proficiência em qualquer arma sem
checar proficiência real — invisível em classes com acesso amplo a
arma, vai expor em classe restrita (ex: só Simples).

**Data/origem:** 2026-08/09, Guerreiro/Bardo/Bruxo.

## Motor de Level Up genérico (`core/levelUp.ts`)

**Funções que leem a progressão real da classe** (nunca constante
hardcoded) e o padrão que cada uma resolve:
- `niveisComASI(classe)` / `niveisComDadivaEpica(classe)` — tabela de
  níveis-de-ASI é **por classe**, não constante global (Guerreiro tem
  6 níveis — 4/6/8/12/14/16 —, não os 5 "padrão" da maioria).
- `temEstiloDeLutaTrocavel(classe, nivel)` — procura a característica
  por NOME na progressão até o nível atual, funciona pra qualquer
  classe com "Estilo de Luta" sem código novo.
- `caracteristicasDoNivel(classe, nivel)` — junta nome (`classes.ts`)
  + descrição real (quando importada).
- `contarRepeticoesCaracteristica(classe, nome, nivel)` — resolve
  "repete o mesmo nome ao escalar" (Indomável 9/13/17 → usos 1/2/3).
- `numeroDeAtaques(classe, nivel)` — resolve "muda de nome a cada
  salto" com mapa fixo de nomes oficiais (`'Ataque Extra': 2, 'Dois
  Ataques Extras': 3, 'Três Ataques Extras': 4`), compartilhado por
  várias classes.
- `caracteristicaDesbloqueada(classe, nome, nivel)` — característica
  nomeada já concedida até o nível atual (InfoChip informativo,
  gatilhos condicionais).

**Gotcha recorrente (confirmado 2x — Indomável no Guerreiro,
Especialista no Bardo): o livro nomeia a MESMA característica
diferente em níveis diferentes** ("Especialista" nível 2,
"Especialização" nível 9). Funções que buscam por nome devem aceitar
lista de nomes possíveis, nunca 1 string só.

**Data/origem:** 2026-08, Guerreiro B1/B4 + Bardo Especialista.

## Guerreiro — recursos e mecânicas da base (nível 1-20)

**Banco de usos compartilhado entre 2 features:** Recuperar Fôlego e
Mente Tática gastam o MESMO banco (regra real: Mente Tática "gasta um
uso de seu Recuperar Fôlego") — 1 contador só, não dois. Recuperar
Fôlego vive no painel de Ação Bônus; Mente Tática fica fora da
economia de ação (card sempre visível), porque reage a "falhar teste
de atributo", não consome turno. Indomável segue o mesmo "fora da
economia de ação", mas só recupera no Descanso Longo.

**Ataque Extra — vários golpes na MESMA Ação, não 1 Ação por
ataque:** o painel de Ação normalmente fecha e marca a Ação como usada
assim que uma opção é escolhida. Padrão: callback separado (`onAtacar`)
conta ataques no turno e só fecha/marca no último; os anteriores
mantêm o painel aberto ("ataque N/M"). Cada instância escolhe
arma/sub-opção independentemente, não um "modo" único pra ação toda.

**Surto de Ação concede ação, não consome** (ao contrário de
Recuperar Fôlego) — só decrementa o banco de usos, nunca marca a Ação
normal como usada. Limite duplo do nível 17 (2 usos/descanso, só 1×
por turno) usa flag separado do contador, resetado no fim do turno.

**Maestria em Arma troca por Descanso Longo, não por Level Up** —
mecanismo de troca à parte do Estilo de Luta, aparece no fluxo de
Descanso. Nº de armas lido de `core/maestriaArma.ts`, nunca hardcoded.

**Data/origem:** 2026-08, plano "Guerreiro 1-20".

## Casters — 3 padrões reais de troca de magia (não é "known vs prepared")

**Achado central:** a troca de magia preparada tem 3 variações reais
entre os 8 conjuradores (Mago, Clérigo, Druida, Bardo, Feiticeiro,
Bruxo, Guardião, Paladino) — não a divisão binária "known vs
prepared":
- **Padrão A (restritiva):** troca só 1 magia, só ao subir de nível —
  Bardo, Bruxo, Feiticeiro.
- **Padrão B (flexível por descanso):** troca só 1 magia, a cada
  Descanso Longo — Guardião, Paladino (meio-conjuradores).
- **Padrão C (redefinição livre):** troca qualquer quantidade, a cada
  Descanso Longo — Clérigo, Druida, Mago (Mago tem camada extra: só
  prepara o que está no grimório físico — fora de escopo por ora).

**O que generaliza pras 8, sem exceção:** truque nunca gasta espaço de
magia; espaço de magia é sempre banco por círculo, recuperando no
Descanso Longo — **exceto Bruxo**, que recupera no Curto também;
atributo de conjuração é sempre 1 só, fixo por classe (nunca escolha
do jogador); CD/bônus de ataque de magia seguem sempre a mesma
fórmula.

**Schema recomendado pra quando o motor precisar generalizar de
verdade** (hoje só Bardo é padrão A puro): `padraoDeTroca`
(`restritiva | flexivel_por_descanso | redefinicao_livre`) +
`gatilhoDeTroca` (`level_up | descanso_longo`) + `qtdTrocavelPorVez`
(`1 | "todas"`).

**Data/origem:** 2026-08, análise em chat paralelo, antes do Bardo.

## Bardo — decisões de implementação (base, sem subclasses)

**Schema de dado:** Espaços de Magia modelados como **9
`RecursoClasse` separados (1 por círculo)**, reaproveitando o schema
genérico já existente — nenhum schema novo. Catálogo de magias
importado **de uma vez, todas as classes** (não por classe) — resolve
de graça a exceção de subclasse que dá acesso a magia de outra classe
inteira (ex: Colégio do Conhecimento).

**Crescimento de Truques/Magias Preparadas no Level Up — padrão "uma
lista só, marca o que já tinha":** a tela mostra o catálogo completo,
pré-marcado com o que o personagem já tem, limite = máximo do NOVO
nível. Resolve "cresceu" (slot vazio força completar) e "trocou"
(desmarcar 1 antigo + marcar 1 novo) com a MESMA interação, sem UI de
"modo troca". Validação: conta quantos itens da lista ORIGINAL
sumiram da seleção final — 0 ou 1 removido OK, 2+ bloqueia ("só pode
trocar 1 por level-up"). Reaproveitável por qualquer classe/recurso
com a mesma regra (já usado por Truques, Magias Preparadas, Descobertas
Mágicas do Colégio do Conhecimento).

**Espaços de Magia rastreiam TODOS os círculos ativos ao mesmo
tempo** — a partir de 2+ círculos simultâneos (Bardo nível 3), o
estado é `Record<círculo, gasto>`, não um número único.

**Detector de déficit + tela "Completar":** se um Level Up passar sem
escolher Truques/Magias Preparadas, `deficitTruques()`/
`deficitMagiasPreparadas()` comparam o que a tabela da classe diz
contra o tamanho da lista atual. `CompletarMagiasShell.tsx` reaproveita
a mesma UI de escolha do Level Up, mas trava remoção — só fecha
déficit, nunca troca.

**Ataque de magia rola acerto automático, dano fica manual** — a
planilha não tem dado de dano estruturado por magia (só texto livre),
diferente de arma (`core/ataque.ts`). Vale pra qualquer conjurador até
esse dado existir (ver `DECISOES-DADOS.md` "Magias — Upcast
estruturado").

**Inspiração de Bardo — recurso com tamanho variável por CAR (não
tabela por nível) e múltiplas fontes de recarga:** usos = mod. de
Carisma (mínimo 1), só o TAMANHO do dado cresce por nível — arquivo
próprio (`core/inspiracaoBardo.ts`) em vez da leitura genérica de
recurso por tabela. A partir do nível 5, ganha 2ª fonte de recarga
(gastar Espaço de Magia, sem custar ação) além do Descanso — 1º caso
de recurso recarregável por 2 fontes alternativas.

**Segredos Mágicos (nível 10) — pool de magia emprestada de outras
classes:** a lista de "o que pode preparar" passa a incluir
Clérigo/Druida/Mago além da própria classe (dedupe por id). Função
dedicada (`magiasDisponiveisParaPreparar`) reaproveitável por qualquer
classe/subclasse com regra parecida (Colégio do Conhecimento usa a
MESMA lista de 3 classes por coincidência de regra do livro, não por
ser o mesmo mecanismo).

**Convenção de cor (vale pro app inteiro, não só magia):** aviso de
seleção inválida/incompleta bloqueando avançar usa `--danger`
(vermelho); aviso informativo/não-bloqueante usa `--warn` (âmbar).

**Data/origem:** 2026-08, plano "Bardo".

## Colégio do Conhecimento — 1ª subclasse com mecânica real

**Bloqueio de subclasse ainda sem dado:** `subclasseImplementada`
checa se a subclasse tem pelo menos 1 característica importada — as
outras da mesma classe aparecem travadas ("ainda não implementada")
até ganharem dado real. Genérico por dado, não hardcoded por nome.

**Gotcha de planilha, provável em qualquer classe/subclasse nova:** a
aba "Progressão de Classe" usa o texto literal **"Característica de
Subclasse"** como placeholder nos níveis em que o livro só diz "veja
sua subclasse" — sempre resolver contra a subclasse escolhida, nunca
tratar como nome de característica de verdade a buscar em
`caracteristicasSubclasse.ts` (confirmado em Bardo e Guerreiro).

**Subclasse pode consumir/estender um recurso já existente da classe
base, sem contador novo** — Palavras de Interrupção (Reação) gasta o
banco PRÓPRIO de Inspiração de Bardo do personagem, caminho paralelo
ao uso normal, mesmo contador.

**Proficiências Bônus — escolha real de perícia disparada por
subclasse:** passo novo no Level Up, dispara 1x só quando a
característica desbloqueia E o personagem ainda não tem as perícias;
contam como proficiência de verdade (dobrar continua exclusivo de
Especialista).

**Perícia Inigualável (nível 14) — reembolso condicional de recurso,
único caso confirmado no jogo:** gasta 1 uso do banco de Inspiração ao
rolar, mas se mesmo assim falhar, o uso NÃO é gasto. Como o app não
sabe se o resultado final foi sucesso, o fluxo é: rola (gasto
otimista, já debita) → pergunta "ainda assim falhou?" → devolve o uso
só se sim. Padrão pra qualquer recurso futuro com "só gasta se
funcionar".

**Data/origem:** 2026-08, plano "Colégio do Conhecimento".

## Escolha de subclasse — versão placeholder até ganhar mecânica real

**Decisão:** o step de escolha de subclasse no Level Up sempre deixa
escolher entre as opções REAIS da classe e salva o nome
(`PersonagemSalvo.subclasseAtual`), mesmo sem nenhuma característica
mecânica ainda — com aviso `[PH]` explícito (regra 12 do `CLAUDE.md`).
Trocar o ícone do personagem na Lista já funciona desde a escolha,
independente de mecânica implementada.

**Prioridade do ícone na Lista de Personagens:** imagem própria do
jogador > ícone da subclasse > ícone da classe > empate de nível,
classe mais atual (últimos 2 critérios só relevantes com multiclasse).

**Data/origem:** 2026-08.

## Talentos — arquitetura final (schema, classificador, motor de escolha)

**Schema de ASI: 2 tipos, não 4.** Só existem 2 comportamentos
distintos: `escolha-unica` (+1 num atributo à escolha, dentre uma
lista — cobre lista de 1, 2-3 ou 6 igualmente) e `distribuir-dois`
(+2 num só ou +1 em dois — reaproveita o MESMO seletor de ASI genérico
do Level Up). `maximo` (20 ou 30) é campo à parte, não um 3º/4º tipo.

**Classificador de Ação/Ação Bônus/Reação/Passiva
(`core/classificarTalento.ts`) é próprio dos Talentos, não existe
reaproveitável em lugar nenhum do app** — a coluna "Tipo de Ação" das
características de Classe/Subclasse é gerada por processo externo, só
*lida* como dado pronto. O classificador roda com regex heurística
sobre o texto puro, on-the-fly (nunca precomputado/salvo), mesmo
padrão de `classificarMagia.ts`.

**Padrão final da UI de escolha:** tudo acontece **dentro do mesmo
passo `'asi'` do Level Up**, sem tela cheia própria e sem botão
"Confirmar" extra — cards marcam modo/talento/atributo (nunca aplicam
no toque), e o "Avançar" do rodapé (o mesmo de todo o wizard) confirma
e navega, reabrindo com aviso se algo obrigatório falta. Quando o
talento escolhido concede ASI que precisa de escolha própria, um passo
**novo entra dinamicamente** logo depois de `'asi'` (com sua própria
bolinha de progresso). "Aumento no Valor de Atributo" é só mais um
talento normal na lista (`distribuir-dois`), não um card fixo
hardcoded.

**Regra geral, vale pra qualquer tela nova do Level Up/Wizard:** toda
escolha em tela cheia usa "marca → 'Avançar' do rodapé confirma",
nunca aplica no toque nem cria botão "Confirmar" próprio isolado.
Botão desabilitado sempre usa a classe global `.btn-disabled` (nunca
`opacity` inline sozinho) — evita bug de especificidade CSS onde o
botão "parece" desabilitado mas continua clicável.

**Pin 📌 de talento favoritado** — "quero pegar isso num level up
futuro", por personagem (não preferência global do dispositivo). Some
da seção de favoritos automaticamente ao escolher no mesmo level-up.

**Efeito mecânico real — schema:** campo opcional `efeitoMecanico`
(união de tipos, cada variante só com os números que aquele talento
usa) em `Talento` e `EstiloDeLuta` — **não vem da planilha**, anotado
à mão só quando a mecânica é implementada de verdade. Helper genérico
(`efeitoMecanicoDoTalento`) procura, entre os talentos ativos do
personagem, um com aquele tipo de efeito — reaproveitado também pra
Estilo de Luta. Talento de categoria "Origem" (concedido fixo, nunca
passa pelo picker de Level Up) também entra no cálculo.

**Data/origem:** 2026-08, Talentos Fases 1-4 lote 1.

## Bruxo — Espaço de Magia de Pacto e catálogo de Invocações Místicas (schema base)

**Espaço de Magia de Pacto — pool único, não array por círculo
(diferente do Bardo):** modelado como 2 `RecursoClasse` separados em
`classes.ts` ("Espaço de Magia de Pacto (quantidade)" + "Círculo do
Espaço de Magia de Pacto"), reaproveitando o schema genérico. Recupera
em "Descanso Curto ou Longo" — diferente de todo caster já documentado
(Bardo só Descanso Longo). `core/magiasPersonagem.ts`'s
`espacosDeMagiaAtivos()` ganhou um fallback: quando não acha o padrão
"1 recurso por círculo" do Bardo, procura o padrão de pool único do
Bruxo e devolve um `EspacoDeMagiaAtivo[]` de **1 item só** com o
círculo daquele nível — toda a UI/lógica que já existia (`MagiasTab.tsx`,
`EscolherCirculoShell`, Descanso, `espacosGastosPorCirculo`) funcionou
sem tocar em mais nada. "Upcast automático" do Bruxo já é só a regra
normal de upcast quando só existe 1 círculo disponível. **Ao chegar
uma classe nova com formato de recurso diferente, procurar primeiro se
dá pra mapear pro mesmo tipo genérico antes de criar caminho próprio.**

**Catálogo de Invocações Místicas — dado que a planilha não tem, vem
do livro (Cap. 3), `invocacoesMisticas.ts`.** Schema: `tipo` (`passiva
| avontade | limitada`) classifica a frequência real de cada uma —
**não é um pool de usos genérico**, cada invocação `limitada` tem sua
própria regra de custo/teto (`custoOuLimite`, texto livre).
`prerequisitos.invocacaoRequeridaId` modela dependência encadeada (ex:
Lâmina Devoradora exige Lâmina Sedenta) — ver seção própria abaixo
sobre a trava.

**Data/origem:** 2026-09, plano "Bruxo — base + Patrono Ínfero".

## Bruxo — Pacto do Tomo: recurso "gasto até o próximo Descanso"

**Escolha livre de fora do catálogo da própria classe:** o Livro das
Sombras (`core/livroDasSombras.ts`) filtra o catálogo COMPLETO de
magias por círculo+Ritual, não `magiasDaClasse` — regra real permite
"qualquer classe". Padrão pra "de qualquer classe": filtrar direto o
catálogo genérico, excluindo só o que o personagem já tem, nunca
restringir pela classe do personagem.

**Recurso "gasto até o próximo Descanso" (não é contador, é
boolean):** diferente de Surto de Ação/Indomável (N usos numéricos),
"Reconjurar o Livro" é 1x disponível, trava até `descansoCurto()` OU
`descansoLongo()` resetar — boolean simples (`livroDasSombrasGasto`)
resetado nas duas funções de descanso. Visual: botão muda de accent
(disponível) pra cinza/texto-fraco (travado) com mensagem explicando
quando libera — reaproveitável pra qualquer "1x por descanso, sem
contador".

**Dado do livro reaproveita "Descobertas Mágicas":** mesma seção
visual (nome, sempre preparada, fora do limite normal), mesmo
`magiasPreparadasDoPersonagem(nomes)` genérico.

**Lição de UI recorrente:** toda tela nova que lista magia pra
ESCOLHER precisa do mesmo par `MagiaComDescricao` + `iconesMagia()`
que as telas de EXIBIR já usam — são chamadas separadas, fácil
esquecer uma ao copiar o padrão (achado corrigindo a tela "Reconjurar"
que tinha esquecido `iconesMagia()`).

**Data/origem:** 2026-09, pendência "Bruxo — Pacto do Tomo".

## Bruxo — mecanismos concedidos por Invocações Místicas

**Padrão geral:** cada invocação que concede algo especial ganha seu
próprio campo tipado em `InvocacaoMistica` (`magiaGratisConcedida`,
`pvTemporarioConcedido`, `sentidoConcedido`, `formasFamiliarConcedidas`
etc.), **nunca um `efeitoMecanico` genérico solto.** Toda lista
derivada de invocação (magia grátis, formas de familiar) é SEMPRE
recalculada a partir de `invocacoesMisticasAtuais`, nunca persistida —
só o que É estado de progressão (usos já gastos) persiste.

**Magia concedida de graça (10 invocações de uma vez):** 1 campo
(`magiaGratisConcedida: { nome, recarga } | null`) + 1 core module
(`core/invocacoesMagiaGratis.ts`, `magiasGratisDasInvocacoes`)
resolveram as 10 juntas — 9 `avontade` (ilimitadas) + 1 `limitada` (1x
até Descanso Longo, controlada por `magiasGratisInvocacoesGastas:
string[]` de IDs de invocação — generalização do boolean único do
Pacto do Tomo pra permitir várias simultâneas). Antes de quebrar uma
leva de invocações parecidas em entregas separadas, perguntar "quantas
têm o MESMO formato de efeito?".

**Nem toda invocação "avontade" (ilimitada) dispensa botão de Usar:**
só vira tag "sem custo" sem botão quando o uso não muda nenhum estado
rastreado. Vigor Ínfero é ilimitada mas cada uso pode mudar o PV
Temporário de verdade — por isso tem campo próprio
(`pvTemporarioConcedido`) que força botão real mesmo com `recarga:
'ilimitado'`. Perguntar "o uso muda algum estado rastreado?", não só
olhar pra `recarga`.

**PV Temporário — motor novo, não é "mais um número igual ao PV
normal":** dano desconta primeiro do PV Temporário, só o excedente
desconta do normal; cura nunca soma em PV Temporário; ganhar PV
Temporário de novo NÃO soma com o que já tem, fica o maior dos dois.
`core/pvTemporario.ts` isola a lógica em 2 funções puras testadas
(`aplicarAlteracaoPv`, `ganharPvTemporario`) — `alterarPv()` (já usado
pelos botões -5/-1/+1/+5 do Combat) roteia por ali, sem mudança na UI.
Valor fixo de dado (ex: "2d4+4 sem rolar, usa o máximo") vira número
comentado com a fonte, não um motor genérico de "maior valor de uma
expressão de dado" (não existe, só serve pra esse caso hoje).

**Pacto da Lâmina — arma conjurada vira `ItemMochila` de verdade, não
estado à parte:** `vincularArmaDePacto`/`desvincularArmaDePacto`
(`core/pactoDaLamina.ts`) criam/removem um `ItemMochila` comum
(`armaDePacto: true`), reaproveitando 100% do equipar/desequipar/CA/
Atacar existentes — zero UI nova precisou saber que a arma é "de
pacto". `desvincular` remove o item por completo (é conjurado, não
"guardado"). Atributo de ataque forçado (Carisma em vez de
Força/Destreza) virou parâmetro opcional (`atribForcada?: number`) em
`ataqueComArma`/`ataqueAtual`, substituindo a escolha padrão quando
presente — reaproveitável por qualquer fonte futura que force o
atributo de ataque. Só existe 1 arma de pacto por vez: vincular uma
nova substitui a anterior automaticamente (filtra `armaDePacto` antes
de adicionar).

**Ataque Extra por invocação (Lâmina Sedenta/Devoradora) vira só um
`Math.max`, não um sistema novo:** função separada e pura
(`ataqueExtraDoPactoDaLamina`, `core/pactoDaLamina.ts`) devolve quantos
ataques extras a invocação dá; número final = `Math.max(numeroDeAtaques(...),
1 + extra)` — zero mudança na UI do Combat, que já sabia lidar com
múltiplos ataques desde o Guerreiro. "Restrito à arma de pacto" é
condição de CADA leitura (Mão Principal atual = arma de pacto), nunca
estado salvo — trocar de arma no meio da sessão já reflete sozinho no
próximo cálculo.

**Familiar via Pacto da Corrente reaproveitou o Motor de Pets genérico
sem mudança de schema.** `formasFamiliarConcedidas: string[] | null`
(8 formas especiais, nomes de `criaturas.ts`) lido por
`core/invocacoesFamiliar.ts` (`formasFamiliarDasInvocacoes`, mesmo
formato de `magiasGratisDasInvocacoes`). "Convocar Familiar" reaproveita
o MESMO formulário "Adicionar Pet" (`AdicionarPet`/`PetsTab.tsx`), só
com a lista de opções restrita. "Só 1 familiar por vez" reaproveitou o
padrão do Pacto da Lâmina: `Pet.origemInvocacaoId?: string` marca de
qual Invocação um pet veio; convocar de novo pela MESMA fonte filtra o
pet anterior dela antes de adicionar o novo — mesma regra de
"vincular substitui a anterior", aplicada a uma criatura em vez de um
item. Pets de outras origens nunca são afetados.

**Data/origem:** 2026-09, plano "Invocações Místicas Fase 2" (IM.1,
IM.2, IM.4, IM.5) + Fase P (Motor de Pets, P3/P4).

## Bruxo — pré-requisito encadeado entre Invocações Místicas

**Achado do Osmar:** o dado (`invocacaoRequeridaId`) já modelava
corretamente cadeias como Pacto da Lâmina → Lâmina Sedenta → Lâmina
Devoradora, mas nada no app lia esse campo — dava pra marcar um elo
sem o requisito, ou tirar o requisito com o elo dependente ainda
marcado.

**3 funções puras em `core/invocacoesMisticas.ts` (testadas),
reaproveitadas nos 2 lugares que escolhem invocação (wizard
`ClasseEscolhasStep.tsx` + Level Up `LevelUpShell.tsx`):**
- `invocacaoRequeridaDe(inv)` — devolve a invocação que `inv` exige (ou
  `null`), mostra a linha "Requer: X".
- `invocacaoBloqueadaPorRequisitoAusente(inv, atuais)` — bloqueia
  MARCAR uma invocação cujo requisito não está entre as já marcadas.
- `invocacoesQueDependemDe(id, atuais)` — bloqueia DESMARCAR uma
  invocação que ainda serve de requisito pra outra marcada (regra
  real: abandonar uma cadeia exige desmontar de trás pra frente, 1
  troca por level-up).

**Padrão pra futuras invocações com requisito:** basta preencher
`invocacaoRequeridaId` no dado — qualquer tela de escolha de invocação
já aplica a trava e a linha "Requer: X" sozinha, sem código específico
por invocação.

**Data/origem:** 2026-09, achado do Osmar revisando a cadeia de Pacto
da Lâmina.

## Bruxo — Invocações Místicas no Level Up: reuso direto + lição de display

**Reaproveitamento direto:** o passo "Invocações Místicas" no Level Up
é cópia do padrão já usado em Truques/Magias Preparadas — lista única
pré-marcada, `contarTrocas` valida "só 1 trocada por level-up", mesmo
componente de check-row. Só o catálogo muda
(`invocacoesElegiveisAteNivel(novoNivel)`, filtra por
`prerequisitos.nivelMinimo`), extraído pra função reaproveitada tanto
no wizard quanto no Level Up.

**Lição pra qualquer classe com escolha parecida: checar se existe
display na Ficha ANTES de considerar o Level Up "completo".** O
wizard deixava escolher, mas nada mostrava as Invocações escolhidas
depois — sem isso, "crescer/trocar" fica invisível. Padrão de exibição:
seção própria em `PerfilTab.tsx` (mesmo padrão `[PH] sem efeito
mecânico ainda` de Talentos), populada por estado
`*Atuais`/`personagemSalvo.campoAtual ?? selecao.campoEscolhido` (mesmo
par já usado por Truques/Magias).

**Data/origem:** 2026-09, plano "Bruxo — base + Patrono Ínfero", B4.3.

## `[PH]` de catálogo incremental deve vir de campo real, nunca hardcoded

**Achado (Talentos e Invocações Místicas, mesmo bug nos dois):**
`PerfilTab.tsx` mostrava `[PH] sem efeito mecânico ainda` em TODO item
de um catálogo, mesmo nos que já tinham ganhado `efeitoMecanico`/campo
equivalente implementado de verdade. Corrigido derivando de um campo
real (`talentoTemPlaceholder(t)` em `core/classificarTalento.ts` lê
`efeitoMecanico === undefined`).

**Padrão geral pra qualquer catálogo com "fase 2/N" incremental:**
nunca hardcodar `[PH]` fixo numa tela de listagem — sempre derivar de
um campo real (`efeitoMecanico`, `magiaGratisConcedida`, etc.), porque
a lista de "o que já foi implementado" cresce entrega a entrega e o
texto fixo fica desatualizado silenciosamente.

**Escolha de talento por categoria virou 1 prop, não 1 componente
novo:** `TelaEscolherTalento.tsx` tinha `categoria === 'Geral'`
hardcoded — virou prop `categoria` (padrão `'Geral'`). A Dádiva Épica
do Bruxo (nível 19) reaproveitou 100% essa tela com
`categoria="Dádiva Épica"`, sem aplicar ASI (Dádivas Épicas não
concedem Aumento de Atributo) — o resultado cai no mesmo array
`talentosGeraisAtuais` de sempre.

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo".

## Bruxo — Astúcia Mágica / Mestre Místico: variante vira branch, não entrega própria

**"Recupera metade, arredondado pra cima" e "recupera tudo" (Mestre
Místico, nível 20) viram uma função pura só:**
`espacosARecuperar(maximoTotal, gastoAtual, mestreMistico)` em
`core/astuciaMagica.ts` — `mestreMistico: true` é só um branch a mais
dentro da MESMA função. Padrão pra qualquer característica de nível
alto que seja "a mesma característica de nível baixo, com o teto
removido": nunca vira entrega própria, é 1 branch na função existente.

**1x por Descanso Longo, nunca reseta no Curto** — campo
`astuciaMagicaGasta: boolean` só zera dentro de `descansoLongo()`.
Botão trava sozinho quando não há nada pra recuperar (0 espaços
gastos) — house rule de UX pra evitar queimar o uso à toa, não altera
nenhum número de personagem.

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo".

## Bruxo — Arcana Mística: "N usos independentes que crescem 1 por vez" + troca por chave

**Padrão novo:** uma característica que concede vários usos "de
graça" INDEPENDENTES entre si, cada um desbloqueado num nível
diferente, cada um com seu PRÓPRIO cooldown de Descanso Longo (usar o
de 6º círculo não trava o de 7º) — diferente de `magiaGratisConcedida`
(1 magia por invocação, sempre disponível) e de um boolean único (1
uso só).

**Modelagem:** `arcanaMisticaAtual: Record<circulo, nome da magia>`
(cresce 1 chave por nível desbloqueado, nunca reseta) +
`arcanaMisticaGastos: number[]` (lista dos CÍRCULOS usados desde o
último Descanso Longo — permite qualquer combinação de "usei o de 6º
mas não o de 7º"). Reaproveitar esse par Record+array pra qualquer
característica futura com essa forma. Novo passo de Level Up descobre
sozinho qual círculo é novo comparando o desbloqueado no nível atual
vs. no novo — não hardcoda "nível 11 = 6º círculo" na tela, só na
função pura testada (`core/arcanaMistica.ts`).

**Troca de uma coleção por CHAVE (Record), não lista solta:**
`contarTrocas(originais, finais)` (Truques/Invocações/Magias
Preparadas) só serve pra listas soltas tipo checkbox — não dá pra
aplicar num `Record<circulo, magia>`, onde cada círculo é slot próprio
(trocar o 6º não deveria contar como mexer no 7º). Nova
`trocasArcanaMistica(atuais, escolhidas)` (testada) conta só círculos
presentes NOS DOIS lados com magia diferente; um círculo que só existe
no lado `escolhidas` (escolha inicial de círculo recém-desbloqueado)
nunca conta como troca — mesmo limite de "1 troca por level-up", só
que a unidade é a chave do Record, não a lista inteira. O passo tem 2
partes independentes que competem pelo mesmo limite: escolha
OBRIGATÓRIA do círculo novo + troca OPCIONAL de qualquer círculo já
conhecido (ícone 🔄 abre `TrocarValorSimples`, mesmo componente
genérico de Resistência Ínfera). `onConfirmar` manda
`arcanaMisticaAlteracoes: Record<circulo, magia> | null` (substituiu a
forma antiga de só 1 círculo por vez) — `core/levelUpAleatorio.ts`
(Level Up Rápido) foi atualizado junto.

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo" +
pedido do Osmar revisando os itens abertos do Bruxo.

## Talento/característica que só "dá Vantagem/Desvantagem numa rolagem" não precisa integrar com o RollOverlay

**Padrão:** antes de desenhar integração nova com o sistema de
rolagem, verificar se o RollOverlay já resolve sozinho — ele já tem
botões livres de Vantagem/Desvantagem em QUALQUER rolagem de d20
(ataque, teste, salvaguarda, iniciativa), sem precisar de recurso pra
usar. Nesse caso o talento só precisa acompanhar a pool de usos em si
(mesmo padrão de contador com reset em Descanso de Indomável/Surto de
Ação: `EfeitoMecanicoTalento` + campo `xGasto` + card em `CombatTab`
com lembrete de texto). Só vale integrar de verdade com o RollOverlay
quando o efeito muda automaticamente um NÚMERO da rolagem (bônus, dado
extra) — aí precisa de mecanismo tipo `registrarBonusExtra` (Sorte do
Tenebroso/Perícia Inigualável).

**Data/origem:** 2026-09, foco Origens Grupo E (Sortudo).

## Mesmo talento pego por 2 fontes independentes — gaveta de estado separada por fonte, nunca compartilhada

**Problema:** um talento com escolha extra (Habilidoso — perícia/
ferramenta; Iniciado em Magia — lista + truques + magia + atributo)
pode vir de mais de uma fonte no mesmo personagem (Talento de Origem +
traço Versátil/Humano). Se as duas escreverem no MESMO campo de
estado, escolher pela 2ª sobrescreve a 1ª — sério quando as duas
concedem o MESMO talento.

**Solução, padrão pra qualquer futuro "mesmo talento, 2+ fontes
possíveis":** cada fonte grava numa gaveta de estado PRÓPRIA, mesmo
duplicando o formato do campo. Ex.: `proficienciasTalentoOrigemEscolhidas`
(Origem) ganhou o espelho `proficienciasTalentoEspecieEscolhidas`
(Versátil); mesma coisa pra `truquesMagiaIniciadaEscolhidos`/
`magiaMagiaIniciadaEscolhida`/`atributoMagiaIniciadaEscolhido` → sufixo
`Especie`. As funções de LEITURA (`periciasProficientes`/
`ferramentasProficientes` em `calculoPersonagem.ts`,
`truquesMagiaIniciada`/`magiasMagiaIniciada` em
`magiaTalentoOrigem.ts`) somam as duas gavetas sempre, sem saber qual
fonte concedeu o quê.

**Iniciado em Magia pego avulso (sem Origem) precisa de seletor extra
de lista** (`TalentoEspecieEscolhasStep`, campo
`listaMagiaIniciadaEspecieEscolhida`) antes de truques/magia aparecerem
— trocar de lista limpa a escolha antiga (não pode misturar magia de
uma lista com truque de outra).

**UI compartilhada:** telas de wizard finas (`TalentoOrigemEscolhasStep`,
`TalentoEspecieEscolhasStep`) só resolvem QUAL talento e QUAL gaveta
usar — o corpo visual (`ProficienciaOuFerramentaEscolhas`/
`IniciadoEmMagiaEscolhas`) mora em `talentoEscolhasCompartilhado.tsx`,
parametrizado por callbacks em vez de ler `selection` direto, servindo
qualquer gaveta sem duplicar JSX.

**Data/origem:** 2026-09, foco Origens (Humano/Versátil).

## Substituição de escolha de Talento no Level Up — padrão "gaveta(s) opcional(is), sem limite de 1 troca"

Vários Talentos/características deixam trocar 1 escolha fixa (magia,
arma) a cada level-up, ALGUNS sem o limite de "1 troca" que Arcana
Mística tem (Iniciado em Magia: "sempre que alcança um novo nível,
pode substituir uma das magias" — sem teto). Não reaproveita o
contador `trocasArcanaMistica`, só o componente visual
(`TrocarValorSimples`) e a estrutura de passo.

**Padrão pra qualquer futura "troca de escolha fixa" parecida:**
1. Prop `xAtual` no `LevelUpShell` com o valor já escolhido (`null` =
   personagem não tem essa fonte).
2. Passo só entra em `luSteps` se a prop existir.
3. Estado local inicializado com o valor atual; "mudou" = comparação
   simples com o original.
4. `onConfirmar` só manda o campo alterado (`null` = sem troca) — o
   pai aplica só quando não for `null`, preservando o atual caso
   contrário.
5. `sortearLevelUpRapido` sempre manda `null` pra esse campo — não
   sorteia uma troca opcional.

Duas gavetas independentes do MESMO talento (Origem + Versátil, ver
seção acima) usam o MESMO passo, 1 card por gaveta ativa
(`magiaIniciadaOrigemAtual`/`magiaIniciadaEspecieAtual`, cada `{ lista,
magia } | null`) — sem card quando nenhuma gaveta tem o talento; cada
card troca só a própria magia.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo A — Origem).

## Talento com contagem que CRESCE por Bônus de Proficiência (não escolha nova) — passo de "completar", fora do calendário de ASI

**Diferente de "troca de escolha fixa" e de Arcana Mística (N slots
independentes, cada um só desbloqueia 1 vez): aqui é 1 MESMA coleção
que fica maior sozinha** — Conjurador Ritualista deixa escolher N
magias Rituais, N = Bônus de Proficiência ATUAL; quando o Bônus sobe
(níveis 5/9/13/17, calendário PRÓPRIO — não coincide com ASI/Talento,
4/8/12/16/19), o jogador completa a coleção com +1, sem perder as já
escolhidas.

**Padrão pra qualquer futura "coleção que cresce sozinha por nível":**
1. Função pura que calcula o tamanho ATUAL da coleção pro nível dado.
2. No `LevelUpShell`: comparar esse tamanho no `novoNivel` contra
   quantas já foram escolhidas — se maior, o passo entra de novo em
   `luSteps`, **fora de qualquer bloco condicionado a nível de ASI**
   (o gatilho é o recurso que cresceu, não o calendário de Talentos).
3. `useState` pré-semeado com as escolhas JÁ FEITAS — cada uma já
   escolhida fica travada (só completa até o novo total).
4. `onConfirmar` manda a coleção COMPLETA (antigas + novas) pra mesma
   chave de sempre — o pai só faz merge/overwrite.
5. Nada disso precisa saber QUAL nível concede QUAL Bônus de
   Proficiência na tela — só a função pura (`bonusProficiencia`) sabe.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B — Conjurador
Ritualista).

## "Grátis 1x" com 1 uso COMPARTILHADO entre vários itens (não 1 por item)

Todo "grátis 1x/Descanso Longo" implementado até aqui trata cada magia
como um uso INDEPENDENTE (chave própria em `magiasGratisGastas`).
Ritual Rápido (Conjurador Ritualista) é diferente: 1 uso ÚNICO,
compartilhado entre TODAS as magias Rituais conhecidas — usar em
qualquer uma gasta o mesmo uso.

**Modelagem:** mesma lista `magiasGratisGastas` (reseta no Descanso
Longo), só com 1 chave FIXA por talento (`talento:<id>:ritual-rapido`,
`CHAVE_RITUAL_RAPIDO` em `core/magiaTalentoGeral.ts`) em vez de 1
chave por `magia.nome` — zero estado novo. UI mostra 1 pip só (cor
`variante="especial"`, ver `DECISOES-DESIGN.md` "Ticks/pips
padronizados") pra deixar claro que não é o mesmo Espaço de Magia.
Qualquer futura "N itens conhecidos, 1 uso grátis compartilhado entre
eles" reaproveita essa chave fixa em vez de criar array de estado
novo.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B — Conjurador
Ritualista).

## `LevelUpShell` — passo condicionado ao talento ESCOLHIDO NESTE level-up nunca pode entrar ANTES de `asi`

**Bug real:** um passo (`especialista`) ganhou condição extra pra
aparecer quando um talento específico é escolhido, e foi colocado no
topo do array `luSteps` (antes do bloco de `asi`). Resultado: no
instante em que o jogador tocava no talento (ainda DENTRO do passo
`asi`), o array mudava de tamanho antes do índice de `asi` — como
`luIndex` é só um número fixo, o passo exibido "pulava" sozinho, sem o
jogador clicar "Avançar".

**Regra permanente:** qualquer passo cuja presença depende do talento
escolhido NESTE MESMO level-up (`talentoObjEscolhido`/
`tipoEfeitoTalentoEscolhido`) só pode ser empurrado DEPOIS do passo
`asi` — nunca antes, mesmo que o passo já existisse por outro motivo
(ex.: característica de classe). Padrão já certo antes disso:
`asiAtributo`/`talentoMagia` e `precisaCrescerMagiaRitual` ficando fora
do bloco de ASI de propósito. Ao adicionar condição nova a um passo
que já existe por outro gatilho, mover o push pra depois do bloco de
`asi` em vez de só adicionar `|| condicaoDoTalento` na linha antiga.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B — Especialista
em Perícia).

## Ação genérica (Cap. 1) "vira Ação Bônus" — mantém nas DUAS listas, jogador escolhe qual gasta

Analítico/Mente Aguçada dizem "Ação Procurar/Analisar vira Ação
Bônus" — decisão do Osmar: a ação NÃO desaparece da lista de Ação
normal, só passa a aparecer TAMBÉM na de Ação Bônus (o jogador escolhe
qual recurso do turno gastar a cada vez).

**Implementação:** `core/periciaTalentoGeral.ts`
(`acoesConvertidasEmBonus`) varre os Talentos Gerais atuais e retorna
os nomes das ações liberadas; `FichaShell` filtra `data/exampleCombat.ts`
(`acoesBase`) por esses nomes e passa pro `BonusPanelContent`, que
reaproveita o MESMO formato de linha já usado em
`AcaoPanelContent`/`ReacaoPanelContent`.

**Gotcha:** `BonusPanelContent` nunca tinha um `onEscolher` ligado a
`escolherNoPainel` (diferente dos outros 2 painéis) — cada item de
Ação Bônus tinha seu PRÓPRIO handler de estado, sem marcar o recurso
"Ação Bônus" do turno como usado. Pra ações genéricas convertidas,
ligar `onEscolher={(nome, desc) => escolherNoPainel('bonus', nome,
desc)}` — os itens originais de Ação Bônus continuam com handlers
próprios, sem mudança.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B —
Analítico/Mente Aguçada).

## Necromante (Mago, homebrew) — convenção de homebrew reaproveitável

Primeira subclasse homebrew do projeto (regra não confirmada
oficialmente — Osmar pediu marcação clara em toda tela que a mostra).
Padrão pra qualquer homebrew futura:

- **Campo explícito, nunca implícito.** `Subclasse.homebrew: boolean`
  (obrigatório em toda entrada de `subclasses.ts`, mesmo padrão de
  campo explícito de `InvocacaoMistica`). `ui/components/BadgeHomebrew.tsx`
  — selo "🏠 Homebrew" + linha de texto sempre visível (nunca só
  tooltip, hover não existe em touch). Aplicado nos 2 lugares que
  mostram subclasse (card de escolha no Level Up, seção Subclasse da
  aba Perfil) — os dois leem `Subclasse.homebrew`, nunca comparam por
  nome.
- **Dado homebrew mora em arquivo PRÓPRIO, nunca no gerado da
  planilha.** `caracteristicasSubclasseHomebrew.ts` (não
  `caracteristicasSubclasse.ts`, gerado da planilha, não editar à mão)
  — transcrito à mão da fonte homebrew fornecida pelo Osmar, o arquivo
  é a própria fonte primária desse texto. `core/levelUp.ts` junta os
  dois arrays (`todasCaracteristicasSubclasse`) numa função só, o motor
  de Level Up lê igual sem se importar de onde veio.
- **Reconferir a FONTE ao implementar o número, não só a 1ª
  transcrição** — um valor de cura homebrew já saiu errado
  ("dobro do ND" em vez de "nível de Mago", o texto real) só
  descoberto testando; vale reconferir a fonte no momento de escrever
  a fórmula em `core/`, não confiar só na transcrição de uma entrega
  anterior.

**Motor de Pets (genérico) serviu 100% pras características que
dependem de "criatura sob controle"** (Familiar Morto-Vivo, Legião dos
Mortos, Colheita Macabra/dos Mortos, Mestre da Morte) — nenhuma
precisou de motor próprio de "invocação", só filtros por cima
(`ehMortoVivo`, `petsMortoVivo`) sobre `BonusExtraPet`/`pvTemporario`
genéricos já existentes em `core/pets.ts`. Ver `DECISOES-DESIGN.md`
pros 2 padrões de UI que nasceram aqui (modal no FichaShell pra efeito
pós-conjuração que atravessa aba; gatilho de Reação como estado
derivado, não evento de mutação).

**Data/origem:** 2026-09, Fase B (Necromante).

---

## Multiclasse — "nível na classe ativa" nunca deixou de ser o padrão; só ganhou um "nível total" ao lado

**Decisão:** `personagem.nivel`/`personagem.subclasse` continuam
significando exatamente o que sempre significaram — nível/subclasse
**da classe em foco** (`classeAtivaNome`, `core/multiclasse.ts`) — em
praticamente todos os ~70 pontos que já liam esses campos (recursos de
classe, espaços de magia, características/subclasse, truques/magias
preparadas). Isso é o que faz um personagem multiclasse "simplesmente
funcionar" sem reescrever esses ~70 pontos: cada classe calcula suas
próprias coisas olhando só o próprio nível, exatamente como já fazia
quando só existia 1 classe.

Um `nivelTotalPersonagem(classesAtual)` **separado** entra só nos
poucos pontos que a regra real liga ao nível TOTAL do personagem, não
ao de uma classe isolada: Bônus de Proficiência (e tudo que soma ele —
perícias, ferramentas, Percepção Passiva, Iniciativa, recursos
baseados em Bônus de Proficiência tipo Conhecimento de Pedras/Pico de
Adrenalina/Ataque de Sopro) e qualquer coisa de espécie (não de
classe) que escale por nível de personagem (ex: magias de Linhagem
Élfica). `calcularPericias` precisou de um 5º parâmetro opcional
(`nivelTotal`) porque ela mistura os dois: o Bônus de Proficiência
(total) E o gatilho de "Pau pra Toda Obra" do Bardo (nível NA classe)
na mesma função — os outros 3 helpers afetados (`calcularIniciativa`,
`calcularPercepcaoPassiva`, `calcularProficienciasFerramenta`) não
tinham esse conflito, só passaram a receber nível total no lugar do
nível único que já recebiam.

**"Classe ativa" (o que aparece na ficha) é um conceito DIFERENTE de
"classe original" (o que decide proficiência de arma/armadura).** Um
personagem multiclasse tem 1 seletor de pill pra decidir qual classe
mostrar (Truques/Magias/recursos daquela classe) — mas a proficiência
de arma/armadura NUNCA olha pra pill: ela sempre usa a PRIMEIRA classe
do personagem (`classesAtual[0]`, sempre a original, nível 1 "puro")
com a tabela cheia de proficiência, e QUALQUER outra classe
multiclassada depois dela com o pacote reduzido (SDD Multiclasse
seção 6, `data/rulesets/dnd2024/proficienciasEntradaMulticlasse.ts`).
Um Guerreiro que multiclassa pra Mago continua com armadura Pesada
mesmo com a pill em "Mago" — ele não "perde" a proficiência da classe
original só porque ela não está em foco. Isso foi um bug real pego só
testando ao vivo no navegador (a 1ª versão usava a classe ativa pros
dois papéis) — vale como lembrete de sempre testar troca de pill com
uma classe original que tenha proficiência que a nova classe NÃO
daria, não só o caminho feliz.

**Tela de escolha de classe no Level Up vive FORA do `LevelUpShell`.**
`EscolherClasseLevelUp.tsx` é um componente próprio, aberto pela
`FichaShell` ANTES de `LevelUpShell` (nunca dentro da lista de passos
dele) — `LevelUpShell` continua recebendo `classe`/`personagem` já
resolvidos, sem saber que multiclasse existe. Só aparece quando há
escolha de verdade (`deveEscolherClasseNoLevelUp` — 2+ opções: classes
já possuídas + qualquer outra classe cujo pré-requisito de atributo já
bate, nas DUAS pontas, seção 2 do SDD); com 1 classe só e nenhuma
outra elegível, a tela nunca aparece, fluxo idêntico a antes.

**Conjuração combinada — pool COMBINADO ganha uma chave própria, nem
classe ativa nem classe original.** Quando o personagem tem 2+ classes
conjuradoras normais ao mesmo tempo (Bardo/Clérigo/Druida/
Feiticeiro/Mago completos, Guardião/Paladino meio, Guerreiro/Ladino só
com a subclasse certa — nunca o Bruxo, sempre à parte), a soma vira o
"Nível Equivalente" (SDD seção 8.2: cheio + metade-pra-cima +
terço-pra-baixo conforme o tipo) e consulta a tabela oficial
"Conjurador Multiclasse" — sempre mais fraca que a soma das tabelas
isoladas, de propósito. Esse pool tem UMA chave própria
(`"combinado"`) dentro de `espacosGastosPorClasseECirculo`, escrita e
lida IGUAL não importa qual das 2 classes esteja na pill — trocar de
pill não duplica nem zera o contador, porque as duas leem a mesma
chave. `data/rulesets/dnd2024/conjuradorMulticlasse.ts` guarda a
classificação (fato de regra, não vem da planilha).

**Padrão geral:** cada "pool de Espaço de Magia" que o personagem pode
ter (classe isolada, Magia de Pacto do Bruxo, ou combinado) usa uma
CHAVE PRÓPRIA dentro do mesmo dict `espacosGastosPorClasseECirculo` —
nunca reaproveita o nome de uma classe pra outra coisa. Adicionar um 4º
tipo de pool no futuro (ex: classe homebrew com recurso próprio) segue
o mesmo padrão: nova chave, sem mexer nas que já existem.

**Data/origem:** 2026-09, Fase M completa (Multiclasse).
