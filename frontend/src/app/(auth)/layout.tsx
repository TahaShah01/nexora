import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
        {children}
      </main>
      <Footer />
    </>
  );
}
