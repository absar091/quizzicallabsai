export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Educational Purpose</h2>
          <p>
            Quizzicallabzᴬᴵ, operated by QuizzicallabzTM, is designed for educational purposes only. 
            The AI-generated content is intended to supplement, not replace, traditional learning methods 
            and professional educational guidance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">AI-Generated Content</h2>
          <p>
            All quizzes, flashcards, and study materials are generated using artificial intelligence. 
            While we strive for accuracy, the content may contain errors or inaccuracies. 
            Users should verify information from authoritative sources.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibent mb-4">No Guarantee of Results</h2>
          <p>
            We do not guarantee specific learning outcomes or academic performance improvements. 
            Results may vary based on individual effort, study habits, and other factors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Medical and Professional Advice</h2>
          <p>
            Content related to medical, legal, or professional topics is for educational purposes only 
            and should not be considered professional advice. Always consult qualified professionals 
            for specific guidance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Platform Availability</h2>
          <p>
            Quizzicallabzᴬᴵ is currently in development. Features, availability, and performance 
            may vary. We reserve the right to modify or discontinue services without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p>
            For questions about this disclaimer:
            <br />
            Email: legal@quizzicallabs.com
            <br />
            Company: QuizzicallabzTM
          </p>
        </section>
      </div>
    </div>
  );
}