# DECISOES-CLASSES.md

> Decisões de design sobre a **implementação de classes** — padrões
> reutilizáveis descobertos implementando Guerreiro e Bardo (+
> Colégio do Conhecimento), pensados pra valer pras próximas ~10
> classes e ~35 subclasses. Parte da família `DECISOES-*.md` — ver o
> índice em `DECISOES-DESIGN.md`, e a seção 7 do `CLAUDE.md` pra regra
> de quando registrar uma entrada aqui.
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

**Padrão:** antes de codar uma classe nova, mapear nível a nível
contra a progressão real (planilha/livro), procurando por categorias
de "coisa de level-up" e "coisa de Combat" que o motor genérico ainda
não sabe lidar — cada classe nova tende a introduzir 1-2 categorias
novas, não reinventa tudo. Categorias já suportadas pelo motor
(`core/levelUp.ts`) até agora: subclasse única (nível fixo por
classe), ASI/Talento, escolha trocável a TODO level-up (Estilo de
Luta), escolha trocável só por Descanso Longo — não por level-up
(Maestria em Arma), escolha exclusiva de nível único (Dádiva Épica),
recurso que repete o mesmo nome ao escalar (Indomável), recurso que
muda de nome a cada salto (Ataque Extra → Dois Ataques Extras), troca
opcional de magia preparada por level-up (padrão A de caster, ver
"Casters" abaixo).

**Ordem de implementação recomendada, validada 2x (Guerreiro,
Bardo):** classe base completa (sem subclasse) primeiro, depois
subclasses da mais simples (só passivo, zero recurso novo) pra mais
complexa (subclasse que introduz sistema inteiro novo, ex: conjuração
completa numa classe marcial). Dentro da classe base, comece pelas
características mais simples (passivas/informativas) antes das que
pedem estado novo (banco de usos, contador por-turno).

