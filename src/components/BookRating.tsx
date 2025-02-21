
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface BookRatingProps {
  bookId: string;
}

export const BookRating = ({ bookId }: BookRatingProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRatings();
    if (user) {
      fetchUserRating();
    }
  }, [bookId, user]);

  const fetchRatings = async () => {
    const { data: ratings, error } = await supabase
      .from('book_ratings')
      .select('rating')
      .eq('book_id', bookId);

    if (error) {
      console.error('Error fetching ratings:', error);
      return;
    }

    if (ratings.length > 0) {
      const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      setAverageRating(average);
      setTotalRatings(ratings.length);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('book_ratings')
      .select('rating')
      .eq('book_id', bookId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Error fetching user rating:', error);
      }
      return;
    }

    if (data) {
      setRating(data.rating);
    }
  };

  const handleRating = async (value: number) => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول لتقييم الكتاب",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('book_ratings')
        .upsert({
          book_id: bookId,
          user_id: user.id,
          rating: value,
        });

      if (error) throw error;

      setRating(value);
      fetchRatings();
      toast({
        title: "تم التقييم بنجاح",
        description: "شكراً لمشاركة رأيك",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => handleRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                (hoveredRating !== null ? value <= hoveredRating : value <= (rating || 0))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {averageRating !== null && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
          {`${averageRating.toFixed(1)} من 5 (${totalRatings} تقييم)`}
        </p>
      )}
    </div>
  );
};
