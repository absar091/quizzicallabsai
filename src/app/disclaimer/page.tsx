export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Educational Purpose</h2>
          <p>Quizzicallabzᴬᴵ at quizzicallabz.qzz.io is for educational use only. AI-generated content may contain errors.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Beta Platform</h2>
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <p className="font-semibold">Platform is in development. Features and availability may vary.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">No Guarantees</h2>
          <p>We don't guarantee learning outcomes or academic performance. Results vary by individual effort.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
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