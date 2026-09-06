import { especies } from '../../../data/rulesets/dnd2024/especies';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { concessoesJaConcedidas } from '../../../core/concessoesJaConcedidas';
import { valorFinalAtributo } from '../../../core/personagem';
import { atributosOrdem, type Atributo } from '../../../data/wizardFixtures';
import { descricaoTracoResolvida, opcoesSubescolhaNoWizard, tracoComEscolhaDePericia } from '../../../core/especieSubescolha';
import { truquesEspecie, magiasEspecie } from '../../../core/magiasEspecie';
import InfoChip from '../../components/InfoChip';
import TelaEscolherTalento from '../../ficha/levelup/TelaEscolherTalento';
import type { StepProps } from './StepProps';

export default function EspecieEscolhasStep({ selection, update }: StepProps) {
  const especie = especies.find((e) => e.nome === selection.especie);

  if (!especie) {
    return <div className="label">Volte e selecione uma espécie primeiro.</div>;
  }

  const temTraco = (id: string) => especie.traços.some((t) => t.id === id);
  const origem = origens.find((o) => o.nome === selection.origem);
  const jaConcedidas = concessoesJaConcedidas(selection, origem, especie);
  const atributosFinais = Object.fromEntries(
    atributosOrdem.map((a) => [a, valorFinalAtributo(selection, a) ?? 10]),
  ) as Record<Atributo, number>;
  const opcoesSubescolha = opcoesSubescolhaNoWizard(especie);
  const tracoPericia = tracoComEscolhaDePericia(especie);
  const opcoesPericia = tracoPericia?.opcoesPericia ?? pericias.map((p) => p.nome);
  // Truques/Magias que a Espécie concede de graça (truqueFixo + linhagem
  // escolhida acima nesta MESMA tela) e que colidem com o que já foi
  // escolhido na etapa de Classe (1b, roda ANTES de Espécie) — não dá
  // pra impedir a escolha repetida na hora (Classe já passou), só
  // avisar aqui pra o jogador voltar e trocar se quiser.
  const colisoesTruqueClasse = truquesEspecie(selection).filter((nome) => selection.truquesEscolhidos.includes(nome));
  const colisoesMagiaClasse = magiasEspecie(selection, 1).filter((nome) =>
    selection.magiasPreparadasEscolhidas.includes(nome),
  );

  return (
    <>
      <div className="section-title">{especie.nome}</div>
      <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 4 }}>
        {especie.introducao}
      </div>

      <div className="summary-row">
        <span>Tipo de Criatura</span>
        <span>{especie.tipoCriatura}</span>
      </div>
      <div className="summary-row">
        <span>Tamanho</span>
        <span>{especie.tamanho.fixo ?? selection.tamanhoEspecieEscolhido ?? especie.tamanho.opcoes?.join(' ou ')}</span>
      </div>
      <div className="summary-row">
        <span>Deslocamento</span>
        <span>{especie.deslocamento}</span>
      </div>

      {especie.tamanho.opcoes && (
        <>
          <div className="section-title">Tamanho — escolha 1</div>
          {especie.tamanho.opcoes.map((opcao) => (
            <div
              key={opcao}
              className={`opt-card ${selection.tamanhoEspecieEscolhido === opcao ? 'selected' : ''}`}
              style={{ padding: '10px 12px' }}
              onClick={() => update({ tamanhoEspecieEscolhido: opcao })}
            >
              <span className="opt-card-name">{opcao}</span>
            </div>
          ))}
        </>
      )}

      {opcoesSubescolha && especie.subescolha && (
        <>
          <div className="section-title">{especie.subescolha.nome} — escolha 1</div>
          {opcoesSubescolha.map((opcao) => (
            <div
              key={opcao.nome}
              className={`opt-card ${selection.subescolhaEspecieEscolhida === opcao.nome ? 'selected' : ''}`}
              onClick={() => update({ subescolhaEspecieEscolhida: opcao.nome })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="opt-card-name">{opcao.nome}</span>
                {opcao.tipoDano && <span className="label">Dano {opcao.tipoDano}</span>}
              </div>
              {opcao.descricaoEfeito && <div className="opt-card-desc">{opcao.descricaoEfeito}</div>}
            </div>
          ))}
        </>
      )}

      <div className="section-title">Traços da espécie</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        {especie.traços.map((t) => (
          <InfoChip key={t.nome} nome={t.nome} descricao={descricaoTracoResolvida(t, especie, selection)} />
        ))}
      </div>

      {[...colisoesTruqueClasse, ...colisoesMagiaClasse].map((nome) => (
        <div key={nome} className="label" style={{ color: 'var(--warn)', marginBottom: 4 }}>
          ⚠️ {nome} — já possui - classe (a Espécie também concede de graça; volte e troque a escolha da Classe se
          quiser aproveitar as duas vagas)
        </div>
      ))}

      {tracoPericia && (
        <>
          <div className="section-title">{tracoPericia.nome} — perícia à escolha</div>
          {opcoesPericia.map((nome) => (
            <div key={nome} className="check-row" onClick={() => update({ periciaEspecieEscolhida: nome })}>
              <div className={`check-box ${selection.periciaEspecieEscolhida === nome ? 'checked' : ''}`} />
              <span className="check-label">{nome}</span>
              {jaConcedidas.pericias.has(nome) && (
                <span className="tag" style={{ marginLeft: 'auto' }}>
                  já possui - {jaConcedidas.pericias.get(nome)?.toLowerCase()}
                </span>
              )}
            </div>
          ))}
        </>
      )}

      {temTraco('versatil') && (
        <>
          <div className="section-title">Versátil — talento de Origem à escolha</div>
          <TelaEscolherTalento
            nivelAtual={1}
            atributosFinais={atributosFinais}
            categoria="Origem"
            talentosGeraisAtuais={[]}
            favoritos={[]}
            onToggleFavorito={() => {}}
            selecionado={selection.talentoEspecieEscolhido}
            onSelecionar={(id) => update({ talentoEspecieEscolhido: id })}
          />
        </>
      )}
    </>
  );
}
