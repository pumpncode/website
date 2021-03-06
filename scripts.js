import "https://deno.land/x/dotenv/load.ts";

const {
	env: {
		toObject
	}
} = Deno;

export default {
	allow: [
		"read",
		"write",
		"env",
		"run",
		"net"
	],
	importMap: "./modules.json",
	noCheck: true,
	scripts: {
		start: {
			desc: "start",
			cmd: "./server.js",
			watch: false,
			env: {
				mode: "prod",
				certFile: "/etc/letsencrypt/live/pumpn.net/fullchain.pem",
				keyFile: "/etc/letsencrypt/live/pumpn.net/privkey.pem",
				url: "https://pumpn.net"
			}
		},
		dev: {
			desc: "dev",
			cmd: `vr devMap && denon status loading && deno run ./server.js`,
			env: {
				mode: "dev"
			}
		},
		devMap: {
			desc: "devMap",
			cmd: "./scripts/generate-dev-import-map.js",
			watch: false
		},
		disconnect: {
			desc: "disconnect",
			cmd: "./scripts/disconnect.js",
			watch: false
		},
		status: {
			desc: "status",
			cmd: "./scripts/status.js",
			watch: false
		}
	},
	watcher: {
		interval: 350,
		exts: [
			"js",
			"jsx",
			"json",
			"pcss",
			"svg",
			"png",
			"icns"
		],
		match: [
			"**/*.*"
		],
		skip: [
			"*/.git/*"
		]
	},
	unstable: true,
	log: "info"
}