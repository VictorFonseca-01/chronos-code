import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';

interface LivePreviewCanvasProps {
  code: string;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({ code }) => {
  const { t } = useTranslation();

  // Detect if code is CSS or HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(code);

  let formattedDoc = '';

  if (isHtml) {
    formattedDoc = code.includes('<html')
      ? code
      : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');
    body {
      margin: 0;
      padding: 24px;
      font-family: 'Fira Code', monospace, system-ui;
      background-color: #030712;
      color: #38bdf8;
      min-height: 100vh;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>
`;
  } else {
    // Cyberpunk Holographic HUD Base Template
    formattedDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Fira Code', monospace, system-ui;
      background-color: #030712;
      color: #38bdf8;
      min-height: 100vh;
      overflow: hidden;
    }
    
    /* PLAYER CSS STYLESHEET INJECTED HERE */
    ${code}
  </style>
</head>
<body>
  <div class="temporal-container">
    <div style="text-align: center; max-width: 540px; padding: 28px; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 16px; background: rgba(15, 23, 42, 0.7); box-shadow: 0 0 30px rgba(56, 189, 248, 0.15); backdrop-filter: blur(12px);">
      <div style="display: flex; items-center; justify-content: space-between; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 12px; margin-bottom: 16px; font-size: 11px; text-transform: uppercase; tracking: wider; color: #a855f7;">
        <span>[VISOR HOLOGRÁFICO HUD]</span>
        <span>STATUS: NÚCLEO CHRONOS ONLINE</span>
      </div>
      <h1 style="font-size: 26px; margin-bottom: 10px; font-weight: 800; color: #38bdf8; text-shadow: 0 0 12px rgba(56,189,248,0.5);">MATRIZ TEMPORAL</h1>
      <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Projeção do HUD de Arquiteto Quântico em tempo real.</p>
    </div>
  </div>
</body>
</html>
`;
  }

  return (
    <div className="w-full flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl min-h-[360px]">
      {/* Live Canvas Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            {t('live_preview_title')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t('live_preview_active')}</span>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950 relative min-h-[300px]">
        <iframe
          srcDoc={formattedDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          className="w-full h-full min-h-[320px] border-none bg-[#030712]"
        />
      </div>
    </div>
  );
};
