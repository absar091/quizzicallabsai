export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance</h2>
          <p>By using Quizzicallabzᴬᴵ at quizzicallabz.qzz.io, you agree to these terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service</h2>
          <p>AI-powered educational platform for personalized quizzes and study materials.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Prohibited Content</h2>
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
            <p className="font-bold text-red-700 mb-2">IMMEDIATE BAN for:</p>
            <ul className="list-disc pl-6 text-red-600">
              <li>Harmful, illegal, or inappropriate content</li>
              <li>Content involving minors inappropriately</li>
              <li>Violence, hate, discrimination</li>
              <li>Security bypass attempts</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Account Bans</h2>
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <p className="font-bold">Policy violations = permanent ban + email blocked.</p>
            <p>Appeal: hello@quizzicallabz.qzz.io</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Website:</strong> <a href="https://quizzicallabz.qzz.io" className="text-blue-600">quizzicallabz.qzz.io</a></p>
              <p><strong>Support:</strong> hello@quizzicallabz.qzz.io</p>
            </div>
            <div>
              <p><strong>Legal:</strong> legal@quizzicallabz.qzz.io</p>
              <p><strong>Company:</strong> QuizzicallabzTM</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}