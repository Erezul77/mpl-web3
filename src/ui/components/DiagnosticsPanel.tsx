import React, { useEffect, useMemo, useState } from 'react';
import { useLogs } from '../state/logStore';
import { health } from '../../engine/health';
import { BUILD } from '../../env/buildInfo';

type GpuInfo = { vendor?: string; renderer?: string; };

export default function DiagnosticsPanel() {
  const { logs, level, setLevel, tag, setTag, search, setSearch, clear, download } = useLogs();
  const [fps, setFps] = useState({ instant: 0, ema: 0 });
  const [gpu, setGpu] = useState<GpuInfo>({});
  const [errCount, setErrCount] = useState(0);
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const h = health.snapshot();
      setFps({ instant: Math.round(h.fpsInstant*10)/10, ema: Math.round(h.fpsEMA*10)/10 });
      setErrCount(h.errors);
      setSimStep(h.lastStep);
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as any;
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info') as any;
        const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
        const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        setGpu({ vendor: String(vendor || ''), renderer: String(renderer || '') });
      }
    } catch {}
  }, []);

  const filtered = useMemo(() => logs.filter(l => {
    const okLevel = level === 'all' || l.level === level;
    const okTag = !tag || l.tag === tag;
    const okSearch = !search || (l.msg?.toLowerCase().includes(search.toLowerCase()));
    return okLevel && okTag && okSearch;
  }), [logs, level, tag, search]);

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-200 font-semibold">Diagnostics</div>
        <BuildBadge />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <InfoRow label="FPS (EMA)" value={fps.ema.toFixed(1)} />
        <InfoRow label="FPS (inst)" value={fps.instant.toFixed(1)} />
        <InfoRow label="Errors" value={String(errCount)} />
        <InfoRow label="Sim step" value={String(simStep)} />
        <InfoRow label="User Agent" value={navigator.userAgent} />
        <InfoRow label="GPU" value={`${gpu.vendor || 'n/a'} — ${gpu.renderer || ''}`} />
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 text-xs grid grid-cols-6 gap-2 items-center">
        <label className="text-neutral-200 font-medium">Level</label>
        <select className="bg-neutral-700 rounded px-2 py-1" value={level} onChange={(e)=>setLevel(e.target.value as any)}>
          <option value="all">all</option>
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
        <label className="text-neutral-200 font-medium">Tag</label>
        <input className="bg-neutral-700 rounded px-2 py-1" value={tag} onChange={(e)=>setTag(e.target.value)} placeholder="console/engine/etc" />
        <label className="text-neutral-200 font-medium">Search</label>
        <input className="bg-neutral-700 rounded px-2 py-1" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="text" />
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={download}>Download logs</button>
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={clear}>Clear</button>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 text-[11px] font-mono max-h-40 overflow-auto">
        {filtered.slice(-200).map((e, i) => (
          <div key={i}>
            <span className="opacity-90 mr-1 text-neutral-200">{new Date(e.t).toLocaleTimeString()}</span>
            <span className="mr-1 text-neutral-100">[{e.level}]</span>
            {e.tag ? <span className="opacity-90 mr-1 text-neutral-200">({e.tag})</span> : null}
            <span className="text-neutral-100">{e.msg}</span>
          </div>
        ))}
      </div>

      <div style={{
        fontSize: '11px',
        color: '#ffffff !important',
        backgroundColor: '#6B7280 !important',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid #9CA3AF !important',
        marginTop: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <span style={{ color: '#ffffff !important', fontWeight: '600' }}>💡 Tip: </span>
        <span style={{ color: '#F9FAFB !important' }}>Call </span>
        <code style={{ 
          backgroundColor: '#1F2937 !important', 
          padding: '4px 6px', 
          borderRadius: '4px',
          color: '#FBBF24 !important',
          border: '1px solid #F59E0B !important',
          fontWeight: '600'
        }}>logger.installConsoleIntercept()</code>
        <span style={{ color: '#F9FAFB !important' }}> at boot to mirror </span>
        <code style={{ 
          backgroundColor: '#1F2937 !important', 
          padding: '4px 6px', 
          borderRadius: '4px',
          color: '#FBBF24 !important',
          border: '1px solid #F59E0B !important',
          fontWeight: '600'
        }}>console.*</code>
        <span style={{ color: '#F9FAFB !important' }}> into the log.</span>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-neutral-800 px-2 py-1 flex items-center justify-between">
      <span className="text-neutral-200 font-medium">{label}</span>
      <span className="font-mono text-neutral-100">{value}</span>
    </div>
  );
}

function BuildBadge() {
  const date = new Date(BUILD.date).toLocaleString();
  return (
    <div className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-200">
      v{BUILD.version} · {String(BUILD.commit).slice(0,7)} · {date}
    </div>
  );
}
