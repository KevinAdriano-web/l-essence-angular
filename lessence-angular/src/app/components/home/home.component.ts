import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { SearchService } from '../../services/search.service';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'Todos';
  showScrollButton = false;
  cartCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.updateCartCount();

    // Inscreve-se para atualizações do carrinho
    this.subscriptions.push(
      this.cartService.getCart().subscribe(() => {
        this.updateCartCount();
      })
    );

    // Inscreve-se para atualizações da categoria
    this.subscriptions.push(
      this.categoryService.selectedCategory$.subscribe(category => {
        this.selectedCategory = category;
        this.updateProductList();
      })
    );

    // Inscreve-se para atualizações da busca
    this.subscriptions.push(
      this.searchService.searchQuery$.subscribe(query => {
        this.searchQuery = query;
        this.updateProductList();
      })
    );
  }

  ngOnDestroy() {
    // Cancela todas as inscrições ao destruir o componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateCartCount(): void {
    this.cartCount = this.cartService.getCartCount();
  }

  loadProducts(): void {
    this.subscriptions.push(
      this.productService.getProducts().subscribe(products => {
        this.products = products;
        this.updateProductList();
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = window.scrollY;
    this.showScrollButton = scroll > 100;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateProductList(): void {
    // Se não houver produtos, retorna lista vazia
    if (!this.products.length) {
      this.filteredProducts = [];
      return;
    }

    // Primeiro aplica o filtro de busca
    let productsToFilter = this.filterBySearch(this.products);

    // Depois aplica o filtro de categoria
    if (this.selectedCategory === 'Todos') {
      this.filteredProducts = [...productsToFilter];
    } else {
      const category = this.selectedCategory.toLowerCase();
      this.filteredProducts = productsToFilter.filter(product => 
        product.categories.some(cat => cat.toLowerCase() === category)
      );
    }
  }

  filterBySearch(products: Product[]): Product[] {
    if (!this.searchQuery) return [...products];
    
    const query = this.searchQuery.toLowerCase().trim();
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }

  addToCart(product: Product): void {
    if (this.cartService.addToCart(product)) {
      alert('Produto adicionado ao carrinho!');
    } else {
      alert('Produto já está no carrinho!');
    }
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  navigateToCart(): void {
    this.router.navigate(['/carrinho']);
  }

  clearSearch(): void {
    this.searchService.setSearchQuery('');
  }
}
