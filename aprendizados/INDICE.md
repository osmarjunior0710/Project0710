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

- **`classes/monge.md`** — Monge, classe base nível 1-20 sem subclasse
  (2026-10): 22 características, efeito pós-acerto no popup de dano
  (Golpe Atordoante), reroll de salvaguarda com Foco, Corpo e Mente
  (bônus de atributo de nível 20 generalizado), bug de closure velha na
  Torrente de Golpes, importação tardia dos textos e a revisão final
  contra o PDF que corrigiu as 3 técnicas base.

- **`classes/monge-elementos.md`** — subclasse Combatente dos Elementos do Monge
  (2026-10): 6 entregas em ordem de nível — Elementalismo concedido por
  subclasse, Sintonia Elemental (toggle), Ataques Elementais/Explosão/Ápice
  (3 partes) no popup de dano e nos painéis, decisão de "pode causar dano
  adicional" = escolha do jogador, portal dos popups do ⓘ e borda contínua nos
  modais de seleção.

- **`classes/mago.md`** — Mago, características base nível 1-20
  (Entregas 1-7): Acadêmico, Guia do Level Up (`statusImplementacao`),
  Copiar Magia pro Livro, Recuperação Arcana, Adepto de Ritual,
  Maestria de Magias (escolha + conjuração grátis + troca no Descanso
  Longo), Assinatura Mágica. Inclui o bug de "Maestria/Assinatura não
  apareciam no Combate" e a validação manual nível 1-20 que fechou o
  foco.

- **`classes/mago-evocador.md`** — subclasse Evocador (arquivo
  separado da classe base — ver seção 7.2 do CLAUDE.md, cada subclasse
  com foco próprio ganha seu arquivo): Versado em Evocação, Truque
  Potente, Evocação Potencializada, Sobrecarga. Inclui 2 bugs achados
  DEPOIS da publicação que passaram pela validação Playwright original
  sem serem detectados (dano Necrótico não descontava PV; popup de
  escolha preso dentro do painel de Combate por causa de `transform`
  no `SidePanel`) — e por que a validação de cada um falhou.

- **`classes/paladino.md`** — Paladino, classe base nível 1-20
  (Entregas 1-6): Canalizar Divindade (banco compartilhado), magia
  fixa de classe genérica (Destruição do Paladino/Montaria Fiel, +
  bug pré-existente de `'dano-automatico'` achado no caminho),
  primeiro fluxo "conjurar magia → cria Pet" do app, Aura de Proteção,
  Repudiar Inimigos (padrão de salvaguarda do alvo), Golpes Radiantes
  (campo `corpoACorpo` ≠ `usouForca`, + 2 bugs de UI pré-existentes de
  z-index/1d1), Toque Restaurador (Mãos Consagradas vira 1 toque
  combinado). Pausado em 2026-10 — subclasses (só Devoção feita) e
  Multiclasse ficam pendentes, ver `PENDENCIAS.md`.

- **`classes/paladino-devocao.md`** — subclasse Juramento da Devoção
  (arquivo separado da classe base): as 5 características completas
  (Magias do Juramento, Arma Sagrada, Aura de Devoção, Destruição
  Protetora, Resplendor Sagrado). Inclui a origem do padrão "toggle
  sem contador de tempo" (registrado em `DECISOES-COMBATE.md`) e o
  caso onde uma simplificação técnica foi codada sem perguntar antes
  (corrigido depois, lição em `LICOES-RAPIDAS.md`).

*(as outras classes implementadas antes do Bárbaro/Mago — Guerreiro/
Bardo/Bruxo — continuam só em `DECISOES-CLASSES.md`; migração pra cá é
gradual, sob demanda, não obrigatória de uma vez.)*

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
  quando a 1ª classe não conjura). Foco "acertos deixados pra trás"
  (2026-10) fechou os 3 últimos: acerto/CD na hora de conjurar agora
  usa a classe dona da magia (não mais 1 modificador fixo), Espaços
  combinados do Paladino confirmados ao vivo, e a pergunta de Descanso
  Longo do Paladino não some mais quando o Mago está na mesma ficha.
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
