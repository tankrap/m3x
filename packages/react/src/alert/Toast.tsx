import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';
import { ALERT_ICONS, AlertSeverity } from './Alert';

export interface ToastOptions {
  message: React.ReactNode;
  severity?: AlertSeverity;
  /** auto-dismiss after ms; 0 disables (default 5000) */
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastRecord extends ToastOptions {
  id: number;
  leaving?: boolean;
}

interface ToastContextValue {
  toast: (options: ToastOptions | string) => number;
  dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Imperative toast API: `const { toast } = useToast(); toast('Saved')`. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** max toasts shown at once; older ones are dropped (default 3) */
  limit?: number;
  /** screen corner (default 'bottom') */
  position?: 'bottom' | 'bottom-start' | 'bottom-end';
}

let nextId = 1;

/**
 * Stacking toast notifications, styled like severity-tinted snackbars.
 * Extras component — for spec-faithful single transient messages use Snackbar.
 */
export function ToastProvider({ children, limit = 3, position = 'bottom' }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timers = React.useRef(new Map<number, number>());

  const dismiss = React.useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(
      () => setToasts((list) => list.filter((t) => t.id !== id)),
      160,
    );
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions | string) => {
      const opts: ToastOptions = typeof options === 'string' ? { message: options } : options;
      const id = nextId++;
      setToasts((list) => [...list.slice(-(limit - 1)), { ...opts, id }]);
      const duration = opts.duration ?? 5000;
      if (duration > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
      }
      return id;
    },
    [limit, dismiss],
  );

  React.useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`m3x-toast-region m3x-toast-region--${position}`} role="region" aria-label="Notifications">
        {toasts.map((t) => {
          const severity = t.severity ?? 'info';
          return (
            <div
              key={t.id}
              role="status"
              className={['m3x-toast', `m3x-toast--${severity}`, t.leaving ? 'm3x-toast--leaving' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <Icon size={20} fill={1} className="m3x-alert__icon">
                {ALERT_ICONS[severity]}
              </Icon>
              <span className="m3x-toast__message">{t.message}</span>
              {t.actionLabel && (
                <button
                  type="button"
                  className="m3x-toast__action"
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                >
                  {t.actionLabel}
                </button>
              )}
              <button
                type="button"
                className="m3x-toast__close"
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
              >
                <Icon size={18}>close</Icon>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
