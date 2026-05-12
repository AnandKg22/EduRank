import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.loading);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result.success) {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-8 w-full max-w-md"
    >
      {/* Header — inside card */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-[Orbitron] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-text-secondary mt-2 text-sm">Enter the arena</p>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="edu-input"
            placeholder="fighter@edurank.io"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="edu-input pr-11"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829M17.657 17.657L21 21m-3.343-3.343l-2.829-2.829M9.878 9.878a3 3 0 104.243 4.243" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-7">
        <Button type="submit" fullWidth size="lg" loading={loading} id="login-btn">
          Enter Arena
        </Button>
      </div>

      {/* Link */}
      <p className="text-center text-sm text-text-secondary mt-5">
        New challenger?{' '}
        <Link to="/register" className="text-primary hover:text-primary-light font-semibold transition-colors">
          Register
        </Link>
      </p>
    </motion.form>
  );
}
