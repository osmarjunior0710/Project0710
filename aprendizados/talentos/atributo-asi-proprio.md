# Atributo de conjuração/efeito "herdado do ASI do próprio talento" — 8 talentos + 12 Dádivas Épicas (2026-10)

Foco disparado como achado colateral: investigando a infra do E7 do foco Psiônico (Talentos
Selvagens — escolhem Int/Sab/Car livremente, sem classe), descobri que o talento "Iniciado em
Magia" já fazia exatamente essa escolha há tempos, mas a escolha nunca era lida em lugar nenhum —
e isso generalizou pra uma categoria inteira de 8 talentos, e depois pras 12 "Dádivas Épicas".
SDD completo em `sdd/sdd-atributo-talento.md` (fica, não é descartável — referência de arquitetura).

## O bug raiz

`modAcertoConjuracaoPorClasse` (`core/magiasPersonagem.ts`) já existia pra resolver o mod./CD de
conjuração pela classe DONA da magia (multiclasse), não pela classe ATIVA. Mas quando uma magia
vem de um TALENTO (não de classe nenhuma), ela entra marcada `classe: null`
(`useMagiasEConjuracao.ts`) — e `classe: null` cai no fallback da classe ativa, que é exatamente
errado quando o talento usa um atributo PRÓPRIO (escolhido ou derivado do seu próprio ASI).

## Os 2 grupos

- **Grupo 1 (ASI próprio)**: Telecinético, Telepático, Tocado pela Sombra, Tocado pelas Fadas,
  Conjurador Ritualista, Envenenador, Dádiva do Ataque Irresistível — o atributo é "o que o ASI
  DESTE talento aumentou".
- **Grupo 2 (escolha livre, sem ASI)**: Iniciado em Magia — atributo escolhido no momento de
  pegar o talento, sem ASI nenhum envolvido.

## Arquitetura (reaproveitada, não criada)

A gaveta `PersonagemSalvo.escolhaAtributoTalentoGeral: Record<talentoId, Atributo>` já existia,
usada só pelo Resiliente (`core/talentoAtributo.ts`). Em vez de criar um campo paralelo (proposta
original do SDD), ela foi reaproveitada — `atributosResilienteEscolhidos` filtra estritamente por
`efeitoMecanico.tipo === 'atributo-e-salvaguarda-escolhidos'`, então as novas entradas (outros
talentos) convivem sem colisão nenhuma. **Lição**: sempre conferir se uma gaveta já existente serve
antes de propor uma nova — o SDD por escrito ajudou a flagrar isso durante a implementação
(CLAUDE §6.2, "pode ser corrigido se um erro for encontrado nele durante a implementação").

Novo `Talento.usaAtributoProprioAsi?: true` marca quem precisa disso. Novo
`core/conjuracaoDeTalento.ts` (`resumoConjuracaoDeTalento`) calcula mod./CD/ataque sem exigir uma
`Classe` — mesma fórmula de `resumoConjuracao`, só sem o requisito de classe.

**Sentinela de `classeNome`**: em vez do prefixo opaco `'__talento:id__'` que o SDD propunha
originalmente, usei o NOME DO TALENTO direto (ex.: `"Telepático"`) como `classeNome` — reaproveita
100% do `PillClasse`/`modAcertoConjuracaoPorClasse` sem tradução nenhuma, e como bônus a magia
concedida por esses talentos passou a mostrar uma pill com o nome do talento (antes não mostrava
pill nenhuma, por vir com `classe: null`).

## Achado maior no meio do caminho: CD de Salvaguarda também caía na classe ativa

Ao plugar a correção, descobri que o popup de CD de Salvaguarda (`SalvaguardaDoAlvoModal`, em
`CombatTab.tsx` E `MagiasTab.tsx`) sempre usava a CD da classe ATIVA (pill), nunca a da classe/
talento DONO da magia — mesmo depois que o ACERTO de ataque já tinha sido corrigido pra isso
(`modAcertoConjuracaoPorClasse`). Era um bug mais antigo e MAIOR que o escopo original (afeta
qualquer multiclasse com magia de salvaguarda, não só os 8 talentos). Avisei o Osmar, ele pediu
pra corrigir na mesma entrega. Fix: nova `cdConjuracaoPorClasse` (espelha a de acerto) +
`classeDonaDaMagia` propagado por todo o caminho até `telaSalvaguarda` (4 pontos de entrada:
Ação/Ação Bônus/Reação no Combate + aba Magias).

## 2º achado maior: as 12 Dádivas Épicas não aplicavam o próprio ASI

Ao revisar Dádiva do Ataque Irresistível pro Grupo 1, descobri que a categoria "Dádiva Épica"
inteira (12 talentos, nível 19+) tem "+1 num atributo" no texto, mas o passo `dadivaEpica` do
Level Up só deixava escolher QUAL dádiva — nunca pedia o atributo nem aplicava o +1. Bug
sistêmico desde antes deste foco existir, nunca percebido porque nenhuma Dádiva tinha sido
testada a fundo. Fix: novo passo `dadivaEpicaAtributo` (paralelo a `asiAtributo`, nunca o MESMO
passo — nível 19 pode ter os 2 ASIs no mesmo Level Up, escolhas independentes). Reusa
`sortearAsiDoTalento` (`geradorPersonagemTeste.ts`) pro Level Up Rápido sortear também.

## Efeito colateral na aba Magias — bug lateral achado desenhando a pill de atributo

Pedido do Osmar: trazer uma pill com o atributo usado por cada magia, e deixar explícito no topo
da aba Magias quando o atributo não é óbvio. Ao desenhar isso, achei que o bloco do topo só
mostrava 1 linha por fonte quando havia 2+ fontes (`resumosPorClasse.length > 1`); com exatamente
1 fonte (que agora podia ser um talento sem classe conjuradora nenhuma), caía no "resumo único" que
lia a classe ATIVA — um personagem só com Telepático via NADA no topo. Reestruturado: bloco
"principal" sempre visível (classe ativa se ela conjurar, senão a 1ª fonte da lista) + grupo
colapsável "Outros atributos de conjuração" pra qualquer fonte extra — decisão explícita do Osmar
de tratar 2ª classe real e talento IGUAL (não dar prioridade pra classe de verdade), simplificando
a regra.

## Padrão que generaliza pra outros talentos futuros

Registrado em `DECISOES-CLASSES.md` ("Talento com atributo próprio do ASI"): todo talento futuro
com essa regra ("atributo de conjuração/efeito = o que o ASI deste talento aumentou, ou escolhido
livremente") usa `usaAtributoProprioAsi` + a gaveta `escolhaAtributoTalentoGeral` + o sentinela
de `classeNome` = nome do talento — nunca inventar mecanismo novo.

## O que ficou pendente (ver PENDENCIAS.md)

Telecinético (Empurrão Telecinético), Envenenador (veneno) e Dádiva do Ataque Irresistível (dano
em crítico) ganharam a infra (gaveta + flag + função pronta), mas a MECÂNICA em si (texto
virando efeito real) ainda não existe — 3 entregas futuras independentes, prioridade baixa
(talentos avançados, menos usados).
