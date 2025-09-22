import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../interfaces/product.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
    });
  }

  removeFromCart(item: Product) {
    this.cartService.removeFromCart(item.id);
    // iterações futuras serão refletidas pela subscrição ativa
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
      try {
        // Simula processamento da compra
        const total = this.getTotal();
        console.log(`Compra finalizada! Total: ${this.formatPrice(total)}`);
        
        // Mostra notificação de sucesso
        this.notificationService.success('Compra finalizada com sucesso!');
        
        // Limpa o carrinho
        this.cartService.clearCart();
        this.loadCart();
      } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        this.notificationService.error('Erro ao finalizar compra. Tente novamente.');
      }
    } else {
      this.notificationService.warning('Carrinho vazio!');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
