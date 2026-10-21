# SDD — Talentos Selvagens (Psiônico UA 2025, E7)

Fonte: planilha (aba `Talentos`, categoria "Talento Selvagem", 10 linhas, `Fonte: UA Psiônico 2025`)
+ PDF `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf`, p.21-23. Regra de
quando um talento selvagem pode ser escolhido (planilha não tem essa linha — só o PDF, p.21):
"Se sua Origem lhe conceder um Talento, você pode escolher um Talento Selvagem no lugar de um
Talento de Origem. Além disso, você pode escolher um Talento Selvagem sempre que a regra do jogo
permitir que você escolha um Talento Geral." Isso é regra de ELEGIBILIDADE de escolha (onde a
lista aparece no wizard/Level Up), não precisa de mecânica de `core/` própria — entra como mais
uma fonte na tela que já lista Talentos Gerais/de Origem disponíveis.

## 1. O que é comum aos 10 (decidido 1x, reaproveitado 10x)

Todos os 10 têm a MESMA estrutura de 3 partes (texto idêntico nos 10, só o conteúdo muda):

> **Pré-requisito:** Não pode possuir outro Talento Selvagem.
> **Talento Psíquico:** Você conhece o truque `<X>`. Você também tem sempre preparada a magia
> `<Y>` [e `<Z>`], podendo conjurá-la(s) uma vez sem gastar espaço de magia. Você recupera essa
> capacidade ao terminar um Descanso Longo e também pode conjurá-la(s) usando espaços de magia que
> possua. Essas magias não exigem componentes Verbais [nem/ou] Materiais, e você escolhe entre
> Inteligência, Sabedoria ou Carisma como atributo de conjuração (definido ao escolher este
> talento). [Ao atingir o 3º nível de personagem, você também tem sempre preparada a magia `<W>`
> e pode conjurá-la da mesma forma.]
> **[Nome do benefício único]:** `<regra específica — ver seção 3>`

**Achado comparando planilha × PDF:** a planilha resume "Benefícios" mas **omite** a dispensa de
componentes Verbais/Materiais nessas conjurações — só está no PDF. Usar o PDF como fonte pra esse
detalhe (a planilha não contradiz, só não menciona).

**Divergência de nome achada e resolvida:** planilha diz magia concedida por Modelador de Carne =
"Passos Largos"; PDF diz "Passos Longos (Longstrider)". Conferido no catálogo (`magias.ts:2571`):
a magia oficial já importada se chama **"Passos Largos"** — usar esse nome (bate com a planilha,
que é sempre o dado que vale, seção 3 do CLAUDE.md). "Arremesso Telecinético" (truque do talento
Psicinético) também já confirmado no catálogo (`magiasPsionico.ts:12`).

### 1.1 Reuso: truque + magia(s) sempre preparada(s), grátis 1x/Descanso Longo

É o **mesmo formato exato** que `core/magiaTalentoGeral.ts` já resolve pra Telepático/Tocado pela
Sombra (efeito `'magia-geral-concedida'`: lista de truques + lista de `{nome, recarga:
'descansoLongo'}`). Reaproveitar DIRETO — zero mecanismo novo pra essa parte. Cada um dos 10
Talentos Selvagens ganha uma entrada em `talentos.ts` com esse mesmo `efeitoMecanico`.

### 1.2 Infra NOVA necessária: atributo de conjuração ESCOLHIDO pelo jogador, sem classe

Diferente de Iniciado em Magia (atributo fixo, vem da classe associada à Origem), aqui o jogador
ESCOLHE Int/Sab/Car ao pegar o talento — e isso vale mesmo num personagem SEM nenhuma classe
conjuradora (ex.: Guerreiro com Talento Selvagem). Hoje não existe conjuração "solta" (toda CD/
acerto de magia passa por `resumoConjuracao(selecao, classe, nivel)`, que exige uma `Classe`).

**Decisão de arquitetura:** novo módulo `core/talentoSelvagem.ts` com:
- `atributoTalentoSelvagemEscolhido(talentoId, escolhas): Atributo | null` — mesmo padrão de
  `atributosResilienteEscolhidos` (`talentoAtributo.ts`), escolha salva em
  `PersonagemSalvo.escolhaAtributoTalentoSelvagem: Record<string, Atributo>` (chave = id do
  talento — futuro-proof pra Dádiva/repetição, mesmo cuidado de `talentoAtributo.ts`).
- `resumoConjuracaoTalentoSelvagem(atributo, valorAtributo, bonusProficiencia): ResumoConjuracao` —
  mesma fórmula de `resumoConjuracao` (CD = 8 + mod + BP; ataque = mod + BP), SEM precisar de
  `Classe` — usa `bonusProficienciaAtual` (nível TOTAL do personagem) já calculado em
  `FichaShell.tsx`, igual outras características cross-classe (Revelação Celestial etc.).
