import Sidebar from "./Sidebar";
import { Header } from "./Header";

export default function AppLayout({ children, variant = "scroll" }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {variant === "flush" && (
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
        )}
        {variant === "fixed" && (
          <main className="flex min-w-0 flex-1 items-center justify-center overflow-hidden p-4">
            {children}
          </main>
        )}
        {variant === "center" && (
          <main className="min-w-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              {children}
            </div>
          </main>
        )}
        {variant === "scroll" && (
          <main className="min-w-0 flex-1 overflow-y-auto flex flex-col bg-background-secondary px-4 py-6 [scrollbar-gutter:stable] sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl mx-auto flex-1">{children}</div>
          </main>
        )}
      </div>
    </div>
  );
}
