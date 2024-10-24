import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  messages: any[] = [];
  messageContent: string = '';
  @Input() selectedUserId: string = '';
  page: number = 1;
  limit: number = 20;
  editingMessageId: string;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Iniciar a página e os limites
    this.page = 1;
    this.limit = 20;

    // Carregar as mensagens se um amigo já estiver selecionado no início
    if (this.selectedUserId) {
      this.loadMessages();
    }
  }

  // Detecta mudanças na propriedade de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserId'] && changes['selectedUserId'].currentValue) {
      // Sempre que o selectedUserId mudar, reseta as mensagens e carrega novamente
      this.page = 1; // Reseta a página para 1
      this.messages = []; // Limpa as mensagens atuais
      this.loadMessages();
    }
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
        // Encontrar a mensagem original pelo seu ID
        const index = this.messages.findIndex(msg => msg._id === this.editingMessageId);
        if (index > -1) {
          // Atualizar o conteúdo da mensagem na lista
          this.messages[index].content = res.updatedMessage.content;
          this.messages[index].updatedAt = res.updatedMessage.updatedAt; // Atualize outros campos relevantes, se houver
        }
        this.cancelEditing(); // Limpar o campo de edição e resetar o estado de edição
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
        // Atualiza o array de mensagens removendo a mensagem deletada
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
    // Método chamado quando o usuário rola para o topo do chat
    this.page++;
    this.loadMessages();
  }

  onFriendSelected(friendId: string) {
    this.selectedUserId = friendId;
    this.page = 1; // Reseta a página ao selecionar um novo amigo
    this.messages = []; // Limpa mensagens para recarregar a partir do zero
    this.loadMessages();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
