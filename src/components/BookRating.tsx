
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

  // Convert numeric IDs to UUID format for Supabase
  const getBookUuid = (id: string) => {
    if (id.includes('-')) return id; // Already a UUID
    return `00000000-0000-0000-0000-00000000000${id}`;
  };

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
      // Use local calculation for demo purposes
      const demoRatings = [
        { rating: 4 },
        { rating: 5 },
        { rating: 3 }
      ];
      
      const average = demoRatings.reduce((sum, r) => sum + r.rating, 0) / demoRatings.length;
      setAverageRating(average);
      setTotalRatings(demoRatings.length);
    } catch (error: any) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;

    try {
      // For demo, just set a random rating
      const randomRating = Math.floor(Math.random() * 5) + 1;
      setRating(randomRating);
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
      // In a real app, we would save to Supabase here
      setRating(value);
      
      // Update the average rating for demo purposes
      const newAverage = averageRating ? 
        (averageRating * totalRatings - (rating || 0) + value) / totalRatings : 
        value;
      
      setAverageRating(newAverage);
      
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
