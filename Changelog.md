# Changelog.md

> Regra de atualização em CLAUDE.md, seção 19. Uma entrada por
> publicação na branch principal (a que dispara o deploy) — a mais
> nova sempre primeiro, nunca reordenar as antigas, sempre pelo menos
> 1 linha em branco entre 2 entradas.

## v202609_2214

Removido o texto "Armadura, Escudo e arma da Mão Principal/Secundária já valem de verdade..." embaixo de "Equipado agora" na Mochila.

## v202609_2154

**Mochila — "Equipado agora" não mostra mais Escudo como slot separado.** Escudo ocupa a mesma mão que uma arma na Mão Secundária (regra real: só dá o bônus de CA se estiver empunhado) — agora aparece direto na linha "Mão Secundária", em vez de 2 linhas confusas (uma sempre vazia).

## v202609_2004

Altura dos cards de Idiomas (aba Perfil) padronizada em 35px — antes "Comum" (sem botão) ficava mais baixo que os idiomas com botão de remover. Corrige também os ícones de "Talentos"/"Idiomas", que tinham saído trocados na entrega anterior.

## v202609_1953

Padding de todas as caixas/botões da aba Perfil reduzido pra 4px (visual mais compacto — Osmar comparou 1/2/3/4px antes de decidir). Só a aba Perfil mudou, o resto do app continua igual por enquanto.

## v202609_1945

**Idiomas na aba Perfil ganham gerenciamento de verdade.** Cada idioma agora é uma linha própria (em vez de texto corrido), com botão de remover (dupla confirmação — Comum e idioma fixo de Classe ficam travados). Nova opção "+ Aprender novo idioma" abre uma tela de escolha múltipla com os idiomas que faltam.

## v202609_1844

Títulos "Talentos" e "Idiomas" da aba Perfil ganharam ícone próprio, igual Classe/Origem/Espécie já tinham.

## v202609_1836

Emblemas dos títulos de seção da aba Perfil aumentados de 20px pra 30px (pedido do Osmar).

## v202609_1816

**Perfil ganha os emblemas de classe/subclasse/origem/espécie.** Cada título de seção ("Classe — X", "Subclasse — X", "Origem — X", "Espécie — X") agora mostra o ícone redondo correspondente, quando já existe arte própria importada. Também reorganiza "Invocações Místicas" (Bruxo): antes aparecia como seção solta depois de todas as classes, agora fica junto do resto das características de Bruxo.

## v202609_1715

Corrige o ícone da aba Pets — a versão anterior (v202609_1656) tinha saído corrompida (bloco de pixels borrado). Voltou a mostrar o emblema do gato/corvo certinho.

## v202609_1656

Ícone da aba Pets trocado por um novo emblema (gato e corvo).

## v202609_1638

Cabeçalho da ficha (nome/espécie/classe/nível) quebrado em linhas separadas — texto corrido ficava difícil de ler, principalmente com 2+ classes.

## v202609_1450

**Combate — painel flutuante "Espaços" invertido.** No painel "Usar Magia" (aba Combate), o cartão flutuante que mostra os Espaços de Magia por círculo agora lista do maior pro menor (9º em cima, 1º embaixo) — antes era o contrário, ficava diferente da lista de magias ao lado (que já mostra do maior círculo pro menor).

## v202609_1108

**Corrige: Maestria de Magias e Assinatura Mágica não apareciam na aba Combate.** As 2 magias de cada característica (quando ainda não estivessem TAMBÉM marcadas como Magias Preparadas normais) ficavam de fora da lista de "Usar Magia" do Combate — só apareciam na aba Magias. Agora aparecem nos 2 lugares, com "Conjurar Grátis" funcionando igual nos dois.

## v202609_1049

**Mago — Assinatura Mágica (nível 20).** No Level Up do nível 20, escolhe 2 magias de 3º círculo do Livro de Magias — as 2 ficam sempre preparadas (nova seção na aba Magias) e cada uma pode ser conjurada 1x no 3º círculo sem gastar Espaço de Magia (recarrega no próximo Descanso Curto ou Longo). Vale também na aba Combate: ao "Usar Magia" uma dessas 2 (enquanto ainda não usada no período), a tela "Em qual círculo?" mostra "Conjurar Grátis" no 3º círculo.

## v202609_1220

**Multiclasse — o pill (Mago/Bardo/Bruxo) saiu de vez.** O seletor de classe no topo da ficha não existe mais — Perfil, Magias e Combate já mostram tudo junto sem precisar trocar. O aviso "faltam truques/magias preparadas" agora é por classe.

## v202609_1209

**Multiclasse — Level Up não depende mais do pill.** Subir de nível (pela seta de XP ou pelo raio de teste) sempre pergunta/resolve qual classe sobe de forma explícita, não mais "a que estava selecionada no pill".

## v202609_1147

**Multiclasse — Astúcia Mágica e afins não dependem mais do pill.** Contatar Patrono, Astúcia Mágica, Maestria de Magias e Adepto de Ritual aparecem sempre que o personagem TEM aquela classe, mesmo que o pill esteja em outra. Corrige de brinde um bug: Astúcia Mágica podia recuperar o pool de espaço errado se o pill não estivesse no Bruxo.

## v202609_1141

**Multiclasse — CD/Ataque Mágico agora é por classe.** Personagem com 2 classes conjuradoras (ex.: Mago + Bardo) vê 1 bloco de "Mod. de Conj./CD/Ataque Mágico" pra cada classe, com os números certos de cada uma — antes só mostrava o da classe no pill.

## v202609_0535

**Multiclasse — Espaços de Magia mostra os 2 pools juntos.** Personagem com Bruxo + outra classe conjuradora (ex.: Bardo) agora vê os 2 pools de espaço de magia ao mesmo tempo (aba Magias e painel flutuante em Combate), não só o da classe no pill. Corrige de brinde um bug: com 3+ classes, o pool "da ponte" podia sumir sozinho.

## v202609_0530

**Multiclasse — Perfil mostra todas as classes.** A aba Perfil já mostra as características (e subclasse) de CADA classe do personagem, uma embaixo da outra — antes só mostrava a classe que estava no pill.

## v202609_0220

Corrige o aviso "faltam truques/magias preparadas" pra personagem multiclasse — antes comparava o total das 2 classes juntas contra a cota de 1 só (podia esconder ou inventar um aviso errado).

## v202609_2140

