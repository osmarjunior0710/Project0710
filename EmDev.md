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

## Foco atual: Multiclasse — acertos deixados pra trás

Surgiu da pergunta "o que faltou do multiclasse?" depois de fechar o
foco Paladino. 3 entregas aprovadas pelo Osmar, nesta ordem:

- [x] **Entrega 1 — acerto/CD de magia usa a classe DONA da magia, não
      a classe ativa (pill).** Bug estrutural que afeta qualquer combo
      de multiclasse com atributos de conjuração diferentes (ex.:
      Mago/Bardo). Antes, todo cast (Combate E aba Magias) usava só 1
      número fixo (`modAcertoConjuracao`, calculado a partir da classe
      ativa) — agora resolve pela classe que realmente concede a magia
      sendo conjurada, usando o resumo por classe que a Entrega 5c já
      calculava (até então só exibido, nunca consumido no cast de
      verdade). Nova função pura testável
      `modAcertoConjuracaoPorClasse` (`core/magiasPersonagem.ts`).
      Corrigido em 10 arquivos — todos os pontos onde a classe da magia
      era descartada antes de chegar no cast (`SelecionarMagiaShell`,
      `useUsarMagiaPainel`, `ReacaoPanelContent`, `MagiasTab` — 9
      seções distintas cada uma com sua classe correta). Fontes de
      magia de espécie/talento (sem classe dona, gap à parte, fora de
      escopo) continuam no fallback antigo de propósito.
      Validado ao vivo com personagem de teste Mago 5/Bardo 5 (INT 20/
      CAR 20→14 pra divergir os mods): conjurar o truque do Mago usa
      +9 (INT), conjurar o truque do Bardo usa +6 (CAR), mesmo com
      Bardo como classe ativa — confirmado tanto no Combate quanto na
      aba Magias. `npx tsc -b`, `npm test -- --run` (851/851),
      `npm run build` verdes.
- [ ] **Entrega 2 — live-test de combos de multiclasse do Paladino**
      especificamente (matemática de Espaços de Magia combinados —
      classificação de meio-conjurador já existe em
      `conjuradorMulticlasse.ts`, nunca testada na tela).
- [ ] **Entrega 3 — conflito da pergunta de Descanso Longo** quando
      Paladino e Mago estão no mesmo personagem: hoje só pergunta sobre
      redefinir o Livro de Magias do Mago, pulando silenciosamente a
      troca de 1 magia do Paladino.
