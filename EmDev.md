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
      a âncora interna `classeAtivaNome`.** Bug estrutural que afeta
      qualquer combo de multiclasse com atributos de conjuração
      diferentes (ex.: Mago/Bardo). **Nenhum pill/seletor de UI foi
      reintroduzido** — o pill de escolher classe continua removido
      desde a Entrega 5f (ver `DECISOES-CLASSES.md` "Multiclasse — sem
      seletor de classe na tela"); `classeAtivaNome` é só a âncora
      automática (1ª classe que conjura) que já existia, usada aqui só
      como FALLBACK pras poucas fontes de magia sem classe dona
      conhecida (espécie/talento — gap à parte, fora de escopo). Antes,
      todo cast (Combate E aba Magias) usava sempre essa âncora, não
      importa de qual classe a magia realmente era — agora resolve pela
      tag de classe que a própria magia já carrega (a mesma que já
      aparece como pill de INFORMAÇÃO em cada linha — exibição, não
      seletor), usando o resumo por classe que a Entrega 5c já calculava
      (até então só exibido, nunca consumido no cast de verdade). Nova
      função pura testável `modAcertoConjuracaoPorClasse`
      (`core/magiasPersonagem.ts`). Corrigido em 10 arquivos — todos os
      pontos onde a classe da magia era descartada antes de chegar no
      cast (`SelecionarMagiaShell`, `useUsarMagiaPainel`,
      `ReacaoPanelContent`, `MagiasTab` — 9 seções distintas cada uma
      com sua classe correta).
      Validado ao vivo com personagem de teste Mago 5/Bardo 5 (INT 20/
      CAR 20→14 pra divergir os mods): conjurar o truque do Mago usa
      +9 (INT), conjurar o truque do Bardo usa +6 (CAR), mesmo com a
      âncora interna calculando "Bardo" — confirmado tanto no Combate
      quanto na aba Magias. `npx tsc -b`, `npm test -- --run`
      (851/851), `npm run build` verdes.
- [ ] **Entrega 2 — live-test de combos de multiclasse do Paladino**
      especificamente (matemática de Espaços de Magia combinados —
      classificação de meio-conjurador já existe em
      `conjuradorMulticlasse.ts`, nunca testada na tela).
- [ ] **Entrega 3 — conflito da pergunta de Descanso Longo** quando
      Paladino e Mago estão no mesmo personagem: hoje só pergunta sobre
      redefinir o Livro de Magias do Mago, pulando silenciosamente a
      troca de 1 magia do Paladino.
