import { createContext, useContext } from 'react';

import Toast from './Toast';

export interface ToastProviderProps {
  children: React.ReactNode;
  toastInstance: Toast;
}

const ToastContext = createContext<Toast | null>(null);

export function ToastProvider({ children, toastInstance }: ToastProviderProps) {
  return <ToastContext.Provider value={toastInstance}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const state = useContext(ToastContext);
  if (state === null) throw new Error('Cannot find ToastProvider');
  return state;
}
