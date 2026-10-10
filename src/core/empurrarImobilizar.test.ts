import { describe, expect, it } from 'vitest';
import { cdEmpurrarImobilizar, explicarCdEmpurrarImobilizar, textosImobilizar } from './empurrarImobilizar';

describe('Empurrar/Imobilizar (Ataque Desarmado)', () => {
  it('CD = 8 + bônus de acerto do Ataque Desarmado (atributo + proficiência)', () => {
    expect(cdEmpurrarImobilizar(4)).toBe(12); // FOR +2, prof +2
    expect(cdEmpurrarImobilizar(13)).toBe(21); // Monge nível 20: DES +7 + prof +6
  });

  it('borda: bônus de acerto negativo ou zero ainda dá CD >= 8 menos a penalidade', () => {
    expect(cdEmpurrarImobilizar(0)).toBe(8);
    expect(cdEmpurrarImobilizar(-1)).toBe(7);
  });

  it('explicação mostra CD base + as linhas do acerto + o total', () => {
    const e = explicarCdEmpurrarImobilizar(
      [
        { label: 'mod. DES (Ataques com Destreza)', valor: '+4' },
        { label: 'Bônus de Proficiência', valor: '+3' },
      ],
      15,
    );
    expect(e.linhas).toHaveLength(3);
    expect(e.linhas[0]).toEqual({ label: 'CD base', valor: '8' });
    expect(e.total).toEqual({ label: 'CD', valor: '15' });
  });

  it('o texto do Imobilizar repete a CD pra escapar', () => {
    expect(textosImobilizar(14).falha).toContain('14');
  });
});
