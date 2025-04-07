import { Link } from 'react-router-dom';
import Rating from './Rating';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  numReviews: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="relative pb-[100%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <Rating value={product.rating} />
            <span className="ml-2 text-sm text-gray-600">
              ({product.numReviews})
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 