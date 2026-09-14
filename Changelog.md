# Changelog.md

> Regra de atualização em CLAUDE.md, seção 19. Uma entrada por
> publicação na branch principal (a que dispara o deploy) — a mais
> nova sempre primeiro, nunca reordenar as antigas, sempre pelo menos
> 1 linha em branco entre 2 entradas.

## v202609_1826

Popup de rolagem de ATAQUE (arma ou desarmado) também ganhou o ⓘ com a
quebra do modificador — atributo usado, Bônus de Proficiência (quando
soma), bônus de Estilo de Luta. Ataque/CD de Magia ainda faltam.

## v202609_1819

2 ajustes no popup de rolagem: atributo puro (FOR/DES/etc., sem ser
perícia) também ganhou o ⓘ com a quebra do modificador; e enquanto o
dado ainda tá caindo, o "—" virou "Rolando..." com os pontinhos
animados em cascata.

## v202609_1600

Popup de rolagem de perícia/salvaguarda/iniciativa: o total grande
continua igual, mas agora a fórmula pequena embaixo dele ganhou um ⓘ —
toca pra ver de onde vem o número (atributo, Bônus de Proficiência,
etc.), mesmo popup que já existia no CA. Ataque/dano ainda não tem
essa quebra (vem numa próxima entrega).

## v202609_1119

Dado 3D 10% menor.

## v202609_1102

Removida a área preta translúcida (era só debug temporário pra
visualizar onde o dado cai) — a área de física agora fica 100%
transparente de novo.

## v202609_1059

Dado físico agora some sozinho depois de parar: espera 3s parado, some
suavemente em mais 2s. Vale pra toda rolagem (oficial e o 🎲 avulso).

## v202609_0950

Corrigido: fechar o popup de rolagem (✕ ou tocar fora) antes do dado
parar de cair fazia ele reabrir sozinho quando o resultado chegava.
Agora fechar só funciona depois que o dado já parou — enquanto ainda
tá rolando, o ✕ fica esmaecido.

## v202609_0844

Corrigido: Conhecimento Primordial (Bárbaro) trocava sempre pro mod.
de Força nas 5 perícias (Acrobacia/Furtividade/Intimidação/Percepção/
Sobrevivência) com a Fúria ativa, mesmo quando o atributo normal era
melhor. Agora usa sempre o maior dos dois — nunca fica pior por causa
da característica.

## v202609_0829

Ajuste no "🎲 Personagem de Teste": gerar um Bárbaro de nível 3+ não
atribui mais uma Trilha aleatória no nome da ficha (nenhuma tem
mecânica pronta ainda) — mesma correção da publicação anterior,
aplicada também nessa ferramenta.

## v202609_0759

Corrigido: subir um Bárbaro de nível 2 pra 3 pelo Level Up normal (a
setinha ⬆️) travava no passo "Escolha sua Subclasse", sem deixar
avançar — nenhuma das 4 Trilhas do Bárbaro tem mecânica pronta ainda.
Agora esse passo é pulado quando isso acontece; volta a aparecer
normalmente assim que a 1ª Trilha entrar.

## v202609_0112

Bárbaro — Conhecimento Primordial (nível 3) chegou. No Level Up de
nível 3, escolha 1 perícia extra entre as disponíveis pra Bárbaros
(uma vez só, permanente). Além disso, com a Fúria ativa, as perícias
Acrobacia, Furtividade, Intimidação, Percepção e Sobrevivência passam
a usar o mod. de Força em vez do atributo normal — some sozinho ao
encerrar a Fúria.

## v202609_2211

Ajustes no dado 3D: área preta de debug reancorada 5px acima do botão
🎲 flutuante (acompanha qualquer tamanho de tela agora); dado um
pouquinho maior de novo; e as rolagens oficiais (perícia, ataque, dano,
etc.) passaram a usar a mesma cor fixa por tipo de dado que o dado
avulso já usava (d20 vermelho, d4 azul, d6 cian, e assim por diante).

## v202609_2124

Corrigido: escolher "Vantagem" ou "Desvantagem" DEPOIS de ver o
resultado do 1º d20 físico não estava usando o valor de verdade do 2º
dado — o total ficava igual ao 1º dado mesmo o 2º caindo com outro
número na tela. Mesma correção aplicada no reroll do Perfurador (grid
de dados de dano) quando tem mais de 1 dado na cena.

## v202609_2109

Corrigido: quando o dado 3D falhava de rolar 1 vez, o app ficava preso
no dado clássico (2D) pelo resto da sessão, mesmo a área de física
continuando visível. Agora, depois de qualquer falha, a próxima
rolagem tenta o motor 3D de novo normalmente.

## v202609_2101

Ajustado: a área preta de debug (temporária) tava deixando um espaço
sobrando antes do popup — encostada mais perto agora.

## v202609_2048

Dado 3D um pouco maior de novo (ainda menor que o tamanho original,
mas menos do que ficou na publicação passada). Também: por enquanto,
a área onde o dado cai/quica aparece com um fundo preto translúcido
temporário — é só pra você ver os limites dela na tela, vou tirar
assim que confirmarmos que estão certos.

