# AskMAAI

An AI-powered health and wellness advisor that provides personalized, culturally-sensitive nutrition guidance with real-time response quality evaluation using JudgeVal.

## Features

- **Multi-Model LLM Integration**: Parallel querying of Mistral, LLaMA2, and Gemma models via Ollama
- **JudgeVal-Powered Evaluation**: Real-time response quality assessment and scoring
- **Personalization**:
  - Age-appropriate communication
  - Cultural sensitivity
  - Dietary preferences
  - Health condition considerations
- **Safety First**:
  - Evidence-based validation
  - Dietary restriction checks
  - Health safety verification
  - Allergy awareness

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **LLM Integration**: Ollama
- **Response Evaluation**: JudgeVal
- **Upcoming**:
  - MongoDB for data persistence
  - Firebase Authentication
  - Domain-level deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Ollama installed locally
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ui
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd ui
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
askmaai/
├── server/           # Backend server
│   ├── index.js      # Main server file with Ollama integration
│   └── package.json  # Backend dependencies
└── ui/               # Frontend React application
    ├── src/
    │   ├── components/   # React components
    │   └── App.js       # Main App component
    └── package.json     # Frontend dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