**Multiclasse — Combate também mostra as 2 classes juntas.** O seletor de magia dos painéis de Ação/Ação Bônus/Reação já oferecia as magias das 2 classes (isso já funcionava), mas agora cada uma mostra o selo de qual classe é, igual à aba Magias.

## v202609_2007

**Multiclasse — aba Magias mostra as 2 classes juntas.** Truques e Magias Preparadas de personagem multiclasse (ex.: Bardo/Bruxo) aparecem numa lista só, cada item com um selo colorido de qual classe é — antes só apareciam as da classe do pill.

## v202609_1957

Corrige um bug real: a aba Magias podia travar (tela branca) trocando o pill de uma classe sem magia pra uma com magia, sem sair da tela. Nenhuma mudança visível além disso — é a base de dado (Entrega 1) do foco de Multiclasse, ainda sem o selo de classe na tela.

## v202609_1907

Protótipos de Multiclasse (`/prototipo`) refeitos com a estrutura real da tela (botão Usar, magia de catálogo de verdade) em vez de mockup simplificado.

## v202609_1850

Mago ganha cor própria (azul-claro) nos recursos/selos de classe — cor nova em `/prototipo`, ambiente interno (2 cenas novas de protótipo pra planejar Multiclasse, sem efeito no app real ainda).

## v202609_2321

**Mago — Maestria de Magias, trocar no Descanso Longo.** Ao completar um Descanso Longo (se você já tem as 2 magias de Maestria escolhidas), depois da pergunta de redefinir Magias Preparadas aparece "Quer estudar seu Livro de Magias e trocar 1 das magias de Maestria?" — respondendo "Sim", abre uma tela pra substituir 1 das 2 (1º ou 2º círculo) por outra elegível do mesmo círculo do seu Livro de Magias.

## v202609_2132

**Mago — Maestria de Magias (nível 18).** No Level Up do nível 18, escolhe 1 magia de 1º e 1 de 2º círculo do Livro de Magias (com tempo de conjuração de Ação) — as 2 ficam sempre preparadas (nova seção na aba Magias) e conjuram no círculo delas sem gastar Espaço. Vale também na aba Combate: ao "Usar Magia" uma dessas 2, a tela "Em qual círculo?" mostra "Conjurar Grátis" no círculo base, no lugar dos pips normais.

## v202609_2011

**Mago — Adepto de Ritual (nível 1).** Nova seção na aba Magias, "Adepto de Ritual", listando as magias com marcador Ritual do seu Livro de Magias que ainda não estão preparadas — cada uma com botão "🔮 Ritual" pra conjurar na hora, sem gastar Espaço de Magia e sem precisar prepará-la primeiro (as já preparadas continuam conjurando normal, na seção de cima).

## v202609_1902

**Mago — Recuperação Arcana (nível 1).** Ao completar um Descanso Curto, se você tem Espaços de Magia gastos que dá pra recuperar, aparece a pergunta "Quer usar Recuperação Arcana?" — respondendo "Sim", escolhe quais espaços recuperar por círculo (pips cinza = ainda gasto, azul = marcado pra recuperar), dentro do orçamento combinado do seu nível de Mago.

## v202609_1801

**Copiar Magia — corrigido: dava pra acionar o FAB de Descanso/Dado sem querer, por trás do botão "OK" desabilitado.** O jeito de "apagar" o OK sem dinheiro tirava ele do caminho do toque, então o toque vazava pro botão flutuante embaixo dele. Agora o OK continua recebendo o toque (só não faz nada sem dinheiro), sem interferir no que está por trás.

## v202609_1756

**2 ajustes no Copiar Magia (feedback direto na tela):** o botão "OK" sem dinheiro suficiente estava com aparência "apagada/transparente" — agora ele fica cinza/travado, igual ao padrão de "recurso já usado" do resto do app. E toda listagem de magia do personagem (Truques, Magias Preparadas, Livro de Magias e as demais, em Magias e Combate) agora vem sempre ordenada por círculo e depois por ordem alfabética — antes vinha em qualquer ordem, dificultando achar uma magia específica.

## v202609_1731

**Mago — novo botão "Copiar Magia" na aba Magias.** Deixa copiar uma magia encontrada (pergaminho/outro livro) pro seu Livro de Magias, ou copiar uma magia que você já tem pra um livro reserva — cada modo mostra o custo em tempo + PO, a lista de magias por círculo, e desconta o PO de verdade da sua Mochila ao confirmar (só fica bloqueado se faltar dinheiro pra aquela magia específica).

## v202609_1412

**2 ajustes no Guia do Level Up (feedback direto na tela):** o texto de "Espaços de Magia (1º Círculo) 2 → 3" quebrava em 2 linhas de forma feia — agora o valor sempre fica numa linha só. E características que ganham tela própria (Acadêmico, Subclasse, ASI, etc.) tinham sumido da lista de "Novas Características" — agora aparecem como "escolha pendente", antes de ir pra tela de escolha de verdade.

## v202609_1204

**Mago — a tela "Novas Características" do Level Up virou o guia completo do nível.** Agora, ao subir de nível, ela mostra o antes→depois de cada recurso que mudou (Truques, Magias Preparadas, Livro de Magias, Espaços de Magia por círculo, Talento/ASI disponível) — não só o texto solto de antes. Características ainda sem mecânica de verdade (Adepto de Ritual, Recuperação Arcana, Maestria de Magias, Assinatura Mágica) agora aparecem marcadas com `[PH]`, pra ficar claro o que já funciona e o que ainda é só texto.

## v202609_0822

**Mago — Acadêmico (nível 2) corrigido: o bug que você achou.** Antes o Level Up mostrava o texto "escolha uma perícia" mas não dava pra escolher nada de verdade — agora, ao subir pro nível 2, aparece uma tela de verdade com as 6 opções (Arcanismo, História, Investigação, Medicina, Natureza, Religião); a escolhida ganha proficiência + Especialização (bônus dobrado) na hora.

## v202609_0054

**Mago/Evocador — Entrega 1 (dado no banco):** as 5 características da subclasse (Truque Potente, Versado em Evocação, Esculpir Magias, Evocação Potencializada, Sobrecarga) foram cadastradas — o Evocador deixou de aparecer travado na Escolha de Subclasse e já pode ser escolhido normalmente (Level Up ou Personagem de Teste). Ainda sem mecânica interativa — as próximas entregas ligam cada uma de verdade.

