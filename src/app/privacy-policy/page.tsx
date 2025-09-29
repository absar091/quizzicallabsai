export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Quizzicallabzᴬᴵ ("we," "our," or "us"), operated by QuizzicallabzTM. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our AI-powered educational platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Email address and display name</li>
            <li>Account preferences and settings</li>
            <li>Quiz performance and learning progress</li>
            <li>Device information and IP address</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Usage Data</h3>
          <ul className="list-disc pl-6">
            <li>Quiz attempts and scores</li>
            <li>Study materials uploaded</li>
            <li>AI interaction logs (anonymized)</li>
            <li>Platform usage analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>Provide and improve our AI-powered educational services</li>
            <li>Generate personalized quizzes and study materials</li>
            <li>Track learning progress and performance analytics</li>
            <li>Send important service notifications</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption, 
            secure authentication, and regular security audits to protect your data. 
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide 
            our services and comply with legal obligations. You may request deletion 
            of your account and associated data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <ul className="list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            For privacy-related questions or requests, contact us at:
            <br />
            Email: privacy@quizzicallabs.com\
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