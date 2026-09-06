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
- [ ] **2. Extrair Dano Base (`DanoBase_Dado` + `DanoBase_Tipo`)** das
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
  - [ ] **Lote 3 (Círculo 5-9, ~45 magias)**
- [ ] **3. `AtaqueOuSalvaguarda`** — decidir se dá pra extrair
      confiável só do texto (melhorar `core/classificarMagia.ts`) ou
      se precisa de coluna nova na planilha (`AUDITORIA-CONTEUDO.md`
      seção 3, ainda em aberto).
- [ ] **4. `core/magiaDano.ts`** — função que combina Dano Base +
      Upcast Estruturado dado o círculo do espaço usado, com teste
      Vitest (caso sem upcast, caso com upcast tipo "Dado por Círculo"
      acima do círculo base, caso "Fórmula Própria"/"Outro").
- [ ] **5. UI na Ficha** (aba Magias, ao escolher círculo pra
      conjurar) mostrando o total de dados antes de confirmar e
      disparando a rolagem via `RollContext`. **Perguntar ao Osmar
      onde fica e como o jogador ativa antes de codar** (regra do
      `LICOES-RAPIDAS.md`) — ainda não perguntado, fazer antes de
      começar este item.
