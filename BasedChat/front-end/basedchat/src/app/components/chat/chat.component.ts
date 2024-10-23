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
    // Inicialmente, nenhuma conversa está selecionada
  }

  loadMessages() {
    if (this.selectedUserId) {
      this.chatService.getMessages(this.selectedUserId).subscribe(
        (messages: any) => {
          this.messages = messages;
        },
        err => {
          console.error('Erro ao carregar mensagens', err);
        }
      );
    }
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      this.chatService.sendMessage({
        receiverId: this.selectedUserId,
        content: this.messageContent
      }).subscribe(
        () => {
          this.messageContent = '';
          this.loadMessages();
        },
        err => {
          console.error('Erro ao enviar mensagem', err);
        }
      );
    }
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
