// Primeiro passo do fluxo de Level Up quando há multiclasse envolvida —
// ver EmDevB.md (Fase M) e SDD Multiclasse (seção 12). Só aparece
// quando `deveEscolherClasseNoLevelUp` (core/multiclasse.ts) diz que
// existe alguma escolha de verdade (2+ opções); personagem com 1
// classe só e nenhuma outra elegível nunca vê esta tela, segue direto
// pro `LevelUpShell` de sempre.
//
// Escolher uma classe NOVA (Nível 0 → 1) que dá perícia/ferramenta à
// escolha ao multiclassar (SDD seção 6 — só o Bardo entre as 4 classes
// implementadas hoje) mostra uma 2ª etapa dentro desta mesma tela
// antes de confirmar; escolher uma classe já possuída, ou uma nova sem
// nada à escolha (Guerreiro/Bruxo/Mago), confirma direto.

import { useState } from 'react';
import type { OpcaoLevelUp } from '../../../core/multiclasse';
import { proficienciasEntradaMulticlasse } from '../../../data/rulesets/dnd2024/proficienciasEntradaMulticlasse';
import { proficienciasIniciaisClasse } from '../../../data/rulesets/dnd2024/classesProficienciasIniciais';
import { gruposFerramenta } from '../../../data/rulesets/dnd2024/ferramentas';
import { classes as catalogoClasses } from '../../../data/rulesets/dnd2024/classes';
import IconeClasse from '../../components/IconeClasse';
import styles from './LevelUpShell.module.css';

export interface ResultadoEscolhaClasseLevelUp {
  classeEscolhida: string;
  periciasEscolhidas: string[] | null;
  ferramentasEscolhidas: string[] | null;
}

interface EscolherClasseLevelUpProps {
  opcoes: OpcaoLevelUp[];
  classePadrao: string;
  onFechar: () => void;
  onConfirmar: (resultado: ResultadoEscolhaClasseLevelUp) => void;
}

