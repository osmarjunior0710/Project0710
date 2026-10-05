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

## Foco atual: Paladino (implementação completa)

SDD: `sdd/sdd-paladino.md` (Chapéu 2, aprovado). Confirmado com o
Osmar: Maestria em Arma fixa em 2 (sem progressão), Auras só afetam o
próprio Paladino (efeito em aliados fica manual, fora do app por
enquanto). Cor final da classe já decidida: `#000075`, texto branco
(ver `core/corRecursoClasse.ts`) — não precisa mais de cor temporária
na Entrega 5.

- [x] **Entrega 1 — dado sem mudar nada visível** (concluída, `npx tsc
  --noEmit` / `npm test -- --run` / `npm run build` verdes)
  - [x] `classes.ts`: núcleo (Força/Carisma, d10, Sabedoria+Carisma) +
    progressão 1-20 (usa `progressao-meio-conjurador.ts` novo);
    `disponivel: false` até a Entrega 2
  - [x] `progressao-meio-conjurador.ts` novo (compartilhado c/ Guardião,
    tabela da seção 2 do SDD)
  - [x] `caracteristicasClasse.ts`: 18 características (20 níveis,
    2 sem nome próprio), limpando as 2 células contaminadas
    (Conjuração nv1, Destruição do Paladino nv2 — Repudiar Inimigos
    nv9 e Dádiva Épica nv19 também limpas)
  - [x] `caracteristicasSubclasse.ts`: 21 características das 4
    subclasses (Devoção/Glória/Vingança/Anciões), Magias do Juramento
    como `magiasFixasPorNivel`
  - [x] Maestria em Arma: 2 fixo em todos os 20 níveis (confirmado com
    o Osmar — não vem da planilha)
  - [x] `proficienciasArmaArmaduraClasse.ts`: já tinha Paladino
  - [x] `subclasses.ts`: 4 juramentos cadastrados
  - [x] Auditoria idioma nível 1: confirmado que NÃO concede — já
    atualizado em `PENDENCIAS.md`
- [x] **Entrega 2 — habilitar Paladino na criação de personagem**
  (concluída, testada no wizard de ponta a ponta)
  - [x] `classesProficienciasIniciais.ts`: perícias (escolha 2 de
    Atletismo/Intimidação/Intuição/Medicina/Persuasão/Religião) +
    equipamento inicial (A: Cota de Malha/Escudo/Espada Longa/6
    Azagaias/Símbolo Sagrado/Kit de Sacerdote/9 PO; B: 150 PO) — PDF
    Cap. 3, pág. 167
  - [x] `classes.ts`: `disponivel: true`
  - [x] Banners das subclasses: Devoção, Anciões e Vingança recebidos
    do Osmar e importados (512×512 WebP, mesmo padrão das outras
    artes) — falta só o da Glória, cai no fallback 🖼 até chegar
- [x] **Entrega 3 — os 20 níveis sem features especiais** (concluída —
  confirmado 100% genérico, zero código novo)
  - [x] `levelUp.test.ts`: 6 casos novos pro Paladino (ASI 4/8/12/16,
    Dádiva Épica 19, Estilo de Luta só a partir do nível 2 — diferente
    do Guerreiro, Ataque Extra para em 2 pra sempre, níveis 13/17 sem
    característica nova, "Característica de Subclasse" placeholder no
    7 sem descrição própria)
  - [x] Testado ao vivo no wizard/Level Up (Playwright): subiu de
    nível sem erro no console, PV por d10 calculado certo
