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
  Lâmina). **Implementado na B3** sem precisar expor esse atributo pra
  fora: as 4 funções de ataque ganharam um parâmetro opcional
  `bonusDanoSeForca` (0 por padrão) que cada função já soma sozinha no
  `danoMod` quando decide, internamente, que o ataque usou Força —
  `FichaShell.tsx` só passa `furiaAtiva ? furiaBonusDano : 0`.
  `AtaqueResolvido`/`AtaqueInfo` não precisaram mudar de formato.

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

## 7. Golpe Brutal (nível 9) + Golpe Brutal Fortalecido (13/17) — B4.5

Nota adicionada depois (a característica se revelou mais complexa que
Bote Instintivo/Instintos Primitivos, seguindo o aviso no topo deste
arquivo).

**Regra real:** com Ataque Imprudente ativo, o jogador pode renunciar
à Vantagem em UMA jogada de ataque à sua escolha no turno. Se acertar:
+1d10 de dano (mesmo tipo da arma) e escolhe 1 efeito (Golpe
Debilitador/Poderoso). Nível 13 desbloqueia +2 efeitos (Atordoante/
Destruidor). Nível 17: dado vira 2d10 e escolhe 2 efeitos de uma vez.

**Decisões de implementação:**
- **Linha própria, não picker.** Em vez de reaproveitar o mini-picker
  "Ataque Normal/Imprudente" (que só decide 1x por turno, na 1ª
  jogada), Golpe Brutal ganhou uma linha SEPARADA "🔨 Golpe Brutal" ao
  lado de "🗡 Atacar" no painel de Ação — aparece em QUALQUER ataque do
  turno (não só o 1º) enquanto o Ataque Imprudente já estiver ativo e
  Golpe Brutal ainda não tiver sido usado nesse turno. Isso casa melhor
  com a regra real ("uma jogada à sua escolha", não necessariamente a
  1ª) e evita reabrir/complicar o picker existente.
- **Escopo aceito, fora de propósito:** não dá pra usar Golpe Brutal na
  MESMA jogada que ativa o Ataque Imprudente (o picker já rola o
  ataque direto ao escolher "Imprudente", sem devolver pra tela onde a
  linha "Golpe Brutal" apareceria). Na prática isso não trava nada —
  Bárbaro só pega Golpe Brutal no nível 9, quando Ataque Extra (nível
  5) já garante pelo menos 2 ataques por turno, então Golpe Brutal
  sempre tem uma 2ª jogada disponível pra usar.
- **Dado extra = 2º botão de dano**, mesmo padrão já usado por Badalar
  Fúnebre (`danoCondicionalDado`) — `DanoPendente` ganhou o campo
  opcional `golpeBrutal: { quantidade; lados } | null`. "🎲 Rolar Dano"
  (dano normal) e "🔨 Rolar Golpe Brutal" (dado extra) aparecem lado a
  lado; o extra some do estado assim que rolado (não dá pra rolar 2x).
- **Efeito é só texto, nunca aplicado de verdade.** O app não rastreia
  alvo/Deslocamento/status de inimigo (decisão já registrada — ver
  Backlog.md, "ferramenta de tracking de status" parada de propósito).
  Escolher um efeito só atualiza o feedback com o lembrete da regra
  pro jogador aplicar na mesa — mesmo padrão já usado pelos efeitos de
  Ancestralidade Gigante (ex.: Arrepio do Gelo).
- **Nível 13/17 distinguidos por contagem, não por nome.** "Golpe
  Brutal Fortalecido" aparece 2x na progressão (13 e 17) com o MESMO
  nome — `contarRepeticoesCaracteristica` (padrão já usado por
  Indomável/Surto de Ação) resolve pra 0/1/2, decidindo tanto o nº de
  efeitos disponíveis quanto o nº de escolhas simultâneas e o dado
  (1d10 vs 2d10).
