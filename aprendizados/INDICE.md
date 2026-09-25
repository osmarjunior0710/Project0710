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
  reutilizável). Das 4 Trilhas (subclasses), a 1ª retomada — Trilha da
  Árvore do Mundo (Vitalidade da Árvore, Ramos da Árvore, Raízes
  Devastadoras, Percorrer a Árvore) — já foi implementada por completo
  (2026-09); as outras 3 continuam deliberadamente pendentes — ver
  `PENDENCIAS.md`.

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

## `sistemas/`

Um arquivo por sistema/infraestrutura transversal (não amarrado a 1
classe/talento específico).

- **`sistemas/multiclasse.md`** — Multiclasse: Truques/Magias
  Preparadas por classe (com selo), Espaços de Magia mostrando os 2
  pools juntos, CD/Ataque por classe, e a remoção completa do pill
  (Mago/Bardo/Bruxo). 4 bugs reais achados e corrigidos no caminho
  (ponte pegando classe errada com 3+ classes, Astúcia Mágica
  recuperando pool errado, e o bug crítico de a aba Magias sumir
  quando a 1ª classe não conjura). Fica pendente: acerto/CD na hora
  de conjurar ainda usa 1 modificador só, não o da classe da magia.
- **`sistemas/dado-3d.md`** — Dado 3D com física (`@3d-dice/dice-box`):
  escolha da lib e gotchas de integração, Fase A (FAB avulso
  formalizado) e Fase B1-B6 (motor virou padrão pra toda rolagem
  oficial do jogo), + todos os bugs achados testando no celular no
  caminho (d100 só rolava a dezena, reroll não achava o dado certo,
  corrida de `groupId` embaralhando 2 dados simultâneos, canvas
  encolhendo o dado, promise de init grudando, 2º dado não
  reconhecido). Extraído de `DECISOES-COMBATE.md` na compactação de
  2026-09 — os poucos padrões que generalizaram pra além do dado
  (cache de promise, FAB de coluna expansível, botão circular de
  canto) continuam lá.
