'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Clock, Trophy, Play, X, CheckCircle, AlertTriangle, Gamepad2, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type: string;
}

interface RoomData {
  roomId: string;
  hostId: string;
  started: boolean;
  finished: boolean;
  currentQuestion: number;
  quiz: QuizQuestion[];
  createdAt: any;
}

interface Player {
  userId: string;
  name: string;
  score: number;
  joinedAt: any;
}

export default function JoinRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setPlayerName(user.displayName || user.email?.split('@')[0] || 'Anonymous');
    }
  }, [user]);

  useEffect(() => {
    if (!roomCode) return;
    loadRoomData();
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode || !roomData) return;
    
    // Set up real-time listeners
    let cleanup: (() => void) | undefined;
    setupRoomListeners().then(cleanupFn => {
      cleanup = cleanupFn;
    }).catch(error => {
      console.error('Failed to setup room listeners:', error);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [roomCode, roomData]);

  const loadRoomData = async () => {
    try {
      setLoadingRoom(true);
      setError(null);

      const { firestore } = await import('@/lib/firebase');
      const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');

      // Get room data
      const roomRef = doc(firestore, 'quiz-rooms', roomCode);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        setError('Room not found or has expired');
        return;
      }

      const roomData = roomSnapshot.data() as RoomData;
      
      if (roomData.finished) {
        setError('This quiz has already finished');
        return;
      }

      setRoomData(roomData);

      // Load players
      const playersRef = collection(firestore, 'quiz-rooms', roomCode, 'players');
      const playersSnapshot = await getDocs(playersRef);
      
      const playersList: Player[] = [];
      playersSnapshot.forEach((doc) => {
        const playerData = doc.data();
        playersList.push({
          userId: doc.id,
          name: playerData.name || 'Unknown Player',
          score: playerData.score || 0,
          joinedAt: playerData.joinedAt
        });
      });

      setPlayers(playersList);

      // Check if current user has already joined
      if (user && playersList.some(p => p.userId === user.uid)) {
        setHasJoined(true);
      }

    } catch (error) {
      console.error('Error loading room:', error);
      setError('Failed to load room data');
    } finally {
      setLoadingRoom(false);
    }
  };

  const setupRoomListeners = async () => {
    try {
      const { QuizArena } = await import('@/lib/quiz-arena');
      
      // Listen to room state changes
      const unsubscribeRoom = QuizArena.Player.listenToRoom(
        roomCode,
        (data: RoomData | null) => {
          if (data) {
            setRoomData(data);
            
            // If quiz started, redirect to player view
            if (data.started && hasJoined) {
              router.push(`/quiz-arena/play/${roomCode}`);
            }
          }
        }
      );

      // Listen to player changes
      const unsubscribePlayers = QuizArena.Player.listenToLeaderboard(
        roomCode,
        (playersList: Player[]) => {
          setPlayers(playersList);
          
          // Check if current user is in the list
          if (user && playersList.some(p => p.userId === user.uid)) {
            setHasJoined(true);
          }
        }
      );

      return () => {
        unsubscribeRoom?.();
        unsubscribePlayers?.();
      };
    } catch (error) {
      console.error('Error setting up listeners:', error);
      return () => {};
    }
  };

  const handleJoinRoom = async () => {
    if (!user || !playerName.trim() || !roomData) return;

    setIsJoining(true);

    try {
      const { QuizArena } = await import('@/lib/quiz-arena');
      
      await QuizArena.Player.joinRoom(roomCode, user.uid, playerName.trim());
      
      setHasJoined(true);
      
      toast?.({
        title: 'Successfully Joined! 🎉',
        description: `Welcome to the battle, ${playerName}!`,
      });

    } catch (error: any) {
      console.error('Error joining room:', error);
      toast?.({
        title: 'Failed to Join',
        description: error.message || 'Could not join the room. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="max-w-md mx-4 border-slate-700 bg-slate-900/80 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading...</h2>
            <p className="text-slate-400">Preparing to join the battle</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="max-w-md mx-4 border-slate-700 bg-slate-900/80 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gamepad2 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Arena...</h2>
            <p className="text-slate-400">Connecting to room {roomCode}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="max-w-md mx-4 border-red-500/50 bg-slate-900/80 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Cannot Join Room</h2>
            <p className="text-slate-400 mb-6">{error || 'Room not found'}</p>
            <div className="space-y-3">
              <Button onClick={loadRoomData} variant="outline" className="w-full">
                Try Again
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/quiz-arena">Back to Quiz Arena</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">BATTLE ARENA: {roomCode}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join the Battle?
          </h1>
          
          <p className="text-slate-400 text-lg">
            {roomData.quiz.length} questions • {players.length} warriors ready
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Join Form */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="h-5 w-5 text-cyan-400" />
                Join Battle
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your warrior name and prepare for combat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {!hasJoined ? (
                <>
                  <div>
                    <Label htmlFor="playerName" className="text-cyan-400 font-medium">
                      Your Battle Name
                    </Label>
                    <Input
                      id="playerName"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name..."
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400 mt-2"
                      maxLength={20}
                    />
                  </div>

                  <Button
                    onClick={handleJoinRoom}
                    disabled={isJoining || !playerName.trim()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3"
                  >
                    {isJoining ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Joining Battle...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Join the Arena
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">You're In! 🎉</h3>
                  <p className="text-slate-400 mb-4">
                    Waiting for the host to start the battle...
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Ready to Fight
                  </Badge>
                </div>
              )}

              {/* Room Status */}
              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Battle Status</span>
                  <Badge variant={roomData.started ? "default" : "secondary"}>
                    {roomData.started ? "In Progress" : "Waiting"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Questions</span>
                    <span className="text-white">{roomData.quiz.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Warriors</span>
                    <span className="text-white">{players.length}</span>
                  </div>
                  {roomData.started && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Question</span>
                      <span className="text-white">{roomData.currentQuestion + 1}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players List */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Warriors ({players.length})
              </CardTitle>
              <CardDescription className="text-slate-400">
                Brave souls ready for battle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {players.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-slate-400">No warriors have joined yet</p>
                    <p className="text-slate-500 text-sm">Be the first to enter the arena!</p>
                  </div>
                ) : (
                  players.map((player, index) => (
                    <div 
                      key={player.userId} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-colors",
                        player.userId === user?.uid 
                          ? "bg-cyan-500/10 border-cyan-500/30" 
                          : "bg-slate-800/50 border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          index === 0 ? "bg-yellow-500 text-black" : "bg-slate-700 text-white"
                        )}>
                          {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {player.name}
                            {player.userId === user?.uid && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                            {player.userId === roomData.hostId && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
                                Host
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            Joined {new Date(player.joinedAt?.toDate?.() || player.joinedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{player.score}</div>
                        <div className="text-sm text-slate-400">points</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/quiz-arena">Back to Quiz Arena</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}