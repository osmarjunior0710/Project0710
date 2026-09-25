# SDD — Multiclasse: Truques/Magias Preparadas por classe, tela única, fim do pill

> Ver `sdd/README.md` pra convenção. Este documento não é descartado
> ao fechar o foco — referência viva de como a mecânica funciona.

## Contexto / problema

Hoje `classeAtivaNome` (o "pill" Mago/Bardo/etc.) decide o que a
ficha mostra em Combate/Magias/Perfil. Já foi corrigido (fora deste
SDD, ver `DECISOES-CLASSES.md`) que:

- Recursos de Combate com contador (Fúria, Inspiração, Recuperar
  Fôlego, Magia de Pacto) já mostram TODAS as classes do personagem
  ao mesmo tempo, sem depender do pill (`core/recursosVisiveis.ts`).
- Espaços de Magia normais já são **1 pool combinado único**
  (`core/conjuradorMulticlasse.ts`, chave `"combinado"`) quando o
  personagem tem 2+ classes conjuradoras completas ao mesmo tempo —
  não soma as 2 tabelas separadas, usa a tabela oficial "Conjurador
  Multiclasse" com o Nível Equivalente. Bruxo (Magia de Pacto) sempre
  fica à parte disso, mesmo multiclassado ("ponte", já implementada).

**O que ainda falta:** `truquesAtuais`/`magiasPreparadasAtuais` (e os
componentes que os leem — aba Magias, seletor de magia em Combate)
só mostram/oferecem os da classe que está no pill. Trocar de pill
esconde os truques/magias da outra classe da tela inteira, mesmo que
o espaço pra conjurá-los já esteja lá.

## Colisão encontrada: o dado não marca de qual classe é cada escolha

`truquesAtuais: string[]` e `magiasPreparadasAtuais: string[]` são
arrays FLAT de nomes, sem nenhuma marca de classe — nunca foi
problema com 1 classe só. Para multiclasse:

- Um truque pode existir na lista de MAIS DE UMA classe do
  personagem ao mesmo tempo (ex.: "Luz", "Mãos Mágicas" estão tanto
  na lista de Mago quanto na de Bardo) — sem marca, não dá pra saber
  com certeza qual classe concedeu aquela escolha específica.
- `deficitTruques`/`deficitMagiasPreparadas` (Guia do Level Up,
  `core/magiasPersonagem.ts`) comparam o TAMANHO TOTAL do array
  contra a cota de **1 classe só** (`classe` = a do pill) — com 2
  classes, isso já pode estar calculando errado hoje (ex.: Bardo
  permite 4, Mago permite 3, personagem tem 5 no total — contra qual
  cota comparar?). Bug pré-existente, não causado por esta entrega,
  mas que só fica visível/corrigível junto dela.

**Decisão do Osmar (2026-09-24):** mudar o dado pra guardar a classe
de cada escolha. Corrige os dois problemas de vez, ao custo de migrar
personagens salvos com o formato antigo.

## Novo formato do dado

```ts
// ANTES
truquesAtuais: string[]
magiasPreparadasAtuais: string[]

// DEPOIS
interface MagiaConhecida {
  nome: string;
  /** Classe que concedeu esta escolha (a que estava ativa no Level
   * Up/wizard no momento em que o jogador escolheu). */
  classe: string;
}
truquesAtuais: MagiaConhecida[]
magiasPreparadasAtuais: MagiaConhecida[]
```

- Escrito no momento da escolha (wizard de criação — Etapa 4.3/
  Livro das Sombras — e cada passo de Level Up que oferece truque/
  magia nova), usando a classe que está sendo levelada/escolhida
  naquele passo. Não precisa de UI nova pra isso — já sabemos qual
  classe está gerando o passo.
- Funções que hoje recebem `string[]` (`truquesDoPersonagem`,
  `deficitTruques`, os sorteios em `sortearEscolhasTalento.ts`/
  `levelUpAleatorio.ts`, etc.) passam a receber `MagiaConhecida[]`.
  Onde só o nome importa (ex.: já sabe a magia, checar duplicata),
  extrai `.nome` — não precisa mudar a lógica de regra, só a forma
  de acessar.
- `deficitTruques`/`deficitMagiasPreparadas` passam a filtrar por
  `classe` ANTES de comparar com a cota — cada classe do personagem
  é checada contra a própria cota, usando só os itens marcados com
  ela. Corrige o bug pré-existente descrito acima.

**Não entra nesta mudança** (ficam como estão, já são escopados por
1 classe só, sem ambiguidade possível): `livroDeMagiasAtuais` (só
existe pra Mago), `livroDasSombrasAtuais` (só existe pra Bruxo),
`magiasDescobertasMagicasAtuais` (Descobertas Mágicas, característica
própria — já amarrada a 1 classe/personagem).

## Migração de personagens salvos (formato antigo)

`normalizarPersonagem` (ou onde a migração de esquema já acontece)
ganha um passo: para cada nome em `truquesAtuais`/
`magiasPreparadasAtuais` no formato antigo (`string[]`), procura, nas
classes do personagem, a PRIMEIRA cuja lista de magias contém aquele
nome, e usa essa classe como palpite. Não é garantia de acerto num
caso ambíguo (mesma limitação de origem: o dado antigo nunca guardou
isso de verdade) — mas é o melhor palpite possível, e só afeta a cor
do selo/o cálculo de déficit, nunca o que o personagem pode
conjurar (isso continua vindo dos espaços de magia, que já são
sempre calculados certos independente disso).

## Tela — aba Magias

Truques e Magias Preparadas passam a mostrar os 2 grupos (ou mais,
se algum dia houver 3+ classes conjuradoras) **juntos numa lista só**,
cada item com um selo pequeno indicando a classe (usa a cor já
existente de `corRecursoClasse.ts` quando a classe tiver uma
definida). Decisão do Osmar (2026-09-24): lista única com selo, não
blocos separados por classe.

## Tela — seletor de magia em Combate (Ação/Bônus/Reação) e "conjurar" da aba Magias

Os componentes que hoje filtram a lista de magias disponíveis pela
classe do pill (`SelecionarMagiaShell`, `useUsarMagiaPainel`,
`AcaoPanelContent`, `BonusPanelContent`, `ReacaoPanelContent`) passam
a oferecer as magias das 2 classes juntas. Ao escolher uma, o gasto
de espaço já sabe pra qual pool ir (combinado ou separado — isso já
funciona hoje, não muda).

## Fim do pill

Decisão do Osmar (2026-09-24): remover o seletor de pill por
completo. Perfil (única tela que ainda dependia dele — texto de
características/subclasse) passa a mostrar as características das 2
classes juntas, agrupadas por classe com um título (ex.: "— Mago —"
/ "— Bardo —"), mesmo padrão de bloco-por-classe já usado noutro
lugar do app. `classeAtivaNome`/`setClasseAtivaNome` saem de
`FichaShell.tsx`; qualquer lugar que ainda lia isso pra decidir o que
mostrar passa a iterar `classesAtual` inteiro (mesmo padrão que
`recursosVisiveis.ts` já usa).

## Fora de escopo (fica pra depois, registrar em PENDENCIAS.md se não resolvido)

- Personagem com 3+ classes ao mesmo tempo — hoje só existem 4
  classes implementadas (Guerreiro/Bardo/Bruxo/Mago), 3+ simultâneas
  não é alcançável ainda. Os componentes desta entrega devem iterar
  `classesAtual` (não assumir exatamente 2), então já funcionam se
  isso mudar no futuro, mas não tem como testar de verdade agora.
