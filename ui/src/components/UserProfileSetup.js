import React, { useState } from 'react';
import CuisinePreferences from './CuisinePreferences';
import FastingWindowPlanner from './FastingWindowPlanner';
import PlanGenerator from './PlanGenerator';

const defaultProfile = {
  name: '',
  age: 18,
  gender: 'Male',
  weight: { value: 70, unit: 'kg' },
  height: { value: 170, unit: 'cm' },
  activityLevel: 'Moderate',
  chronicConditions: ['None'],
  cuisinePreferences: {
    cuisines: [],
    dislikes: [],
  },
  fastingPlan: null,
};

const getAgeTheme = (age) => {
  if (age < 18) return 'bg-blue-100 border-blue-300';
  if (age >= 60) return 'bg-amber-100 border-amber-300';
  return 'bg-green-100 border-green-300';
};

const UserProfileSetup = () => {
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCuisinePreferences, setShowCuisinePreferences] = useState(false);
  const [showFastingPlanner, setShowFastingPlanner] = useState(false);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleAddProfile = () => {
    setEditingProfile({ ...defaultProfile, id: Date.now().toString() });
    setIsModalOpen(true);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const handleSaveProfile = (profile) => {
    if (profiles.find(p => p.id === profile.id)) {
      setProfiles(profiles.map(p => p.id === profile.id ? profile : p));
    } else {
      setProfiles([...profiles, profile]);
    }
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleSaveCuisinePreferences = ({ profileId, preferences }) => {
    setProfiles(profiles.map(profile => 
      profile.id === profileId
        ? { ...profile, cuisinePreferences: preferences }
        : profile
    ));
    setShowCuisinePreferences(false);
  };

  const handleSaveFastingPlan = (config) => {
    setProfiles(profiles.map(profile => 
      profile.id === editingProfile.id
        ? { ...profile, fastingPlan: config }
        : profile
    ));
    setShowFastingPlanner(false);
    setEditingProfile(null);
  };

  const handlePlanGenerated = (plan) => {
    setProfiles(profiles.map(profile => 
      profile.id === selectedProfile.id
        ? { ...profile, mealPlan: plan }
        : profile
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Family Profiles</h2>
        <button
          onClick={handleAddProfile}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={`rounded-lg border p-4 ${getAgeTheme(profile.age)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.age} years old</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProfile(profile)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Gender: {profile.gender}</p>
              <p>Weight: {profile.weight.value} {profile.weight.unit}</p>
              <p>Height: {profile.height.value} {profile.height.unit}</p>
              <p>Activity Level: {profile.activityLevel}</p>
              <p>Conditions: {profile.chronicConditions.join(', ')}</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setEditingProfile(profile);
                    setShowCuisinePreferences(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {profile.cuisinePreferences?.cuisines?.length > 0
                    ? 'Edit Food Preferences'
                    : 'Add Food Preferences'}
                </button>
                {profile.cuisinePreferences?.cuisines?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Preferred Cuisines:</p>
                    <p className="text-xs">{profile.cuisinePreferences.cuisines.join(', ')}</p>
                    {profile.cuisinePreferences.dislikes.length > 0 && (
                      <>
                        <p className="font-medium mt-1">Dislikes:</p>
                        <p className="text-xs">{profile.cuisinePreferences.dislikes.join(', ')}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setEditingProfile(profile);
                    setShowFastingPlanner(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {profile.fastingPlan
                    ? 'Edit Fasting Plan'
                    : 'Set Fasting Plan'}
                </button>
                {profile.fastingPlan && (
                  <div className="mt-2">
                    <p className="font-medium">Fasting Pattern:</p>
                    <p className="text-xs">
                      {profile.fastingPlan.preset}
                      {profile.fastingPlan.preset === 'Custom' && 
                        ` (${profile.fastingPlan.customHours}h fast)`}
                    </p>
                    <p className="text-xs">
                      Window: {profile.fastingPlan.startTime} - {profile.fastingPlan.endTime}
                    </p>
                    {profile.gender === 'Female' && profile.fastingPlan.menstrualPhase && (
                      <p className="text-xs">
                        Phase: {profile.fastingPlan.menstrualPhase}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Meal Plan Section */}
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setSelectedProfile(profile);
                  setShowPlanGenerator(true);
                }}
                className={`
                  w-full px-4 py-2 rounded-lg text-sm font-medium
                  ${profile.mealPlan
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                  transition-colors
                `}
              >
                {profile.mealPlan ? 'View/Regenerate Meal Plan' : 'Generate Meal Plan'}
              </button>
              {profile.mealPlan && (
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">Current Plan:</p>
                  <p className="text-xs">
                    {Object.keys(profile.mealPlan.meals).length} meals planned
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingProfile.id ? 'Edit' : 'Add'} Profile
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile(editingProfile);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  min="3"
                  max="75"
                  value={editingProfile.age}
                  onChange={(e) => setEditingProfile({ ...editingProfile, age: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={editingProfile.gender}
                  onChange={(e) => setEditingProfile({ ...editingProfile, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editingProfile.weight.value}
                      onChange={(e) => setEditingProfile({
                        ...editingProfile,
                        weight: { ...editingProfile.weight, value: parseFloat(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={editingProfile.weight.unit}
                      onChange={(e) => setEditingProfile({
                        ...editingProfile,
                        weight: { ...editingProfile.weight, unit: e.target.value }
                      })}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editingProfile.height.value}
                      onChange={(e) => setEditingProfile({
                        ...editingProfile,
                        height: { ...editingProfile.height, value: parseFloat(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={editingProfile.height.unit}
                      onChange={(e) => setEditingProfile({
                        ...editingProfile,
                        height: { ...editingProfile.height, unit: e.target.value }
                      })}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                <select
                  value={editingProfile.activityLevel}
                  onChange={(e) => setEditingProfile({ ...editingProfile, activityLevel: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
                <div className="mt-2 space-y-2">
                  {['Diabetes', 'Thyroid', 'PCOS', 'None'].map(condition => (
                    <label key={condition} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={editingProfile.chronicConditions.includes(condition)}
                        onChange={(e) => {
                          let newConditions = [...editingProfile.chronicConditions];
                          if (condition === 'None') {
                            newConditions = e.target.checked ? ['None'] : [];
                          } else {
                            if (e.target.checked) {
                              newConditions = newConditions.filter(c => c !== 'None');
                              newConditions.push(condition);
                            } else {
                              newConditions = newConditions.filter(c => c !== condition);
                            }
                          }
                          setEditingProfile({ ...editingProfile, chronicConditions: newConditions });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProfile(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCuisinePreferences && editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Food Preferences for {editingProfile.name}
              </h3>
              <button
                onClick={() => {
                  setShowCuisinePreferences(false);
                  setEditingProfile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <CuisinePreferences
              profileId={editingProfile.id}
              onSave={handleSaveCuisinePreferences}
            />
          </div>
        </div>
      )}

      {showFastingPlanner && editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Fasting Plan for {editingProfile.name}
              </h3>
              <button
                onClick={() => {
                  setShowFastingPlanner(false);
                  setEditingProfile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <FastingWindowPlanner
              gender={editingProfile.gender}
              initialConfig={editingProfile.fastingPlan}
              onFastingWindowSubmit={handleSaveFastingPlan}
            />
          </div>
        </div>
      )}

      {/* Plan Generator Modal */}
      {showPlanGenerator && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Meal Plan for {selectedProfile.name}
              </h3>
              <button
                onClick={() => {
                  setShowPlanGenerator(false);
                  setSelectedProfile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <PlanGenerator
              profile={selectedProfile}
              onPlanGenerated={handlePlanGenerated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSetup; 