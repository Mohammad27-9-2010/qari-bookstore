
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

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
    if (bookId) {
      fetchRatings();
      if (user) {
        fetchUserRating();
      }
    }
  }, [bookId, user]);

  const fetchRatings = async () => {
    try {
      const { data: ratings, error } = await supabase
        .from('book_ratings')
        .select('rating')
        .eq('book_id', bookId);

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        setAverageRating(average);
        setTotalRatings(ratings.length);
      }
    } catch (error: any) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('book_ratings')
        .select('rating')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw error;
      }

      if (data) {
        setRating(data.rating);
      }
    } catch (error: any) {
      console.error('Error fetching user rating:', error);
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
      await fetchRatings();
      toast({
        title: "تم التقييم بنجاح",
        description: "شكراً لمشاركة رأيك",
      });
    } catch (error: any) {
      console.error('Error submitting rating:', error);
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
