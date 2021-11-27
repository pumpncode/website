import React, { Component } from "react";
import { Route } from "wouter";

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