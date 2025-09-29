export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Security Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Reporting Security Vulnerabilities</h2>
          <p className="mb-4">
            We take security seriously at Quizzicallabs. If you discover a security vulnerability, 
            please report it responsibly.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>Email:</strong> security@quizzicallabz.qzz.io</p>
            <p><strong>Response Time:</strong> Within 48 hours</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What to Include</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Detailed description of the vulnerability</li>
            <li>Steps to reproduce the issue</li>
            <li>Potential impact assessment</li>
            <li>Your contact information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Security Measures</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and penetration testing</li>
            <li>Secure authentication with Firebase</li>
            <li>Content Security Policy implementation</li>
            <li>Regular dependency updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Responsible Disclosure</h2>
          <p>
            We appreciate security researchers who report vulnerabilities responsibly. 
            We commit to working with you to understand and resolve issues quickly.
          </p>
        </section>
      </div>
    </div>
  )
}