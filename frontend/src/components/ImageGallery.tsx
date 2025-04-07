import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-lg bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={images[activeImage]}
          alt={`Product image ${activeImage + 1}`}
          className={`w-full h-auto transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`relative overflow-hidden rounded-md transition-all ${
              activeImage === index
                ? 'ring-2 ring-indigo-500'
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Zoom Indicator */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded-full text-sm text-gray-700"
          >
            Zoomed
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery; 