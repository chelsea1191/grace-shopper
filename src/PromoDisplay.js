import React from 'react';

const PromoDisplay = ({ cart, removePromo, promoDescription, isSubmitted }) => {
  let cartId = cart.id;
  if (isSubmitted === true) {
    return (
      <p className='alert alert-success' role='alert'>
        code applied! {promoDescription}{' '}
        <button
          type='button'
          className='close'
          onClick={() => removePromo(cartId)}>
          x
        </button>
      </p>
    );
  } else {
    return (
      <p className='alert alert-danger' role='alert'>
        invalid promo code
      </p>
    );
  }
};

export default PromoDisplay;

// else {
//   return (
//     <p className="alert alert-danger" role="alert">
//       not a valid code
//       </p>
//   );
// }
