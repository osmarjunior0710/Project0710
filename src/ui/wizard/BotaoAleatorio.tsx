import type { ReactNode } from 'react';

interface BotaoAleatorioProps {
  /** `true` = a lista já está completa: o toque sorteia tudo de novo. */
  cheia: boolean;
  onClick: () => void;
}

/** "🎲 Aleatório" das listas de "Escolha N" do wizard — preenche as vagas
 * que faltam (ver `core/sortearEscolhas.ts`); com a lista já cheia vira
 * "Sortear de novo". Não toca em nada além da própria lista. */
export function BotaoAleatorio({ cheia, onClick }: BotaoAleatorioProps) {
  return (
    <div className="btn" style={{ padding: '4px 10px', fontSize: 12, minHeight: 32 }} onClick={onClick}>
      🎲 {cheia ? 'Sortear de novo' : 'Aleatório'}
    </div>
  );
}

/** Título de seção com o botão à direita — mesma altura/margem do
 * `.section-title` normal. */
export function TituloComAleatorio({ children, botao }: { children: ReactNode; botao: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, margin: '12px 0 8px' }}>
      <div className="section-title" style={{ margin: 0 }}>
        {children}
      </div>
      {botao}
    </div>
  );
}
