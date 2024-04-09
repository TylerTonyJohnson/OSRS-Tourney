export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/runescape.ttf","fonts/runescape_bold.ttf","fonts/runescape_small.ttf","Message Background.png","Message Border.jpg","Message Border.png","Point Counter.png","Scroll Bar Down.png","Scroll Bar Up.png","Scroll Bar.png"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.BKQtWNmI.js","app":"_app/immutable/entry/app.CrebIoer.js","imports":["_app/immutable/entry/start.BKQtWNmI.js","_app/immutable/chunks/entry.B9tN4ggu.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/entry/app.CrebIoer.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/chunks/index.DI8FvxkX.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
