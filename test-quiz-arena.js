// Quiz Arena Test Script
const puppeteer = require('puppeteer');

async function testQuizArena() {
  console.log('🚀 Starting Quiz Arena Live Testing...\n');
  
  let browser;
  let hostPage;
  let participantPage;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    console.log('✅ Browser launched successfully');
    
    // Create two pages - one for host, one for participant
    hostPage = await browser.newPage();
    participantPage = await browser.newPage();
    
    console.log('✅ Created host and participant pages');
    
    // Test 1: Host Room Creation
    console.log('\n📋 Test 1: Host Room Creation');
    await hostPage.goto('http://localhost:3000/quiz-arena');
    await hostPage.waitForSelector('h1', { timeout: 10000 });
    
    const pageTitle = await hostPage.$eval('h1', el => el.textContent);
    console.log(`✅ Quiz Arena page loaded: ${pageTitle}`);
    
    // Look for template cards
    await hostPage.waitForSelector('[data-testid="quiz-template"], .group', { timeout: 5000 });
    console.log('✅ Quiz templates loaded');
    
    // Click on first template (MDCAT Pharmacology)
    const templateButton = await hostPage.$('button:has-text("START BATTLE"), button[class*="START BATTLE"]');
    if (templateButton) {
      await templateButton.click();
      console.log('✅ Clicked on quiz template');
    } else {
      // Try alternative selector
      await hostPage.click('.group button');
      console.log('✅ Clicked on quiz template (alternative)');
    }
    
    // Wait for room creation
    await hostPage.waitForTimeout(5000);
    
    // Check if we're redirected to host page
    const currentUrl = hostPage.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/quiz-arena/host/')) {
      console.log('✅ Successfully created room and redirected to host page');
      
      // Extract room code from URL
      const roomCode = currentUrl.split('/').pop();
      console.log(`🔑 Room Code: ${roomCode}`);
      
      // Test 2: Participant Join
      console.log('\n📋 Test 2: Participant Join');
      await participantPage.goto(`http://localhost:3000/quiz-arena/join/${roomCode}`);
      await participantPage.waitForTimeout(3000);
      
      const participantUrl = participantPage.url();
      console.log(`Participant URL: ${participantUrl}`);
      
      if (participantUrl.includes('/quiz-arena/participant/')) {
        console.log('✅ Participant successfully joined room');
        
        // Test 3: Real-time Synchronization
        console.log('\n📋 Test 3: Real-time Synchronization');
        
        // Check if participant appears in host dashboard
        await hostPage.waitForTimeout(2000);
        const playerCount = await hostPage.$eval('[data-testid="player-count"], .text-2xl', el => el.textContent).catch(() => '0');
        console.log(`👥 Player count on host: ${playerCount}`);
        
        // Test 4: Start Quiz
        console.log('\n📋 Test 4: Start Quiz');
        
        // Look for start button on host page
        const startButton = await hostPage.$('button:has-text("Start Quiz"), button[class*="Start Quiz"]');
        if (startButton) {
          await startButton.click();
          console.log('✅ Host clicked Start Quiz');
          
          // Wait for quiz to start
          await hostPage.waitForTimeout(5000);
          
          // Check if both pages show quiz started
          const hostQuizStarted = hostPage.url().includes('/questions') || await hostPage.$('.timer, [data-testid="timer"]').catch(() => null);
          const participantQuizStarted = await participantPage.$('.timer, [data-testid="timer"]').catch(() => null);
          
          if (hostQuizStarted) {
            console.log('✅ Quiz started on host side');
          }
          
          if (participantQuizStarted) {
            console.log('✅ Quiz started on participant side');
            
            // Test 5: Answer Submission
            console.log('\n📋 Test 5: Answer Submission');
            
            // Look for answer options
            const answerOptions = await participantPage.$$('div[class*="cursor-pointer"], button[class*="option"]');
            if (answerOptions.length > 0) {
              await answerOptions[0].click();
              console.log('✅ Selected answer option');
              
              // Look for submit button
              const submitButton = await participantPage.$('button:has-text("SUBMIT"), button[class*="SUBMIT"]');
              if (submitButton) {
                await submitButton.click();
                console.log('✅ Submitted answer');
                
                // Wait for result
                await participantPage.waitForTimeout(2000);
                console.log('✅ Answer submission completed');
              }
            }
          }
        } else {
          console.log('⚠️ Start Quiz button not found - checking if minimum players required');
        }
        
      } else {
        console.log('❌ Participant failed to join room');
      }
      
    } else {
      console.log('❌ Room creation failed or redirect did not occur');
    }
    
    console.log('\n🎉 Quiz Arena Testing Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      // Keep browser open for manual inspection
      console.log('\n🔍 Browser kept open for manual inspection...');
      console.log('Press Ctrl+C to close when done testing');
      
      // Wait indefinitely
      await new Promise(() => {});
    }
  }
}

// Run the test
testQuizArena().catch(console.error);