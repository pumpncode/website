import React, { Component } from "react";

const Home = class extends Component {
	render() {
		return (
			<>
				<h1>Pumpn Universe</h1>
			</>
		)
	}
};

export default {
	component: Home,
	paths: ["/"],
	name: "home"
};