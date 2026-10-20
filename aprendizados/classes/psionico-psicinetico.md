# Psiônico — Psicinético (subclasse, UA 2025, não oficial)

Foco fechado em 2026-10. Fonte e quebra: `sdd/sdd-psionico.md` (seção "Subclasses", de-para das
10 magias da subclasse já confirmado contra o catálogo). As 7 características da subclasse (lista
exaustiva do SDD: Magias do Psicinético · Técnicas Telecinéticas · Telecinese Poderoso · Transe
Destrutivo · Campo de Rebatimento · Esmagamento Telecinético Aprimorado · Telecinese
Intensificada) estão 100% implementadas — ver `EmDev.md` E6c-a a E6c-g pro detalhe técnico de cada
entrega. Este arquivo guarda o histórico de construção e as lições que não couberam no changelog
de cada entrega.

## Ordem das entregas e por quê

Primeiro as magias sempre preparadas (E6c-a, dado puro, zero mecânica nova) pra destravar o resto;
depois as características de nível baixo pra alto (3 → 14), sempre reaproveitando o padrão mais
parecido já existente em vez de inventar um novo (Impulso Telecinético/Retaliação Psíquica pra
Técnicas Telecinéticas/Campo de Rebatimento; Sobrecarga do Evocador pra Esmagamento Aprimorado;
Maestria de Magias pra Telecinese Intensificada). Nenhuma delas precisou de mecânica genuinamente
nova no motor — todas são variações de algo que o Psiônico (ou outra classe) já tinha.

## Bug pré-existente achado no caminho (E6c-a.1)

Depois de ligar a subclasse Psicinético no Char Multiclasse, o botão de Voltar da Ficha parou de
responder ao toque — "Maximum update depth exceeded" no console. Não era bug da subclasse em si:
`reservaDadosDeVida` (`FichaShell.tsx`) nascia como array NOVO a cada render (sem `useMemo`); os
`useEffect` de Surto Psiônico/Força Vital Incandescente (já publicados antes) dependem dele e
chamam `registrarSurtoPsionico`/`registrarForcaVitalIncandescente` com objeto novo sempre —
`setState` no `RollContext` re-renderiza a Ficha, que recria o array, que dispara o efeito de novo:
loop infinito. Só não tinha sido percebido porque ninguém tinha Psiônico nível 7+ E a aba Magias
visitada ao mesmo tempo antes. Corrigido memoizando `reservaDadosDeVida` pelas 2 entradas reais
(`classesAtual`, `dadosDeVidaGastos`).

## Bug de dado desatualizado achado no caminho (E6c-e)

A magia "Esmagamento Telecinético" já importada tinha `danoBaseTipo: "Energético"` enquanto a
própria `descricaoCompleta` dizia "dano de Força" duas vezes — divergência real entre dado
importado e a fonte (CLAUDE.md §3). Corrigido em `magiasPsionico.ts` com aprovação do Osmar na
mesma entrega.

## Convenção de cor de botão nasceu no meio deste foco (E6c-e/E6c-f)

O popup de Esmagamento Telecinético Aprimorado ("Rolar Dano Normal" azul/destacado vs. "Gastar 1
Dado de Energia" cinza, parecendo desativado mesmo sendo válido) foi o gatilho pra uma convenção
nova de verdade (ver `CONVENCOES-UI.md` "Cores de botão" e `DECISOES-CLASSES.md`/
`Backlog.md` "Auditoria de cor de botão por classe"): azul = ação comum padrão; cinza médio
contínuo = fechar; cinza claro serrilhado = desativado; cor da classe = opção que gasta/representa
um recurso daquela classe. Aplicado retroativamente nos 3 popups Psiônico-exclusivos existentes
na hora (`EsmagamentoAprimoradoEscolha`, `ImpulsoTelecineticoModal`, `DisciplinaPosConjuracaoModal`)
— o Mago (`SobrecargaEscolha`) tem o mesmo problema, registrado no Backlog pra depois.

## Transe Destrutivo (E6c-f) — 2 partes bem separadas

Regra tem 2 efeitos independentes que é fácil misturar numa proposta só: (A) ativar gastando 1
Dado de Energia Psiônica (igual Defesa Psiônica — sem rolar nada, 10 minutos, encerramento manual
+ auto no Descanso Curto/Longo, igual Mente Aguçada); (B) enquanto ativo, rolar 1 Dado de Energia
GRÁTIS (sem gastar) e somar ao dano de QUALQUER magia conjurada com Espaço — infraestrutura nova
no `RollContext` (`TranseDestrutivoProvider`), mas BEM mais simples que Força Vital Incandescente
porque não tem `gastar`/`maximo`/trava de "1x por turno" (a regra não menciona nenhuma). O rótulo
"(grátis)" no card da oferta foi pedido explícito do Osmar — sem ele o jogador confundia com
Esmagamento Aprimorado, que gasta de verdade.

## Telecinese Intensificada (E6c-g) — achada por auditoria, não por pedido

Ao fechar o foco, a lista de "7 características" do SDD apontou 1 a mais do que tinha sido
implementado até então (6) — mesma lição do postmortem do Mago (seção 6.1.1 do CLAUDE.md): nunca
considerar uma subclasse "pronta" sem reconferir a lista exaustiva contra o que foi de fato
codificado. Ver `DECISOES-CLASSES.md` "Conjurar uma magia específica sem gastar Espaço..." pro
padrão técnico generalizável que essa entrega deixou (reaproveitar o encadeamento `circuloGratis`
+ usar o campo `aviso` em vez de tentar modificar o objeto `Magia` em trânsito, que a tela de
Salvaguarda não mostra em lugar nenhum).

## Pendências

Nenhuma — as 7 características têm mecânica real (`statusImplementacao: 'codeimplementation'` em
todas, nenhuma `placeholder-*`). O que ficou de propósito fora deste foco (botão de cor por classe
nas outras 3 subclasses/Mago, nome de função com prefixo de classe) está em `Backlog.md`, não aqui
— é "dá pra fazer, não é a hora", não trava nada.
