'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestEmailColorsPage() {
  const [emailHtml, setEmailHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSampleEmail = async () => {
    setIsLoading(true);
    try {
      // Import the email template
      const { quizResultEmailTemplate } = await import('@/lib/email-templates');
      
      // Generate sample email with good score to show the new blue theme
      const sampleData = {
        quizTitle: 'Email System Test',
        score: 9,
        correct: '9',
        incorrect: '1',
        date: new Date().toLocaleDateString()
      };
      
      const emailTemplate = quizResultEmailTemplate('Abid Hussain', sampleData);
      setEmailHtml(emailTemplate.html);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Color Test</CardTitle>
          <CardDescription>
            Test the updated email templates with your app's color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={generateSampleEmail} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Sample Email'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">App Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary"></div>
                  <span>Primary: Deep Blue (#1A237E)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded" style={{backgroundColor: '#f6a23b'}}></div>
                  <span>Accent: Orange (#f6a23b)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-secondary"></div>
                  <span>Secondary: Light Blue (#f0f3fb)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Template Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>✅ Header: Green → Deep Blue (#1A237E)</div>
                <div>✅ Buttons: Orange → App Orange (#f6a23b)</div>
                <div>✅ Performance badges: App colors</div>
                <div>✅ Study tips: App color scheme</div>
                <div>✅ Footer links: App orange</div>
              </CardContent>
            </Card>
          </div>
          
          {emailHtml && (
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>
                  Sample quiz result email with updated colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: emailHtml }}
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}