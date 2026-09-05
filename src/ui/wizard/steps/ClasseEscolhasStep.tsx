import { classes } from '../../../data/rulesets/dnd2024/classes';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { especies } from '../../../data/rulesets/dnd2024/especies';
import { concessoesJaConcedidas } from '../../../core/concessoesJaConcedidas';
import { caracteristicasClasse } from '../../../data/rulesets/dnd2024/caracteristicasClasse';
import { estilosDeLuta } from '../../../data/rulesets/dnd2024/estilosDeLuta';
import { proficienciasIniciaisClasse } from '../../../data/rulesets/dnd2024/classesProficienciasIniciais';
import { proficienciasArmaArmaduraClasse } from '../../../data/rulesets/dnd2024/proficienciasArmaArmaduraClasse';
import { gruposFerramenta } from '../../../data/rulesets/dnd2024/ferramentas';
import { magiasDaClasse } from '../../../data/rulesets/dnd2024/magias';
import {
  invocacoesElegiveisAteNivel,
  invocacaoRequeridaDe,
  invocacaoBloqueadaPorRequisitoAusente,
  invocacoesQueDependemDe,
} from '../../../core/invocacoesMisticas';
import { buscarDescricaoItem } from '../../../data/rulesets/dnd2024/buscarDescricaoItem';
import { buscarDescricaoMaestria } from '../../../data/rulesets/dnd2024/propriedadesMaestria';
import { armasParaMaestria, quantidadeMaestriaEmArma } from '../../../core/maestriaArma';
import { valorRecursoClasse } from '../../../core/recursosClasse';
import { temEstiloDeLutaTrocavel } from '../../../core/levelUp';
import { iconesMagia } from '../../../core/classificarMagia';
import ItemComDescricao from '../../components/ItemComDescricao';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TextoComMagias from '../../components/TextoComMagias';
import InfoChip from '../../components/InfoChip';
import styles from './ClasseEscolhasStep.module.css';
import type { StepProps } from './StepProps';

function rotuloItem(it: { nome: string; quantidade: number; unidade: string | null }): string {
  if (it.quantidade <= 1) return it.nome;
  return it.unidade ? `${it.nome} (${it.quantidade} ${it.unidade})` : `${it.quantidade}× ${it.nome}`;
}

