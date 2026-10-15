import { avaliarTrocaMenteAgucada } from '../../core/menteAgucada';
import type { OfertaTrocaDeDado } from './RollContext';

/** Monta `OfertaTrocaDeDado` (Mente Aguçada, "Modo de Ataque") pra passar
 * em `rolarDados` — reaproveitado nos 5 pontos onde dano Psíquico pode
 * rolar (Magias/Combate/Reação × Salvaguarda/Ataque, + Pensamentos
 * Destrutivos). `undefined` quando a disciplina nem está ativa ou o dano
 * não é Psíquico — nesses casos `rolarDados` simplesmente não recebe a
 * opção, popup normal sem nada extra. `onTrocado` (recebe o NOVO total)
 * deixa quem chama travar o "1x por turno" fora do popup E corrigir
 * qualquer total capturado ANTES da troca (ex.: `totalRolado` de
 * `abrirSalvaguarda`, que só é lido DEPOIS que o jogador fecha o popup —
 * sem isso, uma troca feita depois do `onResultado` inicial nunca
 * chegaria no total usado pela tela seguinte). */
export function ofertaMenteAgucada(
  tipoDano: string | null | undefined,
  ativa: boolean,
  anotado: number | null,
  usadoNesteTurno: boolean,
  onTrocado: (novoTotal: number) => void,
): OfertaTrocaDeDado | undefined {
  if (!ativa || tipoDano !== 'Psíquico') return undefined;
  return {
    titulo: '🧠 Mente Aguçada',
    avaliar: (estado) =>
      avaliarTrocaMenteAgucada({ tipoDano, ativa, anotado, usadoNesteTurno, dadosIndividuais: estado.dadosIndividuais }),
    onTrocado,
  };
}
