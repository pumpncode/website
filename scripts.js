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
			watch: false
		},
		dev: {
			desc: "dev",
			cmd: `denon status loading && denon start`,
			env: {
				mode: "dev"
			}
		},
		disconnect: {
			desc: "disconnect",
			cmd: "./disconnect.js",
			watch: false
		},
		status: {
			desc: "status",
			cmd: "./status.js",
			watch: false
		}
	},
	watcher: {
		interval: 350,
		exts: [
			"js",
			"jsx",
			"json",
			"pcss"
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