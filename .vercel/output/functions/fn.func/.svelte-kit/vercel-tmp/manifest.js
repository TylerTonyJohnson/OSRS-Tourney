export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/runescape.ttf","fonts/runescape_bold.ttf","fonts/runescape_small.ttf","images/Blue Hat.png","images/challenge-icons/3 Toa Purples.png","images/challenge-icons/3 Tob Purples.png","images/challenge-icons/Ancestral.png","images/challenge-icons/Beaver.png","images/challenge-icons/Beserker Ring.png","images/challenge-icons/Blood Moon Armor.png","images/challenge-icons/Blood Shard.png","images/challenge-icons/Cerberus.png","images/challenge-icons/Clue.png","images/challenge-icons/Dust.png","images/challenge-icons/Gaunt.png","images/challenge-icons/Gotr.png","images/challenge-icons/Holy Elixir.png","images/challenge-icons/Infernal Cape.png","images/challenge-icons/Last Man Standing.png","images/challenge-icons/Mishkal.png","images/challenge-icons/Nex.png","images/challenge-icons/Nightmare.png","images/challenge-icons/Olmlet.png","images/challenge-icons/Sgs.png","images/challenge-icons/Shadow.png","images/challenge-icons/Skill.png","images/challenge-icons/Skirt.png","images/challenge-icons/Slayer.png","images/challenge-icons/The Leviathan.png","images/challenge-icons/Venator Shard.png","images/challenge-icons/Virtus Mask.png","images/challenge-icons/Wildy Ring.png","images/challenge-icons/Zalcano.png","images/challenge-icons/Zulrah.png","images/Green Hat.png","images/Inferno.png","images/interface/Button.png","images/interface/Message Background.png","images/interface/Message Border.jpg","images/interface/Message Border.png","images/interface/Point Counter.png","images/interface/Scimitar.png","images/interface/Scroll Bar Down.png","images/interface/Scroll Bar Track.png","images/interface/Scroll Bar Up.png","images/interface/Scroll Bar.png","images/Red Hat.png","images/Yellow Hat.png","images/Zuk.png"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.B_yA858C.js","app":"_app/immutable/entry/app.Cyv7uvaV.js","imports":["_app/immutable/entry/start.B_yA858C.js","_app/immutable/chunks/entry.wDfv2RcY.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/entry/app.Cyv7uvaV.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/chunks/index.DI8FvxkX.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
