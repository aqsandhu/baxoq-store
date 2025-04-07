import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Baxoq.Store</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Baxoq.Store was founded in 2023 by a group of passionate collectors and enthusiasts 
            who shared a deep appreciation for the craftsmanship and history of swords and knives. 
            What began as a small online community has grown into a premier global marketplace 
            for collectors, practitioners, and enthusiasts alike.
          </p>
          <p className="text-gray-700 mb-4">
            Our mission is to provide access to high-quality, authentic bladed artifacts and tools 
            from around the world, while educating our customers about their historical and cultural significance.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Collection</h2>
          <p className="text-gray-700 mb-4">
            At Baxoq.Store, we curate an extensive collection of swords, knives, daggers, and accessories 
            representing various cultures, historical periods, and crafting techniques. From Japanese katanas 
            to medieval European longswords, from Damascus steel hunting knives to ceremonial daggers, 
            our inventory spans centuries of blade-making tradition.
          </p>
          <p className="text-gray-700 mb-4">
            Every piece in our collection is carefully authenticated and described in detail, 
            providing you with complete information about its origin, materials, dimensions, and historical context.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Assurance</h2>
          <p className="text-gray-700 mb-4">
            We partner with renowned artisans, established manufacturers, and reputable collectors 
            to ensure that every item we offer meets our rigorous standards for quality, authenticity, and value. 
            Whether you're purchasing a functional blade for martial arts practice or a collectible piece for display, 
            you can trust that you're receiving an item of exceptional quality.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Community & Education</h2>
          <p className="text-gray-700 mb-4">
            Beyond being a marketplace, Baxoq.Store is committed to fostering a community of enthusiasts 
            and promoting education about blade history, metallurgy, and proper handling techniques. 
            We regularly publish articles, host online discussions, and create instructional content 
            to enrich your understanding and appreciation of these storied artifacts.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-gray-700 mb-4">
            At Baxoq.Store, we are committed to responsible collecting and trading. We strictly adhere to 
            all applicable laws regarding the sale and ownership of bladed items, and we expect our customers 
            to do the same. We believe in the importance of preserving these historical artifacts and traditions 
            for future generations to study and appreciate.
          </p>
          <p className="text-gray-700">
            Thank you for joining us on this journey of discovery and appreciation. We look forward to serving 
            your collecting needs and being a part of your continuing education in this fascinating field.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
