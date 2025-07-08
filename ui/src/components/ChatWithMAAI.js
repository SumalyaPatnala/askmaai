import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaStar, FaRegStar, FaUser, FaUserSlash } from 'react-icons/fa';
import { format } from 'date-fns';
import JudgeScoreUI from './JudgeScoreUI';

// Constants for dietary and health safety
const DIETARY_RESTRICTIONS = {
  'Vegetarian': {
    avoid: ['meat', 'fish', 'poultry'],
    checkIngredients: ['gelatin', 'rennet', 'lard', 'fish sauce', 'oyster sauce'],
    reminder: 'Ensure all recommendations are strictly vegetarian'
  },
  'Vegan': {
    avoid: ['meat', 'fish', 'poultry', 'dairy', 'eggs', 'honey'],
    checkIngredients: ['gelatin', 'rennet', 'lard', 'whey', 'casein', 'albumin'],
    reminder: 'Ensure all recommendations are strictly vegan'
  },
  'Halal': {
    avoid: ['pork', 'alcohol', 'non-halal meat'],
    checkIngredients: ['gelatin', 'enzymes', 'emulsifiers', 'alcohol-based flavors'],
    reminder: 'Ensure all recommendations comply with halal dietary laws'
  },
  'Kosher': {
    avoid: ['pork', 'shellfish', 'non-kosher meat', 'mixing meat and dairy'],
    checkIngredients: ['gelatin', 'rennet', 'non-kosher ingredients'],
    reminder: 'Ensure all recommendations comply with kosher dietary laws'
  },
  'Gluten-Free': {
    avoid: ['wheat', 'rye', 'barley', 'regular oats'],
    checkIngredients: ['malt', 'modified food starch', 'hydrolyzed proteins'],
    reminder: 'Ensure all recommendations are certified gluten-free'
  }
};

// Cultural food preferences and considerations
const CULTURAL_CONSIDERATIONS = {
  'South Indian': {
    preferredSpices: ['turmeric', 'curry leaves', 'mustard seeds', 'black pepper'],
    commonIngredients: ['rice', 'lentils', 'coconut', 'vegetables'],
    traditionalDishes: ['dosa', 'idli', 'sambar', 'rasam'],
    mealPatterns: 'Traditional South Indian meals often include rice, lentils, and multiple small sides'
  },
  'Mediterranean': {
    preferredSpices: ['oregano', 'basil', 'rosemary', 'thyme'],
    commonIngredients: ['olive oil', 'whole grains', 'legumes', 'fresh vegetables'],
    traditionalDishes: ['hummus', 'falafel', 'tabbouleh', 'greek salad'],
    mealPatterns: 'Mediterranean diet emphasizes plant-based foods, healthy fats, and moderate portions'
  },
  'East Asian': {
    preferredSpices: ['ginger', 'garlic', 'soy sauce', 'sesame oil'],
    commonIngredients: ['rice', 'noodles', 'tofu', 'vegetables'],
    traditionalDishes: ['stir-fry', 'noodle soups', 'steamed dishes'],
    mealPatterns: 'Balanced meals with rice/noodles, protein, and vegetables'
  }
};

// Health condition considerations
const HEALTH_CONSIDERATIONS = {
  'Diabetes': {
    monitorNutrients: ['carbohydrates', 'sugar', 'fiber'],
    mealTiming: 'Regular meal times are crucial',
    portionControl: 'Careful portion control for carbohydrates',
    requiresDisclaimer: true
  },
  'Hypertension': {
    monitorNutrients: ['sodium', 'potassium', 'magnesium'],
    avoid: ['excess salt', 'processed foods'],
    recommend: ['DASH diet principles', 'fresh whole foods'],
    requiresDisclaimer: true
  },
  'Heart Disease': {
    monitorNutrients: ['saturated fat', 'cholesterol', 'sodium'],
    recommend: ['lean proteins', 'whole grains', 'omega-3 rich foods'],
    avoid: ['trans fats', 'excessive salt'],
    requiresDisclaimer: true
  },
  'IBS': {
    individualTolerance: true,
    recommendFODMAPAwareness: true,
    mealTiming: 'Regular, smaller meals recommended',
    requiresDisclaimer: true
  }
};

// Helper function to get age-appropriate language level
const getLanguageLevel = (age) => {
  if (age <= 8) return 'simple';
  if (age <= 12) return 'intermediate';
  if (age <= 16) return 'teen';
  return 'adult';
};

