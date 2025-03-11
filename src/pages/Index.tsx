import { Book, ShoppingCart, Mail, Sun, Moon, Globe, Search } from "lucide-react";
import { useState } from "react";
import { cn, type Language, languages } from "@/lib/utils";
import { CartModal } from "@/components/CartModal";
import type { Book as BookType, CartItem } from "@/types/cart";
import { BookRating } from "@/components/BookRating";
import { BookComments } from "@/components/BookComments";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<Language>("ar");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const books: BookType[] = [
    {
      id: "1",
      title: "كتاب الأيام",
      author: "طه حسين",
      price: 29.99,
      category: "سيرة ذاتية"
    },
    {
      id: "2",
      title: "مقدمة ابن خلدون",
      author: "ابن خلدون",
      price: 34.99,
      category: "تاريخ وفلسفة"
    },
    {
      id: "3",
      title: "ألف ليلة وليلة",
      author: "مؤلف مجهول",
      price: 24.99,
      category: "أدب كلاسيكي"
    },
  ];

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLang(languages[nextIndex]);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const addToCart = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.book.id === bookId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { book, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (bookId: string, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.book.id === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeCartItem = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId));
  };

  const content = {
    ar: {
      title: "اكتشف عالماً من الكتب",
      subtitle: "وجهتك المميزة للكتب العربية والعالمية. شحن مجاني للطلبات التي تزيد عن 50 دولار",
      browse: "تصفح الكتب",
      featured: "الكتب المميزة",
      category: "التصنيف",
      price: "السعر",
      addToCart: "أضف إلى السلة",
      register: "سجل الآن للشراء والتقييم",
      registerButton: "إنشاء حساب",
      search: "ابحث عن الكتب",
    },
    en: {
      title: "Discover the World Through Books",
      subtitle: "Your premium destination for Arabic and international literature. Free shipping worldwide on orders over $50.",
      browse: "Browse Books",
      featured: "Featured Books",
      category: "Category",
      price: "Price",
      addToCart: "Add to Cart",
      register: "Register now to purchase and rate books",
      registerButton: "Create Account",
      search: "Search books",
    },
    fr: {
      title: "Découvrez le Monde à Travers les Livres",
      subtitle: "Votre destination premium pour la littérature arabe et internationale. Livraison gratuite dans le monde entier pour les commandes de plus de 50$.",
      browse: "Parcourir les Livres",
      featured: "Livres en Vedette",
      category: "Catégorie",
      price: "Prix",
      addToCart: "Ajouter au Panier",
      register: "Inscrivez-vous pour acheter et noter",
      registerButton: "Créer un compte",
      search: "Rechercher des livres",
    }
  };

  const t = content[lang];

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-secondary-light via-background to-secondary dark:from-text-dark dark:via-background dark:to-text transition-colors duration-300",
      theme === "dark" ? "dark" : ""
    )}>
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h1 className="text-2xl font-arabic font-bold text-primary">قارئ</h1>
            <span className="text-text-light">Qari</span>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="تغيير اللغة"
            >
              <Globe className="w-5 h-5 text-primary" />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="البريد الإلكتروني"
            >
              <Mail className="w-5 h-5 text-primary" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="عربة التسوق"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeCartItem}
        lang={lang}
      />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in backdrop-blur-sm bg-white/30 dark:bg-black/30 p-8 rounded-2xl border border-white/20 dark:border-white/10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark font-arabic">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-text-light font-arabic">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors duration-300 animate-scale-in font-arabic"
                onClick={() => navigate(user ? "/" : "/auth")}
              >
                {t.browse}
              </Button>
              {!user && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-arabic">{t.register}</p>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    className="font-arabic"
                  >
                    {t.registerButton}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative backdrop-blur-xl bg-white/60 dark:bg-black/60 rounded-lg border border-white/20 dark:border-white/10 shadow-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12 font-arabic">{t.featured}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="backdrop-blur-xl bg-white/40 dark:bg-black/40 rounded-lg border border-white/20 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80"></div>
                <div className="p-6 space-y-4 backdrop-blur-sm bg-white/30 dark:bg-black/30">
                  <h3 className="font-bold text-lg text-text-dark dark:text-white mb-2 font-arabic">{book.title}</h3>
                  <p className="text-text-light dark:text-gray-300 mb-2 font-arabic">{book.author}</p>
                  <p className="text-text-light dark:text-gray-300 mb-4 font-arabic">{t.category}: {book.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold font-arabic">{book.price} $</span>
                    <button 
                      onClick={() => addToCart(book.id)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors duration-300 font-arabic"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                  <div className="pt-4 border-t">
                    <BookRating bookId={book.id} />
                  </div>
                  <div className="pt-4 border-t">
                    <BookComments bookId={book.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
