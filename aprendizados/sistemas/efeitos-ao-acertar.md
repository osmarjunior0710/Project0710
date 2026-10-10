# Efeitos "ao acertar" em lista + fila (2026-10)

> Foco aberto a partir do `Feedback.md` ("Acerto com várias habilidades de 'ao acertar'"): antes, o popup de dano tinha
> 1 botão por efeito e tocar em um fechava tudo (1 efeito por acerto, o resto cortado).

## Fluxo desenhado pelo Osmar

1. O d20 acertou → se houver efeito elegível, abre uma **lista** com checkbox on/off e **tag de origem** em cada linha
   (Monge, Bárbaro, Talento, Espécie...). Sem efeito elegível, rola o dano direto.
2. O jogador marca 0..N e confirma; o dano rola. Efeito que **muda o dano** (dado extra do Ápice) entra nessa rolagem.
3. Ao fechar o dano começa a **fila** dos efeitos "depois do dano": 1 marcado abre direto; 2+ pergunta "qual primeiro?",
   resolve, volta sem o já usado, até sobrar 1 (que entra sozinho).
4. "Tipo de dano diferente do normal" é **uma linha só** na lista (Energético/Elemental do Monge, Radiante da Arma
   Sagrada); marcada, vira item da fila e abre uma janela perguntando qual tipo foi dado.
5. **Custo de Foco gasto na execução** (quando o popup do efeito abre), não ao marcar; a lista só impede marcar mais
   efeitos do que o Foco restante paga.
6. Cada ataque (Ataque Extra, Torrente) abre a lista de novo.

## Peças

- `core/efeitosAoAcertar.ts` (+ teste): tipos, Foco dos marcados, `podeMarcarEfeito`, fila (`proximoPassoDaFila`).
- `EfeitosAoAcertarModal` (lista), `EscolherProximoEfeitoModal` ("qual primeiro?"); a janela de tipo reaproveita
  `EscolherEfeitoModal`.
- `CombatTab.tsx`: `efeitosAoAcertar(ataque, desarmado, armaPrincipal)` monta a lista; `pedirEfeitosAoAcertar`,
  `rodarFilaAoAcertar`, `executarEfeitoAoAcertar` (um `aoFechar` por efeito continua a fila);
  `aoAcertarAtaqueSimples` serve Mão Secundária e Cortar. `AcaoPanelContent.tsx` chama o mesmo fluxo no Atacar.
- Entrega A: Atacar + Torrente (Atordoante, Ápice, tipo de dano, Esmagador/Talhador, Ancestralidade Gigante).
  Entrega B: Golpe Brutal (dado extra automático, efeito opcional na lista), Raízes Devastadoras, Arma Sagrada.
  Entrega C: Mão Secundária e Cortar. Magia de ataque não ganhou nada: o app não tem efeito "ao acertar" de magia.

## Bugs achados testando (vale lembrar)

- **Esmagador reaparecia no 3º golpe da Torrente**: a lista lia a prop de uma renderização velha e a marca de "usado"
  era zerada cedo demais. Solução: valor **mais recente por ref** (atualizado a cada render) + ref de "usado" que só
  zera quando o talento volta a ficar disponível. Mesma família do Golpe Atordoante 2x (ver `monge-postmortem.md`).
- **Atordoante sem Foco travava a fila**: toda ação da fila precisa chamar `aoFechar` também no caminho de desistência.

## Limites conhecidos

- Raízes Devastadoras, Golpe Brutal, Ataque Imprudente e Arma Sagrada só funcionam quando a classe é a **ativa** da
  ficha (`classeAtivaNome` = primeira classe que conjura). No Char Multiclasse isso é o Bardo, então esses efeitos não
  aparecem lá — ver `PENDENCIAS.md` "Efeitos ao acertar". Para testar, trocar o personagem de teste temporariamente.
- Golpes Radiantes (Paladino 11) continua automático (+1d8), sem linha na lista.
- Raízes e Arma Sagrada valem só pra arma da Mão Principal (a Mão Secundária não as oferece).
