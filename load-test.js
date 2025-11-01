// Load Testing Configuration for QuizzicalLabzᴬᴵ
// Run with: k6 run load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Test configuration
export let options = {
  stages: [
    // Ramp up
    { duration: '2m', target: 10 },   // Ramp up to 10 users over 2 minutes
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },  // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.05'],    // Error rate must be below 5%
    errors: ['rate<0.05'],             // Custom error rate below 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://quizzicallabz.qzz.io';

// Test scenarios
const scenarios = {
  homepage: {
    weight: 30,
    url: '/',
    name: 'Homepage Load'
  },
  health_check: {
    weight: 10,
    url: '/api/health',
    name: 'Health Check'
  },
  login_page: {
    weight: 20,
    url: '/login',
    name: 'Login Page'
  },
  signup_page: {
    weight: 15,
    url: '/signup',
    name: 'Signup Page'
  },
  pricing_page: {
    weight: 15,
    url: '/pricing',
    name: 'Pricing Page'
  },
  quiz_arena: {
    weight: 10,
    url: '/quiz-arena',
    name: 'Quiz Arena'
  }
};

function selectScenario() {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [key, scenario] of Object.entries(scenarios)) {
    cumulative += scenario.weight;
    if (random <= cumulative) {
      return scenario;
    }
  }
  
  return scenarios.homepage; // fallback
}

export default function() {
  const scenario = selectScenario();
  const url = `${BASE_URL}${scenario.url}`;
  
  // Make HTTP request
  const response = http.get(url, {
    headers: {
      'User-Agent': 'k6-load-test/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    },
    timeout: '30s',
  });

  // Record custom metrics
  responseTime.add(response.timings.duration);
  errorRate.add(response.status !== 200);

  // Perform checks
  const checkResult = check(response, {
    [`${scenario.name}: status is 200`]: (r) => r.status === 200,
    [`${scenario.name}: response time < 2000ms`]: (r) => r.timings.duration < 2000,
    [`${scenario.name}: response time < 5000ms`]: (r) => r.timings.duration < 5000,
    [`${scenario.name}: content length > 0`]: (r) => r.body.length > 0,
  });

  // Additional checks for specific endpoints
  if (scenario.url === '/api/health') {
    check(response, {
      'Health check: contains status': (r) => r.body.includes('status'),
      'Health check: is JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
    });
  }

  if (scenario.url === '/') {
    check(response, {
      'Homepage: contains title': (r) => r.body.includes('Quizzicallabz'),
      'Homepage: contains navigation': (r) => r.body.includes('nav') || r.body.includes('menu'),
    });
  }

  // Log errors for debugging
  if (response.status !== 200) {
    console.error(`❌ ${scenario.name} failed: ${response.status} ${response.status_text}`);
  }

  // Simulate user think time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

// Setup function (runs once at the beginning)
export function setup() {
  console.log('🚀 Starting load test for QuizzicalLabzᴬᴵ');
  console.log(`📍 Target URL: ${BASE_URL}`);
  
  // Verify the application is accessible
  const response = http.get(`${BASE_URL}/api/health`);
  if (response.status !== 200) {
    console.error('❌ Application health check failed. Aborting test.');
    return null;
  }
  
  console.log('✅ Application is healthy. Starting load test...');
  return { startTime: new Date().toISOString() };
}

// Teardown function (runs once at the end)
export function teardown(data) {
  if (data && data.startTime) {
    const duration = (new Date() - new Date(data.startTime)) / 1000;
    console.log(`🏁 Load test completed in ${duration} seconds`);
  }
  
  // Final health check
  const response = http.get(`${BASE_URL}/api/health`);
  if (response.status === 200) {
    console.log('✅ Application is still healthy after load test');
  } else {
    console.error('❌ Application health check failed after load test');
  }
}