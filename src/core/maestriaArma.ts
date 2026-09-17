// Maestria em Arma (Guerreiro, nível 1) — Entrega B2 do plano
// "Guerreiro 1-20" (ver DECISOES-DESIGN.md). O nº de tipos de arma com
// Maestria vem do recurso "Maestria em Arma" da classe (`classes.ts`),
// não é uma constante fixa — outras classes que ganharem esse recurso
// no futuro funcionam sem mudar código aqui.

import { armas, type Arma } from '../data/rulesets/dnd2024/armas';
import { proficienciasArmaArmaduraClasse } from '../data/rulesets/dnd2024/proficienciasArmaArmaduraClasse';
import type { Classe } from '../data/rulesets/dnd2024/classes';
import { valorRecursoClasse } from './recursosClasse';
import { classeProficienteComArma } from './proficienciaArma';

export function quantidadeMaestriaEmArma(classe: Classe, nivel: number): number {
  return valorRecursoClasse(classe, 'Maestria em Arma', nivel);
}

/** Armas elegíveis pra Maestria — qualquer arma que a classe tenha
 * proficiência. Cobre o caso do Guerreiro ("Armas Simples e Marciais"
 * = catálogo inteiro, sem restrição de alcance); classes com
 * proficiência restrita (ex: Ladino, só Acuidade/Leve) ainda não têm
 * o recurso "Maestria em Arma" em `classes.ts`, então o filtro fino
 * fica pra quando isso aparecer de verdade — ver PENDENCIAS.md.
 *
 * Bárbaro tem a MESMA proficiência ampla ("Armas Simples e Marciais"),
 * mas o texto da própria característica restringe a Corpo a Corpo
 * ("dois tipos de armas Corpo a Corpo Simples ou Marciais") — livro
 * confirma. Filtrado aqui por nome de classe (só essa exceção existe
 * hoje); se aparecer uma 3ª classe com restrição diferente, vira um
 * campo próprio em vez de mais um `if`. */
export function armasParaMaestria(classe: Classe): Arma[] {
  const prof = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
  if (prof?.proficienciaArmas !== 'Armas Simples e Marciais') return [];
  if (classe.nome === 'Bárbaro') return armas.filter((a) => a.categoria.includes('Corpo a Corpo'));
  return armas;
}

/** Pool de armas elegíveis pro slot EXTRA de Maestria do talento
 * Mestre das Armas — livro (p.206): "arma Simples ou Marcial à sua
 * escolha, desde que você tenha proficiência com ela". Diferente de
 * `armasParaMaestria()` (que só cobre a categoria ampla nativa do
 * Guerreiro/Bárbaro): aqui qualquer arma que a PROFICIÊNCIA real do
 * personagem cubra conta, incluindo proficiência restrita (Ladino,
 * Monge) e a somada por talento (Treinamento com Armas Marciais) —
 * ver `core/proficienciaArma.ts` (`classeProficienteComArma`). */
export function armasElegiveisParaMaestriaExtra(classe: Classe, talentosAtuais?: string[]): Arma[] {
  return armas.filter((a) => classeProficienteComArma(classe, a, talentosAtuais));
}
