import { walk } from "https://deno.land/std@0.115.1/fs/mod.ts";

const {
	readTextFile,
	writeTextFile
} = Deno;

const {
	imports
} = JSON.parse(await readTextFile("./modules.json"));

for await (const {
	path,
	name,
	isFile
} of walk(".")) {
	const isJsFile = (name.endsWith(".js") || name.endsWith(".jsx"))

	const isNotInDotGithub = !path.startsWith(".github");

	const relevant = isFile && isJsFile && isNotInDotGithub

	if (relevant) {
		const js = await readTextFile(path);

		let newJs = js;

		for (const [name, url] of Object.entries(imports)) {
			const regex = new RegExp(`^import((?:(?!import)(?:.|\\n))*)"${name}";$`, "gm");

			newJs = newJs.replaceAll(regex, `import$1"${url}"`);
		}

		await writeTextFile(path, newJs);
	}
}