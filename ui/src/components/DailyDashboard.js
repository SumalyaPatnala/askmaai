import React, { useState } from 'react';
import { FaSun, FaUtensils, FaTint, FaWalking, FaMoon, FaPlus, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

// Mock data for timeline items
const MOCK_TIMELINE = [
  {
    id: 1,
    type: 'wake-up',
    icon: FaSun,
    time: '07:00',
    endTime: '07:15',
    action: 'Wake up and stretch',
    status: 'pending',
    color: 'yellow'
  },
  {
    id: 2,
    type: 'hydration',
    icon: FaTint,
    time: '07:15',
    endTime: '07:30',
    action: 'Drink 300ml water',
    status: 'done',
    color: 'blue'
  },
  {
    id: 3,
    type: 'meal',
    icon: FaUtensils,
    time: '08:00',
    endTime: '08:30',
    action: 'Breakfast',
    status: 'pending',
    color: 'green'
  },
  {
    id: 4,
    type: 'movement',
    icon: FaWalking,
    time: '09:00',
    endTime: '09:30',
    action: '30 min walk',
    status: 'snoozed',
    color: 'orange'
  },
  {
    id: 5,
    type: 'sleep',
    icon: FaMoon,
    time: '22:00',
    endTime: '22:30',
    action: 'Prepare for bed',
    status: 'pending',
    color: 'purple'
  }
];

const DailyDashboard = () => {
  const [timeline, setTimeline] = useState(MOCK_TIMELINE);

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-500';
      case 'skipped':
        return 'bg-red-500';
      case 'snoozed':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'wake-up':
        return 'text-yellow-500';
      case 'hydration':
        return 'text-blue-500';
      case 'meal':
        return 'text-green-500';
      case 'movement':
        return 'text-orange-500';
      case 'sleep':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const updateStatus = (id, newStatus) => {
    setTimeline(timeline.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const TimelineItem = ({ item }) => {
    const IconComponent = item.icon;
    
    return (
      <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm mb-4">
        <div className={`flex-shrink-0 p-2 rounded-full ${getIconColor(item.type)} bg-opacity-10`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.time} - {item.endTime}
              </p>
              <h3 className="text-lg font-semibold text-gray-800">
                {item.action}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => updateStatus(item.id, 'done')}
                className={`p-2 rounded-full transition-colors ${
                  item.status === 'done' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-green-100'
                }`}
              >
                <FaCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateStatus(item.id, 'skipped')}
                className={`p-2 rounded-full transition-colors ${
                  item.status === 'skipped'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-red-100'
                }`}
              >
                <FaTimes className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateStatus(item.id, 'snoozed')}
                className={`p-2 rounded-full transition-colors ${
                  item.status === 'snoozed'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
                }`}
              >
                <FaClock className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)} text-white`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Timeline</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FaPlus className="mr-2 -ml-1 w-4 h-4" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-4">
        {timeline.map(item => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DailyDashboard; 