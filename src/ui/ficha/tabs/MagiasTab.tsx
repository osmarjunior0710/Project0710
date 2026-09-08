import { useState } from 'react';
import type { Classe } from '../../../data/rulesets/dnd2024/classes';
import type { Magia } from '../../../data/rulesets/dnd2024/magias';
import { armas } from '../../../data/rulesets/dnd2024/armas';
import type { ItemMochila } from '../../../core/mochila';
import {
  espacosDeMagiaAtivos,
  truquesDoPersonagem,
  magiasPreparadasDoPersonagem,
  circulosDisponiveisParaConjurar,
} from '../../../core/magiasPersonagem';
import { iconesMagia, usarMagiaTemAcaoAutomatizada } from '../../../core/classificarMagia';
import { calcularDanoMagia, calcularCuraMagia, mecanicaDaMagia, atributoSalvaguarda } from '../../../core/magiaDano';
import { cdConjuracao } from '../../../core/magiasPersonagem';
import type { MagiaGratisDeInvocacao } from '../../../core/invocacoesMagiaGratis';
import type { MagiaGratisDeTalentoGeral } from '../../../core/magiaTalentoGeral';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TickPips from '../../components/TickPips';
import { useColapsavel } from '../../hooks/useColapsavel';
import { useRoll } from '../../roll/RollContext';
import EscolherCirculoShell from '../combat/EscolherCirculoShell';
import MagiaSalvaguardaModal from '../combat/MagiaSalvaguardaModal';
import styles from './MagiasTab.module.css';

const armasSimples = armas.filter((a) => a.categoria.includes('Simples'));
const armasMarciais = armas.filter((a) => a.categoria.includes('Marciais'));

