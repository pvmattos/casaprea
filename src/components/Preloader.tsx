import React, { useEffect, useState } from 'react';

export const Preloader: React.FC = () => {
  const [stage, setStage] = useState<'active' | 'leaving' | 'done'>('active');

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setStage('leaving');
    }, 950);

    const doneTimer = window.setTimeout(() => {
      setStage('done');
    }, 1800);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <div
      aria-hidden="true"
      className={`preloader-curtain fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0B1922] px-6 py-10 text-[#F6F3EB] pointer-events-none select-none ${
        stage === 'leaving' ? 'is-leaving' : ''
      }`}
    >
      {/* Topo discreto com coordenadas */}
      <div className="preloader-sub text-[10px] uppercase tracking-[0.34em] text-[#D5B895]/80">
        02° 48&apos; S · 40° 24&apos; W
      </div>

      {/* Centro com Marca Editorial e Linha Dourada */}
      <div className="flex flex-col items-center text-center">
        <span className="preloader-text font-editorial text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#F6F3EB]">
          Casa na Areia <span className="italic opacity-85">Preá</span>
        </span>

        <div className="mt-6 h-[1px] w-44 sm:w-56 overflow-hidden bg-white/15">
          <div className="preloader-bar h-full w-full bg-[#D5B895]" />
        </div>

        <span className="preloader-sub mt-4 text-[11px] uppercase tracking-[0.3em] text-[#EFE9DC]/75">
          Praia do Preá · Ceará · Brasil
        </span>
      </div>

      {/* Rodapé da abertura */}
      <div className="preloader-sub text-[10px] uppercase tracking-[0.28em] text-[#EFE9DC]/50">
        Pé na areia · Frente ao mar
      </div>
    </div>
  );
};
