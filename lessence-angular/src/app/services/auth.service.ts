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
      
      console.log('AuthService inicializado:', { loggedInUser, userName });
      
      if (loggedInUser && userName) {
        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(userName);
        console.log('Usuário já está logado:', userName);
      } else {
        this.isLoggedInSubject.next(false);
        this.userNameSubject.next('');
      }
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('=== INÍCIO DO LOGIN ===');
      console.log('Email recebido:', email);
      console.log('Senha recebida:', password);
      console.log('isPlatformBrowser:', isPlatformBrowser(this.platformId));
      
      // Validação básica
      if (!email || !password) {
        console.log('Erro: Email ou senha vazios');
        reject(new Error('Email e senha são obrigatórios'));
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Erro: Formato de email inválido');
        reject(new Error('Formato de email inválido'));
        return;
      }

      setTimeout(() => {
        try {
          // Usuários de exemplo para demonstração
          const users = [
            { email: 'admin@lessence.com', password: 'admin123', name: 'Administrador' },
            { email: 'user@lessence.com', password: 'user123', name: 'Usuário' },
            { email: 'test@test.com', password: '123456', name: 'Teste' }
          ];

          console.log('Usuários disponíveis:', users);
          
          const user = users.find(u => {
            console.log(`Comparando: ${u.email} === ${email} && ${u.password} === ${password}`);
            return u.email === email && u.password === password;
          });
          
          console.log('Usuário encontrado:', user);
          
          if (user && isPlatformBrowser(this.platformId)) {
            console.log('Login bem-sucedido! Salvando no localStorage...');
            const userName = user.name;
            localStorage.setItem('loggedInUser', email);
            localStorage.setItem('userName', userName);
            this.isLoggedInSubject.next(true);
            this.userNameSubject.next(userName);
            console.log('Estado atualizado com sucesso');
            resolve(true);
          } else {
            console.log('Login falhou - usuário não encontrado ou não é browser');
            resolve(false);
          }
        } catch (error) {
          console.error('Erro no login:', error);
          reject(new Error('Erro interno do servidor'));
        }
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
    
    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentState = this.isLoggedInSubject.value;
    
    // Sincroniza o estado com o localStorage se houver divergência
    if (loggedInUser && !currentState) {
      const userName = localStorage.getItem('userName') || '';
      this.isLoggedInSubject.next(true);
      this.userNameSubject.next(userName);
      return true;
    } else if (!loggedInUser && currentState) {
      this.isLoggedInSubject.next(false);
      this.userNameSubject.next('');
      return false;
    }
    
    return currentState;
  }

  getUserName(): string {
    return this.userNameSubject.value;
  }
} 