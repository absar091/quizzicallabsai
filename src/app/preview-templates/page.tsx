'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PreviewTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('login');
  const [previewUrl, setPreviewUrl] = useState('');

  const templates = [
    { value: 'login', label: '🔒 Security Alert', description: 'Login notification email' },
    { value: 'welcome', label: '👋 Welcome', description: 'Welcome email for new users' },
    { value: 'reminder', label: '📚 Study Reminder', description: 'Learning continuity alert' },
    { value: 'quiz', label: '📊 Quiz Results', description: 'Performance report email' }
  ];

  const previewTemplate = () => {
    const url = `/api/preview-new-templates?template=${selectedTemplate}`;
    setPreviewUrl(url);
  };

  const openInNewTab = () => {
    const url = `/api/preview-new-templates?template=${selectedTemplate}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>📧 Ultra-Professional Email Templates Preview</CardTitle>
            <CardDescription>
              Preview the new sleek, beautiful, and mobile-optimized email templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Select Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        <div>
                          <div className="font-medium">{template.label}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={previewTemplate}>
                  Preview Below
                </Button>
                <Button onClick={openInNewTab} variant="outline">
                  Open in New Tab
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.value} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.value)}
                >
                  <CardContent className="p-4">
                    <div className="text-lg font-semibold mb-1">{template.label}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {previewUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>
                Live preview of the selected email template (mobile-optimized)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={previewUrl}
                  className="w-full h-[800px] border-0"
                  title="Email Template Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>✨ New Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">📱 Mobile-First Design</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect rendering on all screen sizes with touch-friendly buttons and readable text
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">🎨 Professional Colors</h4>
                <p className="text-sm text-muted-foreground">
                  Beautiful gradient schemes replacing harsh orange/red with elegant blue/purple
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">✨ Sleek Header</h4>
                <p className="text-sm text-muted-foreground">
                  Clean, modern header with brain emoji logo and subtle background patterns
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-600">🔗 Working Links</h4>
                <p className="text-sm text-muted-foreground">
                  All footer links point to correct pages - no more 404 errors
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-teal-600">📊 Beautiful Tables</h4>
                <p className="text-sm text-muted-foreground">
                  Mobile-optimized data tables with proper spacing and typography
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-600">🌙 Dark Mode Support</h4>
                <p className="text-sm text-muted-foreground">
                  Automatic dark mode detection for better user experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}