// Helper function to get appropriate tone and style
const getToneAndStyle = (age, gender) => {
  if (age <= 8) {
    return {
      tone: 'friendly and encouraging',
      style: 'use simple words, short sentences, and fun examples'
    };
  }
  if (age <= 12) {
    return {
      tone: 'supportive and educational',
      style: 'explain concepts clearly, use relatable examples'
    };
  }
  if (age <= 16) {
    return {
      tone: 'respectful and informative',
      style: 'balance friendly tone with more detailed explanations'
    };
  }
  return {
    tone: 'professional and empathetic',
    style: 'provide comprehensive information with scientific context when relevant'
  };
};

// Helper function to safely handle personal information
const sanitizeProfile = (profile) => {
  if (!profile) return null;

  // Only expose necessary information
  const safeProfile = {
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    dietaryPreference: profile.dietaryPreference,
    allergies: Array.isArray(profile.allergies) ? [...profile.allergies] : [],
    healthGoals: Array.isArray(profile.healthGoals) ? [...profile.healthGoals] : [],
    healthConditions: Array.isArray(profile.healthConditions) ? [...profile.healthConditions] : [],
    cuisinePreferences: profile.cuisinePreferences ? {
      cuisines: Array.isArray(profile.cuisinePreferences.cuisines) ? 
        [...profile.cuisinePreferences.cuisines] : [],
      dislikes: Array.isArray(profile.cuisinePreferences.dislikes) ? 
        [...profile.cuisinePreferences.dislikes] : []
    } : { cuisines: [], dislikes: [] },
    fastingPlan: profile.fastingPlan ? {
      preset: profile.fastingPlan.preset || 'None',
      startTime: profile.fastingPlan.startTime,
      endTime: profile.fastingPlan.endTime,
      menstrualPhase: profile.gender === 'Female' ? profile.fastingPlan.menstrualPhase : null
    } : null,
    culturalPreferences: profile.culturalPreferences || []
  };

  // Validate age-appropriate fasting
  if (safeProfile.age < 18 && safeProfile.fastingPlan && safeProfile.fastingPlan.preset !== 'None') {
    safeProfile.fastingPlan = null; // Remove fasting plan for minors
  }

  // Ensure all strings are trimmed and sanitized
  Object.keys(safeProfile).forEach(key => {
    if (typeof safeProfile[key] === 'string') {
      safeProfile[key] = safeProfile[key].trim();
    }
  });

  return safeProfile;
};

// Helper function to get dietary safety instructions
const getDietarySafetyInstructions = (dietaryPreference, allergies, healthConditions) => {
  const instructions = [];

  // Add dietary restriction guidelines
  if (dietaryPreference && DIETARY_RESTRICTIONS[dietaryPreference]) {
    const restriction = DIETARY_RESTRICTIONS[dietaryPreference];
    instructions.push(`DIETARY RESTRICTION (${dietaryPreference.toUpperCase()}):`);
    instructions.push(`- Avoid: ${restriction.avoid.join(', ')}`);
    instructions.push(`- Check ingredients for: ${restriction.checkIngredients.join(', ')}`);
    instructions.push(`- ${restriction.reminder}`);
  }

  // Add allergy warnings
  if (allergies && allergies.length > 0) {
    instructions.push('\nALLERGY ALERTS:');
    instructions.push('- Emphasize allergy warnings in CAPS');
    instructions.push(`- Check for hidden sources of: ${allergies.join(', ')}`);
    instructions.push('- Recommend cross-contamination awareness');
  }

  // Add health condition considerations
  if (healthConditions && healthConditions.length > 0) {
    instructions.push('\nHEALTH CONSIDERATIONS:');
    healthConditions.forEach(condition => {
      if (HEALTH_CONSIDERATIONS[condition]) {
        const healthInfo = HEALTH_CONSIDERATIONS[condition];
        instructions.push(`\n${condition.toUpperCase()}:`);
        if (healthInfo.monitorNutrients) {
          instructions.push(`- Monitor: ${healthInfo.monitorNutrients.join(', ')}`);
        }
        if (healthInfo.avoid) {
          instructions.push(`- Avoid: ${healthInfo.avoid.join(', ')}`);
        }
        if (healthInfo.recommend) {
          instructions.push(`- Recommend: ${healthInfo.recommend.join(', ')}`);
        }
        if (healthInfo.requiresDisclaimer) {
          instructions.push('- Include medical consultation disclaimer');
        }
      }
    });
  }

  return instructions.join('\n');
};

