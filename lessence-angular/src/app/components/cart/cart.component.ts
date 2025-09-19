import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
    });
  }

  removeFromCart(item: Product) {
    this.cartService.removeFromCart(item.id);
    this.loadCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  finishPurchase() {
    if (this.cartItems.length > 0) {
      alert('Compra finalizada com sucesso!');
      this.cartService.clearCart();
      this.loadCart();
    }
  }
}
