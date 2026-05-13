import { motion } from 'framer-motion';
import { LoginForm } from '../features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Core Identity Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-5xl mb-4 block">⚡</span>
          <h1 className="text-4xl font-bold font-display text-primary">
            EduRank
          </h1>
          <p className="text-text-secondary mt-2 text-sm">Real-Time Academic Combat Arena</p>
        </motion.div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
