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
  - [ ] **Montaria Fiel** (nível 5) — depois de Destruição do Paladino
    - Regra confirmada: sempre tem Convocar Montaria preparada + 1
      conjuração grátis (mesmo mecanismo genérico acima)
    - **Anotado pra quando chegar a vez:** Convocar Montaria (magia,
      Cap. 7) tem bloco de estatísticas completo ("Montaria
      Sobrenatural" — CA 10+círculo, PV 5+10×círculo, FOR 18/DES 12/
      CON 14/INT 6/SAB 12/CAR 8, Deslocamento 18m + Voo 18m se círculo
      4+, 1 ação Pancada Sobrenatural 1d8+círculo, 1 Ação Bônus que
      varia por tipo escolhido — Celestial cura/Feérico teleporte/
      Ínfero amedronta). Osmar confirmou: **aparece na aba Pets** —
      reaproveita o sistema de Pets que já existe (`Pet.origemInvocacaoId`
      já cobre "1 pet por essa fonte, conjurar de novo substitui" —
      regra idêntica da montaria). Precisa criar 3 `Criatura` no
      catálogo (Montaria Celestial/Feérica/Ínfera) + calcular CA/PV/
      dano pelo círculo usado na hora de conjurar (via `ajustes` do
      Pet). Desconjurar: só desaparece a 0 PV ou se o Paladino morrer
      — sem "dispensar quando quiser".
- [ ] **Entrega 7 — subclasses**, uma por vez (Devoção primeiro)
- [ ] **Entrega 8 — Multiclasse** (ligar em `conjuradorMulticlasse.ts`)
