/**
 * 🚀 Quiz Arena Test Runner
 * Automated testing suite for live multiplayer quiz functionality
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  suite: string;
  passed: number;
  failed: number;
  duration: number;
  errors: string[];
}

class QuizArenaTestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🎯 Starting Quiz Arena Test Suite...\n');

    const testSuites = [
      'arena-integration.test.ts',
      'api-endpoints.test.ts', 
      'e2e-scenarios.test.ts'
    ];

    for (const suite of testSuites) {
      await this.runTestSuite(suite);
    }

    this.generateReport();
  }

  private async runTestSuite(suiteName: string): Promise<void> {
    console.log(`🧪 Running ${suiteName}...`);
    const startTime = Date.now();

    try {
      const { stdout, stderr } = await execAsync(`npx jest src/tests/quiz-arena/${suiteName} --verbose`);
      
      const duration = Date.now() - startTime;
      const result = this.parseJestOutput(stdout, suiteName, duration);
      
      this.results.push(result);
      
      if (result.failed === 0) {
        console.log(`✅ ${suiteName} - All tests passed (${result.passed} tests, ${duration}ms)\n`);
      } else {
        console.log(`❌ ${suiteName} - ${result.failed} tests failed (${result.passed} passed, ${duration}ms)\n`);
      }

    } catch (error: any) {
      console.log(`💥 ${suiteName} - Test suite crashed: ${error.message}\n`);
      
      this.results.push({
        suite: suiteName,
        passed: 0,
        failed: 1,
        duration: Date.now() - startTime,
        errors: [error.message]
      });
    }
  }

  private parseJestOutput(output: string, suiteName: string, duration: number): TestResult {
    // Parse Jest output to extract test results
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    
    const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
    const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
    
    // Extract error messages
    const errorLines = output.split('\n').filter(line => 
      line.includes('FAIL') || line.includes('Error:') || line.includes('Expected:')
    );

    return {
      suite: suiteName,
      passed,
      failed,
      duration,
      errors: errorLines
    };
  }

  private generateReport(): void {
    console.log('\n🎊 Quiz Arena Test Report');
    console.log('=' .repeat(50));

    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\n📊 Overall Results:`);
    console.log(`   ✅ Passed: ${totalPassed}`);
    console.log(`   ❌ Failed: ${totalFailed}`);
    console.log(`   ⏱️  Duration: ${totalDuration}ms`);
    console.log(`   📈 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);

    console.log(`\n📋 Suite Breakdown:`);
    this.results.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(`   ${status} ${result.suite}: ${result.passed}/${result.passed + result.failed} (${result.duration}ms)`);
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          console.log(`      🔍 ${error}`);
        });
      }
    });

    // Performance Analysis
    console.log(`\n⚡ Performance Analysis:`);
    const avgDuration = totalDuration / this.results.length;
    console.log(`   📊 Average suite duration: ${avgDuration.toFixed(0)}ms`);
    
    const slowestSuite = this.results.reduce((prev, current) => 
      prev.duration > current.duration ? prev : current
    );
    console.log(`   🐌 Slowest suite: ${slowestSuite.suite} (${slowestSuite.duration}ms)`);

    // Recommendations
    console.log(`\n💡 Recommendations:`);
    if (totalFailed > 0) {
      console.log(`   🔧 Fix ${totalFailed} failing tests before production deployment`);
    }
    if (avgDuration > 5000) {
      console.log(`   ⚡ Consider optimizing test performance (avg: ${avgDuration.toFixed(0)}ms)`);
    }
    if (totalPassed + totalFailed < 50) {
      console.log(`   📝 Add more test coverage for critical paths`);
    }

    console.log(`\n🎯 Quiz Arena is ${totalFailed === 0 ? 'READY FOR PRODUCTION! 🚀' : 'NEEDS FIXES BEFORE DEPLOYMENT ⚠️'}`);
  }

  // Manual test scenarios for features that can't be automated
  async runManualTests(): Promise<void> {
    console.log('\n🎮 Manual Test Scenarios for Quiz Arena');
    console.log('=' .repeat(50));

    const manualTests = [
      {
        title: '🎯 Real-time Multiplayer Experience',
        steps: [
          '1. Open two browser windows/tabs',
          '2. Create room in first window (host)',
          '3. Join room in second window (participant)', 
          '4. Start quiz and verify real-time sync',
          '5. Submit answers and check leaderboard updates'
        ],
        expected: 'Both windows show synchronized quiz state and leaderboard'
      },
      {
        title: '📱 Mobile Responsiveness',
        steps: [
          '1. Open Quiz Arena on mobile device',
          '2. Create or join a room',
          '3. Test touch interactions for answer selection',
          '4. Verify timer and UI elements are readable',
          '5. Test landscape/portrait orientation'
        ],
        expected: 'Smooth mobile experience with proper touch targets'
      },
      {
        title: '🌐 Cross-Platform Compatibility',
        steps: [
          '1. Host creates room on desktop Chrome',
          '2. Player 1 joins on mobile Safari',
          '3. Player 2 joins on tablet Firefox',
          '4. Player 3 joins on desktop Edge',
          '5. Run complete quiz session'
        ],
        expected: 'All platforms work seamlessly together'
      },
      {
        title: '⚡ Network Interruption Recovery',
        steps: [
          '1. Start quiz session with multiple players',
          '2. Temporarily disconnect one player\'s internet',
          '3. Reconnect after 10 seconds',
          '4. Verify player can rejoin and continue',
          '5. Check data consistency'
        ],
        expected: 'Graceful reconnection without data loss'
      },
      {
        title: '🔒 Security & Anti-Cheat',
        steps: [
          '1. Open browser developer tools',
          '2. Try to modify answer submission requests',
          '3. Attempt to submit answers for other players',
          '4. Try to access host controls as participant',
          '5. Verify all attempts are blocked'
        ],
        expected: 'All cheating attempts are prevented'
      }
    ];

    manualTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.title}`);
      console.log('   Steps:');
      test.steps.forEach(step => console.log(`      ${step}`));
      console.log(`   Expected: ${test.expected}`);
    });

    console.log('\n📋 Manual Testing Checklist:');
    console.log('   □ Real-time multiplayer sync works perfectly');
    console.log('   □ Mobile experience is smooth and responsive');
    console.log('   □ Cross-platform compatibility verified');
    console.log('   □ Network interruptions handled gracefully');
    console.log('   □ Security measures prevent cheating');
    console.log('   □ UI/UX is intuitive and engaging');
    console.log('   □ Performance is acceptable under load');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new QuizArenaTestRunner();
  
  runner.runAllTests().then(() => {
    runner.runManualTests();
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export default QuizArenaTestRunner;