import { NextRequest, NextResponse } from 'next/server';
import { subscriptionConfirmationEmailTemplate } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  try {
    // Sample subscription data for preview
    const subscriptionData = {
      planName: 'Pro Plan',
      amount: '2.00',
      currency: 'USD',
      orderId: 'sub_1759593085504_bec5ok9nb',
      activationDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const template = subscriptionConfirmationEmailTemplate('Sarah Johnson', subscriptionData);

    return new NextResponse(template.html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: any) {
    console.error('Preview subscription email error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}