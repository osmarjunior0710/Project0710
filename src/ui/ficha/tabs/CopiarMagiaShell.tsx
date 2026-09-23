import { useState } from 'react';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { custoCopiarMagia, custoBaseCopiarMagia, type ModoCopiarMagia } from '../../../core/copiarMagia';
import { gastarMoedas, totalEmPO, type Moedas } from '../../../core/moedas';
import { IconeMoeda } from '../BolsaDeMoedas';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import styles from '../levelup/LevelUpShell.module.css';

interface CopiarMagiaShellProps {
  /** Catálogo completo de magias da classe (círculo 1+ — truque não
   * entra, a regra real só cobre "magia de 1º círculo ou superior"). */
  magiasDaClasse: Magia[];
  /** Círculo máximo que o personagem já pode preparar no nível atual —
   * a regra real só deixa copiar magia "nova" de um círculo que dá pra
   * preparar (ver sdd-mago-caracteristicas-base.md seção 1). Não filtra
   * o modo "reescrever" (livro já é só do que o jogador tem). */
  circuloMaximo: number;
  livroDeMagiasAtuais: string[];
  moedas: Moedas;
  onMudarMoedas: (m: Moedas) => void;
  onAdicionarMagiaAoLivro: (nome: string) => void;
  onFechar: () => void;
}

/** "Copiar Magia" (Mago — "Expandindo e Substituindo um Livro de
 * Magias", ver sdd/sdd-mago-caracteristicas-base.md): 2 modos —
 * "nova" copia uma magia encontrada pro Livro de Magias de verdade
 * (soma em `livroDeMagiasAtuais`); "reescrever" copia uma magia já
 * conhecida pra um livro reserva (só desconta o custo, não muda nada
 * no Livro — o app não modela um 2º livro). Mesmo padrão de tela cheia
 * de `EscolherCirculoShell` (`LevelUpShell.module.css`). */
export default function CopiarMagiaShell({
  magiasDaClasse,
  circuloMaximo,
  livroDeMagiasAtuais,
  moedas,
  onMudarMoedas,
  onAdicionarMagiaAoLivro,
  onFechar,
}: CopiarMagiaShellProps) {
  const [modo, setModo] = useState<ModoCopiarMagia | null>(null);
  const [magiaSelecionada, setMagiaSelecionada] = useState<Magia | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const lista =
    modo === null
      ? []
      : magiasDaClasse
          .filter((m) => m.circulo >= 1)
          .filter((m) => (modo === 'nova' ? m.circulo <= circuloMaximo : true))
          .filter((m) => (modo === 'nova' ? !livroDeMagiasAtuais.includes(m.nome) : livroDeMagiasAtuais.includes(m.nome)))
          .sort((a, b) => a.circulo - b.circulo || a.nome.localeCompare(b.nome, 'pt-BR'));
  const circulos = [...new Set(lista.map((m) => m.circulo))].sort((a, b) => a - b);

  const custo = magiaSelecionada && modo ? custoCopiarMagia(magiaSelecionada.circulo, modo) : null;
  const podePagar = custo !== null && totalEmPO(moedas) >= custo.po;

  function confirmar() {
    if (!custo || !magiaSelecionada || !modo || !podePagar) return;
    const resultado = gastarMoedas(moedas, 'po', custo.po);
    if (!resultado.ok) return;
    onMudarMoedas(resultado.moedas);
    if (modo === 'nova') onAdicionarMagiaAoLivro(magiaSelecionada.nome);
    setFeedback(
      modo === 'nova'
        ? `${magiaSelecionada.nome} copiada pro seu Livro de Magias.`
        : `${magiaSelecionada.nome} copiada pra um livro reserva.`,
    );
    setMagiaSelecionada(null);
  }

  if (modo === null) {
    const baseNova = custoBaseCopiarMagia('nova');
    const baseReescrever = custoBaseCopiarMagia('reescrever');
    return (
      <div className={styles.screen}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.stepName}>Copiar Magia</div>
          </div>
        </div>
        <div className={styles.body}>
          <div className="label" style={{ marginBottom: 8 }}>
            Escolha o que quer fazer. O "+" no custo é o mínimo (1º círculo) — o valor real escala com o círculo da
            magia escolhida.
          </div>
          <div className="opt-card" onClick={() => setModo('nova')}>
            <div className="opt-card-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              📜 Copiar Magia ({baseNova.horas}h + <IconeMoeda tipo="po" tamanho={16} />
              {baseNova.po}+)
            </div>
            <div className="opt-card-desc">
              Copia uma magia encontrada (pergaminho/outro livro) pro seu Livro de Magias.
            </div>
          </div>
          <div className="opt-card" onClick={() => setModo('reescrever')}>
            <div className="opt-card-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              🖋️ Reescrever Magia ({baseReescrever.horas}h + <IconeMoeda tipo="po" tamanho={16} />
              {baseReescrever.po}+)
            </div>
            <div className="opt-card-desc">Copia uma magia que você já tem pra um livro reserva (backup).</div>
          </div>
        </div>
        <div className={styles.navLayer}>
          <div className={`btn ${styles.pill}`} onClick={onFechar}>
            ← Voltar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>{modo === 'nova' ? 'Copiar Magia' : 'Reescrever Magia'}</div>
        </div>
      </div>
      <div className={styles.body}>
        {feedback && (
          <div className="label" style={{ marginBottom: 8, color: 'var(--good)' }}>
            {feedback}
          </div>
        )}
        {lista.length === 0 ? (
          <div className="label">
            {modo === 'nova'
              ? 'Todas as magias elegíveis já estão no seu Livro de Magias.'
              : 'Você ainda não tem nenhuma magia no Livro de Magias.'}
          </div>
        ) : (
          circulos.map((circulo) => (
            <div key={circulo}>
              <div className="section-title">{circulo}º Círculo</div>
              {lista
                .filter((m) => m.circulo === circulo)
                .map((m) => (
                  <div
                    key={m.id}
                    className={`opt-card ${magiaSelecionada?.id === m.id ? 'selected' : ''}`}
                    onClick={() => setMagiaSelecionada(m)}
                  >
                    <div className="opt-card-name">
                      <MagiaComDescricao magia={m} />
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={() => setModo(null)}>
          ← Voltar
        </div>
        {magiaSelecionada && custo && (
          <div
            className={`btn btn-primary ${styles.pill}`}
            style={{
              // Sem dinheiro pra essa magia = mesmo tratamento "cinza,
              // bloqueado" do estado Usada de Combat (DECISOES-COMBATE.md
              // "Combate — estado Ativo vs Usada") — não opacidade.
              // Pointer-events continua 'auto' de propósito: o pill fica
              // sobre os FABs de Descanso/Dado (canto inferior) e um
              // 'none' aqui deixaria o toque VAZAR pra eles por trás —
              // o próprio `confirmar()` já barra a ação quando !podePagar.
              borderColor: podePagar ? undefined : 'var(--line)',
              background: podePagar ? undefined : 'var(--panel2)',
              color: podePagar ? undefined : 'var(--text-faint)',
              cursor: podePagar ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={confirmar}
          >
            OK — {custo.horas}h + <IconeMoeda tipo="po" tamanho={16} />
            {custo.po}
          </div>
        )}
      </div>
    </div>
  );
}
