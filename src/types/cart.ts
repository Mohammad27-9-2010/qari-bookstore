
export interface Book {
  id: string;  // Changed from number to string
  title: string;
  author: string;
  price: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
