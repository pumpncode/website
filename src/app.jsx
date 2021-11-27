import { Helmet } from "react-helmet";
import React, { Component, Fragment } from "react";
import Main from "./app/main.jsx";
import Nav from "./app/nav.jsx";

let hasOpenedOnce = false;

const App = class extends Component {
	componentDidMount() {
		const {
			hostname
		} = location;

		if (hostname === "localhost") {
			const source = new EventSource("/sse");

			source.onopen = () => {
				if (hasOpenedOnce) {
					location.reload();
				}
				else {
					hasOpenedOnce = true;
				}
			};

			source.onerror = () => {
				console.info("reloading...");
			};
		}

		const script = document.createElement("script");

		script.setAttribute("type", "text/javascript");
		script.async = true;
		script.innerHTML = `
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('./service-worker.js');
			}
		`

		document.body.appendChild(script);
	}

	render() {
		return (
			<Fragment>
				<Helmet>
					<title>Pumpn Universe</title>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="description" content="doing stuff & making things since 2013" />
					<link rel="manifest" href="./manifest.json" />

					<link rel="icon" type="image/svg+xml" href="./images/pulogo-square.svg" />
					<link rel="icon" type="image/png" href="./images/pulogo-square.png" />

					<link rel="apple-touch-icon" sizes="512x512" href="./images/icon.png" />

					<link rel="mask-icon" href="./images/pulogo.svg" color="#0000ff" />
					<meta name="application-name" content="Pumpn Universe" />
					<meta name="msapplication-TileColor" content="#0000ff" />
					<meta name="theme-color" content="#0000ff" />

					<link rel="preload" href="./style.css" as="style" />
					<link rel="stylesheet" href="./style.css" />
				</Helmet>
				<Nav />
				<Main />
			</Fragment>
		);
	}
};

export default App;