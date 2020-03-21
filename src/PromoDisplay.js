import React from "react";

const PromoDisplay = ({ multiplier }) => {
  if (multiplier == 0.9) {
    return <p>promo code applied! 10% off any purchase</p>;
  } else {
    return <p>promo code applied</p>;
  }
};

export default PromoDisplay;
