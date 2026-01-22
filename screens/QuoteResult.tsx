import React, { useState } from 'react';
import { ClientInfo, ServiceItem, AppSettings, Quote, QuoteStatus, UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  client: ClientInfo;
  items: ServiceItem[];
  difficulty: number;
  settings: AppSettings;
  userProfile: UserProfile;
  onSave: (quote: Quote) => void;
}

const QuoteResult: React.FC<Props> = ({ client, items, difficulty, settings, userProfile, onSave }) => {
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);
  
  const laborValue = items.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0) * difficulty;
  const directMaterialsValue = items.reduce((acc, item) => acc + ((item.materialPrice || 0) * item.quantity), 0);
  const materialsValue = directMaterialsValue + (laborValue * (settings.multipliers.globalProfit / 100));
  const travelValue = settings.logistics.minVisitFee;
  const totalValue = laborValue + materialsValue + travelValue;

  const quoteId = Math.floor(1000 + Math.random() * 9000).toString();
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSave = () => {
    const newQuote: Quote = {
      id: quoteId,
      date: currentDate,
      client,
      items,
      difficultyMultiplier: difficulty,
      totalValue,
      status: QuoteStatus.PENDING
    };
    onSave(newQuote);
    navigate('/history');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const handleSendWhatsApp = () => {
    const phoneDigits = client.phone.replace(/\D/g, '');
    
    if (!phoneDigits || phoneDigits.length < 8) {
      setShowPhoneWarning(true);
      return;
    }

    if (sendStatus !== 'idle') return;
    setSendStatus('sending');

    setTimeout(() => {
      const greeting = getGreeting();
      const serviceList = items
        .filter(item => item.quantity > 0)
        .map(item => `• *${item.name}*: ${item.quantity} un - R$ ${( (item.basePrice || 0) * item.quantity * difficulty ).toLocaleString('pt-BR')}`)
        .join('\n');

      const message = `${greeting} ${client.name}!\n\n` +
        `Segue seu orçamento conforme solicitado. Fico à disposição para qualquer dúvida.\n\n` +
        `*DETALHES DO ORÇAMENTO*\n` +
        `${serviceList}\n\n` +
        `*RESUMO DOS VALORES*\n` +
        `Mão de Obra: R$ ${laborValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
        `Materiais: R$ ${materialsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
        `Taxa de Visita: R$ ${travelValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
        `*VALOR TOTAL: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n\n` +
        `_Válido por 15 dias._\n\n` +
        `Atenciosamente,\n` +
        `*${userProfile.companyName || userProfile.name}*`;

      const url = `https://wa.me/${phoneDigits.startsWith('55') ? phoneDigits : '55' + phoneDigits}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      setSendStatus('success');
      setTimeout(() => setSendStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="pb-52 animate-in fade-in duration-500 min-h-screen relative">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center p-4 print:hidden">
        <button onClick={() => navigate('/new-step-2')} className="text-slate-900 dark:text-white flex size-12 items-center justify-center cursor-pointer active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">Resultado</h2>
      </header>

      <div className="flex flex-col items-center gap-4 py-8 px-6 print:hidden">
        <div className="size-20 bg-card-dark rounded-2xl border-2 border-primary/20 flex items-center justify-center shadow-lg overflow-hidden">
          <img src={`https://picsum.photos/seed/${userProfile.name}/200/200`} alt="Logo" className="opacity-80 object-cover w-full h-full" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight line-clamp-1">{userProfile.companyName || userProfile.name}</h1>
          <p className="text-accent text-xs font-semibold uppercase tracking-widest opacity-70">Serviços Elétricos</p>
          <div className="mt-3 inline-block px-3 py-1 bg-primary/10 rounded-full">
            <p className="text-primary text-[9px] uppercase font-black tracking-widest">Orçamento #{quoteId}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8 print:hidden">
        <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
          <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-3 relative z-10">Investimento Total</p>
          <h2 className="text-slate-900 dark:text-white text-5xl font-black tracking-tighter mb-4 relative z-10">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex justify-center relative z-10">
            <span className="inline-flex items-center px-4 py-1.5 bg-green-50 dark:bg-green-900/10 text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-800/30">
              <span className="material-symbols-outlined text-[14px] mr-2 filled">verified</span> Válido por 15 dias
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 print:hidden">
        <div className="flex items-center justify-between pb-1 px-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-accent">Resumo Financeiro</h3>
          <span className="material-symbols-outlined text-accent text-lg">receipt_long</span>
        </div>
        
        <SummaryCard icon="construction" label="Mão de Obra" sub="Serviços Técnicos" value={laborValue} />
        <SummaryCard icon="inventory_2" label="Materiais" sub="Insumos Estimados" value={materialsValue} />
        <SummaryCard icon="local_shipping" label="Logística" sub="Deslocamento" value={travelValue} />
      </div>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 z-50 print:hidden">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleSendWhatsApp}
            disabled={sendStatus !== 'idle'}
            className="flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
            <span className="text-[10px] uppercase">WhatsApp</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center gap-1 bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">picture_as_pdf</span>
            <span className="text-[10px] uppercase">PDF / Imprimir</span>
          </button>
        </div>
        <button 
          onClick={handleSave}
          className="w-full bg-primary text-slate-900 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Finalizar e Salvar
          <span className="material-symbols-outlined font-black">save</span>
        </button>
      </footer>

      {showPhoneWarning && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPhoneWarning(false)}></div>
          <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-[32px] p-6 shadow-2xl relative z-[120] text-center animate-in zoom-in-95">
            <div className="size-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">contact_phone</span>
            </div>
            <h4 className="text-lg font-black mb-2">Número não cadastrado</h4>
            <p className="text-sm text-accent mb-6 leading-relaxed">Este cliente não possui um número de WhatsApp válido cadastrado. Por favor, volte ao passo 1 e preencha o campo de telefone.</p>
            <button 
              onClick={() => setShowPhoneWarning(false)}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ icon: string, label: string, sub: string, value: number }> = ({ icon, label, sub, value }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
    <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-accent">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight">{label}</p>
      <p className="text-[10px] text-accent font-medium uppercase tracking-widest">{sub}</p>
    </div>
    <p className="text-slate-900 dark:text-white font-black">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
  </div>
);

export default QuoteResult;