**Antes de aceitar um achado de regra rebuscado** (ex: "Estilo de
Luta troca a cada level-up, não é fixo"): confirmar direto no
PDF/planilha, nunca copiar de memória ou de um resumo externo sem
checar.

**Antes de codar a 3ª classe em diante, auditar acoplamento implícito
deixado pela(s) classe(s) anterior(es)** — confirmado 2x seguidas: a
2ª classe (Bardo) expôs 3 lugares que assumiam "é sempre Guerreiro"
sem checar o recurso real (ver "Bardo — decisões" abaixo), e o
postmortem Guerreiro+Bardo (2026-09) achou pelo menos 1 caso que só
vai quebrar na 3ª (`core/ataque.ts` soma Bônus de Proficiência em
qualquer arma sem checar proficiência real — invisível com Guerreiro
E Bardo, porque as duas têm acesso amplo a arma; Bruxo, só
proficiente em arma Simples, é a 1ª que vai expor isso — ver
`PENDENCIAS.md`). Padrão: buscar por comparação hardcoded de nome de
classe ou suposição "toda classe tem X" antes de importar a classe
seguinte, não só quando o bug aparecer.

**Data/origem:** 2026-08, plano do Guerreiro + repetido no Bardo.
Postmortem Guerreiro+Bardo, 2026-09, antes do Bruxo.

## Motor de Level Up genérico (`core/levelUp.ts`)

**Funções que leem a progressão real da classe** (nunca constante
hardcoded) e os padrões que cada uma resolve:
- `niveisComASI(classe)` / `niveisComDadivaEpica(classe)` — tabela de
  níveis-de-ASI é **por classe**, não uma constante global (Guerreiro
  tem 6 níveis de ASI — 4/6/8/12/14/16 —, não os 5 "padrão" que
  valem pra maioria).
- `temEstiloDeLutaTrocavel(classe, nivel)` — procura a característica
  por NOME na progressão até o nível atual, então funciona pra
  qualquer classe que tenha "Estilo de Luta" sem precisar de código
  novo.
- `caracteristicasDoNivel(classe, nivel)` — junta nome (sempre em
  `classes.ts`) + descrição real (quando já importada).
- `contarRepeticoesCaracteristica(classe, nome, nivel)` — resolve o
  padrão "repete o mesmo nome ao escalar" (Indomável 9/13/17 → usos
  1/2/3): conta ocorrências até o nível atual.
- `numeroDeAtaques(classe, nivel)` — resolve o padrão "muda de nome a
  cada salto" com um mapa fixo de nomes oficiais do livro (`'Ataque
  Extra': 2, 'Dois Ataques Extras': 3, 'Três Ataques Extras': 4`) —
  compartilhado por várias classes, não hardcode de uma só.
- `caracteristicaDesbloqueada(classe, nome, nivel)` — característica
  nomeada já concedida até o nível atual (usado pra InfoChip
  informativo e pra gatilhos condicionais, ex: "só a partir do nível
  X").

**Gotcha real e recorrente, confirmado 2x (Indomável no Guerreiro,
Especialista no Bardo):** o livro nomeia a MESMA característica de
jeito diferente em níveis diferentes (Guerreiro: nada muda; Bardo:
"Especialista" no nível 2, "Especialização" no nível 9). Nunca
assumir nome fixo — funções que buscam característica por nome devem
aceitar uma lista de nomes possíveis, não 1 string só.

**Data/origem:** 2026-08, Guerreiro B1/B4 + Bardo Especialista.

## Guerreiro — recursos e mecânicas implementadas (base, nível 1-20)

**Banco de usos compartilhado entre 2 features diferentes:**
Recuperar Fôlego e Mente Tática gastam o MESMO banco (regra real:
Mente Tática "gasta um uso de seu Recuperar Fôlego") — modelado como
1 contador só, não dois. Recuperar Fôlego vive dentro do painel de
Ação Bônus (é uma Ação Bônus de verdade); Mente Tática fica fora da
economia de ação (card sempre visível na Combat), porque a regra não
consome o turno — é reativo a "falhar um teste de atributo", pode
acontecer a qualquer momento. Indomável segue o mesmo "fora da
economia de ação", mas só recupera no Descanso Longo (não no Curto,
diferente dos outros dois).

**Ataque Extra — UI de múltiplos golpes na mesma Ação:** o painel de
Ação fecha e marca a Ação como usada assim que qualquer opção é
escolhida — mas Ataque Extra dá vários ataques dentro da MESMA Ação,
não uma Ação por ataque. Padrão: um callback separado (`onAtacar`)
conta ataques feitos no turno e só fecha o painel/marca a Ação como
usada no último; os anteriores mantêm o painel aberto ("ataque N/M").
Cada instância de ataque é **independente** — pode escolher
arma/Ataque Desarmado (e sub-opção Dano/Empurrar/Imobilizar)
separadamente por instância, não um "modo" único pra ação toda.

**Surto de Ação concede ação, não consome:** ao contrário de
Recuperar Fôlego (uma Ação Bônus de verdade), Surto de Ação não pode
marcar a Ação normal como usada — só decrementa o banco de usos. O
limite duplo do nível 17 (2 usos por descanso, só 1× por turno) usa
um flag separado do contador de usos, resetado no fim do turno.

**Maestria em Arma troca por Descanso Longo, não por Level Up** —
mecanismo de troca diferente do Estilo de Luta; aparece como opção no
fluxo de Descanso, não no de Level Up. Nº de armas lido do recurso
real da classe (`core/maestriaArma.ts`), nunca hardcoded.

**Data/origem:** 2026-08, plano "Guerreiro 1-20" (decisão original de
decupagem arquivada — só os padrões acima seguem relevantes pras
próximas classes).

## Casters — 3 padrões reais de troca de magia (não é "known vs prepared")

**Achado central, antes de implementar a 1ª classe conjuradora:** a
troca de magia preparada tem **3 variações reais** entre os 8
conjuradores do jogo (Mago, Clérigo, Druida, Bardo, Feiticeiro,
Bruxo, Guardião, Paladino) — não a divisão binária comum "known vs
prepared":
- **Padrão A (restritiva):** troca só 1 magia, só ao subir de nível —
  Bardo, Bruxo, Feiticeiro.
- **Padrão B (flexível por descanso):** troca só 1 magia, mas a cada
  Descanso Longo — Guardião, Paladino (meio-conjuradores).
- **Padrão C (redefinição livre):** troca qualquer quantidade, a cada
  Descanso Longo — Clérigo, Druida, Mago (Mago tem uma camada extra:
  só prepara o que já está no grimório físico — fora de escopo por
  ora).

**O que generaliza pras 8, sem exceção:** truque nunca gasta espaço
de magia; espaço de magia é sempre banco por círculo, recuperando no
Descanso Longo — **exceto Bruxo**, que recupera no Curto também;
atributo de conjuração é sempre 1 só, fixo por classe (nunca escolha
do jogador); CD/bônus de ataque de magia seguem sempre a mesma
fórmula.

**Schema recomendado pra quando o motor precisar generalizar de
verdade (Bardo, único implementado até aqui, é só padrão A):**
`padraoDeTroca` (`restritiva | flexivel_por_descanso |
redefinicao_livre`) + `gatilhoDeTroca` (`level_up | descanso_longo`)
+ `qtdTrocavelPorVez` (`1 | "todas"`).

**Ordem de implementação recomendada:** Bardo (padrão A + truques +
9º círculo completo, já feito) → Clérigo ou Druida (padrão C) →
Guardião ou Paladino (padrão B, mais barato depois dos 2 anteriores)
→ Mago (grimório físico) → Bruxo (recuperação por Descanso Curto).

**Data/origem:** 2026-08, análise em chat paralelo revisada, antes do
Bardo.

## Bardo — decisões de implementação (base, sem subclasses)

**Schema de dado:** Espaços de Magia modelados como **9
`RecursoClasse` separados (1 por círculo)**, reaproveitando o schema
genérico já existente — nenhum schema novo precisou ser criado.
Catálogo de magias importado **de uma vez, todas as classes** (não
por classe) — resolve de graça a exceção de subclasses que dão acesso
a magia de outra classe inteira (ex: Colégio do Conhecimento).

**3 acoplamentos implícitos a Guerreiro encontrados e corrigidos ao
adicionar a 2ª classe** (relevante pra qualquer classe nova #3+):
1. Quantidade de perícias escolhidas era constante fixa no
   componente, não lida do recurso real da classe.
2. Seção "Estilo de Luta" era renderizada incondicionalmente — usar
   sempre `temEstiloDeLutaTrocavel` em vez de assumir que toda classe
   tem essa característica.
3. Validação do passo travava exigindo Estilo de Luta escolhido
   mesmo em classe sem essa característica — mesma causa raiz do #2.

**Crescimento de Truques/Magias Preparadas no Level Up — padrão
"uma lista só, marca o que já tinha":** a tela de escolha mostra o
catálogo completo, pré-marcado com o que o personagem já tem, limite
= o máximo do NOVO nível. Resolve "cresceu" (slot vazio força
completar) e "trocou" (desmarcar 1 antigo + marcar 1 novo) com a
MESMA interação, sem UI separada pra "modo troca". Validação: conta
quantos itens da lista ORIGINAL sumiram da seleção final — 0 ou 1
removido OK, 2+ bloqueia ("só pode trocar 1 por level-up" — regra
real). Reaproveitável por qualquer classe/recurso com a mesma regra
de troca (já usado por Truques, Magias Preparadas e Descobertas
Mágicas do Colégio do Conhecimento).

**Espaços de Magia rastreiam TODOS os círculos ativos ao mesmo
tempo, não só 1** — a partir do momento em que uma classe pode ter
2+ círculos com espaço simultaneamente (Bardo a partir do nível 3),
o estado precisa ser `Record<círculo, gasto>`, não um número único.

**Detector de déficit + tela "Completar":** se um Level Up passar sem
escolher Truques/Magias Preparadas (bug, ou personagem que subiu de
nível antes da funcionalidade existir), a ficha fica "atrasada" —
`deficitTruques()`/`deficitMagiasPreparadas()` comparam o que a
tabela da classe diz que deveria ter contra o tamanho da lista atual.
Tela "Completar" (`CompletarMagiasShell.tsx`) reaproveita a mesma UI
de escolha do Level Up, mas trava remoção — só permite fechar o
déficit, nunca trocar.

**Ataque de magia rola acerto automático, dano fica manual** — a
planilha não tem dado de dano estruturado por magia (só texto livre),
diferente do ataque de arma (`core/ataque.ts`, dado estruturado). Vale
pra qualquer classe conjuradora até esse dado existir (ver
`DECISOES-DADOS.md` "Magias — Upcast estruturado").

**Inspiração de Bardo — recurso com tamanho variável por CAR (não
tabela por nível) e múltiplas fontes de recarga:** usos = mod. de
Carisma (mínimo 1), só o TAMANHO do dado cresce por nível — por isso
tem arquivo próprio (`core/inspiracaoBardo.ts`) em vez de reaproveitar
a leitura genérica de recurso por tabela. A partir do nível 5, ganha
uma 2ª fonte de recarga (gastar Espaço de Magia, sem custar ação) além
do Descanso — primeiro caso de recurso recarregável por 2 fontes
alternativas diferentes.

**Segredos Mágicos (nível 10) — pool de magia emprestada de outras
classes:** a partir de um nível fixo, a lista de "o que pode preparar"
passa a incluir Clérigo/Druida/Mago além da própria classe (dedupe por
id). Função dedicada (`magiasDisponiveisParaPreparar`) usada nos
mesmos lugares que já montam o catálogo de escolha — mesmo padrão
reaproveitável por qualquer classe/subclasse com regra parecida (ver
Colégio do Conhecimento abaixo, que usa a MESMA lista de 3 classes por
coincidência de regra do livro, não por ser o mesmo mecanismo).

**Convenção de cor consolidada:** aviso que representa seleção
inválida/incompleta bloqueando avançar usa `--danger` (vermelho);
aviso informativo/não-bloqueante usa `--warn` (âmbar). Vale pro app
inteiro, não só telas de magia.

**Data/origem:** 2026-08, plano "Bardo" em 5 etapas (decupagem
original arquivada — só os padrões acima seguem relevantes).

## Colégio do Conhecimento — decisões de implementação (1ª subclasse com mecânica real)

**Bloqueio de subclasse ainda sem dado:** `subclasseImplementada`
checa se a subclasse tem pelo menos 1 característica importada — a
tela de escolha mostra as outras subclasses da mesma classe travadas
("ainda não implementada") até ganharem dado real. Genérico por dado,
não hardcoded por nome — vale pra qualquer subclasse futura.

**Gotcha de planilha, provável em qualquer classe/subclasse nova:** a
aba "Progressão de Classe" usa o texto literal **"Característica de
Subclasse"** como placeholder nos níveis em que o livro só diz "veja
sua subclasse" (não um nome fixo) — sempre tratar esse texto como
"resolver contra a subclasse escolhida", nunca como nome de
característica de verdade a buscar em `caracteristicasClasse.ts`
(confirmado em Bardo E Guerreiro — mesmo padrão nas duas classes já
importadas, deve valer pras próximas).

**Palavras de Interrupção (Reação) gasta o banco PRÓPRIO de
Inspiração de Bardo do personagem** — não concede a ninguém, caminho
paralelo ao uso normal de Inspiração, mas mesmo contador. Padrão:
subclasse pode consumir/estender um recurso já existente da classe
base, não precisa de contador novo.

**Proficiências Bônus — escolha real de perícia disparada por
subclasse:** passo novo no Level Up, dispara 1 vez só quando a
característica desbloqueia E o personagem ainda não tem as perícias.
Perícias escolhidas contam como proficiência de verdade (bônus
inteiro — dobrar continua exclusivo de Especialista).

**Descobertas Mágicas (nível 6) — 2 magias sempre preparadas, fora da
conta normal, de fora da própria classe** (Clérigo/Druida/Mago, mesma
lista de 3 classes de Segredos Mágicos por coincidência do livro — não
é o mesmo mecanismo, ver nota em "Bardo" acima). Trocável 1 por
level-up, mesmo padrão "uma lista só, marca o que já tinha".

**Perícia Inigualável (nível 14) — reembolso condicional de recurso,
único caso confirmado no jogo:** gasta 1 uso do banco normal de
Inspiração ao rolar, mas se mesmo assim falhar, o uso NÃO é gasto. Como
o app não sabe se o resultado final foi sucesso (só o jogador/mestre
sabe, comparando com a CD), o fluxo é: rola (gasto otimista, já
debita) → pergunta "ainda assim falhou?" → devolve o uso só se sim.
Padrão pra qualquer recurso futuro com a mesma regra de "só gasta se
funcionar".

**Data/origem:** 2026-08, plano "Colégio do Conhecimento" em 4
entregas (decupagem original arquivada).

## Escolha de subclasse — versão placeholder até ganhar mecânica real

**Decisão:** o step de escolha de subclasse no Level Up sempre deixa
escolher entre as opções REAIS da classe e salva o nome
(`PersonagemSalvo.subclasseAtual`), mesmo quando nenhuma característica
mecânica existe ainda — com aviso `[PH]` explícito (regra 12 do
`CLAUDE.md`). Trocar o ícone do personagem na Lista já funciona desde
o momento da escolha, independente de a subclasse ter mecânica
implementada — dá pro Osmar ver o personagem "certo" visualmente
mesmo antes da subclasse estar pronta de verdade.

**Prioridade do ícone na Lista de Personagens:** imagem própria do
jogador (upload ainda não existe) > ícone da subclasse > ícone da
classe > empate de nível, classe mais atual — os 2 últimos critérios
de desempate não têm o que resolver ainda (sem multiclasse), mas já
ficam prontos pra quando existir.

**Data/origem:** 2026-08.

## Talentos — arquitetura final (schema, classificador, motor de escolha)

**Schema de ASI: 2 tipos, não 4.** Olhando os valores reais das
colunas da planilha (não só contando quantas tinham ASI marcado), só
existem 2 comportamentos distintos: `escolha-unica` (+1 num atributo à
escolha, dentre uma lista — cobre lista de 1, 2-3 ou 6 igualmente) e
`distribuir-dois` (+2 num só ou +1 em dois — reaproveita o MESMO
seletor de ASI genérico do Level Up). `maximo` (20 ou 30) é campo à
parte, não um 3º/4º tipo.

**Classificador de Ação/Ação Bônus/Reação/Passiva (`core/classificarTalento.ts`)
é próprio dos Talentos, não existe reaproveitável em lugar nenhum do
app** — mesmo que o plano original tenha assumido que sim (a coluna
"Tipo de Ação" das características de Classe/Subclasse é gerada por um
processo externo, só *lida* como dado pronto, não por uma função
reutilizável). O classificador roda com regex heurística sobre o texto
puro, on-the-fly (nunca precomputado/salvo), seguindo o mesmo padrão
de `classificarMagia.ts`.

**Padrão final da UI de escolha (depois de algumas iterações erradas —
só o estado final importa):** tudo acontece **dentro do mesmo passo
`'asi'` do Level Up**, sem tela cheia própria e sem botão "Confirmar"
extra — cards marcam modo/talento/atributo (nunca aplicam no toque), e
o "Avançar" do rodapé (o mesmo de todo o resto do wizard) é quem
confirma e navega, reabrindo com aviso se algo obrigatório ainda não
foi escolhido. Quando o talento escolhido concede ASI que precisa de
escolha própria, um passo **novo entra dinamicamente** na sequência
logo depois de `'asi'` (com sua própria bolinha de progresso) — não
uma tela separada. "Aumento no Valor de Atributo" é só mais um talento
normal na lista (`distribuir-dois`), não um card fixo hardcoded
separado.

**Regra geral confirmada por essa saga, vale pra qualquer tela nova do
Level Up/Wizard:** toda escolha em tela cheia usa o padrão
"marca → 'Avançar' do rodapé confirma", nunca aplica a escolha no
toque nem cria um botão "Confirmar" próprio pra uma tela isolada —
consistência com o resto do app é mais importante que a tela isolada
parecer "resolvida" mais rápido. Botão desabilitado sempre usa a
classe global `.btn-disabled` (nunca `opacity` inline sozinho) — evita
o bug de especificidade CSS onde um botão "parece" desabilitado mas
continua clicável.

**Pin 📌 de talento favoritado** — "quero pegar isso num level up
futuro", por personagem (não preferência global do dispositivo). Some
da seção de favoritos automaticamente ao escolher o talento no mesmo
level-up.

**Efeito mecânico real (Fase 4) — schema:** campo opcional
`efeitoMecanico` (união de tipos, cada variante só com os números que
aquele talento usa) em `Talento` e `EstiloDeLuta` — **não vem da
planilha**, anotado à mão talento por talento só quando a mecânica
dele é implementada de verdade. Helper genérico
(`efeitoMecanicoDoTalento`) procura, entre os talentos ativos do
personagem, um com aquele tipo de efeito — reaproveitado também pra
Estilo de Luta (mesmo lookup, arquivo diferente). Talento de categoria
"Origem" (concedido fixo, nunca passa pelo picker de Level Up) também
entra no cálculo — não é só o que foi escolhido em Level Up.

**Data/origem:** 2026-08, Talentos Fases 1-4 lote 1 (histórico
completo das iterações de UI arquivado — só o padrão final acima
segue relevante).

## Bruxo — B1 (Dados) feito: schema de pool único + catálogo de Invocações

**Espaço de Magia de Pacto — pool único, não array por círculo (diferente do Bardo):**
modelado como 2 `RecursoClasse` separados em `classes.ts`
("Espaço de Magia de Pacto (quantidade)" + "Círculo do Espaço de Magia
de Pacto"), reaproveitando o schema genérico sem precisar de campo
novo em `Classe`. Recupera em "Descanso Curto ou Longo" (texto livre
do campo `recuperaEm`, igual outros recursos) — diferente de todo
caster documentado até aqui (Bardo só Descanso Longo). Quando a
Etapa 3 (Ficha/aba Magias) chegar, upcast é automático pro círculo do
espaço gasto (não é escolha do jogador) — vai precisar de uma função
`espacoDePactoAtivo(classe, nivel): { quantidade, circulo }` própria,
`espacosDeMagiaAtivos` (do Bardo) não serve pra esse formato.

**Catálogo de Invocações Místicas — dado que a planilha não tem, vem
do livro (Cap. 3, "Opções de Invocações Místicas"), novo arquivo
`invocacoesMisticas.ts`.** Schema: `tipo` (`passiva | avontade |
limitada`) classifica a frequência real de cada uma — achado central
do SDD do Osmar, **não é um pool de usos genérico**, cada invocação
tem sua própria regra de custo/teto (`custoOuLimite`, texto livre, só
quando `tipo === 'limitada'`). `prerequisitos.invocacaoRequeridaId`
modela a dependência encadeada (ex: Lâmina Devoradora exige Lâmina
Sedenta) — a Etapa 4 (Level Up) vai precisar bloquear troca de uma
invocação que é pré-requisito de outra já escolhida.

**Achado do SDD corrigido contra o livro:** a característica "Magias
Psíquicas" (nível 3) é do Patrono O Grande Antigo, não do Patrono
Ínfero (SDD v2 tinha essa atribuição errada; planilha mestra já
estava certa). Vale quando a hora do Grande Antigo/Ínfero chegar.

**Fase 1 vs Fase 2 (mesmo padrão dos Talentos):** B1-B5 do plano
cobrem só catálogo + escolha da Invocação (sem checar pré-requisito
de dependência nem aplicar mecânica) — efeito real de cada uma das 28
entra depois, em lotes pequenos, registrado em `PENDENCIAS.md`.

**Data/origem:** 2026-09, plano "Bruxo — base + Patrono Ínfero"
(EmDev.md), B1.

## Bruxo — B3 (aba Magias) feito: pool único vira array de 1 item, zero mudança no resto do app

**Achado principal:** `EspacoDeMagiaAtivo[]` (array genérico já usado
pelo Bardo — pips, upcast, gasto por círculo, Descanso) não precisa de
nenhuma mudança pra suportar o Bruxo. `core/magiasPersonagem.ts`'s
`espacosDeMagiaAtivos()` ganhou um fallback: quando não acha o padrão
"1 recurso por círculo" do Bardo, procura o padrão de pool único do
Bruxo ("Espaço de Magia de Pacto (quantidade)" + "Círculo do Espaço de
Magia de Pacto") e devolve um array de **1 item só** com o círculo
daquele nível. Toda a UI/lógica que já existia (`MagiasTab.tsx`,
`EscolherCirculoShell`, Descanso Curto/Longo, `armazenamentoPersonagens`'s
`espacosGastosPorCirculo`) funcionou sem tocar em mais nada — "upcast
automático" do Bruxo já é só a regra normal de upcast quando só existe
1 círculo disponível pra gastar. Ao chegar uma classe nova com formato
de recurso diferente do que já existe, procurar primeiro se dá pra
mapear pro mesmo tipo genérico (array de {circulo, maximo,
recuperaNoDescansoCurto}) em vez de criar caminho próprio.

**Bugfix relacionado (texto, não lógica):** a mensagem de recuperação
em `MagiasTab.tsx` tinha uma ramificação "misto por círculo" que nunca
foi exercitada de verdade (Bardo é sempre 100% Descanso Longo) e não
fazia sentido pro Bruxo (Descanso Longo sempre restaura tudo,
incondicional, em `FichaShell.tsx`'s `descansoLongo()` — `recuperaNoDescansoCurto`
só marca "esse círculo TAMBÉM recupera cedo no Curto", nunca "só no
Curto"). Simplificado pra mensagem binária: tem algum círculo marcado
Curto → "Recupera no Descanso Curto ou Longo."; senão → "Recupera no
Descanso Longo."

**Data/origem:** 2026-09, plano "Bruxo — base + Patrono Ínfero", B3.

## Bruxo — B4.3 feito: Invocações Místicas no Level Up, mesmo padrão de Truques

**Reaproveitamento direto:** o passo "Invocações Místicas" no Level Up
é uma cópia do padrão já usado em Truques/Magias Preparadas — lista
única pré-marcada, `contarTrocas` valida "só 1 trocada por level-up",
mesmo componente de check-row. Zero mecanismo novo de UI, só um
catálogo diferente (`invocacoesElegiveisAteNivel(novoNivel)`, novo
`core/invocacoesMisticas.ts`, filtra por `prerequisitos.nivelMinimo`)
reaproveitado tanto no wizard (B2) quanto no Level Up (B4.3) — extraído
pra função só depois de notar a mesma lógica duplicada nos dois
lugares (regra 6.1 do CLAUDE.md).

**Gap achado no caminho: nada na Ficha mostrava as Invocações
escolhidas.** O wizard deixava escolher (B2) mas não existia lugar
nenhum pra CONFERIR o que foi escolhido depois — sem isso, "crescer/
trocar" no Level Up seria invisível. `PerfilTab.tsx` ganhou uma seção
"Invocações Místicas" (mesmo padrão `[PH] sem efeito mecânico ainda`
já usado em Talentos), populada por um novo estado
`invocacoesMisticasAtuais` em `FichaShell.tsx`/`armazenamentoPersonagens.ts`
(mesmo par `Atual`/`personagemSalvo.campoAtual ?? selecao.campoEscolhido`
já usado por Truques/Magias). Lição pra próxima classe com escolha
parecida: checar se existe display na Ficha ANTES de considerar o
Level Up "completo" — a escolha sem lugar pra ver o resultado é meio
trabalho só.

**Data/origem:** 2026-09, plano "Bruxo — base + Patrono Ínfero", B4.3.

## Bruxo — Pacto do Tomo feito: padrão de "recurso gasto até o próximo Descanso"

**Escolha livre de fora do catálogo da própria classe:** o Livro das
Sombras (`core/livroDasSombras.ts`) filtra o catálogo COMPLETO de 390
magias por círculo+Ritual, não `magiasDaClasse` — regra real permite
"qualquer classe". Padrão pra próxima vez que uma característica disser
"de qualquer classe": filtrar direto o catálogo genérico, excluindo só
o que o personagem já tem (Truques/Magias Preparadas normais), nunca
restringir pela classe do personagem.

**Recurso "gasto até o próximo Descanso" (não é contador, é boolean):**
diferente de Surto de Ação/Indomável (N usos, contador numérico), o
"Reconjurar o Livro" é 1x disponível, trava até `descansoCurto()` OU
`descansoLongo()` resetar — implementado como boolean simples
(`livroDasSombrasGasto`) resetado nas duas funções de descanso,
`PersonagemSalvo` ganhou o campo espelhando o padrão `*Gasto` já usado.
Visual: botão muda de accent (disponível) pra cinza/texto-fraco
(travado) com mensagem explicando quando libera — reaproveitável pra
qualquer futura característica "1x por descanso, sem contador".

**Dado do livro reaproveita "Descobertas Mágicas":** mesma seção
visual (nome, sempre preparada, fora do limite normal), mesmo
`magiasPreparadasDoPersonagem(nomes)` genérico — zero componente novo
pra exibir, só uma 3ª lista de nomes ao lado de Truques/Magias
Preparadas/Descobertas Mágicas.

**Bug encontrado depois do 1º push (Osmar, 2026-09):** as telas de
ESCOLHA do livro (passo do wizard, tela "Reconjurar") esqueceram
`iconesMagia()` — só a aba Magias (exibição) tinha. Lição: toda tela
nova que lista magia pra ESCOLHER precisa do mesmo par
`MagiaComDescricao` + `iconesMagia()` que as de EXIBIR já usam — são
chamadas separadas, fácil esquecer uma ao copiar o padrão.

**Data/origem:** 2026-09, pendência "Bruxo — Pacto do Tomo" (PT.1/PT.2).

## Bruxo — IM.1 feito: motor "magia concedida de graça" (10 Invocações de uma vez)

**Uma mecânica, dez invocações:** ao invés de tratar cada "Conjura X
sem gastar um espaço de magia" como entrega própria, um único campo
novo (`magiaGratisConcedida: { nome, recarga } | null` em
`invocacoesMisticas.ts`) + um único core module
(`core/invocacoesMagiaGratis.ts`, `magiasGratisDasInvocacoes`)
resolveram as 10 de uma vez — 9 `avontade` (ilimitadas) + Presente das
Profundezas (`limitada`, 1x até Descanso Longo). Padrão pra próxima
leva de invocações parecidas: primeiro perguntar "quantas dessas têm
o MESMO formato de efeito?" antes de quebrar em lotes um-por-um.

**Reaproveito do padrão "gasto até Descanso Longo" do Pacto do Tomo:**
Presente das Profundezas usa a mesma ideia (boolean travado até
`descansoLongo()` resetar), só que agora como `string[]` de IDs de
invocação (`magiasGratisInvocacoesGastas`), não um boolean único — o
Pacto do Tomo só tinha 1 "coisa gastável"; aqui pode ter várias
simultâneas, cada invocação limitada precisa da própria entrada na
lista. Generalização direta do padrão anterior, não um mecanismo novo.

**Lista SEMPRE derivada, nunca persistida:** `magiasGratisConcedidas`
não vira campo salvo — é recalculada toda vez a partir de
`invocacoesMisticasAtuais` (a fonte de verdade). Só o que É estado de
progressão (quais das `limitada` já foram usadas) precisa persistir.
Mesmo princípio já usado no Livro das Sombras/Descobertas Mágicas.

**Fora do motor genérico:** Vigor Ínfero parece igual (também é
"conjura de graça"), mas concede PV temporário — campo que a Ficha
ainda não tem — por isso ficou de fora do IM.1, vira IM.2 sozinha.

**Data/origem:** 2026-09, plano "Invocações Místicas Fase 2", IM.1.

## Bruxo — IM.2 feito: PV Temporário (motor novo, primeiro uso — Vigor Ínfero)

**PV Temporário não é "mais um número igual ao PV normal"** — regra
real do Glossário: dano desconta primeiro do PV Temporário, só o
excedente desconta do PV normal; cura nunca soma em PV Temporário
(só no PV normal); ganhar PV Temporário de novo NÃO soma com o que já
tem, fica o maior dos dois. `core/pvTemporario.ts` isola essa lógica em
2 funções puras testadas (`aplicarAlteracaoPv`, `ganharPvTemporario`) —
`FichaShell.tsx`'s `alterarPv()` (já usado pelos botões -5/-1/+1/+5 do
Combat) passou a rotear por ali, sem precisar de nenhuma mudança na UI
dos botões em si.

**Nem toda invocação "avontade" (ilimitada) dispensa botão de Usar.**
O padrão do IM.1 (ilimitado sem efeito rastreável = vira tag "sem
custo", sem botão) não vale pra Vigor Ínfero — ela É ilimitada, mas
cada uso pode mudar o PV Temporário de verdade (se já gastou, usar de
novo restaura pro valor cheio). Por isso ganhou campo próprio
(`pvTemporarioConcedido: number | null` em `invocacoesMisticas.ts`,
propagado por `MagiaGratisDeInvocacao`) que força o botão real mesmo
sendo `recarga: 'ilimitado'`. Lição pras próximas invocações
"avontade": perguntar "o uso muda algum estado rastreado?" antes de
assumir que é so tag — não é só olhar pra `recarga`.

**Valor fixo, não dado geral:** "PV Temporários = valor máximo do dado
(sem rolar)" de Vitalidade Vazia (2d4+4) virou o número `12` fixo,
comentado com a fonte — não um motor de "maior valor de uma expressão
de dado" (não existe ainda, só serve pra esse caso único hoje).

**Data/origem:** 2026-09, plano "Invocações Místicas Fase 2", IM.2.

## Bruxo — IM.4 feito: Pacto da Lâmina (arma conjurada = item normal + ataque com atributo forçado)

**Arma conjurada vira `ItemMochila` de verdade, não estado à parte.**
Em vez de inventar um sistema novo pra "coisa que existe só enquanto
durar o vínculo", `vincularArmaDePacto`/`desvincularArmaDePacto`
(`core/pactoDaLamina.ts`) criam/removem um `ItemMochila` comum
(`armaDePacto: true`), reaproveitando 100% do equipar/desequipar/CA/
Atacar que já existiam (E2/E3 do Plano de Equipamento) — zero UI nova
precisou saber que a arma é "de pacto", só o cálculo de ataque.
`desvincular` remove o item por completo (não fica "guardado" — é
conjurado), diferente de um desequipar comum.

**Atributo de ataque forçado (Carisma em vez de Força/Destreza)
virou parâmetro opcional, não um branch novo.** `ataqueComArma`/
`ataqueAtual` ganharam `atribForcada?: number` — quando presente,
substitui inteiramente a escolha Força/Destreza/Acuidade de sempre.
Padrão pronto pra qualquer outra fonte que troque o atributo de
ataque no futuro (ex.: outro Pacto, algum talento), sem precisar
reabrir essa função de novo.

**Só existe 1 arma de pacto por vez** — vincular uma nova substitui a
anterior automaticamente (`vincularArmaDePacto` filtra `armaDePacto`
antes de adicionar a nova). Fora do escopo desta entrega (sem uso
mecânico no app hoje, registrar se algum dia importar): "vincular arma
mágica tocada" (dependeria do catálogo de itens mágicos) e "servir de
Foco de Conjuração" (nada no app checa isso ainda).

**Data/origem:** 2026-09, plano "Invocações Místicas Fase 2", IM.4.

## Bruxo — IM.5 feito: Lâmina Sedenta/Devoradora reaproveitou 100% o "Ataque Extra" do Guerreiro

**"Ataque Extra" de fonte não-classe vira só um `Math.max` no número
final, não um sistema novo.** `numeroDeAtaques(classe, nível)`
(Guerreiro) já alimentava o botão "Atacar" do Combat (contador "ataque
N/M", trava por turno). Lâmina Sedenta/Devoradora do Bruxo concedem
Ataque Extra por INVOCAÇÃO, não por classe — em vez de estender aquela
função pra também olhar invocação, ficou uma função separada e pura
(`ataqueExtraDoPactoDaLamina`, `core/pactoDaLamina.ts`) que só devolve
quantos ataques extras a invocação dá, e o número final vira
`Math.max(numeroDeAtaques(...), 1 + extra)` — zero mudança na UI do
Combat, que já sabia lidar com "mais de 1 ataque por turno" desde o
Guerreiro.

**"Restrito à arma de pacto" é condição de cada leitura, não estado
salvo.** O extra só conta quando a Mão Principal (agora) é a arma de
pacto — se o jogador trocar de arma no meio da sessão, o número de
ataques cai sozinho no próximo cálculo, sem precisar de nenhuma trava
manual.

**Data/origem:** 2026-09, plano "Invocações Místicas Fase 2", IM.5.

## Bruxo — bug corrigido: cadeia de pré-requisito entre Invocações Místicas não era checada

**O que estava errado:** o dado (`invocacaoRequeridaId` em `invocacoesMisticas.ts`) já modelava
corretamente cadeias como Pacto da Lâmina → Lâmina Sedenta → Lâmina
Devoradora desde a Fase 1, mas nada no app lia esse campo — dava pra
marcar "Lâmina Sedenta" sem ter "Pacto da Lâmina", ou tirar "Pacto da
Lâmina" com "Lâmina Sedenta" ainda marcada (o que deixaria a Sedenta
sem nada pra aplicar). Achado do Osmar: "boa parte delas tem requisito
e o requisito não é uma troca e sim o componente base".

**Correção — 3 funções puras novas em `core/invocacoesMisticas.ts`
(testadas), reaproveitadas nos 2 lugares que escolhem invocação
(wizard `ClasseEscolhasStep.tsx` + Level Up `LevelUpShell.tsx`):**
- `invocacaoRequeridaDe(inv)` — devolve a invocação que `inv` exige (ou
  `null`), pra mostrar a linha "Requer: X" sempre que existir.
- `invocacaoBloqueadaPorRequisitoAusente(inv, atuais)` — bloqueia
  MARCAR uma invocação cujo requisito não está entre as já marcadas
  (card cinza, sem clique, com "— marque essa primeiro" em vermelho).
- `invocacoesQueDependemDe(id, atuais)` — bloqueia DESMARCAR uma
  invocação que ainda serve de requisito pra outra marcada (clique
  ignorado, mostra "🔒 não pode remover — é requisito de outra
  invocação que você mantém"). Regra real: pra abandonar uma cadeia,
  precisa desmontar de trás pra frente, 1 troca por level-up.

**Padrão pra futuras invocações com requisito:** basta preencher
`invocacaoRequeridaId` no dado — as 3 telas (wizard + Level Up, hoje;
qualquer tela nova de escolha de invocação, no futuro) já aplicam a
trava e a linha "Requer: X" sozinhas, sem precisar de código
específico por invocação.

**Data/origem:** 2026-09, achado do Osmar revisando a cadeia de Pacto
da Lâmina (IM.4/IM.5).

## Bruxo — Dádiva Épica (nível 19) reaproveitou 100% a tela de Talento Geral

**Escolha de talento por categoria virou 1 prop, não 1 componente
novo.** `TelaEscolherTalento.tsx` só filtrava `categoria === 'Geral'`
(hardcoded) — virou uma prop `categoria` (padrão `'Geral'`, sem mudar
o passo `asi` existente). O passo `dadivaEpica` do Level Up, que já
existia estruturalmente (nível certo, navegação certa) mas só mostrava
uma caixa "entra numa próxima entrega", passou a usar a mesma tela com
`categoria="Dádiva Épica"` — sem aplicar ASI (Dádivas Épicas 2024 não
concedem Aumento de Atributo, diferente dos Talentos Gerais). O
resultado cai no mesmo array `talentosGeraisAtuais` de sempre (nunca
teve trava por categoria ali).

**Achado ao mexer nisso: o mesmo bug do `[PH]` das Invocações (ver
entrada IM.7) também existia nos Talentos.** `PerfilTab.tsx` mostrava
`[PH] sem efeito mecânico ainda` em **todo** Talento, mesmo nos 5 que
já ganharam `efeitoMecanico` real na Fase 4 (Alerta, Defensivo,
Arquearia, Duelismo, Mestre em Armaduras Médias). Corrigido com o
mesmo padrão: `talentoTemPlaceholder(t)` em `core/classificarTalento.ts`
lê `efeitoMecanico === undefined` de verdade, em vez de assumir `[PH]`
sempre. **Padrão geral pra qualquer catálogo com "fase 2/4" incremental
(Invocações, Talentos, e o que vier depois):** nunca hardcodar `[PH]`
fixo numa tela de listagem — sempre derivar de um campo real (`efeitoMecanico`,
`magiaGratisConcedida`, etc.), porque a lista de "o que já foi
implementado" cresce entrega a entrega e o texto fixo fica desatualizado
silenciosamente.

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo",
item 1.

## Bruxo — Astúcia Mágica (nível 2) + Mestre Místico (nível 20)

**"Recupera metade, arredondado pra cima" e "recupera tudo" viraram
uma função pura só, não dois caminhos de código.** `espacosARecuperar(
maximoTotal, gastoAtual, mestreMistico)` em `core/astuciaMagica.ts` —
`mestreMistico: true` é só um branch a mais dentro da mesma função
(devolve `gastoAtual` inteiro em vez de `ceil(maximoTotal/2)`), porque
Mestre Místico (nível 20) é literalmente "a mesma característica,
recuperando tudo em vez de metade" — nunca fez sentido ser uma entrega
própria (já registrado assim em PENDENCIAS.md antes de implementar).

**1x por Descanso Longo, nunca reseta no Curto** — diferente do Livro
das Sombras/Recuperar Fôlego (que resetam nos dois). Campo
`astuciaMagicaGasta: boolean` só zera dentro de `descansoLongo()`.

**Botão trava sozinho quando não há nada pra recuperar** (0 espaços
gastos) — não é regra oficial (RAW deixaria "usar" mesmo sem efeito),
mas evita queimar o único uso do dia à toa; é house rule de UX, não de
jogo (não altera nenhum número de personagem).

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo",
item 2.

## Bruxo — Arcana Mística (níveis 11/13/15/17): "N usos independentes que crescem 1 por vez" vira Record<chave, valor> + array de gastos

**Padrão novo (não existia ainda no motor): uma característica que
concede vários usos "de graça" INDEPENDENTES entre si, cada um
desbloqueado num nível diferente.** Diferente do padrão já usado nas
Invocações (`magiaGratisConcedida`, 1 magia por invocação, todas
sempre disponíveis desde que a invocação exista) e de Astúcia Mágica/
Contatar Patrono (1 uso só, boolean simples) — Arcana Mística tem 4
"slots" (6º/7º/8º/9º círculo), cada um só existe a partir do nível que
o desbloqueia, e cada um tem seu PRÓPRIO cooldown de Descanso Longo
(usar o de 6º círculo não trava o de 7º).

**Modelagem escolhida:** `arcanaMisticaAtual: Record<circulo, nome
da magia>` (cresce 1 chave por nível desbloqueado, nunca reseta) +
`arcanaMisticaGastos: number[]` (lista dos CÍRCULOS usados desde o
último Descanso Longo, não um boolean único — permite qualquer
combinação de "usei o de 6º mas não o de 7º"). Sempre que outra
característica futura tiver essa forma ("N usos independentes,
crescendo por nível, cada um com seu cooldown próprio"), reaproveitar
esse par Record+array em vez de inventar de novo.

**Novo passo de Level Up (`arcanaMistica`) descobre sozinho qual
círculo é novo** comparando `circulosArcanaMisticaDesbloqueados` no
nível atual vs. no nível novo (a diferença é o círculo que acabou de
desbloquear) — não hardcoda "nível 11 = 6º círculo" na tela, só na
função pura testada (`core/arcanaMistica.ts`), que é a única fonte de
verdade sobre qual nível desbloqueia qual círculo.

**Data/origem:** 2026-09, plano "Características nomeadas do Bruxo",
item 4 (último dos 4).

## Arcana Mística — troca de arcanum (padrão de "troca" pra coleção por chave, não lista solta)

**Problema:** `contarTrocas(originais: string[], finais: string[])`
(usado em Truques/Invocações/Magias Preparadas) só funciona pra listas
soltas, tipo checkbox — não dá pra aplicar direto num
`Record<circulo, magia>` como Arcana Mística, onde cada círculo é um
slot próprio (trocar o 6º círculo não deveria contar como "mexer no
7º").

**Solução:** nova `trocasArcanaMistica(atuais, escolhidas)` em
`core/arcanaMistica.ts` (testada) — conta só os círculos presentes NOS
DOIS lados com magia diferente; um círculo que só existe no lado
`escolhidas` (a escolha inicial de um círculo recém-desbloqueado)
nunca conta como troca. Mesmo limite de "1 troca por level-up" de
Truques/Invocações, só que a unidade de comparação é a chave do
Record, não a lista inteira.

**Tela:** o passo `arcanaMistica` do Level Up agora tem 2 partes
independentes, cada uma só aparece se fizer sentido: (1) escolha
OBRIGATÓRIA do círculo novo (só nos níveis que desbloqueiam, mesma UI
de sempre — lista de opt-cards com descrição) e (2) troca OPCIONAL de
qualquer círculo já conhecido (aparece em QUALQUER level-up seguinte,
não só nos de desbloqueio) — cada círculo já conhecido vira 1 linha
com o nome atual + ícone 🔄 que abre `TrocarValorSimples` (mesmo
componente genérico já usado em Resistência Ínfera) pra escolher outra
magia do mesmo círculo. As duas partes competem pelo mesmo limite de 1
troca — pode escolher o círculo novo E trocar 1 já conhecido no mesmo
level-up (regra real permite os dois juntos).

**`onConfirmar` mudou de forma:** era `arcanaMistica: { circulo, magia
} | null` (só 1 círculo por vez, sempre o novo). Virou
`arcanaMisticaAlteracoes: Record<circulo, magia> | null` — qualquer
quantidade de círculos alterados (0, 1 ou 2) nesse level-up, todos
aplicados de uma vez em `FichaShell.confirmarLevelUp` via spread. Quem
mais chamava essa forma antiga (`core/levelUpAleatorio.ts`, Level Up
Rápido) foi atualizado junto.

**Data/origem:** 2026-09, pedido do Osmar revisando os itens ainda
abertos do Bruxo.

## Talento/característica que só "dá Vantagem/Desvantagem numa rolagem" não precisa integrar com o RollOverlay

**Padrão:** vários talentos e características descrevem o efeito como
"gaste 1 uso pra dar Vantagem numa jogada sua" ou "impor Desvantagem
num ataque contra você" (ex: Sortudo). Antes de desenhar uma
integração nova com o sistema de rolagem, verifique se o RollOverlay já
resolve isso sozinho — ele já tem botões livres de Vantagem/Desvantagem
em QUALQUER rolagem de d20 (ataque, teste, salvaguarda, iniciativa),
sem precisar de nenhum recurso pra usar. Nesse caso, o talento não
precisa de NENHUMA integração de rolagem — só precisa acompanhar a
pool de usos em si (mesmo padrão de contador com reset em Descanso
Curto/Longo de Indomável/Surto de Ação: `EfeitoMecanicoTalento` +
campo `xGasto` no `PersonagemSalvo` + card em `CombatTab` com um
lembrete em texto de qual botão apertar). Só vale a pena integrar de
verdade com o RollOverlay quando o efeito muda automaticamente um
NÚMERO da rolagem (bônus, dado extra) — isso sim precisa de um
mecanismo como o de Sorte do Tenebroso/Perícia Inigualável
(`registrarBonusExtra`).

**Data/origem:** 2026-09, foco Origens Grupo E (Sortudo).

## Mesmo talento pego por 2 fontes independentes — gaveta de estado separada por fonte, nunca compartilhada

**Problema:** um talento com escolha extra (Habilidoso — perícia/
ferramenta; Iniciado em Magia — lista + truques + magia + atributo)
pode vir de mais de uma fonte independente no mesmo personagem — hoje
Talento de Origem (fixo, vem da Origem escolhida) e traço Versátil
(Humano, escolha livre entre qualquer Talento de Origem). Se as duas
fontes escreverem no MESMO campo de estado (ex: uma lista só de
"perícias/ferramentas escolhidas"), escolher a 2ª sobrescreve a 1ª —
sério quando as duas fontes concedem o MESMO talento (ex: Origem Sábio
já dá Iniciado em Magia, e o jogador usa o Versátil pra pegar Iniciado
em Magia de novo, numa lista de classe diferente).

**Solução, padrão pra qualquer futuro "mesmo talento, 2+ fontes
possíveis":** cada fonte grava numa gaveta de estado PRÓPRIA, nunca
compartilhada, mesmo que isso duplique o formato do campo. Pro caso do
Versátil: `proficienciasTalentoOrigemEscolhidas` (Origem) ganhou o
espelho `proficienciasTalentoEspecieEscolhidas` (Versátil); mesma
coisa pra `truquesMagiaIniciadaEscolhidos`/`magiaMagiaIniciadaEscolhida`/
`atributoMagiaIniciadaEscolhido` → sufixo `Especie`. As funções de
LEITURA (`periciasProficientes`/`ferramentasProficientes` em
`calculoPersonagem.ts`, `truquesMagiaIniciada`/`magiasMagiaIniciada` em
`magiaTalentoOrigem.ts`) somam as duas gavetas sempre, sem precisar
saber qual fonte concedeu o quê — o jogo já garante que a mesma coisa
nunca é escolhida 2x com benefício dobrado (Habilidoso deixa escolher
algo repetido de propósito, sem ganho extra).

**Iniciado em Magia pego avulso não tem lista de classe fixada** — a
Origem fixa a lista sozinha (`Origem.talentoOrigemVariante`), mas o
Versátil não tem Origem nenhuma pra herdar, então `TalentoEspecieEscolhasStep`
mostra um seletor extra (Clérigo/Druida/Mago) antes de truques/magia
aparecerem — campo novo `listaMagiaIniciadaEspecieEscolhida`. Trocar de
lista limpa truques/magia escolhidos da lista antiga (fica inválido
misturar magia de uma lista com truque de outra).

**UI compartilhada:** `TalentoOrigemEscolhasStep` e
`TalentoEspecieEscolhasStep` são telas de wizard finas que só
resolvem QUAL talento e QUAL gaveta usar — o corpo visual de verdade
(`ProficienciaOuFerramentaEscolhas`/`IniciadoEmMagiaEscolhas`) mora em
`talentoEscolhasCompartilhado.tsx`, parametrizado por callbacks
(`onToggle`/`onToggleTruque`/etc) em vez de ler `selection` direto —
assim a mesma UI serve qualquer gaveta sem duplicar JSX.

**Data/origem:** 2026-09, foco Origens — "última coisa do foco"
(Humano/Versátil).

## Substituição de escolha de Talento no Level Up — padrão "gaveta(s) opcional(is), sem limite de 1 troca"

Vários Talentos/características de classe deixam trocar 1 escolha
fixa (magia, arma, etc.) a cada level-up (não só quando desbloqueia
algo novo) — Arcana Mística (Bruxo) já tinha esse padrão, travado em
"no máximo 1 troca por level-up" porque a regra real do Bruxo diz
isso. Iniciado em Magia (Talento de Origem) tem a mesma mecânica de
troca, mas SEM esse limite (regra real: "sempre que você alcança um
novo nível, pode substituir uma das magias" — sem teto de 1) — por
isso não reaproveita o contador `trocasArcanaMistica`, só o
componente visual (`TrocarValorSimples`) e a estrutura de passo do
`LevelUpShell` (estado inicializado com o valor atual, comparado no
fim pra saber se mudou, passo só aparece se a gaveta existir).

**Duas gavetas independentes, mesmo passo:** como o talento pode vir
da Origem E do Versátil ao mesmo tempo (ver seção acima), o passo
`iniciadoEmMagia` do Level Up mostra 1 card por gaveta ativa
(`magiaIniciadaOrigemAtual`/`magiaIniciadaEspecieAtual`, cada um
`{ lista, magia } | null`) — sem card nenhum quando nem uma gaveta
tem o talento. Cada card troca só a própria magia, sem afetar a
outra.

**Padrão pra qualquer futura "troca de escolha fixa" parecida:**
1. Prop `xAtual` no `LevelUpShell` com o valor já escolhido (`null` =
   personagem não tem essa fonte).
2. Passo só entra em `luSteps` se a prop existir.
3. Estado local inicializado com o valor atual; "mudou" = comparação
   simples com o valor original (não precisa de dado por nível igual
   à Arcana Mística, que indexa por círculo).
4. `onConfirmar` só manda o campo alterado (`null` = sem troca) — a
   tela pai (`FichaShell`) aplica em `selecao`/`xAtuais` só quando não
   for `null`, preservando o valor atual em qualquer outro caso.
5. `sortearLevelUpRapido` (Level Up aleatório) sempre manda `null`
   pra esse campo — não faz sentido sortear uma troca opcional.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo A — Origem, A.3).

## Talento com contagem que CRESCE por Bônus de Proficiência (não escolha nova) — passo de "completar escolha", fora do calendário de ASI

**Diferente de "troca de escolha fixa" (seção acima) e de Arcana
Mística (N slots independentes, cada um só desbloqueia 1 vez): aqui é
1 MESMA coleção que fica maior sozinha** — Conjurador Ritualista
(Talento Geral) deixa escolher N magias Rituais, N = Bônus de
Proficiência ATUAL; sempre que o Bônus de Proficiência sobe de novo
(níveis 5/9/13/17, calendário PRÓPRIO — não coincide com os níveis de
ASI/Talento, 4/8/12/16/19), o jogador pode completar a coleção com
mais 1, sem perder as já escolhidas.

**Padrão pra qualquer futura "coleção que cresce sozinha por nível"
parecida:**
1. Função pura já existente calcula o tamanho ATUAL da coleção pro
   nível dado (aqui, `quantidadeMagiasRituais(classe, nivel)` — já
   existia desde a escolha inicial, sem mudança).
2. No `LevelUpShell`: comparar esse tamanho no `novoNivel` contra
   quantas já foram escolhidas (`escolhaMagiaTalentoGeralAtuais`) — se
   o novo total for maior, o passo de escolha entra de novo em
   `luSteps`, **fora de qualquer bloco condicionado a nível de ASI**
   (o gatilho real é o próprio recurso que cresceu, não o calendário
   de Talentos).
3. O `useState` do passo é pré-semeado com as escolhas JÁ FEITAS (não
   começa vazio) — cada opção já escolhida fica travada (não
   dá pra desmarcar, só completar até o novo total).
4. `onConfirmar` manda a coleção COMPLETA (antigas + novas) pra mesma
   chave de sempre — o pai (`FichaShell`) só faz merge/overwrite, sem
   precisar saber se foi escolha inicial ou crescimento.
5. Nada disso depende de saber QUAL nível concede QUAL Bônus de
   Proficiência na tela — só a função pura (`bonusProficiencia`) sabe
   disso, mesmo espírito do item 3 da Arcana Mística acima.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B, B.4.3 —
Conjurador Ritualista, pedaço "crescimento automático").

## "Grátis 1x" com 1 uso COMPARTILHADO entre vários itens (não 1 por item) — mesma lista de gasto, chave fixa

Todo "grátis 1x/Descanso Longo" implementado até aqui (Telepático,
Tocado pela Sombra/Fadas, magias das Invocações) trata cada magia como
um uso INDEPENDENTE — cada uma com sua própria chave em
`magiasGratisGastas`. Ritual Rápido (Conjurador Ritualista) é
diferente: 1 uso ÚNICO, compartilhado entre TODAS as magias Rituais
conhecidas — usar em qualquer uma delas gasta o mesmo uso.

**Modelagem:** não precisou de estado novo — mesma lista
`magiasGratisGastas` (reseta sozinha no Descanso Longo), só com 1
chave FIXA por talento (`talento:<id>:ritual-rapido`, ver
`CHAVE_RITUAL_RAPIDO` em `core/magiaTalentoGeral.ts`) em vez de 1 chave
por `magia.nome`. UI mostra 1 pip só (não 1 por magia conhecida) — cor
diferente da padrão (`variante="especial"`, ver DECISOES-DESIGN.md
"Ticks/pips padronizados") pra deixar claro que não é o mesmo Espaço de
Magia. Qualquer futura característica "N itens conhecidos, mas só 1 uso
grátis compartilhado entre eles" reaproveita essa chave fixa em vez de
criar array de estado novo.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B, B.4.3 —
Conjurador Ritualista, pedaço "Ritual Rápido").

## `LevelUpShell` — passo cuja existência depende do talento ESCOLHIDO NESTE level-up nunca pode entrar ANTES de `asi` no array `luSteps`

**Bug real encontrado no B.5** (Especialista em Perícia): o passo
`especialista` ganhou uma condição extra pra aparecer quando esse
talento é escolhido (`concedeEspecializacaoExtra`), e foi colocado no
topo do array (antes do bloco de `asi`, junto de
`especialistaDisparaAgora`). Resultado: no instante em que o jogador
tocava no talento (ainda DENTRO do passo `asi`), o array mudava de
tamanho ANTES do índice de `asi` — como `luIndex` é só um número fixo,
o passo exibido "pulava" sozinho pra `especialista` no meio da
escolha, sem o jogador clicar "Avançar".

**Regra permanente:** qualquer passo cuja presença no array depende do
talento escolhido NESTE MESMO level-up (`talentoObjEscolhido`/
`tipoEfeitoTalentoEscolhido`) só pode ser empurrado DEPOIS do passo
`asi` — nunca antes, mesmo que o passo já existisse por outro motivo
(ex.: característica de classe). Padrão já certo antes disso:
`asiAtributo`/`talentoMagia` (Grupo B.4) e `precisaCrescerMagiaRitual`
ficando fora do bloco de ASI de propósito. Ao adicionar uma condição
nova a um passo que já existe por outro gatilho (ex.: `especialista`
por classe), mover o push pra depois do bloco de `asi` em vez de só
adicionar `|| condicaoDoTalento` na linha antiga.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B, B.5 —
Especialista em Perícia).

## Ação genérica (Cap. 1) "vira Ação Bônus" — mantém nas DUAS listas, jogador escolhe qual gasta

Analítico/Mente Aguçada dizem "Ação Procurar/Analisar vira Ação
Bônus" — decisão do Osmar: a ação NÃO desaparece da lista de Ação
normal, só passa a aparecer TAMBÉM na lista de Ação Bônus (o jogador
escolhe qual recurso do turno gastar a cada vez, ex.: usar a Ação
Bônus pra Recuperar Fôlego e ainda assim fazer Procurar como Ação).

**Implementação:** `core/periciaTalentoGeral.ts`
(`acoesConvertidasEmBonus`) varre os Talentos Gerais atuais e retorna
os nomes das ações do Cap. 1 liberadas; `FichaShell` filtra
`data/exampleCombat.ts` (`acoesBase`) por esses nomes e passa pro
`BonusPanelContent`, que reaproveita o MESMO formato de linha já usado
em `AcaoPanelContent`/`ReacaoPanelContent` pras 9 ações genéricas.

**Achado no caminho:** `BonusPanelContent` nunca tinha um `onEscolher`
ligado a `escolherNoPainel` (diferente de `AcaoPanelContent`/
`ReacaoPanelContent`) — cada item de Ação Bônus tinha seu PRÓPRIO
handler de estado (`onUsarRecuperarFolego` etc.), sem marcar o recurso
"Ação Bônus" do turno como usado. Pra essas ações genéricas ligar o
`onEscolher={(nome, desc) => escolherNoPainel('bonus', nome, desc)}`
foi necessário adicionar o prop novo — os outros itens da Ação Bônus
continuam com seus handlers próprios, sem mudança de comportamento.

**Data/origem:** 2026-09, foco Talentos Fase 4 (Grupo B, B.5 —
Analítico/Mente Aguçada).