## v202609_2039

Corrigido: o dado físico tinha ficado minúsculo depois do popup de
rolagem mudar de lugar (efeito colateral não percebido antes). Ajustado
pra ficar um pouco menor que o tamanho de antes, mas nada perto do
tamanho minúsculo que apareceu.

## v202609_1914

Bárbaro — Ataque Imprudente e Sentido de Perigo (nível 2) chegaram. No
Combate, tocar "🗡 Atacar" na 1ª jogada do turno agora pergunta "Ataque
Normal" ou "😤 Ataque Imprudente" (Vantagem nos ataques de Força até o
fim do turno, vale pros ataques seguintes do Ataque Extra sem
perguntar de novo). Na aba Atributos, "Salvaguarda de Destreza" ganha
Vantagem automática.

## v202609_1911

Dado 3D — corrigido: rolagens com Vantagem/Desvantagem já decidida de
antemão às vezes registravam os 2 dados com o mesmo valor no histórico,
mesmo os dois caindo com números diferentes na tela. O popup de
resultado (perícia/ataque/etc) agora fica ancorado embaixo da tela com
uma margem, e o botão de fechar virou um ✕ no canto — o dado físico
ganhou mais espaço pra cair sem ficar cortado nas bordas ou em cima do
popup.

## v202609_1833

Corrigido: usar Sorte (Pequenino) ou Inspiração Heroica pra rerolar um
d20 físico só trocava o número, sem o dado cair na tela de novo — agora
o dado reroda fisicamente de verdade. Mesma correção vale pro Perfurador
(reroll de dano com Dado 3D ligado).

## v202609_1532

Corrigido: o d100 (no 🎲 avulso e em qualquer rolagem que use d100)
só rolava múltiplos de 10 (0, 10, 20...90) — agora rola de verdade de
1 a 100.

## v202609_1527

Aba Atributos ganhou as 6 Salvaguardas de verdade (Força, Destreza,
Constituição, Inteligência, Sabedoria, Carisma) no topo da lista de
Perícias — cada uma soma o Bônus de Proficiência quando sua classe for
proficiente naquela salvaguarda (antes, o box de atributo simples
nunca somava esse bônus pra nada). Fundação pras próximas
características do Bárbaro que dependem de Vantagem/valor de
salvaguarda.

## v202609_1518

Dado 3D — a rolagem de DANO (ataque/magia/talento) também usa física de
verdade agora, com Dado 3D ligado: 1 dado só cai fisicamente na tela
(sem o dado de mentirinha aparecendo mais); 2+ dados (Espada Grande,
etc.) caem fisicamente ATRÁS do card, que continua mostrando o valor de
cada um pra você conferir/escolher qual rerolar (Perfurador). Total bate
igual sempre.

## v202609_1502

Vinheta de Fúria (pedido do Osmar) — removida a faixa vermelha do
topo/rodapé, fica só nas bordas esquerda e direita.

## v202609_1456

Vinheta de Fúria trocou de degradê radial pra 2 degradês lineares
(horizontal e vertical, pedido do Osmar) — a faixa vermelha agora fica
uniforme ao longo de toda a borda (não só mais forte nos cantos),
transparente até 90% da tela e só aparecendo nos últimos 10%.

## v202609_1432

