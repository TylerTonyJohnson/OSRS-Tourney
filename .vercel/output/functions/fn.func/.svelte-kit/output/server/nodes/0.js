

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BJ8XAZB4.js","_app/immutable/chunks/scheduler.BXaX_YOp.js","_app/immutable/chunks/index.PUFXY4mX.js"];
export const stylesheets = [];
export const fonts = [];
