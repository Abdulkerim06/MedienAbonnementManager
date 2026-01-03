import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/movies/users';

  constructor(private http: HttpClient) {}

  // Alle User laden
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Registrieren
  registerUser(name: string, email?: string, password?: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, { name, email, password });
  }

  // "Login" = User anhand von Name/Passwort finden (Backend muss das noch prüfen!)
  loginUser(name: string, password?: string): Observable<User[]> {
    // hier hole ich erstmal alle User und filtere
    return this.http.get<User[]>(this.apiUrl);
  }
}
