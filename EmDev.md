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
enquanto). Cor do recurso (Canalizar Divindade) é temporária/qualquer
até o Osmar fechar a cor final da classe no protótipo `/prototipo`.

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
- [ ] **Entrega 2 — habilitar Paladino na criação de personagem**
  (wizard reconhece a classe, equipamento inicial via PDF, Loja)
- [ ] **Entrega 3 — os 20 níveis sem features especiais** (ASI, Ataque
  Extra, Dádiva Épica — tudo genérico já existente)
- [ ] **Entrega 4 — Magias/círculos/espaços** (Padrão B: troca 1 magia
  por Descanso Longo — mecânica nova, generalizar pra Guardião reusar
  depois)
- [ ] **Entrega 5 — Canalizar Divindade como recurso** (banco de N
  usos + Sentido Divino, `core/recursosVisiveis.ts`, cor temporária)
- [ ] **Entrega 6 — features de combate, uma por vez**: Mãos
  Consagradas → Destruição do Paladino → Estilo de Luta/Combatente
  Abençoado → Montaria Fiel → Aura de Proteção → Repudiar Inimigos →
  Aura de Coragem → Golpes Radiantes → Toque Restaurador → Aura
  Expandida
- [ ] **Entrega 7 — subclasses**, uma por vez (Devoção primeiro)
- [ ] **Entrega 8 — Multiclasse** (ligar em `conjuradorMulticlasse.ts`)
