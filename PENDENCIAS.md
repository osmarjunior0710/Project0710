# PENDENCIAS.md

> Marcadores de "vamos voltar aqui depois". Diferente da família
> `DECISOES-*.md` (que registra o que já foi decidido — ver índice no
> topo de `DECISOES-DESIGN.md`), este arquivo registra o que **ainda
> não foi resolvido** — coisas adiadas de propósito pra não travar uma
> entrega, mas que precisam ser retomadas em algum momento.
>
> Regra de uso: sempre que adiar uma decisão ou implementação "pra depois"
> durante uma entrega, registre aqui — o que é, por que foi adiado, e o
> que falta pra resolver. Ao resolver algo desta lista, mova a entrada
> pro arquivo `DECISOES-*.md` correspondente (como decisão tomada) e
> remova daqui.

---

## Planilha mestra não tem os IDs que o app usa internamente (Magias, Opções de Classe)

**O que é:** a planilha mestra já tem coluna `ID` própria em várias
abas (ex: "Magias" — `Truq_BadaFune` pra Badalar Fúnebre; "Opções de
Classe" — `Classe_Bruxo_InvMist_PacTomo` pra Pacto do Tomo), mas o app
**não usa esses IDs** — gera os próprios ao importar, como slug do
nome (ex: `"badalarfunebre"`, `"pacto-do-tomo"` em
`src/data/rulesets/dnd2024/magias.ts` e `invocacoesMisticas.ts`).
Achado do Osmar (2026-09), perguntando se os IDs novos (usados na
Invocações Místicas do Level Up, seção 13 do CLAUDE.md) batiam com a
planilha — não batem.

**Por que importa:** o Osmar precisa saber o ID que o app usa (não o
da planilha) pra conseguir apontar exatamente qual item tem bug/precisa
de fix, sem ter que adivinhar o slug gerado. Ele quer atualizar a
planilha mestra com uma coluna extra guardando o **ID do app**
(diferente do `ID` da planilha, que já serve pra outra coisa) — assim
os dois lados falam a mesma língua.

**Por que não migrar os IDs do app pros da planilha agora:** os slugs
do app já estão persistidos em personagens salvos no `localStorage`
(`truquesAtual`, `invocacoesMisticasAtual`, `magiasPreparadasAtual`
etc.) — trocar o formato quebra saves existentes sem migração. Manter
os slugs do app como estão; só adicionar de onde vêm na planilha.

**O que falta pra resolver:** o Osmar vai adicionar a coluna com o ID
do app nas abas relevantes da planilha mestra (pelo menos "Magias" e
"Opções de Classe" — outras abas com dado usado programaticamente por
ID podem precisar do mesmo, ex: Talentos, Características de Classe,
Subclasses). Quando a planilha tiver essa coluna, nada muda no código
— é só documentação pro Osmar rastrear bug, não fonte de dado
importada.

## Bruxo — o que ainda falta (base + Patrono Ínfero completos, ver DECISOES-CLASSES.md)

**Feito e removido desta lista (2026-09):** base (B0-B5), Patrono
Ínfero completo (B6.1-B6.6), Astúcia Mágica/Mestre Místico, Contatar
Patrono, Arcana Mística (escolha inicial E troca a cada level-up),
Dádiva Épica. Ver `DECISOES-CLASSES.md` pros detalhes de cada um —
essa entrada aqui tinha ficado desatualizada por várias entregas,
listando coisa já pronta; limpa no postmortem do Bruxo (2026-09).

**Genuinamente ainda em aberto:**

- **Invocação Mística "repetível" — mecanismo genérico de múltiplas
  escolhas ainda não existe.** Hoje `invocacoesMisticasEscolhidas`/
  `invocacoesMisticasAtual` são só um array de ids, tipo checkbox —
  marcar de novo uma invocação `repetivel: true` REMOVE em vez de
  adicionar uma 2ª instância (o array não tem duplicata). Pra
  invocações que só concedem efeito fixo sem escolha extra (a
  maioria), isso nunca importou — mas as que têm (ou vão ter) uma
  escolha extra por instância (Lições dos Grandes Antigos = 1 talento
  por vez; Lança Mística = 1 truque por vez vinculado) precisam
  poder ser pegas 2x+, cada vez com escolha própria guardada separada.
  **Bloqueia:** Lições dos Grandes Antigos e Lança Mística (essa
  também depende do item abaixo). **O que falta:** desenhar schema
  novo (ex: `{ invocacaoId, escolha? }[]` em vez de `string[]`) +
  decidir migração de personagens salvos já em `localStorage`.
- **Lições dos Grandes Antigos** — trava só no item acima (plano de
  implementação já mapeado, reaproveita a tela de Talento Geral do
  Level Up filtrando por categoria "Origem", quase zero código novo).
- **Lança Mística + Explosão Agonizante/Repulsiva** — travam num motor
  de dano/alcance de magia que não existe (`alcance` em `magias.ts` é
  texto livre, não numérico; não existe marcação de "esse truque causa
  dano" nem motor de ataque de magia). Lança Mística também depende do
  mecanismo de invocação repetível acima.
- **Pacto da Corrente + Investimento do Mestre da Corrente, Punição
  Mística + Sorvedouro de Vida, Presente dos Protetores + Olhar de
  Duas Mentes** — dependem de sistemas que não existem ainda: Familiar,
  motor de dano de magia, gatilho de "salvar de 0 PV". Sem plano de
  implementação ainda (mais estrutural que os itens acima).
- **Patrono Arquifada, Patrono Celestial, Patrono O Grande Antigo** —
  as outras 3 subclasses, cada uma com 4-5 características ativas
  próprias (algumas sem equivalente ainda no motor, ex: Passos
  Feéricos do Arquifada tem múltiplas opções de efeito escolhidas na
  hora de conjurar). **Achado do SDD a aplicar ao implementar Grande
  Antigo:** "Magias Psíquicas" (nível 3) é do Grande Antigo, não do
  Ínfero — o SDD v2 do Osmar tinha essa atribuição errada (planilha
  mestra já está certa).

**Regra de processo pra qualquer subclasse nova de Bruxo (confirmada
no Patrono Ínfero):** quebrar em entregas pequenas por "unlock" — cada
característica/sistema genuinamente novo vira entrega própria,
separada das que só reaproveitam padrão já validado. Pra qualquer
característica com interação ativa em Combat, perguntar onde ela fica
e como ativa ANTES de codar (ver `LICOES-RAPIDAS.md`).

## Plano de Equipamento — COMPLETO (E1-E4 feitas)

**O que é:** plano de 4 entregas nascido de uma revisão geral pedida
pelo Osmar, que expôs que Mão Principal/Secundária, equipar/
desequipar, e a CA lendo o equipamento real não existem — só a opção
A/B/C escolhida no wizard fixa a CA pra sempre, ignorando Escudo (nem
soma o +2), compras na Loja, ou qualquer mudança depois.

**Já feito:**
- **E1 — Mochila vira estado de verdade.** Lista única (sem separar
  por Origem/Classe/Loja), +/- quantidade, remover item, adicionar
  item novo por nome livre. Ver decisão "Mochila vira estado de
  verdade (E1 do plano de Equipamento)" no `DECISOES-FICHA.md`.
- **Ajuste pós-E1 — quantidade trava em 0, remover pede confirmação.**
  O Osmar testou e pediu 2 correções de comportamento: (1) o `-`
  agora trava a quantidade em 0 em vez de apagar a linha sozinho — o
  jogador pode ter clicado sem querer, então o item some só quando
  ele confirma de propósito; (2) o 🗑 agora exige 2 toques — o
  primeiro deixa o botão vermelho ("confirmar 🗑", desarma sozinho
  depois de 3s se não confirmar), o segundo apaga de verdade.
- **E2 — Equipar/Desequipar (arma/armadura/escudo).** Novo
  `core/equipamento.ts`: `identificarEquipamento(nome)` cruza o nome
  do item contra `armas.ts`/`armaduras.ts` reais pra saber o tipo
  (arma/armadura/escudo/genérico) e se é Duas Mãos; cada item ganha
  botões de equipar pro(s) slot(s) que fazem sentido pro seu tipo.
  Regras de exclusividade resolvidas em `equiparNoSlot`: equipar em
  um slot já ocupado libera quem estava lá; arma de Duas Mãos ocupa
  Mão Principal e libera Mão Secundária/Escudo automaticamente;
  Escudo e arma na Mão Secundária se excluem (mesma mão, na prática).
  Seção "Equipado agora" no topo da aba Mochila mostra o resumo dos 4
  slots. Persistido junto com o resto (mesmo mecanismo de auto-save).
  **Escopo consciente:** só cobre arma/armadura/escudo, que dá pra
  identificar com o catálogo real — "Vestiário genérico" (anel,
  capa, bota) fica de fora até existir uma forma de saber quais
  itens são "vestíveis" sem exclusividade (ver item abaixo).
- **E3 — CA e Combat lendo o equipamento de verdade.** CA soma
  Armadura+Escudo realmente equipados; "Atacar" usa a arma da Mão
  Principal (ou Ataque Desarmado real); ataque bônus da propriedade
  Leve quando as duas mãos forem Leve; Versátil ganha o dado maior
  empunhada com 2 mãos, ocupando a Mão Secundária. Ver DECISOES-FICHA.md
  "E3.1"-"E3.4" pra detalhes de cada uma.

**Falta:**
- **Catálogo pra "Adicionar item" na Mochila, com tipos estruturados.**
  Hoje "Adicionar item" é só nome livre + quantidade — o Osmar quer
  poder adicionar uma arma (que dá pra equipar), armadura, ou item
  mágico seguindo o mesmo schema de dado que os itens reais já usam
  (`armas.ts`, `armaduras.ts`, `equipamentoAventura.ts`...), não texto
  solto. Ideia: a tela de adicionar item ganha uma escolha de "tipo"
  (Arma / Armadura / Equipamento Geral / outro) que puxa do catálogo
  já existente (autocomplete/lista, não digitar do zero) quando o
  nome bate com algo conhecido — e, pro caso de item mágico (ainda
  sem dado importado — ver E4 abaixo), definir um formato mínimo
  (nome, tipo, se precisa Sintonização) pra já nascer no padrão certo
  quando a base de itens mágicos existir. Depende de E2 pra fazer
  sentido de verdade (só importa o "tipo" se o item puder ser
  equipado depois).
- **Vestiário genérico (E2, adiado) — regra de classificação já
  definida, só falta dado.** Regra confirmada (ver decisão "Sistema
  de Equipamento — schema de referência" no `DECISOES-FICHA.md`):
  item é equipável se tiver Bônus de CA, Dano, ou Efeito Mágico
  cadastrado — hoje nenhum item de `equipamentoAventura.ts` tem
  nenhum dos 3 (itens mágicos ainda não importados), então por essa
  régua eles são Miscelânea mesmo, não é lacuna arbitrária. Só volta
  a ser relevante quando existir dado de item mágico ou uma marcação
  manual no catálogo estruturado de "Adicionar item" (pendência
  acima).
- **Ataque Desarmado — só a opção "Dano" está implementada.** O
  Apêndice C (Glossário) também descreve **Empurrar** e **Imobilizar**
  como opções do Ataque Desarmado (testes de resistência do alvo
  contra CD 8+mod.Força+Proficiência, sem rolagem de dano) — o painel
  de Combat hoje só sabe fazer acerto+dano, não tem UI pra teste de
  resistência de terceiro. Fica de fora até esse tipo de mecânica
  existir no Combat (vale também pra qualquer magia/talento que peça
  salvaguarda do alvo, não é exclusivo do Ataque Desarmado).
  **Confirmado na prática (Osmar, 2026-09):** truque de Bruxo Badalar
  Fúnebre (salvaguarda de Sabedoria do alvo, não jogada de ataque do
  conjurador) — clicar "Usar" na aba Magias não fazia nada, em
  silêncio. Em vez de fixture/toast (perde o tracking do que falta
  corrigir), a aba Magias agora marca visualmente qualquer truque
  nessa situação: botão vira "Usar (pendência)" em vermelho, sem
  ação — `core/classificarMagia.ts`'s `usarMagiaTemAcaoAutomatizada(magia)`
  decide isso (truque com "Salv." na descrição curta e sem "Ataque:" =
  sem jogada automatizável ainda; magia preparada nunca entra nessa
  regra, porque gastar o espaço já é uma ação válida por si só). Segue
  valendo pra qualquer classe, não só Bruxo — resolver junto quando o
  Combat ganhar UI de teste de resistência de terceiro.
- ~~**E4 — Sintonização (3 itens simultâneos).**~~ **Completa**
  (E4.1 catálogo + E4.2 UI, ver DECISOES-FICHA.md). Com isso o Plano
  de Equipamento inteiro (E1-E4) está feito. **Segue fora de
  escopo:** efeito mecânico automático (CA/dano de item mágico
  aplicado sozinho na Ficha) — `efeitoResumido` é texto livre, não
  número estruturado; automatizar isso exigiria curar campo por campo
  os 288 itens, é projeto à parte. Também falta uma tela de "receber
  item" — hoje o único jeito de dar um item mágico a um personagem é
  digitar o nome exato em "Adicionar item" (Mochila), que já reconhece
  automaticamente pelo nome contra o catálogo.

**Contexto:** revisão geral pedida pelo Osmar ("vale a gente passar
por tudo que fizemos"), que levantou as perguntas de equipamento —
plano aprovado ("vamos de e1").

## Bardo — próxima classe, plano em 5 etapas (base completa — só as 4 subclasses ficaram de fora)

**O que é:** depois do Plano de Equipamento fechado e das subclasses
de Guerreiro deprioritizadas, o Osmar decidiu que a próxima classe a
implementar é **Bardo** — ver decisões "Casters — 3 padrões reais de
troca de magia" e "Bardo — próxima classe a implementar" no
`DECISOES-CLASSES.md` pra achados de regra completos e a decupagem
das 4 subclasses (Colégios). Esta entrada é só o checklist de
progresso — os detalhes de regra ficam lá, não duplicar aqui.

**Dados já confirmados na planilha mestra (não precisa reconferir):**
140 magias com "Bardo" na coluna Classes; progressão nível 1-20
completa; 13 linhas de característica de classe base + 24 linhas de
subclasse (4 Colégios).

**Progresso:**
1. ~~**Dados**~~ — **feita.** `classes.ts` ganhou a entrada de Bardo
   (Espaços de Magia como 9 recursos por círculo); `caracteristicasClasse.ts`
   ganhou as 12 características reais (2 células com conteúdo colado
   de outra parte do livro foram limpas); `magias.ts` (novo) importa o
   catálogo completo de 390 magias (não só Bardo), com `classes:
   string[]` e `magiasDaClasse(nome, circulo?)`. Ver DECISOES-CLASSES.md
   "Bardo — Etapa 1 (Dados) feita" pra detalhes e o que ficou
   documentado como qualidade de dado conhecida (1 caso confirmado de
   texto colado em "Badalar Fúnebre", não revisado célula por célula
   nas 390). **Ainda não cobre:** `sempreDisponivel` (magia que não
   conta no limite, achado do Colégio do Conhecimento/Glamour) — isso
   entra como campo em `ItemMochila`-like quando a Etapa 4
   (Level Up)/Ficha precisar, não faz sentido no catálogo genérico de
   magia (é uma propriedade de "esse personagem tem essa magia sempre
   preparada", não da magia em si).
2. ~~**Criação de personagem**~~ — **feita.** Bardo virou
   `disponivel: true`; wizard cria um Bardo nível 1 completo (3
   perícias quaisquer, 3 Instrumentos Musicais, 2 truques, 4 magias
   preparadas de 1º círculo, equipamento A/B). Achado: "Escolhas da
   Classe" tinha 3 acoplamentos implícitos a Guerreiro (perícias
   fixas em 2, Estilo de Luta sempre visível, validação do wizard
   travando sem Estilo de Luta) — corrigidos, ver DECISOES-CLASSES.md
   "Bardo — Etapa 2". Dados de perícia/ferramenta/equipamento inicial
   transcritos do Cap. 3 (PDF "Bárbaro a Feiticeiro" que o Osmar já
   tinha enviado).
3. ~~**Ficha/aba Magias**~~ — **feita** (Etapa 3.1). Truques/Magias
   Preparadas reais, Espaços de Magia lidos de `classes.ts` (círculo/
   máximo/recuperação reais, não mais fixture de Bruxo). Só cobre 1
   círculo simultâneo — suficiente hoje porque Bardo nível 1 só tem o
   1º; vira limitação real só quando a Etapa 4 existir. Ver
   DECISOES-CLASSES.md "Bardo — Etapa 3.1".
4. **Level Up** — dividida em 3 sub-entregas:
   - ~~**4.1 Truques**~~ — **feita**. Cresce/troca por level-up (lista
     única pré-marcada, valida "só 1 trocado"). Ver DECISOES-CLASSES.md
     "Bardo — Etapa 4.1".
   - ~~**4.2 Espaços de Magia multi-círculo**~~ — **feita**. Todos os
     círculos ativos rastreados ao mesmo tempo (`espacosDeMagiaAtivos`,
     `espacosGastosPorCirculo`), cada um com seu contador — resolve o
     que quebrava a partir do nível 3 do Bardo (2º círculo desbloqueia
     junto do 1º). Ver DECISOES-CLASSES.md "Bardo — Etapa 4.2".
   - ~~**4.3 Magias Preparadas**~~ — **feita**. Mesmo padrão de tela
     da 4.1 (lista única pré-marcada, valida "só 1 trocada"), catálogo
     filtrado pelos círculos com espaço no NOVO nível
     (`espacosDeMagiaAtivos`, Etapa 4.2). Ver DECISOES-CLASSES.md
     "Bardo — Etapa 4.3".
   - **Upar magia de círculo maior** (não escopado) — hoje cada magia
     preparada só gasta o espaço do círculo dela mesma; a regra de
     "gastar um espaço de círculo maior pra um efeito melhor" (upcast)
     não existe. Fica pra quando alguém pedir.
5. ~~**Combat**~~ — **feita** (Etapa 3.2). "Usar Magia" lista Truques/
   Magias Preparadas reais (exclui as de Reação, que só aparecem no
   painel de Reação se existirem); gasta Espaço de Magia real; magia
   de ataque rola acerto automático (dano fica manual — planilha não
   tem dado de dano estruturado). Ver DECISOES-CLASSES.md "Bardo —
   Etapa 3.2".

**Antes de começar a codar:** propor o plano de entregas pequenas pro
Osmar e esperar confirmação (regra 6 do CLAUDE.md) — as 5 etapas
acima são o esqueleto, mas cada uma provavelmente quebra em
sub-entregas menores na hora de implementar de verdade (mesmo padrão
usado no Guerreiro, B1-B5).

**As 4 subclasses (Bravura, Dança, Conhecimento, Glamour) ficam pra
depois da base** — decisão de seguir ou não será tomada só quando a
base estiver pronta e testada, não presumida agora. Ver "Escolha de
subclasse — versão placeholder" abaixo pro que já existe hoje (só o
nome + ícone, nenhuma característica mecânica).

## Escolha de subclasse — versão placeholder (só nome + ícone, sem mecânica)

O Level Up nível 3 do Bardo (`classe.nivelSubclasse`) já deixa
escolher entre os 4 Colégios reais (`data/rulesets/dnd2024/subclasses.ts`)
— mas isso é só uma escolha "de mentirinha" por enquanto, pedida pelo
Osmar pra já poder trocar o ícone do personagem na Lista antes da
implementação completa existir. A tela mostra aviso `[PH]` deixando
isso explícito. **Falta pra virar de verdade:**
- Características mecânicas de cada Colégio (níveis 3/6/14, ver
  decupagem em DECISOES-CLASSES.md "Bardo — próxima classe a
  implementar") — hoje escolher um Colégio não muda NADA na ficha além
  do ícone.
- Descrição completa de cada Colégio (hoje os cards da escolha não têm
  texto nenhum, só o nome).
- Repetir esse padrão pras outras classes conforme forem ganhando
  subclasses reais (a lista `subclasses.ts` já é genérica por
  `classeId`, só falta adicionar entradas).

**Bundle JS cresceu bastante (604KB → 1,13MB) com o catálogo de 390
magias.** `descricaoCompleta` de cada magia (texto bruto do livro,
longo) fica embutida no JS carregado na primeira visita, mas não é
exibida em nenhuma UI ainda (só `descricaoCurta`, mais curta). Não
bloqueou a entrega, mas é uma otimização futura óbvia se o carregamento
no celular ficar perceptivelmente lento: parar de embutir
`descricaoCompleta` no bundle principal (carregar sob demanda) ou
aplicar code-splitting. Ninguém decidiu fazer isso ainda — só
registrado como possibilidade.

**Emblemas das outras 9 classes são placeholder (cópia do emblema do
Guerreiro).** O Osmar já subiu os emblemas novos (formato redondo) de
Guerreiro, Bardo e **Bruxo** (classe + os 4 Patronos, gerados por IA em
grid 2x2, recortados e comprimidos em `webp`) — as 9 restantes
(Bárbaro, Clérigo, Druida, Feiticeiro, Guardião, Ladino, Mago, Monge,
Paladino) usam uma cópia do emblema do Guerreiro por enquanto (aparecem
cinza, dentro do card "em breve"). Trocar pelo arquivo real assim que
existir — é só substituir `src/assets/icones-classes/{id}-banner.webp`,
o código não muda (`IconeClasse` acha pelo nome do arquivo
automaticamente). Ver DECISOES-DESIGN.md "Ícones novos (emblema
redondo)".

**Contexto:** decisão do Osmar após fechar o Plano de Equipamento —
"vamos pra sintonização" (E4) e depois "a gente vai começar uma
classe nova". Bardo escolhido por cobrir o padrão mais completo de
conjuração (truques + troca restritiva + 9º círculo) entre os 8
conjuradores, e por escolha pessoal (esposa do Osmar joga Bardo).

## Combat tab — auditoria de fixture vs. real (Guerreiro) + marcação [PH]

**O que é:** pedido do Osmar pra auditar tudo que aparece na aba
Combat/Magias e distinguir claramente o que é dado real do Guerreiro
(ou ação genérica do Cap. 1) do que ainda é fixture de exemplo. Regra
nova registrada em `CLAUDE.md` (seção 12): todo texto que não vem de
regra real validada precisa começar com `[PH]` no próprio texto
exibido, até virar dado/lógica de verdade.

**Resultado da auditoria (Guerreiro nível 1-20, hoje):**
- **Real, sem `[PH]`:** ações genéricas do Cap. 1 (Atacar/Desengajar/
  Ajudar/Analisar/Correr/Esconder/Esquivar/Influenciar/Preparar/
  Procurar/Usar Objeto/Ataque de Oportunidade), Maestria em Arma,
  Recuperar Fôlego, Mente Tática, Surto de Ação, Indomável, Estilo de
  Luta, Mestre Tático, Ataques Estudados, contagem de Ataque Extra.
- ~~Fixture: os números do ataque em si (`ataqueArmaExemplo`,
  hardcoded "Adaga +4/1d4+3")~~ — **resolvido na E3.2** (ver
  DECISOES-FICHA.md): `core/ataque.ts` calcula o ataque de verdade a
  partir da arma equipada na Mão Principal (ou Ataque Desarmado real
  se nada estiver equipado), `ataqueArmaExemplo` foi removido. Falta
  só a escolha **Arma vs. Ataque Desarmado por instância de ataque**
  quando o personagem tiver mais de uma arma equipada que valha a
  pena trocar entre ataques (hoje sempre usa o que estiver na Mão
  Principal) — não é urgente, registrar se o Osmar sentir falta.
- **Fixture, ainda marcado `[PH]`:** "Usar Magia" (acordeão do painel
  de Ação) e "Escudo Arcano" (painel de Reação) — já ficavam
  escondidos pra quem não conjura (`conjura === false`), mas o texto
  interno (`magiasExemplo`) segue fixture pronto pra quando a 1ª
  classe conjuradora existir; toda a aba Magias também ganhou aviso
  `[PH]` no topo.

**Falta implementar (pra tirar o `[PH]`):**
- **Usar Magia / Escudo Arcano / aba Magias inteira** — trocar
  `magiasExemplo` por magia real assim que a 1ª classe conjuradora
  (Mago ou Clérigo) for importada (mesma pendência já registrada em
  "Aba Magias e 'Usar Magia'" mais abaixo).

## Fluxo completo wizard → Ficha — A1-A4 feitas, A5/A6 ainda faltam

**O que é:** plano de 6 entregas pequenas pra fechar o fluxo completo
wizard → Ficha, definido junto com o Osmar.

**Já feito:**
- **A1:** `core/calculoPersonagem.ts` (PV máximo, CA, Percepção Passiva,
  Iniciativa, ouro inicial, atributos finais, perícias com bônus de
  proficiência) e `core/armazenamentoPersonagens.ts` (interface
  trocável, localStorage por trás). O fim do wizard salva de verdade.
- **A2:** Lista de Personagens 100% real — fixtures (`exampleCharacters.ts`)
  removidos, estado vazio com atalho pra `/wizard` quando não há nenhum
  personagem salvo ainda. Apagar personagem ainda não existe (não travou
  a entrega, ver abaixo).
- **A3:** `FichaShell.tsx` lê o personagem salvo pelo `:id` da rota (com
  tela de "personagem não encontrado" se o id não existir — ex: link
  velho, ou salvo em outro navegador). Aba Perfil mostra atributos, PV,
  CA, Iniciativa, Percepção Passiva e Perícias reais do personagem —
  nenhum fixture na aba Perfil.
- **A4:** `core/mochila.ts` junta os itens de Origem (opção A) + Classe
  escolhidos no wizard, com peso real (novo `buscarPesoItem` em
  `buscarDescricaoItem.ts`, cobrindo Armas/Armaduras/Equipamento de
  Aventura/Ferramentas). Placeholder de ferramenta de grupo
  ("Instrumento Musical", "Kit de Jogos", "Ferramentas de Artesão") já
  vira o nome real escolhido (`ferramentaOrigemEscolhida`). Carga total
  soma peso × quantidade de verdade. `exampleSheet.ts` apagado
  (fixture morto). Depois: kits (ex: "Kit de Explorador de Masmorras")
  desagregam nos itens de dentro (ver DECISOES-FICHA.md), peso por
  linha mostra o total já multiplicado, menu do avatar com "Itens
  detalhados" (descrição inline vs. popup com ⓘ), apagar personagem na
  Lista com confirmação por texto, banner de XP-trava removido.

**O que falta (A6, mesma ordem combinada):**
- **A5 (feita):** Loja com catálogo real (Armas, Armaduras, Escudos,
  Ferramentas, Instrumentos Musicais, Focos e Símbolos, Munição,
  Equipamento de Aventura), agrupada por categoria em acordeão, com
  estepper comprar/vender, ouro restante calculado de verdade (PO=10PP=
  100PC) e Mod. de Ataque por arma (considerando proficiência da
  classe). Filtro "só o que a classe usa bem" pra Armas/Armaduras. Ver
  DECISOES-FICHA.md.
- **A6 (parcial):** Estilo de Luta, Perícias de Classe e itens de
  Equipamento de Classe já estavam/ficaram conectados na Ficha real —
  ver decisão em DECISOES-FICHA.md. Falta só a aba Magias: hoje mostra
  espaços de magia de exemplo, dado de Bruxo, em vez de refletir "sem
  magia" pro Guerreiro (a nota fixa sobre a regra de Bruxo/Magia de
  Pacto foi removida do Perfil por não se aplicar ao Guerreiro; volta
  como texto condicional por classe quando o Bruxo for importado).

## Loja — 2 recursos adiados de propósito na Entrega A5

**O que é:** ao planejar a Loja com o Osmar, dois recursos de uma versão
anterior (protótipo separado) ficaram de fora por decisão explícita:
- **Desconto de Talento (ex: Artífice, 20% em item não-mágico):**
  depende de seleção de Talentos no wizard, que ainda não existe.
- **Corte de itens acima de 205 PO** (máximo possível de ouro inicial,
  somando Origem + Classe): a Loja hoje mostra o catálogo completo
  sempre, sem esconder itens caros demais pra comprar na criação.

**Por que foi adiado:** o primeiro depende de uma feature que não
existe ainda (Talentos); o segundo é um "nice to have" que o ouro
restante já cobre na prática (não dá pra comprar mesmo, só não some da
lista).

**O que falta pra resolver:** revisitar quando Talentos entrarem no
wizard (desconto) ou se o Osmar sentir falta do corte por preço
(filtro adicional, fácil de adicionar depois — só falta calcular o
teto de ouro por Origem+Classe).

**O que falta pra polir (não travou nenhuma das entregas, mas ficou
pendente):**
- PV atual/nível não são salvos de volta no armazenamento quando você
  sobe de nível ou toma dano na Ficha — só muda na sessão aberta. Só
  importa de verdade quando a ficha for algo que se volta a abrir depois
  de fechar o navegador esperando ver o estado exato de antes.
- **Estilo de Luta é só informativo, não entra nos cálculos** — o chip
  na aba Combat mostra o texto do efeito, mas `calcularCA` (CA) e
  `calcularModAtaque` (Loja, Mod. de Ataque) não somam o bônus
  mecânico de nenhum dos 10 estilos ainda. Achado do Osmar ao perguntar
  se o efeito era considerado na Ficha — não era. Os que afetam número
  calculado hoje na Ficha: "Defensivo" (+1 CA com armadura equipada) e
  "Arquearia" (+2 no ataque à distância). Os outros 8 (Duelismo, Combate
  com Armas Grandes, etc.) afetam dano ou têm mecânica própria de
  combate (Interceptação, Protetivo) — esses só fazem sentido quando o
  motor de dano/ataque de verdade existir na aba Combat (ainda não
  existe, é fixture).
## Itens "sem peso cadastrado" na Mochila/Loja — auditoria completa (2026-08)

**O que é:** o Osmar notou "Balde de Ferro" sem peso na Mochila e pediu
uma varredura completa de todo item que a Mochila/Loja possam mostrar
"sem peso cadastrado" — feita rodando um script contra os dados reais
do app (`buscarPesoItem` + todos os catálogos). Achado: a maioria **não
é lacuna da planilha** — é nome digitado diferente entre
`origens.ts`/`classesProficienciasIniciais.ts` (onde o item foi
concedido) e o nome exato do item no catálogo (`equipamentoAventura.ts`
etc.), que é quem tem o peso cadastrado. A busca de peso é por nome
exato (case-insensitive), então um nome levemente diferente já falha
silenciosamente — a Mochila trata isso sem quebrar (mostra "sem peso
cadastrado" e avisa quantos itens ficaram de fora da soma), mas o
número de carga fica sub-contado até corrigir.

**Prováveis bugs de nome — resolvido (2026-09, foco Origens, Grupo H):**
todos os nomes em `origens.ts` foram corrigidos pro nome exato do
catálogo (`"Balde de Ferro"`→`"Balde"`, `"Fantasia"`→`"Roupas,
Fantasia"`, `"Roupas Finas"`→`"Roupas, Finas"`, `"Roupas de
Viagem"`→`"Roupas, Viagem"`, e os 3 `"Livro (tema)"`→`"Livro"` genérico
com o tema original preservado em comentário ao lado da linha).
`classesProficienciasIniciais.ts` já não tinha nenhuma dessas
ocorrências, não precisou de ajuste.

**Possível lacuna real de planilha (ou decisão de dado a tomar, não é
só digitar o nome certo):**
- `"Flecha"` (avulsa, quantidade 20 — Origens Guia e Soldado, e
  também no equipamento inicial nível 1 do Guerreiro) e `"Virote"`
  (avulso, quantidade 20 — Origem Guarda) → o catálogo só tem os itens
  embalados `"Flechas (20, Aljava)"` e `"Virotes (20, Estojo)"`, que JÁ
  incluem o recipiente — não é o mesmo item que "20 Flechas soltas" que
  a Origem concede sem o recipiente junto (o recipiente é concedido à
  parte, como item "Aljava"/"Estojo" separado nessas mesmas Origens).
  Precisa decidir: usar o peso do item embalado como aproximação, ou
  pedir pro Osmar uma linha própria "20 Flechas" (sem aljava) na
  planilha.

**Item do catálogo com peso genuinamente ausente na planilha (não é
erro de nome, é `null` mesmo):**
- `"Dados"`, `"Xadrez-do-Dragão"`, `"Baralho"`, `"Conjunto do Jogo dos
  Três Dragões"` (Kit de Jogos, aba Ferramentas da planilha) — nenhuma
  variante de Kit de Jogos tem peso cadastrado. Baixo impacto (são
  itens muito leves), mas fica registrado.

**O que falta pra resolver:** revisar essa lista com calma (o Osmar
pediu pra deixar aqui e olhar depois, não é urgente) — a maior parte é
corrigir o texto do nome em 2 arquivos, não uma tarefa de planilha.

**Não implementado ainda dentro do motor de cálculo (não bloqueia
A5/A6 do Guerreiro):**
- Bônus de Ataque de Magia / CD de Magia (só relevante quando a primeira
  classe conjuradora for importada).

**Data/origem:** 2026-08. A1-A4 implementadas e testadas de ponta a
ponta (wizard completo → Salvar → aparece na Lista → abre a Ficha real
com PV/CA/atributos/perícias/itens da Mochila calculados, não mais
fixture).

## Aba Magias e "Usar Magia" — personagemConjura() implementada

**O que é:** `MagiasTab.tsx` e o acordeão "Usar Magia" do painel de
Ação (Combat) mostram hoje dado de `data/exampleCombat.ts` — truques e
magias de exemplo, nota fixa sobre Magia de Pacto do Bruxo — pra
**qualquer** personagem, inclusive um Guerreiro base que não conjura
nada. O Osmar notou que isso deixa a tela poluída/confusa: mostra
recurso que boa parte dos personagens nunca vai ter de verdade.

**Por que não é só "esconder se a classe não conjura":** um Guerreiro
pode multiclassar (ainda não implementado — ver pendência
"Personagem multiclasse" abaixo) e ganhar conjuração de outra classe.
Amarrar a visibilidade só na classe base quebraria nesse caso. Decisão
registrada em `DECISOES-FICHA.md` ("Magia de item vs magia natural" +
"Aba Magias sempre visível, nunca escondida por classe"): a resposta
certa é uma função derivada `personagemConjura()` (hoje só olharia a
classe atual, pronta pra somar multiclasse depois) — a aba Magias
continua sempre visível (mesmo padrão já usado pra Ação Bônus vazia),
mas mostra estado vazio de verdade quando `personagemConjura()` for
`false`, em vez do fixture atual.

**Item mágico com magia (bastão, anel...) é sistema separado** — não
entra em `personagemConjura()` nem na aba Magias; vira item com cargas
na Mochila, usado pela ação "Usar Objeto" (distinta de "Usar Magia" no
Cap. 1 do livro). Isso já resolve sozinho o caso "não-conjurador com
item mágico", sem precisar de exceção.

**Já feito:** `core/conjuracao.ts` — `personagemConjura(classe):
boolean` procura um recurso cujo nome contenha "Espaços de Magia" ou
"Magias Preparadas" na progressão da classe (convenção assumida,
ainda não validada contra dado real de nenhuma classe conjuradora
importada — revisar quando a 1ª, Mago ou Clérigo, entrar).
`MagiasTab.tsx` agora mostra estado vazio de verdade
("Esse personagem não tem nenhuma fonte de conjuração no momento")
quando `!conjura`, em vez do fixture sempre visível; o acordeão "Usar
Magia" do painel de Ação some completamente pra quem não conjura
(testado com Guerreiro nível 1 — painel de Ação vai direto de "Atacar"
pras outras ações base, sem a linha de magia). **Correção:** o painel
de Reação também tinha um fixture de magia solto ("Escudo Arcano",
1º círculo) sempre visível — o Osmar notou que continuava aparecendo
pra Guerreiro depois do fix acima, que só cobriu o painel de Ação.
`ReacaoPanelContent.tsx` agora recebe `conjura` também e esconde
Escudo Arcano do mesmo jeito.

**Resolvido:** Bruxo (1ª classe conjuradora importada) já usa dado
real em `MagiasTab.tsx`/"Usar Magia" (truques, magias preparadas,
espaços por círculo) — sem fixture, ver DECISOES-DADOS.md "Magias —
motor de dano completo" e DECISOES-COMBATE.md pros 2 modais que
rodam a jogada de verdade em cima desse dado.

**Falta implementar:**
- Multiclasse e itens mágicos continuam de fora de
  `personagemConjura()` (gancho pronto, sem efeito ainda) até essas
  duas coisas existirem de verdade no app.
- Ação "Usar Objeto" (item mágico com carga de magia) — ainda não
  existe no app; depende da Mochila ganhar suporte a "item com cargas"
  primeiro.

## Faltam 10 classes (só Guerreiro e Bardo importados)

**O que é:** Guerreiro foi a classe-piloto (mais simples: sem magia,
sem subclasse até nível 3); Bardo foi a segunda (conjurador completo).
As outras 10 (Bárbaro, Bruxo, Clérigo, Druida, Feiticeiro, Guardião,
Ladino, Mago, Monge, Paladino) ficam "(em breve)" na lista de Classe
do wizard.

**O que falta pra resolver:** pra cada classe nova, repetir o mesmo
processo do Guerreiro — 1) importar núcleo + progressão da planilha
(`classes.ts`), 2) importar características por nível da planilha
(`caracteristicasClasse.ts`), 3) conferir se a planilha já tem tudo que
a classe precisa (verificar se sub-recursos tipo "Fúrias" do Bárbaro
seguem o mesmo formato de "Bônus de X: N" na coluna "Recursos da
Classe"), 4) pedir/usar o PDF do Cap. 3 pra proficiências e equipamento
inicial de classe (mesma exceção documentada usada no Guerreiro).
Guardião e Paladino compartilham a tabela de conjuração (ver
DECISOES-DADOS.md) — importar uma vez só quando chegar a vez delas.

**Material de apoio já pronto do Osmar (fora deste repositório, ele
guarda em documentos próprios):** decupagem nível a nível completa de
Bárbaro (4 Trilhas) e guia de implementação de Golias (espécie) já
existem, com achados específicos (Fúria precisa de temporizador de
turno com extensão automática; Ancestralidade Gigante do Golias muda
de categoria de ação conforme a escolha do jogador; interações
Golias+Bárbaro testadas). Também tem mapeamento de progressão de
Maestria em Arma por nível pendente pra Bárbaro/Guardião/Ladino/
Paladino (só Guerreiro está documentado hoje). Pedir esses documentos
ao Osmar quando a vez de cada uma dessas entregas chegar, em vez de
redescobrir do zero.

## Características de Guerreiro nos níveis 2, 5, 20 tiveram texto de tabela removido na importação

**O que é:** na planilha, as descrições de "Mente Tática" (nível 2),
"Ataque Extra" (nível 5) e "Três Ataques Extras" (nível 20) vêm com a
tabela "Características de Guerreiro" colada dentro do texto da célula
(problema de extração do PDF pra planilha). Removi o trecho colado ao
importar pra `caracteristicasClasse.ts`, mantendo só o parágrafo de
regra — não afeta a ficha nível 1 (nenhuma dessas é nível 1), mas é
bom checar se o mesmo tipo de vazamento aparece em outras classes
quando forem importadas.

**O que falta pra resolver:** nada urgente — só ficar atento ao mesmo
padrão de vazamento de tabela ao importar as próximas 11 classes, e
avisar o Osmar se a aba "Características de Classe" tiver esse problema
espalhado (pode valer a pena ele corrigir a extração original do PDF
pra planilha, em vez de eu limpar célula por célula).

## Design da tela "Escolhas da Espécie" ainda tá estranho

**O que é:** o Osmar notou que o layout da tela "3b. Escolhas da
Espécie" (tamanho/deslocamento/tipo de criatura em summary-row + traços
em InfoChip embaixo) ainda não está bom visualmente — não deu pra
apontar exatamente o quê, só que "tá estranho".