Vinheta de Fúria mais suave (feedback do Osmar: "ficou muito
vermelho") — o vermelho nas bordas da tela começa mais pra fora e a
opacidade máxima caiu bem, tanto no degradê quanto no pulso.

## v202609_1431

Corrigido em TODO o app (não só o Dado 3D): tocar rápido em qualquer
botão/área tocável às vezes virava seleção de texto/menu de copiar no
celular. Não deve acontecer mais em lugar nenhum. Campos de digitação
(nome, anotações, etc.) continuam selecionáveis normalmente.

## v202609_1425

Ajustes no card de Fúria (feedback do Osmar testando no celular): texto
dos efeitos agora quebra em linhas separadas (Resistência / Dano da
Fúria / Vantagem) em vez de um parágrafo só; botão "Encerrar Fúria"
ganhou um destaque vermelho suave. E um charme novo: enquanto a Fúria
está ativa, as bordas da tela pulsam num vermelho suave com partículas
emanando de fora pra dentro.

## v202609_1421

Dado 3D — corrigido: tocar rápido nos botões do 🎲 (Múltiplos, tipos de
dado, Histórico, fechar do popup) às vezes virava seleção de texto/menu
de copiar no celular. Agora esses toques não disparam mais seleção.

## v202609_1411

Dado 3D — os botões da coluna expandida (Múltiplos, d4 a d100,
Histórico) mudaram de branco pra azul (mesmo tom do 🎲). Enquanto a
coluna está aberta, o próprio 🎲 fica com visual "afundado"/azul-marinho
(ele só fecha nesse momento, não tem função de rolar).

## v202609_1400

Dado 3D — o botão 🎲 avulso mudou de visual: em vez de abrir uma tela
preta cobrindo tudo, agora os botões de dado expandem numa coluna
saindo do próprio 🎲, alinhada à direita (Múltiplos, d4 até d100,
Histórico), sem escurecer a tela — o dado cai por cima do conteúdo
normal. Cada tipo de dado tem cor fixa (d4 azul, d6 cian, d8 verde,
d10 amarelo, d12 laranja, d20 vermelho, d100 roxo) — a customização de
cor/textura saiu. Tocar fora da coluna fecha ela. Histórico agora abre
num popup com botão de fechar (✕).

## v202609_1339

Dado 3D — mais 2 casos usam física de verdade agora: escolher
Vantagem/Desvantagem só DEPOIS de ver o resultado do 1º dado (o 2º
entra fisicamente do lado dele), e rerolar o d20 com Sorte (Pequenino)
ou Inspiração Heroica. Reroll de dano (Perfurador) continua no dado
clássico por enquanto.

## v202609_1323

Bárbaro — Fúria ligada: no Combate, painel de Ação Bônus tem "😡
Fúria" pra ativar (gasta 1 uso, o total cresce com o nível). Enquanto
ativa, aparece um aviso fixo na tela do Combate com Resistência a
dano Contundente/Cortante/Perfurante, bônus no dano de ataques de
Força e Vantagem em testes/salvaguardas de Força — e um botão
"Encerrar Fúria" ali mesmo. Vestir Armadura Pesada encerra a Fúria
sozinha. Descanso Curto devolve 1 uso, Descanso Longo devolve todos.

## v202609_1224

Dado 3D — Vantagem/Desvantagem já decidida de antemão (ex.: com
armadura sem treinamento) também rola com física de verdade agora,
não só o d20 simples: os 2 dados caem juntos na tela. Escolher
Vantagem/Desvantagem só depois de ver o resultado ainda usa o dado
clássico por enquanto.

## v202609_1156

Corrigido: Badalar Fúnebre (truque) agora mostra 2 botões de "Rolar
Dano" — um pro alvo com vida cheia, outro pro alvo já ferido (o app não
sabe qual é o caso, então você escolhe qual bate com a cena). Conferido
nas outras 390 magias e essa é a única com esse padrão específico de 2
dados-base alternativos.

## v202609_0837

Rolagens de perícia, salvaguarda, ataque e Iniciativa agora usam o
Dado 3D de verdade quando o switch "🎲 Dado 3D" está ligado (menu do
avatar) — o resultado da rolagem passa a ser a física de verdade caindo
na tela, não mais sorteio. Se você escolher Vantagem/Desvantagem depois
de ver o resultado, o 2º dado ainda é o clássico (isso vem numa próxima
entrega). Rolagens com Vantagem/Desvantagem já decidida de antemão
(ex.: com armadura sem treino) também continuam no clássico por
enquanto.

## v202609_0812

Dado 3D avulso (🎲, botão flutuante): removido o campo de rótulo e os
botões Normal/Vantagem/Desvantagem do d20 — essa ferramenta é só pra
rolar dado com física de verdade, sem estar ligada a nenhum teste
específico da ficha. Rolar d20 volta a funcionar igual aos outros
dados (sem pedir nada antes).

## v202609_0113

Bárbaro chegou de verdade na criação de personagem — já dá pra criar
um do zero (perícias, equipamento inicial, Maestria em Arma restrita a
armas Corpo a Corpo). A Fúria em si (a característica principal da
classe) ainda não funciona, isso vem na próxima entrega. De bastidor,
corrigido um cálculo de CA que nenhuma classe expunha ainda: sem
armadura, Bárbaro soma o modificador de Constituição na Classe de
Armadura (não só Destreza) — outras classes continuam iguais.

## v202609_0102

Menu do avatar (👤) ganhou o switch "🎲 Dado 3D" — preferência pra
rolagens oficiais do jogo (Combate/Magias/Atributos) usarem o dado 3D
com física de verdade em vez do sorteio de sempre. Por enquanto o
switch só existe e é salvo (fica desligado se seu aparelho não suporta
gráficos 3D, ou enquanto o Modo de Teste está ativo) — nenhuma rolagem
de verdade usa o dado 3D ainda, isso vem numa próxima entrega.

## v202609_0042

Corrigido: na tela de "Selecione uma classe" (criação de personagem),
"Mago" aparecia 2x (1 clicável, 1 cinza "em breve" — sobra de antes
dele ficar pronto). Bárbaro começa a aparecer como "(em breve)" — dado
da classe já entrou no motor interno, mas a criação de personagem
ainda não reconhece ela de ponta a ponta.

## v202609_2336

Arrumação interna, nada novo pra ver na tela: os recursos de classe/
espécie da aba Combate (Fôlego, Ataque de Sopro, Voo Dracônico,
Mãos Curativas, Inspiração de Bardo, etc.) foram organizados por trás
das cortinas, sem mudar nenhum cálculo — testado criando um Guerreiro
Draconato e usando vários desses recursos, tudo continua igual.

## v202609_2220

