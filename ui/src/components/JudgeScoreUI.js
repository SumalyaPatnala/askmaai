import React from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const JudgeScoreUI = ({ model, content, score, label, isMotherlyTone, onThumbsUp, onThumbsDown }) => {
  // Helper function to get model-specific theme colors
  const getModelTheme = (model) => {
    switch (model.toLowerCase()) {
      case 'gpt-4':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'claude':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'mistral':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'llama':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'gemma':
        return 'bg-pink-50 border-pink-200 text-pink-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Helper function to get model header theme
  const getModelHeaderTheme = (model) => {
    switch (model.toLowerCase()) {
      case 'gpt-4':
        return 'text-blue-600';
      case 'claude':
        return 'text-purple-600';
      case 'mistral':
        return 'text-green-600';
      case 'llama':
        return 'text-orange-600';
      case 'gemma':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to get label theme
  const getLabelTheme = (label) => {
    switch (label.toLowerCase()) {
      case 'best pick':
        return 'bg-green-100 text-green-700';
      case 'informative':
        return 'bg-blue-100 text-blue-700';
      case 'too generic':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Render star rating
  const renderStars = (score) => {
    return [...Array(5)].map((_, index) => (
      index < score ? (
        <FaStar key={index} className="text-yellow-400 w-4 h-4" />
      ) : (
        <FaRegStar key={index} className="text-gray-300 w-4 h-4" />
      )
    ));
  };

  return (
    <div className={`flex flex-col rounded-lg border p-4 shadow-sm ${getModelTheme(model)}`}>
      {/* Header with model name and motherly tone indicator */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${getModelHeaderTheme(model)}`}>
            {model}
          </span>
          {isMotherlyTone && (
            <span className="text-lg" role="img" aria-label="motherly tone">
              🫶
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-800 mb-3 whitespace-pre-wrap">
        {content}
      </div>

      {/* Score and label */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20">
        <div className="flex items-center">
          {renderStars(score)}
        </div>
        <span className={`text-sm px-2 py-1 rounded ${getLabelTheme(label)}`}>
          {label}
        </span>
      </div>

      {/* Feedback buttons */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-opacity-20">
        <button
          onClick={onThumbsUp}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border hover:bg-gray-50 transition-colors"
        >
          <FaThumbsUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Helpful</span>
        </button>
        <button
          onClick={onThumbsDown}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border hover:bg-gray-50 transition-colors"
        >
          <FaThumbsDown className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Not Helpful</span>
        </button>
      </div>
    </div>
  );
};

export default JudgeScoreUI; 