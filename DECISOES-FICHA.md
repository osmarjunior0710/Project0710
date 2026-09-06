# DECISOES-FICHA.md

> Decisões de design sobre a **Ficha do personagem** fora do
> Combat — abas Perfil/Atributos/Mochila/Magias, Loja, Equipamento,
> Itens Mágicos, Level Up (overlay em cima da Ficha), auto-save.
> Parte da família `DECISOES-*.md` — ver o índice em
> `DECISOES-DESIGN.md` pra saber em qual arquivo procurar cada
> assunto, e a seção 7 do `CLAUDE.md` pra regra de quando
> registrar uma entrada aqui.
>
> **Este arquivo guarda só padrão/decisão que vai importar de novo no
> futuro** — não é changelog de entrega. Bug já corrigido, ajuste
> visual pontual e narração de "fiz X, testei Y" não entram aqui: o
> código funcionando é a prova; o Git guarda o histórico.

---

## Descansos — pertencem à aba Perfil, não à aba Combat

**Decisão:** botões de Descanso Curto/Longo ficam na aba Perfil —
descanso não é uma ação de turno, é algo que acontece entre/depois de
combates. Mantém a aba Combat focada em "o que eu faço agora, no meu
turno".

## Ficha — nada é editável livremente depois de salva

**Decisão:** não existe distinção "editável sem XP" vs. "travada com
XP" (existiu no protótipo inicial, removida por simplificar demais
sem ganho real). Depois que o personagem é salvo, nada é editável
livremente — toda mudança passa pelo fluxo oficial (Level Up,
Mochila, Descanso). Não há hoje campo de texto/número solto editável
na Ficha; tudo é calculado a partir da seleção + progressão.

**Pendência conhecida:** isso ainda não é bloqueio funcional de
verdade em todo canto, é a regra assumida pelo design da tela.

## Tabbar da Ficha vira pill flutuante — padrão a repetir

**Decisão:** barra de abas (Perfil/Mochila/Magias/Combat) é uma pill
flutuante centralizada (`position: fixed`, sombra), não uma faixa
fixa de largura total no rodapé — mesmo padrão já usado nas pills
Voltar/Avançar do wizard. **Padrão a repetir** pra qualquer navegação
fixa futura no app: 2ª vez que uma barra de largura total virou pill
flutuante (a 1ª foi o rodapé do wizard).

## Ficha lê o personagem real via componente filho, não early return antes dos hooks

**Decisão:** `FichaShell.tsx` é dois componentes — o de fora só busca
o personagem pelo `:id` e decide entre "não encontrado" ou renderizar
`FichaConteudo`, que recebe o `PersonagemSalvo` já garantido como
prop e só aí chama hooks.

**Por quê (gotcha reaproveitável em qualquer tela nova que dependa de
um recurso buscado por rota):** um `if (!x) return (...)` **antes**
de hooks no mesmo componente quebra a Regra dos Hooks do React (hooks
precisam rodar sempre na mesma ordem) — bug sutil de estado
bagunçado, não erro óbvio. Separar em dois componentes resolve limpo.

## Mochila — decisões de arquitetura consolidadas

**Peso desconhecido vira aviso, nunca 0 silencioso** — quando um item
não tem peso cadastrado pra aquele nome exato, a Mochila mostra "sem
peso cadastrado" na linha e soma quantos itens ficaram de fora do
total ("N itens não entram nessa soma"), em vez de fingir peso 0.
Regra geral do projeto (nunca inventar dado que a planilha não tem)
aplicada dentro do motor de cálculo, não só na importação.

**Kits desagregam nos itens de dentro** — "Kit de X" nunca aparece
como 1 linha; `core/mochila.ts` já desagrega ao montar a lista (cada
componente vira item real, com peso/descrição próprios), verificado
contra a aba **"Kits — Conteúdo"** da planilha (mais confiável que
texto livre "Contém:" solto em outras abas). Kit sem lista de itens
nessa aba (Curandeiro, Escalada) é item único, não desagrega.

**Mochila é estado de verdade, não cálculo derivado a cada render:**
`FichaShell.tsx` inicializa da seleção 1 vez, depois só muta
(+/-/remover/adicionar), auto-save persiste. Cada item tem `id`
estável (não índice de array — quebraria ao remover). Categoria de
origem (Origem/Classe/Loja/Manual) é só metadado, não controla mais
agrupamento visual — tudo numa lista só.

