export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.B3WBst6E.js","app":"_app/immutable/entry/app.B_DXegZg.js","imports":["_app/immutable/entry/start.B3WBst6E.js","_app/immutable/chunks/entry.Vaf6j4iA.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.B_DXegZg.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.DOxuPqvy.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
