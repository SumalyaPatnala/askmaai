import React, { useState } from 'react';
import { FaSpinner, FaCheckCircle, FaShoppingBasket, FaUtensils, FaAppleAlt } from 'react-icons/fa';
import { GiMeat, GiFruitBowl, GiNoodles } from 'react-icons/gi';

const MEAL_ICONS = {
  breakfast: <GiFruitBowl className="w-6 h-6" />,
  lunch: <GiNoodles className="w-6 h-6" />,
  dinner: <GiMeat className="w-6 h-6" />,
  snack: <FaAppleAlt className="w-6 h-6" />,
};

const NUTRITION_COLORS = {
  protein: 'bg-blue-500',
  iron: 'bg-red-500',
  magnesium: 'bg-purple-500',
  fiber: 'bg-green-500',
};

// Mock API response for testing
const MOCK_MEAL_PLAN = {
  meals: {
    breakfast: {
      name: "Masala Dosa with Coconut Chutney",
      calories: 450,
    },
    lunch: {
      name: "Mediterranean Quinoa Bowl with Grilled Vegetables",
      calories: 550,
    },
    dinner: {
      name: "Grilled Salmon with Sweet Potato",
      calories: 650,
    },
    snack: {
      name: "Greek Yogurt with Berries",
      calories: 200,
    }
  },
  nutrition: {
    protein: { value: 85, max: 100 },
    iron: { value: 14, max: 18 },
    magnesium: { value: 320, max: 400 },
    fiber: { value: 28, max: 35 }
  },
  groceryList: {
    "Proteins": [
      "Salmon fillet",
      "Greek yogurt",
      "Quinoa"
    ],
    "Vegetables": [
      "Sweet potato",
      "Bell peppers",
      "Zucchini",
      "Spinach"
    ],
    "Fruits": [
      "Mixed berries",
      "Lemon"
    ],
    "Pantry": [
      "Dosa batter",
      "Coconut",
      "Olive oil",
      "Mediterranean spices"
    ]
  }
};

const PlanGenerator = ({ profile, onPlanGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('meals');

  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For testing, use mock data instead of actual API call
      const data = MOCK_MEAL_PLAN;
      
      // Customize mock data based on profile preferences
      if (profile.cuisinePreferences?.cuisines?.includes('south-indian')) {
        data.meals.breakfast.name = "Masala Dosa with Coconut Chutney";
      } else if (profile.cuisinePreferences?.cuisines?.includes('mediterranean')) {
        data.meals.breakfast.name = "Mediterranean Breakfast Bowl";
      }

      // Adjust meal timing based on fasting window
      if (profile.fastingPlan) {
        const { startTime, endTime } = profile.fastingPlan;
        data.meals.breakfast.time = startTime;
        data.meals.dinner.time = endTime;
      }

      setMealPlan(data);
      onPlanGenerated?.(data);
    } catch (err) {
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMeals = () => {
    if (!mealPlan) return null;
    return (
      <div className="space-y-4">
        {Object.entries(mealPlan.meals).map(([mealType, meal]) => (
          <div key={mealType} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FaUtensils className="text-teal-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                <p className="text-gray-600">{meal.name}</p>
                <p className="text-sm text-gray-500">{meal.calories} calories</p>
                {meal.time && (
                  <p className="text-sm text-gray-500">Time: {meal.time}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNutrition = () => {
    if (!mealPlan) return null;
    return (
      <div className="space-y-4">
        {Object.entries(mealPlan.nutrition).map(([nutrient, { value, max }]) => (
          <div key={nutrient} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="capitalize font-medium">{nutrient}</span>
              <span className="text-gray-600">{value}/{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${NUTRITION_COLORS[nutrient]}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGroceryList = () => {
    if (!mealPlan) return null;
    return (
      <div className="space-y-6">
        {Object.entries(mealPlan.groceryList).map(([category, items]) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaShoppingBasket className="text-teal-500 mr-2" />
              {category}
            </h3>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={generatePlan}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
          ${isLoading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Generating your plan...
          </span>
        ) : (
          'Generate Meal Plan'
        )}
      </button>

      {mealPlan && (
        <div className="mt-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('meals')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'meals'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <FaUtensils className="mr-2" />
                  Meals
                </span>
              </button>

              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'nutrition'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <FaAppleAlt className="mr-2" />
                  Nutrition
                </span>
              </button>

              <button
                onClick={() => setActiveTab('grocery')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'grocery'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <FaShoppingBasket className="mr-2" />
                  Grocery List
                </span>
              </button>
            </nav>
          </div>

          <div className="py-4">
            {activeTab === 'meals' && renderMeals()}
            {activeTab === 'nutrition' && renderNutrition()}
            {activeTab === 'grocery' && renderGroceryList()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanGenerator; 