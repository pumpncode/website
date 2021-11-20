import ultra, { app, router } from "https://raw.githubusercontent.com/nnmrts/ultra/url-imports/mod.ts";
import anybar from "https://x.nest.land/anybar@0.1.3/module.js";
import postcss from "https://deno.land/x/postcss/mod.js";
import postcssNesting from "https://cdn.jsdelivr.net/npm/postcss-nesting@10/mod.js";
import { Snelm } from "https://deno.land/x/snelm/mod.ts";
import dynamicImportsPolyfill from "./server/dynamic-imports-polyfill.js";

const {
	env,
	readTextFile
} = Deno;

dynamicImportsPolyfill();

const importMapJson = await readTextFile("modules.json");

if (env.get("mode") === "dev") {
	anybar("green");
}

const targets = [];

const snelm = new Snelm("oak", {
	csp: null,
	dnsPrefetchControl: null,
	dontSniffMimetype: null,
	expectCt: null,
	featurePolicy: null,
	frameguard: null,
	hidePoweredBy: null,
	hsts: null,
	ieNoOpen: null,
	referrerPolicy: null,
	xssProtection: null
});

app.use(async (context, next) => {
	context.response = snelm.snelm(context.request, context.response);

	await next();
})

app.use(async (context, next) => {
	await next();

	const {
		request: {
			url: {
				pathname
			}
		}
	} = context;

	if (pathname.endsWith(".css")) {
		const cssFilePath = `./src${pathname.replace(/\.css$/, ".pcss")}`;

		const cssText = await readTextFile(cssFilePath);

		const output = (await postcss([postcssNesting]).process(cssText, { from: cssFilePath })).css;

		context.response.headers.set("Content-type", "text/css")

		context.response.body = output;
	}
});

router.get("/sse", async (ctx) => {
	const target = ctx.sendEvents();

	targets.push(target);
});

ultra({
	importmap: importMapJson
});