import { classes } from '../../../data/rulesets/dnd2024/classes';
import IconeClasse from '../../components/IconeClasse';
import type { StepProps } from './StepProps';

const CLASSES_EM_BREVE = [
  { nome: 'Bárbaro', id: 'barbaro' },
  { nome: 'Clérigo', id: 'clerigo' },
  { nome: 'Druida', id: 'druida' },
  { nome: 'Feiticeiro', id: 'feiticeiro' },
  { nome: 'Guardião', id: 'guardiao' },
  { nome: 'Ladino', id: 'ladino' },
  { nome: 'Mago', id: 'mago' },
  { nome: 'Monge', id: 'monge' },
  { nome: 'Paladino', id: 'paladino' },
];

function porNome<T extends { nome: string }>(a: T, b: T): number {
  return a.nome.localeCompare(b.nome, 'pt-BR');
}

export default function ClasseStep({ selection, update }: StepProps) {
  const disponiveis = classes.filter((c) => c.disponivel).sort(porNome);
  // Classes com dado real (núcleo já importado) mas ainda não prontas
  // pro wizard de ponta a ponta (ex: Bardo, Etapa 1 só de dados feita)
  // aparecem na lista "em breve" com o nome/emblema reais, não mais o
  // placeholder genérico.
  const indisponiveis = classes.filter((c) => !c.disponivel).sort(porNome);
  const classesEmBreve = [...CLASSES_EM_BREVE].sort(porNome);

  return (
    <>
      <div className="section-title">Selecione uma classe</div>
      {disponiveis.map((c) => (
        <div
          key={c.id}
          className={`opt-card ${selection.classe === c.nome ? 'selected' : ''}`}
          onClick={() => update({ classe: c.nome })}
        >
          <div className="opt-card-row">
            <IconeClasse id={c.id} />
            <div className="opt-card-info">
              <div className="opt-card-name">{c.nome}</div>
              <div className="opt-card-desc">Atributo primário: {c.atributoPrimario}</div>
              <div className="opt-card-tags">
                <span className="tag">Dado de Vida {c.dadoDeVida}</span>
                <span className="tag">Salvaguardas {c.salvaguardas.join('/')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {indisponiveis.map((c) => (
        <div key={c.id} className="opt-card btn-disabled">
          <div className="opt-card-row">
            <IconeClasse id={c.id} />
            <div className="opt-card-info">
              <div className="opt-card-name">
                {c.nome}
                <span className="tag" style={{ marginLeft: 6 }}>(em breve)</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {classesEmBreve.map((classe) => (
        <div key={classe.id} className="opt-card btn-disabled">
          <div className="opt-card-row">
            <IconeClasse id={classe.id} />
            <div className="opt-card-info">
              <div className="opt-card-name">
                {classe.nome}
                <span className="tag" style={{ marginLeft: 6 }}>(em breve)</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="label" style={{ marginTop: 6 }}>
        Guerreiro, Bardo e Bruxo estão prontos por enquanto — as outras classes ainda não foram
        implementadas de ponta a ponta. Ver <code>PENDENCIAS.md</code>.
      </div>
    </>
  );
}
