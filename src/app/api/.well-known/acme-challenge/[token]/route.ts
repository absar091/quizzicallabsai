import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  
  // Firebase domain verification token
  if (token === 'ynQDI2sLWH8OVCEW319gVHppiG0iMABzKt66xqdDzQFnmQWjL0e48E0Rp7WRG3cO') {
    return new NextResponse(
      'ynQDI2sLWH8OVCEW319gVHppiG0iMABzKt66xqdDzQFnmQWjL0e48E0Rp7WRG3cO.M0-GObbb5ePi63ASQsPKBrDqfgayGnOWpyrEF0nHqug',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }
  
  return new NextResponse('Token not found', { status: 404 });
}