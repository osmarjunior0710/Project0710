import { useState } from 'react';
import { idiomas } from '../../../data/rulesets/dnd2024/idiomas';
import styles from '../levelup/LevelUpShell.module.css';

interface AprenderIdiomaShellProps {
  atuais: string[];
  onConfirmar: (novos: string[]) => void;
  onFechar: () => void;
}

/** "+ Aprender novo idioma" (aba Perfil) — tela cheia listando os
 * idiomas que o personagem AINDA não tem (mesmo agrupamento Comuns/
 * Raros do `LinguasStep.tsx` do wizard), pra marcar quantos quiser e
 * confirmar de uma vez. Sem limite de N (diferente do
 * `CompletarMagiasShell`, que tem um déficit fixo pra fechar) — depois
 * da criação do personagem, aprender idioma é livre. */
export default function AprenderIdiomaShell({ atuais, onConfirmar, onFechar }: AprenderIdiomaShellProps) {
  const [escolhidos, setEscolhidos] = useState<string[]>([]);

  function toggle(nome: string) {
    setEscolhidos((prev) => (prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome]));
  }

  const disponiveis = idiomas.filter((i) => !atuais.includes(i.nome));
  const comuns = disponiveis.filter((i) => i.tipo === 'Comum');
  const raras = disponiveis.filter((i) => i.tipo === 'Raro');

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>Aprender Novo Idioma</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="section-title">
          Escolha quantos quiser ({escolhidos.length} selecionado{escolhidos.length === 1 ? '' : 's'})
        </div>

        {comuns.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 8 }}>
              Comuns
            </div>
            {comuns.map((i) => (
              <div key={i.id} className="check-row" onClick={() => toggle(i.nome)}>
                <div className={`check-box ${escolhidos.includes(i.nome) ? 'checked' : ''}`} />
                <span className="check-label">{i.nome}</span>
              </div>
            ))}
          </>
        )}

        {raras.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 8 }}>
              Raros
            </div>
            {raras.map((i) => (
              <div key={i.id} className="check-row" onClick={() => toggle(i.nome)}>
                <div className={`check-box ${escolhidos.includes(i.nome) ? 'checked' : ''}`} />
                <span className="check-label">{i.nome}</span>
              </div>
            ))}
          </>
        )}

        {disponiveis.length === 0 && (
          <div className="label" style={{ marginTop: 8 }}>
            Você já conhece todos os idiomas do catálogo.
          </div>
        )}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={onFechar}>
          ← Cancelar
        </div>
        <div
          className={`btn btn-primary ${styles.pill}`}
          style={escolhidos.length > 0 ? undefined : { opacity: 0.5, pointerEvents: 'none' }}
          onClick={() => onConfirmar(escolhidos)}
        >
          Confirmar ✓
        </div>
      </div>
    </div>
  );
}
