# DND-Regras.md

> Este arquivo guarda **fatos de regra de D&D 5e (2024) já confirmados**
> na planilha (`dnd-master-referencia.xlsx`) ou no livro — não decisão
> de arquitetura, UI ou processo do projeto (isso continua na família
> `DECISOES-*.md`, ver índice no topo de `DECISOES-DESIGN.md`). É uma
> base de referência por **tópico**, não um histórico cronológico de
> entregas.
>
> Formato de cada tópico: fatos confirmados em bullet, direto ao ponto.
> Cite a fonte quando não for óbvio (aba da planilha, capítulo do
> livro). Sem "Contexto"/"Testado"/data de entrega — isso é rastro de
> decisão do app, não regra de jogo, e fica na família `DECISOES-*.md`.
>
> **Regra de uso:** antes de propor algo que dependa de uma regra de
> D&D, procure aqui primeiro. Ao encontrar (ou confirmar) um fato de
> regra em qualquer lugar — inclusive dentro de uma entrada de
> qualquer arquivo `DECISOES-*.md` — verifique se já existe um tópico
> aqui que agrupe esse fato; se não existir, crie um tópico novo.
> Depois de mover o fato pra cá, apague-o do arquivo `DECISOES-*.md`
> de origem, deixando lá só a decisão de design/arquitetura (ver seção
> 3 do `CLAUDE.md`).
>
> **Status da migração:** em andamento, começando pelo tópico
> Talentos. Enquanto não estiver 100% migrado, a família `DECISOES-*.md`
> ainda pode conter regra de jogo não extraída — ver `CLAUDE.md` seção
> 3 pra ordem de consulta.

---

## Talentos

**Catálogo (aba "Talentos" da planilha):** 85 linhas — 75 oficiais +
10 "Talento Selvagem" (Unearthed Arcana Psiônico 2025, não-oficial,
isolado do catálogo principal, mesmo tratamento das magias UA Psion).

**4 categorias oficiais**, com comportamento de ASI bem diferente:

| Categoria | Qtd | Concede ASI? |
|---|---|---|
| Geral | 43 | Varia — ver abaixo |
| Dádiva Épica | 12 | Quase sempre sim |
| Origem | 10 | Nunca |
| Estilo de Luta | 10 | Nunca |

**ASI (Aumento de Valor de Atributo) por talento — só 2 comportamentos
reais** (não 4, como uma leitura rápida das colunas da planilha
sugeria — o que importa é o VALOR da célula, não só quantas colunas
vêm marcadas):
- A maioria dá **+1 num único atributo, à escolha entre uma lista**
  (a lista pode ter 1 atributo só — sem escolha real —, 2-3, ou os 6).
- Só **"Aumento no Valor de Atributo"** segue a regra genérica de ASI:
  **+2 num atributo só, ou +1 em dois**.
- Teto do atributo: **20** normalmente, **30** pros talentos de
  categoria Dádiva Épica.

**Pré-requisito de Nível Mínimo:** campo numérico confiável na
planilha — Geral = nível 4+; Dádiva Épica = nível 19+.

**Pré-requisito de Atributo Mínimo:** quando existe, o valor é sempre
**13** (nunca outro número, confirmado talento por talento pelo Osmar
lendo a página do livro). 17 talentos oficiais têm esse pré-requisito:
Agressor, Analítico, Atleta, Ator, Conjurador Ritualista, Duelista
Defensivo, Especialista Ambidestro, Especialista em Besta,
Imobilizador, Líder Inspirador, Mente Aguçada, Mestre em Armas de
Haste, Mestre em Armas Grandes, Mestre-Atirador, Sentinela, Sorrateiro,
Velocista. Os outros 21 talentos com essa coluna preenchida na
planilha bruta **não têm** pré-requisito de atributo de verdade (era
bug de extração — coluna vinha com o valor de ASI, não de pré-requisito).

**Pré-requisito "Outro":** texto livre (ex: "Característica Conjuração
ou Magia de Pacto", "Treinamento com Armadura Leve", "Característica
de Estilo de Luta") — não é um valor estruturado, não dá pra validar
automaticamente contra a ficha.

**Um talento pode ter mais de 1 efeito de jogo na mesma
descrição/célula de "Benefícios"** (ex: Conjurador Bélico = efeito
Passivo + Reação + Passivo na mesma célula de texto) — nunca assumir
"1 talento = 1 categoria de ação" ao ler a coluna de Benefícios.

Fonte: `dnd-master-referencia.xlsx`, aba "Talentos".

## Marcos de Experiência (XP) por Nível

**Tabela oficial (regra 2024)** — XP mínimo acumulado pra alcançar
cada nível, 1 a 20:

| Nível | XP | Nível | XP | Nível | XP | Nível | XP |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 6 | 14000 | 11 | 85000 | 16 | 195000 |
| 2 | 300 | 7 | 23000 | 12 | 100000 | 17 | 225000 |
| 3 | 900 | 8 | 34000 | 13 | 120000 | 18 | 265000 |
| 4 | 2700 | 9 | 48000 | 14 | 140000 | 19 | 305000 |
| 5 | 6500 | 10 | 64000 | 15 | 165000 | 20 | 355000 |

XP é cumulativo — nunca reseta ao subir de nível. Nível 20 não tem
próximo marco (é o máximo).

Fonte: `dnd-master-referencia.xlsx`, aba "Evolução do Personagem".
Importado em `src/data/rulesets/dnd2024/evolucaoPersonagem.ts`, lido
por `core/experiencia.ts`.

## Bruxo — Invocação Mística "Pacto do Tomo"

**Livro das Sombras:** conjurado ao final de um Descanso Curto ou
Longo (aparência livre, escolha do jogador). Desaparece só se o Bruxo
conjurar outro livro com essa característica de novo, ou morrer —
**não** desaparece sozinho a cada descanso.

**Truques e Rituais:** quando o livro surge, o jogador escolhe **3
truques + 2 magias de 1º círculo com o marcador Ritual**. As magias
podem ser da lista de **qualquer classe** (não só Bruxo) e **precisam
ser magias que o personagem ainda não tem preparadas** (não pode
duplicar um truque/magia que já veio de Truques Conhecidos/Magias
Preparadas normais do Bruxo). Enquanto o livro existir, essas 5
escolhas contam como magias de Bruxo sempre preparadas — **não** entram
no limite normal de Magias Preparadas.

**Foco de Conjuração:** o livro também serve como Foco de Conjuração.

**Escolha não é fixa:** re-feita toda vez que o livro é conjurado
(cada Descanso Curto ou Longo) — diferente de Truques/Magias
Preparadas normais, que só trocam 1 por level-up.

Fonte: `dnd-master-referencia.xlsx`, aba "Opções de Classe", linha
`Classe_Bruxo_InvMist_PacTomo` (conferida contra o livro).
