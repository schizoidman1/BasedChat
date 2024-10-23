import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getMessages(userId: string) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
}