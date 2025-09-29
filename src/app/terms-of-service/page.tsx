export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Quizzicallabzᴬᴵ, operated by QuizzicallabzTM, 
            you agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p>
            Quizzicallabzᴬᴵ is an AI-powered educational platform that generates 
            personalized quizzes, flashcards, and study materials to enhance learning experiences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Prohibited Content and Conduct</h2>
          <p className="font-semibold text-red-600 mb-4">
            The following activities are strictly prohibited and will result in immediate account termination:
          </p>
          <ul className="list-disc pl-6">
            <li>Generating or requesting harmful, illegal, or inappropriate content</li>
            <li>Creating content involving minors in inappropriate contexts</li>
            <li>Requesting violent, hateful, or discriminatory material</li>
            <li>Attempting to bypass security measures or abuse AI systems</li>
            <li>Sharing accounts or violating rate limits</li>
            <li>Using the platform for illegal activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Account Termination</h2>
          <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <strong>Policy Violations:</strong> Accounts that violate our content policy 
            or security measures will be permanently banned. Both the account and associated 
            email address will be blocked. If you believe this was done in error, 
            contact support@quizzicallabs.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p>
            All content generated through our AI systems remains your property. 
            However, you grant us a license to use anonymized data to improve our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibent mb-4">6. Limitation of Liability</h2>
          <p>
            QuizzicallabzTM provides this service "as is" without warranties. 
            We are not liable for any damages arising from your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p>
            For questions about these terms:
            <br />
            Email: legal@quizzicallabs.com
            <br />
            Support: support@quizzicallabs.com
            <br />
            Website: <a href="https://quizzicallabz.qzz.io" className="text-blue-600 hover:underline">quizzicallabz.qzz.io</a>
            <br />
            Company: QuizzicallabzTM
          </p>
        </section>
      </div>
    </div>
  );
}