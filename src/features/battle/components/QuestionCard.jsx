import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const optionLabels = ['A', 'B', 'C', 'D'];

/**
 * Isolated Combat Choice Grid Component
 * Dispatches immutable selection events to game stores.
 */
export const QuestionCard = ({ question, onAnswer, disabled }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question?.question_text]);

  const handleSelect = (index) => {
    if (disabled || selected !== null) return;
    setSelected(index);
    setRevealed(true);
    onAnswer(index);
  };

  return (
    <motion.div
      key={question?.question_text}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Question */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold">
            {question.subject}
          </span>
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-surface-lighter text-text-muted text-xs">
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mt-4 leading-relaxed">
          {question.question_text}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correct_answer;
          const isSelected = selected === i;
          let optionClass = 'glass hover:bg-surface-light/80 border-transparent hover:border-primary/30';

          if (revealed) {
            if (isCorrect) {
              optionClass = 'bg-success/15 border-success/50 glow-success';
            } else if (isSelected && !isCorrect) {
              optionClass = 'bg-danger/15 border-danger/50 glow-danger';
            } else {
              optionClass = 'glass opacity-50';
            }
          }

          return (
            <motion.button
              key={i}
              whileHover={!disabled && selected === null ? { scale: 1.02 } : {}}
              whileTap={!disabled && selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={disabled || selected !== null}
              className={`
                flex items-center gap-3 p-4 rounded-xl border
                text-left transition-all duration-300 cursor-pointer
                disabled:cursor-not-allowed
                ${optionClass}
              `}
            >
              <span className="shrink-0 w-8 h-8 rounded-lg bg-surface-lighter/80 flex items-center justify-center text-sm font-bold text-text-secondary">
                {optionLabels[i]}
              </span>
              <span className="text-sm font-medium text-text-primary">{option}</span>

              {revealed && isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-success text-lg"
                >
                  ✓
                </motion.span>
              )}
              {revealed && isSelected && !isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-danger text-lg"
                >
                  ✕
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