## v202609_0010

**Emblemas das 4 subclasses oficiais de Mago (Abjurador, Adivinhador, Evocador, Ilusionista):** a tela de "Escolha de Subclasse" do Level Up mostrava um ícone genérico pra essas 4 (só o Necromante tinha emblema próprio) — agora as 4 têm banner próprio, igual ao padrão já usado pelas outras classes/subclasses. Nenhuma mudou de mecânica, ainda aparecem travadas até serem implementadas.

## v202609_2243

**Esmagador + Raízes Devastadoras podem aparecer juntos no popup de dano:** com uma arma como Malho (Pesada + Contundente), agora dá pra usar os 2 no mesmo acerto — o popup mostra os 2 cartões (Opção A validada em Protótipos), cada um resolve independente sem fechar o outro.

## v202609_2158

**Raízes Devastadoras (Bárbaro, Trilha da Árvore do Mundo, nível 10) ganhou mecânica de verdade:** acertando com arma Pesada ou Versátil (ex.: Machado Grande, Lança) no seu turno, o popup de dano agora oferece o botão "🌳 Raízes Devastadoras" — escolha Derrubar (salvaguarda de Constituição do alvo, CD calculada) ou Empurrar (automático). Não precisa de Fúria ativa, sem limite de usos por turno.

## v202609_1907

**Novo protótipo interno — Esmagador + Raízes Devastadoras:** em 🧪 Protótipos, cena nova comparando 3 jeitos de oferecer os 2 efeitos quando gatilham no mesmo golpe (cartões paralelos, fila sequencial, lista única) — ferramenta de decisão, não afeta ficha de personagem nenhuma.

## v202609_1749

Ícones da tabbar aumentados de 40x40 pra 50x50px.

## v202609_1727

Tabbar mais compacta: padding vertical dos botões reduzido de 8px pra 4px.

## v202609_1716

Últimos 3 ícones do menu inferior (Atributos, Perfil, Pets) trocados por arte própria — agora as 6 abas mostram só o ícone, sem texto embaixo.

## v202609_1547

**Level Up — passo "Novas Características" some quando não tem nada pra mostrar:** níveis que só dão Aumento no Valor de Atributo/Talento (ex: Guerreiro 3→4) não mostram mais uma tela vazia "Nenhuma característica nova nesse nível" — o passo só aparece quando sobra pelo menos 1 característica pra listar (ex: Guerreiro 4→5, que ganha Ataque Extra).

## v202609_1524

Ícones novos de Mochila, Magias e Combate no menu inferior (artes próprias em vez de emoji) — essas 3 abas agora mostram só o ícone, sem texto embaixo.

## v202609_1332

Cor do Guerreiro (Recuperar Fôlego) confirmada: azul, o mesmo padrão de sempre.

## v202609_0842

**Popups de Conjuração/CD/Ataque Mágico padronizados:** os 3 ⓘ da aba
Magias (Mod. de Conjuração, CD da Magia, Ataque Mágico) agora mostram
a mesma tabela discriminada (label + valor) usada em toda perícia/
salvaguarda, em vez do parágrafo com a fórmula escrita por extenso.

## v202609_0835

**Correção: o fim de cada aba da Ficha agora rola por cima dos 2 FABs**
(😴 Descanso, 🎲 Dado 3D) — antes o final de listas longas (ex.:
Maestria em Arma) ficava escondido atrás deles.

## v202609_0827

**Desvantagem em Furtividade por armadura, automática:** vestir uma
armadura que impõe Desvantagem em Furtividade (Acolchoada, Loriga de
Escamas, Placas Parcial, e todas as Armaduras Pesadas) agora aplica a
Desvantagem sozinha ao rolar Furtividade — sem depender do jogador
lembrar. A perícia ganha um 🔻 ao lado do nome, e o ⓘ explica qual
armadura está causando isso.

## v202609_0739

**Melhorias na Loja (criação de personagem):** os títulos "Equipado
(Origem)/(Classe)" viraram "Escolhido (Origem)/(Classe)" (nada está
equipado ainda nessa etapa); a tag "Nx adquirido por Kit X" ganhou um
tom de azul mais claro, pra não confundir com o azul mais forte de um
item efetivamente comprado; e os itens que vieram de graça pela Origem
ou Classe (não só de Kits) agora também ganham a mesma tag — "Nx
adquirido no kit de origem"/"...de classe" — quando aparecem na lista
de itens à venda.

## v202609_0107

**Correção: os cards de Percorrer a Árvore fecham o painel de Ação
Bônus ao selecionar** — antes ficavam abertos depois de tocar (só o
"Bônus" lá em cima marcava usado), agora fecham igual qualquer outra
escolha do painel.

## v202609_0047

**Percorrer a Árvore virou 2 cards:** o card de Ação Bônus agora
mostra "🌳 Percorrer a Árvore" (teleporte de 18m, pode usar todo
turno) separado de "🌳 Percorrer a Árvore — Longa Distância" (45m +
até 6 criaturas, 1x por Fúria) — antes era 1 card só. Usar qualquer um
dos dois agora também gasta a Ação Bônus do turno, igual outros
recursos do painel.

## v202609_0037

**Força Revigorante agora trava 1x por turno:** o botão "🌳 Força
Revigorante" (Trilha da Árvore do Mundo) fica cinza depois de usado e
libera sozinho no "Fim do Turno" — igual Golpe de Escudo e outras
características de 1x/turno já tinham, em vez de ficar disponível pra
sempre enquanto a Fúria está ativa.

## v202609_2242

**Trilha da Árvore do Mundo — Percorrer a Árvore (Ação Bônus):** com a
Fúria ativa e nível 14+, um novo card aparece no painel de Ação Bônus
explicando o teleporte de 18m (sem custo de recurso) e, quando a
versão estendida de 45m for usada, um toque marca "já usada nesta
Fúria" — volta a liberar sozinho na próxima vez que a Fúria for
ativada. Com isso, a Trilha da Árvore do Mundo (1ª subclasse de
Bárbaro) está completa.

## v202609_2233

**Trilha da Árvore do Mundo — Ramos da Árvore (Reação):** com a Fúria
ativa e nível 6+, um novo card aparece no painel de Reação — toque
nele quando uma criatura à vista começar o turno perto de você pra ver
a CD, e o texto de Falha (ela é teleportada pra perto de você, e você
pode travar o Deslocamento dela a 0 até o fim do turno) ou Sucesso
(nada acontece).

