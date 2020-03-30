import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPromos = ({ allPromos, setAllPromos }) => {
  const [codeInput, setCodeInput] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState([]);
  const [multiplierInput, setMultiplierInput] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setError(null);
    setIsSubmitted(false);
  }, [multiplierInput]);

  const submitNewPromo = (ev) => {
    ev.preventDefault();
    if (multiplierInput <= 1 && multiplierInput >= 0) {
      setIsSubmitted(true);
      axios
        .post('/api/addPromo', {
          codeInput,
          descriptionInput,
          multiplierInput
        })
        .then(
          axios
            .get('/api/getPromos')
            .then((response) => setAllPromos(response.data))
        );
    } else {
      setError('multiplier must be a decimal between 0 and 1');
    }
  };

  const handleOptionChange = (ev) => {
    let selection = ev.target.value;
    let promoId = ev.target.id;
    axios
      .post('/api/changePromoStatus', { promoId, selection })
      .then(
        axios
          .get('/api/getPromos')
          .then((response) => setAllPromos(response.data))
      );
  };

  return (
    <div>
      {allPromos.map((promo) => {
        return (
          <div className='card' key={promo.id}>
            <p>code: {promo.code}</p>
            <p>description: {promo.description}</p>
            <p>current status: {promo.status}</p>
            <form>
              <div>
                <input
                  id={promo.id}
                  type='radio'
                  value='active'
                  checked={promo.status === 'active'}
                  onChange={handleOptionChange}
                />
                <label>active</label>
                <input
                  id={promo.id}
                  type='radio'
                  value='inactive'
                  checked={promo.status === 'inactive'}
                  onChange={handleOptionChange}
                />
                <label>inactive</label>
              </div>
            </form>
          </div>
        );
      })}
      {isSubmitted && (
        <p className='alert alert-success' role='alert'>
          success!
        </p>
      )}
      <form onSubmit={submitNewPromo}>
        <h3>Add a New Promo</h3>
        <input
          placeholder='code'
          value={codeInput}
          onChange={(ev) => setCodeInput(ev.target.value.toUpperCase())}
        />
        <input
          placeholder='description'
          value={descriptionInput}
          onChange={(ev) => setDescriptionInput(ev.target.value)}
        />
        <input
          placeholder='multiplier (decimal less than 1)'
          value={multiplierInput}
          onChange={(ev) => setMultiplierInput(ev.target.value)}
        />
        {error && (
          <p className='alert alert-danger' role='alert'>
            {error}
          </p>
        )}

        <button type='submit' className='btn btn-secondary'>
          submit new promotion
        </button>
      </form>
    </div>
  );
};

export default AdminPromos;
