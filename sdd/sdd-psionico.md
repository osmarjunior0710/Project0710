# SDD — Psiônico (Unearthed Arcana 2025) — levantamento e texto literal

> **Status:** levantamento do chapéu 1 (Product Manager) — ainda **sem plano aprovado** e **sem código** (ver `EmDev.md`). Criado em 2026-10 a
> pedido do Osmar, que enviou o PDF e confirmou que quer o Psiônico no app.
>
> **Fonte única desta classe:** `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf` — tradução em português do canal
> "conDado" do UA 2025 da Wizards of the Coast (23 páginas). Conteúdo **não oficial** (playtest). Não está no Livro do Jogador 2024 nem na
> planilha mestra (a planilha só tem 18 magias UA Psion + 10 "Talentos Selvagens" isolados e "Psiônico" na lista de quem usa Foco Arcano).
> Leitura: `npm run pdf -- <pdf> --tudo`. O texto literal está nas seções "Texto literal" no fim deste arquivo, com a marca de página
> (`===== p.N =====`); o PDF avisa que trechos em fonte/cor diferentes vêm da UA antiga — **a cor não sobrevive à extração de texto**, então o
> Osmar precisa conferir no PDF se algum trecho colorido muda alguma regra abaixo.

## 1. Lista exaustiva de características (nível 1 → 20)

Status de código: **hoje nada existe** — a classe Psiônico não está no catálogo (`classes.ts`), não há função em `core/`, nada na ficha.
"Reuso" = mecanismo já existente no app que a entrega encaixa (regra 6.5 do `CLAUDE.md`).

### Classe base

| Nível | Característica | Tipo | Observação / reuso | Entrega |
|---|---|---|---|---|
| 1 | Conjuração (Spellcasting) | recurso + escolhas | Truques, magias preparadas, espaços (conjurador **completo**: tabela idêntica à do Mago), atributo INT; **Conjuração Psiônica**: magia de psiônico sem componentes V/M (exceto M consumido/com custo) | E2 |
| 1 | Poder Psiônico (Psionic Power) | recurso | Dados de Energia Psiônica (tamanho e quantidade por nível; recupera 1 no Descanso Curto, todos no Longo) + 2 recursos gratuitos: **Impulso Telecinético** e **Conexão Telepática** | E3 |
| 1 | Telecinese Sutil | passiva | Mão Mágica sem somático e invisível | E3 |
| 2 | Disciplina Psiônica | escolha (11 opções no PDF) | 2 no nível 2, +1 nos níveis 5, 10, 13, 17; trocável a cada nível; 1 por turno | E4 |
| 3 | Subclasse do Psiônico | escolha | 4 subclasses (ver abaixo) | E6 |
| 4, 8, 12, 16 | Melhoria no Valor de Atributo | escolha | Reuso do motor de ASI | E2 |
| 5 | Restauração Psíquica | ativa (1 min, 1x/Descanso Longo) | Recupera os Dados de Energia gastos | E5 |
| 7 | Surto Psíquico | ativa | Gasta 1 Dado de Vida pra tratar 1, 2 ou 3 como 4 nos Dados de Energia | E5 |
| 18 | Reservas Psiônicas | passiva | Na Iniciativa, recupera Dados de Energia até ter 4 | E5 |
| 19 | Dádiva Épica | escolha | Reuso do motor de Dádiva Épica | E2 |
| 20 | Força Vital Incandescente | ativa | 1x/turno, gasta 1-2 Dados de Vida pra rolar Dados de Energia extras (sem consumir) | E5 |

Traços centrais (nível 1): atributo primário INT; DV d6; salvaguardas INT e SAB; 2 perícias (Arcanismo, Intuição, Intimidação, Investigação,
Medicina, Percepção, Persuasão); armas simples; **sem** armadura; equipamento A (Lança, 2 Adagas, Besta Leve, 20 Virotes, Estojo, Mochila de
Explorador de Masmorras, 6 PO) ou B (50 PO). Multiclasse: ganha o DV e os recursos de nível 1; espaços pela regra de multiclasse (soma inteira).

### Disciplinas Psiônicas (11 listadas no PDF; todas escolha do jogador; todas ainda sem código) — E4

Aperfeiçoamento de Precognição · Bio-Retorno · Consciência Expandida · Defesa Psiônica · Insinuação do Id · Língua Diabólica · Mente Aguçada ·
Mente Atenta · Mira Inerrante · Pensamentos Destrutivos · Retaliação Psíquica. (O PDF não diz quantas são; contei 11 na lista alfabética — conferir
se falta uma; o PDF não diz "12".)

### Subclasses (4) — cada uma vira um foco próprio (E6a-E6d), 7 características cada

- **Metamorfo:** 3 Magias do Metamorfo · 3 Armas Orgânicas (Lâmina Óssea / Malho de Carne / Lançador de Vísceras) · 3 Forma Mutável · 6 Ataque Extra ·
  6 Tecelão de Carne · 10 Forma Mutável Melhorada (Epiderme Rochosa / Passos Superiores / Flexibilidade Antinatural) · 14 Armas que Distorcem a Vida.
- **Dobrador Psíquico:** 3 Magias do Dobrador Psíquico · 3 Teletransporte · 3 Propulsão Distorcida · 6 Distorcer Espaço · 6 Combate Teleportador ·
  10 Alvo Duplicado · 14 Teletransporte em Massa.
- **Psicinético:** 3 Magias do Psicinético · 3 Técnicas Telecinéticas · 3 Telecinese Poderoso · 6 Transe Destrutivo · 6 Campo de Rebatimento ·
  10 Esmagamento Telecinético Aprimorado · 14 Telecinese Intensificada.
- **Telepata:** 3 Magias do Telepata · 3 Infiltrador Mental · 3 Distração Telepática · 6 Mente Fortificada · 6 Pensamentos Potentes ·
  10 Fortalecimento Telepático · 14 Mentes Embaralhadas.

### Magias

- **17 magias novas do UA** (texto completo no PDF, p.16-20): Arremesso Telecinético (truque), Sifão Vital (1º), Chicote do Ego e Chicote Mental de Tasha e
  Rastro Ectoplásmico (2º), Convocar Entidade Astral (com bloco de estatísticas "Espírito Psiônico"), Escuridão Sangrenta, Esmagamento Telecinético e
  Fortaleza Mental e Inimigos por Toda Parte (3º), Campo de Inversão Vital e Lança Psíquica de Raulothim (4º), Explosão Psiônica, Forma de Pensamento e
  Prisão Mental (6º), Horrível Definhar de Abi-Dalzim (8º), Grito Psíquico (9º).
- **Lista de magias da classe** (p.8-11): ~165 entradas por círculo, quase todas já no catálogo oficial (a conferir uma a uma na E1).
- A planilha tem uma 18ª magia na aba UA Psion, **Animar Mortos**, que **não** aparece no PDF (divergência — ver abaixo).

### Talentos Selvagens (10) — E7

Atmocinese · Biocinese · Clarividência · Criocinese · Empata · Modelador de Carne · Sussurrador Mental · Trapaceiro Psiônico · Psicinético ·
Pirocinese. Já estão na planilha (isolados). Regra do PDF: personagem com origem Nobre ou Sábio pode trocar o talento de origem por um Talento
Selvagem, e qualquer personagem pode escolher um onde normalmente escolheria um talento; só 1 Talento Selvagem por personagem.

## 2. Inconsistências e lacunas da fonte (precisam de decisão do Osmar antes do SDD)

1. **Truques:** o texto diz "mais um truque nos níveis 4 e 10", mas a **tabela** mostra 3 truques já no **nível 3** (2 → 3) e 4 no nível 10.
2. **Nome:** "Impulso Telecinético" (classe) × "Propulsão Telecinética" (subclasse Psicinético) — é a mesma característica.
3. **Armas Orgânicas (Metamorfo):** o texto tem dois parágrafos sobrepostos sobre usar INT e causar dano Psíquico "em vez do tipo normal" — o 2º
   acrescenta o dano Psíquico opcional; assumo que valem os dois juntos.
4. **Unidades:** alguns valores ficaram em pés ("Voo de 20 pés", "telepatia 60 pés") enquanto o resto está em metros; converter pra 6 m e 18 m.
5. **Divergência com a planilha:** Animar Mortos (UA Psion) existe na planilha e não no PDF. O PDF manda: eu sugiro tirar do conjunto UA e
   deixar só a magia oficial.
6. **Magias com nome em inglês no meio do texto:** "Shield", "Telekinetic Crush", "Telekinesis", "Confusion"... — vou mapear pro nome em português do catálogo.
7. **Cor do texto** (parte do PDF vem da UA antiga, em outra cor) não é lida pela extração — conferir no PDF.
8. **Escopo/rótulo:** conteúdo não oficial, então a classe aparece marcada como "UA / não oficial" na tela (mesmo critério do Necromante homebrew).
9. **Lista de Disciplinas:** o PDF não diz quantas são; a lista alfabética tem 11 — conferir se falta alguma.

## 2.1 Decisões do Osmar (2026-10)

1. **Truques:** vale a **tabela** (2 truques nos níveis 1-2, 3 do nível 3 ao 9, 4 do nível 10 em diante), não a frase "níveis 4 e 10" do texto.
2. **Onde ficam os dados:** arquivo próprio marcado como UA/não oficial (fonte primária, como o Necromante homebrew) — não na planilha por enquanto.
3. **Magias UA:** ficam como magias "novas" próprias do Psiônico, mesmo quando repetem uma magia oficial (**inclui Animar Mortos**, como na planilha); revisar quando
   sair o material oficial.
4. **Escopo:** Psiônico entra no app marcado como não oficial (`CLAUDE.md` seção 9).

## 3. Proposta de quebra em entregas (cada uma testável sozinha)

- **E1 — dado no banco, sem mudar nada visível:** classe Psiônico (progressão 1-20 com as colunas da tabela, texto das características), as 17 magias novas
  e a lista de magias da classe, em arquivo próprio marcado como UA (como o Necromante homebrew — fonte primária; opcionalmente o Osmar copia pra planilha depois).
- **E2 — Psiônico existe no app:** criação de personagem, Level Up, multiclasse (conjurador completo, INT), truques/preparadas/espaços, ASI e Dádiva Épica;
  entra no Char Multiclasse nível 20 (a ficha lê todas as classes, ver `DECISOES-CLASSES.md`).
- **E3 — Dados de Energia Psiônica + Poder Psiônico:** recurso com contador (reuso de `core/recursosVisiveis.ts`), Impulso Telecinético, Conexão Telepática,
  Telecinese Sutil.
- **E4 — Disciplinas Psiônicas:** escolha (2 + 1 em 5/10/13/17, troca por nível) e a mecânica de cada uma (reuso do padrão de "efeito opcional" do Monge).
- **E5 — Restauração, Surto, Reservas e Força Vital Incandescente.**
- **E6a-d — uma subclasse por foco** (Metamorfo, Dobrador Psíquico, Psicinético, Telepata), cada uma com arquivo `aprendizados/classes/psionico-<subclasse>.md`.
- **E7 — Talentos Selvagens** na escolha de talentos/origem.

## 4. Texto literal da fonte

