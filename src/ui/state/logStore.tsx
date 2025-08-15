import React, { createContext, useContext, useEffect, useState } from 'react';
import { logger, type LogEntry, type LogLevel } from '../../engine/logger';

type Ctx = {
  logs: LogEntry[];
  level: LogLevel | 'all';
  setLevel: (l: Ctx['level']) => void;
  tag: string;
  setTag: (t: string) => void;
  search: string;
  setSearch: (s: string) => void;
  clear: () => void;
  download: () => void;
};

const C = createContext<Ctx | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(logger.all());
  const [level, setLevel] = useState<LogLevel | 'all'>('all');
  const [tag, setTag] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const off = logger.on((e) => setLogs((prev) => [...prev, e]));
    return () => {
      if (off) off();
    };
  }, []);

  const download = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mpl-logs-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const value: Ctx = {
    logs, level, setLevel, tag, setTag, search, setSearch,
    clear: () => setLogs([]),
    download,
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useLogs() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useLogs must be used within LogProvider');
  return ctx;
}
