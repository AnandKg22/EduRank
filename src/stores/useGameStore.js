import { create } from 'zustand';
import { MATCH_CONFIG, BATTLE_STATUS } from '../lib/constants';
import { calculateAnswerPoints } from '../lib/utils';

/**
 * Game Store — Manages active battle state, scores, and question progression.
 */
const useGameStore = create((set, get) => ({
  // ── State ──
  battleId: null,
  questions: [],
  currentQuestion: 0,
  myScore: 0,
  opponentScore: 0,
  myAnswers: [],
  opponentAnswers: [],
  timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
  status: null, // preparing | active | finished | forfeited
  result: null, // win | loss | draw | forfeit_win
  eloDelta: 0,
  myAnswerSubmitted: false,
  opponentAnswerSubmitted: false,
  isHost: false,
  opponentName: '',
  opponentTier: '',
  botMatch: false,

  // ── Actions ──

  /**
   * Initialize a new battle.
   */
  initBattle: ({ battleId, questions, isHost, opponentName, opponentTier, botMatch }) => {
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
      botMatch: botMatch || false,
    });
  },

  /**
   * Submit the player's answer for the current question.
   */
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

  /**
   * Record the opponent's answer (received via broadcast).
   */
  syncOpponentAnswer: (answer) => {
    const state = get();
    set({
      opponentScore: state.opponentScore + (answer.points || 0),
      opponentAnswers: [...state.opponentAnswers, answer],
      opponentAnswerSubmitted: true,
    });
  },

  /**
   * Move to the next question. Called after both players have answered.
   */
  nextQuestion: () => {
    const state = get();
    const next = state.currentQuestion + 1;

    if (next >= state.questions.length) {
      // Battle finished
      const result =
        state.myScore > state.opponentScore
          ? 'win'
          : state.myScore < state.opponentScore
            ? 'loss'
            : 'draw';
      set({ status: BATTLE_STATUS.FINISHED, result });
      return false; // no more questions
    }

    set({
      currentQuestion: next,
      timeRemaining: MATCH_CONFIG.SECONDS_PER_QUESTION,
      myAnswerSubmitted: false,
      opponentAnswerSubmitted: false,
    });
    return true; // more questions
  },

  /**
   * Set the time remaining (called by timer hook).
   */
  setTimeRemaining: (time) => set({ timeRemaining: time }),

  /**
   * Handle forfeit — opponent disconnected.
   */
  handleForfeit: () => {
    set({
      status: BATTLE_STATUS.FORFEITED,
      result: 'forfeit_win',
    });
  },

  /**
   * Set the ELO delta after finalization.
   */
  setEloDelta: (delta) => set({ eloDelta: delta }),

  /**
   * Reset the game store.
   */
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
      botMatch: false,
    }),
}));

export default useGameStore;
