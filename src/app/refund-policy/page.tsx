export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-muted-foreground">Our commitment to customer satisfaction</p>
        </div>

        <div className="space-y-8">
          <p className="text-sm text-muted-foreground mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="bg-card border rounded-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">7-Day Money-Back Guarantee</h2>
              <p className="text-muted-foreground mb-4">
                We offer a 7-day money-back guarantee for all paid subscriptions. If you're not satisfied with our service, 
                you can request a full refund within 7 days of your initial purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Refund Eligibility</h2>
              <p className="text-muted-foreground mb-4">You are eligible for a refund if:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You request a refund within 7 days of your initial subscription purchase</li>
                <li>You have not violated our Terms of Service</li>
                <li>You have not engaged in fraudulent activity</li>
                <li>This is your first refund request for this account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Non-Refundable Items</h2>
              <p className="text-muted-foreground mb-4">The following are not eligible for refunds:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Subscription renewals (only initial purchases)</li>
                <li>Partial month subscriptions</li>
                <li>Accounts suspended for Terms of Service violations</li>
                <li>Refund requests made after 7 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How to Request a Refund</h2>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Contact our support team at support@quizzicallabz.com</li>
                <li>Include your account email and subscription details</li>
                <li>Provide a brief reason for your refund request</li>
                <li>We will process your request within 3-5 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Refund Processing</h2>
              <p className="text-muted-foreground mb-4">
                Once approved, refunds will be processed to your original payment method within 5-10 business days. 
                Your subscription will be immediately cancelled upon refund approval.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cancellation Policy</h2>
              <p className="text-muted-foreground mb-4">
                You can cancel your subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You will retain access until the end of your current billing period</li>
                <li>No refund will be provided for the remaining days</li>
                <li>Your account will automatically downgrade to the free plan</li>
                <li>You can resubscribe at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:support@quizzicallabz.com" className="text-primary hover:underline">support@quizzicallabz.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
