import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Toast Context ──
const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const typeStyles = {
  success: 'border-success/50 bg-success/10 text-success-light',
  error: 'border-danger/50 bg-danger/10 text-danger-light',
  warning: 'border-warning/50 bg-warning/10 text-warning-light',
  info: 'border-primary/50 bg-primary/10 text-primary-light',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border
        glass-strong shadow-xl min-w-[300px]
        ${typeStyles[toast.type] || typeStyles.info}
      `}
    >
      <span className="text-lg">{typeIcons[toast.type] || typeIcons.info}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-50 hover:opacity-100 transition-opacity text-sm"
      >
        ✕
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
