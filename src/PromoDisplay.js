import React from "react";

const PromoDisplay = ({ multiplier, promoDescription, promo, allPromos }) => {
  const filtered = allPromos.map(each => {
    console.log(each.code);
    console.log(promo);
    each.code == promo;
  });
  if (filtered) {
    return (
      <p className="alert alert-success" role="alert">
        code applied! {promoDescription}
      </p>
    );
  } else {
    return (
      <p className="alert alert-danger" role="alert">
        invalid code
      </p>
    );
  }
};

export default PromoDisplay;
