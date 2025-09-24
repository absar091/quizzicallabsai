import { NextResponse } from 'next/server';

export async function GET() {
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