Loja (wizard) — comprar um Kit (ex.: Kit de Diplomata) agora marca cada
item individual que já vem incluído nele, com uma tag "Nx adquirido
por Kit de X" abaixo do +/- do item. Se o item vier de mais de um Kit
comprado ao mesmo tempo, mostra a soma e lista os Kits.

## v202609_2149

Pets — remover um pet agora pede confirmação: 1º toque no ✕ arma o
botão (vira "Confirmar", vermelho), 2º toque no mesmo botão remove de
vez. Qualquer outro toque na aba desarma sem remover — mesma dupla
confirmação já usada pra apagar personagem.

## v202609_2133

Combate — corrigido o popup "Espaços" (contador de espaços de magia)
ficar preso na tela por cima da ficha depois de abrir "Ação" → "Usar
Magia" e fechar o painel tocando na área escurecida ao lado do drawer
(em vez do "← Voltar"). Não afeta a lista de magias em si nem o
roteamento Ação/Ação Bônus/Reação.

## v202609_2057

Combate — magias/truques de Ação Bônus (ex.: Danação, do Bruxo) agora
aparecem no painel "Bônus" (com o mesmo botão "✨ Usar Magia" que já
existia no painel "Ação"), em vez de aparecerem no painel errado.
Ação/Reação continuam exatamente como antes.

## v202609_2034

Bruxo — Explosão Agonizante e Explosão Repulsiva ganham tela própria
no Level Up (logo depois de Invocações Místicas): escolha qual truque
conhecido fica vinculado, e o Perfil mostra "🎯 Vinculada a X" em vez
do aviso antigo. A rolagem de dano desse truque agora soma o
modificador de Carisma de verdade quando é Explosão Agonizante.
Personagem que já tinha uma dessas marcada de antes vê a tela de
novo no próximo Level Up, pra vincular.

## v202609_1931

Bruxo — Explosão Agonizante (Invocação Mística) deixa de mostrar
"[PH] sem efeito mecânico ainda" no Perfil: agora soma de verdade o
modificador de Carisma ao dano de Raio Místico sempre que essa
invocação estiver marcada (na aba Magias e no painel de Ação/Reação
do Combate).

## v202609_1846

O dado 3D (🎲, botão flutuante na Ficha) deixa de ser protótipo: agora
o jogador escolhe um rótulo livre e Normal/Vantagem/Desvantagem antes
de rolar 1d20 avulso (em vez de sortear uma perícia à toa só pra
testar). E o mais importante — o "📜 Log" do dado 3D agora mostra
TODAS as rolagens da Ficha, não só as do próprio dado 3D: role uma
perícia normal, um ataque, o que for, e ela aparece na mesma lista.

## v202609_1737

Arrumação interna, nada novo pra ver na tela: os passos de escolha do
Level Up (Truques, Magias Preparadas, Especialista, Proficiências
Bônus, Invocações Místicas, Descobertas Mágicas, Livro de Magias,
Perito em Necromancia) foram organizados numa peça só do motor
interno, sem mudar nenhuma regra — Level Up continua funcionando
exatamente igual.

## v202609_1713

Arrumação interna, nada novo pra ver na tela: os ~50 valores de magia/
conjuração que ficavam soltos no meio da ficha (Espaços de Magia,
Truques, magias preparadas, etc.) foram organizados numa peça só do
motor interno, sem mudar nenhum cálculo. Fecha o levantamento de saúde
do projeto (G1-G3) antes de começar a próxima classe.

## v202609_1656

Nova ferramenta de teste: menu do avatar (👤) ganhou "🕰️ Voltar pra
nível" — quando você sobe de nível (por qualquer caminho), o app
guarda um retrato do personagem naquele momento; toque num nível
anterior pra voltar pra ele e testar/arrumar algo, sem perder o
progresso. Atenção: voltar pra um nível apaga os retratos dos níveis
acima dele (ex: foi até o 15, voltou pro 12 — 13/14/15 somem; subir de
novo a partir do 12 cria eles de novo).

## v202609_1427

2 melhorias no Level Up e na aba Atributos: (1) na hora de definir os
novos PV, além de "Usar a média" e "Rolar", agora tem "Valor manual" —
pra quando o dado de vida já foi rolado numa sessão de mesa antes de
existir a ficha digital; (2) o card "nível atual" virou uma barra de
XP de verdade — toque nela pra lançar quanto de XP ganhou (some ou
tira, se errar o valor), e a seta de Level Up só aparece quando o XP
acumulado bate o marco do próximo nível. O antigo botão de "subir de
nível na sorte" (⚡) continua existindo, mas mudou de lugar — agora é
"⚡ Inst. Level Up" no menu do avatar (canto superior direito).

## v202609_1355

Arrumação interna, nada novo pra ver na tela: removida uma duplicação
de dado (os 10 Estilos de Luta estavam cadastrados 2x em arquivos
diferentes) e adicionados testes automatizados que faltavam em 6
partes do motor de cálculo (recursos de classe, Loja, Maestria em
Arma, Sintonização, Inspiração de Bardo, Equipar/Desequipar). Parte de
um levantamento de saúde do projeto antes de começar a próxima classe.

