import type { Atributo } from '../../../data/wizardFixtures';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { gruposFerramenta } from '../../../data/rulesets/dnd2024/ferramentas';
import { magiasDaClasse } from '../../../data/rulesets/dnd2024/magias';
import { iconesMagia } from '../../../core/classificarMagia';
import { concessoesJaConcedidas, type FonteConcessao } from '../../../core/concessoesJaConcedidas';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import type { StepProps } from './StepProps';

const todasFerramentas = Array.from(new Set(Object.values(gruposFerramenta).flat().map((f) => f.nome))).sort();

const ATRIBUTOS_CONJURACAO: { atributo: Atributo; rotulo: string }[] = [
  { atributo: 'INT', rotulo: 'Inteligência' },
  { atributo: 'SAB', rotulo: 'Sabedoria' },
  { atributo: 'CAR', rotulo: 'Carisma' },
];

export default function TalentoOrigemEscolhasStep({ selection, update }: StepProps) {
  const origem = origens.find((o) => o.nome === selection.origem);
  const talento = origem ? talentosOrigem.find((t) => t.id === origem.talentoOrigemId) : undefined;

  if (!origem || !talento) {
    return <div className="label">Volte e selecione uma origem primeiro.</div>;
  }

  if (talento.concedeMagiaIniciada) {
    return <IniciadoEmMagiaEscolhas selection={selection} update={update} origem={origem} talento={talento} />;
  }

  const concede = talento.concedeProficiencias;
  const concedeFerramentaGrupo = talento.concedeFerramentaGrupo;
  if (!concede && !concedeFerramentaGrupo) {
    return <div className="label">Volte e selecione uma origem primeiro.</div>;
  }

  const jaConcedidas = concessoesJaConcedidas(selection, origem);
  const max = concede?.quantidade ?? concedeFerramentaGrupo!.quantidade;
  const escolhidas = selection.proficienciasTalentoOrigemEscolhidas;
  const opcoesFerramenta = concedeFerramentaGrupo
    ? (gruposFerramenta[concedeFerramentaGrupo.grupo] ?? []).map((f) => f.nome)
    : todasFerramentas;
  const mostrarPericias = concede?.tipos.includes('pericia') ?? false;
  const mostrarFerramentas = concedeFerramentaGrupo !== undefined || (concede?.tipos.includes('ferramenta') ?? false);
  const rotuloFerramentas = concedeFerramentaGrupo?.grupo ?? 'Ferramentas';

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

      {mostrarPericias && (
        <>
          <div className="label" style={{ marginTop: 6 }}>
            Perícias
          </div>
          {pericias.map((p) => linha(p.nome, jaConcedidas.pericias.get(p.nome)))}
        </>
      )}

      {mostrarFerramentas && (
        <>
          <div className="label" style={{ marginTop: 6 }}>
            {rotuloFerramentas}
          </div>
          {opcoesFerramenta.map((nome) => linha(nome, jaConcedidas.ferramentas.get(nome)))}
        </>
      )}
    </>
  );
}

function IniciadoEmMagiaEscolhas({
  selection,
  update,
  origem,
  talento,
}: StepProps & { origem: NonNullable<ReturnType<(typeof origens)['find']>>; talento: (typeof talentosOrigem)[number] }) {
  // A lista de classe (Clérigo/Druida/Mago) já vem fixa no nome da
  // origem (`Origem.talentoOrigemVariante`) — diferente do talento
  // pego avulso como Talento Geral, aqui não há escolha de lista.
  const lista = origem.talentoOrigemVariante ?? '';
  const jaConcedidas = concessoesJaConcedidas(selection, origem);
  const truquesDaLista = magiasDaClasse(lista, 0);
  const magiasNivel1DaLista = magiasDaClasse(lista, 1);
  const truquesEscolhidos = selection.truquesMagiaIniciadaEscolhidos;

  function toggleTruque(nome: string) {
    const i = truquesEscolhidos.indexOf(nome);
    if (i > -1) {
      update({ truquesMagiaIniciadaEscolhidos: truquesEscolhidos.filter((x) => x !== nome) });
    } else if (truquesEscolhidos.length < 2) {
      update({ truquesMagiaIniciadaEscolhidos: [...truquesEscolhidos, nome] });
    }
  }

  function toggleMagia(nome: string) {
    update({ magiaMagiaIniciadaEscolhida: selection.magiaMagiaIniciadaEscolhida === nome ? null : nome });
  }

  return (
    <>
      <div className="section-title">
        {talento.nome} ({lista})
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 4 }}>
        {talento.beneficios}
      </div>

      <div className="section-title">
        Truques — escolha 2 ({truquesEscolhidos.length}/2)
      </div>
      {truquesDaLista.map((m) => {
        const fonte = jaConcedidas.truques.get(m.nome);
        const outraFonte = fonte && fonte !== 'Talento' ? fonte : null;
        return (
          <div key={m.id} className="check-row" onClick={() => toggleTruque(m.nome)}>
            <div className={`check-box ${truquesEscolhidos.includes(m.nome) ? 'checked' : ''}`} />
            <span className="check-label">
              <MagiaComDescricao magia={m} rotulo={m.nome} /> {iconesMagia(m)}
            </span>
            {outraFonte && (
              <span className="tag" style={{ marginLeft: 'auto' }}>
                já possui - {outraFonte.toLowerCase()}
              </span>
            )}
          </div>
        );
      })}

      <div className="section-title">
        Magia de 1º círculo — escolha 1 ({selection.magiaMagiaIniciadaEscolhida ? 1 : 0}/1)
      </div>
      <div className="label" style={{ marginBottom: 4 }}>
        Sempre preparada — conjura de graça 1x por Descanso Longo, senão gasta Espaço de Magia.
      </div>
      {magiasNivel1DaLista.map((m) => {
        const fonte = jaConcedidas.magias.get(m.nome);
        const outraFonte = fonte && fonte !== 'Talento' ? fonte : null;
        return (
          <div key={m.id} className="check-row" onClick={() => toggleMagia(m.nome)}>
            <div className={`check-box ${selection.magiaMagiaIniciadaEscolhida === m.nome ? 'checked' : ''}`} />
            <span className="check-label">
              <MagiaComDescricao magia={m} rotulo={m.nome} /> {iconesMagia(m)}
            </span>
            {outraFonte && (
              <span className="tag" style={{ marginLeft: 'auto' }}>
                já possui - {outraFonte.toLowerCase()}
              </span>
            )}
          </div>
        );
      })}

      <div className="section-title">Atributo de conjuração</div>
      <div className="label" style={{ marginBottom: 4 }}>
        Livre entre os 3 — não precisa bater com a lista de classe escolhida acima.
      </div>
      {ATRIBUTOS_CONJURACAO.map(({ atributo, rotulo }) => (
        <div
          key={atributo}
          className="check-row"
          onClick={() => update({ atributoMagiaIniciadaEscolhido: atributo })}
        >
          <div className={`check-box ${selection.atributoMagiaIniciadaEscolhido === atributo ? 'checked' : ''}`} />
          <span className="check-label">{rotulo}</span>
        </div>
      ))}
    </>
  );
}
