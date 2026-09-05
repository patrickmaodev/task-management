import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await register({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.data?.message) {
        setErrors({ general: [err.response.data.message] });
      } else if (!err.response) {
        setErrors({ general: ['Unable to reach the server. Check that the API is running.'] });
      } else {
        setErrors({ general: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-emerald-500/10 p-3">
            <UserPlus size={32} className="text-emerald-500" />
          </div>
          <h2>Create Account</h2>
          <p>Join us to start managing your tasks</p>
        </div>

        {errors.general && (
          <div className="mb-6 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
            {errors.general[0]}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <div className="form-error">{errors.name[0]}</div>}
          </div>

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
            {errors.email && <div className="form-error">{errors.email[0]}</div>}
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
            {errors.password && <div className="form-error">{errors.password[0]}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              className="form-input"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn mt-4 flex w-full items-center justify-center gap-2 bg-emerald-500 py-3 hover:bg-emerald-600"
            disabled={isLoading}
          >
            {isLoading ? <div className="loader size-4 border-2 border-t-white" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