**Por que foi adiado de propósito:** prioridade agora é fechar um fluxo
completo de construção → ficha (todas as etapas do wizard levando a uma
ficha final navegável), pra cada entrega nova (Classe, Talentos,
Perícias de classe, etc.) já nascer com validação visual de ponta a
ponta — o Osmar quer conseguir olhar a ficha final e comparar, não só a
tela isolada do wizard. Polir o design de uma tela isolada antes disso
significa retrabalho quando o fluxo completo mudar o contexto ao redor
dela.

**O que falta pra resolver:** quando o fluxo completo (wizard → ficha)
estiver de pé, revisar a tela de Escolhas da Espécie com o Osmar,
pedindo pra ele apontar especificamente o que incomoda (espaçamento?
hierarquia? os InfoChips amontoados?) antes de redesenhar.

## Outros overlays fixos podem ter o mesmo bug de scroll vazando atrás

**O que é:** o popup de InfoChip/ItemComDescricao tinha um bug de scroll
vazando pra trás do modal em mobile — corrigido com o hook
`useLockBodyScroll` (ver DECISOES-DESIGN.md). Só apliquei esse hook nesses
dois componentes, que foram os reportados. O app tem outros overlays de
tela cheia com `position: fixed` que **podem** ter o mesmo problema, mas
ainda não foram testados/reportados: `RollOverlay`, `LevelUpShell` (o
overlay de Level Up), e os painéis `SidePanel` da aba Combat
(Ação/Ação Bônus/Reação).