> Transcrição direta da extração do PDF (sem resumo, só sem as legendas de imagens e rodapés de tradução). Marcas `===== p.N =====` = página do PDF.

### 4.1 Classe (p.3-8)

```text
O que é um psiônico? O que é um psiônico? 
Psiônicos são conjuradores que usam poderes mentais
inatos para obter habilidades extraordinárias e liberar a
magia da mente. Psiônicos e sua magia (às vezes chamada
de “psionismo”) remontam ao apêndice do   Player’s
Handbook   da primeira edição, e uma classe que usa
psionismo apareceu pela primeira vez em   The Complete
Psionics Handbook   de 1991. 
O psionismo já assumiu diversas formas em D&D, desde
sistemas de magia alternativos até opções que se integram
com outras regras de D&D. Na quinta edição, o poder
psíquico é sinônimo de magia, e a magia da mente
influencia várias magias, monstros e subclasses — como o
Guerreiro Psi ( Psi Warrior ) e o Feiticeiro Aberrante ( Aberrant
Sorcerer ) no   Player’s Handbook . 
Nesta edição, o psiônico é um conjurador que interage
com a magia e com o ato de conjurar de forma semelhante a
outras classes do jogo. Este   Unearthed Arcana   apresenta o
psiônico com mecânicas únicas para conjuração, utilizando 
Dados de Energia Psíquica (Psionic Energy Dice)   e o recurso 
Conjuração Psiônica (Psionic Spellcasting) , criando um espaço
próprio para essa classe se destacar entre seus pares
conjuradores. 
Traços Centrais do Psiônico Traços Centrais do Psiônico 
Atributo Primário   Inteligência 
Dado de Vida   d6 por nível de psiônico 
Testes de
Resistência 
Inteligência e Sabedoria 
Perícias   Escolha 2: Arcanismo, Intuição,
Intimidação, Investigação, Medicina,
Percepção, Persuasão 
Armas   Armas simples 
Treinamento com
Armaduras 
Nenhum 
Equipamento
Inicial 
Escolha A ou B: A) Lança, 2 adagas, besta
leve, 20 virotes, estojo, mochila de
explorador de masmorras, e 6 PO B) 50 PO 
Tornando-se um Psiônico… 
Se você começar no 1 º   nível: 
Você adquire todos os traços listados na tabela 
Traços Centrais do Psiônico . 
Você adquire os recursos de nível 1 do psiônico,
descritos na tabela   Recursos de Classe do Psiônico . 
Se você ingressar via multiclasse: 
Você adquire o Dado de Vida da tabela   Traços
Centrais do Psiônico . 
Você adquire os recursos de nível 1 do psiônico,
listados na tabela   Recursos de Classe do Psiônico .
Consulte as regras de multiclasse no   Player’s
Handbook   para determinar seus espaços de magia
disponíveis, somando seus níveis de psiônico com os
das outras classes conjuradoras. 
Recursos de Classe do Psiônico 
Como psiônico, você adquire os seguintes recursos de
classe ao atingir os níveis indicados. Esses recursos
estão listados na tabela   Recursos de Classe do
Psiônico . 
Nível 1: Conjuração
(Spellcasting) 
Você aprendeu a canalizar energia mágica usando o
poder da sua mente. Veja o   Livro do Jogador   para as
regras sobre conjuração. As informações abaixo
explicam como aplicar essas regras às magias do
psiônico, que aparecem na lista de magias do psiônico
mais adiante nesta descrição de classe. 
Truques (Cantrips).   Você conhece dois truques de
psiônico ( Psion cantrips ) à sua escolha.   Ilusão Menor
(Minor Illusion)   e   Arremesso Telecinético (Telekinetic
Fling)   são recomendados. 
Sempre que você ganhar um nível de psiônico, pode
substituir um dos truques aprendidos por este recurso
por outro truque de psiônico à sua escolha. 
Ao atingir os níveis 4 e 10, você aprende mais um
truque de psiônico, conforme indicado na coluna de
Truques da tabela de Recursos do Psiônico. 
Espaços de Magia (Spell Slots).   A tabela de Recursos
do Psiônico mostra quantos espaços de magia você
possui para conjurar suas magias de 1 º   nível ou
superior. Você recupera todos os espaços de magia
gastos ao terminar um Descanso Longo. 
Magias Preparadas de 1 º   Nível ou Superior
(Prepared Spells of Level 1+).   Você prepara a lista de
magias de 1 º   nível ou superior disponíveis para conjurar
com este recurso. Para começar, escolha quatro magias
de 1 º   nível de psiônico.   Enfeitiçar Pessoa (Charm
Person) ,   Comando (Command) ,   Sussurros Dissonantes
(Dissonant Whispers)   e   Armadura Arcana (Mage
Armor)   são recomendadas. 
O número de magias na sua lista aumenta conforme
você sobe de nível de psiônico, como mostrado na
coluna de Magias Preparadas da tabela de Recursos do
Psiônico. Sempre que esse número aumentar, escolha
mais magias de psiônico até atingir o novo total. As
magias escolhidas devem ser de um nível para o qual
você possua espaços de magia. 
Por exemplo, se você for um psiônico de 3 º   nível, sua
lista de magias preparadas pode incluir até seis magias
de psiônico de 1 º   e 2 º   níveis, em qualquer combinação. 
Se outro recurso de psiônico conceder magias
sempre preparadas, essas magias   não contam   contra o
seu número de magias preparadas por este recurso,
mas   ainda contam   como magias de psiônico para você. 
Alterar Suas Magias Preparadas (Changing Your
Prepared Spells).   Sempre que você subir de nível como
psiônico, pode substituir uma das magias da sua lista
por outra magia de psiônico de um nível que você possa
conjurar. 
===== p.5 =====
Atributo de Conjuração (Spellcasting Ability). 
Inteligência é seu atributo de conjuração para as magias
de psiônico. 
Conjuração Psiônica (Psionic Spellcasting).   Quando
você conjura uma magia de psiônico, essa magia   não
exige componentes Verbais nem Materiais , mesmo que
a entrada de “Componentes” da magia inclua “V” ou
“M” — com exceção de componentes materiais que
sejam consumidos pela magia ou que tenham um custo
especificado. 
Tabela de Recursos do Psiônico Tabela de Recursos do Psiônico 
Nível 
Bônus de
Proficiência   Recursos de Classe 
Dado de
Energia 
N º   de
Dados   Truques 
Magias
Preparadas 
— Espaços de Magia por Círculo— 
1st   2nd   3rd   4th   5th   6th   7th   8th   9th 
1   +2   Conjuração, Poder
Psiônico, Telecinese Sutil
( Spellcasting, Psionic
Power, Subtle Telekinesis ) 
d6   4   2   4   2   —   —   —   —   —   —   —   — 
2   +2   Disciplina Psiônica
( Psionic Discipline ) 
d6   4   2   5   3   —   —   —   —   —   —   —   — 
3   +2   Subclasse de Psiônico
( Psion Subclass ) 
d6   4   3   6   4   2   —   —   —   —   —   —   — 
4   +2   Melhoria no Valor de
Atributo ( Ability Score
Improvement ) 
d6   4   3   7   4   3   —   —   —   —   —   —   — 
5   +3   Restauração Psiônica,
Disciplina Psiônica
( Psionic Restoration , 
Psionic Discipline ) 
d8   6   3   9   4   3   2   —   —   —   —   —   — 
6   +3   Recurso de Subclasse
( Subclass Feature ) 
d8   6   3   10   4   3   3   —   —   —   —   —   — 
7   +3   Surto Psiônico ( Psionic
Surge ) 
d8   6   3   11   4   3   3   1   —   —   —   —   — 
8   +3   Melhoria no Valor de
Atributo 
d8   6   3   12   4   3   3   2   —   —   —   —   — 
9   +4   —   d8   8   3   14   4   3   3   3   1   —   —   —   — 
10   +4   Disciplina Psiônica,
Recurso de Subclasse 
d8   8   4   15   4   3   3   3   2   —   —   —   — 
11   +4   —   d10   8   4   16   4   3   3   3   2   1   —   —   — 
12   +4   Melhoria no Valor de
Atributo 
d10   8   4   16   4   3   3   3   2   1   —   —   — 
13   +5   Disciplina Psiônica   d10   10   4   17   4   3   3   3   2   1   1   —   — 
14   +5   Recurso de Subclasse   d10   10   4   17   4   3   3   3   2   1   1   —   — 
15   +5   —   d10   10   4   18   4   3   3   3   2   1   1   1   — 
16   +5   Melhoria no Valor de
Atributo 
d10   10   4   18   4   3   3   3   2   1   1   1   — 
17   +6   Disciplina Psiônica   d12   12   4   19   4   3   3   3   2   1   1   1   1 
18   +6   Reserva Psiônica ( Psionic
Reserves ) 
d12   12   4   20   4   3   3   3   3   1   1   1   1 
19   +6   Dádiva Épica ( Epic Boon )   d12   12   4   21   4   3   3   3   3   2   1   1   1 
20   +6   Força Vital Incandescente
( Enkindled Lifeforce ) 
d12   12   4   22   4   3   3   3   3   2   2   1   1 
===== p.6 =====
Nível 1: Poder Psiônico (Psionic Power) 
Você abriga uma fonte profunda de energia psíquica
dentro de si. Essa energia é representada pelos seus
Dados de Energia Psiônica ( Psionic Energy Dice ). Seu
nível de psiônico determina o tamanho e a quantidade
desses dados, como indicado nas colunas Dado de
Energia e N º   de Dados da tabela de Recursos do
Psiônico. 
Seus Dados de Energia Psiônica são usados para
aprimorar ou abastecer certos recursos do psiônico.
Você começa com dois desses recursos:   Impulso
Telecinético (Telekinetic Propel)   e   Conexão Telepática
(Telepathic Connection) , descritos abaixo. Alguns de
seus poderes consomem os Dados de Energia Psiônica,
conforme especificado na descrição do recurso, e você 
não pode usá-lo se ele exigir o gasto de dado e você não
tiver nenhum disponível . 
Você recupera um dado gasto ao finalizar um
Descanso Curto, e   recupera todos   ao terminar um
Descanso Longo. 
Alguns recursos que usam Dados de Energia
Psiônica exigem que o alvo faça um teste de resistência.
A CD desses testes é igual à CD de Magia determinada
pela característica Conjuração (Spellcasting) da classe. 
Impulso Telecinético (Telekinetic Propel).   Como uma
Ação Bônus, escolha uma criatura Grande ou menor
que você possa ver a até 9 metros. O alvo deve passar
em um teste de resistência de Força ou será empurrado
(ou puxado — à sua escolha) para uma direção reta a
uma distância igual a 1,5 metros. Alternativamente,
você pode rolar um Dado de Energia Psiônica ao
realizar esta Ação Bônus, e a distância percorrida é
igual a 5 vezes o número rolado. O dado só é gasto   se o
alvo falhar   na resistência. 
Conexão Telepática (Telepathic Connection).   Você
possui telepatia com alcance de 9 metros. Como uma
Ação Bônus, você pode gastar um Dado de Energia
Psiônica. Pela próxima hora, o alcance da sua telepatia
aumenta em metros igual a   3 vezes   o número rolado.
Na primeira vez que você usar esta Ação Bônus após
cada Descanso Longo, você não gasta o Dado de
Energia Psiônica. Em todas as outras vezes que usar
esta habilidade, você gasta o dado. 
Nível 1: Telecinese Sutil (Subtle
Telekinesis) 
Você conhece o truque   Mão Mágica (Mage Hand) . Você
pode conjurá-lo   sem componentes somáticos , e pode 
tornar a mão espectral invisível   ao conjurá-la. 
Nível 2: Disciplina Psiônica (Psionic
Discipline) 
Você aprende técnicas psíquicas adicionais alimentadas
pelos seus Dados de Energia Psiônica. Você adquire 
duas disciplinas   à sua escolha, como   Consciência
Expandida (Expanded Awareness)   e   Insinuação do Id
(Id Insinuation) . As disciplinas estão descritas na seção 
Opções de Disciplina Psiônica (Psionic Discipline
Options)   mais adiante nesta descrição de classe. 
Você pode usar apenas   uma disciplina por turno , e
apenas   uma vez por turno , a menos que a descrição
diga o contrário. 
Sempre que você subir de nível como psiônico, pode
substituir uma disciplina conhecida por outra. Você
aprende   uma opção adicional   no nível 5, 10, 13 e 17. 
===== p.7 =====
Nível 3: Subclasse do Psiônico (Psion
Subclass) 
Você adquire uma subclasse de psiônico à sua escolha.
As subclasses   Metamorfo (Metamorph) , 
Dobrador Psíquico (Psi Warper) ,   Psicinético
(Psykinetic)   e   Telepata (Telepath)   estão descritas após
esta seção da classe. Uma subclasse é uma
especialização que concede recursos em certos níveis
de psiônico. A partir de agora, você adquire os recursos
da sua subclasse que corresponderem ao seu nível de
psiônico ou inferiores. 
Nível 4: Melhoria no Valor de Atributo
(Ability Score Improvement) 
Você adquire o feito   Melhoria no Valor de Atributo
(Ability Score Improvement)   ou outro feito de sua
escolha para o qual atenda aos pré-requisitos. Você
adquire este recurso novamente nos níveis 8, 12 e 16 de
psiônico. 
Nível 5: Restauração Psíquica (Psionic
Restoration) 
Você pode realizar uma meditação que concentra a
mente por 1 minuto. Ao final dela, você recupera os
Dados de Energia Psiônica gastos. Após usar essa
habilidade, você não poderá usá-la novamente até
concluir um Descanso Longo. 
Nível 7: Surto Psíquico (Psionic Surge) 
Além disso, após rolar um ou mais Dados de Energia
Psíquica, você pode gastar um de seus Dados de Vida
para tratar qualquer resultado de 1, 2 ou 3 nesses dados
como se fosse 4. 
Nível 18: Reservas Psiônicas (Psionic
Reserves) 
Ao rolar a Iniciativa, você recupera os usos gastos de
Dados de Energia Psiônica até ter quatro, caso tenha
menos que isso. 
Nível 19: Dádiva   E pica (Epic Boon) 
Você adquire um feito de   Dádiva Épica (Epic Boon)   ou
outro feito de sua escolha para o qual atenda aos pré-
requisitos.   Dádiva da Resistência a Energia (Boon of
Energy Resistance)   é recomendada. 
Nível 20: Força Vital Incandescente
(Enkindled Lifeforce) 
Você queima sua força vital para alcançar poderes
psíquicos superiores. Uma vez por turno, ao rolar um ou
mais Dados de Energia Psiônica para uma habilidade
Psion ou Disciplina Psiônica, você pode gastar um ou
dois de seus Dados de Pontos de Vida. Para cada Dado
de Pontos de Vida gasto, role um Dado de Energia
Psiônica adicional e some os números rolados ao total.
Essa rolagem não consome o Dado de Energia
Psiônica. 
Opções de Disciplina Psiônica
(Psionic Discipline Options) 
As opções de Disciplina Psiônica estão listadas em
ordem alfabética. 
Aperfeiçoamento de Precognição
(Bolstering Precognition) 
Ao conjurar uma magia Psiônica da escola de
Abjuração ou Adivinhação, você pode gastar um Dado
de Energia Psiônica. Role o dado e escolha uma
criatura que você possa ver a até 18 metros (que pode
ser você mesmo). Até o final do seu próximo turno, a
criatura recebe um bônus no próximo Teste de D20 que
fizer, igual ao número rolado. 
Bio-Retorno (Biofeedback) 
Ao conjurar uma magia Psiônica da escola de
Necromancia ou Transmutação, você pode gastar um
número de Dados de Energia Psiônica igual ao seu
modificador de Inteligência, rolar os dados e ganhar um
número de Pontos de Vida Temporários igual ao total
dos dados rolados mais o seu modificador de
Inteligência (mínimo de um). 
Consciência Expandida (Expanded
Awareness) 
Ao realizar a ação de Procurar, você pode gastar um
Dado de Energia Psíquica, rolá-lo e adicionar o
resultado à sua jogada de habilidade. Se isso resultar
em sucesso no teste de habilidade, o dado é gasto. 
Defesa Psiônica (Psionic Guards) 
No início do seu turno, você pode gastar um Dado de
Energia Psiônica. Até o início do seu próximo turno,
você tem   Imunidade   às condições Amedrontado e
Enfeitiçado, e   Vantagem   em testes de resistência de
Inteligência. 
Se estiver sob uma dessas condições ao ativar essa
disciplina, ela termina. Você ainda pode usar outra
Disciplina Psiônica neste turno. 
Insinuação do Id (Id Insinuation) 
Ao conjurar uma magia de psiônico das escolas de
Encantamento ou Ilusão que exige um teste de
resistência, você pode gastar um Dado de Energia
Psiônica. Você rola um dado de Energia Psíquica e um
dos alvos da magia que você possa ver subtrai o total do
dado rolado do teste de resistência. 
Língua Diabólica (Devilish Tongue) 
Ao realizar a ação de Influenciar, você pode gastar um
Dado de Energia Psíquica, rolá-lo e adicionar o
resultado à sua jogada de habilidade. Se isso resultar
em sucesso no teste de habilidade, o dado é gasto. 
Mente Aguçada (Sharpened Mind) 
No início do seu turno, você pode gastar um Dado de
Energia Psiônica para aprimorar seus poderes
psíquicos destrutivos. Role o dado e anote o número 
===== p.8 =====
obtido. Você recebe os seguintes benefícios por 1
minuto ou até ficar Incapacitado. 
Ignorando Psiônicos.   O dano de seus ataques com
armas, magias Psiônicas e habilidades Psiônicas ignora
a Resistência a dano Psíquico. 
Modo de Ataque.   Uma vez por turno, quando você
causar dano Psíquico a uma ou mais criaturas, você
pode substituir o número obtido em um dos dados de
dano pelo número anotado quando você ativou esta
Disciplina Psiônica. 
Ao usar Mente Aguçada, você também pode usar uma
Disciplina Psiônica diferente neste turno. 
Mente Atenta (Observant Mind) 
Ao realizar a ação de Estudar, você pode gastar um
Dado de Energia Psíquica, rolá-lo e adicionar o
resultado à jogada de habilidade. Se isso resultar em
sucesso no teste de habilidade, o dado é gasto. 
Mira Inerrante (Inerrant Aim) 
Quando errar um ataque, você pode gastar um Dado de
Energia Psíquica e adicioná-lo à jogada de ataque. Se
isso fizer o ataque acertar, o dado é gasto. 
Pensamentos Destrutivos (Destructive
Thoughts) 
Ao conjurar uma magia Psiônica da escola de
Conjuração ou Evocação que force uma criatura que
você possa ver a fazer um teste de resistência contra a
magia, você pode gastar um número de Dados de
Energia Psiônica igual ao seu modificador de
Inteligência e rolá-los. A criatura sofre dano Psíquico
igual ao total dos dados rolados mais o seu modificador
de Inteligência (mínimo de um), independentemente do
resultado do teste de resistência. 
Retaliação Psíquica (Psionic Backlash) 
Imediatamente após uma criatura que você possa ver
realizar um ataque contra você, você pode usar uma
Reação para gastar um Dado de Energia Psiônica, rolar
o dado e reduzir o dano recebido do ataque em um valor
igual a duas vezes o número rolado mais o seu
modificador de Inteligência (mínimo de dois). Além
disso, você pode forçar o atacante a fazer um teste de
resistência de Sabedoria. Em caso de falha, o alvo sofre
dano Psíquico igual ao dano que você reduziu. 
```

