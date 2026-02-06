import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, numReviews, size = 16, showCount = true }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#ffc107" size={size} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" size={size} />);
    } else {
      stars.push(<FaRegStar key={i} color="#ffc107" size={size} />);
    }
  }

  return (
    <span className="d-inline-flex align-items-center gap-1">
      {stars}
      {showCount && numReviews !== undefined && (
        <small className="text-muted ms-1">({numReviews})</small>
      )}
    </span>
  );
};

export default StarRating;
