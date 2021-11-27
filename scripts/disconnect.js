const {
	env: {
		toObject
	},
	kill,
	run
} = Deno;

const {
	port
} = toObject();

const process = run({
	cmd: ["lsof", `-ti:${port}`],
	stdout: "piped"
});

const output = await process.output();

process.close();

const decoder = new TextDecoder();

const processIds = decoder.decode(output).split("\n").map(Number);

for (const processId of processIds) {
	if (processId !== 0 && Number.isSafeInteger(processId)) {
		console.log(`terminating process ${processId}`);

		kill(processId, "SIGTERM");
	}
}
