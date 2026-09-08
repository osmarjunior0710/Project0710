import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alinhamentos, arrayPadrao, atributosOrdem, type Atributo } from '../../data/wizardFixtures';
import { origens } from '../../data/rulesets/dnd2024/origens';
import { talentosOrigem, type ConcedeProficienciasTalento, type ConcedeFerramentaGrupoTalento } from '../../data/rulesets/dnd2024/talentos';
import { especies } from '../../data/rulesets/dnd2024/especies';
import { idiomas } from '../../data/rulesets/dnd2024/idiomas';
import { idiomaExtraClasse } from '../../data/rulesets/dnd2024/idiomaExtraClasse';
import { totalIdiomasEsperados } from '../../core/idiomas';
import { classes } from '../../data/rulesets/dnd2024/classes';
import { estilosDeLuta } from '../../data/rulesets/dnd2024/estilosDeLuta';
import { proficienciasIniciaisClasse } from '../../data/rulesets/dnd2024/classesProficienciasIniciais';
import { gruposFerramenta } from '../../data/rulesets/dnd2024/ferramentas';
import { pericias } from '../../data/rulesets/dnd2024/pericias';
import { magiasDaClasse } from '../../data/rulesets/dnd2024/magias';
import { invocacoesElegiveisAteNivel } from '../../core/invocacoesMisticas';
import { criarSelecaoInicial, type WizardSelection } from '../../core/personagem';
import { opcoesSubescolhaNoWizard, tracoComEscolhaDePericia } from '../../core/especieSubescolha';
import { calcularPvMaximoNivel1 } from '../../core/calculoPersonagem';
import { armasParaMaestria, quantidadeMaestriaEmArma } from '../../core/maestriaArma';
import { valorRecursoClasse } from '../../core/recursosClasse';
import { temEstiloDeLutaTrocavel } from '../../core/levelUp';
import { armazenamentoPersonagens, gerarIdPersonagem } from '../../core/armazenamentoPersonagens';
import { useAvisoTemporario } from '../hooks/useAvisoTemporario';
import styles from './WizardShell.module.css';
import ClasseStep from './steps/ClasseStep';
import ClasseEscolhasStep from './steps/ClasseEscolhasStep';
import OrigemStep from './steps/OrigemStep';
import OrigemEscolhasStep from './steps/OrigemEscolhasStep';
import TalentoOrigemEscolhasStep from './steps/TalentoOrigemEscolhasStep';
import LivroDasSombrasStep from './steps/LivroDasSombrasStep';
import EspecieStep from './steps/EspecieStep';
import EspecieEscolhasStep from './steps/EspecieEscolhasStep';
import TalentoEspecieEscolhasStep from './steps/TalentoEspecieEscolhasStep';
import AtributosStep from './steps/AtributosStep';
import LinguasStep from './steps/LinguasStep';
import AlinhamentoStep from './steps/AlinhamentoStep';
import LojaStep from './steps/LojaStep';
import ResumoStep from './steps/ResumoStep';
import type { StepProps } from './steps/StepProps';

const nomesAleatorios = [
  'Aria Ventos-Negros',
  'Thorn Ferreiro',
  'Lyra Sombraluz',
  'Kael Pedraverde',
  'Sira Nuvem-de-Fogo',
  'Bram Duasluas',
];

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

interface WizardStepDef {
  name: string;
  render: (props: StepProps) => React.ReactNode;
  isValid: (s: WizardSelection) => boolean;
  mensagemInvalida?: string;
  randomize?: () => void;
  /** Ausente = passo sempre ativo. Presente = passo só entra na
   * sequência quando `true` (ex: passo de escolha do Talento de Origem,
   * que só existe pra origem cujo talento concede escolha de
   * proficiência — ver `TalentoOrigemEscolhasStep`). */
  condicao?: (s: WizardSelection) => boolean;
}

