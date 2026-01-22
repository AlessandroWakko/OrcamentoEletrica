import React, { useState, useEffect } from 'react';
import { ServiceItem } from '../types';
import { DIFFICULTIES } from '../constants';
import { useNavigate } from 'react-router-dom';

interface Props {
  items: ServiceItem[];
  onChange: (items: ServiceItem[]) => void;
  difficulty: number;
  onDifficultyChange: (d: number) => void;
  onNext: () => void;
}

const NewQuoteStep2: React.FC<Props> = ({ items, onChange, difficulty, onDifficultyChange, onNext }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<'service' | 'material' | null>(null);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    price: '', 
    quantity: '1',
    stock: '',
    unit: 'un' as 'un' | 'm' | 'kit'
  });

  // Lock scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isModalOpen]);

  const updateQuantity = (id: string, delta: number) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleAddCustomItem = () => {
    if (!newItem.name || !newItem.price || !isModalOpen) return;
    
    const customItem: ServiceItem = {
      id: `custom-${Date.now()}`,
      name: isModalOpen === 'material' ? `${newItem.name} (${newItem.unit})` : newItem.name,
      icon: isModalOpen === 'service' ? 'construction' : 'inventory_2',
      basePrice: isModalOpen === 'service' ? parseFloat(newItem.price) : 0,
      materialPrice: isModalOpen === 'material' ? parseFloat(newItem.price) : 0,
      quantity: parseInt(isModalOpen === 'service' ? newItem.quantity : newItem.stock) || 1,
      isCustom: true
    };

    onChange([...items, customItem]);
    setNewItem({ name: '', price: '', quantity: '1', stock: '', unit: 'un' });
    setIsModalOpen(null);
  };

  const laborSubtotal = items.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0) * difficulty;
  const materialsSubtotal = items.reduce((acc, item) => acc + ((item.materialPrice || 0) * item.quantity), 0);
  const subtotal = laborSubtotal + materialsSubtotal;

  const catalogServices = items.filter(i => !i.isCustom);
  const customItems = items.filter(i => i.isCustom);

  return (
    <div className="pb-52 animate-in slide-in-from-right duration-300 min-h-screen">
      <header className="sticky top-0 z-40 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between pb-2">
          <button onClick={() => navigate('/new-step-1')} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center pr-12">Novo Orçamento</h2>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-slate-900 dark:text-white text-base font-semibold">Itens do Orçamento</p>
            <p className="text-accent text-sm font-medium">Passo 2 de 3</p>
          </div>
          <div className="rounded-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '66.6%' }}></div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <h3 className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest text-accent pb-4">Serviços do Catálogo</h3>
        <div className="space-y-3">
          {catalogServices.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 justify-between transition-all hover:border-primary/20">
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-12">
                  <span className="material-symbols-outlined filled">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight truncate">{item.name}</p>
                  <p className="text-accent text-[10px] font-medium uppercase tracking-tight">R$ {item.basePrice.toLocaleString('pt-BR')} un</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-background-dark rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-card-dark shadow-sm text-lg font-bold active:scale-90 dark:text-white"
                >-</button>
                <span className="text-sm font-bold w-5 text-center dark:text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="size-8 flex items-center justify-center rounded-lg bg-primary text-slate-900 shadow-sm text-lg font-bold active:scale-90"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {customItems.length > 0 && (
          <>
            <h3 className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest text-accent pb-4 pt-8">Itens Adicionais (Extra)</h3>
            <div className="space-y-3">
              {customItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeItem(item.id)} className="text-red-500 bg-red-50 dark:bg-red-900/10 size-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight flex items-center gap-2">
                        {item.name}
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-widest ${item.basePrice > 0 ? 'bg-primary/20 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                          {item.basePrice > 0 ? 'Serviço' : 'Material'}
                        </span>
                      </p>
                      <p className="text-accent text-[10px] font-medium uppercase tracking-tight">
                        R$ {(item.basePrice || item.materialPrice || 0).toLocaleString('pt-BR')} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-900 dark:text-white text-sm font-black">
                    R$ {((item.basePrice || item.materialPrice || 0) * item.quantity).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3 mt-8">
          <button 
            onClick={() => {
              setNewItem({ name: '', price: '', quantity: '1', stock: '', unit: 'un' });
              setIsModalOpen('service');
            }}
            className="py-5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-accent hover:text-primary hover:border-primary transition-all active:scale-95 bg-white/40 dark:bg-white/5"
          >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Novo Serviço Extra</span>
          </button>
          <button 
            onClick={() => {
              setNewItem({ name: '', price: '', quantity: '1', stock: '', unit: 'un' });
              setIsModalOpen('material');
            }}
            className="py-5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-accent hover:text-primary hover:border-primary transition-all active:scale-95 bg-white/40 dark:bg-white/5"
          >
            <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent text-xl">inventory_2</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Novo Material Extra</span>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest text-accent">Dificuldade e Urgência</h3>
          <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full uppercase tracking-wider">{difficulty}x</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff.label}
              onClick={() => onDifficultyChange(diff.multiplier)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                difficulty === diff.multiplier 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark opacity-60'
              }`}
            >
              <span className={`text-[9px] font-bold uppercase ${difficulty === diff.multiplier ? 'text-primary' : 'text-accent'}`}>{diff.label}</span>
              <span className={`text-sm font-extrabold ${difficulty === diff.multiplier ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{diff.multiplier.toFixed(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-[#111827]/95 border-t border-gray-200 dark:border-gray-800 p-5 backdrop-blur-md z-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Investimento Estimado</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Itens Ativos</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{items.reduce((acc, i) => acc + (i.quantity > 0 ? 1 : 0), 0)}</p>
          </div>
        </div>
        <button 
          onClick={onNext}
          disabled={items.reduce((acc, i) => acc + i.quantity, 0) === 0}
          className="w-full bg-primary text-slate-900 font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Revisar Orçamento
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(null)}></div>
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative z-[110] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className={`size-12 rounded-2xl flex items-center justify-center ${isModalOpen === 'service' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                <span className="material-symbols-outlined text-2xl">{isModalOpen === 'service' ? 'construction' : 'inventory_2'}</span>
              </div>
              <div>
                <h4 className="text-lg font-black leading-tight">
                  {isModalOpen === 'service' ? 'Novo Serviço Extra' : 'Novo Material Extra'}
                </h4>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                  {isModalOpen === 'service' ? 'Mão de obra customizada' : 'Insumos adicionais'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Nome do Item</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                  placeholder={isModalOpen === 'service' ? 'Ex: Instalação de lustre' : 'Ex: Fio 2.5mm, Disjuntor 20A, Tomada 10A'}
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>

              {isModalOpen === 'material' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">Unidade</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['un', 'm', 'kit'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setNewItem({...newItem, unit: u})}
                        className={`h-10 rounded-xl font-bold text-xs uppercase tracking-widest border-2 transition-all ${newItem.unit === u ? 'border-primary bg-primary/10 text-slate-900 dark:text-white' : 'border-gray-100 dark:border-gray-800 text-accent'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">
                    {isModalOpen === 'service' ? 'Mão de Obra (R$)' : 'Custo Unit. (R$)'}
                  </label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent mb-1.5 block">
                    {isModalOpen === 'service' ? 'Quantidade' : 'Qtd. em Estoque'}
                  </label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                    value={isModalOpen === 'service' ? newItem.quantity : newItem.stock}
                    onChange={e => isModalOpen === 'service' ? setNewItem({...newItem, quantity: e.target.value}) : setNewItem({...newItem, stock: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsModalOpen(null)} className="flex-1 h-12 rounded-xl font-bold text-sm text-accent active:scale-95 transition-transform">Cancelar</button>
              <button 
                onClick={handleAddCustomItem}
                disabled={!newItem.name || !newItem.price}
                className="flex-1 h-12 rounded-xl bg-primary text-slate-900 font-bold text-sm disabled:opacity-50 active:scale-95 transition-transform shadow-lg shadow-primary/20"
              >Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewQuoteStep2;