- [x] **Entrega 4 — Magias/círculos/espaços** (concluída, testada ao
  vivo: criação nv5, Descanso Longo, Level Up 8→9)
  - [x] Bug: `atributoPrimario` "Força e Carisma" não mapeava → CD/ataque
    `null`. Novo `atributoDeConjuracao(classe)` por ID (`paladino` → CAR)
  - [x] Padrão B: `trocaUmaMagiaPorDescanso` + `usaRedefinicaoPorDescanso`
    agora vale pra B e C (Level Up só cresce); `temLivroDeMagias` separa
    o texto do Mago
  - [x] Descanso Longo: mesma pergunta do Mago, abre `MemorizarMagiaShell`
    `modo="unica"` (novas props `titulo`/`descricao`) — troca 1 magia
  - Sobra pra Entrega 6: Destruição Divina e Convocar Montaria aparecem
    na lista normal de preparadas (viram "sempre preparadas", fora do
    limite)
  - Sobra pra Entrega 8: Paladino + Mago na mesma ficha — a pergunta do
    Descanso Longo só atende o Mago (vem primeiro)
- [x] **Entrega 5 — Canalizar Divindade como recurso** (concluída,
  testada ao vivo nv10: gasto, Descanso Curto devolve 1, persiste ao
  recarregar)
  - [x] `quantidadeCanalizarDivindade` (`recursosClasse.ts`), linha em
    `recursosVisiveis.ts` (cor final `#000075`, não temporária), 4 testes
  - [x] Recarga: 1 uso no Curto, todos no Longo (igual Recuperar Fôlego);
    campo `canalizarDivindadeGasto` salvo na ficha (ausente = 0)
  - [x] Sentido Divino (Ação Bônus) no painel de Bônus, gasta 1 uso
  - Entrega 6/7 só precisam chamar `canalizarDivindade.onUsar()` pra
    gastar 1 uso do mesmo banco (Destruição Divina grátis, Repudiar
    Inimigos, opções dos Juramentos)