### 4.2 Lista de magias do Psiônico (p.8-11)

```text
Lista de Magias do Psiônico 
As magias a seguir fazem parte da lista de magias do
psiônico. Elas estão organizadas por nível de magia e,
dentro de cada nível, em ordem alfabética. A escola de
magia de cada magia está indicada, assim como
características especiais: 
C   = requer Concentração; 
R   = é um Ritual 
M   = exige um Componente Material específico 
Feitiços marcados com * aparecem neste documento. 
Truques (Magias de Nível 0) Truques (Magias de Nível 0) 
Magia   Escola   Especial 
Amizade (Friends)   Encantamento   C 
Arremesso Telecinético (Telekinetic
Fling)* 
Evocação   — 
Golpe Certeiro (True Strike)   Adivinhação   — 
Ilusão Menor (Minor Illusion)   Ilusão   — 
Luz (Light)   Evocação   — 
Luzes Dançantes (Dancing Lights)   Ilusão   C 
Mãos Mágicas (Mage Hand)   Conjuração   — 
Mensagem (Message)   Transmutação   — 
Prestidigitação (Prestidigitation)   Transmutação   — 
Proteção Contra Lâminas (Blade
Ward) 
Abjuração   C 
Reparar (Mending)   Transmutação   — 
Talho Mental (Mind Sliver)   Encantamento   — 
Magias de 1 º   Nível Magias de 1 º   Nível 
Magia   Escola   Especial 
Amizade Animal (Animal
Friendship) 
Encantamento   — 
Armadura Arcana (Mage Armor)   Abjuração   — 
Comando (Command)   Encantamento   — 
Compreender Idiomas
(Comprehend Languages) 
Adivinhação   R 
Detectar Magia (Detect Magic)   Adivinhação   C, R 
Disco Flutuante de Tenser (Tenser’s
Floating Disk) 
Conjuração   R 
Enfeitiçar Pessoa (Charm Person)   Encantamento   — 
Escudo (Shield)   Abjuração   — 
Falar com Animais (Speak with
Animals) 
Adivinhação   R 
Gargalhada Nefasta de Tasha
(Tasha’s Hideous Laughter) 
Encantamento   C 
Identificar (Identify)   Adivinhação   R, M 
Imagem Silenciosa (Silent Image)   Ilusão   C 
Onda Trovejante (Thunderwave)   Evocação   C 
Passos Largos (Longstrider)   Transmutação   — 
Queda Suave (Feather Fall)   Transmutação   — 
Salto (Jump)   Transmutação   — 
Santuário (Sanctuary)   Abjuração   — 
Sifão de Vida (Life Syphoon)*   Evocação   — 
Sono (Sleep)   Encantamento   — 
Sussurros Dissonantes   Encantamento   — 
===== p.9 =====
Magias de 2 º   Nível Magias de 2 º   Nível 
Magia   Escola   Especial 
Acalmar Emoções (Calm Emotions)   Encantamento   C 
Aprimorar Atributo (Enhance Ability)   Transmutação   C 
Arrombar (Knock)   Transmutação   — 
Aumentar/Reduzir (Enlarge/Reduce)   Transmutação   C 
Boca Mágica (Magic Mouth)   Ilusão   R, M 
Mensageiro Animal (Animal
Messenger) 
Encantamento   R 
Cativar (Enthrall)   Encantamento   C 
Cegueira/Surdez
(Blindness/Deafness) 
Transmutação   — 
Chicote Mental de Tasha (Tasha’s
Mind Whip)* 
Encantamento   — 
Chicote do Ego (Ego Whip)*   Encantamento   — 
Coroa da Loucura (Crown of
Madness) 
Encantamento   C 
Despedaçar (Shatter)   Evocação   — 
Detectar Pensamentos (Detect
Thoughts) 
Adivinhação   C 
Espinho Mental (Mind Spike)   Adivinhação   C 
Esquentar Metal (Heat Metal)   Transmutação   C 
Força Espectral (Phantasmal Force)   Ilusão   C 
Invisibilidade (Invisibility)   Ilusão   C 
Levitar (Levitate)   Transmutação   R 
Localizar Animais ou Plantas
(Locate Animals or Plants) 
Adivinhação   R 
Localizar Objeto (Locate Object)   Adivinhação   C 
Paralisar Pessoa (Hold Person)   Encantamento   C 
Rastro Ectoplasmático (Ectoplasmic
Trail)* 
Necromancia   — 
Reflexos (Mirror Image)   Ilusão   — 
Silêncio (Silence)   Ilusão   C, R 
Sugestão (Suggestion)   Encantamento   C 
Ver o Invisível (See Invisibility)   Adivinhação   — 
Zona da Verdade (Zone of Truth)   Encantamento   — 
Magias de 3 º   Nível Magias de 3 º   Nível 
Magia   Escola   Especial 
Clarividência (Clairvoyance)   Adivinhação   C, M 
Dissipar Magia (Dispel Magic)   Abjuração   — 
Esmagamento Telecinético
(Telekinetic Crush)* 
Transmutação   — 
Escuridão Sangrenta (Bleeding
Darkness)* 
Encantamento   C, M 
Fortaleza Mental (Intellect
Fortress)* 
Abjuração   C 
Imagem Maior (Major Image)   Ilusão   C 
Indetectável (Nondetection)   Abjuração   M 
Infestado de Inimigos (Enemies
Abound)* 
Encantamento   C 
Invocar Entidade Astral (Summon
Astral Entity)* 
Conjuração   C, M 
Línguas (Tongues)   Adivinhação   — 
Medo (Fear)   Ilusão   C 
Padrão Hipnótico (Hypnotic
Pattern) 
Ilusão   C 
Remeter (Sending)   Adivinhação   — 
Rogar Maldição (Bestow Curse)   Necromancia   C 
Voo (Fly)   Transmutação   C 
Magias de 4 º   Nível Magias de 4 º   Nível 
Magia   Escola   Especial 
Assassino Fantasmagórico
(Phantasmal Killer) 
Ilusão   C 
Banimento (Banishment)   Abjuração   C 
Campo de Inversão da Vital*   Abjuração   C 
Compulsão (Compulsion)   Encantamento   C 
Confusão (Confusion)   Encantamento   C 
Enfeitiçar Monstro (Charm
Monster) 
Encantamento   — 
Invisibilidade Maior (Greater
Invisibility) 
Ilusão   C 
Invocar Aberração (Summon
Aberration) 
Conjuração   C, M 
Lança Psíquica de Raulothim*   Encantamento   — 
Localizar Criatura (Locate Creature)   Adivinhação   C 
Metamorfose (Polymorph)   Transmutação   C 
Movimentação Livre (Freedom of
Movement) 
Abjuração   — 
Olho Arcano (Arcane Eye)   Adivinhação   C 
Porta Dimensional (Dimension
Door) 
Conjuração   — 
Terreno Alucinatório (Hallucinatory
Terrain) 
Ilusão   — 
===== p.10 =====
Magias de 5 º   Nível Magias de 5 º   Nível 
Magia   Escola   Especial 
Animar Objetos (Animate Objects)   Transmutação   C 
Círculo de Teleporte (Teleportation
Circle) 
Conjuração   M 
Contato Extraplanar (Contact Other
Plane) 
Adivinhação   R 
Despertar (Awaken)   Transmutação   M 
Despistar (Mislead)   Ilusão   C 
Dominar Pessoa (Dominate Person)   Encantamento   C 
Estática Sináptica (Synaptic Static)   Encantamento   — 
Lendas e Histórias (Legend Lore)   Adivinhação   M 
Ligação Telepática de Rary (Rary’s
Telepathic Bond) 
Adivinhação   R 
Missão (Geas)   Encantamento   — 
Modificar Memória (Modify
Memory) 
Encantamento   C 
Paralisar Monstro (Hold Monster)   Encantamento   C 
Similaridade (Seeming)   Ilusão   — 
Sonho (Dream)   Ilusão   — 
Telecinese (Telekinesis)   Transmutação   C 
Vidência (Scrying)   Adivinhação   C, M 
Magias de 6 º   Nível Magias de 6 º   Nível 
Magia   Escola   Especial 
Barreira de Lâminas (Blade Barrier)   Evocação   C 
Dança Irresistível de Otto (Otto’s
Irresistible Dance) 
Encantamento   C 
Desintegrar (Disintegrate)   Transmutação   — 
Encontrar o Caminho (Find the
Path) 
Adivinhação   C, M 
Explosão Psiônica (Psionic Blast)*   Evocação   — 
Forma de Pensamento (Thought
Form)* 
Transmutação   C, M 
Ilusão Programada (Programmed
Illusion) 
Ilusão   M 
Mau Olhado (Eyebite)   Necromancia   C 
Mover Terra (Move Earth)   Transmutação   C 
Prisão Mental (Mental Prison)*   Encantamento   — 
Sugestão em Massa (Mass Suggestion)   Encantamento   — 
Visão da Verdade (True Seeing)   Adivinhação   M 
Magias de 7 º   Nível Magias de 7 º   Nível 
Magia   Escola   Especial 
Cárcere de Energia (Forcecage)   Evocação   C, M 
Forma Etérea (Etherealness)   Conjuração   — 
Inverter Gravidade (Reverse Gravity)   Transmutação   C 
Miragem Arcana (Mirage Arcane)   Ilusão   — 
Palavra de Poder: Fortificar (Power
Word Fortify) 
Encantamento   — 
Projetar Imagem (Project Image)   Ilusão   C, M 
Transição Planar (Plane Shift)   Conjuração   M 
Teleporte (Teleport)   Conjuração   — 
Magias de 8 º   Nível Magias de 8 º   Nível 
Magia   Escola   Especial 
Antipatia/Simpatia
(Antipathy/Sympathy) 
Encantamento   — 
Campo Antimagia (Antimagic Field)   Abjuração   C 
Definhar Horrível de Abi-Dalzim
(Abi-Dalzim’s Horrid Wilting)* 
Necromancia   — 
Dominar Monstro (Dominate
Monster) 
Encantamento   C 
Labirinto (Maze)   Conjuração   C 
Limpar a Mente (Mind Blank)   Abjuração   — 
Loquacidade (Befuddlement)   Encantamento   — 
Palavra de Poder: Atordoar (Power
Word Stun) 
Encantamento   — 
Suplício (Glibness)   Encantamento   — 
Telepatia (Telepathy)   Adivinhação   — 
===== p.11 =====
Magias de 9 º   Nível Magias de 9 º   Nível 
Magia   Escola   Especial 
Encarnação Fantasmagórica (Weird)   Ilusão   C 
Grito Psíquico (Psychic Scream)*   Encantamento   — 
Metamorfose (Shapechange)   Transmutação   C, M 
Palavra de Poder: Curar (Power
Word Heal) 
Encantamento   — 
Palavra de Poder: Matar (Power
Word Kill) 
Encantamento   — 
Parar o Tempo (Time Stop)   Transmutação   — 
Projeção Astral (Astral Projection)   Necromancia   M 
Sexto Sentido (Foresight)   Adivinhação   — 
```

