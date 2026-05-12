import { motion } from 'framer-motion';
import useGameStore from '../../stores/useGameStore';
import QuestionCard from './QuestionCard';
import TimerBar from './TimerBar';
import ScoreBoard from './ScoreBoard';
import OpponentStatus from './OpponentStatus';

/**
 * BattleArena — Main battle view container.
 */
export default function BattleArena({ onAnswer }) {
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const questions = useGameStore((s) => s.questions);
  const myAnswerSubmitted = useGameStore((s) => s.myAnswerSubmitted);

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Board */}
      <ScoreBoard />

      {/* Timer */}
      <TimerBar />

      {/* Question Counter */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <OpponentStatus />
      </div>

      {/* Question */}
      <QuestionCard
        question={question}
        onAnswer={onAnswer}
        disabled={myAnswerSubmitted}
      />
    </div>
  );
}