// Helper function to get cultural considerations
const getCulturalConsiderations = (cuisinePreferences) => {
  if (!cuisinePreferences || !cuisinePreferences.cuisines) return '';

  const considerations = [];
  cuisinePreferences.cuisines.forEach(cuisine => {
    if (CULTURAL_CONSIDERATIONS[cuisine]) {
      const cultural = CULTURAL_CONSIDERATIONS[cuisine];
      considerations.push(`\n${cuisine.toUpperCase()} CULTURAL CONSIDERATIONS:`);
      considerations.push(`- Traditional Ingredients: ${cultural.commonIngredients.join(', ')}`);
      considerations.push(`- Common Spices: ${cultural.preferredSpices.join(', ')}`);
      considerations.push(`- Traditional Dishes: ${cultural.traditionalDishes.join(', ')}`);
      considerations.push(`- Meal Patterns: ${cultural.mealPatterns}`);
    }
  });

  return considerations.join('\n');
};

// Helper function to get personalized greeting templates
const getPersonalizedGreetings = (name, age) => {
  const greetings = {
    child: [
      `Hi ${name}! I'm excited to help you eat healthy and feel great!`,
      `Hello ${name}! Let's make eating healthy super fun!`,
      `Hey there ${name}! Ready to learn about yummy and healthy food?`
    ],
    teen: [
      `Hey ${name}! Let's talk about food that's both delicious and good for you!`,
      `Hi ${name}! Ready to explore some awesome nutrition tips?`,
      `Hello ${name}! Let's find ways to fuel your body and feel great!`
    ],
    adult: [
      `Hello ${name}! I'm here to help you with personalized nutrition advice.`,
      `Hi ${name}! Let's create a nutrition plan that works for your lifestyle.`,
      `Greetings ${name}! I'm ready to assist you with your nutrition goals.`
    ]
  };

  if (age <= 12) return greetings.child;
  if (age <= 19) return greetings.teen;
  return greetings.adult;
};

// Helper function to get personalized closing templates
const getPersonalizedClosings = (name, age) => {
  const closings = {
    child: [
      `Keep being awesome, ${name}! Remember to eat your colorful fruits and veggies! 🌈`,
      `You're doing great, ${name}! Every healthy choice makes you stronger! 💪`,
      `Have fun trying these healthy foods, ${name}! You're going to do amazing! ⭐`
    ],
    teen: [
      `Keep crushing your health goals, ${name}! You've got this! 💪`,
      `Stay awesome, ${name}! Looking forward to helping you on your health journey! 🌟`,
      `You're making great choices, ${name}! Keep it up! 🎯`
    ],
    adult: [
      `Wishing you success on your health journey, ${name}. Let me know if you need any clarification!`,
      `Here's to your health and wellness, ${name}. Feel free to ask any follow-up questions!`,
      `Take care, ${name}! I'm here to support your nutrition goals whenever you need guidance.`
    ]
  };

  if (age <= 12) return closings.child;
  if (age <= 19) return closings.teen;
  return closings.adult;
};

