# Paladino — classe base (nível 1-20)

Foco pausado em 2026-10 por decisão do Osmar — classe base completa
(Entregas 1-6), subclasses (Entrega 7) com só Juramento da Devoção
feito (ver `aprendizados/classes/paladino-devocao.md`), Multiclasse
(Entrega 8) ainda não começada. Ver `PENDENCIAS.md` pro que falta.

## Decupagem e dados

SDD: `sdd/sdd-paladino.md`. Núcleo: Força/Carisma, d10, salvaguardas
Sabedoria+Carisma, meio-conjurador (`progressao-meio-conjurador.ts`,
compartilhado com Guardião). Maestria em Arma fixa em 2 em todos os 20
níveis — confirmado com o Osmar que não vem da planilha, é regra do
livro direto. Auras (Aura de Proteção/Coragem/Devoção) só afetam o
PRÓPRIO Paladino — efeito em aliados fica manual, fora do app
(decisão confirmada antes de começar, ver seção 9 do SDD).

## Canalizar Divindade — banco compartilhado

`quantidadeCanalizarDivindade`/`canalizarDivindadeGasto` é 1 banco só,
gasto por várias características diferentes (Sentido Divino, Repudiar
Inimigos, Arma Sagrada da subclasse) — todas chamam o mesmo
`onUsarUsoCanalizar`, sem estado próprio. Recarga: 1 uso no Descanso
Curto, todos no Longo (igual Recuperar Fôlego).

## Magia fixa de classe — mecanismo genérico (`magiasFixasDeClasse.ts`)

Destruição do Paladino (nível 2, Destruição Divina grátis 1x/Descanso
Longo) e Montaria Fiel (nível 5, Convocar Montaria grátis) usam o
mesmo campo genérico `CaracteristicaClasse.magiaFixaConcedida: {
nomeMagia, usosGratisPorDescansoLongo }` — zero código novo pra
Montaria Fiel, 100% reaproveitado de Destruição do Paladino. Pensado
pra ser reusado em qualquer classe futura com o mesmo padrão ("sempre
tem a magia X preparada + Y usos grátis por Descanso").

**Bug pré-existente achado no caminho (não só do Paladino):**
`mecanicaDaMagia` não reconhecia magia com `ataqueOuSalvaguarda: null`
+ `danoBaseDado` preenchido — "Usar" não rolava dano nenhum. Afetava
~8 magias (Destruição Divina, Mísseis Mágicos, Marca do Predador,
Favor Divino, Explosão Elemental, Manto do Cruzado, Destruição
Radiante...). Corrigido com mecânica nova `'dano-automatico'` em
`core/magiaDano.ts`/`core/conjurarMagia.ts`.

**Primeiro fluxo "conjurar magia → cria Pet" do app:** Convocar
Montaria (Montaria Fiel) interceptado dentro de `conjurarMagia()` —
abre `EscolherMontariaModal.tsx`, segue a regra de SidePanel com
`transform` (fechar o painel ANTES de abrir o modal, senão o clique
"vaza" por cima mesmo o modal aparecendo visualmente em cima).
`core/pets.ts` ganhou `statsMontariaSobrenatural(circuloUsado)` (CA
10+círculo, PV 5+10×círculo).

## Aura de Proteção (nível 6) — bônus em todas as salvaguardas

`calcularSalvaguardas` ganhou 6º parâmetro opcional
`bonusAuraProtecao` (mín. +1 = mod. Carisma). Simplificação aceita: a
regra desliga a aura com o Paladino Incapacitado, mas o app não
rastreia condição no próprio personagem ainda — fica sempre ativa a
partir do nível 6, sem botão de "ligar" (confirmado com o Osmar:
"simplesmente emana").

## Repudiar Inimigos (nível 9) — padrão de salvaguarda do alvo

1ª versão mostrava CD/alvos só como texto — errado, já existia padrão
genérico pronto (`SalvaguardaDoAlvoModal`, usado por Golpe de Escudo/
Lançar no Inferno/Ataque de Sopro). **Lição: ao decupar característica
nova com salvaguarda de ALVO, checar esse padrão ANTES de inventar um
jeito novo de mostrar a CD** — já estava registrada em
`DECISOES-COMBATE.md`.

**Seção 6.6 pegou de novo:** Sentido Divino e Repudiar Inimigos só
existiam no Combate, sem grupo próprio na aba Magias — mesmo bug
antigo do Mago (Maestria/Assinatura) que deu origem à regra. Corrigido
com seção "Canalizar Divindade" na aba Magias, totalmente usável de
lá, reaproveitando o mesmo banco/CD do Combate.

## Golpes Radiantes (nível 11) — `corpoACorpo` ≠ `usouForca`

Achado importante: `AtaqueInfo` só tinha `usouForca` (usa Força no
cálculo), que NÃO é a mesma coisa que "é corpo a corpo" — arma com
Acuidade usada com Destreza tem `usouForca: false` mas continua corpo
a corpo. Campo novo `corpoACorpo: boolean` em `AtaqueInfo`, calculado
certo nos 2 construtores de `core/ataque.ts`. Reaproveita o mecanismo
`gruposExtras` que Golpe Brutal (Bárbaro) já usa pra somar dado extra
no popup de dano sem toggle.

**2 bugs de UI pré-existentes achados testando ao vivo no celular**
(não causados por Golpes Radiantes, mas só apareceram testando essa
entrega): (1) dado 3D rolava ATRÁS do painel de Ação/Bônus/Reação
aberto — `RollOverlay`/`Dice3dCanvasHost`/`Dice3dFab` tinham z-index
90-105, abaixo do `SidePanel` (110/111); subiram pra 120-135 — bug
real que afetava QUALQUER rolagem com painel aberto, não só essa
entrega. (2) 1d1 (Ataque Desarmado sem talento) desenhava uma caixinha
de "dado" pro valor fixo "1" — sem sentido pra um dado que nunca
varia; grid do popup agora pula dado de 1 lado só.

**Painel fecha em TODO ataque, não só no último:** pedido do Osmar
depois de ver o painel ficar aberto entre ataques de quem tem Ataque
Extra — `registrarAtaqueSemDanoPendente` agora fecha e marca Ação
usada a cada ataque, não só no último (vale também pro Golpe Brutal do
Bárbaro, mesmo bookkeeping).

## Toque Restaurador (nível 14) — Mãos Consagradas vira 1 toque combinado

Regra real: cura PV E remove condição(ões) no MESMO gasto — não é
exclusivo ("você decide como dividir o que vai gastar nesse toque").
Confirmado com o Osmar ANTES de codar (pergunta dele: "daria pra fazer
as duas coisas juntas?" pegou um erro de entendimento meu antes de eu
propor a solução errada). `core/maosConsagradas.ts`
(`custoTotalMaosConsagradas`/`condicoesDisponiveisMaosConsagradas`) +
`BarraRecurso.tsx` ganhou prop `pendente` (prévia em vermelho do que
seria gasto, mesma ideia do dano pendente na barra de PV).

**3 bugs de lógica achados testando ao vivo:** barra não considerava o
PV digitado antes de escolher o alvo; faltava mostrar PV atual/máximo
em "Curar a si mesmo"; validação do botão Confirmar estava invertida
(curar 0 + remover condição deveria habilitar, sem exigir alvo).

## Status das características (CLAUDE.md 12.1)

Confirmadas `textonly` (efeito em outros personagens, app não
rastreia): Aura de Coragem (nível 10), Aura Expandida (nível 18, era
`placeholder-textonly` de antes). As 5 da Devoção estão no arquivo
próprio.
