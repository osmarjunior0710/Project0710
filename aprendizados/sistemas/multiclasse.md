# Multiclasse — Truques/Magias Preparadas por classe, tela única, fim do pill

> Foco fechado 2026-09-25. SDD em `sdd/sdd-multiclasse-truques-magias.md`
> (continua valendo como referência de mecânica). Ver também
> `DECISOES-CLASSES.md` "Multiclasse — arquitetura de nível ativo vs.
> total" (decisão anterior, sobre a qual este foco constrói).

## Contexto — por que abriu

O pill (Mago/Bardo/Bruxo) decidia qual classe aparecia em Combate/
Magias/Perfil. Times atrás disso: 3 bugs reais (Fúria com nível
errado, XP com marcador errado, espaços de magia sumindo — já
corrigidos antes deste foco). O Osmar pediu a revisão completa depois
de notar, testando ao vivo no celular, que "Espaços de Magia" só
mostrava o pool da classe no pill (nunca os 2 ao mesmo tempo — achado
que expandiu o escopo original).

## Entregas (6, quebradas em sub-passos 5a-5g na última)

1. **Dado**: `truquesAtuais`/`magiasPreparadasAtuais` viraram
   `MagiaConhecida[]` (`{nome, classe}`), com migração automática do
   formato antigo (`normalizarMagiasConhecidas`, palpite pela 1ª
   classe cujo catálogo contém o nome).
2. **Aba Magias**: Truques/Magias Preparadas mostram as classes juntas
   numa lista só, com selo (`PillClasse`, componente novo).
3. **Combate**: seletor de magia (Ação/Bônus/Reação) idem, mesmo selo.
4. **Déficit corrigido**: `deficitTruques`/`deficitMagiasPreparadas`
   comparam a cota da classe só contra os itens MARCADOS com ela (não
   mais o total de todas as classes juntas).
5. **Remoção do pill**, em sub-passos:
   - 5a Perfil mostra características de TODAS as classes.
   - 5b Espaços de Magia mostra os 2 pools (principal + ponte) juntos.
   - 5c Resumo de conjuração (CD/Ataque) fica 1 bloco por classe
     conjuradora.
   - 5d Características do Mago/Bruxo (Memorizar Magia, Adepto de
     Ritual, Astúcia Mágica, Contatar Patrono, Maestria de Magias,
     Mestre Místico) checam "a classe existe no personagem", não "é a
     ativa".
   - 5e Level Up (interativo e o raio de teste) resolve a classe
     alvo explicitamente (`classeParaLevelUp`), nunca mais pelo pill.
   - 5f Pill removido de vez; `classeAtivaNome` virou constante
     derivada (âncora interna, não mais `useState`); aviso de déficit
     virou por classe.
6. **Fechamento** (este arquivo).

## Bugs reais achados e corrigidos no caminho (todos ao vivo, testando no celular)

- **Ponte de Magia de Pacto pegava a classe errada com 3+ classes.**
  `outraClasseEntry` (useMagiasEConjuracao) pegava "a 1ª classe
  diferente da ativa" sem checar se ela CONJURA — com Bárbaro no
  meio (não conjura), a ponte apontava pra ele e sumia (0 espaços).
  Corrigido buscando especificamente Bruxo (quando a ativa é outra
  conjuradora) ou a outra conjuradora (quando a ativa é Bruxo).
- **Astúcia Mágica recuperava o pool errado.** Calculava/recuperava
  espaço de Pacto usando sempre o pool da classe ATIVA — com o pill
  fora do Bruxo, tentava recuperar o pool do OUTRO. Corrigido pra
  sempre resolver o pool do Bruxo (via `ponte` quando ele não é a
  ativa), tanto no cálculo quanto na ação de recuperar de verdade.
- **CD/Ataque Mágico eram genuinamente diferentes por classe** (não
  só cosmético) — confirmado com Mago 17/Bardo 3: Mago +11 acerto/CD
  19 (INT), Bardo +5 acerto/CD 13 (CAR). Virou 1 bloco por classe.
- **Bug crítico na remoção do pill**: a 1ª versão usava sempre
  `classesAtual[0]` como "classe âncora" — quebrava a aba Magias
  INTEIRA (sumia, "sem fonte de conjuração") sempre que a 1ª classe
  do personagem não conjura (ex.: Bárbaro/Bardo/Bruxo, Bárbaro é a
  1ª). Corrigido preferindo a 1ª classe que REALMENTE conjura
  (fallback pra `classesAtual[0]` só se nenhuma conjurar); o gate
  `conjura` (se a aba aparece ou não) passou a checar TODAS as
  classes, não só a âncora.
- **Regra confirmada no Livro do Jogador** (Cap. 2, "Multiclasse",
  "Magia de Pacto"): os 2 pools (normal + Pacto) coexistem de
  verdade, com ponte nos 2 sentidos (espaço de Pacto conjura magia
  preparada de outra classe, e vice-versa) — não é side-by-side
  cosmético, é a regra real. Validou o design da Entrega 5b antes de
  implementar.

## Padrão que se repetiu 4 vezes (candidato a generalizar, ver nota abaixo)

Toda informação que antes vinha "da classe ativa" e precisava ficar
visível pra TODAS as classes virou o mesmo formato: computar um
ARRAY (`resumosPorClasse`, `deficitsTruques`, blocos de Perfil, pools
de Espaços) iterando `classesAtual`, e renderizar 1 bloco/aviso por
entrada — nunca 1 valor escondido atrás de seletor.

## O que ficou pendente (registrado em `PENDENCIAS.md`)

**Conjurar de verdade ainda usa só 1 modificador de acerto/CD, não o
da classe da magia escolhida.** A EXIBIÇÃO já mostra os 2 certos
(Entrega 5c), mas `processarMagiaAoUsar`/`conjurarMagia` recebem um
`modAcertoConjuracao: number` fixo (o da classe ÂNCORA), não uma
função de busca por magia. Invisível em combos com o mesmo atributo
(Bardo+Bruxo, os 2 CAR) — errado em combos como Mago+Bardo. Trava
estruturalmente (precisa saber a classe da magia no momento de
conjurar — as fixas tipo Descobertas Mágicas nem têm essa marca hoje
— redesenho maior, não coube nesta Multiclasse).

**Backlog**: pills configuráveis de info da magia (Escola, Distância,
Componentes, Ataque-ou-Salvaguarda) — ideia do Osmar saída do
protótipo desta Multiclasse, decidido fazer depois (ver `Backlog.md`).

## Protótipos usados (histórico, já cumpriram o papel)

`/prototipo` ganhou 2 cenas (`MulticlasseMagiasCena`/
`MulticlasseCombateCena`) pra validar o layout do selo antes de
implementar de verdade — passaram por uma 2ª versão depois do Osmar
apontar que a 1ª simplificou demais (sem os elementos reais da tela:
botão Usar, ícones). Continuam no catálogo de protótipos, sem
obrigação de remover.