## v202609_1027

Multiclasse — parte final: quem tem 2 classes que conjuram magia ao
mesmo tempo (ex: Bardo + Mago) agora vê um único contador de Espaços
de Magia combinado (regra oficial), em vez de cada classe separada.
Quem tem Bruxo (Magia de Pacto) + outra classe conjuradora ganhou uma
pergunta na hora de conjurar quando os dois "estoques" de magia têm
espaço — escolhe de qual gastar. Corrigido também um bug de bastidor:
gastar espaço de uma classe não mexia mais sem querer no contador de
outra classe (só afetava quem já tinha 2 classes que conjuram).

## v202609_2256

Multiclasse chegou de verdade: no Level Up, se o personagem já
qualifica pra multiclassar (atributo 13+ na classe atual e na nova),
uma tela nova deixa escolher qual classe sobe — continuar na atual ou
começar uma nova do zero. A ficha agora mostra todas as classes do
personagem no topo (ex: "Guerreiro 3 / Mago 2"), com PV somando as
duas e um seletor pra trocar qual classe está "em foco" (decide o que
aparece em Magias/recursos de classe). Personagem que só tem 1 classe
(todos até agora) não muda em nada.

## v202609_1757

Protótipo do dado 3D ganhou customização — botão "🎨 Customizar" no
canto superior esquerdo do overlay, com 2 seletores: Textura (9
opções, incluindo Padrão) e Cor (8 cores prontas). A escolha vale só
enquanto a tela do dado tá aberta, não fica salva ainda. Textura e cor
não afetam nenhuma rolagem de verdade — é só pra você escolher quais
texturas fazem sentido manter na versão final.

## v202609_1734

Protótipo do dado 3D ganhou um log — botão "📜 Log (N)" no canto
superior mostra as últimas rolagens (guarda até 20, tela mostra ~5 por
vez com scroll pro resto). Rolar 1d20 sozinho (fora do modo Múltiplos)
simula uma perícia aleatória, com chance de vir com Vantagem,
Desvantagem ou "Inspiração Heróica" (mostra os 2 dados e qual foi
mantido); qualquer outra rolagem aparece como "Rolagem de NdX + ..."
com o total dos dados.

## v202609_1612

Corrigido: "Legião dos Mortos" (bônus de PV/dano do Necromante nível
6+, no card do pet) usava o nível de Mago fixo em vez do círculo do
espaço de magia gasto — mesma categoria de erro já corrigida na
Colheita dos Mortos. Agora, ao ligar o bônus, escolha o círculo usado
pra criar/convocar aquele Morto-Vivo — o PV extra e o dano bônus são
calculados a partir disso (+ mod. de Inteligência).

## v202609_2351

Corrigido: "Colheita dos Mortos" (Reação do Necromante nível 10+) curava
errado — recuperava um valor baseado no ND da criatura sacrificada em
vez do seu nível de Mago (regra real, conferida na fonte homebrew). Um
nível 11 que devia curar 11 PV estava curando só 1. Corrigido pra
recuperar sempre o nível de Mago, não importa qual Morto-Vivo for
escolhido.

## v202609_2304

Novo: Necromante nível 14+ ganha "💀 Mestre da Morte" — Ação Bônus
concede PV Temporário a vários Mortos-Vivos de uma vez (marca quem
recebe, na tela de Combate) e Reação "💥 Explosão" quando um deles
chega a 0 PV, causando dano Necrótico em área. PV Temporário do pet
agora aparece na aba Pets e protege de verdade contra dano.

## v202609_2117

Novo: Necromante nível 10+ ganha "💀 Colheita dos Mortos" no painel de
Reação do Combate — quando você fica Ensanguentado (PV na metade ou
menos), pode reduzir um pet Morto-Vivo a 0 PV pra recuperar PV
(dobro do ND dele). Corrigido também: o popup de "Colheita Macabra"
não "espia" mais atrás da rolagem de dado da própria magia — só
aparece depois que a rolagem é fechada.

## v202609_1953

Corrigido: "Colheita Macabra" agora aparece como um popup central (com
título, explicação e a escolha do pet, tudo junto), na hora e no lugar
onde você conjurou a magia — não precisa mais trocar pra aba Magias
pra fazer a escolha, funciona igual direto do painel de Ação do
Combate.

## v202609_1926

Corrigido: no banner de "Colheita Macabra" (curar Morto-Vivo), a lista
de pets estava minúscula (estilo padrão do navegador) do lado de um
botão "Curar" gigante — a lista agora ocupa a largura toda, no mesmo
padrão visual do resto do app.

## v202609_1907

Novo: Necromante ganha "🩸 Colheita Macabra" — ao conjurar uma magia de
Necromancia gastando um espaço (na aba Magias ou no painel de Ação do
Combate), aparece um banner pra curar um Morto-Vivo aliado, com o
valor certo (dobro do círculo gasto).

## v202609_1836

