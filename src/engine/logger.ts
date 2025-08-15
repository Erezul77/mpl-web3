export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogEntry = {
  t: number;                 // epoch ms
  level: LogLevel;
  tag?: string;
  msg: string;
  data?: any;
};

type Listener = (e: LogEntry) => void;

class Logger {
  private buf: LogEntry[] = [];
  private cap = 5000;
  private listeners = new Set<Listener>();
  private consoleIntercept = false;

  setCapacity(n: number) { this.cap = Math.max(100, n|0); }
  on(fn: Listener) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  all() { return this.buf.slice(); }

  private push(e: LogEntry) {
    this.buf.push(e);
    if (this.buf.length > this.cap) this.buf.splice(0, this.buf.length - this.cap);
    this.listeners.forEach(fn => fn(e));
  }

  log(level: LogLevel, msg: string, data?: any, tag?: string) {
    const entry: LogEntry = { t: Date.now(), level, msg, data, tag };
    this.push(entry);
  }
  debug(msg: string, data?: any, tag?: string) { this.log('debug', msg, data, tag); }
  info(msg: string, data?: any, tag?: string) { this.log('info', msg, data, tag); }
  warn(msg: string, data?: any, tag?: string) { this.log('warn', msg, data, tag); }
  error(msg: string, data?: any, tag?: string) { this.log('error', msg, data, tag); }

  clear() { this.buf.clear(); }

  installConsoleIntercept() {
    if (this.consoleIntercept) return;
    this.consoleIntercept = true;
    const orig = { ...console } as any;
    const wrap = (level: keyof Console, l: LogLevel) => (...args: any[]) => {
      try {
        const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
        this.log(l, msg, undefined, 'console');
      } catch {}
      return (orig[level] as any)(...args);
    };
    console.log = wrap('log', 'info');
    console.info = wrap('info', 'info');
    console.warn = wrap('warn', 'warn');
    console.error = wrap('error', 'error');
  }
}

export const logger = new Logger();
