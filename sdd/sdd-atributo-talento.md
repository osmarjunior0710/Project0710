# SDD — Atributo de conjuração/bônus "herdado" do ASI do próprio talento (8 talentos)

Fonte: planilha (aba `Talentos`) + PDF `livros-referencia/livro-do-jogador/06_-_Cap_5_Talentos.pdf`
(texto literal de cada talento citado abaixo). Achado investigando a infra do E7 (Talentos
Selvagens) — ver `EmDev.md` pro histórico de como foi achado.

## 1. O problema, confirmado no código (não suposição)

`PersonagemSalvo`/`WizardSelection` nunca guardam "qual atributo específico este talento X
aumentou" — o ASI de um talento (`concedeAsi: {tipo: 'escolha-unica', ...}`) é aplicado direto no
total do atributo (`aumentarAtributos`, `FichaShell.confirmarLevelUp` linha ~3140) e a origem se
perde. Confirmado por grep: zero ocorrências de um campo assim fora de `talentoAtributo.ts`
(Resiliente, único caso que já tinha essa necessidade antes).

Toda magia concedida por um talento que precisa desse atributo (Iniciado em Magia, Telepático,
Tocado pela Sombra/Fadas, Conjurador Ritualista) entra marcada `classe: null`
(`useMagiasEConjuracao.ts`, `semClasse`). `modAcertoConjuracaoPorClasse` (`magiasPersonagem.ts`)
trata `classeDonaDaMagia: null` como "sem dono conhecido, usa o fallback da classe ATIVA" — não é
um bug de UI, é a ÚNICA fonte de mod./CD que essas magias têm hoje, e está errada sempre que a
classe ativa não bate com o atributo real do talento (ou quando não existe classe ativa nenhuma).

## 2. Os 8 talentos — texto literal (PDF) + estado atual

### Grupo 1 — atributo = "o atributo que ESTE talento aumentou" (ASI-derivado)

> **Telecinético** (Geral, pré-requisito nível 4+, p.208): "Aumento no Valor de Atributo. Aumente
> seu valor de Inteligência, Sabedoria ou Carisma em 1, até no máximo 20. Telecinese Menor. Você
> aprende a magia Mãos Mágicas. [...] O atributo de conjuração da magia é o atributo aumentado por
> este talento. Empurrão Telecinético. Como uma Ação Bônus, você pode empurrar telecineticamente
> uma criatura à sua vista a até 9 metros de você. [...] CD 8 mais o modificador de atributo do
> aumento por este talento e seu Bônus de Proficiência [...]."
> **Estado:** só o truque Mãos Mágicas existe (`efeitoMecanico: 'magia-geral-concedida'`). Empurrão
> Telecinético não tem mecânica nenhuma (texto só). Mãos Mágicas concedida já usa o atributo errado
> (fallback de classe ativa).

> **Telepático** (Geral, nível 4+, p.208): "[...] Detectar Pensamentos [...] Seu atributo de
> conjuração para a magia é o atributo aumentado por este talento."
> **Estado:** magia concedida (`efeitoMecanico`), mod. errado.

> **Tocado pela Sombra** (Geral, nível 4+, p.11 PDF — "Tocado Pelas Sombras"): "[...] você tem essa
> magia e Invisibilidade sempre preparadas [...]. O atributo de conjuração das magias é o
> aprimorado por este talento."
> **Estado:** magias concedidas (`efeitoMecanico: 'magia-escolhida-por-escola'`), mod. errado.

> **Tocado pelas Fadas** (Geral, nível 4+, p.11 PDF — "Tocado Por Fadas"): mesma estrutura de Tocado
> pela Sombra, pra Passo Nebuloso + escola Adivinhação/Encantamento. **Estado:** idem.

> **Conjurador Ritualista** (Geral, nível 4+, pré-requisito conjuração prévia, p.6 PDF): "[...] Você
> tem essas magias sempre preparadas [...]. O atributo de conjuração das magias é o atributo
> aumentado por este talento."
> **Estado:** magias concedidas (`efeitoMecanico: 'magias-rituais-por-proficiencia'`), mod. errado.

