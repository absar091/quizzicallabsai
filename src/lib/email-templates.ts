// Professional email templates inspired by AWS and NVIDIA

export const welcomeEmailTemplate = (userName: string, emailDetails: {
  userEmail: string;
  accountType?: string;
  signUpDate?: string;
  preferredLanguage?: string;
}) => ({
  subject: `Welcome to Quizzicallabs AI, ${userName}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabs AI</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: #232f3e;
          padding: 32px 40px;
          text-align: center;
        }
        .logo {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .tagline {
          color: #aab7b8;
          font-size: 16px;
        }
        .content {
          padding: 40px;
        }
        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .welcome-text {
          font-size: 16px;
          color: #5a6c7d;
          margin-bottom: 32px;
        }
        .feature-section {
          margin: 32px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 20px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-item {
          padding: 16px 0;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: flex-start;
        }
        .feature-item:last-child {
          border-bottom: none;
        }
        .feature-icon {
          background: #ff9900;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          flex-shrink: 0;
          font-size: 16px;
        }
        .feature-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #232f3e;
        }
        .feature-content p {
          margin: 0;
          font-size: 14px;
          color: #5a6c7d;
        }
        .cta-section {
          background: #f7f8fa;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          border-radius: 4px;
        }
        .cta-button {
          background: #ff9900;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
        }
        .account-info {
          background: #f7f8fa;
          padding: 24px;
          border-radius: 4px;
          margin: 32px 0;
        }
        .account-info h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #232f3e;
        }
        .account-details {
          font-size: 14px;
          color: #5a6c7d;
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #ff9900;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🧠 Quizzicallabs AI</div>
          <div class="tagline">Your AI Learning Assistant</div>
        </div>
        
        <div class="content">
          <h1 class="welcome-title">Welcome to Quizzicallabs AI</h1>
          <p class="welcome-text">Hello ${userName}, thank you for joining our platform. We're excited to help you accelerate your learning with AI-powered study tools.</p>
          
          <div class="feature-section">
            <h2 class="section-title">Get started with these features</h2>
            <ul class="feature-list">
              <li class="feature-item">
                <div class="feature-icon">🎯</div>
                <div class="feature-content">
                  <h4>Smart Quiz Generation</h4>
                  <p>Create personalized quizzes from any topic or document using advanced AI</p>
                </div>
              </li>
              <li class="feature-item">
                <div class="feature-icon">📊</div>
                <div class="feature-content">
                  <h4>Progress Tracking</h4>
                  <p>Monitor your learning progress with detailed analytics and insights</p>
                </div>
              </li>
              <li class="feature-item">
                <div class="feature-icon">🤖</div>
                <div class="feature-content">
                  <h4>AI Explanations</h4>
                  <p>Get instant, detailed explanations for every question</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="cta-section">
            <p style="margin: 0 0 16px 0; color: #232f3e; font-weight: 600;">Ready to get started?</p>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">Go to Dashboard</a>
          </div>
          
          <div class="account-info">
            <h4>Account Information</h4>
            <div class="account-details">
              <strong>Email:</strong> ${emailDetails.userEmail}<br>
              <strong>Plan:</strong> ${emailDetails.accountType || 'Free'}<br>
              <strong>Joined:</strong> ${emailDetails.signUpDate || new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Need help? Visit our <a href="https://quizzicallabz.qzz.io/how-to-use">Help Center</a> or reply to this email.</p>
          <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Welcome to Quizzicallabs AI

Hello ${userName},

Thank you for joining Quizzicallabs AI! We're excited to help you accelerate your learning with AI-powered study tools.

Get started with these features:
• Smart Quiz Generation - Create personalized quizzes from any topic
• Progress Tracking - Monitor your learning progress with detailed analytics  
• AI Explanations - Get instant, detailed explanations for every question

Ready to get started? Visit: https://quizzicallabz.qzz.io/dashboard

Account Information:
Email: ${emailDetails.userEmail}
Plan: ${emailDetails.accountType || 'Free'}
Joined: ${emailDetails.signUpDate || new Date().toLocaleDateString()}

Need help? Visit our Help Center: https://quizzicallabz.qzz.io/how-to-use

© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
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
  subject: `Quiz Results: ${quizData.topic} - ${quizData.percentage}% Score`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: ${quizData.percentage >= 80 ? '#00a651' : quizData.percentage >= 60 ? '#ff9900' : '#d13212'};
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .score-display {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .congratulations {
          text-align: center;
          margin-bottom: 32px;
        }
        .congrats-title {
          font-size: 24px;
          font-weight: 700;
          color: #232f3e;
          margin-bottom: 8px;
        }
        .performance-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          ${quizData.percentage >= 90 ? 'background: #d4edda; color: #155724;' :
            quizData.percentage >= 80 ? 'background: #fff3cd; color: #856404;' :
            quizData.percentage >= 70 ? 'background: #cce5ff; color: #004085;' :
            quizData.percentage >= 60 ? 'background: #ffe6cc; color: #8a4100;' :
            'background: #f8d7da; color: #721c24;'}
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin: 32px 0;
        }
        .result-card {
          background: #f7f8fa;
          padding: 24px;
          text-align: center;
          border-radius: 4px;
        }
        .result-number {
          font-size: 32px;
          font-weight: 700;
          color: #232f3e;
          display: block;
        }
        .result-label {
          font-size: 14px;
          color: #5a6c7d;
          margin-top: 4px;
        }
        .action-section {
          background: #f7f8fa;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          border-radius: 4px;
        }
        .action-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-button {
          background: #ff9900;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          display: inline-block;
        }
        .cta-button.secondary {
          background: #232f3e;
        }
        .study-tip {
          background: ${quizData.percentage < 80 ? '#fff3cd' : '#d4edda'};
          border-left: 4px solid ${quizData.percentage < 80 ? '#ff9900' : '#00a651'};
          padding: 20px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .study-tip h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: ${quizData.percentage < 80 ? '#856404' : '#155724'};
        }
        .study-tip p {
          margin: 0;
          font-size: 14px;
          color: ${quizData.percentage < 80 ? '#856404' : '#155724'};
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #ff9900;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="score-display">${quizData.percentage}%</div>
          <div class="header-title">Quiz Complete</div>
          <div class="header-subtitle">${quizData.topic}</div>
        </div>
        
        <div class="content">
          <div class="congratulations">
            <h2 class="congrats-title">Great work, ${userName}!</h2>
            <div class="performance-badge">
              ${quizData.percentage >= 90 ? '🏆 Excellent Performance' :
                quizData.percentage >= 80 ? '⭐ Great Work' :
                quizData.percentage >= 70 ? '👍 Good Job' :
                quizData.percentage >= 60 ? '📈 Keep Improving' :
                '💪 Keep Practicing'}
            </div>
          </div>
          
          <div class="results-grid">
            <div class="result-card">
              <span class="result-number">${quizData.score}/${quizData.total}</span>
              <div class="result-label">Correct Answers</div>
            </div>
            <div class="result-card">
              <span class="result-number">${quizData.percentage}%</span>
              <div class="result-label">Final Score</div>
            </div>
            ${quizData.timeTaken ? `
            <div class="result-card">
              <span class="result-number">${Math.floor(quizData.timeTaken / 60)}:${String(quizData.timeTaken % 60).padStart(2, '0')}</span>
              <div class="result-label">Time Taken</div>
            </div>
            ` : ''}
          </div>
          
          <div class="action-section">
            <div class="action-title">Your results are ready</div>
            <p style="margin: 0 0 20px 0; color: #5a6c7d;">Review your performance and continue learning</p>
            <div class="action-buttons">
              <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">View Dashboard</a>
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button secondary">Take Another Quiz</a>
            </div>
          </div>
          
          <div class="study-tip">
            <h4>${quizData.percentage >= 80 ? '🎯 Keep the momentum going!' : '💡 Study Recommendation'}</h4>
            <p>${quizData.percentage >= 80 ? 
              'Excellent performance! Consider challenging yourself with more advanced topics.' : 
              'Focus on reviewing the questions you missed. Try generating flashcards for better retention.'}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Your learning journey continues. <a href="https://quizzicallabz.qzz.io/dashboard">Visit Dashboard</a></p>
          <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,  text: `

Quiz Results: ${quizData.topic}

Great work, ${userName}!

Performance: ${quizData.percentage >= 90 ? 'Excellent' :
              quizData.percentage >= 80 ? 'Great' :
              quizData.percentage >= 70 ? 'Good' :
              quizData.percentage >= 60 ? 'Fair' : 'Needs Improvement'}

Results:
• Score: ${quizData.score}/${quizData.total} (${quizData.percentage}%)
${quizData.timeTaken ? `• Time: ${Math.floor(quizData.timeTaken / 60)}:${String(quizData.timeTaken % 60).padStart(2, '0')}` : ''}
• Date: ${quizData.date || new Date().toLocaleDateString()}

${quizData.percentage >= 80 ? 
  'Excellent performance! Consider challenging yourself with more advanced topics.' : 
  'Focus on reviewing the questions you missed. Try generating flashcards for better retention.'}

View Dashboard: https://quizzicallabz.qzz.io/dashboard
Take Another Quiz: https://quizzicallabz.qzz.io/generate-quiz

© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
  `
});

export const studyReminderEmailTemplate = (userName: string) => ({
  subject: `${userName}, time for your daily study session`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder</title>
      <style>
        body {
          font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #232f3e;
          margin: 0;
          padding: 0;
          background-color: #f7f8fa;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: #8b5cf6;
          padding: 32px 40px;
          text-align: center;
          color: white;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .header-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 16px;
        }
        .main-message {
          font-size: 16px;
          color: #5a6c7d;
          margin-bottom: 32px;
        }
        .quote-section {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .quote-text {
          font-style: italic;
          color: #0c4a6e;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .quote-author {
          color: #0369a1;
          font-size: 14px;
          font-weight: 600;
        }
        .activities-section {
          margin: 32px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 20px;
        }
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .activity-card {
          background: #f7f8fa;
          padding: 24px;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        .activity-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .activity-title {
          font-size: 16px;
          font-weight: 600;
          color: #232f3e;
          margin-bottom: 8px;
        }
        .activity-description {
          font-size: 14px;
          color: #5a6c7d;
        }
        .cta-section {
          background: #8b5cf6;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
          border-radius: 4px;
          color: white;
        }
        .cta-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-button {
          background: #ffffff;
          color: #8b5cf6;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          display: inline-block;
        }
        .cta-button.secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .tips-section {
          background: #d1fae5;
          border-left: 4px solid #10b981;
          padding: 24px;
          margin: 32px 0;
          border-radius: 4px;
        }
        .tips-title {
          font-size: 16px;
          font-weight: 600;
          color: #065f46;
          margin-bottom: 12px;
        }
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .tips-list li {
          color: #065f46;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-size: 14px;
        }
        .tips-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        .footer {
          background: #232f3e;
          color: #aab7b8;
          padding: 32px 40px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #ff9900;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-icon">📚</div>
          <div class="header-title">Study Time, ${userName}</div>
          <div class="header-subtitle">Your daily learning session awaits</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${userName}!</div>
          <div class="main-message">
            It's time for your daily learning session. Research shows that consistent, focused study sessions lead to better retention and academic success.
          </div>
          
          <div class="quote-section">
            <div class="quote-text">"Success is the sum of small efforts repeated day in and day out."</div>
            <div class="quote-author">— Robert Collier</div>
          </div>
          
          <div class="activities-section">
            <div class="section-title">Choose your learning activity</div>
            <div class="activity-grid">
              <div class="activity-card">
                <div class="activity-icon">🎯</div>
                <div class="activity-title">Take a Quiz</div>
                <div class="activity-description">Test your knowledge on any topic</div>
              </div>
              <div class="activity-card">
                <div class="activity-icon">📝</div>
                <div class="activity-title">Review Flashcards</div>
                <div class="activity-description">Reinforce key concepts</div>
              </div>
              <div class="activity-card">
                <div class="activity-icon">📊</div>
                <div class="activity-title">Check Progress</div>
                <div class="activity-description">See your learning analytics</div>
              </div>
            </div>
          </div>
          
          <div class="cta-section">
            <div class="cta-title">Ready to learn?</div>
            <div class="action-buttons">
              <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button">Start Studying</a>
              <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button secondary">View Dashboard</a>
            </div>
          </div>
          
          <div class="tips-section">
            <div class="tips-title">🔥 Study Streak Tips</div>
            <ul class="tips-list">
              <li>Set a consistent time each day for studying</li>
              <li>Start with 15-20 minute focused sessions</li>
              <li>Focus on one subject at a time</li>
              <li>Use active recall techniques like quizzing</li>
              <li>Celebrate your daily learning wins</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Keep learning, keep growing. <a href="https://quizzicallabz.qzz.io/dashboard">Visit Dashboard</a></p>
          <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Study Time, ${userName}

Hello ${userName}!

It's time for your daily learning session. Research shows that consistent, focused study sessions lead to better retention and academic success.

"Success is the sum of small efforts repeated day in and day out." — Robert Collier

Choose your learning activity:
• Take a Quiz - Test your knowledge on any topic
• Review Flashcards - Reinforce key concepts  
• Check Progress - See your learning analytics

Ready to learn?
Start Studying: https://quizzicallabz.qzz.io/generate-quiz
View Dashboard: https://quizzicallabz.qzz.io/dashboard

Study Streak Tips:
✓ Set a consistent time each day for studying
✓ Start with 15-20 minute focused sessions
✓ Focus on one subject at a time
✓ Use active recall techniques like quizzing
✓ Celebrate your daily learning wins

Keep learning, keep growing.

© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.
  `
});