export default function EscolherClasseLevelUp({ opcoes, classePadrao, onFechar, onConfirmar }: EscolherClasseLevelUpProps) {
  const [classeSelecionada, setClasseSelecionada] = useState(
    opcoes.find((o) => o.classe === classePadrao)?.classe ?? opcoes[0].classe,
  );
  const [fase, setFase] = useState<'classe' | 'extras'>('classe');
  const [periciasEscolhidas, setPericiasEscolhidas] = useState<string[]>([]);
  const [ferramentasEscolhidas, setFerramentasEscolhidas] = useState<string[]>([]);

  const opcaoAtual = opcoes.find((o) => o.classe === classeSelecionada)!;
  const ehClasseNova = opcaoAtual.nivelAtual === 0;
  const entradaMulticlasse = ehClasseNova ? proficienciasEntradaMulticlasse.find((p) => p.classe === classeSelecionada) : undefined;
  const precisaDeExtras = Boolean(entradaMulticlasse?.periciaAEscolha || entradaMulticlasse?.ferramentaAEscolha);

  const classeIdSelecionada = catalogoClasses.find((c) => c.nome === classeSelecionada)?.id;
  const proficienciasNivel1 = classeIdSelecionada ? proficienciasIniciaisClasse[classeIdSelecionada] : undefined;
  const maxPericias = entradaMulticlasse?.periciaAEscolha?.quantidade ?? 0;
  const opcoesPericia = proficienciasNivel1?.periciasEscolha.opcoes ?? [];
  const maxFerramentas = entradaMulticlasse?.ferramentaAEscolha?.quantidade ?? 0;
  const opcoesFerramenta = entradaMulticlasse?.ferramentaAEscolha
    ? (gruposFerramenta[entradaMulticlasse.ferramentaAEscolha.grupo] ?? [])
    : [];

  function togglePericia(nome: string) {
    setPericiasEscolhidas((prev) => {
      if (prev.includes(nome)) return prev.filter((x) => x !== nome);
      if (prev.length >= maxPericias) return prev;
      return [...prev, nome];
    });
  }

  function toggleFerramenta(nome: string) {
    setFerramentasEscolhidas((prev) => {
      if (prev.includes(nome)) return prev.filter((x) => x !== nome);
      if (prev.length >= maxFerramentas) return prev;
      return [...prev, nome];
    });
  }

  function confirmar() {
    onConfirmar({
      classeEscolhida: classeSelecionada,
      periciasEscolhidas: maxPericias > 0 ? periciasEscolhidas : null,
      ferramentasEscolhidas: maxFerramentas > 0 ? ferramentasEscolhidas : null,
    });
  }

  function avancar() {
    if (fase === 'classe') {
      if (precisaDeExtras) {
        setFase('extras');
      } else {
        confirmar();
      }
      return;
    }
    confirmar();
  }

  function voltar() {
    if (fase === 'extras') {
      setFase('classe');
      return;
    }
    onFechar();
  }

  const extrasValido = periciasEscolhidas.length === maxPericias && ferramentasEscolhidas.length === maxFerramentas;
  const podeAvancar = fase === 'classe' ? true : extrasValido;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>{fase === 'classe' ? 'Level Up — qual classe sobe?' : `${classeSelecionada} — proficiências`}</div>
        </div>
      </div>

      <div className={styles.body}>
        {fase === 'classe' && (
          <>
            <div className="label" style={{ marginBottom: 8 }}>
              Escolha qual classe ganha o novo nível. Continuar numa classe que você já tem mantém tudo como está;
              escolher uma classe nova começa ela do zero (multiclasse).
            </div>
            {opcoes.map((o) => {
              const marcada = o.classe === classeSelecionada;
              const idClasse = catalogoClasses.find((c) => c.nome === o.classe)?.id ?? o.classe.toLowerCase();
              return (
                <div
                  key={o.classe}
                  className="check-row"
                  onClick={() => setClasseSelecionada(o.classe)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div className={`check-box ${marcada ? 'checked' : ''}`} />
                  <IconeClasse id={idClasse} />
                  <span className="check-label">
                    {o.classe} — Nível {o.nivelAtual} → {o.nivelAtual + 1}
                    {o.nivelAtual === 0 ? ' (multiclasse nova)' : ''}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {fase === 'extras' && (
          <>
            {maxPericias > 0 && (
              <>
                <div className="section-title">
                  Perícia à escolha — {periciasEscolhidas.length}/{maxPericias}
                </div>
                <div className="label" style={{ marginBottom: 8 }}>
                  Proficiência ganha ao multiclassar pra {classeSelecionada} (SDD Multiclasse, seção 6).
                </div>
                {opcoesPericia.map((nome) => {
                  const marcada = periciasEscolhidas.includes(nome);
                  return (
                    <div key={nome} className="check-row" onClick={() => togglePericia(nome)}>
                      <div className={`check-box ${marcada ? 'checked' : ''}`} />
                      <span className="check-label">{nome}</span>
                    </div>
                  );
                })}
              </>
            )}

            {maxFerramentas > 0 && (
              <>
                <div className="section-title" style={{ marginTop: 16 }}>
                  Instrumento Musical à escolha — {ferramentasEscolhidas.length}/{maxFerramentas}
                </div>
                {opcoesFerramenta.map((op) => {
                  const marcada = ferramentasEscolhidas.includes(op.nome);
                  return (
                    <div key={op.nome} className="check-row" onClick={() => toggleFerramenta(op.nome)}>
                      <div className={`check-box ${marcada ? 'checked' : ''}`} />
                      <span className="check-label">{op.nome}</span>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={voltar}>
          ← Voltar
        </div>
        <div className={`btn btn-primary ${styles.pill} ${!podeAvancar ? 'disabled' : ''}`} onClick={() => podeAvancar && avancar()}>
          {fase === 'classe' && precisaDeExtras ? 'Avançar →' : 'Confirmar ✓'}
        </div>
      </div>
    </div>
  );
}
