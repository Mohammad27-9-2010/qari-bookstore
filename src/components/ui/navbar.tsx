
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/auth");
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

  // Ensure user is redirected to auth page if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span 
              onClick={() => navigate("/")} 
              className="text-2xl font-bold text-primary cursor-pointer font-arabic"
            >
              قارئ
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-arabic">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="font-arabic"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                className="font-arabic"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