- Esse resumo entra em `resumosPorClasse` com uma `classeNome` sentinela própria por talento (ex.:
  `'__talentoSelvagem:atmocinese__'`) — `modAcertoConjuracaoPorClasse` (`magiasPersonagem.ts`) já
  despacha por `classeNome` sem precisar mudar a assinatura da função; as magias do talento entram
  marcadas com essa `classeNome` em `MagiaComClasseOpcional`, igual qualquer fonte multiclasse.

## 2. Escolha de talento no Level Up/Wizard

`TelaEscolherTalento.tsx` (Level Up) e as telas de Origem/Talento Geral (wizard) precisam: (1)
listar os 10 quando a regra de elegibilidade (seção 0) valer; (2) aplicar o pré-requisito
"não pode ter outro Talento Selvagem" (igual outros talentos com `repetivel: false` + exclusão —
conferir se já existe um mecanismo de "talentos mutuamente exclusivos" ou se esse caso é novo); (3)
abrir uma sub-tela de escolha do atributo de conjuração (Int/Sab/Car) — mesmo padrão de tela de
`TalentoOrigemEscolhasStep.tsx`.

## 3. Os 10 benefícios únicos — texto bruto + agrupamento por mecânica

**Grupo A — "1x/turno trocar tipo de dano pra X" (3 talentos, mesma mecânica, tipo de dano muda):**
> Uma vez por turno, ao conjurar uma magia ou atingir com uma jogada de ataque que cause dano de
> Concussão, Perfurante, Cortante ou Psíquico, você pode [mudar/alterar] o tipo de dano para `<X>`.
- **Atmocinese** → Elétrico. Truque: Toque Chocante. Magias: Névoa; nível 3+: Rajada de Vento.
- **Criocinese** → Gélido. Truque: Raio de Gelo. Magias: Armadura de Agathys **e** Faca de Gelo
  (2 magias de nível 1, cada uma com seu próprio uso grátis — não 1 "ou" o outro).
- **Pirocinese** → Ígneo. Truque: Criar Chama. Magias: Mãos Flamejantes; nível 3+: Raio Abrasador.

**Grupo B — "N usos = Bônus de Proficiência/Descanso Longo, Vantagem numa ação específica" (2 talentos):**
> Ao usar a ação de `<Ação>`, você pode conceder Vantagem a si mesmo em um teste feito como parte
> dessa ação. Usos = Bônus de Proficiência, recupera no Descanso Longo.
- **Clarividência** → ação Buscar. Truque: Orientação. Magias: Detectar o Bem e o Mal; nível 3+:
  Ver o Invisível.
- **Empata** → ação Influenciar. SEM truque. Magia: Enfeitiçar Pessoa (só sem componente Verbal,
  não "nem Materiais" — único dos 10 com essa variação textual); nível 3+: Acalmar Emoções.

**Grupo C — "N usos = Bônus de Proficiência/Descanso Longo, +mod. Int (mín. +1) num teste específico" (2 talentos):**
> Ao realizar um teste de `<Atributo>` (`<Perícia A>` ou `<Perícia B>`), adiciona um bônus igual ao
> seu modificador de Inteligência (mínimo +1). Usos = Bônus de Proficiência/Descanso Longo.
- **Modelador de Carne** → Destreza (Acrobacia/Prestidigitação). Magia: Passos Longos (checar nome
  no catálogo); nível 3+: Alterar-se.
- **Trapaceiro Psiônico** → Carisma (Enganação/Persuasão). Truque: Ilusão Menor. Magia:
  Disfarçar-se.

**Grupo D — sozinhos, mecânica própria:**
- **Biocinese**: "Quando uma magia sua cura PV de uma criatura, pode rolar 1d4 extra e somar aos PV
  recuperados. Usos = Bônus de Proficiência/Descanso Longo." Truque: Poupar os Moribundos. Magias:
  Palavra Curativa; nível 3+: Vigor Arcano. **Mecânica nova**: oferta de dado extra numa rolagem de
  CURA — mesma família de "oferecer dado extra" (Força Vital/Transe Destrutivo), mas em
  `confirmarAlvoCura` em vez de dano; não tem precedente exato, precisa de provider novo simples
  (sem funil — só 1 fonte usa).
- **Sussurrador Mental**: "Ação: conexão telepática com 1 criatura vista a 36m, por 1h enquanto
  ficarem a 36m um do outro (precisa idioma comum). 1x, recupera no Descanso Curto OU Longo."
  Truque: Talho Mental. Magia: Sussurros Dissonantes. **Conferido, NÃO é reuso direto**:
  `core/conexaoTelepatica.ts` (Psiônico base) é outra mecânica — estende o alcance da telepatia
  PASSIVA do próprio personagem (rola dado, Ação Bônus, Dado de Energia Psiônica). Sussurrador
  Mental é diferente: liga com 1 criatura ESCOLHIDA à vista, exige idioma em comum, dura 1h, sem
  Dado de Energia nenhum (talento não-Psiônico). Mecânica nova, mas simples: 1 toggle "ativo até
  quando" (ou simplificado: "Não dá pra ativar/desativar, só usa 1x e acaba em 1h — informativo,
  igual Defesa Superior do Monge", já que o app não rastreia tempo real).
