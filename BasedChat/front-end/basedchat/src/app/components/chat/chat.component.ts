import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { FriendDetailComponent } from '../friend-detail/friend-detail.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  messages: any[] = [];
  messageContent: string = '';
  @Input() selectedUserId: string = '';
  selectedFriend: any; // Propriedade adicionada para armazenar os detalhes do amigo
  page: number = 1;
  limit: number = 20;
  editingMessageId: string;
  showFriendDetail: boolean = false;
  chatBackgroundStyle: any;

  constructor(
    private dialog: MatDialog,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit(): void {
    // Iniciar a página e os limites
    this.page = 1;
    this.limit = 20;

    // Carregar as mensagens e detalhes do amigo se um amigo já estiver selecionado no início
    if (this.selectedUserId) {
      this.loadMessages();
      this.loadFriendDetails(); // Carrega os detalhes do amigo
      this.chatBackgroundStyle = this.getSafeUrlBackEnd('uploads/default-background.png');
    }
  }

  // Detecta mudanças na propriedade de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserId'] && changes['selectedUserId'].currentValue) {
      // Sempre que o selectedUserId mudar, reseta as mensagens e carrega novamente
      this.page = 1; // Reseta a página para 1
      this.messages = []; // Limpa as mensagens atuais
      this.loadMessages();
      this.loadFriendDetails(); // Atualiza os detalhes do amigo quando o `selectedUserId` mudar
    }
  }

  // Método para abrir o modal de detalhes do amigo
  openFriendDetail(): void {
    if (!this.selectedUserId) return;

    // Obter informações do amigo usando o AuthService
    this.authService.getFriendDetails(this.selectedUserId).subscribe(
      res => {
        this.selectedFriend = res; // Armazena os dados do amigo para exibir no modal.
        
        // Abre o diálogo apenas quando `selectedFriend` estiver carregado
        const dialogRef = this.dialog.open(FriendDetailComponent, {
          width: '400px',
          data: this.selectedFriend
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Diálogo fechado');
        });
      },
      err => {
        console.error('Erro ao carregar detalhes do amigo', err);
      }
    );
}

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:4200/assets/" + url);
  }

  // Carrega mensagens do usuário selecionado
  loadMessages(): void {
    if (!this.selectedUserId) return;

    this.authService.getMessages(this.selectedUserId, this.page, this.limit).subscribe(
      res => {
        if (this.page === 1) {
          this.messages = res; // Se for a primeira página, substitui as mensagens
        } else {
          this.messages = [...res, ...this.messages]; // Se for um carregamento adicional, adiciona ao topo
        }
      },
      err => {
        console.error('Erro ao carregar mensagens', err);
      }
    );
  }

  // Carrega detalhes do amigo selecionado
  loadFriendDetails(): void {
    if (!this.selectedUserId) return;

    this.authService.getFriendDetails(this.selectedUserId).subscribe(
      res => {
        this.selectedFriend = res;  // Preencher a propriedade `selectedFriend` com os dados do amigo
      },
      err => {
        console.error('Erro ao carregar detalhes do amigo', err);
      }
    );
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

  updateMessage(): void {
    if (this.editingMessageId && this.messageContent.trim()) {
      this.authService.updateMessage(this.editingMessageId, this.messageContent).subscribe(
        res => {
          const index = this.messages.findIndex(msg => msg._id === this.editingMessageId);
          if (index > -1) {
            this.messages[index].content = res.updatedMessage.content;
            this.messages[index].updatedAt = res.updatedMessage.updatedAt;
          }
          this.cancelEditing();
        },
        err => {
          console.error('Erro ao editar mensagem', err);
        }
      );
    }
  }

  startEditing(messageId: string, content: string): void {
    this.editingMessageId = messageId;
    this.messageContent = content;
  }

  deleteMessage(messageId: string): void {
    this.authService.deleteMessage(messageId).subscribe(
      res => {
        console.log('Mensagem deletada com sucesso:', res.message);
        this.messages = this.messages.filter(msg => msg._id !== messageId);
      },
      err => {
        console.error('Erro ao deletar mensagem', err);
      }
    );
  }

  cancelEditing(): void {
    this.editingMessageId = null;
    this.messageContent = '';
  }

  onScrollUp(): void {
    this.page++;
    this.loadMessages();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAvatar(friend: any): SafeUrl {
    return friend.avatar ? this.getSafeUrlBackEnd(friend.avatar) : this.getSafeUrlBackEnd('uploads/default-avatar.png');
  }

  getSafeUrlBackEnd(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/" + url);
  }
}
