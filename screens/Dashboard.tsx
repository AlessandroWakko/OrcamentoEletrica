
import React from 'react';
import { Quote, QuoteStatus, UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  history: Quote[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ history, user }) => {
  const navigate = useNavigate();
  const approvedQuotes = history.filter(q => q.status === QuoteStatus.APPROVED);
  const pendingQuotes = history.filter(q => q.status === QuoteStatus.PENDING);
  const totalValue = history.reduce((acc, q) => acc + q.totalValue, 0);

  return (
    <div className="pt-6 pb-28 px-4 flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full size-11 flex items-center justify-center overflow-hidden border-2 border-primary shadow-sm">
            <img 
              src="https://picsum.photos/seed/electrician/100/100" 
              alt="Profile" 
              className="size-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-accent dark:text-primary uppercase tracking-wider">Bem-vindo,</p>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight truncate max-w-[150px]">{user.name}</h2>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-card-dark text-slate-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-800">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>

      <section>
        <h2 className="text-slate-900 dark:text-white text-2xl font-extrabold leading-tight tracking-tight mb-1">Resumo do Mês</h2>
        <p className="text-accent text-sm font-medium uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">description</span>
            <p className="text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider">Orçamentos</p>
          </div>
          <p className="text-slate-900 dark:text-white text-2xl font-extrabold">{history.length}</p>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
            <p className="text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider">Valor Total</p>
          </div>
          <p className="text-slate-900 dark:text-white text-xl font-extrabold truncate">R$ {totalValue.toLocaleString('pt-BR')}</p>
          <p className="text-accent text-[10px] font-medium uppercase">Previsto</p>
        </div>
      </div>

      <section className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-5">Status dos Orçamentos</h3>
        <div className="space-y-6">
          <ProgressBar 
            label="Aprovados" 
            percent={history.length > 0 ? Math.round((approvedQuotes.length / history.length) * 100) : 0} 
            color="bg-primary" 
            dotColor="bg-green-500" 
            count={approvedQuotes.length} 
            value={approvedQuotes.reduce((acc, q) => acc + q.totalValue, 0)} 
          />
          <ProgressBar 
            label="Pendentes" 
            percent={history.length > 0 ? Math.round((pendingQuotes.length / history.length) * 100) : 0} 
            color="bg-accent" 
            dotColor="bg-accent" 
            count={pendingQuotes.length} 
            value={pendingQuotes.reduce((acc, q) => acc + q.totalValue, 0)} 
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Atividades Recentes</h3>
          <button onClick={() => navigate('/history')} className="text-primary text-sm font-bold">Ver todos</button>
        </div>
        <div className="flex flex-col gap-3">
          {history.slice(0, 3).map(q => (
            <div key={q.id} onClick={() => navigate('/history')} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">{q.client.name}</p>
                  <p className="text-accent text-xs font-medium">{q.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">R$ {q.totalValue.toLocaleString('pt-BR')}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  q.status === QuoteStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-primary/20 text-accent'
                }`}>
                  {q.status}
                </span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-10 text-accent text-sm font-bold uppercase tracking-widest bg-white dark:bg-card-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              Nenhum registro recente
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string, percent: number, color: string, dotColor: string, count: number, value: number }> = ({ label, percent, color, dotColor, count, value }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${dotColor}`}></span>
        <p className="text-slate-900 dark:text-white text-sm font-bold">{label}</p>
      </div>
      <p className="text-slate-900 dark:text-white text-sm font-extrabold">{percent}%</p>
    </div>
    <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
    <div className="flex justify-between">
      <p className="text-accent text-[10px] font-medium uppercase">{count} orçamentos</p>
      <p className="text-slate-900 dark:text-white text-[10px] font-bold uppercase">R$ {value.toLocaleString('pt-BR')}</p>
    </div>
  </div>
);

export default Dashboard;
