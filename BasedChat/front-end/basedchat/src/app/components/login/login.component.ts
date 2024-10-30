import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) {}

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:4200/assets/"+url);
  }

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']); // Redirecionar para a rota raiz
      },
      (err: any) => {
        console.error('Erro ao fazer login', err);
        alert('Falha no login: ' + err.error.message);
      }
    );
  }
  
  
  
}
