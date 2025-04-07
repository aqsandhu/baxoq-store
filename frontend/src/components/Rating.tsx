interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

const Rating = ({ value, text, color = '#f8e825' }: RatingProps) => {
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            <i
              style={{ color }}
              className={
                value >= star
                  ? 'fas fa-star'
                  : value >= star - 0.5
                  ? 'fas fa-star-half-alt'
                  : 'far fa-star'
              }
            ></i>
          </span>
        ))}
      </div>
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating; 