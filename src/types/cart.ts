
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
