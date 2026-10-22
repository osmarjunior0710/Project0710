import type { Magia } from '../../data/rulesets/dnd2024/magias';
import { componentesVSM, resumoDuracao, resumoTipoAcao } from '../../core/pillsMagia';
import type { PreferenciasPillsMagia } from '../../core/preferenciasPillsMagia';
import type { ResumoConjuracaoPorClasse } from '../../core/magiasPersonagem';
import PillClasse from './PillClasse';

interface PillsMagiaProps {
  magia: Magia;
  /** Classe de origem, quando a lista já resolve isso por fora (ver
   * `MagiaConhecida`/`magiasConhecidasComClasse`) — `undefined` numa
   * lista que não é multiclasse-aware (o pill de Classe some nesse
   * caso, mesmo com a preferência ligada). */
  classe?: string | null;
  /** Pra achar o atributo de conjuração de `classe` (pill "Atributo de
   * Conjuração") — mesmos resumos já calculados em `FichaShell.tsx`
   * (ver `sdd/sdd-atributo-talento.md`). `undefined` = sem dado pra
   * essa lista (o pill some, mesmo com a preferência ligada), igual o
   * pill de Classe sem `classe`. */
  resumosPorClasse?: ResumoConjuracaoPorClasse[];
  preferencias: PreferenciasPillsMagia;
}

/** Pills configuráveis de info da magia/truque (ver Backlog.md "Pills
 * configuráveis de info da magia" e `core/pillsMagia.ts`) — cada linha
 * de magia em Magias/Combate usa este componente único, pra manter as
 * 4 telas consistentes entre si e com o que o Perfil configurou. */
export default function PillsMagia({ magia, classe, resumosPorClasse, preferencias }: PillsMagiaProps) {
  const vsm = componentesVSM(magia.componentes);
  const atributoDaFonte = classe ? resumosPorClasse?.find((r) => r.classeNome === classe)?.resumo.atributo : undefined;
  return (
    <>
      {preferencias.circulo && (
        <span className="tag">{magia.circulo === 0 ? 'Truque' : `${magia.circulo}º círculo`}</span>
      )}
      {preferencias.classe && classe && <PillClasse classe={classe} />}
      {preferencias.atributoConjuracao && atributoDaFonte && <span className="tag">{atributoDaFonte}</span>}
      {preferencias.escola && <span className="tag">{magia.escola}</span>}
      {preferencias.alcance && magia.alcance && <span className="tag">{magia.alcance}</span>}
      {preferencias.componenteV && vsm.v && <span className="tag">V</span>}
      {preferencias.componenteS && vsm.s && <span className="tag">S</span>}
      {preferencias.componenteM && vsm.m && <span className="tag">M</span>}
      {preferencias.ataqueOuSalvaguarda && magia.ataqueOuSalvaguarda && (
        <span className="tag">{magia.ataqueOuSalvaguarda}</span>
      )}
      {preferencias.duracao && magia.duracao && <span className="tag">{resumoDuracao(magia.duracao)}</span>}
      {preferencias.tipoAcao && magia.tempoConjuracao && (
        <span className="tag">{resumoTipoAcao(magia.tempoConjuracao)}</span>
      )}
    </>
  );
}