## v202609_2204

**Trilha da Árvore do Mundo — Vitalidade da Árvore já funciona de
verdade:** ativar Fúria (Bárbaro dessa Trilha) já soma Pontos de Vida
Temporário sozinho, sem precisar fazer nada (igual ao seu nível na
classe). Enquanto a Fúria está ativa, um novo botão "🌳 Força
Revigorante" aparece no card de Fúria — rola o dado certo (mesmo
número de d6 do bônus de Dano da Fúria) pra você aplicar como PV
Temporário em outro personagem/aliado na mesa (o app não modela outra
criatura, só rola e mostra o número).

## v202609_0049

Loja da criação de personagem: ícones das moedas em 18 px e alinhados ao centro dos números (com correção ótica pro triângulo do cobre e o pentágono do electro, que parecem mais baixos).

## v202609_0046

Loja da criação de personagem: os ícones das moedas (ouro inicial e restante) ficaram menores (16 px) e alinhados ao centro do valor.

## v202609_0043

**Criação de personagem — ouro na Loja:** o cabeçalho agora mostra os ícones das moedas e o **Restante** aparece nas 3 moedas (PO, PP e PC) com o cálculo certo — ex.: 84,5 PO = 84 PO + 5 PP + 0 PC.

## v202609_1950

**1ª Trilha do Bárbaro: Trilha da Árvore do Mundo já pode ser
escolhida** (a partir do nível 3, na criação ou no Level Up) — mostra
as 4 características reais (Vitalidade da Árvore, Ramos da Árvore,
Raízes Devastadoras, Percorrer a Árvore) no Perfil. Ainda é só o texto
da regra (a parte interativa — Fúria dando Pontos de Vida Temporário,
o popup de Reação — vem nas próximas entregas). As outras 3 Trilhas
continuam "(em breve)".

## v202609_2232

**Criação de personagem — o 🔀 "Sortear tudo desta etapa" agora existe também no Livro das Sombras, no Talento da Origem e no Talento do Versátil, e todos os 🔀 evitam o que o personagem já possui:** a ferramenta da Origem não repete a que veio da Classe, a perícia da Espécie não repete Classe/Origem/Talento, e os talentos (ex.: Músico, 3 instrumentos; Iniciado em Magia) sorteiam só o que ainda não se tem.

## v202609_2229

**Criação de personagem — mostra o que falta:** ao apertar Avançar com alguma escolha pendente, a tela rola até a primeira seção incompleta e o título dela pisca com uma caixa vermelha por alguns segundos (além do aviso de sempre).

## v202609_2226

**Criação de personagem — botão 🎲 Aleatório** nas listas de "Escolha N" do Talento da Origem (ex.: Músico, 3 instrumentos), do Talento da Espécie (Versátil) e do Iniciado em Magia (truques e magia): preenche só as vagas que faltam, mantém o que você já marcou e nunca sorteia o que o personagem já possui ("já possui"). Com a lista cheia vira "Sortear de novo". **Cor dos pips por classe:** Fúria vermelho, Inspiração de Bardo mostarda, Magia de Pacto roxo — na área de recursos do Combate e nos painéis onde esses recursos aparecem.

## v202609_2101

**Recursos de classe na aba Combate:** nova área logo abaixo do HP e dos botões −5/+5, só de leitura, com uma linha por recurso (nome ⓘ pips restantes/total): **Fúria** (Bárbaro), **Inspiração de Bardo**, **Magia de Pacto** (Bruxo) e **Recuperar Fôlego** (Guerreiro). Mostra os recursos de TODAS as classes do personagem de uma vez (não só a do pill) e o ⓘ explica o que é e quando recarrega. Também corrigido: a Fúria de personagem multiclasse agora usa o nível da classe (não o nível total). Novo botão na Lista: 🧪 Char Multiclasse (Bárbaro 1 / Bardo 1 / Bruxo 1, atributos 20) pra conferir.

## v202609_2034

O FAB de dados (🎲) ganhou o mesmo formato do FAB de Descanso, espelhado: 56 px, cantos bem redondos e o inferior-direito quase reto, só o ícone, no canto direito logo acima da barra de abas — os dois ficam na mesma linha. O menu de dados e a área de queda do dado 3D acompanharam a nova posição.

## v202609_2032

O FAB de Descanso ficou só com o ícone 😴 (sem o texto "Descanso"), no formato do FAB de referência: 56 px, cantos bem redondos e o inferior-esquerdo quase reto, logo acima da barra de abas.

## v202609_2031

O botão flutuante de Descanso virou um FAB estendido: pílula com o ícone 😴 e o texto "Descanso", com o canto inferior esquerdo quase reto, colado ao canto esquerdo logo acima da barra de abas (12 px de folga). As opções Curto/Longo continuam abrindo pra cima.

## v202609_2027

**Personagem multiclasse sem espaços de magia:** o "Inst. Level Up" (ferramenta de teste) deixava o personagem passar do nível 20 (o Char de Teste Fixo foi pra Mago 18 + Bardo 3 = nível 21) e a tabela de espaços de multiclasse só vai até 20, então ele ficava sem nenhum espaço. Agora o Inst. Level Up some no nível 20 e a consulta da tabela trava em 20.

## v202609_2018

**Correção no painel de Reação:** magia sem espaço de magia disponível agora aparece esmaecida, sem clique e com "· sem espaço disponível" (igual ao picker de Usar Magia), em vez de parecer ativa. Também passa a valer a regra de conjurar com espaço de círculo maior: se o do círculo da magia acabou mas sobra um maior, ela continua disponível e a Reação gasta o menor espaço que sirva.

## v202609_2007

Os emojis provisórios da Bolsa de Moedas foram trocados pelos ícones de verdade: triângulo de cobre (PC), quadrado de prata (PP), pentágono de electro (PE), círculo de ouro (PO) e hexágono de platina (PL) — na linha da Mochila e no título do painel de cada moeda.

## v202609_2002

**Bolsa de Moedas na Mochila.** A primeira linha da Mochila agora tem as 5 moedas (PC, PP, PE, PO, PL — emojis provisórios) com o total em PO. Tocar numa moeda abre um painel pra **Adicionar** ou **Remover**; remover gasta com conversão automática entre moedas (usa a do tipo, depois as menores, depois quebra uma maior e devolve o troco) e mostra o que foi pago e o troco. Personagens novos começam com o ouro que sobrou da Loja. Nova regra em 📜 House Rules: **Peso das moedas** (100 moedas = 1 kg na carga; vem ligada). Também corrigido: os Dados de Vida gastos agora são salvos de verdade ao recarregar a ficha.

