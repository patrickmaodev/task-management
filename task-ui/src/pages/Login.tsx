import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="glass-panel p-8 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-500/10 p-3 rounded-full mb-4">
            <LogIn size={32} className="text-blue-500" color="#3b82f6" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {isLoading ? <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};
