// Preferências de quais pills de info aparecem nas magias/truques (Círculo,
// Classe, Escola, Distância, Componentes V/S/M, Ataque-ou-Salvaguarda,
// Duração, Tipo de Ação) — salvas por CONTA/aparelho, não por personagem
// (mesmo espírito de `houseRules.ts` e do "Dado 3D"). Ver Backlog.md "Pills
// configuráveis de info da magia".

export interface PreferenciasPillsMagia {
  circulo: boolean;
  /** Classe de origem da magia — único pill que já existia antes desta
   * preferência existir; começa ligado pra não mudar nada de quem já
   * usa o app. */
  classe: boolean;
  escola: boolean;
  alcance: boolean;
  componenteV: boolean;
  componenteS: boolean;
  componenteM: boolean;
  ataqueOuSalvaguarda: boolean;
  duracao: boolean;
  tipoAcao: boolean;
}

export const PREFERENCIAS_PILLS_MAGIA_PADRAO: PreferenciasPillsMagia = {
  circulo: false,
  classe: true,
  escola: false,
  alcance: false,
  componenteV: false,
  componenteS: false,
  componenteM: false,
  ataqueOuSalvaguarda: false,
  duracao: false,
  tipoAcao: false,
};

/** Aceita qualquer coisa vinda do armazenamento: campo ausente, de tipo
 * errado ou JSON corrompido cai no valor padrão, sem quebrar. */
export function normalizarPreferenciasPillsMagia(bruto: unknown): PreferenciasPillsMagia {
  const obj = bruto && typeof bruto === 'object' ? (bruto as Record<string, unknown>) : {};
  const resultado = { ...PREFERENCIAS_PILLS_MAGIA_PADRAO };
  for (const chave of Object.keys(PREFERENCIAS_PILLS_MAGIA_PADRAO) as (keyof PreferenciasPillsMagia)[]) {
    if (typeof obj[chave] === 'boolean') resultado[chave] = obj[chave] as boolean;
  }
  return resultado;
}

export interface ArmazenamentoPreferenciasPillsMagia {
  carregar(): PreferenciasPillsMagia;
  salvar(preferencias: PreferenciasPillsMagia): void;
}

const CHAVE = 'dnd-companion:pills-magia';

class ArmazenamentoPreferenciasPillsMagiaLocalStorage implements ArmazenamentoPreferenciasPillsMagia {
  carregar(): PreferenciasPillsMagia {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return normalizarPreferenciasPillsMagia(bruto ? JSON.parse(bruto) : null);
    } catch {
      return { ...PREFERENCIAS_PILLS_MAGIA_PADRAO };
    }
  }

  salvar(preferencias: PreferenciasPillsMagia): void {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(preferencias));
    } catch {
      // sem espaço/bloqueado: a preferência vale só nesta sessão
    }
  }
}

export const armazenamentoPreferenciasPillsMagia: ArmazenamentoPreferenciasPillsMagia =
  new ArmazenamentoPreferenciasPillsMagiaLocalStorage();
