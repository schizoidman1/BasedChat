import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  messageContent: string = '';
  selectedUserId: string = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.selectedUserId) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    this.authService.getMessages(this.selectedUserId, this.page, this.limit)
      .subscribe((messages) => {
        // As novas mensagens são adicionadas ao topo
        this.messages = [...messages, ...this.messages];
      });
  }

  sendMessage(): void {
    if (this.messageContent.trim()) {
      const newMessage = {
        chatId: this.selectedUserId,
        content: this.messageContent,
        type: 'text' // Por enquanto, suportamos apenas texto
      };

      this.authService.sendMessage(newMessage).subscribe((message) => {
        this.messages.push(message);
        this.messageContent = '';
      });
    }
  }

  onScrollUp(): void {
    // Método chamado quando o usuário rola para o topo do chat
    this.page++;
    this.loadMessages();
  }

  onFriendSelected(friendId: string) {
    this.selectedUserId = friendId;
    this.loadMessages();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
