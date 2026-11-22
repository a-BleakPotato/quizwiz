import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());

  const showToast = useCallback((message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message }]);
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      timers.current.delete(timer);
    }, 2400);
    timers.current.add(timer);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return <ToastContext.Provider value={{ toasts, showToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}

export function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div id="toast" role="status">
      {toasts.map((t) => <div className="toast" key={t.id}>{t.message}</div>)}
    </div>
  );
}
