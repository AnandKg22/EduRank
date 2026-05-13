import { create } from 'zustand';
import { MATCH_CONFIG, BATTLE_STATUS } from '../lib/constants';
import { calculateAnswerPoints } from '../lib/utils';

/**
 * Enterprise Game Engine Store
 * Controls deterministic client telemetry arrays and real-time state syncing.
 */
export const useGameStore = create((set, get) => ({
  // ── State ──
  battleId: null,
  questions: [],
  currentQuestion: 0,
  myScore: 0,
  opponentScore: 0,
  myAnswers: [],
  opponentAnswers: [],
  timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
  status: null, 
  result: null, 
  eloDelta: 0,
  myAnswerSubmitted: false,
  opponentAnswerSubmitted: false,
  isHost: false,
  opponentName: '',
  opponentTier: '',
  isBotMatch: false,
  botMatch: false, // Legacy compatibility alias

  // ── Actions ──

  initBattle: ({ battleId, questions, isHost, opponentName, opponentTier, botMatch, isBotMatch }) => {
    const resolvedBotStatus = isBotMatch ?? botMatch ?? false;
    set({
      battleId,
      questions,
      currentQuestion: 0,
      myScore: 0,
      opponentScore: 0,
      myAnswers: [],
      opponentAnswers: [],
      timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
      status: BATTLE_STATUS.ACTIVE,
      result: null,
      eloDelta: 0,
      myAnswerSubmitted: false,
      opponentAnswerSubmitted: false,
      isHost,
      opponentName,
      opponentTier,
      isBotMatch: resolvedBotStatus,
      botMatch: resolvedBotStatus,
    });
  },

  submitAnswer: (answerIndex) => {
    const state = get();
    if (state.myAnswerSubmitted) return null;

    const question = state.questions[state.currentQuestion];
    const isCorrect = answerIndex === question.correct_answer;
    const points = calculateAnswerPoints(state.timeRemaining, isCorrect);

    const answer = {
      questionIndex: state.currentQuestion,
      answerIndex,
      isCorrect,
      points,
      timeRemaining: state.timeRemaining,
    };

    set({
      myScore: state.myScore + points,
      myAnswers: [...state.myAnswers, answer],
      myAnswerSubmitted: true,
    });

    return answer;
  },

  syncOpponentAnswer: (answer) => {
    const state = get();
    set({
      opponentScore: state.opponentScore + (answer.points || 0),
      opponentAnswers: [...state.opponentAnswers, answer],
      opponentAnswerSubmitted: true,
    });
  },

  nextQuestion: () => {
    const state = get();
    const next = state.currentQuestion + 1;

    if (next >= state.questions.length) {
      const result =
        state.myScore > state.opponentScore
          ? 'win'
          : state.myScore < state.opponentScore
            ? 'loss'
            : 'draw';
      set({ status: BATTLE_STATUS.FINISHED, result });
      return false; 
    }

    set({
      currentQuestion: next,
      timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
      myAnswerSubmitted: false,
      opponentAnswerSubmitted: false,
    });
    return true; 
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  handleForfeit: () => {
    set({
      status: BATTLE_STATUS.FORFEITED,
      result: 'forfeit_win',
    });
  },

  setEloDelta: (delta) => set({ eloDelta: delta }),

  reset: () =>
    set({
      battleId: null,
      questions: [],
      currentQuestion: 0,
      myScore: 0,
      opponentScore: 0,
      myAnswers: [],
      opponentAnswers: [],
      timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
      status: null,
      result: null,
      eloDelta: 0,
      myAnswerSubmitted: false,
      opponentAnswerSubmitted: false,
      isHost: false,
      opponentName: '',
      opponentTier: '',
      isBotMatch: false,
      botMatch: false,
    }),
}));

export default useGameStore;
