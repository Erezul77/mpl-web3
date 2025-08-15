// src/ui/hooks/useVoxelSelection.ts
import React, { createContext, useContext, useState } from 'react';

type VoxelPos = { x: number; y: number; z: number };

const Ctx = createContext<{
  selection: VoxelPos | null;
  setSelection: (p: VoxelPos | null) => void;
} | null>(null);

export function VoxelSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<VoxelPos | null>(null);
  return <Ctx.Provider value={{ selection, setSelection }}>{children}</Ctx.Provider>;
}

export function useVoxelSelection() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useVoxelSelection must be used within VoxelSelectionProvider');
  return ctx;
}
