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
import { classificarMagia, iconesMagia, usarMagiaTemAcaoAutomatizada } from '../../../core/classificarMagia';
import type { MagiaGratisDeInvocacao } from '../../../core/invocacoesMagiaGratis';
import MagiaComDescricao from '../../components/MagiaComDescricao';
import TickPips from '../../components/TickPips';
import { useColapsavel } from '../../hooks/useColapsavel';
import { useRoll } from '../../roll/RollContext';
import EscolherCirculoShell from '../combat/EscolherCirculoShell';
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
  magiasDescobertasMagicasAtuais,
  magiasPactoDoInferoAtuais,
  magiasEspecieAtuais,
  magiasTalentoOrigemAtuais,
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
  temPactoDaLamina,
  armaDePactoAtual,
  onVincularArmaDePacto,
  onDesvincularArmaDePacto,
  faltamTruques,
  faltamMagiasPreparadas,
  onCompletarTruques,
  onCompletarMagiasPreparadas,
}: MagiasTabProps) {
  const { rolarD20 } = useRoll();
  const [telaCirculo, setTelaCirculo] = useState<{ magia: Magia; circulos: number[] } | null>(null);
  const [armaDePactoEscolhida, setArmaDePactoEscolhida] = useState('');

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
  const descobertasMagicas = magiasPreparadasDoPersonagem(magiasDescobertasMagicasAtuais);
  const pactoDoInfero = magiasPreparadasDoPersonagem(magiasPactoDoInferoAtuais);
  const magiasEspecie = magiasPreparadasDoPersonagem(magiasEspecieAtuais);
  const magiasTalentoOrigem = magiasPreparadasDoPersonagem(magiasTalentoOrigemAtuais);
  const livroDasSombras = magiasPreparadasDoPersonagem(livroDasSombrasAtuais);
  const [espacosExpandido, setEspacosExpandido] = useColapsavel('espacos-de-magia', true);

  function rolarAtaqueSeForMagiaDeAtaque(m: Magia) {
    if (classificarMagia(m).ataque && modAcertoConjuracao !== null) {
      rolarD20({
        label: `Ataque de Magia — ${m.nome}`,
        formula: `1d20 + ${modAcertoConjuracao}`,
        mod: modAcertoConjuracao,
      });
    }
  }

  function usarMagiaGratis(item: MagiaGratisDeInvocacao) {
    if (desvantagemForcaDestreza) return;
    const jaGasta = item.recarga === 'descansoLongo' && magiasGratisGastas.includes(item.invocacaoId);
    if (jaGasta) return;
    onUsarMagiaGratis(item);
    rolarAtaqueSeForMagiaDeAtaque(item.magia);
  }

  function usarMagia(m: Magia) {
    if (desvantagemForcaDestreza) return;
    if (m.circulo === 0) {
      rolarAtaqueSeForMagiaDeAtaque(m);
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
          if (ok) rolarAtaqueSeForMagiaDeAtaque(telaCirculo.magia);
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
          <div className="section-title">Truques</div>
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
          <div className="section-title">Magias Preparadas</div>
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

      <div className="label" style={{ marginTop: 8 }}>
        Usar aqui gasta o espaço de magia de verdade (com upcast, igual a aba Combat) — útil pra conjurar fora do
        seu turno, no meio da campanha.
      </div>
    </>
  );
}
