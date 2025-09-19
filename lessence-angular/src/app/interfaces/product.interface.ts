export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  categories: string[];
  description: string;
  quantity?: number;
} 