import React from "react";
import Axios from "axios";

export default function CreateUser() {
	const handleSubmit = async e => {
		e.preventDefault();
		let name = e.target[0].value;
		let password = e.target[1].value;
		let address = e.target[2].value;
		let city = e.target[3].value;
		let state = e.target[4].value;
		let zip = e.target[5].value;
		let newUser = {
			name: name,
			password: password,
			address: address,
			city: city,
			state: state,
			zip: zip
		};
		await Axios.post("/api/users", newUser).then(response =>
			console.log(response)
		);
	};

	return (
		<div>
			<form
				onSubmit={e => {
					handleSubmit(e);
				}}
			>
				<h1>Create New User</h1>
				<input placeholder="Name" />
				<input placeholder="Password" />
				<input placeholder="Address" />
				<input placeholder="City" />
				<input placeholder="State" />
				<input placeholder="Zip" />
				<button>Create User</button>
			</form>
		</div>
	);
}