### 4.3 Subclasses (p.11-15)

```text
Subclasses do Psiônico 
Uma subclasse de psiônico é uma especialização que
concede recursos em certos níveis da classe, conforme
especificado na subclasse. Esta seção apresenta as
subclasses   Metamorfo (Metamorph) ,   Dobrador
Psíquico (Psi Warper) ,   Psicinético (Psykinetic)   e 
Telepata (Telepath) . 
Metamorfo 
Esculpe Psiquicamente Carne e Vida (Psychically
Sculpt Life and Flesh) 
Seu domínio dos poderes psíquicos se volta para
dentro. Sua própria carne se torna como argila em suas
mãos, moldando-a como um vaso perfeito para seu
poder interior. 
Sua experiência em manipular energia vital também
permite que você ajuste a força vital de aliados e
inimigos. 
Nível 3: Magias do Metamorfo
(Metamorph Spells) 
Quando você alcança um nível de psiônico conforme
indicado na tabela a seguir, você passa a ter sempre as
magias listadas preparadas. 
Nível de
Psiônico   Magias Preparadas 
3   Alterar-se (Alter Self ), Curar Ferimentos (Cure
Wounds), Inflingir Ferimentos (Inflict Wounds),
Restauração Menor (Lesser Restoration) 
5   Aura de Vitalidade (Aura of Vitality), Celeridade
(Haste) 
7   Polimorfia (Polymorph), Pele-Rocha (Stoneskin) 
9   Contágio (Contagion), Curar Ferimentos em Massa
(Mass Cure Wounds) 
Nível 3: Armas Orgânicas (Organic
Weapons) 
Você pode moldar seus próprios membros em armas.
Como uma   Ação Mágica , você pode transformar sua
mão livre em uma das seguintes armas orgânicas: 
Lâmina Óssea ,   Maça de Carne   ou   Lançador de
Vísceras . 
Quando você realiza a   ação de Ataque , pode usar esta
característica antes de fazer a rolagem de ataque. Seu
membro mantém a forma da arma orgânica até que
você use uma   Ação Mágica   para transformá-lo em outra
arma orgânica, fique   Inconsciente , ou retorne o
membro à sua forma original ( sem exigir ação ). 
Sempre que atacar com essa arma, você pode usar
seu   modificador de Inteligência   para as jogadas de
ataque e dano, em vez de usar Força ou Destreza. 
Ao atacar com uma dessas armas, você pode usar seu
modificador de Inteligência nas jogadas de ataque e
dano (em vez de Força ou Destreza), e pode causar
dano Psíquico em vez do tipo normal da arma. 
Lâmina Óssea (Bone Blade).   Uma lâmina feita de
osso brota de seu antebraço ou mão. Ela conta como
arma corpo a corpo simples com a propriedade Finesse,
e causa 1d8 de dano Perfurante. Você tem   Vantagem 
nessa jogada de ataque se um aliado estiver a até 1,5
metro do inimigo e se seu aliado   não estiver
Incapacitado . 
Malho de Carne (Flesh Maul).   Seu punho e antebraço
se tornam uma massa endurecida de carne e osso.
Conta como um maul (marreta) simples e causa 1d10
de dano Concussivo. Uma criatura atingida pelo malho
tem   Desvantagem no próximo teste de resistência de
Força ou Constituição   que fizer até o início do próximo
turno. 
Lançador de Vísceras (Viscera Launcher).   Seu braço
se transforma em uma besta feita de músculos e
tendões que lança projéteis de bile. Conta como arma
simples à distância com alcance curto de 9 metros e
longo de 27 metros, causando 1d6 de dano Ácido. Uma
vez por turno, quando atingir uma criatura com o
lançador, você pode causar   1d6 de dano Ácido
adicional . 
===== p.12 =====
Nível 3: Forma Mutável (Mutable Form) 
Como uma Ação Bônus, você pode gastar um Dado de
Energia Psiônica para esticar seus membros
psionicamente por 1 minuto. Role o Dado de Energia
Psiônica gasto e ganhe um número de Pontos de Vida
Temporários igual ao número rolado mais seu
modificador de Inteligência (mínimo de 1 Ponto de Vida
Temporário). Além disso, você ganha os seguintes
benefícios enquanto este recurso estiver ativo. 
Alcance (Reach).   Seu alcance aumenta em 1,5 metro. 
Velocidade (Speed).   Sua velocidade aumenta em 1,5
metro. 
Toque (Touch).   Ao conjurar uma magia com alcance
de Toque e tempo de conjuração de uma Ação, você
pode tratar o alcance como 3 metros. 
Nível 6: Ataque Extra (Extra Attack) 
Você pode atacar duas vezes em vez de uma sempre
que usar a ação de Ataque em seu turno. 
Além disso, você pode conjurar um dos seus truques
de psiônico (que tenha tempo de conjuração de uma
Ação) no lugar de um dos ataques. 
Nível 6: Tecelão de Carne 
Quando você usa   Forma Mutável , pode gastar   um Dado
de Energia Psiônica adicional   para obter os seguintes
benefícios enquanto essa característica estiver ativa. 
Defesa Orgânica.   Você recebe um   bônus de +2 na CA . 
Cura Potencializada.   Quando você conjura uma
magia usando um   espaço de magia   que restaura   Pontos
de Vida   de uma ou mais criaturas, pode gastar   um Dado
de Energia Psíquica , rolá-lo e   somar o valor obtido   à
quantidade de Pontos de Vida recuperados. 
Nível 10: Forma Mutável Melhorada
(Improved Mutable Form) 
Quando você usar Forma Mutável (Mutable Form), a
duração aumenta para 10 minutos, e você escolhe um
dos benefícios abaixo, que permanece até o efeito
terminar: 
Epiderme Rochosa (Stony Epidermis).   Você tem 
Vantagem em testes de resistência de Constituição   para
manter Concentração. Além disso, escolha um tipo de
dano entre: Ácido, Concussivo, Frio, Fogo, Relâmpago,
Perfurante, Veneno, Cortante ou Trovejante. Você
ganha   Resistência   ao tipo escolhido. 
Passos Superiores (Superior Stride).   Enquanto não
estiver vestindo armadura, você pode usar a ação
Correr (Dash) como Ação Bônus, e adquire velocidades
de Escalada e Natação iguais à sua velocidade de
caminhada. 
Flexibilidade Antinatural (Unnatural Flexibility). 
Você recebe   +1 na CA , e seu corpo (juntamente com
seus equipamentos) torna-se flexível. Você pode passar
por espaços com apenas 2,5 cm de largura, e pode
gastar 1,5 metro de movimento para escapar de
contenções não mágicas ou encerrar a condição
Agarrado (Grappled). 
Nível 14: Armas que Distorcem a Vida
(Life-Bending Weapons) 
Sua arma fica envolta em energia negativa e você
irradia energia psíquica restauradora. Quando você
acerta um alvo com uma jogada de ataque usando sua
Arma Orgânica, role um Dado de Energia Psiônica. O
alvo sofre dano Necrótico extra igual ao número rolado.
Essa rolagem não consome o dado. 
Alternativamente, quando você acerta uma criatura
com sua Arma Orgânica, você pode, em vez disso,
gastar um Dado de Energia Psiônica e rolá-lo. O alvo
sofre dano Necrótico extra igual ao resultado da
rolagem, e cada criatura à sua escolha em uma
Emanação de 9 metros originada de você recupera
Pontos de Vida iguais ao número rolado mais seu
modificador de Inteligência. Depois de usar este
recurso, você não poderá usá-lo novamente até o início
do seu próximo turno. 
===== p.13 =====
Dobrador Psíquico (Psi Warper) 
Distorça o Espaço com o Poder da Sua Mente (Warp
Space with the Power of Your Mind) 
Dobradores psíquicos sintonizam seus poderes com a
manipulação do espaço entre os objetos. Capazes de se
teletransportar pelo campo de batalha e criar vácuos no
espaço, um Dobrador Psíquico nunca permanece em
um só lugar por muito tempo. 
Nível 3: Magias do Dobrador Psíquico
(Psi Warper Spells) 
Quando você alcança um nível de psiônico conforme
indicado na tabela abaixo, você passa a ter sempre as
magias listadas preparadas. 
Nível de
Psiônico   Magias Preparadas 
3   Retirada Acelerada (Expeditious Retreat), Queda
Suave (Feather Fall), Passo Nebuloso (Misty Step),
Despedaçar (Shatter) 
5   Piscar (Blink), Celeridade (Haste) 
7   Banimento (Banishment), Porta Dimensional
(Dimension Door) 
9   Golpe do Arço (Steel Wind Strike), Círculo de
Teleporte (Teleportation Circle) 
Nível 3: Teletransporte (Teleportation) 
Você pode conjurar   Passo Nebuloso (Misty Step)   sem
gastar um espaço de magia, e deve terminar um
Descanso Longo para usá-lo novamente dessa forma. 
Você também pode restaurar esse uso ao gastar um
Dado de Energia Psíquica (sem necessidade de ação). 
Nível 3: Propulsão Distorcida (Warp
Propel) 
Quando um alvo falhar no teste de resistência contra
seu   Impulso Telecinético (Telekinetic Propel) , em vez
de empurrá-lo, você pode teletransportar a criatura para
um espaço desocupado à vista a até 9 metros de você, 
horizontalmente . 
Nível 6: Distorcer Espaço (Warp Space) 
Ao conjurar   Despedaçar (Shatter) , você pode gastar um
Dado de Energia Psíquica para modificar a magia,
aumentando o raio da esfera para 6 metros. 
Além disso, criaturas que falharem na resistência
contra a magia são puxadas diretamente para o centro
da esfera, terminando em um espaço desocupado   o
mais próximo possível do centro . 
Nível 6: Combate Teleportador
(Teleporter Combat) 
Imediatamente após conjurar   Passo Nebuloso (Misty
Step) , você pode conjurar um dos seus truques de
psiônico com tempo de conjuração de uma Ação como
parte da Ação Bônus. 
Nível 10: Alvo Duplicado (Duplicitous
Target) 
Quando uma criatura que você vê fizer uma jogada de
ataque contra você, você pode usar sua Reação para
gastar um Dado de Energia Psíquica e escolher uma
criatura voluntária que você veja a até 9 metros de você
e que   não esteja Incapacitada . 
Você e a criatura escolhida   teleportam-se, trocando
de lugar . A criatura teleportada torna-se o novo alvo da
jogada de ataque. 
Nível 14: Teletransporte em Massa (Mass
Teleportation) 
Como Ação, você gasta quatro Dados de Energia
Psíquica e escolhe criaturas Grandes ou menores que
estejam a até 9 metros de você, até um número igual ao
seu modificador de Inteligência (mínimo de 1). 
Cada criatura escolhida é teleportada para um espaço
desocupado que você possa ver   a até 45 metros de
distância . 
Uma criatura que não concordar em ser teleportada
pode fazer um teste de resistência de Sabedoria. Se for
bem-sucedida,   não é afetada . 
===== p.14 =====
Psicinético (Psykinetic) 
Moldar Força Psíquica para Criação e Destruição (Mold
Psionic Force for Creation and Destruction) 
Um psicinético controla seus poderes psíquicos como
uma força maleável. Eles moldam suas energias
telecinéticas em barreiras sólidas e desferem ataques
com a força de um aríete mágico. 
Nível 3: Magias do Psicinético
(Psykinetic Spells) 
Nível de
Psiônico   Magias Preparadas 
3   Nuvem de Adagas (Cloud of Daggers), Levitar
(Levitate), Escudo Arcano (Shield), Onda
Trovejante (Thunderwave) 
5   Lentidão (Slow), Esmagamento Telecinético
(Telekinetic Crush) 
7   Esfera Resiliente de Otiluke (Otiluke’s Resilient
Sphere), Modelar Rochas (Stone Shape) 
9   Telecinese (Telekinesis), Muralha de Força (Wall of
Force) 
Nível 3: Técnicas Telecinéticas
(Telekinetic Techniques) 
Ao usar Propulsão Telecinética, você pode rolar 1d4 e
usar o número rolado em vez de gastar um Dado de
Energia Psiônica. 
Além disso, quando um alvo falha no teste de
resistência contra sua Propulsão Telecinética, você
pode impor um dos seguintes efeitos a esse alvo. 
Impulso (Boost).   Aumenta a velocidade do alvo em 3
metros até o início do seu próximo turno. 
Desorientar (Disorient).   O alvo não pode realizar
Ataques de Oportunidade até o início do próximo
turno. 
Projétil Telecinético (Telekinetic Bolt).   Se o alvo
falhar no teste de resistência, sofre dano de Força
igual ao valor rolado no Dado de Energia Psiônica. 
Nível 3: Telecinese Poderoso (Stronger
Telekinesis) 
Ao conjurar   Mão Mágica , seu alcance aumenta em 9
metros e a mão pode carregar até 9 quilos. 
Nível 6: Transe Destrutivo (Destructive
Trance) 
No início do seu turno, você pode gastar   um Dado de
Energia Psiônica   para entrar em um estado destrutivo.
Pelos próximos   10 minutos , você ganha   Deslocamento
de Voo de 20 pés   e pode   pairar . 
Além disso, sempre que você conjurar uma magia
usando um   espaço de magia , pode rolar   seu Dado de
Energia Psiônica   e   adicionar o valor rolado a uma 
rolagem de dano   dessa magia. Essa rolagem   não
consome   o Dado de Energia Psíquica. 
Nível 6: Campo de Rebatimento
(Rebounding Field) 
Quando você conjura   Shield   em resposta a ser atingido
por uma jogada de ataque e faz com que o ataque
desencadeador   erre , você pode gastar   um Dado de
Energia Psiônica   para lançar a força de volta contra o
atacante. 
O atacante realiza um   teste de resistência de
Destreza . Role   um Dado de Energia Psiônica . 
Em uma falha, o atacante sofre   dano de Força   igual
ao valor rolado   + seu modificador de Inteligência . 
Em um sucesso, o atacante sofre   metade desse dano . 
Independentemente do resultado do teste, você ganha 
Pontos de Vida Temporários   iguais à quantidade de
dano causado. 
Nível 10: Esmagamento Telecinético
Aprimorado (Enhanced Telekinetic
Crush) 
Quando você conjura   Telekinetic Crush , pode gastar   um
Dado de Energia Psiônica   para modificar a magia de
forma que,   quer a criatura falhe ou seja bem-sucedida 
no teste de resistência contra a magia, seu 
Deslocamento seja reduzido à metade   até o início do
seu próximo turno. 
Além disso, você pode rolar o   Dado de Energia
Psíquica gasto   e   adicionar o valor rolado a uma
rolagem de dano   da magia. 
Nível 14: Telecinese Intensificada
(Heightened Telekinesis) 
Você pode conjurar   Telekinesis   sem gastar um espaço
de magia , gastando em vez disso   quatro Dados de
Energia Psiônica . 
Quando conjura   Telekinesis   dessa forma, pode
modificar a magia para que   ela não exija Concentração .
Se fizer isso, a   duração da magia passa a ser 1 minuto 
para essa conjuração, e você pode ter como alvo 
criaturas e objetos Colossais . 
===== p.15 =====
Telepata (Telepath) 
Domine Táticas na Paisagem da Mente (Master Tactics
in the Landscape of the Mind) 
Telepatas são mestres da magia mental. Eles usam
seus poderes para todos os aspectos do intelecto,
fortalecendo a mente de aliados ou sondando
pensamentos de inimigos. Um telepata pode ser tanto
um bastião de apoio psíquico quanto um manipulador
ardiloso. 
Nível 3: Magias do Telepata (Telepath
Spells) 
Nível de
Psiônico   Magias Preparadas 
3   Perdição (Bane), Comando (Command), Detectar
Pensamentos (Detect Thoughts), Espinho Mental
(Mind Spike) 
5   Contramagia (Counterspell), Lentidão (Slow) 
7   Compulsão (Compulsion), Confusão (Confusion) 
9   Modificar Memória (Modify Memory), Presença
Real de Yolande (Yolande’s Regal Presence) 
Nível 3: Infiltrador Mental (Mind
Infiltrator) 
Ao conjurar   Detectar Pensamentos (Detect Thoughts) ,
você pode gastar um Dados de Energia Psiônica para
modificar a magia da seguinte forma: 
Não exige componentes verbais; 
Não exige Concentração; 
Se o alvo falhar na resistência de Sabedoria, ele não
sabe que você está sondando sua mente. 
Nível 3: Distração Telepática 
Quando uma criatura que você pode ver dentro do
alcance da sua   telepatia   acerta uma jogada de ataque,
você pode usar sua   Reação   para rolar   um Dado de
Energia Psiônica   e   subtrair o valor rolado da jogada de
ataque , podendo fazer com que o ataque erre. 
O Dado é   gasto apenas se o alvo errar o ataque . 
Nível 6: Mente Fortificada 
No início do seu turno, você pode gastar   um Dado de
Energia Psiônica   para fortalecer sua mente e entrar em
um estado fortificado. Pelos próximos   10 minutos , você
ganha   Resistência a dano Psíquico   e, sempre que fizer
um   teste de resistência de Inteligência, Sabedoria ou
Carisma , adiciona   uma rolagem do seu Dado de
Energia Psiônica   ao teste. 
Rolar o Dado de Energia Psíquica   não o consome .
Você não pode usar esse benefício se estiver sob a
condição   Incapacitado . 
Nível 6: Pensamentos Potentes 
Você possui   telepatia com alcance de 60 pés . Além
disso, você adiciona   seu modificador de Inteligência   ao
dano causado por qualquer   truque de Psiônco . 
Nível 10: Fortalecimento Telepático 
Quando você ou uma criatura que você pode ver dentro
do alcance da sua   telepatia   falha em um teste de
habilidade ou erra uma jogada de ataque, você pode
usar sua   Reação   para gastar   um Dado de Energia
Psiônica . 
Role o dado e   adicione o valor rolado ao d20 ,
podendo transformar uma falha em sucesso ou um erro
em acerto. O Dado de Energia Psíquica é   gasto apenas
se o teste for bem-sucedido ou o ataque acertar . 
Nível 14: Mentes Embaralhadas 
Você pode conjurar   Confusão   sem gastar um espaço de
magia , gastando em vez disso   quatro Dados de Energia
Psiônica . 
Quando conjura   Confusion   dessa forma, você pode
modificar a magia para que o   raio da esfera   da magia se
torne   9 metros , e pode escolher   uma criatura que você
possa ver dentro da área   para   ter sucesso
automaticamente   no teste de resistência contra a
magia. 
Além disso, quando uma criatura sob o efeito da
magia inicia seu turno,   você escolhe o comportamento
dela a partir da tabela para aquele turno , em vez de a
criatura rolar para determinar seu comportamento. 
```

