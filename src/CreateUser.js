import React from 'react';
import axios from 'axios';
import verify from './verify';

const apiKey = 'WS75-VRC1-NSQ3';

export default function CreateUser({ auth, setAuth }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    let name = e.target[0].value;
    let password = e.target[1].value;
    let address = e.target[2].value;
    let city = e.target[3].value;
    let state = e.target[4].value;
    let zip = e.target[5].value;
    let newUser = {
      username: name,
      password: password,
      role: null,
      status: 'active',
      address: address,
      city: city,
      state: state,
      zip: zip
    };
    await axios.post('/api/createUser', newUser).then((response) => {
      newUser.id = response.data.id;
      setAuth(newUser);
    });
    await axios
      .get(
        `https://trial.serviceobjects.com/AD/api.svc/FindAddressJson?Address1=${newUser.address}&City=${newUser.city}&State=${newUser.state}&PostalCode=${newUser.zip}&LicenseKey=${apiKey}`
      )
      .then((response) => {
        if (response.data.Error) {
          console.log('Error');
          alert('Please Enter a Valid Mailing Address');
          return verify();
        } else {
          console.log(response);
          newUser.address = response.data.Addresses[0].Address;
          newUser.city = response.data.Addresses[0].City;
          newUser.state = response.data.Addresses[0].State;
          newUser.zip = response.data.Addresses[0].Zip;
        }
      });
    await axios
      .post('/api/address', newUser)
      .then((response) => console.log(response));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}>
        <h1>Create New User</h1>
        <input placeholder='Name' />
        <input placeholder='Password' type='password' />
        <input placeholder='Address' />
        <input placeholder='City' />
        <input placeholder='State' />
        <input placeholder='Zip' />
        <button>Create User</button>
      </form>
    </div>
  );
}
