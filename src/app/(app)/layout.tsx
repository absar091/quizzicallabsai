
import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Footer } from "@/components/footer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <MainSidebar />
        <main className="flex-1 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </div>
            <Footer />
        </main>
    </SidebarProvider>
  );
}

    