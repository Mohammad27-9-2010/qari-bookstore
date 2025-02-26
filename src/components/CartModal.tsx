
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { Minus, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (bookId: string, change: number) => void;
  onRemoveItem: (bookId: string) => void;
  lang: "en" | "ar" | "fr";
}

const translations = {
  ar: {
    cart: "عربة التسوق",
    empty: "عربة التسوق فارغة",
    total: "المجموع:",
    checkout: "إتمام الشراء",
    close: "إغلاق",
    phone: "رقم الهاتف",
    submit: "تأكيد الطلب",
    checkoutSuccess: "تم تقديم طلبك بنجاح",
    checkoutError: "حدث خطأ أثناء معالجة طلبك",
    loginRequired: "يرجى تسجيل الدخول للمتابعة",
    phoneRequired: "رقم الهاتف مطلوب",
  },
  en: {
    cart: "Shopping Cart",
    empty: "Your cart is empty",
    total: "Total:",
    checkout: "Checkout",
    close: "Close",
    phone: "Phone Number",
    submit: "Place Order",
    checkoutSuccess: "Your order has been placed successfully",
    checkoutError: "An error occurred while processing your order",
    loginRequired: "Please log in to continue",
    phoneRequired: "Phone number is required",
  },
  fr: {
    cart: "Panier",
    empty: "Votre panier est vide",
    total: "Total:",
    checkout: "Commander",
    close: "Fermer",
    phone: "Numéro de téléphone",
    submit: "Confirmer la commande",
    checkoutSuccess: "Votre commande a été passée avec succès",
    checkoutError: "Une erreur est survenue lors du traitement de votre commande",
    loginRequired: "Veuillez vous connecter pour continuer",
    phoneRequired: "Numéro de téléphone requis",
  }
};

export const CartModal = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, lang }: CartModalProps) => {
  const { toast } = useToast();
  const t = translations[lang];
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const startCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: t.loginRequired,
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
  };

  const handleCheckout = async () => {
    if (!phoneNumber) {
      toast({
        title: t.phoneRequired,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const orderData = {
        user_id: session.user.id,
        total_amount: total,
        shipping_address: { phone_number: phoneNumber },
        status: 'pending'
      };

      // Insert the order into the database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        book_id: item.book.id,
        quantity: item.quantity,
        price_at_time: item.book.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: t.checkoutSuccess,
      });
      onClose();
      setIsCheckingOut(false);
      setPhoneNumber("");
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t.checkoutError,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-arabic">{t.cart}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 font-arabic">{t.empty}</p>
          ) : !isCheckingOut ? (
            <>
              {items.map((item) => (
                <div key={item.book.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <h3 className="font-bold font-arabic">{item.book.title}</h3>
                    <p className="text-sm text-gray-500 font-arabic">{item.book.price} $</p>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.book.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.book.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.book.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold font-arabic">{t.total}</span>
                <span className="font-bold">{total.toFixed(2)} $</span>
              </div>
              <Button className="w-full font-arabic" onClick={startCheckout}>
                {t.checkout}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 font-arabic" htmlFor="phone">
                  {t.phone}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button 
                className="w-full font-arabic" 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {t.submit}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
