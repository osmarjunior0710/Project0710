import { useState } from 'react';
import type { Pet } from '../../../core/pets';
import { caEfetivaPet, pvMaxEfetivoPet, atributoEfetivoPet } from '../../../core/pets';
import { criaturas, type Criatura } from '../../../data/rulesets/dnd2024/criaturas';
import LinearProgressBar from '../../components/LinearProgressBar';
import styles from './PetsTab.module.css';

const ATRIBUTOS_ORDEM = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as const;

interface AdicionarPetProps {
  titulo: string;
  botaoLabel: string;
  criaturasDisponiveis: Criatura[];
  onAdicionarPet: (nome: string, criaturaId: string) => void;
}

/** Mesmo formulário serve pro "Adicionar Pet" genérico (qualquer
 * criatura do catálogo) e pro "Convocar Familiar" restrito às formas
 * de uma Invocação Mística atual (ver `criaturasDisponiveis`) — só
 * muda a lista de opções e os textos, ver `PetsTab`. */
function AdicionarPet({ titulo, botaoLabel, criaturasDisponiveis, onAdicionarPet }: AdicionarPetProps) {
  const [nome, setNome] = useState('');
  const [criaturaId, setCriaturaId] = useState(criaturasDisponiveis[0]?.id ?? '');

  function confirmar() {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || !criaturaId) return;
    onAdicionarPet(nomeLimpo, criaturaId);
    setNome('');
  }

  return (
    <div className={`box ${styles.addBox}`}>
      <div className="label" style={{ marginBottom: 6 }}>
        {titulo}
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          placeholder="nome do pet..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <select className={styles.addSelect} value={criaturaId} onChange={(e) => setCriaturaId(e.target.value)}>
          {criaturasDisponiveis.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }} onClick={confirmar}>
        {botaoLabel}
      </div>
    </div>
  );
}

interface PetCardProps {
  pet: Pet;
  onRemover: () => void;
  onAlterarPv: (delta: number) => void;
}

function PetCard({ pet, onRemover, onAlterarPv }: PetCardProps) {
  const criatura = criaturas.find((c) => c.id === pet.criaturaId);
  if (!criatura) return null;
  const ca = caEfetivaPet(pet, criatura);
  const pvMax = pvMaxEfetivoPet(pet, criatura);
  const caAjustada = pet.ajustes?.ca !== undefined;
  const pvAjustado = pet.ajustes?.pvMax !== undefined;

  return (
    <div className={`box-solid ${styles.petCard}`}>
      <div className={styles.petHeader}>
        <div>
          <div className={styles.petNome}>{pet.nome}</div>
          <div className="label">
            {criatura.nome} · {criatura.tipo} · {criatura.tamanho}
          </div>
        </div>
        <div className={styles.removerBtn} onClick={onRemover}>
          ✕
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className="label">
          CA {ca}
          {caAjustada && <span className="tag">ajustado</span>}
        </div>
        <div className="label">
          PV {pet.pvAtual}/{pvMax}
          {pvAjustado && <span className="tag">ajustado</span>}
        </div>
      </div>
      <LinearProgressBar valor={pet.pvAtual} maximo={pvMax} />
      <div className={styles.hpBtnRow}>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-5)}>
          −5
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(-1)}>
          −1
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(1)}>
          +1
        </div>
        <div className={styles.hpBtnSmall} onClick={() => onAlterarPv(5)}>
          +5
        </div>
      </div>

      <div className={styles.atributosRow}>
        {ATRIBUTOS_ORDEM.map((a) => (
          <div key={a} className={styles.atributoBox}>
            <div className="label">
              {a}
              {pet.ajustes?.atributos?.[a] !== undefined && <span className="tag">•</span>}
            </div>
            <div className={styles.atributoValor}>{atributoEfetivoPet(pet, criatura, a)}</div>
          </div>
        ))}
      </div>

      <div className="label">Deslocamento: {criatura.deslocamento}</div>
      <div className="label">Sentidos: {criatura.sentidos}</div>
      {criatura.pericias && <div className="label">Perícias: {criatura.pericias}</div>}
      {criatura.tracos && (
        <div className={styles.textoLivre}>
          <strong>Traços.</strong> {criatura.tracos}
        </div>
      )}
      {criatura.acoes && (
        <div className={styles.textoLivre}>
          <strong>Ações.</strong> {criatura.acoes}
        </div>
      )}
      {criatura.acoesBonus && (
        <div className={styles.textoLivre}>
          <strong>Ações Bônus.</strong> {criatura.acoesBonus}
        </div>
      )}
      {criatura.reacoes && (
        <div className={styles.textoLivre}>
          <strong>Reações.</strong> {criatura.reacoes}
        </div>
      )}
    </div>
  );
}