> **Envenenador** (Geral, nível 4+, p.205/p.7 PDF): "[...] Ao sofrer dano do item envenenado, uma
> criatura deve ser bem-sucedida em uma salvaguarda de Constituição (CD 8 mais o modificador do
> atributo aumentado por este talento e seu Bônus de Proficiência) [...]."
> **Estado:** nenhum `efeitoMecanico` — talento 100% texto hoje.

> **Dádiva do Ataque Irresistível** (Dádiva Épica, nível 19+, p.211): "[...] Tirou 20 no ataque: dano
> extra = **valor** do atributo aumentado [pelo talento]." (não o modificador — o valor bruto do
> atributo, única diferença de fórmula entre os 7 deste grupo).
> **Estado:** nenhum `efeitoMecanico` — texto só.

### Grupo 2 — atributo é escolha livre (não ligado ao ASI)

> **Iniciado em Magia** (Origem/Versátil do Humano): "[...] você escolhe entre Inteligência,
> Sabedoria ou Carisma como atributo de conjuração dessas magias." (planilha + texto já confirmado
> em sessões anteriores — ver `aprendizados/classes/` se existir foco próprio, senão
> `DECISOES-CLASSES.md` "Mesmo talento pego por 2 fontes independentes").
> **Estado:** `atributoMagiaIniciadaEscolhido`/`...EspecieEscolhido` já existem em `WizardSelection`,
> capturados na tela certa — só NUNCA lidos fora do wizard. Mod. cai no fallback de classe ativa,
> igual o Grupo 1.

## 3. Arquitetura (1 infra, 2 formas de preencher a gaveta)

### 3.1 A gaveta: `Record<string, Atributo>` por talento, genérico

Novo campo em `PersonagemSalvo`/`WizardSelection`: `atributosAsiTalentoEscolhidos: Record<string,
Atributo>` (chave = `talento.id`) — mesmo espírito de `atributosResilienteEscolhidos`
(`talentoAtributo.ts`), só que genérico pra qualquer talento, não só Resiliente. Resiliente
CONTINUA com seu próprio campo (não migra agora — funciona, trocar é risco sem ganho, mesmo
raciocínio já registrado em `Backlog.md` "Contatar Patrono" pra casos parecidos); o campo novo é só
pros 7 do Grupo 1.

**Novo campo no tipo `Talento`:** `usaAtributoProprioAsi?: true` — marca os 7 do Grupo 1. Em
`FichaShell.confirmarLevelUp`, quando `resultado.atributosAumentados` tem exatamente 1 atributo
(sempre o caso pra `escolha-unica`) E o talento escolhido (`talentoGeralEscolhido`/
`dadivaEpicaEscolhida`) tem essa flag, grava
`atributosAsiTalentoEscolhidos[id] = atributosAumentados[0]` no mesmo `setSelecao` que já aplica o
ASI — 1 linha nova no ponto que já existe, não precisa de tela nova (a escolha de QUAL atributo já
acontece no passo `asiAtributo` do Level Up, que já é obrigatório pra qualquer talento com ASI).

### 3.2 Resumo de conjuração sem classe (reaproveitado pelos 2 grupos)

Novo `core/conjuracaoDeTalento.ts`:
```
resumoConjuracaoDeTalento(atributo: Atributo, valorAtributo: number, bonusProficiencia: number): ResumoConjuracao
```
Mesma fórmula de `resumoConjuracao` (CD = 8+mod+BP; ataque = mod+BP), sem exigir `Classe` — usa
`bonusProficienciaAtual` (nível TOTAL do personagem) já calculado em `FichaShell.tsx`, igual outras
características cross-classe (Revelação Celestial, etc. — ver seção 6.5 do CLAUDE.md, reuso direto
do padrão já usado lá).

### 3.3 Plugando nas magias já concedidas (Grupo 1 com magia + Grupo 2)

`useMagiasEConjuracao.ts` troca `classe: null` por uma `classeNome` sentinela só pra essas fontes:
`'__talento:' + talentoId + '__'` (ex.: `'__talento:telepatico__'`). `FichaShell.tsx` registra 1
entrada em `resumosPorClasse` pra cada talento ATIVO que precisa disso (Grupo 1 com atributo já
escolhido + Grupo 2 com escolha feita), usando `resumoConjuracaoDeTalento` acima —
`modAcertoConjuracaoPorClasse` já despacha por `classeNome` string sem precisar mudar a função.

