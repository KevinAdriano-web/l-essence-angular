import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Verifica se já está logado
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    }
  }

  async onLogin() {
    console.log('=== DADOS DO FORMULÁRIO ===');
    console.log('Email digitado:', this.loginData.email);
    console.log('Senha digitada:', this.loginData.password);
    console.log('Email length:', this.loginData.email?.length);
    console.log('Password length:', this.loginData.password?.length);
    
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      console.log('Erro: Campos vazios');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Por favor, insira um email válido';
      console.log('Erro: Email inválido');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      console.log('Tentando fazer login com:', this.loginData.email);
      const success = await this.authService.login(this.loginData.email, this.loginData.password);
      console.log('Resultado do login:', success);
      
      if (success) {
        this.successMessage = 'Login realizado com sucesso!';
        console.log('Login bem-sucedido, redirecionando...');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } else {
        this.errorMessage = 'Email ou senha incorretos';
        console.log('Login falhou');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  // Função para testar os dados capturados
  testData() {
    console.log('=== TESTE DE DADOS ===');
    console.log('loginData:', this.loginData);
    console.log('Email:', this.loginData.email);
    console.log('Password:', this.loginData.password);
  }
}
