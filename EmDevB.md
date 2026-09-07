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

## Foco: Auditoria de Magias — Upcast + Dano Base + AtaqueOuSalvaguarda

Continuação do que ficou registrado em `PENDENCIAS.md` ("Motor de
rolagem de dano de Magia") e `AUDITORIA-CONTEUDO.md` seção 3.1. Fonte
dos livros: 2 PDFs fornecidos pelo Osmar (Cap. 7 Magias do Livro do
Jogador, "A a I" e "I a Z" — juntos cobrem as 390 magias).

- [x] **1. Importar Upcast estruturado pro `magias.ts` — FEITA.** A
      planilha já tinha as colunas `Upcast_Tipo`/`Upcast_CirculoBase`/
      `Upcast_Dado`/`Upcast_Flat`/`Upcast_Alvos`/`Upcast_Texto`
      (trabalho de uma entrega anterior, ver `DECISOES-DADOS.md`), só
      não tinham sido trazidas pro código ainda. Adicionados os 6
      campos novos na interface `Magia` (tipo `UpcastTipo` novo,
      `'Nenhum'` da planilha vira `null` no código, igual ao padrão já
      usado em Itens Mágicos). 391 entradas preenchidas (390 da
      planilha + 1 entrada sintética "Falar com Animais - Traço de
      Gnomo", que corretamente ficou com upcast `null` igual a magia
      real "Falar com Animais"). `npx tsc --noEmit`, `npm test` (221
      passando) e `npm run build` OK.
- [x] **2. Extrair Dano Base (`DanoBase_Dado` + `DanoBase_Tipo`)** das
      magias com dano — mesmo processo usado pro Upcast (cruzar PDF +
      planilha, coluna "Círculo" já existente como checagem cruzada).
      129 magias com dano de um total de 390 (confirmado lendo o PDF
      completo, cruzado com regex) — quebrado em 3 lotes por círculo:
  - [x] **Lote 1 (Círculo 0-1, 38 magias) — FEITA.** Extração via
        script: localiza cada magia no PDF pelo cabeçalho "Nome\nNº
        Círculo, Escola (Classes)" (ou "Nome\nTruque de Escola" pros
        truques), fatia até o próximo cabeçalho, corta o texto no
        marcador "Usando um Espaço de Magia..."/"Aprimoramento de
        Truque" antes de buscar o dado base (pra não pegar o valor do
        upcast por engano). **1 correção de dado real, achada de
        graça durante a extração**: a planilha tinha `Upcast_Dado`
        errado pra "Relâmpago" (1d10, o livro diz 1d6) — corrigido na
        planilha e no `.ts`. **1 bug de contaminação corrigido**:
        "Badalar Fúnebre" tinha uma frase de "Banquete de Heróis"
        colada no meio da descrição (já era um problema conhecido,
        registrado no cabeçalho do arquivo desde antes) — corrigido
        contra o texto limpo do PDF, na planilha e no `.ts`. 2 magias
        com 2 efeitos de dano distintos (Faca de Gelo: acerto +
        explosão; Raio de Bruxa: dano inicial + manutenção por turno)
        — guardado só o valor que o Upcast realmente escala (conferido
        contra `upcastTexto` de cada uma), o outro efeito é fixo e já
        aparece em `descricaoCurta`. 2 magias com tipo de dano variável
        por escolha do jogador (Orbe Cromático, Explosão Elemental) —
        `danoBaseTipo: "escolhido"`, dado ainda fixo. `npx tsc
        --noEmit`, `npm test` (221 passando) e `npm run build` OK.
  - [x] **Lote 2 (Círculo 2-4, 44 magias) — FEITA.** 2 candidatas do
        regex descartadas ao ler contra o PDF: "Invocar Aberração"
        (o dado achado era da criatura invocada, não da magia em si —
        mesmo critério de excluir Invocar/Convocar com bloco de
        estatística próprio) e "Mesclar-se às Rochas" (6d6 Energético
        é dano de PUNIÇÃO ao conjurador se a rocha for destruída, não
        dano num alvo — fora do escopo de "Dano Base"). 6 magias com 2
        efeitos de dano no mesmo lançamento (Escudo Ardente, Esfera
        Vitriólica, Flecha Relâmpago, Flecha Ácida de Melf, Fome de
        Hadar, Tempestade Glacial) — guardado o valor que bate com o
        que `upcastTexto` escala (mesmo critério do Lote 1); Guardiões
        Espirituais tem o TIPO (não o dado) variando por tendência do
        conjurador — `danoBaseTipo: "escolhido"` (mesmo valor de dado
        nos dois casos, só o tipo muda). **Bug de script achado e
        corrigido antes de commitar**: a 1ª tentativa de gerar o
        `.ts` trocou os grupos do regex e gerou `"2d6"null"Radiante"`
        (JS quebrado) — pego no `npm run build` (não no `tsc --noEmit`
        sozinho, que não aparenta cobrir esse arquivo — rodar sempre
        os 3 comandos, nunca confiar só no tsc solto). `npx tsc -b`,
        `npm test` (221 passando) e `npm run build` OK.
  - [x] **Lote 3 (Círculo 5-9, 40 de 45 magias) — FEITA, item 2
        concluído.** 5 candidatas do regex descartadas depois de ler
        contra o PDF, todas pelo mesmo motivo (dano NÃO é infligido num
        alvo/inimigo): "Desejo" e "Contato Extraplanar" causam dano no
        PRÓPRIO conjurador como efeito colateral (Desejo: risco por
        abusar do efeito; Contato Extraplanar: falha na salvaguarda ao
        conjurar); "Missão" é dano condicional futuro se o alvo
        desobedecer (não acontece no lançamento, sem ataque/salvaguarda
        no momento do dano); "Teleporte" é dano de tabela de "Azar"
        (viagem deu errado); "Tempestade da Vingança" tem 5 efeitos de
        dano diferentes em turnos sucessivos (2d6 Trovejante, 4d6
        Ácido, 10d6 Elétrico, 2d6 Contundente, 1d6 Gélido) — não cabe
        no campo único, mesmo espírito do `Upcast_Tipo: "Outro"`.
        6 magias com 2+ efeitos de dano simultâneos guardam só o valor
        que bate com `upcastTexto` (ou o primeiro/principal quando
        ambos escalam igual, mesmo critério dos lotes 1/2). 2 magias
        com o TIPO sorteado por tabela (Rajada Prismática, Muralha
        Prismática — 1d8/1d6 pra escolher a cor) ganharam
        `danoBaseTipo: "aleatório"` (diferente de `"escolhido"`, que é
        decisão do jogador). `npx tsc -b`, `npm test` (221 passando) e
        `npm run build` OK. **Com isso, a extração de Dano Base está
        concluída** — 122 de 129 magias de dano candidatas viraram
        `danoBaseDado`/`danoBaseTipo` estruturado (7 descartadas ao
        ler contra o livro: 2 no Lote 2, 5 no Lote 3, todas com o
        motivo registrado acima/no Lote 2).
