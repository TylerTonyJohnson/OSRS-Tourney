

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DsPjE8ew.js","_app/immutable/chunks/scheduler.Do8ihC3M.js","_app/immutable/chunks/index.Cf82zWOa.js"];
export const stylesheets = [];
export const fonts = [];
