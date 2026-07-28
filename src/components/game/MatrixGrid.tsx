import React from 'react';

interface MatrixGridProps {
  dronePos: { x: number; y: number };
  gridSize?: number;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({ dronePos, gridSize = 6 }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-950 absolute inset-0 z-0">
      <div className="grid grid-cols-6 gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isDroneHere = dronePos.x === x && dronePos.y === y;

          return (
            <div key={index} className="w-16 h-16 border border-slate-700/50 rounded flex items-center justify-center relative bg-slate-800/20">
              <span className="text-[10px] absolute top-1 left-1 text-slate-600">{x},{y}</span>
              {/* O Drone */}
              {isDroneHere && (
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse">
                  <span className="text-white font-bold">Bot</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
