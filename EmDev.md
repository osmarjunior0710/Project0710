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

## Foco atual: Resolver os 2 [PH] do Monge — Deslocamento + Empurrar/Imobilizar

Decidido pelo Osmar (2026-10). Teste sempre no Char Multiclasse.

- [x] **Entrega 1 — Deslocamento (motor + caixa + linha no Combate).** `core/deslocamento.ts` (função
      única, fontes com `tem`/`ativa`, ⓘ com a conta), testes, layout novo da aba Atributos (Level|PV;
      Ins. Her.|Iniciativa|Bônus Prof.; Perc. Passiva|CA|Deslocamento), linha passiva embaixo da Reação.
      Fontes ligadas: espécie + Elfo Silvestre (10,5 m), Movimento sem Armadura (Monge), Movimento Rápido
      (Bárbaro), Velocista, Dádiva da Velocidade, Forma Grande, Passo Destrutivo, penalidade de Força da
      armadura, Exaustão (hook, sempre 0). Pendente de validar com o Osmar: revisar todas as fontes (item 1.2).
- [x] **Entrega 2 — Empurrar/Imobilizar no Ataque Desarmado principal** (FEITA: toque em "Atacar — Ataque Desarmado" abre Dano/Empurrar/Imobilizar com caixas de linha contínua; Empurrar/Imobilizar gastam um dos ataques e abrem o popup de salvaguarda do alvo com CD = 8 + bônus de acerto (FOR, ou DES do Monge); `core/empurrarImobilizar.ts` + testes) (opções Dano/Empurrar/Imobilizar ao
      tocar em "Atacar — Ataque Desarmado"; CD 8 + FOR (ou DES do Monge) + prof; popup de salvaguarda do
      alvo). Só o ataque principal agora; Torrente/Ataque Adicional depois ("generalizamos").
- [x] **Entrega 3 — generalizar Empurrar/Imobilizar** (FEITA, desenho do Osmar): depois de escolher a
      Torrente/Ataque Adicional abre "Só atacar" x "Atacar, empurrar ou imobilizar". Só atacar = sequência
      direta como sempre; o outro modo pergunta Dano/Empurrar/Imobilizar antes de CADA ataque (Empurrar/
      Imobilizar gastam aquele ataque, mostram a CD e o próximo vem depois do Ok). Modo num ref (closure
      velha). `TorrenteOpcoesModal.tsx`.
- [ ] **Entrega 4 — revisar as fontes do Deslocamento** com o Osmar (item 1.2 dele) e decidir o que
      mais entra (itens mágicos dependem de um espaço de "botas" equipadas).
