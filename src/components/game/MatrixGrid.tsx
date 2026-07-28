import React from 'react';
import { Bot, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface MatrixGridProps {
  dronePos?: { x: number; y: number };
  gridSize?: number;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  dronePos = { x: 2, y: 2 },
  gridSize = 6,
}) => {
  const cells = Array.from({ length: gridSize * gridSize });

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden bg-radial-cyber p-6">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />

      {/* Grid Center Container */}
      <div className="relative pointer-events-auto flex flex-col items-center gap-4 max-w-2xl w-full p-8 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl shadow-[0_0_80px_rgba(59,130,246,0.15)]">
        {/* Grid Status Header Bar */}
        <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span className="text-slate-200 font-bold tracking-widest uppercase">
              GRID DA MATRIZ QUÂNTICA (6x6)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              NANO-DRONE: ONLINE
            </span>
            <span className="text-slate-500">POS: [{dronePos.x}, {dronePos.y}]</span>
          </div>
        </div>

        {/* 6x6 Spatial Cell Matrix */}
        <div className="grid grid-cols-6 gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60 w-full aspect-square max-w-[420px]">
          {cells.map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const isDroneHere = x === dronePos.x && y === dronePos.y;
            const isGlitchNode = (x === 1 && y === 4) || (x === 4 && y === 1);

            return (
              <div
                key={idx}
                className={`relative rounded-xl border flex items-center justify-center transition-all duration-300 ${
                  isDroneHere
                    ? 'bg-blue-600/30 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-105 z-10'
                    : isGlitchNode
                    ? 'bg-purple-900/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse'
                    : 'bg-slate-950/60 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/40'
                }`}
              >
                {/* Cell Coordinates indicator */}
                <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-600 select-none">
                  {x},{y}
                </span>

                {/* Render Nano-Drone Avatar */}
                {isDroneHere && (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-md animate-ping" />
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-slate-950 shadow-lg relative">
                      <Bot className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                )}

                {/* Render Glitch Node Target */}
                {isGlitchNode && !isDroneHere && (
                  <div className="flex flex-col items-center justify-center gap-0.5 text-purple-400">
                    <ShieldAlert className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid Footer Bar */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ALINHAMENTO DE ENERGIA: ESTÁVEL</span>
          </div>
          <span>SISTEMA NANO-ROBÓTICO V4.0</span>
        </div>
      </div>
    </div>
  );
};
