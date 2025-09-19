import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategorySubject = new BehaviorSubject<string>('Todos');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  readonly categories = ['Todos', 'Masculino', 'Feminino', 'Cítrico', 'Floral', 'Amadeirado', 'Doce'];

  constructor() { }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  getCurrentCategory(): string {
    return this.selectedCategorySubject.value;
  }

  getCategories() {
    return this.categories;
  }
} 