- **Psicinético (talento)**: "Ação Correr: +3m de Deslocamento até o fim do turno. Usos = Bônus de
  Proficiência/Descanso Longo." Truque: Arremesso Telecinético (magia nova do UA, já no catálogo
  via `magiasPsionico.ts`?  conferir). Magia: Onda Trovejante. **BLOQUEADO estruturalmente**
  (`PENDENCIAS.md` já lista: "Bônus só na ação Correr — o app não modela a ação Correr como
  estado") — o benefício único fica `[PH]`/texto só; truque+magia (seção 1.1) entram normais.

## 4. Proposta de quebra em entregas (pós-replanejamento, seção 6.2.2 do CLAUDE.md)

1. **Entrega 1 — infra comum + esqueleto `[PH]` de tudo**: `core/talentoSelvagem.ts` (atributo
   escolhido + resumo de conjuração sem classe), as 10 entradas em `talentos.ts`
   (`efeitoMecanico: 'magia-geral-concedida'`, truques+magias+recarga — reuso direto de
   `magiaTalentoGeral.ts`), sub-tela de escolha de atributo no Level Up/wizard, elegibilidade de
   escolha (Origem OU qualquer Talento Geral). Confirma nome exato de "Passos Longos/Largos" e de
   "Arremesso Telecinético" contra o catálogo antes de fechar o dado. Função própria `[PH]` em
   `core/` pra cada 1 dos 10 benefícios únicos (seção 6.3.1 do CLAUDE.md).
2. **Entrega 2 — Grupo A** (Atmocinese/Criocinese/Pirocinese): troca de tipo de dano 1x/turno —
   mesma mecânica 3x, 1 função genérica + 3 entradas de dado.
3. **Entrega 3 — Grupo B** (Clarividência/Empata): Vantagem numa ação específica, N usos.
4. **Entrega 4 — Grupo C** (Modelador de Carne/Trapaceiro Psiônico): +mod. Int num teste
   específico, N usos.
5. **Entrega 5 — Biocinese**: dado extra em cura.
6. **Entrega 6 — Sussurrador Mental**: conexão telepática (confirmar reuso da função do Psiônico
   base antes de codar).
7. **Entrega 7 — Psicinético (talento)**: truque+magia (já ativos desde a Entrega 1); o bônus de
   Correr fica `[PH]` com nota apontando pra `PENDENCIAS.md`.

## 5. QA no SDD inteiro (seção 6.2.1 do CLAUDE.md)

**QA Técnico:**
- Truque/magia grátis: reuso 100% de `magiaTalentoGeral.ts` — já testado em produção (Telepático),
  risco baixo.
- Mod/CD sem classe: infra NOVA (seção 1.2) — precisa de teste cobrindo explicitamente "personagem
  SEM nenhuma classe conjuradora com Talento Selvagem" (o caso que não existia antes).
- `magiasConjuraveis`/Combate E Magias (seção 6.6 do CLAUDE.md): as magias grátis desses talentos
  precisam entrar nas DUAS abas — `magiasGratisDosTalentosGerais` já alimenta isso hoje pros outros
  Talentos Gerais; confirmar que os 10 novos entram no MESMO caminho, não um novo.
- Sussurrador Mental: achar e reaproveitar a função de Conexão Telepática do Psiônico antes de
  escrever uma nova — só personagem COM Psiônico tem as duas ao mesmo tempo (testar no Char
  Multiclasse).

**QA Jogador Noob:**
- A escolha de atributo (Int/Sab/Car) precisa de texto explicando o que cada um muda (CD/acerto),
  não só 3 botões com o nome do atributo.
- Grupos A/B/C envolvem "N usos, recupera no Descanso Longo" — todo botão mostra quantos usos
  restam, igual já virou regra fixa (seção 6.4 item 5 do CLAUDE.md).
- Psicinético (talento): como o bônus de Correr fica `[PH]`, o texto da característica no Perfil
  já avisa "ainda não calcula automaticamente" — nunca silencioso.

## 6. Replanejamento (seção 6.2.2)

Grupos A/B/C agrupam o que antes seriam 7 entregas em 3 — cada grupo implementa 1 função genérica
parametrizada (tipo de dano / ação+perícia / atributo+perícia) usada 2-3x, em vez de 1 função por
talento. Biocinese e Sussurrador Mental continuam sozinhos (mecânica própria de verdade). Psicinético
(talento) explicitamente marcado como parcialmente bloqueado ANTES de começar, não descoberto no meio.