## v202609_1933

Ao ganhar XP suficiente pra subir de nível, o anel agora termina de encher primeiro e só depois o selo de Level Up aparece (com uma entrada suave), em vez de cortar a animação. Se a ficha já abrir com Level Up pendente, o selo aparece direto.

## v202609_1930

**Anel de XP mostra o progresso real do nível:** em vez de XP total contra o marco absoluto (ex.: 301 de 900), conta só dentro do nível atual (ex.: nível 2 com 301 XP = 1 de 600). O número no centro continua sendo o XP total.

## v202609_1925

**Selo de Level Up:** quando o XP passa do marco, o selo dourado do livro com a seta aparece no lugar do anel de XP (na caixa de nível). Tocar nele abre o Level Up; o resto da caixa continua abrindo o XP.

## v202609_1847

**Anel de XP com a mesma animação da barra de vida:** ao adicionar (ou remover) XP, o trecho novo aparece na hora num azul mais claro e, depois de uma pausa curta, o azul cheio vai preenchendo (ou esvaziando) até alcançá-lo. Toques seguidos continuam de onde estava.

## v202609_1841

**Caixa de nível/XP (aba Atributos):** a caixa inteira agora abre o popup de XP. Por dentro são duas metades: à esquerda "Level" com o número embaixo; à direita um anel de progresso com o XP no centro (abreviado, ex.: 1,5k). Quando o Level Up está liberado, o anel vira uma seta ⬆️ — tocar nela abre o Level Up.

## v202609_1814

Aba Magias: o rótulo "Mod. Conjuração" virou "Mod. de Conj.".

## v202609_1813

Aba Magias: removidas das explicações dos ⓘ (Mod. Conjuração, CD e Ataque Mágico) as frases "não é pra rolar" e "só consulta".

## v202609_1809

**Topo da aba Magias:** 3 caixas na mesma linha com os números de conjuração da ficha de papel — **Mod. Conjuração** (com o atributo), **CD da Magia** e **Ataque Mágico**. São consulta (borda tracejada, não rolam) e cada uma tem um ⓘ explicando o que é e como o valor é formado (com a conta do seu personagem).

## v202609_1759

Na aba Atributos, o título "Dados de Vida" ganhou um ⓘ que abre uma explicação: pra que servem (curar no Descanso Curto, dado + Constituição, mínimo 1), como funcionam na multiclasse, que não existe limite de dados por descanso (só os que você ainda tem) e que o Descanso Longo devolve todos.

## v202609_1755

**Dados de Vida no Descanso Curto.** A reserva (1 dado por nível, do tipo de cada classe — multiclasse soma tudo e separa por tipo, ex.: 18d6 + 3d8) aparece na aba Atributos. Ao fazer um Descanso Curto com PV faltando, abre um painel pra gastar dados: cada toque rola o dado + Constituição (mínimo 1) e cura, com a barra animando. Com PV cheio o passo é pulado. O Descanso Longo devolve todos os dados gastos.

## v202609_1736

Removido o texto de resumo que aparecia na tela depois de um Descanso Curto/Longo.

## v202609_1732

**Barra de vida estilo jogo de luta (aba Combate):** ao tomar dano, a barra cai na hora e o trecho perdido fica em vermelho, que depois vai esvaziando; na cura, o trecho a preencher aparece em vermelho e o verde vai enchendo. Toques seguidos não reiniciam: continua de onde estava (0,2 s por ponto, entre 1 e 2 s). O botão **Manual** agora funciona: abre um campo pra digitar o valor, com botões Tomar dano (vermelho), Curar (verde) e fechar.

## v202609_1702

O FAB de Descanso (😴) agora fica no canto inferior esquerdo da tela; as opções Curto/Longo abrem pra cima, alinhadas à esquerda.

## v202609_1615

**FAB de Descanso:** os botões Descanso Curto/Longo saíram da aba Atributos e viraram um botão flutuante 😴 (ao lado do de dados), disponível em qualquer aba — toque e escolha Curto (1 hora) ou Longo (8 horas). O texto do que foi recuperado agora aparece como um aviso na tela (toque fecha, some sozinho em 9s).

## v202609_1547

**Crítico nos ataques de magia + house rule "Confirmação de crítico".** Ataques de magia agora dobram os dados de dano no 20 natural (igual aos de arma). Em 📜 House Rules (menu do avatar) tem o novo switcher **Confirmação de crítico** (desligado por padrão): ligado, um 1 ou 20 natural em ataque pede antes um segundo d20 de confirmação (com o ícone do dado, só informativo). No 1: Errei / Rolar Dano. No 20: Rolar Dano / Rolar Dano Dobrado.

## v202609_1541

**Acerto Crítico de verdade nos ataques de arma** (ataque normal, Golpe Brutal, Ataque Bônus/mão secundária e Cortar): 20 natural agora só oferece **Rolar Dobro do Dano** (dobra os dados, o modificador conta uma vez só, inclusive os dados do Golpe Brutal); 1 natural oferece **Errei / Rolar Dano** (dano normal, sem dobra); de 2 a 19 continua Errei / Acertei. Ataques de magia ainda não dobram (próxima entrega).

## v202609_1536

Protótipo da confirmação de crítico: removido o texto explicativo embaixo do dado de confirmação.

## v202609_1534

**Protótipo da confirmação de crítico:** a conta do dado (ex.: 9 + 5 = 14) agora vem com o ícone do dado ao lado (d20 aqui; outro dado mostraria a arte dele), no ataque e no dado de confirmação.

## v202609_1531

**Correção:** com o Dado 3D ligado, às vezes um dos dados de uma rolagem de 2+ dados (ex.: dano dobrado 2d8) aparecia vazio e não entrava na soma. Agora todos os dados contam, inclusive quando o dano mistura dados diferentes (arma + Ataque Furtivo).

## v202609_1526

**Protótipo** (ainda não está no combate real): nova cena "House rule — Confirmação de crítico" no ambiente de Protótipo. Dá pra forçar 1 e 20 e ver o fluxo com e sem a house rule (2º dado de confirmação, botões Errei / Rolar Dano / Rolar Dano Dobrado). Teste de Perícia não ganha 2º dado.

