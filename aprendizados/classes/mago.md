# Mago — características base (nível 1-20)

## Contexto e fontes usadas

Foco aberto em 2026-09 depois de uma auditoria pedida pelo Osmar
encontrar 5 características de Mago (nível 1 ao 20) que eram só texto
solto da planilha, sem nenhuma mecânica ligada — ninguém tinha lido
TODAS as características da classe de ponta a ponta antes de
considerá-la "pronta" (ver seção 6.1.1 do `CLAUDE.md`, criada por
causa deste achado). Fontes: `dnd-master-referencia.xlsx` (dado
confirmado) e `livros-referencia/` (Livro do Jogador, capítulo do
Mago) pra entender a regra completa por trás de cada característica,
incluindo caixas de texto soltas que a planilha não capturou (ex.:
"Expandindo e Substituindo um Livro de Magias").

SDD completo em `sdd/sdd-mago-caracteristicas-base.md` — referência de
"como cada mecânica deveria funcionar", ainda válido depois do foco
fechado.

## Entrega 1 — Acadêmico (nv.2, bug reportado)

O bug original que abriu o foco: escolher a perícia do Acadêmico no
Level Up não estava entrando em `periciasBonusExtras` E
`periciasEspecialista` ao mesmo tempo (a característica dá
proficiência NOVA + Especialização/dobra na mesma perícia — nenhum
mecanismo genérico fazia isso, `Conhecimento Primordial` do Bárbaro
pressupõe proficiência PRÉ-EXISTENTE). Corrigido com 1 estado novo
alimentando os 2 arrays.

## Entrega 2 — Guia do Level Up

Motivado pelo próprio bug da Entrega 1: texto sem número ao lado
engana ("parece que já tá funcionando"). A tela "Novas
Características" do Level Up virou o guia completo do nível — mostra
o delta real de cada recurso (Truques/Magias Preparadas/Livro de
Magias/Espaços de Magia por círculo, PV, ASI) e cada característica
nova com seu `statusImplementacao` (CLAUDE.md §12.1) — linha
`placeholder-*` mostra `[PH]` automaticamente, sem precisar escrever
à mão no texto de descrição. As 10 características do Mago foram
classificadas (`caracteristicasClasse.ts`) e ganharam função-esqueleto
própria em `core/` (mesmo as ainda não implementadas, como marco de
existência).

## Entrega 3 — Copiar Magia pro Livro

Botão novo na aba Magias, 2 modos numa tela só (não 2 entregas
separadas, decisão do Osmar): "Copiar magia nova pro Livro" (fonte
externa, 2h + 50 PO/círculo, soma em `livroDeMagiasAtuais`) vs.
"Copiar pra livro reserva" (backup, 1h + 10 PO/círculo, só desconta o
custo — o app não modela um "2º livro" separado).

## Entrega 4 — Recuperação Arcana (nv.1)

