import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-5xl mb-4 block">⚡</span>
          <h1 className="text-4xl font-bold font-[Orbitron] bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            EduRank
          </h1>
          <p className="text-text-secondary mt-2 text-sm">Join the Academic Arena</p>
        </motion.div>

        <RegisterForm />
      </div>
    </div>
  );
}
