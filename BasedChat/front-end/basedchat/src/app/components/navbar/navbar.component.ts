import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  currentRoute: string = '';

  constructor(
    public authService: AuthService, 
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obter a rota atual sempre que a navegação mudar
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  // Navegar para um caminho específico
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:4200/assets/"+url+".png");
  }
}
