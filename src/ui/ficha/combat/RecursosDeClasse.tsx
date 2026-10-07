import type { RecursoVisivel } from '../../../core/recursosVisiveis';
import BarraRecurso from '../../components/BarraRecurso';
import ContadorUsos from '../../components/ContadorUsos';
import InfoTexto from '../../components/InfoTexto';
import TickPips from '../../components/TickPips';

interface RecursosDeClasseProps {
  recursos: RecursoVisivel[];
}

/** Painel passivo dos recursos de classe com contador (Fúria, Inspiração de
 * Bardo, Magia de Pacto, Recuperar Fôlego...) — 1 linha por recurso:
 * nome ⓘ pips restantes/total. Não gasta nada por aqui; o gasto continua nos
 * painéis de Ação/Ação Bônus/Reação. O texto explicativo mora no ⓘ pra não
 * gastar espaço. Some quando o personagem não tem nenhum recurso desse tipo. */
export default function RecursosDeClasse({ recursos }: RecursosDeClasseProps) {
  if (recursos.length === 0) return null;
  return (
    <div className="box" style={{ padding: '4px', marginBottom: 'var(--space-3)', border: 'none' }}>
      {recursos.map((r, i) =>
        r.exibicao === 'barra' ? (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '4px 0',
              borderTop: i === 0 ? 'none' : '1px dashed var(--line-soft)',
            }}
          >
            <span style={{ fontSize: 13, flexShrink: 0 }}>
              {r.nome} <InfoTexto titulo={r.nome} paragrafos={r.descricao} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <BarraRecurso valor={r.restantes} maximo={r.maximo} cor={r.cor?.hex ?? 'var(--accent)'} rotulo={`${r.restantes}/${r.maximo} PV`} altura={24} />
            </div>
          </div>
        ) : r.exibicao === 'pips-bloco' ? (
          <div
            key={r.id}
            style={{
              padding: '4px 0',
              borderTop: i === 0 ? 'none' : '1px dashed var(--line-soft)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
              }}
            >
              <span style={{ fontSize: 13, lineHeight: '16px' }}>
                {r.nome} <InfoTexto titulo={r.nome} paragrafos={r.descricao} />
              </span>
              <TickPips total={r.maximo} usados={r.maximo - r.restantes} cor={r.cor} quebrarACada={r.quebrarACada} />
            </div>
          </div>
        ) : (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
              padding: '4px 0',
              borderTop: i === 0 ? 'none' : '1px dashed var(--line-soft)',
            }}
          >
            <span style={{ fontSize: 13 }}>
              {r.nome} <InfoTexto titulo={r.nome} paragrafos={r.descricao} />
            </span>
            <ContadorUsos total={r.maximo} usados={r.maximo - r.restantes} cor={r.cor} />
          </div>
        ),
      )}
    </div>
  );
}
