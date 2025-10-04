'use client';

import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function TestRecaptchaPage() {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            reCAPTCHA Test
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Site Key: {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'Set' : 'Not Set'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Value: {recaptchaValue || 'Not completed'}
              </p>
            </div>

            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(value) => {
                  console.log('reCAPTCHA value:', value);
                  setRecaptchaValue(value);
                }}
                onExpired={() => {
                  console.log('reCAPTCHA expired');
                  setRecaptchaValue(null);
                }}
                onError={(error) => {
                  console.error('reCAPTCHA error:', error);
                  setRecaptchaValue(null);
                }}
              />
            ) : (
              <div className="text-red-500 text-sm p-4 border border-red-200 rounded">
                reCAPTCHA site key is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.
              </div>
            )}

            {recaptchaValue && (
              <div className="text-green-600 text-sm p-4 border border-green-200 rounded bg-green-50">
                ✅ reCAPTCHA completed successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}