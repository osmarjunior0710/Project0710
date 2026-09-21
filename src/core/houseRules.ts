// House Rules — opções de regra da mesa do tipo "house rule", salvas
// por CONTA (não por personagem). Hoje "conta" = neste aparelho, atrás
// da interface `ArmazenamentoHouseRules` — quando o login real entrar
// (Fase 5), só a implementação troca; nenhum componente muda.

export interface HouseRules {
  /** Mostra o peso de cada item e a barra de carga na Mochila. */
  pesoMochila: boolean;
}

export const HOUSE_RULES_PADRAO: HouseRules = {
  pesoMochila: true,
};

export interface ArmazenamentoHouseRules {
  carregar(): HouseRules;
  salvar(regras: HouseRules): void;
}

/** Aceita qualquer coisa vinda do armazenamento: campo ausente, de
 * tipo errado ou JSON corrompido cai no valor padrão, sem quebrar. */
export function normalizarHouseRules(bruto: unknown): HouseRules {
  const obj = bruto && typeof bruto === 'object' ? (bruto as Record<string, unknown>) : {};
  const resultado = { ...HOUSE_RULES_PADRAO };
  for (const chave of Object.keys(HOUSE_RULES_PADRAO) as (keyof HouseRules)[]) {
    if (typeof obj[chave] === 'boolean') resultado[chave] = obj[chave] as boolean;
  }
  return resultado;
}

const CHAVE = 'dnd-companion:house-rules';

class ArmazenamentoHouseRulesLocalStorage implements ArmazenamentoHouseRules {
  carregar(): HouseRules {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return normalizarHouseRules(bruto ? JSON.parse(bruto) : null);
    } catch {
      return { ...HOUSE_RULES_PADRAO };
    }
  }

  salvar(regras: HouseRules): void {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(regras));
    } catch {
      // sem espaço/bloqueado: a regra vale só nesta sessão
    }
  }
}

export const armazenamentoHouseRules: ArmazenamentoHouseRules = new ArmazenamentoHouseRulesLocalStorage();
