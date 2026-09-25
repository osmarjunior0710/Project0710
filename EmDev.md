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

## Foco: Melhorias e correções

Lista do Osmar (2026-09-21), feita um a um, na ordem abaixo. Antes de
começar cada item, perguntar ao Osmar o que exatamente ele é (escopo,
onde fica na tela), depois seguir o ciclo normal (proposta → ok →
código).

- [x] Botão no perfil de "House Rules", que contém todos os switchers de opção de regra do tipo house rule
- [x] House rule: confirmação de crítico — **FEITO (A, B e C)**; histórico: protótipo publicado (`/prototipo/confirmacao-critico`), protótipo APROVADO. Plano em 3 entregas: **A** crítico padrão nos ataques de arma (`onAcertou({critico})`, `core/danoCritico.ts`) — [x] feita; **B** mesmo crítico nos ataques de magia (`useUsarMagiaPainel`, `MagiasTab`, `ReacaoPanelContent`, `CombatTab` magia) — [x] feita, confirmado em `confirmarAcerto` nesses 4 arquivos; **C** switcher da house rule no painel House Rules (`AvatarMenu.tsx`, chave `confirmacaoCritico`) + 2º d20 real no overlay — [x] feita. Perfurador (+1 dado no crítico) fica de fora (Backlog). Regras já decididas: só ataque (perícia nunca tem 2º d20); 1 natural = "Errei" (nada acontece) ou "Rolar Dano" (dano normal, sem dobra); 20 natural sem house rule = só "Rolar Dobro do Dano" (dobro de DADOS, mod 1x); 20 com house rule = 2º d20 só informativo, depois "Rolar Dano" / "Rolar Dano Dobrado"
- [x] Recurso principal da classe visível na tela de combate (Fúria, Inspiração de Bardo, Magia de Pacto, Recuperar Fôlego; outros no Backlog)
- [x] FAB para descanso curto/longo
- [x] Dado de cura no descanso curto (não foi trazido da ficha do jogo)
- [x] Animação de dano/cura na barra de vida (+ botão Manual de PV)
- [x] Revisão do botão de XP para mostrar progresso circular
- [x] Informações de CD, bônus de ataque de magia e afins na tela de Magias
- [x] Coin bag manager (mostrar, usar e adicionar moedas) + house rule de contar ou não o peso da moeda
- [x] **Bug (corrigido):** no painel de Reação, magias (ex.: Escudo Arcano 1º círculo, Contramagia 3º círculo) aparecem como ativas mesmo sem espaço de magia disponível do círculo — o aviso vermelho "Sem espaço de magia de 1º círculo disponível" aparece, mas as opções não ficam desabilitadas/cinza (ver `ReacaoPanelContent.tsx`)
- [x] **Criação de personagem — aleatório sem repetir o que já possui (FEITO: 🎲 por lista no Talento + 🔀 em Livro das Sombras/Talento da Origem/Talento do Versátil; 🔀 de Origem e Espécie também evitam repetir)** — antes: botão "🎲 Aleatório" nas listas de "Escolha N" (pedido do Osmar testando o Artista/Músico, 3 instrumentos): preenche só as vagas que faltam, mantém o que já foi marcado e NUNCA sorteia o que o personagem já possui por outra fonte ("já possui"). Entrega A (Talento da Origem/Espécie + Iniciado em Magia) e B (listas da Classe: perícias, ferramentas, maestria, invocações, truques, livro, magias preparadas + Livro das Sombras). `core/sortearEscolhas.ts` já feito. **Entrega A FEITA** (Talento da Origem/Espécie + Iniciado em Magia, botão `BotaoAleatorio`); falta a B.
- [x] **Bug (corrigido, passo Loja):** o cabeçalho "Ouro inicial / Restante" só mostra PO — faltam os ícones de PO, PP e PC (webp já existem em `src/assets/icones-moedas/`), e o "Restante" deveria aparecer nas 3 moedas (PO, PP e PC) com o cálculo correto (ex.: 82,35 PO = 82 PO + 3 PP + 5 PC — usar `moedasDeOuro`), pro jogador ver quanto falta.
- [x] **Rever toda a integração de Multiclasse com a Ficha/Combate** — escopo final ficou mais enxuto que o previsto: Recursos de Combate e Espaços de Magia **já mostravam as 2 classes/pool combinado certos**, não precisou de nada. O que faltava (Truques/Magias Preparadas só da classe do pill) virou o foco novo abaixo.

