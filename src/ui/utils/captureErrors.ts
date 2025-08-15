import { logger } from '../../engine/logger';

export function installGlobalErrorCapture() {
  if (typeof window === 'undefined') return;
  if ((window as any).__mpl_err_installed__) return;
  (window as any).__mpl_err_installed__ = true;

  window.addEventListener('error', (ev: any) => {
    const msg = ev.message || 'window.error';
    logger.error(msg, { filename: ev.filename, lineno: ev.lineno, colno: ev.colno }, 'window');
  });

  window.addEventListener('unhandledrejection', (ev: any) => {
    const r: any = ev.reason;
    const msg = (r && r.message) || String(r);
    logger.error('unhandled rejection: ' + msg, {}, 'window');
  });
}
