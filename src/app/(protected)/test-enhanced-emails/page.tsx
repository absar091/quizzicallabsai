'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestEnhancedEmailsPage() {
  const [emailHtml, setEmailHtml] = useState('');
  const [emailType, setEmailType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateWelcomeEmail = async () => {
    setIsLoading(true);
    setEmailType('Welcome Email');
    try {
      const { welcomeEmailTemplate } = await import('@/lib/email-templates');
      
      const emailTemplate = welcomeEmailTemplate('Abid Hussain', {
        userEmail: 'ahmadraoabsar@gmail.com',
        accountType: 'Free',
        signUpDate: new Date().toLocaleDateString(),
        preferredLanguage: 'English'
      });
      
      setEmailHtml(emailTemplate.html);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuizResultEmail = async () => {
    setIsLoading(true);
    setEmailType('Quiz Result Email');
    try {
      const { quizResultEmailTemplate } = await import('@/lib/email-templates');
      
      const emailTemplate = quizResultEmailTemplate('Abid Hussain', {
        topic: 'Advanced JavaScript Concepts',
        score: 8,
        total: 10,
        percentage: 80,
        timeTaken: 240,
        date: new Date().toISOString()
      });
      
      setEmailHtml(emailTemplate.html);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudyReminderEmail = async () => {
    setIsLoading(true);
    setEmailType('Study Reminder Email');
    try {
      const { studyReminderEmailTemplate } = await import('@/lib/email-templates');
      
      const emailTemplate = studyReminderEmailTemplate('Abid Hussain');
      setEmailHtml(emailTemplate.html);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVerificationEmail = async () => {
    setIsLoading(true);
    setEmailType('Email Verification');
    try {
      const { emailVerificationTemplate } = await import('@/lib/email-templates');
      
      const emailTemplate = emailVerificationTemplate(
        'Abid Hussain', 
        'https://quizzicallabz.qzz.io/verify-email?token=sample-verification-token'
      );
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
          <CardTitle>Enhanced Email Templates - AWS/NVIDIA Style</CardTitle>
          <CardDescription>
            Preview the new professional email templates with AI insights and enhanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={generateWelcomeEmail} disabled={isLoading} className="h-auto p-4 flex flex-col">
              <span className="text-2xl mb-2">👋</span>
              <span className="font-semibold">Welcome Email</span>
              <span className="text-sm opacity-75">New user onboarding</span>
            </Button>
            
            <Button onClick={generateVerificationEmail} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col">
              <span className="text-2xl mb-2">🔐</span>
              <span className="font-semibold">Email Verification</span>
              <span className="text-sm opacity-75">Account activation</span>
            </Button>
            
            <Button onClick={generateQuizResultEmail} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col">
              <span className="text-2xl mb-2">🎯</span>
              <span className="font-semibold">Quiz Results</span>
              <span className="text-sm opacity-75">With AI insights</span>
            </Button>
            
            <Button onClick={generateStudyReminderEmail} disabled={isLoading} variant="secondary" className="h-auto p-4 flex flex-col">
              <span className="text-2xl mb-2">📚</span>
              <span className="font-semibold">Study Reminder</span>
              <span className="text-sm opacity-75">Daily motivation</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✨ New Features Added</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>✅ <strong>App Name:</strong> Updated to "Quizzicallabzᴬᴵ"</div>
                <div>✅ <strong>AI Insights:</strong> Personalized performance analysis</div>
                <div>✅ <strong>User Details:</strong> Account info and preferences</div>
                <div>✅ <strong>Action Buttons:</strong> Multiple app function links</div>
                <div>✅ <strong>Enhanced Footer:</strong> More navigation options</div>
                <div>✅ <strong>Professional Design:</strong> AWS/NVIDIA inspired styling</div>
                <div>✅ <strong>Smart Recommendations:</strong> AI-powered study suggestions</div>
                <div>✅ <strong>Email Verification:</strong> Secure account activation template</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎨 Design Improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>🔵 <strong>Color Scheme:</strong> Your app's blue/orange theme</div>
                <div>📱 <strong>Responsive:</strong> Mobile-optimized layouts</div>
                <div>🎯 <strong>Action Cards:</strong> Interactive button grids</div>
                <div>🤖 <strong>AI Sections:</strong> Highlighted insights boxes</div>
                <div>📊 <strong>Performance Badges:</strong> Dynamic status indicators</div>
                <div>🔗 <strong>Quick Links:</strong> Easy navigation footer</div>
              </CardContent>
            </Card>
          </div>
          
          {emailHtml && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">{emailType}</Badge>
                  Email Preview
                </CardTitle>
                <CardDescription>
                  Professional email template with enhanced features
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