Pergunta condicional no Descanso Curto (mesmo padrão de "redefinir
Magias Preparadas" do Longo) + tela de escolha de círculos pra
recuperar, com orçamento combinado (`Math.ceil(nível/2)`, nenhum
círculo 6+) — reaproveita `TickPips`.

## Entrega 5 — Adepto de Ritual (nv.1)

Seção nova na aba Magias listando magias com tag Ritual do Livro de
Magias ainda não preparadas, cada uma com botão de conjuração livre
(sem gastar Espaço, ilimitado de verdade — RAW não tem contador).

## Entrega 6a/6b — Maestria de Magias (nv.18)

**6a:** passo de Level Up escolhendo 1 magia de 1º + 1 de 2º círculo
(tempo de conjuração de Ação) do Livro de Magias — ficam sempre
preparadas (seção própria na aba Magias) e conjuram no círculo delas
sem gastar Espaço ("Conjurar Grátis" na tela "Em qual círculo?",
reaproveitando `opcoesGastoComPonte`/`EscolherCirculoShell` — o mesmo
mecanismo vale pra Magias E Combate, 1 único ponto de mudança).

**6b:** troca no Descanso Longo — pergunta condicional encadeada
depois de "quer redefinir Magias Preparadas?" (2 perguntas nunca ao
mesmo tempo na tela) + tela de troca (`MaestriaDeMagiasTrocaShell`)
reaproveitando o mesmo grid do passo de Level Up.

## Entrega 7 — Assinatura Mágica (nv.20)

Passo de Level Up escolhendo 2 magias de 3º círculo (sem restrição de
tempo de conjuração, diferente da Maestria) — mesmo tratamento de
"sempre preparada" + "Conjurar Grátis", mas limitado a 1x por magia
até o próximo Descanso Curto OU Longo (novo `assinaturaMagicaGastas`,
resetado nos 2 descansos — diferente de Maestria, que é ilimitada).

**Bug achado e corrigido no dia seguinte à publicação:** nem Maestria
de Magias nem Assinatura Mágica apareciam na aba Combate — só na aba
Magias. Causa: `magiasConjuraveis` (`useMagiasEConjuracao.ts`), a
lista que alimenta o picker "Usar Magia" do Combate, não incluía essas
2 fontes "sempre preparadas" — cada característica desse tipo
(Descobertas Mágicas, Livro das Sombras, Maestria, Assinatura...)
precisa ser somada à mão nessa lista, separado da seção própria da
aba Magias — 2 pontos de manutenção fácil de esquecer o 2º. Corrigido
filtrando contra `magiasPreparadasAtuais` pra não duplicar linha
quando a mesma magia também estiver preparada normalmente. **Ideia
registrada no Backlog** (`Backlog.md`, "Combate lendo direto da aba
Magias") pra unificar isso num registro só — não feito agora,
prioridade do Osmar era terminar a rodada de bugs primeiro.

## Ajuste — ordem do painel "Espaços" no Combate

Osmar notou o painel flutuante "Espaços" (ao lado da lista de magias
em "Usar Magia") mostrando 1º círculo em cima, 9º embaixo — diferente
da lista de magias ao lado (que já mostra do maior círculo pro menor).
Invertido só nesse painel (`SelecionarMagiaShell.tsx`) — a função
compartilhada `espacosDeMagiaAtivos` continua crescente de propósito
pros outros consumidores (aba Magias). Osmar pediu inicialmente pra
"padronizar em todo lugar", mas esclareceu depois que era só esse
overlay específico — não mexer nos outros ~14 lugares que também têm
ordem inconsistente sem pedido explícito (levantamento completo feito
e descartado, ver histórico do chat se precisar retomar).

## Validação final — run manual nível 1 a 20

Depois de fechar as 7 entregas, o Osmar pediu uma run completa,
manual, nível por nível (sem pular via ferramenta automática), pra
confirmar que cada nível ganha exatamente o que devia e oferece toda
escolha esperada. Rodei em paralelo via Playwright, conferindo cada
delta (Truques/Magias Preparadas/Livro de Magias/Espaços por círculo)
contra a tabela real de `classes.ts` e cada característica contra
`caracteristicasClasse.ts` — bateu 100% em todos os 19 level-ups
(nível 2 ao 20), nenhum valor errado, nenhuma escolha faltando ou
aparecendo fora de hora. Achados no caminho foram só bugs do MEU
script de automação (comparação de texto sensível a maiúsculas/
minúsculas — `.section-title`/`.label` têm `text-transform:
uppercase` no CSS, então `.innerText` nunca bate com o texto literal
do JSX; e o script tentando forçar +2 de ASI sempre em Inteligência,
mesmo depois dela bater no teto de 20), não do app.

## O que ficou pendente ao fechar este foco

- **Repetir o "Guia do Level Up" nas outras 9 classes já
  implementadas** — registrado em `PENDENCIAS.md`.
- **Unificar a fonte de "magia sempre preparada"** entre aba Magias e
  Combate (não duplicar array em 2 lugares) — registrado em
  `Backlog.md`.
- **Melhoria de UI (Feedback.md):** card "Novas Características" sem
  separação visual entre linhas — ainda não resolvido.
- Subclasse Evocador só tem a Entrega 1 feita (dado no banco) — as
  características aparecem no Level Up com texto real, mas sem
  mecânica de verdade ainda (Versado em Evocação, Truque Potente,
  Evocação Potencializada, Sobrecarga) — foco próprio, retomado a
  seguir.
