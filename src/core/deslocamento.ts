// Deslocamento (velocidade de caminhada, em metros) do personagem — UMA função
// soma todas as fontes (pedido do Osmar, 2026-10): espécie (+ sub-espécie) +
// classe + subclasse + talentos + armadura + efeitos ativos + itens. Cada fonte
// tem 2 booleanos: `tem` (o personagem possui a característica) e `ativa` (as
// condições valem agora — ex.: Monge só ganha o bônus sem armadura/escudo).
// Fonte que o personagem tem mas está inativa aparece no ⓘ com o motivo, pra o
// jogador entender por que "sumiu" o bônus. Fonte nova = 1 item na lista.
// [codeimplementation]

import type { ExplicacaoCalculo } from './calculoPersonagem';

export interface FonteDeslocamento {
  id: string;
  rotulo: string;
  /** Metros somados (negativo = penalidade). */
  metros: number;
  /** O personagem possui essa fonte (se não, nem aparece no ⓘ). */
  tem: boolean;
  /** As condições da fonte valem AGORA (se `tem` e não `ativa`, aparece como inativa). */
  ativa: boolean;
  /** Por que está inativa (mostrado no ⓘ). */
  motivoInativa?: string;
}

export interface EntradaDeslocamento {
  /** Deslocamento base da espécie, em metros (ex.: 9). `null` = personagem sem espécie. */
  baseEspecieM: number | null;
  /** Sub-espécie que SUBSTITUI a base (ex.: Elfo Silvestre "aumenta para 10,5 m"). */
  baseSubespecieM?: number | null;
  /** Rótulo da sub-espécie que mudou a base (ex.: "Elfo Silvestre"). */
  rotuloSubespecie?: string | null;
  /** Armadura equipada (qualquer categoria) / pesada / escudo — pra condições de classe. */
  armaduraEquipada: boolean;
  armaduraPesada: boolean;
  escudoEquipado: boolean;
  /** Força mínima da armadura equipada (ex.: 13) e a Força do personagem — penalidade de −3 m. */
  forcaMinimaArmadura: number | null;
  forcaPersonagem: number;
  /** Bônus de Movimento sem Armadura do Monge no nível atual (0 = não é Monge/nível 1). */
  bonusMovimentoSemArmaduraM: number;
  /** Bárbaro nível 5+ (Movimento Rápido). */
  temMovimentoRapido: boolean;
  /** Talentos. */
  temVelocista: boolean;
  temDadivaDaVelocidade: boolean;
  /** Forma Grande (Golias) ativa. */
  formaGrandeAtiva: boolean;
  /** Passo Destrutivo (Ápice Elemental) ligado neste turno. */
  passoDestrutivoAtivo: boolean;
  /** Níveis de Exaustão (hoje o app não rastreia condições — sempre 0). */
  niveisExaustao: number;
  /** Fontes extras de item/efeito (ex.: futuras botas mágicas), no mesmo formato. */
  extras?: FonteDeslocamento[];
}

export interface ResultadoDeslocamento {
  totalM: number;
  fontes: FonteDeslocamento[];
  explicacao: ExplicacaoCalculo;
}

export const PENALIDADE_FORCA_ARMADURA_M = 3;
export const BONUS_MOVIMENTO_RAPIDO_M = 3;
export const BONUS_VELOCISTA_M = 3;
export const BONUS_DADIVA_VELOCIDADE_M = 9;
export const BONUS_FORMA_GRANDE_M = 3;
export const BONUS_PASSO_DESTRUTIVO_M = 6;
export const PENALIDADE_EXAUSTAO_POR_NIVEL_M = 1.5;

