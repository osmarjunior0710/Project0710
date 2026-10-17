import type { RollDadosOptions } from './RollContext';

/** "Funil" único por onde TODA rolagem de Dado de Energia Psiônica
 * PURA (o próprio dado, não um bônus somado a um d20 — esse caso usa
 * `DadoPsionicoProvider`, que já ganha o Surto automaticamente dentro
 * do motor) deve passar, em vez de chamar `rolarDados` direto — ver
 * `DECISOES-CLASSES.md` "Surto Psiônico — funil único".
 *
 * Por quê: Surto Psiônico (nível 7, E5c) se aplica a QUALQUER Dado de
 * Energia Psiônica já rolado, não importa a característica. Se cada
 * característica nova chamasse `rolarDados` direto, seria fácil
 * esquecer de ligar o Surto numa característica futura — passando por
 * aqui, a oferta aparece sozinha (o motor decide se vale a pena
 * oferecer, ver `RollContextValue.ofertaSurtoPsionico`), sem quem
 * chama precisar saber que o Surto existe. */
export function rolarDadoDeEnergiaPsionica(
  rolarDados: (opts: RollDadosOptions) => void,
  opts: Omit<RollDadosOptions, 'ehDadoDeEnergiaPsionica' | 'forcarGrid'>,
) {
  rolarDados({ ...opts, ehDadoDeEnergiaPsionica: true, forcarGrid: true });
}
