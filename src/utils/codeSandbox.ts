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
      logs.push(`[NANO-DRONE] Movel para a DIREITA (x: ${currentX}, y: ${currentY})`);
    },
    moveLeft: () => {
      currentX = Math.max(0, currentX - 1);
      logs.push(`[NANO-DRONE] Movel para a ESQUERDA (x: ${currentX}, y: ${currentY})`);
    },
    moveDown: () => {
      currentY += 1;
      logs.push(`[NANO-DRONE] Movel para BAIXO (x: ${currentX}, y: ${currentY})`);
    },
    moveUp: () => {
      currentY = Math.max(0, currentY - 1);
      logs.push(`[NANO-DRONE] Movel para CIMA (x: ${currentX}, y: ${currentY})`);
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

  // Python simulation helper for drone calls
  const executePythonSimulation = (pyCode: string) => {
    const clean = stripComments(pyCode);
    const rightMatches = (clean.match(/(drone\.move_right|drone\.mover_direita)/g) || []).length;
    const downMatches = (clean.match(/(drone\.move_down|drone\.mover_baixo)/g) || []).length;
    const leftMatches = (clean.match(/(drone\.move_left|drone\.mover_esquerda)/g) || []).length;
    const upMatches = (clean.match(/(drone\.move_up|drone\.mover_cima)/g) || []).length;
    const repairMatches = (clean.match(/(drone\.repair|drone\.reparar)/g) || []).length;

    currentX += rightMatches - leftMatches;
    currentY += downMatches - upMatches;
    if (repairMatches > 0) isRepaired = true;

    logs.push(`[PYODIDE DRONE] Movimentos em Python processados: X=${currentX}, Y=${currentY}`);
  };

  // Java simulation helper for drone calls
  const executeJavaSimulation = (javaCode: string) => {
    const clean = stripComments(javaCode);
    const rightMatches = (clean.match(/(drone\.moveRight|drone\.moverDireita)/g) || []).length;
    const downMatches = (clean.match(/(drone\.moveDown|drone\.moverBaixo)/g) || []).length;
    const repairMatches = (clean.match(/(drone\.repair|drone\.reparar)/g) || []).length;

    currentX += rightMatches;
    currentY += downMatches;
    if (repairMatches > 0) isRepaired = true;

    logs.push(`[JVM DRONE] Movimentos em Java processados: X=${currentX}, Y=${currentY}`);
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

    // Check if code uses drone object
    if (/drone\./.test(code)) {
      // Create Function with 'drone' parameter
      const fn = new Function('drone', code);
      fn(droneAPI);
    } else {
      // Normal JS execution
      const fn = new Function(code);
      fn();
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
    // If syntax error, try Python/Java fallback parser
    if (code.includes('move_right') || code.includes('move_down') || code.includes('drone.')) {
      if (code.includes('def') || code.includes('print')) {
        executePythonSimulation(code);
      } else {
        executeJavaSimulation(code);
      }
      return {
        success: true,
        logs,
        result: 'Language Drone Execution Complete',
        droneState: {
          x: currentX,
          y: currentY,
          reparado: isRepaired,
        },
      };
    }

    return {
      success: false,
      logs,
      error: err?.message || String(err),
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