// Helper function to safely construct personalized prompt
const constructPersonalizedPrompt = (basePrompt, userProfile) => {
  if (!userProfile) return basePrompt;

  const safeProfile = sanitizeProfile(userProfile);
  if (!safeProfile) return basePrompt;

  const { tone, style } = getToneAndStyle(safeProfile.age, safeProfile.gender);
  const languageLevel = getLanguageLevel(safeProfile.age);

  const contextParts = [];
  
  // Add relevant context based on profile
  contextParts.push(`This advice is for ${safeProfile.name}, a ${safeProfile.age} year old ${safeProfile.gender.toLowerCase()}`);
  
  if (safeProfile.dietaryPreference) {
    contextParts.push(`who follows a ${safeProfile.dietaryPreference.toLowerCase()} diet`);
  }
  
  if (safeProfile.allergies.length > 0) {
    contextParts.push(`with important allergies to: ${safeProfile.allergies.join(', ')} (always emphasize allergy precautions)`);
  }

  if (safeProfile.healthConditions && safeProfile.healthConditions.length > 0) {
    contextParts.push(`and has the following health conditions: ${safeProfile.healthConditions.join(', ')}`);
  }
  
  if (safeProfile.healthGoals.length > 0) {
    contextParts.push(`with health goals including: ${safeProfile.healthGoals.join(', ')}`);
  }

  // Add cuisine preferences context
  if (safeProfile.cuisinePreferences.cuisines.length > 0) {
    contextParts.push(`\n${safeProfile.name}'s favorite cuisines: ${safeProfile.cuisinePreferences.cuisines.join(', ')}`);
  }
  if (safeProfile.cuisinePreferences.dislikes.length > 0) {
    contextParts.push(`${safeProfile.name} prefers to avoid: ${safeProfile.cuisinePreferences.dislikes.join(', ')}`);
  }

  // Add fasting window context if available and age-appropriate
  if (safeProfile.fastingPlan && safeProfile.fastingPlan.preset !== 'None' && safeProfile.age >= 18) {
    const fastingContext = [];
    fastingContext.push(`\n${safeProfile.name} follows a ${safeProfile.fastingPlan.preset} fasting pattern`);
    fastingContext.push(`with eating window from ${safeProfile.fastingPlan.startTime} to ${safeProfile.fastingPlan.endTime}`);
    
    if (safeProfile.gender === 'Female' && safeProfile.fastingPlan.menstrualPhase) {
      fastingContext.push(`currently in ${safeProfile.fastingPlan.menstrualPhase} phase`);
    }
    
    contextParts.push(fastingContext.join(' '));
  }

  const context = contextParts.join(' ');
  
  const ageAppropriateInstructions = {
    simple: 'Use simple words, short sentences, and fun examples. Explain things like you\'re talking to a young child. Include colorful food descriptions and make healthy eating sound exciting.',
    intermediate: 'Use clear explanations and relatable examples. Make it educational but fun. Include interesting facts about food and nutrition.',
    teen: 'Balance friendly tone with scientific explanations. Include relevant health facts and explain the "why" behind recommendations.',
    adult: 'Provide comprehensive information with scientific context where relevant. Maintain professional tone while being approachable.'
  };

  // Get dietary safety instructions
  const safetyInstructions = getDietarySafetyInstructions(
    safeProfile.dietaryPreference,
    safeProfile.allergies,
    safeProfile.healthConditions
  );

  // Get cultural considerations
  const culturalConsiderations = getCulturalConsiderations(safeProfile.cuisinePreferences);

  const greetings = getPersonalizedGreetings(safeProfile.name, safeProfile.age);
  const closings = getPersonalizedClosings(safeProfile.name, safeProfile.age);
  
  return `As a health and wellness expert, provide personalized advice for ${safeProfile.name}. Here is ${safeProfile.name}'s profile:

${context}

Question from ${safeProfile.name}: ${basePrompt}

COMMUNICATION STYLE:
- Tone: ${tone}
- Style: ${style}
- Language Level: ${languageLevel}
${ageAppropriateInstructions[languageLevel]}

PERSONALIZATION REQUIREMENTS:
- ALWAYS start with one of these greetings:
${greetings.map(g => `  "${g}"`).join('\n')}
- Use ${safeProfile.name}'s name at least 3 times in the response
- Make recommendations specific to ${safeProfile.name}'s profile
- ALWAYS end with one of these closings:
${closings.map(c => `  "${c}"`).join('\n')}

DIETARY AND HEALTH SAFETY:
${safetyInstructions}

CULTURAL CONSIDERATIONS:
${culturalConsiderations}

RESPONSE STRUCTURE:
1. MUST start with one of the provided greetings (no exceptions)
2. If any allergies or health conditions are mentioned, begin with relevant safety precautions
3. Address ${safeProfile.name} directly when providing main advice using ${languageLevel}-appropriate language
4. Include specific recommendations that consider:
   - Dietary preferences and restrictions
   - Cultural food preferences and traditions
   - Age-appropriate portions and preparations
   - Any mentioned health goals or conditions
5. If relevant, add timing considerations for meals/snacks
6. Include positive reinforcement and encouragement, using ${safeProfile.name}'s name
7. MUST end with one of the provided closings (no exceptions)

PERSONALIZATION CHECKLIST:
- ✓ Used greeting from provided templates
- ✓ Mentioned ${safeProfile.name}'s name at least 3 times
- ✓ Made recommendations specific to ${safeProfile.name}'s profile
- ✓ Used closing from provided templates

SAFETY REQUIREMENTS:
- ALWAYS emphasize allergy awareness first if relevant
- For users under 18, focus on regular, balanced meals (no fasting advice)
- Include reminders to consult parents/guardians for users under 18
- Avoid any extreme diet or exercise recommendations
- If any health conditions are mentioned, emphasize the importance of medical supervision
- Consider potential interactions between different dietary requirements
- Respect cultural and religious dietary practices

Remember to maintain a ${tone} tone while ensuring all advice is evidence-based and safe.

FINAL CHECK: Ensure the response starts with a greeting template and ends with a closing template using ${safeProfile.name}'s name.`;
};