interface PetsTabProps {
  pets: Pet[];
  /** Formas de Familiar elegíveis pra convocar via alguma Invocação
   * Mística atual (hoje só Pacto da Corrente do Bruxo, 8 formas) —
   * vazio = nenhuma, esconde a caixa "Convocar Familiar" (ver P3/P4
   * em EmDevB.md, `core/invocacoesFamiliar.ts`). */
  formasFamiliarElegiveis: Criatura[];
  onAdicionarPet: (nome: string, criaturaId: string, origemInvocacaoId?: string) => void;
  onRemoverPet: (id: string) => void;
  onAlterarPvPet: (id: string, delta: number) => void;
  /** Abre `AjustarPetShell` (P5) — pegar uma criatura do catálogo e
   * ajustar CA/PV/atributos antes de confirmar. */
  onAbrirAjustarPet: () => void;
}

// Único id de Invocação que concede Familiar hoje (ver
// `core/invocacoesFamiliar.ts`) — hardcoded aqui é seguro só porque é
// 1 fonte só; se uma 2ª aparecer, essa caixa precisa virar uma por
// fonte (cada uma sabendo seu próprio id) em vez de 1 genérica.
const ID_INVOCACAO_FAMILIAR = 'pacto-da-corrente';

/** Aba "Pets" — lista de pets/companheiros do personagem (Familiar,
 * montaria, Morto-Vivo do Necromante etc), em array desde o início
 * (ver EmDevB.md Fase P/P0). "Convocar Familiar" (restrito às formas
 * de uma Invocação Mística atual) e "Adicionar Pet" (qualquer criatura
 * do catálogo, manual) reaproveitam o mesmo formulário
 * (`AdicionarPet`), só com lista/textos diferentes — convocar de novo
 * substitui o familiar anterior da MESMA fonte (`origemInvocacaoId`),
 * nunca acumula 2 do Pacto da Corrente ao mesmo tempo. */
export default function PetsTab({
  pets,
  formasFamiliarElegiveis,
  onAdicionarPet,
  onRemoverPet,
  onAlterarPvPet,
  onAbrirAjustarPet,
}: PetsTabProps) {
  return (
    <div>
      <div className="section-title">Pets</div>
      {pets.length === 0 && (
        <div className="box" style={{ padding: 14, textAlign: 'center', color: 'var(--text-faint)', fontSize: 12 }}>
          Nenhum pet ainda.
        </div>
      )}
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onRemover={() => onRemoverPet(pet.id)} onAlterarPv={(delta) => onAlterarPvPet(pet.id, delta)} />
      ))}
      {formasFamiliarElegiveis.length > 0 && (
        <AdicionarPet
          titulo="🔮 Convocar Familiar (Pacto da Corrente) — escolha a forma"
          botaoLabel="Convocar Familiar"
          criaturasDisponiveis={formasFamiliarElegiveis}
          onAdicionarPet={(nome, criaturaId) => onAdicionarPet(nome, criaturaId, ID_INVOCACAO_FAMILIAR)}
        />
      )}
      <AdicionarPet
        titulo="Ganhou um pet/companheiro? Adiciona aqui."
        botaoLabel="+ Adicionar Pet"
        criaturasDisponiveis={criaturas}
        onAdicionarPet={onAdicionarPet}
      />
      <div className={`box ${styles.addBox}`} onClick={onAbrirAjustarPet} style={{ cursor: 'pointer', textAlign: 'center' }}>
        <div className="label">⚙️ Pet com atributos diferentes do padrão? Ajusta aqui.</div>
      </div>
    </div>
  );
}