**Por que não apliquei já:** esses três só aparecem dentro da Ficha, que
ainda não foi tão testada em celular real quanto o wizard — não quero
aplicar uma correção "no escuro" sem confirmar que o bug realmente
acontece lá também (o `useLockBodyScroll` é seguro de aplicar, mas cada
aplicação merece um teste rápido).

**O que falta pra resolver:** se o Osmar notar o mesmo sintoma (fundo
"deslocando" ou tela de trás rolando) em algum desses três, aplicar o
mesmo `useLockBodyScroll(aberto)` no componente correspondente.

## Osmar vai padronizar colunas de descrição na planilha (short + completa)

**O que é:** Osmar pretende passar pela planilha mestra e adicionar, de
propósito, colunas de **descrição curta** e **descrição completa** nas
abas que ainda não têm — resolvendo de raiz o problema de descrição
inconsistente entre abas (algumas têm campo de texto corrido pronto,
outras só têm colunas mecânicas, outras não têm nada). Ele comentou isso
espontaneamente, incomodado com a inconsistência atual.

**Por que isso importa pra mim (Claude) quando a planilha nova chegar:**
reimportar **todas** as abas que ganharem colunas novas, não só a que
motivou o pedido.

**Já resolvido nesta rodada (2ª planilha revisada pelo Osmar):**
- **Armas** e **Armaduras** ganharam coluna "Descrição" — curta e
  ilustrativa por design (não é a regra completa, é resumo de leitura
  rápida). Importada e ligada no popup. Ver decisão em
  `DECISOES-DESIGN.md`.