/** "9 metros" / "10,5 metros" → 9 / 10.5 (`null` se não achar número). */
export function deslocamentoDaEspecie(texto: string | null | undefined): number | null {
  const m = (texto ?? '').match(/(\d+(?:[.,]\d+)?)\s*metros?/i);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

/** "For 13" → 13 (`null` se a armadura não exige Força). */
export function forcaMinimaDaArmadura(texto: string | null | undefined): number | null {
  const m = (texto ?? '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Formata metros no padrão do app: 9 → "9 m", 10.5 → "10,5 m". */
export function formatarMetros(m: number): string {
  return `${String(m).replace('.', ',')} m`;
}

function formatarDelta(m: number): string {
  return `${m >= 0 ? '+' : '−'}${formatarMetros(Math.abs(m))}`;
}

export function listarFontesDeslocamento(e: EntradaDeslocamento): FonteDeslocamento[] {
  const semArmaduraNemEscudo = !e.armaduraEquipada && !e.escudoEquipado;
  const motivoArmaduraEscudo = e.armaduraEquipada ? 'armadura equipada' : 'escudo equipado';
  const forcaInsuficiente = e.armaduraEquipada && e.forcaMinimaArmadura !== null && e.forcaPersonagem < e.forcaMinimaArmadura;
  return [
    {
      id: 'movimento-sem-armadura',
      rotulo: 'Movimento sem Armadura (Monge)',
      metros: e.bonusMovimentoSemArmaduraM,
      tem: e.bonusMovimentoSemArmaduraM > 0,
      ativa: semArmaduraNemEscudo,
      motivoInativa: motivoArmaduraEscudo,
    },
    {
      id: 'movimento-rapido',
      rotulo: 'Movimento Rápido (Bárbaro)',
      metros: BONUS_MOVIMENTO_RAPIDO_M,
      tem: e.temMovimentoRapido,
      ativa: !e.armaduraPesada,
      motivoInativa: 'Armadura Pesada equipada',
    },
    { id: 'velocista', rotulo: 'Velocista (talento)', metros: BONUS_VELOCISTA_M, tem: e.temVelocista, ativa: true },
    {
      id: 'dadiva-velocidade',
      rotulo: 'Dádiva da Velocidade',
      metros: BONUS_DADIVA_VELOCIDADE_M,
      tem: e.temDadivaDaVelocidade,
      ativa: true,
    },
    { id: 'forma-grande', rotulo: 'Forma Grande', metros: BONUS_FORMA_GRANDE_M, tem: e.formaGrandeAtiva, ativa: true },
    {
      id: 'passo-destrutivo',
      rotulo: 'Passo Destrutivo (até o fim do turno)',
      metros: BONUS_PASSO_DESTRUTIVO_M,
      tem: e.passoDestrutivoAtivo,
      ativa: true,
    },
    {
      id: 'forca-armadura',
      rotulo: `Força abaixo do mínimo da armadura (${e.forcaMinimaArmadura ?? '—'})`,
      metros: -PENALIDADE_FORCA_ARMADURA_M,
      tem: forcaInsuficiente,
      ativa: true,
    },
    {
      id: 'exaustao',
      rotulo: `Exaustão (nível ${e.niveisExaustao})`,
      metros: -PENALIDADE_EXAUSTAO_POR_NIVEL_M * e.niveisExaustao,
      tem: e.niveisExaustao > 0,
      ativa: true,
    },
    ...(e.extras ?? []),
  ];
}

export function calcularDeslocamento(e: EntradaDeslocamento): ResultadoDeslocamento {
  const base = e.baseSubespecieM ?? e.baseEspecieM ?? 0;
  const rotuloBase = e.baseSubespecieM != null ? `Base — ${e.rotuloSubespecie ?? 'sub-espécie'}` : 'Base da espécie';
  const fontes = listarFontesDeslocamento(e).filter((f) => f.tem);
  const soma = fontes.filter((f) => f.ativa).reduce((acc, f) => acc + f.metros, 0);
  const totalM = Math.max(0, base + soma);
  const linhas = [
    { label: rotuloBase, valor: formatarMetros(base) },
    // Fonte inativa: o motivo vai no rótulo (coluna larga) e o valor sai entre parênteses (não soma).
    ...fontes.map((f) =>
      f.ativa
        ? { label: f.rotulo, valor: formatarDelta(f.metros) }
        : { label: `${f.rotulo} — inativo: ${f.motivoInativa ?? 'condição não atendida'}`, valor: `(${formatarDelta(f.metros)})` },
    ),
  ];
  return { totalM, fontes, explicacao: { linhas, total: { label: 'Deslocamento', valor: formatarMetros(totalM) } } };
}
