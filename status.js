import anybar from "anybar";

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