- Aba nova **"Proficiências de Classe"** — arma/armadura por classe,
  importada.
- **Espécies** — a coluna "Descrição Curta (auto, revisar)" já está em
  uso no card da lista (`introducaoCurta`), a pedido do Osmar, mesmo
  sendo gerada automaticamente e ainda sem revisão manual linha a linha.
  A tela de detalhe continua com o texto completo. Ver decisão em
  `DECISOES-DESIGN.md`.

**Ainda pendente:**
- **Talentos de Origem** (`talentos.ts`) e **Antecedentes**
  (`origens.ts`) ainda não ganharam coluna curta/narrativa própria —
  `descricoesOrigens.ts` continua sendo a exceção manual transcrita do
  livro até a planilha ganhar isso.
- Características de Classe/Subclasses/Opções de Classe/Glossário de
  Regras também ganharam "Descrição Curta (auto, revisar)" — ainda não
  usadas em tela nenhuma (essas classes/subclasses nem foram importadas
  ainda, exceto Guerreiro nível 1, que já está limpo). Aplicar o mesmo
  tratamento de Espécies quando fizer sentido pra tela em questão.

## Talentos — Fase 4 em andamento (Fases 1, 2 e 3 completas; lote 1 de Fase 4 feito)

**O que é:** Fases 1 (dado), 2 (classificação de texto) e 3 completa
(seleção de Talento Geral no Level Up com validação de Nível/Atributo
Mínimo + ASI embutido do próprio talento aplicado de verdade) estão
feitas — ver DECISOES-CLASSES.md pros detalhes. Fase 4 (efeito mecânico
de verdade) começou — ver "Talentos Fase 4 — lote 1" em
DECISOES-CLASSES.md pro esquema de dado (`efeitoMecanico`) e os 5
primeiros talentos implementados (Alerta, Defensivo, Arquearia,
Duelismo, Mestre em Armaduras Médias). O resto dos ~80 talentos
continua `[PH]` (salvo/mostrado, sem efeito na ficha) até chegar a vez
de cada um.

