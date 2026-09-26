// Pills configuráveis de info da magia (ver Backlog.md "Pills configuráveis
// de info da magia", 2026-09-24, e `aprendizados/sistemas/multiclasse.md`).
// Extrai resumos curtos de campos que hoje são texto livre na planilha
// (`tempoConjuracao`, `duracao`, `componentes`) — os outros campos usados
// como pill (`circulo`, `classes`, `escola`, `alcance`,
// `ataqueOuSalvaguarda`) já são curtos/estruturados o suficiente pra
// exibir direto, sem extração.

/** "Ação Bônus"/"Reação" cobrem qualquer variante com texto de gatilho
 * longo (ex.: "Ação Bônus, que você realiza imediatamente após..."); o
 * resto vira o tempo fixo abreviado (ex.: "1 hora ou Ritual" → "1h",
 * ignorando o "ou Ritual" — Ritual não é uma das categorias de pill). A
 * única magia com 2 modos ("Ação (Crescimento Excessivo) ou 8 horas
 * (Fertilização)") cai em "Ação" pela regra de "começa com 'Ação ('". */
export function resumoTipoAcao(tempoConjuracao: string | null): string | null {
  if (!tempoConjuracao) return null;
  if (tempoConjuracao.startsWith('Ação Bônus')) return 'Ação Bônus';
  if (tempoConjuracao.startsWith('Reação')) return 'Reação';
  if (
    tempoConjuracao === 'Ação' ||
    tempoConjuracao === 'Uma ação' ||
    tempoConjuracao.startsWith('Ação ou') ||
    tempoConjuracao.startsWith('Ação (')
  ) {
    return 'Ação';
  }
  const primeiraParte = tempoConjuracao.split(' ou ')[0].trim();
  return abreviarTempo(primeiraParte);
}

/** "Instantânea"/"Especial" ficam como estão; "Até X" e "Concentração,
 * até X" abreviam o tempo e mantêm o prefixo curto ("Até 1h"/"Conc.
 * 1h"); tempo fixo puro (sem "Até"/"Concentração") abrevia direto. */
export function resumoDuracao(duracao: string | null): string | null {
  if (!duracao) return null;
  if (duracao === 'Instantânea') return 'Instantânea';
  if (duracao === 'Especial') return 'Especial';
  if (duracao.startsWith('Até ser dissipada')) return 'Até dissipar';
  if (duracao.startsWith('Concentração, até ')) {
    const resto = duracao.slice('Concentração, até '.length);
    return `Conc. ${abreviarTempo(resto)}`;
  }
  if (duracao.startsWith('Até ')) {
    const resto = duracao.slice('Até '.length);
    return `Até ${abreviarTempo(resto)}`;
  }
  return abreviarTempo(duracao);
}

/** "1 hora"→"1h", "1 minuto"→"1min", "10 minutos"→"10min" — hora/minuto
 * abreviam porque aparecem muito e sobram poucos caracteres na pill; dia/
 * rodada ficam como estão (não tem abreviação óbvia e aparecem pouco). */
function abreviarTempo(texto: string): string {
  const match = texto.match(/^(\d+)\s+(\p{L}+)/u);
  if (!match) return texto;
  const [, numero, unidade] = match;
  const unidadeMin = unidade.toLowerCase();
  if (unidadeMin.startsWith('hora')) return `${numero}h`;
  if (unidadeMin.startsWith('minuto')) return `${numero}min`;
  return `${numero} ${unidade}`;
}

export interface ComponentesVSM {
  v: boolean;
  s: boolean;
  m: boolean;
}

/** `componentes` hoje é 1 texto só ("V, S, M (uma pitada de sal)", "S, M
 * (um fio de cobre)", etc, incluindo alguns com sufixo "+N" residual da
 * planilha, ex.: "V, S +2") — separa em 3 booleans independentes pra
 * virar 3 pills (V/S/M). */
export function componentesVSM(componentes: string | null): ComponentesVSM {
  if (!componentes) return { v: false, s: false, m: false };
  const partes = componentes.split(',').map((p) => p.trim());
  const temLetra = (letra: 'V' | 'S' | 'M') =>
    partes.some((parte) => parte === letra || parte.startsWith(`${letra} `) || parte.startsWith(`${letra}(`));
  return { v: temLetra('V'), s: temLetra('S'), m: temLetra('M') };
}
