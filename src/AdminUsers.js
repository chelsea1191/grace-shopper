import React from 'react';
import axios from 'axios';

const AdminUsers = ({ users, setUsers }) => {
  const handleOptionChange = (ev) => {
    let selection = ev.target.value;
    let userId = ev.target.id;
    axios
      .post('/api/changeUserStatus', { userId, selection })
      .then(
        axios
          .get('/api/getAllUsers')
          .then((response) => setUsers(response.data))
      );
  };

  return (
    <div>
      {users.map((user) => {
        return (
          <div className='card-user' key={user.id}>
            <p>username: {user.username}</p>
            <form>
              <div>
                <input
                  id={user.id}
                  type='radio'
                  value='active'
                  checked={user.status === 'active'}
                  onChange={handleOptionChange}
                />
                <label>active</label>
                <input
                  id={user.id}
                  type='radio'
                  value='inactive'
                  checked={user.status === 'inactive'}
                  onChange={handleOptionChange}
                />
                <label>inactive</label>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
};

export default AdminUsers;
