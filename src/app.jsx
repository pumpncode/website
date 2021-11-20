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
					<link rel="preload" href="./style.css" as="style" />
					<link rel="stylesheet" href="./style.css" />
					{/* <link rel="stylesheet" href="./style.css" media="none" onload="if(media!='all')media='all'" /> */}
				</Helmet>
				<main>
					<h1>Hello World!</h1>
				</main>
			</Fragment>
		);
	}
};

export default Ultra;
