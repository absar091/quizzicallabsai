// Script to generate Postman collection JSON
const collection = {
  "info": {
    "name": "Quizzicallabs AI API",
    "description": "Complete API collection for Quizzicallabs AI platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health & Monitoring",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/health",
              "host": ["{{api_base}}"],
              "path": ["health"]
            },
            "description": "Check overall system health including database, AI, email, and storage"
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has overall status', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('overall');",
                  "    pm.expect(jsonData.overall).to.have.property('status');",
                  "});",
                  "",
                  "pm.test('All services are healthy', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.overall.status).to.eql('healthy');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ]
        }
      ]
    },
    {
      "name": "AI Endpoints",
      "item": [
        {
          "name": "AI Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/ai/health",
              "host": ["{{api_base}}"],
              "path": ["ai", "health"]
            }
          },
          "response": []
        },
        {
          "name": "Generate Custom Quiz",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"topic\": \"JavaScript Basics\",\n  \"difficulty\": \"medium\",\n  \"questionCount\": 5\n}"
            },
            "url": {
              "raw": "{{api_base}}/ai/custom-quiz",
              "host": ["{{api_base}}"],
              "path": ["ai", "custom-quiz"]
            }
          },
          "response": []
        },
        {
          "name": "Generate Study Guide",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"topic\": \"React Hooks\",\n  \"depth\": \"comprehensive\"\n}"
            },
            "url": {
              "raw": "{{api_base}}/ai/study-guide",
              "host": ["{{api_base}}"],
              "path": ["ai", "study-guide"]
            }
          },
          "response": []
        },
        {
          "name": "Generate Flashcards",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"topic\": \"TypeScript Types\",\n  \"count\": 10\n}"
            },
            "url": {
              "raw": "{{api_base}}/ai/flashcards",
              "host": ["{{api_base}}"],
              "path": ["ai", "flashcards"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Send Verification Email",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\"\n}"
            },
            "url": {
              "raw": "{{api_base}}/auth/send-verification",
              "host": ["{{api_base}}"],
              "path": ["auth", "send-verification"]
            }
          },
          "response": []
        },
        {
          "name": "Check Verification Status",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/auth/check-verification",
              "host": ["{{api_base}}"],
              "path": ["auth", "check-verification"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Subscription",
      "item": [
        {
          "name": "Get Subscription Status",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/subscription/status",
              "host": ["{{api_base}}"],
              "path": ["subscription", "status"]
            }
          },
          "response": []
        },
        {
          "name": "Get Usage Stats",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/subscription/usage",
              "host": ["{{api_base}}"],
              "path": ["subscription", "usage"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Quiz Arena",
      "item": [
        {
          "name": "Validate Room",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"roomCode\": \"TEST123\"\n}"
            },
            "url": {
              "raw": "{{api_base}}/quiz-arena/validate-room",
              "host": ["{{api_base}}"],
              "path": ["quiz-arena", "validate-room"]
            }
          },
          "response": []
        },
        {
          "name": "Get Room Analytics",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{api_base}}/quiz-arena/room-analytics?roomCode=TEST123",
              "host": ["{{api_base}}"],
              "path": ["quiz-arena", "room-analytics"],
              "query": [
                {
                  "key": "roomCode",
                  "value": "TEST123"
                }
              ]
            }
          },
          "response": []
        }
      ]
    }
  ]
};

console.log(JSON.stringify(collection, null, 2));
