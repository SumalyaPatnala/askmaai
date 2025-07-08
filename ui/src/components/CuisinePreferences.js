import React, { useState } from 'react';
import { FaLeaf, FaFire, FaLemon, FaHeart } from 'react-icons/fa';
import { GiNoodles, GiMedicalPack } from 'react-icons/gi';

const cuisineOptions = [
  {
    id: 'south-indian',
    name: 'South Indian',
    icon: <GiNoodles className="w-8 h-8" />,
    description: 'Dosas, Idlis, and spicy curries',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    icon: <FaLeaf className="w-8 h-8" />,
    description: 'Olive oil, herbs, and fresh vegetables',
  },
  {
    id: 'spicy',
    name: 'Spicy',
    icon: <FaFire className="w-8 h-8" />,
    description: 'Hot and flavorful dishes',
  },
  {
    id: 'mild',
    name: 'Mild',
    icon: <FaHeart className="w-8 h-8" />,
    description: 'Gentle, balanced flavors',
  },
  {
    id: 'tangy',
    name: 'Tangy',
    icon: <FaLemon className="w-8 h-8" />,
    description: 'Sour and zesty tastes',
  },
  {
    id: 'low-fodmap',
    name: 'Low-FODMAP',
    icon: <GiMedicalPack className="w-8 h-8" />,
    description: 'Gut-friendly ingredients',
  },
];

const CuisinePreferences = ({ profileId, onSave }) => {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [dislikedItems, setDislikedItems] = useState([]);
  const [newDislike, setNewDislike] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCuisineToggle = (cuisineId) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisineId)) {
        return prev.filter(id => id !== cuisineId);
      }
      return [...prev, cuisineId];
    });
  };

  const handleAddDislike = (e) => {
    e.preventDefault();
    if (newDislike.trim() && !dislikedItems.includes(newDislike.trim())) {
      setDislikedItems([...dislikedItems, newDislike.trim()]);
      setNewDislike('');
    }
  };

  const handleRemoveDislike = (item) => {
    setDislikedItems(dislikedItems.filter(i => i !== item));
  };

  const handleSave = () => {
    onSave?.({
      profileId,
      preferences: {
        cuisines: selectedCuisines,
        dislikes: dislikedItems,
      },
    });
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.ceil(cuisineOptions.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + Math.ceil(cuisineOptions.length / 2)) % Math.ceil(cuisineOptions.length / 2));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cuisine Preferences</h2>
      
      {/* Cuisine Selection */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-full">
              {cuisineOptions.map((cuisine) => (
                <div
                  key={cuisine.id}
                  onClick={() => handleCuisineToggle(cuisine.id)}
                  className={`
                    cursor-pointer rounded-lg p-4 transition-all duration-200
                    ${selectedCuisines.includes(cuisine.id)
                      ? 'bg-blue-100 border-blue-500 border-2'
                      : 'bg-white border-gray-200 border hover:border-blue-300'}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-500">
                      {cuisine.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{cuisine.name}</h3>
                      <p className="text-sm text-gray-600">{cuisine.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 md:hidden"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 md:hidden"
        >
          →
        </button>
      </div>

      {/* Dislikes Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Food Dislikes</h3>
        <form onSubmit={handleAddDislike} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newDislike}
            onChange={(e) => setNewDislike(e.target.value)}
            placeholder="Add food items you dislike..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {dislikedItems.map((item) => (
            <div
              key={item}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemoveDislike(item)}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default CuisinePreferences; 