**Padrão de ação destrutiva:** `-` de quantidade trava em 0 (não
apaga a linha sozinho); remover exige confirmação em 2 toques (1º
toque vira "confirmar 🗑" por 3s, 2º remove) — evita perder item por 1
toque errado sem precisar de modal separado. Mesmo padrão vale pra
qualquer ação destrutiva frequente no app.

**Agrupada em categorias fixas** (Armas / Armadura+Escudo / Jóias e
Artefatos / Outros, via `categoriaMochila` — reaproveita
`identificarEquipamento`, ver "Equipamento" abaixo), grupo vazio fica
invisível (não aparece como cabeçalho sem itens). "Jóias e Artefatos"
fica sempre vazio até existir dado de item mágico com categoria
própria.

**Faixas de cor da barra de peso** (mesma função usada por Loja e
Mochila, `corDaCarga`): até 75% verde, até 85% amarelo, até 95%
laranja, até 100% vermelho, acima de 100% vermelho escuro. O
percentual usado pra decidir a cor não é limitado a 100 (precisa
saber se passou do limite); só a LARGURA da barra é.

**Data/origem:** 2026-08, plano de Equipamento E1 + ajustes.

## Avatar → menu de preferências (Itens detalhados / Peso da Mochila)

**Decisão:** ícone 👤 no cabeçalho da Ficha abre um dropdown M3 com
switches de preferência de exibição — hoje 2: "Itens detalhados"
(mostra descrição de cada item sempre visível, em vez de popup ⓘ) e
"Peso da Mochila" (mostra/esconde a caixa de Carga + coluna de peso
juntas). Estrutura em lista (`.map()`), pensada pra crescer sem
precisar de outro ponto de entrada na tela.

**Gotcha reaproveitável:** overlay `position: fixed` renderizado
dentro de um elemento clicável precisa de `stopPropagation` no clique
de fechar, senão o clique vaza pro elemento pai — já apareceu 3x
(`InfoValor`, `InfoChip`, `ItemComDescricao`) antes de virar hábito
de checar em todo componente de popup novo.

**Pendência conhecida:** preferência não persiste entre sessões
(reseta ao recarregar) — estado local por ora.

**Data/origem:** 2026-08.

## Apagar personagem — dupla confirmação no próprio botão (revertido de "digitar a palavra", 2026-09)

**Decisão atual:** 1º toque no 🗑️ arma o botão (vira "Confirmar",
vermelho/texto branco); 2º toque no MESMO botão apaga de vez. Qualquer
outro toque na tela desarma sem apagar.

**Histórico:** a versão anterior pedia digitar a palavra "apagar" num
modal, justamente pra evitar confirmar no automático sem querer — o
Osmar pediu a troca de volta pra um fluxo de 2 toques mais rápido,
ciente de que fica mais fácil de apagar sem querer que digitar uma
palavra. Se isso virar problema de novo, a solução anterior (modal +
palavra digitada) já está no histórico do Git pra recuperar.

## Capacidade máxima de carga — Força × 7 kg (Pequeno/Médio)

**Fato de regra confirmado na planilha** (aba "Glossário de Regras",
tabela oficial por Tamanho — Minúsculo ×3,5, Pequeno/Médio ×7, Grande
×13,5, Enorme ×27, Colossal ×54,5 kg). Toda espécie jogável hoje é
Pequeno ou Médio (mesmo multiplicador), então o código não lê o campo
Tamanho de verdade ainda — só vai precisar quando espécie Grande ou
traço "Porte Poderoso" (Golias) for suportado.

## Loja — decisões de arquitetura consolidadas

