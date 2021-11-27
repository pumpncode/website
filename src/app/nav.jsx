import React, { Component } from "https://esm.sh/react@18?dev";
import { Link } from "https://esm.sh/wouter?bundle&dev&deps=react@18";

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