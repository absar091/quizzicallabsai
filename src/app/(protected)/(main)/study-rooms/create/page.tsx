// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const SUBJECTS = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English',
  'Computer Science', 'Economics', 'Accounting', 'History',
  'Islamic Studies', 'Pakistan Studies', 'General Knowledge', 'Other'
];

const MAX_PARTICIPANTS_OPTIONS = [2, 4, 6, 8, 10, 15, 20, 30, 50];

export default function CreateStudyRoomPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    isPublic: true,
    maxParticipants: 10,
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Room name must be less than 50 characters';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.isPublic && !formData.password.trim()) {
      newErrors.password = 'Password is required for private rooms';
    } else if (!formData.isPublic && formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);

    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/study-rooms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success!',
          description: 'Study room created successfully',
        });
        router.push(`/study-rooms/${data.roomId}`);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to create study room',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create study room',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/study-rooms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Rooms
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Create Study Room"
        description="Set up a collaborative study session for you and your peers"
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>
            Fill in the information about your study room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Room Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., MDCAT Biology Study Group"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
              >
                <SelectTrigger className={errors.subject ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what you'll be studying, your goals, and what participants should expect..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={errors.description ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Max Participants */}
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Select
                value={formData.maxParticipants.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, maxParticipants: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAX_PARTICIPANTS_OPTIONS.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} participants
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Public/Private */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Room</Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone can find and join this room
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublic: checked, password: '' })
                  }
                />
              </div>

              {/* Password (only for private rooms) */}
              {!formData.isPublic && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Room Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a password for this room"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/study-rooms')}
                disabled={creating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating} className="flex-1">
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  'Create Study Room'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}