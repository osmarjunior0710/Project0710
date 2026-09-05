import { origens } from '../../../data/rulesets/dnd2024/origens';
import { talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { gruposFerramenta } from '../../../data/rulesets/dnd2024/ferramentas';
import { concessoesJaConcedidas, type FonteConcessao } from '../../../core/concessoesJaConcedidas';
import type { StepProps } from './StepProps';

const todasFerramentas = Array.from(new Set(Object.values(gruposFerramenta).flat().map((f) => f.nome))).sort();

export default function TalentoOrigemEscolhasStep({ selection, update }: StepProps) {
  const origem = origens.find((o) => o.nome === selection.origem);
  const talento = origem ? talentosOrigem.find((t) => t.id === origem.talentoOrigemId) : undefined;
  const concede = talento?.concedeProficiencias;

  if (!origem || !talento || !concede) {
    return <div className="label">Volte e selecione uma origem primeiro.</div>;
  }

  const jaConcedidas = concessoesJaConcedidas(selection, origem);
  const max = concede.quantidade;
  const escolhidas = selection.proficienciasTalentoOrigemEscolhidas;

  function toggle(nome: string) {
    if (escolhidas.includes(nome)) {
      update({ proficienciasTalentoOrigemEscolhidas: escolhidas.filter((x) => x !== nome) });
    } else if (escolhidas.length < max) {
      update({ proficienciasTalentoOrigemEscolhidas: [...escolhidas, nome] });
    }
  }

  function linha(nome: string, fonte: FonteConcessao | undefined) {
    return (
      <div key={nome} className="check-row" onClick={() => toggle(nome)}>
        <div className={`check-box ${escolhidas.includes(nome) ? 'checked' : ''}`} />
        <span className="check-label">{nome}</span>
        {fonte && (
          <span className="tag" style={{ marginLeft: 'auto' }}>
            já possui - {fonte.toLowerCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="section-title">{talento.nome}</div>
      <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 4 }}>
        {talento.beneficios}
      </div>

      <div className="section-title">
        Escolha {max} ({escolhidas.length}/{max})
      </div>
      <div className="label" style={{ marginBottom: 4 }}>
        Pode escolher algo que você já tem — só não ganha nada a mais por isso.
      </div>

      {concede.tipos.includes('pericia') && (
        <>
          <div className="label" style={{ marginTop: 6 }}>
            Perícias
          </div>
          {pericias.map((p) => linha(p.nome, jaConcedidas.pericias.get(p.nome)))}
        </>
      )}

      {concede.tipos.includes('ferramenta') && (
        <>
          <div className="label" style={{ marginTop: 6 }}>
            Ferramentas
          </div>
          {todasFerramentas.map((nome) => linha(nome, jaConcedidas.ferramentas.get(nome)))}
        </>
      )}
    </>
  );
}
