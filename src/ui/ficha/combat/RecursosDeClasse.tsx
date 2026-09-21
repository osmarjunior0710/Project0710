import type { RecursoVisivel } from '../../../core/recursosVisiveis';
import ContadorUsos from '../../components/ContadorUsos';
import InfoTexto from '../../components/InfoTexto';

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
    <div className="box" style={{ padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)' }}>
      {recursos.map((r, i) => (
        <div
          key={r.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            minHeight: 36,
            borderTop: i === 0 ? 'none' : '1px dashed var(--line-soft)',
          }}
        >
          <span style={{ fontSize: 13 }}>
            {r.nome} <InfoTexto titulo={r.nome} paragrafos={r.descricao} />
          </span>
          <ContadorUsos total={r.maximo} usados={r.maximo - r.restantes} variante={r.cor ?? 'padrao'} />
        </div>
      ))}
    </div>
  );
}
