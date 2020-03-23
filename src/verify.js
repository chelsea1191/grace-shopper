const apiKey = "WS75-VRC1-NSQ3";
const axios = require("axios");

const verify = async e => {
	e.preventDefault();
	let address = e.target[0].value;
	let city = e.target[1].value;
	let state = e.target[2].value;
	let zip = e.target[3].value;
	console.log(address, city, state, zip);
	await axios
		.get(
			`https://trial.serviceobjects.com/AD/api.svc/FindAddressJson?Address1=${address}&City=${city}&State=${state}&PostalCode=${zip}&LicenseKey=${apiKey}`
		)
		.then(response => {
			if (response.data.Error) {
				console.log("Error");
				return response.data.Error;
			} else {
				console.log("Valid");
				console.log(response);
				return response.data.Addresses[0];
			}
		});
};

module.exports = verify;
