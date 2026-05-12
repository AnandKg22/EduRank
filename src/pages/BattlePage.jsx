import { useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGameStore from '../stores/useGameStore';
import useAuthStore from '../stores/useAuthStore';
import useMatchmakingStore from '../stores/useMatchmakingStore';
import usePresenceStore from '../stores/usePresenceStore';
import useBattleChannel from '../hooks/useBattleChannel';
import useCountdown from '../hooks/useCountdown';
import { supabase } from '../lib/supabaseClient';
import { calculateElo } from '../lib/utils';
import { ACTIVITY_STATUS, BATTLE_STATUS, MATCH_CONFIG } from '../lib/constants';
import BattleArena from '../components/battle/BattleArena';
import BattleResults from '../components/battle/BattleResults';
import Spinner from '../components/ui/Spinner';

/**
 * BattlePage — Orchestrates the entire battle lifecycle.
 */
export default function BattlePage() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const opponent = useMatchmakingStore((s) => s.opponent);
  const updateStatus = usePresenceStore((s) => s.updateStatus);

  const status = useGameStore((s) => s.status);
  const result = useGameStore((s) => s.result);
  const questions = useGameStore((s) => s.questions);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const myAnswerSubmitted = useGameStore((s) => s.myAnswerSubmitted);
  const opponentAnswerSubmitted = useGameStore((s) => s.opponentAnswerSubmitted);
  const initBattle = useGameStore((s) => s.initBattle);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const nextQuestion = useGameStore((s) => s.nextQuestion);
  const setEloDelta = useGameStore((s) => s.setEloDelta);
  const botMatch = useGameStore((s) => s.botMatch);

  const { sendAnswer, sendReady } = useBattleChannel(battleId);
  const initRef = useRef(false);

  // ── Initialize Battle ──
  useEffect(() => {
    if (!battleId || !user || !opponent || initRef.current) return;
    initRef.current = true;

    const loadBattle = async () => {
      try {
        // Determine if host (player_a)
        const { data: battle } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single();

        if (!battle) {
          navigate('/');
          return;
        }

        const isHost = battle.player_a === user.id;

        if (isHost && (!battle.questions || battle.questions.length === 0)) {
          // Host generates questions
          const { data: qs } = await supabase
            .from('questions')
            .select('*')
            .limit(200);

          if (qs && qs.length > 0) {
            // Shuffle and pick
            const shuffled = qs.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, MATCH_CONFIG.QUESTIONS_PER_MATCH);

            await supabase
              .from('battles')
              .update({
                questions: selected,
                status: 'active',
                started_at: new Date().toISOString(),
              })
              .eq('id', battleId);

            initBattle({
              battleId,
              questions: selected,
              isHost: true,
              opponentName: opponent.username,
              opponentTier: opponent.elo_rating,
              botMatch: opponent.isBot || false,
            });
          }
        } else {
          // Joiner — wait for questions or they are already there
          const waitForQuestions = async () => {
            let retries = 0;
            while (retries < 20) {
              const { data: b } = await supabase
                .from('battles')
                .select('questions, status')
                .eq('id', battleId)
                .single();

              if (b?.questions?.length > 0) {
                initBattle({
                  battleId,
                  questions: b.questions,
                  isHost: false,
                  opponentName: opponent.username,
                  opponentTier: opponent.elo_rating,
                  botMatch: opponent.isBot || false,
                });
                return;
              }
              retries++;
              await new Promise((r) => setTimeout(r, 500));
            }
            // Timeout — go back
            navigate('/');
          };

          if (battle.questions?.length > 0) {
            initBattle({
              battleId,
              questions: battle.questions,
              isHost: false,
              opponentName: opponent.username,
              opponentTier: opponent.elo_rating,
              botMatch: opponent.isBot || false,
            });
          } else {
            waitForQuestions();
          }
        }
      } catch (err) {
        console.error('Battle init error:', err);
        navigate('/');
      }
    };

    loadBattle();
    updateStatus(ACTIVITY_STATUS.BATTLING);

    return () => {
      updateStatus(ACTIVITY_STATUS.IDLE);
    };
  }, [battleId, user?.id]);

  // ── Handle auto-submit on timer expiry ──
  const handleTimeUp = useCallback(() => {
    if (!myAnswerSubmitted) {
      const answer = submitAnswer(-1); // -1 = no answer (wrong)
      if (answer && sendAnswer) {
        sendAnswer(answer);
      }
    }
  }, [myAnswerSubmitted, submitAnswer, sendAnswer]);

  const { reset: resetTimer } = useCountdown(
    status === BATTLE_STATUS.ACTIVE && !myAnswerSubmitted,
    handleTimeUp
  );

  // ── Handle answer submission ──
  const handleAnswer = useCallback(
    (answerIndex) => {
      const answer = submitAnswer(answerIndex);
      if (answer && sendAnswer) {
        sendAnswer(answer);
      }
    },
    [submitAnswer, sendAnswer]
  );

  // ── Auto Bot Answer Hook ──
  useEffect(() => {
    if (botMatch && status === BATTLE_STATUS.ACTIVE && !opponentAnswerSubmitted) {
      // Schedule bot answer between 1.5s and 5s
      const botDelay = 1500 + Math.random() * 3500;
      const timer = setTimeout(() => {
        const gameState = useGameStore.getState();
        if (!gameState.opponentAnswerSubmitted && gameState.status === BATTLE_STATUS.ACTIVE) {
          const q = gameState.questions[gameState.currentQuestion];
          if (!q) return;
          const botCorrectChance = 0.70;
          const botAnswer = Math.random() < botCorrectChance
            ? q.correct_answer
            : Math.floor(Math.random() * 4);
          const botTimeRemaining = Math.max(1, 15 - Math.floor(botDelay / 1000));
          const isCorrect = botAnswer === q.correct_answer;
          const points = isCorrect ? 100 + Math.round(botTimeRemaining * 3) : 0;

          useGameStore.getState().syncOpponentAnswer({
            questionIndex: gameState.currentQuestion,
            answerIndex: botAnswer,
            isCorrect,
            points,
            timeRemaining: botTimeRemaining,
          });
        }
      }, botDelay);

      return () => clearTimeout(timer);
    }
  }, [botMatch, status, currentQuestion, opponentAnswerSubmitted]);

  // ── Progress to next question when both players have answered ──
  useEffect(() => {
    if (myAnswerSubmitted && opponentAnswerSubmitted && status === BATTLE_STATUS.ACTIVE) {
      const timer = setTimeout(() => {
        const hasMore = nextQuestion();
        if (hasMore) {
          resetTimer();
        }
      }, 1500); // Brief pause to show answer results
      return () => clearTimeout(timer);
    }
  }, [myAnswerSubmitted, opponentAnswerSubmitted, status]);

  // ── Finalize battle on finish ──
  useEffect(() => {
    if (result && user && profile) {
      const finalize = async () => {
        const gameState = useGameStore.getState();
        const opponentElo = opponent?.elo_rating || 1000;
        const score = result === 'win' || result === 'forfeit_win' ? 1 : result === 'draw' ? 0.5 : 0;
        const { deltaA } = calculateElo(profile.elo_rating, opponentElo, score);
        const actualDelta = botMatch ? Math.round(deltaA * 0.5) : deltaA; // Reduced ELO for bot matches

        setEloDelta(actualDelta);

        // Update profile
        const newElo = Math.max(0, profile.elo_rating + actualDelta);
        await supabase
          .from('profiles')
          .update({
            elo_rating: newElo,
            wins: result === 'win' || result === 'forfeit_win' ? profile.wins + 1 : profile.wins,
            losses: result === 'loss' ? profile.losses + 1 : profile.losses,
            draws: result === 'draw' ? profile.draws + 1 : profile.draws,
            total_matches: profile.total_matches + 1,
          })
          .eq('id', user.id);

        // Update tier
        await supabase.rpc('update_tier', { p_user_id: user.id, p_elo: newElo });

        // Write match history
        await supabase.from('match_history').insert({
          battle_id: battleId,
          user_id: user.id,
          opponent_id: opponent?.id || null,
          opponent_name: opponent?.username || 'Bot',
          result,
          elo_change: actualDelta,
          score: gameState.myScore,
          opponent_score: gameState.opponentScore,
        });

        // Update battle record
        await supabase
          .from('battles')
          .update({
            status: 'finished',
            score_a: gameState.myScore,
            score_b: gameState.opponentScore,
            winner: result === 'win' || result === 'forfeit_win' ? user.id : null,
            elo_delta_a: actualDelta,
            finished_at: new Date().toISOString(),
          })
          .eq('id', battleId);

        // Refresh profile
        fetchProfile(user.id);
      };

      finalize();
    }
  }, [result]);

  // ── Loading state ──
  if (!questions.length || status === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-text-secondary animate-pulse font-[Orbitron]">
            Preparing Battle Arena...
          </p>
        </div>
      </div>
    );
  }

  // ── Results screen ──
  if (status === BATTLE_STATUS.FINISHED || status === BATTLE_STATUS.FORFEITED) {
    return <BattleResults />;
  }

  // ── Active battle ──
  return (
    <div className="bg-gradient-battle min-h-[calc(100vh-theme(spacing.16)-theme(spacing.12))]">
      <BattleArena onAnswer={handleAnswer} />
    </div>
  );
}
