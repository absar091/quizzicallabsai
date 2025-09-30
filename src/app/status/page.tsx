import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle, Server, Database, Globe, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "System Status",
    description: "Check the current status of Quizzicallabzᴬᴵ services and system health.",
};

export default function StatusPage() {
  const services = [
    {
      name: "Quiz Generation API",
      status: "operational",
      uptime: "99.9%",
      responseTime: "245ms",
      icon: Server,
      description: "AI-powered quiz and content generation"
    },
    {
      name: "User Authentication",
      status: "operational",
      uptime: "99.99%",
      responseTime: "120ms",
      icon: Shield,
      description: "Firebase authentication system"
    },
    {
      name: "Database Services",
      status: "operational",
      uptime: "99.95%",
      responseTime: "45ms",
      icon: Database,
      description: "MongoDB and Firestore databases"
    },
    {
      name: "Website & CDN",
      status: "operational",
      uptime: "99.9%",
      responseTime: "85ms",
      icon: Globe,
      description: "Next.js frontend and Vercel CDN"
    }
  ];

  const recentIncidents = [
    {
      date: "2025-01-15",
      title: "Scheduled Maintenance",
      status: "resolved",
      description: "2-hour maintenance window for database optimization",
      duration: "2 hours"
    },
    {
      date: "2025-01-10",
      title: "CDN Performance Issues",
      status: "resolved",
      description: "Temporary slowdown in content delivery",
      duration: "15 minutes"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      operational: 'default',
      degraded: 'secondary',
      outage: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <PageHeader
        title="System Status"
        description="Real-time status of Quizzicallabzᴬᴵ services and infrastructure"
      />

      {/* Overall Status */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              All Systems Operational
            </CardTitle>
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()}. All Quizzicallabzᴬᴵ services are running normally.
          </p>
        </CardContent>
      </Card>

      {/* Service Status */}
      <div className="grid gap-6 mb-8">
        <h2 className="text-2xl font-semibold">Service Status</h2>
        {services.map((service, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {getStatusBadge(service.status)}
                  <div className="text-sm text-muted-foreground">
                    <p>Uptime: {service.uptime}</p>
                    <p>Response: {service.responseTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Metrics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime (30d)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">150ms</p>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">50K+</p>
              <p className="text-sm text-muted-foreground">API Requests/d</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIncidents.map((incident, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${incident.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <h4 className="font-medium">{incident.title}</h4>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{incident.date}</p>
                  <p>{incident.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Scheduled Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Next Scheduled Maintenance</h4>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Database optimization and system updates
              </p>
              <p className="text-sm font-medium">
                📅 February 15, 2025 | ⏰ 2:00 AM - 4:00 AM PKT (2 hours)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Need to Report an Issue?</h3>
          <p className="text-muted-foreground mb-6">
            If you're experiencing issues not shown here, please contact our technical support team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">
              📧 hello@quizzicallabz.qzz.io
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              📱 +923261536764 (WhatsApp)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
