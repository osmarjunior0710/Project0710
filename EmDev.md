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

## Foco: efeitos "ao acertar" em fila (lista antes do dano + fila depois) — aprovado pelo Osmar em 2026-10

Origem: `Feedback.md` "Acerto com várias habilidades de 'ao acertar'". Hoje o popup de dano tem 1 botão por
efeito e tocar em um fecha tudo (1 efeito por acerto). Fluxo novo, desenhado pelo Osmar:

1. d20 acertou → se houver efeito elegível, abre a **lista** (checkbox on/off, cada linha com **tag de origem**:
   Monge, Bárbaro, Talento, Espécie...). Sem efeito elegível → segue normal, sem lista.
2. Jogador marca 0..N e confirma.
3. Rola o dano; efeito que **muda o dano** (ex.: dado extra do Ápice) já entra nessa rolagem.
4. Ao fechar o dano começa a **fila** dos efeitos "depois do dano": 1 marcado → abre o popup direto; 2+ →
   pergunta "qual primeiro?", abre, volta sem o já usado, até sobrar 1 (entra sozinho).
5. **Tipo de dano diferente do normal** = UMA linha checkbox na lista ("Tipo de dano diferente do normal");
   se marcada, vira item da fila e abre uma janela perguntando qual tipo foi dado (Elemental leva ao modal de
   elemento que já existe). Desmarcada = tipo normal da arma.
6. **Custo de Foco gasto na EXECUÇÃO** (quando o popup do efeito abre), não ao marcar; a lista bloqueia marcar
   mais efeitos do que o Foco restante paga.
7. Cada ataque (Ataque Extra, Torrente) abre a lista de novo; "1x por turno" respeita o `useRef`.

Tipos de efeito: **dano** (entra na rolagem; fora da fila), **tipo de dano** (1 linha, janela), **depois do dano**
(fila).

### Entregas
- [x] **A — núcleo + Ataque Desarmado do Monge** (Atordoante, Ápice, Elemental/Energético): `core/efeitosAoAcertar.ts`
  (+ teste), modal da lista, modal "qual primeiro?", ligado no Atacar principal e na Torrente. Entrou junto, por
  usar o mesmo fluxo: Esmagador/Talhador e Ancestralidade Gigante (Golias) em qualquer ataque. Testado no Char
  Multiclasse em 360px, incluindo 1º/2º/3º golpe da Torrente (achou e corrigiu o Esmagador reaparecendo no 3º golpe).
  Falta testar em 412px.
- [x] **B — o que sobrou das armas**: Raízes Devastadoras (linha da lista + escolha Derrubar/Empurrar encadeada na fila),
  Arma Sagrada (vira o "Tipo de dano diferente do normal" com Radiante), Golpe Brutal (dado extra automático; efeito
  vira linha opcional). O fluxo antigo de botões no popup de dano saiu do Atacar principal. Testado em 360px com
  Bárbaro (Golpe Brutal + Esmagador, Raízes + Esmagador) e Paladino (Arma Sagrada) — personagem de teste trocado
  temporariamente e restaurado. Golpes Radiantes segue automático. Sobrou: apagar `EfeitosDoGolpeModal` e o estado
  `efeitosDoGolpePendentes` (código morto), na limpeza final.
- [ ] **C — ataque bônus, Torrente restante e magias de ataque**, se fizer sentido.
- [ ] Fechar: `aprendizados/sistemas/efeitos-ao-acertar.md`, padrão em `DECISOES-COMBATE.md`, limpar o item do `Feedback.md`.
