import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw, HelpCircle, Terminal as TerminalIcon, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Challenge, TestCase } from '../../types/game';

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

  const getTranslatedInitialCode = () => {
    return t(challenge.initialCodeKey) || challenge.initialCode;
  };

  const [code, setCode] = useState<string>(getTranslatedInitialCode());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
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

  // Reset editor when challenge or language changes
  useEffect(() => {
    setCode(t(challenge.initialCodeKey) || challenge.initialCode);
    setTestResults([]);
    setHasRun(false);
    setShowHint(false);
    setActiveHintIndex(0);
    setSecondsElapsed(0);
  }, [challenge.id, i18n.language, t]);

  const handleResetCode = () => {
    setCode(t(challenge.initialCodeKey) || challenge.initialCode);
    setTestResults([]);
    setHasRun(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setHasRun(true);

    setTimeout(() => {
      const results: TestRunResult[] = challenge.testCases.map((tc: TestCase) => ({
        testId: tc.id,
        passed: tc.testFn(code),
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
            {t(challenge.descriptionKey)}
          </p>

          {/* Context box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
            <span className="text-blue-400 font-semibold block uppercase tracking-wider">
              [CHRONO BRIEFING]
            </span>
            <p className="text-slate-300">
              {t(challenge.contextKey)}
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

            {showHint && challenge.hintsKeys.length > 0 && (
              <div className="mt-3 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-purple-200 space-y-2">
                <p className="text-purple-300 font-semibold">
                  💡 {t('hint_label')} #{activeHintIndex + 1}:
                </p>
                <p>{t(challenge.hintsKeys[activeHintIndex])}</p>
                {challenge.hintsKeys.length > 1 && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() =>
                        setActiveHintIndex((prev) => (prev + 1) % challenge.hintsKeys.length)
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

      {/* Right Column: Code Editor & Terminal (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Editor Header Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                chronos_editor.{challenge.track === 'backend' ? 'asm' : 'html'}
              </span>
            </div>

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

          {/* Interactive Textarea & Line Numbers */}
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

          {/* Terminal Log Output */}
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
