import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw, Terminal as TerminalIcon, CheckCircle2, XCircle, Sparkles, Code2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Challenge, TestCase, MultiLanguageMap } from '../../types/game';
import { executeSandboxCode, SupportedLanguage, SandboxResult, stripComments } from '../../utils/codeSandbox';
import { LivePreviewCanvas } from './LivePreviewCanvas';

interface CodeEditorTerminalProps {
  challenge: Challenge;
  onSuccess: (code: string, timeSeconds: number) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onDroneMove?: (dronePos: { x: number; y: number }, isRepaired: boolean) => void;
  dronePos?: { x: number; y: number };
}

interface TestRunResult {
  testId: string;
  passed: boolean;
  descriptionKey: string;
}

export const CodeEditorTerminal: React.FC<CodeEditorTerminalProps> = ({
  challenge,
  onSuccess,
  selectedLanguage,
  onLanguageChange,
  onDroneMove,
  dronePos = { x: 0, y: 0 },
}) => {
  const { t, i18n } = useTranslation();
  const isFrontend = challenge.track === 'frontend';

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const getTranslatedInitialCode = (lang: SupportedLanguage = selectedLanguage) => {
    const langKey = `${challenge.initialCodeKey}_${lang}`;
    const translatedLangKey = t(langKey);
    if (translatedLangKey && translatedLangKey !== langKey) {
      return translatedLangKey;
    }
    const defaultTranslated = t(challenge.initialCodeKey);
    if (defaultTranslated && defaultTranslated !== challenge.initialCodeKey) {
      return defaultTranslated;
    }
    if (typeof challenge.initialCode === 'object' && (challenge.initialCode as MultiLanguageMap<string>)[lang]) {
      return (challenge.initialCode as MultiLanguageMap<string>)[lang]!;
    }
    return typeof challenge.initialCode === 'string' ? challenge.initialCode : '';
  };

  const getActiveTestCases = (): TestCase[] => {
    if (typeof challenge.testCases === 'object' && !Array.isArray(challenge.testCases) && (challenge.testCases as MultiLanguageMap<TestCase[]>)[selectedLanguage]) {
      return (challenge.testCases as MultiLanguageMap<TestCase[]>)[selectedLanguage]!;
    }
    return Array.isArray(challenge.testCases) ? challenge.testCases : [];
  };

  const [code, setCode] = useState<string>(getTranslatedInitialCode(selectedLanguage));
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Timer tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset editor when challenge, language or i18n locale changes
  useEffect(() => {
    setCode(getTranslatedInitialCode(selectedLanguage));
    setTestResults([]);
    setSandboxLogs([]);
    setHasRun(false);
    setSecondsElapsed(0);
    setActiveTab('editor');
  }, [challenge.id, selectedLanguage, i18n.language]);

  const handleResetCode = () => {
    setCode(getTranslatedInitialCode(selectedLanguage));
    setTestResults([]);
    setSandboxLogs([]);
    setHasRun(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setHasRun(true);

    // Strip comments to validate actual executable code
    const cleanCode = stripComments(code).trim();
    const rawInitial = getTranslatedInitialCode(selectedLanguage);
    const cleanInitial = stripComments(rawInitial).trim();

    // Verification fails if code is empty or unchanged from initial comments
    const isUnchanged = cleanCode === cleanInitial || cleanCode.length === 0;

    // Execute Sandbox for real stdout/stderr capture and drone state updates
    const sandboxRes: SandboxResult = await executeSandboxCode(code, selectedLanguage, isFrontend, dronePos);
    const logs = sandboxRes.logs || [];
    if (sandboxRes.error) {
      logs.push(`[EXEC ERROR] ${sandboxRes.error}`);
    }
    setSandboxLogs(logs);

    // Update real-time Drone State in React
    if (sandboxRes.droneState && onDroneMove) {
      onDroneMove(
        { x: sandboxRes.droneState.x, y: sandboxRes.droneState.y },
        sandboxRes.droneState.reparado
      );
    }

    const currentTestCases = getActiveTestCases();

    setTimeout(() => {
      const results: TestRunResult[] = currentTestCases.map((tc: TestCase) => ({
        testId: tc.id,
        passed: !isUnchanged && tc.testFn(cleanCode),
        descriptionKey: tc.descriptionKey,
      }));

      setTestResults(results);
      setIsRunning(false);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        onSuccess(code, secondsElapsed);
      }
    }, 400);
  };

  const getFileExtension = () => {
    switch (selectedLanguage) {
      case 'python': return 'py';
      case 'java': return 'java';
      case 'react': return 'jsx';
      case 'css': return 'css';
      case 'html': return 'html';
      default: return 'js';
    }
  };

  const lines = code.split('\n');

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-full max-w-xl shadow-2xl backdrop-blur-2xl bg-slate-950/90 border border-slate-800 rounded-2xl z-40 overflow-hidden transition-all duration-300">
      {/* Header Bar with Minimize/Expand Toggle */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <span className="ml-1 text-xs font-mono text-slate-400 font-bold">
            chronos_editor.{getFileExtension()}
          </span>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">
              {t('language_label')}:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 font-mono text-xs text-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {isFrontend ? (
                <>
                  <option value="html">HTML 🌐</option>
                  <option value="react">React (JSX) ⚛️</option>
                </>
              ) : (
                <>
                  <option value="javascript">JavaScript ⚡</option>
                  <option value="python">Python 🐍</option>
                  <option value="java">Java ☕</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {isFrontend && !isMinimized && (
            <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 font-mono text-[11px]">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg transition-all ${
                  activeTab === 'editor'
                    ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>{t('tab_editor')}</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg transition-all ${
                  activeTab === 'preview'
                    ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{t('tab_live_preview')}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title={isMinimized ? "Expandir Editor" : "Minimizar Editor"}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Editor Body */}
      {!isMinimized && (
        <div className="flex flex-col">
          {/* Interactive Textarea OR Live Canvas */}
          {activeTab === 'preview' && isFrontend ? (
            <LivePreviewCanvas code={code} />
          ) : (
            <div className="relative flex font-mono text-xs bg-slate-950 min-h-[220px] max-h-[300px] overflow-auto p-3">
              {/* Line numbers */}
              <div className="select-none pr-3 text-slate-600 text-right font-mono border-r border-slate-900 leading-6">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable code textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-3 bg-transparent text-emerald-400 focus:outline-none font-mono resize-none leading-6 tracking-wide placeholder-slate-700"
                rows={Math.max(8, lines.length)}
                spellCheck={false}
              />
            </div>
          )}

          {/* Action Button & Console */}
          <div className="border-t border-slate-800 bg-slate-900/60 p-3 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleResetCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
                title={t('reset_code')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('reset_code')}</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-1.5 rounded-lg gradient-cyber text-white font-mono text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                {isRunning ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{t('run_and_validate')}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800/60 pb-1.5">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase tracking-wider font-bold text-slate-300">
                  {t('console_title')}
                </span>
              </div>
              <span>{t('time_elapsed_label')}: {secondsElapsed}s</span>
            </div>

            {!hasRun ? (
              <p className="text-slate-500 italic text-[11px]">
                &gt; {t('console_placeholder')}
              </p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-auto">
                {/* Sandbox Real Execution Logs */}
                {sandboxLogs.length > 0 && (
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-0.5 font-mono text-slate-300">
                    <span className="text-blue-400 font-bold block">[SANDBOX OUTPUT]</span>
                    {sandboxLogs.map((log, idx) => (
                      <p key={idx} className="text-slate-400">
                        &gt; {log}
                      </p>
                    ))}
                  </div>
                )}

                {/* Validation Test Case Results */}
                {testResults.map((res) => (
                  <div
                    key={res.testId}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] ${
                      res.passed
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                    }`}
                  >
                    {res.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span>{t(res.descriptionKey)}</span>
                  </div>
                ))}

                {testResults.every((r) => r.passed) && (
                  <div className="pt-1 text-emerald-400 font-bold text-[11px] flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('console_success')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