### 4.4 Magias novas (p.16-20)

```text
===== p.16 =====
Magias 
As magias estão apresentadas em ordem alfabética. Se
uma magia incluir o Psiônico entre parênteses após a
escola de magia, essa magia é adicionada à lista de
magias do Psiônico (use a versão mais recente do
Psiônico apresentada em   Unearthed Arcana ). 
Arremesso Telecinético (Telekinetic
Fling) 
Truque, Evocação (Psiônico) 
Tempo de Conjuração:   1 ação 
Alcance:   18 metros 
Componentes:   S 
Duração:   Instantânea 
Escolha um objeto não mágico pesando entre   0,5 kg e
2,5 kg   que esteja a até   3 metros   de você e não esteja
sendo vestido ou carregado. Você envolve o objeto em
energia psiônica e o arremessa contra uma criatura
dentro do alcance. Faça um   ataque mágico à distância 
contra o alvo. Em um acerto, o alvo sofre   1d10 de dano
de Energético . Em acerto ou erro, o objeto cai no chão
intacto. 
Aprimoramento de Truque.   O dano aumenta para 
2d10   no 5 º   nível,   3d10   no 11 º   nível e   4d10   no 17 º   nível. 
Campo de Inversão Vital (Life Inversion
Field) 
Nível 4, Abjuração (Clérigo, Psiônico, Feiticeiro) 
Tempo de Conjuração:   Ação 
Alcance:   Pessoal 
Componentes:   V, S 
Duração:   Concentração, até 1 minuto 
Uma aura irradia de você em uma   Emanação de 9
metros   pela duração. Ao criar a aura, você recupera   4d8
Pontos de Vida . Sempre que você recuperar Pontos de
Vida, pode escolher uma criatura que possa ver dentro
da aura e forçá-la a realizar um   teste de resistência de
Constituição . Em caso de falha, a criatura sofre   dano
Necrótico   igual à   metade   da quantidade de Pontos de
Vida que você recuperou (arredondado para cima). Uma
criatura realiza esse teste   apenas uma vez por turno . 
Usando um Espaço de Magia Superior.   A cura
aumenta em   1d8   para cada nível do espaço de magia
acima do 4 º . 
Chicote do Ego (Ego Whip) 
Nível 2, Encantamento (Psiônico) 
Tempo de Conjuração:   Reação, tomada quando uma
criatura que você possa ver a até 9 metros de você
realiza um teste de atributo baseado em Carisma ou um
teste de resistência 
Alcance:   36 metros 
Componentes:   V 
Duração:   Instantânea 
A criatura deve realizar um   teste de resistência de
Carisma . Em caso de falha, ela subtrai   1d8   do resultado
do teste de atributo ou teste de resistência. 
Chicote Mental de Tasha (Tasha’s Mind
Whip) 
Nível 2, Encantamento (Psiônico, Feiticeiro, Mago) 
Tempo de Conjuração:   1 ação 
Alcance:   27 metros 
Componentes:   V 
Duração:   Instantânea 
Você desfere um golpe psíquico contra uma criatura
que possa ver dentro do alcance. O alvo deve realizar
um   teste de resistência de Inteligência . Em caso de
falha, o alvo sofre   3d6 de dano Psíquico   e   não pode
realizar Ataques de Oportunidade   até o final do
próximo turno dele. No próximo turno, o alvo deve
escolher   apenas uma   das opções:   mover-se ,   realizar
uma ação , ou   realizar uma Ação Bônus . Em um
sucesso, o alvo sofre   metade do dano . 
Usando um Espaço de Magia Superior.   Você pode
escolher   uma criatura adicional   como alvo para cada
nível de espaço de magia acima do 2 º . 
===== p.17 =====
Convocar Entidade Astral (Summon
Astral Entity) 
Nível 3, Conjuração (Psiônico, Feiticeiro, Bruxo, Mago) 
Tempo de Conjuração:   1 ação 
Alcance:   27 metros 
Componentes:   V, S, M (um cristal ou gema no valor de
pelo menos 300 PO) 
Duração:   Concentração, até 1 hora 
Você invoca o espírito de uma entidade psíquica, que
surge em um espaço desocupado no alcance. Você
escolhe: Entidade de Cristal, Ectoplasmática ou
Fantasmagórica. Ela usa o bloco de estatísticas de 
Espírito Psiônico (Psionic Spirit) . 
A criatura compartilha sua Iniciativa, mas age
imediatamente após você. Obedece seus comandos
verbais (não requer ação), ou realiza a ação   Esquiva   se
não receber ordens. 
Usando um Espaço de Magia de Círculo Superior: 
Use o nível do espaço como nível da magia no bloco de
estatísticas. 
Aberração Média, Neutro 
CA   11 + o nível da magia +2 (apenas Entidade de
Cristal) 
PV   40 + 10 para cada círculo da magia acima de 3 
Deslocamento   9 m; Voo 9 m (apenas Entidade
Fantasmagórica) 
MOD   RES   MOD   RES   MOD   RES 
F O R   16   +3   12   +1   11   +0   +0 
I N T   16   +3   12   +1   10   +0   +0 
Imunidades a Dano   Psíquico 
Sentidos   Visão no Escuro 18 m, Percepção Passiva 11 
Idiomas   Linguagem Profunda, Telepatia 18 m 
ND   Nenhum (XP 0; BP é igual ao seu Bônus de
Proficiência) 
Traços 
Passagem Incorpórea (Apenas Entidade Ectoplasmática e
Fantasmagórica). 
O espírito pode se mover através de criaturas e objetos
como se fossem Terreno Difícil. 
Se terminar o turno dentro de um objeto, ele é
empurrado para o espaço desocupado mais próximo e
sofre   1d10 de dano Energético   para cada 1,5 metro
percorrido. 
Ações 
Ataques Múltiplos. 
O espírito realiza um número de ataques igual à
metade do círculo da magia (arredondado para baixo). 
Golpe Cristalino (Apenas Entidade de Cristal). 
Jogada de Ataque Corpo a Corpo:   bônus é igual ao seu
modificador de ataque mágico, alcance 1,5 m. 
Dano:   1d10 + 3 + o círculo da magia de dano
Perfurante. 
Jato Ectoplasmático (Apenas Entidade Ectoplasmática). 
Jogada de Ataque à Distância:   bônus é igual ao seu
modificador de ataque mágico, alcance 9 m. 
Dano:   1d6 + 3 + o círculo da magia de dano Psíquico. 
Acerto ou Erro:   cada criatura em uma emanação de 
1,5 m a partir do alvo tem sua Velocidade reduzida em
1,5 m até o final do próximo turno. 
Raio Efêmero (Apenas Entidade Fantasmagórica). 
Jogada de Ataque à Distância:   bônus é igual ao seu
modificador de ataque mágico, alcance 36 m. 
Dano:   1d8 + 3 + o círculo da magia de dano Psíquico. 
Reações 
Enxame de Fragmentos (Apenas Entidade de Cristal). 
Gatilho:   o espírito é atingido por um ataque corpo a
corpo. 
Resposta:   o espírito reduz pela metade o dano sofrido
(arredondado pra baixo) e pode se teleportar para um
espaço desocupado à vista a até 9 metros de si
mesmo. 
+3   D E S   +1   C O N 
+3   S A B   +1   C A R 
===== p.18 =====
Escuridão Sangrenta 
Nível 3, Evocação (Psiônico, Bruxo, Mago) 
Tempo de Conjuração:   Ação 
Alcance:   18 metros 
Componentes:   V, S, M (um frasco de tinta rara no valor
de 50+ PO) 
Duração:   Concentração, até 1 minuto 
Você cria um vazio de tinta negra em uma   Esfera de 3
metros de raio , em um ponto que possa ver acima de
você, dentro do alcance. 
Ao conjurar a magia,   escuridão mágica   jorra da
esfera, formando um   Cilindro de 3 metros de raio e 12
metros de altura , originado da esfera, que persiste até o
início do seu próximo turno. O cilindro é   Terreno Difícil ,
e nenhuma luz — mágica ou não — pode iluminar a
área. 
Quando a escuridão aparece, cada criatura na área
deve realizar um   teste de resistência de Constituição ,
sofrendo   3d8 de dano Frio   e ficando com a condição 
Cego   até o final do seu próximo turno em caso de falha.
Em caso de sucesso, a criatura sofre metade do dano e
não fica Cega. 
Uma criatura também realiza esse teste quando entra
na área da magia pela primeira vez em um turno ou
quando termina seu turno ali. Cada criatura realiza esse
teste   apenas uma vez por turno . 
Enquanto a magia durar, você pode usar uma   Ação
Mágica   para mover a esfera até   6 metros
horizontalmente , fazendo com que ela derrame
novamente a escuridão mágica até o início do seu
próximo turno. 
Conjuração em Nível Superior.   O dano aumenta em 
1d8   para cada nível de espaço de magia acima do 3 º . 
Esmagamento Telecinético (Telekinetic
Crush) 
Nível 3, Transmutação (Psiônico, Feiticeiro, Bruxo) 
Tempo de Conjuração:   1 ação 
Alcance:   36 metros 
Componentes:   V 
Duração:   Instantânea 
Você cria um campo de força telecinética esmagadora
em um   cubo de 9 metros   dentro do alcance. Cada
criatura na área deve realizar um   teste de resistência de
Força . 
Em caso de falha, a criatura sofre   5d6 de dano de Força 
e fica   Caída . Em um sucesso, sofre   metade do dano   e
não fica Caída. 
Usando um Espaço de Magia Superior.   O dano
aumenta em   1d6   para cada nível de espaço de magia
acima do 3 º . 
Explosão Psiônica 
Nível 6, Evocação (Psiônico, Mago) 
Tempo de Conjuração:   Ação 
Alcance:   Pessoal 
Componentes:   V, S, M 
Duração:   Instantânea 
Você libera uma explosão concussiva de energia
psiônica. Cada criatura em um   cone de 18 metros 
originado de você deve realizar um   teste de resistência
de Inteligência . Em caso de falha, sofre   6d8 de dano
Psíquico   e fica   Atordoada   até o início do seu próximo
turno. Em caso de sucesso, sofre metade do dano. 
Usando um Espaço de Magia Superior.   O dano
aumenta em   1d8   para cada nível do espaço de magia
acima do 6 º . 
Forma de Pensamento 
Nível 6, Transmutação (Psiônico) 
Tempo de Conjuração:   Ação Bônus 
Alcance:   Pessoal 
Componentes:   V, M (matéria cerebral em um recipiente
no valor de 500+ PO) 
Duração:   Concentração, até 1 minuto 
Você se transforma brevemente em um espírito
psíquico, ganhando os seguintes benefícios enquanto a
magia durar: 
Forma Fantasmagórica.   Você possui   Imunidade a
dano Psíquico e Veneno , além de   Imunidade à condição
Exausto . 
Movimento Incorpóreo.   Você recebe   Deslocamento
de Voo de 18 metros   e pode pairar. Pode se mover
através de espaços ocupados como se fossem Terreno
Difícil. Se terminar seu turno dentro de um espaço
ocupado, sofre   1d10 de dano de Força . Se a magia
terminar enquanto você estiver em tal espaço, você
retorna ao último espaço desocupado em que esteve. 
Recarga Psiônica.   Como uma   Ação Mágica , você
pode tocar uma criatura (incluindo você mesmo) e rolar 
1d6 . A criatura recupera um espaço de magia gasto de
nível igual ou inferior a   metade do valor rolado
(arredondado para baixo) . Uma criatura só pode se
beneficiar desse efeito   uma vez por Descanso Longo . 
Fortaleza Mental (Intellect Fortress) 
Nível 3, Abjuração (Artífice, Bardo, Psiônico, Feiticeiro,
Bruxo, Mago) 
Tempo de Conjuração:   1 ação 
Alcance:   9 metros 
Componentes:   V 
Duração:   Concentração, até 1 hora 
Por toda a duração, uma criatura voluntária que você
possa ver dentro do alcance recebe   resistência a dano
Psíquico   e   Vantagem em testes de resistência de
Inteligência, Sabedoria e Carisma . 
Usando um Espaço de Magia de Círculo Superior: 
Você pode escolher uma criatura adicional para cada
espaço acima do 3 º . 
===== p.19 =====
Grito Psíquico (Psychic Scream) 
Nível 9, Encantamento (Bardo, Bruxo, Feiticeiro,
Psiônico) 
Tempo de Conjuração:   1 ação 
Alcance:   27 metros 
Componentes:   S 
Duração:   Instantânea 
Você libera o poder da sua mente para destruir o
intelecto de até   dez criaturas   à sua escolha que possa
ver dentro do alcance. Criaturas com Inteligência 2 ou
menor são imunes. 
Cada alvo deve realizar um   teste de resistência de
Inteligência . Em caso de falha, sofre   14d6 de dano
Psíquico   e fica   Atordoado . Em caso de sucesso, sofre
metade do dano. Se um alvo for reduzido a   0 Pontos de
Vida   por esse dano, sua cabeça   explode , caso possua
uma. 
No final de cada um de seus turnos, um alvo
Atordoado repete o teste, encerrando a condição em
caso de sucesso. 
Horrível Definhar de Abi-Dalzim 
Nível 8, Necromancia (Feiticeiro, Mago, Psiônico) 
Tempo de Conjuração:   Ação 
Alcance:   45 metros 
Componentes:   V, S, M (um pequeno pedaço de esponja) 
Duração:   Instantânea 
Você drena a umidade de todas as criaturas em um 
cubo de 9 metros   centrado em um ponto dentro do
alcance. Cada criatura na área deve realizar um   teste de
resistência de Constituição , sofrendo   12d8 de dano
Necrótico   em caso de falha, ou   metade desse dano   em
caso de sucesso. 
Construtos   obtêm sucesso automático no teste de
resistência, e   criaturas Planta   falham automaticamente
no teste. 
Plantas   não mágicas   na área que não sejam criaturas
— como árvores e arbustos —   definham e morrem
instantaneamente . 
Inimigos por Toda Parte 
Nível 3, Encantamento (Bardo, Feiticeiro, Bruxo, Mago,
Psiônico) 
Tempo de Conjuração:   Ação 
Alcance:   36 metros 
Componentes:   V, S 
Duração:   Concentração, até 1 minuto 
Escolha uma criatura que você possa ver dentro do
alcance. O alvo deve ser bem-sucedido em um   teste de
resistência de Inteligência   ou ficará   Amedrontado   pela
duração. 
Enquanto estiver Amedrontado, o alvo perde a
capacidade de distinguir aliados de inimigos e é afetado
das seguintes formas: 
O alvo considera   todas as criaturas que consegue
ver como inimigas . 
Sempre que escolher uma criatura como alvo de um
ataque, magia ou habilidade, deve escolher 
aleatoriamente   entre as criaturas visíveis dentro do
alcance. 
O alvo deve realizar um   Ataque de Oportunidade
sempre que puder . 
Cada vez que o alvo sofre dano, ele faz outro teste de
resistência de Inteligência. Se for bem-sucedido, a
magia termina. 
Lança Psíquica de Raulothim
(Raulothim’s Psychic Lance) 
Nível 4, Encantamento (Bardo,Bruxo, Feiticeiro, Mago,
Psiônico) 
Tempo de Conjuração:   1 ação 
Alcance:   36 metros 
Componentes:   V 
Duração:   Instantânea 
Você dispara uma lança brilhante de energia psíquica
contra uma criatura visível. Alternativamente, pode
nomear a criatura (não funciona com apelidos ou
títulos). Se estiver no alcance e no plano, torna-se o
alvo, mesmo sem linha de visão. Se não estiver no
alcance ou o nome for inválido, a lança se dissipa sem
efeito. 
O alvo faz um teste de resistência de Inteligência. Em
falha, sofre   7d6 de dano Psíquico   e fica   Incapacitado 
até o início do seu próximo turno. Em sucesso, sofre
metade do dano. 
Usando um Espaço de Magia de Círculo Superior:   O
dano aumenta em   1d6 para cada círculo acima do 4 º . 
===== p.20 =====
Prisão Mental 
Nível 6, Ilusão (Bardo, Feiticeiro, Mago, Psiônico) 
Tempo de Conjuração:   Ação 
Alcance:   18 metros 
Componentes:   S 
Duração:   Concentração, até 1 minuto 
Você tenta aprisionar uma criatura dentro de uma
cela ilusória que apenas ela percebe. Uma criatura que
você possa ver dentro do alcance deve ser bem-sucedida
em um   teste de resistência de Inteligência   ou sofre 
8d10 de dano Psíquico   e fica   Enfeitiçada   pela duração.
Em caso de sucesso, sofre metade do dano e a magia
termina. 
Enquanto estiver Enfeitiçado, o alvo fica   Contido   e
percebe a área ao redor de seu espaço como
extremamente perigosa. A ilusão pode assumir
qualquer forma — fogo, lâminas flutuantes, mandíbulas
grotescas pingando dentes. Enquanto a ilusão durar, o
alvo não pode ver nem ouvir nada além dela. Se o alvo
for movido para fora da ilusão, realizar um ataque corpo
a corpo através dela ou alcançar qualquer parte de um
corpo para fora, sofre   5d10 de dano Psíquico   e a magia
termina. 
Rastro Ectoplásmico 
Nível 2, Necromancia (Bruxo. Psiônico) 
Tempo de Conjuração:   Ação Bônus 
Alcance:   Pessoal 
Componentes:   V, S 
Duração:   Instantânea 
Você se envolve em espíritos que deixam ectoplasma
em seu rastro até o final do seu turno. Enquanto estiver
envolto, você pode se mover através de espaços
ocupados como se fossem   Terreno Difícil , e seu
deslocamento   não provoca Ataques de Oportunidade .
Se você encerrar seu turno dentro do espaço de outra
criatura, retorna para o último espaço desocupado em
que esteve. 
Enquanto envolto, sempre que você entra no espaço
de uma criatura, ela fica   coberta de ectoplasma   até o
final do próximo turno dela. Uma criatura coberta tem
seu   Deslocamento reduzido em 3 metros   e sofre   2d8 de
dano Necrótico   no início do turno dela. Uma criatura só
pode ser coberta por ectoplasma   uma vez por turno . 
Usando um Espaço de Magia Superior.   Enquanto
estiver envolto, seu Deslocamento aumenta em   3
metros   para cada nível do espaço de magia acima do 2 º . 
Sifão Vital 
Nível 1, Evocação (Psiônico) 
Tempo de Conjuração:   Ação 
Alcance:   36 metros 
Componentes:   S 
Duração:   Instantânea 
Você dispara um orbe de energia psiônica alimentado
por sua força vital contra uma criatura que possa ver
dentro do alcance. Faça um   ataque mágico à distância 
contra o alvo. Em um acerto, o alvo sofre   1d10 de dano
Psíquico , e você pode gastar   1 Dado de Vida   para
aumentar o dano em   1d10 . 
Usando um Espaço de Magia Superior.   O dano
aumenta em   1d10 , e o número de Dados de Vida que
você pode gastar aumenta em 1 para cada nível do
espaço de magia acima do 1 º . 
```

