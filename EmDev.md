# EmDev.md

> Arquivo da conta principal / branch padrão (ver seção 14.1 do
> `CLAUDE.md`). A outra conta usa `EmDevB.md` — nunca escreva aqui a
> partir da branch `claude/read-claude-md-c75hsf`.
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

## Foco: Talentos — Fase 4 completa (efeito mecânico de verdade)

77 talentos ainda sem efeito mecânico, em 5 categorias (Geral 42,
Talento Selvagem 10, Dádiva Épica 12, Estilo de Luta 7, Origem 6).
Ordem acordada com o Osmar: **Origem primeiro** (é o que aparece na
criação de personagem), depois Geral; Talento Selvagem/Dádiva Épica
ficam pra depois do Mago (nicho/nível altíssimo). Cada categoria vira
seu próprio conjunto de sub-focos (A = Origem, B = Geral, ...) — antes
de propor a quebra de cada um, sempre relê tudo que já existe (código
+ livro, quando o Osmar fornecer o PDF) antes de sugerir os grupos.

### A. Origem

**A.0 — leitura/revisão (feita 2026-09):** comparado o código
(`talentos.ts`, `DECISOES-CLASSES.md`, `Backlog.md`) contra o livro
(PDF Cap. 5, fornecido pelo Osmar, p.200-202). Achados registrados em
`LICOES-RAPIDAS.md`. Grupos propostos e aprovados pelo Osmar:

- [x] **A.1 — Correção de dado** (sem mecânica nova, só texto):
      Sortudo perdeu a cláusula "nível 5+ nega crítico" (não existe na
      regra 2024, parece herança 2014) — removida de `talentos.ts` e
      do código que a lia (`pontosDeSorteNegaCritico` em
      `FichaShell.tsx`/`CombatTab.tsx`). Valentão de Taverna tinha o
      benefício "empurrar 1,5m ao acertar Desarmado" descrito errado —
      reescrito como os 4 benefícios reais (Ataque Desarmado
      Aprimorado, Dano Garantido, Armamento Improvisado, Corrida
      Aprimorada, Ataque em Investida), com o que falta implementar
      listado no Backlog.md. Verificado: `tsc -b`/`npm test`
      (221)/`npm run build` limpos.
- [ ] **A.2 — Motor de reroll de dado não-d20** (genérico,
      reaproveitável em 2+ lugares): "esse dado saiu 1? pode rerolar"
      — serve pro Curandeiro (Cura Garantida) e Valentão de Taverna
      (Dano Garantido). Mesmo mecanismo que falta pro reroll de dano
      da Inspiração Heroica (Backlog.md).
- [ ] **A.3 — Substituição de Magia (Iniciado em Magia)**: no Level
      Up, trocar a magia de 1º círculo escolhida por outra do mesmo
      círculo/lista — reaproveita `TrocarValorSimples` (mesmo
      componente de Resistência Ínfera/Arcana Mística).
- Bloqueados (registrados no Backlog.md, sem entrega de código por
  enquanto): Troca de Iniciativa (Alerta), desconto de loja/Fabricação
  Rápida (Artifista), Atacante Selvagem completo, Médico de Combate
  (Curandeiro), Canção Encorajadora (Músico), Armamento
  Improvisado/Corrida Aprimorada/Ataque em Investida (Valentão de
  Taverna).

### B. Geral — ainda não começado

Só abre depois que A fechar. Antes de propor a quebra em grupos,
repetir o processo do A.0 (ler os 42 talentos Gerais no código +
livro, quando o Osmar fornecer o PDF de novo ou a seção continuar no
mesmo arquivo).

Próximo passo: A.2 (motor de reroll de dado não-d20).
