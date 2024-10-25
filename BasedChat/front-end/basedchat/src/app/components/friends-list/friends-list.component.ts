import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
})
export class FriendsListComponent implements OnInit {
  friends: any[] = [];
  newFriendUsername: string = '';

  @Output() selectFriendEvent = new EventEmitter<string>();

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends() {
    this.authService.getFriends().subscribe(
      (friends: any) => {
        console.log('Amigos carregados:', friends);
        this.friends = friends;
      },
      (err: any) => {
        console.error('Erro ao obter amigos', err);
        alert('Erro ao obter amigos: ' + err.error.message);
      }
    );
  }
  
  
  addFriend() {
    if (this.newFriendUsername.trim()) {
      this.authService.addFriend(this.newFriendUsername).subscribe(
        (res: any) => {
          alert('Amigo adicionado com sucesso!');
          this.newFriendUsername = '';
          this.loadFriends();
        },
        (err: any) => {
          console.error('Erro ao adicionar amigo', err);
          alert('Erro ao adicionar amigo: ' + err.error.message);
        }
      );
    }
  }

  selectFriend(friendId: string) {
    this.selectFriendEvent.emit(friendId);
  }

  getAvatar(friend: any): SafeUrl {
    return friend.avatar ? this.getSafeUrl(friend.avatar) : this.getSafeUrl('uploads/default-user.png');
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/"+url);
  }
}
