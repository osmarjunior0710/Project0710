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

## 3. Decisão final — Acerto/Erro (validada no protótipo, ver DECISOES-COMBATE.md)

Prototipado em `/prototipo/acerto-erro` (4 rodadas — as telas
separadas das 3 primeiras variantes quebravam a sensação de "popup de
verdade"; a versão final estende o `RollOverlay` real em vez de
cloná-lo). **Padrão definitivo, registrado por completo em
`DECISOES-COMBATE.md` "Fluxo Acerto/Erro"** — resumo das respostas às
perguntas originais:

1. **O app pergunta "Acertou?" de verdade** — `RollD20Options.confirmarAcerto`
   troca ✕/tap-fora por botões "Errei"/"Acertei" no popup de ataque.
2. **Escolha de efeito continua só lembrete de texto** (decisão antiga
   confirmada, não mudou) — o que mudou foi o CAMINHO até a escolha:
   `RollDadosOptions.confirmarFechamento` (OK simples ou botão com nome
   da característica) encadeia num modal próprio
   (`EscolherEfeitoModal.tsx`) com as opções em `opt-card`.
3. **Cura em outro alvo — ainda não resolvido**, ver seção 6 abaixo
   (fora do escopo desta rodada).
4. **`onResultado` continua o mecanismo certo** pra "reagir ao valor
   rolado" (cura, Iniciativa) — `confirmarAcerto`/`confirmarFechamento`
   são complementares a ele, não substitutos: resolvem "o jogador
   precisa DECIDIR algo antes de prosseguir", não "o app precisa
   REAGIR a um número".

## 6. Formatos ainda sem prototipar (Teste)

Teste segue confirmado como "sem o problema" (seção 2) — não vale a
pena gastar rodada de protótipo nele. **Salvaguarda da seção 2
("Sentido de Perigo, qualquer save vs. efeito de terceiro" — o
PRÓPRIO personagem rolando) também segue sem o problema.**

**Cura — resolvido sem protótipo (2026-09, pedido direto do Osmar):**
"Curar outro"/"Me curar" (`RollDadosOptions.confirmarAlvoCura`, ver
`DECISOES-COMBATE.md` "Fluxo Acerto/Erro" item 4) aplicado direto às
curas que hoje eram "atira e esquece" (magia de cura genérica, Mãos
Curativas). Continua em aberto só a pergunta mais estreita de "seletor
de QUAL outra criatura" (Pet vs. outro PJ) — "Curar outro" nesse
padrão não pergunta quem, só fecha; quem precisa saber quem (Colheita
Macabra) continua com o próprio modal dedicado. Ver `PENDENCIAS.md`.

**Salvaguarda do Alvo — formato NOVO, achado em 2026-09, diferente do
"Salvaguarda" da seção 2:** é o alvo (inimigo/NPC) que salva contra
uma magia/característica SUA (Ataque de Sopro, Lançar no Inferno,
magia com `mecanica === 'salvaguarda'`, Golpe de Escudo), não o
próprio personagem — esse SIM tem o problema "atira e esquece" (o
botão de dano sempre rola cheio, mesmo quando o texto diz "Metade do
dano" no sucesso). Travado por 2 motivos, ver `PENDENCIAS.md`
"Salvaguarda do Alvo": (1) reconhecer "sucesso = metade/nenhum/cheio"
pras magias genéricas precisa de coluna/ID estável na planilha, ainda
não existe; (2) o cálculo de "metade do dano" em si (arredondamento,
como mostrar) vai primeiro pro `/prototipo` — Osmar pediu validar a
UX antes de formalizar, mesmo processo do Acerto/Erro original.

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

## 5. Escopo desta rodada — retrofit completo (2026-09)

Golpe Brutal recebeu o retrofit primeiro (Entrega D, foco original).
Depois, com Esmagador/Talhador (branch principal) generalizando o
padrão pro "Atacar" normal, o Osmar pediu o retrofit completo: "o
fluxo do protótipo de ataque vira o fluxo pra tudo". Cobertura final —
ver `DECISOES-COMBATE.md` "Fluxo Acerto/Erro" e "Esmagador/Talhador/
Ancestralidade Gigante": Ataque normal, Ataque Bônus (mão secundária),
Cortar, ataque de magia (3 painéis) e Ancestralidade Gigante (só no
ataque principal, ver `Backlog.md`) — todos sempre Acerto/Erro, nunca
mais "atira e esquece". `DanoPendente`/botão "Rolar Dano" removidos
por completo, sem uso restante.
