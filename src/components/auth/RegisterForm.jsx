import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../ui/Toast';
import { DEPARTMENTS } from '../../lib/constants';
import Button from '../ui/Button';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 3) {
      toast.warning('Username must be at least 3 characters');
      return;
    }
    const result = await signUp(email, password, username, department);
    if (result.success) {
      toast.success('Account created! Check your email to confirm.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
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
      {/* Header */}
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold font-[Orbitron] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Join EduRank
        </h2>
        <p className="text-text-secondary mt-2 text-sm">Create your fighter profile</p>
      </div>

      {/* Fields */}
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
            className="edu-input"
            placeholder="xXCoder_ProXx"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-text-secondary mb-1.5">
            Password
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
              className="edu-input pr-11"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="register-department" className="block text-sm font-medium text-text-secondary mb-1.5">
            Department
          </label>
          <div className="relative">
            <select
              id="register-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="edu-input edu-select"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-surface-light text-text-primary">
                  {dept}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-7">
        <Button type="submit" fullWidth size="lg" loading={loading} id="register-btn">
          Create Fighter Profile
        </Button>
      </div>

      {/* Link */}
      <p className="text-center text-sm text-text-secondary mt-5">
        Already a fighter?{' '}
        <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
          Login
        </Link>
      </p>
    </motion.form>
  );
}
