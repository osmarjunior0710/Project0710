import { talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import { origens } from '../../../data/rulesets/dnd2024/origens';
import { especies } from '../../../data/rulesets/dnd2024/especies';
import { concessoesJaConcedidas } from '../../../core/concessoesJaConcedidas';
import { ProficienciaOuFerramentaEscolhas, IniciadoEmMagiaEscolhas } from './talentoEscolhasCompartilhado';
import type { StepProps } from './StepProps';

/** Listas de classe disponíveis pra "Iniciado em Magia" pego avulso
 * (traço Versátil do Humano) — as mesmas 3 que as Origens Acólito/
 * Guia/Sábio fixam via `Origem.talentoOrigemVariante`, só que aqui o
 * jogador escolhe livremente (sem Origem pra fixar por ele). */
const LISTAS_INICIADO_EM_MAGIA = ['Clérigo', 'Druida', 'Mago'];

/** Mesma tela de `TalentoOrigemEscolhasStep`, pro talento pego avulso
 * pelo traço Versátil (Humano) — guarda a escolha numa "gaveta"
 * separada (`proficienciasTalentoEspecieEscolhidas` e afins, ver
 * `core/personagem.ts`) pra não colidir com o Talento de Origem
 * quando os dois forem do mesmo tipo (ex.: Origem Sábio + Versátil
 * também Iniciado em Magia, numa lista de classe diferente). */
export default function TalentoEspecieEscolhasStep({ selection, update }: StepProps) {
  const talento = talentosOrigem.find((t) => t.id === selection.talentoEspecieEscolhido);
  if (!talento) {
    return <div className="label">Volte e escolha o talento do Versátil primeiro.</div>;
  }

  const origemAtual = origens.find((o) => o.nome === selection.origem);
  const especieAtual = especies.find((e) => e.nome === selection.especie);
  const jaConcedidas = concessoesJaConcedidas(selection, origemAtual, especieAtual);

  if (talento.concedeMagiaIniciada) {
    const lista = selection.listaMagiaIniciadaEspecieEscolhida ?? '';
    return (
      <IniciadoEmMagiaEscolhas
        talento={talento}
        lista={lista}
        jaConcedidas={jaConcedidas}
        truquesEscolhidos={selection.truquesMagiaIniciadaEspecieEscolhidos}
        onToggleTruque={(nome) => {
          const atual = selection.truquesMagiaIniciadaEspecieEscolhidos;
          const i = atual.indexOf(nome);
          if (i > -1) update({ truquesMagiaIniciadaEspecieEscolhidos: atual.filter((x) => x !== nome) });
          else if (atual.length < 2) update({ truquesMagiaIniciadaEspecieEscolhidos: [...atual, nome] });
        }}
        magiaEscolhida={selection.magiaMagiaIniciadaEspecieEscolhida}
        onToggleMagia={(nome) =>
          update({
            magiaMagiaIniciadaEspecieEscolhida: selection.magiaMagiaIniciadaEspecieEscolhida === nome ? null : nome,
          })
        }
        atributoEscolhido={selection.atributoMagiaIniciadaEspecieEscolhido}
        onEscolherAtributo={(atributo) => update({ atributoMagiaIniciadaEspecieEscolhido: atributo })}
        seletorLista={
          <>
            <div className="section-title">Lista de magia</div>
            <div className="label" style={{ marginBottom: 4 }}>
              Pego avulso pelo Versátil — escolha de qual classe vêm os truques/magia abaixo.
            </div>
            {LISTAS_INICIADO_EM_MAGIA.map((nomeLista) => (
              <div
                key={nomeLista}
                className="check-row"
                onClick={() =>
                  update({
                    listaMagiaIniciadaEspecieEscolhida: nomeLista,
                    // Troca de lista invalida truques/magia da lista antiga.
                    truquesMagiaIniciadaEspecieEscolhidos: [],
                    magiaMagiaIniciadaEspecieEscolhida: null,
                  })
                }
              >
                <div
                  className={`check-box ${selection.listaMagiaIniciadaEspecieEscolhida === nomeLista ? 'checked' : ''}`}
                />
                <span className="check-label">{nomeLista}</span>
              </div>
            ))}
          </>
        }
      />
    );
  }

  if (!talento.concedeProficiencias && !talento.concedeFerramentaGrupo) {
    return <div className="label">Volte e escolha o talento do Versátil primeiro.</div>;
  }

  const escolhidas = selection.proficienciasTalentoEspecieEscolhidas;
  const max = talento.concedeProficiencias?.quantidade ?? talento.concedeFerramentaGrupo!.quantidade;

  return (
    <ProficienciaOuFerramentaEscolhas
      talento={talento}
      jaConcedidas={jaConcedidas}
      escolhidas={escolhidas}
      onToggle={(nome) => {
        if (escolhidas.includes(nome)) update({ proficienciasTalentoEspecieEscolhidas: escolhidas.filter((x) => x !== nome) });
        else if (escolhidas.length < max) update({ proficienciasTalentoEspecieEscolhidas: [...escolhidas, nome] });
      }}
    />
  );
}
