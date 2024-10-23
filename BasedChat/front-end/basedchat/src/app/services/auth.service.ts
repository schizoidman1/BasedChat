import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getFriends() {
    return this.http.get(`${this.apiUrl}/friends`);
  }

  addFriend(username: string) {
    return this.http.post(`${this.apiUrl}/add-friend`, { username });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  logout() {
    localStorage.removeItem('token');
  }
}
