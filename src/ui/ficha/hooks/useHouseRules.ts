import { useCallback, useState } from 'react';
import { armazenamentoHouseRules, type HouseRules } from '../../../core/houseRules';

/** House Rules da conta — lidas uma vez ao montar, gravadas a cada troca. */
export function useHouseRules() {
  const [regras, setRegras] = useState<HouseRules>(() => armazenamentoHouseRules.carregar());

  const alternar = useCallback((chave: keyof HouseRules) => {
    setRegras((atual) => {
      const proximo = { ...atual, [chave]: !atual[chave] };
      armazenamentoHouseRules.salvar(proximo);
      return proximo;
    });
  }, []);

  return { regras, alternar };
}
