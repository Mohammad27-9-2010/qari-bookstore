
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

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

  // Demo comments for demonstration
  const demoComments = [
    { 
      id: '1', 
      user_id: 'user1', 
      comment: 'كتاب رائع، استمتعت بقراءته كثيراً!', 
      created_at: new Date().toISOString() 
    },
    { 
      id: '2', 
      user_id: 'user2', 
      comment: 'محتوى ممتاز وأسلوب جذاب', 
      created_at: new Date(Date.now() - 86400000).toISOString() 
    }
  ];

  useEffect(() => {
    if (bookId) fetchComments();
  }, [bookId]);

  const fetchComments = async () => {
    try {
      // In a real app, we would fetch from Supabase here
      setComments(demoComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل التعليقات",
        variant: "destructive",
      });
    }
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
      // In a real app, we would save to Supabase here
      const newCommentObj = {
        id: Date.now().toString(),
        user_id: user.id,
        comment: newComment.trim(),
        created_at: new Date().toISOString()
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      
      toast({
        title: "تم إضافة التعليق بنجاح",
      });
    } catch (error: any) {
      console.error('Error submitting comment:', error);
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
