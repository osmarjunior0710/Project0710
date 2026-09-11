# Changelog.md

> Regra de atualização em CLAUDE.md, seção 19. Uma entrada por
> publicação na branch principal (a que dispara o deploy) — a mais
> nova sempre primeiro, nunca reordenar as antigas, sempre pelo menos
> 1 linha em branco entre 2 entradas.

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
