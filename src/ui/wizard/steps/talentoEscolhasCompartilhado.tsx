// Peças compartilhadas entre `TalentoOrigemEscolhasStep` (talento
// concedido pela Origem) e `TalentoEspecieEscolhasStep` (talento pego
// avulso pelo traço Versátil do Humano) — mesma UI, só muda de onde
// vem o talento e em qual "gaveta" do WizardSelection a escolha é
// salva (ver `core/personagem.ts`, comentário de
// `proficienciasTalentoEspecieEscolhidas`).

import type { ReactNode } from 'react';
import type { Atributo } from '../../../data/wizardFixtures';
import type { Talento } from '../../../data/rulesets/dnd2024/talentos';
import { gruposFerramenta } from '../../../data/rulesets/dnd2024/ferramentas';
import { magiasDaClasse } from '../../../data/rulesets/dnd2024/magias';
import { iconesMagia } from '../../../core/classificarMagia';
import { pericias } from '../../../data/rulesets/dnd2024/pericias';
import type { ConcessoesJaConcedidas, FonteConcessao } from '../../../core/concessoesJaConcedidas';
import MagiaComDescricao from '../../components/MagiaComDescricao';

export const todasFerramentas = Array.from(new Set(Object.values(gruposFerramenta).flat().map((f) => f.nome))).sort();

export const ATRIBUTOS_CONJURACAO: { atributo: Atributo; rotulo: string }[] = [
  { atributo: 'INT', rotulo: 'Inteligência' },
  { atributo: 'SAB', rotulo: 'Sabedoria' },
  { atributo: 'CAR', rotulo: 'Carisma' },
];

export function ProficienciaOuFerramentaEscolhas({
  talento,
  jaConcedidas,
  escolhidas,
  onToggle,
}: {
  talento: Talento;
  jaConcedidas: ConcessoesJaConcedidas;
  escolhidas: string[];
  onToggle: (nome: string) => void;
}) {
  const concede = talento.concedeProficiencias;
  const concedeFerramentaGrupo = talento.concedeFerramentaGrupo;
  const max = concede?.quantidade ?? concedeFerramentaGrupo!.quantidade;
  const opcoesFerramenta = concedeFerramentaGrupo
    ? (gruposFerramenta[concedeFerramentaGrupo.grupo] ?? []).map((f) => f.nome)
    : todasFerramentas;
  const mostrarPericias = concede?.tipos.includes('pericia') ?? false;
  const mostrarFerramentas = concedeFerramentaGrupo !== undefined || (concede?.tipos.includes('ferramenta') ?? false);
  const rotuloFerramentas = concedeFerramentaGrupo?.grupo ?? 'Ferramentas';

  function linha(nome: string, fonte: FonteConcessao | undefined) {
    return (
      <div key={nome} className="check-row" onClick={() => onToggle(nome)}>
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

export function IniciadoEmMagiaEscolhas({
  talento,
  lista,
  jaConcedidas,
  truquesEscolhidos,
  onToggleTruque,
  magiaEscolhida,
  onToggleMagia,
  atributoEscolhido,
  onEscolherAtributo,
  seletorLista,
}: {
  talento: Talento;
  /** Lista de classe fixa (Clérigo/Druida/Mago) que define de onde
   * vêm os truques/magia — vazio quando ainda não escolhida (só
   * acontece no caminho do Versátil, ver `seletorLista`). */
  lista: string;
  jaConcedidas: ConcessoesJaConcedidas;
  truquesEscolhidos: string[];
  onToggleTruque: (nome: string) => void;
  magiaEscolhida: string | null;
  onToggleMagia: (nome: string) => void;
  atributoEscolhido: Atributo | null;
  onEscolherAtributo: (atributo: Atributo) => void;
  /** UI extra pra escolher a lista de classe — só o caminho do
   * Versátil precisa disso (a Origem já fixa a lista sozinha). */
  seletorLista?: ReactNode;
}) {
  const truquesDaLista = lista ? magiasDaClasse(lista, 0) : [];
  const magiasNivel1DaLista = lista ? magiasDaClasse(lista, 1) : [];

  return (
    <>
      <div className="section-title">
        {talento.nome} {lista && `(${lista})`}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 4 }}>
        {talento.beneficios}
      </div>

      {seletorLista}

      {lista && (
        <>
          <div className="section-title">Truques — escolha 2 ({truquesEscolhidos.length}/2)</div>
          {truquesDaLista.map((m) => {
            const fonte = jaConcedidas.truques.get(m.nome);
            const outraFonte = fonte && fonte !== 'Talento' ? fonte : null;
            return (
              <div key={m.id} className="check-row" onClick={() => onToggleTruque(m.nome)}>
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
            Magia de 1º círculo — escolha 1 ({magiaEscolhida ? 1 : 0}/1)
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            Sempre preparada — conjura de graça 1x por Descanso Longo, senão gasta Espaço de Magia.
          </div>
          {magiasNivel1DaLista.map((m) => {
            const fonte = jaConcedidas.magias.get(m.nome);
            const outraFonte = fonte && fonte !== 'Talento' ? fonte : null;
            return (
              <div key={m.id} className="check-row" onClick={() => onToggleMagia(m.nome)}>
                <div className={`check-box ${magiaEscolhida === m.nome ? 'checked' : ''}`} />
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
            <div key={atributo} className="check-row" onClick={() => onEscolherAtributo(atributo)}>
              <div className={`check-box ${atributoEscolhido === atributo ? 'checked' : ''}`} />
              <span className="check-label">{rotulo}</span>
            </div>
          ))}
        </>
      )}
    </>
  );
}
