import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"products" | "services">("products");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${searchType}?q=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <section className="relative overflow-hidden rounded-card border border-border bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative p-8 sm:p-16 text-center">
        <h1 className="text-4xl font-extrabold text-text-primary sm:text-5xl md:text-6xl tracking-tight mb-4">
          The marketplace for <br className="hidden sm:block" />
          <span className="text-primary">everyone and everything</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary sm:text-xl">
          Discover handpicked products and connect with top-rated professionals. 
          Your next great find is just a search away.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row p-2 bg-surface border border-border rounded-lg shadow-sm">
          <div className="flex w-full items-center pl-3">
            <Search className="h-5 w-5 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder={`Search ${searchType}...`}
              className="w-full bg-transparent p-2 text-text-primary outline-none placeholder:text-text-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 sm:shrink-0 px-2 sm:px-0">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "products" | "services")}
              className="bg-card text-text-primary border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm font-medium"
            >
              <option value="products">Products</option>
              <option value="services">Services</option>
            </select>
            <Button type="submit" className="px-6 font-semibold">
              Search
            </Button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-text-muted">
          <span>Popular:</span>
          <button onClick={() => router.push("/services?q=Web%20Design")} className="hover:text-primary transition-colors font-medium">Web Design</button>
          <button onClick={() => router.push("/products?q=Laptop")} className="hover:text-primary transition-colors font-medium">Laptops</button>
          <button onClick={() => router.push("/services?q=Marketing")} className="hover:text-primary transition-colors font-medium">Marketing</button>
          <button onClick={() => router.push("/products?q=Camera")} className="hover:text-primary transition-colors font-medium">Cameras</button>
        </div>
      </div>
    </section>
  );
}
