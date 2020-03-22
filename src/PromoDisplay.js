import React from "react";

const PromoDisplay = ({ multiplier, promoDescription }) => {
  if (multiplier) {
    return <p>code applied! {promoDescription}</p>;
  } else {
    return <p>invalid code</p>;
  }
};

export default PromoDisplay;
