const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Enhanced evaluation function for health and wellness responses
const evaluateResponse = (response) => {
  const text = response.toLowerCase();
  
  // Criteria weights
  const weights = {
    scientific: 0.3,    // Scientific accuracy and evidence-based info
    practical: 0.25,    // Actionable advice
    safety: 0.25,       // Safety considerations
    empathy: 0.2        // Tone and presentation
  };

  // Scoring criteria
  const criteria = {
    scientific: {
      keywords: [
        'research shows', 'studies indicate', 'evidence suggests',
        'according to', 'scientifically', 'nutrient', 'hormone',
        'melatonin', 'tryptophan', 'protein', 'vitamins', 'minerals'
      ],
      multiplier: 2
    },
    practical: {
      keywords: [
        'try', 'consider', 'recommended', 'suggestion', 'option',
        'alternative', 'example', 'specifically', 'approximately',
        'serving', 'portion', 'timing', 'schedule', 'routine'
      ],
      multiplier: 1.5
    },
    safety: {
      keywords: [
        'consult', 'caution', 'avoid', 'limit', 'moderate',
        'safe', 'risk', 'warning', 'allergy', 'interaction',
        'side effect', 'recommended dose', 'maximum'
      ],
      multiplier: 2
    },
    empathy: {
      keywords: [
        'understand', 'help', 'support', 'feel', 'better',
        'improve', 'enhance', 'benefit', 'gentle', 'natural',
        'balance', 'wellness', 'healthy', 'lifestyle'
      ],
      multiplier: 1
    }
  };

  // Calculate scores for each criterion
  const scores = {};
  for (const [criterion, data] of Object.entries(criteria)) {
    const matches = data.keywords.filter(word => text.includes(word)).length;
    scores[criterion] = Math.min(5, (matches * data.multiplier) / 2);
  }

  // Calculate weighted average score
  const weightedScore = Object.entries(weights).reduce((total, [criterion, weight]) => {
    return total + (scores[criterion] * weight);
  }, 0);

  // Round to nearest 0.5
  const finalScore = Math.round(weightedScore * 2) / 2;

  // Determine label based on score and criteria balance
  let label = "Too Generic";
  if (finalScore >= 4 && scores.scientific >= 3 && scores.safety >= 3) {
    label = "Best Pick";
  } else if (finalScore >= 3 && (scores.scientific >= 2.5 || scores.practical >= 3)) {
    label = "Informative";
  }

  // Check for motherly tone based on empathy and safety
  const isMotherlyTone = scores.empathy >= 3 && scores.safety >= 2.5;

  return {
    score: Math.round(finalScore), // Round to nearest integer for display
    label,
    isMotherlyTone,
    details: {
      scientific: scores.scientific,
      practical: scores.practical,
      safety: scores.safety,
      empathy: scores.empathy
    }
  };
};

// Function to get response from Ollama model
const getOllamaResponse = async (model, prompt) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: `You are a health and wellness expert. Provide evidence-based, practical, and safe advice for the following question. Include specific examples and recommendations where appropriate: ${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          top_k: 50,
          top_p: 0.7,
          repeat_penalty: 1.1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed with status code: ${response.status}`);
    }

    const data = await response.json();
    const evaluation = evaluateResponse(data.response);
    
    return {
      model,
      text: data.response,
      judgevalScore: evaluation.score,
      judgevalLabel: evaluation.label,
      isMotherlyTone: evaluation.isMotherlyTone,
      details: evaluation.details,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error with ${model}:`, error);
    return null;
  }
};

app.post('/api/getLLMResponses', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get responses from different models
    const modelPromises = [
      getOllamaResponse('mistral', prompt),
      getOllamaResponse('llama2', prompt),
      getOllamaResponse('gemma', prompt)
    ];

    const responses = (await Promise.all(modelPromises)).filter(response => response !== null);

    if (responses.length === 0) {
      throw new Error('No models available');
    }

    res.json({ responses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
