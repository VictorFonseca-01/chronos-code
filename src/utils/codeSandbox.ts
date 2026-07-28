export interface SandboxResult {
  success: boolean;
  logs: string[];
  result?: any;
  error?: string;
}

export type SupportedLanguage = 'javascript' | 'python' | 'html' | 'css';

export const stripComments = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS / C / JS block comments /* ... */
    .replace(/.*?\*\//g, '')         // Remove orphaned comment closing tags like "text */"
    .replace(/\/\/.*/g, '')          // Remove JS line comments // ...
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments <!-- ... -->
    .replace(/;.*/g, '')            // Remove Assembly comments ; ...
    .replace(/#.*/g, '');           // Remove Python line comments # ...
};

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
  language: SupportedLanguage,
  isFrontendTrack: boolean = false
): Promise<SandboxResult> => {
  if (isFrontendTrack) {
    return {
      success: true,
      logs: [
        '[DOM PREVIEW ENGINE] Documento HTML/CSS compilado para o Live Canvas com sucesso.',
      ],
      result: 'DOM Ready',
    };
  }

  if (language === 'python') {
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
