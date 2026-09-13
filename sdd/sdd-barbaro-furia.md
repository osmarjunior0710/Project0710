# SDD — Bárbaro: Fúria (motor central da classe)

> Chapéu de Game Designer (CLAUDE.md §6.2), foco "Bárbaro". Cobre só a
> característica de nível 1 (Fúria) — a peça genuinamente nova do
> motor de cálculo. O resto da progressão base (B4) e as 4 Trilhas
> (B5-B8) são características mais simples (bônus passivo, escolha
> numa lista, Reação pontual) e não precisam de SDD próprio; qualquer
> uma delas que se revelar mais complexa na hora ganha uma nota aqui
> depois.

## 1. Regra real (Livro do Jogador, Cap. 3, p.51-53)

**Ativar:** Ação Bônus, 1 uso do banco "Fúrias" (2 no nível 1, cresce
até 6 no nível 20 — ver `Progressão de Classe` na planilha, coluna
"Fúrias"). Recupera 1 uso no Descanso Curto, todos no Descanso Longo.
Não pode ativar vestindo Armadura Pesada.

**Enquanto ativa:**
- Resistência a dano Contundente, Cortante e Perfurante.
- "Dano da Fúria": todo ataque com Força (arma ou Desarmado) que
  acerta ganha um bônus de dano fixo (+2 no nível 1, cresce pra +3 no
  9, +4 no 17 — coluna "Dano da Fúria" na planilha/tabela do livro).
- Vantagem em testes de Força e salvaguardas de Força.
- Não pode manter Concentração nem conjurar magias.

**Duração — a parte nova pro motor do app:** dura até o final do
PRÓXIMO turno do Bárbaro. Se ainda estiver ativa nesse turno seguinte,
**estende automaticamente por +1 turno** quando o jogador faz QUALQUER
uma destas 3 coisas nesse turno: (a) uma jogada de ataque contra um
inimigo; (b) força um inimigo a fazer uma salvaguarda; (c) uma Ação
Bônus dedicada só a estender. Se nenhuma das 3 acontecer, a Fúria
encerra sozinha no fim daquele turno. Termina IMEDIATAMENTE (não
espera o fim do turno) se o Bárbaro vestir Armadura Pesada ou ficar
com a condição Incapacitado.

**Nível 15 (Fúria Persistente) muda a regra:** a Fúria passa a durar
10 minutos inteiros, sem precisar de nenhuma ação pra estender — só
termina com Inconsciente (não só Incapacitado) ou Armadura Pesada.
Esse nível já sinaliza que a regra de "precisa agir pra manter" é
tratada pelo próprio livro como o caso especial, não o padrão — o
Bárbaro comum (nível 1-14) é quem precisa da lógica de extensão.

## 2. O que já existe no motor do app (`core/`, `FichaShell.tsx`)

- Economia de ação: `turnState: {acao, bonus, reacao}` — cada um
  'disponivel'/'usada', virando 'usada' via `marcarUsado(categoria)`
  quando o jogador escolhe algo no painel daquela categoria.
- **Não existe** nenhum conceito de "turno numerado" nem "o que
  aconteceu nesse turno especificamente" além do estado Ativo/Usada
  dos 3 slots — o app não sabe se a Ação usada foi um ATAQUE
  especificamente (ex.: "Analisar" também marca `acao` como usada).
- `onFimDoTurno` já é o evento explícito que a seção "Estado
  'temporário' de turno precisa persistir" do `DECISOES-COMBATE.md`
  descreve — reseta `turnState`/`surtoUsadoTurno`. É o ponto natural
  pra avaliar "a Fúria se estendeu ou não neste turno".
- Recursos "gasta e recupera" já têm o padrão pronto
  (`recursoContado`/`recursoFlagUnica`, G3.2) — Fúrias (o banco de
  usos) encaixa direto em `recursoContado`. O ESTADO "ativa agora"
  (`furiaAtiva: boolean`) é um campo novo, não coberto por esse hook
  (não é "gasto", é "ligado/desligado").
- Descanso Curto/Longo já têm um list de campos resetados um por um
  (ver Backlog.md sobre isso) — Fúrias entra nessa lista do jeito
  de sempre (recupera 1 no Curto, todos no Longo).

## 3. Decisão de design necessária — 2 caminhos pra "estender"

O app não tem um jeito de saber, de forma confiável, se o jogador
"fez uma jogada de ataque contra um inimigo" num turno — só sabe que
a categoria Ação/Bônus/Reação foi marcada como usada, sem saber SE
foi um ataque. Isso deixa 2 caminhos honestos:

**Caminho A — Simplificado (recomendado):** a Fúria fica ativa até o
jogador desligar manualmente (botão "🔥 Encerrar Fúria" sempre visível
enquanto ativa) OU até um dos encerramentos automáticos (Armadura
Pesada, Incapacitado — este último já não é rastreado pelo app hoje,
então na prática só o de Armadura Pesada é forçável de verdade; o de
Incapacitado fica textual/manual, mesmo tratamento que outras
condições já recebem no app). Não tenta detectar "atacou nesse turno"
— confia que o jogador só mantém a Fúria ligada enquanto faz sentido
narrativamente (na mesa de verdade, quase todo Bárbaro em Fúria ataca
todo turno; a regra de "precisa agir" existe no livro pra evitar abuso
que não é um problema real numa ficha de 1 jogador). Menor esforço de
implementação, ZERO falso-negativo (nunca encerra a Fúria à revelia do
jogador por engano), e o encerramento automático nos casos raros de
verdade fica marcado no texto — sem "detectar" nada.

