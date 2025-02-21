
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface BookCommentsProps {
  bookId: string;
}

export const BookComments = ({ bookId }: BookCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('book_comments')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول لإضافة تعليق",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('book_comments').insert({
        book_id: bookId,
        user_id: user.id,
        comment: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      fetchComments();
      toast({
        title: "تم إضافة التعليق بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold font-arabic">التعليقات</h3>
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="أضف تعليقك..."
            className="w-full p-2 border rounded resize-none dark:bg-gray-700 dark:border-gray-600 font-arabic"
            rows={3}
          />
          <Button type="submit" disabled={loading} className="font-arabic">
            إضافة تعليق
          </Button>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 font-arabic">
          يرجى تسجيل الدخول لإضافة تعليق
        </p>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-arabic">{comment.comment}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 font-arabic">
                  {new Date(comment.created_at).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
