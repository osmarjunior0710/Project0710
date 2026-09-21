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

## Foco: Melhorias e correções

Lista do Osmar (2026-09-21), feita um a um, na ordem abaixo. Antes de
começar cada item, perguntar ao Osmar o que exatamente ele é (escopo,
onde fica na tela), depois seguir o ciclo normal (proposta → ok →
código).

- [x] Botão no perfil de "House Rules", que contém todos os switchers de opção de regra do tipo house rule
- [x] House rule: confirmação de crítico — **FEITO (A, B e C)**; histórico: protótipo publicado (`/prototipo/confirmacao-critico`), protótipo APROVADO. Plano em 3 entregas: **A** crítico padrão nos ataques de arma (`onAcertou({critico})`, `core/danoCritico.ts`) — [x] feita; **B** mesmo crítico nos ataques de magia (`useUsarMagiaPainel`, `MagiasTab`, `ReacaoPanelContent`, `CombatTab` magia) — [ ]; **C** switcher da house rule no painel House Rules + 2º d20 real no overlay (lê `armazenamentoHouseRules`) — [ ]. Perfurador (+1 dado no crítico) fica de fora (Backlog). Regras já decididas: só ataque (perícia nunca tem 2º d20); 1 natural = "Errei" (nada acontece) ou "Rolar Dano" (dano normal, sem dobra); 20 natural sem house rule = só "Rolar Dobro do Dano" (dobro de DADOS, mod 1x); 20 com house rule = 2º d20 só informativo, depois "Rolar Dano" / "Rolar Dano Dobrado"
- [ ] Recurso principal da classe visível na tela de combate
- [x] FAB para descanso curto/longo
- [x] Dado de cura no descanso curto (não foi trazido da ficha do jogo)
- [x] Animação de dano/cura na barra de vida (+ botão Manual de PV)
- [x] Revisão do botão de XP para mostrar progresso circular
- [x] Informações de CD, bônus de ataque de magia e afins na tela de Magias
- [x] Coin bag manager (mostrar, usar e adicionar moedas) + house rule de contar ou não o peso da moeda
- [ ] **Bug:** no painel de Reação, magias (ex.: Escudo Arcano 1º círculo, Contramagia 3º círculo) aparecem como ativas mesmo sem espaço de magia disponível do círculo — o aviso vermelho "Sem espaço de magia de 1º círculo disponível" aparece, mas as opções não ficam desabilitadas/cinza (ver `ReacaoPanelContent.tsx`)
- [ ] **Rever toda a integração de Multiclasse com a Ficha/Combate** — tudo foi montado pensando em UMA classe por vez ("classe ativa" via pill `classeAtivaNome`, ~70 pontos que leem nível/subclasse da classe em foco, ver `DECISOES-CLASSES.md` "Multiclasse — nível na classe ativa"). Em combate o personagem É as duas classes ao mesmo tempo: com o pill em Mago, recursos/magias do Bardo somem da tela de Combate/Magias e é preciso trocar o pill pra usar. Direção discutida (ainda sem decisão): mostrar as duas classes juntas (blocos por classe em Combate e Magias), pill vira atalho ou some, cabeçalho mantém o texto "Mago 18 / Bardo 3". É um foco à parte (grande), a abrir com os chapéus de PM/Game Designer/UI (seção 6 do CLAUDE.md), não um retoque.

Nota: itens 1 e 2 e o último dependem do mesmo mecanismo de house
rules — conferir a ordem de construção ao abrir o item 1.
