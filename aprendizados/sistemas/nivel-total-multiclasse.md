# Nível total vs. nível da classe na multiclasse (2026-10)

> Disparo: o mestre do Osmar disse que o truque escala pela "soma do nível de conjurador". Li o PDF (`npm run pdf`, Cap. 2
> Multiclasse, p.13-14) em vez de responder de memória.

## O que o livro diz

- **Truques:** "o aumento é baseado no seu nível total de personagem, não no nível em uma classe específica, a menos que a
  magia indique o contrário." Nenhuma magia importada indica o contrário.
- **Espaços de Magia:** é a soma dos níveis de CONJURADOR (Bardo/Clérigo/Druida/Feiticeiro/Mago inteiros; Guardião/Paladino
  metade, arredondado pra CIMA; Guerreiro/Ladino um terço, pra baixo, só com Cavaleiro Místico/Trapaceiro Arcano), consultada
  na tabela Conjurador Multiclasse. As duas frases do mestre e do livro valem, cada uma pra uma coisa.

## O que foi feito

- **Auditoria (só leitura):** a tabela do pool combinado (20 linhas) e a soma dos níveis já estavam certas. Único defeito: um
  comentário em `data/.../multiclasse.ts` dizia "pra baixo" pro meio-conjurador (corrigido pra "pra cima").
- **Dano/cura/prévia de magia** (Magias, Combate, Reação, escolha de círculo): passam o nível TOTAL (`nivelTotalAtual`). Na aba
  Magias há 2 props: `nivel` (classe em foco, só pro pool de espaços) e `nivelPersonagem` (total). Teste:
  `magiaDano.test.ts` (Mago 3 / Bárbaro 3 = nível 6 → Chama Sagrada 2d8; marcos 5/11/17).
- **Caixa "Level"** da aba Atributos: nível total.
- Validado em 360px com um personagem temporário Mago 3 / Bárbaro 3 (removido): Raio de Fogo 2d10 na aba Magias e no Combate,
  caixa Level = 6, espaços 4/2 (só o Mago conta, Bárbaro não).

## Padrão a lembrar

Característica que escala por nível: perguntar "isto é nível da CLASSE dona ou do PERSONAGEM?". Classe dona →
`donaDaCaracteristica(...).nivel`; personagem → `nivelTotalAtual`. Nunca `personagem.nivel` (é o da classe em foco).
Dúvida de regra: `npm run pdf`, nunca de memória.
