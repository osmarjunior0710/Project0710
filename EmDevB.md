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

## Foco: Fase M — Multiclasse

Pedido do Osmar depois do postmortem Mago/Necromante: liberar o
jogador pra escolher 2+ classes, cada uma com progressão própria,
decidindo no Level Up qual classe sobe. Confirmado com o Osmar: **regra
oficial completa desde o início** (não simplificada) e **migração
automática e transparente** de personagens já salvos.

Plano em 5 fases pequenas, aprovado pelo Osmar:
- **M0 — Fundamentos de schema** (sem nada visível na tela ainda).
- **M1 — Dados da planilha** (aba "Multiclasse": pré-requisitos,
  proficiências obtidas, tabela de Espaços de Magia por Nível
  Combinado).
- **M2 — Level Up: escolher qual classe sobe.**
- **M3 — Ficha mostra múltiplas classes** (cabeçalho, PV, Bônus de
  Proficiência, Truques/Magias/Espaços por classe).
- **M4 — Conjuração combinada** (tabela de Nível Combinado quando 2+
  classes conjuradoras normais; Bruxo sempre separado).

- [x] **M0 — Fundamentos de schema.** Novo `core/multiclasse.ts`:
  `PersonagemClasse` (`{ classe, nivel, subclasse? }`);
  `classesDoPersonagem(personagemSalvo)` — se `PersonagemSalvo.classes`
  (campo novo, opcional) existir, usa direto; senão deriva 1 elemento
  único de `selecao.classe`/`nivel`/`subclasseAtual` (campos antigos,
  mesmo padrão de "campo ausente cai pro antigo" já usado em
  `truquesAtual`/`espacosGastosPorCirculo` etc. — migração automática e
  transparente, sem precisar mexer no personagem salvo). `nivelTotalPersonagem`
  (soma de todas as classes — pra Bônus de Proficiência/XP) e
  `nivelNaClasse` (nível numa classe específica, 0 se não tiver — pra
  característica de classe) como os 2 conceitos que antes eram só
  `personagem.nivel` misturado.
  **Nada mais foi tocado nesta entrega** — os ~72 pontos que hoje leem
  `personagem.nivel` continuam exatamente como estavam; `classes` fica
  sempre ausente até o Level Up (M2) começar a escrever nele de
  verdade. Zero risco de regressão: nenhum personagem existente muda
  de comportamento.
  8 testes Vitest novos (migração do formato antigo, array vazio sem
  classe nenhuma, subclasse ausente vira `null`, soma de nível total,
  busca de nível por classe incluindo a que não tem nível nenhum).
  **Não testável na tela** — esta entrega é só o motor por baixo,
  sem UI nova (por design, ver "critério de pronto" combinado com o
  Osmar). tsc(-b)/testes(389)/build verdes.

**Próximo passo:** M0 fechado — seguir com **M1** (importar a aba
"Multiclasse" da planilha: pré-requisitos de atributo, proficiências
obtidas ao multiclassar, tabela de Espaços de Magia por Nível
Combinado).
