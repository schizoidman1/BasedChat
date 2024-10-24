import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário de registro com os novos campos
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10,15}$/)]], // Aceita números de telefone com 10 a 15 dígitos
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator // Validação personalizada para senha e confirmação de senha
    });
  }

  // Validador personalizado para garantir que password e confirmPassword sejam iguais
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Método de registro, chamado ao submeter o formulário
  register() {
    if (this.registerForm.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { fullName, username, email, phone, password } = this.registerForm.value;

    this.authService.register({ fullName, username, email, phone, password }).subscribe(
      res => {
        alert('Registro bem-sucedido! Faça login.');
        this.router.navigate(['/login']);
      },
      err => {
        console.error('Erro ao registrar', err);
        alert('Falha no registro: ' + (err.error.message || 'Erro desconhecido'));
      }
    );
  }
}
