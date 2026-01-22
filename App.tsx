import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import History from './screens/History';
import Settings from './screens/Settings';
import NewQuoteStep1 from './screens/NewQuoteStep1';
import NewQuoteStep2 from './screens/NewQuoteStep2';
import QuoteResult from './screens/QuoteResult';
import DownloadApp from './screens/DownloadApp';
import { Quote, QuoteStatus, AppSettings, ClientInfo, ServiceItem, UserProfile, Material } from './types';
import { INITIAL_SERVICES, INITIAL_MATERIALS } from './constants';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('orca_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'João Silva', 
      companyName: 'EletroSolutions', 
      address: 'Rua das Flores, 123',
      phone: '(11) 98888-7777', 
      whatsapp: '5511988887777', 
      personType: 'PF'
    };
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('orca_materials_internal');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [dynamicServices, setDynamicServices] = useState<Omit<ServiceItem, 'quantity'>[]>(() => {
    const saved = localStorage.getItem('orca_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('orca_settings');
    return saved ? JSON.parse(saved) : {
      baseServices: { installation: 50.00, breakerChange: 80.00, revision: 150.00 },
      logistics: { kmValue: 2.50, minVisitFee: 60.00 },
      multipliers: { urgencyRate: 30, globalProfit: 20, isUrgencyActive: true }
    };
  });

  const [history, setHistory] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('orca_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('orca_settings', JSON.stringify(settings));
    localStorage.setItem('orca_history', JSON.stringify(history));
    localStorage.setItem('orca_services', JSON.stringify(dynamicServices));
    localStorage.setItem('orca_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('orca_materials_internal', JSON.stringify(materials));
  }, [settings, history, dynamicServices, userProfile, materials]);

  const [currentClient, setCurrentClient] = useState<ClientInfo>({
    name: '', phone: '', address: '', serviceType: 'Instalação', environment: 'Residencial'
  });
  
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);
  const [difficulty, setDifficulty] = useState(1.3);

  useEffect(() => {
    if (selectedItems.length === 0 || selectedItems.length !== dynamicServices.length) {
      setSelectedItems(dynamicServices.map(s => ({ ...s, quantity: 0 })));
    }
  }, [dynamicServices]);

  const processInternalStockDeduction = (quoteItems: ServiceItem[]) => {
    const updatedMaterials = [...materials];
    quoteItems.forEach(item => {
      if (item.quantity > 0 && item.linkedMaterials) {
        item.linkedMaterials.forEach(link => {
          const mIndex = updatedMaterials.findIndex(m => m.id === link.materialId);
          if (mIndex !== -1) {
            updatedMaterials[mIndex].stock = Math.max(0, updatedMaterials[mIndex].stock - (link.quantity * item.quantity));
          }
        });
      }
    });
    setMaterials(updatedMaterials);
  };

  const saveQuote = (quote: Quote) => {
    setHistory([quote, ...history]);
    processInternalStockDeduction(quote.items);
    resetDraft();
  };

  const resetDraft = () => {
    setCurrentClient({ name: '', phone: '', address: '', serviceType: 'Instalação', environment: 'Residencial' });
    setSelectedItems(dynamicServices.map(s => ({ ...s, quantity: 0 })));
    setDifficulty(1.3);
  };

  const isNavVisible = ['/', '/history', '/settings'].includes(location.pathname);

  return (
    <div 
      className={`max-w-md mx-auto relative min-h-screen bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-xl border-x border-gray-100 dark:border-gray-800 overflow-x-hidden ${isNavVisible ? 'pb-24' : ''}`}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="w-full relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard history={history} user={userProfile} />} />
          <Route path="/history" element={<History history={history} onDelete={(id) => setHistory(h => h.filter(q => q.id !== id))} onView={(q) => { setCurrentClient(q.client); setSelectedItems(q.items); setDifficulty(q.difficultyMultiplier); navigate('/quote-result'); }} />} />
          <Route path="/settings" element={<Settings settings={settings} onSave={setSettings} services={dynamicServices} onServicesChange={setDynamicServices} userProfile={userProfile} onProfileChange={setUserProfile} />} />
          <Route path="/new-step-1" element={<NewQuoteStep1 client={currentClient} onChange={setCurrentClient} onNext={() => navigate('/new-step-2')} />} />
          <Route path="/new-step-2" element={<NewQuoteStep2 items={selectedItems} onChange={setSelectedItems} difficulty={difficulty} onDifficultyChange={setDifficulty} onNext={() => navigate('/quote-result')} />} />
          <Route path="/quote-result" element={<QuoteResult client={currentClient} items={selectedItems} difficulty={difficulty} settings={settings} userProfile={userProfile} onSave={saveQuote} />} />
          <Route path="/download" element={<DownloadApp />} />
        </Routes>
      </div>

      {isNavVisible && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-white/95 dark:bg-[#111827]/95 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-6 z-50 backdrop-blur-md">
          <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 w-12 ${location.pathname === '/' ? 'text-primary' : 'text-accent'}`}>
            <span className="material-symbols-outlined text-[26px]">grid_view</span>
            <span className="text-[10px] font-bold">Início</span>
          </button>
          <button onClick={() => navigate('/history')} className={`flex flex-col items-center gap-1 w-12 ${location.pathname === '/history' ? 'text-primary' : 'text-accent'}`}>
            <span className="material-symbols-outlined text-[26px]">history</span>
            <span className="text-[10px] font-bold">Histórico</span>
          </button>
          <div className="relative -top-6">
            <button 
              onClick={() => { resetDraft(); navigate('/new-step-1'); }}
              className="bg-primary text-slate-900 size-16 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center border-4 border-background-light dark:border-background-dark active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-3xl font-black">add</span>
            </button>
          </div>
          <button onClick={() => navigate('/download')} className={`flex flex-col items-center gap-1 w-12 ${location.pathname === '/download' ? 'text-primary' : 'text-accent'}`}>
            <span className="material-symbols-outlined text-[26px]">download</span>
            <span className="text-[10px] font-bold">Baixar</span>
          </button>
          <button onClick={() => navigate('/settings')} className={`flex flex-col items-center gap-1 w-12 ${location.pathname === '/settings' ? 'text-primary' : 'text-accent'}`}>
            <span className="material-symbols-outlined text-[26px]">settings</span>
            <span className="text-[10px] font-bold">Ajustes</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;