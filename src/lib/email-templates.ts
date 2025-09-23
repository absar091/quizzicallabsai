// Modern, clean email templates for Quizzicallabs AI

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  accountType?: string;
  signUpDate?: string;
  preferredLanguage?: string;
}) => ({
  subject: `Welcome to Quizzicallabs AI, ${userName}! 🚀`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabs AI</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome-title {
          font-size: 24px;
          font-weight: bold;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 30px 0;
        }
        .feature-list li {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
        }
        .feature-list li:last-child {
          border-bottom: none;
        }
        .feature-icon {
          width: 24px;
          height: 24px;
          background: #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .stat-label {
          font-size: 12px;
          color: #718096;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🧠 Quizzicallabs AI</div>
          <p>Your Personal AI Learning Assistant</p>
        </div>
        
        <div class="content">
          <h1 class="welcome-title">Welcome aboard, ${userName}! 🎉</h1>
          
          <p>We're thrilled to have you join our community of learners! Quizzicallabs AI is designed to make your study sessions more effective and engaging.</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat">
              <div class="stat-number">1M+</div>
              <div class="stat-label">Quizzes Generated</div>
            </div>
            <div class="stat">
              <div class="stat-number">95%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>
          
          <h3>What you can do with Quizzicallabs AI:</h3>
          <ul class="feature-list">
            <li>
              <div class="feature-icon">🎯</div>
              <div>
                <strong>Smart Quiz Generation</strong><br>
                Create personalized quizzes from any topic or document
              </div>
            </li>
            <li>
              <div class="feature-icon">📚</div>
              <div>
                <strong>Study Guides & Flashcards</strong><br>
                Generate comprehensive study materials instantly
              </div>
            </li>
            <li>
              <div class="feature-icon">📊</div>
              <div>
                <strong>Progress Tracking</strong><br>
                Monitor your learning progress and identify weak areas
              </div>
            </li>
            <li>
              <div class="feature-icon">🤖</div>
              <div>
                <strong>AI-Powered Explanations</strong><br>
                Get detailed explanations for every question
              </div>
            </li>
          </ul>
          
          <p>Ready to supercharge your learning? Let's get started!</p>
          
          <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">Start Learning Now →</a>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px;">
            <strong>Account Details:</strong><br>
            Email: ${emailDetails.userEmail}<br>
            Plan: ${emailDetails.accountType || 'Free'}<br>
            Joined: ${emailDetails.signUpDate || new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Need help?</strong> Reply to this email or visit our <a href="https://quizzicallabz.qzz.io/how-to-use">help center</a></p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Welcome to Quizzicallabs AI, ${userName}!

We're thrilled to have you join our community of learners!

What you can do:
• Smart Quiz Generation - Create personalized quizzes from any topic
• Study Guides & Flashcards - Generate study materials instantly  
• Progress Tracking - Monitor your learning progress
• AI-Powered Explanations - Get detailed explanations

Account Details:
Email: ${emailDetails.userEmail}
Plan: ${emailDetails.accountType || 'Free'}
Joined: ${emailDetails.signUpDate || new Date().toLocaleDateString()}

Get started: https://quizzicallabz.qzz.io/dashboard

Need help? Reply to this email or visit our help center.

© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.
  `
});

export const quizResultEmailTemplate = (userName: string, quizData: {
  topic: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken?: number;
  date?: string;
}) => ({
  subject: `🎯 Quiz Complete: ${quizData.topic} - ${quizData.percentage}% Score`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: ${quizData.percentage >= 80 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                       quizData.percentage >= 60 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                       'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 3px solid rgba(255,255,255,0.3);
        }
        .score-text {
          font-size: 36px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .result-card {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .result-number {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
        }
        .result-label {
          font-size: 14px;
          color: #718096;
          margin-top: 5px;
        }
        .performance-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0;
          ${quizData.percentage >= 90 ? 'background: #dcfce7; color: #166534;' :
            quizData.percentage >= 80 ? 'background: #fef3c7; color: #92400e;' :
            quizData.percentage >= 70 ? 'background: #dbeafe; color: #1e40af;' :
            quizData.percentage >= 60 ? 'background: #fed7aa; color: #9a3412;' :
            'background: #fecaca; color: #991b1b;'}
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 10px;
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="score-circle">
            <div class="score-text">${quizData.percentage}%</div>
          </div>
          <h1>Quiz Complete!</h1>
          <p>${quizData.topic}</p>
        </div>
        
        <div class="content">
          <h2>Great job, ${userName}! 🎉</h2>
          
          <div class="performance-badge">
            ${quizData.percentage >= 90 ? '🏆 Excellent Performance' :
              quizData.percentage >= 80 ? '⭐ Great Work' :
              quizData.percentage >= 70 ? '👍 Good Job' :
              quizData.percentage >= 60 ? '📈 Keep Improving' :
              '💪 Keep Practicing'}
          </div>
          
          <div class="result-grid">
            <div class="result-card">
              <div class="result-number">${quizData.score}/${quizData.total}</div>
              <div class="result-label">Correct Answers</div>
            </div>
            <div class="result-card">
              <div class="result-number">${quizData.percentage}%</div>
              <div class="result-label">Score</div>
            </div>
            ${quizData.timeTaken ? `
            <div class="result-card">
              <div class="result-number">${Math.floor(quizData.timeTaken / 60)}m ${quizData.timeTaken % 60}s</div>
              <div class="result-label">Time Taken</div>
            </div>
            ` : ''}
          </div>
          
          <p>Your quiz results have been saved to your dashboard. You can review your answers, get explanations, and track your progress over time.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">View Dashboard</a>
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button">Take Another Quiz</a>
          </div>
          
          ${quizData.percentage < 80 ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">💡 Study Tip</h3>
            <p style="color: #92400e; margin-bottom: 0;">Consider reviewing the topics you missed and try generating flashcards for better retention!</p>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Keep up the great work! Consistent practice leads to mastery.</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Quiz Complete: ${quizData.topic}

Great job, ${userName}!

Results:
• Score: ${quizData.score}/${quizData.total} (${quizData.percentage}%)
${quizData.timeTaken ? `• Time: ${Math.floor(quizData.timeTaken / 60)}m ${quizData.timeTaken % 60}s` : ''}
• Date: ${quizData.date || new Date().toLocaleDateString()}

Performance: ${quizData.percentage >= 90 ? 'Excellent' :
              quizData.percentage >= 80 ? 'Great' :
              quizData.percentage >= 70 ? 'Good' :
              quizData.percentage >= 60 ? 'Fair' : 'Needs Improvement'}

View your detailed results: https://quizzicallabz.qzz.io/dashboard
Take another quiz: https://quizzicallabz.qzz.io/generate-quiz

© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.
  `
});

export const studyReminderEmailTemplate = (userName: string) => ({
  subject: `📚 ${userName}, time for your daily study session!`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .motivation-quote {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #0c4a6e;
        }
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .activity-card {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        .activity-card:hover {
          border-color: #8b5cf6;
        }
        .activity-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .cta-button {
          display: inline-block;
          background: #8b5cf6;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 10px;
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          color: #718096;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 Study Time, ${userName}!</h1>
          <p>Consistency is the key to success</p>
        </div>
        
        <div class="content">
          <p>Hi ${userName}! 👋</p>
          
          <p>It's time for your daily study session. Even 15 minutes of focused learning can make a huge difference in your academic journey!</p>
          
          <div class="motivation-quote">
            "Success is the sum of small efforts repeated day in and day out." - Robert Collier
          </div>
          
          <h3>What would you like to study today?</h3>
          
          <div class="activity-grid">
            <div class="activity-card">
              <div class="activity-icon">🎯</div>
              <h4>Take a Quiz</h4>
              <p>Test your knowledge on any topic</p>
            </div>
            <div class="activity-card">
              <div class="activity-icon">📝</div>
              <h4>Review Flashcards</h4>
              <p>Reinforce what you've learned</p>
            </div>
            <div class="activity-card">
              <div class="activity-icon">📊</div>
              <h4>Check Progress</h4>
              <p>See how far you've come</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button">Start Studying</a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">View Dashboard</a>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">🔥 Study Streak Tips</h3>
            <ul style="color: #065f46; margin-bottom: 0;">
              <li>Set a specific time each day for studying</li>
              <li>Start with just 15-20 minutes</li>
              <li>Focus on one topic at a time</li>
              <li>Celebrate small wins along the way</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>You've got this! Every expert was once a beginner.</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Study Time, ${userName}!

Hi ${userName}! 👋

It's time for your daily study session. Even 15 minutes of focused learning can make a huge difference!

"Success is the sum of small efforts repeated day in and day out." - Robert Collier

What would you like to study today?
• Take a Quiz - Test your knowledge on any topic
• Review Flashcards - Reinforce what you've learned  
• Check Progress - See how far you've come

Start studying: https://quizzicallabz.qzz.io/generate-quiz
View dashboard: https://quizzicallabz.qzz.io/dashboard

Study Streak Tips:
• Set a specific time each day for studying
• Start with just 15-20 minutes
• Focus on one topic at a time
• Celebrate small wins along the way

You've got this! Every expert was once a beginner.

© ${new Date().getFullYear()} Quizzicallabs AI. Made with ❤️ for students worldwide.
  `
});