interface MagiasTabProps {
  classe: Classe | null;
  nivel: number;
  espacosGastosPorCirculo: Record<number, number>;
  onGastarSlotCirculo: (circulo: number) => boolean;
  modAcertoConjuracao: number | null;
  /** `true` = Armadura equipada sem treinamento — bloqueia qualquer
   * conjuração feita direto por aqui (SDD "Penalidades por Falta de
   * Proficiência", ver `core/proficienciaArmadura.ts`). O bloqueio de
   * verdade é no Combat (Ação/Reação); aqui é reforço + aviso, já que
   * esta aba também deixa conjurar truque/magia direto. */
  desvantagemForcaDestreza: boolean;
  conjura: boolean;
  truquesAtuais: string[];
  magiasPreparadasAtuais: string[];
  /** Livro de Magias (grimório) do Mago — pool de magias CONHECIDAS,
   * maior que `magiasPreparadasAtuais` (ver DECISOES-CLASSES.md
   * "Casters", Padrão C). `[]` pra quem não tem essa característica
   * (hoje, todo mundo além do Mago) — a seção "Livro de Magias" só
   * aparece quando essa lista não está vazia. */
  livroDeMagiasAtuais: string[];
  /** "Descobertas Mágicas" (Colégio do Conhecimento, nível 6) — 2
   * magias sempre preparadas, mostradas numa seção própria (não se
   * misturam com Magias Preparadas normais). */
  magiasDescobertasMagicasAtuais: string[];
  /** Magias de Pacto do Ínfero (Patrono Ínfero, Bruxo) — lista fixa,
   * sem escolha do jogador, que cresce por nível (3/5/7/9). Sempre
   * preparadas, mesmo tratamento de "Descobertas Mágicas" (seção
   * própria, fora do limite normal de Magias Preparadas). Vazio pra
   * quem não tem essa característica. */
  magiasPactoDoInferoAtuais: string[];
  /** Truque + magias de nível 3/5 concedidos pela sub-escolha de
   * espécie (ex.: Linhagem Élfica do Elfo) — mesmo tratamento de
   * "sempre preparada, fora do limite normal" das outras listas fixas
   * acima. Vazio pra espécie sem essa sub-escolha, ou sem escolha
   * ainda feita. */
  magiasEspecieAtuais: string[];
  /** Truque(s) + magia de 1º círculo do talento de Origem "Iniciado em
   * Magia" (Acólito/Guia/Sábio) — fixo desde a criação, mesmo
   * tratamento de "sempre preparada" das outras listas fixas acima.
   * Vazio pra origem sem esse talento. */
  magiasTalentoOrigemAtuais: string[];
  /** Truque(s)/magia(s) FIXAS de Talento Geral sem escolha nenhuma
   * (Telecinético → Mãos Mágicas, Telepático → Detectar Pensamentos) —
   * ver `core/magiaTalentoGeral.ts`. Vazio sem nenhum desses talentos. */
  magiasTalentoGeralAtuais: string[];
  /** Magias de Talento Geral com "conjura grátis 1x/Descanso Longo"
   * (hoje só Telepático) — mesmo padrão de `magiasGratisConcedidas`. */
  magiasGratisTalentoGeral: MagiaGratisDeTalentoGeral[];
  onUsarMagiaGratisTalentoGeral: (item: MagiaGratisDeTalentoGeral) => void;
  /** `true` só quando o personagem tem Conjurador Ritualista — controla
   * se a seção "Ritual Rápido" aparece. */
  ritualRapidoDisponivel: boolean;
  /** `true` = já usado desde o último Descanso Longo — 1 uso ÚNICO
   * COMPARTILHADO entre TODAS as magias Rituais conhecidas (não 1 por
   * magia, diferente de `magiasGratisTalentoGeral`). */
  ritualRapidoGasto: boolean;
  onUsarRitualRapido: () => void;
  /** Livro das Sombras (Bruxo, Pacto do Tomo) — 3 truques + 2 magias
   * rituais sempre preparadas enquanto o livro existir, mesmo
   * tratamento de "Descobertas Mágicas" (seção própria, fora do
   * limite normal de Magias Preparadas). Vazio pra quem não tem
   * Pacto do Tomo. */
  livroDasSombrasAtuais: string[];
  /** `true` só quando o personagem tem a Invocação Mística Pacto do
   * Tomo — controla se o botão "Reconjurar o Livro" aparece. */
  temPactoDoTomo: boolean;
  /** `true` = já reconjurado desde o último Descanso Curto/Longo —
   * botão "Reconjurar" fica travado até o próximo descanso. */
  livroDasSombrasGasto: boolean;
  onReconjurarLivro: () => void;
  /** `true` só quando o personagem já tem Astúcia Mágica (Bruxo,
   * nível 2+) — controla se o botão aparece. */
  astuciaMagicaDisponivel: boolean;
  /** `true` = já usada desde o último Descanso Longo. */
  astuciaMagicaGasta: boolean;
  /** Quantos espaços de Pacto o rito recupera agora (0 = nada gasto
   * pra recuperar, botão fica travado mesmo disponível). */
  astuciaMagicaRecupera: number;
  onUsarAstuciaMagica: () => void;
  /** `true` só quando o personagem já tem Contatar Patrono (Bruxo,
   * nível 9+) — controla se a seção aparece. */
  contatarPatronoDisponivel: boolean;
  /** Contato Extraplanar — `null` só se o catálogo não tiver a magia
   * (nunca deveria acontecer, mas evita quebrar a tela se sumir). */
  contatoExtraplanar: Magia | null;
  /** `true` = já usada desde o último Descanso Longo. */
  contatarPatronoGasto: boolean;
  onUsarContatarPatrono: () => void;
  /** Arcana Mística (Bruxo, níveis 11/13/15/17) — 1 entrada por
   * círculo já escolhido (6/7/8/9), cada uma com uso independente.
   * Vazio pra quem ainda não desbloqueou nenhum círculo. */
  arcanaMisticaEscolhidas: { circulo: number; magia: Magia }[];
  /** Círculos já usados de graça desde o último Descanso Longo. */
  arcanaMisticaGastos: number[];
  onUsarArcanaMistica: (circulo: number) => void;
  /** Invocações Místicas Fase 2 — magias concedidas "de graça" (ex:
   * Armadura de Sombras -> Armadura Arcana), derivadas das Invocações
   * atuais do personagem. Vazio pra quem não tem nenhuma desse tipo. */
  magiasGratisConcedidas: MagiaGratisDeInvocacao[];
  /** IDs de Invocações cuja magia de graça `'descansoLongo'` já foi
   * usada desde o último Descanso Longo (travadas até lá). */
  magiasGratisGastas: string[];
  onUsarMagiaGratis: (item: MagiaGratisDeInvocacao) => void;
  /** `true` só quando o personagem tem a Invocação Mística Pacto da
   * Lâmina — controla se a seção de vincular arma de pacto aparece. */
  temPactoDaLamina: boolean;
  armaDePactoAtual: ItemMochila | null;
  onVincularArmaDePacto: (nomeArma: string) => void;
  onDesvincularArmaDePacto: () => void;
  faltamTruques: number;
  faltamMagiasPreparadas: number;
  onCompletarTruques: () => void;
  onCompletarMagiasPreparadas: () => void;
}

