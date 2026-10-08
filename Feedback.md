# Feedback.md

> Lista de bugs/melhorias que o Osmar aponta testando na tela, mas
> que não são corrigidos na hora — fica pra decidir prioridade
> depois, junto com ele. Diferente de `PENDENCIAS.md` (coisas que o
> Claude Code adia de propósito por decisão técnica) — esta lista é
> alimentada pelo Osmar testando o app. Ver seção 15 do `CLAUDE.md`
> pra regra completa.
>
> Ao resolver um item, apaga daqui. Se a correção também for uma
> decisão de design não óbvia, registra no arquivo `DECISOES-*.md`
> certo (ver índice em `DECISOES-DESIGN.md`).

---

## Acerto com várias habilidades de "ao acertar" — junta tudo ou só 1? (2026-10, Osmar, a rever)

**Dúvida do Osmar:** num personagem multiclasse (ex.: o Char Multiclasse) que
acumula várias habilidades ativáveis ao acertar um ataque (Golpe Atordoante,
Ataques Elementais, Golpes Potencializados, Esmagador/Talhador, Golpe Brutal,
Golpes Radiantes/Arma Sagrada...), o que deveria acontecer — todas juntas no mesmo
acerto, ou só uma por vez?

**Como está hoje (resposta curta):** só **uma por acerto**. O popup de dano mostra
um botão por habilidade e tocar em qualquer um fecha o popup e dispara só aquele
efeito. Pelas regras, a maioria dessas habilidades vem de características
diferentes e PODE somar no mesmo acerto (ex.: escolher o tipo de dano elemental E
gastar Foco no Golpe Atordoante; ou Punição + Esmagador), exceto onde a própria
regra limita (1x por turno, "em vez de" outro efeito etc.). Então a UI atual
corta combinações legais.

**A decidir com o Osmar:** deixar o popup escolher vários antes de fechar (botões
viram "liga/desliga" + um botão "Confirmar", cada um ainda respeitando o próprio
limite — 1x por turno, custo de Foco/uso) vs manter 1 por acerto. Levantar também
quais pares são mutuamente exclusivos de verdade (ex.: tipo de dano: Contundente/
Energético/elemento é UM só por ataque). Teste sempre no Char Multiclasse.