const ModelBubble = ({ response }) => {
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

  const renderStars = (score) => {
    return [...Array(5)].map((_, index) => (
      index < score ? (
        <FaStar key={index} className="text-yellow-400 w-4 h-4" />
      ) : (
        <FaRegStar key={index} className="text-gray-300 w-4 h-4" />
      )
    ));
  };

  const handleThumbsUp = () => {
    // TODO: Implement feedback handling
    console.log('Thumbs up for response:', response.id);
  };

  const handleThumbsDown = () => {
    // TODO: Implement feedback handling
    console.log('Thumbs down for response:', response.id);
  };

  return (
    <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] rounded-lg border p-4 mb-4 ${getModelTheme(response.model)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`font-medium ${getModelHeaderTheme(response.model)}`}>
          {response.model}
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(response.timestamp), 'h:mm a')}
        </div>
      </div>
      
      <div className="text-gray-800 mb-3 whitespace-pre-wrap">
        {response.text}
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20">
        <div className="flex items-center">
          {renderStars(response.judgevalScore)}
        </div>
        <span className={`text-sm px-2 py-1 rounded ${
          response.judgevalLabel === 'Best Pick' 
            ? 'bg-green-100 text-green-700'
            : response.judgevalLabel === 'Too Generic'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
        }`}>
          {response.judgevalLabel}
        </span>
      </div>
      <JudgeScoreUI
        model={response.model}
        content={response.text}
        score={response.judgevalScore}
        label={response.judgevalLabel}
        isMotherlyTone={response.isMotherlyTone}
        onThumbsUp={handleThumbsUp}
        onThumbsDown={handleThumbsDown}
      />
    </div>
  );
};

const UserBubble = ({ message, isPersonalized }) => (
  <div className="flex justify-end mb-4">
    <div className="bg-indigo-600 text-white rounded-lg py-2 px-4 max-w-[85%] sm:max-w-[75%]">
      <div className="flex items-center gap-2 mb-1">
        {isPersonalized ? (
          <FaUser className="text-indigo-200" title="Personalized Response" />
        ) : (
          <FaUserSlash className="text-indigo-200" title="Generic Response" />
        )}
        <div className="text-xs text-indigo-200">
          {format(new Date(), 'h:mm a')}
        </div>
      </div>
      <div className="whitespace-pre-wrap">{message}</div>
    </div>
  </div>
);

const ChatWithMAAI = ({ userProfile, onSendQuery }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    adjustTextareaHeight();

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date().toISOString(),
      isPersonalized: !!userProfile
    }]);

    setIsLoading(true);

    try {
      // Construct personalized prompt if profile exists
      const personalizedPrompt = constructPersonalizedPrompt(userMessage, userProfile);

      const response = await fetch('/api/getLLMResponses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: personalizedPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add LLM responses to chat
      setMessages(prev => [
        ...prev,
        ...data.responses.map(response => ({
          type: 'llm',
          ...response,
          isPersonalized: !!userProfile,
          timestamp: new Date().toISOString()
        }))
      ]);

      // Call the callback if provided
      onSendQuery?.(userMessage);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg shadow-sm">
      {/* Profile indicator */}
      {userProfile && (
        <div className="bg-green-50 border-b border-green-100 p-2 rounded-t-lg">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FaUser />
            <span>Personalized responses enabled for {userProfile.name}</span>
          </div>
        </div>
      )}

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          message.type === 'user' ? (
            <UserBubble 
              key={index} 
              message={message.text} 
              isPersonalized={message.isPersonalized}
            />
          ) : message.type === 'llm' ? (
            <ModelBubble key={index} response={message} />
          ) : (
            <div key={index} className="text-center text-red-500 my-2">
              {message.text}
            </div>
          )
        ))}
        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={userProfile 
                ? `Ask me about health and wellness (personalized for ${userProfile.name})...`
                : "Ask me about health and wellness..."
              }
              className="w-full resize-none rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 min-h-[44px] max-h-[120px]"
              rows="1"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`px-4 py-2 rounded-lg flex items-center justify-center ${
              isLoading || !inputText.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWithMAAI; 