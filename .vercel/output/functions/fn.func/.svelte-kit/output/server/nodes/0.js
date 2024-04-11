

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.D_IPE2A0.js","_app/immutable/chunks/scheduler.BXaX_YOp.js","_app/immutable/chunks/index.CHI55Ggw.js"];
export const stylesheets = [];
export const fonts = [];
