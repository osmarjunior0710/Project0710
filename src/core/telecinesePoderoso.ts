// Telecinese Poderoso (Psiônico, subclasse Psicinético, nível 3) —
// "Ao conjurar Mão Mágica, seu alcance aumenta em 9 metros e a mão
// pode carregar até 9 quilos." Puramente informativo (o app não
// automatiza peso carregado pela mão) — só ajusta o alcance exibido
// de "Mãos Mágicas" e acrescenta uma nota explicando o bônus, sem
// reescrever o texto original da magia. [codeimplementation]

import type { Magia } from '../data/rulesets/dnd2024/magias';

export function temTelecinesePoderoso(nivelPsionico: number): boolean {
  return nivelPsionico >= 3;
}

/** `magia` intacta se não for "Mãos Mágicas" ou o personagem não tiver a característica —
 * senão, uma CÓPIA com `alcance` ajustado (nunca muda o catálogo global, outras classes com
 * Mãos Mágicas continuam com o alcance base). */
export function aplicarTelecinesePoderosoEmMagia(magia: Magia, temCaracteristica: boolean): Magia {
  if (!temCaracteristica || magia.nome !== 'Mãos Mágicas') return magia;
  // Nota acrescentada nas DUAS descrições (curta E completa) — o popup abre sempre na curta por
  // padrão (`MagiaComDescricao`), então só anotar a completa deixava a tela inicial contradizendo
  // o alcance já corrigido no topo (18m lá, "até 5kg" sem menção ao bônus aqui embaixo).
  const nota = ' — Telecinese Poderoso (Psicinético): alcance e distância de movimento da mão aumentam pra 18 metros; pode carregar até 9 quilos (em vez de 5).';
  return {
    ...magia,
    alcance: '18 metros',
    descricaoCompleta: `${magia.descricaoCompleta}${nota}`,
    descricaoCurta: magia.descricaoCurta ? `${magia.descricaoCurta}${nota}` : magia.descricaoCurta,
  };
}
