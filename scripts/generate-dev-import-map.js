const {
	readTextFile,
	writeTextFile
} = Deno;

const importMapPath = "./modules.json";

const { imports } = JSON.parse(await readTextFile(importMapPath));

const newImports = Object.fromEntries(
	Object.entries(imports).map(([name, url]) => {
		const alreadyHasQuestionMark = url.includes("?");

		const query = "dev";

		const newUrl = alreadyHasQuestionMark ? `${url}&${query}` : `${url}?${query}`

		return [name, newUrl];
	})
);

await writeTextFile("./dev-modules.json", JSON.stringify({ imports: newImports }));