'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Clock, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  uid: string;
  displayName: string;
  photoURL?: string;
  joinedAt: number;
  isHost: boolean;
}

interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  description: string;
  hostId: string;
  hostName: string;
  participants: number;
  maxParticipants: number;
  participantsList: Record<string, Participant>;
  status: string;
  createdAt: number;
}

export default function StudyRoomSessionPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (!user || !roomId) return;

    loadRoom();

    // Start session timer
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [user, roomId]);

  const loadRoom = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/study-rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoom(data.room);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load room',
          variant: 'destructive',
        });
        router.push('/study-rooms');
      }
    } catch (error) {
      console.error('Error loading room:', error);
    } finally {
      setLoading(false);
    }
  };

  const leaveRoom = async () => {
    try {
      const token = await user?.getIdToken();
      await fetch(`/api/study-rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Left room',
        description: 'You have left the study room',
      });
      router.push('/study-rooms');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Room Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This study room does not exist or has been deleted.
            </p>
            <Link href="/study-rooms">
              <Button>Back to Study Rooms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const participants = Object.values(room.participantsList || {});
  const isHost = user?.uid === room.hostId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/study-rooms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Rooms
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{room.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{room.subject}</Badge>
                    <Badge variant="outline">{room.status}</Badge>
                  </div>
                </div>
                {isHost && (
                  <Badge className="gap-1">
                    <Crown className="h-3 w-3" />
                    Host
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{room.description}</p>

              {/* Session Timer */}
              <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Study Session Time</p>
                  <p className="text-2xl font-bold">{formatTime(sessionTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Content Area */}
          <Card>
            <CardHeader>
              <CardTitle>Study Space</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  This is your collaborative study space. Features coming soon:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left">
                  <li>• Shared flashcards and notes</li>
                  <li>• Real-time collaborative quizzes</li>
                  <li>• Whiteboard for problem solving</li>
                  <li>• Voice/video chat integration</li>
                  <li>• Study progress tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({participants.length}/{room.maxParticipants})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.uid}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={participant.photoURL} />
                      <AvatarFallback>
                        {participant.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{participant.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.isHost ? 'Host' : 'Participant'}
                      </p>
                    </div>
                    {participant.isHost && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={leaveRoom}
              >
                Leave Room
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}