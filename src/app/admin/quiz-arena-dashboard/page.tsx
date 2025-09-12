'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Users, User, Gamepad2, Clock, AlertCircle, CheckCircle, XCircle, Eye, Ban, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock data for demonstration - replace with real Firebase data
const mockActiveRooms = [
  {
    id: 'ABC123',
    hostId: 'user123',
    hostName: 'Dr. Smith',
    playerCount: 8,
    maxPlayers: 10,
    status: 'active',
    startedAt: Date.now() - 300000,
    questionCount: 15,
    securityAlerts: 0
  },
  {
    id: 'XYZ789',
    hostId: 'user456',
    hostName: 'Prof. Johnson',
    playerCount: 3,
    maxPlayers: 20,
    status: 'waiting',
    startedAt: Date.now() - 120000,
    questionCount: 10,
    securityAlerts: 1
  }
];

const mockSecurityLogs = [
  {
    id: '1',
    type: 'ANSWER_SPAM_DETECTED',
    severity: 'HIGH',
    userId: 'user123',
    roomId: 'ABC123',
    details: 'Multiple submissions for same question',
    timestamp: Date.now() - 60000
  },
  {
    id: '2',
    type: 'ROOM_SHUTDOWN',
    severity: 'MEDIUM',
    userId: 'admin',
    roomId: 'OLD123',
    details: 'Expired room cleaned up',
    timestamp: Date.now() - 180000
  }
];

const mockStats = {
  totalRooms: 247,
  activeRooms: 89,
  totalPlayers: 1243,
  securityAlerts: 12,
  questionsGenerated: 15234,
  uptime: '99.8%'
};

export default function AdminQuizArenaDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // In a real implementation, you'd check if user is admin
  const isAdmin = user?.uid === 'admin-user-id'; // Replace with real admin check

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    // Load real-time data here
    loadDashboardData();
  }, [user, isAdmin]);

  const loadDashboardData = async () => {
    // Replace with real Firebase queries
    console.log('Loading dashboard data...');
  };

  const handleEmergencyShutdown = async (roomId: string) => {
    if (!confirm(`Are you sure you want to emergency shutdown room ${roomId}?`)) return;

    try {
      // In real implementation, call Firebase Cloud Function
      toast?.({
        title: 'Room Shutdown Initiated',
        description: `Emergency shutdown of room ${roomId} in progress...`,
      });

      // Mock implementation
      toast?.({
        title: 'Room Shutdown Complete',
        description: `Room ${roomId} has been safely shutdown.`,
      });
    } catch (error) {
      toast?.({
        title: 'Shutdown Failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSendWarning = async (userId: string, roomId: string) => {
    try {
      // In real implementation, send warning via Firebase
      toast?.({
        title: 'Warning Sent',
        description: `Warning issued to user ${userId}`,
      });
    } catch (error) {
      toast?.({
        title: 'Warning Failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Administrator privileges required</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🛡️ Quiz Arena Admin Dashboard</h1>
            <p className="text-slate-400">Monitor and manage your live quiz platform</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-500/10 text-green-400">
              System Status: <span className="font-bold">{mockStats.uptime}</span>
            </Badge>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Security Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gamepad2 className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{mockStats.totalRooms}</div>
                  <div className="text-sm text-slate-400">Total Rooms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{mockStats.activeRooms}</div>
                  <div className="text-sm text-slate-400">Active Rooms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-white">{mockStats.totalPlayers}</div>
                  <div className="text-sm text-slate-400">Total Players</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-slate-800 border-slate-700 ${mockStats.securityAlerts > 0 ? 'border-red-500/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className={`w-8 h-8 mr-3 ${mockStats.securityAlerts > 0 ? 'text-red-400' : 'text-green-400'}`} />
                <div>
                  <div className="text-2xl font-bold text-white">{mockStats.securityAlerts}</div>
                  <div className="text-sm text-slate-400">Security Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Active Rooms</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Activity */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSecurityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded">
                        <div className={`w-2 h-2 rounded-full mt-2 ${log.severity === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <div className="flex-1">
                          <div className="font-medium text-white">{log.type}</div>
                          <div className="text-sm text-slate-400">{log.details}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription>Current platform status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Firebase Functions</span>
                    <Badge className="bg-green-500/10 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Firestore</span>
                    <Badge className="bg-green-500/10 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Realtime Database</span>
                    <Badge className="bg-yellow-500/10 text-yellow-400">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Issues
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cloud Functions</span>
                    <Badge className="bg-green-500/10 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Room Management</CardTitle>
                <CardDescription>Monitor and control live quiz sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400">Room ID</TableHead>
                      <TableHead className="text-slate-400">Host</TableHead>
                      <TableHead className="text-slate-400">Players</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Security</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActiveRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-mono text-white">{room.id}</TableCell>
                        <TableCell className="text-white">{room.hostName}</TableCell>
                        <TableCell className="text-white">{room.playerCount}/{room.maxPlayers}</TableCell>
                        <TableCell>
                          <Badge variant={room.status === 'active' ? 'default' : 'secondary'}>
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={room.securityAlerts > 0 ? 'destructive' : 'secondary'}>
                            {room.securityAlerts > 0 ?
                              `${room.securityAlerts} alerts` :
                              'Clean'
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRoom(room.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendWarning('all', room.id)}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleEmergencyShutdown(room.id)}
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Dashboard</CardTitle>
                <CardDescription>Monitor and respond to security events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400">Event Type</TableHead>
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Room</TableHead>
                      <TableHead className="text-slate-400">Severity</TableHead>
                      <TableHead className="text-slate-400">Time</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSecurityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium text-white">{log.type}</TableCell>
                        <TableCell className="font-mono text-white">{log.userId}</TableCell>
                        <TableCell className="font-mono text-white">{log.roomId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={log.severity === 'HIGH' ? 'destructive' : 'secondary'}
                            className={log.severity === 'HIGH' ? 'bg-red-500/10 text-red-400' : ''}
                          >
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendWarning(log.userId, log.roomId)}
                          >
                            Warn User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quiz Performance</CardTitle>
                  <CardDescription>Completion rates and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Quizzes Generated</span>
                      <span className="text-white font-bold">{mockStats.questionsGenerated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Quiz Duration</span>
                      <span className="text-white font-bold">12.5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Completion Rate</span>
                      <span className="text-green-400 font-bold">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Player Retention</span>
                      <span className="text-blue-400 font-bold">94.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Topics</CardTitle>
                  <CardDescription>Most popular quiz categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { topic: 'Mathematics', count: 1247 },
                      { topic: 'Science', count: 892 },
                      { topic: 'History', count: 756 },
                      { topic: 'Literature', count: 634 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white">{item.topic}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(item.count / 1300) * 100}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
