import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { SearchService } from '../../services/search.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  userName: string | null = null;
  cartCount: number = 0;
  categories: string[] = [];
  selectedCategory: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.categories = this.categoryService.getCategories();

    combineLatest([
      this.cartService.getCart(),
      this.authService.userName$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cartItems, userName]) => {
        this.cartCount = cartItems.length;
        this.userName = userName || null;
      });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
