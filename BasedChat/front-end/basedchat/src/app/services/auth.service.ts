import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlUser = 'http://localhost:3000/api/users';
  private apiUrlMessage = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}
 //User
  register(data: any) {
    return this.http.post(`${this.apiUrlUser}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrlUser}/login`, data);
  }

  getFriends() {
    return this.http.get(`${this.apiUrlUser}/friends`);
  }

  addFriend(friendUsername: string) {
    return this.http.post(`${this.apiUrlUser}/add-friend`, { friendUsername });
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

 //Message
  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrlMessage}/send`, message);
  }

  getMessages(chatId: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrlMessage}/${chatId}?page=${page}&limit=${limit}`);
  }
}
