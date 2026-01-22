import React from 'react';
import { ServiceItem, Material } from './types';

export const INITIAL_MATERIALS: Material[] = [
  { id: 'm1', name: 'Tomada 10A', unit: 'un', costPrice: 8.50, stock: 50 },
  { id: 'm2', name: 'Interruptor Simples', unit: 'un', costPrice: 7.20, stock: 40 },
  { id: 'm3', name: 'Fio 2.5mm', unit: 'm', costPrice: 3.80, stock: 200 },
  { id: 'm4', name: 'Disjuntor 20A', unit: 'un', costPrice: 15.00, stock: 20 },
  { id: 'm5', name: 'Suporte/Espelho', unit: 'un', costPrice: 4.50, stock: 100 }
];

export const INITIAL_SERVICES: Omit<ServiceItem, 'quantity'>[] = [
  { 
    id: '1', name: 'Tomada', icon: 'power', basePrice: 25.00, materialPrice: 15.00,
    linkedMaterials: [
      { materialId: 'm1', quantity: 1 },
      { materialId: 'm5', quantity: 1 },
      { materialId: 'm3', quantity: 2 }
    ]
  },
  { 
    id: '2', name: 'Interruptor', icon: 'toggle_on', basePrice: 20.00, materialPrice: 12.00,
    linkedMaterials: [
      { materialId: 'm2', quantity: 1 },
      { materialId: 'm5', quantity: 1 }
    ]
  },
  { 
    id: '3', name: 'Ponto de Luz', icon: 'lightbulb', basePrice: 45.00, materialPrice: 25.00,
    linkedMaterials: [
      { materialId: 'm3', quantity: 5 }
    ]
  },
  { 
    id: '4', name: 'Inst. Chuveiro', icon: 'shower', basePrice: 120.00, materialPrice: 85.00,
    linkedMaterials: [
      { materialId: 'm3', quantity: 4 },
      { materialId: 'm4', quantity: 1 }
    ]
  },
  { 
    id: '5', name: 'Troca de Disjuntor', icon: 'bolt', basePrice: 80.00, materialPrice: 45.00,
    linkedMaterials: [
      { materialId: 'm4', quantity: 1 }
    ]
  },
  { id: '6', name: 'Revisão Elétrica', icon: 'content_paste_search', basePrice: 150.00, materialPrice: 0 }
];

export const SERVICE_TYPES = [
  { id: 'install', label: 'Instalação', icon: 'build' },
  { id: 'maint', label: 'Manutenção', icon: 'home_repair_service' },
  { id: 'emerg', label: 'Emergência', icon: 'emergency' },
  { id: 'repair', label: 'Reparo', icon: 'electrical_services' }
];

export const ENVIRONMENTS = [
  { id: 'res', label: 'Residencial', description: 'Casas, apartamentos e condomínios', icon: 'house' },
  { id: 'com', label: 'Comercial', description: 'Lojas, escritórios e salas', icon: 'store' },
  { id: 'ind', label: 'Industrial', description: 'Fábricas, galpões e usinas', icon: 'factory' }
];

export const DIFFICULTIES = [
  { label: 'Fácil', multiplier: 1.0 },
  { label: 'Médio', multiplier: 1.3 },
  { label: 'Difícil', multiplier: 1.6 },
  { label: 'Emerg.', multiplier: 2.0 }
];