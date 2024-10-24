import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
 //User
  // Buscar perfil do usuário
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  // Atualizar perfil do usuário
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, profileData);
  }

  // Alterar senha do usuário
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/change-password`, {
      currentPassword,
      newPassword
    });
  }

  uploadAvatar(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado. Usuário não está autenticado.');
      throw new Error('Token não encontrado.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('avatar', file);
  
    return this.http.post(`${this.apiUrl}/users/upload-avatar`, formData, { headers });
  }
  
  register(data: any) {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }

  getFriends(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado. Usuário não está autenticado.');
      throw new Error('Token não encontrado.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users/friends`, { headers });
  }
  

  addFriend(friendUsername: string) {
    return this.http.post(`${this.apiUrl}/users/add-friend`, { friendUsername });
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

 //Message
  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages/send`, message);
  }

  getMessages(chatId: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${chatId}?page=${page}&limit=${limit}`);
  }

  // Atualizar uma mensagem
  updateMessage(messageId: string, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/messages/${messageId}`, { content });
  }

  deleteMessage(messageId: string): Observable<any> {
    const token = localStorage.getItem('token'); // O token deve estar presente no armazenamento local
    if (!token) {
      console.error('Token não encontrado. O usuário não está autenticado.');
      throw new Error('Token não encontrado. O usuário não está autenticado.');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/messages/${messageId}`, { headers });
  }
  

}
