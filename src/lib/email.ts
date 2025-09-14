import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface QuizResultEmailData {
  userName: string;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  date: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

export async function sendQuizResultEmail(to: string, data: QuizResultEmailData) {
  const subject = `🎯 Quiz Results: ${data.topic} - ${data.percentage}% Score`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results - Quizzicallabs AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .score-big { font-size: 48px; font-weight: bold; color: #3B82F6; text-align: center; margin: 10px 0; }
        .stats { display: flex; justify-content: space-between; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #059669; }
        .stat-label { font-size: 14px; color: #6B7280; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px; }
        .btn { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        @media (max-width: 600px) {
          .stats { flex-direction: column; }
          .stat { margin: 10px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Quiz Results</h1>
          <p>Great job completing your quiz, ${data.userName}!</p>
        </div>
        
        <div class="content">
          <div class="score-card">
            <h2 style="text-align: center; color: #1F2937; margin-bottom: 20px;">${data.topic}</h2>
            
            <div class="score-big">${data.percentage}%</div>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${data.score}</div>
                <div class="stat-label">Correct</div>
              </div>
              <div class="stat">
                <div class="stat-value">${data.total}</div>
                <div class="stat-label">Total</div>
              </div>
              <div class="stat">
                <div class="stat-value">${Math.round(data.timeTaken / 60)}</div>
                <div class="stat-label">Minutes</div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center;">
            <p>Keep up the great work! Ready for your next challenge?</p>
            <a href="https://quizzicallabs.vercel.app/generate-quiz" class="btn">Take Another Quiz</a>
          </div>
          
          <div class="footer">
            <p>📅 Completed on ${new Date(data.date).toLocaleDateString()}</p>
            <p>Powered by <strong>Quizzicallabs AI</strong> - Your Ultimate Study Partner</p>
            <p><a href="https://quizzicallabs.vercel.app">Visit Quizzicallabs AI</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  const text = `
Quiz Results - ${data.topic}

Hi ${data.userName},

Great job completing your quiz! Here are your results:

Score: ${data.score}/${data.total} (${data.percentage}%)
Time Taken: ${Math.round(data.timeTaken / 60)} minutes
Completed: ${new Date(data.date).toLocaleDateString()}

Keep up the great work!

Visit https://quizzicallabs.vercel.app for more quizzes.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const subject = '🎉 Welcome to Quizzicallabs AI - Your Ultimate Study Partner!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Quizzicallabs AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Quizzicallabs AI!</h1>
          <p>Hi ${userName}, ready to supercharge your learning?</p>
        </div>
        
        <div class="content">
          <p>Welcome to the ultimate AI-powered study platform! Here's what you can do:</p>
          
          <div class="feature">
            <h3>🎯 Custom Quiz Generation</h3>
            <p>Generate personalized quizzes on any topic with AI-powered questions.</p>
          </div>
          
          <div class="feature">
            <h3>📚 MDCAT/ECAT/NTS Prep</h3>
            <p>Specialized preparation modules for Pakistani entrance exams.</p>
          </div>
          
          <div class="feature">
            <h3>🧠 AI Explanations</h3>
            <p>Get detailed explanations for incorrect answers to learn better.</p>
          </div>
          
          <div class="feature">
            <h3>📊 Progress Tracking</h3>
            <p>Monitor your performance with detailed analytics and insights.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://quizzicallabs.vercel.app/generate-quiz" class="btn">Start Your First Quiz</a>
            <a href="https://quizzicallabs.vercel.app/mdcat" class="btn">MDCAT Prep</a>
          </div>
          
          <div class="footer">
            <p>Need help? Reply to this email or visit our help center.</p>
            <p>Happy studying! 📖✨</p>
            <p><strong>The Quizzicallabs AI Team</strong></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

export async function sendStudyReminderEmail(to: string, userName: string) {
  const subject = '📚 Time to Study! Your Daily Learning Reminder';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Study Reminder - Quizzicallabs AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 Study Time, ${userName}!</h1>
          <p>Consistency is the key to success</p>
        </div>
        
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Just a friendly reminder that consistent practice leads to better results! Even 15 minutes of focused study can make a big difference.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://quizzicallabs.vercel.app/generate-quiz" class="btn">Quick 5-Minute Quiz</a>
          </div>
          
          <p><strong>💡 Study Tip:</strong> Try reviewing topics you found challenging in previous quizzes.</p>
          
          <div class="footer">
            <p>Keep up the great work! 🌟</p>
            <p><strong>Quizzicallabs AI</strong></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}