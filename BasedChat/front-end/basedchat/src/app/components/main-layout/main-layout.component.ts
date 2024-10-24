import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  selectedUserId: string = '';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  onFriendSelected(friendId: string): void {
    this.selectedUserId = friendId;
  }
}
