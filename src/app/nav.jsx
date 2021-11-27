import React, { Component } from "react";
import { Link } from "wouter";

import routes from "./routes.js";

const Nav = class extends Component {
	render() {
		return (
			<nav>
				<ul>
					{
						routes.map(({ paths: [path], name }) => {
							return (
								<Link href={path} key={path}>
									{name}
								</Link>
							)
						})
					}
				</ul>
			</nav>
		)
	}
};

export default Nav;