- [x] **3. `AtaqueOuSalvaguarda` — FEITA, entrega única (não em
      lotes — muito menos revisão manual que o Dano Base).**
      Respondida a pergunta em aberto da `AUDITORIA-CONTEUDO.md` seção
      3: dá pra extrair confiável só do texto (frases fixas "ataque
      mágico à distância"/"ataque mágico corpo a corpo"/"salvaguarda
      de <atributo>" no mesmo corpus de parágrafos já extraído do PDF
      pro Dano Base — não precisou reler os PDFs nem coluna nova na
      planilha). De 390 magias, só 8 tinham 2+ mecânicas no mesmo
      lançamento e precisaram de decisão manual (ex.: Faca de Gelo —
      ataque + salvaguarda — ficou com o mesmo tipo que o Dano Base já
      escolhera, Destreza; Mão de Bigby — ataque + 2 salvaguardas
      diferentes — ficou com Ataque Corpo a Corpo, que é a opção com
      dano estruturado). 2 magias (Rajada/Muralha Prismática) ganharam
      `"aleatório"` (tipo de salvaguarda sorteado pela própria magia,
      mesmo padrão já usado no Dano Base dessas 2). "Tempestade da
      Vingança" ficou `null` — mesmo motivo do Dano Base (5 efeitos
      diferentes por turno, não cabe num campo só). Nova coluna
      "AtaqueOuSalvaguarda" na planilha, campo `ataqueOuSalvaguarda`
      no `.ts` (390 preenchidas). `npx tsc -b`, `npm test` (221
      passando) e `npm run build` OK.
- [x] **4. `core/magiaDano.ts` — FEITA.** `calcularDanoMagia(magia,
      circuloUsado)` combina `danoBaseDado`/`danoBaseTipo` com o
      Upcast estruturado, devolvendo `{ quantidade, lados, mod, tipo,
      upcastNaoAutomatico }` — o formato bate com o que `RollContext.
      rolarDados` já espera (`quantidade`/`lados`/`mod` separados, um
      só tamanho de dado por rolagem), pronto pra ligar na UI do item
      5 sem tradução extra. `null` = magia sem `danoBaseDado`. Upcast
      "Dado por Círculo"/"Flat por Círculo" soma automático quando o
      dado do upcast tem o mesmo nº de lados do Dano Base (sempre bate
      nos dados reais, nenhum caso de tamanho diferente encontrado);
      "Alvo por Círculo" devolve o Dano Base sem mudança (upcast só
      aumenta nº de alvos, não o dado por alvo); "Fórmula Própria"/
      "Outro" (ou um "Dado por Círculo" com lados incompatível, caso
      hipotético não observado nos dados de hoje) devolve o Dano Base
      do círculo mínimo com `upcastNaoAutomatico: true` — a UI do item
      5 deve avisar isso e mostrar `upcastTexto`, nunca somar sozinha.
      6 testes Vitest (fixtures reais: Luz sem dano, Chama Sagrada sem
      upcast, Bola de Fogo com/sem upcast aplicado, Danação/Hex com
      upcast "outro" com/sem aviso). `npx tsc -b`, `npm test` (227
      passando) e `npm run build` OK.