## v202609_1455

Novo item **📜 House Rules** no menu do avatar (Preferências): abre um painel lateral com as regras da mesa. Por enquanto só tem **Peso da Mochila** (que saiu do menu de Preferências), e a escolha agora fica salva e vale pra todos os seus personagens, mesmo depois de recarregar.

## v202609_1433

Os painéis de Ação, Ação Bônus e Reação do Combate agora são três painéis separados, cada um com a sua animação: acabou o deslize duplo ao trocar de um pro outro. Cada painel tem um fundo bem claro próprio (azul, amarelo e verde).

## v202609_0019

**Salvaguarda do Alvo virou de verdade — não é mais "atira e esquece"**
(Ataque de Sopro, Lançar no Inferno, Golpe de Escudo e magia com
salvaguarda genérica): quando a ação causa dano, o app já rola sozinho
ao tocar (sem precisar de um botão separado de "Rolar Dano") e o popup
final já mostra Falha e Sucesso com o número certo — inclusive a
metade do dano do Ataque de Sopro, já calculada. Layout novo: título,
CD, Falha, Sucesso, e um único botão "Ok" pra fechar (tirei o "fechar
tocando fora", pra não fechar sem querer no meio da leitura). Continua
faltando só o número no Sucesso das magias genéricas mais raras (as
que vêm direto da planilha) — isso ainda espera uma coluna nova que o
Osmar vai adicionar.

## v202609_1151

**Protótipo de Salvaguarda do Alvo evoluiu pra um "popup único"
configurável**, em "🧪 Protótipos" (Lista de personagens): agora tem 2
modos lado a lado — "Ataque (Acerto/Erro)", que é o fluxo real de
hoje, e "Salvaguarda do Alvo", que já rola o dano sozinho (mostra
"Rolando…" e monta o popup final com CD, Falha e Sucesso já calculados
— sem precisar tocar num botão separado de dano) e deixa ligar/
desligar cada bloco de informação (CD, dano da falha, tipo de sucesso,
aviso, dano condicional extra) por toggle, além de travar o fechamento
só no botão "Ok" (toque fora não fecha mais sem querer). Os protótipos
antigos já decididos ("Acerto/Erro", "Esmagador/Talhador", exemplo
simples) foram removidos da lista. Ainda não afeta nenhuma magia/
ataque real — continua esperando a coluna nova na planilha (seção
"Salvaguarda do Alvo" do `PENDENCIAS.md`) e a aprovação do layout final.

## v202609_2349

**Novo protótipo: "Salvaguarda do Alvo — Passou/Falhou + meio dano"**
em "🧪 Protótipos" (Lista de personagens). Testa perguntar "Passou?"/
"Falhou?" de verdade (em vez de só mostrar CD e rolar sempre o dano
cheio) e como mostrar o cálculo de "metade do dano" depois de rolar.
Ainda não afeta nenhuma magia/ataque real — dois pontos travados
esperando decisão: uma coluna nova na planilha (pra saber se o
sucesso da magia é "metade"/"nenhum"/"cheio" sem depender do texto) e
validar essa apresentação do cálculo antes de formalizar.

## v202609_1821

**Todo ataque agora pergunta "Acertou?" — sem exceção.** Ataque
normal, Ataque Bônus (mão secundária), Cortar e ataque de magia
(qualquer classe) ganharam o mesmo popup "Errei/Acertei" que já
existia em Golpe Brutal/Esmagador/Talhador — errou, fecha e pronto;
acertou, o dano já rola sozinho (sem mais o botão manual "Rolar
Dano"). Ancestralidade Gigante (Golias) também virou parte desse
mesmo popup, junto do dano do ataque principal, em vez de um botão
solto na tela.

## v202609_1531

**Magia de cura ganha efeito visual — vinheta verde + partículas "+".**
Quando você escolhe "Me curar" no popup de uma magia de cura, sobe um
brilho verde da base da tela com "+" flutuando pra cima, 2 segundos,
depois some sozinho (mesmo estilo da aura vermelha da Fúria do
Bárbaro). Só em magia de cura — Mãos Curativas, Recuperar Fôlego e os
botões manuais de PV continuam sem esse efeito.

## v202609_1304

Talentos Esmagador e Talhador funcionam de verdade: ao acertar um
ataque com arma que causa dano Contundente (Esmagador) ou Cortante
(Talhador), 1x por turno, o popup de dano ganha um botão do talento —
tocar mostra o efeito (empurrar o alvo 1,5m / reduzir Deslocamento em
3m) com as opções "Ativar" ou "Não usar" (essa última guarda o talento
pro próximo ataque do mesmo turno).

## v202609_0956

Novo protótipo em "🧪 Protótipos" (Lista de personagens): cena
"Esmagador/Talhador" pra validar o fluxo proposto pra esses 2 talentos
(ataque → acerto → dano → popup "Ativar"/"Não usar"). Ainda não afeta
nenhum personagem real.

## v202609_1955

Corrigido: a ação de Fúria do Bárbaro tinha sumido do painel de Ação
Bônus (mostrava "Nenhuma ação bônus disponível" mesmo o personagem
tendo Fúria) — bug antigo, não relacionado à entrega anterior, achado
enquanto o Osmar testava. Fúria volta a aparecer normal, com os pips
de uso e o toggle pra ativar.

## v202609_1937

Golpe de Escudo (talento Mestre em Escudos) agora abre um popup próprio
ao usar — mostra a CD da salvaguarda, o que acontece no sucesso e na
falha ("empurra 1,5m ou derruba, à sua escolha") — em vez de só marcar
usado direto ao tocar. Mesmo padrão visual que Ataque de Sopro e
Lançar no Inferno já tinham.

## v202609_1816

Talentos que exigem treinamento com Armadura Média/Pesada ou Escudo
(Especialista/Mestre em Armaduras Médias/Pesadas, Mestre em Escudos)
agora ficam bloqueados de verdade na lista de Talentos quando o
personagem não tem esse treinamento, em vez de só mostrar um aviso.

## v202609_1805

**Cura ganha "Curar outro"/"Me curar", igual ao Acerto/Erro.** Ao
rolar cura de magia (qualquer classe) ou Mãos Curativas (Aasimar), o
popup agora pergunta o alvo em vez de só mostrar o total: "Curar
outro" fecha (aplica na mesa como sempre); "Me curar" fecha e já soma
o total ao seu PV sozinho. Recuperar Fôlego e Fúria Implacável
continuam iguais (já eram sempre "eu mesmo").

## v202609_1742

**Tentativa de corrigir a sombra do dado 3D, que sumiu depois da
correção do dado 3D "morrendo".** Configuramos explicitamente a
sombra do motor de dado físico (em vez de depender do padrão da
biblioteca) — não deu pra confirmar sozinho se isso já resolve, já
que a sombra não aparece no ambiente de teste automatizado nem antes
nem depois dessa mudança. Testa aí e avisa se a sombra voltou.

## v202609_1654

**Corrige o dado 3D "morrendo" pro resto da sessão.** Bug introduzido
pelo ambiente de Protótipos: visitar `/prototipo` (ou até só a Lista)
e depois voltar pra uma Ficha fazia o dado físico parar de aparecer
de vez (o número ainda saía certo, só sem a animação/dado físico) —
só um F5 resolvia. Corrigido de raiz: o "espaço" onde o dado 3D vive
agora é permanente, independente de qual tela você está.

## v202609_1644

Ajuste pequeno nos títulos dos popups de Golpe Brutal — agora mostram
"Ataque + Golpe Brutal" e "Dano + Golpe Brutal", mais claro que antes.

## v202609_1640

Golpe Brutal (Bárbaro, nível 9+) de verdade agora segue o fluxo novo:
ao atacar, o popup pergunta "Errei"/"Acertei" antes de liberar o dano;
se acertou, o dano da arma e o dado extra do Golpe Brutal já rolam
juntos num popup só, com um botão "🔨 Golpe Brutal" que abre a lista
de efeitos (cartões com título + descrição) pra escolher — a escolha
não muda nada mecanicamente ainda (o app não rastreia inimigo), mas
agora tem um caminho claro até ela.

## v202609_1546

Refinamento na cena "Acerto/Erro" dos Protótipos: o popup de dano
agora é condicional — mostra "OK" simples pra quem não tem
característica com escolha de efeito, ou um botão com o nome da
característica (ex. "🔨 Golpe Brutal") que abre um 3º popup com a
lista de efeitos (título + descrição, igual à aba Combate) e um "OK"
que só habilita depois de escolher. Ainda protótipo, não muda o jogo.

## v202609_1439

A cena "Acerto/Erro" do ambiente de Protótipos agora usa o popup de
rolagem de verdade (não uma tela separada) — ele ganhou a capacidade
opcional de perguntar "Errei/Acertei" e encadear direto num popup de
dano com escolha de efeito, só quando quem chama pedir isso (nenhuma
rolagem real do jogo mudou de comportamento). Ainda é só protótipo,
não afeta nenhum personagem.

## v202609_1406

Ambiente de "🧪 Protótipos" ganhou a cena "Acerto/Erro — Ataque com
efeito", com 3 variantes trocáveis do mesmo cenário de mentirinha
(ataque num Goblin) — serve pra a gente decidir junto como o fluxo de
ataque→dano→efeito deveria funcionar de verdade, ainda não muda nada
no jogo real.

## v202609_1402

Talento Mestre em Escudos agora funciona de verdade: com arma Corpo a
Corpo e Escudo equipados, aparece "Golpe de Escudo" ao lado de Atacar
mostrando a CD da salvaguarda do alvo (empurra 1,5m ou derruba, à
escolha) — 1x por turno. Com isso, fecha o grupo de 5 talentos gerais
implementados nesta rodada (Resiliente, Especialista Ambidestro,
Mestre das Armas, Mestre em Armas Grandes, Mestre em Escudos).

## v202609_1355

Novo ambiente de "🧪 Protótipos" — ferramenta interna (link discreto
no rodapé da Lista de Personagens) pra testar ideias de fluxo/UX antes
de virarem de verdade. Ainda não afeta nenhuma tela do jogo, mas já
serve pra você bisbilhotar se quiser: `Lista > 🧪 protótipos`.

## v202609_1231

Talento Mestre em Armas Grandes agora funciona de verdade: com arma
Pesada, todo acerto já soma o Bônus de Proficiência no dano
automaticamente. E depois de um Acerto Crítico (detectado sozinho)
ou de você confirmar manualmente que reduziu o alvo a 0 PV (botão "☠
Reduziu o alvo a 0 PV?" perto de Atacar), libera "Cortar" — 1 ataque
extra com a mesma arma na Ação Bônus.

## v202609_1125

Corrigido: trocar arma de Maestria (🔄, seja a do Guerreiro/Bárbaro ou
a do talento Mestre das Armas) agora só é permitido 1 vez a cada
Descanso Longo — antes dava pra trocar quantas vezes quisesse, a
qualquer momento.

## v202609_1912

Corrigido: Maestria em Arma do Guerreiro/Bárbaro agora cresce de
verdade nos níveis certos (4, 10 e 16 pro Guerreiro) — antes ficava
travada no número de armas escolhidas na criação do personagem pra
sempre. Agora, ao subir pra um desses níveis no Level Up, aparece uma
tela pra escolher só a(s) arma(s) nova(s); as que você já tinha
continuam intactas.

## v202609_1124

Talento Mestre das Armas agora funciona de verdade: dá 1 slot EXTRA
de Maestria em Arma, independente dos slots normais da classe,
podendo ser qualquer arma que você já seja proficiente (não só o
catálogo nativo da sua classe) — escolhido no Level Up e trocável em
Descanso Longo, aparece como uma linha a mais na seção "Maestria em
Arma" da aba Atributos.

## v202609_0016

Talento Especialista Ambidestro agora funciona de verdade: com ele,
o ataque bônus da mão secundária passa a valer mesmo com uma arma
corpo a corpo que não seja Leve na mão secundária (só a principal
ainda precisa ser Leve) — antes as duas precisavam ser Leve pra
liberar esse ataque extra.

## v202609_2115

Level Up: qualquer talento que dá +1 num atributo (mesmo quando só há
1 atributo possível, tipo Resistente/Ator/Sorrateiro) agora sempre
mostra uma tela de confirmação com "atributo atual → atributo novo"
antes de aplicar — antes esses talentos de atributo único aplicavam o
+1 direto, sem tela nenhuma.

## v202609_2045

Talento Resiliente ganhou uma tela nova de escolha de atributo (+1 e
proficiência de Salvaguarda) mostrando o valor atual e pra quanto ele
vai, igual já acontecia nas telas normais de Aumento no Valor de
Atributo — antes só mostrava o nome do atributo, sem essa referência.

## v202609_0946

Bárbaro — Campeão Primitivo (nível 20) chegou: Força e Constituição
sobem +4 cada (até no máximo 25), automático. Junto veio uma correção
que vale pra qualquer classe: quando o mod. de Constituição sobe (por
esse ou por um Aumento no Valor de Atributo normal), o PV Máximo agora
é ajustado corretamente, incluindo retroativo — antes esse ajuste não
acontecia.

## v202609_0114

Bárbaro — Força Indomável (nível 18) chegou. Em qualquer teste ou
Salvaguarda de Força, se o total sair menor que o seu valor de Força,
ele vira automaticamente esse valor — sem precisar tocar em nada,
aparece "💪 Força Indomável" no popup de dado quando isso acontece.

## v202609_1959

O painel Ação Bônus agora mostra o contador de usos de Fúria (pips
vermelhos) acima do toggle de ativar, mesmo padrão que Salto da Nuvem/
Fôlego já tinham.

## v202609_1933

Talento "Resiliente" chegou: ao escolher esse talento no Level Up
(nível 4/8/12/16/19), um passo novo pede pra escolher 1 atributo entre
os que você ainda não tem Salvaguarda proficiente — ele ganha +1 e vira
Salvaguarda proficiente na hora.

## v202609_1917

Bárbaro — Fúria Persistente (nível 15) chegou. Depois de gastar pelo
menos 1 uso de Fúria, o card de Fúria (aba Combate) ganha um botão "🔥
Recuperar Fúria" que zera os usos gastos — disponível só 1x até o
próximo Descanso Longo.

## v202609_1847

Bárbaro — Fúria Implacável (nível 11) ficou mais direta: em vez de
mandar rolar a Salvaguarda de Constituição na aba Atributos, agora o
próprio aviso já mostra a CD e a fórmula do dado e tem um botão "🎲
Rolar Salvaguarda" — o app rola e já resolve sozinho. Passou, aparece
"Curar N PV" (toque pra aplicar); falhou, aparece "Inconsciente".

## v202609_1731

Corrigido: escolher Vantagem/Desvantagem DEPOIS de ver o resultado do
1º dado físico mostrava o 2º dado com o ícone 2D antigo por cima do
dado de verdade caindo atrás. Agora mostra "Rolando..." como o resto —
mesma correção aplicada a Sorte (Pequenino), Inspiração Heroica e o
reroll do Perfurador quando é 1 dado só.

## v202609_1728

Bárbaro — Fúria Implacável (nível 11) chegou. Se o PV cair a 0 com a
Fúria ativa, aparece um aviso pra rolar a Salvaguarda de Constituição
(aba Atributos) contra uma CD — se passar, o PV volta pro dobro do seu
nível de Bárbaro. A CD sobe a cada vez que isso acontecer, e só volta
ao normal num Descanso Curto ou Longo.

## v202609_1322

Mochila do "🧪 Char de Teste Fixo" agora vem com 1 de cada item do
catálogo (todas as armas, armaduras/escudos e equipamento de
aventura/ferramentas) — dá pra abrir qualquer popup de item sem
precisar comprar nada na Loja primeiro. A Carga aparece acima do
máximo de propósito (carregando tudo de uma vez). Com isso, o foco do
Char de Teste Fixo fecha — próximo foco: Talentos.

## v202609_1239

Corrigido: no popup de rolagem, um título comprido (ex.: "Ataque —
Ataque Desarmado (Golpe Brutal)") corria por baixo do botão ✕ de
fechar. O ✕ ficou menor e foi pro vértice do canto do card — nunca
mais fica embaixo do texto, não importa quantas linhas o título
quebrar.

## v202609_1141

O "🧪 Char de Teste Fixo" agora nasce direto no nível 20 — Mago 17
(Necromante) multiclasse com Bardo 3 (Colégio do Conhecimento), com
espaços de magia até o 9º círculo, Livro de Magias e Magias Preparadas
cheios (incluindo Curar Ferimentos/Palavra Curativa, pra testar cura de
verdade) e os 4 Aumentos de Atributo já aplicados. Clérigo (ideia
original) ainda não existe no app — trocado por Bardo, que já cobre
cura e já suporta multiclasse.

## v202609_1117

Bárbaro — Golpe Brutal (nível 9) chegou. No Combate, com Ataque
Imprudente ativo, tocar "🔨 Golpe Brutal" (aparece ao lado de "🗡
Atacar" a partir do 2º ataque do turno) renuncia à Vantagem nessa
jogada — se acertar, aparece um 2º botão de dano extra e você escolhe
o efeito (empurrão, redução de Deslocamento, e mais 2 opções a partir
do nível 13; no 17 o dado extra dobra e dá pra escolher 2 efeitos de
uma vez). 1x por turno.

## v202609_0946

Novo botão "🧪 Char de Teste Fixo" na Lista de Personagens — cria (ou
recria do zero) sempre o MESMO personagem de teste (Mago nível 1,
atributos extremos, magias variadas), em vez de sortear um novo toda
vez. Fica ao lado do "🎲 Personagem de Teste" de sempre, que continua
igual.

## v202609_0053

Bárbaro — Instintos Primitivos (nível 7) chegou: rolagem de Iniciativa
agora tem Vantagem automática. Bote Instintivo (mesmo nível) fica só
textual na aba Perfil, já que o app não rastreia Deslocamento do
personagem.

## v202609_1941

CD de magia, CD do Ataque de Sopro (Draconato) e CD de "Lançar no
Inferno" (Bruxo) ganharam o ⓘ mostrando de onde vem o número. Rolagens
de dano e cura de magia também: toca no ⓘ ao lado do dado rolado pra
ver Dado Base, Aprimoramento de Truque (quando o truque escala por
nível) e Upcast (quando conjurada num espaço de círculo maior)
separados.

## v202609_1855

Popup de rolagem de Ataque de MAGIA (truque/magia com ataque, ex. Raio
de Fogo) também ganhou o ⓘ com a quebra do modificador. Com isso, toda
rolagem de d20 do app (perícia, salvaguarda, iniciativa, ataque com
arma, ataque de magia) já mostra de onde vem o número.

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
