import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DownloadApp: React.FC = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("Para instalar, use a opção 'Adicionar à tela de início' no menu do seu navegador.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDownloadAPK = () => {
    // Link fictício para o APK (o usuário deve substituir pelo link real do servidor)
    window.location.href = "https://github.com/seu-usuario/orca-eletrica/releases/latest/download/app.apk";
  };

  return (
    <div className="pb-32 animate-in fade-in duration-300 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Baixar Aplicativo</h2>
        <div className="w-12"></div>
      </header>

      <div className="px-6 py-10 flex flex-col items-center text-center">
        <div className="size-24 bg-primary rounded-[32px] flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
          <span className="material-symbols-outlined text-5xl text-slate-900">electrical_services</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">OrçaElétrica no seu Celular</h1>
        <p className="text-accent text-sm font-medium leading-relaxed max-w-[280px]">Tenha acesso rápido aos seus orçamentos mesmo sem internet.</p>

        <div className="w-full mt-12 space-y-4">
          {/* Opção PWA */}
          <button 
            onClick={handleInstallPWA}
            className="w-full bg-white dark:bg-card-dark border-2 border-primary/20 p-6 rounded-[24px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all text-left"
          >
            <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">install_mobile</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Instalar Versão Web</h3>
              <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">Recomendado (PWA)</p>
            </div>
            <span className="material-symbols-outlined text-accent opacity-30">chevron_right</span>
          </button>

          {/* Opção APK */}
          <button 
            onClick={handleDownloadAPK}
            className="w-full bg-white dark:bg-card-dark border-2 border-slate-100 dark:border-gray-800 p-6 rounded-[24px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all text-left"
          >
            <div className="size-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">android</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Baixar APK para Android</h3>
              <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">Versão Nativa Directa</p>
            </div>
            <span className="material-symbols-outlined text-accent opacity-30">download</span>
          </button>
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-[24px] border border-primary/10 text-left w-full">
          <div className="flex items-center gap-2 mb-3">
             <span className="material-symbols-outlined text-primary text-lg">info</span>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Como instalar no iPhone</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            1. Toque no botão de <b>Compartilhar</b> <span className="material-symbols-outlined text-[14px] align-middle">ios_share</span> no Safari.<br/>
            2. Role para baixo e toque em <b>Adicionar à Tela de Início</b>.<br/>
            3. Toque em <b>Adicionar</b> no canto superior direito.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;