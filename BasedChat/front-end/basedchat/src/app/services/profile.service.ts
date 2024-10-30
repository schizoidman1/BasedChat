import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/profile`, profileData);
  }

  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post(`${this.apiUrl}/user/upload-avatar`, formData);
  }

  getFriends(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/friends`);
  }

  addFriend(friendUsername: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/add-friend`, { friendUsername });
  }
}
