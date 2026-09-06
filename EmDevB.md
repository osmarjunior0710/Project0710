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
      Trabalho grande (~130+ magias de dano) — quebrar em lotes.
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
