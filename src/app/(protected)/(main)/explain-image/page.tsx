import { PageHeader } from '@/components/page-header';
import ImageExplanation from '@/components/image-explanation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Image Explanation | Quizzicallabzᴬᴵ',
  description: 'Upload images and get detailed AI-powered explanations. Perfect for understanding diagrams, charts, and educational content.',
};

export default function ExplainImagePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Image Explanation"
        description="Upload any image and get detailed explanations powered by advanced AI"
      />
      
      <ImageExplanation />
      
      {/* Usage Tips */}
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Best Results</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Clear, high-quality images work best</li>
              <li>• Educational diagrams and charts</li>
              <li>• Scientific illustrations</li>
              <li>• Mathematical problems and graphs</li>
              <li>• Historical documents and maps</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Example Questions</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>• "Explain this biological process"</li>
              <li>• "What does this diagram show?"</li>
              <li>• "Describe the components and their functions"</li>
              <li>• "How does this system work?"</li>
              <li>• "What is the main concept illustrated?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}