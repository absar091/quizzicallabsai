export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
          <p>Quizzicallabzᴬᴵ (QuizzicallabzTM) at quizzicallabz.qzz.io collects minimal data to provide AI-powered educational services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Personal Data</h3>
              <ul className="text-sm space-y-1">
                <li>• Email & display name</li>
                <li>• Quiz scores & progress</li>
                <li>• Study preferences</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <ul className="text-sm space-y-1">
                <li>• Platform interactions</li>
                <li>• AI query logs (anonymized)</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personalized AI quiz generation</li>
            <li>Learning progress tracking</li>
            <li>Platform security & fraud prevention</li>
            <li>Service improvements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold mb-2">You can:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>• Access your data</span>
              <span>• Delete your account</span>
              <span>• Correct information</span>
              <span>• Export your data</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Website:</strong> <a href="https://quizzicallabz.qzz.io" className="text-blue-600">quizzicallabz.qzz.io</a></p>
              <p><strong>Privacy:</strong> privacy@quizzicallabz.qzz.io</p>
            </div>
            <div>
              <p><strong>Support:</strong> hello@quizzicallabz.qzz.io</p>
              <p><strong>Company:</strong> QuizzicallabzTM</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}