export default function ClasseEscolhasStep({ selection, update }: StepProps) {
  const classe = classes.find((c) => c.nome === selection.classe);

  if (!classe) {
    return <div className="label">Volte e selecione uma classe primeiro.</div>;
  }

  const proficiencias = proficienciasIniciaisClasse[classe.id];
  // Só relevante se o jogador voltou aqui depois de já ter passado por
  // Origem/Espécie (ordem normal do wizard é Classe ANTES das duas) —
  // sem isso, os Maps simplesmente vêm vazios pra essas 2 fontes.
  const origemAtual = origens.find((o) => o.nome === selection.origem);
  const especieAtual = especies.find((e) => e.nome === selection.especie);
  const jaConcedidas = concessoesJaConcedidas(selection, origemAtual, especieAtual);
  const profArmaArmadura = proficienciasArmaArmaduraClasse.find((p) => p.classe === classe.nome);
  const caracteristicasNivel1 = caracteristicasClasse.filter((c) => c.classe === classe.nome && c.nivel === 1);
  const qtdMaestria = quantidadeMaestriaEmArma(classe, 1);
  const armasMaestria = qtdMaestria > 0 ? armasParaMaestria(classe) : [];
  const temEstiloDeLuta = temEstiloDeLutaTrocavel(classe, 1);
  const maxPericias = proficiencias?.periciasEscolha.quantidade ?? 0;
  const opcoesFerramenta = proficiencias?.ferramentasEscolha
    ? (gruposFerramenta[proficiencias.ferramentasEscolha.grupo] ?? [])
    : [];
  const maxFerramentas = proficiencias?.ferramentasEscolha?.quantidade ?? 0;

  // Truques/Magias Preparadas — só existem pra classes conjuradoras
  // (0 pras que não têm esses recursos, ex: Guerreiro). Nível 1 fixo
  // aqui porque é a criação do personagem.
  const maxTruques = valorRecursoClasse(classe, 'Truques Conhecidos', 1);
  const maxMagiasPreparadas = valorRecursoClasse(classe, 'Magias Preparadas', 1);
  const truquesDaClasse = maxTruques > 0 ? magiasDaClasse(classe.nome, 0) : [];
  // Nível 1 só pode preparar magias de 1º círculo (livro: "escolha
  // quatro magias de 1º círculo") — magias de círculo maior entram
  // conforme o personagem sobe de nível, não na criação.
  const magiasNivel1 = maxMagiasPreparadas > 0 ? magiasDaClasse(classe.nome, 1) : [];

  // Invocações Místicas (Bruxo) — Fase 1 (ver PENDENCIAS.md "Bruxo —
  // Invocações Místicas Fase 2"): só catálogo + escolha, sem checar
  // dependência entre invocações nem aplicar mecânica ainda. Na
  // criação (nível 1), só entram as que não pedem nível mínimo — as
  // com pré-requisito de nível maior ficam pro Level Up.
  const maxInvocacoes = valorRecursoClasse(classe, 'Invocações Místicas', 1);
  const invocacoesElegiveis = maxInvocacoes > 0 ? invocacoesElegiveisAteNivel(1) : [];

  function toggleEstiloDeLuta(nome: string) {
    update({ estiloDeLutaEscolhido: selection.estiloDeLutaEscolhido === nome ? null : nome });
  }

  function toggleMaestriaArma(nome: string) {
    const atual = selection.maestriaArmaEscolhida;
    const i = atual.indexOf(nome);
    if (i > -1) {
      update({ maestriaArmaEscolhida: atual.filter((x) => x !== nome) });
    } else if (atual.length < qtdMaestria) {
      update({ maestriaArmaEscolhida: [...atual, nome] });
    }
  }

  function togglePericia(nome: string) {
    const i = selection.periciasClasseEscolhidas.indexOf(nome);
    if (i > -1) {
      update({ periciasClasseEscolhidas: selection.periciasClasseEscolhidas.filter((x) => x !== nome) });
    } else if (selection.periciasClasseEscolhidas.length < maxPericias) {
      update({ periciasClasseEscolhidas: [...selection.periciasClasseEscolhidas, nome] });
    }
  }

  function toggleFerramenta(nome: string) {
    const atual = selection.ferramentasClasseEscolhidas;
    const i = atual.indexOf(nome);
    if (i > -1) {
      update({ ferramentasClasseEscolhidas: atual.filter((x) => x !== nome) });
    } else if (atual.length < maxFerramentas) {
      update({ ferramentasClasseEscolhidas: [...atual, nome] });
    }
  }

  function toggleTruque(nome: string) {
    const atual = selection.truquesEscolhidos;
    const i = atual.indexOf(nome);
    if (i > -1) {
      update({ truquesEscolhidos: atual.filter((x) => x !== nome) });
    } else if (atual.length < maxTruques) {
      update({ truquesEscolhidos: [...atual, nome] });
    }
  }

  function toggleInvocacao(id: string) {
    const atual = selection.invocacoesMisticasEscolhidas;
    const i = atual.indexOf(id);
    if (i > -1) {
      if (invocacoesQueDependemDe(id, atual).length > 0) return;
      update({ invocacoesMisticasEscolhidas: atual.filter((x) => x !== id) });
      return;
    }
    const inv = invocacoesElegiveis.find((c) => c.id === id);
    if (inv && invocacaoBloqueadaPorRequisitoAusente(inv, atual)) return;
    if (atual.length < maxInvocacoes) {
      update({ invocacoesMisticasEscolhidas: [...atual, id] });
    }
  }

  function toggleMagiaPreparada(nome: string) {
    const atual = selection.magiasPreparadasEscolhidas;
    const i = atual.indexOf(nome);
    if (i > -1) {
      update({ magiasPreparadasEscolhidas: atual.filter((x) => x !== nome) });
    } else if (atual.length < maxMagiasPreparadas) {
      update({ magiasPreparadasEscolhidas: [...atual, nome] });
    }
  }

  return (
    <>
      <div className="section-title">{classe.nome}</div>
      <div className="summary-row">
        <span>Atributo Primário</span>
        <span>{classe.atributoPrimario}</span>
      </div>
      <div className="summary-row">
        <span>Dado de Vida</span>
        <span>{classe.dadoDeVida}</span>
      </div>
      <div className="summary-row">
        <span>Salvaguardas</span>
        <span>{classe.salvaguardas.join(' e ')}</span>
      </div>
      {profArmaArmadura && (
        <>
          <div className="summary-row">
            <span>Proficiência com Armas</span>
            <span>{profArmaArmadura.proficienciaArmas}</span>
          </div>
          <div className="summary-row">
            <span>Treinamento com Armadura</span>
            <span>{profArmaArmadura.treinamentoArmadura}</span>
          </div>
        </>
      )}

      <div className="section-title">Características de nível 1</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        {caracteristicasNivel1
          .filter((c) => c.nome !== 'Estilo de Luta')
          .map((c) => (
            <InfoChip key={c.nome} nome={c.nome} descricao={c.descricao} />
          ))}
      </div>

      {temEstiloDeLuta && (
        <>
          <div className="section-title">Estilo de Luta — escolha 1</div>
          {estilosDeLuta.map((e) => (
            <div
              key={e.id}
              className={`opt-card ${selection.estiloDeLutaEscolhido === e.nome ? 'selected' : ''}`}
              style={{ padding: '10px 12px' }}
              onClick={() => toggleEstiloDeLuta(e.nome)}
            >
              <div className="opt-card-name">{e.nome}</div>
              <div className="opt-card-desc">{e.beneficios}</div>
            </div>
          ))}
        </>
      )}

      {qtdMaestria > 0 && (
        <>
          <div className="section-title">
            Maestria em Arma — escolha {qtdMaestria} ({selection.maestriaArmaEscolhida.length}/{qtdMaestria})
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            você troca 1 dessas armas a cada Descanso Longo, direto na aba Perfil.
          </div>
          {armasMaestria.map((a) => (
            <div key={a.id} className={styles.maestriaRow} onClick={() => toggleMaestriaArma(a.nome)}>
              <div
                className={`check-box ${styles.maestriaCheckBox} ${selection.maestriaArmaEscolhida.includes(a.nome) ? 'checked' : ''}`}
              />
              <div className={styles.maestriaText}>
                <span className={styles.maestriaNome}>{a.nome}</span>
                <span className={styles.maestriaDetalhe}>
                  {a.dano} · <ItemComDescricao nome={a.maestria} descricao={buscarDescricaoMaestria(a.maestria)} variante="icone" />
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {maxInvocacoes > 0 && (
        <>
          <div className="section-title">
            Invocações Místicas — escolha {maxInvocacoes} ({selection.invocacoesMisticasEscolhidas.length}/{maxInvocacoes})
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            [PH] sem efeito mecânico ainda — só o texto de regra.
          </div>
          {invocacoesElegiveis.map((inv) => {
            const marcado = selection.invocacoesMisticasEscolhidas.includes(inv.id);
            const requerida = invocacaoRequeridaDe(inv);
            const bloqueadaPorRequisito =
              !marcado && invocacaoBloqueadaPorRequisitoAusente(inv, selection.invocacoesMisticasEscolhidas);
            const travadaPorDependente =
              marcado && invocacoesQueDependemDe(inv.id, selection.invocacoesMisticasEscolhidas).length > 0;
            return (
              <div
                key={inv.id}
                className="opt-card"
                style={{
                  padding: '10px 12px',
                  cursor: bloqueadaPorRequisito ? 'default' : 'pointer',
                  opacity: bloqueadaPorRequisito ? 0.45 : 1,
                  pointerEvents: bloqueadaPorRequisito ? 'none' : 'auto',
                }}
                onClick={() => toggleInvocacao(inv.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className={`check-box ${marcado ? 'checked' : ''}`} />
                  <span className="opt-card-name">{inv.nome}</span>
                </div>
                <div className="opt-card-desc">
                  <TextoComMagias texto={inv.beneficios} nomesMagias={inv.magiasMencionadas} />
                </div>
                {requerida && (
                  <div style={{ color: bloqueadaPorRequisito ? 'var(--danger)' : 'var(--text-faint)', fontSize: 11 }}>
                    Requer: {requerida.nome}
                    {bloqueadaPorRequisito && ' — marque essa primeiro'}
                  </div>
                )}
                {travadaPorDependente && (
                  <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                    🔒 não pode remover — é requisito de outra invocação que você mantém
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {proficiencias && (
        <>
          <div className="section-title">
            Perícias — escolha {maxPericias} ({selection.periciasClasseEscolhidas.length}/{maxPericias})
          </div>
          {proficiencias.periciasEscolha.opcoes.map((nome) => {
            const fonte = jaConcedidas.pericias.get(nome);
            const outraFonte = fonte && fonte !== 'Classe' ? fonte : null;
            return (
              <div key={nome} className="check-row" onClick={() => togglePericia(nome)}>
                <div className={`check-box ${selection.periciasClasseEscolhidas.includes(nome) ? 'checked' : ''}`} />
                <span className="check-label">{nome}</span>
                {outraFonte && (
                  <span className="tag" style={{ marginLeft: 'auto' }}>
                    já possui - {outraFonte.toLowerCase()}
                  </span>
                )}
              </div>
            );
          })}

          {maxFerramentas > 0 && (
            <>
              <div className="section-title">
                Ferramentas — escolha {maxFerramentas} ({selection.ferramentasClasseEscolhidas.length}/{maxFerramentas})
              </div>
              {opcoesFerramenta.map((f) => {
                const fonte = jaConcedidas.ferramentas.get(f.nome);
                const outraFonte = fonte && fonte !== 'Classe' ? fonte : null;
                return (
                  <div key={f.nome} className="check-row" onClick={() => toggleFerramenta(f.nome)}>
                    <div className={`check-box ${selection.ferramentasClasseEscolhidas.includes(f.nome) ? 'checked' : ''}`} />
                    <span className="check-label">{f.nome}</span>
                    {outraFonte && (
                      <span className="tag" style={{ marginLeft: 'auto' }}>
                        já possui - {outraFonte.toLowerCase()}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {maxTruques > 0 && (
            <>
              <div className="section-title">
                Truques — escolha {maxTruques} ({selection.truquesEscolhidos.length}/{maxTruques})
              </div>
              {truquesDaClasse.map((m) => {
                const fonte = jaConcedidas.truques.get(m.nome);
                const outraFonte = fonte && fonte !== 'Classe' ? fonte : null;
                return (
                  <div key={m.id} className="check-row" onClick={() => toggleTruque(m.nome)}>
                    <div className={`check-box ${selection.truquesEscolhidos.includes(m.nome) ? 'checked' : ''}`} />
                    <span className="check-label">
                      <MagiaComDescricao magia={m} rotulo={m.nome} />
                      {' '}{iconesMagia(m)}
                    </span>
                    {outraFonte && (
                      <span className="tag" style={{ marginLeft: 'auto' }}>
                        já possui - {outraFonte.toLowerCase()}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {maxMagiasPreparadas > 0 && (
            <>
              <div className="section-title">
                Magias Preparadas (1º círculo) — escolha {maxMagiasPreparadas} (
                {selection.magiasPreparadasEscolhidas.length}/{maxMagiasPreparadas})
              </div>
              <div className="label" style={{ marginBottom: 4 }}>
                sugestão do livro: Enfeitiçar Pessoa, Leque Cromático, Palavra Curativa e Sussurros Dissonantes.
              </div>
              {magiasNivel1.map((m) => {
                const fonte = jaConcedidas.magias.get(m.nome);
                const outraFonte = fonte && fonte !== 'Classe' ? fonte : null;
                return (
                  <div key={m.id} className="check-row" onClick={() => toggleMagiaPreparada(m.nome)}>
                    <div className={`check-box ${selection.magiasPreparadasEscolhidas.includes(m.nome) ? 'checked' : ''}`} />
                    <span className="check-label">
                      <MagiaComDescricao magia={m} rotulo={m.nome} />
                      {' '}{iconesMagia(m)}
                    </span>
                    {outraFonte && (
                      <span className="tag" style={{ marginLeft: 'auto' }}>
                        já possui - {outraFonte.toLowerCase()}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          <div className="section-title">Equipamento inicial — escolha uma opção</div>
          {proficiencias.equipamentoInicial.map((opcao) => (
            <div
              key={opcao.rotulo}
              className={`opt-card ${selection.equipamentoClasseEscolhido === opcao.rotulo ? 'selected' : ''}`}
              onClick={() => update({ equipamentoClasseEscolhido: opcao.rotulo as 'A' | 'B' | 'C' })}
            >
              <div className="opt-card-name">Opção {opcao.rotulo}</div>
              <div className="opt-card-desc">
                {opcao.itens.map((it, i) => (
                  <span key={it.nome}>
                    {i > 0 && ', '}
                    <ItemComDescricao nome={it.nome} descricao={buscarDescricaoItem(it.nome)} rotulo={rotuloItem(it)} />
                  </span>
                ))}
                {opcao.itens.length > 0 && opcao.ouro > 0 && `, ${opcao.ouro} PO restantes`}
                {opcao.itens.length === 0 && `${opcao.ouro} PO pra gastar como quiser na Loja`}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
