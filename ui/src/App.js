import './App.css';
import UserProfileSetup from './components/UserProfileSetup';
import DailyDashboard from './components/DailyDashboard';
import ChatWithMAAI from './components/ChatWithMAAI';

function App() {
  const handleChatQuery = (prompt) => {
    console.log('Chat query:', prompt);
    // Additional handling if needed
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Family Health Profile Manager</h1>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <UserProfileSetup />
          <DailyDashboard />
        </div>
        <div className="mt-6">
          <ChatWithMAAI onSendQuery={handleChatQuery} />
        </div>
      </main>
    </div>
  );
}

export default App;
