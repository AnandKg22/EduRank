import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToast } from '../../../components/ui/Toast';
import { DEPARTMENTS } from '../../../lib/constants';
import { Button } from '../../../components/ui/Button';

/**
 * Enterprise Fighter Registration Form
 * Provisions scoped multi-tenant claims arrays alongside metadata binding signatures.
 */
export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.isLoading);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast.warning('Battle Tag must contain at least 3 display characters.');
      return;
    }
    const result = await signUp(email.trim(), password, username.trim(), department);
    if (result.success) {
      toast.success('Profile configured successfully! Welcome aboard.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Identity initialization failed.');
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
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold font-display text-primary">
          Join EduRank
        </h2>
        <p className="text-text-secondary mt-2 text-sm">Create your combat identity</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label htmlFor="register-username" className="block text-sm font-medium text-text-secondary mb-1.5">
            Battle Tag
          </label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            autoComplete="username"
            className="w-full bg-surface px-4 py-3 rounded-xl border border-surface-lighter text-sm text-text-primary focus:outline-hidden focus:border-primary"
            placeholder="xXCoder_ProXx"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email Identity
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-text-secondary mb-1.5">
            Password Signature
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
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

        <div>
          <label htmlFor="register-department" className="block text-sm font-medium text-text-secondary mb-1.5">
            Academic Pillar (Department)
          </label>
          <select
            id="register-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-surface px-4 py-3 rounded-xl border border-surface-lighter text-sm text-text-primary focus:outline-hidden focus:border-primary appearance-none cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-surface-card text-text-primary">
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trigger */}
      <div className="mt-7">
        <Button type="submit" fullWidth size="lg" loading={loading} id="register-btn">
          Create Fighter Profile
        </Button>
      </div>

      {/* Redirection */}
      <p className="text-center text-sm text-text-secondary mt-5">
        Already a fighter?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition">
          Login
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
