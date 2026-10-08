// Foco Aprimorado (Monge, nível 10) — Defesa Paciente (PV Temporários =
// 2 dados de Artes Marciais), Passo do Vento (leva uma criatura voluntária
// junto) e Torrente de Golpes (3 ataques em vez de 2 ao gastar Foco).
// [codeimplementation]

export function temFocoAprimorado(nivelMonge: number): boolean {
  return nivelMonge >= 10;
}

/** Quantos Ataques Desarmados a Torrente de Golpes dá ao gastar 1 Foco. */
export function ataquesTorrenteComFoco(nivelMonge: number): number {
  return temFocoAprimorado(nivelMonge) ? 3 : 2;
}
