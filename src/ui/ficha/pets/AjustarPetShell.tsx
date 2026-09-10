import { useState } from 'react';
import { criaturas } from '../../../data/rulesets/dnd2024/criaturas';
import { caCriatura, pvMaxCriatura, valorAtributoCriatura } from '../../../core/criaturas';
import { calcularAjustesPet, type AjustesPet } from '../../../core/pets';
import type { Atributo } from '../../../data/wizardFixtures';
import levelUpStyles from '../levelup/LevelUpShell.module.css';
import styles from './AjustarPetShell.module.css';

const ATRIBUTOS_ORDEM = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as const satisfies readonly Atributo[];

interface AjustarPetShellProps {
  onConfirmar: (nome: string, criaturaId: string, ajustes: AjustesPet) => void;
  onFechar: () => void;
}

/** "Pet avulso" (Fase P/P5, pedido do Osmar) — pega uma criatura do
 * catálogo como ponto de partida e deixa ajustar CA/PV
 * máximo/atributos antes de confirmar (ex: "é um Lobo, mas mais
 * forte"). Não é um stat block livre do zero — todo o resto (nome da
 * espécie, tipo, tamanho, deslocamento, sentidos, ações...) continua
 * vindo da criatura base. `calcularAjustesPet` descarta os campos que
 * ficaram iguais ao original, então só o que foi de verdade alterado
 * vira `ajustes` salvo no pet. */
export default function AjustarPetShell({ onConfirmar, onFechar }: AjustarPetShellProps) {
  const [nome, setNome] = useState('');
  const [criaturaId, setCriaturaId] = useState(criaturas[0]?.id ?? '');
  const criatura = criaturas.find((c) => c.id === criaturaId) ?? criaturas[0];

  const [ca, setCa] = useState(caCriatura(criatura));
  const [pvMax, setPvMax] = useState(pvMaxCriatura(criatura));
  const [atributos, setAtributos] = useState<Record<Atributo, number>>(() => {
    const valores = {} as Record<Atributo, number>;
    for (const a of ATRIBUTOS_ORDEM) valores[a] = valorAtributoCriatura(criatura, a);
    return valores;
  });

  function trocarCriatura(novoId: string) {
    const nova = criaturas.find((c) => c.id === novoId);
    if (!nova) return;
    setCriaturaId(novoId);
    setCa(caCriatura(nova));
    setPvMax(pvMaxCriatura(nova));
    const valores = {} as Record<Atributo, number>;
    for (const a of ATRIBUTOS_ORDEM) valores[a] = valorAtributoCriatura(nova, a);
    setAtributos(valores);
  }

  const nomeValido = nome.trim().length > 0;

  function confirmar() {
    if (!nomeValido) return;
    const ajustes = calcularAjustesPet(criatura, { ca, pvMax, atributos });
    onConfirmar(nome.trim(), criaturaId, ajustes);
  }

  return (
    <div className={levelUpStyles.screen}>
      <div className={levelUpStyles.header}>
        <div className={levelUpStyles.titleRow}>
          <div className={levelUpStyles.stepName}>Ajustar Pet</div>
        </div>
      </div>

      <div className={levelUpStyles.body}>
        <div className="label" style={{ marginBottom: 8 }}>
          Pegue uma criatura do catálogo como base e ajuste CA, PV máximo e atributos — útil pra um pet que veio de
          fora do fluxo normal (mestre deu, comprou etc.) com stats diferentes do padrão.
        </div>

        <div className="section-title">Nome do pet</div>
        <input className={styles.input} placeholder="nome do pet..." value={nome} onChange={(e) => setNome(e.target.value)} />

        <div className="section-title" style={{ marginTop: 12 }}>
          Criatura base
        </div>
        <select className={styles.select} value={criaturaId} onChange={(e) => trocarCriatura(e.target.value)}>
          {criaturas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <div className="section-title" style={{ marginTop: 12 }}>
          CA / PV máximo
        </div>
        <div className={styles.numRow}>
          <label className={styles.numField}>
            <span className="label">CA</span>
            <input
              className={styles.input}
              type="number"
              value={ca}
              onChange={(e) => setCa(Number(e.target.value))}
            />
          </label>
          <label className={styles.numField}>
            <span className="label">PV máximo</span>
            <input
              className={styles.input}
              type="number"
              value={pvMax}
              onChange={(e) => setPvMax(Math.max(1, Number(e.target.value)))}
            />
          </label>
        </div>

        <div className="section-title" style={{ marginTop: 12 }}>
          Atributos
        </div>
        <div className={styles.atributosGrid}>
          {ATRIBUTOS_ORDEM.map((a) => (
            <label key={a} className={styles.numField}>
              <span className="label">{a}</span>
              <input
                className={styles.input}
                type="number"
                min={1}
                max={30}
                value={atributos[a]}
                onChange={(e) => setAtributos((prev) => ({ ...prev, [a]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>
      </div>

      <div className={levelUpStyles.navLayer}>
        <div className={`btn ${levelUpStyles.pill}`} onClick={onFechar}>
          ← Cancelar
        </div>
        <div
          className={`btn btn-primary ${levelUpStyles.pill}`}
          style={nomeValido ? undefined : { opacity: 0.5, pointerEvents: 'none' }}
          onClick={confirmar}
        >
          Confirmar ✓
        </div>
      </div>
    </div>
  );
}
