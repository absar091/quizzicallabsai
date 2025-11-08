'use client';

import { useState } from 'react';
import { RecaptchaV3Component } from '@/components/recaptcha-v3';
import { useRecaptchaV3 } from '@/hooks/useRecaptchaV3';
import { useRecaptchaV3Context } from '@/components/recaptcha-v3-provider';

export default function TestRecaptchaV3Page() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useRecaptchaV3();
  const { isLoaded, isLoading, error } = useRecaptchaV3Context();

  const addTestResult = (result: any) => {
    setTestResults(prev => [{ ...result, timestamp: new Date().toISOString() }, ...prev]);
  };

  const testDi