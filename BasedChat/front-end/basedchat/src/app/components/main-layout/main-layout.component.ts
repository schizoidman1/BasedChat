import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  selectedUserId: string = '';

  // Atualiza o usuário selecionado quando a lista de amigos emite o evento
  onFriendSelected(friendId: string) {
    this.selectedUserId = friendId;
  }
}
