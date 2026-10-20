// Telecinese Intensificada (Psiônico, subclasse Psicinético, nível 14) — "Você pode conjurar
// Telecinese sem gastar um Espaço de Magia, gastando em vez disso 4 Dados de Energia Psiônica.
// Quando conjura Telecinese dessa forma, pode modificar a magia para que ela não exija
// Concentração. Se fizer isso, a duração da magia passa a ser 1 minuto para essa conjuração, e
// você pode ter como alvo criaturas e objetos Colossais." Os 4 Dados de Energia são gastos nos
// 2 jeitos de conjurar (a escolha "sem Concentração" é de graça, não custa mais nada). [codeimplementation]

export function podeConjurarTelecineseIntensificada(disponivel: boolean, dadosRestantes: number): boolean {
  return disponivel && dadosRestantes >= 4;
}

/** Igual `circuloGratisMagiaFixaDeClasse`/`circuloGratisMaestria` em formato (devolve o círculo
 * BASE da magia quando elegível, `null` quando não) — só vale pra "Telecinese" especificamente,
 * nunca pra outra magia, mesmo com a característica e dados disponíveis. */
export function circuloGratisTelecineseIntensificada(
  nomeMagia: string,
  circuloBaseDaMagia: number,
  disponivel: boolean,
  dadosRestantes: number,
): number | null {
  if (nomeMagia !== 'Telecinese') return null;
  return podeConjurarTelecineseIntensificada(disponivel, dadosRestantes) ? circuloBaseDaMagia : null;
}

/** Nota mostrada como `aviso` no popup de Salvaguarda (mesmo campo genérico já usado por
 * Esmagamento Telecinético Aprimorado/Disciplinas Psiônicas) quando o jogador escolhe a versão
 * "sem Concentração" — a tela de Salvaguarda não tem onde mostrar a descrição completa da magia
 * (só diz "veja a descrição (ⓘ)", que lê o catálogo global, não uma cópia modificada), então o
 * aviso é o único jeito confiável de avisar a mudança nesta conjuração específica. */
export const AVISO_TELECINESE_INTENSIFICADA_SEM_CONCENTRACAO =
  'Telecinese Intensificada (sem Concentração): esta conjuração não exige Concentração, dura 1 minuto, e você pode ter como alvo criaturas e objetos Colossais (em vez de Enorme ou menor).';
