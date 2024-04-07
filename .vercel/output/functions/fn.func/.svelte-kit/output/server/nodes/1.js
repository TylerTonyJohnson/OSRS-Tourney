

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DaCP9IlM.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.DOxuPqvy.js","_app/immutable/chunks/entry.BXOc8ySL.js"];
export const stylesheets = [];
export const fonts = [];
