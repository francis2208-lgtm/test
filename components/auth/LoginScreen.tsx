import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const RssLogo: React.FC = () => (
    <div className="flex items-center justify-center">
        <div className="relative">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rss-green via-primary to-rss-cyan bg-clip-text text-transparent">
                Resourcestaff
            </h1>
            {/* Sparkles */}
            <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s', animationDuration: '3s' }}></span>
            <span className="absolute bottom-2 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></span>
            <span className="absolute top-0 left-[40%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></span>
            <span className="absolute bottom-1 right-12 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></span>
            <span className="absolute top-2 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.0s', animationDuration: '3.5s' }}></span>
            <span className="absolute bottom-0 left-[80%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }}></span>
        </div>
    </div>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('employee');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setError('');
      onLogin();
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-md m-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/30 animate-fadeInUp overflow-hidden">
        <div className="bg-light-card dark:bg-dark-card py-8 border-b border-light-border dark:border-dark-border">
            <RssLogo />
        </div>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-dark-text dark:text-shadow-sm dark:shadow-black/50">Employee Dashboard Login</h2>
            <form className="space-y-6 mt-6" onSubmit={handleLoginAttempt}>
            <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Username
                </label>
                <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-light-border dark:bg-dark-bg text-gray-800 dark:text-white border border-light-border dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.username"
                />
            </div>
            <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-light-border dark:bg-dark-bg text-gray-800 dark:text-white border border-light-border dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                />
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
            <div>
                <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 active:scale-100"
                >
                Sign in
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;