### 4.5 Talentos Selvagens (p.21-23)

```text
===== p.21 =====
Talentos 
Esta seção apresenta dez novos talentos. 
Talentos de Talento Selvagem
(Wild Talent Feats) 
Esses talentos pertencem à categoria de Talento
Selvagem. 
Atmocinese (Atmokinesis) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Raio Elétrico (Lightning Jolt).   Uma vez por turno, ao
conjurar uma magia ou atingir com uma jogada de
ataque que cause dano de Concussão, Perfurante,
Cortante ou Psíquico, você pode   alterar o tipo de dano
para Elétrico . 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Toque Chocante (Shocking Grasp) . Você
também tem sempre preparada a magia   Névoa (Fog
Cloud) . 
Você pode conjurá-la uma vez sem gastar espaço de
magia e recupera a capacidade ao terminar um
Descanso Longo. Também pode conjurá-la usando
espaços de magia que possua. 
Ao conjurar essas magias,   não exigem componentes
Verbais nem Materiais , e você escolhe entre
Inteligência, Sabedoria ou Carisma como atributo de
conjuração (definido ao escolher este talento). 
Ao atingir o 3 º   nível de personagem, você também
sempre tem preparada a magia   Rajada de Vento (Gust
of Wind)   e pode conjurá-la da mesma forma. 
Biocinese (Biokinesis) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Canalizar Energia Vital (Bend Life Energy).   Quando
uma magia que você conjura recuperar PV de uma
criatura, você pode   rolar 1d4 e adicionar esse valor aos
PV recuperados . 
Você pode usar esse benefício um número de vezes
igual ao seu Bônus de Proficiência, e recupera todos os
usos após um Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Poupar os Moribundos (Spare the Dying) . Você
também tem sempre preparada a magia   Palavra
Curativa (Healing Word) . 
Você pode conjurá-la uma vez sem gastar espaço de
magia e recupera a capacidade ao terminar um
Descanso Longo. 
Também pode usá-la com espaços de magia. 
Essas magias   não exigem componentes Verbais ou
Materiais   e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração ao escolher este
talento. 
Ao atingir o 3 º   nível de personagem, você também
tem sempre preparada a magia   Vigor Arcano (Arcane
Vigor)   e pode conjurá-la da mesma forma. 
Clarividência (Clairsentience) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Premonição Menor (Minor Foreknowledge).   Ao usar
a ação de Buscar (Search), você pode conceder 
Vantagem a si mesmo em um teste de habilidade   feito
como parte dessa ação. 
Pode usar esse benefício um número de vezes igual ao
seu Bônus de Proficiência, e recupera todos os usos
após um Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Orientação (Guidance) . Você também tem
sempre preparada a magia   Detectar o Bem e o Mal
(Detect Evil and Good) , podendo conjurá-la uma vez
sem gastar espaço de magia. 
Recupera o uso ao terminar um Descanso Longo e pode
usá-la com espaços de magia. 
Essas magias   não exigem componentes Verbais ou
Materiais , e você escolhe entre Inteligência, Sabedoria
ou Carisma como atributo de conjuração ao selecionar
o talento. 
Ao atingir o 3 º   nível de personagem, você também
tem sempre preparada a magia   Ver o Invisível (See
Invisibility)   e pode conjurá-la da mesma forma. 
===== p.22 =====
Criocinese (Cryokinesis) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Manipulação de Gelo (Ice Manipulation).   Uma vez
por turno, ao conjurar uma magia ou atingir com uma
jogada de ataque que cause dano de Concussão,
Perfurante, Cortante ou Psíquico, você pode   mudar o
tipo de dano para Gélido . 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Raio de Gelo (Ray of Frost) . Você também tem
sempre preparadas as magias   Armadura de Agathys
(Armor of Agathys)   e   Faca de Gelo (Ice Knife) . Você
pode conjurar cada uma delas uma vez sem gastar
espaço de magia e recupera a capacidade de usá-las
dessa forma ao finalizar um Descanso Longo. Também
pode conjurá-las usando espaços de magia que possua. 
Essas magias   não exigem componentes Verbais nem
Materiais , e você escolhe entre Inteligência, Sabedoria
ou Carisma como atributo de conjuração (definido ao
escolher este talento). 
Empata (Empath) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Sentido Emocional (Emotional Sense).   Ao usar a
ação de Influenciar (Influence), você pode se conceder 
Vantagem em qualquer teste de habilidade   feito como
parte dessa ação. Você pode usar esse benefício um
número de vezes igual ao seu Bônus de Proficiência,
recuperando todos os usos com um Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você tem sempre
preparada a magia   Enfeitiçar Pessoa (Charm Person) ,
podendo conjurá-la uma vez sem gastar espaço de
magia. Você recupera a capacidade de usá-la dessa
forma ao terminar um Descanso Longo e também pode
usá-la com espaços de magia. 
Ao conjurar essa magia,   não exige componentes
Verbais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração (definido ao
escolher o talento). 
Ao atingir o 3 º   nível de personagem, você também
tem sempre preparada a magia   Acalmar Emoções
(Calm Emotions)   e pode conjurá-la da mesma forma. 
Modelador de Carne (Flesh Morpher) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Carne Flexível (Flexible Flesh).   Ao realizar um teste
de Destreza (Acrobacia ou Prestidigitação), você
adiciona um bônus igual ao seu modificador de
Inteligência (mínimo de +1). Você pode usar esse
benefício um número de vezes igual ao seu Bônus de
Proficiência e recupera todos os usos com um
Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você tem sempre
preparada a magia   Passos Longos (Longstrider) ,
podendo conjurá-la uma vez sem gastar espaço de
magia. Recupera a capacidade de usá-la dessa forma
com um Descanso Longo e também pode usá-la com
espaços de magia. 
Ao conjurar essa magia,   não exige componentes
Verbais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração (escolhido ao
selecionar o talento). 
Ao atingir o 3 º   nível de personagem, você também
tem sempre preparada a magia   Alterar-se (Alter Self)   e
pode conjurá-la da mesma forma. 
Sussurrador Mental (Mind Whisperer) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Telepatia Limitada (Limited Telepathy).   Como uma
Ação, escolha uma criatura que possa ver a até 36
metros de você. Você estabelece uma conexão
telepática com ela. Durante 1 hora, vocês podem se
comunicar telepaticamente entre si enquanto estiverem
a até 36 metros um do outro. Para compreender as
mensagens, é necessário usar uma linguagem em
comum. 
Você só pode usar esse benefício uma vez, e o
recupera ao final de um Descanso Curto ou Longo. 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Talho Mental (Mind Sliver) . Você também tem
sempre preparada a magia   Sussurros Dissonantes
(Dissonant Whispers) , podendo conjurá-la uma vez sem
gastar espaço de magia. Você recupera essa capacidade
com um Descanso Longo e também pode conjurá-la
com espaços de magia. 
Essas magias   não exigem componentes Verbais ou
Materiais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração ao escolher este
talento. 
===== p.23 =====
Trapaceiro Psiônico (Psi Trickster) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Mente Astuta (Cunning Mind).   Ao realizar um teste
de Carisma (Enganação ou Persuasão), você recebe um 
bônus igual ao seu modificador de Inteligência   (mínimo
+1). 
Você pode usar esse benefício um número de vezes
igual ao seu Bônus de Proficiência e recupera todos os
usos com um Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Ilusão Menor (Minor Illusion) . Você também tem
sempre preparada a magia   Disfarçar-se (Disguise Self) ,
podendo conjurá-la uma vez sem gastar espaço de
magia. Você recupera essa capacidade com um
Descanso Longo e também pode conjurá-la com
espaços de magia. 
Essas magias   não exigem componentes Verbais ou
Materiais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração ao escolher este
talento. 
Psicinético (Psykineticist) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Impulso Psíquico (Psi Boost).   Ao realizar a ação de
Correr (Dash), você pode   aumentar sua velocidade em
3 metros   até o final do turno. 
Você pode usar esse benefício um número de vezes
igual ao seu Bônus de Proficiência, recuperando todos
os usos com um Descanso Longo. 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Arremesso Telecinético (Telekinetic Fling) 
(apresentado neste UA). Você também tem sempre
preparada a magia   Onda Trovejante (Thunderwave) .
Você pode conjurá-la uma vez sem gastar espaço de
magia e recupera essa capacidade ao terminar um
Descanso Longo. Você também pode conjurá-la usando
espaços de magia. 
Essas magias   não exigem componentes Verbais ou
Materiais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração ao escolher este
talento. 
Pirocinese (Pyrokinesis) 
Talento Selvagem (Pré-requisito: Não pode possuir
outro Talento Selvagem) 
Você obtém os seguintes benefícios: 
Incendiário (Firestarter).   Uma vez por turno, ao
conjurar uma magia ou atingir com uma jogada de
ataque que cause dano de Concussão, Perfurante,
Cortante ou Psíquico, você pode   mudar o tipo de dano
para Ígneo . 
Talento Psíquico (Psionic Talent).   Você conhece o
truque   Criar Chama (Produce Flame) . Você também
tem sempre preparada a magia   Mãos Flamejantes
(Burning Hands) . Você pode conjurá-la uma vez sem
gastar espaço de magia e recupera a capacidade ao
terminar um Descanso Longo. Você também pode
conjurá-la usando espaços de magia que possua. 
Essas magias   não exigem componentes Verbais ou
Materiais , e você escolhe Inteligência, Sabedoria ou
Carisma como atributo de conjuração (definido ao
escolher este talento). 
Ao atingir o 3 º   nível de personagem, você também
tem sempre preparada a magia   Raio Abrasador
(Scorching Ray)   e pode conjurá-la da mesma forma. 
(23 páginas no total)
```
