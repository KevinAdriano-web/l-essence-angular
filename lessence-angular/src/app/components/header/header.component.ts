import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  userName: string | null = null;
  cartCount: number = 0;
  categories: string[] = [
    'Todos',
    'Masculino',
    'Feminino',
    'Cítrico',
    'Amadeirado',
    'Floral'
  ];
  selectedCategory: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Inscrever-se nas mudanças do carrinho
    this.cartService.getCart().subscribe(() => {
      this.updateCartCount();
    });

    // Inscrever-se nas mudanças de autenticação e nome do usuário
    this.authService.userName$.subscribe(userName => {
      this.userName = userName || null;
    });

    // Inicializar contagem do carrinho
    this.updateCartCount();
  }

  private updateCartCount(): void {
    this.cartCount = this.cartService.getCartCount();
  }

  navigateToHome() {
    this.router.navigate(['/']);
    this.categoryService.setSelectedCategory('Todos');
    this.searchService.setSearchQuery('');
    this.selectedCategory = 'Todos';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToCart() {
    this.router.navigate(['/carrinho']);
  }

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.categoryService.setSelectedCategory(category);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
