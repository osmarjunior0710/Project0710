import { useState } from 'react';
import type { Pet } from '../../../core/pets';
import { caCriatura, pvMaxCriatura } from '../../../core/criaturas';
import { criaturas } from '../../../data/rulesets/dnd2024/criaturas';
import LinearProgressBar from '../../components/LinearProgressBar';
import styles from './PetsTab.module.css';

const ATRIBUTOS_ORDEM = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as const;

function AdicionarPet({ onAdicionarPet }: { onAdicionarPet: (nome: string, criaturaId: string) => void }) {
  const [nome, setNome] = useState('');
  const [criaturaId, setCriaturaId] = useState(criaturas[0]?.id ?? '');

  function confirmar() {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || !criaturaId) return;
    onAdicionarPet(nomeLimpo, criaturaId);
    setNome('');
  }

  return (
    <div className={`box ${styles.addBox}`}>
      <div className="label" style={{ marginBottom: 6 }}>
        Ganhou um pet/companheiro? Adiciona aqui.
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          placeholder="nome do pet..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <select className={styles.addSelect} value={criaturaId} onChange={(e) => setCriaturaId(e.target.value)}>
          {criaturas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="btn btn-primary" style={{ marginTop: 8, textAlign: 'center' }} onClick={confirmar}>
        + Adicionar Pet
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
  const ca = caCriatura(criatura);
  const pvMax = pvMaxCriatura(criatura);

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
        <div className="label">CA {ca}</div>
        <div className="label">
          PV {pet.pvAtual}/{pvMax}
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
            <div className="label">{a}</div>
            <div className={styles.atributoValor}>{criatura.atributos[a]}</div>
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
  onAdicionarPet: (nome: string, criaturaId: string) => void;
  onRemoverPet: (id: string) => void;
  onAlterarPvPet: (id: string, delta: number) => void;
}

/** Aba "Pets" — lista de pets/companheiros do personagem (Familiar,
 * montaria, Morto-Vivo do Necromante etc), em array desde o início
 * (ver EmDevB.md Fase P/P0). Por enquanto o "ganhar um pet" é sempre
 * manual (qualquer criatura do catálogo) — a P3/P4 vão restringir isso
 * a uma lista elegível quando vier de uma característica de classe
 * específica (ex: Encontrar Familiar do Bruxo). */
export default function PetsTab({ pets, onAdicionarPet, onRemoverPet, onAlterarPvPet }: PetsTabProps) {
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
      <AdicionarPet onAdicionarPet={onAdicionarPet} />
    </div>
  );
}
