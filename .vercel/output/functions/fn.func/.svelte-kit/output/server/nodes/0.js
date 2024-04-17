

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C38j_Jj4.js","_app/immutable/chunks/scheduler.BRS2CAmb.js","_app/immutable/chunks/index.Ddl6udvf.js"];
export const stylesheets = [];
export const fonts = [];
