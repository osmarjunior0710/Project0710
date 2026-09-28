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
- [ ] **Entrega 5 — Canalizar Divindade como recurso** (banco de N
  usos + Sentido Divino, `core/recursosVisiveis.ts`, cor temporária)
- [ ] **Entrega 6 — features de combate, uma por vez**: Mãos
  Consagradas → Destruição do Paladino → Estilo de Luta/Combatente
  Abençoado → Montaria Fiel → Aura de Proteção → Repudiar Inimigos →
  Aura de Coragem → Golpes Radiantes → Toque Restaurador → Aura
  Expandida
- [ ] **Entrega 7 — subclasses**, uma por vez (Devoção primeiro)
- [ ] **Entrega 8 — Multiclasse** (ligar em `conjuradorMulticlasse.ts`)
