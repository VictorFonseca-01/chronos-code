import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw, HelpCircle, Terminal as TerminalIcon, CheckCircle2, XCircle, Sparkles, Code2, Eye } from 'lucide-react';
import { Challenge, TestCase, MultiLanguageMap } from '../../types/game';
import { executeSandboxCode, SupportedLanguage, SandboxResult, stripComments } from '../../utils/codeSandbox';
import { LivePreviewCanvas } from './LivePreviewCanvas';

interface CodeEditorTerminalProps {
  challenge: Challenge;
  onSuccess: (code: string, timeSeconds: number) => void;
}

interface TestRunResult {
  testId: string;
  passed: boolean;
  descriptionKey: string;
}

export const CodeEditorTerminal: React.FC<CodeEditorTerminalProps> = ({
  challenge,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isFrontend = challenge.track === 'frontend';

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    isFrontend ? 'html' : 'javascript'
  );

  // Set default language when challenge changes
  useEffect(() => {
    setSelectedLanguage(isFrontend ? 'html' : 'javascript');
  }, [challenge.id, isFrontend]);

  // Dynamic language resolution helpers
  const getTranslatedDescription = () => {
    if (typeof challenge.descriptionKey === 'object' && challenge.descriptionKey[selectedLanguage]) {
      const key = challenge.descriptionKey[selectedLanguage]!;
      return t(key);
    }
    return t(challenge.descriptionKey as string);
  };

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

  const getActiveHints = (): string[] => {
    if (typeof challenge.hintsKeys === 'object' && !Array.isArray(challenge.hintsKeys) && (challenge.hintsKeys as MultiLanguageMap<string[]>)[selectedLanguage]) {
      return (challenge.hintsKeys as MultiLanguageMap<string[]>)[selectedLanguage]!;
    }
    return Array.isArray(challenge.hintsKeys) ? challenge.hintsKeys : [];
  };

  const getActiveTestCases = (): TestCase[] => {
    if (typeof challenge.testCases === 'object' && !Array.isArray(challenge.testCases) && (challenge.testCases as MultiLanguageMap<TestCase[]>)[selectedLanguage]) {
      return (challenge.testCases as MultiLanguageMap<TestCase[]>)[selectedLanguage]!;
    }
    return Array.isArray(challenge.testCases) ? challenge.testCases : [];
  };

  const [code, setCode] = useState<string>(getTranslatedInitialCode(selectedLanguage));
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
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
    setShowHint(false);
    setActiveHintIndex(0);
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

    // Execute Sandbox for real stdout/stderr capture
    const sandboxRes: SandboxResult = await executeSandboxCode(code, selectedLanguage, isFrontend);
    const logs = sandboxRes.logs || [];
    if (sandboxRes.error) {
      logs.push(`[EXEC ERROR] ${sandboxRes.error}`);
    }
    setSandboxLogs(logs);

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

  const activeHints = getActiveHints();
  const lines = code.split('\n');

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Mission Context & Hints (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t(challenge.titleKey)}
            </h2>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              +{challenge.xpReward} XP
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed font-light">
            {getTranslatedDescription()}
          </p>

          {/* Context box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
            <span className="text-blue-400 font-semibold block uppercase tracking-wider">
              [CHRONO BRIEFING]
            </span>
            <p className="text-slate-300">
              {t(challenge.contextKey as string)}
            </p>
          </div>

          {/* Hints Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? t('hide_hint') : t('show_hint')}</span>
            </button>

            {showHint && activeHints.length > 0 && (
              <div className="mt-3 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-purple-200 space-y-2">
                <p className="text-purple-300 font-semibold">
                  💡 {t('hint_label')} #{activeHintIndex + 1}:
                </p>
                <p>{t(activeHints[activeHintIndex])}</p>
                {activeHints.length > 1 && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() =>
                        setActiveHintIndex((prev) => (prev + 1) % activeHints.length)
                      }
                      className="px-2 py-1 rounded bg-purple-900/50 hover:bg-purple-800 text-[10px] text-purple-200"
                    >
                      {t('next_hint')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Code Editor, Tabs & Terminal (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Editor Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Editor Header Bar with Tabs / Language Dropdown */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            {/* Left Header: File badge or Frontend Tabs / Language selector */}
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
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
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

              {isFrontend && (
                /* Tabs: Editor vs Live Preview */
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs ml-auto sm:ml-0">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'editor'
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{t('tab_editor')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'preview'
                        ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('tab_live_preview')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2">
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
          </div>

          {/* Interactive Textarea OR Live Canvas */}
          {activeTab === 'preview' && isFrontend ? (
            <LivePreviewCanvas code={code} />
          ) : (
            <div className="relative flex font-mono text-xs sm:text-sm bg-slate-950 min-h-[260px] p-4">
              {/* Line numbers */}
              <div className="select-none pr-4 text-slate-600 text-right font-mono border-r border-slate-900 leading-6">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable code textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-4 bg-transparent text-emerald-400 focus:outline-none font-mono resize-none leading-6 tracking-wide placeholder-slate-700"
                rows={Math.max(10, lines.length)}
                spellCheck={false}
              />
            </div>
          )}

          {/* Terminal Log Output & Sandbox Console */}
          <div className="border-t border-slate-800 bg-slate-900/60 p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800/60 pb-2">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-bold text-slate-300">
                  {t('console_title')}
                </span>
              </div>
              <span>{t('time_elapsed_label')}: {secondsElapsed}s</span>
            </div>

            {!hasRun ? (
              <p className="text-slate-500 italic">
                &gt; {t('console_placeholder')}
              </p>
            ) : (
              <div className="space-y-2">
                {/* Sandbox Real Execution Logs */}
                {sandboxLogs.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1 font-mono text-slate-300">
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
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      res.passed
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                    }`}
                  >
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{t(res.descriptionKey)}</span>
                  </div>
                ))}

                {testResults.every((r) => r.passed) && (
                  <div className="pt-2 text-emerald-400 font-bold flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('console_success')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
