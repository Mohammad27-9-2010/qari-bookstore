
export interface Book {
  id: string;  // UUID type
  title: string;
  author: string;
  price: number;
  category?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
