import React from "react";

const Rating = rating => {
  if (rating.rating < 50) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star "></span>
        <span className="fa fa-star"></span>
      </div>
    );
  } else if (rating.rating >= 50 && rating.rating < 85) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star"></span>
      </div>
    );
  } else if (rating.rating >= 85) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star checked"></span>
      </div>
    );
  }
};

export default Rating;