export default function MagiasTab({
  classe,
  nivel,
  espacosGastosPorCirculo,
  onGastarSlotCirculo,
  modAcertoConjuracao,
  desvantagemForcaDestreza,
  conjura,
  truquesAtuais,
  magiasPreparadasAtuais,
  livroDeMagiasAtuais,
  magiasDescobertasMagicasAtuais,
  magiasPactoDoInferoAtuais,
  magiasEspecieAtuais,
  magiasTalentoOrigemAtuais,
  magiasTalentoGeralAtuais,
  livroDasSombrasAtuais,
  temPactoDoTomo,
  livroDasSombrasGasto,
  onReconjurarLivro,
  astuciaMagicaDisponivel,
  astuciaMagicaGasta,
  astuciaMagicaRecupera,
  onUsarAstuciaMagica,
  contatarPatronoDisponivel,
  contatoExtraplanar,
  contatarPatronoGasto,
  onUsarContatarPatrono,
  arcanaMisticaEscolhidas,
  arcanaMisticaGastos,
  onUsarArcanaMistica,
  magiasGratisConcedidas,
  magiasGratisGastas,
  onUsarMagiaGratis,
  magiasGratisTalentoGeral,
  onUsarMagiaGratisTalentoGeral,
  ritualRapidoDisponivel,
  ritualRapidoGasto,
  onUsarRitualRapido,
  temPactoDaLamina,
  armaDePactoAtual,
  onVincularArmaDePacto,
  onDesvincularArmaDePacto,
  faltamTruques,
  faltamMagiasPreparadas,
  onCompletarTruques,
  onCompletarMagiasPreparadas,
}: MagiasTabProps) {
  const { rolarD20, rolarDados } = useRoll();
  const [telaCirculo, setTelaCirculo] = useState<{ magia: Magia; circulos: number[] } | null>(null);
  const [armaDePactoEscolhida, setArmaDePactoEscolhida] = useState('');
  const [danoPendenteMagia, setDanoPendenteMagia] = useState<{
    label: string;
    quantidade: number;
    lados: number;
    mod: number;
  } | null>(null);
  const [telaSalvaguarda, setTelaSalvaguarda] = useState<{ magia: Magia; circuloUsado: number } | null>(null);

  if (!conjura) {
    return (
      <div className="box" style={{ padding: 14, color: 'var(--text-faint)', fontSize: 12, textAlign: 'center' }}>
        Esse personagem não tem nenhuma fonte de conjuração no momento (nem pela classe, nem por multiclasse).
      </div>
    );
  }

  const espacos = espacosDeMagiaAtivos(classe, nivel);
  const truques = truquesDoPersonagem(truquesAtuais);
  const preparadas = magiasPreparadasDoPersonagem(magiasPreparadasAtuais);
  const livroDeMagias = magiasPreparadasDoPersonagem(livroDeMagiasAtuais);
  const descobertasMagicas = magiasPreparadasDoPersonagem(magiasDescobertasMagicasAtuais);
  const pactoDoInfero = magiasPreparadasDoPersonagem(magiasPactoDoInferoAtuais);
  const magiasEspecie = magiasPreparadasDoPersonagem(magiasEspecieAtuais);
  const magiasTalentoOrigem = magiasPreparadasDoPersonagem(magiasTalentoOrigemAtuais);
  const magiasTalentoGeral = magiasPreparadasDoPersonagem(magiasTalentoGeralAtuais);
  const livroDasSombras = magiasPreparadasDoPersonagem(livroDasSombrasAtuais);
  const [espacosExpandido, setEspacosExpandido] = useColapsavel('espacos-de-magia', true);
  const [truquesExpandido, setTruquesExpandido] = useColapsavel('truques', true);
  const [magiasPreparadasExpandido, setMagiasPreparadasExpandido] = useColapsavel('magias-preparadas', true);
  const [livroDeMagiasExpandido, setLivroDeMagiasExpandido] = useColapsavel('livro-de-magias', true);

  function processarMagiaAoUsar(m: Magia, circuloUsado: number) {
    const mecanica = mecanicaDaMagia(m);
    if (mecanica === 'ataque' && modAcertoConjuracao !== null) {
      rolarD20({
        label: `Ataque de Magia — ${m.nome}`,
        formula: `1d20 + ${modAcertoConjuracao}`,
        mod: modAcertoConjuracao,
      });
      const dano = calcularDanoMagia(m, circuloUsado, nivel);
      setDanoPendenteMagia(
        dano ? { label: `Dano — ✨ ${m.nome}`, quantidade: dano.quantidade, lados: dano.lados, mod: dano.mod } : null,
      );
      return;
    }
    setDanoPendenteMagia(null);
    if (mecanica === 'salvaguarda') {
      setTelaSalvaguarda({ magia: m, circuloUsado });
      return;
    }
    if (mecanica === 'cura') {
      const cura = calcularCuraMagia(m, circuloUsado, nivel);
      if (cura) {
        rolarDados({
          label: `Cura — ✨ ${m.nome}`,
          formula: `${cura.quantidade}d${cura.lados}${cura.mod ? ` + ${cura.mod}` : ''}`,
          quantidade: cura.quantidade,
          lados: cura.lados,
          mod: cura.mod,
        });
      }
      return;
    }
  }

  function rolarDanoPendenteMagia() {
    if (!danoPendenteMagia) return;
    rolarDados({
      label: danoPendenteMagia.label,
      formula: `${danoPendenteMagia.quantidade}d${danoPendenteMagia.lados}${danoPendenteMagia.mod ? ` + ${danoPendenteMagia.mod}` : ''}`,
      quantidade: danoPendenteMagia.quantidade,
      lados: danoPendenteMagia.lados,
      mod: danoPendenteMagia.mod,
    });
    setDanoPendenteMagia(null);
  }

  function rolarDanoSalvaguarda() {
    if (!telaSalvaguarda) return;
    const dano = calcularDanoMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel);
    setTelaSalvaguarda(null);
    if (!dano) return;
    rolarDados({
      label: `Dano — ✨ ${telaSalvaguarda.magia.nome}`,
      formula: `${dano.quantidade}d${dano.lados}${dano.mod ? ` + ${dano.mod}` : ''}`,
      quantidade: dano.quantidade,
      lados: dano.lados,
      mod: dano.mod,
    });
  }

  function usarMagiaGratis(item: MagiaGratisDeInvocacao) {
    if (desvantagemForcaDestreza) return;
    const jaGasta = item.recarga === 'descansoLongo' && magiasGratisGastas.includes(item.invocacaoId);
    if (jaGasta) return;
    onUsarMagiaGratis(item);
    processarMagiaAoUsar(item.magia, item.magia.circulo);
  }

  function usarMagia(m: Magia) {
    if (desvantagemForcaDestreza) return;
    if (m.circulo === 0) {
      processarMagiaAoUsar(m, 0);
      return;
    }
    const circulosDisponiveis = circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo);
    if (circulosDisponiveis.length === 0) return;
    setTelaCirculo({ magia: m, circulos: circulosDisponiveis });
  }

  if (telaCirculo) {
    return (
      <EscolherCirculoShell
        magia={telaCirculo.magia}
        circulosDisponiveis={telaCirculo.circulos}
        espacos={espacos}
        espacosGastosPorCirculo={espacosGastosPorCirculo}
        onVoltar={() => setTelaCirculo(null)}
        onConjurar={(circulo) => {
          const ok = onGastarSlotCirculo(circulo);
          setTelaCirculo(null);
          if (ok) processarMagiaAoUsar(telaCirculo.magia, circulo);
        }}
      />
    );
  }

  // Descanso Longo sempre restaura tudo (ver FichaShell.tsx's
  // descansoLongo, reset incondicional) — `recuperaNoDescansoCurto`
  // só marca o extra: esse(s) círculo(s) TAMBÉM recuperam cedo, no
  // Curto. Por isso a mensagem é sempre binária, nunca "misto por
  // círculo": ou soma o Curto como opção extra, ou é só o Longo.
  const temCurto = espacos.some((e) => e.recuperaNoDescansoCurto);
  const avisoRecuperacao = temCurto ? 'Recupera no Descanso Curto ou Longo.' : 'Recupera no Descanso Longo.';

  return (
    <>
      {desvantagemForcaDestreza && (
        <div className="label" style={{ color: 'var(--danger)', marginBottom: 10 }}>
          🚫 Armadura equipada sem treinamento — conjuração bloqueada até trocar ou tirar a armadura.
        </div>
      )}

      {telaSalvaguarda && (
        <MagiaSalvaguardaModal
          nomeMagia={telaSalvaguarda.magia.nome}
          atributo={atributoSalvaguarda(telaSalvaguarda.magia)}
          cd={modAcertoConjuracao !== null ? cdConjuracao(modAcertoConjuracao) : null}
          textoSucesso={telaSalvaguarda.magia.salvaguardaSucesso}
          textoFalha={telaSalvaguarda.magia.salvaguardaFalha}
          dano={calcularDanoMagia(telaSalvaguarda.magia, telaSalvaguarda.circuloUsado, nivel)}
          upcastTexto={telaSalvaguarda.magia.upcastTexto}
          onRolarDano={rolarDanoSalvaguarda}
          onFechar={() => setTelaSalvaguarda(null)}
        />
      )}

      {danoPendenteMagia && (
        <div className="label" style={{ marginBottom: 12, padding: 10, background: 'var(--panel)', borderRadius: 'var(--shape-md)' }}>
          Rolagem de acerto feita. Toque "Rolar Dano" pra ver o dano.
          <div
            className="btn btn-primary"
            style={{ marginTop: 10, padding: '10px 14px', display: 'inline-block' }}
            onClick={rolarDanoPendenteMagia}
          >
            🎲 Rolar Dano
          </div>
        </div>
      )}

      {espacos.length > 0 && (
        <>
          <div className={styles.grupoHeader} onClick={() => setEspacosExpandido(!espacosExpandido)}>
            <span>Espaços de Magia</span>
            <span>{espacosExpandido ? '▾' : '▸'}</span>
          </div>
          {espacosExpandido && (
            <>
              <div className="label" style={{ margin: '0 0 var(--space-2)' }}>
                {avisoRecuperacao}
              </div>
              {espacos.map((espaco, i) => {
                const gasto = espacosGastosPorCirculo[espaco.circulo] ?? 0;
                return (
                  <div key={espaco.circulo} className={styles.espacoRow} style={i === 0 ? { borderTop: 'none' } : undefined}>
                    <span>{espaco.circulo}º círculo</span>
                    <TickPips total={espaco.maximo} usados={gasto} tamanho="lg" />
                  </div>
                );
              })}
            </>
          )}
        </>
      )}

      {astuciaMagicaDisponivel && (
        <div
          className={`${styles.reconjurarBtn} ${astuciaMagicaGasta || astuciaMagicaRecupera <= 0 ? styles.reconjurarBtnGasto : ''}`}
          onClick={onUsarAstuciaMagica}
        >
          🔮{' '}
          {astuciaMagicaGasta
            ? 'Astúcia Mágica já usada — disponível de novo após Descanso Longo'
            : astuciaMagicaRecupera > 0
              ? `Astúcia Mágica — rito de 1 minuto, recupera ${astuciaMagicaRecupera} espaço${astuciaMagicaRecupera > 1 ? 's' : ''} de Pacto`
              : 'Astúcia Mágica — nenhum espaço de Pacto gasto pra recuperar agora'}
        </div>
      )}

      {contatarPatronoDisponivel && contatoExtraplanar && (
        <>
          <div className="section-title">Contatar Patrono</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Sempre preparada — conjurável de graça 1x por Descanso Longo, com sucesso automático na salvaguarda.
          </div>
          <div className={styles.spellRow}>
            <div className={styles.spellName}>
              <MagiaComDescricao magia={contatoExtraplanar} /> {iconesMagia(contatoExtraplanar)}
            </div>
            <span className={styles.spellCirculo}>{contatoExtraplanar.circulo}º círculo</span>
            <div
              className={`${styles.usarBtn} ${contatarPatronoGasto ? styles.usarBtnDesabilitado : ''}`}
              onClick={onUsarContatarPatrono}
            >
              {contatarPatronoGasto ? 'Usada' : 'Usar de graça'}
            </div>
          </div>
        </>
      )}

      {arcanaMisticaEscolhidas.length > 0 && (
        <>
          <div className="section-title">Arcana Mística</div>
          <div className="label" style={{ marginBottom: 4 }}>
            1 magia por círculo, cada uma conjurável de graça 1x por Descanso Longo (usos independentes entre si).
          </div>
          {arcanaMisticaEscolhidas.map(({ circulo, magia }) => {
            const gasta = arcanaMisticaGastos.includes(circulo);
            return (
              <div key={circulo} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={magia} /> {iconesMagia(magia)}
                </div>
                <span className={styles.spellCirculo}>{circulo}º círculo</span>
                <div
                  className={`${styles.usarBtn} ${gasta ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => onUsarArcanaMistica(circulo)}
                >
                  {gasta ? 'Usada' : 'Usar de graça'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {magiasGratisConcedidas.length > 0 && (
        <>
          <div className="section-title">Magias das Invocações</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Concedidas de graça pelas Invocações Místicas — não gastam Espaço de Pacto.
          </div>
          {magiasGratisConcedidas.map((item) => {
            const jaGasta = item.recarga === 'descansoLongo' && magiasGratisGastas.includes(item.invocacaoId);
            return (
              <div key={item.invocacaoId} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={item.magia} /> {iconesMagia(item.magia)}
                  <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                    {item.invocacaoNome}
                    {item.pvTemporarioConcedido !== null && ` · +${item.pvTemporarioConcedido} PV Temp`}
                  </div>
                </div>
                <span className={styles.spellCirculo}>{item.magia.circulo}º círculo</span>
                {item.recarga === 'ilimitado' && item.pvTemporarioConcedido === null ? (
                  <span className="tag">sem custo</span>
                ) : (
                  <div
                    className={`${styles.usarBtn} ${jaGasta ? styles.usarBtnDesabilitado : ''}`}
                    onClick={() => usarMagiaGratis(item)}
                  >
                    {jaGasta ? 'Usada' : 'Usar de graça'}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {temPactoDaLamina && (
        <>
          <div className="section-title">Pacto da Lâmina</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Como Ação Bônus, vincula uma arma Simples ou Marcial — o ataque com ela usa Carisma, não Força/Destreza.
            Aparece automaticamente na Mão Principal (aba Mochila) e no "Atacar" do Combat.
          </div>
          {armaDePactoAtual ? (
            <div className={styles.reconjurarBtn} onClick={onDesvincularArmaDePacto}>
              🗡️ Arma de Pacto: {armaDePactoAtual.nome} — toque pra desvincular
            </div>
          ) : (
            <>
              <select
                className={styles.selectArma}
                value={armaDePactoEscolhida}
                onChange={(e) => setArmaDePactoEscolhida(e.target.value)}
              >
                <option value="">Escolha a arma...</option>
                <optgroup label="Armas Simples">
                  {armasSimples.map((a) => (
                    <option key={a.id} value={a.nome}>
                      {a.nome} ({a.dano})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Armas Marciais">
                  {armasMarciais.map((a) => (
                    <option key={a.id} value={a.nome}>
                      {a.nome} ({a.dano})
                    </option>
                  ))}
                </optgroup>
              </select>
              <div
                className={`${styles.reconjurarBtn} ${!armaDePactoEscolhida ? styles.reconjurarBtnGasto : ''}`}
                onClick={() => {
                  if (!armaDePactoEscolhida) return;
                  onVincularArmaDePacto(armaDePactoEscolhida);
                  setArmaDePactoEscolhida('');
                }}
              >
                🗡️ Vincular arma de pacto
              </div>
            </>
          )}
        </>
      )}

      {(truques.length > 0 || faltamTruques > 0) && (
        <>
          <div className={styles.grupoHeader} onClick={() => setTruquesExpandido(!truquesExpandido)}>
            <span>Truques</span>
            <span>{truquesExpandido ? '▾' : '▸'}</span>
          </div>
          {truquesExpandido && (
            <>
              {faltamTruques > 0 && (
                <div className={styles.avisoFaltando} onClick={onCompletarTruques}>
                  ⚠️ Faltam {faltamTruques} truque{faltamTruques > 1 ? 's' : ''} pro seu nível — toque pra escolher
                </div>
              )}
              {truques.map((m) => {
                const temAcao = usarMagiaTemAcaoAutomatizada(m);
                return (
                  <div key={m.id} className={styles.spellRow}>
                    <div className={styles.spellName}>
                      <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                    </div>
                    <span className={styles.spellCirculo}>Truque</span>
                    <div
                      className={`${styles.usarBtn} ${temAcao ? '' : styles.usarBtnPendencia}`}
                      onClick={() => temAcao && usarMagia(m)}
                    >
                      {temAcao ? 'Usar' : 'Usar (pendência)'}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}

      {descobertasMagicas.length > 0 && (
        <>
          <div className="section-title">Descobertas Mágicas</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Colégio do Conhecimento — sempre preparadas, não contam na conta de Magias Preparadas.
          </div>
          {descobertasMagicas.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                <div
                  className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => temAcao && usarMagia(m)}
                >
                  {temAcao ? 'Usar' : 'Usar (pendência)'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {pactoDoInfero.length > 0 && (
        <>
          <div className="section-title">Magias de Pacto do Ínfero</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Patrono Ínfero — sempre preparadas, não contam na conta de Magias Preparadas.
          </div>
          {pactoDoInfero.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                <div
                  className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => temAcao && usarMagia(m)}
                >
                  {temAcao ? 'Usar' : 'Usar (pendência)'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {magiasEspecie.length > 0 && (
        <>
          <div className="section-title">Magias da Espécie</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Concedidas pela espécie — sempre preparadas, não contam na conta de Magias Preparadas.
          </div>
          {magiasEspecie.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                <div
                  className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => temAcao && usarMagia(m)}
                >
                  {temAcao ? 'Usar' : 'Usar (pendência)'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {magiasTalentoOrigem.length > 0 && (
        <>
          <div className="section-title">Magias do Talento de Origem</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Iniciado em Magia — sempre preparadas, não contam na conta de Magias Preparadas.
          </div>
          {magiasTalentoOrigem.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                <div
                  className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => temAcao && usarMagia(m)}
                >
                  {temAcao ? 'Usar' : 'Usar (pendência)'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {magiasTalentoGeral.length > 0 && (
        <>
          <div className="section-title">Magias de Talentos Gerais</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Sempre preparadas, não contam na conta de Magias Preparadas.
            {ritualRapidoDisponivel &&
              ' Botão roxo "Grátis" = usa o Ritual Rápido (1 uso compartilhado); "Usar" continua gastando Espaço normal.'}
          </div>
          {magiasTalentoGeral.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            // Elegível pro pool do Ritual Rápido (Conjurador Ritualista) —
            // só as magias com tag Ritual, e só quando o personagem tem
            // o talento. Mostra os DOIS botões lado a lado: "Grátis"
            // ativa o Ritual Rápido (1 uso compartilhado, ver
            // `onUsarRitualRapido`); "Usar" continua conjurando normal
            // gastando Espaço — quem tem Espaço sobrando (ex.: um
            // conjurador de verdade com esse talento, não só um
            // Guerreiro) não fica travado depois de gastar o grátis.
            const elegivelRitualRapido = ritualRapidoDisponivel && m.tempoConjuracao?.includes('Ritual');
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                {elegivelRitualRapido ? (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <div
                      className={`${styles.usarBtn} ${styles.usarBtnRitual} ${ritualRapidoGasto ? styles.usarBtnDesabilitado : ''}`}
                      style={{ minWidth: 0, padding: '0 var(--space-2)' }}
                      onClick={() => !ritualRapidoGasto && onUsarRitualRapido()}
                    >
                      {ritualRapidoGasto ? 'Usada' : 'Grátis'}
                    </div>
                    <div
                      className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                      style={{ minWidth: 0, padding: '0 var(--space-2)' }}
                      onClick={() => temAcao && usarMagia(m)}
                    >
                      {temAcao ? 'Usar' : 'Pendência'}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                    onClick={() => temAcao && usarMagia(m)}
                  >
                    {temAcao ? 'Usar' : 'Usar (pendência)'}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {ritualRapidoDisponivel && (
        <>
          <div className="section-title">Ritual Rápido</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Conjure 1 das suas Magias Rituais no tempo normal (não o de Ritual), sem gastar Espaço — 1 uso
            COMPARTILHADO entre todas elas, 1x por Descanso Longo.
          </div>
          <div
            className={`${styles.reconjurarBtn} ${ritualRapidoGasto ? styles.reconjurarBtnGasto : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}
            onClick={onUsarRitualRapido}
          >
            <span>🔮 {ritualRapidoGasto ? 'Ritual Rápido já usado — disponível de novo após Descanso Longo' : 'Usar Ritual Rápido'}</span>
            <TickPips total={1} usados={ritualRapidoGasto ? 1 : 0} tamanho="sm" variante="especial" />
          </div>
        </>
      )}

      {magiasGratisTalentoGeral.length > 0 && (
        <>
          <div className="section-title">Magias Grátis de Talentos Gerais</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Conjuráveis sem gastar Espaço de Magia, 1x por Descanso Longo (ou com espaço depois disso).
          </div>
          {magiasGratisTalentoGeral.map((item) => {
            const jaGasta = item.recarga === 'descansoLongo' && magiasGratisGastas.includes(`talento:${item.talentoId}:${item.magia.nome}`);
            return (
              <div key={`${item.talentoId}-${item.magia.nome}`} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={item.magia} /> {iconesMagia(item.magia)}
                  <div style={{ color: 'var(--text-faint)', fontSize: 11 }}>{item.talentoNome}</div>
                </div>
                <span className={styles.spellCirculo}>{item.magia.circulo}º círculo</span>
                <div
                  className={`${styles.usarBtn} ${jaGasta ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => onUsarMagiaGratisTalentoGeral(item)}
                >
                  {jaGasta ? 'Usada' : 'Usar de graça'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {temPactoDoTomo && (
        <>
          <div className="section-title">Livro das Sombras</div>
          <div className="label" style={{ marginBottom: 4 }}>
            Pacto do Tomo — sempre preparadas enquanto o livro existir, não contam na conta de Magias Preparadas. A
            escolha pode ser refeita a cada Descanso Curto ou Longo.
          </div>
          <div
            className={`${styles.reconjurarBtn} ${livroDasSombrasGasto ? styles.reconjurarBtnGasto : ''}`}
            onClick={onReconjurarLivro}
          >
            🔮{' '}
            {livroDasSombrasGasto
              ? 'Livro já reconjurado — disponível de novo após Descanso Curto ou Longo'
              : 'Reconjurar o Livro das Sombras — toque pra escolher'}
          </div>
          {livroDasSombras.map((m) => {
            const semEspaco = m.circulo > 0 && circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
            const temAcao = usarMagiaTemAcaoAutomatizada(m);
            return (
              <div key={m.id} className={styles.spellRow}>
                <div className={styles.spellName}>
                  <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                </div>
                <span className={styles.spellCirculo}>{m.circulo === 0 ? 'Truque' : `${m.circulo}º círculo`}</span>
                <div
                  className={`${styles.usarBtn} ${!temAcao ? styles.usarBtnPendencia : semEspaco ? styles.usarBtnDesabilitado : ''}`}
                  onClick={() => temAcao && usarMagia(m)}
                >
                  {temAcao ? 'Usar' : 'Usar (pendência)'}
                </div>
              </div>
            );
          })}
        </>
      )}

      {(preparadas.length > 0 || faltamMagiasPreparadas > 0) && (
        <>
          <div className={styles.grupoHeader} onClick={() => setMagiasPreparadasExpandido(!magiasPreparadasExpandido)}>
            <span>Magias Preparadas</span>
            <span>{magiasPreparadasExpandido ? '▾' : '▸'}</span>
          </div>
          {magiasPreparadasExpandido && (
            <>
              {faltamMagiasPreparadas > 0 && (
                <div className={styles.avisoFaltando} onClick={onCompletarMagiasPreparadas}>
                  ⚠️ Faltam {faltamMagiasPreparadas} magia{faltamMagiasPreparadas > 1 ? 's' : ''} preparada
                  {faltamMagiasPreparadas > 1 ? 's' : ''} pro seu nível — toque pra escolher
                </div>
              )}
              {preparadas.map((m) => {
                const semEspaco = circulosDisponiveisParaConjurar(m.circulo, espacos, espacosGastosPorCirculo).length === 0;
                return (
                  <div key={m.id} className={styles.spellRow}>
                    <div className={styles.spellName}>
                      <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                    </div>
                    <span className={styles.spellCirculo}>{m.circulo}º círculo</span>
                    <div
                      className={`${styles.usarBtn} ${semEspaco ? styles.usarBtnDesabilitado : ''}`}
                      onClick={() => usarMagia(m)}
                    >
                      Usar
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}

      {livroDeMagias.length > 0 && (
        <>
          <div className={styles.grupoHeader} onClick={() => setLivroDeMagiasExpandido(!livroDeMagiasExpandido)}>
            <span>Livro de Magias</span>
            <span>{livroDeMagiasExpandido ? '▾' : '▸'}</span>
          </div>
          {livroDeMagiasExpandido && (
            <>
              <div className="label" style={{ marginBottom: 4 }}>
                Todas as magias do seu grimório — só as marcadas "preparada" podem ser conjuradas agora (aba Magias
                Preparadas, acima). Muda a lista de preparadas ao completar um Descanso Longo.
              </div>
              {livroDeMagias.map((m) => {
                const preparada = magiasPreparadasAtuais.includes(m.nome);
                return (
                  <div key={m.id} className={styles.spellRow}>
                    <div className={styles.spellName}>
                      <MagiaComDescricao magia={m} /> {iconesMagia(m)}
                    </div>
                    <span className={styles.spellCirculo}>{m.circulo}º círculo</span>
                    {preparada ? (
                      <span className="tag">preparada</span>
                    ) : (
                      <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>não preparada</span>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}

      <div className="label" style={{ marginTop: 8 }}>
        Usar aqui gasta o espaço de magia de verdade (com upcast, igual a aba Combat) — útil pra conjurar fora do
        seu turno, no meio da campanha.
      </div>
    </>
  );
}
