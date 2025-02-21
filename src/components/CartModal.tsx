
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";
import { Minus, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (bookId: number, change: number) => void;
  onRemoveItem: (bookId: number) => void;
  lang: "en" | "ar" | "fr";
}

const translations = {
  ar: {
    cart: "عربة التسوق",
    empty: "عربة التسوق فارغة",
    total: "المجموع:",
    checkout: "إتمام الشراء",
    close: "إغلاق",
  },
  en: {
    cart: "Shopping Cart",
    empty: "Your cart is empty",
    total: "Total:",
    checkout: "Checkout",
    close: "Close",
  },
  fr: {
    cart: "Panier",
    empty: "Votre panier est vide",
    total: "Total:",
    checkout: "Commander",
    close: "Fermer",
  }
};

export const CartModal = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, lang }: CartModalProps) => {
  const { toast } = useToast();
  const t = translations[lang];

  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const handleCheckout = () => {
    toast({
      title: "Coming soon!",
      description: "Checkout functionality will be implemented soon.",
    });
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
          ) : (
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
              <Button className="w-full font-arabic" onClick={handleCheckout}>
                {t.checkout}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