Novo: Necromante nível 6+ pode ligar/desligar "🦴 Legião dos Mortos" no
card de um pet Morto-Vivo (aba Pets) — dá PV extra e mostra o dano
bônus dos ataques dele. Corrigido também: ajustar CA/PV de um pet
(⚙️) agora afeta de verdade o teto de cura pelos botões +/-5/+/-1
(antes ignorava o ajuste).

## v202609_1744

Novo: Necromante (nível 3+) ganha um 2º card na aba Pets, "🧟 Familiar
Morto-Vivo" — convoca um Esqueleto ou Zumbi como familiar em vez das
formas normais (morcego, gato, etc). Convocar de novo troca o familiar
anterior, mesmo comportamento do "Convocar Familiar" do Bruxo.

## v202609_1609

Novo: Necromante ganha a primeira mecânica de verdade — **Perito em
Necromancia**. Ao pegar a subclasse (nível 3) o Level Up mostra um
passo extra com 2 magias de Necromancia grátis pra escolher (mais 1 a
cada novo círculo de magia desbloqueado depois, ex: nível 5); elas
entram direto no Livro de Magias, junto com as normais.

## v202609_1414

Novo: Mago ganha a 5ª subclasse no Level Up — **Necromante** (homebrew,
selo "🏠 Homebrew" deixa claro que ainda não é regra oficial). Já
mostra as 6 características reais na aba Perfil ao escolher; a
mecânica de cada uma (magias grátis, Familiar Morto-Vivo etc.) vem nas
próximas entregas.

## v202609_1250

Novo: aba Pets ganhou "⚙️ Pet com atributos diferentes do padrão?" —
pega uma criatura do catálogo e ajusta CA, PV máximo e atributos antes
de confirmar (útil pra um pet que veio de fora do jogo normal, tipo
presente do mestre, com stats diferentes). O card mostra "ajustado" ao
lado de qualquer número que você mudou, pra saber o que é padrão e o
que não é.

## v202609_1207

Novo: Bruxo com Pacto da Corrente ganha o card "🔮 Convocar Familiar"
na aba Pets — escolha entre as 8 formas especiais reais (Cobra
Peçonhenta, Diabrete, Esfinge Maravilhosa, Esqueleto, Pseudodragão,
Quasit, Slaad Girino, Sprite). Convocar de novo troca o familiar
anterior (só 1 por vez); o "Adicionar Pet" genérico continua
funcionando à parte, sem interferir.

## v202609_0937

Barra de abas (rodapé da Ficha) mudou de visual: era uma "pill"
flutuante com espaço vazio nas pontas, agora é uma barra presa na
borda inferior, ocupando a largura toda com as 6 abas do mesmo
tamanho. Ícone do Perfil trocou de 📜 pra 👤.

## v202609_0847

Novo: aba "Pets" 🐾 na Ficha — adicione um pet/companheiro (nome +
escolha da criatura), veja CA, PV (com barra e botões −5/−1/+1/+5 pra
dano/cura), atributos e ações reais, e remova quando quiser. Ainda é
genérico (qualquer criatura do catálogo) — vínculo automático com
magias/características específicas (ex: Encontrar Familiar do Bruxo)
vem numa próxima entrega.

## v202609_0100

Protótipo do dado 3D — 2 melhorias: (1) todos os botões da tela do
dado (tipos, "Múltiplos" e "fechar") agora são brancos com texto
preto, mais fácil de ler em cima do fundo escuro; (2) novo botão
"Múltiplos" — toca nele, depois toca em quantos dados de cada tipo
quiser (ex: 3x d6 + 2x d4), o botão vira "Rolar (N)" e ao tocar rola
todos juntos de uma vez, mostrando o total.

## v202609_2242