**O que falta:**

1. **Fase 4 — continuar em lotes pequenos** (5-10 por vez), mesmo
   esquema do lote 1 (campo `efeitoMecanico` em `talentos.ts`/
   `estilosDeLuta.ts`, lido por `core/calculoPersonagem.ts`/
   `core/ataque.ts` via `efeitoMecanicoDoTalento()`). Ordem sugerida:
   próximos números isolados fáceis de conectar num cálculo que já
   existe, por último múltiplos efeitos/Reação (ex: Conjurador
   Bélico, que provavelmente precisa de UI nova no painel de Reação
   do Combat, não só um número). A classificação da Fase 2
   (`classificarTalento.ts`) ajuda a decidir em qual painel de Combat
   (Ação/Bônus/Reação) cada efeito deve aparecer quando chegar a vez
   dele, mas ainda precisa de tag manual "afeta cálculo" por talento —
   o classificador é heurístico (regex), erra ocasionalmente, não é
   fonte de verdade sozinho.
2. **Descoberta do lote 1, ainda sem ação:** a planilha tem os mesmos
   10 Estilos de Luta catalogados 2x — uma vez em `talentos.ts`
   (categoria "Estilo de Luta") e de novo em `estilosDeLuta.ts` (aba
   filtrada). Hoje isso não causa bug de UI (a lista de Talentos do
   Level Up só mostra categoria "Geral", então a cópia em
   `talentos.ts` nunca aparece pro jogador) — só uma duplicação de
   dado. Não decidido se vale a pena unificar num arquivo só algum dia;
   registrado aqui pra não redescobrir do zero.

Ideia extra do Osmar (registrada, sem decisão ainda — é decisão de
produto, não de dado/regra): uma aba de anotações de talento; se for
pra frente, reaproveitaria `ItemComDescricao`/`MagiaComDescricao`, não
precisa de componente novo.

## Classes/Subclasses — variação estrutural grande, ainda sem schema

**O que é:** diferente de Origens, as abas de Classe (Progressão de
Classe, Características de Classe, Opções de Classe) têm texto livre
rico, recursos limitados variados (Fúrias, Espaços de Magia, Maestria em
Armas...), e ao menos uma célula com uma tabela inteira colada dentro do
texto da descrição (visto na característica "Maestria em Arma" do
Bárbaro) — precisa de limpeza antes de virar dado estruturado.

**Por que foi adiado:** Origens era o ponto de partida mais simples
(schema uniforme confirmado); Classes é reconhecidamente a parte mais
complexa da planilha e fica de propósito pra depois de Origens e
Espécies estarem resolvidas.

**O que falta pra resolver:** tudo — ainda não começou a análise
campo-a-campo de Classes. Quando chegar a vez, repetir o mesmo processo
usado em Origens (ler a planilha primeiro, confirmar o que é uniforme vs.
exceção, só depois desenhar schema). O Guerreiro (ver pendência
"Guerreiro 1-20 completo" abaixo) é o primeiro caso de teste real dessa
variação — quando terminar, revisitar essa entrada com o que
generalizou de verdade pras outras 11 classes.

## Guerreiro 1-20 — B1-B5 feitas (base completa), as 4 subclasses foram DEPRIORIZADAS

**Decisão do Osmar (2026-08):** as 4 subclasses de Guerreiro (Campeão,
Cavaleiro Místico, Combatente Psíquico, Mestre da Batalha) **não vão
ser implementadas agora** — o próximo passo do projeto é importar
**outra classe** (2ª classe do jogo), não terminar as subclasses do
Guerreiro. O "Guerreiro base" (nível 1-20 sem subclasse, B1-B5) está
completo e testado — fica assim mesmo por enquanto. Se/quando as
subclasses de Guerreiro voltarem a fazer sentido, reabrir esta
pendência; não é um "esquecido", é adiado de propósito.

**O que é (histórico, antes da decisão acima):** em vez de continuar
entregando pedaços soltos (Estilo de Luta, Magias...), o Osmar queria
o Guerreiro resolvido de ponta a ponta (nível 1 ao 20, incluindo as 4
subclasses) antes de partir pras outras 11 classes. Decupagem nível a
nível já feita e verificada — ver decisão "Guerreiro — plano de
implementação completa nível 1-20 + 4 subclasses" no
`DECISOES-CLASSES.md` pra achados de regra e ordem de implementação
recomendada, caso isso seja retomado no futuro. Quebrado em 5
entregas pequenas (B1-B5) pro "Guerreiro base", antes de partir pras
4 subclasses — só o "base" foi feito.

**Já feito:**
- **B1 — Motor de Level Up ganha as 3 categorias novas de escolha.**
  Descoberta importante ao implementar: o Guerreiro já tinha a
  progressão 1-20 completa importada em `classes.ts` (não só nível 1)
  e `caracteristicasClasse.ts` já tinha as descrições reais de 15
  características — não precisou criar dado novo, só **conectar** o
  que já existia. Novo `core/levelUp.ts`: `niveisComASI(classe)`
  deriva os níveis de ASI direto da progressão real (não mais uma
  constante fixa `[4,8,12,16,19]` — Guerreiro corretamente aparece com
  6 níveis agora); `temEstiloDeLutaTrocavel` e `niveisComDadivaEpica`
  idem. `LevelUpShell.tsx` ganhou os passos "Estilo de Luta" (aparece
  em todo level-up, deixa trocar) e "Dádiva Épica" (nível 19,
  placeholder por ora); passo "Novas Características" agora mostra a
  descrição real de cada característica, não mais texto de exemplo.
  `data/levelUpFixtures.ts` reduzido só ao que sobrou de fixture de
  verdade (conversão dado-de-vida → média). Testado de ponta a ponta
  até nível 4 (features reais, Estilo de Luta trocável em todo nível,
  placeholder de Subclasse no nível 3 sem travar o avanço, ASI
  aparecendo no nível certo).
- **Correção pós-B1** — "Indomável" tinha descrição só no nível 9;
  níveis 13 e 17 (que só ganham um uso extra do mesmo recurso, sem
  descrição nova na planilha) mostravam "descrição ainda não
  importada". `caracteristicasDoNivel` agora busca a entrada de maior
  nível ≤ nível atual em vez de exigir igualdade exata — corrige pra
  qualquer classe/característica que se repita assim, não só Guerreiro.

**Já feito:**
- **B2 — Maestria em Arma.** Escolha de N armas (3 no nível 1, lido do
  recurso "Maestria em Arma" da classe, não hardcoded) no wizard
  (`ClasseEscolhasStep.tsx`, mesma tela de Estilo de Luta) + troca via
  ícone "🔄" na aba Perfil, dentro da nova seção "Maestria em Arma"
  (`PerfilTab.tsx` + `TrocarArmaMaestria.tsx`), com popup que já
  exclui as armas que ocupam os outros slots (não deixa duplicar arma).
  Novo `core/maestriaArma.ts`: `quantidadeMaestriaEmArma(classe,
  nivel)` lê o recurso real; `armasParaMaestria(classe)` filtra o
  catálogo pela proficiência de arma da classe (hoje só cobre "Armas
  Simples e Marciais" = catálogo inteiro, caso do Guerreiro — outras
  classes com proficiência restrita entram quando ganharem esse
  recurso de verdade).

**Simplificação assumida (não é a regra 100% literal):** o ícone de
troca fica sempre visível na aba Perfil, não é gated a "só aparece
depois de apertar Descanso Longo de verdade". Fica documentado como
decisão consciente em `DECISOES-CLASSES.md` — se o Osmar preferir a
versão mais fiel (só habilita a troca logo depois de descansar), essa
pendência entra aqui.

