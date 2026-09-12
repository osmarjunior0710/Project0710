# EmDevB.md

> Arquivo desta conta (branch `claude/read-claude-md-c75hsf` — ver
> seção 14.1 do `CLAUDE.md`). A conta principal usa `EmDev.md` — nunca
> escreva lá a partir desta branch, mesmo que ele apareça aqui depois
> de um merge (nesse caso o conteúdo é da outra conta, só chegou junto).
>
> Plano do foco que está em andamento **agora** (ver ciclo de foco,
> seção 6 do `CLAUDE.md`). Diferente da família `DECISOES-*.md`
> (decisão já tomada, permanente) e de `PENDENCIAS.md` (adiado de
> propósito ou travado estruturalmente), este arquivo é só o checklist
> de trabalho do foco sendo executado agora.
>
> Fica vazio entre focos. Quando um foco fecha (seção 6.3), o conteúdo
> é apagado — não acumula plano antigo.

---

## Foco: Fase M — Multiclasse (M4 — Conjuração Combinada)

Continuação da Fase M (M0-M3 fechados, ver `DECISOES-CLASSES.md`).
Osmar aprovou seguir ("bora") logo após o fechamento do M2+M3.

Plano em 3 entregas pequenas:
- **M4a — Motor: classificação de conjurador + nível equivalente**
  (sem nada visível na tela ainda).
- **M4b — Motor: Magia de Pacto do Bruxo sempre separada + ponte de
  uso cruzado de espaços.**
- **M4c — Ficha: Magias tab mostra o pool combinado** (quando 2+
  classes conjuradoras normais coexistem) em vez de cada classe
  separada.

- [x] **M4a — Motor: classificação de conjurador + nível equivalente.**
  Nova tabela `data/rulesets/dnd2024/conjuradorMulticlasse.ts` (12
  classes, SDD seção 8.2 — fato de regra, não vem da planilha, mesmo
  padrão de exceção documentada de `classesProficienciasIniciais.ts`):
  'completo' (Bardo/Clérigo/Druida/Feiticeiro/Mago), 'meio'
  (Guardião/Paladino), 'terco-com-subclasse' (Guerreiro/Cavaleiro
  Místico, Ladino/Trapaceiro Arcano — só conta com a subclasse certa),
  'pacto' (Bruxo — nunca entra na soma), 'nenhum' (Bárbaro/Monge).
  `core/multiclasse.ts` ganhou `temConjuracaoMulticlasse` (2+ classes
  contam = true), `temMagiaDePacto`, `nivelEquivalenteConjuracaoMulticlasse`
  (soma cheia/metade-pra-cima/terço-pra-baixo conforme o tipo),
  reaproveitando `espacosMagiaParaNivelCombinado` (já existia desde M1).
  10 testes Vitest novos (incluindo o exemplo oficial do livro:
  Guardião 4/Feiticeiro 3 = nível equivalente 5). **Não testável na
  tela** — só motor, nenhuma das 4 classes implementadas hoje
  (Guerreiro/Bardo/Bruxo/Mago) alcança o caso "terço-com-subclasse"
  ainda. tsc(-b)/testes(419)/build verdes.
