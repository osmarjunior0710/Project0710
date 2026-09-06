import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { armazenamentoPersonagens } from '../../core/armazenamentoPersonagens';
import { ID_PERSONAGEM_DEMO } from '../../core/personagemDemo';
import { calcularPvMaximoNivel1 } from '../../core/calculoPersonagem';
import { classes } from '../../data/rulesets/dnd2024/classes';
import { subclasses } from '../../data/rulesets/dnd2024/subclasses';
import IconeClasse from '../components/IconeClasse';
import PersonagemTesteModal from './PersonagemTesteModal';
import styles from './CharacterList.module.css';

export default function CharacterList() {
  const navigate = useNavigate();
  const [, setVersao] = useState(0);
  /** Id do personagem com o botão de apagar "armado" — 1º toque arma
   * (botão vira "Confirmar" vermelho), 2º toque nesse mesmo botão
   * apaga de vez. Qualquer outro toque na tela desarma sem apagar. */
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [modalTesteAberto, setModalTesteAberto] = useState(false);

  const personagens = armazenamentoPersonagens.listar().map((p) => {
    const classeId = classes.find((c) => c.nome === p.selecao.classe)?.id ?? null;
    // Prioridade do ícone: imagem do jogador ([PH] — upload ainda não
    // existe, ver PENDENCIAS.md) > subclasse da classe de maior nível
    // (mais "evoluído") > classe de maior nível > empate de nível,
    // classe mais atual. Hoje só existe 1 classe por personagem, então
    // a comparação de "maior nível"/"mais atual" não tem o que
    // desempatar ainda — a lógica já fica pronta pra quando
    // multiclasse existir.
    const subclasseId = p.subclasseAtual
      ? (subclasses.find((s) => s.nome === p.subclasseAtual)?.id ?? null)
      : null;
    return {
      id: p.id,
      nome: p.selecao.nome || '(sem nome)',
      especie: p.selecao.especie ?? '—',
      classe: p.selecao.classe ?? '—',
      classeId,
      iconeId: subclasseId ?? classeId,
      nivel: p.nivel,
      pvAtual: p.pvAtual,
      // `p.pvMax` é o PV máximo real (acumulado nos Level Ups) — cai
      // pro cálculo de nível 1 só em personagens salvos antes desse
      // campo existir (mesmo padrão de fallback do FichaShell.tsx).
      // Sem isso, todo personagem acima do nível 1 mostrava um "PV
      // máximo" de nível 1 aqui, menor que o PV atual de verdade.
      pvMax: p.pvMax ?? calcularPvMaximoNivel1(p.selecao) ?? p.pvAtual,
    };
  });

  function onClickApagar(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirmandoId === id) {
      armazenamentoPersonagens.apagar(id);
      setConfirmandoId(null);
      setVersao((v) => v + 1);
    } else {
      setConfirmandoId(id);
    }
  }

  return (
    <div className={styles.screen} onClick={() => setConfirmandoId(null)}>
      <div className={styles.header}>
        <span className="back" onClick={() => navigate('/home')}>
          ←
        </span>
        <div>
          <div className={styles.headerTitle}>Seus personagens</div>
          <div className="label">atrelados à sua conta Google</div>
        </div>
      </div>

      <div className="btn" style={{ marginBottom: 10 }} onClick={() => setModalTesteAberto(true)}>
        🎲 Personagem de Teste — gera uma ficha completa na hora, pra testar rápido
      </div>

      {personagens.length === 0 && (
        <div className="box" style={{ padding: 16, textAlign: 'center' }} onClick={() => navigate('/wizard')}>
          <div style={{ marginBottom: 6 }}>Você ainda não tem nenhum personagem.</div>
          <div className="btn btn-primary" style={{ display: 'inline-block' }}>
            ＋ Criar personagem
          </div>
        </div>
      )}

      {personagens.map((c) => (
        <div key={c.id} className={`box ${styles.card}`} onClick={() => navigate(`/ficha/${c.id}`)}>
          <div className={styles.avatar}>{c.iconeId ? <IconeClasse id={c.iconeId} /> : '👤'}</div>
          <div className={styles.info}>
            <div className={styles.name}>{c.nome}</div>
            <div className={styles.meta}>
              {c.especie} · {c.classe} · Nível {c.nivel}
            </div>
          </div>
          <span className="tag">
            {c.pvAtual}/{c.pvMax} PV
          </span>
          {c.id === ID_PERSONAGEM_DEMO ? (
            <span className="tag" title="Personagem fixo de demonstração, não pode ser apagado">
              🔒 fixo
            </span>
          ) : (
            <div
              className={`${styles.deleteBtn} ${confirmandoId === c.id ? styles.deleteBtnConfirm : ''}`}
              onClick={(e) => onClickApagar(c.id, e)}
            >
              {confirmandoId === c.id ? 'Confirmar' : '🗑️'}
            </div>
          )}
        </div>
      ))}

      {modalTesteAberto && (
        <PersonagemTesteModal
          onFechar={() => setModalTesteAberto(false)}
          onCriado={(id) => navigate(`/ficha/${id}`)}
        />
      )}
    </div>
  );
}
