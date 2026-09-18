# Índice de `aprendizados/`

> Catálogo de arquivos da pasta `aprendizados/` — cada um guarda o
> histórico de construção de UM foco específico (quebras, decisões,
> bugs achados/corrigidos), organizado por subpasta de domínio. Ver a
> seção 7.2 do `CLAUDE.md` pra regra completa de quando escrever aqui
> vs. na família `DECISOES-*.md` (padrão que atravessa vários focos
> continua indo pra lá; histórico específico de UM foco vem pra cá).
>
> Consulte este índice ANTES de reabrir um foco parecido, pra saber se
> já existe um arquivo relevante — evita redescobrir do zero um bug ou
> decisão já registrada.

---

## `classes/`

Um arquivo por classe de D&D implementada no app.

- **`classes/barbaro.md`** — Bárbaro (5ª classe do projeto). Classe
  base nível 1-20 completa (B1-B4.10): Fúria, Ataque Imprudente,
  Sentido de Perigo, Conhecimento Primordial, Golpe Brutal/
  Fortalecido, Fúria Implacável/Persistente, Força Indomável, Campeão
  Primitivo (+ bug de PV Máximo retroativo, corrigido de forma
  reutilizável). As 4 Trilhas (subclasses) ficaram deliberadamente
  pendentes ao fechar o foco — ver `PENDENCIAS.md`.

*(pasta vazia além deste arquivo por enquanto — as classes
implementadas antes do Bárbaro, Guerreiro/Bardo/Bruxo/Mago, continuam
só em `DECISOES-CLASSES.md`; migração pra cá é gradual, sob demanda,
não obrigatória de uma vez.)*

## `talentos/`

- **`talentos/fase-4.md`** — Talentos Fase 4 (efeito mecânico de
  verdade): arquitetura `EfeitoMecanicoTalento`, os grupos A (Origem)/
  B (Geral já existente)/C (penalidades de proficiência)/D (reaudit
  2026-09 + os 5 talentos viáveis: Resiliente, Especialista
  Ambidestro, Mestre das Armas, Mestre em Armas Grandes, Mestre em
  Escudos), e os 2 bugs de Maestria em Arma achados no caminho
  (crescimento por nível, troca sem limite de Descanso Longo).