Corrigido: tocar no FAB 🎲 estava rolando um d20 automaticamente antes
mesmo de escolher o tipo — agora só abre a tela de escolha ("Escolha
um dado pra rolar"), e a rolagem só acontece quando você toca em um
dos tipos (d4 a d100).

## v202609_2212

Corrigido de novo: a entrega anterior do protótipo de dado 3D fez o
dado sumir de vez (não aparecia mais nenhum, nem o d20 de antes) — era
a forma de esconder a tela do dado quando fechada que estava errada,
corrigido e testado de novo com várias rolagens seguidas.

## v202609_2205

Protótipo do dado 3D (aquele botão 🎲 na Ficha) ganhou 3 melhorias: (1)
agora dá pra escolher qualquer tipo — d4, d6, d8, d10, d12, d20 e d100
— não só o d20 fixo de antes; (2) corrigido o bug que só deixava rolar
1 vez por carregamento de página (fechar e abrir de novo pra rolar
outra vez agora funciona sem precisar dar refresh); (3) o dado começa
a carregar assim que a Ficha abre, então na maioria das vezes não
aparece mais "Carregando..." na 1ª rolagem. Continua sendo só um
protótipo isolado, não mexe em nenhuma rolagem real do jogo.

## v202609_1953

Ajuste: as 4 subclasses do Mago que ainda não têm emblema próprio
(Abjurador, Adivinhador, Evocador, Ilusionista) agora mostram
"[PH] ícone ainda não desenhado" na tela de Level Up, deixando claro
que é arte provisória — igual já acontecia com "Ainda não
implementada" pra mecânica.

## v202609_1015

Protótipo (isolado, ainda não ligado a nada de verdade): novo botão 🎲
flutuante na Ficha, acima do menu inferior — toca nele e um d20 3D
rola de verdade na tela (física, não desenho). É só um teste pra ver
se vale a pena investir nisso — não muda nenhuma rolagem existente.

## v202609_1012

Novo: Mago agora tem as 4 subclasses oficiais pra escolher no Level Up
(Abjurador, Adivinhador, Evocador, Ilusionista) — aparecem travadas por
enquanto (ainda sem as características mecânicas de cada uma), mesmo
como já acontece com as subclasses ainda pendentes de Bardo e Bruxo.

## v202609_0918

Novo: tocar "Descanso Curto" ou "Descanso Longo" (aba Atributos) agora
mostra uma transição — tela escurece com o nome do descanso no meio e
volta ao normal. Pra quem tem Livro de Magias (hoje só o Mago), o
Descanso Longo também pergunta se quer alterar as Magias Preparadas
antes de terminar a transição.

## v202609_0917

Corrigido: os painéis de Ação Bônus e Reação (Combate) estavam saindo
sempre pela esquerda ao fechar, mesmo tendo entrado pela direita/por
baixo. Agora cada um sai de volta por onde entrou, como já deveria.

## v202609_0014

Novo: Mago nível 5+ ganha "Memorizar Magia" na aba Magias — troca 1
magia preparada por outra do Livro de Magias, disponível 1x por
Descanso Curto (ou Longo).

## v202609_0013

3 melhorias no Combate: (1) o estado dos botões Ação/Ação Bônus/Reação
não reseta mais sozinho ao sair e voltar da Ficha — só reseta de
verdade ao rolar nova Iniciativa ou tocar "Fim do Turno"; (2) tocar
"Fim do Turno" agora mostra uma "piscada de olho" (2 planos pretos
fecham e abrem rápido) em vez do reset acontecer na cara; (3)
confirmado que os painéis de Ação/Bônus/Reação já abrem/fecham cada um
por um lado diferente (esquerda/direita/baixo).

## v202609_2220

Corrigido de novo: a entrega anterior fez as telas "Usar Magia" e
"Escolher Círculo" ocuparem a tela toda, mas não era isso — o tamanho
menor (~84%) já era o esperado, só o texto da lista de magias não
estava aproveitando bem esse espaço. Voltou pro tamanho de antes, com
o texto agora cabendo melhor (menos espaço em branco desperdiçado do
lado do painel de Espaços).

## v202609_2032

Corrigido: as telas "Usar Magia" e "Escolher Círculo" (Combate) agora
ocupam a tela toda de verdade — antes ficavam presas a ~84% da
largura, sobrando uma faixa cinza à direita com pedaço da Ficha
aparecendo (mesmo bug do painel de Espaços corrigido antes, só que
afetando a tela inteira dessa vez).

## v202609_1948

Rolagem de dados ganhou mais suspense: o dado agora dá 2 voltas
completas (1 segundo) antes de mostrar o valor e o total — antes era
quase instantâneo. Quando a rolagem tem menos de 4 dados numa linha
(1, 2 ou 3), eles ficam centralizados em vez de grudados à esquerda.

## v202609_1629

Magia de cura agora rola dado de verdade: Palavra Curativa, Curar
Ferimentos, Oração de Cura, Palavra Curativa em Massa, Curar
Ferimentos em Massa, Aura de Vitalidade e Regeneração já mostram a
rolagem (com upcast, quando aplicável) na aba Magias e no "Usar
Magia" do Combate — antes não faziam nada. Você aplica o PV
manualmente no alvo depois de ver o total.

## v202609_1136

2 ajustes na arte dos dados: o emoji 🎲 que ficava girando por cima da
arte nova enquanto o dado rolava foi removido (a arte já mostra que
está rolando, não precisa dos dois). A tela de "rolar dado de vida" do
Level Up (PV ao subir de nível) também ganhou a arte nova — antes só
os dados do Combate/Magias tinham.

## v202609_1105

Rolagem de dados ganhou arte de verdade: cada tipo (d4, d6, d8, d10,
d12, d20 e d100) agora aparece com seu próprio "dado" desenhado, em
vez do quadradinho genérico de antes — vale pra ataque, dano (dado
único ou vários juntos) e qualquer outra rolagem.

## v202609_1042

Level Up do Mago agora usa o Livro de Magias de verdade: a cada nível,
o grimório ganha 2 magias novas (nunca perde as antigas), e as Magias
Preparadas só podem vir de dentro dele. Truques e Magias Preparadas do
Mago ficam travados no Level Up — a troca de verdade só acontece no
Descanso Longo (próxima entrega).

## v202609_1015

Corrigido de novo: o painel de Espaços de Magia da tela "Usar Magia"
(Combate) estava ficando preso dentro da área da tela de magias
(escondendo texto ou grudado no canto errado). Agora ele fica de
verdade ancorado na tela toda, fora do container de magias.

## v202609_0948

Corrigido: o painel de Espaços de Magia da tela "Usar Magia" (Combate)
agora fica fixo, ancorado à direita e centralizado na tela — antes ele
rolava junto com a lista de magias, o que ficava ruim no celular.
Também ficou maior (cabe 4 pips por linha).

## v202609_0912

Tela "Usar Magia" (Combate) — o resumo de Espaços de Magia, que ficava
espremido em texto corrido no topo, virou um painel do lado direito da
lista de magias (pips grandes, 1 linha por círculo), só nessa tela.

## v202609_0102

Rolagem de dados ficou mais completa: dano com 2+ dados agora mostra
CADA dado individualmente (não só a soma). Talento Perfurador
funciona de verdade — quem tem ele pode rerolar 1 dado de dano
Perfurante à escolha (toca no dado, ou usa o botão quando é 1 dado
só). Agressor, Esmagador, Sentinela e Talhador ficaram definidos como
só texto (não vão ganhar cálculo automático).

## v202609_2248

Aba Magias do Mago — Truques, Magias Preparadas e Livro de Magias
agora são grupos que fecham/abrem tocando no título (▾/▸), igual já
funcionava com Espaços de Magia — ajuda a não ficar rolando a tela
toda pra achar o que precisa.

## v202609_2221

Aba Magias do Mago — ordem das seções trocada: "Magias Preparadas"
(o que dá pra usar agora) vem antes de "Livro de Magias" (o catálogo
completo do grimório), que ficou por último.

## v202609_2127

Aba Magias do Mago mostra dado de verdade: Espaços de Magia, Truques e
o Livro de Magias (grimório) — cada magia do livro aparece marcada
"preparada" ou "não preparada", e usar uma preparada gasta o Espaço
normal, com CD/bônus de ataque calculados pela Inteligência. Ainda
falta o Combat e o Level Up (crescer o livro, trocar preparadas no
Descanso) — próximas entregas.

## v202609_2116

Mago agora aparece na criação de personagem (wizard) — perícias,
truques, equipamento inicial e o Livro de Magias (o "grimório" do
Mago, maior que as magias do dia a dia): escolhe 6 magias de 1º
círculo pro livro e depois só 4 delas ficam preparadas. Ainda não dá
pra jogar com ele na Ficha/Combate — isso vem numa próxima entrega.

## v202609_2018

Talentos Gerais — Analítico, Mente Aguçada e Especialista em Perícia
agora funcionam de verdade: no Level Up, dão proficiência ou
Especialização numa perícia (perícia livre ou de uma lista fixa,
dependendo do talento), e Analítico/Mente Aguçada também liberam
Procurar/Analisar como Ação Bônus na aba Combate — sem sumir da lista
de Ação normal, você escolhe qual usar a cada turno.

## v202609_1859

Corrigido: quem tem Conjurador Ritualista E Espaços de Magia de
verdade (não só Guerreiro) não fica mais travado depois de usar o
Ritual Rápido — a magia Ritual agora mostra os 2 botões lado a lado
("Grátis" e "Usar"), e gastar o grátis não bloqueia conjurar de novo
pagando um Espaço.

## v202609_1832

Aba Magias — as magias Rituais do Conjurador Ritualista (Alarme/
Identificar, por exemplo) ganharam botão próprio "Usar grátis" (roxo):
tocar nele já ativa o Ritual Rápido pra aquela magia, sem precisar
descer até o botão genérico — usar em qualquer uma trava as outras e o
botão de baixo até o próximo Descanso Longo.

## v202609_1828

Aba Magias — o botão "Usar" das magias de Talento Geral fica roxo
quando a magia é uma das Rituais do Conjurador Ritualista, mesma cor
do "Ritual Rápido" logo abaixo, pra facilitar identificar quais dá pra
usar ali.

## v202609_1737

Conjurador Ritualista completo: novo "Ritual Rápido" na aba Magias
(conjura 1 magia Ritual sem gastar Espaço, 1x por Descanso Longo — pip
roxo pra diferenciar do Espaço de Magia normal) e crescimento
automático — quando o Bônus de Proficiência sobe (níveis 5/9/13/17), o
Level Up oferece escolher mais 1 magia Ritual, mantendo as já
escolhidas.

## v202609_1433

Talentos Gerais — Conjurador Ritualista agora funciona de verdade: ao
escolher esse talento no Level Up, o jogador vê a lista real de magias
Rituais de 1º círculo e escolhe quantas o Bônus de Proficiência
permitir (2 no nível 4); elas aparecem na aba Magias como sempre
preparadas.

## v202609_0952

Atualização de ícones — arte própria pras 12 Classes, 16 Origens e 10
Espécies do livro (antes usavam ícone genérico ou uma cópia repetida
do emblema do Guerreiro). Atualização de Magias — motor de dano
completo (Dano Base + Upcast + Escala de Truque por nível de
personagem, níveis 5/11/17), Modal de Ataque e Modal de Salvaguarda
disponíveis na aba Magias e na aba Combate.