function concedeProficienciasDaOrigem(s: WizardSelection): ConcedeProficienciasTalento | undefined {
  const origemSelecionada = origens.find((o) => o.nome === s.origem);
  if (!origemSelecionada) return undefined;
  return talentosOrigem.find((t) => t.id === origemSelecionada.talentoOrigemId)?.concedeProficiencias;
}

function concedeMagiaIniciadaDaOrigem(s: WizardSelection): boolean {
  const origemSelecionada = origens.find((o) => o.nome === s.origem);
  if (!origemSelecionada) return false;
  return talentosOrigem.find((t) => t.id === origemSelecionada.talentoOrigemId)?.concedeMagiaIniciada === true;
}

function concedeFerramentaGrupoDaOrigem(s: WizardSelection): ConcedeFerramentaGrupoTalento | undefined {
  const origemSelecionada = origens.find((o) => o.nome === s.origem);
  if (!origemSelecionada) return undefined;
  return talentosOrigem.find((t) => t.id === origemSelecionada.talentoOrigemId)?.concedeFerramentaGrupo;
}

function talentoDoVersatil(s: WizardSelection) {
  return s.talentoEspecieEscolhido ? talentosOrigem.find((t) => t.id === s.talentoEspecieEscolhido) : undefined;
}

export default function WizardShell() {
  const navigate = useNavigate();
  const [wizIndex, setWizIndex] = useState(0);
  const [selection, setSelection] = useState<WizardSelection>(criarSelecaoInicial());
  const [valorSelecionado, setValorSelecionado] = useState<number | null>(null);
  const [aviso, setAviso] = useAvisoTemporario();

  function update(patch: Partial<WizardSelection>) {
    setAviso(null);
    setSelection((prev) => ({ ...prev, ...patch }));
  }

  function randomizarClasse() {
    const disponiveis = classes.filter((c) => c.disponivel);
    const c = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    update({ classe: c.nome });
  }
  function randomizarEscolhasClasse() {
    const classeSelecionada = classes.find((c) => c.nome === selection.classe);
    if (!classeSelecionada) return;
    const proficiencias = proficienciasIniciaisClasse[classeSelecionada.id];
    const patch: Partial<WizardSelection> = {};
    if (temEstiloDeLutaTrocavel(classeSelecionada, 1)) {
      patch.estiloDeLutaEscolhido = estilosDeLuta[Math.floor(Math.random() * estilosDeLuta.length)].nome;
    }
    const qtdMaestria = quantidadeMaestriaEmArma(classeSelecionada, 1);
    if (qtdMaestria > 0) {
      patch.maestriaArmaEscolhida = embaralhar(armasParaMaestria(classeSelecionada))
        .slice(0, qtdMaestria)
        .map((a) => a.nome);
    }
    if (proficiencias) {
      patch.periciasClasseEscolhidas = embaralhar(proficiencias.periciasEscolha.opcoes).slice(
        0,
        proficiencias.periciasEscolha.quantidade,
      );
      if (proficiencias.ferramentasEscolha) {
        const opcoesFerramenta = gruposFerramenta[proficiencias.ferramentasEscolha.grupo] ?? [];
        patch.ferramentasClasseEscolhidas = embaralhar(opcoesFerramenta)
          .slice(0, proficiencias.ferramentasEscolha.quantidade)
          .map((f) => f.nome);
      }
      const opcoes = proficiencias.equipamentoInicial;
      patch.equipamentoClasseEscolhido = opcoes[Math.floor(Math.random() * opcoes.length)].rotulo as 'A' | 'B' | 'C';
    }
    const maxInvocacoes = valorRecursoClasse(classeSelecionada, 'Invocações Místicas', 1);
    if (maxInvocacoes > 0) {
      const elegiveis = invocacoesElegiveisAteNivel(1);
      patch.invocacoesMisticasEscolhidas = embaralhar(elegiveis)
        .slice(0, maxInvocacoes)
        .map((i) => i.id);
    }
    const maxTruques = valorRecursoClasse(classeSelecionada, 'Truques Conhecidos', 1);
    if (maxTruques > 0) {
      patch.truquesEscolhidos = embaralhar(magiasDaClasse(classeSelecionada.nome, 0))
        .slice(0, maxTruques)
        .map((m) => m.nome);
    }
    // Livro de Magias (Mago) — sorteia o grimório ANTES das Preparadas,
    // porque Preparadas só pode vir do que já está no livro.
    const maxLivro = valorRecursoClasse(classeSelecionada, 'Livro de Magias', 1);
    const poolMagiasNivel1 = embaralhar(magiasDaClasse(classeSelecionada.nome, 1));
    if (maxLivro > 0) {
      patch.livroDeMagiasEscolhido = poolMagiasNivel1.slice(0, maxLivro).map((m) => m.nome);
    }
    const maxMagias = valorRecursoClasse(classeSelecionada, 'Magias Preparadas', 1);
    if (maxMagias > 0) {
      const pool = maxLivro > 0 ? poolMagiasNivel1.slice(0, maxLivro) : poolMagiasNivel1;
      patch.magiasPreparadasEscolhidas = pool.slice(0, maxMagias).map((m) => m.nome);
    }
    update(patch);
  }
  function randomizarOrigem() {
    const disponiveis = origens.filter((o) => o.disponivel);
    const o = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    update({ origem: o.nome });
  }
  function randomizarEscolhasOrigem() {
    const origemSelecionada = origens.find((o) => o.nome === selection.origem);
    if (!origemSelecionada) return;
    const patch: Partial<WizardSelection> = {
      equipamentoOrigemEscolhido: Math.random() < 0.5 ? 'A' : 'B',
    };
    if (origemSelecionada.ferramenta.categoria === 'escolha') {
      const opcoes = gruposFerramenta[origemSelecionada.ferramenta.grupo] ?? [];
      if (opcoes.length > 0) {
        patch.ferramentaOrigemEscolhida = opcoes[Math.floor(Math.random() * opcoes.length)].nome;
      }
    }
    update(patch);
  }
  function randomizarEspecie() {
    const disponiveis = especies.filter((e) => e.disponivel);
    const e = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    update({
      especie: e.nome,
      tamanhoEspecieEscolhido: null,
      periciaEspecieEscolhida: null,
      talentoEspecieEscolhido: null,
      subescolhaEspecieEscolhida: null,
    });
  }
  function randomizarEscolhasEspecie() {
    const especieSelecionada = especies.find((e) => e.nome === selection.especie);
    if (!especieSelecionada) return;
    const patch: Partial<WizardSelection> = {};
    if (especieSelecionada.tamanho.opcoes) {
      const opcoes = especieSelecionada.tamanho.opcoes;
      patch.tamanhoEspecieEscolhido = opcoes[Math.floor(Math.random() * opcoes.length)];
    }
    const tracoPericia = tracoComEscolhaDePericia(especieSelecionada);
    if (tracoPericia) {
      const opcoes = tracoPericia.opcoesPericia ?? pericias.map((p) => p.nome);
      patch.periciaEspecieEscolhida = opcoes[Math.floor(Math.random() * opcoes.length)];
    }
    if (especieSelecionada.traços.some((t) => t.id === 'versatil')) {
      patch.talentoEspecieEscolhido = talentosOrigem[Math.floor(Math.random() * talentosOrigem.length)].id;
    }
    const opcoesSubescolha = opcoesSubescolhaNoWizard(especieSelecionada);
    if (opcoesSubescolha) {
      patch.subescolhaEspecieEscolhida = opcoesSubescolha[Math.floor(Math.random() * opcoesSubescolha.length)].nome;
    }
    update(patch);
  }
  function randomizarAtributos() {
    const valores = embaralhar(arrayPadrao);
    const atributos = {} as Record<Atributo, number | null>;
    atributosOrdem.forEach((a, i) => {
      atributos[a] = valores[i];
    });
    const bonusEscolhas = embaralhar([...atributosOrdem]).slice(0, 3);
    setValorSelecionado(null);
    update({ atributos, bonusEscolhas });
  }
  function randomizarLinguas() {
    const extra = selection.classe ? idiomaExtraClasse[selection.classe] : undefined;
    const fixosClasse = extra?.fixo ?? [];
    const escolhas = 2 + (extra?.escolhaLivre ?? 0);
    const outrosIdiomas = idiomas.filter((i) => i.nome !== 'Comum' && !fixosClasse.includes(i.nome)).map((i) => i.nome);
    update({ linguas: ['Comum', ...fixosClasse, ...embaralhar(outrosIdiomas).slice(0, escolhas)] });
  }
  function randomizarAlinhamento() {
    const a = alinhamentos[Math.floor(Math.random() * alinhamentos.length)];
    update({ alinhamento: a });
  }
  function randomizarResumo() {
    const nome = nomesAleatorios[Math.floor(Math.random() * nomesAleatorios.length)];
    update({ nome });
  }

  const steps: WizardStepDef[] = [
    {
      name: '1. Classe',
      render: (p) => <ClasseStep {...p} />,
      isValid: (s) => s.classe !== null,
      mensagemInvalida: 'Escolha uma classe antes de avançar.',
      randomize: randomizarClasse,
    },
    {
      name: '1b. Escolhas da Classe',
      render: (p) => <ClasseEscolhasStep {...p} />,
      isValid: (s) => {
        const classeSelecionada = classes.find((c) => c.nome === s.classe);
        if (!classeSelecionada) return true;
        const proficiencias = proficienciasIniciaisClasse[classeSelecionada.id];
        if (temEstiloDeLutaTrocavel(classeSelecionada, 1) && s.estiloDeLutaEscolhido === null) return false;
        const qtdMaestria = quantidadeMaestriaEmArma(classeSelecionada, 1);
        if (s.maestriaArmaEscolhida.length !== qtdMaestria) return false;
        const maxInvocacoes = valorRecursoClasse(classeSelecionada, 'Invocações Místicas', 1);
        if (s.invocacoesMisticasEscolhidas.length !== maxInvocacoes) return false;
        const maxTruques = valorRecursoClasse(classeSelecionada, 'Truques Conhecidos', 1);
        if (s.truquesEscolhidos.length !== maxTruques) return false;
        const maxLivro = valorRecursoClasse(classeSelecionada, 'Livro de Magias', 1);
        if (s.livroDeMagiasEscolhido.length !== maxLivro) return false;
        const maxMagias = valorRecursoClasse(classeSelecionada, 'Magias Preparadas', 1);
        if (s.magiasPreparadasEscolhidas.length !== maxMagias) return false;
        if (!proficiencias) return true;
        if (s.periciasClasseEscolhidas.length !== proficiencias.periciasEscolha.quantidade) return false;
        if (proficiencias.ferramentasEscolha && s.ferramentasClasseEscolhidas.length !== proficiencias.ferramentasEscolha.quantidade) {
          return false;
        }
        return s.equipamentoClasseEscolhido !== null;
      },
      mensagemInvalida: 'Complete todas as escolhas da classe antes de avançar.',
      randomize: randomizarEscolhasClasse,
    },
    {
      name: '1c. Livro das Sombras',
      render: (p) => <LivroDasSombrasStep {...p} />,
      condicao: (s) => s.invocacoesMisticasEscolhidas.includes('pacto-do-tomo'),
      isValid: (s) => s.livroDasSombrasTruques.length === 3 && s.livroDasSombrasMagias.length === 2,
      mensagemInvalida: 'Escolha 3 truques e 2 magias rituais de 1º círculo pro Livro das Sombras.',
    },
    {
      name: '2. Origem',
      render: (p) => <OrigemStep {...p} />,
      isValid: (s) => s.origem !== null,
      mensagemInvalida: 'Escolha uma origem antes de avançar.',
      randomize: randomizarOrigem,
    },
    {
      name: '2b. Escolhas da Origem',
      render: (p) => <OrigemEscolhasStep {...p} />,
      isValid: (s) => {
        const origemSelecionada = origens.find((o) => o.nome === s.origem);
        if (!origemSelecionada) return true;
        if (origemSelecionada.ferramenta.categoria === 'escolha' && s.ferramentaOrigemEscolhida === null) return false;
        return s.equipamentoOrigemEscolhido !== null;
      },
      mensagemInvalida: 'Escolha a ferramenta e o equipamento (A ou B) antes de avançar.',
      randomize: randomizarEscolhasOrigem,
    },
    {
      name: '2c. Talento da Origem',
      render: (p) => <TalentoOrigemEscolhasStep {...p} />,
      condicao: (s) =>
        concedeProficienciasDaOrigem(s) !== undefined ||
        concedeMagiaIniciadaDaOrigem(s) ||
        concedeFerramentaGrupoDaOrigem(s) !== undefined,
      isValid: (s) => {
        const concede = concedeProficienciasDaOrigem(s);
        if (concede) return s.proficienciasTalentoOrigemEscolhidas.length === concede.quantidade;
        if (concedeMagiaIniciadaDaOrigem(s)) {
          return (
            s.truquesMagiaIniciadaEscolhidos.length === 2 &&
            s.magiaMagiaIniciadaEscolhida !== null &&
            s.atributoMagiaIniciadaEscolhido !== null
          );
        }
        const concedeFerramenta = concedeFerramentaGrupoDaOrigem(s);
        if (concedeFerramenta) return s.proficienciasTalentoOrigemEscolhidas.length === concedeFerramenta.quantidade;
        return true;
      },
      mensagemInvalida: 'Complete as escolhas do talento da origem antes de avançar.',
    },
    {
      name: '3. Espécie',
      render: (p) => <EspecieStep {...p} />,
      isValid: (s) => s.especie !== null,
      mensagemInvalida: 'Escolha uma espécie antes de avançar.',
      randomize: randomizarEspecie,
    },
    {
      name: '3b. Escolhas da Espécie',
      render: (p) => <EspecieEscolhasStep {...p} />,
      isValid: (s) => {
        const especieSelecionada = especies.find((e) => e.nome === s.especie);
        if (!especieSelecionada) return true;
        if (especieSelecionada.tamanho.opcoes && s.tamanhoEspecieEscolhido === null) return false;
        if (tracoComEscolhaDePericia(especieSelecionada) && s.periciaEspecieEscolhida === null) return false;
        if (especieSelecionada.traços.some((t) => t.id === 'versatil') && s.talentoEspecieEscolhido === null) return false;
        if (opcoesSubescolhaNoWizard(especieSelecionada) && s.subescolhaEspecieEscolhida === null) return false;
        return true;
      },
      mensagemInvalida: 'Complete as escolhas da espécie antes de avançar.',
      randomize: randomizarEscolhasEspecie,
    },
    {
      name: '3c. Talento do Versátil',
      render: (p) => <TalentoEspecieEscolhasStep {...p} />,
      condicao: (s) => {
        const talento = talentoDoVersatil(s);
        return (
          talento?.concedeProficiencias !== undefined ||
          talento?.concedeMagiaIniciada === true ||
          talento?.concedeFerramentaGrupo !== undefined
        );
      },
      isValid: (s) => {
        const talento = talentoDoVersatil(s);
        if (talento?.concedeProficiencias) return s.proficienciasTalentoEspecieEscolhidas.length === talento.concedeProficiencias.quantidade;
        if (talento?.concedeMagiaIniciada) {
          return (
            s.listaMagiaIniciadaEspecieEscolhida !== null &&
            s.truquesMagiaIniciadaEspecieEscolhidos.length === 2 &&
            s.magiaMagiaIniciadaEspecieEscolhida !== null &&
            s.atributoMagiaIniciadaEspecieEscolhido !== null
          );
        }
        if (talento?.concedeFerramentaGrupo) return s.proficienciasTalentoEspecieEscolhidas.length === talento.concedeFerramentaGrupo.quantidade;
        return true;
      },
      mensagemInvalida: 'Complete as escolhas do talento do Versátil antes de avançar.',
    },
    {
      name: '3d. Atributos',
      render: (p) => (
        <AtributosStep {...p} valorSelecionado={valorSelecionado} setValorSelecionado={setValorSelecionado} />
      ),
      isValid: (s) => atributosOrdem.every((a) => s.atributos[a] !== null) && s.bonusEscolhas.length === 3,
      mensagemInvalida: 'Distribua os 6 atributos e os 3 pontos do ajuste de antecedente antes de avançar.',
      randomize: randomizarAtributos,
    },
    {
      name: '4. Línguas',
      render: (p) => <LinguasStep {...p} />,
      isValid: (s) => s.linguas.filter((l) => l !== 'Comum').length === totalIdiomasEsperados(s.classe),
      mensagemInvalida: 'Escolha os idiomas indicados antes de avançar.',
      randomize: randomizarLinguas,
    },
    {
      name: '5. Alinhamento',
      render: (p) => <AlinhamentoStep {...p} />,
      isValid: (s) => s.alinhamento !== null,
      mensagemInvalida: 'Escolha um alinhamento antes de avançar.',
      randomize: randomizarAlinhamento,
    },
    { name: '6. Loja', render: (p) => <LojaStep {...p} />, isValid: () => true },
    {
      name: '7. Resumo',
      render: (p) => <ResumoStep {...p} />,
      isValid: (s) => s.nome.trim().length > 0,
      mensagemInvalida: 'Digite um nome pro personagem antes de salvar.',
      randomize: randomizarResumo,
    },
  ];

  // Passos com `condicao` (ex: "2c. Talento da Origem") só entram na
  // sequência quando a condição bate com a seleção atual — filtrado de
  // novo a cada render, então `wizIndex` (guardado como número simples)
  // é grampeado (`idx`) pra nunca apontar pra fora dos passos ativos.
  const stepsAtivos = steps.filter((s) => !s.condicao || s.condicao(selection));
  const idx = Math.min(wizIndex, stepsAtivos.length - 1);
  const step = stepsAtivos[idx];
  const isLast = idx === stepsAtivos.length - 1;

  function wizNext() {
    if (!step.isValid(selection)) {
      setAviso(step.mensagemInvalida ?? 'Selecione o que falta antes de avançar.');
      return;
    }
    setAviso(null);
    if (isLast) {
      const pvMax = calcularPvMaximoNivel1(selection) ?? 0;
      armazenamentoPersonagens.salvar({
        id: gerarIdPersonagem(),
        criadoEm: new Date().toISOString(),
        nivel: 1,
        xp: selection.xp,
        pvAtual: pvMax,
        selecao: selection,
      });
      // A Ficha (Perfil/Mochila/Magias/Combat) ainda não lê o personagem
      // salvo — isso é a próxima entrega (A3). Por ora volta pra Lista,
      // que já mostra o personagem recém-criado com os números reais.
      navigate('/lista');
      return;
    }
    setWizIndex(idx + 1);
  }

  function wizPrev() {
    setAviso(null);
    if (idx === 0) {
      navigate('/home');
      return;
    }
    setWizIndex(idx - 1);
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.stepName}>{step.name}</div>
        </div>
        <div className={styles.progress}>
          {stepsAtivos.map((s, i) => (
            <div
              key={s.name}
              className={`${styles.dot} ${i < idx ? styles.dotDone : ''} ${i === idx ? styles.dotCurrent : ''}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.body}>{step.render({ selection, update })}</div>

      {step.randomize && (
        <div className={styles.randomFab} onClick={step.randomize} title="Sortear tudo desta etapa">
          🔀
        </div>
      )}

      {aviso && <div className={styles.warning}>{aviso}</div>}

      <div className={styles.navLayer}>
        <div className={`btn ${styles.pill}`} onClick={wizPrev}>
          ← Voltar
        </div>
        <div className={`btn btn-primary ${styles.pill}`} onClick={wizNext}>
          {isLast ? 'Salvar ✓' : 'Avançar →'}
        </div>
      </div>
    </div>
  );
}
