import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Globe, Sun, Moon, Mail, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "ar" | "fr">("ar");

  const handleLogout = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const toggleLanguage = () => {
    const languages = ["en", "ar", "fr"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex] as "en" | "ar" | "fr");
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span 
                onClick={() => navigate("/")} 
                className="text-2xl font-bold text-primary cursor-pointer font-arabic hover:opacity-80 transition-opacity"
              >
                قارئ
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <HoverCard openDelay={0} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="relative font-arabic backdrop-blur-sm bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72" align="end">
                    <div className="space-y-3">
                      <div className="space-y-1 border-b pb-3">
                        <h4 className="font-medium font-arabic text-center">الحساب الشخصي</h4>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="rounded-md bg-secondary/50 p-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start font-arabic w-full"
                          onClick={toggleLanguage}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          <span>اللغة: {language === "ar" ? "العربية" : language === "en" ? "English" : "Français"}</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start font-arabic w-full"
                          onClick={toggleTheme}
                        >
                          {theme === "light" ? (
                            <>
                              <Moon className="mr-2 h-4 w-4" />
                              <span>الوضع الليلي</span>
                            </>
                          ) : (
                            <>
                              <Sun className="mr-2 h-4 w-4" />
                              <span>الوضع النهاري</span>
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start text-red-500 hover:text-red-600 font-arabic hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
                          onClick={handleLogout}
                          disabled={isLoading}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{isLoading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}</span>
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
