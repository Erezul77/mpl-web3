export const BUILD = {
  version: (globalThis as any).__MPL_BUILD_VERSION__ ?? 'dev',
  commit: (globalThis as any).__MPL_BUILD_COMMIT__ ?? 'unknown',
  date: (globalThis as any).__MPL_BUILD_DATE__ ?? new Date().toISOString(),
};
