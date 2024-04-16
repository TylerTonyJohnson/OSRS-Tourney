

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.RHCZpWaV.js","_app/immutable/chunks/scheduler.C3DAcPEg.js","_app/immutable/chunks/index.BGHmHWav.js"];
export const stylesheets = [];
export const fonts = [];
