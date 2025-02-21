
import { Book, ShoppingCart, Mail, Sun, Moon, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className={cn(
      "min-h-screen bg-secondary-light dark:bg-text-dark transition-colors duration-300",
      theme === "dark" ? "dark" : ""
    )}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-arabic font-bold text-primary">قارئ</h1>
            <span className="text-text-light">Qari</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Globe className="w-5 h-5 text-primary" />
            <Mail className="w-5 h-5 text-primary" />
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark">
              Discover the World Through Books
            </h1>
            <p className="text-lg md:text-xl text-text-light">
              Your premium destination for Arabic and international literature.
              Free shipping worldwide on orders over $50.
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors duration-300 animate-scale-in">
              Browse Books
            </button>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Book Card - To be replaced with dynamic data */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 animate-scale-in">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-text-dark mb-2">Book Title</h3>
                <p className="text-text-light mb-4">Author Name</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">$29.99</span>
                  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
