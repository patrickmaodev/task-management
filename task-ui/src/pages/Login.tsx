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
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (!err.response) {
        setError('Unable to reach the server. Check that the API is running.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-3">
            <LogIn size={32} className="text-blue-500" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
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
            className="btn btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3"
            disabled={isLoading}
          >
            {isLoading ? <div className="loader size-4 border-2" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 no-underline hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
