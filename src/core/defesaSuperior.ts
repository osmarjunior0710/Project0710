// Defesa Superior (Monge, nível 18) — "No início do seu turno, você pode
// gastar 3 Pontos de Foco para se fortalecer contra danos por 1 minuto ou
// até ter a condição Incapacitado. Durante esse período, você tem
// Resistência a todos os tipos de dano, exceto Energético."
// Toggle sem contador de tempo (mesmo padrão de Arma Sagrada/Resplendor
// Sagrado); o jogador encerra à mão. [codeimplementation]

export const CUSTO_FOCO_DEFESA_SUPERIOR = 3;

export function temDefesaSuperior(nivelMonge: number): boolean {
  return nivelMonge >= 18;
}

export function podeAtivarDefesaSuperior(nivelMonge: number, pontosDeFocoRestantes: number): boolean {
  return temDefesaSuperior(nivelMonge) && pontosDeFocoRestantes >= CUSTO_FOCO_DEFESA_SUPERIOR;
}