**Catálogo real, agrupado por categoria** (Armas/Armadura/Escudos/
Ferramentas/Instrumentos/Focos/Munição/Equipamento de Aventura, cada
categoria em acordeão colapsável), item com layout de campos
específico pro tipo (arma: Dano/Propriedades/Mod. Ataque; armadura:
CA/Furtividade; ferramenta: Atributo). "Kits" (nome começa com "Kit
de ") ganharam categoria própria, separada de Equipamento de
Aventura, com popup de descrição — resto do catálogo mostra a
descrição direto no card, sem popup.

**Comprar/vender com estepper** (`ItemCarrinho[]`, não mais
`string[]` empurra-só) — ouro restante recalculado a cada render,
nunca dessincroniza. Moeda: 1 PO = 10 PP = 100 PC (regra confirmada,
planilha não tem tabela — combinada com o Osmar).

**Mod. de Ataque calculado de verdade:** maior entre FOR/DES se a
arma tiver Acuidade, senão DES pra à Distância e FOR pra Corpo a
Corpo; soma Bônus de Proficiência se a classe for proficiente na
categoria (lido de `proficienciasArmaArmaduraClasse.ts`, dado real).

**"Você já está levando" (Origem/Classe)** — caixas mostrando o que
já foi concedido antes de qualquer compra, reaproveitando
`calcularItensIniciais` (mesma fonte que já monta a Mochila da
Ficha — nada duplicado). Cabeçalho de ouro/peso fica `sticky` ao
rolar.

**Fora de escopo por decisão explícita do Osmar:** desconto de
Talento Artificeiro, corte de itens acima de 205 PO.

**Data/origem:** 2026-08, Entrega A5 + 2 rodadas de ajuste
(referência: prints de um protótipo HTML anterior do Osmar).

## Equipamento — mecanismo de equipar/CA/Atacar/Sintonização

**Identificação por catálogo, não suposição:** `core/equipamento.ts`
cruza o **nome** do item da Mochila contra os catálogos reais
(armas/armaduras) pra saber o tipo — item sem match (ração, item
mágico sem categoria própria) não ganha controle de equipar.

**Exclusividade de slot, derivada de "é a mesma mão física", não
hardcoded por nome de item:** equipar em slot ocupado libera o outro
item automaticamente; arma de Duas Mãos ocupa Mão Principal E libera
Mão Secundária/Escudo; Escudo e Mão Secundária se excluem entre si;
arma Versátil empunhada com 2 mãos (toggle próprio) segue a mesma
regra de "ocupa a Mão Secundária" e usa o dado maior da propriedade
(`Versátil (1d10)`).

**CA/Atacar leem o equipamento de verdade** (não mais a opção A/B/C
do wizard) — Armadura/Escudo iniciais já nascem equipados
automaticamente (primeira Armadura/Escudo da lista inicial), Arma
NÃO (fica sempre escolha explícita na Mochila). Sem nada equipado,
Ataque Desarmado real entra no lugar de fixture.

**Regras de D&D confirmadas contra o livro (Cap. 1/3/5/6, Apêndice
C), relevantes pro cálculo:** Acuidade permite usar FOR ou DES, o
maior; Ataque Desarmado = 1 + mod. FOR de dano Contundente + Bônus de
Proficiência no acerto; propriedade **Leve** permite 1 ataque bônus
com OUTRA arma Leve na Mão Secundária, sem somar mod. de atributo no
dano desse ataque extra (a menos que seja negativo) — é regra de
ATAQUE, não de equipar (duas armas não-Leve continuam podendo ser
equipadas ao mesmo tempo, só não geram o ataque bônus); Sintonização
vale pra qualquer item mágico (arma/armadura/escudo/acessório), não só
"acessório"; Escudo ocupa fisicamente uma mão.

**Sintonização — limite de 3, boolean derivado de texto livre da
planilha:** a coluna real tem 26+ variantes de texto pra "sim"/"não"
— regra aplicada: só é `false` quando o texto começa com "não"/"nao",
qualquer outra coisa vira `true` (inclui "Opcional..." — sintonizar
dá bônus extra). Texto original preservado à parte pra conferência
manual.

**Proficiência com arma real (resolvido no B0 do Bruxo):**
`core/proficienciaArma.ts`'s `classeProficienteComArma(classe, arma)`
lê a coluna "Proficiência com Armas" de `proficienciasArmaArmaduraClasse`
(texto livre) e resolve contra `arma.categoria`/`arma.propriedades` —
sem Bônus de Proficiência se a classe não for proficiente (a regra
real só tira o bônus, não trava o ataque). Padrões cobertos: "Simples
e Marciais" (tudo), "Simples" sozinho, e as 2 exceções por propriedade
já confirmadas na planilha (Ladino: Acuidade OU Leve em qualquer
Marcial; Monge: Leve só em Marcial Corpo a Corpo) — mesma função serve
sem mudança quando essas 2 classes forem importadas. Sem entrada pra
uma classe = não proficiente, nunca assume.

**Data/origem:** 2026-08, plano de Equipamento E2-E4 completo +
verificação de schema contra PDFs reais em chat paralelo.

## Itens Mágicos — catálogo + Sintonizar na Mochila

**Catálogo real** (288 itens, aba "Itens Mágicos" da planilha —
"Itens Mágicos Inteligentes" e "Artefatos" ficam de fora por ora, só
entram se fizerem falta numa mesa real). Botão "✨ Sintonizar" aparece
em qualquer item da Mochila cujo nome bata com o catálogo; popup ⓘ
mostra Categoria/Raridade/Efeito Resumido automaticamente, sem UI
nova — reaproveita o popup que toda linha da Mochila já tinha.

**Testar sem tela de "receber item":** "Adicionar item" (nome livre,
já existia desde a Mochila virar estado de verdade) reconhece
automaticamente um item mágico se o nome bater exatamente com o
catálogo — não precisou de feature nova pra simular ganhar um item.

**Data/origem:** 2026-08.

## Perfil — 18 Perícias completas, Pau pra Toda Obra, Bônus de Proficiência

**Decisão:** todas as 18 perícias sempre aparecem (não só as
proficientes), marcador ⚫ proficiente / ⚪ sem proficiência / ⭐ extra
pra Especialista. Prioridade de bônus por perícia: Especialista
(dobrado) > proficiente (inteiro) > Pau pra Toda Obra (metade,
arredondado pra baixo) > nenhum — ordem que vale pra qualquer classe
com essas características combinadas.

## Magia de item vs. magia natural — sistemas separados

**Decisão:** magia de item mágico (bastão, anel com cargas) não entra
na aba Magias nem em `personagemConjura()` — vive como item com
contador de cargas na Mochila, usado pela ação **"Usar Objeto"**
(distinta de "Usar Magia" no Cap. 1 do livro — distinção que já é do
jogo, não invenção de design). Resolve de graça o caso de
não-conjurador com item mágico, sem lógica de exceção.

`personagemConjura()` só responde "tem fonte PRÓPRIA de conjuração?"
— 3 fontes possíveis: classe atual (implementado), multiclasse
(pendência), Talento de Origem que concede magia (pendência, origens
ainda indisponíveis no wizard).

## Aba Magias sempre visível, nunca escondida por classe

**Decisão:** não-conjurador vê estado vazio, a aba não some —
consistência de navegação (mesma aba sempre no mesmo lugar) vale mais
que economizá-la, e evita quebrar em multiclasse (visibilidade
derivada de `personagemConjura()`, nunca hardcoded por classe).

## Aba Magias tem conjuração de verdade, não só a aba Combat

**Decisão:** truques/magias preparadas na aba Magias têm botão "Usar"
de verdade (reaproveita o mesmo mecanismo do painel de Ação do
Combat — `EscolherCirculoShell`, `gastarSlotCirculo`,
`modAcertoConjuracao`, tudo já existia, só passado como prop pra
mais um lugar) — jogador pode conjurar fora do fluxo estrito de turno
de combate (uso utilitário fora de sessão de luta).

## Ficha — auto-save de progresso via `useEffect`, não save manual por handler

**Decisão:** um único `useEffect` observando os campos que importam
(nível, PV, recursos gastos, equipamento, etc.) salva o personagem
sempre que mudam — não uma chamada de save espalhada em cada handler.

**Por quê:** salvar manualmente logo após um `setState` captura o
valor ANTIGO (setState é assíncrono) — exigiria duplicar cálculos só
pra montar o objeto certo a cada handler novo. O `useEffect` roda
depois do re-render, com o valor atualizado, e cobre qualquer ponto
de mudança futuro de graça, sem precisar lembrar de adicionar a
chamada em handlers novos.

**O que fica de fora de propósito:** estado do turno atual (Ação/
Bônus/Reação usada) não persiste — é esperado resetar como qualquer
app de mesa físico.

## Level Up — rolagem de dado de vida é definitiva e sobrevive a fechar/reload

**Decisão:** ao escolher "Rolar" o dado de PV, uma tela cheia preta
dedicada (não o `RollOverlay` genérico — aquele é feito pra ser
dispensável por toque fora, esse não pode) mostra a animação e o
resultado definitivo; depois disso o passo trava, sem card de escolha
de novo. O estado (`levelUpHpModo`/`levelUpHpRolado`) vive em
`FichaShell.tsx`, não no `LevelUpShell` — sobrevive a fechar a tela
inteira e reabrir, trocar de aba, e F5, porque entra no mesmo
mecanismo de auto-save geral; só zera quando o Level Up é confirmado
de verdade.

**Padrão reaproveitável:** qualquer rolagem "de uma vez só, sem
volta" (não cancelável) não deve reusar o `RollOverlay` genérico —
merece tela própria; e qualquer estado que precise sobreviver a
fechar/reabrir um fluxo (não só navegar dentro dele) precisa subir
pro componente pai que já tem auto-save, não ficar em `useState`
local do fluxo.

**Data/origem:** 2026-08.
