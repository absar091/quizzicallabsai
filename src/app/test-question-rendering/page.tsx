'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import RichContentRenderer from '@/components/rich-content-renderer';

export default function TestQuestionRenderingPage() {
  const testQuestions = [
    {
      title: "HTML Entity Test",
      content: "A rocket ejects fuel downwards with a speed &#x27;v&#x27; relative to the rocket. If the rate of mass ejection is &#x27;dm&#x2F;dt&#x27;, the thrust on the rocket is given by:",
      expected: "A rocket ejects fuel downwards with a speed 'v' relative to the rocket. If the rate of mass ejection is 'dm/dt', the thrust on the rocket is given by:"
    },
    {
      title: "Apostrophe Test",
      content: "What&#x27;s the difference between Newton&#x27;s first and second laws?",
      expected: "What's the difference between Newton's first and second laws?"
    },
    {
      title: "Mixed Entities Test", 
      content: "The equation F &#x3D; ma shows that force &#x27;F&#x27; equals mass &#x27;m&#x27; times acceleration &#x27;a&#x27;.",
      expected: "The equation F = ma shows that force 'F' equals mass 'm' times acceleration 'a'."
    },
    {
      title: "Math Expression Test",
      content: "If x&#x27; &#x3D; 2x &#x2B; 3, find the value when x &#x3D; 5.",
      expected: "If x' = 2x + 3, find the value when x = 5."
    },
    {
      title: "Normal Text Test",
      content: "This is normal text without any HTML entities.",
      expected: "This is normal text without any HTML entities."
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Question Rendering Test" 
        description="Test how questions with HTML entities are rendered"
      />

      <div className="grid gap-6">
        {testQuestions.map((test, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription>
                Testing HTML entity decoding in question text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Raw Content */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Raw Content (with entities):</h4>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg font-mono text-sm">
                  {test.content}
                </div>
              </div>

              {/* Expected Result */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Expected Result:</h4>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  {test.expected}
                </div>
              </div>

              {/* Actual Rendered Result */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Actual Rendered Result:</h4>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <RichContentRenderer content={test.content} />
                </div>
              </div>

              {/* Inline Rendered Result */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Inline Rendered Result:</h4>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <RichContentRenderer content={test.content} inline />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Test</CardTitle>
          <CardDescription>
            Verify that HTML entities are properly decoded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-green-600 mb-2">✅ What Should Work:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• HTML entities like `&#x27;` should display as `'`</li>
                <li>• HTML entities like `&#x2F;` should display as `/`</li>
                <li>• HTML entities like `&#x3D;` should display as `=`</li>
                <li>• Normal text should remain unchanged</li>
                <li>• Both block and inline rendering should work</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-red-600 mb-2">❌ What Should NOT Happen:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• HTML entities should not appear as raw text</li>
                <li>• Characters should not be double-encoded</li>
                <li>• Text should not be corrupted or malformed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}