### 3.4 Os 3 que ainda não têm mecânica nenhuma (Telecinético/Envenenador/Dádiva do Ataque Irresistível)

Não passam pelo pipeline de magia — usam `resumoConjuracaoDeTalento` DIRETO na hora de implementar
cada um (popup de Ação Bônus/Reação próprio, fora do escopo desta infra comum — ver seção 5,
entregas próprias). Dádiva do Ataque Irresistível usa `valorAtributo` puro (não o `.cd`/`.modAtaque`
do resumo) — função separada e simples, não precisa do `ResumoConjuracao` inteiro.

## 4. QA no SDD inteiro (seção 6.2.1 do CLAUDE.md)

**QA Técnico:**
- `modAcertoConjuracaoPorClasse` já despacha por `classeNome` sem mudar assinatura — confirmado
  lendo o código (`magiasPersonagem.ts:622-633`), zero risco de regressão nos outros usos.
- Resiliente NÃO migra pro campo genérico agora — reduz o escopo, evita mexer em algo que já
  funciona. Confirmar em teste que os dois campos convivem sem conflito de id (ids de talento são
  globalmente únicos, sem risco de colisão).
- Dádiva do Ataque Irresistível é o único dos 8 que usa o VALOR do atributo, não o mod./CD — não
  cabe dentro de `resumoConjuracaoDeTalento` genérico; função própria, menor.
- Dos 8, só 5 têm mecânica de MAGIA concedida hoje (Telepático/Tocado pela Sombra/Tocado pelas
  Fadas/Conjurador Ritualista/Iniciado em Magia) — essas 5 ganham o conserto de verdade nesta
  entrega. Os outros 3 (Telecinético/Envenenador/Dádiva do Ataque Irresistível) só ganham a GAVETA
  preenchida + a função pronta pra usar — a mecânica de cada um (Empurrão/veneno/dano extra) é
  `[PH]`, cada 1 vira entrega própria depois (mesmo caminho do Backlog/PENDENCIAS, CLAUDE §6.3.1).

**QA Jogador Noob:**
- A escolha de atributo já tem tela (passo `asiAtributo` do Level Up) — não precisa de tela nova,
  só de a escolha passar a ter efeito de verdade. Jogador não percebe nada de diferente na hora de
  escolher, só que a CD/mod. finalmente bate com o que ele escolheu.
- Nenhuma dessas correções muda nenhum texto/fluxo visível pra quem NÃO tem esses 8 talentos —
  confirmar com o Char Multiclasse (que não tem nenhum deles hoje; se algum foco quiser testar,
  entra como talento extra nele só pra essa validação, removido depois — ver seção 6.4 do
  CLAUDE.md, personagem dedicado complementar).

## 5. Replanejamento (seção 6.2.2) — proposta de entregas

1. **Entrega 1 — infra comum**: gaveta `atributosAsiTalentoEscolhidos`, flag
   `usaAtributoProprioAsi`, gravação em `confirmarLevelUp`, `core/conjuracaoDeTalento.ts`
   (`resumoConjuracaoDeTalento` + função separada pro valor puro).
2. **Entrega 2 — conserta os 5 com magia já concedida**: Iniciado em Magia, Telepático, Tocado pela
   Sombra, Tocado pelas Fadas, Conjurador Ritualista — troca `classe: null` pela sentinela, registra
   em `resumosPorClasse`. 1 entrega só (mesmo padrão repetido 5x, baixo risco).
3. **Entrega 3 — Telecinético**: Empurrão Telecinético (Ação Bônus, CD, popup de salvaguarda —
   reaproveita `SalvaguardaDoAlvoModal`, seção 6.5).
4. **Entrega 4 — Envenenador**: aplicar veneno (Ação Bônus) + salvaguarda de quem é atingido.
5. **Entrega 5 — Dádiva do Ataque Irresistível**: dano extra em crítico natural 20 (reaproveitar o
   fluxo de confirmação de crítico já existente, seção 6.5).

Entregas 3-5 são independentes entre si e de prioridade mais baixa (talentos avançados/épicos,
menos usados) — a 1 e 2 são o conserto de verdade do bug achado; 3-5 são features novas que só
ficam possíveis depois da infra.
