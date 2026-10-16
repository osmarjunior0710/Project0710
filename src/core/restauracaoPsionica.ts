// Restauração Psiônica (Psiônico, nível 5) — "Você pode realizar uma
// meditação que concentra a mente por 1 minuto. Ao final dela, você
// recupera os Dados de Energia Psiônica gastos. Após usar essa
// habilidade, você não poderá usá-la novamente até concluir um
// Descanso Longo."
// Sem rolagem de dado — recupera TODOS os dados gastos de uma vez.
// [codeimplementation]

export function temRestauracaoPsionica(nivelPsionico: number): boolean {
  return nivelPsionico >= 5;
}

export function podeUsarRestauracaoPsionica(usada: boolean, dadosGastos: number): boolean {
  return !usada && dadosGastos > 0;
}