**Caminho B — Fiel à regra:** ao pressionar "Fim do Turno", o app
pergunta (ou verifica algum sinal já registrado, tipo `turnState.acao`
usada) se alguma das 3 condições de extensão aconteceu; se não, encerra
a Fúria sozinha. Exige inventar um jeito de capturar "isso foi um
ataque" (ou "isso foi uma salvaguarda forçada") separado de "a
categoria Ação foi usada" — que hoje não existe (Ações genéricas do
Cap. 1 tipo "Analisar" também marcam Ação como usada, mas não são
ataque). Ou then perguntar direto ao jogador toda vez ("Atacou, forçou
salvaguarda ou usou Ação Bônus pra estender, neste turno?") — mais
fiel, mas 1 pergunta extra em TODO turno de todo Bárbaro, mesmo
quando na prática ele quase sempre vai responder "sim".

**Recomendação:** Caminho A. Mais simples de construir, sem fricção
de UI extra a cada turno, e o "abuso" que a regra real evita (manter
Fúria de graça sem fazer nada) não é um risco real numa ficha
individual sem oponente simulado. Fica registrado aqui pra o Osmar
confirmar ou pedir o Caminho B.

## 4. Estados e campos (rascunho, ainda sujeito ao chapéu de UI)

- `furiaGasto: number` — usos gastos do banco de Fúrias (via
  `recursoContado`, igual aos outros recursos "gasta e recupera").
- `furiaAtiva: boolean` — liga ao ativar (Ação Bônus, gasta 1 uso),
  desliga ao "Encerrar Fúria" manual ou vestir Armadura Pesada.
- Enquanto `furiaAtiva`: aplicar Resistência (Contundente/Cortante/
  Perfurante) — mesmo texto/exibição já usada pra outras resistências
  no app (verificar como Resistência a dano já é mostrada em outro
  lugar, se houver precedente); somar bônus de "Dano da Fúria" a
  qualquer rolagem de dano de ataque baseado em Força (arma ou
  Desarmado) — precisa achar onde o app decide "esse ataque usa
  Força" (`core/ataque.ts`?) pra saber onde encaixar o bônus; mostrar
  Vantagem disponível em testes/salvaguardas de Força (like outros
  "toggle de vantagem" já existentes); bloquear/avisar concentração e
  conjuração enquanto ativa (o app já impede conjurar sem espaço, mas
  não tem conceito de Concentração — checar se algum sistema de
  Concentração já existe antes de inventar um).
- Vestir Armadura Pesada com Fúria ativa precisa desligar
  `furiaAtiva` — depende de onde o app já sabe "isso é Armadura
  Pesada" (Mochila/Equipamento) e se dá pra ganchar um efeito colateral
  na hora de equipar.

## 5. Pesquisado e já resolvido (não precisa perguntar)

- **Concentração:** o app não tem NENHUM sistema de Concentração hoje
  (nem em magia normal) — só menções em texto de descrição de item/
  magia. "Sem Concentração ou Magias" da Fúria fica só textual (aviso
  na descrição da característica), mesmo tratamento de outra regra
  real sem mecânica própria ainda — não é uma lacuna nova criada pelo
  Bárbaro, é consistente com o resto do app.
- **"Dano da Fúria" é automatizável:** `core/ataque.ts`
  (`ataqueComArma`/`ataqueDesarmado`) já calcula, internamente, se o
  ataque usa Força, Destreza ou um atributo forçado (Acuidade/Pacto da
  Lâmina) — só não EXPÕE essa escolha pra fora hoje (`AtaqueResolvido`
  só devolve os números já somados). Pra somar o bônus da Fúria
  automaticamente, `AtaqueResolvido`/`AtaqueInfo` precisam expor um
  campo tipo `atributoUsado` — detalhe de implementação da entrega
  B3, não uma decisão de produto.

## 6. Decisões confirmadas com o Osmar

1. **Extensão: Caminho A (Simplificado).** A Fúria fica ativa até o
   jogador apertar "Encerrar Fúria" ou vestir Armadura Pesada — o app
   não tenta detectar "atacou/forçou salvaguarda neste turno". Duração
   real de 10 minutos (Fúria Persistente, nível 15) vira o
   comportamento PADRÃO desde o nível 1, na prática — a única
   diferença mecânica de nível 15 que sobra é a condição de fim virar
   Inconsciente em vez de Incapacitado (textual, sem mecânica de
   condições no app hoje).
2. **UI: card fixo + ativar no painel Bônus.** Ativar (gasta 1 uso do
   banco de Fúrias) continua dentro do painel Ação Bônus, mesmo padrão
   dos outros recursos "gasta e recupera". Um card fixo, sempre
   visível na tela principal de Combat (mesmo padrão visual de
   "Indomável"/"Pontos de Sorte"), mostra "🔥 Fúria: ATIVA" + os bônus
   ativos (resistência, dano, vantagem em Força) + botão "Encerrar
   Fúria" enquanto ativa.
