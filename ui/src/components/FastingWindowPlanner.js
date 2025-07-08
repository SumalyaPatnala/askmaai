import React, { useState, useEffect } from 'react';
import { format, parse, addHours, differenceInHours, isValid } from 'date-fns';

const PRESET_OPTIONS = {
  'None': { fast: 0, eat: 24 },
  '14:10': { fast: 14, eat: 10 },
  '16:8': { fast: 16, eat: 8 },
  'OMAD': { fast: 23, eat: 1 },
  'Circadian': { fast: 13, eat: 11 },
};

const MENSTRUAL_PHASES = ['Follicular', 'Ovulation', 'Luteal', 'Menstruation'];

const FastingWindowPlanner = ({ 
  onFastingWindowSubmit, 
  gender = 'Male',
  initialConfig = null 
}) => {
  const [selectedPreset, setSelectedPreset] = useState('None');
  const [customFastingHours, setCustomFastingHours] = useState('');
  const [eatingWindowStart, setEatingWindowStart] = useState('08:00');
  const [eatingWindowEnd, setEatingWindowEnd] = useState('20:00');
  const [menstrualPhase, setMenstrualPhase] = useState('Follicular');
  const [autoAdjust, setAutoAdjust] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialConfig) {
      setSelectedPreset(initialConfig.preset || 'None');
      setCustomFastingHours(initialConfig.customHours || '');
      setEatingWindowStart(initialConfig.startTime || '08:00');
      setEatingWindowEnd(initialConfig.endTime || '20:00');
      setMenstrualPhase(initialConfig.menstrualPhase || 'Follicular');
      setAutoAdjust(initialConfig.autoAdjust || false);
    }
  }, [initialConfig]);

  const validateTimeWindow = (start, end) => {
    const startTime = parse(start, 'HH:mm', new Date());
    const endTime = parse(end, 'HH:mm', new Date());
    
    if (!isValid(startTime) || !isValid(endTime)) {
      return 'Invalid time format';
    }

    let hours = differenceInHours(endTime, startTime);
    if (hours < 0) {
      hours += 24; // Handle overnight windows
    }

    const selectedFastingHours = selectedPreset === 'Custom' 
      ? Number(customFastingHours)
      : PRESET_OPTIONS[selectedPreset]?.fast || 0;

    if (hours + selectedFastingHours !== 24) {
      return 'Total time must equal 24 hours';
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateTimeWindow(eatingWindowStart, eatingWindowEnd);
    if (error) {
      setValidationError(error);
      return;
    }

    const config = {
      preset: selectedPreset,
      customHours: customFastingHours,
      startTime: eatingWindowStart,
      endTime: eatingWindowEnd,
      menstrualPhase: gender === 'Female' ? menstrualPhase : null,
      autoAdjust,
      fastingHours: selectedPreset === 'Custom' 
        ? Number(customFastingHours)
        : PRESET_OPTIONS[selectedPreset]?.fast || 0,
      eatingHours: selectedPreset === 'Custom'
        ? 24 - Number(customFastingHours)
        : PRESET_OPTIONS[selectedPreset]?.eat || 24,
    };

    onFastingWindowSubmit?.(config);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    if (preset !== 'Custom' && preset !== 'None') {
      const { eat } = PRESET_OPTIONS[preset];
      // Adjust eating window based on preset
      const start = parse(eatingWindowStart, 'HH:mm', new Date());
      const newEnd = format(addHours(start, eat), 'HH:mm');
      setEatingWindowEnd(newEnd);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Fasting Window Planner</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preset Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Fasting Pattern
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Object.keys(PRESET_OPTIONS), 'Custom'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedPreset === preset
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Hours Input */}
        {selectedPreset === 'Custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Fasting Hours
            </label>
            <input
              type="number"
              min="1"
              max="23"
              value={customFastingHours}
              onChange={(e) => setCustomFastingHours(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter hours (1-23)"
              required
            />
          </div>
        )}

        {/* Eating Window */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eating Window Start
            </label>
            <input
              type="time"
              value={eatingWindowStart}
              onChange={(e) => setEatingWindowStart(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eating Window End
            </label>
            <input
              type="time"
              value={eatingWindowEnd}
              onChange={(e) => setEatingWindowEnd(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Menstrual Phase (Female Only) */}
        {gender === 'Female' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menstrual Phase
            </label>
            <select
              value={menstrualPhase}
              onChange={(e) => setMenstrualPhase(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {MENSTRUAL_PHASES.map(phase => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Auto-adjust Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto-adjust"
            checked={autoAdjust}
            onChange={(e) => setAutoAdjust(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="auto-adjust" className="ml-2 block text-sm text-gray-700">
            Auto-adjust with sunrise/sunset
          </label>
        </div>

        {/* Live Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Fasting Pattern: {selectedPreset}
              {selectedPreset === 'Custom' && ` (${customFastingHours} hours fasting)`}
            </p>
            <p>Eating Window: {eatingWindowStart} - {eatingWindowEnd}</p>
            {gender === 'Female' && <p>Menstrual Phase: {menstrualPhase}</p>}
            <p>Auto-adjust: {autoAdjust ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="text-red-500 text-sm">
            {validationError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Fasting Plan
        </button>
      </form>
    </div>
  );
};

export default FastingWindowPlanner; 