**Já feito:**
- **B3 — Recuperar Fôlego + Mente Tática na aba Combat.** Painel de
  Ação Bônus ganhou o banco de usos real (pips + botão "Recuperar
  Fôlego", cura 1d10+nível, marca a Ação Bônus como usada) e a aba
  Combat ganhou um card "Mente Tática" sempre visível (não gated por
  turno, porque a regra não consome a Ação Bônus) que gasta o mesmo
  banco de usos e rola 1d10 pra somar num teste falhado. Novo
  `core/recursosClasse.ts`: `valorRecursoClasse` genérico (usado
  também por `maestriaArma.ts`, refatorado pra não duplicar a mesma
  lógica de leitura de recurso). **Correção pós-B3:** a primeira
  versão só rolava o dado e pedia pro jogador somar o PV na mão — o
  Osmar reportou que "Recuperar Fôlego não cura". Corrigido: a
  rolagem agora usa `onResultado` do `useRoll` pra aplicar o total
  direto em `onAlterarPv`, cura de verdade aparece na barra de PV
  sem passo manual. Mente Tática continua manual (o app só rola o
  1d10 — somar ao teste de atributo que falhou é decisão de mesa, não
  dá pra saber qual teste era).

- **B4 — Surto de Ação, Indomável, Ataque Extra, Mestre Tático,
  Ataques Estudados.** Resolve os itens #6/#11 do teste do Osmar
  (Ataque Extra não aparecendo na Combat). Novo em `core/levelUp.ts`:
  `contarRepeticoesCaracteristica(classe, nome, nivel)` — conta
  quantas vezes uma característica no padrão "repete nome = +1 uso"
  (convenção 1 já documentada) aparece até o nível atual, usado pra
  derivar usos de Indomável (9/13/17) e Surto de Ação (2/17) sem
  precisar de coluna numérica própria; `numeroDeAtaques(classe,
  nivel)` — deriva quantos ataques a ação Atacar concede, lendo o
  padrão "muda de nome a cada salto" (convenção 2: Ataque Extra=2,
  Dois Ataques Extras=3, Três Ataques Extras=4 — nomes oficiais
  usados por várias classes, não é hardcode do Guerreiro);
  `caracteristicaDesbloqueada(classe, nome, nivel)` — retorna
  nome+descrição se a classe já tem essa característica nomeada
  (usado pra Mestre Tático/Ataques Estudados como InfoChip
  informativo).
  - **Atacar**: linha do painel de Ação agora mostra "(ataque N/M)" e
    conta os toques — só marca a Ação do turno como "usada" e fecha o
    painel no **último** ataque; os anteriores mantêm o painel aberto
    (pra tocar Atacar de novo) sem consumir o turno.
  - **Surto de Ação**: nova linha no painel de Ação — usar não marca
    a Ação normal como usada (ela continua disponível), respeita
    limite duplo (nº de usos por descanso E máximo 1x por turno,
    controlado por um flag que reseta no "Fim do Turno").
  - **Indomável**: card sempre visível na Combat (mesmo padrão de
    Mente Tática) — toque rola 1d20+nível como nova salvaguarda;
    recupera só no Descanso Longo (diferente de Recuperar
    Fôlego/Mente Tática, que também recuperam 1 no Descanso Curto).
  - **Mestre Tático/Ataques Estudados**: só InfoChip informativo por
    ora (nome+descrição real, clicável) — a mecânica de "trocar
    propriedade de maestria por ataque" (Mestre Tático) e "rastrear
    Vantagem contra o último inimigo que errei" (Ataques Estudados)
    não tem UI interativa ainda, fica como simplificação assumida.
  - **Simplificação de UX conhecida:** o feedback + botão "Rolar
    Dano" de cada ataque ficam atrás do painel de Ação enquanto ele
    segue aberto (entre o 1º e o último ataque) — o jogador só vê
    depois de fechar o painel manualmente. Funcional, mas não é o
    fluxo mais fluido; revisar se incomodar no teste real de mesa.

**Já feito:**
- **B5 — revisão geral do Guerreiro base 1-20.** Auditoria
  característica por característica das 20 níveis + teste automatizado
  de ponta a ponta (Level Up 1→20 sem travar, sem erro de console).
  Achado corrigido: **Ajuste Tático** (nível 5) tinha descrição real
  importada mas nenhuma tela mostrava — agora é o 3º InfoChip na
  seção "Características" da Combat, mesmo padrão de Mestre
  Tático/Ataques Estudados. Confirmado no teste (nível 20): PV
  145/145, 4 chips de característica, Indomável 3/3 usos, Mente
  Tática/Recuperar Fôlego 4/4 usos, "Atacar (ataque 1/4)" com `[PH]`
  correto, Surto de Ação 2/2 usos — todos os números batem com a
  progressão real da planilha.
  **Gaps já conhecidos, não fazem parte do escopo de B5** (cada um já
  tem entrada própria nesta lista ou em `DECISOES-CLASSES.md`, revisar
  lá antes de reabrir aqui): Subclasse de Guerreiro (placeholder,
  níveis 3/7/10/15/18 — deprioritizado, ver nota acima "as 4
  subclasses foram DEPRIORIZADAS"); ASI (seletor
  `toggleAsi` não permite +2 no mesmo atributo, e o resultado não é
  aplicado à ficha — "Level Up — itens de teste do Osmar" abaixo);
  Dádiva Épica (nível 19, placeholder — lista do Cap. 5 não
  importada); Atacar (`[PH]`, precisa do cálculo real de arma
  equipada + atributo, junto com a escolha Arma/Desarmado por
  instância — "Combat tab — auditoria de fixture vs. real" acima).

**Falta:**
- **Nº de armas de Maestria crescendo em nível alto (4/10/16)** — hoje
  só a escolha inicial (nível 1) tem UI; quando o recurso cresce (ex:
  de 3 pra 4 armas no nível 4), o Level Up ainda não tem um passo pra
  escolher a arma extra.

## Level Up — itens de teste do Osmar (pós-B1) ainda não cobertos pelo plano B2-B5

**O que é:** lista de observações testando o B1, feita pelo Osmar em
25/08/2026. Alguns itens já são cobertos pelas entregas B2-B5 já
planejadas acima (Ataque Extra/Dois Ataques Extras/Três Ataques Extras
→ B4; Ação Bônus aparecer na Combat → B3/B4) e não têm entrada própria
aqui. Os que **não** têm cobertura no plano atual:

- **PV do Level Up sem "volta atrás".** Hoje o jogador pode ficar
  trocando entre "pegar metade" e "rolar o dado" livremente. Devia ser
  uma escolha única e sem arrependimento: jogador escolhe Média OU
  Dado; se escolher Dado, cobrir a tela (efeito tipo "cortina preta"),
  rolar, revelar o resultado — e depois disso não dá mais pra voltar
  nem trocar. Puramente de UX, não depende dos dados do Guerreiro.
- **Level Up não salva em que passo o jogador parou.** Se o jogador sai
  no meio (ex: fechou o app depois de escolher PV mas antes de
  confirmar Estilo de Luta), hoje perde o progresso e recomeça do zero.
  Precisa persistir o passo atual em algum lugar (mesmo que só em
  memória da sessão, dependendo de quão longe o app já foi de
  `armazenamentoPersonagens`).
- **Escolha de múltiplos Estilos de Luta simultâneos.** Existe pelo
  menos um caso (subclasse Campeão, nível 7, "Estilo de Luta
  Adicional") em que o personagem tem 2 estilos ativos ao mesmo tempo,
  não troca 1 por outro. O motor atual (`temEstiloDeLutaTrocavel`)
  assume 1 slot só. Isso só vira relevante quando a subclasse Campeão
  for implementada — registrar aqui pra não esquecer na hora.
- **Talentos precisam de 2 fases separadas.** Hoje (em todo o app, não
  só Guerreiro) um Talento é só listado/exibido pro jogador — nunca
  aplica o efeito mecânico dele em nenhum cálculo (CA, dano, PV,
  perícia, etc). Isso é maior que o Guerreiro: qualquer classe/origem
  que conceda Talento (inclusive os já existentes na Loja/Origem) tem
  esse mesmo buraco. Vira uma entrega própria: Fase 1 = listar/exibir
  (já existe); Fase 2 = efetivamente aplicar o efeito nos cálculos de
  `core/`, talento por talento, conforme cada um for auditado.
- **ASI não permite +2 no mesmo atributo.** O seletor atual
  (`toggleAsi` em `LevelUpShell.tsx`) só liga/desliga atributos — clicar
  de novo no mesmo atributo remove o ponto em vez de somar um segundo.
  Precisa virar um contador +/- por atributo (0, 1 ou 2 pontos,
  distribuídos livremente entre 1 ou 2 atributos), e bloquear "Avançar"
  enquanto os 2 pontos do ASI não tiverem sido todos distribuídos.
- **Pontos de ASI não afetam a ficha.** Mesmo quando o jogador escolhe
  atributos no passo de ASI, o valor escolhido nunca é aplicado a
  nenhum atributo real do personagem — não é passado no `onConfirmar`,
  não é somado em `calcularAtributosFinais` nem em nenhum lugar
  derivado dele (CA, PV, perícias, mod. de ataque). Depende de resolver
  o item anterior (o seletor) antes, mas é um segundo bug: mesmo com o
  seletor corrigido, ainda falta o "encanamento" de aplicar o resultado.
- **Sem escolha de Dádiva Épica (nível 19).** O passo "Dádiva Épica" do
  Level Up hoje só mostra a descrição da característica e um
  placeholder "lista de Dádivas Épicas entra numa próxima entrega" — a
  lista real de opções (Cap. 5 do livro) ainda não foi importada da
  planilha nem tem UI de escolha.

## Personagem multiclasse — schema da ficha ainda assume 1 classe só

**O que é:** existe uma aba **Multiclasse** na planilha (pré-requisito de
atributo mínimo por classe pra poder multiclassar). O wizard e a ficha
atuais (Fase 0) assumem 1 classe por personagem.

**Por que foi adiado:** Fase 0 é esqueleto navegável com dados fixos —
multiclasse é uma feature de regra, não de navegação. Resolver isso exige
decisão de schema de ficha (como representar "2 progressões de classe
diferentes numa ficha só") que ainda não foi tomada.

**O que falta pra resolver:** nada urgente agora — só não fechar o schema
de `core/`/ficha de um jeito que assuma "sempre 1 classe" de forma rígida
demais, pra não precisar reescrever tudo quando isso for implementado.

## App inteiro não escala pra tablet/desktop — só os ícones de Classe foram corrigidos

**O que é:** o Osmar reportou que em telas largas ("quando vai pra web")
os ícones de classe ficavam minúsculos, porque `#root` não tem
`max-width` nenhum — o card estica pra ocupar a largura toda da tela,
mas o ícone continuava com um tamanho fixo em pixel. Corrigido só pro
ícone (`.opt-card-img` e `.opt-card-img-banner` agora usam
`clamp()` com base em `vw`, então crescem de verdade em telas maiores
— testado em 390px/768px/1440px).

**Por que foi adiado (o resto):** o app inteiro (fonte, espaçamento,
padding dos cards, todo o resto dos componentes) ainda usa só `px`
fixo, sem nenhum `clamp()`/`vw`/media query — funciona bem no celular
(que é o alvo principal, regra 5 do `CLAUDE.md`), mas em tablet/desktop
o layout todo (não só o ícone) fica com muito espaço em branco e texto
proporcionalmente pequeno. Consertar isso passa por decidir um sistema
de escala responsiva pro projeto inteiro (breakpoints? clamp() em
tudo? largura máxima de conteúdo centralizada?) — não é uma correção
pontual, é uma decisão de design que vale a pena tomar de propósito,
não corrigir tela por tela conforme reclamação aparecer.

**O que falta pra resolver:** o Osmar decidir a abordagem (perguntar
antes de implementar, regra 6 do `CLAUDE.md`) e aplicar de forma
sistemática — provavelmente melhor de fazer depois que o fluxo
wizard→ficha estiver fechado (prioridade atual registrada em
`DECISOES-DESIGN.md`), já que mexe em CSS espalhado pelo app inteiro.

## Idioma extra de Classe (Druida/Ladino) — mecanismo pronto, mas não testável ainda

**O que é:** mecanismo implementado (ver `DECISOES-DADOS.md` "Idioma
extra concedido por característica de Classe nível 1 — Druida/Ladino")
pra Druida (Druídico, fixo) e Ladino (Gíria dos Ladrões fixo + 1 à
escolha). **Druida e Ladino não são classes jogáveis ainda** (aparecem
"(em breve)" no wizard) — o código está certo e coberto por teste
automatizado, mas só dá pra ver funcionando na tela quando uma das
duas virar classe completa (ver pendência "Faltam 10 classes").

**O que falta pra resolver:** as outras 10 classes (Bárbaro, Bardo,
Bruxo, Clérigo, Feiticeiro, Guardião, Guerreiro, Mago, Monge, Paladino)
ainda não foram auditadas linha a linha na aba "Características de
Classe" pra confirmar se concedem idioma extra também — auditar quando
cada uma for implementada.

## Card padronizado de descrição — só Magias hoje, falta Itens/Armas/Armaduras/Itens Mágicos

`MagiaComDescricao` (novo, `ui/components/`) é um popup com formato fixo
pra qualquer magia/truque — nome, tipo (Truque/Xº Círculo), toggle Desc.
curta/longa (só aparece se as duas existirem e forem diferentes), Tempo,
Alcance, Componentes, Duração e a descrição (campos em branco ficam
escondidos, não aparecem vazios). Portado do "outro modelo" a pedido do
Osmar. Hoje só é usado pra Magias (Truques/Magias Preparadas da criação
de Bardo). Os outros tipos — Itens Comuns, Itens Mágicos, Armas,
Armaduras — continuam no popup genérico simples (`ItemComDescricao`,
só nome + descrição corrida). Pendência: quando mexer nesses outros
tipos de novo, avaliar replicar o mesmo padrão de card fixo (campos
próprios de cada tipo — ex. Arma teria Dano/Propriedades/Maestria em
vez de Tempo/Alcance/Componentes/Duração).

## Painel de Ação Bônus (Combat) ainda não tem integração de magia

`BonusPanelContent.tsx` continua sem gastarSlot/lista de magia —
magias com Tempo de Conjuração "1 Ação Bônus" (poucas no catálogo, 6
no total) aparecem hoje no painel de Ação (Etapa 3.2), não no de Ação
Bônus, onde deveriam por regra. Simplificação aceita por ora (ver
DECISOES-CLASSES.md "Etapa 3.2"); resolver quando o painel de Bônus
ganhar suporte a magia de verdade.

## Painel de Reação ainda usa a lista plana antiga de magias (não ganhou o picker novo)

`ReacaoPanelContent.tsx` continua com a lista simples de magias de
Reação (sem upcast, sem Tela 2/3) — o picker novo (`SelecionarMagiaShell`/
`EscolherCirculoShell`) só foi ligado no painel de Ação por ora. Como
Reação normalmente tem poucas magias qualificadas (a maioria dos
personagens tem 0-2), o problema de "lista infinita" que motivou o
picker novo não bate tão forte aqui — mas pra ficar consistente
(upcast deveria valer em Reação também) e não ter 2 comportamentos
diferentes, replicar o mesmo componente aqui é trabalho pendente.

## Detector genérico de "ficha atrasada/faltando algo" — pendência importante, vai crescer

**Achado do Osmar:** se um Level Up passar sem escolher Truques/Magias
Preparadas (bug, ou personagem que subiu de nível antes dessa
funcionalidade existir), o personagem fica com menos do que devia pro
nível dele — e hoje não tem nenhum jeito de perceber isso nem de
corrigir, porque a tela de escolha só aparece DURANTE a transição de
nível, não como checagem contra o estado atual.

**Resolvido agora (ver entrega abaixo) só pra Truques e Magias
Preparadas** — comparação simples "quanto deveria ter no nível atual"
vs "quanto tem de verdade", com aviso + tela de completar quando
faltando.

**Mas o Osmar pediu pra registrar isso como pendência maior:**
precisamos de um mecanismo **genérico** pra esse tipo de checagem, não
uma solução ad-hoc por campo. Motivo: é quase certo que vamos achar
mais casos assim conforme o app cresce — o suspeito que tinha sido
anotado aqui (Aumento de Valor de Atributo do Level Up não aplicava de
verdade em `selecao.atributos`) se confirmou e já foi corrigido — ver
DECISOES-CLASSES.md "Level Up: Aumento de Valor de Atributo agora
aplica de verdade". Ideia de formato (não decidido ainda, só registrado): uma
função central tipo `verificarPendenciasDoPersonagem(selecao, classe,
nivel, estadoAtual)` que devolve uma lista de "coisas que deveriam
estar diferentes" (nome do campo, esperado vs real), e uma UI padrão
(banner/linha de aviso) reaproveitável em qualquer aba da Ficha pra
mostrar isso e linkar pra tela de correção certa — em vez de cada novo
achado ganhar seu próprio código de detecção solto.

**Data/origem:** 2026-08.

## Cartão de seleção genérico — Classe/Subclasse/Origem/Espécie hoje duplicam o mesmo padrão

**Achado do Osmar:** as 4 telas de escolha (Classe em `ClasseStep.tsx`,
Subclasse no step do Level Up em `LevelUpShell.tsx`, Origem em
`OrigemStep.tsx`, Espécie em `EspecieStep.tsx`) reimplementam cada uma
por conta própria o mesmo miolo — `.opt-card` com `.opt-card-row`
(ícone + `.opt-card-info` com nome/descrição) — mas com pequenas
diferenças bobas entre elas (Classe/Subclasse usam `IconeClasse` e
Espécie usa `IconeEspecie` — ambas com arte real, ver
DECISOES-DESIGN.md "Ícones de Classe completos + Espécie ganha o
mesmo padrão"; só Origem ainda usa um placeholder `🖼` genérico,
sem arte própria; cada uma trata "(em breve)"/duplicidade/tags à sua
moda). Ele quer um componente/padrão único de "cartão de seleção" que
sirva pras 4 (e futuras, tipo Talentos), com:
- **Destaque maior pro ícone** (hoje é pequeno e não é o foco visual
  do cartão).
- **Texto que caiba e faça sentido** por contexto — nome sempre,
  descrição/tags variando conforme o que cada tipo de escolha
  realmente tem pra mostrar (não forçar todo mundo no mesmo texto).

**Não fazer agora** — só registrar. Quando entrar na fila, vale revisar
as 4 implementações atuais junto (nenhuma delas deve virar a
"referência" sem revisar as outras 3 primeiro).

## Migração de comparação-por-nome pra ID estável (código já existente)

**O que é:** CLAUDE.md seção 13 (depois da auditoria externa, ver
DECISOES-DESIGN.md) tornou obrigatório todo código **novo** que
reconhece uma característica/regra programaticamente usar ID estável,
nunca o nome de exibição. Código **já existente** que ainda compara
por nome não foi todo migrado retroativamente ainda.

**Entrega 3 (concluída) migrou só a parte interna de `levelUp.ts`:**
`niveisComASI`, `niveisComDadivaEpica`, `temEstiloDeLutaTrocavel`,
`NOMES_ESPECIALISTA`/`niveisComEspecialista` e
`CONTAGEM_ATAQUE_EXTRA`/`numeroDeAtaques` agora comparam contra
`ID_CARACTERISTICA_CLASSE` (novo arquivo hand-maintained,
`data/rulesets/dnd2024/idsCaracteristicasClasse.ts`, mesmo padrão do
`efeitoMecanico` de `talentos.ts`) em vez do nome de exibição
diretamente. A assinatura pública dessas funções não mudou — quem
chama de fora não precisou ser tocado.

**O que ainda falta (decisão explícita do Osmar: escopo menor pra
Entrega 3, migrar o resto sob demanda):** `caracteristicaDesbloqueada(classe,
nome, nivel)` e `contarRepeticoesCaracteristica(classe, nome, nivel)`
continuam recebendo `nome` (string livre) como parâmetro — quem chama
ainda passa o nome de exibição direto ('Mestre Tático', 'Indomável',
'Surto de Ação', 'Pau pra Toda Obra', 'Ataques Estudados', 'Ajuste
Tático', 'Inspiração de Bardo', 'Fonte de Inspiração'), em
`FichaShell.tsx`, `calculoPersonagem.ts` e `inspiracaoBardo.ts`. Migrar
isso é um passo maior (adicionar ID pra cada uma dessas ~8
características em `idsCaracteristicasClasse.ts`, trocar o parâmetro
das 2 funções de `nome: string` pra `id: IdCaracteristicaClasse`, e
atualizar as ~8 chamadas nesses 3 arquivos) — fica pra quando alguma
dessas características específicas for tocada de novo por outro
motivo, não uma entrega isolada.

## Bardo — "pra quem foi concedido o dado de Inspiração" não é rastreado

**O que é:** hoje `inspiracaoGasto` é só um contador (quantos usos o
Bardo já gastou) — não existe registro de "esse dado específico foi
dado pra outra criatura X". Isso só importa pro Colégio da Bravura
(Inspiração em Combate: qualquer criatura que tenha um dado do Bardo
pode usá-lo, não só o próprio Bardo) — não trava nada da classe base
nem do Colégio do Conhecimento.

**O que falta:** decidir um schema quando chegar a vez do Colégio da
Bravura — provavelmente fora do escopo de "ficha de 1 personagem"
atual do app (precisaria saber o estado de outros personagens da
mesa). Discutir com o Osmar antes de implementar.

## Level Up — revisar ordem das telas e o que cada uma mostra

**O que é:** o fluxo de Level Up (`LevelUpShell.tsx`) cresceu aos
poucos, entrega por entrega, conforme cada característica de classe
foi ganhando uma tela própria (Subclasse, Proficiências Bônus, Estilo
de Luta, Truques, Magias Preparadas, Especialista, ASI/Talento, Dádiva
Épica) — a ordem entre elas nunca foi desenhada de propósito, é só a
ordem em que cada `if` foi adicionado ao array `luSteps`
(`LevelUpShell.tsx`, função que monta os passos). O Osmar reportou que
o fluxo de hoje "tá muito estranho" testando na tela, sem apontar
ainda exatamente o quê (ordem das telas, textos repetidos, o passo
"Novas Características" mostrando/escondendo coisa que já tem tela
própria, etc.).

**Por que foi adiado:** precisa o Osmar testar mais e apontar
especificamente o que incomoda antes de redesenhar — mudar ordem de
passo por palpite pode trocar um problema por outro.

**O que falta:** sessão dedicada só pra passar por um Level Up
completo (idealmente um personagem que dispare o máximo de passos ao
mesmo tempo — ex: Bardo/Colégio do Conhecimento saltando pro nível 3)
anotando tela por tela o que confunde. Candidatos a rever, só como
ponto de partida (não é a lista final):
- Ordem atual: PV → Novas Características → Subclasse → Proficiências
  Bônus → Estilo de Luta → Truques → Magias Preparadas → Especialista
  → Talento/ASI → Dádiva Épica → Resumo — faz sentido pro jogador
  nessa ordem, ou deveria seguir a ordem que aparece no Livro do
  Jogador / na tabela de progressão da classe?
- O passo "Novas Características" (`step === 'features'`) mostra as
  características do nível que NÃO têm tela própria
  (`nomesComTelaPropria`) — vale a pena revisar se falta contexto ali
  (ex: não menciona nem linka pra characterísticas de SUBCLASSE, só
  de classe base).
- Textos de aviso/ajuda repetidos ou desatualizados entre telas (ex:
  o aviso de "[PH]" na tela de Subclasse foi ajustado na última
  entrega, vale conferir se sobrou algo parecido em outra tela).

## Magias de salvaguarda SEM dano — Modal de Salvaguarda não tem texto de sucesso/falha

O motor de dano de magia (Dano Base + Upcast + Escala de Truque + os
2 modais de Combat/Magias) está completo — ver DECISOES-DADOS.md
"Magias — motor de dano completo" e DECISOES-COMBATE.md "Magia de
ataque/salvaguarda — 2 modais". Ficou de fora só isto: 75 das 390
magias são de salvaguarda mas NÃO causam dano (ex.: Enfeitiçar
Pessoa — Sabedoria ou fica Enfeitiçado; efeito é condição, não
número) — `salvaguardaFalha`/`salvaguardaSucesso` ficam `null` pra
elas, então o Modal de Salvaguarda mostra só CD + atributo + "veja a
descrição da magia (ⓘ)", sem o texto separado de sucesso/falha que as
85 magias com dano já têm. Se o Osmar quiser esse texto também pras
75 sem dano, é o mesmo processo de extração já usado pras outras (ler
`descricaoCompleta`, já importado, sem reler PDF).

## Revisão de abas da planilha mestra (possível consolidação)

**O que é:** o Osmar comentou, depois de arrumar os IDs da planilha,
que tem a sensação de que `dnd-master-referencia.xlsx` tem abas
demais (hoje são 40) e que várias poderiam virar uma aba só. Ainda
não foi discutido quais nem por quê — só o sentimento de que a
estrutura atual pode estar fragmentada demais.

**Por que foi adiado:** precisa de uma sessão dedicada olhando aba
por aba com o Osmar (não é uma correção óbvia de bug de dado) —
juntar abas que hoje já são consumidas por `data/rulesets/dnd2024/*`
tem risco de quebrar o processo de importação/geração de cada
arquivo `.ts` se a estrutura de colunas mudar sem avisar. Antes de
mexer, também precisa mapear quais dessas 40 abas já viraram dado
real no app hoje vs. quais ainda são só referência (nunca foram
importadas).

**O que falta:** revisar a lista de abas (ver `Índice` da própria
planilha) junto com o Osmar, apontando candidatas óbvias a fundir
(ex: abas pequenas e correlatas tipo "Focos e Símbolos" /
"Munição" / "Bugigangas", ou "Montarias e Veículos" / "Veículos
Aquáticos") e decidir se a fusão é só na planilha (organização) ou
também exige tocar em algum `data/rulesets/dnd2024/*.ts` já gerado a
partir de uma dessas abas.

## Itens Mágicos — 5 itens do Lote 1 sem `tipoItem` (taxonomia de 6 categorias não cobre tudo)

**O que é:** classificando o Lote 1 (50 itens) de `tipoItem`
(`arma`/`armadura`/`escudo`/`consumivel`/`passivo`/`ativo-com-carga`
— `AUDITORIA-CONTEUDO.md` seção 4.1), 5 itens não se encaixaram bem
em nenhuma das 6 categorias: **Baralho das Ilusões** (efeito por
carta, narrativo demais), **Bastão Imóvel** e **Corda de Escalada**
(ação ativa sem carga numérica, mas a Corda tem CA/PV próprios — mais
parecido com uma criatura/objeto rastreável que um "item ativo"
simples), **Cajado da Píton** e **Cajado da Víbora** (transformam em
criatura controlada com bloco de estatística próprio — Manual dos
Monstros). No Lote 2, mais um: **Robe dos Itens Úteis** (remendos
consumíveis em quantidade variável — 2 de cada item fixo + 4d4
aleatórios — não dá pra representar como `cargas.max` fixo). No Lote
3, mais dois: **Bodes de Marfim** (3 sub-bodes com mecânicas e
recargas diferentes dentro do mesmo item — não dá pra resumir num só
`cargas`) e **Corda de Estrangulamento** (mesmo caso da Corda de
Escalada — tem CA/PV próprios, mais parecido com objeto rastreável
que item ativo simples). No Lote 4, mais um: **Penas de Quaal** (5
tipos de pena com mecânicas completamente diferentes dentro do mesmo
item). No Lote 5, mais três: **Elmo Brilhante** (concede uma magia
por dia dentre uma lista fixa — mais parecido com "passivo com magia
diária" que qualquer categoria das 6), **Espelho do Aprisionamento**
(prisão de criaturas com várias células e regras próprias, não é um
item "usado" pelo personagem) e **Garrafa do Efreeti** (convoca e
aprisiona um efreeti — narrativo demais). No Lote 6 (último lote,
288/288 concluído), mais sete: **Baralho das Surpresas** (mesmo caso
do Baralho das Ilusões — efeito por carta, narrativo demais),
**Dispositivo de Kwalish** (veículo com CA/PV próprios, mesmo padrão
da Corda de Escalada/Estrangulamento), **Esfera de Aniquilação** e
**Frasco de Ferro** (perigo ambiental/ferramenta narrativa, não é algo
que o personagem "usa" em combate), **Instrumento dos Bardos** (7
variantes com magias diferentes cada — mesmo caso de "molde que varia
por exemplar" do "Arma +1, +2 ou +3", ver achado abaixo), **Pedra
Iônica (geral)** e **Estátua de Poderes Incríveis (geral)** (linhas
"introdução da família" na planilha — descrevem só a mecânica
genérica de como a pedra/estátua funciona, sem efeito próprio; quem
carrega o efeito de verdade são as variantes nomeadas, já
classificadas). Ficaram com `tipoItem: null` em vez de forçar uma
categoria errada.

**Achado novo do Lote 4 — `bonusItem` não cobre item "genérico" com
bônus variável por raridade.** "Arma +1, +2 ou +3", "Armadura +1, +2
ou +3" e "Bastão Guardião de Pactos" não são um item específico — são
um molde onde o bônus depende de qual exemplar (raridade) o jogador
tem. No Lote 5, mais dois do mesmo padrão: "Escudo +1, +2 ou +3" e
"Munição +1, +2 ou +3". No Lote 6, "Instrumento dos Bardos" (7 tipos,
cada um com raridade e lista de magias própria) também entra nesse
balde. `bonusItem`/`tipoItem` ficaram `null` nesses 6 em vez de
chutar um valor. Se algum jogador vier a usar um desses em mesa, vai
precisar de uma pergunta manual ("qual variante você tem?") antes de
qualquer cálculo automático usar o bônus certo — não é um bug, é
limite do campo único pra este caso específico.

**Achado do Lote 6 — `cargas.max` não cobre carga variável por
exemplar.** "Lâmina da Sorte" tem uma propriedade (Desejo) com 1d4-1
cargas — determinado por sorteio quando o item é criado, não um valor
fixo conhecido igual aos outros itens com carga (que sempre tinham um
número fixo, ex: 20, 50, 5, 3). `cargas` ficou `null` (`tipoItem:
"ativo-com-carga"` e `bonusItem: 1` mantidos, já que o bônus fixo de
+1 arma esse sim é conhecido). Mesmo lote, "Manto de Invisibilidade"
tem um recurso de DURAÇÃO acumulada (2 horas totais, recarrega 1h a
cada 12h sem uso) em vez de cargas discretas — `cargas` também ficou
`null` por não caber no formato `{max, recarga}` pensado pra
contagem de usos, não pra minutos/horas de duração.

**Por que importa:** se algum dos itens `null` acima vier a precisar
de UI própria na Mochila/Combat (ex: o Osmar quiser equipar um deles
em mesa), a classificação atual (`null`) não vai disparar nenhum
componente — precisa de decisão explícita.

**Estado atual (auditoria de Itens Mágicos concluída, 289 itens):**
essa é a lista final de itens `tipoItem: null` — não há mais lotes
pendentes. "Tapete Voador" (item real do livro, achado faltando na
planilha durante o Lote 6, adicionado com confirmação do Osmar — ver
`DECISOES-DADOS.md`) entra na mesma lista: não é arma/armadura/
consumível/passivo nem tem carga própria, é mais parecido com uma
montaria/veículo convocável (categoria "Montarias e Veículos" do app,
não Itens Mágicos comum). Falta perguntar ao Osmar se vale criar uma
7ª categoria (ex: `ativo-sem-carga`, pra Bastão Imóvel/Cajados que
viram criatura) ou se esses casos ficam fora do "20%" da seção 4.1 até
aparecer pedido real de um jogador pra usar um desses itens em mesa.
