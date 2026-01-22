
import React, { useState } from 'react';
import { Quote, QuoteStatus } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  history: Quote[];
  onDelete: (id: string) => void;
  onView: (quote: Quote) => void;
}

const History: React.FC<Props> = ({ history, onDelete, onView }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | QuoteStatus>('ALL');
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter(q => {
    const matchesFilter = filter === 'ALL' || q.status === filter;
    const matchesSearch = q.client.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-28 animate-in fade-in duration-300 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer active:scale-90 transition-transform">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center">Meus Orçamentos</h2>
          <div className="w-12"></div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="flex items-stretch rounded-3xl h-15 shadow-sm bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 transition-all focus-within:ring-2 focus-within:ring-primary/10">
          <div className="text-accent flex items-center justify-center pl-6">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </div>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 px-4 text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
            placeholder="Buscar por nome do cliente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        <FilterChip label="Tudo" active={filter === 'ALL'} onClick={() => setFilter('ALL')} />
        <FilterChip label="Pendentes" active={filter === QuoteStatus.PENDING} onClick={() => setFilter(QuoteStatus.PENDING)} />
        <FilterChip label="Aprovados" active={filter === QuoteStatus.APPROVED} onClick={() => setFilter(QuoteStatus.APPROVED)} />
        <FilterChip label="Recusados" active={filter === QuoteStatus.REJECTED} onClick={() => setFilter(QuoteStatus.REJECTED)} />
      </div>

      <div className="flex flex-col gap-1 mt-8">
        <div className="px-6 flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Listagem Geral</p>
          <p className="text-[9px] font-bold text-slate-400">{filteredHistory.length} registros</p>
        </div>
        <div className="px-4 space-y-4">
          {filteredHistory.length > 0 ? filteredHistory.map(q => (
            <div 
              key={q.id} 
              className="flex flex-col bg-white dark:bg-card-dark rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/10"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/5 border border-primary/10 flex items-center justify-center rounded-2xl text-primary">
                    <span className="material-symbols-outlined text-[26px]">{q.client.environment === 'Residencial' ? 'home_pin' : 'business_center'}</span>
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-white leading-tight line-clamp-1">{q.client.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{q.date}</span>
                      <div className="size-1 bg-slate-200 rounded-full"></div>
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                        q.status === QuoteStatus.APPROVED ? 'bg-green-50 text-green-600' : 
                        q.status === QuoteStatus.PENDING ? 'bg-primary/5 text-primary' : 'bg-red-50 text-red-600'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">R$ {q.totalValue.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 border-t border-slate-50 dark:border-gray-800/50 pt-4">
                <button 
                  onClick={() => onView(q)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Exibir
                </button>
                <button 
                  onClick={() => onDelete(q.id)}
                  className="size-12 flex items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl active:bg-red-100 transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <span className="material-symbols-outlined text-[22px]">delete_sweep</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <span className="material-symbols-outlined text-slate-200 dark:text-slate-800 text-[64px] mb-4">folder_off</span>
               <p className="text-accent text-sm font-black uppercase tracking-widest opacity-60">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`h-11 shrink-0 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
      active ? 'bg-primary text-slate-900 shadow-primary/20 scale-105' : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 text-slate-400'
    }`}
  >
    {label}
  </button>
);

export default History;
