# SDD — Bárbaro: Trilha do Berserker (2ª subclasse)

> Chapéu de Game Designer (CLAUDE.md §6.2), foco "Bárbaro — Trilha do
> Berserker". Planilha (aba Subclasses) cruzada com o Livro do Jogador
> (Cap. 3, p.55) — sem divergência de conteúdo, só os 2 bugs de
> extração de sempre (ver seção 1).

## 1. Regra real e correções de dado

- **Frenesi** (nível 3): "Se você usar Ataque Imprudente enquanto sua
  Fúria estiver ativa, você causa dano adicional ao primeiro alvo
  atingido no seu turno com um ataque baseado em Força. Para
  determinar o dano adicional, jogue um número de d6s igual ao seu
  bônus de Dano da Fúria e some os resultados. O dano tem o mesmo tipo
  da arma ou do Ataque Desarmado utilizado."
- **Fúria Irracional** (nível 6): "Você tem Imunidade às condições
  Amedrontado e Enfeitiçado enquanto sua Fúria estiver ativa. Se você
  estiver sob efeito de uma dessas condições ao entrar em Fúria, a
  condição encerra."
- **Retaliação** (nível 10): "Quando você sofrer dano de uma criatura
  que esteja a até 1,5 metro de você, pode executar uma Reação para
  realizar um ataque corpo a corpo contra essa criatura, usando uma
  arma ou um Ataque Desarmado." Planilha marcou "Tipo de Ação" como
  Passiva/Estática — errado, corrigido pra "Reação" (mesmo ajuste já
  feito em Ramos da Árvore/Palavras de Interrupção). **Sem exigir
  Fúria ativa** — diferente de Ramos da Árvore, o texto não menciona
  Fúria em nenhum momento.
- **Presença Intimidante** (nível 14): "Como uma Ação Bônus, você pode
  causar terror em outros... cada criatura à sua escolha em uma
  Emanação de 9 metros originada de você deve realizar uma salvaguarda
  de Sabedoria (CD 8 + mod. Força + Bônus de Proficiência). Se falhar,
  Amedrontado por 1 minuto. No final de cada turno da criatura
  Amedrontada, ela repete a salvaguarda... Uma vez usada, só recupera
  no Descanso Longo, a menos que gaste um uso de Fúria (nenhuma ação
  necessária) pra restaurar o uso." Planilha tinha a legenda de margem
  "Subclasse Trilha do Berserker" colada no fim da célula — confirmado
  como artefato de página no PDF (mesmo bug de Raízes Devastadoras),
  cortado na importação.

## 2. O que já existe no motor (reaproveitar, não reinventar)

- `ataqueImprudenteAtivo` + `furiaAtiva` + `furiaBonusDano` — já
  existem em `FichaShell.tsx`/`CombatTab.tsx`, prontos pra Frenesi.
- `ataquesFeitos` (contador, reseta no Fim do Turno) — já diz se um
  ataque é o "1º do turno" (checar `=== 0` ANTES de incrementar).
- `core/ataque.ts` já resolve, internamente, se um ataque usa Força
  (`bonusDanoSeForca` já é somado condicionalmente — mesmo mecanismo
  que aplica o bônus de Dano da Fúria hoje). Frenesi soma UM DADO
  extra (não um modificador fixo), então não cabe no parâmetro
  `bonusDanoSeForca` (que é um número fixo já resolvido) — precisa de
  um dado extra somado na hora de rolar o DANO (não o acerto),
  parecido com o padrão já usado por Golpe Brutal (`DanoPendente`
  ganha um campo opcional pro dado extra) ou Badalar Fúnebre
  (`danoCondicionalDado`).
- `explicarCdGolpeDeEscudo`/`explicarCdRamosDaArvore` (fórmula
  8+FOR+Prof) — mesma fórmula de Presença Intimidante, mas o atributo
  da salvaguarda do ALVO muda (Sabedoria, não Força) — só o
  parâmetro `atributo` do `SalvaguardaDoAlvoModal` muda, CD igual.
- `recuperarFuriaPersistente()` já é precedente de "gastar/zerar um
  recurso mexe em OUTRO recurso" — Presença Intimidante precisa do
  sentido oposto (gastar 1 uso de Fúria pra destravar Presença
  Intimidante), mesmo espírito, direção invertida.
