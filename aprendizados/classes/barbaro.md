# Bárbaro — histórico de implementação

> Arquivo de arquivo/referência do foco "Bárbaro" (5ª classe do
> projeto, depois de Guerreiro/Bardo/Bruxo/Mago) — parte do sistema
> `aprendizados/` (ver `aprendizados/INDICE.md` e a seção 7.2 do
> `CLAUDE.md`). Guarda o processo de construção completo (quebras,
> decisões, bugs achados/corrigidos) que não precisa virar padrão
> permanente em `DECISOES-CLASSES.md` — só o que é específico desta
> classe. Padrão que generalizou pra qualquer classe futura foi
> promovido pra `DECISOES-CLASSES.md`/`DECISOES-FICHA.md` (linkado
> abaixo, quando existir).
>
> **Status ao fechar este foco (2026-09):** classe base nível 1-20
> completa e testada (B1-B4.10). As 4 Trilhas (subclasses) ficaram
> **deliberadamente em aberto** — ver "O que ficou pendente" no final.

---

## Contexto e fontes usadas

Osmar não tinha em mãos, no momento desta implementação, a decupagem
externa do Bárbaro nem o guia de Golias que ele mencionou ter em
documentos próprios (ver `PENDENCIAS.md` "Faltam 10 classes") — a
implementação seguiu só com a planilha mestra (progressão completa +
as 4 Trilhas já cadastradas) e o Cap. 3 do Livro do Jogador (PDF
`04a_-_Cap_3_Classes_de_Personagem_Barbaro_a_Feiticeiro.pdf`).

SDD da Fúria (único sistema que precisou de documento próprio):
`sdd/sdd-barbaro-furia.md` — decisão central: **Caminho Simplificado**,
Fúria fica ativa até "Encerrar Fúria" ou vestir Armadura Pesada, sem
tentar detectar "atacou neste turno" (a regra real tem essa condição
de manutenção, simplificada de propósito).

## Dado no banco (B1) e habilitação no wizard (B2)

`classes.ts` ganhou a progressão 1-20 (recursos Fúrias/Dano da
Fúria/Maestria em Arma), `caracteristicasClasse.ts` as 20
características base (3 células precisaram limpar conteúdo de outra
aba da planilha colado dentro — Maestria em Arma/Conhecimento
Primordial/Campeão Primitivo), `subclasses.ts` as 4 Trilhas só com
nome/id. Achado à parte: `ClasseStep.tsx` tinha uma lista hardcoded
(`CLASSES_EM_BREVE`) desatualizada com "Mago" duplicado — corrigida
junto.

Habilitado na criação (B2): 2 perícias à escolha, equipamento A/B reais.
**2 bugs pré-existentes expostos pela primeira classe marcial de
verdade** (nenhuma classe implementada antes tinha essas
características):
- `armasParaMaestria` devolvia o catálogo de armas INTEIRO (incluindo
  à distância) pra qualquer classe com "Simples e Marciais" — certo
  pro Guerreiro, errado pro Bárbaro (característica real restringe a
  Corpo a Corpo). Filtrado por classe.
