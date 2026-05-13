import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useMatchmakingStore } from '../stores/useMatchmakingStore';
import { usePresenceStore } from '../stores/usePresenceStore';
import { useBattleChannel } from '../hooks/useBattleChannel';
import { useCountdown } from '../hooks/useCountdown';
import { supabase } from '../services/supabase';
import { calculateElo } from '../lib/utils';
import { ACTIVITY_STATUS, BATTLE_STATUS, MATCH_CONFIG } from '../lib/constants';
import { BattleArena } from '../features/battle/components/BattleArena';
import { BattleResults } from '../features/battle/components/BattleResults';
import Spinner from '../components/ui/Spinner';

/**
 * Enterprise Distributed Combat Lifecycle Shell
 * Coordinates low-latency multi-tenant Broadcast streams with atomic persistence boundaries.
 */
export const BattlePage = () => {
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
  const isBotMatch = useGameStore((s) => s.isBotMatch);

  const { sendAnswer, sendReady, channel, opponentConnected } = useBattleChannel(battleId);
  const initRef = useRef(false);
  const [readyAcknowledged, setReadyAcknowledged] = useState(false);

  const bothConnected = isBotMatch || opponentConnected || readyAcknowledged;

  useEffect(() => {
    if (!channel || isBotMatch || bothConnected) return;

    const handleReady = (payload) => {
      if (payload.payload?.userId && payload.payload.userId !== user?.id) {
        setReadyAcknowledged(true);
      }
    };

    channel.on('broadcast', { event: 'ready' }, handleReady);

    const interval = setInterval(() => {
      if (!bothConnected && sendReady) {
        sendReady();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [channel, isBotMatch, bothConnected, sendReady, user?.id]);

  useEffect(() => {
    if (!battleId || !user || !opponent || initRef.current) return;
    initRef.current = true;

    const loadBattle = async () => {
      try {
        const resolvedOrgId = profile?.organization_id;

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
          // Select questions strictly filtered/scoped to the user's organization tier mapping
          let query = supabase.from('questions').select('*');
          if (resolvedOrgId) {
            query = query.eq('organization_id', resolvedOrgId);
          }

          const { data: qs } = await query.limit(200);

          if (qs && qs.length > 0) {
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
              isBotMatch: opponent.isBot || false,
            });
          }
        } else {
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
                  isBotMatch: opponent.isBot || false,
                });
                return;
              }
              retries++;
              await new Promise((r) => setTimeout(r, 500));
            }
            navigate('/');
          };

          if (battle.questions?.length > 0) {
            initBattle({
              battleId,
              questions: battle.questions,
              isHost: false,
              opponentName: opponent.username,
              opponentTier: opponent.elo_rating,
              isBotMatch: opponent.isBot || false,
            });
          } else {
            waitForQuestions();
          }
        }
      } catch (err) {
        console.error('Distributed arena handshake initialization failure:', err);
        navigate('/');
      }
    };

    loadBattle();
    updateStatus(ACTIVITY_STATUS.BATTLING);

    return () => {
      updateStatus(ACTIVITY_STATUS.IDLE);
    };
  }, [battleId, user?.id, profile?.organization_id]);

  const handleTimeUp = useCallback(() => {
    if (!myAnswerSubmitted) {
      const answer = submitAnswer(-1); 
      if (answer && sendAnswer) {
        sendAnswer(answer);
      }
    }
  }, [myAnswerSubmitted, submitAnswer, sendAnswer]);

  const { reset: resetTimer } = useCountdown(
    bothConnected && status === BATTLE_STATUS.ACTIVE && !myAnswerSubmitted,
    handleTimeUp
  );

  const handleAnswer = useCallback(
    (answerIndex) => {
      const answer = submitAnswer(answerIndex);
      if (answer && sendAnswer) {
        sendAnswer(answer);
      }
    },
    [submitAnswer, sendAnswer]
  );

  useEffect(() => {
    if (isBotMatch && status === BATTLE_STATUS.ACTIVE && !opponentAnswerSubmitted) {
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
  }, [isBotMatch, status, currentQuestion, opponentAnswerSubmitted]);

  useEffect(() => {
    if (myAnswerSubmitted && opponentAnswerSubmitted && status === BATTLE_STATUS.ACTIVE) {
      const timer = setTimeout(() => {
        const hasMore = nextQuestion();
        if (hasMore) {
          resetTimer();
        }
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [myAnswerSubmitted, opponentAnswerSubmitted, status]);

  useEffect(() => {
    if (result && user && profile) {
      const finalize = async () => {
        const gameState = useGameStore.getState();
        const opponentElo = opponent?.elo_rating || 1000;
        const score = result === 'win' || result === 'forfeit_win' ? 1 : result === 'draw' ? 0.5 : 0;
        const { deltaA } = calculateElo(profile.elo_rating, opponentElo, score);
        const actualDelta = isBotMatch ? Math.round(deltaA * 0.5) : deltaA; 

        setEloDelta(actualDelta);

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

        await supabase.rpc('update_tier', { p_user_id: user.id, p_elo: newElo });

        await supabase.from('match_history').insert({
          organization_id: profile.organization_id,
          battle_id: battleId,
          user_id: user.id,
          opponent_id: opponent?.id || null,
          opponent_name: opponent?.username || 'Bot',
          result,
          elo_change: actualDelta,
          score: gameState.myScore,
          opponent_score: gameState.opponentScore,
        });

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

        fetchProfile(user.id);
      };

      finalize();
    }
  }, [result]);

  if (!questions.length || status === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-text-secondary animate-pulse font-display">
            Preparing Battle Arena...
          </p>
        </div>
      </div>
    );
  }

  if (!bothConnected) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 glass p-8 rounded-2xl max-w-md mx-auto border border-primary/20">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-75" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
              ⚡
            </div>
          </div>
          <h3 className="text-xl font-bold font-display text-glow text-text-primary">
            Awaiting Opponent Connection
          </h3>
          <p className="text-sm text-text-secondary">
            Synchronizing live stream with <span className="text-primary font-semibold">{opponent?.username || 'Opponent'}</span>...
          </p>
        </div>
      </div>
    );
  }

  if (status === BATTLE_STATUS.FINISHED || status === BATTLE_STATUS.FORFEITED) {
    return <BattleResults />;
  }

  return (
    <div className="bg-gradient-battle min-h-[calc(100vh-theme(spacing.16)-theme(spacing.12))]">
      <BattleArena onAnswer={handleAnswer} />
    </div>
  );
};

export default BattlePage;
