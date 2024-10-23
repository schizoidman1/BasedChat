import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register({ username: this.username, password: this.password }).subscribe(
      res => {
        alert('Registro bem-sucedido! Faça login.');
        this.router.navigate(['/login']);
      },
      (err: any) => {
        console.error('Erro ao registrar', err);
        alert('Falha no registro: ' + err.error.message);
      }
    );
  }
}
