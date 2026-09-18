# Talentos — Fase 4 (efeito mecânico de verdade)

> Foco fechado 2026-09. Objetivo: sair do estado "talento aparece na
> ficha só como texto `[PH]`" pra "talento muda de verdade o cálculo/
> fluxo do app" — um talento por vez, sem tentar decupar os ~50 de uma
> vez. Arquitetura de referência: seção "Talentos — arquitetura final"
> em `DECISOES-CLASSES.md`.

## O mecanismo central: `EfeitoMecanicoTalento`

`data/rulesets/dnd2024/talentos.ts` tem um campo opcional
`efeitoMecanico?: EfeitoMecanicoTalento` por talento — união
discriminada por `tipo`, um variant novo por mecânica (nunca um
"catch-all" genérico). Ausência do campo = talento ainda só `[PH]`.
`core/calculoPersonagem.ts` exporta `efeitoMecanicoDoTalento(talentosAtuais,
tipo)` — varre a lista de talentos do personagem procurando o
`tipo` pedido, devolve o objeto tipado ou `null`. Praticamente todo
consumidor (ataque, proficiência, Level Up) usa esse helper em vez de
comparar por nome — nomes mudam com revisão editorial da planilha, IDs
não (CLAUDE.md seção 13).

## Grupo A — Origem (Alerta, Curandeiro, Sortudo, Iniciado em Magia)

- Motor de reroll genérico pra dado NÃO-d20 entrou no `RollContext`
  (Curandeiro reroll de 1 em cura) — reaproveitado depois por outros
  talentos.
- Substituição de Magia (Iniciado em Magia) ganhou passo próprio no
  Level Up — troca a magia de 1º círculo por outra da MESMA lista, a
  cada level-up, gaveta separada por FONTE (Origem vs. Versátil/
  Humano) porque são concessões independentes mesmo quando o mesmo
  talento aparece pelas duas — ver "Mesmo talento pego por 2 fontes
  independentes" em `DECISOES-CLASSES.md`.

## Grupo B — Geral (talentos que já existiam como `[PH]`)

- **B.0.1**: toda vez que um texto de talento na tela não vinha de
  regra confirmada (fixture/exemplo), virou prefixo `[PH]` — regra
  permanente do projeto (CLAUDE.md seção 12), não só desta entrega.
- **B.3**: Osmar decidiu adiar bônus numérico direto (ex: talentos que
  só somam um número fixo em algo) por prioridade — não é falta de
  viabilidade técnica, ficou registrado como Backlog, não Pendência.
- **B.5**: Analítico/Mente Aguçada — escolha de perícia de lista
  RESTRITA que vira proficiência OU Especialização dependendo se o
  personagem já era proficiente; mesmo talento também libera 1 ação
  genérica do Cap. 1 como Ação Bônus.
- **B.6**: Perfurador — rerollar 1 dado de dano à escolha exigiu um
  grid de dados INDIVIDUAIS clicáveis no popup de rolagem (antes só
  existia "o resultado", não "cada dado que compõe o resultado") —
  virou infraestrutura reaproveitável pro resto do motor de dado 3D
  (B4-B8 do foco "Dado 3D").

## Grupo C — Penalidades por falta de proficiência

Armadura/Escudo/Arma sem treinamento agora penalizam de verdade: CA
sem bônus do escudo, Desvantagem em D20 de Força/Destreza, bloqueio de
conjuração com a armadura errada. Motor centralizado em
`core/proficienciaArmadura.ts`/`core/proficienciaArma.ts` — consultado
por qualquer talento que CONCEDA proficiência nova (ex: Especialista
em Armaduras) sem precisar duplicar a lógica.

## Grupo D — Reaudit 2026-09 (triagem dos 19 restantes) + os 5 viáveis

Antes de implementar qualquer coisa nova, os 19 Talentos Gerais sem
`efeitoMecanico` foram triados (chapéu de Product Manager): 11 travam
estruturalmente (dependem de Deslocamento/estado de inimigo/monta/
posição — o app não modela nada disso hoje) e foram pro `Backlog.md`
com o motivo técnico específico de cada um (não um "não dá" genérico).
Os outros 5 saíram viáveis e foram implementados nesta ordem:

- **Resiliente** — `atributo-e-salvaguarda-escolhidos`: +1 num
  atributo (só entre os que o personagem ainda não é proficiente em
  Salvaguarda) + ganha essa proficiência. Não usa `ConcedeAsiTalento`
  normal (fica `'nenhum'`) — o próprio efeito já É o "+1".
- **Especialista Ambidestro** — relaxa `ataqueBonusMaoSecundaria`: com
  o talento, só a mão PRINCIPAL precisa ser Leve (a secundária só não
  pode ser Duas Mãos). Sem o talento, as duas mãos continuam
  precisando ser Leve (regra base, não mudou).
- **Mestre das Armas** — +1 slot de Maestria em Arma independente dos
  nativos, elegível pra QUALQUER arma que o personagem seja
  proficiente (`classeProficienteComArma`), não só o catálogo amplo do
  Guerreiro — mais amplo que o `armasParaMaestria()` nativo.
- **Mestre em Armas Grandes** — 2 efeitos na mesma flag: dano extra
  automático (=Bônus de Proficiência) com arma Pesada, sem limite de
  "1x/turno"; e "Cortar" (ataque bônus com a mesma arma) liberado por
  Crítico detectado sozinho (`useEffect` observando `RollContext`) OU
  confirmação manual de "reduziu a 0 PV" (o app não sabe PV do
  inimigo).
- **Mestre em Escudos** — só "Golpe de Escudo" (a Reação "Interpor
  Escudo" ficou de fora, mesma trava estrutural dos 11 do Backlog: sem
  gatilho externo de dano recebido). CD mostrada, sem rolagem de dano
  — resolver empurrar/derrubar fica na mesa, igual toda "salvaguarda-
  do-alvo" já existente (Ataque de Sopro/Lançar no Inferno).

### Bugs achados e corrigidos NO CAMINHO do Grupo D (não eram o pedido original)

- **Maestria em Arma nativa não crescia com o nível** — Guerreiro/
  Bárbaro deveriam ganhar mais slots nos níveis 4/10/16, mas o app
  nunca chamava `quantidadeMaestriaEmArma(classe, novoNivel)` no Level
  Up; ficava travado no valor da criação pra sempre. Corrigido com um
  passo novo condicional (só entra quando o total realmente CRESCEU
  nesse nível) reaproveitando `useEscolhaMultipla` com os itens já
  escolhidos travados.
- **Troca de Maestria em Arma sem limite nenhum** — o ícone 🔄 (nativo
  e o do talento Mestre das Armas) sempre esteve clicável à vontade;
  já era uma simplificação assumida e documentada (não um bug
  silencioso), mas contradizia a regra real ("1x por Descanso Longo").
  Corrigido com 2 flags independentes (`(talento)?maestriaArmaTrocaDisponivel`),
  padrão generalizável registrado em `DECISOES-CLASSES.md` pra
  qualquer "troca 1x por Descanso" futura.

## Padrão validado repetidas vezes neste foco

Toda decisão de UI/regra nova passou por aprovação explícita ANTES de
codar (CLAUDE.md seção 6.4) — inclusive achados no meio do caminho
(ex: a pergunta sobre a regra de confirmação de crítico foi resolvida
lendo o PDF, não assumindo). Nenhuma entrega deste foco pulou o
checklist `tsc -b`/`npm test`/`npm run build` antes de publicar.

## O que ficou de fora (ver `PENDENCIAS.md`)

Os 23 talentos/Estilos de Luta implementados ANTES desta fase (antes
do sistema de `efeitoMecanico` amadurecer) nunca passaram por uma
validação de UI dedicada — só revisão de código confirmou que
continuam coerentes com Multiclasse/B7/B8. Fica registrado como
pendência de validação manual, não um bug conhecido.