- [x] **5.0 Pergunta feita — respondida.** O Osmar confirmou: 2 pontos
      de acesso já existentes (aba Magias — usar direto da lista; aba
      Combate — Ação/Ação Bônus/Reação), ambos precisam dos MESMOS 2
      modais novos:
  - **Modal de Ataque** (magia tipo Raio Místico — rola ataque à
        distância, se bate a CA rola dano). Achado explorando o código
        antes de propor: hoje isso é MENOS pronto do que parece — nem
        arma nem magia rolam CA automaticamente (o app nunca modela CA
        do inimigo, o jogador decide na mesa se acertou, igual sempre
        foi), mas magia de ataque hoje só rola o d20 e manda "veja a
        descrição pro dano" — nem chega a oferecer o botão "Rolar
        Dano" que arma já tem. Este modal fecha esse gap, reaproveitando
        100% o padrão de arma (`DanoPendente` + botão "🎲 Rolar Dano").
  - **Modal de Salvaguarda** (novo) — mostra CD + atributo (de
        `ataqueOuSalvaguarda`) + texto de sucesso/falha (separados,
        formato padronizado tipo `AtaqueDeSoproModal`/
        `LancarNoInfernoModal` — popup pequeno sem estado próprio,
        reaproveitando `TrocarArmaMaestria.module.css`) + botão "Rolar
        Dano" (sempre dano cheio, jogador ajusta na mesa se soube que
        o alvo passou — mesma filosofia do Ataque de Sopro, não tenta
        rastrear sucesso/falha sozinho).
- [x] **5.1 Extrair `Salvaguarda_Falha`/`Salvaguarda_Sucesso` — FEITA.**
      Texto curto padronizado (Osmar escolheu esse formato, não
      reaproveitar `descricaoCurta` como estava) pras 85 magias que são
      de salvaguarda E têm dano — reaproveita o mesmo corpus de
      parágrafo do PDF já extraído (sem reler os livros). Categorias:
      "Dano completo"/"Metade do dano" (padrão clássico de resistência,
      57 magias), "Dano completo"/"Nenhum efeito" (livro nunca
      menciona metade, 27 magias — incluindo "Destruição *", a família
      de smites do Guardião, onde o dano acontece no acerto de arma e
      a salvaguarda só decide se uma condição continua), "Esquentar
      Metal" com texto próprio (dano incondicional, salvaguarda só
      decide se solta o item). Quando o livro menciona uma condição
      junto do dano na falha, ela entra no texto (ex.: "Dano completo +
      Cego", 23 magias). 2 imprecisões conhecidas registradas em
      `PENDENCIAS.md` (Rogar Maldição — dano é futuro, não imediato;
      Rajada/Muralha Prismática — texto aproximado, efeito real varia
      por raio sorteado). Novas colunas na planilha
      (`Salvaguarda_Falha`/`Salvaguarda_Sucesso`) + campos no `.ts`
      (`salvaguardaFalha`/`salvaguardaSucesso`), preenchidos por
      `nome` igual todo o resto — fácil de corrigir depois (pedido do
      Osmar). `npx tsc -b`, `npm test` (227 passando) e `npm run
      build` OK.
- [x] **5.2 Modal de Ataque — FEITA.** Wiring em MagiasTab/
      AcaoPanelContent/ReacaoPanelContent: depois do d20 de ataque de
      magia, oferece "🎲 Rolar Dano" via `calcularDanoMagia`, igual
      arma já faz hoje — mesmo `DanoPendente` reaproveitado (nenhuma
      estrutura nova). `AcaoPanelContent`/`ReacaoPanelContent` já
      recebiam `dano?` opcional no `onEscolher` (usado por arma); só
      `ReacaoPanelContent`/`CombatTab` precisaram propagar esse 4º
      parâmetro até `escolherNoPainel`, que já sabia lidar com ele.
      Testado ao vivo em Chromium 390×844 (Playwright): aba Magias
      (Rajada de Veneno, truque, 1d12 Venenoso rolado certo) e aba
      Combate → Ação (Toque Necrótico, 1d20+7 de ataque seguido de
      1d10 Necrótico de dano, valores batendo com a regra). **Achado
      de teste, não de produto:** o `.pill` de `MagiaComDescricao`
      (nome + ⓘ) cobre a linha inteira e sempre para a propagação do
      clique (é o botão de abrir a descrição) — pra clicar a LINHA em
      vez do nome, o teste precisa mirar o `.check-row`/`spellMiniRow`
      diretamente, não um elemento de texto dentro dele. Isso já era
      verdade antes desta entrega (comportamento do componente
      reaproveitado em toda tela de magia), só não tinha sido
      confirmado num teste de Combate ainda — não é uma mudança de
      comportamento pro Osmar. `npx tsc -b`, `npm test` (227 passando)
      e `npm run build` OK.
- [ ] **5.3 Modal de Salvaguarda** — componente novo
      (`MagiaSalvaguardaModal.tsx`, seguindo o padrão de
      `AtaqueDeSoproModal`), CD calculada por `cdConjuracao` (já
      existe), wiring nos mesmos 3 lugares do 5.2.
