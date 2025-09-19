import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="products">
      <h2>Produtos</h2>
      
      <!-- Barra de busca -->
      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar produtos</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Digite o nome do produto...">
        </mat-form-field>
      </div>

      <!-- Filtros de categoria -->
      <div class="category-filters">
        <button 
          *ngFor="let category of categories" 
          mat-button 
          [class.active]="selectedCategory === category"
          (click)="selectCategory(category)"
          class="category-btn">
          {{ category }}
        </button>
      </div>

      <!-- Lista de produtos -->
      <div class="products-grid" *ngIf="filteredProducts.length > 0; else noProducts">
        <mat-card *ngFor="let product of filteredProducts" class="product-card">
          <img [src]="product.image" [alt]="product.name" class="product-image">
          <mat-card-content>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="categories">
              <span *ngFor="let category of product.categories" class="category-tag">
                {{ category }}
              </span>
            </div>
            <div class="price">{{ formatPrice(product.price) }}</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="addToCart(product)">
              Adicionar ao Carrinho
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noProducts>
        <div class="no-products">
          <p>Nenhum produto encontrado.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .products {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-container {
      margin-bottom: 20px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 30px;
    }

    .category-btn {
      border-radius: 20px;
      text-transform: capitalize;
    }

    .category-btn.active {
      background-color: var(--primary-color);
      color: white;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .product-card {
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .categories {
      margin: 10px 0;
    }

    .category-tag {
      display: inline-block;
      background-color: #e0e0e0;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 12px;
      font-size: 0.8em;
      text-transform: capitalize;
    }

    .price {
      font-size: 1.2em;
      font-weight: bold;
      color: var(--primary-color);
      margin: 10px 0;
    }

    .no-products {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'Todos';
  categories: string[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.categories = this.categoryService.getCategories();
    this.loadProducts();

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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProducts(): void {
    this.subscriptions.push(
      this.productService.getProducts().subscribe(products => {
        this.products = products;
        this.updateProductList();
      })
    );
  }

  updateProductList(): void {
    if (!this.products.length) {
      this.filteredProducts = [];
      return;
    }

    let productsToFilter = this.filterBySearch(this.products);

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

  onSearch(): void {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categoryService.setSelectedCategory(category);
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
} 