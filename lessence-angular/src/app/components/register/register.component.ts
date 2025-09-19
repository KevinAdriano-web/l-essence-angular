import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onRegister() {
    // Validações básicas
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password || !this.registerData.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Por favor, insira um email válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const success = await this.authService.register(this.registerData);
      if (success) {
        this.successMessage = 'Conta criada com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
    } catch (error) {
      this.errorMessage = 'Erro ao criar conta. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
