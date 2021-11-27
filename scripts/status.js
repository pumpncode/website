import anybar from "https://x.nest.land/anybar@1.0.0/module.js";

const {
	args: [
		status
	]
} = Deno;

switch (status) {
	case "ready":
		anybar("green");
		break;
	case "loading":
		anybar("orange");
		break;
	default:
		break;
}