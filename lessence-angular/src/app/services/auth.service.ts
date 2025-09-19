import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>('');
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const userName = localStorage.getItem('userName');
      if (loggedInUser) {
        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(userName || '');
      }
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Usuários de exemplo para demonstração
        const users = [
          { email: 'admin@lessence.com', password: 'admin123', name: 'Administrador' },
          { email: 'user@lessence.com', password: 'user123', name: 'Usuário' },
          { email: 'test@test.com', password: '123456', name: 'Teste' }
        ];

        const user = users.find(u => u.email === email && u.password === password);
        const success = !!user;
        
        if (success && isPlatformBrowser(this.platformId)) {
          const userName = user!.name;
          localStorage.setItem('loggedInUser', email);
          localStorage.setItem('userName', userName);
          this.isLoggedInSubject.next(true);
          this.userNameSubject.next(userName);
        }
        resolve(success);
      }, 1000);
    });
  }

  register(userData: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = true; // Simula registro bem-sucedido
        resolve(success);
      }, 1000);
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('userName');
    }
    this.isLoggedInSubject.next(false);
    this.userNameSubject.next('');
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.isLoggedInSubject.value;
  }

  getUserName(): string {
    return this.userNameSubject.value;
  }
} 