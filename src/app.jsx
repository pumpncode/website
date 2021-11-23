import { Helmet } from "https://esm.sh/react-helmet-async?deps=react@18.0.0-alpha-bc9bb87c2-20210917&bundle";
import React, { Component, Fragment } from "https://esm.sh/react@18.0.0-alpha-bc9bb87c2-20210917";

let hasOpenedOnce = false;

const Ultra = class extends Component {
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
	}

	render() {
		return (
			<Fragment>
				<Helmet>
					<title>Pumpn Universe</title>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="description" content="Kreatives Konglomerat - seit 2013" />
					<link rel="manifest" href="./manifest.json" />
					<link rel="preload" href="./style.css" as="style" />
					<link rel="stylesheet" href="./style.css" />
				</Helmet>
				<main>
					<h1>Hello World!</h1>
				</main>
			</Fragment>
		);
	}
};

export default Ultra;
