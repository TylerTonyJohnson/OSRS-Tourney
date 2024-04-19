

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DuGLYAxv.js","_app/immutable/chunks/scheduler.B_M5xA-k.js","_app/immutable/chunks/index.8At0uzev.js"];
export const stylesheets = [];
export const fonts = [];
