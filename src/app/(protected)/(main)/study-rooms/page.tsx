// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, BookOpen, Clock, Lock, Globe, Loader2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';

interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  description: string;
  hostId: string;
  hostName: string;
  participants: number;
  maxParticipants: number;
  isPublic: boolean;
  createdAt: Date;
  status: 'active' | 'in_session' | 'ended';
}

export default function StudyRoomsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadRooms();
  }, [user]);

  const loadRooms = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/study-rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error loading study rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = () => {
    setCreating(true);
    router.push('/study-rooms/create');
  };

  const joinRoom = async (roomId: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/study-rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: 'Joined room!',
          description: 'Redirecting to study room...',
        });
        router.push(`/study-rooms/${roomId}`);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to join room',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room',
        variant: 'destructive',
      });
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Study Rooms"
        description="Join or create collaborative study sessions with other learners"
      />

      <div className="mt-8 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search study rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={createRoom} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </>
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rooms</p>
                  <p className="text-3xl font-bold">
                    {rooms.filter((r) => r.status === 'active').length}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-3xl font-bold">
                    {rooms.reduce((sum, r) => sum + r.participants, 0)}
                  </p>
                </div>
                <Users className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Session</p>
                  <p className="text-3xl font-bold">
                    {rooms.filter((r) => r.status === 'in_session').length}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No study rooms found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a study room!
              </p>
              <Button onClick={createRoom}>
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{room.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {room.isPublic ? (
                          <Badge variant="secondary" className="gap-1">
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </Badge>
                        )}
                        <Badge variant="outline">{room.subject}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Host</span>
                      <span className="font-medium">{room.hostName}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants</span>
                      <span className="font-medium">
                        {room.participants} / {room.maxParticipants}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          room.status === 'active'
                            ? 'default'
                            : room.status === 'in_session'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {room.status === 'active'
                          ? 'Waiting'
                          : room.status === 'in_session'
                          ? 'In Session'
                          : 'Ended'}
                      </Badge>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => joinRoom(room.id)}
                      disabled={
                        room.participants >= room.maxParticipants ||
                        room.status === 'ended'
                      }
                    >
                      {room.participants >= room.maxParticipants
                        ? 'Room Full'
                        : room.status === 'ended'
                        ? 'Ended'
                        : 'Join Room'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}