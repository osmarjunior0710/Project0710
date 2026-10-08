# SDD — Monge / Combatente dos Elementos

> Chapéu 2 (Game Designer) do foco "Monge — Combatente dos Elementos".
> Texto de regra: planilha, aba Subclasses (conferido contra o PDF,
> Cap. 3, pág. 164-165). Classe base: `sdd/sdd-monge.md`. O Monge só
> tem as características abaixo; sem regra solta em caixa de texto.

## 1. Mapa das 5 características

| Nível | Característica | Tipo | Como entra no app |
|---|---|---|---|
| 3 | Manipular Elementos | Passiva | Concede o truque Elementalismo (SAB). Telas Magias e Combate (CLAUDE.md 6.6). |
| 3 | Sintonia Elemental | Ativada (sem ação) | Cartão na aba Combate (Ativar gastando 1 Foco / Encerrar), mesmo padrão da Defesa Superior (toggle sem contador). 3 sub-efeitos abaixo. |
| 6 | Explosão Elemental | Ação (Usar Magia) | Item no painel de Ação, grupo Monge. 2 Foco, 3 dados de Artes Marciais, salvaguarda de DES (metade no sucesso), 5 tipos. Reaproveita `SalvaguardaDoAlvoModal` com dano já rolado. |
| 11 | Passo dos Elementos | Passiva | Só texto no cartão da Sintonia ("Natação e Voo = Deslocamento"). |
| 17 | Ápice Elemental | Passiva (com Sintonia) | 3 sub-efeitos abaixo. |

## 2. Sintonia Elemental

- **Ativar:** "no início do seu turno", 1 Foco. Duração 10 min ou até
  Incapacitado — o app não conta tempo; o jogador encerra à mão
  (igual Defesa Superior/Arma Sagrada). Persiste em
  `sintoniaElementalAtiva` (`armazenamentoPersonagens.ts`).
- **Ataques Elementais** (só com a Sintonia ativa): no popup de dano
  do Ataque Desarmado o jogador escolhe o tipo — Contundente
  (normal), Energético (Golpes Potencializados, nível 6) ou um dos 5
  elementos (Ácido/Elétrico/Gélido/Ígneo/Trovejante). Passa de 2 botões
  de tipo pra até 7 → **decisão de UI pendente da Entrega 4**: lista
  vertical já resolve (RollOverlay empilha 3+); se ficar longa demais,
  trocar por um 2º passo ("Elemental ▸ escolher"). Ao escolher um
  elemento, oferecer também o empurrão: salvaguarda de FORÇA do alvo
  (CD 8+SAB+prof, a mesma do Golpe Atordoante); falha = mover até 3 m
  pra perto/longe — texto em `SalvaguardaDoAlvoModal` (sem dano, só
  texto, igual Golpe de Escudo).
- **Extensão:** alcance do Ataque Desarmado +3 m. O app não calcula
  alcance → só aviso no cartão e no texto do ataque.
- **Interação com Golpes Potencializados (base, nível 6):** os dois
  mudam o TIPO do dano do Ataque Desarmado; com a Sintonia ativa a
  escolha é uma só (um tipo por ataque). Energético e os 5 elementos
  são opções do mesmo popup.
- **Interação com Defesa Superior:** independentes (cartões separados).
- **Interação com Torrente de Golpes:** cada ataque da Torrente é um
  Ataque Desarmado → todos oferecem os tipos elementais.

## 3. Explosão Elemental (nível 6)

- É uma ação **Usar Magia** (ocupa a Ação), mas não é magia do
  catálogo — não aparece em "Usar Magia" das magias e não usa espaço.
  Fica como linha própria no grupo Monge do painel de Ação.
- Custo 2 Foco. Escolhe o tipo (5), rola 3 × dado de Artes Marciais
  (sem modificador), abre o `SalvaguardaDoAlvoModal` (DES): Falha =
  dano total, Sucesso = metade (a metade já calculada no texto).
  CD = 8 + SAB + prof (CD de Foco).
- Esfera de 6 m a até 36 m — só texto no modal.

## 4. Ápice Elemental (nível 17) — 3 partes, só com a Sintonia ativa

1. **Golpes Potencializados (do Ápice):** 1x por turno, +1 dado de Artes
   Marciais de dano extra, mesmo tipo do ataque, no popup de dano do
   Ataque Desarmado. Precisa de flag de "1x por turno" (usar `useRef`
   além do estado — lição do Golpe Atordoante na Torrente) que reseta no
   Fim do Turno.
2. **Passo Destrutivo:** ao usar o Passo do Vento com a Sintonia ativa:
   +6 m de Deslocamento e dano de 1 dado de Artes Marciais por criatura
   (tipo à escolha entre 5), 1x por criatura por turno. Aviso no
   popup/feedback do Passo do Vento + botão pra rolar o dado.
3. **Resistência a Dano:** escolhe 1 entre 5 tipos; trocável no início
   de cada turno. Estado `resistenciaApiceElemental` (tipo atual) com
   seletor no cartão da Sintonia; o app só mostra (não calcula dano
   recebido).

## 5. Pontos abertos / limites conhecidos

- O app não rastreia condições, alcance, nem Deslocamento de natação/voo
  — tudo vira texto/aviso (mesmo tratamento do Monge base).
- Elementalismo é só utilidade (sem rolagem de dano) — no Combate vira
  linha de "Usar Magia" como qualquer truque utilitário.
- SAB como atributo de conjuração: nenhuma classe implementada conjura
  com SAB; Entrega 2 precisa checar onde o app lê o atributo de
  conjuração por classe e abrir exceção pra "magia concedida por
  subclasse" (padrão do Mago/Evocador).
