/**
 * @import { PageProps } from "fresh";
 * @import { JSX } from "preact";
 */

/**
 * @param {PageProps} props - The root object
 * @returns {JSX.Element}
 * @example
 */
const App = ({ Component }) => (
	<html>
		<head>
			<meta charset="utf-8" />

			<meta content="width=device-width, initial-scale=1.0" name="viewport" />

			<title>Pumpn Universe</title>

			<link href="/style.compiled.css" rel="stylesheet" />
		</head>

		<body>
			<Component />
		</body>
	</html>
);

export default App;
