
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span onClick={() => navigate("/")} className="text-2xl font-bold text-primary cursor-pointer font-arabic">
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
                >
                  تسجيل خروج
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
