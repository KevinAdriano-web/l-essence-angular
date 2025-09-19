import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // Masculino
    {
      id: 1,
      name: "Sauvage Parfum",
      price: 850.00,
      image: "assets/media/Masculino/DiorSauvageParfum.JPG",
      categories: ["masculino", "amadeirado"],
      description: "Dior - 100 ml"
    },
    {
      id: 2,
      name: "Bleu de Chanel",
      price: 720.00,
      image: "assets/media/Masculino/Bleu de Chanel.JPG",
      categories: ["masculino", "cítrico"],
      description: "Chanel - 50 ml"
    },
    {
      id: 7,
      name: "Aqua di Gio",
      price: 680.00,
      image: "assets/media/Masculino/Aqua di Gio Eau de Parfum.png",
      categories: ["masculino", "floral"],
      description: "Giorgio Armani - 75 ml"
    },
    // Feminino
    {
      id: 12,
      name: "Black Orchid",
      price: 599.90,
      image: "assets/media/Feminino/tom ford black orchid - Amadeirado.jpg",
      categories: ["feminino", "amadeirado"],
      description: "Tom Ford - 50 ml"
    },
    {
      id: 15,
      name: "Chance Eau Fraîche",
      price: 719.90,
      image: "assets/media/Feminino/Chanel - chance - Cítrico.png",
      categories: ["feminino", "cítrico"],
      description: "Chanel - 50 ml"
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    if (category.toLowerCase() === 'todos') {
      return this.getProducts();
    }
    return of(this.products.filter(product => 
      product.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
    ));
  }

  searchProducts(query: string): Observable<Product[]> {
    const searchTerm = query.toLowerCase();
    return of(this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.categories.some(cat => cat.toLowerCase().includes(searchTerm))
    ));
  }
} 