Nota: itens 1 e 2 dependem do mesmo mecanismo de house rules —
conferir a ordem de construção ao abrir o item 1.

---

## Foco: Multiclasse — Truques/Magias Preparadas por classe, tela única, fim do pill

SDD em `sdd/sdd-multiclasse-truques-magias.md` (chapéus 1/2/3
aprovados pelo Osmar, 2026-09-24). Decisões já tomadas: selo por item
(não bloco separado) nas listas de truques/magias; pill removido de
vez, Perfil passa a agrupar por classe também.

- [x] Entrega 1 — Muda o dado: `truquesAtuais`/`magiasPreparadasAtuais`
      de `string[]` pra `MagiaConhecida[]` (`{nome, classe}`), com
      migração de personagens salvos no formato antigo (palpite pela
      1ª classe cujo catálogo contém o nome — `normalizarMagiasConhecidas`,
      `core/magiasPersonagem.ts`). Sem mudança visível — confirmado
      testando `teste-fixo-mago-clerigo` (formato antigo, migra e
      re-salva sozinho) e `teste-fixo-multiclasse` (já escreve no
      formato novo direto). Bônus: achado e corrigido de passagem um
      bug de Regra dos Hooks pré-existente em `MagiasTab.tsx` (2
      `useColapsavel` chamados DEPOIS de um `return` condicional —
      quebrava trocando o pill de uma classe sem conjuração pra uma
      com, sem remontar a tela).
- [x] Entrega 2 — Aba Magias: Truques e Magias Preparadas mostram as
      2 classes juntas numa lista só, com selo por item
      (`PillClasse`, novo componente reutilizável em
      `ui/components/`). Layout virou 2 linhas nessas 2 seções (nome+
      Usar / pills de círculo+classe embaixo, pedido do Osmar
      2026-09-24) — resto da aba (Descobertas Mágicas, Livro de
      Magias etc., sempre 1 classe só) continua 1 linha, sem selo.
      `core/magiasPersonagem.ts` ganhou `magiasConhecidasComClasse`
      (pareia Magia+classe, NUNCA deduplica por nome — testado com
      "Amigos" conhecido por Bardo E Bruxo ao mesmo tempo, virou 2
      linhas com `key` própria por classe, sem o bug de key duplicada
      encontrado na Entrega 1). Mago ganhou cor de pill própria
      (azul-claro, já registrada em `corRecursoClasse.ts` desde os
      protótipos). Testado com personagem migrado (Mago/Bardo,
      formato antigo) e o multiclasse (Bardo/Bruxo, formato novo).
- [x] Entrega 3 — Seletor de magia em Combate (Ação/Bônus/Reação)
      oferece as magias das 2 classes juntas, com o mesmo
      `PillClasse`. Achado importante testando: a DISPONIBILIDADE já
      estava certa desde a Entrega 1 (o hook já recebia a lista
      combinada das classes) — só faltava mesmo o selo/pill e a `key`
      correta (`agruparMagiasComClassePorCirculo`,
      `GrupoMagiaColapsavel` virou genérico). Gasto de espaço
      (combinado/ponte) não mudou, não fazia parte do escopo.
      Testado: "Usar Magia" no painel de Ação mostra Bardo+Bruxo
      juntos, inclusive "Amigos" (conhecido pelas 2) sem quebrar;
      conjurar funciona normal.
