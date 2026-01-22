import React, { useState, useEffect } from 'react';
import { AppSettings, ServiceItem, UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
  services: Omit<ServiceItem, 'quantity'>[];
  onServicesChange: (s: Omit<ServiceItem, 'quantity'>[]) => void;
  userProfile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
}

const Settings: React.FC<Props> = ({ settings, onSave, services, onServicesChange, userProfile, onProfileChange }) => {
  const navigate = useNavigate();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Omit<ServiceItem, 'quantity'> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const availableIcons = [
    'power', 'toggle_on', 'lightbulb', 'bolt', 'shower', 'construction', 'build', 'electrical_services', 'inventory_2', 'content_paste_search', 'plumbing', 'home_repair_service'
  ];

  useEffect(() => {
    if (isServiceModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isServiceModalOpen]);

  const handleEditService = (s: Omit<ServiceItem, 'quantity'>) => {
    setEditingService({ ...s });
    setIsNew(false);
    setIsServiceModalOpen(true);
  };

  const handleAddItem = (type: 'service' | 'material') => {
    setEditingService({
      id: `${type}-${Date.now()}`,
      name: '',
      icon: type === 'service' ? 'construction' : 'inventory_2',
      basePrice: 0,
      materialPrice: 0
    });
    setIsNew(true);
    setIsServiceModalOpen(true);
  };

  const saveService = () => {
    if (!editingService || !editingService.name) return;
    if (isNew) {
      onServicesChange([...services, editingService]);
    } else {
      onServicesChange(services.map(s => s.id === editingService.id ? editingService : s));
    }
    setIsServiceModalOpen(false);
  };

  const deleteService = (id: string) => {
    if (window.confirm('Deseja excluir este item do catálogo?')) {
      onServicesChange(services.filter(s => s.id !== id));
      setIsServiceModalOpen(false);
    }
  };

  return (
    <div className="pb-32 animate-in fade-in duration-300 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Configurações</h2>
        <div className="w-12"></div>
      </header>

      {/* Atalho Download App */}
      <div className="mt-6 px-5">
        <button 
          onClick={() => navigate('/download')}
          className="w-full bg-primary text-slate-900 p-5 rounded-3xl flex items-center justify-between shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="size-10 bg-white/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">download_for_offline</span>
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black leading-tight">Instalar Aplicativo</h4>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Acesso Offline & PWA</p>
            </div>
          </div>
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
      </div>

      {/* Perfil Profissional */}
      <div className="mt-8 px-5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">Perfil Profissional</h3>
        <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Nome do Profissional</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold"
                value={userProfile.name}
                onChange={e => onProfileChange({...userProfile, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Nome da Empresa</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold"
                value={userProfile.companyName}
                onChange={e => onProfileChange({...userProfile, companyName: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <div className="mt-10 px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Catálogo</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => handleAddItem('service')}
              className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Serviço
            </button>
            <button 
              onClick={() => handleAddItem('material')}
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Material
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {services.map(s => (
            <div key={s.id} className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-xl flex items-center justify-center ${s.basePrice > 0 ? 'bg-primary/5 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{s.name}</p>
                  <div className="flex gap-3 mt-1">
                    {s.basePrice > 0 && (
                      <p className="text-[9px] text-accent font-black uppercase tracking-widest">
                        Mão de obra: R$ {s.basePrice.toLocaleString('pt-BR')}
                      </p>
                    )}
                    {s.materialPrice !== undefined && s.materialPrice > 0 && (
                      <p className="text-[9px] text-primary font-black uppercase tracking-widest">
                        Material: R$ {s.materialPrice.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => handleEditService(s)} className="size-10 rounded-xl text-accent hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ajustes de Taxas */}
      <div className="mt-10 px-5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">Taxas e Margens</h3>
        <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Margem de Lucro Global (%)</p>
              <p className="text-[10px] text-accent font-medium">Aplicada sobre a mão de obra</p>
            </div>
            <input 
              type="number"
              className="w-20 bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-10 px-3 text-sm font-bold text-right"
              value={settings.multipliers.globalProfit}
              onChange={e => onSave({...settings, multipliers: {...settings.multipliers, globalProfit: Number(e.target.value)}})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Taxa de Visita Mínima (R$)</p>
              <p className="text-[10px] text-accent font-medium">Logística e Deslocamento</p>
            </div>
            <input 
              type="number"
              className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-10 px-3 text-sm font-bold text-right"
              value={settings.logistics.minVisitFee}
              onChange={e => onSave({...settings, logistics: {...settings.logistics, minVisitFee: Number(e.target.value)}})}
            />
          </div>
        </div>
      </div>

      {/* Modal de Edição de Item */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsServiceModalOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black">{isNew ? 'Novo Item' : 'Editar Item'}</h4>
              {!isNew && (
                <button onClick={() => deleteService(editingService.id)} className="text-red-500 active:scale-90 transition-transform">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Nome do Item</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold"
                  value={editingService.name}
                  placeholder="Ex: Instalação de Tomada"
                  onChange={e => setEditingService({...editingService, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Mão de Obra (R$)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold"
                    value={editingService.basePrice}
                    onChange={e => setEditingService({...editingService, basePrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Material (R$)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold"
                    value={editingService.materialPrice || 0}
                    onChange={e => setEditingService({...editingService, materialPrice: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Ícone</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {availableIcons.map(icon => (
                    <button 
                      key={icon}
                      onClick={() => setEditingService({...editingService, icon})}
                      className={`size-10 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all ${editingService.icon === icon ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-slate-50 dark:bg-slate-800 text-accent'}`}
                    >
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-sm text-accent">Cancelar</button>
              <button 
                onClick={saveService} 
                disabled={!editingService.name}
                className="flex-1 h-12 rounded-xl bg-primary text-slate-900 font-bold text-sm disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;