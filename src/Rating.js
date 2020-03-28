import React from "react";

const Rating = rating => {
  if (rating.rating === 1) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star "></span>
        <span className="fa fa-star "></span>
        <span className="fa fa-star "></span>
        <span className="fa fa-star"></span>
      </div>
    );
  } else if (rating.rating === 2) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star  "></span>
        <span className="fa fa-star  "></span>
        <span className="fa fa-star"></span>
      </div>
    );
  } else if (rating.rating === 3) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star  "></span>
        <span className="fa fa-star "></span>
      </div>
    );
  } else if (rating.rating === 4) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star "></span>
      </div>
    );
  } else if (rating.rating === 5) {
    return (
      <div>
        <span className="fa fa-star checked"></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
        <span className="fa fa-star  checked"></span>
        <span className="fa fa-star checked "></span>
      </div>
    );
  } else {
    return <span>no ratings</span>;
  }
};

export default Rating;
