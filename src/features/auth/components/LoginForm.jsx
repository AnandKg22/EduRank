import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';

/**
 * Enterprise Authorization Credentials Input Port
 * Captures verification state mapped to Multi-Tenant strategy token bounds.
 */
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const loading = useAuthStore((s) => s.isLoading);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result.success) {
      toast.error(result.error || 'Login verification failed.');
    } else {
      toast.success('Authentication cleared. Welcome back!');
      navigate('/');
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
      {/* Header Container */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-display text-primary">
          Welcome Back
        </h2>
        <p className="text-text-secondary mt-2 text-sm">Enter the combat arena</p>
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email Identity
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-surface px-4 py-3 rounded-xl border border-surface-lighter text-sm text-text-primary focus:outline-hidden focus:border-primary"
            placeholder="fighter@edurank.io"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1.5">
            Password Claim
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-surface px-4 py-3 rounded-xl border border-surface-lighter text-sm text-text-primary pr-11 focus:outline-hidden focus:border-primary"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition"
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
      </div>

      {/* Trigger */}
      <div className="mt-7">
        <Button type="submit" fullWidth size="lg" loading={loading} id="login-btn">
          Enter Arena
        </Button>
      </div>

      {/* Redirection */}
      <p className="text-center text-sm text-text-secondary mt-5">
        New challenger?{' '}
        <Link to="/register" className="text-primary hover:text-primary-light font-semibold transition">
          Register
        </Link>
      </p>
    </motion.form>
  );
};

export default LoginForm;
