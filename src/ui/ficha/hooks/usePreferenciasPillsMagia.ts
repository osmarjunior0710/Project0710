import { useCallback, useState } from 'react';
import {
  armazenamentoPreferenciasPillsMagia,
  type PreferenciasPillsMagia,
} from '../../../core/preferenciasPillsMagia';

/** Preferências de pills de magia da conta — lidas uma vez ao montar,
 * gravadas a cada troca (mesmo padrão de `useHouseRules`). */
export function usePreferenciasPillsMagia() {
  const [preferencias, setPreferencias] = useState<PreferenciasPillsMagia>(() =>
    armazenamentoPreferenciasPillsMagia.carregar()
  );

  const alternar = useCallback((chave: keyof PreferenciasPillsMagia) => {
    setPreferencias((atual) => {
      const proximo = { ...atual, [chave]: !atual[chave] };
      armazenamentoPreferenciasPillsMagia.salvar(proximo);
      return proximo;
    });
  }, []);

  return { preferencias, alternar };
}