- CA sem armadura nunca somava Constituição (`10 + DES + CON`, "Defesa
  sem Armadura") — só existia `10 + DES` até então. Novo ID estável
  `ID_CARACTERISTICA_CLASSE.defesaSemArmadura` + `temDefesaSemArmadura`.

## Motor de Fúria (B3, B3.1)

`core/recursosClasse.ts`: `quantidadeFuria`/`bonusDanoFuria`.
`core/ataque.ts`: parâmetro `bonusDanoSeForca` nas 4 funções de
ataque — soma sozinho quando o ataque usa Força de verdade (nunca à
distância; em Acuidade só quando Força ≥ Destreza; nunca com
`atribForcada`, ex. Pacto da Lâmina do Bruxo). `usarFuria()` no
`FichaShell` (toggle com banco contado + trava de Armadura Pesada pra
ATIVAR); equipar Armadura Pesada com Fúria ativa encerra sozinha.
Card fixo sempre visível no Combate (decisão de UI já confirmada antes
de codar) mostrando estado + botão "Encerrar Fúria".

B3.1 (feedback de UI testando no celular): texto dos efeitos quebrado
em 3 linhas em vez de parágrafo único; botão "Encerrar Fúria" com
`.btn` padrão + destaque vermelho; vinheta vermelha pulsante nas bordas
da tela enquanto ativa (`position: fixed`/`pointer-events: none`,
mesmo raciocínio do `.piscadaOverlay` já existente).

## Fundação: Salvaguardas de verdade (B4.0)

Achado ao planejar o resto do B4: o app nunca distinguia "teste de
atributo" de "salvaguarda" — o box FOR/DES/.../CAR sempre rolava só o
mod., nunca somando Bônus de Proficiência mesmo pra classe proficiente
naquela salvaguarda. Pré-requisito estrutural pro resto do Bárbaro
(Sentido de Perigo, Força Indomável, Vantagem de Força da Fúria).
`core/calculoPersonagem.ts` ganhou `calcularSalvaguardas` (+ tipo
`SalvaguardaFinal`) — soma Bônus de Proficiência só quando a
**classeOriginal** (nunca classe extra de multiclasse) tem aquela
salvaguarda, confirmado nos PDFs (Cap. 2 "Multiclasse"). `AtributosTab.tsx`
ganhou 6 linhas novas de Salvaguarda, mesmo padrão de linha/rolagem/popup
que Perícias já tinham.

## Ataque Imprudente + Sentido de Perigo (B4.1)

**Regra de processo nova a partir daqui** (pedido do Osmar): toda
entrega passa por proposta técnica + "ok" antes de codar (formalizado
depois na seção 6.4 do `CLAUDE.md`).

Ataque Imprudente: decidido só na 1ª jogada de ataque do turno
(mini-picker in-panel "Ataque Normal"/"Ataque Imprudente", mesmo padrão
já usado pela Revelação Celestial do Bruxo); ativo o turno inteiro,
reseta no Fim do Turno. Sentido de Perigo: Vantagem passiva na
Salvaguarda de Destreza.

**`resolverVantagem` nasceu aqui** (`core/calculoPersonagem.ts`) —
combina 2 fontes de Vantagem/Desvantagem numa rolagem só (se
coincidirem, se cancelam, regra real). 1ª vez que o app precisou disso
(Ataque Imprudente/Sentido de Perigo podem coincidir com Desvantagem
de Armadura sem treino) — reaproveitado depois por Instintos
Primitivos (B4.4) e virou padrão geral pra qualquer combinação futura
de 2 fontes de (des)vantagem.

## Conhecimento Primordial (B4.2, B4.2.3)

Perícia extra à escolha + usar Força no lugar do atributo normal em 5
perícias específicas enquanto a Fúria estiver ativa.
`calcularPericias` ganhou `substituicaoForca?: { ativa, mod, pericias }`.

**Correção de regra depois de testar (B4.2.3):** a implementação
original trocava sempre que a Fúria estava ativa, mesmo quando o
atributo normal era melhor (ex.: DES +2 vs. FOR +1 → ficava com o
pior). O texto real diz "**pode** realizá-lo como teste de Força" —
escolha do jogador a cada rolagem. Decisão do Osmar: em vez de
perguntar a cada rolagem (fiel à regra, mas fricção extra), usa sempre
o MAIOR mod. entre o normal e Força — ninguém escolheria o pior de
propósito, mesmo resultado prático sem o toque a mais. **Confirmado
como funcionando certo depois de publicado** (verificado a pedido do
Osmar: "você lembrou que bárbaro em fúria com conhecimento primal rola
força em alguns testes que não são de força?" — sim, e corretamente).

## Bug: subclasse sem NENHUMA opção implementada travava o Level Up (B4.2.1, B4.2.2)

O Bárbaro foi a primeira classe a chegar no nível de escolha de
subclasse com **zero** Trilhas implementadas ao mesmo tempo (as
anteriores sempre tinham pelo menos 1 subclasse pronta) — expôs que o
passo de escolha de subclasse no Level Up travava o "Avançar" mesmo
quando TODAS as opções estavam com mecânica ausente. Corrigido pra só
entrar na sequência (`luSteps`) quando sobra pelo menos 1 subclasse
`subclasseImplementada`; mesmo filtro aplicado ao sorteio de "🎲
Personagem de Teste" (só "⚡ Inst. Level Up" já filtrava certo antes).

**Isso generalizou** — virou a decisão permanente registrada em
`DECISOES-CLASSES.md` ("Escolha de subclasse — trava o passo..."),
substituindo uma decisão de 2026-08 que dizia o oposto (a UI já tinha
divergido da decisão antiga antes do Bárbaro expor o bug de verdade).

## Ataque Extra, Movimento Rápido, Bote Instintivo (B4.3, B4.4 parte 1)

Confirmados funcionando sem código novo — Ataque Extra já é resolvido
pelo mecanismo genérico por ID (`numeroDeAtaques`); Movimento Rápido e
Bote Instintivo são só textuais porque o app não rastreia Deslocamento
numérico do personagem (só de Pets) — a descrição real já aparece na
aba Perfil sem nada especial.

## Instintos Primitivos (B4.4 parte 2)

Vantagem em Iniciativa — novo `temInstintosPrimitivos`, combinado com
`desvantagemForcaDestreza` via `resolverVantagem` (já existia desde
B4.1).

## Golpe Brutal + Golpe Brutal Fortalecido (B4.5)

Detalhe completo já vive em `sdd/sdd-barbaro-furia.md` seção 7 (não
duplicado aqui). Resumo: linha "🔨 Golpe Brutal" no painel de Ação,
disponível em qualquer ataque do turno (não só o 1º) enquanto Ataque
Imprudente já estiver ativo, 1x/turno; renuncia à Vantagem nessa
jogada; 2º botão de dano "🔨 Rolar Golpe Brutal"; depois de rolar, abre
um picker de efeito (Debilitador/Poderoso desde nível 9, +
Atordoante/Destruidor no 13, escolhe 2 e dado vira 2d10 no 17).

**Pendência conhecida, deixada de propósito (ver `PENDENCIAS.md`):** o
efeito escolhido (Debilitador/Poderoso/etc.) não aplica nada de
verdade no alvo — o app não rastreia alvo/status de inimigo (decisão
já registrada em `Backlog.md`). Feedback do Osmar ao testar: "quero
golpe brutal e o golpe fortalecido tem um efeito a ser escolhido
depois de acertar o ataque e não tem isso no sistema" — travado
numa revisão maior do fluxo de d20 que serve pra outras
características parecidas também, não só esta.

## Fúria Implacável (B4.6)

O gatilho "chegou a 0 PV" já existia — Vigor Implacável (traço de Orc)
já resolvia isso dentro de `alterarPv`, reaproveitado o mesmo formato.
Novo `core/furiaImplacavel.ts`: `deveOferecerFuriaImplacavel`,
`cdFuriaImplacavel` (10 + 5×tentativas desde o último descanso, passe
ou falhe), `pvFuriaImplacavel` (2× nível NA CLASSE Bárbaro).
`FuriaImplacavelModal.tsx` (mesmo padrão visual de `ColheitaMacabraModal`
do Necromante) com 2 fases: oferta (rola a Salvaguarda de verdade,
reaproveitando `rolarD20` — ganha Sorte/Inspiração Heroica de graça) e
resultado. Diferente de uma salvaguarda-vs-CD de OUTRA criatura (onde o
app só mostra a CD e deixa o jogador dizer o resultado), aqui a
Salvaguarda É a rolagem do próprio personagem, então resolve sozinho.

## Fúria Persistente (B4.7, B4.7.1)

"Recupera todos os usos gastos de Fúria ao rolar Iniciativa, só 1x até
Descanso Longo" — em vez de travar a oferta no instante exato de rolar
Iniciativa (exigiria popup novo), virou botão sempre visível no card de
Fúria, condicionado a 3 flags (tem a característica, já gastou ≥1 uso,
ainda não usou desde o último Descanso Longo). Zero função nova em
`core/` — só estado + condição.

B4.7.1 (pedido do Osmar testando no celular): painel de Bônus ganhou
contador de pips ("Fúria: 🔴🔴🔴🔴🔴🔴 N/M") acima do toggle, mesmo
padrão que outros recursos já tinham. Novo variante `vermelho` em
`TickPips.tsx`, generalizado pra qualquer recurso futuro com tema
vermelho.

## Força Indomável (B4.8)

**Achado de design importante, corrigido ANTES de codar:** não é
reroll — é substituição direta do total pelo valor bruto de Força
quando o total sair menor. Minha proposta inicial tinha um botão
manual (padrão de Sorte/Inspiração Heroica); o Osmar corrigiu: "por que
teria opção, se o jogador nunca ia recusar?" — sempre vantajoso, sem
custo, deve aplicar sozinho.

`core/forcaIndomavel.ts` (`deveAplicarForcaIndomavel`, pura).
`RollContext.tsx` ganhou `permiteForcaIndomavel` + `registrarForcaIndomavel`
— a substituição roda em TODO ponto que recalcula o total de um d20
(conclusão inicial, Vantagem/Desvantagem escolhida depois, Bônus Extra,
Sorte, Inspiração Heroica) — nunca "sticky", reavalia do zero a cada
vez (confirmado com Playwright: 2º dado exatamente igual ao valor de
Força NÃO aplica, porque a regra é "menor que", não "menor ou igual").

**Padrão pra lembrar em qualquer futura "swap automático sem escolha
do jogador":** perguntar antes de propor UI com botão — se o resultado
é estritamente melhor sem trade-off nenhum, a resposta certa é
automático + feedback passivo, nunca um toque a mais.

## Campeão Primitivo (B4.9) — e o bug maior que ele expôs

FOR/CON +4 cada, até máximo 25 — automático, sem escolha (mesmo
princípio de Força Indomável: "por que teria opção, se o jogador nunca
ia recusar?"). `core/campeaoPrimitivo.ts` (`aplicarCampeaoPrimitivo`,
pura) aplicado em todo ponto que já calculava o valor final de FOR/CON
(`calcularAtributosFinais`/`calcularPericias`/`calcularSalvaguardas`,
`calcularCapacidadeMaxima`/`explicarCapacidadeMaxima` da Mochila,
`conValorFinal`/`forValorFinal` do `FichaShell`). Calculado 1x
verificando TODAS as classes do personagem (não só a ativa) — a
característica é do personagem inteiro.

**Achado maior, investigado a pedido do Osmar antes de codar:** a regra
real diz que quando o mod. de Constituição sobe, o PV Máximo recalcula
retroativamente (como se o mod. novo já valesse desde sempre) — e isso
**já era um bug pré-existente**, não só do Campeão Primitivo: um Aumento
no Valor de Atributo em Constituição em QUALQUER Level Up normal nunca
ajustava PV retroativo (nem o ganho do próprio nível, que usava o mod.
antigo). O Osmar recusou minha proposta inicial (um ajuste pontual só
pro Campeão Primitivo) e pediu uma função só, correta, reaproveitada
nos dois casos — citando que Tenacidade Anã (espécie) e outras fontes de
Constituição têm o mesmo problema.

`core/pvRetroativo.ts` (`ajustarPvMaximoPorMudancaDeCon`): o ajuste é
sempre `(mod. novo − mod. antigo) × nível total` — matematicamente
idêntico a recalcular tudo do zero, porque a parcela "dado de vida" de
cada nível nunca dependeu de Constituição. Usado em
`FichaShell.tsx`'s `confirmarLevelUp` (cobre a tela de Level Up real E
"⚡ Inst. Level Up") e em `core/geradorPersonagemTeste.ts` (que também
tinha o mesmo gap — `mediaPvPorNivel` congelado antes do loop de
simulação).

**Padrão pra lembrar (o próprio Osmar articulou isso):** quando uma
correção pontual parece resolver só o caso na mão, mas o mesmo formato
de bug pode existir em outros lugares que mexem no mesmo dado — vale
parar e construir 1 função certa e reutilizável em vez de várias
soluções alternativas que podem divergir/dar errado.

## ASI 4/8/12/16 (B4.10)

Confirmado funcionando sem código novo — `niveisComASI` já lê a
progressão genericamente por ID.

## O que ficou pendente ao fechar este foco

**Trilhas (subclasses) — B5 a B8, deliberadamente deixadas em aberto:**
- B5 — Trilha do Berserker (nível 3/6/10/14): Frenesi, Fúria
  Irracional, Retaliação, Presença Intimidante. Dado já extraído da
  planilha (aba "Subclasses") durante este foco, ainda não implementado.
- B6 — Trilha do Coração Selvagem: Arauto da Fauna, Fúria dos
  Selvagens, Aspecto dos Selvagens, Arauto da Natureza, Poder dos
  Selvagens.
- B7 — Trilha da Árvore do Mundo: **implementada por completo em
  2026-09** (ver seção própria abaixo) — não é mais pendência.
- B8 — Trilha do Fanático: Campeão dos Deuses (reserva de dados),
  Fúria Divina, Concentração Fanática, Presença Zelosa, Fúria dos
  Deuses (nível 14, forma temporária).

Decisão do Osmar ao fechar: fechar a classe base agora, deixar as 4
Trilhas como pendência aberta (ver `PENDENCIAS.md`), e retomar depois.

**Golpe Brutal/Fortalecido — escolha de efeito pós-acerto sem
aplicação real** (ver seção acima) — travado numa revisão maior do
fluxo de d20 que o Osmar quer fazer antes, porque outras
características (não só Bárbaro) têm o mesmo formato de "escolha
depois de acertar". Ver `PENDENCIAS.md`.

**Descoberta paralela, fora do escopo do Bárbaro mas encontrada
fechando este foco:** nível 20 não é o teto real de progressão — o
livro (Cap. 7 do Livro do Mestre, "Dádivas Épicas", pág. 52) descreve
Dádivas Épicas repetíveis como forma de continuar progredindo depois
do nível 20/355.000 XP (1 a cada 30.000 XP adicional), universal pra
qualquer classe. O app hoje trata nível 20 como máximo absoluto (a aba
"Evolução do Personagem" da planilha para em 355.000 XP). Não é uma
característica do Bárbaro — é um sistema à parte, cross-classe — por
isso vira foco próprio depois, não faz parte deste arquivo além desta
nota de origem. Ver `PENDENCIAS.md`.

## Trilha da Árvore do Mundo (B7) — 1ª subclasse de Bárbaro, 2026-09

Retomado como o próximo foco depois da classe base fechar. O Osmar
escolheu a ordem das 4 Trilhas (Árvore do Mundo → Berserker → Coração
Selvagem → Fanático) e já forneceu os 4 emblemas (banners webp,
salvos em `assets/icones-classes/`) antes de começar.

**Planilha + Livro do Jogador (Cap. 3) cruzados, sem divergência** — só
1 célula com o bug de sempre (legenda de margem lateral colada no meio
do parágrafo, ver CLAUDE.md seção 8): "Raízes Devastadoras" tinha
"Subclasse Trilha da" / "Árvore do Mundo" interrompendo a frase.
Confirmado via `pdftotext -layout` no PDF que era exatamente esse
artefato de extração — reconstruída a frase limpa. "Ramos da Árvore"
também veio com `tipoAcao` errado na planilha ("Passiva/Estática"),
corrigido pra "Reação" (o próprio texto diz "você pode executar uma
Reação" — mesmo tipo de ajuste já feito em Palavras de Interrupção do
Bardo).

**Quebra em 5 entregas** (aprovada antes de codar, seção 6.4 do
CLAUDE.md):
1. Dado no banco (as 4 características, sem nada visível de mecânica
   ainda) — confirma que a Trilha aparece selecionável e as 4
   características aparecem certinho no Perfil.
2. Vitalidade da Árvore (nível 3) — mecânica de verdade.
3. Ramos da Árvore (nível 6) — Reação.
4. Percorrer a Árvore (nível 14) — Ação Bônus.
5. Fechamento (este arquivo + `PENDENCIAS.md`).

(Raízes Devastadoras, nível 10, não teve entrega própria — é só texto
passivo sem nenhum estado pra rastrear, já cobriu com a Entrega 1.)

**Decisões de design aprovadas antes de codar** (2 perguntas, "Sim
para as duas"):
- **Força Revigorante** (dentro de Vitalidade da Árvore — Xd6 PV Temp
  pra OUTRA criatura, 1x no início de cada turno com Fúria ativa): o
  app não modela outra criatura na cena, então o botão só rola e
  mostra o total pro jogador aplicar na mesa — mas a trava de "1x por
  turno" reaproveita o mesmo mecanismo que Golpe de Escudo/Esmagador/
  Talhador já tinham (flag `usadoTurno`, resetado no "Fim do Turno"),
  em vez de inventar um jeito novo de rastrear turno.
- **Percorrer a Árvore**: em vez de tentar modelar teleporte/posição
  no mapa (fora de escopo do app), virou card informativo (texto da
  regra) + 1 toggle real só pra parte que TEM estado pra rastrear (a
  versão estendida de 45m é 1x por Fúria — ver abaixo).

**Vitalidade da Árvore (Entrega 2):** duas partes no mesmo texto de
característica, ambas automáticas (sem pergunta ao jogador — mesmo
espírito de Força Indomável/Campeão Primitivo, o jogador nunca ia
recusar PV Temp de graça):
- Surto de Vitalidade: ao ATIVAR a Fúria, ganha PV Temp = nível na
  classe Bárbaro, via `ganharPvTemporario` (substitui, nunca soma —
  já era o padrão usado noutras fontes de PV Temp do app).
- Força Revigorante: botão "🌳 Força Revigorante" dentro do card de
  Fúria, rola Xd6 (X = bônus de Dano da Fúria) e mostra o total pro
  jogador aplicar em outra criatura na mesa. 1x por turno
  (`forcaRevigoranteUsadaTurno`, reseta no "Fim do Turno") — o Osmar
  reparou, testando, que o app já tinha esse mesmo mecanismo pronto
  pros outros 1x/turno (Golpe de Escudo etc.) e pediu pra reaproveitar
  em vez de deixar o botão livre pra sempre (1ª versão publicada não
  tinha trava nenhuma).

**Ramos da Árvore (Entrega 3):** primeira característica de Reação do
Bárbaro que não é ligada ao PRÓPRIO ataque (diferente de Golpe de
Escudo, que é sempre depois do seu ataque acertar) — o gatilho é uma
criatura A VISTA começando o turno perto de você. Por isso foi pro
painel de Reação de verdade (`ReacaoPanelContent.tsx`), não pro painel
de Ação (onde Golpe de Escudo mora), e consome o slot genérico de
Reação do turno (`onMarcarUsado('reacao')`, mesmo economato de
Contra-Encantamento/Palavras de Interrupção) em vez de um `usadoTurno`
próprio. CD (8+FOR+Prof) igual à de Golpe de Escudo, mas em arquivo
próprio (`core/ramosDaArvore.ts`) — mesma fórmula, características
diferentes, sem acoplar um nome de feature ao outro.

**Percorrer a Árvore (Entrega 4):** 2 cards separados no painel de
Ação Bônus (pedido do Osmar, testando ao vivo) — o livro deixa claro
que são 2 coisas com regra de uso diferente, então a UI reflete isso
em vez de esconder as 2 dentro de 1 card só:
- **"🌳 Percorrer a Árvore"** (base, 18m): Ação Bônus normal, sem
  recurso próprio — só a economia genérica de Ação Bônus do turno
  trava (`onMarcarUsado('bonus')`, mesmo padrão de qualquer outro
  recurso do painel, ex. Voo Dracônico). Pode usar todo turno.
- **"🌳 Percorrer a Árvore — Longa Distância"** (45m + até 6
  criaturas): a mesma Ação Bônus, mas com a restrição adicional de 1x
  por FÚRIA — não 1x por Descanso, como quase todo outro recurso do
  app. Isso não cabia no `recursoFlagUnica` de sempre (que só reseta
  no Descanso Longo/Curto): o flag (`percorrerArvoreEstendidaUsada`)
  reseta dentro do próprio `usarFuria()`, no momento em que a Fúria é
  ATIVADA de novo — padrão novo, específico desta característica
  (nenhuma outra do app tinha "1x por ativação de outro recurso" antes
  desta).

**Correção depois de publicado:** a 1ª versão juntava as 2 num card só
(texto explicando as 2 versões + 1 toggle) e não gastava a Ação Bônus
do turno em nenhuma das duas — o Osmar reparou (testando) que o livro
trata as 2 como a MESMA Ação Bônus (então gastar o turno é regra real,
igual qualquer outro recurso desse painel) e que separar em 2 cards
deixa mais claro qual delas tem a trava de 1x/Fúria.

**Padrão pra lembrar (generalizável, candidato a `DECISOES-CLASSES.md`
se aparecer de novo):** nem todo "1x até resetar" reseta no Descanso —
uma característica pode ter o próprio ciclo de reset atrelado à
ativação de OUTRO recurso do personagem (aqui, a Fúria). Vale conferir
o texto da regra com atenção em vez de assumir Descanso Curto/Longo
por padrão.
