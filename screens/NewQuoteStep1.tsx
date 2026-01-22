import React from 'react';
import { ClientInfo } from '../types';
import { SERVICE_TYPES, ENVIRONMENTS } from '../constants';
import { useNavigate } from 'react-router-dom';

interface Props {
  client: ClientInfo;
  onChange: (c: ClientInfo) => void;
  onNext: () => void;
}

const NewQuoteStep1: React.FC<Props> = ({ client, onChange, onNext }) => {
  const navigate = useNavigate();

  return (
    <div className="pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={() => navigate('/')} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">Novo Orçamento</h2>
          <button onClick={() => navigate('/')} className="flex w-12 items-center justify-end text-accent font-bold">
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-slate-900 dark:text-white text-base font-medium">Dados Iniciais</p>
          <p className="text-accent text-sm font-normal">1 de 3</p>
        </div>
        <div className="rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden h-2">
          <div className="h-full rounded-full bg-primary" style={{ width: '33%' }}></div>
        </div>
      </div>

      <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pb-2 pt-4">Informações do Cliente</h3>
      
      <div className="px-4 py-2 space-y-4">
        <InputField 
          label="Nome do Cliente" 
          placeholder="Ex: João Silva" 
          value={client.name} 
          onChange={(v) => onChange({ ...client, name: v })} 
        />
        <InputField 
          label="Telefone" 
          placeholder="(00) 00000-0000" 
          icon="call"
          value={client.phone} 
          onChange={(v) => onChange({ ...client, phone: v })} 
        />
        <InputField 
          label="Endereço da Obra" 
          placeholder="Rua, Número, Bairro" 
          icon="location_on"
          value={client.address} 
          onChange={(v) => onChange({ ...client, address: v })} 
        />
      </div>

      <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pb-2 pt-6">Tipo de Serviço</h3>
      <div className="grid grid-cols-2 gap-3 px-4 py-2">
        {SERVICE_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onChange({ ...client, serviceType: type.label })}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all border-2 ${
              client.serviceType === type.label 
                ? 'border-primary bg-primary/10 shadow-sm' 
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl mb-2 ${client.serviceType === type.label ? 'text-primary filled' : 'text-accent'}`}>{type.icon}</span>
            <span className={`text-sm ${client.serviceType === type.label ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}>{type.label}</span>
          </button>
        ))}
      </div>

      <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pb-2 pt-6">Ambiente</h3>
      <div className="flex flex-col gap-3 px-4 py-2">
        {ENVIRONMENTS.map(env => (
          <button
            key={env.id}
            onClick={() => onChange({ ...client, environment: env.label })}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
              client.environment === env.label 
                ? 'border-primary bg-primary/10 shadow-sm' 
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${client.environment === env.label ? 'text-primary filled' : 'text-accent'}`}>{env.icon}</span>
            <div className="flex-1 text-left">
              <p className={`text-base leading-tight ${client.environment === env.label ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}>{env.label}</p>
              <p className="text-xs text-accent opacity-80">{env.description}</p>
            </div>
            {client.environment === env.label && <span className="material-symbols-outlined text-primary filled">check_circle</span>}
          </button>
        ))}
      </div>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-[#111827]/95 p-4 border-t border-gray-100 dark:border-gray-800 backdrop-blur-md z-50">
        <button 
          onClick={onNext}
          disabled={!client.name}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-slate-900 font-bold text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          Continuar
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

const InputField: React.FC<{ label: string, placeholder: string, value: string, icon?: string, onChange: (v: string) => void }> = ({ label, placeholder, value, icon, onChange }) => (
  <div className="flex flex-col gap-2">
    <p className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider pl-1">{label}</p>
    <div className="relative">
      <input 
        className="flex w-full rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-5 text-base font-normal transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {icon && <span className="material-symbols-outlined absolute right-5 top-4 text-accent">{icon}</span>}
    </div>
  </div>
);

export default NewQuoteStep1;