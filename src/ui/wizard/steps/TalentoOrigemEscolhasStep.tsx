import { origens } from '../../../data/rulesets/dnd2024/origens';
import { talentosOrigem } from '../../../data/rulesets/dnd2024/talentos';
import { concessoesJaConcedidas } from '../../../core/concessoesJaConcedidas';
import { ProficienciaOuFerramentaEscolhas, IniciadoEmMagiaEscolhas } from './talentoEscolhasCompartilhado';
import type { StepProps } from './StepProps';

export default function TalentoOrigemEscolhasStep({ selection, update }: StepProps) {
  const origem = origens.find((o) => o.nome === selection.origem);
  const talento = origem ? talentosOrigem.find((t) => t.id === origem.talentoOrigemId) : undefined;

  if (!origem || !talento) {
    return <div className="label">Volte e selecione uma origem primeiro.</div>;
  }

  const jaConcedidas = concessoesJaConcedidas(selection, origem);

  if (talento.concedeMagiaIniciada) {
    const lista = origem.talentoOrigemVariante ?? '';
    return (
      <IniciadoEmMagiaEscolhas
        talento={talento}
        lista={lista}
        jaConcedidas={jaConcedidas}
        truquesEscolhidos={selection.truquesMagiaIniciadaEscolhidos}
        onToggleTruque={(nome) => {
          const atual = selection.truquesMagiaIniciadaEscolhidos;
          const i = atual.indexOf(nome);
          if (i > -1) update({ truquesMagiaIniciadaEscolhidos: atual.filter((x) => x !== nome) });
          else if (atual.length < 2) update({ truquesMagiaIniciadaEscolhidos: [...atual, nome] });
        }}
        magiaEscolhida={selection.magiaMagiaIniciadaEscolhida}
        onToggleMagia={(nome) =>
          update({ magiaMagiaIniciadaEscolhida: selection.magiaMagiaIniciadaEscolhida === nome ? null : nome })
        }
        atributoEscolhido={selection.atributoMagiaIniciadaEscolhido}
        onEscolherAtributo={(atributo) => update({ atributoMagiaIniciadaEscolhido: atributo })}
      />
    );
  }

  if (!talento.concedeProficiencias && !talento.concedeFerramentaGrupo) {
    return <div className="label">Volte e selecione uma origem primeiro.</div>;
  }

  const escolhidas = selection.proficienciasTalentoOrigemEscolhidas;
  const max = talento.concedeProficiencias?.quantidade ?? talento.concedeFerramentaGrupo!.quantidade;

  return (
    <ProficienciaOuFerramentaEscolhas
      talento={talento}
      jaConcedidas={jaConcedidas}
      escolhidas={escolhidas}
      onToggle={(nome) => {
        if (escolhidas.includes(nome)) update({ proficienciasTalentoOrigemEscolhidas: escolhidas.filter((x) => x !== nome) });
        else if (escolhidas.length < max) update({ proficienciasTalentoOrigemEscolhidas: [...escolhidas, nome] });
      }}
    />
  );
}
