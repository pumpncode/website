/*
  Copyright (c) 2018 uupaa and 2019 Google LLC and 2021 Nano Miratus

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { configAsync } from "https://deno.land/x/dotenv/mod.ts";

let {
	env
} = Deno;

if (env.get("mode") === "prod") {
	env = new Map(Object.entries({
		...env.toObject(),
		...(await configAsync())
	}));
}
else {
	configAsync({ export: true });
}

if (env.get("mode") === "dev") {
	env.set("deploy-url", `https://localhost:${env.get("port")}`);
}

const deployUrl = env.get("deploy-url");

const location = new URL(deployUrl);

/**
 * Creates a global function (defaulting to `self.__import__()`) that can
 * dynamically import modules. In browsers that support native dynamic
 * `import()`, the function defers to using that, otherwise a small polyfill
 * is used that creates a new module script and resolves once the module
 * is loaded.
 *
 * @param {Object} [options]
 * @param {string} [options.modulePath="./"] A path that relative import URLs
 *     are resolved from. This is needed since this polyfill creates script
 *     elements, and relative imports inside script elements will resolve
 *     relative to the page URL. Set this option to have URLs resolve relative
 *     to a different path (typically the location of your deployed modules
 *     directory).
 * @param {string} [importFunctionName="dynamicImport"] The name to use for the
 *     global import function this polyfill will create. Since `import` is
 *     a keyword in JavaScript, it's not possible to polyfill dynamic import
 *     by creating a global function named `import()`. Thus, a different
 *     name must be used.
 */
export default ({
	modulePath = "./",
	importFunctionName = "dynamicImport",
} = {}) => {
	try {
		self[importFunctionName] = new Function("u", `return import(u)`);
	} catch {
		const baseURL = new URL(modulePath, location);
		const cleanup = (script) => {
			URL.revokeObjectURL(script.src);
			script.remove();
		};

		self[importFunctionName] = (url) => new Promise((resolve, reject) => {
			const absURL = new URL(url, baseURL);

			// If the module has already been imported, resolve immediately.
			if (self[importFunctionName].moduleMap[absURL]) {
				return resolve(self[importFunctionName].moduleMap[absURL]);
			}

			const moduleBlob = new Blob([
				`import * as m from "${absURL}";`,
				`${importFunctionName}.moduleMap["${absURL}"]=m;`,
			], { type: "text/javascript" });

			const script = Object.assign(document.createElement("script"), {
				type: "module",
				src: URL.createObjectURL(moduleBlob),
				onerror() {
					reject(new Error(`Failed to import: ${url}`));
					cleanup(script);
				},
				onload() {
					resolve(self[importFunctionName].moduleMap[absURL]);
					cleanup(script);
				},
			});

			document.head.appendChild(script);
		});

		self[importFunctionName].moduleMap = {};
	}
}