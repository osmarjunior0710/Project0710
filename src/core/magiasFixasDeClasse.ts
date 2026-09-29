import type { Classe } from '../data/rulesets/dnd2024/classes';
import { caracteristicasClasse } from '../data/rulesets/dnd2024/caracteristicasClasse';

export interface MagiaFixaDeClasse {
  nomeMagia: string;
  usosGratisPorDescansoLongo: number;
}

/** Magias "sempre preparadas" concedidas por características de CLASSE
 * BASE (não subclasse — pra isso ver `magiasPactoDoInfero.ts`), já
 * desbloqueadas no nível atual — genérico, lê `magiaFixaConcedida` de
 * QUALQUER característica da classe (Destruição do Paladino, Montaria
 * Fiel, e a próxima classe que precisar do mesmo padrão). Ver
 * DECISOES-CLASSES.md. */
export function magiasFixasDaClasseBase(classe: Classe | null, nivel: number): MagiaFixaDeClasse[] {
  if (!classe) return [];
  return caracteristicasClasse
    .filter((c) => c.classe === classe.nome && c.nivel <= nivel && c.magiaFixaConcedida)
    .map((c) => c.magiaFixaConcedida!);
}

/** Círculo em que `nomeMagia` conjura de graça agora (sempre o círculo
 * BASE da magia — o uso grátis nunca faz upcast) via `magiaFixaConcedida`
 * de classe base, ou `null` se não for uma dessas magias ou já não tiver
 * mais uso grátis. Mesmo padrão de `circuloGratisAssinatura`/
 * `circuloGratisMaestria` (Mago) — reaproveitado pelo mesmo callback
 * `onUsarMagiaGratisDeClasse` na hora de conjurar. */
export function circuloGratisMagiaFixaDeClasse(
  nomeMagia: string,
  circuloBaseDaMagia: number,
  atuais: MagiaFixaDeClasse[],
  gastas: Record<string, number>,
): number | null {
  const entrada = atuais.find((m) => m.nomeMagia === nomeMagia);
  if (!entrada) return null;
  const gastoAtual = gastas[nomeMagia] ?? 0;
  if (gastoAtual >= entrada.usosGratisPorDescansoLongo) return null;
  return circuloBaseDaMagia;
}
