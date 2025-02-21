
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
      }
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light dark:bg-text-dark">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 font-arabic">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 font-arabic" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 font-arabic" htmlFor="password">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full font-arabic" 
            disabled={loading}
          >
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </Button>
          <p className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-arabic"
            >
              {isLogin ? 'إنشاء حساب جديد' : 'لديك حساب؟ سجل دخولك'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
