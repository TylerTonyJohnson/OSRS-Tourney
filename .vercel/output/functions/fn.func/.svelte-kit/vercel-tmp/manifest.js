export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/EarthTheory.otf","fonts/Metroid-Prime-Font.ttf","fonts/runescape.ttf","fonts/runescape_bold.ttf","fonts/runescape_small.ttf","images/Blue Hat.png","images/challenge-icons/1 LMS Win.png","images/challenge-icons/1 Nex Drop.png","images/challenge-icons/3 Cox Purples.png","images/challenge-icons/3 Toa Purples.png","images/challenge-icons/3 Tob Purples.png","images/challenge-icons/3 Venator Shards.png","images/challenge-icons/3M Woodcutting XP.png","images/challenge-icons/Any Virtus Piece.png","images/challenge-icons/Barrows Legs.png","images/challenge-icons/Beserker Ring.png","images/challenge-icons/Blood Shard.png","images/challenge-icons/Cerberus.png","images/challenge-icons/Clue Value Over 1M.png","images/challenge-icons/Full Godsword.png","images/challenge-icons/Gauntlet Unique.png","images/challenge-icons/Gm Speed for Any DT2 Boss.png","images/challenge-icons/GoTR Unique.png","images/challenge-icons/Holy Elixir.png","images/challenge-icons/Inferno PB.png","images/challenge-icons/Nightmare Unique.png","images/challenge-icons/Obtain New Skillcape.png","images/challenge-icons/Perilous Moons Full Set.png","images/challenge-icons/PvM Pet.png","images/challenge-icons/Raids Kits or Dust.png","images/challenge-icons/Raids Megarare.png","images/challenge-icons/Skilling Pet.png","images/challenge-icons/Slayer Helm Recolor.png","images/challenge-icons/Wilderness Ring.png","images/challenge-icons/Wilderness Robe Piece.png","images/challenge-icons/Zalcano Unique.png","images/challenge-icons/Zulrah Unique.png","images/Green Hat.png","images/Inferno.png","images/interface/Banner Asgarnia.png","images/interface/Banner Fremennik.png","images/interface/Banner Kandarin.png","images/interface/Banner Tirannwn.png","images/interface/Button.png","images/interface/Chat Helmet.png","images/interface/Empty Orb.png","images/interface/Full Orb.png","images/interface/Message Background.png","images/interface/Message Border.jpg","images/interface/Message Border.png","images/interface/Point Counter.png","images/interface/Region Asgarnia.png","images/interface/Scimitar.png","images/interface/Scroll Bar Down.png","images/interface/Scroll Bar Track.png","images/interface/Scroll Bar Up.png","images/interface/Scroll Bar.png","images/Red Hat.png","images/Wide Background.jpg","images/Yellow Hat.png","images/Zuk.png"]),
	mimeTypes: {".png":"image/png",".otf":"font/otf",".ttf":"font/ttf",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.D8o1MLmO.js","app":"_app/immutable/entry/app.PBuCTo6I.js","imports":["_app/immutable/entry/start.D8o1MLmO.js","_app/immutable/chunks/entry.B5Hd96c9.js","_app/immutable/chunks/scheduler.Do8ihC3M.js","_app/immutable/chunks/index.l0xB6urq.js","_app/immutable/entry/app.PBuCTo6I.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.Do8ihC3M.js","_app/immutable/chunks/index.Cf82zWOa.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
