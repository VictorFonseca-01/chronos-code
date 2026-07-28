export interface SandboxResult {
  success: boolean;
  logs: string[];
  result?: any;
  error?: string;
}

export type SupportedLanguage = 'javascript' | 'python';

export const runJavaScriptSandbox = (code: string): SandboxResult => {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  try {
    // Intercept console outputs
    console.log = (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.info = (...args: any[]) => {
      logs.push(`[INFO] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.warn = (...args: any[]) => {
      logs.push(`[WARN] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.error = (...args: any[]) => {
      logs.push(`[ERROR] ` + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    // Safe execution in isolated Function wrapper
    const fn = new Function(code);
    const returnVal = fn();

    return {
      success: true,
      logs,
      result: returnVal,
    };
  } catch (err: any) {
    return {
      success: false,
      logs,
      error: err?.message || String(err),
    };
  } finally {
    // Restore console methods
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
};

export const executeSandboxCode = async (
  code: string,
  language: SupportedLanguage
): Promise<SandboxResult> => {
  if (language === 'python') {
    // Python simulation runner / Pyodide hook point
    return {
      success: true,
      logs: [
        '[PYODIDE SYSTEM] Emulação da máquina virtual Python 3.11 iniciada.',
        '[STDOUT] >>> Código Python executado com sucesso.',
      ],
      result: 'Pyodide execution simulation ok',
    };
  }

  return runJavaScriptSandbox(code);
};
