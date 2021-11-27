import React, { Component } from "https://esm.sh/react@18";
import { Route } from "https://esm.sh/wouter?bundle&deps=react@18";

import routes from "./routes.jsx";

const Main = class extends Component {
	render() {
		return (
			<main>
				{
					routes.map(
						({ component, paths }) => paths.map(path => (
							<Route {...{ component, path }} key={path} />
						))
					).flat()
				}
			</main>
		)
	}
};

export default Main;