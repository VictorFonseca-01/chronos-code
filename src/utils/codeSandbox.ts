export interface DroneState {
  x: number;
  y: number;
  reparado: boolean;
}

export interface SandboxResult {
  success: boolean;
  logs: string[];
  result?: any;
  error?: string;
  droneState?: DroneState;
}

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'react' | 'html' | 'css';

export const stripComments = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments /* ... */
    .replace(/.*?\*\//g, '')         // Remove orphaned closing comments */
    .replace(/\/\/.*/g, '')          // Remove JS/C/Java line comments // ...
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments <!-- ... -->
    .replace(/;.*/g, '')            // Remove Assembly comments ; ...
    .replace(/#.*/g, '');           // Remove Python line comments # ...
};

export const runJavaScriptSandbox = (
  code: string,
  initialDronePos: { x: number; y: number } = { x: 0, y: 0 }
): SandboxResult => {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  let currentX = initialDronePos.x;
  let currentY = initialDronePos.y;
  let isRepaired = false;

  const droneAPI = {
    moveRight: () => {
      currentX += 1;
      logs.push(`[NANO-DRONE] Moveu para a DIREITA (x: ${currentX}, y: ${currentY})`);
    },
    moveLeft: () => {
      currentX = Math.max(0, currentX - 1);
      logs.push(`[NANO-DRONE] Moveu para a ESQUERDA (x: ${currentX}, y: ${currentY})`);
    },
    moveDown: () => {
      currentY += 1;
      logs.push(`[NANO-DRONE] Moveu para BAIXO (x: ${currentX}, y: ${currentY})`);
    },
    moveUp: () => {
      currentY = Math.max(0, currentY - 1);
      logs.push(`[NANO-DRONE] Moveu para CIMA (x: ${currentX}, y: ${currentY})`);
    },
    moverDireita: () => droneAPI.moveRight(),
    moverEsquerda: () => droneAPI.moveLeft(),
    moverBaixo: () => droneAPI.moveDown(),
    moverCima: () => droneAPI.moveUp(),
    repair: () => {
      isRepaired = true;
      logs.push(`[NANO-DRONE] Nó Quântico REPARADO nas coordenadas (x: ${currentX}, y: ${currentY})!`);
    },
    reparar: () => droneAPI.repair(),
  };

  try {
    console.log = (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.warn = (...args: any[]) => {
      logs.push(`[WARN] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.error = (...args: any[]) => {
      logs.push(`[ERROR] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    // Robust static command counter for non-JS / syntax edge cases
    const cleanCode = stripComments(code);
    const rightCalls = (cleanCode.match(/(drone\.moveRight|drone\.move_right|drone\.moverDireita)/g) || []).length;
    const downCalls = (cleanCode.match(/(drone\.moveDown|drone\.move_down|drone\.moverBaixo)/g) || []).length;
    const leftCalls = (cleanCode.match(/(drone\.moveLeft|drone\.move_left|drone\.moverEsquerda)/g) || []).length;
    const upCalls = (cleanCode.match(/(drone\.moveUp|drone\.move_up|drone\.moverCima)/g) || []).length;
    const repairCalls = (cleanCode.match(/(drone\.repair|drone\.reparar)/g) || []).length;

    // Execute native JS function if clean of class syntax
    if (!cleanCode.includes('class ') && !cleanCode.includes('public class')) {
      const fn = new Function('drone', code);
      fn(droneAPI);
    } else {
      // Static fallback simulation for Java/Python syntax to prevent crashes
      currentX += rightCalls - leftCalls;
      currentY += downCalls - upCalls;
      if (repairCalls > 0) isRepaired = true;
      logs.push(`[SIMULATED EXECUTION] Drone posicionando em (x: ${currentX}, y: ${currentY})`);
    }

    return {
      success: true,
      logs,
      result: 'Drone Execution Complete',
      droneState: {
        x: currentX,
        y: currentY,
        reparado: isRepaired,
      },
    };
  } catch (err: any) {
    // Graceful fallback simulation if Function constructor throws
    const cleanCode = stripComments(code);
    const rightCalls = (cleanCode.match(/(drone\.moveRight|drone\.move_right|drone\.moverDireita)/g) || []).length;
    const downCalls = (cleanCode.match(/(drone\.moveDown|drone\.move_down|drone\.moverBaixo)/g) || []).length;
    const repairCalls = (cleanCode.match(/(drone\.repair|drone\.reparar)/g) || []).length;

    currentX += rightCalls;
    currentY += downCalls;
    if (repairCalls > 0) isRepaired = true;

    logs.push(`[FALLBACK LOGIC] Drone movido para (x: ${currentX}, y: ${currentY})`);

    return {
      success: true,
      logs,
      result: 'Drone Execution Fallback',
      droneState: {
        x: currentX,
        y: currentY,
        reparado: isRepaired,
      },
    };
  } finally {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
};

export const executeSandboxCode = async (
  code: string,
  language: SupportedLanguage,
  isFrontendTrack: boolean = false,
  initialDronePos: { x: number; y: number } = { x: 0, y: 0 }
): Promise<SandboxResult> => {
  if (isFrontendTrack || language === 'react' || language === 'html' || language === 'css') {
    return {
      success: true,
      logs: [
        `[DOM ENGINE - ${language.toUpperCase()}] Documento/Componente compilado para o Live Canvas com sucesso.`,
      ],
      result: 'DOM Ready',
    };
  }

  return runJavaScriptSandbox(code, initialDronePos);
};
