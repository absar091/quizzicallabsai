import { sendEmail } from './email';

// Enhanced Study Reminder Email with comprehensive user details and personalization
export async function sendEnhancedStudyReminderEmail(to: string, userName: string, userDetails?: {
  userClass?: string;
  userGrade?: string;
  userSchool?: string;
  lastQuizDate?: string;
  currentStreak?: number;
  totalQuizzes?: number;
  averageScore?: number;
  weakAreas?: string[];
  strongAreas?: string[];
  upcomingExams?: Array<{
    name: string;
    date: string;
    subject: string;
  }>;
  studyGoals?: string[];
  recommendedTopics?: string[];
  studyTime?: number; // minutes per day
  preferredSubjects?: string[];
}) {
  const subject = `📚 ${userName}, Time to Boost Your Learning! Keep Your Streak Going`;

  const daysSinceLastQuiz = userDetails?.lastQuizDate ? 
    Math.floor((new Date().getTime() - new Date(userDetails.lastQuizDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const motivationalMessage = userDetails?.currentStreak && userDetails.currentStreak > 0 ?
    `You're on a ${userDetails.currentStreak}-day learning streak! Don't break it now.` :
    `Start a new learning streak today and build momentum for academic success.`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder - Keep Learning with Quizzicallabs</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --accent-gradient: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%);
          --warning-gradient: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          --success-gradient: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
          --dark-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-light: rgba(255, 255, 255, 0.9);
          --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.1);
          --shadow-strong: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          --border-radius: 16px;
          --border-radius-lg: 24px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.7;
          color: var(--text-primary);
          background: var(--primary-gradient);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .email-container {
          max-width: 750px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-strong);
          position: relative;
          backdrop-filter: blur(20px);
        }

        .email-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--accent-gradient);
          background-size: 200% 200%;
          animation: gradientFlow 4s ease infinite;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-header {
          background: var(--warning-gradient);
          padding: 60px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 3;
        }

        .reminder-badge {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 50px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid var(--glass-border);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          box-shadow: var(--shadow-soft);
          font-family: 'Space Grotesk', sans-serif;
        }

        .hero-title {
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
          margin: 16px 0 8px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--text-light);
          margin-bottom: 20px;
          font-weight: 400;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .streak-display {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px;
          margin: 24px auto;
          max-width: 400px;
          border: 1px solid var(--glass-border);
        }

        .streak-number {
          font-size: 48px;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 8px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .streak-label {
          font-size: 16px;
          color: var(--text-light);
          font-weight: 600;
        }

        .user-info-section {
          background: #f8fafc;
          padding: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .user-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: #1f2937;
          margin-bottom: 4px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .performance-section {
          background: white;
          padding: 40px;
        }

        .performance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .performance-card {
          background: #f8fafc;
          padding: 28px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .performance-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .performance-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .topic-list {
          list-style: none;
          padding: 0;
        }

        .topic-item {
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .weak-topic {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .strong-topic {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .recommended-topic {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .upcoming-exams {
          background: #f8fafc;
          padding: 40px;
        }

        .exam-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .exam-info h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .exam-subject {
          font-size: 14px;
          color: #6b7280;
        }

        .exam-date {
          background: #fef3c7;
          color: #92400e;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .motivation-section {
          background: var(--success-gradient);
          padding: 40px;
          text-align: center;
          color: white;
        }

        .motivation-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 16px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .motivation-message {
          font-size: 18px;
          opacity: 0.95;
          margin-bottom: 30px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .study-goals {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .goal-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
        }

        .goal-icon {
          font-size: 24px;
          margin-bottom: 12px;
          display: block;
        }

        .goal-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .goal-description {
          font-size: 14px;
          opacity: 0.9;
          line-height: 1.5;
        }

        .cta-section {
          background: var(--dark-gradient);
          padding: 40px;
          text-align: center;
          color: white;
        }

        .cta-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .cta-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .footer {
          background: #1f2937;
          color: #9ca3af;
          padding: 30px 40px;
          text-align: center;
        }

        .footer-content {
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }

          .hero-header, .user-info-section, .performance-section, 
          .upcoming-exams, .motivation-section, .cta-section {
            padding: 24px 20px;
          }

          .user-stats-grid, .performance-grid, .study-goals {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 28px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }

          .exam-card {
            flex-direction: column;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Hero Header -->
        <div class="hero-header">
          <div class="hero-content">
            <div class="reminder-badge">
              📚 Study Reminder
            </div>
            <div class="hero-title">
              Keep Learning, ${userName}!
            </div>
            <div class="hero-subtitle">
              ${motivationalMessage}
            </div>
            
            ${userDetails?.currentStreak ? `
            <div class="streak-display">
              <div class="streak-number">${userDetails.currentStreak}</div>
              <div class="streak-label">Day Learning Streak 🔥</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- User Statistics -->
        <div class="user-info-section">
          <div class="section-title">
            📊 Your Learning Progress
          </div>
          <div class="user-stats-grid">
            ${userDetails?.totalQuizzes ? `
            <div class="stat-card">
              <span class="stat-icon">📝</span>
              <div class="stat-value">${userDetails.totalQuizzes}</div>
              <div class="stat-label">Total Quizzes</div>
            </div>
            ` : ''}
            
            ${userDetails?.averageScore ? `
            <div class="stat-card">
              <span class="stat-icon">🎯</span>
              <div class="stat-value">${userDetails.averageScore}%</div>
              <div class="stat-label">Average Score</div>
            </div>
            ` : ''}
            
            ${userDetails?.studyTime ? `
            <div class="stat-card">
              <span class="stat-icon">⏰</span>
              <div class="stat-value">${userDetails.studyTime}min</div>
              <div class="stat-label">Daily Goal</div>
            </div>
            ` : ''}
            
            ${daysSinceLastQuiz > 0 ? `
            <div class="stat-card">
              <span class="stat-icon">📅</span>
              <div class="stat-value">${daysSinceLastQuiz}</div>
              <div class="stat-label">Days Since Last Quiz</div>
            </div>
            ` : ''}
          </div>
          
          ${userDetails?.userClass || userDetails?.userGrade || userDetails?.userSchool ? `
          <div class="stat-card" style="margin-bottom: 0;">
            <span class="stat-icon">🎓</span>
            <div style="text-align: left; margin-top: 12px;">
              ${userDetails.userClass ? `<div><strong>Class:</strong> ${userDetails.userClass}</div>` : ''}
              ${userDetails.userGrade ? `<div><strong>Grade:</strong> ${userDetails.userGrade}</div>` : ''}
              ${userDetails.userSchool ? `<div><strong>School:</strong> ${userDetails.userSchool}</div>` : ''}
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Performance Analysis -->
        ${userDetails?.weakAreas || userDetails?.strongAreas || userDetails?.recommendedTopics ? `
        <div class="performance-section">
          <div class="section-title">
            🔍 Performance Insights
          </div>
          <div class="performance-grid">
            ${userDetails.weakAreas && userDetails.weakAreas.length > 0 ? `
            <div class="performance-card">
              <div class="performance-header">
                <span>⚠️</span>
                <div class="performance-title">Areas to Focus On</div>
              </div>
              <ul class="topic-list">
                ${userDetails.weakAreas.map(area => `
                  <li class="topic-item weak-topic">
                    <span>📌</span>
                    ${area}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${userDetails.strongAreas && userDetails.strongAreas.length > 0 ? `
            <div class="performance-card">
              <div class="performance-header">
                <span>💪</span>
                <div class="performance-title">Your Strengths</div>
              </div>
              <ul class="topic-list">
                ${userDetails.strongAreas.map(area => `
                  <li class="topic-item strong-topic">
                    <span>⭐</span>
                    ${area}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${userDetails.recommendedTopics && userDetails.recommendedTopics.length > 0 ? `
            <div class="performance-card">
              <div class="performance-header">
                <span>💡</span>
                <div class="performance-title">Recommended Topics</div>
              </div>
              <ul class="topic-list">
                ${userDetails.recommendedTopics.map(topic => `
                  <li class="topic-item recommended-topic">
                    <span>🎯</span>
                    ${topic}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <!-- Upcoming Exams -->
        ${userDetails?.upcomingExams && userDetails.upcomingExams.length > 0 ? `
        <div class="upcoming-exams">
          <div class="section-title">
            📅 Upcoming Exams
          </div>
          ${userDetails.upcomingExams.map(exam => `
            <div class="exam-card">
              <div class="exam-info">
                <h4>${exam.name}</h4>
                <div class="exam-subject">${exam.subject}</div>
              </div>
              <div class="exam-date">${exam.date}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Motivation Section -->
        <div class="motivation-section">
          <div class="motivation-title">
            🚀 Your Learning Goals
          </div>
          <div class="motivation-message">
            Every study session brings you closer to academic excellence. Stay consistent and watch your knowledge grow!
          </div>
          
          <div class="study-goals">
            ${userDetails?.studyGoals && userDetails.studyGoals.length > 0 ? 
              userDetails.studyGoals.map((goal, index) => `
                <div class="goal-card">
                  <span class="goal-icon">${['🎯', '📚', '🏆', '💡'][index % 4]}</span>
                  <div class="goal-title">Goal ${index + 1}</div>
                  <div class="goal-description">${goal}</div>
                </div>
              `).join('') : `
                <div class="goal-card">
                  <span class="goal-icon">🎯</span>
                  <div class="goal-title">Daily Practice</div>
                  <div class="goal-description">Complete at least one quiz every day</div>
                </div>
                <div class="goal-card">
                  <span class="goal-icon">📚</span>
                  <div class="goal-title">Consistent Learning</div>
                  <div class="goal-description">Build a strong learning streak</div>
                </div>
                <div class="goal-card">
                  <span class="goal-icon">🏆</span>
                  <div class="goal-title">Improve Scores</div>
                  <div class="goal-description">Aim for higher accuracy in each quiz</div>
                </div>
              `
            }
          </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <div class="cta-title">
            Ready to Continue Learning?
          </div>
          <div class="cta-subtitle">
            Jump back into your studies and maintain your momentum
          </div>
          
          <div class="cta-buttons">
            <a href="https://quizzicallabz.qzz.io/generate-quiz" class="cta-button">
              📝 Start a Quiz
            </a>
            <a href="https://quizzicallabz.qzz.io/dashboard" class="cta-button">
              📊 View Progress
            </a>
            ${userDetails?.recommendedTopics && userDetails.recommendedTopics.length > 0 ? `
            <a href="https://quizzicallabz.qzz.io/topics/${encodeURIComponent(userDetails.recommendedTopics[0])}" class="cta-button">
              🎯 Study ${userDetails.recommendedTopics[0]}
            </a>
            ` : ''}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-content">
            <p><strong>Quizzicallabs AI</strong> - Your Ultimate AI-Powered Study Partner</p>
            <p>© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.</p>
            <p>This reminder was sent to help you maintain consistent learning habits.</p>
            <p>Need help? Reply to this email or visit our help center.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const text = `
QUIZZICALLABS AI - STUDY REMINDER
${userName}, Keep Your Learning Streak Going! 📚

Hi ${userName}!

${motivationalMessage}

YOUR LEARNING PROGRESS:
----------------------
${userDetails?.totalQuizzes ? `📝 Total Quizzes: ${userDetails.totalQuizzes}` : ''}
${userDetails?.averageScore ? `🎯 Average Score: ${userDetails.averageScore}%` : ''}
${userDetails?.currentStreak ? `🔥 Current Streak: ${userDetails.currentStreak} days` : ''}
${userDetails?.studyTime ? `⏰ Daily Goal: ${userDetails.studyTime} minutes` : ''}
${daysSinceLastQuiz > 0 ? `📅 Days Since Last Quiz: ${daysSinceLastQuiz}` : ''}

STUDENT DETAILS:
---------------
${userDetails?.userClass ? `📚 Class: ${userDetails.userClass}` : ''}
${userDetails?.userGrade ? `🎓 Grade: ${userDetails.userGrade}` : ''}
${userDetails?.userSchool ? `🏫 School: ${userDetails.userSchool}` : ''}

${userDetails?.weakAreas && userDetails.weakAreas.length > 0 ? `
AREAS TO FOCUS ON:
-----------------
${userDetails.weakAreas.map(area => `⚠️ ${area}`).join('\n')}
` : ''}

${userDetails?.strongAreas && userDetails.strongAreas.length > 0 ? `
YOUR STRENGTHS:
--------------
${userDetails.strongAreas.map(area => `💪 ${area}`).join('\n')}
` : ''}

${userDetails?.recommendedTopics && userDetails.recommendedTopics.length > 0 ? `
RECOMMENDED TOPICS:
------------------
${userDetails.recommendedTopics.map(topic => `💡 ${topic}`).join('\n')}
` : ''}

${userDetails?.upcomingExams && userDetails.upcomingExams.length > 0 ? `
UPCOMING EXAMS:
--------------
${userDetails.upcomingExams.map(exam => `📅 ${exam.name} (${exam.subject}) - ${exam.date}`).join('\n')}
` : ''}

STUDY GOALS:
-----------
${userDetails?.studyGoals && userDetails.studyGoals.length > 0 ? 
  userDetails.studyGoals.map((goal, index) => `${index + 1}. ${goal}`).join('\n') : 
  `1. Complete at least one quiz every day
2. Build a strong learning streak
3. Aim for higher accuracy in each quiz`
}

QUICK ACTIONS:
-------------
📝 Start a Quiz: https://quizzicallabz.qzz.io/generate-quiz
📊 View Progress: https://quizzicallabz.qzz.io/dashboard
${userDetails?.recommendedTopics && userDetails.recommendedTopics.length > 0 ? 
  `🎯 Study ${userDetails.recommendedTopics[0]}: https://quizzicallabz.qzz.io/topics/${encodeURIComponent(userDetails.recommendedTopics[0])}` : ''}

Every study session brings you closer to academic excellence. Stay consistent and watch your knowledge grow!

Best regards,
The Quizzicallabs AI Team

---
Quizzicallabs AI - Your Ultimate AI-Powered Study Partner
© ${new Date().getFullYear()} Quizzicallabs AI. All rights reserved.

Need help? Reply to this email or visit our help center.
  `;

  return sendEmail({ to, subject, html, text });
}