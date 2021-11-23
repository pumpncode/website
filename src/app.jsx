import { Helmet } from "react-helmet";
import React, { Component, Fragment } from "react";

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
