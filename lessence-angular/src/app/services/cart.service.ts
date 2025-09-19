import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const items = sessionStorage.getItem('items');
      if (items) {
        this.cartItems = JSON.parse(items);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  private saveCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('items', JSON.stringify(this.cartItems));
      this.cartSubject.next(this.cartItems);
    }
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product): boolean {
    if (!this.isInCart(product.id)) {
      this.cartItems.push({ ...product, quantity: 1 });
      this.saveCart();
      return true;
    }
    return false;
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  getCartCount(): number {
    return this.cartItems.length;
  }

  private isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.id === productId);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    const product = this.cartItems.find(item => item.id === productId);
    if (product) {
      product.quantity = quantity;
      this.saveCart();
    }
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.price * (item.quantity || 1)), 0);
  }
} 