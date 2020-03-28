const apiKey = "WS75-VRC1-NSQ3";
const axios = require("axios");

const verify = async (e, auth) => {
	let words;
	let address = e[0].value;
	let city = e[1].value;
	let state = e[2].value;
	let zip = e[3].value;
	console.log(address, city, state, zip);
	await axios
		.get(
			`https://trial.serviceobjects.com/AD/api.svc/FindAddressJson?Address1=${address}&City=${city}&State=${state}&PostalCode=${zip}&LicenseKey=${apiKey}`
		)
		.then(response => {
			if (response.data.Error) {
				console.log("Error");
				alert("Please Enter a Valid Mailing Address");
				return verify();
			} else {
				console.log("Valid");
				words = response.data.Addresses[0];
			}
		});
	console.log(words);
	let newAddress = {
		id: auth,
		address: words.Address,
		city: words.City,
		state: words.State,
		zip: words.Zip
	};
	await axios
		.post("/api/address", newAddress)
		.then(response => console.log(response));
};

module.exports = verify;
