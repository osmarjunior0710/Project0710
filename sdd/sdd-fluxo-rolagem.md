# SDD — Fluxo de Rolagem: o contrato entre "rolar" e "o que acontece depois"

> Documento de especificação de um padrão de ENGENHARIA/UI, não de
> regra de D&D — mas segue o mesmo formato de SDD (seção 6.2 do
> `CLAUDE.md`) porque mexe em sistema compartilhado por várias
> características (`RollContext`, `DanoPendente`) e uma colisão mal
> resolvida aqui se repete em qualquer classe futura.
>
> Nasceu do achado do foco Bárbaro: Golpe Brutal (nível 9) deixa
> escolher um efeito depois de acertar o ataque, e "isso não tem no
> sistema hoje do jeito que deveria" (Osmar, ver `PENDENCIAS.md`). Ao
> investigar, o problema revelou ser maior — não é só Golpe Brutal.

---

## 1. O que existe hoje (levantamento factual, sem opinião)

Mapeamento completo feito antes deste documento (ver
`aprendizados/classes/barbaro.md` pra referência cruzada). Resumo:

**O app não sabe se um ataque acertou.** Toda rolagem de ataque
(normal, Golpe Brutal, magia com ataque) dispara o próximo passo
(texto de feedback, `DanoPendente`, picker de efeito) de forma
**"atira e esquece"** — a mesma função síncrona que inicia `rolarD20`
já monta o resultado seguinte, sem esperar a rolagem terminar de
verdade e sem saber se o total bateu a CA do alvo. O jogador decide
"acertou?" olhando a mesa, fora do app; os botões de dano ficam sempre
disponíveis, acerte ou erre.

**Só existe 1 mecanismo genérico pra "depois de rolar, faça X" de
verdade** — `RollD20Options.onResultado`/`RollDadosOptions.onResultado`
(`RollContext.tsx`), chamado só quando a rolagem CONCLUI de verdade
(pós-animação). Já usado corretamente por: Iniciativa
(`alternarIniciativa`), Recuperar Fôlego (aplica cura real), Perícia
Inigualável (devolve uso de Inspiração condicionado à resposta do
jogador), Fúria Implacável (`FuriaImplacavelModal`, a Salvaguarda É a
própria rolagem do personagem).

**"Escolher efeito" tem 2 comportamentos coexistindo, inconsistentes:**
- **Só texto/lembrete** (nunca muda estado): Golpe Brutal
  (`finalizarEfeitosGolpeBrutal`), Ancestralidade Gigante (Golias).
- **Aplica de verdade**: Perícia Inigualável (recurso), Colheita
  Macabra do Necromante (cura um Pet escolhido).

Não existe uma regra clara hoje de QUANDO cada comportamento é
esperado — cada característica foi implementada seguindo o padrão da
característica mais parecida que já existia, sem um contrato explícito
por trás.

## 2. Os 4 formatos de rolagem (taxonomia do Osmar) — o que cada um pede

| Formato | Exemplo | Depois de rolar... |
|---|---|---|
| **Salvaguarda** | Sentido de Perigo, qualquer save vs. efeito de terceiro | Só avisa o resultado — o app não julga sucesso/falha nem muda nada sozinho, o jogador decide na mesa. |
| **Teste** | Perícia/Atributo, Iniciativa | d20 + modificadores, mesma ideia — resultado é informativo. |
| **Acerto/Erro** | Ataque com arma, Ataque de magia, Golpe Brutal | PODE encadear uma 2ª rolagem (dano) e, às vezes, uma escolha de efeito adicional — aqui que mora a ambiguidade de hoje. |
| **Cura** | Recuperar Fôlego, Fúria Implacável, Colheita Macabra | Rolagem de dado aplicada a um alvo — pode ser o próprio personagem ou outro (Pet, outro PJ). |

Achado already confirmado: **Salvaguarda/Teste já não têm o problema**
— eles nunca precisaram saber "passou ou falhou" pra fazer nada, então
o "atira e esquece" nunca incomodou aí. O problema mora inteiro em
**Acerto/Erro** (a característica pode reagir ao resultado, hoje não
reage) e um pouco em **Cura** (quando o alvo não é o próprio
personagem — como escolher/confirmar o alvo antes/depois da rolagem
ainda varia: Recuperar Fôlego é sempre "eu mesmo", Colheita Macabra
pede escolha de Pet, sem padrão comum entre os dois).

## 3. Perguntas em aberto — a resolver prototipando (Entrega B), não aqui

Este SDD propositalmente NÃO decide as respostas — a ideia do Osmar é
prototipar em baixa fidelidade primeiro e decidir ao vivo, clicando.
Perguntas que o protótipo precisa responder:

1. Pra "Acerto/Erro": o app deveria perguntar "acertou?" explicitamente
   depois da rolagem (1 toque a mais, mas o app passa a saber) ou
   continuar deixando o jogador decidir por fora e só oferecer os
   botões de dano/efeito como estão hoje (sem gating)?
2. Quando existe escolha de efeito pós-acerto (Golpe Brutal e
   parecidos futuros), ela deveria sempre aplicar algo real no app
   (nem que seja só um texto salvo no histórico/Perfil), ou tem
   espaço legítimo pra "só lembrete" quando o app genuinamente não
   modela o alvo (inimigo, sem ficha própria no app)?
3. Pra Cura em outro alvo: existe um padrão de "seletor de alvo" único
   que sirva pra Pet E outro PJ (quando isso existir), ou continuam
   sendo fluxos diferentes por natureza?
4. O mecanismo `onResultado` já existente é suficiente pra tudo isso,
   ou falta algo nele (ex: ele não decide POR SI SÓ "acertou" — só
   entrega o total).

## 4. Onde isso encosta em sistema existente (risco de colisão)

- **`RollContext.tsx`** — `RollD20Options`/`RollState`, e a lógica de
  recomputar o total em cada ponto (Vantagem escolhida depois, Bônus
  Extra, Sorte, Força Indomável) — qualquer mudança de contrato aqui
  precisa continuar funcionando com ESSAS 4 já existentes.
- **`DanoPendente.ts`** — hoje só carrega números de dano prontos;
  se "Acerto/Erro" ganhar um gate de confirmação, precisa decidir se
  esse gate vive aqui ou 1 nível acima (no painel que cria o
  `DanoPendente`).
- **`AcaoPanelContent.tsx`/`CombatTab.tsx`** — donos de hoje do
  encadeamento manual; qualquer padrão novo deveria eventualmente
  substituir a lógica ad-hoc desses arquivos (mas o retrofit completo
  fica fora desta rodada — ver PENDENCIAS.md).
- **Modais que vivem no `FichaShell`** (`ColheitaMacabraModal`,
  `FuriaImplacavelModal`) — já resolvem "escolha pós-rolagem que
  aplica de verdade" bem, mas cada um com o próprio modal dedicado;
  vale checar no protótipo se um padrão genérico substituiria os 2 sem
  perder nada.

## 5. Escopo desta rodada

Só **Golpe Brutal** recebe o retrofit de verdade (Entrega D). O
padrão validado aqui (Entregas B/C) fica documentado e disponível,
mas retrofitar Ataque normal/magia/Ancestralidade Gigante pro novo
padrão é trabalho separado, registrado em `PENDENCIAS.md` — nenhum
deles está visivelmente quebrado pro jogador hoje, só Golpe Brutal
empaca de verdade.
