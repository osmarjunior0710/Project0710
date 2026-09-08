# Changelog.md

> Regra de atualização em CLAUDE.md, seção 19. Uma entrada por
> publicação na branch principal (a que dispara o deploy) — a mais
> nova sempre primeiro, nunca reordenar as antigas, sempre pelo menos
> 1 linha em branco entre 2 entradas.

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
