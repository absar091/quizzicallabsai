
import type { ReactNode } from "react";
import { BrainCircuit } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <BrainCircuit className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Quizzicallabs<sup className='font-serif text-2xl'>ᴬᴵ</sup></h1>
          <p className="text-muted-foreground">Your AI-powered learning partner.</p>
        </div>
        {children}
      </div>
    </main>
  );
}
