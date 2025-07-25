
import type { ReactNode } from "react";
import { BrainCircuit } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div><div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <BrainCircuit className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Quizzicallabs AI</h1>
          <p className="text-muted-foreground">Your AI-powered learning partner.</p>
        </div>
        {children}
      </div>
    </main>
  );
}