- [ ] **Entrega 6 — features de combate, uma por vez**: Mãos
  Consagradas → Destruição do Paladino → Estilo de Luta/Combatente
  Abençoado → Montaria Fiel → Aura de Proteção → Repudiar Inimigos →
  Aura de Coragem → Golpes Radiantes → Toque Restaurador → Aura
  Expandida
  - [x] **Mãos Consagradas** (concluída, testada ao vivo nv1: curar a
    si mesmo com PV cheio vira PV Temp., reserva desconta certo, ⚡
    Bônus trava "Usada")
    - [x] `quantidadeMaosConsagradas` (`recursosClasse.ts`, 5×nível),
      `RecursoVisivel.exibicao: 'barra'` novo (pool grande demais pra
      pips) + `BarraRecurso.tsx` novo (reaproveita a animação de
      `LinearProgressBar.tsx`, cor fixa da classe, número dentro)
    - [x] Painel de Ação Bônus: linha "🖐️ Mãos Consagradas" abre
      cartão com 3 opções — Curar a si mesmo (aplica PV de verdade via
      `alterarPv`), Curar outro (só desconta a reserva — sem ficha de
      aliado no app), Remover Envenenado (5 PV fixo, nunca cura)
    - [x] Recarrega só no Descanso Longo (`descansoLongo` zera
      `maosConsagradasGasto`; `descansoCurto` não toca, diferente do
      Canalizar Divindade)
    - [x] `maosConsagradasGasto` persistido em
      `armazenamentoPersonagens.ts` (opcional, ausente = 0)
    - Nível 14 (Toque Restaurador — mais condições) fica pra quando
      chegar a vez desse nível na Entrega 6
  - [x] **Destruição do Paladino** (nível 2, concluída — testada ao
    vivo nv2: opção "Conjurar Grátis" aparece no círculo 1, some depois
    de usada, volta a pedir espaço normal; "Usar" rola 2d8 de dano)
    - Regra confirmada no livro (texto partido em 2 páginas): "Você
      sempre tem a magia Destruição Divina preparada. Além disso, você
      pode conjurá-la sem gastar um espaço de magia, não podendo
      conjurá-la dessa forma novamente antes de completar um Descanso
      Longo." — corrigida a célula contaminada da planilha (E174,
      "Características de Classe") que tinha uma tabela colada no
      meio, sobrando um "usando Canalizar Divindade" que não existe no
      livro (Osmar autorizou corrigir direto, com backup antes)
    - [x] **Bug achado testando (pré-existente, não só dessa magia):**
      `mecanicaDaMagia` não reconhecia nenhuma magia com
      `ataqueOuSalvaguarda: null` + `danoBaseDado` preenchido — "Usar"
      não rolava dano nenhum, só mostrava o texto da descrição.
      Afetava Destruição Divina, Mísseis Mágicos, Marca do Predador,
      Favor Divino, Explosão Elemental, Manto do Cruzado, Destruição
      Radiante e outras — nova mecânica `'dano-automatico'` em
      `core/magiaDano.ts`/`core/conjurarMagia.ts`, com testes.
      **Achado no caminho, fora do escopo:** "Proibição" e "Palavra de
      Poder: Matar" têm `danoBaseDado` cadastrado mas não deveriam ter
      (nenhuma das 2 causa dano por dado na regra real) — dado
      suspeito da importação original, não confirmado ainda no livro;
      registrar se aparecer de novo.
    - [x] Mecanismo genérico novo (reaproveita em Montaria Fiel, e
      depois em Marca do Predador do Guardião): campo
      `magiaFixaConcedida?: { nomeMagia; usosGratisPorDescansoLongo }`
      em `CaracteristicaClasse` + `magiasFixasDaClasseBase`/
      `circuloGratisMagiaFixaDeClasse` em `core/magiasFixasDeClasse.ts`
      + estado `magiasFixasClasseGastas: Record<string, number>` no
      `FichaShell.tsx` (reseta no Descanso Longo, reaproveita
      `usarMagiaGratis` já existente da Assinatura Mágica)
    - [x] Destruição Divina entra em `magiasConjuraveis`
      (`useMagiasEConjuracao.ts`) igual as outras fontes "sempre
      preparada" — aparece no painel de Ação Bônus do Combate E na
      aba Magias (seção nova "Magias de Classe Sempre Preparadas");
      opção "Conjurar Grátis" no círculo base junto das opções de
      espaço normal (mesmo padrão de Maestria/Assinatura do Mago)
    - Contatar Patrono do Bruxo (mesma receita, já implementado do
      jeito antigo com `contatarPatronoGasto`) **não migrou** —
      registrado no `Backlog.md`, sem risco de retestar código que já
      funciona
  - [x] **Montaria Fiel** (nível 5, concluída — testada ao vivo nível 5:
    conjurar grátis Convocar Montaria abre popup de escolha, confirma
    Pet "Radiante" na aba Pets com CA 12/PV 25 corretos pro círculo 2)
    - [x] `magiaFixaConcedida: { nomeMagia: 'Convocar Montaria',
      usosGratisPorDescansoLongo: 1 }` na característica Montaria Fiel
      — reaproveita 100% o mecanismo genérico de Destruição Divina,
      zero código novo nessa parte (aparece sozinho no painel de Ação
      do Combate E na aba Magias, "Conjurar Grátis" incluso)
    - [x] 3 `Criatura` novas no catálogo (Montaria Celestial/Feérica/
      Ínfera — `data/rulesets/dnd2024/criaturas.ts`), atributos fixos
      (FOR 18/DES 12/CON 14/INT 6/SAB 12/CAR 8) e CA/PV base de
      círculo 2 (sobrescritos por `ajustes` no momento de conjurar)
    - [x] `core/pets.ts`: `statsMontariaSobrenatural(circuloUsado)` —
      CA 10+círculo, PV 5+10×círculo (regra oficial, testado em
      `pets.test.ts`, inclusive upcast e círculo 1)
    - [x] **Primeiro fluxo "conjurar magia → cria Pet" do app** (nunca
      existia — Pet sempre foi só manual): interceptação dentro de
      `conjurarMagia()`/`processarMagiaAoUsar()` (Combate e Magias,
      duplicado nas 2 telas, mesmo padrão de Destruição Divina) pro
      nome `'Convocar Montaria'`, abre `EscolherMontariaModal.tsx`
      (nome + tipo Celestial/Feérico/Ínfero) com estado erguido pro
      `CombatTab.tsx`/`MagiasTab.tsx` (regra de SidePanel com
      `transform`, mesmo padrão de `escolhaSobrecarga`)
    - [x] **Bug achado e corrigido durante o teste ao vivo:** abrir o
      modal a partir do painel de Ação/Bônus SEM fechar o painel antes
      deixava o botão "Convocar" clicável na tela mas sem efeito — o
      `SidePanel` (z-index 111) ficava por cima do modal (z-index 55),
      interceptando o clique mesmo o modal aparecendo visualmente por
      cima no screenshot. Corrigido chamando `onMarcarUsado`/
      `setPainelAberto(null)` no callback que abre o modal, igual todo
      outro fluxo de "usar magia" que resolve dentro do painel já faz
      via `escolherNoPainel`.
    - [x] Pancada Sobrenatural (ação corpo a corpo do Pet), as 3 Ações
      Bônus por tipo (Toque Curativo/Passo Feérico/Derrubar Brilho) e
      Vínculo Vital: **decisão do Osmar (2026-09-30) — ficam só como
      texto** no stat block da criatura (`tracos`/`acoes`/`acoesBonus`),
      sem toggle/contador — `core/pets.ts` ainda não tem motor de
      recurso PRÓPRIO de Pet (recarga por Descanso, contador de usos);
      controle fica manual do jogador por enquanto. Registrado em
      `PENDENCIAS.md` ("Motor de recursos pra Pets") pra quando
      aparecer uma 2ª situação que precise da mesma coisa.
  - [x] **Aura de Proteção** (nível 6, concluída — testada ao vivo em 3
    Paladinos nível 6 com CAR variado: bônus bate certo nas 6
    salvaguardas em todos)
    - [x] `core/recursosClasse.ts`: `temAuraDeProtecao(classe, nivel)`
      — `true` a partir do nível 6, mesmo padrão de
      `quantidadeMaosConsagradas`
    - [x] `core/calculoPersonagem.ts`: `calcularSalvaguardas` ganhou 6º
      parâmetro opcional `bonusAuraProtecao` — soma nas 6 salvaguardas
      (mínimo +1, igual a regra), linha própria "Aura de Proteção" no
      popup de explicação quando ativo
    - [x] `FichaShell.tsx`: calcula `bonusAuraProtecao = Math.max(1,
      carMod)` quando `temAuraDeProtecao` pra classe/nível Paladino
      (reaproveitando a leitura de nível por classe que Canalizar
      Divindade/Mãos Consagradas já tinham — unificado num só lugar)
    - **Escopo confirmado antes (sdd-paladino.md seção 9):** só o
      efeito no PRÓPRIO Paladino, nunca em aliados — sem UI nova,
      passiva sempre ativa, sem botão de "ligar" (confirmado com o
      Osmar: "simplesmente emana")
    - **Simplificação conhecida:** a regra desliga a aura se o
      Paladino tiver a condição Incapacitado — o app não rastreia
      nenhuma condição ativa no próprio personagem ainda, então fica
      sempre ativa a partir do nível 6. Não registrado em
      `PENDENCIAS.md` (não é uma entrega faltando, é uma simplificação
      aceita, mesmo padrão de outras características que dependem de
      estado não rastreado)
  - [x] **Repudiar Inimigos** (nível 9, concluída — testada ao vivo nível
    9: gasta 1 uso de Canalizar Divindade, marca Ação usada [tempo
    certo, diferente de Sentido Divino que é Bônus], abre popup com CD
    14 e "até 2 criaturas" batendo com CAR do personagem de teste)
    - [x] Reaproveita 100% o banco de usos de Canalizar Divindade que
      Sentido Divino já usa (`CombatTab.tsx` `usarRepudiarInimigos`,
      mesmo padrão de `usarSentidoDivino`, só que no painel de Ação em
      vez de Bônus) — nenhum estado novo, só mais um jeito de gastar o
      mesmo banco
    - [x] CD mostrada reaproveita a MESMA conta de Lançar no Inferno
      (Bruxo) — `cdConjuracao(modAcertoConjuracao)`, variável
      renomeada de `cdLancarNoInferno` pra `cdConjuracaoClasseAtual`
      já que agora serve os 2
    - [x] Desbloqueio por nível reaproveita `caracteristicaDesbloqueada`
      genérico (mesmo helper de Conhecimento Primordial) — nenhuma
      função nova em `core/`
    - [x] **Correção (2026-10, apontada pelo Osmar):** a 1ª versão
      mostrava CD/alvos só como texto de feedback embaixo dos botões —
      errado, porque é um caso de "CD do jogador, o ALVO (inimigo) que
      faz a salvaguarda", que já tinha um padrão genérico pronto
      (`SalvaguardaDoAlvoModal`, usado por Golpe de Escudo/Lançar no
      Inferno/Ataque de Sopro — ver DECISOES-COMBATE.md "Salvaguarda do
      Alvo — popup único"). Troquei pra abrir esse popup de verdade
      (CD + Sucesso/Falha + aviso do nº de alvos), igual os outros 3
      casos — lição: ao decupar uma característica nova com salvaguarda
      de ALVO, checar esse padrão ANTES de inventar um jeito novo de
      mostrar a CD.
    - **Escopo:** igual Sentido Divino, o app não tem ficha de
      inimigos na tela — mostra CD e nº máx. de alvos, mas quem
      falhou/ficou Amedrontado é controle manual do jogador
    - [x] **Correção 2 (2026-10, apontada pelo Osmar — CLAUDE.md seção
      6.6):** Sentido Divino e Repudiar Inimigos só existiam no
      Combate, sem grupo próprio na aba Magias (nem os pips, nem o
      status) — igual o bug antigo de Maestria/Assinatura do Mago que
      deu origem à seção 6.6. Corrigido com seção nova "Canalizar
      Divindade" na aba Magias, totalmente usável de lá (não só
      exibição) — reaproveita o MESMO banco de usos e a MESMA CD do
      Combate (`onUsarUsoCanalizar`/`cdConjuracaoClasseAtual`, nenhuma
      função nova em `core/`), com o mesmo popup de salvaguarda
      (`SalvaguardaDoAlvoModal`) pra Repudiar Inimigos. Testado ao
      vivo: usar Repudiar Inimigos pela aba Magias gasta o mesmo pip
      que aparece no Combate.
  - [x] **Aura de Coragem** (nível 10, concluída) — confirmado
    `textonly`: o app nunca aplica condição nenhuma no próprio
    personagem automaticamente (nem Amedrontado, nem outra), então não
    tem nada pra checar essa imunidade. Mesmo raciocínio já usado em
    Aura Expandida (nível 18) — aproveitei pra confirmar ela também
    como `textonly` (era `placeholder-textonly`, agora resolvido).
    Testado ao vivo: sem `[PH]` no Perfil pras 2 características.
  - [x] **Golpes Radiantes** (nível 11, concluída) — sempre ativa, sem
    toggle: soma 1d8 Radiante automático no dano de qualquer ataque
    que acertar com arma Corpo a Corpo ou Ataque Desarmado.
    - [x] **Achado importante:** `AtaqueInfo` só tinha `usouForca`
      (usa Força no cálculo), que NÃO é a mesma coisa que "é corpo a
      corpo" — uma arma com Acuidade (ex. Rapieira) usada com Destreza
      tem `usouForca: false` mas continua corpo a corpo. Campo novo
      `corpoACorpo: boolean` em `AtaqueInfo`
      (`data/exampleCombat.ts`), calculado certo nos 2 construtores de
      `core/ataque.ts` (`ataqueDesarmado` sempre `true`,
      `ataqueComArma` = `!distancia`) — 4 testes novos cobrindo a
      distinção dos dois campos.
    - [x] `AcaoPanelContent.tsx` `rolarAtaque`: reaproveita o MESMO
      mecanismo de `gruposExtras` que Golpe Brutal (Bárbaro) já usa —
      soma o 1d8 extra junto no popup de dano, sem toggle nem ação
      extra do jogador.
    - **Limitação aceita:** não entra em `rolarAtaqueGolpeBrutal`
      (fluxo separado do Bárbaro) — combinação Paladino+Bárbaro no
      mesmo turno é multiclasse rara, fora do escopo desta entrega.
    - **Verificação:** cobertura por teste automatizado completa
      (`core/ataque.test.ts`); a confirmação ao vivo do popup de dano
      ficou travada no ambiente desta sessão (motor de dados 3D nunca
      sai de "Rolando..." em modo headless/software-render — confirmado
      que o overlay abre certo, só a física do dado não assenta nesse
      ambiente específico, nada relacionado à mudança em si).
  - [x] **Correção (2026-10, 2 bugs apontados pelo Osmar testando
    Golpes Radiantes ao vivo no celular — confirmou que o dado funciona
    certo, achou 2 bugs de UI pré-existentes, não relacionados à
    entrega):**
    1. **Dado 3D "rolou atrás" do painel de Ação/Bônus/Reação aberto**
       (ex.: 1º de 2 ataques do turno, painel só fecha depois do
       último) — `RollOverlay`/`Dice3dCanvasHost`/`Dice3dFab` tinham
       z-index 90-105, todos ABAIXO do `SidePanel` aberto (110/111) —
       bug real, não só do Golpes Radiantes, afeta QUALQUER rolagem de
       dado feita com um painel ainda aberto. Todo o grupo subiu pra
       120-135 (mesma ordem relativa de antes, só acima do SidePanel e
       ainda abaixo do `DescansoOverlay`, 200).
    2. **1d1 (Ataque Desarmado sem talento) desenhava uma caixinha de
       "dado" com borda pro valor fixo "1"** — como 1d1 nunca varia,
       não faz sentido mostrar como se tivesse rolado algo. Grid de
       dados do popup agora pula (não desenha) qualquer dado com 1
       lado só — o total continua somando o valor normalmente, só a
       caixinha some. `LadosDado` (tipo TS) ganhou `1` na união (já
       era usado em runtime via cast, só o tipo que não cobria).
    - **Verificação:** confirmado ao vivo pelo Osmar no celular — dado
      aparece por cima do painel certinho (z-index corrigido). O 1d1
      ainda não foi re-testado visualmente (ataque com talento que
      muda o dado), mas a lógica é a mesma.
  - [x] **Correção 2 (2026-10, apontada pelo Osmar testando a correção
    acima):** mesmo com o dado aparecendo por cima, o painel de Ação
    continuava aberto depois de escolher "Atacar" — só fechava depois
    do ÚLTIMO ataque de quem tem Ataque Extra. Pedido do Osmar: painel
    sempre fecha assim que qualquer ação é escolhida, mesmo sobrando
    ataque (confirmado com ele: prefere reabrir o painel pra cada
    ataque a deixá-lo aberto entre eles). `registrarAtaqueSemDanoPendente`
    (`CombatTab.tsx`) agora fecha o painel e marca Ação usada em TODO
    ataque, não só no último — vale também pra Golpe Brutal (Bárbaro),
    que passa pelo mesmo bookkeeping. Testado ao vivo (automatizado):
    painel fecha (perde a classe `panelOpen`) e Ação já marca "usada"
    logo no 1º ataque, mesmo com Ataque Extra ainda tendo 1 ataque
    sobrando.
  - [x] **Toque Restaurador** (nível 14, concluída) — Mãos Consagradas
    virou 1 toque combinado: cura PV E remove condição(ões) juntos no
    mesmo gasto (regra real confirmada com o Osmar antes de codar —
    NÃO é exclusivo, é "você decide como dividir o que vai gastar
    nesse toque").
    - [x] `core/maosConsagradas.ts` novo: `custoTotalMaosConsagradas`
      (PV pra curar + 5×condições) e `condicoesDisponiveisMaosConsagradas`
      (Envenenado sempre; +6 condições do Toque Restaurador a partir
      do nível 14) — 8 testes novos.
    - [x] `MaosConsagradasModal.tsx` reescrito: barra da reserva no
      topo (pedido do Osmar) com prévia em vermelho do que SERIA
      gasto antes de confirmar (`BarraRecurso.tsx` ganhou prop
      `pendente`, mesma ideia do dano pendente na barra de PV) +
      checkboxes de condição + alvo (si mesmo/outro) + 1 botão
      "Confirmar (N PV)" só, nada de botões separados por ação.
    - [x] `CombatTab.tsx`/`FichaShell.tsx`: os 3 handlers antigos
      (curar self/curar outro/remover Envenenado, cada um fechando o
      popup sozinho) viraram 1 `confirmarMaosConsagradas` só, desconta
      tudo de uma vez.
    - **Testado ao vivo:** PV 5→11 (curou 6) e reserva 70→59 (6 cura +
      5 Envenenado) numa confirmação só; barra mostrou o pedaço
      vermelho de 11 PV certinho antes de confirmar.
    - [x] **Correção (2026-10, 3 bugs apontados pelo Osmar testando ao
      vivo):**
      1. A barra só considerava as condições marcadas, não o PV
         digitado pra curar — `pontosCurar` só contava DEPOIS de
         escolher o alvo (self/outro). Corrigido: conta o valor
         digitado sempre, mesmo antes de escolher quem recebe a cura.
      2. "Curar a si mesmo" agora mostra `PV atual/máximo` do próprio
         Paladino embaixo do texto, pra saber quanto tem de PV antes
         de decidir esse alvo.
      3. "Confirmar" só habilita se (tem PV pra curar E alvo
         escolhido) OU (pelo menos 1 condição marcada, mesmo com 0 PV
         de cura e sem alvo — remover condição nunca aplica PV em
         ninguém, não precisa de alvo). Testado ao vivo: botão
         desabilitado com 10 PV digitados sem alvo, habilita ao
         escolher "Curar a si mesmo".
- [ ] **Entrega 7 — subclasses**, uma por vez (Devoção primeiro)

  SDD: `sdd/sdd-paladino-devocao.md` (Chapéu 2, aprovado). Ordem
  confirmada: Magias do Juramento → Arma Sagrada → Aura de Devoção
  (suspeita textonly) → Destruição Protetora (suspeita textonly) →
  Resplendor Sagrado. Personagem de teste dedicado: 🧪 Char Teste —
  Paladino Devoção (nível 20, Carisma 20).

  - [x] **Magias do Juramento da Devoção** (nível 3, concluída) —
    reaproveitou 100% o padrão de Magias de Pacto do Ínfero (Bruxo):
    `core/magiasJuramentoDaDevocao.ts` novo (mesma assinatura), 5
    testes. Fiação em `useMagiasEConjuracao.ts`/`FichaShell.tsx`
    (novo ID `magiasDoJuramentoDaDevocao` em
    `idsCaracteristicasSubclasse.ts`, consolidado no
    `caracteristicasSubclasseAtivas`). Testado ao vivo (seção 6.6):
    aparece como "sempre preparada" na aba Magias (seção própria
    "Magias do Juramento da Devoção") E no picker "Usar Magia" do
    Combate (Escudo da Fé no painel de Ação Bônus, Proteção Contra o
    Bem e o Mal no painel de Ação — cada uma no painel certo pelo
    próprio Tempo de Conjuração).
  - [x] **Arma Sagrada** (nível 3, concluída) — a arma elegível é
    sempre a atualmente equipada pro "Atacar" (o app só rastreia 1
    por vez) — sem seletor de arma novo. `core/armaSagrada.ts` novo
    (`bonusArmaSagrada`/`armaElegivelParaArmaSagrada`, 5 testes).
    - [x] Linha "⚔️ Arma Sagrada" no painel de Ação (só quando a arma
      atual é Corpo a Corpo de verdade, não Desarmado) — gasta 1 uso
      de Canalizar Divindade, mesmo banco de Sentido Divino/Repudiar
      Inimigos.
    - [x] Toggle sem cronômetro (padrão novo em `DECISOES-COMBATE.md`):
      card "⚔️ Arma Sagrada ATIVA — [arma]" no corpo da aba Combate,
      com botão "Encerrar". `armaSagradaAtiva` persistido (mesmo
      padrão de `furiaAtiva`).
    - [x] **Escolha Normal/Radiante no popup de dano, como a regra
      pede** ("a cada acerto") — pedido do Osmar depois de eu propor
      um toggle no card por simplicidade técnica. `confirmarFechamento`
      (`RollContext.tsx`/`RollOverlay.tsx`) ganhou suporte a MÚLTIPLOS
      botões (array), não só 1 — reaproveitável por qualquer
      característica futura com a mesma forma ("escolha ao fechar o
      popup de dano"). Com Arma Sagrada ativa, os botões "Normal"/"☀️
      Radiante" aparecem no fechamento do popup de dano (em vez do
      botão de Golpe Brutal/Esmagador/Talhador — combinação rara,
      mesma exclusão de Golpes Radiantes com Golpe Brutal). Tipo de
      dano continua só rótulo informativo (confirmado com o Osmar: o
      app não calcula resistência/vulnerabilidade de inimigo).
    - [x] Bônus some automaticamente se o jogador trocar pra uma arma
      não elegível (à distância) com o toggle ainda ativo — não
      desliga sozinho, só o bônus que some até voltar pra arma Corpo
      a Corpo (simplificação confirmada com o Osmar).
    - [x] **Achado corrigindo o personagem de teste:** o pacote de
      equipamento inicial do Paladino sorteado pelo gerador de teste
      caiu no "B" (só dinheiro, sem item nenhum) — sem arma pra testar
      Arma Sagrada. `personagemTestePaladinoDevocao.ts` agora força o
      pacote A e equipa a Espada Longa na Mão Principal explicitamente
      (a arma de 1 mão não auto-equipava sozinha, diferente de
      armadura/escudo).
    - **Testado ao vivo:** ativar gasta 1 uso de Canalizar Divindade
      (3/3→2/3), card aparece com toggle Normal/Radiante + Encerrar,
      "🗡 Atacar" mostra "Espada Longa" com `1d20 + 14` (9 base de
      Espada Longa + 5 de Arma Sagrada, Carisma 20) — matemática
      bate.
  - [x] **Aura de Devoção** (nível 7, concluída) — confirmado `textonly`
    com o Osmar: efeito só em ALIADOS (Imunidade a Enfeitiçado na Aura
    de Proteção), mesmo motivo de Aura de Coragem (nível 10) — o app
    não rastreia condição de outros personagens. `core/auraDeDevocao.ts`
    novo (função vazia, só marco de existência, CLAUDE.md 12.1).
  - [x] **Destruição Protetora** (nível 15, concluída) — confirmado
    `textonly` com o Osmar: Cobertura Parcial pros ALIADOS ao conjurar
    Destruição Divina, mesmo motivo de Aura de Devoção/Aura de
    Coragem. `core/destruicaoProtetora.ts` novo (marco de existência).
  - [ ] Resplendor Sagrado (nível 20)
- [ ] **Entrega 8 — Multiclasse** (ligar em `conjuradorMulticlasse.ts`)