- [x] Entrega 4 — Corrige `deficitTruques`/`deficitMagiasPreparadas`
      pra multiclasse: agora comparam a cota da classe só contra os
      itens MARCADOS com ela (antes comparava contra o TOTAL das 2+
      classes juntas — podia mascarar déficit real ou acusar déficit
      errado). Confirmado que a Magia de Pacto do Bruxo já ficava (e
      continua ficando) sempre separada dos espaços normais — pergunta
      do Osmar, respondida testando: 2 sistemas diferentes (contagem
      de truques/magias conhecidas vs. espaço/pool pra conjurar),
      ambos já corretos pra Bruxo multiclasse.
- [ ] Entrega 5 — Remove o pill de vez (decisão do Osmar, 2026-09-25:
      remoção completa, nenhum conceito de "classe ativa" sobra em
      lugar nenhum — não a versão simplificada que só escondia o
      botão). Escopo grande, quebrado em sub-passos pra testar/
      publicar 1 de cada vez:
  - [x] 5a — `PerfilTab`: recebe `classesAtual`/catálogo em vez de
        `classe`/`nivel`/`subclasse` únicos; mostra um bloco "Classe —
        Nome" + "Subclasse" POR classe do personagem, em vez de só a
        ativa. Testado com o multiclasse (3 blocos: Bárbaro/Bardo/
        Bruxo) e o migrado (Mago 17, todas as características certas).
  - [x] 5b — `MagiasTab`/`SelecionarMagiaShell` (painel flutuante de
        Combate) mostram o pool da ponte (`ponte: PoolDePonte`) junto
        do pool principal, cada um com título próprio — não escondido
        atrás do pill. Confirmado no Livro do Jogador (Cap. 2,
        Multiclasse) que os 2 pools coexistem de verdade e têm ponte
        nos 2 sentidos. **Bug real corrigido de passagem:** `ponte`
        pegava a 1ª classe diferente da ativa sem checar se ela
        CONJURA — com 3+ classes (ex.: Bárbaro no meio, que não
        conjura), a ponte apontava pro Bárbaro e sumia (0 espaços).
        Testado nos 2 sentidos (pill em Bardo mostra Bruxo, pill em
        Bruxo mostra Bardo) no Char Multiclasse (Bárbaro/Bardo/Bruxo).
  - [ ] 5c — Resumo de conjuração (CD/Ataque Mágico, hoje 1 bloco só)
        vira 1 bloco POR classe conjuradora (CD/ataque dependem do
        atributo de conjuração de CADA classe — Bardo usa CAR, Mago
        usa INT, são números diferentes de verdade).
  - [ ] 5d — Seções Bruxo-específicas da aba Magias (Contatar
        Patrono, Astúcia Mágica, Arcana Mística, Livro das Sombras)
        passam a checar "o personagem TEM Bruxo em `classesAtual`"
        (usando o nível DESSA entrada) em vez de "a classe ativa é
        Bruxo".
  - [ ] 5e — Level Up: remove a dependência de `classeAtivaNome` como
        "classe padrão"/"classe que o Level Up afeta" — usa sempre o
        resultado de `EscolherClasseLevelUp` (já existe, só não
        recebia mais um `classePadrao` do pill) numa state local nova.
  - [ ] 5f — Remove os botões do pill + `classeAtivaNome`/
        `classeAtivaEntry`/`classe` (singular) de `FichaShell.tsx` de
        vez; qualquer resto que ainda dependa de "1 classe" passa a
        iterar `classesAtual`.
  - [ ] 5g — Checklist completo (tsc/testes/build) + teste manual nos
        3 personagens (1 classe só, Mago/Bardo, Bárbaro/Bardo/Bruxo)
        cobrindo Perfil, Magias, Combate e um Level Up de verdade.
- [ ] Entrega 6 — Fechamento: testes/tsc/build,
      `aprendizados/classes/multiclasse.md` (criar), limpar
      `PENDENCIAS.md` do que for resolvido no caminho.