- **"Ataque de Oportunidade"** já existe no painel de Reação hoje —
  mas é só um card INFORMATIVO (`onEscolher` com texto, sem rolar
  nada), porque é uma regra universal (todo mundo já tem, sem cálculo
  de personagem específico envolvido). Retaliação é diferente: usa o
  ataque de VERDADE do personagem (a mesma arma/bônus que "🗡 Atacar"
  já calcula) — vale a pena ser interativo de verdade (o app existe
  pra rolar esse cálculo certo), não só um lembrete.

## 3. Decisões de leitura (sem mecânica nova pro app, confirmado com o Osmar — não precisa reconfirmar)

- **Fúria Irracional vira só texto** — o app não rastreia condições
  do personagem (Amedrontado/Enfeitiçado/etc.) em lugar nenhum hoje;
  não é uma lacuna nova, é consistente com todo o resto (ex.:
  Movimento Rápido, Concentração). Aparece normal no Perfil, sem
  card/toggle em lugar nenhum.
- **Presença Intimidante não repete a salvaguarda por criatura** — o
  app não segue NPCs turno a turno (mesmo limite já aceito pra
  qualquer efeito de área/status do app, ex. Golpe Brutal). O popup
  mostra CD + efeito (Falha: Amedrontado 1 min, repete salvaguarda no
  fim do turno DELA, sucesso encerra; Sucesso: nada) — o jogador
  acompanha a repetição na mesa, fora do app.

## 4. Decisões de implementação (chapéu de execução decide o detalhe fino por entrega)

- **Frenesi:** dado extra (Xd6, X = bônus de Dano da Fúria) somado à
  rolagem de dano SÓ quando `ataqueImprudenteAtivo && furiaAtiva &&
  ataquesFeitos === 0` no momento do acerto, e só no ataque PRINCIPAL
  (com arma/Desarmado baseado em Força — o mesmo ataque que já
  calcula `bonusDanoSeForca`). Automático (não é escolha do
  jogador) — soma direto na fórmula de dano que já vai rolar, sem
  botão extra.
- **Retaliação:** card na Reação (disponível nível 10+, **sem**
  checar Fúria) que dispara o MESMO fluxo de rolagem de ataque
  (Vantagem/Desvantagem, confirmarAcerto → dano) já usado por "🗡
  Atacar" no painel de Ação, com a arma corpo a corpo equipada (ou
  Ataque Desarmado). Consome o slot genérico de Reação do turno ao
  abrir (`onMarcarUsado('reacao')`), mesmo padrão de Ramos da Árvore.
- **Presença Intimidante:** card na Ação Bônus (nível 14+, sem
  checar Fúria — a característica em si não exige) que abre o popup
  de salvaguarda (Sabedoria, CD 8+FOR+Prof, Falha/Sucesso conforme
  regra). 1x por Descanso Longo (`recursoFlagUnica`, campo próprio) +
  botão extra "recarregar gastando 1 uso de Fúria" quando já usada e
  ainda sobra uso de Fúria — mesmo princípio de
  `recuperarFuriaPersistente`, mas gastando um uso em vez de zerando.

## 5. Quebra em entregas

1. **Entrega 1** — Dado no banco: as 4 características em
   `caracteristicasSubclasse.ts`, com as 2 correções (Presença
   Intimidante sem a legenda colada, Retaliação com `tipoAcao`
   "Reação"). Confirma Trilha selecionável + Perfil.
2. **Entrega 2** — Frenesi: dano extra automático no 1º acerto do
   turno com Ataque Imprudente + Fúria ativos.
3. **Entrega 3** — Retaliação: card de Reação com ataque de verdade
   (reaproveitando o motor de ataque existente).
4. **Entrega 4** — Presença Intimidante: card de Ação Bônus com CD +
   salvaguarda de Sabedoria + recarga via uso de Fúria.
5. **Entrega 5** — Fechamento: testes/tsc/build,
   `aprendizados/classes/barbaro.md` atualizado, `PENDENCIAS.md`
   "Bárbaro — Trilhas" perde o Berserker da lista (Coração
   Selvagem/Fanático continuam on hold).

(Fúria Irracional não tem entrega própria — só texto, cobre com a
Entrega 1, mesmo padrão de Raízes Devastadoras.)
