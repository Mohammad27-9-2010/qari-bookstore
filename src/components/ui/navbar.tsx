
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Success toast
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
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
                <div className="flex items-center gap-4">
                  <span className="text-sm font-arabic backdrop-blur-sm bg-white/10 dark:bg-black/10 px-3 py-1.5 rounded-full">
                    {user.email}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="font-arabic backdrop-blur-sm bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
